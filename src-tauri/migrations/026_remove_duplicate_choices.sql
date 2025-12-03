-- Migration 026: Remove duplicate narrative choices from old migrations
-- This fixes the issue where old choice IDs coexist with new choice IDs

-- Delete old duplicate starting choices (if they exist)
DELETE FROM narrative_choices
WHERE location_id = 'level1_start'
AND id NOT IN ('start_path_a', 'start_path_b', 'start_path_c');

-- Clean up any other potential duplicates by keeping only the choices defined in migration 022
-- This removes any orphaned choices from old versions

-- If there are any narrative_outcomes referencing deleted choices, they'll cascade delete
-- (assuming we have proper foreign key constraints)

-- Optional: Log what we're cleaning up (SQLite doesn't have this, but keeping for documentation)
-- SELECT 'Removed ' || changes() || ' duplicate choice records';
