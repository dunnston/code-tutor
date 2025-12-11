-- Migration 037: Create daily_puzzles table
-- Fixes missing table that was referenced but never created

CREATE TABLE IF NOT EXISTS daily_puzzles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    puzzle_id TEXT NOT NULL,
    date TEXT NOT NULL UNIQUE,  -- Only one daily puzzle per day
    bonus_points INTEGER DEFAULT 50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (puzzle_id) REFERENCES puzzles(id)
);

-- Index for efficient lookups by date (if not already created)
CREATE INDEX IF NOT EXISTS idx_daily_puzzles_date ON daily_puzzles(date);
CREATE INDEX IF NOT EXISTS idx_daily_puzzles_bonus ON daily_puzzles(date, puzzle_id);
