use rusqlite::params;
use serde::{Deserialize, Serialize};
use tauri::AppHandle;

use crate::db;

#[derive(Debug, Serialize, Deserialize)]
pub struct PuzzleCategory {
    pub id: String,
    pub name: String,
    pub description: String,
    pub icon: String,
    pub order_index: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Puzzle {
    pub id: String,
    pub category_id: String,
    pub title: String,
    pub description: String,
    pub difficulty: String,
    pub points: i32,
    pub concepts: Option<String>, // JSON string
    pub estimated_minutes: Option<i32>,
    pub solve_count: i32,
    pub average_time: Option<i32>,
    pub has_optimization: bool,
    pub optimal_time_complexity: Option<String>,
    pub optimal_space_complexity: Option<String>,
    pub optimal_lines_of_code: Option<i32>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PuzzleImplementation {
    pub id: i32,
    pub puzzle_id: String,
    pub language_id: String,
    pub starter_code: String,
    pub solution_code: String,
    pub test_cases: String, // JSON string
    pub hidden_tests: Option<String>, // JSON string
    pub hints: Option<String>, // JSON string
}

/// Get all puzzle categories
#[tauri::command]
pub fn get_puzzle_categories(app: AppHandle) -> Result<Vec<PuzzleCategory>, String> {
    let conn = db::get_connection(&app)?;

    let mut stmt = conn
        .prepare(
            "SELECT id, name, description, icon, order_index
             FROM puzzle_categories
             ORDER BY order_index",
        )
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    let categories = stmt
        .query_map([], |row| {
            Ok(PuzzleCategory {
                id: row.get(0)?,
                name: row.get(1)?,
                description: row.get(2)?,
                icon: row.get(3)?,
                order_index: row.get(4)?,
            })
        })
        .map_err(|e| format!("Failed to query categories: {}", e))?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| format!("Failed to collect categories: {}", e))?;

    Ok(categories)
}

/// Get puzzles by category
#[tauri::command]
pub fn get_puzzles_by_category(
    app: AppHandle,
    category_id: String,
) -> Result<Vec<Puzzle>, String> {
    let conn = db::get_connection(&app)?;

    let mut stmt = conn
        .prepare(
            "SELECT id, category_id, title, description, difficulty, points,
                    concepts, estimated_minutes, solve_count, average_time,
                    has_optimization, optimal_time_complexity, optimal_space_complexity,
                    optimal_lines_of_code
             FROM puzzles
             WHERE category_id = ?1
             ORDER BY difficulty, title",
        )
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    let puzzles = stmt
        .query_map(params![category_id], |row| {
            Ok(Puzzle {
                id: row.get(0)?,
                category_id: row.get(1)?,
                title: row.get(2)?,
                description: row.get(3)?,
                difficulty: row.get(4)?,
                points: row.get(5)?,
                concepts: row.get(6)?,
                estimated_minutes: row.get(7)?,
                solve_count: row.get(8)?,
                average_time: row.get(9)?,
                has_optimization: row.get(10)?,
                optimal_time_complexity: row.get(11)?,
                optimal_space_complexity: row.get(12)?,
                optimal_lines_of_code: row.get(13)?,
            })
        })
        .map_err(|e| format!("Failed to query puzzles: {}", e))?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| format!("Failed to collect puzzles: {}", e))?;

    Ok(puzzles)
}

/// Get a puzzle by ID
#[tauri::command]
pub fn get_puzzle(app: AppHandle, puzzle_id: String) -> Result<Puzzle, String> {
    let conn = db::get_connection(&app)?;

    let puzzle = conn
        .query_row(
            "SELECT id, category_id, title, description, difficulty, points,
                    concepts, estimated_minutes, solve_count, average_time,
                    has_optimization, optimal_time_complexity, optimal_space_complexity,
                    optimal_lines_of_code
             FROM puzzles
             WHERE id = ?1",
            params![puzzle_id],
            |row| {
                Ok(Puzzle {
                    id: row.get(0)?,
                    category_id: row.get(1)?,
                    title: row.get(2)?,
                    description: row.get(3)?,
                    difficulty: row.get(4)?,
                    points: row.get(5)?,
                    concepts: row.get(6)?,
                    estimated_minutes: row.get(7)?,
                    solve_count: row.get(8)?,
                    average_time: row.get(9)?,
                    has_optimization: row.get(10)?,
                    optimal_time_complexity: row.get(11)?,
                    optimal_space_complexity: row.get(12)?,
                    optimal_lines_of_code: row.get(13)?,
                })
            },
        )
        .map_err(|e| format!("Failed to get puzzle: {}", e))?;

    Ok(puzzle)
}

/// Get puzzle implementation for a specific language
#[tauri::command]
pub fn get_puzzle_implementation(
    app: AppHandle,
    puzzle_id: String,
    language_id: String,
) -> Result<PuzzleImplementation, String> {
    let conn = db::get_connection(&app)?;

    let implementation = conn
        .query_row(
            "SELECT id, puzzle_id, language_id, starter_code, solution_code,
                    test_cases, hidden_tests, hints
             FROM puzzle_implementations
             WHERE puzzle_id = ?1 AND language_id = ?2",
            params![puzzle_id, language_id],
            |row| {
                Ok(PuzzleImplementation {
                    id: row.get(0)?,
                    puzzle_id: row.get(1)?,
                    language_id: row.get(2)?,
                    starter_code: row.get(3)?,
                    solution_code: row.get(4)?,
                    test_cases: row.get(5)?,
                    hidden_tests: row.get(6)?,
                    hints: row.get(7)?,
                })
            },
        )
        .map_err(|e| format!("Failed to get puzzle implementation: {}", e))?;

    Ok(implementation)
}

/// Check if a puzzle has an implementation for a specific language
#[tauri::command]
pub fn has_puzzle_implementation(
    app: AppHandle,
    puzzle_id: String,
    language_id: String,
) -> Result<bool, String> {
    let conn = db::get_connection(&app)?;

    let count: i32 = conn
        .query_row(
            "SELECT COUNT(*) FROM puzzle_implementations
             WHERE puzzle_id = ?1 AND language_id = ?2",
            params![puzzle_id, language_id],
            |row| row.get(0),
        )
        .map_err(|e| format!("Failed to check implementation: {}", e))?;

    Ok(count > 0)
}
