-- Migration 007: Enhanced Gamification System
-- Currency, Shop, Inventory, Quests, Level Rewards, Active Effects

-- ============================================================================
-- USERS TABLE (Required for foreign keys)
-- ============================================================================

-- Core users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default user if not exists (for single-user app)
INSERT OR IGNORE INTO users (id, username) VALUES (1, 'default_user');

-- ============================================================================
-- CURRENCY SYSTEM
-- ============================================================================

-- User currency balances
CREATE TABLE IF NOT EXISTS user_currency (
    user_id INTEGER PRIMARY KEY,
    gold INTEGER DEFAULT 0,
    gems INTEGER DEFAULT 0,
    lifetime_gold_earned INTEGER DEFAULT 0,
    lifetime_gems_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Transaction history for auditing and analytics
CREATE TABLE IF NOT EXISTS currency_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    currency_type TEXT NOT NULL CHECK (currency_type IN ('gold', 'gems')),
    amount INTEGER NOT NULL,  -- Positive = earned, negative = spent
    reason TEXT NOT NULL,     -- 'lesson_complete', 'puzzle_solve', 'shop_purchase', etc.
    reference_id TEXT,        -- Lesson ID, item ID, etc.
    balance_after INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_currency_transactions_user ON currency_transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_currency_transactions_type ON currency_transactions(currency_type, created_at DESC);

-- ============================================================================
-- SHOP SYSTEM
-- ============================================================================

-- Shop items catalog
CREATE TABLE IF NOT EXISTS shop_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('consumable', 'boost', 'cosmetic', 'utility')),
    type TEXT NOT NULL,  -- Specific type within category

    -- Pricing
    cost_gold INTEGER DEFAULT 0,
    cost_gems INTEGER DEFAULT 0,

    -- Availability
    required_level INTEGER DEFAULT 1,
    is_limited_time BOOLEAN DEFAULT FALSE,
    available_until TIMESTAMP,
    stock_limit INTEGER,  -- NULL = unlimited

    -- Effects (JSON for flexibility)
    effects TEXT NOT NULL,  -- JSON: {"type": "xp_boost", "value": 1.5, "duration": 3600}

    -- Metadata
    icon TEXT,
    rarity TEXT CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
    is_consumable BOOLEAN DEFAULT TRUE,
    max_stack INTEGER DEFAULT 99,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_shop_items_category ON shop_items(category, rarity);
CREATE INDEX IF NOT EXISTS idx_shop_items_limited ON shop_items(is_limited_time, available_until);

-- User inventory
CREATE TABLE IF NOT EXISTS user_inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    item_id TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (item_id) REFERENCES shop_items(id),
    UNIQUE(user_id, item_id)
);

CREATE INDEX IF NOT EXISTS idx_user_inventory_user ON user_inventory(user_id);

-- Purchase history
CREATE TABLE IF NOT EXISTS purchase_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    item_id TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    cost_gold INTEGER DEFAULT 0,
    cost_gems INTEGER DEFAULT 0,
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (item_id) REFERENCES shop_items(id)
);

CREATE INDEX IF NOT EXISTS idx_purchase_history_user ON purchase_history(user_id, purchased_at DESC);

-- ============================================================================
-- ACTIVE EFFECTS SYSTEM
-- ============================================================================

-- Active effects on user (XP boosts, gold multipliers, etc.)
CREATE TABLE IF NOT EXISTS user_active_effects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    effect_type TEXT NOT NULL,  -- 'xp_multiplier', 'gold_multiplier', 'streak_protection', etc.
    effect_value REAL NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    source_item_id TEXT,
    metadata TEXT,  -- JSON for additional effect data

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (source_item_id) REFERENCES shop_items(id)
);

CREATE INDEX IF NOT EXISTS idx_user_active_effects ON user_active_effects(user_id, expires_at);

-- ============================================================================
-- QUEST SYSTEM
-- ============================================================================

-- Quest definitions
CREATE TABLE IF NOT EXISTS quests (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('daily', 'weekly', 'special')),
    title TEXT NOT NULL,
    description TEXT,

    -- Requirements
    objective_type TEXT NOT NULL,  -- 'complete_lessons', 'solve_puzzles', 'earn_xp', etc.
    objective_target INTEGER NOT NULL,

    -- Rewards
    reward_xp INTEGER DEFAULT 0,
    reward_gold INTEGER DEFAULT 0,
    reward_gems INTEGER DEFAULT 0,
    reward_item_id TEXT,

    -- Availability
    start_date DATE,
    end_date DATE,
    repeatable BOOLEAN DEFAULT TRUE,
    required_level INTEGER DEFAULT 1,

    -- Metadata
    icon TEXT,
    order_index INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (reward_item_id) REFERENCES shop_items(id)
);

CREATE INDEX IF NOT EXISTS idx_quests_type ON quests(type, start_date, end_date);

-- User quest progress
CREATE TABLE IF NOT EXISTS user_quest_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    quest_id TEXT NOT NULL,
    progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    last_reset TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (quest_id) REFERENCES quests(id),
    UNIQUE(user_id, quest_id)
);

CREATE INDEX IF NOT EXISTS idx_user_quest_progress ON user_quest_progress(user_id, completed);

-- ============================================================================
-- LEVEL REWARDS & UNLOCKS
-- ============================================================================

-- Level-based rewards and feature unlocks
CREATE TABLE IF NOT EXISTS level_rewards (
    level INTEGER PRIMARY KEY,
    xp_required INTEGER NOT NULL,

    -- Rewards
    reward_gold INTEGER DEFAULT 0,
    reward_gems INTEGER DEFAULT 0,
    reward_items TEXT,  -- JSON array of item IDs

    -- Unlocks
    unlocks_feature TEXT,    -- JSON array: ["intermediate_courses", "shop_premium", etc.]
    unlocks_category TEXT,   -- Puzzle category, course category

    -- Display
    title TEXT,              -- "Apprentice Coder", "Code Warrior", etc.
    description TEXT,
    icon TEXT
);

-- ============================================================================
-- INITIALIZE DEFAULT DATA
-- ============================================================================

-- Initialize currency for existing users (if any)
INSERT OR IGNORE INTO user_currency (user_id, gold, gems, lifetime_gold_earned, lifetime_gems_earned)
SELECT id, 1000, 50, 1000, 50  -- Starting bonus
FROM users;

-- ============================================================================
-- SEED LEVEL REWARDS (Levels 1-30)
-- ============================================================================

INSERT OR IGNORE INTO level_rewards (level, xp_required, reward_gold, reward_gems, title, description, icon, unlocks_feature) VALUES
(1, 0, 500, 0, 'Novice', 'Welcome to your coding journey!', '🌱', '["basic_courses", "shop_consumables", "daily_quests"]'),
(2, 100, 500, 0, 'Beginner', 'Keep learning!', '📖', NULL),
(3, 250, 500, 5, 'Learner', 'Chat with AI tutor unlocked!', '💬', '["ai_tutor_limited"]'),
(4, 450, 500, 0, 'Student', 'You''re making progress!', '🎓', NULL),
(5, 700, 750, 25, 'Apprentice Coder', 'Medium puzzles unlocked!', '⚙️', '["medium_puzzles", "cosmetics_shop", "game_logic_category"]'),
(6, 1000, 750, 0, 'Coder', 'Building skills!', '💻', NULL),
(7, 1350, 750, 10, 'Dedicated Coder', 'Weekly quests unlocked!', '📅', '["weekly_quests"]'),
(8, 1750, 1000, 0, 'Skilled Coder', 'Leaderboards unlocked!', '🏆', '["leaderboards_view"]'),
(9, 2200, 1000, 15, 'Advanced Learner', 'Unlimited AI tutor!', '🤖', '["ai_tutor_unlimited"]'),
(10, 2700, 1500, 50, 'Code Warrior', 'Intermediate courses unlocked!', '⚔️', '["intermediate_courses", "hard_puzzles", "optimization_category", "gdscript"]'),
(11, 3250, 1500, 20, 'Battle Coder', 'Keep fighting!', '🛡️', NULL),
(12, 3850, 1500, 0, 'Challenge Creator', 'Create custom challenges!', '🎯', '["custom_challenges"]'),
(13, 4500, 2000, 25, 'Competitor', 'Compete on leaderboards!', '🏅', '["leaderboards_compete"]'),
(14, 5200, 2000, 0, 'Weekend Warrior', 'Special boosts available!', '⚡', NULL),
(15, 6000, 2500, 75, 'Code Wizard', 'Expert puzzles unlocked!', '🧙', '["expert_puzzles", "csharp", "premium_themes"]'),
(16, 6900, 2500, 30, 'Master Coder', 'Excellence achieved!', '🌟', NULL),
(17, 7900, 2500, 35, 'Code Mentor', 'Help other students!', '👨‍🏫', '["mentoring"]'),
(18, 9000, 3000, 40, 'Expert', 'Mastery in progress!', '💎', NULL),
(19, 10200, 3000, 45, 'Beta Tester', 'Early feature access!', '🔬', '["beta_access"]'),
(20, 11500, 5000, 100, 'Code Master', 'Advanced courses unlocked!', '👑', '["advanced_courses", "create_lessons", "legendary_cosmetics"]'),
(21, 13000, 3500, 50, 'Elite Coder', 'Elite status achieved!', '🎖️', NULL),
(22, 14700, 3500, 55, 'Polyglot', 'Ruby language unlocked!', '💬', '["ruby"]'),
(23, 16600, 4000, 60, 'Virtuoso', 'Coding virtuoso!', '🎼', NULL),
(24, 18800, 4000, 65, 'Champion', 'Advanced leaderboards!', '🏆', '["advanced_leaderboard"]'),
(25, 21300, 7500, 150, 'Coding Legend', 'Legend status achieved!', '⭐', '["all_languages", "contribute_puzzles", "legend_badge"]'),
(26, 24200, 5000, 75, 'Grandmaster', 'Approaching prestige!', '🔱', NULL),
(27, 27500, 6000, 85, 'Mythic Coder', 'Mythic achievements!', '🌌', NULL),
(28, 31300, 7000, 95, 'Legendary Master', 'Legendary!', '✨', NULL),
(29, 35700, 8000, 100, 'Ultimate Coder', 'Almost there!', '🌠', NULL),
(30, 40800, 10000, 250, 'Grand Master Programmer', 'Prestige available!', '👑', '["prestige", "all_features"]');
