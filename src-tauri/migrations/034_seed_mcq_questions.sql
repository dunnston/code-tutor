-- Seed MCQ Questions from imported data
-- This migration will be run automatically on production builds

-- Note: This migration is designed to be idempotent (safe to run multiple times)
-- The questions will only be inserted if they don't already exist

-- The actual seeding happens via the Rust import function
-- This file serves as a marker that the migration was run
-- The Rust code in db.rs can check for this migration and trigger the import

-- To manually trigger import in production:
-- The app can call: import_markdown_mcq_questions()
-- on first launch if no questions exist

-- Migration marker: MCQ questions seeded v1
