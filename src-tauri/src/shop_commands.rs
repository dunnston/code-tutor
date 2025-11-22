use rusqlite::{params, Result as SqlResult, Row};
use serde::{Deserialize, Serialize};
use tauri::AppHandle;

use crate::db::get_connection;
use crate::rpg_commands::CharacterStats;

// ============================================================================
// CONSUMABLE ITEMS
// ============================================================================

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ConsumableItem {
    pub id: String,
    pub name: String,
    pub description: String,
    #[serde(rename = "type")]
    pub item_type: String,
    pub health_restore: i64,
    pub mana_restore: i64,
    pub buff_type: Option<String>,
    pub buff_value: i64,
    pub buff_duration_turns: i64,
    pub buy_price: i64,
    pub sell_price: i64,
    pub icon: String,
    pub tier: String,
    pub stack_size: i64,
    pub created_at: String,
}

impl ConsumableItem {
    fn from_row(row: &Row) -> SqlResult<Self> {
        Ok(ConsumableItem {
            id: row.get(0)?,
            name: row.get(1)?,
            description: row.get(2)?,
            item_type: row.get(3)?,
            health_restore: row.get(4)?,
            mana_restore: row.get(5)?,
            buff_type: row.get(6)?,
            buff_value: row.get(7)?,
            buff_duration_turns: row.get(8)?,
            buy_price: row.get(9)?,
            sell_price: row.get(10)?,
            icon: row.get(11)?,
            tier: row.get(12)?,
            stack_size: row.get(13)?,
            created_at: row.get(14)?,
        })
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserConsumableInventoryItem {
    pub id: i64,
    pub user_id: i64,
    pub consumable_id: String,
    pub consumable: ConsumableItem,
    pub quantity: i64,
    pub acquired_at: String,
}

// ============================================================================
// SHOP INVENTORY
// ============================================================================

#[derive(Debug, Serialize, Deserialize)]
pub struct ShopInventoryItem {
    pub id: i64,
    pub item_type: String,
    pub item_id: String,
    pub available: bool,
    pub required_level: i64,
    pub stock_quantity: Option<i64>,
    pub price_override: Option<i64>,
    pub added_at: String,
}

impl ShopInventoryItem {
    fn from_row(row: &Row) -> SqlResult<Self> {
        Ok(ShopInventoryItem {
            id: row.get(0)?,
            item_type: row.get(1)?,
            item_id: row.get(2)?,
            available: row.get(3)?,
            required_level: row.get(4)?,
            stock_quantity: row.get(5)?,
            price_override: row.get(6)?,
            added_at: row.get(7)?,
        })
    }
}

// Combined shop item with full details
#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "itemType")]
pub enum ShopItem {
    Equipment {
        shop_id: i64,
        equipment: crate::rpg_commands::EquipmentItem,
        price: i64,
        in_stock: bool,
        required_level: i64,
    },
    Consumable {
        shop_id: i64,
        consumable: ConsumableItem,
        price: i64,
        in_stock: bool,
        required_level: i64,
    },
}

// ============================================================================
// TAURI COMMANDS
// ============================================================================

#[tauri::command]
pub fn get_rpg_shop_items(app: AppHandle, user_id: i64) -> Result<Vec<ShopItem>, String> {
    let conn = get_connection(&app)?;

    // Get user's level for filtering
    let _user_level: i64 = conn
        .query_row(
            "SELECT level FROM character_stats WHERE user_id = ?",
            params![user_id],
            |row| row.get(0),
        )
        .map_err(|e| format!("Failed to get user level: {}", e))?;

    let mut shop_items = Vec::new();

    // Get shop inventory
    let mut stmt = conn
        .prepare(
            "SELECT id, item_type, item_id, available, required_level,
                    stock_quantity, price_override, added_at
             FROM shop_inventory
             WHERE available = TRUE",
        )
        .map_err(|e| format!("Failed to prepare shop query: {}", e))?;

    let inventory_items = stmt
        .query_map([], ShopInventoryItem::from_row)
        .map_err(|e| format!("Failed to query shop inventory: {}", e))?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| format!("Failed to collect shop inventory: {}", e))?;

    for inv_item in inventory_items {
        let in_stock = inv_item.stock_quantity.map_or(true, |stock| stock > 0);

        if inv_item.item_type == "equipment" {
            // Fetch equipment details
            let equipment: crate::rpg_commands::EquipmentItem = conn
                .query_row(
                    "SELECT id, name, description, slot, tier, required_level,
                            required_strength, required_intelligence, required_dexterity,
                            damage_bonus, defense_bonus, hp_bonus, mana_bonus,
                            strength_bonus, intelligence_bonus, dexterity_bonus,
                            critical_chance_bonus, dodge_chance_bonus, special_effects,
                            icon, value, created_at
                     FROM equipment_items
                     WHERE id = ?",
                    params![inv_item.item_id],
                    crate::rpg_commands::EquipmentItem::from_row,
                )
                .map_err(|e| format!("Failed to get equipment item: {}", e))?;

            let price = inv_item.price_override.unwrap_or(equipment.value);

            shop_items.push(ShopItem::Equipment {
                shop_id: inv_item.id,
                equipment,
                price,
                in_stock,
                required_level: inv_item.required_level,
            });
        } else if inv_item.item_type == "consumable" {
            // Fetch consumable details
            let consumable: ConsumableItem = conn
                .query_row(
                    "SELECT id, name, description, type, health_restore, mana_restore,
                            buff_type, buff_value, buff_duration_turns, buy_price, sell_price,
                            icon, tier, stack_size, created_at
                     FROM consumable_items
                     WHERE id = ?",
                    params![inv_item.item_id],
                    ConsumableItem::from_row,
                )
                .map_err(|e| format!("Failed to get consumable item: {}", e))?;

            let price = inv_item.price_override.unwrap_or(consumable.buy_price);

            shop_items.push(ShopItem::Consumable {
                shop_id: inv_item.id,
                consumable,
                price,
                in_stock,
                required_level: inv_item.required_level,
            });
        }
    }

    Ok(shop_items)
}

#[tauri::command]
pub fn purchase_shop_item(
    app: AppHandle,
    user_id: i64,
    shop_id: i64,
    item_type: String,
    item_id: String,
    quantity: i64,
) -> Result<CharacterStats, String> {
    let conn = get_connection(&app)?;

    // Get shop item details
    let (price, stock, required_level): (Option<i64>, Option<i64>, i64) = conn
        .query_row(
            "SELECT price_override, stock_quantity, required_level
             FROM shop_inventory
             WHERE id = ? AND available = TRUE",
            params![shop_id],
            |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?)),
        )
        .map_err(|e| format!("Shop item not found or unavailable: {}", e))?;

    // Check stock
    if let Some(current_stock) = stock {
        if current_stock < quantity {
            return Err("Insufficient stock".to_string());
        }
    }

    // Get user stats
    let stats = crate::rpg_commands::get_character_stats(app.clone(), user_id)?;

    // Check level requirement
    if stats.level < required_level {
        return Err(format!(
            "Requires level {}. You are level {}.",
            required_level, stats.level
        ));
    }

    // Get actual price (from item or override)
    let actual_price = if item_type == "equipment" {
        price.unwrap_or_else(|| {
            conn.query_row(
                "SELECT value FROM equipment_items WHERE id = ?",
                params![item_id],
                |row| row.get::<_, i64>(0),
            )
            .unwrap_or(0)
        })
    } else {
        price.unwrap_or_else(|| {
            conn.query_row(
                "SELECT buy_price FROM consumable_items WHERE id = ?",
                params![item_id],
                |row| row.get::<_, i64>(0),
            )
            .unwrap_or(0)
        })
    };

    let total_cost = actual_price * quantity;

    // Get current gold
    let current_gold: i64 = conn
        .query_row(
            "SELECT current_gold FROM character_stats WHERE user_id = ?",
            params![user_id],
            |row| row.get(0),
        )
        .map_err(|e| format!("Failed to get gold: {}", e))?;

    // Check if user has enough gold
    if current_gold < total_cost {
        return Err(format!(
            "Insufficient gold. Need {} but have {}.",
            total_cost, current_gold
        ));
    }

    // Deduct gold
    conn.execute(
        "UPDATE character_stats
         SET current_gold = current_gold - ?, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?",
        params![total_cost, user_id],
    )
    .map_err(|e| format!("Failed to deduct gold: {}", e))?;

    // Add item to inventory
    if item_type == "equipment" {
        conn.execute(
            "INSERT INTO user_equipment_inventory (user_id, equipment_id, quantity, acquired_at)
             VALUES (?, ?, ?, CURRENT_TIMESTAMP)",
            params![user_id, item_id, quantity],
        )
        .map_err(|e| format!("Failed to add equipment to inventory: {}", e))?;
    } else {
        // Add consumable (merge with existing if already owned)
        conn.execute(
            "INSERT INTO user_consumable_inventory (user_id, consumable_id, quantity, acquired_at)
             VALUES (?, ?, ?, CURRENT_TIMESTAMP)
             ON CONFLICT(user_id, consumable_id) DO UPDATE SET
                 quantity = quantity + excluded.quantity",
            params![user_id, item_id, quantity],
        )
        .map_err(|e| format!("Failed to add consumable to inventory: {}", e))?;
    }

    // Update stock if limited
    if stock.is_some() {
        conn.execute(
            "UPDATE shop_inventory
             SET stock_quantity = stock_quantity - ?
             WHERE id = ?",
            params![quantity, shop_id],
        )
        .map_err(|e| format!("Failed to update stock: {}", e))?;
    }

    // Record purchase
    conn.execute(
        "INSERT INTO shop_purchases (user_id, item_type, item_id, quantity, price_paid, user_level_at_purchase, purchased_at)
         VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)",
        params![user_id, item_type, item_id, quantity, total_cost, stats.level],
    )
    .map_err(|e| format!("Failed to record purchase: {}", e))?;

    log::info!(
        "User {} purchased {} x{} for {} gold",
        user_id,
        item_id,
        quantity,
        total_cost
    );

    // Return updated stats
    crate::rpg_commands::get_character_stats(app, user_id)
}

#[tauri::command]
pub fn sell_equipment_item(
    app: AppHandle,
    user_id: i64,
    equipment_id: String,
) -> Result<CharacterStats, String> {
    let conn = get_connection(&app)?;

    // Check if user owns this item
    let inventory_id: i64 = conn
        .query_row(
            "SELECT id FROM user_equipment_inventory
             WHERE user_id = ? AND equipment_id = ?",
            params![user_id, equipment_id],
            |row| row.get(0),
        )
        .map_err(|_| "You don't own this item".to_string())?;

    // Get sell price (50% of value)
    let sell_price: i64 = conn
        .query_row(
            "SELECT value FROM equipment_items WHERE id = ?",
            params![equipment_id],
            |row| row.get(0),
        )
        .map_err(|e| format!("Failed to get item value: {}", e))?;

    let sell_price = sell_price / 2;

    // Remove from inventory
    conn.execute(
        "DELETE FROM user_equipment_inventory WHERE id = ?",
        params![inventory_id],
    )
    .map_err(|e| format!("Failed to remove item: {}", e))?;

    // Add gold
    conn.execute(
        "UPDATE character_stats
         SET current_gold = current_gold + ?, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?",
        params![sell_price, user_id],
    )
    .map_err(|e| format!("Failed to add gold: {}", e))?;

    log::info!(
        "User {} sold {} for {} gold",
        user_id,
        equipment_id,
        sell_price
    );

    crate::rpg_commands::get_character_stats(app, user_id)
}

#[tauri::command]
pub fn get_consumable_inventory(
    app: AppHandle,
    user_id: i64,
) -> Result<Vec<UserConsumableInventoryItem>, String> {
    let conn = get_connection(&app)?;

    let mut stmt = conn
        .prepare(
            "SELECT uci.id, uci.user_id, uci.consumable_id, uci.quantity, uci.acquired_at,
                    ci.id, ci.name, ci.description, ci.type, ci.health_restore, ci.mana_restore,
                    ci.buff_type, ci.buff_value, ci.buff_duration_turns, ci.buy_price, ci.sell_price,
                    ci.icon, ci.tier, ci.stack_size, ci.created_at
             FROM user_consumable_inventory uci
             JOIN consumable_items ci ON uci.consumable_id = ci.id
             WHERE uci.user_id = ?
             ORDER BY ci.tier DESC, ci.name ASC",
        )
        .map_err(|e| format!("Failed to prepare query: {}", e))?;

    let inventory = stmt
        .query_map(params![user_id], |row| {
            Ok(UserConsumableInventoryItem {
                id: row.get(0)?,
                user_id: row.get(1)?,
                consumable_id: row.get(2)?,
                quantity: row.get(3)?,
                acquired_at: row.get(4)?,
                consumable: ConsumableItem {
                    id: row.get(5)?,
                    name: row.get(6)?,
                    description: row.get(7)?,
                    item_type: row.get(8)?,
                    health_restore: row.get(9)?,
                    mana_restore: row.get(10)?,
                    buff_type: row.get(11)?,
                    buff_value: row.get(12)?,
                    buff_duration_turns: row.get(13)?,
                    buy_price: row.get(14)?,
                    sell_price: row.get(15)?,
                    icon: row.get(16)?,
                    tier: row.get(17)?,
                    stack_size: row.get(18)?,
                    created_at: row.get(19)?,
                },
            })
        })
        .map_err(|e| format!("Failed to query inventory: {}", e))?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| format!("Failed to collect inventory: {}", e))?;

    Ok(inventory)
}

#[tauri::command]
pub fn use_consumable(
    app: AppHandle,
    user_id: i64,
    consumable_id: String,
) -> Result<CharacterStats, String> {
    let conn = get_connection(&app)?;

    // Check if user owns this consumable
    let (inventory_id, quantity): (i64, i64) = conn
        .query_row(
            "SELECT id, quantity FROM user_consumable_inventory
             WHERE user_id = ? AND consumable_id = ?",
            params![user_id, consumable_id],
            |row| Ok((row.get(0)?, row.get(1)?)),
        )
        .map_err(|_| "You don't own this item".to_string())?;

    if quantity <= 0 {
        return Err("No items to use".to_string());
    }

    // Get consumable effects
    let consumable: ConsumableItem = conn
        .query_row(
            "SELECT id, name, description, type, health_restore, mana_restore,
                    buff_type, buff_value, buff_duration_turns, buy_price, sell_price,
                    icon, tier, stack_size, created_at
             FROM consumable_items
             WHERE id = ?",
            params![consumable_id],
            ConsumableItem::from_row,
        )
        .map_err(|e| format!("Failed to get consumable: {}", e))?;

    // Get current stats
    let stats = crate::rpg_commands::get_character_stats(app.clone(), user_id)?;

    // Apply health restoration
    let new_health = if consumable.health_restore == 999 {
        stats.max_health
    } else {
        (stats.current_health + consumable.health_restore).min(stats.max_health)
    };

    // Apply mana restoration
    let new_mana = if consumable.mana_restore == 999 {
        stats.max_mana
    } else {
        (stats.current_mana + consumable.mana_restore).min(stats.max_mana)
    };

    // Update character stats
    conn.execute(
        "UPDATE character_stats
         SET current_health = ?, current_mana = ?, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?",
        params![new_health, new_mana, user_id],
    )
    .map_err(|e| format!("Failed to update stats: {}", e))?;

    // Decrease quantity or remove if last one
    if quantity == 1 {
        conn.execute(
            "DELETE FROM user_consumable_inventory WHERE id = ?",
            params![inventory_id],
        )
        .map_err(|e| format!("Failed to remove consumable: {}", e))?;
    } else {
        conn.execute(
            "UPDATE user_consumable_inventory
             SET quantity = quantity - 1
             WHERE id = ?",
            params![inventory_id],
        )
        .map_err(|e| format!("Failed to decrease quantity: {}", e))?;
    }

    log::info!(
        "User {} used {}. Health: {} -> {}, Mana: {} -> {}",
        user_id,
        consumable.name,
        stats.current_health,
        new_health,
        stats.current_mana,
        new_mana
    );

    // Return updated stats
    crate::rpg_commands::get_character_stats(app, user_id)
}

#[tauri::command]
pub fn set_town_state(
    app: AppHandle,
    user_id: i64,
    in_town: bool,
) -> Result<(), String> {
    let conn = get_connection(&app)?;

    conn.execute(
        "UPDATE user_dungeon_progress
         SET in_town = ?, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?",
        params![in_town, user_id],
    )
    .map_err(|e| format!("Failed to update town state: {}", e))?;

    log::info!("User {} town state set to: {}", user_id, in_town);

    Ok(())
}

#[tauri::command]
pub fn get_town_state(app: AppHandle, user_id: i64) -> Result<bool, String> {
    let conn = get_connection(&app)?;

    let in_town: bool = conn
        .query_row(
            "SELECT in_town FROM user_dungeon_progress WHERE user_id = ?",
            params![user_id],
            |row| row.get(0),
        )
        .unwrap_or(true); // Default to town if not set

    Ok(in_town)
}
