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

// ============================================================================
// USER PROGRESS TRACKING
// ============================================================================

#[derive(Debug, Serialize, Deserialize)]
pub struct UserPuzzleProgress {
    pub id: i32,
    pub user_id: i32,
    pub puzzle_id: String,
    pub language_id: String,
    pub status: String,
    pub attempts: i32,
    pub hints_used: i32,
    pub user_solution: Option<String>,
    pub solve_time: Option<i32>,
    pub solution_lines: Option<i32>,
    pub first_attempt_at: Option<String>,
    pub solved_at: Option<String>,
    pub last_attempt_at: Option<String>,
    pub is_optimal: bool,
    pub solution_viewed: bool,
    pub solution_viewed_at: Option<String>,
}

/// Get user progress for a specific puzzle
#[tauri::command]
pub fn get_puzzle_progress(
    app: AppHandle,
    puzzle_id: String,
    language_id: String,
) -> Result<Option<UserPuzzleProgress>, String> {
    let conn = db::get_connection(&app)?;

    let result = conn.query_row(
        "SELECT id, user_id, puzzle_id, language_id, status, attempts, hints_used,
                user_solution, solve_time, solution_lines,
                first_attempt_at, solved_at, last_attempt_at, is_optimal,
                COALESCE(solution_viewed, 0) as solution_viewed, solution_viewed_at
         FROM user_puzzle_progress
         WHERE user_id = 1 AND puzzle_id = ?1 AND language_id = ?2",
        params![puzzle_id, language_id],
        |row| {
            Ok(UserPuzzleProgress {
                id: row.get(0)?,
                user_id: row.get(1)?,
                puzzle_id: row.get(2)?,
                language_id: row.get(3)?,
                status: row.get(4)?,
                attempts: row.get(5)?,
                hints_used: row.get(6)?,
                user_solution: row.get(7)?,
                solve_time: row.get(8)?,
                solution_lines: row.get(9)?,
                first_attempt_at: row.get(10)?,
                solved_at: row.get(11)?,
                last_attempt_at: row.get(12)?,
                is_optimal: row.get(13)?,
                solution_viewed: row.get(14)?,
                solution_viewed_at: row.get(15)?,
            })
        },
    );

    match result {
        Ok(progress) => Ok(Some(progress)),
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
        Err(e) => Err(format!("Failed to get puzzle progress: {}", e)),
    }
}

/// Record a puzzle attempt
#[tauri::command]
pub fn record_puzzle_attempt(
    app: AppHandle,
    puzzle_id: String,
    language_id: String,
    user_solution: String,
) -> Result<(), String> {
    let conn = db::get_connection(&app)?;

    // Check if progress record exists
    let exists: bool = conn
        .query_row(
            "SELECT COUNT(*) > 0 FROM user_puzzle_progress
             WHERE user_id = 1 AND puzzle_id = ?1 AND language_id = ?2",
            params![&puzzle_id, &language_id],
            |row| row.get(0),
        )
        .map_err(|e| format!("Failed to check progress: {}", e))?;

    if exists {
        // Update existing record
        conn.execute(
            "UPDATE user_puzzle_progress
             SET attempts = attempts + 1,
                 status = CASE WHEN status = 'not_started' THEN 'attempted' ELSE status END,
                 user_solution = ?3,
                 last_attempt_at = CURRENT_TIMESTAMP
             WHERE user_id = 1 AND puzzle_id = ?1 AND language_id = ?2",
            params![&puzzle_id, &language_id, &user_solution],
        )
        .map_err(|e| format!("Failed to update attempt: {}", e))?;
    } else {
        // Create new record
        conn.execute(
            "INSERT INTO user_puzzle_progress
             (user_id, puzzle_id, language_id, status, attempts, user_solution,
              first_attempt_at, last_attempt_at)
             VALUES (1, ?1, ?2, 'attempted', 1, ?3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
            params![&puzzle_id, &language_id, &user_solution],
        )
        .map_err(|e| format!("Failed to insert attempt: {}", e))?;
    }

    Ok(())
}

/// Record hint usage
#[tauri::command]
pub fn record_hint_used(
    app: AppHandle,
    puzzle_id: String,
    language_id: String,
) -> Result<(), String> {
    let conn = db::get_connection(&app)?;

    conn.execute(
        "INSERT INTO user_puzzle_progress
         (user_id, puzzle_id, language_id, hints_used)
         VALUES (1, ?1, ?2, 1)
         ON CONFLICT(user_id, puzzle_id, language_id)
         DO UPDATE SET hints_used = hints_used + 1",
        params![puzzle_id, language_id],
    )
    .map_err(|e| format!("Failed to record hint: {}", e))?;

    Ok(())
}

/// Record solution viewed
#[tauri::command]
pub fn record_solution_viewed(
    app: AppHandle,
    puzzle_id: String,
    language_id: String,
) -> Result<(), String> {
    let conn = db::get_connection(&app)?;

    conn.execute(
        "INSERT INTO user_puzzle_progress
         (user_id, puzzle_id, language_id, solution_viewed, solution_viewed_at)
         VALUES (1, ?1, ?2, 1, CURRENT_TIMESTAMP)
         ON CONFLICT(user_id, puzzle_id, language_id)
         DO UPDATE SET solution_viewed = 1, solution_viewed_at = CURRENT_TIMESTAMP",
        params![puzzle_id, language_id],
    )
    .map_err(|e| format!("Failed to record solution viewed: {}", e))?;

    Ok(())
}

/// Mark puzzle as solved and award points
#[tauri::command]
pub fn mark_puzzle_solved(
    app: AppHandle,
    puzzle_id: String,
    language_id: String,
    user_solution: String,
    solve_time_seconds: i32,
) -> Result<i32, String> {
    let conn = db::get_connection(&app)?;

    // Check if solution was viewed
    let solution_viewed: bool = conn
        .query_row(
            "SELECT COALESCE(solution_viewed, 0) FROM user_puzzle_progress
             WHERE user_id = 1 AND puzzle_id = ?1 AND language_id = ?2",
            params![&puzzle_id, &language_id],
            |row| row.get(0),
        )
        .unwrap_or(false);

    // Get puzzle points (0 if solution was viewed)
    let points: i32 = if solution_viewed {
        0
    } else {
        conn.query_row(
            "SELECT points FROM puzzles WHERE id = ?1",
            params![&puzzle_id],
            |row| row.get(0),
        )
        .map_err(|e| format!("Failed to get puzzle points: {}", e))?
    };

    // Count lines of code
    let solution_lines = user_solution.lines().filter(|l| !l.trim().is_empty()).count() as i32;

    // Update or insert progress
    let exists: bool = conn
        .query_row(
            "SELECT COUNT(*) > 0 FROM user_puzzle_progress
             WHERE user_id = 1 AND puzzle_id = ?1 AND language_id = ?2",
            params![&puzzle_id, &language_id],
            |row| row.get(0),
        )
        .map_err(|e| format!("Failed to check progress: {}", e))?;

    if exists {
        // Only update if not already solved
        conn.execute(
            "UPDATE user_puzzle_progress
             SET status = 'solved',
                 user_solution = ?3,
                 solve_time = ?4,
                 solution_lines = ?5,
                 solved_at = CURRENT_TIMESTAMP,
                 last_attempt_at = CURRENT_TIMESTAMP
             WHERE user_id = 1 AND puzzle_id = ?1 AND language_id = ?2
               AND status != 'solved'",
            params![&puzzle_id, &language_id, &user_solution, solve_time_seconds, solution_lines],
        )
        .map_err(|e| format!("Failed to update solved status: {}", e))?;
    } else {
        conn.execute(
            "INSERT INTO user_puzzle_progress
             (user_id, puzzle_id, language_id, status, attempts, user_solution,
              solve_time, solution_lines, first_attempt_at, solved_at, last_attempt_at)
             VALUES (1, ?1, ?2, 'solved', 1, ?3, ?4, ?5,
                     CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
            params![&puzzle_id, &language_id, &user_solution, solve_time_seconds, solution_lines],
        )
        .map_err(|e| format!("Failed to insert solved record: {}", e))?;
    }

    // Update puzzle solve count (only if points were awarded)
    if points > 0 {
        conn.execute(
            "UPDATE puzzles SET solve_count = solve_count + 1 WHERE id = ?1",
            params![&puzzle_id],
        )
        .map_err(|e| format!("Failed to update solve count: {}", e))?;
    }

    Ok(points)
}
