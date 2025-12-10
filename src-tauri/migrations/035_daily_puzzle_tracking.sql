-- Daily Puzzle Tracking
-- Add columns to user_achievement_stats for tracking daily puzzle progress

ALTER TABLE user_achievement_stats ADD COLUMN daily_puzzles_completed INTEGER DEFAULT 0;
ALTER TABLE user_achievement_stats ADD COLUMN daily_puzzle_streak INTEGER DEFAULT 0;
ALTER TABLE user_achievement_stats ADD COLUMN daily_puzzle_last_completion_date DATE;
ALTER TABLE user_achievement_stats ADD COLUMN longest_daily_puzzle_streak INTEGER DEFAULT 0;

-- Add index for efficient daily puzzle lookups
CREATE INDEX IF NOT EXISTS idx_daily_puzzles_date ON daily_puzzles(date);
CREATE INDEX IF NOT EXISTS idx_daily_puzzles_bonus ON daily_puzzles(date, puzzle_id);
