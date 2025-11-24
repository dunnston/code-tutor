// Developer Testing Commands
// These commands are for testing and development only

use rusqlite::params;
use tauri::AppHandle;

use crate::db::get_connection;
use crate::gamification_commands::add_currency;

// ============================================================================
// CURRENCY COMMANDS
// ============================================================================

#[tauri::command]
pub fn dev_add_gold(
    app: AppHandle,
    user_id: i64,
    amount: i64,
) -> Result<(), String> {
    let conn = get_connection(&app)?;

    // Update RPG dungeon gold only
    conn.execute(
        "UPDATE character_stats SET current_gold = current_gold + ? WHERE user_id = ?",
        params![amount, user_id],
    )
    .map_err(|e| format!("Failed to add dungeon gold: {}", e))?;

    Ok(())
}

#[tauri::command]
pub fn dev_add_gems(
    app: AppHandle,
    user_id: i64,
    amount: i64,
) -> Result<(), String> {
    // Update gamification currency
    add_currency(
        app,
        user_id,
        "gems".to_string(),
        amount,
        "dev_panel".to_string(),
        None,
    )
    .map_err(|e| format!("Failed to add gems: {}", e))?;

    Ok(())
}

#[tauri::command]
pub fn dev_add_skill_points(
    app: AppHandle,
    user_id: i64,
    amount: i64,
) -> Result<(), String> {
    let conn = get_connection(&app)?;

    conn.execute(
        "UPDATE character_stats SET stat_points_available = stat_points_available + ? WHERE user_id = ?",
        params![amount, user_id],
    )
    .map_err(|e| format!("Failed to add skill points: {}", e))?;

    Ok(())
}

// ============================================================================
// LEVEL COMMANDS
// ============================================================================

#[tauri::command]
pub fn dev_add_levels(
    app: AppHandle,
    user_id: i64,
    levels: i64,
) -> Result<(), String> {
    let conn = get_connection(&app)?;

    // Each level grants 1 stat point
    let stat_points = levels * 1;

    conn.execute(
        "UPDATE character_stats
         SET level = level + ?,
             stat_points_available = stat_points_available + ?
         WHERE user_id = ?",
        params![levels, stat_points, user_id],
    )
    .map_err(|e| format!("Failed to add levels: {}", e))?;

    // Recalculate derived stats
    recalculate_stats_for_user(&conn, user_id)?;

    Ok(())
}

#[tauri::command]
pub fn dev_add_xp(
    app: AppHandle,
    user_id: i64,
    xp: i64,
) -> Result<(), String> {
    let conn = get_connection(&app)?;

    // Get current level and XP
    let (_current_level, _): (i64, i64) = conn.query_row(
        "SELECT level, stat_points_available FROM character_stats WHERE user_id = ?",
        params![user_id],
        |row| Ok((row.get(0)?, row.get(1)?)),
    )
    .map_err(|e| format!("Failed to get current level: {}", e))?;

    // Simple level calculation: 100 XP per level
    let levels_gained = xp / 100;
    let stat_points = levels_gained * 1;

    if levels_gained > 0 {
        conn.execute(
            "UPDATE character_stats
             SET level = level + ?,
                 stat_points_available = stat_points_available + ?
             WHERE user_id = ?",
            params![levels_gained, stat_points, user_id],
        )
        .map_err(|e| format!("Failed to add levels: {}", e))?;

        // Recalculate derived stats
        recalculate_stats_for_user(&conn, user_id)?;
    }

    Ok(())
}

// ============================================================================
// STAT COMMANDS
// ============================================================================

#[tauri::command]
pub fn dev_add_charisma(
    app: AppHandle,
    user_id: i64,
    amount: i64,
) -> Result<(), String> {
    let conn = get_connection(&app)?;

    conn.execute(
        "UPDATE character_stats SET charisma = charisma + ? WHERE user_id = ?",
        params![amount, user_id],
    )
    .map_err(|e| format!("Failed to add charisma: {}", e))?;

    Ok(())
}

// ============================================================================
// LOOT COMMANDS
// ============================================================================

#[tauri::command]
pub fn dev_generate_loot(
    app: AppHandle,
    user_id: i64,
    tier: String,
    quantity: i64,
) -> Result<(), String> {
    let conn = get_connection(&app)?;

    // Get random equipment items of the specified tier
    let mut stmt = conn.prepare(
        "SELECT id FROM equipment_items WHERE tier = ? ORDER BY RANDOM() LIMIT ?"
    )
    .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    let equipment_ids: Vec<String> = stmt
        .query_map(params![tier, quantity], |row| row.get(0))
        .map_err(|e| format!("Failed to query equipment: {}", e))?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| format!("Failed to collect equipment: {}", e))?;

    drop(stmt); // Drop statement before using conn again

    // Add each item to the user's inventory
    for equipment_id in equipment_ids {
        // Check if item already exists in inventory
        let exists: bool = conn.query_row(
            "SELECT COUNT(*) > 0 FROM equipment_inventory WHERE user_id = ? AND equipment_id = ?",
            params![user_id, &equipment_id],
            |row| row.get(0),
        )
        .map_err(|e| format!("Failed to check inventory: {}", e))?;

        if exists {
            // Increment quantity
            conn.execute(
                "UPDATE equipment_inventory SET quantity = quantity + 1 WHERE user_id = ? AND equipment_id = ?",
                params![user_id, &equipment_id],
            )
            .map_err(|e| format!("Failed to update inventory: {}", e))?;
        } else {
            // Insert new item
            conn.execute(
                "INSERT INTO equipment_inventory (user_id, equipment_id, quantity, acquired_at)
                 VALUES (?, ?, 1, CURRENT_TIMESTAMP)",
                params![user_id, &equipment_id],
            )
            .map_err(|e| format!("Failed to insert inventory: {}", e))?;
        }
    }

    Ok(())
}

// ============================================================================
// RESET COMMANDS
// ============================================================================

#[tauri::command]
pub fn dev_reset_character(
    app: AppHandle,
    user_id: i64,
) -> Result<(), String> {
    let conn = get_connection(&app)?;

    // Reset character to level 1 with default stats
    conn.execute(
        "UPDATE character_stats
         SET level = 1,
             strength = 10,
             intelligence = 10,
             dexterity = 10,
             charisma = 10,
             max_health = 100,
             current_health = 100,
             max_mana = 50,
             current_mana = 50,
             base_damage = 5,
             defense = 5,
             critical_chance = 0.05,
             dodge_chance = 0.05,
             stat_points_available = 0,
             current_gold = 100,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?",
        params![user_id],
    )
    .map_err(|e| format!("Failed to reset character: {}", e))?;

    Ok(())
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

fn recalculate_stats_for_user(conn: &rusqlite::Connection, user_id: i64) -> Result<(), String> {
    // Get current stats
    let (level, strength, intelligence, dexterity): (i64, i64, i64, i64) = conn.query_row(
        "SELECT level, strength, intelligence, dexterity FROM character_stats WHERE user_id = ?",
        params![user_id],
        |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?, row.get(3)?)),
    )
    .map_err(|e| format!("Failed to get stats: {}", e))?;

    // Calculate derived stats
    let max_health = 100 + (level * 10) + (strength * 5);
    let max_mana = 50 + (level * 5) + (intelligence * 3);
    let base_damage = 5 + (strength / 2) + (level / 2);
    let defense = 5 + (dexterity / 3) + (level / 3);
    let critical_chance = 0.05 + (dexterity as f64 * 0.001);
    let dodge_chance = 0.05 + (dexterity as f64 * 0.001);

    // Update derived stats
    conn.execute(
        "UPDATE character_stats
         SET max_health = ?,
             current_health = ?,
             max_mana = ?,
             current_mana = ?,
             base_damage = ?,
             defense = ?,
             critical_chance = ?,
             dodge_chance = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?",
        params![
            max_health,
            max_health, // Set current_health to max
            max_mana,
            max_mana, // Set current_mana to max
            base_damage,
            defense,
            critical_chance,
            dodge_chance,
            user_id
        ],
    )
    .map_err(|e| format!("Failed to update derived stats: {}", e))?;

    Ok(())
}
