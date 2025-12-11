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
    user_id: i32,
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
         WHERE user_id = ?1 AND puzzle_id = ?2 AND language_id = ?3",
        params![user_id, puzzle_id, language_id],
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

/// Get all puzzle progress for a user (for batch loading)
#[tauri::command]
pub fn get_all_puzzle_progress(app: AppHandle, user_id: i32) -> Result<Vec<UserPuzzleProgress>, String> {
    let conn = db::get_connection(&app)?;

    let mut stmt = conn
        .prepare(
            "SELECT id, user_id, puzzle_id, language_id, status, attempts, hints_used,
                    user_solution, solve_time, solution_lines,
                    first_attempt_at, solved_at, last_attempt_at, is_optimal,
                    COALESCE(solution_viewed, 0) as solution_viewed, solution_viewed_at
             FROM user_puzzle_progress
             WHERE user_id = ?1",
        )
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    let progress_iter = stmt
        .query_map(params![user_id], |row| {
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
        })
        .map_err(|e| format!("Failed to query progress: {}", e))?;

    let mut results = Vec::new();
    for progress in progress_iter {
        results.push(progress.map_err(|e| format!("Failed to read progress: {}", e))?);
    }

    Ok(results)
}

/// Record a puzzle attempt
#[tauri::command]
pub fn record_puzzle_attempt(
    app: AppHandle,
    user_id: i32,
    puzzle_id: String,
    language_id: String,
    user_solution: String,
) -> Result<(), String> {
    let conn = db::get_connection(&app)?;

    // Check if progress record exists
    let exists: bool = conn
        .query_row(
            "SELECT COUNT(*) > 0 FROM user_puzzle_progress
             WHERE user_id = ?1 AND puzzle_id = ?2 AND language_id = ?3",
            params![user_id, &puzzle_id, &language_id],
            |row| row.get(0),
        )
        .map_err(|e| format!("Failed to check progress: {}", e))?;

    if exists {
        // Update existing record
        conn.execute(
            "UPDATE user_puzzle_progress
             SET attempts = attempts + 1,
                 status = CASE WHEN status = 'not_started' THEN 'attempted' ELSE status END,
                 user_solution = ?4,
                 last_attempt_at = CURRENT_TIMESTAMP
             WHERE user_id = ?1 AND puzzle_id = ?2 AND language_id = ?3",
            params![user_id, &puzzle_id, &language_id, &user_solution],
        )
        .map_err(|e| format!("Failed to update attempt: {}", e))?;
    } else {
        // Create new record
        conn.execute(
            "INSERT INTO user_puzzle_progress
             (user_id, puzzle_id, language_id, status, attempts, user_solution,
              first_attempt_at, last_attempt_at)
             VALUES (?1, ?2, ?3, 'attempted', 1, ?4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
            params![user_id, &puzzle_id, &language_id, &user_solution],
        )
        .map_err(|e| format!("Failed to insert attempt: {}", e))?;
    }

    Ok(())
}

/// Record hint usage
#[tauri::command]
pub fn record_hint_used(
    app: AppHandle,
    user_id: i32,
    puzzle_id: String,
    language_id: String,
) -> Result<(), String> {
    let conn = db::get_connection(&app)?;

    conn.execute(
        "INSERT INTO user_puzzle_progress
         (user_id, puzzle_id, language_id, hints_used)
         VALUES (?1, ?2, ?3, 1)
         ON CONFLICT(user_id, puzzle_id, language_id)
         DO UPDATE SET hints_used = hints_used + 1",
        params![user_id, puzzle_id, language_id],
    )
    .map_err(|e| format!("Failed to record hint: {}", e))?;

    Ok(())
}

/// Record solution viewed
#[tauri::command]
pub fn record_solution_viewed(
    app: AppHandle,
    user_id: i32,
    puzzle_id: String,
    language_id: String,
) -> Result<(), String> {
    let conn = db::get_connection(&app)?;

    conn.execute(
        "INSERT INTO user_puzzle_progress
         (user_id, puzzle_id, language_id, solution_viewed, solution_viewed_at)
         VALUES (?1, ?2, ?3, 1, CURRENT_TIMESTAMP)
         ON CONFLICT(user_id, puzzle_id, language_id)
         DO UPDATE SET solution_viewed = 1, solution_viewed_at = CURRENT_TIMESTAMP",
        params![user_id, puzzle_id, language_id],
    )
    .map_err(|e| format!("Failed to record solution viewed: {}", e))?;

    Ok(())
}

/// Mark puzzle as solved and award points
#[tauri::command]
pub fn mark_puzzle_solved(
    app: AppHandle,
    user_id: i32,
    puzzle_id: String,
    language_id: String,
    user_solution: String,
    solve_time_seconds: i32,
) -> Result<i32, String> {
    let conn = db::get_connection(&app)?;

    // Check if already solved or solution was viewed
    let (already_solved, solution_viewed): (bool, bool) = conn
        .query_row(
            "SELECT COALESCE(status = 'solved', 0), COALESCE(solution_viewed, 0)
             FROM user_puzzle_progress
             WHERE user_id = ?1 AND puzzle_id = ?2 AND language_id = ?3",
            params![user_id, &puzzle_id, &language_id],
            |row| Ok((row.get(0)?, row.get(1)?)),
        )
        .unwrap_or((false, false));

    // Get puzzle points (0 if already solved or solution was viewed)
    let points: i32 = if already_solved || solution_viewed {
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
             WHERE user_id = ?1 AND puzzle_id = ?2 AND language_id = ?3",
            params![user_id, &puzzle_id, &language_id],
            |row| row.get(0),
        )
        .map_err(|e| format!("Failed to check progress: {}", e))?;

    if exists {
        // Only update if not already solved
        conn.execute(
            "UPDATE user_puzzle_progress
             SET status = 'solved',
                 user_solution = ?4,
                 solve_time = ?5,
                 solution_lines = ?6,
                 solved_at = CURRENT_TIMESTAMP,
                 last_attempt_at = CURRENT_TIMESTAMP
             WHERE user_id = ?1 AND puzzle_id = ?2 AND language_id = ?3
               AND status != 'solved'",
            params![user_id, &puzzle_id, &language_id, &user_solution, solve_time_seconds, solution_lines],
        )
        .map_err(|e| format!("Failed to update solved status: {}", e))?;
    } else {
        conn.execute(
            "INSERT INTO user_puzzle_progress
             (user_id, puzzle_id, language_id, status, attempts, user_solution,
              solve_time, solution_lines, first_attempt_at, solved_at, last_attempt_at)
             VALUES (?1, ?2, ?3, 'solved', 1, ?4, ?5, ?6,
                     CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
            params![user_id, &puzzle_id, &language_id, &user_solution, solve_time_seconds, solution_lines],
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

// ============================================================================
// DAILY PUZZLE CHALLENGE
// ============================================================================

#[derive(Debug, Serialize, Deserialize)]
pub struct DailyPuzzleChallenge {
    pub id: i32,
    pub puzzle_id: String,
    pub date: String,
    pub bonus_points: i32,
    pub puzzle: Puzzle,
    pub completed_today: bool,
    pub completed_languages: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DailyPuzzleStreak {
    pub current_streak: i32,
    pub longest_streak: i32,
    pub total_completed: i32,
    pub last_completion_date: Option<String>,
}

/// Helper: Select appropriate puzzle for user based on their progress
fn select_daily_puzzle_for_user(conn: &rusqlite::Connection, user_id: i32) -> Result<String, String> {
    // Count incomplete puzzles by difficulty
    let easy_remaining: i32 = conn
        .query_row(
            "SELECT COUNT(*) FROM puzzles p
             WHERE p.difficulty = 'easy'
             AND NOT EXISTS (
                 SELECT 1 FROM user_puzzle_progress upp
                 WHERE upp.user_id = ?1 AND upp.puzzle_id = p.id AND upp.status = 'solved'
             )",
            params![user_id],
            |row| row.get(0),
        )
        .unwrap_or(0);

    let medium_remaining: i32 = conn
        .query_row(
            "SELECT COUNT(*) FROM puzzles p
             WHERE p.difficulty = 'medium'
             AND NOT EXISTS (
                 SELECT 1 FROM user_puzzle_progress upp
                 WHERE upp.user_id = ?1 AND upp.puzzle_id = p.id AND upp.status = 'solved'
             )",
            params![user_id],
            |row| row.get(0),
        )
        .unwrap_or(0);

    let hard_remaining: i32 = conn
        .query_row(
            "SELECT COUNT(*) FROM puzzles p
             WHERE p.difficulty = 'hard'
             AND NOT EXISTS (
                 SELECT 1 FROM user_puzzle_progress upp
                 WHERE upp.user_id = ?1 AND upp.puzzle_id = p.id AND upp.status = 'solved'
             )",
            params![user_id],
            |row| row.get(0),
        )
        .unwrap_or(0);

    let expert_remaining: i32 = conn
        .query_row(
            "SELECT COUNT(*) FROM puzzles p
             WHERE p.difficulty = 'expert'
             AND NOT EXISTS (
                 SELECT 1 FROM user_puzzle_progress upp
                 WHERE upp.user_id = ?1 AND upp.puzzle_id = p.id AND upp.status = 'solved'
             )",
            params![user_id],
            |row| row.get(0),
        )
        .unwrap_or(0);

    // Determine difficulty level
    let difficulty = if easy_remaining > 0 {
        "easy"
    } else if medium_remaining > 0 {
        "medium"
    } else if hard_remaining > 0 {
        "hard"
    } else if expert_remaining > 0 {
        "expert"
    } else {
        // All puzzles solved, select random from all
        "any"
    };

    // Select random puzzle at chosen difficulty
    let puzzle_id: String = if difficulty == "any" {
        conn.query_row(
            "SELECT id FROM puzzles ORDER BY RANDOM() LIMIT 1",
            [],
            |row| row.get(0),
        )
        .map_err(|e| format!("Failed to select random puzzle: {}", e))?
    } else {
        conn.query_row(
            "SELECT id FROM puzzles
             WHERE difficulty = ?1
             AND NOT EXISTS (
                 SELECT 1 FROM user_puzzle_progress upp
                 WHERE upp.user_id = ?2
                 AND upp.puzzle_id = puzzles.id
                 AND upp.status = 'solved'
             )
             ORDER BY RANDOM() LIMIT 1",
            params![difficulty, user_id],
            |row| row.get(0),
        )
        .map_err(|e| format!("Failed to select {} puzzle: {}", difficulty, e))?
    };

    Ok(puzzle_id)
}

/// Helper: Update daily puzzle streak
fn update_daily_puzzle_streak(
    tx: &rusqlite::Transaction,
    user_id: i32,
    today: &str,
) -> Result<(), String> {
    // Get current streak data
    let (current_streak, last_date): (i32, Option<String>) = tx
        .query_row(
            "SELECT daily_puzzle_streak, daily_puzzle_last_completion_date
             FROM user_achievement_stats
             WHERE user_id = ?1",
            params![user_id],
            |row| Ok((row.get(0)?, row.get(1)?)),
        )
        .unwrap_or((0, None));

    let new_streak = match last_date {
        None => 1, // First ever completion
        Some(last) => {
            // Parse dates
            let today_date = chrono::NaiveDate::parse_from_str(today, "%Y-%m-%d")
                .map_err(|e| format!("Invalid date format: {}", e))?;
            let last_date = chrono::NaiveDate::parse_from_str(&last, "%Y-%m-%d")
                .map_err(|e| format!("Invalid last date format: {}", e))?;

            let days_diff = today_date.signed_duration_since(last_date).num_days();

            match days_diff {
                0 => current_streak, // Same day, no change
                1 => current_streak + 1, // Consecutive day
                _ => 1, // Streak broken, start fresh
            }
        }
    };

    // Update streak
    tx.execute(
        "UPDATE user_achievement_stats
         SET daily_puzzle_streak = ?2,
             longest_daily_puzzle_streak = MAX(longest_daily_puzzle_streak, ?2)
         WHERE user_id = ?1",
        params![user_id, new_streak],
    )
    .map_err(|e| format!("Failed to update streak: {}", e))?;

    Ok(())
}

/// Get today's daily puzzle challenge
#[tauri::command]
pub fn get_daily_puzzle(app: AppHandle, user_id: i32) -> Result<DailyPuzzleChallenge, String> {
    let mut conn = db::get_connection(&app)?;

    // Get today's date (local)
    let today = chrono::Local::now().format("%Y-%m-%d").to_string();

    // Use a transaction to prevent race conditions when creating daily puzzles
    let tx = conn.transaction()
        .map_err(|e| format!("Failed to start transaction: {}", e))?;

    // Check if daily puzzle exists for today (within transaction for consistency)
    let existing_puzzle: Option<(i32, String, i32)> = tx
        .query_row(
            "SELECT id, puzzle_id, bonus_points FROM daily_puzzles WHERE date = ?1",
            params![&today],
            |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?)),
        )
        .ok();

    let (daily_id, puzzle_id, bonus_points) = match existing_puzzle {
        Some(data) => data,
        None => {
            // Generate new daily puzzle within transaction
            let selected_puzzle_id = select_daily_puzzle_for_user(&tx, user_id)?;

            tx.execute(
                "INSERT INTO daily_puzzles (puzzle_id, date, bonus_points)
                 VALUES (?1, ?2, 50)",
                params![&selected_puzzle_id, &today],
            )
            .map_err(|e| format!("Failed to insert daily puzzle: {}", e))?;

            let daily_id = tx.last_insert_rowid() as i32;
            (daily_id, selected_puzzle_id, 50)
        }
    };

    // Commit the transaction
    tx.commit()
        .map_err(|e| format!("Failed to commit transaction: {}", e))?;

    // Re-acquire connection for remaining read-only queries
    let conn = db::get_connection(&app)?;

    // Get puzzle details
    let puzzle = get_puzzle(app.clone(), puzzle_id.clone())?;

    // Check if user completed today
    let completed_today: bool = conn
        .query_row(
            "SELECT EXISTS(
                 SELECT 1 FROM user_puzzle_progress
                 WHERE user_id = ?1
                 AND puzzle_id = ?2
                 AND DATE(solved_at) = ?3
                 AND status = 'solved'
             )",
            params![user_id, &puzzle_id, &today],
            |row| row.get(0),
        )
        .unwrap_or(false);

    // Get languages completed in
    let mut stmt = conn
        .prepare(
            "SELECT language_id FROM user_puzzle_progress
             WHERE user_id = ?1 AND puzzle_id = ?2 AND status = 'solved'",
        )
        .map_err(|e| format!("Failed to query completed languages: {}", e))?;

    let completed_languages: Vec<String> = stmt
        .query_map(params![user_id, &puzzle_id], |row| row.get(0))
        .map_err(|e| format!("Failed to map languages: {}", e))?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| format!("Failed to collect languages: {}", e))?;

    Ok(DailyPuzzleChallenge {
        id: daily_id,
        puzzle_id,
        date: today,
        bonus_points,
        puzzle,
        completed_today,
        completed_languages,
    })
}

/// Complete today's daily puzzle and award bonus points
#[tauri::command]
pub fn complete_daily_puzzle(
    app: AppHandle,
    user_id: i32,
    puzzle_id: String,
    language_id: String,
) -> Result<i32, String> {
    let mut conn = db::get_connection(&app)?;

    let today = chrono::Local::now().format("%Y-%m-%d").to_string();

    // Check if this is the first completion today for this puzzle
    let first_completion_today: bool = conn
        .query_row(
            "SELECT NOT EXISTS(
                 SELECT 1 FROM user_puzzle_progress
                 WHERE user_id = ?1
                 AND puzzle_id = ?2
                 AND DATE(solved_at) = ?3
                 AND status = 'solved'
             )",
            params![user_id, &puzzle_id, &today],
            |row| row.get(0),
        )
        .unwrap_or(false);

    let bonus_awarded = if first_completion_today {
        let tx = conn.transaction().map_err(|e| e.to_string())?;

        // Get bonus points
        let bonus: i32 = tx
            .query_row(
                "SELECT bonus_points FROM daily_puzzles WHERE date = ?1 AND puzzle_id = ?2",
                params![&today, &puzzle_id],
                |row| row.get(0),
            )
            .unwrap_or(50);

        // Update streak tracking
        update_daily_puzzle_streak(&tx, user_id, &today)?;

        // Update achievement stats
        tx.execute(
            "UPDATE user_achievement_stats
             SET daily_puzzles_completed = daily_puzzles_completed + 1,
                 daily_puzzle_last_completion_date = ?2,
                 updated_at = CURRENT_TIMESTAMP
             WHERE user_id = ?1",
            params![user_id, &today],
        )
        .map_err(|e| format!("Failed to update stats: {}", e))?;

        tx.commit().map_err(|e| e.to_string())?;

        // Trigger achievement checks (use existing achievement system)
        if let Ok(achievements) = crate::achievement_commands::update_achievement_progress(
            app.clone(),
            user_id,
            "daily_puzzles_completed".to_string(),
            1,
        ) {
            log::info!("Unlocked achievements: {:?}", achievements);
        }

        if let Ok(achievements) = crate::achievement_commands::update_achievement_progress(
            app,
            user_id,
            "daily_puzzle_streak".to_string(),
            0, // Increment of 0, just triggers check
        ) {
            log::info!("Streak achievements: {:?}", achievements);
        }

        bonus
    } else {
        0 // No bonus for additional language completions on same day
    };

    Ok(bonus_awarded)
}

/// Get user's daily puzzle streak information
#[tauri::command]
pub fn get_daily_puzzle_streak(app: AppHandle, user_id: i32) -> Result<DailyPuzzleStreak, String> {
    let conn = db::get_connection(&app)?;

    let (current_streak, longest_streak, total_completed, last_date): (i32, i32, i32, Option<String>) = conn
        .query_row(
            "SELECT daily_puzzle_streak, longest_daily_puzzle_streak,
                    daily_puzzles_completed, daily_puzzle_last_completion_date
             FROM user_achievement_stats
             WHERE user_id = ?1",
            params![user_id],
            |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?, row.get(3)?)),
        )
        .unwrap_or((0, 0, 0, None));

    Ok(DailyPuzzleStreak {
        current_streak,
        longest_streak,
        total_completed,
        last_completion_date: last_date,
    })
}
