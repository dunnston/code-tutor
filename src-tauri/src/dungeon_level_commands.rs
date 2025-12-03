use rusqlite::{params, Connection, Result as SqlResult};
use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use crate::db;

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct DungeonLevelMetadata {
    pub id: String,
    pub name: String,
    pub description: String,
    pub recommended_level: i32,
    pub difficulty: String,
    pub estimated_duration: i32,
    pub is_published: bool,
    pub version: i32,
    pub tags: Option<Vec<String>>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DungeonNode {
    pub id: String,
    #[serde(rename = "type")]
    pub node_type: String,
    pub data: serde_json::Value,
    pub position: Position,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Position {
    pub x: f64,
    pub y: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DungeonEdge {
    pub id: String,
    pub source: String,
    pub target: String,
    #[serde(rename = "sourceHandle")]
    pub source_handle: Option<String>,
    #[serde(rename = "targetHandle")]
    pub target_handle: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DungeonLevel {
    pub metadata: DungeonLevelMetadata,
    pub nodes: Vec<DungeonNode>,
    pub edges: Vec<DungeonEdge>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LevelListItem {
    pub id: String,
    pub name: String,
    pub description: String,
    pub recommended_level: i32,
    pub difficulty: String,
    pub is_published: bool,
    pub updated_at: String,
}

// Save or update a dungeon level
#[tauri::command]
pub fn save_dungeon_level(
    app: AppHandle,
    level: DungeonLevel,
) -> Result<(), String> {
    let conn = db::get_connection(&app)?;

    // Start transaction
    conn.execute("BEGIN TRANSACTION", [])
        .map_err(|e| e.to_string())?;

    // Insert or update metadata
    let tags_json = level
        .metadata
        .tags
        .as_ref()
        .map(|t| serde_json::to_string(t).unwrap_or_default());

    let result = conn.execute(
        "INSERT INTO dungeon_levels
        (id, name, description, recommended_level, difficulty, estimated_duration,
         is_published, version, tags, created_at, updated_at)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)
        ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            description = excluded.description,
            recommended_level = excluded.recommended_level,
            difficulty = excluded.difficulty,
            estimated_duration = excluded.estimated_duration,
            is_published = excluded.is_published,
            version = excluded.version,
            tags = excluded.tags,
            updated_at = excluded.updated_at",
        params![
            level.metadata.id,
            level.metadata.name,
            level.metadata.description,
            level.metadata.recommended_level,
            level.metadata.difficulty,
            level.metadata.estimated_duration,
            level.metadata.is_published,
            level.metadata.version,
            tags_json,
            level.metadata.created_at,
            level.metadata.updated_at,
        ],
    );

    if let Err(e) = result {
        conn.execute("ROLLBACK", []).ok();
        return Err(e.to_string());
    }

    // Delete existing nodes and edges
    conn.execute(
        "DELETE FROM dungeon_level_nodes WHERE level_id = ?1",
        params![level.metadata.id],
    )
    .map_err(|e| {
        conn.execute("ROLLBACK", []).ok();
        e.to_string()
    })?;

    conn.execute(
        "DELETE FROM dungeon_level_edges WHERE level_id = ?1",
        params![level.metadata.id],
    )
    .map_err(|e| {
        conn.execute("ROLLBACK", []).ok();
        e.to_string()
    })?;

    // Insert nodes
    for node in &level.nodes {
        let node_data_json = serde_json::to_string(&node.data).map_err(|e| {
            conn.execute("ROLLBACK", []).ok();
            e.to_string()
        })?;

        conn.execute(
            "INSERT INTO dungeon_level_nodes
            (id, level_id, node_data, position_x, position_y, node_type)
            VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            params![
                node.id,
                level.metadata.id,
                node_data_json,
                node.position.x,
                node.position.y,
                node.node_type,
            ],
        )
        .map_err(|e| {
            conn.execute("ROLLBACK", []).ok();
            e.to_string()
        })?;
    }

    // Insert edges
    for edge in &level.edges {
        conn.execute(
            "INSERT INTO dungeon_level_edges
            (id, level_id, source_node_id, target_node_id, source_handle, target_handle)
            VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            params![
                edge.id,
                level.metadata.id,
                edge.source,
                edge.target,
                edge.source_handle,
                edge.target_handle,
            ],
        )
        .map_err(|e| {
            conn.execute("ROLLBACK", []).ok();
            e.to_string()
        })?;
    }

    // Commit transaction
    conn.execute("COMMIT", []).map_err(|e| e.to_string())?;

    Ok(())
}

// Load a specific dungeon level
#[tauri::command]
pub fn load_dungeon_level(
    app: AppHandle,
    level_id: String,
) -> Result<DungeonLevel, String> {
    let conn = db::get_connection(&app)?;

    // Load metadata
    let mut stmt = conn
        .prepare(
            "SELECT id, name, description, recommended_level, difficulty,
             estimated_duration, is_published, version, tags, created_at, updated_at
             FROM dungeon_levels WHERE id = ?1",
        )
        .map_err(|e| e.to_string())?;

    let metadata = stmt
        .query_row(params![level_id], |row| {
            let tags_str: Option<String> = row.get(8)?;
            let tags = tags_str.and_then(|s| serde_json::from_str(&s).ok());

            Ok(DungeonLevelMetadata {
                id: row.get(0)?,
                name: row.get(1)?,
                description: row.get(2)?,
                recommended_level: row.get(3)?,
                difficulty: row.get(4)?,
                estimated_duration: row.get(5)?,
                is_published: row.get(6)?,
                version: row.get(7)?,
                tags,
                created_at: row.get(9)?,
                updated_at: row.get(10)?,
            })
        })
        .map_err(|e| e.to_string())?;

    // Load nodes
    let mut stmt = conn
        .prepare(
            "SELECT id, node_data, position_x, position_y, node_type
             FROM dungeon_level_nodes WHERE level_id = ?1",
        )
        .map_err(|e| e.to_string())?;

    let nodes = stmt
        .query_map(params![level_id], |row| {
            let node_data_str: String = row.get(1)?;
            let node_data: serde_json::Value =
                serde_json::from_str(&node_data_str).unwrap_or(serde_json::json!({}));

            Ok(DungeonNode {
                id: row.get(0)?,
                node_type: row.get(4)?,
                data: node_data,
                position: Position {
                    x: row.get(2)?,
                    y: row.get(3)?,
                },
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<SqlResult<Vec<_>>>()
        .map_err(|e| e.to_string())?;

    // Load edges
    let mut stmt = conn
        .prepare(
            "SELECT id, source_node_id, target_node_id, source_handle, target_handle
             FROM dungeon_level_edges WHERE level_id = ?1",
        )
        .map_err(|e| e.to_string())?;

    let edges = stmt
        .query_map(params![level_id], |row| {
            Ok(DungeonEdge {
                id: row.get(0)?,
                source: row.get(1)?,
                target: row.get(2)?,
                source_handle: row.get(3)?,
                target_handle: row.get(4)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<SqlResult<Vec<_>>>()
        .map_err(|e| e.to_string())?;

    Ok(DungeonLevel {
        metadata,
        nodes,
        edges,
    })
}

// Get list of all dungeon levels
#[tauri::command]
pub fn list_dungeon_levels(app: AppHandle) -> Result<Vec<LevelListItem>, String> {
    let conn = db::get_connection(&app)?;

    let mut stmt = conn
        .prepare(
            "SELECT id, name, description, recommended_level, difficulty, is_published, updated_at
             FROM dungeon_levels
             ORDER BY updated_at DESC",
        )
        .map_err(|e| e.to_string())?;

    let levels = stmt
        .query_map([], |row| {
            Ok(LevelListItem {
                id: row.get(0)?,
                name: row.get(1)?,
                description: row.get(2)?,
                recommended_level: row.get(3)?,
                difficulty: row.get(4)?,
                is_published: row.get(5)?,
                updated_at: row.get(6)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<SqlResult<Vec<_>>>()
        .map_err(|e| e.to_string())?;

    Ok(levels)
}

// Delete a dungeon level
#[tauri::command]
pub fn delete_dungeon_level(
    app: AppHandle,
    level_id: String,
) -> Result<(), String> {
    let conn = db::get_connection(&app)?;

    conn.execute(
        "DELETE FROM dungeon_levels WHERE id = ?1",
        params![level_id],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

// Duplicate a dungeon level
#[tauri::command]
pub fn duplicate_dungeon_level(
    app: AppHandle,
    level_id: String,
    new_name: String,
) -> Result<String, String> {
    // Load existing level
    let existing_level = load_dungeon_level(app.clone(), level_id)?;

    // Create new level with updated metadata
    let new_id = uuid::Uuid::new_v4().to_string();
    let now = chrono::Utc::now().to_rfc3339();

    let new_level = DungeonLevel {
        metadata: DungeonLevelMetadata {
            id: new_id.clone(),
            name: new_name,
            description: format!("Copy of {}", existing_level.metadata.description),
            recommended_level: existing_level.metadata.recommended_level,
            difficulty: existing_level.metadata.difficulty,
            estimated_duration: existing_level.metadata.estimated_duration,
            is_published: false,
            version: 1,
            tags: existing_level.metadata.tags,
            created_at: now.clone(),
            updated_at: now,
        },
        nodes: existing_level.nodes,
        edges: existing_level.edges,
    };

    // Save new level
    save_dungeon_level(app, new_level)?;

    Ok(new_id)
}

// Update level sequence order
#[tauri::command]
pub fn update_level_sequence(
    app: AppHandle,
    level_sequences: Vec<(String, i32)>, // Vec of (level_id, sequence_order)
) -> Result<(), String> {
    let conn = db::get_connection(&app)?;

    for (level_id, sequence_order) in level_sequences {
        conn.execute(
            "UPDATE dungeon_levels SET sequence_order = ?1 WHERE id = ?2",
            params![sequence_order, level_id],
        )
        .map_err(|e| e.to_string())?;
    }

    Ok(())
}

// Get levels in sequence order
#[tauri::command]
pub fn get_levels_in_sequence(app: AppHandle) -> Result<Vec<LevelListItem>, String> {
    let conn = db::get_connection(&app)?;

    let mut stmt = conn
        .prepare(
            "SELECT id, name, description, recommended_level, difficulty, is_published, updated_at
             FROM dungeon_levels
             WHERE sequence_order IS NOT NULL
             ORDER BY sequence_order ASC",
        )
        .map_err(|e| e.to_string())?;

    let levels = stmt
        .query_map([], |row| {
            Ok(LevelListItem {
                id: row.get(0)?,
                name: row.get(1)?,
                description: row.get(2)?,
                recommended_level: row.get(3)?,
                difficulty: row.get(4)?,
                is_published: row.get(5)?,
                updated_at: row.get(6)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<SqlResult<Vec<_>>>()
        .map_err(|e| e.to_string())?;

    Ok(levels)
}
