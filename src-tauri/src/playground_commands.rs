use rusqlite::params;
use serde::{Deserialize, Serialize};
use tauri::AppHandle;

use crate::db;

// ============================================================================
// TYPES
// ============================================================================

#[derive(Debug, Serialize, Deserialize)]
pub struct PlaygroundProject {
    pub id: String,
    pub user_id: i32,
    pub name: String,
    pub description: Option<String>,
    pub language_id: String,
    pub code: String,
    pub is_public: bool,
    pub is_favorite: bool,
    pub fork_count: i32,
    pub view_count: i32,
    pub like_count: i32,
    pub forked_from_id: Option<String>,
    pub tags: Option<String>, // JSON array
    pub created_at: String,
    pub updated_at: String,
    pub last_run_at: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PlaygroundTemplate {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub language_id: String,
    pub category: String,
    pub code: String,
    pub difficulty: Option<String>,
    pub tags: Option<String>,
    pub icon: Option<String>,
    pub is_featured: bool,
    pub order_index: Option<i32>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PlaygroundSnippet {
    pub id: String,
    pub user_id: Option<i32>,
    pub name: String,
    pub description: Option<String>,
    pub language_id: String,
    pub category: Option<String>,
    pub code: String,
    pub use_count: i32,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PlaygroundSession {
    pub id: i32,
    pub user_id: i32,
    pub language_id: String,
    pub code: Option<String>,
    pub last_saved_at: String,
}

// ============================================================================
// PROJECT COMMANDS
// ============================================================================

#[tauri::command]
pub fn get_playground_projects(
    app: AppHandle,
    user_id: i32,
) -> Result<Vec<PlaygroundProject>, String> {
    let conn = db::get_connection(&app)?;

    let mut stmt = conn
        .prepare(
            "SELECT id, user_id, name, description, language_id, code, is_public, is_favorite,
                    fork_count, view_count, like_count, forked_from_id, tags,
                    created_at, updated_at, last_run_at
             FROM playground_projects
             WHERE user_id = ?1
             ORDER BY updated_at DESC",
        )
        .map_err(|e| e.to_string())?;

    let projects = stmt
        .query_map([user_id], |row| {
            Ok(PlaygroundProject {
                id: row.get(0)?,
                user_id: row.get(1)?,
                name: row.get(2)?,
                description: row.get(3)?,
                language_id: row.get(4)?,
                code: row.get(5)?,
                is_public: row.get(6)?,
                is_favorite: row.get(7)?,
                fork_count: row.get(8)?,
                view_count: row.get(9)?,
                like_count: row.get(10)?,
                forked_from_id: row.get(11)?,
                tags: row.get(12)?,
                created_at: row.get(13)?,
                updated_at: row.get(14)?,
                last_run_at: row.get(15)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(projects)
}

#[tauri::command]
pub fn get_playground_project(app: AppHandle, project_id: String) -> Result<PlaygroundProject, String> {
    let conn = db::get_connection(&app)?;

    let project = conn
        .query_row(
            "SELECT id, user_id, name, description, language_id, code, is_public, is_favorite,
                    fork_count, view_count, like_count, forked_from_id, tags,
                    created_at, updated_at, last_run_at
             FROM playground_projects
             WHERE id = ?1",
            [&project_id],
            |row| {
                Ok(PlaygroundProject {
                    id: row.get(0)?,
                    user_id: row.get(1)?,
                    name: row.get(2)?,
                    description: row.get(3)?,
                    language_id: row.get(4)?,
                    code: row.get(5)?,
                    is_public: row.get(6)?,
                    is_favorite: row.get(7)?,
                    fork_count: row.get(8)?,
                    view_count: row.get(9)?,
                    like_count: row.get(10)?,
                    forked_from_id: row.get(11)?,
                    tags: row.get(12)?,
                    created_at: row.get(13)?,
                    updated_at: row.get(14)?,
                    last_run_at: row.get(15)?,
                })
            },
        )
        .map_err(|e| e.to_string())?;

    Ok(project)
}

#[tauri::command]
pub fn create_playground_project(
    app: AppHandle,
    user_id: i32,
    name: String,
    description: Option<String>,
    language_id: String,
    code: String,
    tags: Option<String>,
) -> Result<String, String> {
    let conn = db::get_connection(&app)?;

    // Generate unique ID
    let project_id = format!("proj_{}", uuid::Uuid::new_v4().to_string().replace("-", ""));

    conn.execute(
        "INSERT INTO playground_projects (id, user_id, name, description, language_id, code, tags)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
        params![project_id, user_id, name, description, language_id, code, tags],
    )
    .map_err(|e| e.to_string())?;

    Ok(project_id)
}

#[tauri::command]
pub fn update_playground_project(
    app: AppHandle,
    project_id: String,
    name: Option<String>,
    description: Option<String>,
    code: Option<String>,
    tags: Option<String>,
    is_public: Option<bool>,
    is_favorite: Option<bool>,
) -> Result<(), String> {
    let conn = db::get_connection(&app)?;

    // Build dynamic update query
    let mut updates = Vec::new();
    let mut params_vec: Vec<Box<dyn rusqlite::ToSql>> = Vec::new();

    if let Some(n) = name {
        updates.push("name = ?");
        params_vec.push(Box::new(n));
    }
    if let Some(d) = description {
        updates.push("description = ?");
        params_vec.push(Box::new(d));
    }
    if let Some(c) = code {
        updates.push("code = ?");
        params_vec.push(Box::new(c));
    }
    if let Some(t) = tags {
        updates.push("tags = ?");
        params_vec.push(Box::new(t));
    }
    if let Some(p) = is_public {
        updates.push("is_public = ?");
        params_vec.push(Box::new(p));
    }
    if let Some(f) = is_favorite {
        updates.push("is_favorite = ?");
        params_vec.push(Box::new(f));
    }

    updates.push("updated_at = CURRENT_TIMESTAMP");

    if updates.is_empty() {
        return Ok(());
    }

    let query = format!(
        "UPDATE playground_projects SET {} WHERE id = ?",
        updates.join(", ")
    );

    params_vec.push(Box::new(project_id));

    // Convert params to references
    let params_refs: Vec<&dyn rusqlite::ToSql> = params_vec.iter().map(|p| p.as_ref()).collect();

    conn.execute(&query, params_refs.as_slice())
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn delete_playground_project(app: AppHandle, project_id: String) -> Result<(), String> {
    let conn = db::get_connection(&app)?;

    conn.execute("DELETE FROM playground_projects WHERE id = ?1", [&project_id])
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn update_project_last_run(app: AppHandle, project_id: String) -> Result<(), String> {
    let conn = db::get_connection(&app)?;

    conn.execute(
        "UPDATE playground_projects SET last_run_at = CURRENT_TIMESTAMP WHERE id = ?1",
        [&project_id],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

// ============================================================================
// TEMPLATE COMMANDS
// ============================================================================

#[tauri::command]
pub fn get_playground_templates(
    app: AppHandle,
    language_id: Option<String>,
    category: Option<String>,
) -> Result<Vec<PlaygroundTemplate>, String> {
    let conn = db::get_connection(&app)?;

    let mut query = String::from(
        "SELECT id, name, description, language_id, category, code, difficulty, tags, icon, is_featured, order_index
         FROM playground_templates
         WHERE 1=1"
    );

    let mut params_vec: Vec<String> = Vec::new();

    if let Some(lang) = language_id {
        query.push_str(" AND language_id = ?");
        params_vec.push(lang);
    }

    if let Some(cat) = category {
        query.push_str(" AND category = ?");
        params_vec.push(cat);
    }

    query.push_str(" ORDER BY order_index, name");

    let mut stmt = conn.prepare(&query).map_err(|e| e.to_string())?;

    let params_refs: Vec<&dyn rusqlite::ToSql> = params_vec
        .iter()
        .map(|p| p as &dyn rusqlite::ToSql)
        .collect();

    let templates = stmt
        .query_map(params_refs.as_slice(), |row| {
            Ok(PlaygroundTemplate {
                id: row.get(0)?,
                name: row.get(1)?,
                description: row.get(2)?,
                language_id: row.get(3)?,
                category: row.get(4)?,
                code: row.get(5)?,
                difficulty: row.get(6)?,
                tags: row.get(7)?,
                icon: row.get(8)?,
                is_featured: row.get(9)?,
                order_index: row.get(10)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(templates)
}

#[tauri::command]
pub fn get_playground_template(app: AppHandle, template_id: String) -> Result<PlaygroundTemplate, String> {
    let conn = db::get_connection(&app)?;

    let template = conn
        .query_row(
            "SELECT id, name, description, language_id, category, code, difficulty, tags, icon, is_featured, order_index
             FROM playground_templates
             WHERE id = ?1",
            [&template_id],
            |row| {
                Ok(PlaygroundTemplate {
                    id: row.get(0)?,
                    name: row.get(1)?,
                    description: row.get(2)?,
                    language_id: row.get(3)?,
                    category: row.get(4)?,
                    code: row.get(5)?,
                    difficulty: row.get(6)?,
                    tags: row.get(7)?,
                    icon: row.get(8)?,
                    is_featured: row.get(9)?,
                    order_index: row.get(10)?,
                })
            },
        )
        .map_err(|e| e.to_string())?;

    Ok(template)
}

// ============================================================================
// SNIPPET COMMANDS
// ============================================================================

#[tauri::command]
pub fn get_playground_snippets(
    app: AppHandle,
    language_id: Option<String>,
    category: Option<String>,
    user_only: bool,
    user_id: i32,
) -> Result<Vec<PlaygroundSnippet>, String> {
    let conn = db::get_connection(&app)?;

    let mut query = String::from(
        "SELECT id, user_id, name, description, language_id, category, code, use_count, created_at
         FROM playground_snippets
         WHERE 1=1"
    );

    let mut params_vec: Vec<Box<dyn rusqlite::ToSql>> = Vec::new();

    if user_only {
        query.push_str(" AND (user_id = ? OR user_id IS NULL)");
        params_vec.push(Box::new(user_id));
    }

    if let Some(lang) = language_id {
        query.push_str(" AND language_id = ?");
        params_vec.push(Box::new(lang));
    }

    if let Some(cat) = category {
        query.push_str(" AND category = ?");
        params_vec.push(Box::new(cat));
    }

    query.push_str(" ORDER BY use_count DESC, name");

    let mut stmt = conn.prepare(&query).map_err(|e| e.to_string())?;

    let params_refs: Vec<&dyn rusqlite::ToSql> = params_vec.iter().map(|p| p.as_ref()).collect();

    let snippets = stmt
        .query_map(params_refs.as_slice(), |row| {
            Ok(PlaygroundSnippet {
                id: row.get(0)?,
                user_id: row.get(1)?,
                name: row.get(2)?,
                description: row.get(3)?,
                language_id: row.get(4)?,
                category: row.get(5)?,
                code: row.get(6)?,
                use_count: row.get(7)?,
                created_at: row.get(8)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(snippets)
}

#[tauri::command]
pub fn create_playground_snippet(
    app: AppHandle,
    user_id: i32,
    name: String,
    description: Option<String>,
    language_id: String,
    category: Option<String>,
    code: String,
) -> Result<String, String> {
    let conn = db::get_connection(&app)?;

    // Generate unique ID
    let snippet_id = format!("snip_{}", uuid::Uuid::new_v4().to_string().replace("-", ""));

    conn.execute(
        "INSERT INTO playground_snippets (id, user_id, name, description, language_id, category, code)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
        params![snippet_id, user_id, name, description, language_id, category, code],
    )
    .map_err(|e| e.to_string())?;

    Ok(snippet_id)
}

#[tauri::command]
pub fn increment_snippet_use_count(app: AppHandle, snippet_id: String) -> Result<(), String> {
    let conn = db::get_connection(&app)?;

    conn.execute(
        "UPDATE playground_snippets SET use_count = use_count + 1 WHERE id = ?1",
        [&snippet_id],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

// ============================================================================
// SESSION COMMANDS (Auto-save)
// ============================================================================

#[tauri::command]
pub fn get_playground_session(
    app: AppHandle,
    user_id: i32,
    language_id: String,
) -> Result<Option<PlaygroundSession>, String> {
    let conn = db::get_connection(&app)?;

    let result = conn.query_row(
        "SELECT id, user_id, language_id, code, last_saved_at
         FROM playground_sessions
         WHERE user_id = ?1 AND language_id = ?2",
        params![user_id, language_id],
        |row| {
            Ok(PlaygroundSession {
                id: row.get(0)?,
                user_id: row.get(1)?,
                language_id: row.get(2)?,
                code: row.get(3)?,
                last_saved_at: row.get(4)?,
            })
        },
    );

    match result {
        Ok(session) => Ok(Some(session)),
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub fn save_playground_session(
    app: AppHandle,
    user_id: i32,
    language_id: String,
    code: String,
) -> Result<(), String> {
    let conn = db::get_connection(&app)?;

    conn.execute(
        "INSERT INTO playground_sessions (user_id, language_id, code, last_saved_at)
         VALUES (?1, ?2, ?3, CURRENT_TIMESTAMP)
         ON CONFLICT(user_id, language_id) DO UPDATE SET
            code = excluded.code,
            last_saved_at = CURRENT_TIMESTAMP",
        params![user_id, language_id, code],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

// ============================================================================
// FORK/LIKE COMMANDS
// ============================================================================

#[tauri::command]
pub fn fork_playground_project(
    app: AppHandle,
    user_id: i32,
    original_project_id: String,
    new_name: String,
) -> Result<String, String> {
    let conn = db::get_connection(&app)?;

    // Get original project
    let original = get_playground_project(app.clone(), original_project_id.clone())?;

    // Create new project
    let new_id = format!("proj_{}", uuid::Uuid::new_v4().to_string().replace("-", ""));

    conn.execute(
        "INSERT INTO playground_projects (id, user_id, name, description, language_id, code, forked_from_id, tags)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
        params![
            new_id,
            user_id,
            new_name,
            original.description,
            original.language_id,
            original.code,
            original_project_id,
            original.tags
        ],
    )
    .map_err(|e| e.to_string())?;

    // Increment fork count on original
    conn.execute(
        "UPDATE playground_projects SET fork_count = fork_count + 1 WHERE id = ?1",
        [&original_project_id],
    )
    .map_err(|e| e.to_string())?;

    Ok(new_id)
}
