-- Migration 018: Active Abilities Slot System
-- Allows users to equip up to 3 abilities for use in combat with cooldown tracking

-- ============================================================================
-- ACTIVE ABILITIES SLOTS
-- ============================================================================

-- User's active ability slots (max 3 abilities can be equipped at once)
CREATE TABLE IF NOT EXISTS user_active_abilities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    slot_number INTEGER NOT NULL CHECK (slot_number IN (1, 2, 3)),
    ability_id TEXT NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (ability_id) REFERENCES abilities(id) ON DELETE CASCADE,
    UNIQUE(user_id, slot_number),
    UNIQUE(user_id, ability_id)  -- Can't have same ability in multiple slots
);

CREATE INDEX IF NOT EXISTS idx_user_active_abilities ON user_active_abilities(user_id);

-- ============================================================================
-- COOLDOWN TRACKING
-- ============================================================================

-- Track ability cooldowns during and between combats
CREATE TABLE IF NOT EXISTS user_ability_cooldowns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    ability_id TEXT NOT NULL,
    combat_id INTEGER,  -- NULL if not in combat, otherwise references active combat
    turns_remaining INTEGER NOT NULL DEFAULT 0,
    expires_at TIMESTAMP,  -- For future use if cooldowns persist outside combat

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (ability_id) REFERENCES abilities(id) ON DELETE CASCADE,
    UNIQUE(user_id, ability_id, combat_id)
);

CREATE INDEX IF NOT EXISTS idx_user_ability_cooldowns ON user_ability_cooldowns(user_id, combat_id);

-- ============================================================================
-- INITIALIZE ACTIVE ABILITIES FOR EXISTING USERS
-- ============================================================================

-- Set basic_attack as slot 1 for all users who have it unlocked
INSERT OR IGNORE INTO user_active_abilities (user_id, slot_number, ability_id)
SELECT user_id, 1, 'basic_attack'
FROM user_abilities
WHERE ability_id = 'basic_attack';
