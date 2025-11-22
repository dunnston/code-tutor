use rusqlite::{params, Result as SqlResult, Row};
use serde::{Deserialize, Serialize};
use tauri::AppHandle;

use crate::db::get_connection;

// ============================================================================
// CHARACTER STATS
// ============================================================================

#[derive(Debug, Serialize, Deserialize)]
pub struct CharacterStats {
    pub user_id: i64,
    pub level: i64,
    pub strength: i64,
    pub intelligence: i64,
    pub dexterity: i64,
    pub charisma: i64,
    pub max_health: i64,
    pub current_health: i64,
    pub max_mana: i64,
    pub current_mana: i64,
    pub base_damage: i64,
    pub defense: i64,
    pub critical_chance: f64,
    pub dodge_chance: f64,
    pub stat_points_available: i64,
    pub created_at: String,
    pub updated_at: String,
}

impl CharacterStats {
    fn from_row(row: &Row) -> SqlResult<Self> {
        Ok(CharacterStats {
            user_id: row.get(0)?,
            level: row.get(1)?,
            strength: row.get(2)?,
            intelligence: row.get(3)?,
            dexterity: row.get(4)?,
            charisma: row.get(5)?,
            max_health: row.get(6)?,
            current_health: row.get(7)?,
            max_mana: row.get(8)?,
            current_mana: row.get(9)?,
            base_damage: row.get(10)?,
            defense: row.get(11)?,
            critical_chance: row.get(12)?,
            dodge_chance: row.get(13)?,
            stat_points_available: row.get(14)?,
            created_at: row.get(15)?,
            updated_at: row.get(16)?,
        })
    }
}

#[tauri::command]
pub fn get_character_stats(app: AppHandle, user_id: i64) -> Result<CharacterStats, String> {
    let conn = get_connection(&app)?;

    log::info!("get_character_stats called with user_id={}", user_id);

    // Check if user exists
    let user_exists: Result<i64, _> = conn.query_row(
        "SELECT id FROM users WHERE id = ?",
        params![user_id],
        |row| row.get(0),
    );

    if user_exists.is_err() {
        return Err(format!("User with id={} does not exist in users table", user_id));
    }

    // Initialize character if doesn't exist (with default starting stats)
    // New defaults: all abilities start at 1, 2 stat points available, health=50, mana=30
    conn.execute(
        "INSERT OR IGNORE INTO character_stats (
            user_id, level, strength, intelligence, dexterity, charisma, max_health, current_health,
            max_mana, current_mana, base_damage, defense, critical_chance, dodge_chance,
            stat_points_available, created_at, updated_at
        ) VALUES (?, 1, 1, 1, 1, 1, 50, 50, 30, 30, 10, 5, 0.05, 0.05, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
        params![user_id],
    )
    .map_err(|e| format!("Failed to initialize character: {}", e))?;

    conn.query_row(
        "SELECT user_id, level, strength, intelligence, dexterity, charisma, max_health, current_health,
                max_mana, current_mana, base_damage, defense, critical_chance, dodge_chance,
                stat_points_available, created_at, updated_at
         FROM character_stats
         WHERE user_id = ?",
        params![user_id],
        CharacterStats::from_row,
    )
    .map_err(|e| format!("Failed to get character stats: {}", e))
}

#[tauri::command]
pub fn update_character_health(
    app: AppHandle,
    user_id: i64,
    current_health: i64,
) -> Result<CharacterStats, String> {
    let conn = get_connection(&app)?;

    conn.execute(
        "UPDATE character_stats
         SET current_health = ?, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?",
        params![current_health, user_id],
    )
    .map_err(|e| format!("Failed to update health: {}", e))?;

    get_character_stats(app, user_id)
}

#[tauri::command]
pub fn update_character_mana(
    app: AppHandle,
    user_id: i64,
    current_mana: i64,
) -> Result<CharacterStats, String> {
    let conn = get_connection(&app)?;

    conn.execute(
        "UPDATE character_stats
         SET current_mana = ?, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?",
        params![current_mana, user_id],
    )
    .map_err(|e| format!("Failed to update mana: {}", e))?;

    get_character_stats(app, user_id)
}

#[tauri::command]
pub fn distribute_stat_points(
    app: AppHandle,
    user_id: i64,
    strength_increase: i64,
    intelligence_increase: i64,
    dexterity_increase: i64,
) -> Result<CharacterStats, String> {
    let conn = get_connection(&app)?;

    let total_increase = strength_increase + intelligence_increase + dexterity_increase;

    // Get current stats
    let stats = get_character_stats(app.clone(), user_id)?;

    if stats.stat_points_available < total_increase {
        return Err("Not enough stat points available".to_string());
    }

    // Update stats
    conn.execute(
        "UPDATE character_stats
         SET strength = strength + ?,
             intelligence = intelligence + ?,
             dexterity = dexterity + ?,
             stat_points_available = stat_points_available - ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?",
        params![
            strength_increase,
            intelligence_increase,
            dexterity_increase,
            total_increase,
            user_id
        ],
    )
    .map_err(|e| format!("Failed to distribute stat points: {}", e))?;

    // Recalculate derived stats
    recalculate_derived_stats(app.clone(), user_id)?;

    get_character_stats(app, user_id)
}

#[tauri::command]
pub fn recalculate_derived_stats(app: AppHandle, user_id: i64) -> Result<(), String> {
    let conn = get_connection(&app)?;

    // Get current stats
    let stats = get_character_stats(app.clone(), user_id)?;

    // Calculate new max_health: Base 100 + (Level × 10)
    let new_max_health = 100 + (stats.level * 10);

    // Calculate new max_mana: Base 50 + (Intelligence × 2)
    let new_max_mana = 50 + (stats.intelligence * 2);

    // Calculate new defense: 5 + (STR / 5)
    let new_defense = 5 + (stats.strength / 5);

    // Calculate new critical_chance: 5% + (DEX × 0.5%)
    let new_critical_chance = 0.05 + (stats.dexterity as f64 * 0.005);

    // Calculate new dodge_chance: 5% + (DEX × 0.3%)
    let new_dodge_chance = 0.05 + (stats.dexterity as f64 * 0.003);

    // Update derived stats
    conn.execute(
        "UPDATE character_stats
         SET max_health = ?,
             max_mana = ?,
             defense = ?,
             critical_chance = ?,
             dodge_chance = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?",
        params![
            new_max_health,
            new_max_mana,
            new_defense,
            new_critical_chance,
            new_dodge_chance,
            user_id
        ],
    )
    .map_err(|e| format!("Failed to recalculate derived stats: {}", e))?;

    Ok(())
}

#[tauri::command]
pub fn restore_health_and_mana(app: AppHandle, user_id: i64) -> Result<CharacterStats, String> {
    let conn = get_connection(&app)?;

    conn.execute(
        "UPDATE character_stats
         SET current_health = max_health,
             current_mana = max_mana,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?",
        params![user_id],
    )
    .map_err(|e| format!("Failed to restore health and mana: {}", e))?;

    get_character_stats(app, user_id)
}

// ============================================================================
// EQUIPMENT
// ============================================================================

#[derive(Debug, Serialize, Deserialize)]
pub struct EquipmentItem {
    pub id: String,
    pub name: String,
    pub description: String,
    pub slot: String,
    pub tier: String,
    pub required_level: i64,
    pub required_strength: i64,
    pub required_intelligence: i64,
    pub required_dexterity: i64,
    pub damage_bonus: i64,
    pub defense_bonus: i64,
    pub hp_bonus: i64,
    pub mana_bonus: i64,
    pub strength_bonus: i64,
    pub intelligence_bonus: i64,
    pub dexterity_bonus: i64,
    pub critical_chance_bonus: f64,
    pub dodge_chance_bonus: f64,
    pub special_effects: Option<String>,
    pub icon: String,
    pub value: i64,
    pub created_at: String,
}

impl EquipmentItem {
    fn from_row(row: &Row) -> SqlResult<Self> {
        Ok(EquipmentItem {
            id: row.get(0)?,
            name: row.get(1)?,
            description: row.get(2)?,
            slot: row.get(3)?,
            tier: row.get(4)?,
            required_level: row.get(5)?,
            required_strength: row.get(6)?,
            required_intelligence: row.get(7)?,
            required_dexterity: row.get(8)?,
            damage_bonus: row.get(9)?,
            defense_bonus: row.get(10)?,
            hp_bonus: row.get(11)?,
            mana_bonus: row.get(12)?,
            strength_bonus: row.get(13)?,
            intelligence_bonus: row.get(14)?,
            dexterity_bonus: row.get(15)?,
            critical_chance_bonus: row.get(16)?,
            dodge_chance_bonus: row.get(17)?,
            special_effects: row.get(18)?,
            icon: row.get(19)?,
            value: row.get(20)?,
            created_at: row.get(21)?,
        })
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CharacterEquipment {
    pub user_id: i64,
    pub weapon_id: Option<String>,
    pub armor_id: Option<String>,
    pub accessory_id: Option<String>,
    pub shield_id: Option<String>,
    pub helmet_id: Option<String>,
    pub chest_id: Option<String>,
    pub boots_id: Option<String>,
    pub updated_at: String,
}

#[tauri::command]
pub fn get_equipment_items(app: AppHandle) -> Result<Vec<EquipmentItem>, String> {
    let conn = get_connection(&app)?;

    let mut stmt = conn
        .prepare(
            "SELECT id, name, description, slot, tier, required_level, required_strength,
                    required_intelligence, required_dexterity, damage_bonus, defense_bonus,
                    hp_bonus, mana_bonus, strength_bonus, intelligence_bonus, dexterity_bonus,
                    critical_chance_bonus, dodge_chance_bonus, special_effects, icon, value,
                    created_at
             FROM equipment_items
             ORDER BY tier, required_level",
        )
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    let items = stmt
        .query_map([], EquipmentItem::from_row)
        .map_err(|e| format!("Failed to query equipment items: {}", e))?
        .collect::<SqlResult<Vec<EquipmentItem>>>()
        .map_err(|e| format!("Failed to collect equipment items: {}", e))?;

    Ok(items)
}

#[tauri::command]
pub fn get_character_equipment(app: AppHandle, user_id: i64) -> Result<CharacterEquipment, String> {
    let conn = get_connection(&app)?;

    conn.query_row(
        "SELECT user_id, weapon_id, armor_id, accessory_id, shield_id, helmet_id, chest_id, boots_id, updated_at
         FROM character_equipment
         WHERE user_id = ?",
        params![user_id],
        |row| {
            Ok(CharacterEquipment {
                user_id: row.get(0)?,
                weapon_id: row.get(1)?,
                armor_id: row.get(2)?,
                accessory_id: row.get(3)?,
                shield_id: row.get(4)?,
                helmet_id: row.get(5)?,
                chest_id: row.get(6)?,
                boots_id: row.get(7)?,
                updated_at: row.get(8)?,
            })
        },
    )
    .map_err(|e| format!("Failed to get character equipment: {}", e))
}

#[tauri::command]
pub fn equip_item(
    app: AppHandle,
    user_id: i64,
    item_id: String,
    slot: String,
) -> Result<CharacterEquipment, String> {
    let conn = get_connection(&app)?;

    // Validate that the item exists and is the correct slot
    let item: EquipmentItem = conn
        .query_row(
            "SELECT id, name, description, slot, tier, required_level, required_strength,
                    required_intelligence, required_dexterity, damage_bonus, defense_bonus,
                    hp_bonus, mana_bonus, strength_bonus, intelligence_bonus, dexterity_bonus,
                    critical_chance_bonus, dodge_chance_bonus, special_effects, icon, value,
                    created_at
             FROM equipment_items
             WHERE id = ?",
            params![item_id],
            EquipmentItem::from_row,
        )
        .map_err(|e| format!("Item not found: {}", e))?;

    if item.slot != slot {
        return Err("Item slot mismatch".to_string());
    }

    // Check requirements
    let stats = get_character_stats(app.clone(), user_id)?;

    if stats.level < item.required_level {
        return Err(format!(
            "Level too low. Required: {}",
            item.required_level
        ));
    }

    if stats.strength < item.required_strength {
        return Err(format!(
            "Strength too low. Required: {}",
            item.required_strength
        ));
    }

    if stats.intelligence < item.required_intelligence {
        return Err(format!(
            "Intelligence too low. Required: {}",
            item.required_intelligence
        ));
    }

    if stats.dexterity < item.required_dexterity {
        return Err(format!(
            "Dexterity too low. Required: {}",
            item.required_dexterity
        ));
    }

    // Equip the item
    let column = match slot.as_str() {
        "weapon" => "weapon_id",
        "armor" => "armor_id",
        "accessory" => "accessory_id",
        _ => return Err("Invalid slot".to_string()),
    };

    conn.execute(
        &format!(
            "UPDATE character_equipment
             SET {} = ?, updated_at = CURRENT_TIMESTAMP
             WHERE user_id = ?",
            column
        ),
        params![item_id, user_id],
    )
    .map_err(|e| format!("Failed to equip item: {}", e))?;

    get_character_equipment(app, user_id)
}

#[tauri::command]
pub fn unequip_item(
    app: AppHandle,
    user_id: i64,
    slot: String,
) -> Result<CharacterEquipment, String> {
    let conn = get_connection(&app)?;

    let column = match slot.as_str() {
        "weapon" => "weapon_id",
        "armor" => "armor_id",
        "accessory" => "accessory_id",
        _ => return Err("Invalid slot".to_string()),
    };

    conn.execute(
        &format!(
            "UPDATE character_equipment
             SET {} = NULL, updated_at = CURRENT_TIMESTAMP
             WHERE user_id = ?",
            column
        ),
        params![user_id],
    )
    .map_err(|e| format!("Failed to unequip item: {}", e))?;

    get_character_equipment(app, user_id)
}

// ============================================================================
// ABILITIES
// ============================================================================

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Ability {
    pub id: String,
    pub name: String,
    pub description: String,
    pub ability_type: String,
    pub required_level: i64,
    pub mana_cost: i64,
    pub cooldown_turns: i64,
    pub base_value: i64,
    pub scaling_stat: String,
    pub scaling_ratio: f64,
    pub additional_effects: Option<String>,
    pub icon: String,
    pub animation_text: String,
    pub created_at: String,
}

impl Ability {
    fn from_row(row: &Row) -> SqlResult<Self> {
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
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserAbility {
    pub id: i64,
    pub user_id: i64,
    pub ability_id: String,
    pub unlocked_at: String,
    pub times_used: i64,
}

#[tauri::command]
pub fn get_user_abilities(app: AppHandle, user_id: i64) -> Result<Vec<Ability>, String> {
    let conn = get_connection(&app)?;

    let mut stmt = conn
        .prepare(
            "SELECT a.id, a.name, a.description, a.type, a.required_level, a.mana_cost,
                    a.cooldown_turns, a.base_value, a.scaling_stat, a.scaling_ratio,
                    a.additional_effects, a.icon, a.animation_text, a.created_at
             FROM abilities a
             INNER JOIN user_abilities ua ON a.id = ua.ability_id
             WHERE ua.user_id = ?
             ORDER BY a.required_level",
        )
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    let abilities = stmt
        .query_map(params![user_id], Ability::from_row)
        .map_err(|e| format!("Failed to query abilities: {}", e))?
        .collect::<SqlResult<Vec<Ability>>>()
        .map_err(|e| format!("Failed to collect abilities: {}", e))?;

    Ok(abilities)
}

#[tauri::command]
pub fn unlock_ability(app: AppHandle, user_id: i64, ability_id: String) -> Result<(), String> {
    let conn = get_connection(&app)?;

    conn.execute(
        "INSERT OR IGNORE INTO user_abilities (user_id, ability_id)
         VALUES (?, ?)",
        params![user_id, ability_id],
    )
    .map_err(|e| format!("Failed to unlock ability: {}", e))?;

    Ok(())
}

#[tauri::command]
pub fn check_ability_unlocks(app: AppHandle, user_id: i64) -> Result<Vec<Ability>, String> {
    let conn = get_connection(&app)?;

    // Get character level
    let stats = get_character_stats(app.clone(), user_id)?;

    // Get abilities that should be unlocked but aren't yet
    let mut stmt = conn
        .prepare(
            "SELECT a.id, a.name, a.description, a.type, a.required_level, a.mana_cost,
                    a.cooldown_turns, a.base_value, a.scaling_stat, a.scaling_ratio,
                    a.additional_effects, a.icon, a.animation_text, a.created_at
             FROM abilities a
             WHERE a.required_level <= ?
               AND NOT EXISTS (
                   SELECT 1 FROM user_abilities ua
                   WHERE ua.user_id = ? AND ua.ability_id = a.id
               )
             ORDER BY a.required_level",
        )
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    let new_abilities = stmt
        .query_map(params![stats.level, user_id], Ability::from_row)
        .map_err(|e| format!("Failed to query new abilities: {}", e))?
        .collect::<SqlResult<Vec<Ability>>>()
        .map_err(|e| format!("Failed to collect new abilities: {}", e))?;

    // Auto-unlock these abilities
    for ability in &new_abilities {
        unlock_ability(app.clone(), user_id, ability.id.clone())?;
    }

    Ok(new_abilities)
}

// ============================================================================
// CHARACTER SHEET & PROGRESSION
// ============================================================================

#[derive(Debug, Serialize, Deserialize)]
pub struct EquipmentInventoryItem {
    pub id: i64,
    pub user_id: i64,
    pub equipment_id: String,
    pub equipment: EquipmentItem,
    pub quantity: i64,
    pub acquired_at: String,
}

#[tauri::command]
pub fn get_equipment_inventory(app: AppHandle, user_id: i64) -> Result<Vec<EquipmentInventoryItem>, String> {
    let conn = get_connection(&app)?;

    let mut stmt = conn
        .prepare(
            "SELECT i.id, i.user_id, i.equipment_id, i.quantity, i.acquired_at,
                    e.id, e.name, e.description, e.slot, e.tier, e.required_level,
                    e.required_strength, e.required_intelligence, e.required_dexterity,
                    e.damage_bonus, e.defense_bonus, e.hp_bonus, e.mana_bonus,
                    e.strength_bonus, e.intelligence_bonus, e.dexterity_bonus,
                    e.critical_chance_bonus, e.dodge_chance_bonus, e.special_effects,
                    e.icon, e.value, e.created_at
             FROM user_equipment_inventory i
             INNER JOIN equipment_items e ON i.equipment_id = e.id
             WHERE i.user_id = ?
             ORDER BY e.tier DESC, e.required_level DESC",
        )
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    let items = stmt
        .query_map(params![user_id], |row| {
            Ok(EquipmentInventoryItem {
                id: row.get(0)?,
                user_id: row.get(1)?,
                equipment_id: row.get(2)?,
                quantity: row.get(3)?,
                acquired_at: row.get(4)?,
                equipment: EquipmentItem {
                    id: row.get(5)?,
                    name: row.get(6)?,
                    description: row.get(7)?,
                    slot: row.get(8)?,
                    tier: row.get(9)?,
                    required_level: row.get(10)?,
                    required_strength: row.get(11)?,
                    required_intelligence: row.get(12)?,
                    required_dexterity: row.get(13)?,
                    damage_bonus: row.get(14)?,
                    defense_bonus: row.get(15)?,
                    hp_bonus: row.get(16)?,
                    mana_bonus: row.get(17)?,
                    strength_bonus: row.get(18)?,
                    intelligence_bonus: row.get(19)?,
                    dexterity_bonus: row.get(20)?,
                    critical_chance_bonus: row.get(21)?,
                    dodge_chance_bonus: row.get(22)?,
                    special_effects: row.get(23)?,
                    icon: row.get(24)?,
                    value: row.get(25)?,
                    created_at: row.get(26)?,
                },
            })
        })
        .map_err(|e| format!("Failed to query inventory: {}", e))?
        .collect::<SqlResult<Vec<EquipmentInventoryItem>>>()
        .map_err(|e| format!("Failed to collect inventory: {}", e))?;

    Ok(items)
}

#[tauri::command]
pub fn equip_item_to_slot(
    app: AppHandle,
    user_id: i64,
    equipment_id: String,
    slot: String, // "weapon", "shield", "helmet", "chest", "boots"
) -> Result<CharacterEquipment, String> {
    let conn = get_connection(&app)?;

    // Check if item exists in user's inventory
    let has_item: bool = conn
        .query_row(
            "SELECT EXISTS(SELECT 1 FROM user_equipment_inventory WHERE user_id = ? AND equipment_id = ?)",
            params![user_id, equipment_id],
            |row| row.get(0),
        )
        .map_err(|e| format!("Failed to check inventory: {}", e))?;

    if !has_item {
        return Err("Item not in inventory".to_string());
    }

    // Determine which column to update based on slot
    let column = match slot.as_str() {
        "weapon" => "weapon_id",
        "shield" => "shield_id",
        "helmet" => "helmet_id",
        "chest" => "chest_id",
        "boots" => "boots_id",
        "armor" => "armor_id", // legacy support
        "accessory" => "accessory_id", // legacy support
        _ => return Err(format!("Invalid slot: {}", slot)),
    };

    // Update the equipment slot
    conn.execute(
        &format!("UPDATE character_equipment SET {} = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?", column),
        params![equipment_id, user_id],
    )
    .map_err(|e| format!("Failed to equip item: {}", e))?;

    // Remove from inventory (or decrement quantity)
    conn.execute(
        "DELETE FROM user_equipment_inventory WHERE user_id = ? AND equipment_id = ?",
        params![user_id, equipment_id],
    )
    .map_err(|e| format!("Failed to remove from inventory: {}", e))?;

    // Recalculate stats
    recalculate_derived_stats(app.clone(), user_id)?;

    // Return updated equipment
    get_character_equipment(app, user_id)
}

#[tauri::command]
pub fn unequip_item_from_slot(
    app: AppHandle,
    user_id: i64,
    slot: String,
) -> Result<CharacterEquipment, String> {
    let conn = get_connection(&app)?;

    // Determine which column to read from
    let column = match slot.as_str() {
        "weapon" => "weapon_id",
        "shield" => "shield_id",
        "helmet" => "helmet_id",
        "chest" => "chest_id",
        "boots" => "boots_id",
        "armor" => "armor_id",
        "accessory" => "accessory_id",
        _ => return Err(format!("Invalid slot: {}", slot)),
    };

    // Get the currently equipped item
    let equipped_id: Option<String> = conn
        .query_row(
            &format!("SELECT {} FROM character_equipment WHERE user_id = ?", column),
            params![user_id],
            |row| row.get(0),
        )
        .map_err(|e| format!("Failed to get equipped item: {}", e))?;

    if let Some(equipment_id) = equipped_id {
        // Add back to inventory
        conn.execute(
            "INSERT INTO user_equipment_inventory (user_id, equipment_id, quantity)
             VALUES (?, ?, 1)
             ON CONFLICT(user_id, equipment_id) DO UPDATE SET quantity = quantity + 1",
            params![user_id, equipment_id],
        )
        .map_err(|e| format!("Failed to add to inventory: {}", e))?;

        // Clear the equipment slot
        conn.execute(
            &format!("UPDATE character_equipment SET {} = NULL, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?", column),
            params![user_id],
        )
        .map_err(|e| format!("Failed to unequip item: {}", e))?;

        // Recalculate stats
        recalculate_derived_stats(app.clone(), user_id)?;
    }

    get_character_equipment(app, user_id)
}

#[tauri::command]
pub fn spend_stat_point_on_health(
    app: AppHandle,
    user_id: i64,
) -> Result<CharacterStats, String> {
    let conn = get_connection(&app)?;

    // Check if user has stat points available
    let stats = get_character_stats(app.clone(), user_id)?;
    if stats.stat_points_available <= 0 {
        return Err("No stat points available".to_string());
    }

    let old_max_health = stats.max_health;
    let health_increase = 5; // Each point gives +5 max HP
    let new_max_health = old_max_health + health_increase;

    // Update stats
    conn.execute(
        "UPDATE character_stats
         SET max_health = ?,
             current_health = current_health + ?,
             stat_points_available = stat_points_available - 1,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?",
        params![new_max_health, health_increase, user_id],
    )
    .map_err(|e| format!("Failed to update health: {}", e))?;

    // Log the stat point spend
    conn.execute(
        "INSERT INTO stat_point_history (user_id, stat_type, points_spent, previous_value, new_value)
         VALUES (?, 'health', 1, ?, ?)",
        params![user_id, old_max_health, new_max_health],
    )
    .map_err(|e| format!("Failed to log stat history: {}", e))?;

    get_character_stats(app, user_id)
}

#[tauri::command]
pub fn spend_stat_point_on_mana(
    app: AppHandle,
    user_id: i64,
) -> Result<CharacterStats, String> {
    let conn = get_connection(&app)?;

    // Check if user has stat points available
    let stats = get_character_stats(app.clone(), user_id)?;
    if stats.stat_points_available <= 0 {
        return Err("No stat points available".to_string());
    }

    let old_max_mana = stats.max_mana;
    let mana_increase = 5; // Each point gives +5 max mana
    let new_max_mana = old_max_mana + mana_increase;

    // Update stats
    conn.execute(
        "UPDATE character_stats
         SET max_mana = ?,
             current_mana = current_mana + ?,
             stat_points_available = stat_points_available - 1,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?",
        params![new_max_mana, mana_increase, user_id],
    )
    .map_err(|e| format!("Failed to update mana: {}", e))?;

    // Log the stat point spend
    conn.execute(
        "INSERT INTO stat_point_history (user_id, stat_type, points_spent, previous_value, new_value)
         VALUES (?, 'mana', 1, ?, ?)",
        params![user_id, old_max_mana, new_max_mana],
    )
    .map_err(|e| format!("Failed to log stat history: {}", e))?;

    get_character_stats(app, user_id)
}

#[tauri::command]
pub fn spend_stat_point_on_stat(
    app: AppHandle,
    user_id: i64,
    stat_name: String, // "strength", "intelligence", "dexterity", or "charisma"
) -> Result<CharacterStats, String> {
    let conn = get_connection(&app)?;

    // Validate stat name
    let valid_stats = ["strength", "intelligence", "dexterity", "charisma"];
    if !valid_stats.contains(&stat_name.as_str()) {
        return Err(format!("Invalid stat name: {}", stat_name));
    }

    // Check if user has stat points available
    let stats = get_character_stats(app.clone(), user_id)?;
    if stats.stat_points_available <= 0 {
        return Err("No stat points available".to_string());
    }

    // Get current value
    let old_value = match stat_name.as_str() {
        "strength" => stats.strength,
        "intelligence" => stats.intelligence,
        "dexterity" => stats.dexterity,
        "charisma" => stats.charisma,
        _ => return Err("Invalid stat".to_string()),
    };

    let new_value = old_value + 1;

    // Update the specific stat
    conn.execute(
        &format!(
            "UPDATE character_stats
             SET {} = ?,
                 stat_points_available = stat_points_available - 1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE user_id = ?",
            stat_name
        ),
        params![new_value, user_id],
    )
    .map_err(|e| format!("Failed to update {}: {}", stat_name, e))?;

    // Log the stat point spend
    conn.execute(
        "INSERT INTO stat_point_history (user_id, stat_type, points_spent, previous_value, new_value)
         VALUES (?, ?, 1, ?, ?)",
        params![user_id, stat_name, old_value, new_value],
    )
    .map_err(|e| format!("Failed to log stat history: {}", e))?;

    // Recalculate derived stats (damage, defense, etc)
    recalculate_derived_stats(app.clone(), user_id)?;

    get_character_stats(app, user_id)
}

#[tauri::command]
pub fn spend_stat_point_on_ability(
    app: AppHandle,
    user_id: i64,
    ability_id: String,
) -> Result<CharacterStats, String> {
    let conn = get_connection(&app)?;

    // Check if user has stat points available
    let stats = get_character_stats(app.clone(), user_id)?;
    if stats.stat_points_available <= 0 {
        return Err("No stat points available".to_string());
    }

    // Check if user has this ability unlocked
    let has_ability: bool = conn
        .query_row(
            "SELECT EXISTS(SELECT 1 FROM user_abilities WHERE user_id = ? AND ability_id = ?)",
            params![user_id, ability_id],
            |row| row.get(0),
        )
        .map_err(|e| format!("Failed to check ability: {}", e))?;

    if !has_ability {
        return Err("Ability not unlocked".to_string());
    }

    // Level up the ability
    conn.execute(
        "UPDATE user_abilities
         SET ability_level = ability_level + 1
         WHERE user_id = ? AND ability_id = ?",
        params![user_id, ability_id],
    )
    .map_err(|e| format!("Failed to level up ability: {}", e))?;

    // Spend the stat point
    conn.execute(
        "UPDATE character_stats
         SET stat_points_available = stat_points_available - 1,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?",
        params![user_id],
    )
    .map_err(|e| format!("Failed to spend stat point: {}", e))?;

    get_character_stats(app, user_id)
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserAbilityWithLevel {
    pub ability_id: String,
    pub ability_level: i64,
    pub times_used: i64,
    pub unlocked_at: String,
    pub ability: Ability,
}

#[tauri::command]
pub fn get_user_abilities_with_levels(
    app: AppHandle,
    user_id: i64,
) -> Result<Vec<UserAbilityWithLevel>, String> {
    let conn = get_connection(&app)?;

    let mut stmt = conn
        .prepare(
            "SELECT ua.ability_id, ua.ability_level, ua.times_used, ua.unlocked_at,
                    a.id, a.name, a.description, a.type, a.required_level,
                    a.mana_cost, a.cooldown_turns, a.base_value, a.scaling_stat,
                    a.scaling_ratio, a.additional_effects, a.icon, a.animation_text, a.created_at
             FROM user_abilities ua
             INNER JOIN abilities a ON ua.ability_id = a.id
             WHERE ua.user_id = ?
             ORDER BY a.required_level, a.name",
        )
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    let abilities = stmt
        .query_map(params![user_id], |row| {
            Ok(UserAbilityWithLevel {
                ability_id: row.get(0)?,
                ability_level: row.get(1)?,
                times_used: row.get(2)?,
                unlocked_at: row.get(3)?,
                ability: Ability {
                    id: row.get(4)?,
                    name: row.get(5)?,
                    description: row.get(6)?,
                    ability_type: row.get(7)?,
                    required_level: row.get(8)?,
                    mana_cost: row.get(9)?,
                    cooldown_turns: row.get(10)?,
                    base_value: row.get(11)?,
                    scaling_stat: row.get(12)?,
                    scaling_ratio: row.get(13)?,
                    additional_effects: row.get(14)?,
                    icon: row.get(15)?,
                    animation_text: row.get(16)?,
                    created_at: row.get(17)?,
                },
            })
        })
        .map_err(|e| format!("Failed to query abilities: {}", e))?
        .collect::<SqlResult<Vec<UserAbilityWithLevel>>>()
        .map_err(|e| format!("Failed to collect abilities: {}", e))?;

    Ok(abilities)
}

// Get all abilities with their unlock status for a user
#[derive(serde::Serialize)]
pub struct AbilityWithUnlockStatus {
    #[serde(flatten)]
    pub ability: Ability,
    pub is_unlocked: bool,
    pub is_active: bool,
    pub active_slot: Option<i64>,
}

#[tauri::command]
pub fn get_all_abilities_with_status(
    app: AppHandle,
    user_id: i64,
) -> Result<Vec<AbilityWithUnlockStatus>, String> {
    let conn = get_connection(&app)?;

    let mut stmt = conn
        .prepare(
            "SELECT a.id, a.name, a.description, a.type, a.required_level, a.mana_cost,
                    a.cooldown_turns, a.base_value, a.scaling_stat, a.scaling_ratio,
                    a.additional_effects, a.icon, a.animation_text, a.created_at,
                    CASE WHEN ua.user_id IS NOT NULL THEN 1 ELSE 0 END as is_unlocked,
                    CASE WHEN uaa.user_id IS NOT NULL THEN 1 ELSE 0 END as is_active,
                    uaa.slot_number
             FROM abilities a
             LEFT JOIN user_abilities ua ON a.id = ua.ability_id AND ua.user_id = ?
             LEFT JOIN user_active_abilities uaa ON a.id = uaa.ability_id AND uaa.user_id = ?
             ORDER BY a.required_level, a.name",
        )
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    let abilities = stmt
        .query_map(params![user_id, user_id], |row| {
            Ok(AbilityWithUnlockStatus {
                ability: Ability {
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
                },
                is_unlocked: row.get::<_, i64>(14)? == 1,
                is_active: row.get::<_, i64>(15)? == 1,
                active_slot: row.get(16).ok(),
            })
        })
        .map_err(|e| format!("Failed to query abilities: {}", e))?
        .collect::<SqlResult<Vec<AbilityWithUnlockStatus>>>()
        .map_err(|e| format!("Failed to collect abilities: {}", e))?;

    Ok(abilities)
}

// Set an ability as active in a specific slot (1, 2, or 3)
#[tauri::command]
pub fn set_active_ability(
    app: AppHandle,
    user_id: i64,
    ability_id: String,
    slot_number: i64,
) -> Result<(), String> {
    if slot_number < 1 || slot_number > 3 {
        return Err("Slot number must be between 1 and 3".to_string());
    }

    let conn = get_connection(&app)?;

    // Check if ability is unlocked
    let is_unlocked: bool = conn
        .query_row(
            "SELECT EXISTS(SELECT 1 FROM user_abilities WHERE user_id = ? AND ability_id = ?)",
            params![user_id, &ability_id],
            |row| row.get(0),
        )
        .map_err(|e| format!("Failed to check if ability is unlocked: {}", e))?;

    if !is_unlocked {
        return Err("Ability is not unlocked".to_string());
    }

    // Insert or replace the ability in the slot
    conn.execute(
        "INSERT INTO user_active_abilities (user_id, slot_number, ability_id)
         VALUES (?, ?, ?)
         ON CONFLICT(user_id, slot_number) DO UPDATE SET ability_id = excluded.ability_id",
        params![user_id, slot_number, &ability_id],
    )
    .map_err(|e| format!("Failed to set active ability: {}", e))?;

    Ok(())
}

// Remove an ability from an active slot
#[tauri::command]
pub fn remove_active_ability(app: AppHandle, user_id: i64, slot_number: i64) -> Result<(), String> {
    if slot_number < 1 || slot_number > 3 {
        return Err("Slot number must be between 1 and 3".to_string());
    }

    let conn = get_connection(&app)?;

    conn.execute(
        "DELETE FROM user_active_abilities WHERE user_id = ? AND slot_number = ?",
        params![user_id, slot_number],
    )
    .map_err(|e| format!("Failed to remove active ability: {}", e))?;

    Ok(())
}
