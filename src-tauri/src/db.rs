use rusqlite::{Connection, Result};
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

/// Get the database file path
fn get_db_path(app: &AppHandle) -> Result<PathBuf, String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {}", e))?;

    // Create the directory if it doesn't exist
    std::fs::create_dir_all(&app_data_dir)
        .map_err(|e| format!("Failed to create app data directory: {}", e))?;

    Ok(app_data_dir.join("code-tutor.db"))
}

/// Initialize the database with schema and seed data
pub fn initialize_database(app: &AppHandle) -> Result<(), String> {
    let db_path = get_db_path(app)?;
    let conn = Connection::open(&db_path)
        .map_err(|e| format!("Failed to open database: {}", e))?;

    // Enable foreign key constraints
    conn.execute("PRAGMA foreign_keys = ON", [])
        .map_err(|e| format!("Failed to enable foreign keys: {}", e))?;

    // Execute languages migration first (required by other tables)
    let languages_migration = include_str!("../migrations/001_languages.sql");
    conn.execute_batch(languages_migration)
        .map_err(|e| format!("Failed to execute languages migration: {}", e))?;

    // Execute puzzle schema
    let schema_sql = include_str!("../../course-framework-output/database/puzzles-schema.sql");
    conn.execute_batch(schema_sql)
        .map_err(|e| format!("Failed to execute puzzle schema: {}", e))?;

    // Execute puzzle seed data
    let seed_sql = include_str!("../../course-framework-output/database/puzzles-seed.sql");
    conn.execute_batch(seed_sql)
        .map_err(|e| format!("Failed to execute puzzle seed data: {}", e))?;

    // Execute playground migration
    let playground_migration = include_str!("../migrations/006_playground.sql");
    conn.execute_batch(playground_migration)
        .map_err(|e| format!("Failed to execute playground migration: {}", e))?;

    // Execute playground seed data
    let playground_seed = include_str!("../../course-framework-output/database/playground-seed.sql");
    conn.execute_batch(playground_seed)
        .map_err(|e| format!("Failed to execute playground seed data: {}", e))?;

    // Execute gamification migration
    let gamification_migration = include_str!("../migrations/007_gamification.sql");
    conn.execute_batch(gamification_migration)
        .map_err(|e| format!("Failed to execute gamification migration: {}", e))?;

    // Execute gamification seed data
    let gamification_seed = include_str!("../../course-framework-output/database/gamification-seed.sql");
    conn.execute_batch(gamification_seed)
        .map_err(|e| format!("Failed to execute gamification seed data: {}", e))?;

    // Execute quest updates migration
    let quest_updates_migration = include_str!("../migrations/008_update_quests.sql");
    conn.execute_batch(quest_updates_migration)
        .map_err(|e| format!("Failed to execute quest updates migration: {}", e))?;

    // Execute RPG character system migration
    let rpg_character_migration = include_str!("../migrations/009_rpg_character_system.sql");
    conn.execute_batch(rpg_character_migration)
        .map_err(|e| format!("Failed to execute RPG character system migration: {}", e))?;

    // Execute RPG dungeon world migration
    let rpg_dungeon_migration = include_str!("../migrations/010_rpg_dungeon_world.sql");
    conn.execute_batch(rpg_dungeon_migration)
        .map_err(|e| format!("Failed to execute RPG dungeon world migration: {}", e))?;

    // Execute RPG progress and combat migration
    let rpg_progress_migration = include_str!("../migrations/011_rpg_progress_combat.sql");
    conn.execute_batch(rpg_progress_migration)
        .map_err(|e| format!("Failed to execute RPG progress and combat migration: {}", e))?;

    // Execute RPG achievements migration
    let rpg_achievements_migration = include_str!("../migrations/012_rpg_achievements.sql");
    conn.execute_batch(rpg_achievements_migration)
        .map_err(|e| format!("Failed to execute RPG achievements migration: {}", e))?;

    // Execute multiple choice challenges migration
    let multiple_choice_migration = include_str!("../migrations/013_convert_challenges_to_multiple_choice.sql");
    conn.execute_batch(multiple_choice_migration)
        .map_err(|e| format!("Failed to execute multiple choice migration: {}", e))?;

    // Add multiple choice columns (safe to run multiple times - ignores errors if columns exist)
    let _ = conn.execute("ALTER TABLE dungeon_challenges ADD COLUMN choices TEXT", []);
    let _ = conn.execute("ALTER TABLE dungeon_challenges ADD COLUMN correct_answer TEXT", []);

    // Execute narrative dungeon system migration
    let narrative_migration = include_str!("../migrations/014_narrative_dungeon_system.sql");
    conn.execute_batch(narrative_migration)
        .map_err(|e| format!("Failed to execute narrative dungeon migration: {}", e))?;

    // Execute expanded equipment system migration (main tables)
    let equipment_expansion = include_str!("../migrations/015_expand_equipment_system.sql");
    conn.execute_batch(equipment_expansion)
        .map_err(|e| format!("Failed to execute equipment expansion migration: {}", e))?;

    // Add new equipment columns (safe to run multiple times - ignores errors if columns exist)
    let _ = conn.execute("ALTER TABLE character_equipment ADD COLUMN shield_id TEXT REFERENCES equipment_items(id)", []);
    let _ = conn.execute("ALTER TABLE character_equipment ADD COLUMN helmet_id TEXT REFERENCES equipment_items(id)", []);
    let _ = conn.execute("ALTER TABLE character_equipment ADD COLUMN chest_id TEXT REFERENCES equipment_items(id)", []);
    let _ = conn.execute("ALTER TABLE character_equipment ADD COLUMN boots_id TEXT REFERENCES equipment_items(id)", []);
    let _ = conn.execute("ALTER TABLE user_abilities ADD COLUMN ability_level INTEGER DEFAULT 1", []);

    // Execute equipment slot fix migration
    let equipment_slot_fix = include_str!("../migrations/016_fix_equipment_slots.sql");
    conn.execute_batch(equipment_slot_fix)
        .map_err(|e| format!("Failed to execute equipment slot fix migration: {}", e))?;

    // Add charisma column (safe to run multiple times - ignores errors if column exists)
    let _ = conn.execute("ALTER TABLE character_stats ADD COLUMN charisma INTEGER DEFAULT 1", []);

    // Execute charisma stat migration
    let charisma_migration = include_str!("../migrations/017_add_charisma_stat.sql");
    conn.execute_batch(charisma_migration)
        .map_err(|e| format!("Failed to execute charisma stat migration: {}", e))?;

    // Execute active abilities system migration
    let active_abilities_migration = include_str!("../migrations/018_active_abilities_system.sql");
    conn.execute_batch(active_abilities_migration)
        .map_err(|e| format!("Failed to execute active abilities migration: {}", e))?;

    // Add shop system columns (safe to run multiple times - ignores errors if columns exist)
    let _ = conn.execute("ALTER TABLE character_stats ADD COLUMN current_gold INTEGER DEFAULT 100", []);
    let _ = conn.execute("ALTER TABLE user_dungeon_progress ADD COLUMN in_town BOOLEAN DEFAULT TRUE", []);

    // Execute shop system migration
    let shop_migration = include_str!("../migrations/019_shop_system.sql");
    conn.execute_batch(shop_migration)
        .map_err(|e| format!("Failed to execute shop system migration: {}", e))?;

    // Execute RPG dungeon seed data
    let rpg_dungeon_seed = include_str!("../../course-framework-output/database/rpg-dungeon-seed.sql");
    conn.execute_batch(rpg_dungeon_seed)
        .map_err(|e| format!("Failed to execute RPG dungeon seed data: {}", e))?;

    // Add all equipment items to shop inventory (now that equipment_items are seeded)
    let shop_equipment_seed = r#"
        -- Add all equipment items to shop inventory with appropriate level requirements
        INSERT OR IGNORE INTO shop_inventory (item_type, item_id, available, required_level, stock_quantity)
        SELECT 'equipment', id, TRUE, required_level, NULL
        FROM equipment_items;
    "#;
    conn.execute_batch(shop_equipment_seed)
        .map_err(|e| format!("Failed to add equipment to shop: {}", e))?;

    // Execute multiple choice challenges seed data
    let multiple_choice_seed = include_str!("../../course-framework-output/database/rpg-challenges-multiple-choice.sql");
    conn.execute_batch(multiple_choice_seed)
        .map_err(|e| format!("Failed to execute multiple choice seed data: {}", e))?;

    // Note: narrative-level1-seed.sql is deprecated - using migrations 020-023 instead

    // Execute Level 1 enemies migration
    log::info!("Loading Level 1 enemies migration...");
    let level1_enemies_migration = include_str!("../migrations/020_level1_enemies.sql");
    conn.execute_batch(level1_enemies_migration)
        .map_err(|e| {
            log::error!("Level 1 enemies migration failed: {}", e);
            format!("Failed to execute Level 1 enemies migration: {}", e)
        })?;
    log::info!("Level 1 enemies migration completed successfully");

    // Execute Level 1 locations migration
    log::info!("Loading Level 1 locations migration...");
    let level1_locations_migration = include_str!("../migrations/021_level1_locations.sql");
    conn.execute_batch(level1_locations_migration)
        .map_err(|e| {
            log::error!("Level 1 locations migration failed: {}", e);
            format!("Failed to execute Level 1 locations migration: {}", e)
        })?;
    log::info!("Level 1 locations migration completed successfully");

    // Execute Level 1 choices migration
    log::info!("Loading Level 1 choices migration...");
    let level1_choices_migration = include_str!("../migrations/022_level1_choices.sql");
    conn.execute_batch(level1_choices_migration)
        .map_err(|e| {
            log::error!("Level 1 choices migration failed: {}", e);
            format!("Failed to execute Level 1 choices migration: {}", e)
        })?;
    log::info!("Level 1 choices migration completed successfully");

    // Execute Level 1 outcomes migration
    log::info!("Loading Level 1 outcomes migration...");
    let level1_outcomes_migration = include_str!("../migrations/023_level1_outcomes.sql");
    conn.execute_batch(level1_outcomes_migration)
        .map_err(|e| {
            log::error!("Level 1 outcomes migration failed: {}", e);
            format!("Failed to execute Level 1 outcomes migration: {}", e)
        })?;
    log::info!("Level 1 outcomes migration completed successfully");

    // Execute shop refresh system migration
    log::info!("Loading shop refresh system migration...");
    let shop_refresh_migration = include_str!("../migrations/025_shop_refresh_system.sql");
    conn.execute_batch(shop_refresh_migration)
        .map_err(|e| {
            log::error!("Shop refresh system migration failed: {}", e);
            format!("Failed to execute shop refresh system migration: {}", e)
        })?;
    log::info!("Shop refresh system migration completed successfully");

    // Execute remove duplicate choices migration
    log::info!("Loading remove duplicate choices migration...");
    let remove_duplicate_choices_migration = include_str!("../migrations/026_remove_duplicate_choices.sql");
    conn.execute_batch(remove_duplicate_choices_migration)
        .map_err(|e| {
            log::error!("Remove duplicate choices migration failed: {}", e);
            format!("Failed to execute remove duplicate choices migration: {}", e)
        })?;
    log::info!("Remove duplicate choices migration completed successfully");

    // Execute unified achievement system migration
    log::info!("Loading unified achievement system migration...");
    let unified_achievement_migration = include_str!("../migrations/027_unified_achievement_system.sql");
    conn.execute_batch(unified_achievement_migration)
        .map_err(|e| {
            log::error!("Unified achievement system migration failed: {}", e);
            format!("Failed to execute unified achievement system migration: {}", e)
        })?;
    log::info!("Unified achievement system migration completed successfully");

    // Execute achievement seed data
    log::info!("Loading achievement seed data...");
    let achievement_seed_data = include_str!("../migrations/028_achievement_seed_data.sql");
    conn.execute_batch(achievement_seed_data)
        .map_err(|e| {
            log::error!("Achievement seed data failed: {}", e);
            format!("Failed to execute achievement seed data: {}", e)
        })?;
    log::info!("Achievement seed data completed successfully");

    // Execute achievement viewed tracking migration (idempotent)
    log::info!("Loading achievement viewed tracking migration...");

    // Try to add the viewed_at column - ignore error if column already exists
    let _ = conn.execute(
        "ALTER TABLE user_achievement_progress ADD COLUMN viewed_at TEXT",
        [],
    );

    // Create index (IF NOT EXISTS handles idempotency)
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_user_achievement_viewed ON user_achievement_progress(user_id, viewed_at)",
        [],
    ).map_err(|e| {
        log::error!("Failed to create achievement viewed index: {}", e);
        format!("Failed to create achievement viewed index: {}", e)
    })?;

    log::info!("Achievement viewed tracking migration completed successfully");

    // Execute solution_viewed migration (if columns don't exist yet)
    let solution_viewed_migration = r#"
        -- Add solution_viewed columns if they don't exist
        ALTER TABLE user_puzzle_progress ADD COLUMN solution_viewed BOOLEAN DEFAULT FALSE;
        ALTER TABLE user_puzzle_progress ADD COLUMN solution_viewed_at TIMESTAMP;
    "#;

    // Try to execute migration, but don't fail if columns already exist
    let _ = conn.execute_batch(solution_viewed_migration);

    // Execute dungeon level editor migration
    log::info!("Loading dungeon level editor migration...");
    let dungeon_levels_migration = include_str!("../migrations/030_dungeon_levels.sql");
    conn.execute_batch(dungeon_levels_migration)
        .map_err(|e| {
            log::error!("Dungeon levels migration failed: {}", e);
            format!("Failed to execute dungeon levels migration: {}", e)
        })?;
    log::info!("Dungeon levels migration completed successfully");

    // Execute level sequencing migration
    log::info!("Loading level sequencing migration...");
    let level_sequencing_migration = include_str!("../migrations/031_level_sequencing.sql");
    let _ = conn.execute_batch(level_sequencing_migration); // Allow failure if column already exists
    log::info!("Level sequencing migration completed");

    // Execute custom enemies migration
    log::info!("Loading custom enemies migration...");
    let custom_enemies_migration = include_str!("../migrations/032_custom_enemies.sql");
    let _ = conn.execute_batch(custom_enemies_migration); // Allow failure if table already exists
    log::info!("Custom enemies migration completed");

    // Execute MCQ questions migration
    log::info!("Loading MCQ questions migration...");
    let mcq_migration = include_str!("../migrations/033_mcq_questions.sql");
    let _ = conn.execute_batch(mcq_migration); // Allow failure if table already exists
    log::info!("MCQ questions migration completed");

    // Execute challenge history foreign key fix migration
    log::info!("Loading challenge history FK fix migration...");
    let challenge_history_fk_migration = include_str!("../migrations/034_fix_challenge_history_fk.sql");
    let _ = conn.execute_batch(challenge_history_fk_migration); // Allow failure if already fixed
    log::info!("Challenge history FK fix migration completed");

    log::info!("Database initialized successfully at {:?}", db_path);
    Ok(())
}

/// Get a database connection
pub fn get_connection(app: &AppHandle) -> Result<Connection, String> {
    let db_path = get_db_path(app)?;
    let conn = Connection::open(&db_path)
        .map_err(|e| format!("Failed to open database connection: {}", e))?;

    // Enable foreign key constraints
    conn.execute("PRAGMA foreign_keys = ON", [])
        .map_err(|e| format!("Failed to enable foreign keys: {}", e))?;

    Ok(conn)
}
