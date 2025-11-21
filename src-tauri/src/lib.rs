mod commands;
mod db;
mod puzzle_commands;
mod playground_commands;
mod gamification_commands;
mod rpg_commands;
mod dungeon_commands;
mod combat_commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_shell::init())
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
      commands::check_runtime_path,
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
      // RPG - Character commands
      rpg_commands::get_character_stats,
      rpg_commands::update_character_health,
      rpg_commands::update_character_mana,
      rpg_commands::distribute_stat_points,
      rpg_commands::recalculate_derived_stats,
      rpg_commands::restore_health_and_mana,
      // RPG - Equipment commands
      rpg_commands::get_equipment_items,
      rpg_commands::get_character_equipment,
      rpg_commands::equip_item,
      rpg_commands::unequip_item,
      // RPG - Ability commands
      rpg_commands::get_user_abilities,
      rpg_commands::unlock_ability,
      rpg_commands::check_ability_unlocks,
      // Dungeon - Floor commands
      dungeon_commands::get_dungeon_floor,
      dungeon_commands::get_available_floors,
      // Dungeon - Progress commands
      dungeon_commands::get_user_dungeon_progress,
      dungeon_commands::update_dungeon_floor,
      // Dungeon - Enemy commands
      dungeon_commands::get_random_enemy_for_floor,
      dungeon_commands::get_boss_for_floor,
      // Dungeon - Encounter commands
      dungeon_commands::get_random_encounter,
      // Dungeon - Challenge commands
      dungeon_commands::get_challenge_for_action,
      dungeon_commands::record_challenge_attempt,
      // Combat commands
      combat_commands::start_combat,
      combat_commands::start_boss_combat,
      combat_commands::calculate_player_damage,
      combat_commands::calculate_enemy_damage,
      combat_commands::execute_combat_turn,
      combat_commands::end_combat_victory,
      combat_commands::end_combat_defeat,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
