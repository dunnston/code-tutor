use rusqlite::{params, Result as SqlResult, Row};
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager};
use rand::Rng;

use crate::db::get_connection;
use crate::rpg_commands::{CharacterStats, get_character_stats, Ability};
use crate::dungeon_commands::{EnemyType, BossEnemy};

// ============================================================================
// COMBAT STATE
// ============================================================================

#[derive(Debug, Serialize, Deserialize)]
pub struct ActiveCombat {
    pub user_id: i64,
    pub enemy_id: String,
    pub enemy_name: String,
    pub enemy_current_health: i64,
    pub enemy_max_health: i64,
    pub enemy_damage: i64,
    pub enemy_defense: i64,
    pub is_boss: bool,
    pub icon: String,
    pub combat_turn: i64,
    pub ability_cooldowns: Option<String>, // JSON
    pub active_buffs: Option<String>,       // JSON
    pub active_debuffs: Option<String>,     // JSON
}

#[tauri::command]
pub fn start_combat(
    app: AppHandle,
    user_id: i64,
    enemy: EnemyType,
) -> Result<ActiveCombat, String> {
    let conn = get_connection(&app)?;

    // Update user dungeon progress - set in_combat
    conn.execute(
        "UPDATE user_dungeon_progress
         SET in_combat = TRUE,
             current_enemy_id = ?,
             current_enemy_health = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?",
        params![enemy.id, enemy.base_health, user_id],
    )
    .map_err(|e| format!("Failed to start combat: {}", e))?;

    // Initialize or update dungeon session
    conn.execute(
        "INSERT OR REPLACE INTO dungeon_session
            (user_id, combat_turn, enemy_current_health, ability_cooldowns, active_buffs, active_debuffs)
         VALUES (?, 0, ?, '{}', '[]', '[]')",
        params![user_id, enemy.base_health],
    )
    .map_err(|e| format!("Failed to initialize combat session: {}", e))?;

    Ok(ActiveCombat {
        user_id,
        enemy_id: enemy.id.clone(),
        enemy_name: enemy.name,
        enemy_current_health: enemy.base_health,
        enemy_max_health: enemy.base_health,
        enemy_damage: enemy.base_damage,
        enemy_defense: enemy.base_defense,
        is_boss: false,
        icon: enemy.icon,
        combat_turn: 0,
        ability_cooldowns: Some("{}".to_string()),
        active_buffs: Some("[]".to_string()),
        active_debuffs: Some("[]".to_string()),
    })
}

#[tauri::command]
pub fn start_boss_combat(
    app: AppHandle,
    user_id: i64,
    boss: BossEnemy,
) -> Result<ActiveCombat, String> {
    let conn = get_connection(&app)?;

    // Update user dungeon progress - set in_combat
    conn.execute(
        "UPDATE user_dungeon_progress
         SET in_combat = TRUE,
             current_enemy_id = ?,
             current_enemy_health = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?",
        params![boss.id, boss.health, user_id],
    )
    .map_err(|e| format!("Failed to start boss combat: {}", e))?;

    // Initialize or update dungeon session
    conn.execute(
        "INSERT OR REPLACE INTO dungeon_session
            (user_id, combat_turn, enemy_current_health, ability_cooldowns, active_buffs, active_debuffs)
         VALUES (?, 0, ?, '{}', '[]', '[]')",
        params![user_id, boss.health],
    )
    .map_err(|e| format!("Failed to initialize boss combat session: {}", e))?;

    Ok(ActiveCombat {
        user_id,
        enemy_id: boss.id.clone(),
        enemy_name: boss.name,
        enemy_current_health: boss.health,
        enemy_max_health: boss.health,
        enemy_damage: boss.damage,
        enemy_defense: boss.defense,
        is_boss: true,
        icon: boss.icon,
        combat_turn: 0,
        ability_cooldowns: Some("{}".to_string()),
        active_buffs: Some("[]".to_string()),
        active_debuffs: Some("[]".to_string()),
    })
}

// ============================================================================
// DAMAGE CALCULATION
// ============================================================================

#[derive(Debug, Serialize, Deserialize)]
pub struct DamageResult {
    pub damage: i64,
    pub is_critical: bool,
    pub is_dodged: bool,
}

#[tauri::command]
pub fn calculate_player_damage(
    app: AppHandle,
    user_id: i64,
    ability: Ability,
    challenge_success: bool,
) -> Result<DamageResult, String> {
    let stats = get_character_stats(app, user_id)?;

    // Base damage from ability
    let mut damage = ability.base_value;

    // Add stat scaling
    let stat_value = match ability.scaling_stat.as_str() {
        "strength" => stats.strength,
        "intelligence" => stats.intelligence,
        "dexterity" => stats.dexterity,
        _ => 0,
    };

    damage += (stat_value as f64 * ability.scaling_ratio) as i64;

    // Apply challenge success/failure modifier
    if !challenge_success {
        damage = (damage as f64 * 0.5) as i64; // 50% damage on failure
    }

    // Check for critical hit
    let mut rng = rand::thread_rng();
    let crit_roll: f64 = rng.gen();
    let is_critical = crit_roll < stats.critical_chance;

    if is_critical {
        damage *= 2;
    }

    Ok(DamageResult {
        damage,
        is_critical,
        is_dodged: false,
    })
}

#[tauri::command]
pub fn calculate_enemy_damage(
    app: AppHandle,
    user_id: i64,
    enemy_base_damage: i64,
) -> Result<DamageResult, String> {
    let stats = get_character_stats(app, user_id)?;

    // Check for dodge
    let mut rng = rand::thread_rng();
    let dodge_roll: f64 = rng.gen();
    let is_dodged = dodge_roll < stats.dodge_chance;

    if is_dodged {
        return Ok(DamageResult {
            damage: 0,
            is_critical: false,
            is_dodged: true,
        });
    }

    // Calculate damage after defense
    let damage = (enemy_base_damage - stats.defense).max(1);

    Ok(DamageResult {
        damage,
        is_critical: false,
        is_dodged: false,
    })
}

// ============================================================================
// COMBAT ACTIONS
// ============================================================================

#[derive(Debug, Serialize, Deserialize)]
pub struct CombatTurnResult {
    pub player_damage_dealt: i64,
    pub player_damage_taken: i64,
    pub enemy_current_health: i64,
    pub player_current_health: i64,
    pub player_current_mana: i64,
    pub enemy_defeated: bool,
    pub player_defeated: bool,
    pub is_critical: bool,
    pub is_dodged: bool,
    pub turn_number: i64,
}

#[tauri::command]
pub fn execute_combat_turn(
    app: AppHandle,
    user_id: i64,
    ability_id: String,
    challenge_success: bool,
) -> Result<CombatTurnResult, String> {
    let conn = get_connection(&app)?;

    // Get current combat state
    let stats = get_character_stats(app.clone(), user_id)?;

    // Get ability
    let ability: Ability = conn
        .query_row(
            "SELECT id, name, description, type, required_level, mana_cost, cooldown_turns,
                    base_value, scaling_stat, scaling_ratio, additional_effects, icon,
                    animation_text, created_at
             FROM abilities
             WHERE id = ?",
            params![ability_id],
            |row| {
                Ok(Ability {
                    id: row.get(0)?,
                    name: row.get(1)?,
                    description: row.get(2)?,
                    ability_type: row.get(3)?,
                    required_level: row.get(4)?,
                    mana_cost: row.get(5)?,
                    cooldown_turns: row.get(6)?,
                    base_value: row.get(7)?,
                    scaling_stat: row.get(8)?,
                    scaling_ratio: row.get(9)?,
                    additional_effects: row.get(10)?,
                    icon: row.get(11)?,
                    animation_text: row.get(12)?,
                    created_at: row.get(13)?,
                })
            },
        )
        .map_err(|e| format!("Failed to get ability: {}", e))?;

    // Check if player has enough mana
    if stats.current_mana < ability.mana_cost {
        return Err("Not enough mana".to_string());
    }

    // Get enemy state from session
    let (enemy_health, enemy_damage, turn): (i64, i64, i64) = conn
        .query_row(
            "SELECT enemy_current_health, combat_turn
             FROM dungeon_session
             WHERE user_id = ?",
            params![user_id],
            |row| Ok((row.get(0)?, 15i64, row.get(1)?)), // TODO: Get actual enemy damage
        )
        .map_err(|e| format!("Failed to get combat session: {}", e))?;

    // Calculate player damage
    let player_damage_result = calculate_player_damage(app.clone(), user_id, ability.clone(), challenge_success)?;
    let mut player_damage_dealt = player_damage_result.damage;

    // Handle heal ability
    let mut new_player_health = stats.current_health;
    if ability.ability_type == "heal" {
        new_player_health = (stats.current_health + player_damage_dealt).min(stats.max_health);
        player_damage_dealt = 0; // Don't damage enemy with heal
    }

    // Apply damage to enemy
    let new_enemy_health = (enemy_health - player_damage_dealt).max(0);
    let enemy_defeated = new_enemy_health <= 0;

    // Deduct mana
    let new_player_mana = stats.current_mana - ability.mana_cost;

    // Update player stats
    conn.execute(
        "UPDATE character_stats
         SET current_health = ?,
             current_mana = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?",
        params![new_player_health, new_player_mana, user_id],
    )
    .map_err(|e| format!("Failed to update player stats: {}", e))?;

    // Enemy turn (if not defeated)
    let mut player_damage_taken = 0;
    let mut player_defeated = false;

    if !enemy_defeated {
        let enemy_damage_result = calculate_enemy_damage(app.clone(), user_id, enemy_damage)?;
        player_damage_taken = enemy_damage_result.damage;

        new_player_health = (new_player_health - player_damage_taken).max(0);
        player_defeated = new_player_health <= 0;

        // Update player health after enemy attack
        conn.execute(
            "UPDATE character_stats
             SET current_health = ?,
                 updated_at = CURRENT_TIMESTAMP
             WHERE user_id = ?",
            params![new_player_health, user_id],
        )
        .map_err(|e| format!("Failed to update player health: {}", e))?;
    }

    // Update combat session
    conn.execute(
        "UPDATE dungeon_session
         SET combat_turn = combat_turn + 1,
             enemy_current_health = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?",
        params![new_enemy_health, user_id],
    )
    .map_err(|e| format!("Failed to update combat session: {}", e))?;

    Ok(CombatTurnResult {
        player_damage_dealt,
        player_damage_taken,
        enemy_current_health: new_enemy_health,
        player_current_health: new_player_health,
        player_current_mana: new_player_mana,
        enemy_defeated,
        player_defeated,
        is_critical: player_damage_result.is_critical,
        is_dodged: false,
        turn_number: turn + 1,
    })
}

// ============================================================================
// COMBAT REWARDS
// ============================================================================

#[derive(Debug, Serialize, Deserialize)]
pub struct CombatRewards {
    pub xp_gained: i64,
    pub gold_gained: i64,
    pub items_looted: Vec<String>,
}

#[tauri::command]
pub fn end_combat_victory(
    app: AppHandle,
    user_id: i64,
    enemy: EnemyType,
    turns_taken: i64,
    damage_dealt: i64,
    damage_taken: i64,
) -> Result<CombatRewards, String> {
    let conn = get_connection(&app)?;

    // Calculate rewards
    let mut rng = rand::thread_rng();
    let gold_gained = rng.gen_range(enemy.gold_drop_min..=enemy.gold_drop_max);
    let xp_gained = enemy.xp_reward;

    // Award gold (using existing gamification system)
    conn.execute(
        "UPDATE user_currency
         SET gold = gold + ?,
             lifetime_gold_earned = lifetime_gold_earned + ?
         WHERE user_id = ?",
        params![gold_gained, gold_gained, user_id],
    )
    .map_err(|e| format!("Failed to award gold: {}", e))?;

    // Update dungeon progress
    conn.execute(
        "UPDATE user_dungeon_progress
         SET in_combat = FALSE,
             current_enemy_id = NULL,
             current_enemy_health = NULL,
             total_enemies_defeated = total_enemies_defeated + 1,
             total_gold_earned = total_gold_earned + ?,
             total_xp_earned = total_xp_earned + ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?",
        params![gold_gained, xp_gained, user_id],
    )
    .map_err(|e| format!("Failed to update dungeon progress: {}", e))?;

    // Log combat
    conn.execute(
        "INSERT INTO dungeon_combat_log
            (user_id, enemy_type, enemy_name, floor_number, is_boss, victory, turns_taken,
             damage_dealt, damage_taken, xp_gained, gold_gained)
         SELECT ?, ?, ?, current_floor, FALSE, TRUE, ?, ?, ?, ?, ?
         FROM user_dungeon_progress
         WHERE user_id = ?",
        params![
            user_id,
            enemy.id,
            enemy.name,
            turns_taken,
            damage_dealt,
            damage_taken,
            xp_gained,
            gold_gained,
            user_id
        ],
    )
    .map_err(|e| format!("Failed to log combat: {}", e))?;

    // TODO: Handle loot drops

    Ok(CombatRewards {
        xp_gained,
        gold_gained,
        items_looted: vec![],
    })
}

#[tauri::command]
pub fn end_combat_defeat(app: AppHandle, user_id: i64) -> Result<(), String> {
    let conn = get_connection(&app)?;

    // Calculate gold penalty (10%)
    let gold_lost: i64 = conn
        .query_row(
            "SELECT CAST(gold * 0.1 AS INTEGER) FROM user_currency WHERE user_id = ?",
            params![user_id],
            |row| row.get(0),
        )
        .unwrap_or(0);

    // Apply penalty
    conn.execute(
        "UPDATE user_currency
         SET gold = gold - ?
         WHERE user_id = ?",
        params![gold_lost, user_id],
    )
    .map_err(|e| format!("Failed to apply gold penalty: {}", e))?;

    // Update dungeon progress
    conn.execute(
        "UPDATE user_dungeon_progress
         SET in_combat = FALSE,
             current_enemy_id = NULL,
             current_enemy_health = NULL,
             total_deaths = total_deaths + 1,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?",
        params![user_id],
    )
    .map_err(|e| format!("Failed to update dungeon progress: {}", e))?;

    // Restore health and mana (respawn with full HP/MP)
    conn.execute(
        "UPDATE character_stats
         SET current_health = max_health,
             current_mana = max_mana,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?",
        params![user_id],
    )
    .map_err(|e| format!("Failed to restore health and mana: {}", e))?;

    Ok(())
}
