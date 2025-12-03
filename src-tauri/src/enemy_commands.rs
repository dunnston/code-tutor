use rusqlite::{params, Connection, Result as SqlResult};
use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use crate::db;

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct CustomEnemy {
    pub id: String,
    pub name: String,
    pub description: String,
    pub enemy_type: String,
    pub level: i32,
    pub base_health: i32,
    pub base_attack: i32,
    pub base_defense: i32,
    pub image_path: String,
    pub attack_animation: Option<String>, // JSON string
    pub attacks: String, // JSON array of attacks
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EnemyListItem {
    pub id: String,
    pub name: String,
    pub enemy_type: String,
    pub level: i32,
    pub base_health: i32,
    pub image_path: String,
}

// Save or update a custom enemy
#[tauri::command]
pub fn save_custom_enemy(app: AppHandle, enemy: CustomEnemy) -> Result<(), String> {
    let conn = db::get_connection(&app)?;

    // Check if enemy exists
    let exists: bool = conn
        .query_row(
            "SELECT COUNT(*) FROM custom_enemies WHERE id = ?1",
            params![enemy.id],
            |row| row.get::<_, i32>(0),
        )
        .map(|count| count > 0)
        .unwrap_or(false);

    if exists {
        // Update existing enemy
        conn.execute(
            "UPDATE custom_enemies
             SET name = ?2, description = ?3, enemy_type = ?4, level = ?5,
                 base_health = ?6, base_attack = ?7, base_defense = ?8,
                 image_path = ?9, attack_animation = ?10, attacks = ?11,
                 updated_at = datetime('now')
             WHERE id = ?1",
            params![
                enemy.id,
                enemy.name,
                enemy.description,
                enemy.enemy_type,
                enemy.level,
                enemy.base_health,
                enemy.base_attack,
                enemy.base_defense,
                enemy.image_path,
                enemy.attack_animation,
                enemy.attacks,
            ],
        )
        .map_err(|e| e.to_string())?;
    } else {
        // Insert new enemy
        conn.execute(
            "INSERT INTO custom_enemies
             (id, name, description, enemy_type, level, base_health, base_attack,
              base_defense, image_path, attack_animation, attacks, created_at, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, datetime('now'), datetime('now'))",
            params![
                enemy.id,
                enemy.name,
                enemy.description,
                enemy.enemy_type,
                enemy.level,
                enemy.base_health,
                enemy.base_attack,
                enemy.base_defense,
                enemy.image_path,
                enemy.attack_animation,
                enemy.attacks,
            ],
        )
        .map_err(|e| e.to_string())?;
    }

    Ok(())
}

// Load a single custom enemy
#[tauri::command]
pub fn load_custom_enemy(app: AppHandle, enemy_id: String) -> Result<CustomEnemy, String> {
    let conn = db::get_connection(&app)?;

    let enemy = conn
        .query_row(
            "SELECT id, name, description, enemy_type, level, base_health, base_attack,
                    base_defense, image_path, attack_animation, attacks, created_at, updated_at
             FROM custom_enemies WHERE id = ?1",
            params![enemy_id],
            |row| {
                Ok(CustomEnemy {
                    id: row.get(0)?,
                    name: row.get(1)?,
                    description: row.get(2)?,
                    enemy_type: row.get(3)?,
                    level: row.get(4)?,
                    base_health: row.get(5)?,
                    base_attack: row.get(6)?,
                    base_defense: row.get(7)?,
                    image_path: row.get(8)?,
                    attack_animation: row.get(9)?,
                    attacks: row.get(10)?,
                    created_at: row.get(11)?,
                    updated_at: row.get(12)?,
                })
            },
        )
        .map_err(|e| e.to_string())?;

    Ok(enemy)
}

// List all custom enemies
#[tauri::command]
pub fn list_custom_enemies(app: AppHandle, enemy_type_filter: Option<String>) -> Result<Vec<EnemyListItem>, String> {
    let conn = db::get_connection(&app)?;

    let query = if let Some(filter) = enemy_type_filter {
        format!(
            "SELECT id, name, enemy_type, level, base_health, image_path
             FROM custom_enemies
             WHERE enemy_type = '{}'
             ORDER BY level ASC, name ASC",
            filter
        )
    } else {
        "SELECT id, name, enemy_type, level, base_health, image_path
         FROM custom_enemies
         ORDER BY level ASC, name ASC".to_string()
    };

    let mut stmt = conn.prepare(&query).map_err(|e| e.to_string())?;

    let enemies = stmt
        .query_map([], |row| {
            Ok(EnemyListItem {
                id: row.get(0)?,
                name: row.get(1)?,
                enemy_type: row.get(2)?,
                level: row.get(3)?,
                base_health: row.get(4)?,
                image_path: row.get(5)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<SqlResult<Vec<_>>>()
        .map_err(|e| e.to_string())?;

    Ok(enemies)
}

// Delete a custom enemy
#[tauri::command]
pub fn delete_custom_enemy(app: AppHandle, enemy_id: String) -> Result<(), String> {
    let conn = db::get_connection(&app)?;

    conn.execute(
        "DELETE FROM custom_enemies WHERE id = ?1",
        params![enemy_id],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

// Duplicate a custom enemy
#[tauri::command]
pub fn duplicate_custom_enemy(
    app: AppHandle,
    enemy_id: String,
    new_name: String,
) -> Result<String, String> {
    let existing_enemy = load_custom_enemy(app.clone(), enemy_id)?;

    let new_id = uuid::Uuid::new_v4().to_string();
    let now = chrono::Utc::now().to_rfc3339();

    let new_enemy = CustomEnemy {
        id: new_id.clone(),
        name: new_name,
        description: format!("Copy of {}", existing_enemy.description),
        enemy_type: existing_enemy.enemy_type,
        level: existing_enemy.level,
        base_health: existing_enemy.base_health,
        base_attack: existing_enemy.base_attack,
        base_defense: existing_enemy.base_defense,
        image_path: existing_enemy.image_path,
        attack_animation: existing_enemy.attack_animation,
        attacks: existing_enemy.attacks,
        created_at: now.clone(),
        updated_at: now,
    };

    save_custom_enemy(app, new_enemy)?;

    Ok(new_id)
}
