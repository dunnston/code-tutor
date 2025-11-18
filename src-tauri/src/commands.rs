use serde::{Deserialize, Serialize};
use std::process::{Command, Stdio};
use std::time::{Duration, Instant};
use tokio::time::timeout;

#[derive(Debug, Serialize, Deserialize)]
pub struct ExecutionResult {
    pub stdout: String,
    pub stderr: String,
    pub exit_code: i32,
    pub execution_time_ms: u64,
}

#[tauri::command]
pub async fn execute_python(code: String, timeout_ms: Option<u64>) -> Result<ExecutionResult, String> {
    let start = Instant::now();
    let timeout_duration = Duration::from_millis(timeout_ms.unwrap_or(5000)); // Default 5 seconds

    // Execute Python code with timeout
    let output_future = tokio::task::spawn_blocking(move || {
        Command::new("python")
            .arg("-c")
            .arg(&code)
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .output()
    });

    let output_result = timeout(timeout_duration, output_future)
        .await
        .map_err(|_| "Execution timed out. Your code took too long to run (max 5 seconds).".to_string())?
        .map_err(|e| format!("Failed to spawn execution task: {}", e))?
        .map_err(|e| format!("Failed to execute Python: {}. Is Python installed?", e))?;

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
