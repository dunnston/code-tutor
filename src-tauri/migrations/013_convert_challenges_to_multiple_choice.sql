-- ============================================================================
-- MIGRATION 013: Convert Coding Challenges to Multiple Choice
-- ============================================================================

-- Add new columns for multiple choice format
ALTER TABLE dungeon_challenges ADD COLUMN choices TEXT;  -- JSON array: ["A) ...", "B) ...", "C) ...", "D) ..."]
ALTER TABLE dungeon_challenges ADD COLUMN correct_answer TEXT;  -- Single letter: "A", "B", "C", or "D"

-- Update existing schema to make coding fields optional (already NULL-able by default in SQLite)

-- Clear existing coding challenges (we'll add new multiple choice questions in seed data)
DELETE FROM dungeon_challenges;
