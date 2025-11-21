-- Migration 017: Add Charisma Stat and Update Stat Point System
-- Add charisma as a fourth primary stat
-- Update starting values: all abilities start at 1, players get 2 stat points to start

-- NOTE: ALTER TABLE for adding charisma column is handled in db.rs to be idempotent

-- Update existing characters to have charisma = 1 if they don't have it yet
-- (This will be done in db.rs after the column is added)

-- Update character creation defaults:
-- All new characters should start with:
-- - strength: 1
-- - intelligence: 1
-- - dexterity: 1
-- - charisma: 1 (new)
-- - stat_points_available: 2 (new players get 2 points to spend)
-- - level: 1
-- - max_health: 50
-- - current_health: 50
-- - max_mana: 30
-- - current_mana: 30

-- Note: Character creation happens in code, but we need to update existing characters
-- Set all existing characters to have charisma = 1 if not set
UPDATE character_stats SET charisma = 1 WHERE charisma IS NULL OR charisma = 0;
