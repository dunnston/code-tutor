-- Migration 011: RPG Progress and Combat Tracking
-- User dungeon progress, combat log, and session management

-- ============================================================================
-- USER DUNGEON PROGRESS
-- ============================================================================

-- User dungeon progress
CREATE TABLE IF NOT EXISTS user_dungeon_progress (
    user_id INTEGER PRIMARY KEY,

    -- Progress
    current_floor INTEGER DEFAULT 1,
    deepest_floor_reached INTEGER DEFAULT 1,

    -- Current state
    in_combat BOOLEAN DEFAULT FALSE,
    current_enemy_id TEXT,
    current_enemy_health INTEGER,
    current_room_type TEXT,

    -- Statistics
    total_enemies_defeated INTEGER DEFAULT 0,
    total_bosses_defeated INTEGER DEFAULT 0,
    total_floors_cleared INTEGER DEFAULT 0,
    total_deaths INTEGER DEFAULT 0,
    total_gold_earned INTEGER DEFAULT 0,
    total_xp_earned INTEGER DEFAULT 0,

    -- Last action
    last_room_description TEXT,
    last_action_timestamp TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ============================================================================
-- COMBAT LOG
-- ============================================================================

-- Combat log (for history/stats)
CREATE TABLE IF NOT EXISTS dungeon_combat_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    enemy_type TEXT NOT NULL,
    enemy_name TEXT NOT NULL,
    floor_number INTEGER NOT NULL,
    is_boss BOOLEAN DEFAULT FALSE,

    -- Outcome
    victory BOOLEAN NOT NULL,
    turns_taken INTEGER,
    damage_dealt INTEGER,
    damage_taken INTEGER,

    -- Rewards
    xp_gained INTEGER,
    gold_gained INTEGER,
    items_looted TEXT,  -- JSON array

    -- Coding performance
    challenges_attempted INTEGER DEFAULT 0,
    challenges_succeeded INTEGER DEFAULT 0,

    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_combat_log_user ON dungeon_combat_log(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_combat_log_floor ON dungeon_combat_log(floor_number);

-- ============================================================================
-- ACTIVE DUNGEON SESSION
-- ============================================================================

-- Active dungeon session (for AI context and temporary state)
CREATE TABLE IF NOT EXISTS dungeon_session (
    user_id INTEGER PRIMARY KEY,

    -- Session data
    session_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    current_room_type TEXT,
    conversation_context TEXT,  -- JSON of recent AI messages (last 5-10)

    -- Combat state (if in combat)
    combat_turn INTEGER DEFAULT 0,
    enemy_current_health INTEGER,
    ability_cooldowns TEXT,  -- JSON: {"fireball": 2, "heal": 0}
    last_action TEXT,
    last_result TEXT,

    -- Temporary effects
    active_buffs TEXT,  -- JSON array: [{"type": "shield", "turns_remaining": 3}]
    active_debuffs TEXT,  -- JSON array

    -- Room history (for context)
    rooms_visited_this_session INTEGER DEFAULT 0,
    enemies_defeated_this_session INTEGER DEFAULT 0,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ============================================================================
-- CODING CHALLENGES FOR COMBAT
-- ============================================================================

-- Coding challenges used in combat
CREATE TABLE IF NOT EXISTS dungeon_challenges (
    id TEXT PRIMARY KEY,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    action_type TEXT NOT NULL,  -- 'basic_attack', 'spell', 'heal', 'defend'

    -- Challenge content
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    starter_code TEXT,
    solution TEXT,
    test_cases TEXT,  -- JSON array

    -- Requirements
    required_language TEXT DEFAULT 'python',
    min_floor INTEGER DEFAULT 1,
    max_floor INTEGER,

    -- Usage tracking
    times_used INTEGER DEFAULT 0,
    success_rate REAL DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_dungeon_challenges ON dungeon_challenges(difficulty, action_type, min_floor);

-- Track which challenges users have completed
CREATE TABLE IF NOT EXISTS user_challenge_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    challenge_id TEXT NOT NULL,
    success BOOLEAN NOT NULL,
    time_taken_seconds INTEGER,
    combat_log_id INTEGER,

    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (challenge_id) REFERENCES dungeon_challenges(id),
    FOREIGN KEY (combat_log_id) REFERENCES dungeon_combat_log(id)
);

CREATE INDEX IF NOT EXISTS idx_user_challenge_history ON user_challenge_history(user_id, challenge_id);

-- ============================================================================
-- INITIALIZE DUNGEON PROGRESS FOR EXISTING USERS
-- ============================================================================

-- Initialize dungeon progress for existing users
INSERT OR IGNORE INTO user_dungeon_progress (user_id, current_floor, deepest_floor_reached)
SELECT id, 1, 1
FROM users;
