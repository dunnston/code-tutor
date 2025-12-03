-- Add viewed_at column to track when user views their completed achievements
ALTER TABLE user_achievement_progress ADD COLUMN viewed_at TEXT;

-- Index for efficient querying of unviewed achievements
CREATE INDEX IF NOT EXISTS idx_user_achievement_viewed ON user_achievement_progress(user_id, viewed_at);
