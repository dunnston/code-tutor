use rusqlite::{params, Result as SqliteResult};
use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use crate::db;

// ============================================================================
// TYPES - Currency
// ============================================================================

#[derive(Debug, Serialize, Deserialize)]
pub struct UserCurrency {
    pub user_id: i64,
    pub gold: i64,
    pub gems: i64,
    pub lifetime_gold_earned: i64,
    pub lifetime_gems_earned: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CurrencyTransaction {
    pub id: i64,
    pub user_id: i64,
    pub currency_type: String,
    pub amount: i64,
    pub reason: String,
    pub reference_id: Option<String>,
    pub balance_after: i64,
    pub created_at: String,
}

// ============================================================================
// TYPES - Shop & Inventory
// ============================================================================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ShopItem {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub category: String,
    pub item_type: String,
    pub cost_gold: i64,
    pub cost_gems: i64,
    pub required_level: i64,
    pub is_limited_time: bool,
    pub available_until: Option<String>,
    pub stock_limit: Option<i64>,
    pub effects: String,
    pub icon: Option<String>,
    pub rarity: Option<String>,
    pub is_consumable: bool,
    pub max_stack: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct InventoryItem {
    pub id: i64,
    pub user_id: i64,
    pub item_id: String,
    pub quantity: i64,
    pub acquired_at: String,
    pub item: ShopItem,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PurchaseHistory {
    pub id: i64,
    pub user_id: i64,
    pub item_id: String,
    pub quantity: i64,
    pub cost_gold: i64,
    pub cost_gems: i64,
    pub purchased_at: String,
}

// ============================================================================
// TYPES - Quests
// ============================================================================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Quest {
    pub id: String,
    pub quest_type: String,
    pub title: String,
    pub description: Option<String>,
    pub objective_type: String,
    pub objective_target: i64,
    pub reward_xp: i64,
    pub reward_gold: i64,
    pub reward_gems: i64,
    pub reward_item_id: Option<String>,
    pub icon: Option<String>,
    pub order_index: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserQuestProgress {
    pub id: i64,
    pub user_id: i64,
    pub quest_id: String,
    pub progress: i64,
    pub completed: bool,
    pub completed_at: Option<String>,
    pub quest: Quest,
}

// ============================================================================
// TYPES - Active Effects
// ============================================================================

#[derive(Debug, Serialize, Deserialize)]
pub struct ActiveEffect {
    pub id: i64,
    pub user_id: i64,
    pub effect_type: String,
    pub effect_value: f64,
    pub started_at: String,
    pub expires_at: Option<String>,
    pub source_item_id: Option<String>,
    pub metadata: Option<String>,
}

// ============================================================================
// TYPES - Level Rewards
// ============================================================================

#[derive(Debug, Serialize, Deserialize)]
pub struct LevelReward {
    pub level: i64,
    pub xp_required: i64,
    pub reward_gold: i64,
    pub reward_gems: i64,
    pub reward_items: Option<String>,
    pub unlocks_feature: Option<String>,
    pub unlocks_category: Option<String>,
    pub title: Option<String>,
    pub description: Option<String>,
    pub icon: Option<String>,
}

// ============================================================================
// USER COMMANDS
// ============================================================================

#[tauri::command]
pub fn get_or_create_user(app: AppHandle, username: String) -> Result<i64, String> {
    let conn = db::get_connection(&app)?;

    // Try to get existing user
    let existing_user: SqliteResult<i64> = conn.query_row(
        "SELECT id FROM users WHERE username = ?",
        params![username],
        |row| row.get(0)
    );

    if let Ok(user_id) = existing_user {
        return Ok(user_id);
    }

    // Create new user
    conn.execute(
        "INSERT INTO users (username) VALUES (?)",
        params![username]
    ).map_err(|e| e.to_string())?;

    let user_id = conn.last_insert_rowid();

    // Initialize currency for new user
    conn.execute(
        "INSERT OR IGNORE INTO user_currency (user_id, gold, gems) VALUES (?, 0, 0)",
        params![user_id]
    ).map_err(|e| e.to_string())?;

    Ok(user_id)
}

// ============================================================================
// CURRENCY COMMANDS
// ============================================================================

#[tauri::command]
pub fn get_user_currency(app: AppHandle, user_id: i64) -> Result<UserCurrency, String> {
    let conn = db::get_connection(&app)?;

    let mut stmt = conn.prepare(
        "SELECT user_id, gold, gems, lifetime_gold_earned, lifetime_gems_earned
         FROM user_currency
         WHERE user_id = ?"
    ).map_err(|e| e.to_string())?;

    let currency = stmt.query_row(params![user_id], |row| {
        Ok(UserCurrency {
            user_id: row.get(0)?,
            gold: row.get(1)?,
            gems: row.get(2)?,
            lifetime_gold_earned: row.get(3)?,
            lifetime_gems_earned: row.get(4)?,
        })
    }).map_err(|e| e.to_string())?;

    Ok(currency)
}

#[tauri::command]
pub fn add_currency(
    app: AppHandle,
    user_id: i64,
    currency_type: String,
    amount: i64,
    reason: String,
    reference_id: Option<String>
) -> Result<UserCurrency, String> {
    let conn = db::get_connection(&app)?;

    // Validate currency type
    if currency_type != "gold" && currency_type != "gems" {
        return Err("Invalid currency type".to_string());
    }

    // Get current balance
    let current_balance: i64 = conn.query_row(
        &format!("SELECT {} FROM user_currency WHERE user_id = ?", currency_type),
        params![user_id],
        |row| row.get(0)
    ).map_err(|e| e.to_string())?;

    let new_balance = current_balance + amount;

    // Update balance and lifetime earned
    conn.execute(
        &format!(
            "UPDATE user_currency
             SET {} = {}, lifetime_{}_earned = lifetime_{}_earned + ?, updated_at = CURRENT_TIMESTAMP
             WHERE user_id = ?",
            currency_type, new_balance, currency_type, currency_type
        ),
        params![amount.max(0), user_id]
    ).map_err(|e| e.to_string())?;

    // Record transaction
    conn.execute(
        "INSERT INTO currency_transactions (user_id, currency_type, amount, reason, reference_id, balance_after)
         VALUES (?, ?, ?, ?, ?, ?)",
        params![user_id, currency_type, amount, reason, reference_id, new_balance]
    ).map_err(|e| e.to_string())?;

    // Return updated currency
    get_user_currency(app, user_id)
}

#[tauri::command]
pub fn spend_currency(
    app: AppHandle,
    user_id: i64,
    currency_type: String,
    amount: i64,
    reason: String,
    reference_id: Option<String>
) -> Result<UserCurrency, String> {
    let conn = db::get_connection(&app)?;

    // Validate currency type
    if currency_type != "gold" && currency_type != "gems" {
        return Err("Invalid currency type".to_string());
    }

    // Get current balance
    let current_balance: i64 = conn.query_row(
        &format!("SELECT {} FROM user_currency WHERE user_id = ?", currency_type),
        params![user_id],
        |row| row.get(0)
    ).map_err(|e| e.to_string())?;

    if current_balance < amount {
        return Err(format!("Insufficient {} (have: {}, need: {})", currency_type, current_balance, amount));
    }

    let new_balance = current_balance - amount;

    // Update balance
    conn.execute(
        &format!(
            "UPDATE user_currency
             SET {} = {}, updated_at = CURRENT_TIMESTAMP
             WHERE user_id = ?",
            currency_type, new_balance
        ),
        params![user_id]
    ).map_err(|e| e.to_string())?;

    // Record transaction (negative amount)
    conn.execute(
        "INSERT INTO currency_transactions (user_id, currency_type, amount, reason, reference_id, balance_after)
         VALUES (?, ?, ?, ?, ?, ?)",
        params![user_id, currency_type, -amount, reason, reference_id, new_balance]
    ).map_err(|e| e.to_string())?;

    // Return updated currency
    get_user_currency(app.clone(), user_id)
}

// ============================================================================
// SHOP COMMANDS
// ============================================================================

#[tauri::command]
pub fn get_shop_items(app: AppHandle, category: Option<String>, user_level: i64) -> Result<Vec<ShopItem>, String> {
    let conn = db::get_connection(&app)?;

    let query = if let Some(ref _cat) = category {
        format!(
            "SELECT id, name, description, category, type, cost_gold, cost_gems, required_level,
                    is_limited_time, available_until, stock_limit, effects, icon, rarity, is_consumable, max_stack
             FROM shop_items
             WHERE category = ? AND required_level <= ?
             AND (is_limited_time = 0 OR available_until IS NULL OR available_until > datetime('now'))
             ORDER BY rarity, cost_gold, cost_gems"
        )
    } else {
        format!(
            "SELECT id, name, description, category, type, cost_gold, cost_gems, required_level,
                    is_limited_time, available_until, stock_limit, effects, icon, rarity, is_consumable, max_stack
             FROM shop_items
             WHERE required_level <= ?
             AND (is_limited_time = 0 OR available_until IS NULL OR available_until > datetime('now'))
             ORDER BY category, rarity, cost_gold, cost_gems"
        )
    };

    let mut stmt = conn.prepare(&query).map_err(|e| e.to_string())?;

    let items = if let Some(cat) = category {
        stmt.query_map(params![cat, user_level], map_shop_item)
            .map_err(|e| e.to_string())?
            .collect::<SqliteResult<Vec<_>>>()
            .map_err(|e| e.to_string())?
    } else {
        stmt.query_map(params![user_level], map_shop_item)
            .map_err(|e| e.to_string())?
            .collect::<SqliteResult<Vec<_>>>()
            .map_err(|e| e.to_string())?
    };

    Ok(items)
}

fn map_shop_item(row: &rusqlite::Row) -> SqliteResult<ShopItem> {
    Ok(ShopItem {
        id: row.get(0)?,
        name: row.get(1)?,
        description: row.get(2)?,
        category: row.get(3)?,
        item_type: row.get(4)?,
        cost_gold: row.get(5)?,
        cost_gems: row.get(6)?,
        required_level: row.get(7)?,
        is_limited_time: row.get(8)?,
        available_until: row.get(9)?,
        stock_limit: row.get(10)?,
        effects: row.get(11)?,
        icon: row.get(12)?,
        rarity: row.get(13)?,
        is_consumable: row.get(14)?,
        max_stack: row.get(15)?,
    })
}

#[tauri::command]
pub fn purchase_item(
    app: AppHandle,
    user_id: i64,
    item_id: String,
    quantity: i64
) -> Result<InventoryItem, String> {
    let conn = db::get_connection(&app)?;

    // Get item details
    let item = conn.query_row(
        "SELECT id, name, description, category, type, cost_gold, cost_gems, required_level,
                is_limited_time, available_until, stock_limit, effects, icon, rarity, is_consumable, max_stack
         FROM shop_items
         WHERE id = ?",
        params![item_id],
        map_shop_item
    ).map_err(|e| format!("Item not found: {}", e))?;

    // Calculate total cost
    let total_gold = item.cost_gold * quantity;
    let total_gems = item.cost_gems * quantity;

    // Check if user has enough currency
    let currency = get_user_currency(app.clone(), user_id)?;
    if currency.gold < total_gold {
        return Err(format!("Insufficient gold (have: {}, need: {})", currency.gold, total_gold));
    }
    if currency.gems < total_gems {
        return Err(format!("Insufficient gems (have: {}, need: {})", currency.gems, total_gems));
    }

    // Spend currency
    if total_gold > 0 {
        spend_currency(app.clone(), user_id, "gold".to_string(), total_gold, "shop_purchase".to_string(), Some(item_id.clone()))?;
    }
    if total_gems > 0 {
        spend_currency(app.clone(), user_id, "gems".to_string(), total_gems, "shop_purchase".to_string(), Some(item_id.clone()))?;
    }

    // Add to inventory (or update quantity)
    conn.execute(
        "INSERT INTO user_inventory (user_id, item_id, quantity)
         VALUES (?, ?, ?)
         ON CONFLICT(user_id, item_id)
         DO UPDATE SET quantity = quantity + ?",
        params![user_id, item_id, quantity, quantity]
    ).map_err(|e| e.to_string())?;

    // Record purchase
    conn.execute(
        "INSERT INTO purchase_history (user_id, item_id, quantity, cost_gold, cost_gems)
         VALUES (?, ?, ?, ?, ?)",
        params![user_id, item_id, quantity, total_gold, total_gems]
    ).map_err(|e| e.to_string())?;

    // Return inventory item
    get_inventory_item(&app, user_id, &item_id)
}

// ============================================================================
// INVENTORY COMMANDS
// ============================================================================

#[tauri::command]
pub fn get_user_inventory(app: AppHandle, user_id: i64) -> Result<Vec<InventoryItem>, String> {
    let conn = db::get_connection(&app)?;

    let mut stmt = conn.prepare(
        "SELECT ui.id, ui.user_id, ui.item_id, ui.quantity, ui.acquired_at,
                si.id, si.name, si.description, si.category, si.type, si.cost_gold, si.cost_gems,
                si.required_level, si.is_limited_time, si.available_until, si.stock_limit,
                si.effects, si.icon, si.rarity, si.is_consumable, si.max_stack
         FROM user_inventory ui
         JOIN shop_items si ON ui.item_id = si.id
         WHERE ui.user_id = ?
         ORDER BY si.category, si.rarity"
    ).map_err(|e| e.to_string())?;

    let items = stmt.query_map(params![user_id], |row| {
        Ok(InventoryItem {
            id: row.get(0)?,
            user_id: row.get(1)?,
            item_id: row.get(2)?,
            quantity: row.get(3)?,
            acquired_at: row.get(4)?,
            item: ShopItem {
                id: row.get(5)?,
                name: row.get(6)?,
                description: row.get(7)?,
                category: row.get(8)?,
                item_type: row.get(9)?,
                cost_gold: row.get(10)?,
                cost_gems: row.get(11)?,
                required_level: row.get(12)?,
                is_limited_time: row.get(13)?,
                available_until: row.get(14)?,
                stock_limit: row.get(15)?,
                effects: row.get(16)?,
                icon: row.get(17)?,
                rarity: row.get(18)?,
                is_consumable: row.get(19)?,
                max_stack: row.get(20)?,
            },
        })
    })
    .map_err(|e| e.to_string())?
    .collect::<SqliteResult<Vec<_>>>()
    .map_err(|e| e.to_string())?;

    Ok(items)
}

fn get_inventory_item(app: &AppHandle, user_id: i64, item_id: &str) -> Result<InventoryItem, String> {
    let conn = db::get_connection(app)?;

    conn.query_row(
        "SELECT ui.id, ui.user_id, ui.item_id, ui.quantity, ui.acquired_at,
                si.id, si.name, si.description, si.category, si.type, si.cost_gold, si.cost_gems,
                si.required_level, si.is_limited_time, si.available_until, si.stock_limit,
                si.effects, si.icon, si.rarity, si.is_consumable, si.max_stack
         FROM user_inventory ui
         JOIN shop_items si ON ui.item_id = si.id
         WHERE ui.user_id = ? AND ui.item_id = ?",
        params![user_id, item_id],
        |row| {
            Ok(InventoryItem {
                id: row.get(0)?,
                user_id: row.get(1)?,
                item_id: row.get(2)?,
                quantity: row.get(3)?,
                acquired_at: row.get(4)?,
                item: ShopItem {
                    id: row.get(5)?,
                    name: row.get(6)?,
                    description: row.get(7)?,
                    category: row.get(8)?,
                    item_type: row.get(9)?,
                    cost_gold: row.get(10)?,
                    cost_gems: row.get(11)?,
                    required_level: row.get(12)?,
                    is_limited_time: row.get(13)?,
                    available_until: row.get(14)?,
                    stock_limit: row.get(15)?,
                    effects: row.get(16)?,
                    icon: row.get(17)?,
                    rarity: row.get(18)?,
                    is_consumable: row.get(19)?,
                    max_stack: row.get(20)?,
                },
            })
        }
    ).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn use_inventory_item(app: AppHandle, user_id: i64, item_id: String) -> Result<bool, String> {
    let conn = db::get_connection(&app)?;

    // Get item from inventory
    let inv_item = get_inventory_item(&app, user_id, &item_id)?;

    if inv_item.quantity < 1 {
        return Err("Item not in inventory".to_string());
    }

    if !inv_item.item.is_consumable {
        return Err("Item is not consumable".to_string());
    }

    // Parse effects and apply them
    // This is a simplified version - you'd want proper JSON parsing
    conn.execute(
        "INSERT INTO user_active_effects (user_id, effect_type, effect_value, source_item_id, metadata)
         VALUES (?, 'item_effect', 1.0, ?, ?)",
        params![user_id, item_id, inv_item.item.effects]
    ).map_err(|e| e.to_string())?;

    // Decrease quantity
    conn.execute(
        "UPDATE user_inventory
         SET quantity = quantity - 1
         WHERE user_id = ? AND item_id = ?",
        params![user_id, item_id]
    ).map_err(|e| e.to_string())?;

    // Delete if quantity is 0
    conn.execute(
        "DELETE FROM user_inventory
         WHERE user_id = ? AND item_id = ? AND quantity <= 0",
        params![user_id, item_id]
    ).map_err(|e| e.to_string())?;

    Ok(true)
}

// ============================================================================
// QUEST COMMANDS
// ============================================================================

#[tauri::command]
pub fn get_quests(app: AppHandle, quest_type: String) -> Result<Vec<Quest>, String> {
    let conn = db::get_connection(&app)?;

    let mut stmt = conn.prepare(
        "SELECT id, type, title, description, objective_type, objective_target,
                reward_xp, reward_gold, reward_gems, reward_item_id, icon, order_index
         FROM quests
         WHERE type = ?
         ORDER BY order_index"
    ).map_err(|e| e.to_string())?;

    let quests = stmt.query_map(params![quest_type], |row| {
        Ok(Quest {
            id: row.get(0)?,
            quest_type: row.get(1)?,
            title: row.get(2)?,
            description: row.get(3)?,
            objective_type: row.get(4)?,
            objective_target: row.get(5)?,
            reward_xp: row.get(6)?,
            reward_gold: row.get(7)?,
            reward_gems: row.get(8)?,
            reward_item_id: row.get(9)?,
            icon: row.get(10)?,
            order_index: row.get(11)?,
        })
    })
    .map_err(|e| e.to_string())?
    .collect::<SqliteResult<Vec<_>>>()
    .map_err(|e| e.to_string())?;

    Ok(quests)
}

#[tauri::command]
pub fn get_user_quest_progress(app: AppHandle, user_id: i64, quest_type: String) -> Result<Vec<UserQuestProgress>, String> {
    let conn = db::get_connection(&app)?;

    let mut stmt = conn.prepare(
        "SELECT uqp.id, uqp.user_id, uqp.quest_id, uqp.progress, uqp.completed, uqp.completed_at,
                q.id, q.type, q.title, q.description, q.objective_type, q.objective_target,
                q.reward_xp, q.reward_gold, q.reward_gems, q.reward_item_id, q.icon, q.order_index
         FROM user_quest_progress uqp
         JOIN quests q ON uqp.quest_id = q.id
         WHERE uqp.user_id = ? AND q.type = ?
         ORDER BY q.order_index"
    ).map_err(|e| e.to_string())?;

    let progress = stmt.query_map(params![user_id, quest_type], |row| {
        Ok(UserQuestProgress {
            id: row.get(0)?,
            user_id: row.get(1)?,
            quest_id: row.get(2)?,
            progress: row.get(3)?,
            completed: row.get(4)?,
            completed_at: row.get(5)?,
            quest: Quest {
                id: row.get(6)?,
                quest_type: row.get(7)?,
                title: row.get(8)?,
                description: row.get(9)?,
                objective_type: row.get(10)?,
                objective_target: row.get(11)?,
                reward_xp: row.get(12)?,
                reward_gold: row.get(13)?,
                reward_gems: row.get(14)?,
                reward_item_id: row.get(15)?,
                icon: row.get(16)?,
                order_index: row.get(17)?,
            },
        })
    })
    .map_err(|e| e.to_string())?
    .collect::<SqliteResult<Vec<_>>>()
    .map_err(|e| e.to_string())?;

    Ok(progress)
}

#[tauri::command]
pub fn update_quest_progress(
    app: AppHandle,
    user_id: i64,
    quest_id: String,
    progress: i64
) -> Result<UserQuestProgress, String> {
    let conn = db::get_connection(&app)?;

    // Get quest to check if completed
    let quest: Quest = conn.query_row(
        "SELECT id, type, title, description, objective_type, objective_target,
                reward_xp, reward_gold, reward_gems, reward_item_id, icon, order_index
         FROM quests WHERE id = ?",
        params![quest_id],
        |row| {
            Ok(Quest {
                id: row.get(0)?,
                quest_type: row.get(1)?,
                title: row.get(2)?,
                description: row.get(3)?,
                objective_type: row.get(4)?,
                objective_target: row.get(5)?,
                reward_xp: row.get(6)?,
                reward_gold: row.get(7)?,
                reward_gems: row.get(8)?,
                reward_item_id: row.get(9)?,
                icon: row.get(10)?,
                order_index: row.get(11)?,
            })
        }
    ).map_err(|e| e.to_string())?;

    let completed = progress >= quest.objective_target;

    // Check if quest was already completed before
    let was_already_completed: bool = conn.query_row(
        "SELECT completed FROM user_quest_progress WHERE user_id = ? AND quest_id = ?",
        params![user_id, quest_id],
        |row| row.get(0)
    ).unwrap_or(false);

    // Upsert progress
    conn.execute(
        "INSERT INTO user_quest_progress (user_id, quest_id, progress, completed, completed_at)
         VALUES (?, ?, ?, ?, CASE WHEN ? THEN CURRENT_TIMESTAMP ELSE NULL END)
         ON CONFLICT(user_id, quest_id)
         DO UPDATE SET
            progress = ?,
            completed = ?,
            completed_at = CASE WHEN ? AND completed = 0 THEN CURRENT_TIMESTAMP ELSE completed_at END",
        params![user_id, quest_id, progress, completed, completed, progress, completed, completed]
    ).map_err(|e| e.to_string())?;

    // If just completed (and wasn't completed before), award rewards
    if completed && !was_already_completed {
        println!("Quest completed! Awarding rewards - Gold: {}, Gems: {}", quest.reward_gold, quest.reward_gems);
        if quest.reward_xp > 0 {
            // Award XP (you'd need to implement this in your user system)
        }
        if quest.reward_gold > 0 {
            add_currency(app.clone(), user_id, "gold".to_string(), quest.reward_gold, "quest_reward".to_string(), Some(quest_id.clone()))?;
        }
        if quest.reward_gems > 0 {
            add_currency(app.clone(), user_id, "gems".to_string(), quest.reward_gems, "quest_reward".to_string(), Some(quest_id.clone()))?;
        }
    }

    // Return updated progress
    let progress_record = conn.query_row(
        "SELECT uqp.id, uqp.user_id, uqp.quest_id, uqp.progress, uqp.completed, uqp.completed_at
         FROM user_quest_progress uqp
         WHERE uqp.user_id = ? AND uqp.quest_id = ?",
        params![user_id, quest_id],
        |row| {
            Ok(UserQuestProgress {
                id: row.get(0)?,
                user_id: row.get(1)?,
                quest_id: row.get(2)?,
                progress: row.get(3)?,
                completed: row.get(4)?,
                completed_at: row.get(5)?,
                quest: quest.clone(),
            })
        }
    ).map_err(|e| e.to_string())?;

    Ok(progress_record)
}

// ============================================================================
// ACTIVE EFFECTS COMMANDS
// ============================================================================

#[tauri::command]
pub fn get_active_effects(app: AppHandle, user_id: i64) -> Result<Vec<ActiveEffect>, String> {
    let conn = db::get_connection(&app)?;

    // Clean up expired effects first
    conn.execute(
        "DELETE FROM user_active_effects
         WHERE user_id = ? AND expires_at IS NOT NULL AND expires_at < datetime('now')",
        params![user_id]
    ).map_err(|e| e.to_string())?;

    let mut stmt = conn.prepare(
        "SELECT id, user_id, effect_type, effect_value, started_at, expires_at, source_item_id, metadata
         FROM user_active_effects
         WHERE user_id = ?
         AND (expires_at IS NULL OR expires_at > datetime('now'))"
    ).map_err(|e| e.to_string())?;

    let effects = stmt.query_map(params![user_id], |row| {
        Ok(ActiveEffect {
            id: row.get(0)?,
            user_id: row.get(1)?,
            effect_type: row.get(2)?,
            effect_value: row.get(3)?,
            started_at: row.get(4)?,
            expires_at: row.get(5)?,
            source_item_id: row.get(6)?,
            metadata: row.get(7)?,
        })
    })
    .map_err(|e| e.to_string())?
    .collect::<SqliteResult<Vec<_>>>()
    .map_err(|e| e.to_string())?;

    Ok(effects)
}

// ============================================================================
// LEVEL REWARDS COMMANDS
// ============================================================================

#[tauri::command]
pub fn get_level_rewards(app: AppHandle, level: i64) -> Result<Option<LevelReward>, String> {
    let conn = db::get_connection(&app)?;

    let reward = conn.query_row(
        "SELECT level, xp_required, reward_gold, reward_gems, reward_items,
                unlocks_feature, unlocks_category, title, description, icon
         FROM level_rewards
         WHERE level = ?",
        params![level],
        |row| {
            Ok(LevelReward {
                level: row.get(0)?,
                xp_required: row.get(1)?,
                reward_gold: row.get(2)?,
                reward_gems: row.get(3)?,
                reward_items: row.get(4)?,
                unlocks_feature: row.get(5)?,
                unlocks_category: row.get(6)?,
                title: row.get(7)?,
                description: row.get(8)?,
                icon: row.get(9)?,
            })
        }
    );

    match reward {
        Ok(r) => Ok(Some(r)),
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub fn claim_level_rewards(app: AppHandle, user_id: i64, level: i64) -> Result<LevelReward, String> {
    let reward = get_level_rewards(app.clone(), level)?
        .ok_or_else(|| format!("No rewards for level {}", level))?;

    // Award currency
    if reward.reward_gold > 0 {
        add_currency(app.clone(), user_id, "gold".to_string(), reward.reward_gold, "level_reward".to_string(), Some(level.to_string()))?;
    }
    if reward.reward_gems > 0 {
        add_currency(app, user_id, "gems".to_string(), reward.reward_gems, "level_reward".to_string(), Some(level.to_string()))?;
    }

    // TODO: Award items if reward_items is not null (parse JSON and add to inventory)

    Ok(reward)
}
