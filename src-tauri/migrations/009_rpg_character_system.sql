-- Migration 009: RPG Character System
-- Character stats, equipment, and abilities for the dungeon crawler

-- ============================================================================
-- CHARACTER STATS
-- ============================================================================

-- Character stats (one per user)
CREATE TABLE IF NOT EXISTS character_stats (
    user_id INTEGER PRIMARY KEY,

    -- Core stats
    level INTEGER DEFAULT 1,

    -- Primary attributes (increase with level)
    strength INTEGER DEFAULT 10,
    intelligence INTEGER DEFAULT 10,
    dexterity INTEGER DEFAULT 10,

    -- Derived stats
    max_health INTEGER DEFAULT 100,
    current_health INTEGER DEFAULT 100,
    max_mana INTEGER DEFAULT 50,
    current_mana INTEGER DEFAULT 50,

    -- Combat stats
    base_damage INTEGER DEFAULT 10,
    defense INTEGER DEFAULT 5,
    critical_chance REAL DEFAULT 0.05,  -- 5%
    dodge_chance REAL DEFAULT 0.05,     -- 5%

    -- Progression
    stat_points_available INTEGER DEFAULT 0,  -- Unspent points from leveling

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ============================================================================
-- EQUIPMENT SYSTEM
-- ============================================================================

-- Equipment items catalog (weapons, armor, accessories)
CREATE TABLE IF NOT EXISTS equipment_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,

    -- Equipment type
    slot TEXT NOT NULL CHECK (slot IN ('weapon', 'shield', 'helmet', 'chest', 'boots', 'armor', 'accessory')),
    tier TEXT NOT NULL CHECK (tier IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),

    -- Requirements
    required_level INTEGER DEFAULT 1,
    required_strength INTEGER DEFAULT 0,
    required_intelligence INTEGER DEFAULT 0,
    required_dexterity INTEGER DEFAULT 0,

    -- Stat bonuses
    damage_bonus INTEGER DEFAULT 0,
    defense_bonus INTEGER DEFAULT 0,
    hp_bonus INTEGER DEFAULT 0,
    mana_bonus INTEGER DEFAULT 0,
    strength_bonus INTEGER DEFAULT 0,
    intelligence_bonus INTEGER DEFAULT 0,
    dexterity_bonus INTEGER DEFAULT 0,
    critical_chance_bonus REAL DEFAULT 0,
    dodge_chance_bonus REAL DEFAULT 0,

    -- Special effects (JSON for flexibility)
    special_effects TEXT,  -- JSON: {"type": "fire_damage", "value": 10}

    -- Metadata
    icon TEXT,
    value INTEGER DEFAULT 0,  -- Sell price

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Character equipment slots
CREATE TABLE IF NOT EXISTS character_equipment (
    user_id INTEGER PRIMARY KEY,

    -- Equipment slots (item IDs)
    weapon_id TEXT,
    armor_id TEXT,
    accessory_id TEXT,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (weapon_id) REFERENCES equipment_items(id),
    FOREIGN KEY (armor_id) REFERENCES equipment_items(id),
    FOREIGN KEY (accessory_id) REFERENCES equipment_items(id)
);

-- ============================================================================
-- ABILITIES SYSTEM
-- ============================================================================

-- Abilities/Spells unlocked by level
CREATE TABLE IF NOT EXISTS abilities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('attack', 'heal', 'buff', 'debuff', 'special')),

    -- Requirements
    required_level INTEGER NOT NULL,
    mana_cost INTEGER DEFAULT 0,
    cooldown_turns INTEGER DEFAULT 0,

    -- Effects
    base_value INTEGER,  -- Damage, healing, etc.
    scaling_stat TEXT CHECK (scaling_stat IN ('strength', 'intelligence', 'dexterity', 'none')),
    scaling_ratio REAL DEFAULT 0,  -- How much stat affects power (0.5 = 50% of stat added)

    -- Additional effects (JSON)
    additional_effects TEXT,  -- JSON: {"dot": 5, "duration": 3}

    -- Visual
    icon TEXT,
    animation_text TEXT,  -- For AI to use in narration

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User's unlocked abilities
CREATE TABLE IF NOT EXISTS user_abilities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    ability_id TEXT NOT NULL,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    times_used INTEGER DEFAULT 0,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (ability_id) REFERENCES abilities(id),
    UNIQUE(user_id, ability_id)
);

CREATE INDEX IF NOT EXISTS idx_user_abilities ON user_abilities(user_id);

-- ============================================================================
-- INITIALIZE CHARACTER STATS FOR EXISTING USERS
-- ============================================================================

-- Initialize character stats for existing users (if any)
INSERT OR IGNORE INTO character_stats (user_id, level, strength, intelligence, dexterity)
SELECT id, 1, 10, 10, 10
FROM users;

-- Initialize empty equipment slots for existing users
INSERT OR IGNORE INTO character_equipment (user_id)
SELECT id
FROM users;
