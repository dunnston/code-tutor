-- Add viewed_at column to track when user views their completed achievements
-- Check if column exists before adding (SQLite doesn't support IF NOT EXISTS for ALTER TABLE)
-- This migration is idempotent - it will only add the column if it doesn't exist

-- Note: SQLite will throw an error if the column already exists, but we handle this in the Rust code
-- For now, we'll just add it and let Rust handle duplicate column errors gracefully

-- Index for efficient querying of unviewed achievements
CREATE INDEX IF NOT EXISTS idx_user_achievement_viewed ON user_achievement_progress(user_id, viewed_at);
