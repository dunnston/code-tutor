use serde::{Deserialize, Serialize};
use std::process::{Command, Stdio};
use std::time::Instant;

#[derive(Debug, Serialize, Deserialize)]
pub struct ExecutionResult {
    pub stdout: String,
    pub stderr: String,
    pub exit_code: i32,
    pub execution_time_ms: u64,
}

#[tauri::command]
pub async fn execute_python(code: String) -> Result<ExecutionResult, String> {
    let start = Instant::now();

    // Execute Python code with timeout
    let output = Command::new("python")
        .arg("-c")
        .arg(&code)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .output()
        .map_err(|e| format!("Failed to execute Python: {}. Is Python installed?", e))?;

    let execution_time_ms = start.elapsed().as_millis() as u64;

    let stdout = String::from_utf8_lossy(&output.stdout).to_string();
    let stderr = String::from_utf8_lossy(&output.stderr).to_string();
    let exit_code = output.status.code().unwrap_or(-1);

    Ok(ExecutionResult {
        stdout,
        stderr,
        exit_code,
        execution_time_ms,
    })
}
