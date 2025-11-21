-- Migration 015: Expand Equipment System
-- Add 5 equipment slots and ability leveling

-- NOTE: ALTER TABLE for adding columns is handled in db.rs to be idempotent

-- ============================================================================
-- EQUIPMENT INVENTORY
-- ============================================================================

-- Separate table for equipment items in player's inventory (not equipped)
CREATE TABLE IF NOT EXISTS user_equipment_inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    equipment_id TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (equipment_id) REFERENCES equipment_items(id),
    UNIQUE(user_id, equipment_id)
);

CREATE INDEX IF NOT EXISTS idx_user_equipment_inventory ON user_equipment_inventory(user_id);

-- ============================================================================
-- ABILITY LEVELING
-- ============================================================================

-- NOTE: ALTER TABLE for ability_level is handled in db.rs to be idempotent

-- ============================================================================
-- STAT POINTS TRACKING
-- ============================================================================

-- Add tracking for how points have been spent (for display purposes)
CREATE TABLE IF NOT EXISTS stat_point_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    stat_type TEXT NOT NULL CHECK (stat_type IN ('health', 'strength', 'intelligence', 'dexterity')),
    points_spent INTEGER NOT NULL,
    previous_value INTEGER NOT NULL,
    new_value INTEGER NOT NULL,
    spent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_stat_history ON stat_point_history(user_id, spent_at DESC);

-- ============================================================================
-- SEED SOME BASIC EQUIPMENT
-- ============================================================================

-- Add basic equipment for each slot type
INSERT OR IGNORE INTO equipment_items (id, name, description, slot, tier, required_level, damage_bonus, defense_bonus, hp_bonus, icon, value) VALUES
-- Weapons
('starter_sword', 'Rusty Sword', 'A worn but serviceable blade.', 'weapon', 'common', 1, 5, 0, 0, '🗡️', 10),
('iron_sword', 'Iron Sword', 'A sturdy iron blade.', 'weapon', 'common', 3, 10, 0, 0, '⚔️', 50),

-- Shields
('wooden_shield', 'Wooden Shield', 'A basic wooden shield.', 'shield', 'common', 1, 0, 5, 10, '🛡️', 10),
('iron_shield', 'Iron Shield', 'A reinforced iron shield.', 'shield', 'common', 3, 0, 10, 20, '🛡️', 50),

-- Helmets
('leather_cap', 'Leather Cap', 'Simple leather headwear.', 'helmet', 'common', 1, 0, 2, 5, '🎩', 10),
('iron_helmet', 'Iron Helmet', 'A sturdy iron helmet.', 'helmet', 'common', 3, 0, 8, 15, '⛑️', 50),

-- Chest armor
('leather_tunic', 'Leather Tunic', 'Light leather armor.', 'chest', 'common', 1, 0, 5, 10, '👕', 10),
('chainmail', 'Chainmail', 'Interlocking metal rings provide protection.', 'chest', 'common', 3, 0, 15, 25, '🦺', 50),

-- Boots
('leather_boots', 'Leather Boots', 'Comfortable leather boots.', 'boots', 'common', 1, 0, 2, 5, '👢', 10),
('iron_boots', 'Iron Boots', 'Heavy iron boots.', 'boots', 'common', 3, 0, 8, 15, '🥾', 50);

-- Give each existing user a basic starter set in their inventory
INSERT OR IGNORE INTO user_equipment_inventory (user_id, equipment_id, quantity)
SELECT id, 'starter_sword', 1 FROM users;

INSERT OR IGNORE INTO user_equipment_inventory (user_id, equipment_id, quantity)
SELECT id, 'wooden_shield', 1 FROM users;

INSERT OR IGNORE INTO user_equipment_inventory (user_id, equipment_id, quantity)
SELECT id, 'leather_cap', 1 FROM users;

INSERT OR IGNORE INTO user_equipment_inventory (user_id, equipment_id, quantity)
SELECT id, 'leather_tunic', 1 FROM users;

INSERT OR IGNORE INTO user_equipment_inventory (user_id, equipment_id, quantity)
SELECT id, 'leather_boots', 1 FROM users;
