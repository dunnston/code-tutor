mod commands;
mod db;
mod puzzle_commands;

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

      // Initialize the database
      db::initialize_database(&app.handle())
        .map_err(|e| {
          log::error!("Failed to initialize database: {}", e);
          e
        })?;

      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
      commands::execute_python,
      commands::execute_code,
      commands::check_language_runtime,
      commands::call_claude_api,
      commands::check_ollama_available,
      // Puzzle commands
      puzzle_commands::get_puzzle_categories,
      puzzle_commands::get_puzzles_by_category,
      puzzle_commands::get_puzzle,
      puzzle_commands::get_puzzle_implementation,
      puzzle_commands::has_puzzle_implementation,
      // Puzzle progress commands
      puzzle_commands::get_puzzle_progress,
      puzzle_commands::record_puzzle_attempt,
      puzzle_commands::record_hint_used,
      puzzle_commands::mark_puzzle_solved,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
