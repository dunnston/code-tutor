mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
      commands::execute_python,
      commands::execute_code,
      commands::check_language_runtime,
      commands::call_claude_api,
      commands::check_ollama_available,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
