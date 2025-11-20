mod commands;
mod db;
mod puzzle_commands;
mod playground_commands;
mod gamification_commands;

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
      puzzle_commands::record_solution_viewed,
      puzzle_commands::mark_puzzle_solved,
      // Playground commands
      playground_commands::get_playground_projects,
      playground_commands::get_playground_project,
      playground_commands::create_playground_project,
      playground_commands::update_playground_project,
      playground_commands::delete_playground_project,
      playground_commands::update_project_last_run,
      playground_commands::get_playground_templates,
      playground_commands::get_playground_template,
      playground_commands::get_playground_snippets,
      playground_commands::create_playground_snippet,
      playground_commands::increment_snippet_use_count,
      playground_commands::get_playground_session,
      playground_commands::save_playground_session,
      playground_commands::fork_playground_project,
      // Gamification - User commands
      gamification_commands::get_or_create_user,
      // Gamification - Currency commands
      gamification_commands::get_user_currency,
      gamification_commands::add_currency,
      gamification_commands::spend_currency,
      // Gamification - Shop commands
      gamification_commands::get_shop_items,
      gamification_commands::purchase_item,
      // Gamification - Inventory commands
      gamification_commands::get_user_inventory,
      gamification_commands::use_inventory_item,
      // Gamification - Quest commands
      gamification_commands::get_quests,
      gamification_commands::get_user_quest_progress,
      gamification_commands::update_quest_progress,
      // Gamification - Effect commands
      gamification_commands::get_active_effects,
      // Gamification - Level rewards
      gamification_commands::get_level_rewards,
      gamification_commands::claim_level_rewards,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
