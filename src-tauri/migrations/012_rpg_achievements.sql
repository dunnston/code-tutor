-- Migration 012: RPG Dungeon Achievements
-- Achievement tracking for dungeon activities

-- ============================================================================
-- DUNGEON ACHIEVEMENTS
-- ============================================================================

-- Dungeon achievements
CREATE TABLE IF NOT EXISTS dungeon_achievements (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,

    -- Requirements
    requirement_type TEXT NOT NULL,  -- 'floors_cleared', 'boss_defeated', 'enemies_killed', etc.
    requirement_value INTEGER,
    requirement_data TEXT,  -- JSON for complex requirements

    -- Rewards
    xp_reward INTEGER DEFAULT 0,
    gold_reward INTEGER DEFAULT 0,
    unlock_item TEXT,  -- Special item reward (item ID)

    -- Display
    rarity TEXT CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
    display_order INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (unlock_item) REFERENCES equipment_items(id)
);

-- User's earned achievements
CREATE TABLE IF NOT EXISTS user_dungeon_achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    achievement_id TEXT NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Progress tracking (for achievements that take multiple steps)
    progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (achievement_id) REFERENCES dungeon_achievements(id),
    UNIQUE(user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_user_dungeon_achievements ON user_dungeon_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_completed ON user_dungeon_achievements(user_id, completed);
