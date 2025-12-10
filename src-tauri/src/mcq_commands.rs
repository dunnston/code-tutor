use rusqlite::{params, Connection, Result as SqlResult};
use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use crate::db;

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct McqQuestion {
    pub id: String,
    pub question_text: String,
    pub explanation: Option<String>,
    pub options: String, // JSON array of strings
    pub correct_answer_index: i32,
    pub difficulty: String,
    pub topic: Option<String>,
    pub language: String,
    pub tags: Option<String>, // JSON array
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct QuestionListItem {
    pub id: String,
    pub question_text: String,
    pub difficulty: String,
    pub topic: Option<String>,
    pub language: String,
}

// Save or update a question
#[tauri::command]
pub fn save_mcq_question(app: AppHandle, question: McqQuestion) -> Result<(), String> {
    let conn = db::get_connection(&app)?;

    // Check if question exists
    let exists: bool = conn
        .query_row(
            "SELECT COUNT(*) FROM mcq_questions WHERE id = ?1",
            params![question.id],
            |row| row.get::<_, i32>(0),
        )
        .map(|count| count > 0)
        .unwrap_or(false);

    if exists {
        // Update existing question
        conn.execute(
            "UPDATE mcq_questions
             SET question_text = ?2, explanation = ?3, options = ?4, correct_answer_index = ?5,
                 difficulty = ?6, topic = ?7, language = ?8, tags = ?9, updated_at = datetime('now')
             WHERE id = ?1",
            params![
                question.id,
                question.question_text,
                question.explanation,
                question.options,
                question.correct_answer_index,
                question.difficulty,
                question.topic,
                question.language,
                question.tags,
            ],
        )
        .map_err(|e| e.to_string())?;
    } else {
        // Insert new question
        conn.execute(
            "INSERT INTO mcq_questions
             (id, question_text, explanation, options, correct_answer_index, difficulty,
              topic, language, tags, created_at, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, datetime('now'), datetime('now'))",
            params![
                question.id,
                question.question_text,
                question.explanation,
                question.options,
                question.correct_answer_index,
                question.difficulty,
                question.topic,
                question.language,
                question.tags,
            ],
        )
        .map_err(|e| e.to_string())?;
    }

    Ok(())
}

// Load a single question
#[tauri::command]
pub fn load_mcq_question(app: AppHandle, question_id: String) -> Result<McqQuestion, String> {
    let conn = db::get_connection(&app)?;

    let question = conn
        .query_row(
            "SELECT id, question_text, explanation, options, correct_answer_index,
                    difficulty, topic, language, tags, created_at, updated_at
             FROM mcq_questions WHERE id = ?1",
            params![question_id],
            |row| {
                Ok(McqQuestion {
                    id: row.get(0)?,
                    question_text: row.get(1)?,
                    explanation: row.get(2)?,
                    options: row.get(3)?,
                    correct_answer_index: row.get(4)?,
                    difficulty: row.get(5)?,
                    topic: row.get(6)?,
                    language: row.get(7)?,
                    tags: row.get(8)?,
                    created_at: row.get(9)?,
                    updated_at: row.get(10)?,
                })
            },
        )
        .map_err(|e| e.to_string())?;

    Ok(question)
}

// List questions with optional filters
#[tauri::command]
pub fn list_mcq_questions(
    app: AppHandle,
    difficulty_filter: Option<String>,
    language_filter: Option<String>,
    topic_filter: Option<String>,
) -> Result<Vec<QuestionListItem>, String> {
    let conn = db::get_connection(&app)?;

    let mut query = "SELECT id, question_text, difficulty, topic, language FROM mcq_questions WHERE question_text IS NOT NULL AND question_text != ''".to_string();
    let mut params_vec: Vec<String> = Vec::new();

    if let Some(diff) = difficulty_filter {
        query.push_str(" AND difficulty = ?");
        params_vec.push(diff);
    }

    if let Some(lang) = language_filter {
        query.push_str(" AND language = ?");
        params_vec.push(lang);
    }

    if let Some(top) = topic_filter {
        query.push_str(" AND topic = ?");
        params_vec.push(top);
    }

    query.push_str(" ORDER BY difficulty, language, topic");

    let mut stmt = conn.prepare(&query).map_err(|e| e.to_string())?;

    let params_refs: Vec<&dyn rusqlite::ToSql> = params_vec
        .iter()
        .map(|s| s as &dyn rusqlite::ToSql)
        .collect();

    let questions = stmt
        .query_map(&params_refs[..], |row| {
            Ok(QuestionListItem {
                id: row.get(0)?,
                question_text: row.get(1)?,
                difficulty: row.get(2)?,
                topic: row.get(3)?,
                language: row.get(4)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<SqlResult<Vec<_>>>()
        .map_err(|e| e.to_string())?;

    Ok(questions)
}

// Delete a question
#[tauri::command]
pub fn delete_mcq_question(app: AppHandle, question_id: String) -> Result<(), String> {
    let conn = db::get_connection(&app)?;

    conn.execute(
        "DELETE FROM mcq_questions WHERE id = ?1",
        params![question_id],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

// Duplicate a question
#[tauri::command]
pub fn duplicate_mcq_question(
    app: AppHandle,
    question_id: String,
) -> Result<String, String> {
    let existing_question = load_mcq_question(app.clone(), question_id)?;

    let new_id = uuid::Uuid::new_v4().to_string();
    let now = chrono::Utc::now().to_rfc3339();

    let new_question = McqQuestion {
        id: new_id.clone(),
        question_text: format!("{} (Copy)", existing_question.question_text),
        explanation: existing_question.explanation,
        options: existing_question.options,
        correct_answer_index: existing_question.correct_answer_index,
        difficulty: existing_question.difficulty,
        topic: existing_question.topic,
        language: existing_question.language,
        tags: existing_question.tags,
        created_at: now.clone(),
        updated_at: now,
    };

    save_mcq_question(app, new_question)?;

    Ok(new_id)
}

// Get random question by filters (useful for dynamic question selection)
#[tauri::command]
pub fn get_random_mcq_question(
    app: AppHandle,
    difficulty: Option<String>,
    language: Option<String>,
    topic: Option<String>,
) -> Result<McqQuestion, String> {
    let questions = list_mcq_questions(app.clone(), difficulty, language, topic)?;

    if questions.is_empty() {
        return Err("No questions match the criteria".to_string());
    }

    // Get random index
    use rand::Rng;
    let mut rng = rand::thread_rng();
    let random_index = rng.gen_range(0..questions.len());
    let selected = &questions[random_index];

    load_mcq_question(app, selected.id.clone())
}

// Get smart question selection based on user history
// Prioritizes: 1) Never seen before, 2) Failed recently, 3) Not seen recently
#[tauri::command]
pub fn get_smart_mcq_question(
    app: AppHandle,
    user_id: i64,
    difficulty: Option<String>,
    language: Option<String>,
    topic: Option<String>,
) -> Result<McqQuestion, String> {
    let conn = db::get_connection(&app)?;

    // First try with the specified difficulty
    let mut questions = list_mcq_questions(app.clone(), difficulty.clone(), language.clone(), topic.clone())?;

    // If no questions found with specific difficulty, try without difficulty filter
    if questions.is_empty() && difficulty.is_some() {
        eprintln!("No questions found for difficulty {:?}, trying without difficulty filter", difficulty);
        questions = list_mcq_questions(app.clone(), None, language.clone(), topic.clone())?;
    }

    if questions.is_empty() {
        return Err(format!("No questions available in mcq_questions table (difficulty: {:?}, language: {:?}, topic: {:?}). Please add questions using the Question Manager.",
            difficulty, language, topic));
    }

    // Get user's question history (questions they've seen and when)
    let mut seen_questions = std::collections::HashMap::new();
    let mut stmt = conn
        .prepare(
            "SELECT challenge_id, success, MAX(completed_at) as last_seen
             FROM user_challenge_history
             WHERE user_id = ? AND challenge_id IN (SELECT id FROM mcq_questions)
             GROUP BY challenge_id"
        )
        .map_err(|e| format!("Failed to query history: {}", e))?;

    let history = stmt
        .query_map([user_id], |row| {
            Ok((
                row.get::<_, String>(0)?,  // challenge_id
                row.get::<_, bool>(1)?,     // success (last attempt)
                row.get::<_, String>(2)?,   // last_seen timestamp
            ))
        })
        .map_err(|e| format!("Failed to map history: {}", e))?;

    for result in history {
        if let Ok((id, success, last_seen)) = result {
            seen_questions.insert(id, (success, last_seen));
        }
    }

    // Categorize questions by priority
    let mut never_seen = Vec::new();
    let mut failed_before = Vec::new();
    let mut seen_long_ago = Vec::new();
    let mut recently_seen = Vec::new();

    let now = chrono::Utc::now();

    for q in &questions {
        if let Some((last_success, last_seen_str)) = seen_questions.get(&q.id) {
            // Parse the timestamp
            if let Ok(last_seen_time) = chrono::DateTime::parse_from_rfc3339(&last_seen_str) {
                let hours_ago = now.signed_duration_since(last_seen_time).num_hours();

                if !last_success {
                    // Failed before - high priority
                    failed_before.push(q.clone());
                } else if hours_ago > 24 {
                    // Seen more than 24 hours ago
                    seen_long_ago.push(q.clone());
                } else {
                    // Seen recently
                    recently_seen.push(q.clone());
                }
            }
        } else {
            // Never seen before - highest priority
            never_seen.push(q.clone());
        }
    }

    // Select from highest priority pool available
    use rand::Rng;
    let mut rng = rand::thread_rng();

    let selected = if !never_seen.is_empty() {
        &never_seen[rng.gen_range(0..never_seen.len())]
    } else if !failed_before.is_empty() {
        &failed_before[rng.gen_range(0..failed_before.len())]
    } else if !seen_long_ago.is_empty() {
        &seen_long_ago[rng.gen_range(0..seen_long_ago.len())]
    } else if !recently_seen.is_empty() {
        &recently_seen[rng.gen_range(0..recently_seen.len())]
    } else {
        return Err("No suitable questions found".to_string());
    };

    load_mcq_question(app, selected.id.clone())
}

// Import questions from legacy dungeon_challenges table
#[tauri::command]
pub fn import_dungeon_challenges_to_mcq(app: AppHandle) -> Result<usize, String> {
    let conn = db::get_connection(&app)?;

    // Get all challenges with MCQ format (have choices and correct_answer)
    let mut stmt = conn
        .prepare(
            "SELECT id, title, description, choices, correct_answer, difficulty
             FROM dungeon_challenges
             WHERE choices IS NOT NULL AND correct_answer IS NOT NULL"
        )
        .map_err(|e| e.to_string())?;

    let challenges = stmt
        .query_map([], |row| {
            Ok((
                row.get::<_, String>(0)?, // id
                row.get::<_, String>(1)?, // title
                row.get::<_, String>(2)?, // description
                row.get::<_, String>(3)?, // choices (JSON string)
                row.get::<_, String>(4)?, // correct_answer (letter)
                row.get::<_, String>(5)?, // difficulty
            ))
        })
        .map_err(|e| e.to_string())?
        .collect::<SqlResult<Vec<_>>>()
        .map_err(|e| e.to_string())?;

    let mut imported_count = 0;

    for (old_id, title, description, choices_json, correct_letter, difficulty) in challenges {
        // Parse the choices JSON array
        let choices: Vec<String> = serde_json::from_str(&choices_json)
            .map_err(|e| format!("Failed to parse choices for {}: {}", old_id, e))?;

        // Strip the letter prefixes (e.g., "A) text" -> "text")
        let options: Vec<String> = choices
            .iter()
            .map(|choice| {
                // Remove patterns like "A) ", "B) ", etc.
                if choice.len() > 3 && choice.chars().nth(1) == Some(')') {
                    choice[3..].to_string()
                } else {
                    choice.clone()
                }
            })
            .collect();

        // Convert letter to index (A=0, B=1, C=2, D=3)
        let correct_answer_index = match correct_letter.as_str() {
            "A" => 0,
            "B" => 1,
            "C" => 2,
            "D" => 3,
            _ => return Err(format!("Invalid correct_answer letter: {}", correct_letter)),
        };

        // Create new MCQ question
        let new_id = format!("imported-{}", old_id);
        let options_json = serde_json::to_string(&options).map_err(|e| e.to_string())?;

        // Determine topic from the old_id prefix (e.g., "str_basic_1" -> "algorithms")
        let topic = if old_id.starts_with("str_") {
            "algorithms"
        } else if old_id.starts_with("dex_") {
            "syntax"
        } else if old_id.starts_with("int_") {
            "logic"
        } else if old_id.starts_with("cha_") {
            "best-practices"
        } else {
            "general"
        };

        // Create tags array
        let tags = vec![topic.to_string(), "dungeon".to_string()];
        let tags_json = serde_json::to_string(&tags).map_err(|e| e.to_string())?;

        // Check if already imported
        let exists: bool = conn
            .query_row(
                "SELECT COUNT(*) FROM mcq_questions WHERE id = ?1",
                params![new_id],
                |row| row.get::<_, i32>(0),
            )
            .map(|count| count > 0)
            .unwrap_or(false);

        if !exists {
            // Insert into mcq_questions
            conn.execute(
                "INSERT INTO mcq_questions
                 (id, question_text, explanation, options, correct_answer_index, difficulty,
                  topic, language, tags, created_at, updated_at)
                 VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, datetime('now'), datetime('now'))",
                params![
                    new_id,
                    format!("{}\n\n{}", title, description), // Combine title and description
                    Option::<String>::None, // No explanation in old format
                    options_json,
                    correct_answer_index,
                    difficulty,
                    topic,
                    "python",
                    tags_json,
                ],
            )
            .map_err(|e| e.to_string())?;

            imported_count += 1;
        }
    }

    Ok(imported_count)
}
