use rusqlite::{params, Connection, Result};
use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use crate::db;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Achievement {
    pub id: String,
    pub category_id: String,
    pub name: String,
    pub description: String,
    pub icon: String,
    pub tier: String,
    pub requirement_type: String,
    pub requirement_value: Option<i32>,
    pub requirement_data: Option<String>,
    pub xp_reward: i32,
    pub gold_reward: i32,
    pub gem_reward: i32,
    pub unlock_item_id: Option<String>,
    pub unlock_item_type: Option<String>,
    pub is_secret: bool,
    pub required_level: i32,
    pub required_achievement_id: Option<String>,
    pub display_order: i32,
    pub is_repeatable: bool,
    pub tracking_key: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UserAchievementProgress {
    pub achievement_id: String,
    pub current_progress: i32,
    pub completed: bool,
    pub completed_at: Option<String>,
    pub times_completed: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AchievementWithProgress {
    #[serde(flatten)]
    pub achievement: Achievement,
    pub progress: Option<UserAchievementProgress>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AchievementStats {
    pub total_achievements: i32,
    pub completed_achievements: i32,
    pub completion_percentage: f32,
    pub total_xp_earned: i32,
    pub total_gold_earned: i32,
    pub total_gems_earned: i32,
    pub by_tier: TierStats,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TierStats {
    pub bronze_completed: i32,
    pub silver_completed: i32,
    pub gold_completed: i32,
    pub platinum_completed: i32,
    pub secret_completed: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AchievementNotification {
    pub id: i32,
    pub achievement_id: String,
    pub achievement: Achievement,
}

/// Get all achievements with user progress
#[tauri::command]
pub fn get_achievements(
    app: AppHandle,
    user_id: i32,
    category_filter: Option<String>,
    tier_filter: Option<String>,
    completion_filter: Option<String>, // 'all', 'completed', 'locked'
) -> Result<Vec<AchievementWithProgress>, String> {
    let conn = db::get_connection(&app)?;

    let mut query = String::from(
        "SELECT
            a.id, a.category_id, a.name, a.description, a.icon, a.tier,
            a.requirement_type, a.requirement_value, a.requirement_data,
            a.xp_reward, a.gold_reward, a.gem_reward,
            a.unlock_item_id, a.unlock_item_type,
            a.is_secret, a.required_level, a.required_achievement_id,
            a.display_order, a.is_repeatable, a.tracking_key,
            p.current_progress, p.completed, p.completed_at, p.times_completed
        FROM achievements a
        LEFT JOIN user_achievement_progress p ON a.id = p.achievement_id AND p.user_id = ?1
        WHERE 1=1"
    );

    if let Some(category) = &category_filter {
        query.push_str(&format!(" AND a.category_id = '{}'", category));
    }

    if let Some(tier) = &tier_filter {
        query.push_str(&format!(" AND a.tier = '{}'", tier));
    }

    query.push_str(" ORDER BY a.category_id, a.display_order");

    let mut stmt = conn.prepare(&query).map_err(|e| e.to_string())?;

    let achievements = stmt
        .query_map([user_id], |row| {
            let achievement = Achievement {
                id: row.get(0)?,
                category_id: row.get(1)?,
                name: row.get(2)?,
                description: row.get(3)?,
                icon: row.get(4)?,
                tier: row.get(5)?,
                requirement_type: row.get(6)?,
                requirement_value: row.get(7)?,
                requirement_data: row.get(8)?,
                xp_reward: row.get(9)?,
                gold_reward: row.get(10)?,
                gem_reward: row.get(11)?,
                unlock_item_id: row.get(12)?,
                unlock_item_type: row.get(13)?,
                is_secret: row.get(14)?,
                required_level: row.get(15)?,
                required_achievement_id: row.get(16)?,
                display_order: row.get(17)?,
                is_repeatable: row.get(18)?,
                tracking_key: row.get(19)?,
            };

            let progress = if row.get::<_, Option<i32>>(20)?.is_some() {
                Some(UserAchievementProgress {
                    achievement_id: achievement.id.clone(),
                    current_progress: row.get(20)?,
                    completed: row.get(21)?,
                    completed_at: row.get(22)?,
                    times_completed: row.get(23)?,
                })
            } else {
                None
            };

            Ok(AchievementWithProgress {
                achievement,
                progress,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>>>()
        .map_err(|e| e.to_string())?;

    // Apply completion filter
    let filtered = match completion_filter.as_deref() {
        Some("completed") => achievements
            .into_iter()
            .filter(|a| a.progress.as_ref().map_or(false, |p| p.completed))
            .collect(),
        Some("locked") => achievements
            .into_iter()
            .filter(|a| !a.progress.as_ref().map_or(false, |p| p.completed))
            .collect(),
        _ => achievements,
    };

    Ok(filtered)
}

/// Get achievement statistics for a user
#[tauri::command]
pub fn get_achievement_stats(
    app: AppHandle,
    user_id: i32,
) -> Result<AchievementStats, String> {
    let conn = db::get_connection(&app)?;

    // Total achievements
    let total_achievements: i32 = conn
        .query_row(
            "SELECT COUNT(*) FROM achievements WHERE is_secret = FALSE",
            [],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    // Completed achievements
    let completed_achievements: i32 = conn
        .query_row(
            "SELECT COUNT(*) FROM user_achievement_progress
             WHERE user_id = ?1 AND completed = TRUE",
            [user_id],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    let completion_percentage = if total_achievements > 0 {
        (completed_achievements as f32 / total_achievements as f32) * 100.0
    } else {
        0.0
    };

    // Total rewards earned from achievements
    let rewards: (i32, i32, i32) = conn
        .query_row(
            "SELECT
                COALESCE(SUM(a.xp_reward), 0),
                COALESCE(SUM(a.gold_reward), 0),
                COALESCE(SUM(a.gem_reward), 0)
             FROM achievements a
             JOIN user_achievement_progress p ON a.id = p.achievement_id
             WHERE p.user_id = ?1 AND p.completed = TRUE",
            [user_id],
            |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?)),
        )
        .map_err(|e| e.to_string())?;

    // By tier stats
    let mut stmt = conn
        .prepare(
            "SELECT a.tier, COUNT(*)
             FROM achievements a
             JOIN user_achievement_progress p ON a.id = p.achievement_id
             WHERE p.user_id = ?1 AND p.completed = TRUE
             GROUP BY a.tier",
        )
        .map_err(|e| e.to_string())?;

    let tier_stats: Vec<(String, i32)> = stmt
        .query_map([user_id], |row| Ok((row.get(0)?, row.get(1)?)))
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>>>()
        .map_err(|e| e.to_string())?;

    let mut by_tier = TierStats {
        bronze_completed: 0,
        silver_completed: 0,
        gold_completed: 0,
        platinum_completed: 0,
        secret_completed: 0,
    };

    for (tier, count) in tier_stats {
        match tier.as_str() {
            "bronze" => by_tier.bronze_completed = count,
            "silver" => by_tier.silver_completed = count,
            "gold" => by_tier.gold_completed = count,
            "platinum" => by_tier.platinum_completed = count,
            "secret" => by_tier.secret_completed = count,
            _ => {}
        }
    }

    Ok(AchievementStats {
        total_achievements,
        completed_achievements,
        completion_percentage,
        total_xp_earned: rewards.0,
        total_gold_earned: rewards.1,
        total_gems_earned: rewards.2,
        by_tier,
    })
}

/// Update achievement progress by tracking key
#[tauri::command]
pub fn update_achievement_progress(
    app: AppHandle,
    user_id: i32,
    tracking_key: String,
    increment: i32,
) -> Result<Vec<String>, String> {
    let mut conn = db::get_connection(&app)?;
    let tx = conn.transaction().map_err(|e| e.to_string())?;

    // Update the user_achievement_stats table
    let update_query = format!(
        "UPDATE user_achievement_stats SET {} = {} + ?1, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?2",
        tracking_key, tracking_key
    );

    tx.execute(&update_query, params![increment, user_id])
        .map_err(|e| e.to_string())?;

    // Get the new value
    let new_value: i32 = tx
        .query_row(
            &format!("SELECT {} FROM user_achievement_stats WHERE user_id = ?1", tracking_key),
            [user_id],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    // Find achievements that use this tracking key
    let mut stmt = tx
        .prepare(
            "SELECT id, requirement_value FROM achievements
             WHERE tracking_key = ?1 AND requirement_type = 'count'",
        )
        .map_err(|e| e.to_string())?;

    let achievements: Vec<(String, i32)> = stmt
        .query_map([&tracking_key], |row| Ok((row.get(0)?, row.get(1)?)))
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>>>()
        .map_err(|e| e.to_string())?;

    drop(stmt); // Explicitly drop the statement before using tx again

    let mut newly_completed = Vec::new();

    for (achievement_id, requirement_value) in achievements {
        // Check if already completed
        let already_completed: bool = tx
            .query_row(
                "SELECT COALESCE(completed, FALSE) FROM user_achievement_progress
                 WHERE user_id = ?1 AND achievement_id = ?2",
                params![user_id, &achievement_id],
                |row| row.get(0),
            )
            .unwrap_or(false);

        if !already_completed {
            // Insert or update progress
            tx.execute(
                "INSERT INTO user_achievement_progress (user_id, achievement_id, current_progress, completed, last_updated_at)
                 VALUES (?1, ?2, ?3, ?4, CURRENT_TIMESTAMP)
                 ON CONFLICT (user_id, achievement_id) DO UPDATE SET
                 current_progress = ?3,
                 completed = ?4,
                 last_updated_at = CURRENT_TIMESTAMP",
                params![user_id, &achievement_id, new_value, new_value >= requirement_value],
            )
            .map_err(|e| e.to_string())?;

            // Check if just completed
            if new_value >= requirement_value {
                // Mark as completed and set completion time
                tx.execute(
                    "UPDATE user_achievement_progress
                     SET completed = TRUE, completed_at = CURRENT_TIMESTAMP, times_completed = times_completed + 1
                     WHERE user_id = ?1 AND achievement_id = ?2",
                    params![user_id, &achievement_id],
                )
                .map_err(|e| e.to_string())?;

                // Create notification
                tx.execute(
                    "INSERT INTO achievement_notifications (user_id, achievement_id) VALUES (?1, ?2)",
                    params![user_id, &achievement_id],
                )
                .map_err(|e| e.to_string())?;

                newly_completed.push(achievement_id);
            }
        }
    }

    tx.commit().map_err(|e| e.to_string())?;

    Ok(newly_completed)
}

/// Get pending achievement notifications
#[tauri::command]
pub fn get_pending_achievement_notifications(
    app: AppHandle,
    user_id: i32,
) -> Result<Vec<AchievementNotification>, String> {
    let conn = db::get_connection(&app)?;

    let mut stmt = conn
        .prepare(
            "SELECT
                n.id, n.achievement_id,
                a.id, a.category_id, a.name, a.description, a.icon, a.tier,
                a.requirement_type, a.requirement_value, a.requirement_data,
                a.xp_reward, a.gold_reward, a.gem_reward,
                a.unlock_item_id, a.unlock_item_type,
                a.is_secret, a.required_level, a.required_achievement_id,
                a.display_order, a.is_repeatable, a.tracking_key
             FROM achievement_notifications n
             JOIN achievements a ON n.achievement_id = a.id
             WHERE n.user_id = ?1 AND n.shown = FALSE
             ORDER BY n.created_at ASC
             LIMIT 5",
        )
        .map_err(|e| e.to_string())?;

    let notifications = stmt
        .query_map([user_id], |row| {
            Ok(AchievementNotification {
                id: row.get(0)?,
                achievement_id: row.get(1)?,
                achievement: Achievement {
                    id: row.get(2)?,
                    category_id: row.get(3)?,
                    name: row.get(4)?,
                    description: row.get(5)?,
                    icon: row.get(6)?,
                    tier: row.get(7)?,
                    requirement_type: row.get(8)?,
                    requirement_value: row.get(9)?,
                    requirement_data: row.get(10)?,
                    xp_reward: row.get(11)?,
                    gold_reward: row.get(12)?,
                    gem_reward: row.get(13)?,
                    unlock_item_id: row.get(14)?,
                    unlock_item_type: row.get(15)?,
                    is_secret: row.get(16)?,
                    required_level: row.get(17)?,
                    required_achievement_id: row.get(18)?,
                    display_order: row.get(19)?,
                    is_repeatable: row.get(20)?,
                    tracking_key: row.get(21)?,
                },
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>>>()
        .map_err(|e| e.to_string())?;

    Ok(notifications)
}

/// Mark achievement notification as shown
#[tauri::command]
pub fn mark_achievement_notification_shown(
    app: AppHandle,
    notification_id: i32,
) -> Result<(), String> {
    let conn = db::get_connection(&app)?;

    conn.execute(
        "UPDATE achievement_notifications SET shown = TRUE, shown_at = CURRENT_TIMESTAMP WHERE id = ?1",
        [notification_id],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

/// Claim achievement rewards
#[tauri::command]
pub fn claim_achievement_rewards(
    app: AppHandle,
    user_id: i32,
    achievement_id: String,
) -> Result<(), String> {
    let mut conn = db::get_connection(&app)?;
    let tx = conn.transaction().map_err(|e| e.to_string())?;

    // Check if already claimed
    let already_claimed: bool = tx
        .query_row(
            "SELECT EXISTS(SELECT 1 FROM achievement_rewards_claimed WHERE user_id = ?1 AND achievement_id = ?2)",
            params![user_id, &achievement_id],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    if already_claimed {
        return Err("Rewards already claimed".to_string());
    }

    // Get achievement rewards
    let rewards: (i32, i32, i32) = tx
        .query_row(
            "SELECT xp_reward, gold_reward, gem_reward FROM achievements WHERE id = ?1",
            [&achievement_id],
            |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?)),
        )
        .map_err(|e| e.to_string())?;

    // Add XP (assuming there's a user stats table)
    // TODO: Add XP to user stats

    // Add currency
    if rewards.1 > 0 {
        tx.execute(
            "UPDATE user_currency SET gold = gold + ?1, lifetime_gold_earned = lifetime_gold_earned + ?1 WHERE user_id = ?2",
            params![rewards.1, user_id],
        )
        .map_err(|e| e.to_string())?;
    }

    if rewards.2 > 0 {
        tx.execute(
            "UPDATE user_currency SET gems = gems + ?1, lifetime_gems_earned = lifetime_gems_earned + ?1 WHERE user_id = ?2",
            params![rewards.2, user_id],
        )
        .map_err(|e| e.to_string())?;
    }

    // Mark rewards as claimed
    tx.execute(
        "INSERT INTO achievement_rewards_claimed (user_id, achievement_id, xp_claimed, gold_claimed, gem_claimed, item_claimed)
         VALUES (?1, ?2, ?3, ?4, ?5, FALSE)",
        params![user_id, &achievement_id, rewards.0, rewards.1, rewards.2],
    )
    .map_err(|e| e.to_string())?;

    tx.commit().map_err(|e| e.to_string())?;

    Ok(())
}

/// Initialize achievement stats for a user
pub fn initialize_achievement_stats(conn: &Connection, user_id: i32) -> Result<()> {
    conn.execute(
        "INSERT OR IGNORE INTO user_achievement_stats (user_id) VALUES (?1)",
        [user_id],
    )?;
    Ok(())
}
