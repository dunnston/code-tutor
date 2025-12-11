use rusqlite::{params, Result as SqlResult, Row};
use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use rand::Rng;

use crate::db::get_connection;

// ============================================================================
// NARRATIVE LOCATIONS
// ============================================================================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct NarrativeLocation {
    pub id: String,
    pub floor_number: i64,
    pub name: String,
    pub description: String,
    pub location_type: String,
    pub is_repeatable: bool,
    pub icon: String,
    pub created_at: String,
}

impl NarrativeLocation {
    fn from_row(row: &Row) -> SqlResult<Self> {
        Ok(NarrativeLocation {
            id: row.get(0)?,
            floor_number: row.get(1)?,
            name: row.get(2)?,
            description: row.get(3)?,
            location_type: row.get(4)?,
            is_repeatable: row.get(5)?,
            icon: row.get(6)?,
            created_at: row.get(7)?,
        })
    }
}

// ============================================================================
// NARRATIVE CHOICES
// ============================================================================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct NarrativeChoice {
    pub id: String,
    pub location_id: String,
    pub choice_text: String,
    pub requires_skill_check: bool,
    pub skill_type: Option<String>,
    pub skill_dc: Option<i64>,
    pub challenge_action_type: Option<String>,
    pub display_order: i64,
    pub icon: Option<String>,
    pub requires_flag: Option<String>,
    pub created_at: String,
}

impl NarrativeChoice {
    fn from_row(row: &Row) -> SqlResult<Self> {
        Ok(NarrativeChoice {
            id: row.get(0)?,
            location_id: row.get(1)?,
            choice_text: row.get(2)?,
            requires_skill_check: row.get(3)?,
            skill_type: row.get(4)?,
            skill_dc: row.get(5)?,
            challenge_action_type: row.get(6)?,
            display_order: row.get(7)?,
            icon: row.get(8)?,
            requires_flag: row.get(9)?,
            created_at: row.get(10)?,
        })
    }
}

// ============================================================================
// NARRATIVE OUTCOMES
// ============================================================================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct NarrativeOutcome {
    pub id: String,
    pub choice_id: String,
    pub outcome_type: String,
    pub description: String,
    pub next_location_id: Option<String>,
    pub rewards: Option<String>,
    pub penalties: Option<String>,
    pub sets_flags: Option<String>,
    pub triggers_combat: bool,
    pub enemy_id: Option<String>,
    pub enemy_count: i64,
    pub created_at: String,
}

impl NarrativeOutcome {
    fn from_row(row: &Row) -> SqlResult<Self> {
        Ok(NarrativeOutcome {
            id: row.get(0)?,
            choice_id: row.get(1)?,
            outcome_type: row.get(2)?,
            description: row.get(3)?,
            next_location_id: row.get(4)?,
            rewards: row.get(5)?,
            penalties: row.get(6)?,
            sets_flags: row.get(7)?,
            triggers_combat: row.get(8)?,
            enemy_id: row.get(9)?,
            enemy_count: row.get(10)?,
            created_at: row.get(11)?,
        })
    }
}

// ============================================================================
// USER NARRATIVE PROGRESS
// ============================================================================

#[derive(Debug, Serialize, Deserialize)]
pub struct UserNarrativeProgress {
    pub user_id: i64,
    pub floor_number: i64,
    pub current_location_id: Option<String>,
    pub visited_locations: Option<String>,
    pub completed_choices: Option<String>,
    pub story_flags: Option<String>,
    pub last_roll: Option<i64>,
    pub last_skill_type: Option<String>,
    pub last_skill_dc: Option<i64>,
    pub last_modifier: Option<i64>,
    pub last_challenge_success: Option<bool>,
    pub total_skill_checks: i64,
    pub successful_skill_checks: i64,
    pub created_at: String,
    pub updated_at: String,
}

impl UserNarrativeProgress {
    fn from_row(row: &Row) -> SqlResult<Self> {
        Ok(UserNarrativeProgress {
            user_id: row.get(0)?,
            floor_number: row.get(1)?,
            current_location_id: row.get(2)?,
            visited_locations: row.get(3)?,
            completed_choices: row.get(4)?,
            story_flags: row.get(5)?,
            last_roll: row.get(6)?,
            last_skill_type: row.get(7)?,
            last_skill_dc: row.get(8)?,
            last_modifier: row.get(9)?,
            last_challenge_success: row.get(10)?,
            total_skill_checks: row.get(11)?,
            successful_skill_checks: row.get(12)?,
            created_at: row.get(13)?,
            updated_at: row.get(14)?,
        })
    }
}

// ============================================================================
// SKILL CHECK RESULT
// ============================================================================

#[derive(Debug, Serialize, Deserialize)]
pub struct SkillCheckResult {
    pub dice_roll: i64,
    pub stat_modifier: i64,
    pub challenge_success: bool,
    pub applied_modifier: i64,  // 0 if challenge failed, stat_modifier if succeeded
    pub total_roll: i64,  // dice_roll + applied_modifier
    pub dc: i64,
    pub check_passed: bool,
    pub outcome_type: String,  // 'critical_success', 'success', 'failure', 'critical_failure'
    pub outcome: NarrativeOutcome,
}

// ============================================================================
// COMMANDS
// ============================================================================

#[tauri::command]
pub fn roll_d20() -> i64 {
    let mut rng = rand::thread_rng();
    rng.gen_range(1..=20)
}

#[tauri::command]
pub fn get_user_narrative_progress(
    app: AppHandle,
    user_id: i64,
) -> Result<UserNarrativeProgress, String> {
    let conn = get_connection(&app)?;

    // Initialize narrative progress if doesn't exist (starting at floor 1)
    conn.execute(
        "INSERT OR IGNORE INTO user_narrative_progress (user_id, floor_number)
         VALUES (?, 1)",
        params![user_id],
    )
    .map_err(|e| format!("Failed to initialize narrative progress: {}", e))?;

    conn.query_row(
        "SELECT user_id, floor_number, current_location_id, visited_locations, completed_choices,
                story_flags, last_roll, last_skill_type, last_skill_dc, last_modifier,
                last_challenge_success, total_skill_checks, successful_skill_checks,
                created_at, updated_at
         FROM user_narrative_progress
         WHERE user_id = ?",
        params![user_id],
        UserNarrativeProgress::from_row,
    )
    .map_err(|e| format!("Failed to get narrative progress: {}", e))
}

#[tauri::command]
pub fn get_narrative_location(
    app: AppHandle,
    location_id: String,
) -> Result<NarrativeLocation, String> {
    let conn = get_connection(&app)?;

    conn.query_row(
        "SELECT id, floor_number, name, description, location_type, is_repeatable, icon, created_at
         FROM narrative_locations
         WHERE id = ?",
        params![location_id],
        NarrativeLocation::from_row,
    )
    .map_err(|e| format!("Failed to get location: {}", e))
}

#[tauri::command]
pub fn get_location_choices(
    app: AppHandle,
    location_id: String,
    user_id: i64,
) -> Result<Vec<NarrativeChoice>, String> {
    let conn = get_connection(&app)?;

    // Get user's story flags
    let progress = get_user_narrative_progress(app.clone(), user_id)?;
    let story_flags: serde_json::Value = if let Some(flags_str) = progress.story_flags {
        serde_json::from_str(&flags_str).unwrap_or(serde_json::json!({}))
    } else {
        serde_json::json!({})
    };

    // Get all choices for this location
    let mut stmt = conn
        .prepare(
            "SELECT id, location_id, choice_text, requires_skill_check, skill_type, skill_dc,
                    challenge_action_type, display_order, icon, requires_flag, created_at
             FROM narrative_choices
             WHERE location_id = ?
             ORDER BY display_order",
        )
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    let choices = stmt
        .query_map(params![location_id], NarrativeChoice::from_row)
        .map_err(|e| format!("Failed to query choices: {}", e))?
        .collect::<SqlResult<Vec<NarrativeChoice>>>()
        .map_err(|e| format!("Failed to collect choices: {}", e))?;

    // Filter choices based on requirements
    let available_choices: Vec<NarrativeChoice> = choices
        .into_iter()
        .filter(|choice| {
            // Check if choice requires specific flags
            if let Some(ref requires_flag_str) = choice.requires_flag {
                if let Ok(required_flags) = serde_json::from_str::<serde_json::Value>(requires_flag_str) {
                    if let Some(required_obj) = required_flags.as_object() {
                        // Check if user has all required flags with correct values
                        for (key, required_value) in required_obj {
                            if story_flags.get(key) != Some(required_value) {
                                return false;
                            }
                        }
                    }
                }
            }
            true
        })
        .collect();

    Ok(available_choices)
}

#[tauri::command]
pub fn start_narrative_dungeon(
    app: AppHandle,
    user_id: i64,
    floor_number: i64,
) -> Result<(NarrativeLocation, UserNarrativeProgress), String> {
    let conn = get_connection(&app)?;

    // Find the starting location for this floor
    let start_location: NarrativeLocation = conn
        .query_row(
            "SELECT id, floor_number, name, description, location_type, is_repeatable, icon, created_at
             FROM narrative_locations
             WHERE floor_number = ? AND location_type = 'start'
             LIMIT 1",
            params![floor_number],
            NarrativeLocation::from_row,
        )
        .map_err(|e| format!("Failed to find starting location: {}", e))?;

    // Initialize user's narrative progress
    let visited_locations_json = serde_json::to_string(&vec![start_location.id.clone()])
        .unwrap_or_else(|_| "[]".to_string());

    conn.execute(
        "UPDATE user_narrative_progress
         SET floor_number = ?,
             current_location_id = ?,
             visited_locations = ?,
             story_flags = '{}',
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?",
        params![
            floor_number,
            start_location.id,
            visited_locations_json,
            user_id
        ],
    )
    .map_err(|e| format!("Failed to initialize narrative progress: {}", e))?;

    let progress = get_user_narrative_progress(app, user_id)?;

    Ok((start_location, progress))
}

#[tauri::command]
pub fn resolve_skill_check(
    app: AppHandle,
    user_id: i64,
    choice_id: String,
    dice_roll: i64,
    stat_modifier: i64,
    challenge_success: bool,
) -> Result<SkillCheckResult, String> {
    let conn = get_connection(&app)?;

    // Get the choice to get skill DC
    let choice: NarrativeChoice = conn
        .query_row(
            "SELECT id, location_id, choice_text, requires_skill_check, skill_type, skill_dc,
                    challenge_action_type, display_order, icon, requires_flag, created_at
             FROM narrative_choices
             WHERE id = ?",
            params![choice_id],
            NarrativeChoice::from_row,
        )
        .map_err(|e| format!("Failed to get choice: {}", e))?;

    let dc = choice.skill_dc.unwrap_or(10);
    let applied_modifier = if challenge_success { stat_modifier } else { 0 };
    let total_roll = dice_roll + applied_modifier;
    let check_passed = total_roll >= dc;

    // Determine outcome type
    let outcome_type = if dice_roll == 20 {
        "critical_success".to_string()
    } else if dice_roll == 1 {
        "critical_failure".to_string()
    } else if check_passed {
        "success".to_string()
    } else {
        "failure".to_string()
    };

    // Get the appropriate outcome
    let outcome: NarrativeOutcome = conn
        .query_row(
            "SELECT id, choice_id, outcome_type, description, next_location_id, rewards, penalties,
                    sets_flags, triggers_combat, enemy_id, enemy_count, created_at
             FROM narrative_outcomes
             WHERE choice_id = ? AND outcome_type = ?
             LIMIT 1",
            params![choice_id, outcome_type],
            NarrativeOutcome::from_row,
        )
        .or_else(|_| {
            // Fallback to basic success/failure if specific outcome not found
            let fallback_type = if check_passed { "success" } else { "failure" };
            conn.query_row(
                "SELECT id, choice_id, outcome_type, description, next_location_id, rewards, penalties,
                        sets_flags, triggers_combat, enemy_id, enemy_count, created_at
                 FROM narrative_outcomes
                 WHERE choice_id = ? AND outcome_type = ?
                 LIMIT 1",
                params![choice_id, fallback_type],
                NarrativeOutcome::from_row,
            )
        })
        .map_err(|e| format!("Failed to get outcome: {}", e))?;

    // Update user's narrative progress with skill check details
    conn.execute(
        "UPDATE user_narrative_progress
         SET last_roll = ?,
             last_skill_type = ?,
             last_skill_dc = ?,
             last_modifier = ?,
             last_challenge_success = ?,
             total_skill_checks = total_skill_checks + 1,
             successful_skill_checks = successful_skill_checks + ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?",
        params![
            dice_roll,
            choice.skill_type,
            dc,
            applied_modifier,
            challenge_success,
            if check_passed { 1 } else { 0 },
            user_id
        ],
    )
    .map_err(|e| format!("Failed to update progress: {}", e))?;

    // Record skill check in history
    conn.execute(
        "INSERT INTO skill_check_history (user_id, choice_id, skill_type, skill_dc, dice_roll,
                                          stat_modifier, challenge_success, total_roll, check_passed, outcome_type)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        params![
            user_id,
            choice_id,
            choice.skill_type.unwrap_or_default(),
            dc,
            dice_roll,
            stat_modifier,
            challenge_success,
            total_roll,
            check_passed,
            outcome_type
        ],
    )
    .map_err(|e| format!("Failed to record skill check: {}", e))?;

    // Apply the outcome (rewards/penalties/flags)
    log::info!("Applying skill check outcome for user {}", user_id);
    apply_narrative_outcome(app, user_id, outcome.clone())?;

    Ok(SkillCheckResult {
        dice_roll,
        stat_modifier,
        challenge_success,
        applied_modifier,
        total_roll,
        dc,
        check_passed,
        outcome_type,
        outcome,
    })
}

#[tauri::command]
pub fn apply_narrative_outcome(
    app: AppHandle,
    user_id: i64,
    outcome: NarrativeOutcome,
) -> Result<UserNarrativeProgress, String> {
    let conn = get_connection(&app)?;

    // Get current progress
    let progress = get_user_narrative_progress(app.clone(), user_id)?;

    // Check if this choice/outcome has already been completed (to prevent reward farming)
    let mut completed_choices: Vec<String> = if let Some(ref completed_str) = progress.completed_choices {
        serde_json::from_str(completed_str).unwrap_or_default()
    } else {
        Vec::new()
    };

    // Use the outcome ID to track completion (more granular than choice_id)
    let outcome_key = format!("{}:{}", outcome.choice_id, outcome.outcome_type);
    let already_completed = completed_choices.contains(&outcome_key);

    // Update current location if outcome leads somewhere
    if let Some(ref next_location_id) = outcome.next_location_id {
        // Add to visited locations
        let mut visited: Vec<String> = if let Some(ref visited_str) = progress.visited_locations {
            serde_json::from_str(visited_str).unwrap_or_default()
        } else {
            Vec::new()
        };

        if !visited.contains(next_location_id) {
            visited.push(next_location_id.clone());
        }

        // Update story flags if any
        let mut flags: serde_json::Value = if let Some(ref flags_str) = progress.story_flags {
            serde_json::from_str(flags_str).unwrap_or(serde_json::json!({}))
        } else {
            serde_json::json!({})
        };

        if let Some(ref sets_flags_str) = outcome.sets_flags {
            if let Ok(new_flags) = serde_json::from_str::<serde_json::Value>(sets_flags_str) {
                if let Some(new_flags_obj) = new_flags.as_object() {
                    if let Some(flags_obj) = flags.as_object_mut() {
                        for (key, value) in new_flags_obj {
                            flags_obj.insert(key.clone(), value.clone());
                        }
                    }
                }
            }
        }

        // Mark this outcome as completed
        if !already_completed {
            completed_choices.push(outcome_key.clone());
        }

        // Update database - use unwrap_or_else for safe JSON serialization
        let visited_json = serde_json::to_string(&visited).unwrap_or_else(|_| "[]".to_string());
        let completed_json = serde_json::to_string(&completed_choices).unwrap_or_else(|_| "[]".to_string());
        let flags_json = serde_json::to_string(&flags).unwrap_or_else(|_| "{}".to_string());

        conn.execute(
            "UPDATE user_narrative_progress
             SET current_location_id = ?,
                 visited_locations = ?,
                 completed_choices = ?,
                 story_flags = ?,
                 updated_at = CURRENT_TIMESTAMP
             WHERE user_id = ?",
            params![
                next_location_id,
                visited_json,
                completed_json,
                flags_json,
                user_id
            ],
        )
        .map_err(|e| format!("Failed to update location: {}", e))?;
    } else if !already_completed {
        // Even if no next location, mark the outcome as completed
        completed_choices.push(outcome_key.clone());
        let completed_json = serde_json::to_string(&completed_choices).unwrap_or_else(|_| "[]".to_string());

        conn.execute(
            "UPDATE user_narrative_progress
             SET completed_choices = ?,
                 updated_at = CURRENT_TIMESTAMP
             WHERE user_id = ?",
            params![
                completed_json,
                user_id
            ],
        )
        .map_err(|e| format!("Failed to update completed choices: {}", e))?;
    }

    // Only apply rewards if this is the FIRST time completing this outcome
    // This prevents players from farming rewards by revisiting locations
    if !already_completed {
        // Apply rewards if any
        if let Some(ref rewards_str) = outcome.rewards {
            log::info!("Applying rewards (first time): {}", rewards_str);
            if let Ok(rewards) = serde_json::from_str::<serde_json::Value>(rewards_str) {
                // Award gold to BOTH dungeon currency and gamification currency
                if let Some(gold) = rewards.get("gold").and_then(|v| v.as_i64()) {
                    log::info!("Awarding {} gold to user {}", gold, user_id);

                    // Award to dungeon gold (character_stats.current_gold) for dungeon shop
                    conn.execute(
                        "UPDATE character_stats
                         SET current_gold = current_gold + ?,
                             updated_at = CURRENT_TIMESTAMP
                         WHERE user_id = ?",
                        params![gold, user_id],
                    )
                    .map_err(|e| format!("Failed to award dungeon gold: {}", e))?;

                    // Also award to gamification gold for tracking
                    let rows_affected = conn.execute(
                        "UPDATE user_currency
                         SET gold = gold + ?,
                             lifetime_gold_earned = lifetime_gold_earned + ?
                         WHERE user_id = ?",
                        params![gold, gold, user_id],
                    )
                    .map_err(|e| format!("Failed to award gamification gold: {}", e))?;
                    log::info!("Gold awarded, rows affected: {}", rows_affected);
                }

                // Award XP and apply leveling
                if let Some(xp) = rewards.get("xp").and_then(|v| v.as_i64()) {
                    log::info!("Awarding {} XP to user {}", xp, user_id);

                    // Get current level and XP
                    let (current_level, current_xp): (i64, i64) = conn
                        .query_row(
                            "SELECT level, COALESCE((SELECT total_xp_earned FROM user_dungeon_progress WHERE user_id = ?), 0)
                             FROM character_stats WHERE user_id = ?",
                            params![user_id, user_id],
                            |row| Ok((row.get(0)?, row.get(1)?)),
                        )
                        .unwrap_or((1, 0));

                    // Update dungeon progress XP tracking
                    conn.execute(
                        "UPDATE user_dungeon_progress
                         SET total_xp_earned = total_xp_earned + ?
                         WHERE user_id = ?",
                        params![xp, user_id],
                    )
                    .map_err(|e| format!("Failed to award XP: {}", e))?;

                    // Calculate level ups (100 XP per level)
                    let new_total_xp = current_xp + xp;
                    let mut new_level = current_level;
                    let mut xp_remaining = new_total_xp;
                    let mut levels_gained = 0i64;

                    while xp_remaining >= new_level * 100 {
                        xp_remaining -= new_level * 100;
                        new_level += 1;
                        levels_gained += 1;
                    }

                    // Apply level up if we gained levels
                    if levels_gained > 0 {
                        // Each level grants stat points - player chooses how to spend them
                        let stat_points_gained = levels_gained;

                        conn.execute(
                            "UPDATE character_stats
                             SET level = ?,
                                 stat_points_available = stat_points_available + ?,
                                 updated_at = CURRENT_TIMESTAMP
                             WHERE user_id = ?",
                            params![new_level, stat_points_gained, user_id],
                        )
                        .map_err(|e| format!("Failed to apply level up: {}", e))?;

                        log::info!(
                            "User {} leveled up from narrative reward! {} -> {} (+{} stat points)",
                            user_id, current_level, new_level, stat_points_gained
                        );
                    }
                }

                // Handle healing (always apply, not a farmable reward)
                if let Some(heal) = rewards.get("heal") {
                    if heal == "full" {
                        conn.execute(
                            "UPDATE character_stats
                             SET current_health = max_health
                             WHERE user_id = ?",
                            params![user_id],
                        )
                        .map_err(|e| format!("Failed to heal: {}", e))?;
                    } else if let Some(heal_amount) = heal.as_i64() {
                        conn.execute(
                            "UPDATE character_stats
                             SET current_health = MIN(current_health + ?, max_health)
                             WHERE user_id = ?",
                            params![heal_amount, user_id],
                        )
                        .map_err(|e| format!("Failed to heal: {}", e))?;
                    }
                }

                // Handle item rewards
                if let Some(items) = rewards.get("items").and_then(|v| v.as_array()) {
                    for item_value in items {
                        if let Some(item_id) = item_value.as_str() {
                            // Try consumable first
                            let is_consumable: bool = conn
                                .query_row(
                                    "SELECT EXISTS(SELECT 1 FROM consumable_items WHERE id = ?)",
                                    params![item_id],
                                    |row| row.get(0),
                                )
                                .unwrap_or(false);

                            if is_consumable {
                                conn.execute(
                                    "INSERT INTO user_consumable_inventory (user_id, consumable_id, quantity, acquired_at)
                                     VALUES (?, ?, 1, CURRENT_TIMESTAMP)
                                     ON CONFLICT(user_id, consumable_id) DO UPDATE SET
                                         quantity = quantity + 1",
                                    params![user_id, item_id],
                                )
                                .map_err(|e| format!("Failed to add consumable: {}", e))?;
                                log::info!("User {} received consumable: {}", user_id, item_id);
                            } else {
                                // Try equipment
                                let is_equipment: bool = conn
                                    .query_row(
                                        "SELECT EXISTS(SELECT 1 FROM equipment_items WHERE id = ?)",
                                        params![item_id],
                                        |row| row.get(0),
                                    )
                                    .unwrap_or(false);

                                if is_equipment {
                                    let existing: Option<i64> = conn
                                        .query_row(
                                            "SELECT quantity FROM user_equipment_inventory
                                             WHERE user_id = ? AND equipment_id = ?",
                                            params![user_id, item_id],
                                            |row| row.get(0),
                                        )
                                        .ok();

                                    if existing.is_some() {
                                        conn.execute(
                                            "UPDATE user_equipment_inventory
                                             SET quantity = quantity + 1
                                             WHERE user_id = ? AND equipment_id = ?",
                                            params![user_id, item_id],
                                        )
                                        .map_err(|e| format!("Failed to update equipment: {}", e))?;
                                    } else {
                                        conn.execute(
                                            "INSERT INTO user_equipment_inventory (user_id, equipment_id, quantity, acquired_at)
                                             VALUES (?, ?, 1, CURRENT_TIMESTAMP)",
                                            params![user_id, item_id],
                                        )
                                        .map_err(|e| format!("Failed to add equipment: {}", e))?;
                                    }
                                    log::info!("User {} received equipment: {}", user_id, item_id);
                                }
                            }
                        }
                    }
                }
            }
        }
    } else {
        log::info!("Outcome {} already completed by user {}, skipping rewards", outcome_key, user_id);
    }

    // Penalties are ALWAYS applied (they're punishments, not rewards to farm)
    if let Some(ref penalties_str) = outcome.penalties {
        log::info!("Applying penalties: {}", penalties_str);
        if let Ok(penalties) = serde_json::from_str::<serde_json::Value>(penalties_str) {
            // Apply damage
            if let Some(damage) = penalties.get("damage").and_then(|v| v.as_i64()) {
                log::info!("Applying {} damage to user {}", damage, user_id);
                let rows_affected = conn.execute(
                    "UPDATE character_stats
                     SET current_health = MAX(0, current_health - ?)
                     WHERE user_id = ?",
                    params![damage, user_id],
                )
                .map_err(|e| format!("Failed to apply damage: {}", e))?;
                log::info!("Damage applied, rows affected: {}", rows_affected);
                if rows_affected == 0 {
                    log::warn!("No character_stats row found for user {}! Damage was not applied.", user_id);
                }
            }

            // Lose gold (if specified)
            if let Some(gold_lost) = penalties.get("gold").and_then(|v| v.as_i64()) {
                log::info!("Removing {} gold from user {}", gold_lost, user_id);
                conn.execute(
                    "UPDATE character_stats
                     SET current_gold = MAX(0, current_gold - ?)
                     WHERE user_id = ?",
                    params![gold_lost, user_id],
                )
                .map_err(|e| format!("Failed to remove dungeon gold: {}", e))?;
                conn.execute(
                    "UPDATE user_currency
                     SET gold = MAX(0, gold - ?)
                     WHERE user_id = ?",
                    params![gold_lost, user_id],
                )
                .map_err(|e| format!("Failed to remove gamification gold: {}", e))?;
            }
        }
    }

    get_user_narrative_progress(app, user_id)
}

#[tauri::command]
pub fn make_simple_choice(
    app: AppHandle,
    user_id: i64,
    choice_id: String,
) -> Result<(NarrativeOutcome, UserNarrativeProgress), String> {
    let conn = get_connection(&app)?;

    // Get the default outcome for this choice (non-skill check choices have outcome_type 'default')
    let outcome: NarrativeOutcome = conn
        .query_row(
            "SELECT id, choice_id, outcome_type, description, next_location_id, rewards, penalties,
                    sets_flags, triggers_combat, enemy_id, enemy_count, created_at
             FROM narrative_outcomes
             WHERE choice_id = ? AND outcome_type = 'default'
             LIMIT 1",
            params![choice_id],
            NarrativeOutcome::from_row,
        )
        .map_err(|e| format!("Failed to get outcome: {}", e))?;

    // Apply the outcome
    let progress = apply_narrative_outcome(app, user_id, outcome.clone())?;

    Ok((outcome, progress))
}

#[tauri::command]
pub fn get_outcome_by_type(
    app: AppHandle,
    user_id: i64,
    choice_id: String,
    outcome_type: String,
) -> Result<(NarrativeOutcome, UserNarrativeProgress), String> {
    let conn = get_connection(&app)?;

    // Get the outcome for this choice with the specified outcome type
    let outcome: NarrativeOutcome = conn
        .query_row(
            "SELECT id, choice_id, outcome_type, description, next_location_id, rewards, penalties,
                    sets_flags, triggers_combat, enemy_id, enemy_count, created_at
             FROM narrative_outcomes
             WHERE choice_id = ? AND outcome_type = ?
             LIMIT 1",
            params![choice_id, outcome_type],
            NarrativeOutcome::from_row,
        )
        .map_err(|e| format!("Failed to get outcome for choice {} with type {}: {}", choice_id, outcome_type, e))?;

    // Apply the outcome
    let progress = apply_narrative_outcome(app, user_id, outcome.clone())?;

    Ok((outcome, progress))
}
