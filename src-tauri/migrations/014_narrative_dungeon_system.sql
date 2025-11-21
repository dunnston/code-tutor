-- Migration 014: Narrative Choice-Based Dungeon System
-- Adds support for choice-based narrative encounters with skill checks

-- ============================================================================
-- NARRATIVE LOCATIONS
-- ============================================================================

-- Locations/scenes in the narrative dungeon
CREATE TABLE IF NOT EXISTS narrative_locations (
    id TEXT PRIMARY KEY,
    floor_number INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,

    -- Location metadata
    location_type TEXT CHECK (location_type IN ('start', 'choice_point', 'combat', 'skill_check', 'treasure', 'rest', 'boss', 'exit')),
    is_repeatable BOOLEAN DEFAULT FALSE,

    -- Visual
    icon TEXT DEFAULT '📍',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (floor_number) REFERENCES dungeon_floors(floor_number)
);

CREATE INDEX IF NOT EXISTS idx_narrative_locations ON narrative_locations(floor_number, location_type);

-- ============================================================================
-- NARRATIVE CHOICES
-- ============================================================================

-- Choices available at each location
CREATE TABLE IF NOT EXISTS narrative_choices (
    id TEXT PRIMARY KEY,
    location_id TEXT NOT NULL,
    choice_text TEXT NOT NULL,

    -- Skill check configuration
    requires_skill_check BOOLEAN DEFAULT FALSE,
    skill_type TEXT CHECK (skill_type IN ('strength', 'intelligence', 'dexterity', 'charisma', NULL)),
    skill_dc INTEGER,  -- Difficulty class (1-30, typically 5-20)

    -- Links to coding challenge for earning modifier
    challenge_action_type TEXT,  -- Maps to dungeon_challenges.action_type

    -- Display
    display_order INTEGER DEFAULT 0,
    icon TEXT,

    -- Requirements
    requires_flag TEXT,  -- JSON: {"has_key": true, "defeated_dragon": false}

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (location_id) REFERENCES narrative_locations(id)
);

CREATE INDEX IF NOT EXISTS idx_narrative_choices ON narrative_choices(location_id);

-- ============================================================================
-- NARRATIVE OUTCOMES
-- ============================================================================

-- Outcomes of choices (success/failure for skill checks, or single outcome)
CREATE TABLE IF NOT EXISTS narrative_outcomes (
    id TEXT PRIMARY KEY,
    choice_id TEXT NOT NULL,

    -- Outcome type: 'success', 'failure', 'critical_success', 'critical_failure', 'default'
    outcome_type TEXT NOT NULL CHECK (outcome_type IN ('success', 'failure', 'critical_success', 'critical_failure', 'default')),

    -- Narrative result
    description TEXT NOT NULL,
    next_location_id TEXT,  -- NULL if this ends the encounter/floor

    -- Rewards/Penalties
    rewards TEXT,  -- JSON: {"gold": 50, "xp": 100, "items": ["health_potion"]}
    penalties TEXT,  -- JSON: {"damage": 15, "gold_loss": 10}

    -- Story flags
    sets_flags TEXT,  -- JSON: {"has_brass_key": true, "opened_secret_door": true}

    -- Combat initiation
    triggers_combat BOOLEAN DEFAULT FALSE,
    enemy_id TEXT,  -- FK to enemy_types or boss_enemies
    enemy_count INTEGER DEFAULT 1,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (choice_id) REFERENCES narrative_choices(id),
    FOREIGN KEY (next_location_id) REFERENCES narrative_locations(id)
);

CREATE INDEX IF NOT EXISTS idx_narrative_outcomes ON narrative_outcomes(choice_id, outcome_type);

-- ============================================================================
-- USER NARRATIVE PROGRESS
-- ============================================================================

-- Track user's progress through narrative dungeons
CREATE TABLE IF NOT EXISTS user_narrative_progress (
    user_id INTEGER PRIMARY KEY,
    floor_number INTEGER DEFAULT 1,
    current_location_id TEXT,

    -- History
    visited_locations TEXT,  -- JSON array: ["level1_start", "level1_courtyard", ...]
    completed_choices TEXT,  -- JSON array of choice IDs

    -- Story flags (items collected, doors opened, NPCs talked to, etc.)
    story_flags TEXT,  -- JSON: {"has_brass_key": true, "defeated_dragon": false, ...}

    -- Last skill check (for UI display)
    last_roll INTEGER,
    last_skill_type TEXT,
    last_skill_dc INTEGER,
    last_modifier INTEGER,
    last_challenge_success BOOLEAN,

    -- Stats
    total_skill_checks INTEGER DEFAULT 0,
    successful_skill_checks INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (current_location_id) REFERENCES narrative_locations(id)
);

-- ============================================================================
-- SKILL CHECK HISTORY
-- ============================================================================

-- Log of all skill checks for analytics
CREATE TABLE IF NOT EXISTS skill_check_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    choice_id TEXT NOT NULL,

    -- Skill check details
    skill_type TEXT NOT NULL,
    skill_dc INTEGER NOT NULL,
    dice_roll INTEGER NOT NULL,
    stat_modifier INTEGER NOT NULL,
    challenge_success BOOLEAN NOT NULL,

    -- Result
    total_roll INTEGER NOT NULL,  -- dice_roll + (modifier if challenge_success)
    check_passed BOOLEAN NOT NULL,
    outcome_type TEXT NOT NULL,

    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (choice_id) REFERENCES narrative_choices(id)
);

CREATE INDEX IF NOT EXISTS idx_skill_check_history ON skill_check_history(user_id, timestamp DESC);

-- ============================================================================
-- INITIALIZE NARRATIVE PROGRESS FOR EXISTING USERS
-- ============================================================================

-- Initialize narrative progress for existing users (start at entrance)
INSERT OR IGNORE INTO user_narrative_progress (user_id, floor_number)
SELECT id, 1
FROM users;
