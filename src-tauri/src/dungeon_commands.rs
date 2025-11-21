use rusqlite::{params, Result as SqlResult, Row};
use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use rand::Rng;

use crate::db::get_connection;

// ============================================================================
// DUNGEON FLOORS
// ============================================================================

#[derive(Debug, Serialize, Deserialize)]
pub struct DungeonFloor {
    pub floor_number: i64,
    pub name: String,
    pub description: String,
    pub recommended_level: i64,
    pub required_level: i64,
    pub enemy_level_range: String,
    pub boss_level: i64,
    pub gold_multiplier: f64,
    pub xp_multiplier: f64,
    pub loot_tier: i64,
    pub created_at: String,
}

impl DungeonFloor {
    fn from_row(row: &Row) -> SqlResult<Self> {
        Ok(DungeonFloor {
            floor_number: row.get(0)?,
            name: row.get(1)?,
            description: row.get(2)?,
            recommended_level: row.get(3)?,
            required_level: row.get(4)?,
            enemy_level_range: row.get(5)?,
            boss_level: row.get(6)?,
            gold_multiplier: row.get(7)?,
            xp_multiplier: row.get(8)?,
            loot_tier: row.get(9)?,
            created_at: row.get(10)?,
        })
    }
}

#[tauri::command]
pub fn get_dungeon_floor(app: AppHandle, floor_number: i64) -> Result<DungeonFloor, String> {
    let conn = get_connection(&app)?;

    conn.query_row(
        "SELECT floor_number, name, description, recommended_level, required_level,
                enemy_level_range, boss_level, gold_multiplier, xp_multiplier, loot_tier,
                created_at
         FROM dungeon_floors
         WHERE floor_number = ?",
        params![floor_number],
        DungeonFloor::from_row,
    )
    .map_err(|e| format!("Failed to get dungeon floor: {}", e))
}

#[tauri::command]
pub fn get_available_floors(app: AppHandle) -> Result<Vec<DungeonFloor>, String> {
    let conn = get_connection(&app)?;

    let mut stmt = conn
        .prepare(
            "SELECT floor_number, name, description, recommended_level, required_level,
                    enemy_level_range, boss_level, gold_multiplier, xp_multiplier, loot_tier,
                    created_at
             FROM dungeon_floors
             ORDER BY floor_number",
        )
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    let floors = stmt
        .query_map([], DungeonFloor::from_row)
        .map_err(|e| format!("Failed to query floors: {}", e))?
        .collect::<SqlResult<Vec<DungeonFloor>>>()
        .map_err(|e| format!("Failed to collect floors: {}", e))?;

    Ok(floors)
}

// ============================================================================
// USER DUNGEON PROGRESS
// ============================================================================

#[derive(Debug, Serialize, Deserialize)]
pub struct UserDungeonProgress {
    pub user_id: i64,
    pub current_floor: i64,
    pub deepest_floor_reached: i64,
    pub in_combat: bool,
    pub current_enemy_id: Option<String>,
    pub current_enemy_health: Option<i64>,
    pub current_room_type: Option<String>,
    pub total_enemies_defeated: i64,
    pub total_bosses_defeated: i64,
    pub total_floors_cleared: i64,
    pub total_deaths: i64,
    pub total_gold_earned: i64,
    pub total_xp_earned: i64,
    pub last_room_description: Option<String>,
    pub last_action_timestamp: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

impl UserDungeonProgress {
    fn from_row(row: &Row) -> SqlResult<Self> {
        Ok(UserDungeonProgress {
            user_id: row.get(0)?,
            current_floor: row.get(1)?,
            deepest_floor_reached: row.get(2)?,
            in_combat: row.get(3)?,
            current_enemy_id: row.get(4)?,
            current_enemy_health: row.get(5)?,
            current_room_type: row.get(6)?,
            total_enemies_defeated: row.get(7)?,
            total_bosses_defeated: row.get(8)?,
            total_floors_cleared: row.get(9)?,
            total_deaths: row.get(10)?,
            total_gold_earned: row.get(11)?,
            total_xp_earned: row.get(12)?,
            last_room_description: row.get(13)?,
            last_action_timestamp: row.get(14)?,
            created_at: row.get(15)?,
            updated_at: row.get(16)?,
        })
    }
}

#[tauri::command]
pub fn get_user_dungeon_progress(app: AppHandle, user_id: i64) -> Result<UserDungeonProgress, String> {
    let conn = get_connection(&app)?;

    // Initialize dungeon progress if doesn't exist (starting at floor 1)
    conn.execute(
        "INSERT OR IGNORE INTO user_dungeon_progress (
            user_id, current_floor, deepest_floor_reached, in_combat, current_room_type,
            total_enemies_defeated, total_bosses_defeated, total_floors_cleared,
            total_deaths, total_gold_earned, total_xp_earned,
            created_at, updated_at
        ) VALUES (?, 1, 1, 0, 'entrance', 0, 0, 0, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
        params![user_id],
    )
    .map_err(|e| format!("Failed to initialize dungeon progress: {}", e))?;

    conn.query_row(
        "SELECT user_id, current_floor, deepest_floor_reached, in_combat, current_enemy_id,
                current_enemy_health, current_room_type, total_enemies_defeated,
                total_bosses_defeated, total_floors_cleared, total_deaths, total_gold_earned,
                total_xp_earned, last_room_description, last_action_timestamp, created_at,
                updated_at
         FROM user_dungeon_progress
         WHERE user_id = ?",
        params![user_id],
        UserDungeonProgress::from_row,
    )
    .map_err(|e| format!("Failed to get dungeon progress: {}", e))
}

#[tauri::command]
pub fn update_dungeon_floor(
    app: AppHandle,
    user_id: i64,
    floor_number: i64,
) -> Result<UserDungeonProgress, String> {
    let conn = get_connection(&app)?;

    conn.execute(
        "UPDATE user_dungeon_progress
         SET current_floor = ?,
             deepest_floor_reached = MAX(deepest_floor_reached, ?),
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?",
        params![floor_number, floor_number, user_id],
    )
    .map_err(|e| format!("Failed to update floor: {}", e))?;

    get_user_dungeon_progress(app, user_id)
}

// ============================================================================
// ENEMIES
// ============================================================================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct EnemyType {
    pub id: String,
    pub name: String,
    pub description: String,
    pub base_health: i64,
    pub base_damage: i64,
    pub base_defense: i64,
    pub behavior_type: String,
    pub gold_drop_min: i64,
    pub gold_drop_max: i64,
    pub xp_reward: i64,
    pub loot_table: Option<String>,
    pub icon: String,
    pub ascii_art: Option<String>,
    pub created_at: String,
}

impl EnemyType {
    fn from_row(row: &Row) -> SqlResult<Self> {
        Ok(EnemyType {
            id: row.get(0)?,
            name: row.get(1)?,
            description: row.get(2)?,
            base_health: row.get(3)?,
            base_damage: row.get(4)?,
            base_defense: row.get(5)?,
            behavior_type: row.get(6)?,
            gold_drop_min: row.get(7)?,
            gold_drop_max: row.get(8)?,
            xp_reward: row.get(9)?,
            loot_table: row.get(10)?,
            icon: row.get(11)?,
            ascii_art: row.get(12)?,
            created_at: row.get(13)?,
        })
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct BossEnemy {
    pub id: String,
    pub name: String,
    pub description: String,
    pub floor_number: i64,
    pub health: i64,
    pub damage: i64,
    pub defense: i64,
    pub abilities: String,
    pub phases: Option<String>,
    pub gold_reward: i64,
    pub xp_reward: i64,
    pub guaranteed_loot: Option<String>,
    pub icon: String,
    pub ascii_art: Option<String>,
    pub created_at: String,
}

impl BossEnemy {
    fn from_row(row: &Row) -> SqlResult<Self> {
        Ok(BossEnemy {
            id: row.get(0)?,
            name: row.get(1)?,
            description: row.get(2)?,
            floor_number: row.get(3)?,
            health: row.get(4)?,
            damage: row.get(5)?,
            defense: row.get(6)?,
            abilities: row.get(7)?,
            phases: row.get(8)?,
            gold_reward: row.get(9)?,
            xp_reward: row.get(10)?,
            guaranteed_loot: row.get(11)?,
            icon: row.get(12)?,
            ascii_art: row.get(13)?,
            created_at: row.get(14)?,
        })
    }
}

#[tauri::command]
pub fn get_random_enemy_for_floor(app: AppHandle, floor_number: i64) -> Result<EnemyType, String> {
    let conn = get_connection(&app)?;

    // Get all enemies for this floor with their spawn weights
    let mut stmt = conn
        .prepare(
            "SELECT e.id, e.name, e.description, e.base_health, e.base_damage, e.base_defense,
                    e.behavior_type, e.gold_drop_min, e.gold_drop_max, e.xp_reward, e.loot_table,
                    e.icon, e.ascii_art, e.created_at, fe.spawn_weight
             FROM enemy_types e
             INNER JOIN floor_enemies fe ON e.id = fe.enemy_id
             WHERE fe.floor_number = ?",
        )
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    let enemies: Vec<(EnemyType, i64)> = stmt
        .query_map(params![floor_number], |row| {
            Ok((
                EnemyType {
                    id: row.get(0)?,
                    name: row.get(1)?,
                    description: row.get(2)?,
                    base_health: row.get(3)?,
                    base_damage: row.get(4)?,
                    base_defense: row.get(5)?,
                    behavior_type: row.get(6)?,
                    gold_drop_min: row.get(7)?,
                    gold_drop_max: row.get(8)?,
                    xp_reward: row.get(9)?,
                    loot_table: row.get(10)?,
                    icon: row.get(11)?,
                    ascii_art: row.get(12)?,
                    created_at: row.get(13)?,
                },
                row.get::<_, i64>(14)?, // spawn_weight
            ))
        })
        .map_err(|e| format!("Failed to query enemies: {}", e))?
        .collect::<SqlResult<Vec<(EnemyType, i64)>>>()
        .map_err(|e| format!("Failed to collect enemies: {}", e))?;

    if enemies.is_empty() {
        return Err("No enemies found for this floor".to_string());
    }

    // Calculate total weight
    let total_weight: i64 = enemies.iter().map(|(_, weight)| weight).sum();

    // Random selection based on weight
    let mut rng = rand::thread_rng();
    let mut roll = rng.gen_range(0..total_weight);

    for (enemy, weight) in &enemies {
        if roll < *weight {
            return Ok(enemy.clone());
        }
        roll -= weight;
    }

    // Fallback (shouldn't happen)
    Ok(enemies[0].0.clone())
}

#[tauri::command]
pub fn get_boss_for_floor(app: AppHandle, floor_number: i64) -> Result<BossEnemy, String> {
    let conn = get_connection(&app)?;

    conn.query_row(
        "SELECT id, name, description, floor_number, health, damage, defense, abilities,
                phases, gold_reward, xp_reward, guaranteed_loot, icon, ascii_art, created_at
         FROM boss_enemies
         WHERE floor_number = ?",
        params![floor_number],
        BossEnemy::from_row,
    )
    .map_err(|e| format!("Failed to get boss: {}", e))
}

#[tauri::command]
pub fn get_enemy_by_id(app: AppHandle, enemy_id: String) -> Result<EnemyType, String> {
    let conn = get_connection(&app)?;

    conn.query_row(
        "SELECT id, name, description, base_health, base_damage, base_defense, behavior_type,
                gold_drop_min, gold_drop_max, xp_reward, loot_table, icon, ascii_art, created_at
         FROM enemy_types
         WHERE id = ?",
        params![enemy_id],
        EnemyType::from_row,
    )
    .map_err(|e| format!("Failed to get enemy by id: {}", e))
}

// ============================================================================
// ENCOUNTERS
// ============================================================================

#[derive(Debug, Serialize, Deserialize)]
pub struct DungeonEncounter {
    pub id: String,
    pub encounter_type: String,
    pub floor_number: i64,
    pub description_prompt: String,
    pub required_stat: Option<String>,
    pub difficulty_rating: i64,
    pub rewards: Option<String>,
    pub penalties: Option<String>,
    pub rarity: String,
    pub created_at: String,
}

impl DungeonEncounter {
    fn from_row(row: &Row) -> SqlResult<Self> {
        Ok(DungeonEncounter {
            id: row.get(0)?,
            encounter_type: row.get(1)?,
            floor_number: row.get(2)?,
            description_prompt: row.get(3)?,
            required_stat: row.get(4)?,
            difficulty_rating: row.get(5)?,
            rewards: row.get(6)?,
            penalties: row.get(7)?,
            rarity: row.get(8)?,
            created_at: row.get(9)?,
        })
    }
}

#[tauri::command]
pub fn get_random_encounter(
    app: AppHandle,
    floor_number: i64,
    encounter_type: String,
) -> Result<DungeonEncounter, String> {
    let conn = get_connection(&app)?;

    let mut stmt = conn
        .prepare(
            "SELECT id, type, floor_number, description_prompt, required_stat, difficulty_rating,
                    rewards, penalties, rarity, created_at
             FROM dungeon_encounters
             WHERE floor_number = ? AND type = ?
             ORDER BY RANDOM()
             LIMIT 1",
        )
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    stmt.query_row(params![floor_number, encounter_type], DungeonEncounter::from_row)
        .map_err(|e| format!("Failed to get encounter: {}", e))
}

// ============================================================================
// DUNGEON CHALLENGES
// ============================================================================

#[derive(Debug, Serialize, Deserialize)]
pub struct DungeonChallenge {
    pub id: String,
    pub difficulty: String,
    pub action_type: String,
    pub title: String,
    pub description: String,
    pub starter_code: Option<String>,
    pub solution: Option<String>,
    pub test_cases: Option<String>,
    pub choices: Option<String>,
    pub correct_answer: Option<String>,
    pub required_language: Option<String>,
    pub min_floor: i64,
    pub max_floor: Option<i64>,
    pub times_used: i64,
    pub success_rate: f64,
    pub created_at: String,
}

impl DungeonChallenge {
    fn from_row(row: &Row) -> SqlResult<Self> {
        Ok(DungeonChallenge {
            id: row.get(0)?,
            difficulty: row.get(1)?,
            action_type: row.get(2)?,
            title: row.get(3)?,
            description: row.get(4)?,
            starter_code: row.get(5)?,
            solution: row.get(6)?,
            test_cases: row.get(7)?,
            choices: row.get(8)?,
            correct_answer: row.get(9)?,
            required_language: row.get(10)?,
            min_floor: row.get(11)?,
            max_floor: row.get(12)?,
            times_used: row.get(13)?,
            success_rate: row.get(14)?,
            created_at: row.get(15)?,
        })
    }
}

#[tauri::command]
pub fn get_challenge_for_action(
    app: AppHandle,
    action_type: String,
    floor_number: i64,
    difficulty: Option<String>,
) -> Result<DungeonChallenge, String> {
    let conn = get_connection(&app)?;

    let query = if let Some(ref _diff) = difficulty {
        format!(
            "SELECT id, difficulty, action_type, title, description, starter_code, solution,
                    test_cases, choices, correct_answer, required_language, min_floor, max_floor,
                    times_used, success_rate, created_at
             FROM dungeon_challenges
             WHERE action_type = ?
               AND difficulty = ?
               AND min_floor <= ?
               AND (max_floor IS NULL OR max_floor >= ?)
             ORDER BY RANDOM()
             LIMIT 1"
        )
    } else {
        format!(
            "SELECT id, difficulty, action_type, title, description, starter_code, solution,
                    test_cases, choices, correct_answer, required_language, min_floor, max_floor,
                    times_used, success_rate, created_at
             FROM dungeon_challenges
             WHERE action_type = ?
               AND min_floor <= ?
               AND (max_floor IS NULL OR max_floor >= ?)
             ORDER BY RANDOM()
             LIMIT 1"
        )
    };

    let mut stmt = conn
        .prepare(&query)
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    let challenge = if let Some(ref diff) = difficulty {
        stmt.query_row(
            params![action_type, diff, floor_number, floor_number],
            DungeonChallenge::from_row,
        )
    } else {
        stmt.query_row(
            params![action_type, floor_number, floor_number],
            DungeonChallenge::from_row,
        )
    };

    challenge.map_err(|e| format!("Failed to get challenge: {}", e))
}

#[tauri::command]
pub fn record_challenge_attempt(
    app: AppHandle,
    user_id: i64,
    challenge_id: String,
    success: bool,
    time_taken_seconds: i64,
) -> Result<(), String> {
    let conn = get_connection(&app)?;

    // Record in user challenge history
    conn.execute(
        "INSERT INTO user_challenge_history (user_id, challenge_id, success, time_taken_seconds)
         VALUES (?, ?, ?, ?)",
        params![user_id, challenge_id, success, time_taken_seconds],
    )
    .map_err(|e| format!("Failed to record challenge attempt: {}", e))?;

    // Update challenge stats
    conn.execute(
        "UPDATE dungeon_challenges
         SET times_used = times_used + 1
         WHERE id = ?",
        params![challenge_id],
    )
    .map_err(|e| format!("Failed to update challenge stats: {}", e))?;

    Ok(())
}
