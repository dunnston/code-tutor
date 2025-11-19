-- Puzzle System Database Schema
-- Phase 1: Core Infrastructure
-- IMPORTANT: Uses IF NOT EXISTS to allow safe re-runs

-- ============================================================================
-- PUZZLE CATEGORIES
-- ============================================================================
CREATE TABLE IF NOT EXISTS puzzle_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- PUZZLES
-- ============================================================================
CREATE TABLE IF NOT EXISTS puzzles (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,  -- Markdown format
    difficulty TEXT NOT NULL CHECK(difficulty IN ('easy', 'medium', 'hard', 'expert')),
    points INTEGER DEFAULT 100,

    -- Metadata
    concepts TEXT,              -- JSON array of concept IDs (e.g., ["lists-arrays", "for-loops"])
    estimated_minutes INTEGER,
    solve_count INTEGER DEFAULT 0,  -- How many users solved it
    average_time INTEGER,       -- Average solve time in seconds
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Optimization challenges (optional)
    has_optimization BOOLEAN DEFAULT FALSE,
    optimal_time_complexity TEXT,      -- e.g., "O(n)"
    optimal_space_complexity TEXT,     -- e.g., "O(1)"
    optimal_lines_of_code INTEGER,     -- For code golf

    FOREIGN KEY (category_id) REFERENCES puzzle_categories(id) ON DELETE CASCADE
);

-- ============================================================================
-- PUZZLE IMPLEMENTATIONS (Language-specific)
-- ============================================================================
CREATE TABLE IF NOT EXISTS puzzle_implementations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    puzzle_id TEXT NOT NULL,
    language_id TEXT NOT NULL,  -- 'python', 'javascript', 'csharp', 'gdscript', 'ruby'

    -- Code templates
    starter_code TEXT NOT NULL,
    solution_code TEXT NOT NULL,

    -- Testing
    test_cases TEXT NOT NULL,  -- JSON array of test cases
    hidden_tests TEXT,         -- JSON array of tests not shown to user

    -- Hints
    hints TEXT,                -- JSON array of hints

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (puzzle_id) REFERENCES puzzles(id) ON DELETE CASCADE,
    UNIQUE(puzzle_id, language_id)
);

-- ============================================================================
-- USER PUZZLE PROGRESS
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_puzzle_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL DEFAULT 1,  -- Future multi-user support
    puzzle_id TEXT NOT NULL,
    language_id TEXT NOT NULL,

    -- Progress
    status TEXT DEFAULT 'not_started' CHECK(status IN ('not_started', 'attempted', 'solved', 'optimized')),
    attempts INTEGER DEFAULT 0,
    hints_used INTEGER DEFAULT 0,

    -- Solution data
    user_solution TEXT,
    solve_time INTEGER,         -- Seconds taken to solve
    solution_lines INTEGER,     -- Lines of code in solution

    -- Timestamps
    first_attempt_at TIMESTAMP,
    solved_at TIMESTAMP,
    last_attempt_at TIMESTAMP,

    -- Optimization
    is_optimal BOOLEAN DEFAULT FALSE,

    UNIQUE(user_id, puzzle_id, language_id)
);

-- ============================================================================
-- PUZZLE LEADERBOARDS (fastest/shortest solutions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS puzzle_leaderboard (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    puzzle_id TEXT NOT NULL,
    language_id TEXT NOT NULL,
    user_id INTEGER NOT NULL DEFAULT 1,

    metric TEXT NOT NULL CHECK(metric IN ('time', 'lines')),
    value INTEGER NOT NULL,
    solution_code TEXT,
    achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (puzzle_id) REFERENCES puzzles(id) ON DELETE CASCADE
);

-- ============================================================================
-- DAILY PUZZLE CHALLENGE
-- ============================================================================
CREATE TABLE IF NOT EXISTS daily_puzzles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    puzzle_id TEXT NOT NULL,
    date DATE NOT NULL UNIQUE,
    bonus_points INTEGER DEFAULT 50,  -- Extra points for daily completion

    FOREIGN KEY (puzzle_id) REFERENCES puzzles(id) ON DELETE CASCADE
);

-- ============================================================================
-- PUZZLE ACHIEVEMENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS puzzle_achievements (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    requirement_type TEXT CHECK(requirement_type IN ('count', 'streak', 'difficulty', 'language', 'optimization')),
    requirement_value INTEGER,
    xp_reward INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_puzzle_achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL DEFAULT 1,
    achievement_id TEXT NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (achievement_id) REFERENCES puzzle_achievements(id) ON DELETE CASCADE,
    UNIQUE(user_id, achievement_id)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_puzzles_category ON puzzles(category_id);
CREATE INDEX IF NOT EXISTS idx_puzzles_difficulty ON puzzles(difficulty);
CREATE INDEX IF NOT EXISTS idx_puzzle_implementations_puzzle ON puzzle_implementations(puzzle_id);
CREATE INDEX IF NOT EXISTS idx_puzzle_implementations_language ON puzzle_implementations(language_id);
CREATE INDEX IF NOT EXISTS idx_user_puzzle_progress_user ON user_puzzle_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_puzzle_progress_puzzle ON user_puzzle_progress(puzzle_id);
CREATE INDEX IF NOT EXISTS idx_user_puzzle_progress_status ON user_puzzle_progress(status);
CREATE INDEX IF NOT EXISTS idx_puzzle_leaderboard_puzzle ON puzzle_leaderboard(puzzle_id, language_id, metric);
CREATE INDEX IF NOT EXISTS idx_daily_puzzles_date ON daily_puzzles(date);
CREATE INDEX IF NOT EXISTS idx_user_puzzle_achievements_user ON user_puzzle_achievements(user_id);
