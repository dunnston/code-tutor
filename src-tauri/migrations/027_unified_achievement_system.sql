-- Migration 027: Unified Achievement System
-- Comprehensive achievement tracking across all app features

-- ============================================================================
-- ACHIEVEMENT CATEGORIES
-- ============================================================================
-- Tracks different categories of achievements for organization
CREATE TABLE IF NOT EXISTS achievement_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    display_order INTEGER DEFAULT 0
);

-- Seed achievement categories
INSERT OR IGNORE INTO achievement_categories (id, name, description, icon, display_order) VALUES
('learning', 'Learning', 'Achievements related to completing lessons and courses', '📚', 1),
('puzzles', 'Puzzles', 'Achievements for puzzle-solving mastery', '🧩', 2),
('streaks', 'Consistency', 'Achievements for maintaining daily streaks', '🔥', 3),
('progression', 'Progression', 'Level and XP milestone achievements', '⭐', 4),
('playground', 'Playground', 'Achievements for creativity and sharing', '🎨', 5),
('dungeon', 'Dungeon', 'Achievements for dungeon exploration and combat', '⚔️', 6),
('economic', 'Economic', 'Achievements related to currency and shopping', '💰', 7),
('social', 'Social', 'Community and helping achievements', '👥', 8),
('mastery', 'Mastery', 'Achievements requiring exceptional skill', '👑', 9),
('secret', 'Secret', 'Hidden achievements to discover', '❓', 10);

-- ============================================================================
-- UNIFIED ACHIEVEMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS achievements (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,

    -- Tier system (Bronze, Silver, Gold, Platinum)
    tier TEXT NOT NULL CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum', 'secret')),

    -- Requirements
    requirement_type TEXT NOT NULL,  -- 'count', 'streak', 'level', 'perfect', 'speed', 'collection', 'custom'
    requirement_value INTEGER,       -- Target value for count/streak/level requirements
    requirement_data TEXT,           -- JSON for complex requirements

    -- Rewards
    xp_reward INTEGER DEFAULT 0,
    gold_reward INTEGER DEFAULT 0,
    gem_reward INTEGER DEFAULT 0,
    unlock_item_id TEXT,             -- References equipment_items or consumable_items
    unlock_item_type TEXT,           -- 'equipment', 'consumable', 'cosmetic'

    -- Display and unlocking
    is_secret BOOLEAN DEFAULT FALSE,
    required_level INTEGER DEFAULT 1,
    required_achievement_id TEXT,    -- Some achievements require others first
    display_order INTEGER DEFAULT 0,

    -- Tracking
    is_repeatable BOOLEAN DEFAULT FALSE,
    tracking_key TEXT,               -- Key used to increment progress (e.g., 'lessons_completed')

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id) REFERENCES achievement_categories(id),
    FOREIGN KEY (required_achievement_id) REFERENCES achievements(id)
);

CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category_id, display_order);
CREATE INDEX IF NOT EXISTS idx_achievements_tier ON achievements(tier);
CREATE INDEX IF NOT EXISTS idx_achievements_secret ON achievements(is_secret);
CREATE INDEX IF NOT EXISTS idx_achievements_tracking ON achievements(tracking_key);

-- ============================================================================
-- USER ACHIEVEMENT PROGRESS
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_achievement_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    achievement_id TEXT NOT NULL,

    -- Progress tracking
    current_progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,

    -- Metadata
    times_completed INTEGER DEFAULT 0,  -- For repeatable achievements
    first_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (achievement_id) REFERENCES achievements(id),
    UNIQUE(user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_user_achievement_progress ON user_achievement_progress(user_id, completed);
CREATE INDEX IF NOT EXISTS idx_achievement_progress_achievement ON user_achievement_progress(achievement_id);
CREATE INDEX IF NOT EXISTS idx_achievement_completed ON user_achievement_progress(user_id, completed_at DESC);

-- ============================================================================
-- ACHIEVEMENT TRACKING STATS
-- ============================================================================
-- Stores aggregated stats used for achievement tracking
-- This makes it easier to check achievement progress without complex queries
CREATE TABLE IF NOT EXISTS user_achievement_stats (
    user_id INTEGER PRIMARY KEY,

    -- Learning stats
    lessons_completed INTEGER DEFAULT 0,
    lessons_perfect INTEGER DEFAULT 0,
    courses_completed INTEGER DEFAULT 0,
    hints_used INTEGER DEFAULT 0,

    -- Puzzle stats
    puzzles_solved INTEGER DEFAULT 0,
    puzzles_perfect INTEGER DEFAULT 0,
    puzzles_expert_solved INTEGER DEFAULT 0,
    optimal_solutions INTEGER DEFAULT 0,

    -- Streak stats
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,

    -- XP and Level stats
    total_xp_earned INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,

    -- Playground stats
    projects_created INTEGER DEFAULT 0,
    projects_likes_received INTEGER DEFAULT 0,
    projects_forks_received INTEGER DEFAULT 0,
    total_project_views INTEGER DEFAULT 0,

    -- Dungeon stats
    enemies_defeated INTEGER DEFAULT 0,
    bosses_defeated INTEGER DEFAULT 0,
    floors_cleared INTEGER DEFAULT 0,
    max_floor_reached INTEGER DEFAULT 0,
    perfect_combats INTEGER DEFAULT 0,

    -- Economic stats
    lifetime_gold_earned INTEGER DEFAULT 0,
    lifetime_gems_earned INTEGER DEFAULT 0,
    shop_purchases_made INTEGER DEFAULT 0,

    -- Social stats
    users_helped INTEGER DEFAULT 0,
    custom_lessons_created INTEGER DEFAULT 0,

    -- Metadata
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Initialize stats for default user
INSERT OR IGNORE INTO user_achievement_stats (user_id) VALUES (1);

-- ============================================================================
-- ACHIEVEMENT REWARDS CLAIMED
-- ============================================================================
-- Tracks when achievement rewards are claimed (separate from earning)
CREATE TABLE IF NOT EXISTS achievement_rewards_claimed (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    achievement_id TEXT NOT NULL,

    -- Rewards claimed
    xp_claimed INTEGER DEFAULT 0,
    gold_claimed INTEGER DEFAULT 0,
    gem_claimed INTEGER DEFAULT 0,
    item_claimed BOOLEAN DEFAULT FALSE,

    claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (achievement_id) REFERENCES achievements(id),
    UNIQUE(user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_achievement_rewards_user ON achievement_rewards_claimed(user_id, claimed_at DESC);

-- ============================================================================
-- ACHIEVEMENT NOTIFICATIONS
-- ============================================================================
-- Queue for achievement unlock notifications (shown to user)
CREATE TABLE IF NOT EXISTS achievement_notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    achievement_id TEXT NOT NULL,

    -- Notification state
    shown BOOLEAN DEFAULT FALSE,
    shown_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (achievement_id) REFERENCES achievements(id)
);

CREATE INDEX IF NOT EXISTS idx_achievement_notifications_pending ON achievement_notifications(user_id, shown);
CREATE INDEX IF NOT EXISTS idx_achievement_notifications_created ON achievement_notifications(created_at DESC);
