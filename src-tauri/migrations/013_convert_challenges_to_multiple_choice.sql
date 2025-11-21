-- ============================================================================
-- MIGRATION 013: Convert Coding Challenges to Multiple Choice
-- ============================================================================

-- Clear existing coding challenges (we'll add new multiple choice questions in seed data)
-- This migration is safe to run multiple times
DELETE FROM dungeon_challenges;

-- Note: The 'choices' and 'correct_answer' columns are added via ALTER TABLE
-- in the db.rs initialization code to handle cases where they may already exist
