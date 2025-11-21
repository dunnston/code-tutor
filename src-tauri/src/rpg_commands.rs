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
            max_health: row.get(5)?,
            current_health: row.get(6)?,
            max_mana: row.get(7)?,
            current_mana: row.get(8)?,
            base_damage: row.get(9)?,
            defense: row.get(10)?,
            critical_chance: row.get(11)?,
            dodge_chance: row.get(12)?,
            stat_points_available: row.get(13)?,
            created_at: row.get(14)?,
            updated_at: row.get(15)?,
        })
    }
}

#[tauri::command]
pub fn get_character_stats(app: AppHandle, user_id: i64) -> Result<CharacterStats, String> {
    let conn = get_connection(&app)?;

    // Initialize character if doesn't exist (with default starting stats)
    conn.execute(
        "INSERT OR IGNORE INTO character_stats (
            user_id, level, strength, intelligence, dexterity, max_health, current_health,
            max_mana, current_mana, base_damage, defense, critical_chance, dodge_chance,
            stat_points_available, created_at, updated_at
        ) VALUES (?, 1, 10, 10, 10, 100, 100, 50, 50, 10, 5, 0.05, 0.05, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
        params![user_id],
    )
    .map_err(|e| format!("Failed to initialize character: {}", e))?;

    conn.query_row(
        "SELECT user_id, level, strength, intelligence, dexterity, max_health, current_health,
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
        "SELECT user_id, weapon_id, armor_id, accessory_id, updated_at
         FROM character_equipment
         WHERE user_id = ?",
        params![user_id],
        |row| {
            Ok(CharacterEquipment {
                user_id: row.get(0)?,
                weapon_id: row.get(1)?,
                armor_id: row.get(2)?,
                accessory_id: row.get(3)?,
                updated_at: row.get(4)?,
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
