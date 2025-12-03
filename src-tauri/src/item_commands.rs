use crate::db;
use rusqlite::{params, Result as SqlResult};
use serde::{Deserialize, Serialize};
use tauri::AppHandle;

// Equipment Item
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct EquipmentItem {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub slot: String, // weapon, shield, helmet, chest, boots, armor, accessory
    pub tier: String, // common, uncommon, rare, epic, legendary
    pub required_level: i32,
    pub damage_bonus: i32,
    pub defense_bonus: i32,
    pub hp_bonus: i32,
    pub mana_bonus: i32,
    pub icon: Option<String>,
    pub value: i32,
}

// Consumable Item
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ConsumableItem {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    #[serde(rename = "type")]
    pub consumable_type: String, // health_potion, mana_potion, buff_potion, scroll
    pub health_restore: i32,
    pub mana_restore: i32,
    pub buff_type: Option<String>,
    pub buff_value: i32,
    pub buff_duration_turns: i32,
    pub buy_price: i32,
    pub sell_price: i32,
    pub icon: Option<String>,
    pub tier: String,
}

// List items for loot selection
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LootItemOption {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub category: String, // "equipment" or "consumable"
    pub item_type: String, // weapon, armor, potion, scroll, etc.
    pub tier: String,
    pub icon: Option<String>,
}

// List all equipment items
#[tauri::command]
pub fn list_equipment_items(app: AppHandle) -> Result<Vec<EquipmentItem>, String> {
    let conn = db::get_connection(&app)?;

    let mut stmt = conn
        .prepare(
            "SELECT id, name, description, slot, tier, required_level,
                    damage_bonus, defense_bonus, hp_bonus, mana_bonus, icon, value
             FROM equipment_items
             ORDER BY tier, required_level, name",
        )
        .map_err(|e| e.to_string())?;

    let items = stmt
        .query_map([], |row| {
            Ok(EquipmentItem {
                id: row.get(0)?,
                name: row.get(1)?,
                description: row.get(2)?,
                slot: row.get(3)?,
                tier: row.get(4)?,
                required_level: row.get(5)?,
                damage_bonus: row.get(6)?,
                defense_bonus: row.get(7)?,
                hp_bonus: row.get(8)?,
                mana_bonus: row.get(9)?,
                icon: row.get(10)?,
                value: row.get(11)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<SqlResult<Vec<_>>>()
        .map_err(|e| e.to_string())?;

    Ok(items)
}

// List all consumable items
#[tauri::command]
pub fn list_consumable_items(app: AppHandle) -> Result<Vec<ConsumableItem>, String> {
    let conn = db::get_connection(&app)?;

    let mut stmt = conn
        .prepare(
            "SELECT id, name, description, type, health_restore, mana_restore,
                    buff_type, buff_value, buff_duration_turns, buy_price, sell_price, icon, tier
             FROM consumable_items
             ORDER BY tier, buy_price, name",
        )
        .map_err(|e| e.to_string())?;

    let items = stmt
        .query_map([], |row| {
            Ok(ConsumableItem {
                id: row.get(0)?,
                name: row.get(1)?,
                description: row.get(2)?,
                consumable_type: row.get(3)?,
                health_restore: row.get(4)?,
                mana_restore: row.get(5)?,
                buff_type: row.get(6)?,
                buff_value: row.get(7)?,
                buff_duration_turns: row.get(8)?,
                buy_price: row.get(9)?,
                sell_price: row.get(10)?,
                icon: row.get(11)?,
                tier: row.get(12)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<SqlResult<Vec<_>>>()
        .map_err(|e| e.to_string())?;

    Ok(items)
}

// List all items suitable for loot (combined equipment and consumables)
#[tauri::command]
pub fn list_all_loot_items(app: AppHandle) -> Result<Vec<LootItemOption>, String> {
    let conn = db::get_connection(&app)?;

    let mut items = Vec::new();

    // Get equipment items
    let mut stmt = conn
        .prepare(
            "SELECT id, name, description, slot, tier, icon
             FROM equipment_items
             ORDER BY tier, name",
        )
        .map_err(|e| e.to_string())?;

    let equipment_items = stmt
        .query_map([], |row| {
            Ok(LootItemOption {
                id: row.get(0)?,
                name: row.get(1)?,
                description: row.get(2)?,
                category: "equipment".to_string(),
                item_type: row.get::<_, String>(3)?, // slot
                tier: row.get(4)?,
                icon: row.get(5)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<SqlResult<Vec<_>>>()
        .map_err(|e| e.to_string())?;

    items.extend(equipment_items);

    // Get consumable items
    let mut stmt = conn
        .prepare(
            "SELECT id, name, description, type, tier, icon
             FROM consumable_items
             ORDER BY tier, name",
        )
        .map_err(|e| e.to_string())?;

    let consumable_items = stmt
        .query_map([], |row| {
            Ok(LootItemOption {
                id: row.get(0)?,
                name: row.get(1)?,
                description: row.get(2)?,
                category: "consumable".to_string(),
                item_type: row.get::<_, String>(3)?, // consumable type
                tier: row.get(4)?,
                icon: row.get(5)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<SqlResult<Vec<_>>>()
        .map_err(|e| e.to_string())?;

    items.extend(consumable_items);

    Ok(items)
}

// Save a custom consumable item (for keys, scrolls, etc.)
#[tauri::command]
pub fn save_custom_consumable(
    app: AppHandle,
    item: ConsumableItem,
) -> Result<(), String> {
    let conn = db::get_connection(&app)?;

    conn.execute(
        "INSERT OR REPLACE INTO consumable_items
         (id, name, description, type, health_restore, mana_restore,
          buff_type, buff_value, buff_duration_turns, buy_price, sell_price, icon, tier)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)",
        params![
            item.id,
            item.name,
            item.description,
            item.consumable_type,
            item.health_restore,
            item.mana_restore,
            item.buff_type,
            item.buff_value,
            item.buff_duration_turns,
            item.buy_price,
            item.sell_price,
            item.icon,
            item.tier,
        ],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

// Save a custom equipment item
#[tauri::command]
pub fn save_custom_equipment(
    app: AppHandle,
    item: EquipmentItem,
) -> Result<(), String> {
    let conn = db::get_connection(&app)?;

    conn.execute(
        "INSERT OR REPLACE INTO equipment_items
         (id, name, description, slot, tier, required_level,
          damage_bonus, defense_bonus, hp_bonus, mana_bonus, icon, value)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)",
        params![
            item.id,
            item.name,
            item.description,
            item.slot,
            item.tier,
            item.required_level,
            item.damage_bonus,
            item.defense_bonus,
            item.hp_bonus,
            item.mana_bonus,
            item.icon,
            item.value,
        ],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

// Get a single equipment item
#[tauri::command]
pub fn get_equipment_item(app: AppHandle, item_id: String) -> Result<EquipmentItem, String> {
    let conn = db::get_connection(&app)?;

    let item = conn.query_row(
        "SELECT id, name, description, slot, tier, required_level,
                damage_bonus, defense_bonus, hp_bonus, mana_bonus, icon, value
         FROM equipment_items WHERE id = ?1",
        params![item_id],
        |row| {
            Ok(EquipmentItem {
                id: row.get(0)?,
                name: row.get(1)?,
                description: row.get(2)?,
                slot: row.get(3)?,
                tier: row.get(4)?,
                required_level: row.get(5)?,
                damage_bonus: row.get(6)?,
                defense_bonus: row.get(7)?,
                hp_bonus: row.get(8)?,
                mana_bonus: row.get(9)?,
                icon: row.get(10)?,
                value: row.get(11)?,
            })
        },
    )
    .map_err(|e| e.to_string())?;

    Ok(item)
}

// Get a single consumable item
#[tauri::command]
pub fn get_consumable_item(app: AppHandle, item_id: String) -> Result<ConsumableItem, String> {
    let conn = db::get_connection(&app)?;

    let item = conn.query_row(
        "SELECT id, name, description, type, health_restore, mana_restore,
                buff_type, buff_value, buff_duration_turns, buy_price, sell_price, icon, tier
         FROM consumable_items WHERE id = ?1",
        params![item_id],
        |row| {
            Ok(ConsumableItem {
                id: row.get(0)?,
                name: row.get(1)?,
                description: row.get(2)?,
                consumable_type: row.get(3)?,
                health_restore: row.get(4)?,
                mana_restore: row.get(5)?,
                buff_type: row.get(6)?,
                buff_value: row.get(7)?,
                buff_duration_turns: row.get(8)?,
                buy_price: row.get(9)?,
                sell_price: row.get(10)?,
                icon: row.get(11)?,
                tier: row.get(12)?,
            })
        },
    )
    .map_err(|e| e.to_string())?;

    Ok(item)
}

// Delete an equipment item
#[tauri::command]
pub fn delete_equipment_item(app: AppHandle, item_id: String) -> Result<(), String> {
    let conn = db::get_connection(&app)?;

    conn.execute(
        "DELETE FROM equipment_items WHERE id = ?1",
        params![item_id],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

// Delete a consumable item
#[tauri::command]
pub fn delete_consumable_item(app: AppHandle, item_id: String) -> Result<(), String> {
    let conn = db::get_connection(&app)?;

    conn.execute(
        "DELETE FROM consumable_items WHERE id = ?1",
        params![item_id],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}
