mod commands;
mod db;
mod puzzle_commands;
mod playground_commands;
mod gamification_commands;
mod rpg_commands;
mod dungeon_commands;
mod combat_commands;
mod narrative_commands;
mod shop_commands;
mod dev_commands;
mod achievement_commands;

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
      rpg_commands::get_character_equipment_with_details,
      rpg_commands::equip_item,
      rpg_commands::unequip_item,
      // RPG - Ability commands
      rpg_commands::get_user_abilities,
      rpg_commands::unlock_ability,
      rpg_commands::check_ability_unlocks,
      rpg_commands::get_user_abilities_with_levels,
      rpg_commands::spend_stat_point_on_ability,
      rpg_commands::get_all_abilities_with_status,
      rpg_commands::set_active_ability,
      rpg_commands::remove_active_ability,
      // RPG - Character Sheet commands
      rpg_commands::get_equipment_inventory,
      rpg_commands::equip_item_to_slot,
      rpg_commands::unequip_item_from_slot,
      rpg_commands::spend_stat_point_on_health,
      rpg_commands::spend_stat_point_on_mana,
      rpg_commands::spend_stat_point_on_stat,
      // Dungeon - Floor commands
      dungeon_commands::get_dungeon_floor,
      dungeon_commands::get_available_floors,
      // Dungeon - Progress commands
      dungeon_commands::get_user_dungeon_progress,
      dungeon_commands::update_dungeon_floor,
      // Dungeon - Enemy commands
      dungeon_commands::get_random_enemy_for_floor,
      dungeon_commands::get_boss_for_floor,
      dungeon_commands::get_enemy_by_id,
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
      // Narrative dungeon commands
      narrative_commands::roll_d20,
      narrative_commands::get_user_narrative_progress,
      narrative_commands::get_narrative_location,
      narrative_commands::get_location_choices,
      narrative_commands::start_narrative_dungeon,
      narrative_commands::resolve_skill_check,
      narrative_commands::apply_narrative_outcome,
      narrative_commands::make_simple_choice,
      narrative_commands::get_outcome_by_type,
      // Shop commands
      shop_commands::get_rpg_shop_items,
      shop_commands::purchase_shop_item,
      shop_commands::sell_equipment_item,
      shop_commands::get_consumable_inventory,
      shop_commands::use_consumable,
      shop_commands::set_town_state,
      shop_commands::get_town_state,
      shop_commands::get_shop_refresh_state,
      shop_commands::force_shop_refresh,
      // Developer commands
      dev_commands::dev_add_gold,
      dev_commands::dev_add_gems,
      dev_commands::dev_add_skill_points,
      dev_commands::dev_add_levels,
      dev_commands::dev_add_xp,
      dev_commands::dev_add_charisma,
      dev_commands::dev_generate_loot,
      dev_commands::dev_reset_character,
      // Achievement commands
      achievement_commands::get_achievements,
      achievement_commands::get_achievement_stats,
      achievement_commands::update_achievement_progress,
      achievement_commands::get_pending_achievement_notifications,
      achievement_commands::mark_achievement_notification_shown,
      achievement_commands::claim_achievement_rewards,
      achievement_commands::mark_achievements_as_viewed,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
