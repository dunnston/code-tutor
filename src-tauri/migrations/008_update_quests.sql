-- Migration 008: Update Quest Targets
-- Removes Learning Spree daily quest and adjusts quest targets

-- Delete user progress for the removed quest FIRST (before deleting quest due to foreign key)
DELETE FROM user_quest_progress WHERE quest_id = 'daily-three-lessons';

-- Delete the Learning Spree quest
DELETE FROM quests WHERE id = 'daily-three-lessons';

-- Update daily Puzzle Master: reduce from 2 to 1
UPDATE quests
SET objective_target = 1,
    description = 'Solve 1 puzzle'
WHERE id = 'daily-puzzle';

-- Update daily quest order indices after removing Learning Spree
UPDATE quests SET order_index = 2 WHERE id = 'daily-puzzle';
UPDATE quests SET order_index = 3 WHERE id = 'daily-xp';
UPDATE quests SET order_index = 4 WHERE id = 'daily-no-hints';
UPDATE quests SET order_index = 5 WHERE id = 'daily-playground';

-- Update weekly Puzzle Enthusiast: reduce from 10 to 5
UPDATE quests
SET objective_target = 5,
    description = 'Solve 5 puzzles this week'
WHERE id = 'weekly-puzzles';

-- Update weekly lessons: reduce from 15 to 8
UPDATE quests
SET objective_target = 8,
    description = 'Complete 8 lessons this week'
WHERE id = 'weekly-grind';
