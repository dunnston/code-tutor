-- Fix foreign key constraint in user_challenge_history
-- The table references dungeon_challenges, but now uses mcq_questions
-- We need to remove the FK constraint since challenges can come from multiple sources

-- SQLite doesn't support DROP CONSTRAINT, so we need to recreate the table

-- Step 1: Create new table without the foreign key to dungeon_challenges
CREATE TABLE IF NOT EXISTS user_challenge_history_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    challenge_id TEXT NOT NULL,
    success BOOLEAN NOT NULL,
    time_taken_seconds INTEGER,
    combat_log_id INTEGER,

    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (combat_log_id) REFERENCES dungeon_combat_log(id)
    -- Note: Removed FOREIGN KEY to dungeon_challenges since challenges now come from mcq_questions
);

-- Step 2: Copy data from old table
INSERT INTO user_challenge_history_new
    (id, user_id, challenge_id, success, time_taken_seconds, combat_log_id, completed_at)
SELECT id, user_id, challenge_id, success, time_taken_seconds, combat_log_id, completed_at
FROM user_challenge_history;

-- Step 3: Drop old table
DROP TABLE user_challenge_history;

-- Step 4: Rename new table
ALTER TABLE user_challenge_history_new RENAME TO user_challenge_history;

-- Step 5: Recreate index
CREATE INDEX IF NOT EXISTS idx_user_challenge_history ON user_challenge_history(user_id, challenge_id);
