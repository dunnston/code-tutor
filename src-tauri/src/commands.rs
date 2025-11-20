use serde::{Deserialize, Serialize};
use std::fs;
use std::process::{Command, Stdio};
use std::time::{Duration, Instant, SystemTime, UNIX_EPOCH};
use tokio::time::timeout;
use reqwest::Client;

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExecutionResult {
    pub stdout: String,
    pub stderr: String,
    pub exit_code: i32,
    pub execution_time_ms: u64,
}

#[derive(Debug, Deserialize)]
pub struct LanguageExecutionRequest {
    pub language: String,
    pub code: String,
    pub timeout_ms: Option<u64>,
}

/// Language configuration for code execution
#[derive(Clone)]
struct LanguageConfig {
    command: Vec<String>,
    fallback_command: Option<Vec<String>>,
    execution_mode: ExecutionMode,
    extension: String,
}

#[derive(Debug, Clone)]
enum ExecutionMode {
    Inline,  // Execute code directly via command line argument (e.g., python -c "code")
    File,    // Write code to temp file and execute it
}

impl LanguageConfig {
    fn get_config(language: &str) -> Result<Self, String> {
        match language.to_lowercase().as_str() {
            "python" => Ok(LanguageConfig {
                command: vec!["python".to_string(), "-c".to_string()],
                fallback_command: Some(vec!["python3".to_string(), "-c".to_string()]),
                execution_mode: ExecutionMode::Inline,
                extension: ".py".to_string(),
            }),
            "javascript" => Ok(LanguageConfig {
                command: vec!["node".to_string(), "-e".to_string()],
                fallback_command: None,
                execution_mode: ExecutionMode::Inline,
                extension: ".js".to_string(),
            }),
            "gdscript" => Ok(LanguageConfig {
                command: vec!["godot".to_string(), "--headless".to_string(), "--script".to_string()],
                fallback_command: None,
                execution_mode: ExecutionMode::File,
                extension: ".gd".to_string(),
            }),
            "csharp" => Ok(LanguageConfig {
                command: vec!["dotnet".to_string(), "script".to_string()],
                fallback_command: None,
                execution_mode: ExecutionMode::File,
                extension: ".csx".to_string(),
            }),
            "ruby" => Ok(LanguageConfig {
                command: vec!["ruby".to_string(), "-e".to_string()],
                fallback_command: None,
                execution_mode: ExecutionMode::Inline,
                extension: ".rb".to_string(),
            }),
            "bash" => Ok(LanguageConfig {
                command: vec!["bash".to_string(), "-c".to_string()],
                fallback_command: Some(vec!["sh".to_string(), "-c".to_string()]),
                execution_mode: ExecutionMode::Inline,
                extension: ".sh".to_string(),
            }),
            _ => Err(format!("Unsupported language: {}", language)),
        }
    }
}

/// Execute code in the specified language
async fn execute_with_config(
    config: LanguageConfig,
    code: String,
    stdin_input: Option<String>,
    timeout_duration: Duration,
) -> Result<ExecutionResult, String> {
    let start = Instant::now();

    let output_future = match config.execution_mode {
        ExecutionMode::Inline => {
            // Execute inline (code passed as command argument)
            let command_parts = config.command.clone();
            tokio::task::spawn_blocking(move || {
                let mut cmd = Command::new(&command_parts[0]);
                for arg in &command_parts[1..] {
                    cmd.arg(arg);
                }

                // Ensure all environment variables are inherited
                cmd.envs(std::env::vars());

                let mut child = cmd.arg(&code)
                    .stdin(Stdio::piped())
                    .stdout(Stdio::piped())
                    .stderr(Stdio::piped())
                    .spawn()?;

                // Write stdin if provided
                if let Some(input) = stdin_input {
                    use std::io::Write;
                    if let Some(mut stdin) = child.stdin.take() {
                        let _ = stdin.write_all(input.as_bytes());
                    }
                }

                child.wait_with_output()
            })
        }
        ExecutionMode::File => {
            // Write code to temp file and execute
            let timestamp = SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_millis();
            let temp_file = std::env::temp_dir()
                .join(format!("code_tutor_temp_{}{}", timestamp, config.extension));

            fs::write(&temp_file, &code)
                .map_err(|e| format!("Failed to write temp file: {}", e))?;

            let command_parts = config.command.clone();
            let temp_file_clone = temp_file.clone();

            let result = tokio::task::spawn_blocking(move || {
                let mut cmd = Command::new(&command_parts[0]);
                for arg in &command_parts[1..] {
                    cmd.arg(arg);
                }

                // Ensure all environment variables are inherited
                cmd.envs(std::env::vars());

                let mut child = cmd.arg(&temp_file_clone)
                    .stdin(Stdio::piped())
                    .stdout(Stdio::piped())
                    .stderr(Stdio::piped())
                    .spawn()?;

                // Write stdin if provided
                if let Some(input) = stdin_input {
                    use std::io::Write;
                    if let Some(mut stdin) = child.stdin.take() {
                        let _ = stdin.write_all(input.as_bytes());
                    }
                }

                child.wait_with_output()
            });

            // Clean up temp file after execution (best effort)
            let temp_file_for_cleanup = temp_file.clone();
            tokio::spawn(async move {
                tokio::time::sleep(Duration::from_secs(1)).await;
                let _ = fs::remove_file(temp_file_for_cleanup);
            });

            result
        }
    };

    let output_result = timeout(timeout_duration, output_future)
        .await
        .map_err(|_| format!("Execution timed out. Your code took too long to run (max {} seconds).", timeout_duration.as_secs()))?
        .map_err(|e| format!("Failed to spawn execution task: {}", e))?
        .map_err(|e| format!("Failed to execute code: {}. Is the runtime installed?", e))?;

    let execution_time_ms = start.elapsed().as_millis() as u64;

    let stdout = String::from_utf8_lossy(&output_result.stdout).to_string();
    let stderr = String::from_utf8_lossy(&output_result.stderr).to_string();
    let exit_code = output_result.status.code().unwrap_or(-1);

    Ok(ExecutionResult {
        stdout,
        stderr,
        exit_code,
        execution_time_ms,
    })
}

/// Generic code execution command for multiple languages
#[tauri::command]
pub async fn execute_code(
    language: String,
    code: String,
    timeout_ms: Option<u64>,
    stdin: Option<String>,
) -> Result<ExecutionResult, String> {
    let timeout_duration = Duration::from_millis(timeout_ms.unwrap_or(5000));
    let config = LanguageConfig::get_config(&language)?;

    // Try primary command
    let result = execute_with_config(config.clone(), code.clone(), stdin.clone(), timeout_duration).await;

    // If primary fails and fallback exists, try fallback
    if result.is_err() && config.fallback_command.is_some() {
        let fallback_config = LanguageConfig {
            command: config.fallback_command.unwrap(),
            fallback_command: None,
            execution_mode: config.execution_mode.clone(),
            extension: config.extension.clone(),
        };
        return execute_with_config(fallback_config, code, stdin, timeout_duration).await;
    }

    result
}

/// Check if a language runtime is available
#[tauri::command]
pub async fn check_language_runtime(language: String) -> Result<bool, String> {
    let _config = LanguageConfig::get_config(&language)?;

    let check_command = match language.to_lowercase().as_str() {
        "python" => vec!["python", "--version"],
        "javascript" => vec!["node", "--version"],
        "gdscript" => vec!["godot", "--version"],
        "csharp" => vec!["dotnet", "--version"],
        "ruby" => vec!["ruby", "--version"],
        "bash" => vec!["bash", "--version"],
        _ => return Err(format!("Unknown language: {}", language)),
    };

    let output = tokio::task::spawn_blocking(move || {
        let mut cmd = Command::new(check_command[0]);
        cmd.args(&check_command[1..])
            .stdout(Stdio::piped())
            .stderr(Stdio::piped());

        // Ensure all environment variables are inherited
        cmd.envs(std::env::vars());

        cmd.output()
    })
    .await
    .map_err(|e| format!("Failed to check runtime: {}", e))?
    .map_err(|e| format!("Failed to execute check: {}", e))?;

    Ok(output.status.success())
}

/// Legacy Python execution command (kept for backward compatibility)
#[tauri::command]
pub async fn execute_python(code: String, timeout_ms: Option<u64>) -> Result<ExecutionResult, String> {
    execute_code("python".to_string(), code, timeout_ms, None).await
}

// Claude API types
#[derive(Debug, Serialize, Deserialize)]
pub struct ClaudeMessage {
    pub role: String,
    pub content: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ClaudeRequest {
    pub model: String,
    pub max_tokens: u32,
    pub system: String,
    pub messages: Vec<ClaudeMessage>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ClaudeContent {
    pub text: String,
    #[serde(rename = "type")]
    pub content_type: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ClaudeResponse {
    pub content: Vec<ClaudeContent>,
}

/// Proxy Claude API requests through Tauri backend to avoid CORS
#[tauri::command]
pub async fn call_claude_api(
    api_key: String,
    model: String,
    system_prompt: String,
    messages: Vec<ClaudeMessage>,
) -> Result<String, String> {
    let client = Client::new();

    let request_body = ClaudeRequest {
        model,
        max_tokens: 2048,
        system: system_prompt,
        messages,
    };

    let response = client
        .post("https://api.anthropic.com/v1/messages")
        .header("x-api-key", api_key)
        .header("anthropic-version", "2023-06-01")
        .header("content-type", "application/json")
        .json(&request_body)
        .send()
        .await
        .map_err(|e| format!("Failed to send request: {}", e))?;

    if !response.status().is_success() {
        let error_text = response.text().await.unwrap_or_else(|_| "Unknown error".to_string());
        return Err(format!("Claude API error: {}", error_text));
    }

    let claude_response: ClaudeResponse = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;

    // Extract the text from the first content block
    let text = claude_response
        .content
        .first()
        .map(|c| c.text.clone())
        .unwrap_or_else(|| "No response from Claude".to_string());

    Ok(text)
}

/// Check if Ollama is available
#[tauri::command]
pub async fn check_ollama_available() -> Result<bool, String> {
    let client = Client::new();

    match client
        .get("http://localhost:11434/api/tags")
        .timeout(Duration::from_secs(2))
        .send()
        .await
    {
        Ok(response) => Ok(response.status().is_success()),
        Err(_) => Ok(false),
    }
}
