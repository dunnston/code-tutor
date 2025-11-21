-- Migration 010: RPG Dungeon World
-- Dungeon floors, enemies, bosses, and encounters

-- ============================================================================
-- DUNGEON FLOORS
-- ============================================================================

-- Dungeon floors/levels
CREATE TABLE IF NOT EXISTS dungeon_floors (
    floor_number INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,

    -- Requirements
    recommended_level INTEGER,
    required_level INTEGER,  -- Minimum level to enter

    -- Difficulty
    enemy_level_range TEXT,  -- JSON: {"min": 5, "max": 8}
    boss_level INTEGER,

    -- Rewards
    gold_multiplier REAL DEFAULT 1.0,
    xp_multiplier REAL DEFAULT 1.0,
    loot_tier INTEGER DEFAULT 1,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- ENEMY TYPES
-- ============================================================================

-- Enemy types (regular enemies)
CREATE TABLE IF NOT EXISTS enemy_types (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,

    -- Base stats (scaled by floor)
    base_health INTEGER NOT NULL,
    base_damage INTEGER NOT NULL,
    base_defense INTEGER DEFAULT 0,

    -- AI behavior
    behavior_type TEXT CHECK (behavior_type IN ('aggressive', 'defensive', 'balanced', 'caster')),

    -- Loot
    gold_drop_min INTEGER,
    gold_drop_max INTEGER,
    xp_reward INTEGER,
    loot_table TEXT,  -- JSON array of possible item drops with probabilities

    -- Visual
    icon TEXT,
    ascii_art TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- BOSS ENEMIES
-- ============================================================================

-- Boss enemies (special enemies with fixed stats)
CREATE TABLE IF NOT EXISTS boss_enemies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    floor_number INTEGER NOT NULL,

    -- Stats (fixed, not scaled)
    health INTEGER NOT NULL,
    damage INTEGER NOT NULL,
    defense INTEGER NOT NULL,

    -- Special abilities
    abilities TEXT,  -- JSON array of ability IDs

    -- Phases (for multi-phase bosses)
    phases TEXT,  -- JSON: [{"hp_threshold": 50, "effect": "summon_adds"}]

    -- Rewards
    gold_reward INTEGER,
    xp_reward INTEGER,
    guaranteed_loot TEXT,  -- JSON array of item IDs

    -- Visual
    icon TEXT,
    ascii_art TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (floor_number) REFERENCES dungeon_floors(floor_number)
);

-- Track which bosses have been defeated by each user
CREATE TABLE IF NOT EXISTS user_boss_defeats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    boss_id TEXT NOT NULL,
    defeated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    turns_taken INTEGER,
    damage_dealt INTEGER,
    damage_taken INTEGER,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (boss_id) REFERENCES boss_enemies(id)
);

CREATE INDEX IF NOT EXISTS idx_user_boss_defeats ON user_boss_defeats(user_id, boss_id);

-- ============================================================================
-- DUNGEON ENCOUNTERS
-- ============================================================================

-- Dungeon encounters (room events)
CREATE TABLE IF NOT EXISTS dungeon_encounters (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('combat', 'treasure', 'trap', 'merchant', 'puzzle', 'rest')),
    floor_number INTEGER NOT NULL,

    -- Description for AI
    description_prompt TEXT,

    -- Requirements/Conditions
    required_stat TEXT CHECK (required_stat IN ('strength', 'intelligence', 'dexterity', 'none')),
    difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 10),

    -- Rewards/Consequences (JSON)
    rewards TEXT,  -- {"gold": 50, "xp": 100, "items": ["health_potion"]}
    penalties TEXT,  -- {"damage": 20, "gold_loss": 10}

    -- Frequency
    rarity TEXT CHECK (rarity IN ('common', 'uncommon', 'rare')),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (floor_number) REFERENCES dungeon_floors(floor_number)
);

CREATE INDEX IF NOT EXISTS idx_dungeon_encounters ON dungeon_encounters(floor_number, type);

-- ============================================================================
-- ENEMY-FLOOR ASSOCIATION
-- ============================================================================

-- Which enemies appear on which floors
CREATE TABLE IF NOT EXISTS floor_enemies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    floor_number INTEGER NOT NULL,
    enemy_id TEXT NOT NULL,
    spawn_weight INTEGER DEFAULT 1,  -- Higher = more common

    FOREIGN KEY (floor_number) REFERENCES dungeon_floors(floor_number),
    FOREIGN KEY (enemy_id) REFERENCES enemy_types(id),
    UNIQUE(floor_number, enemy_id)
);

CREATE INDEX IF NOT EXISTS idx_floor_enemies ON floor_enemies(floor_number);
