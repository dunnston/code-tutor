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

    // Execute solution_viewed migration (if columns don't exist yet)
    let solution_viewed_migration = r#"
        -- Add solution_viewed columns if they don't exist
        ALTER TABLE user_puzzle_progress ADD COLUMN solution_viewed BOOLEAN DEFAULT FALSE;
        ALTER TABLE user_puzzle_progress ADD COLUMN solution_viewed_at TIMESTAMP;
    "#;

    // Try to execute migration, but don't fail if columns already exist
    let _ = conn.execute_batch(solution_viewed_migration);

    log::info!("Database initialized successfully at {:?}", db_path);
    Ok(())
}

/// Get a database connection
pub fn get_connection(app: &AppHandle) -> Result<Connection, String> {
    let db_path = get_db_path(app)?;
    Connection::open(&db_path)
        .map_err(|e| format!("Failed to open database connection: {}", e))
}
