-- Migration 019: Shop System
-- Shop items, consumables, purchase tracking, and town state

-- ============================================================================
-- GOLD CURRENCY
-- ============================================================================

-- Add current gold to character_stats
ALTER TABLE character_stats ADD COLUMN current_gold INTEGER DEFAULT 100;

-- Add town/adventure state to dungeon progress
ALTER TABLE user_dungeon_progress ADD COLUMN in_town BOOLEAN DEFAULT TRUE;

-- ============================================================================
-- CONSUMABLE ITEMS (Potions)
-- ============================================================================

-- Consumable items (potions, scrolls, etc.)
CREATE TABLE IF NOT EXISTS consumable_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('health_potion', 'mana_potion', 'buff_potion', 'scroll')),

    -- Effects
    health_restore INTEGER DEFAULT 0,
    mana_restore INTEGER DEFAULT 0,
    buff_type TEXT,  -- 'strength', 'defense', 'critical', etc.
    buff_value INTEGER DEFAULT 0,
    buff_duration_turns INTEGER DEFAULT 0,

    -- Pricing
    buy_price INTEGER NOT NULL,
    sell_price INTEGER NOT NULL,

    -- Metadata
    icon TEXT,
    tier TEXT CHECK (tier IN ('common', 'uncommon', 'rare', 'epic', 'legendary')) DEFAULT 'common',
    stack_size INTEGER DEFAULT 99,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User's consumable inventory
CREATE TABLE IF NOT EXISTS user_consumable_inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    consumable_id TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (consumable_id) REFERENCES consumable_items(id),
    UNIQUE(user_id, consumable_id)
);

CREATE INDEX IF NOT EXISTS idx_user_consumables ON user_consumable_inventory(user_id);

-- ============================================================================
-- SHOP INVENTORY
-- ============================================================================

-- Shop inventory (what's available for purchase)
-- Combines equipment items and consumables
CREATE TABLE IF NOT EXISTS shop_inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_type TEXT NOT NULL CHECK (item_type IN ('equipment', 'consumable')),
    item_id TEXT NOT NULL,  -- References either equipment_items.id or consumable_items.id

    -- Availability
    available BOOLEAN DEFAULT TRUE,
    required_level INTEGER DEFAULT 1,
    stock_quantity INTEGER,  -- NULL = unlimited

    -- Pricing (can override base item price)
    price_override INTEGER,  -- NULL = use item's base price

    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_shop_inventory ON shop_inventory(item_type, available);

-- ============================================================================
-- PURCHASE HISTORY
-- ============================================================================

-- Track all purchases (for analytics and potential refunds)
CREATE TABLE IF NOT EXISTS shop_purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    item_type TEXT NOT NULL CHECK (item_type IN ('equipment', 'consumable')),
    item_id TEXT NOT NULL,

    quantity INTEGER DEFAULT 1,
    price_paid INTEGER NOT NULL,
    user_level_at_purchase INTEGER,

    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_shop_purchases_user ON shop_purchases(user_id, purchased_at DESC);

-- ============================================================================
-- SEED CONSUMABLE ITEMS
-- ============================================================================

-- Health Potions
INSERT INTO consumable_items
(id, name, description, type, health_restore, buy_price, sell_price, icon, tier) VALUES
('minor_health_potion', 'Minor Health Potion', 'Restores 25 health.', 'health_potion', 25, 10, 5, '🧪', 'common'),
('health_potion', 'Health Potion', 'Restores 50 health.', 'health_potion', 50, 25, 12, '🧪', 'common'),
('greater_health_potion', 'Greater Health Potion', 'Restores 100 health.', 'health_potion', 100, 50, 25, '🧪', 'uncommon'),
('superior_health_potion', 'Superior Health Potion', 'Restores 200 health.', 'health_potion', 200, 100, 50, '🧪', 'rare'),
('ultimate_health_potion', 'Ultimate Health Potion', 'Fully restores health.', 'health_potion', 999, 250, 125, '🧪', 'epic');

-- Mana Potions
INSERT INTO consumable_items
(id, name, description, type, mana_restore, buy_price, sell_price, icon, tier) VALUES
('minor_mana_potion', 'Minor Mana Potion', 'Restores 15 mana.', 'mana_potion', 15, 10, 5, '💙', 'common'),
('mana_potion', 'Mana Potion', 'Restores 30 mana.', 'mana_potion', 30, 25, 12, '💙', 'common'),
('greater_mana_potion', 'Greater Mana Potion', 'Restores 60 mana.', 'mana_potion', 60, 50, 25, '💙', 'uncommon'),
('superior_mana_potion', 'Superior Mana Potion', 'Restores 120 mana.', 'mana_potion', 120, 100, 50, '💙', 'rare'),
('ultimate_mana_potion', 'Ultimate Mana Potion', 'Fully restores mana.', 'mana_potion', 999, 250, 125, '💙', 'epic');

-- Buff Potions
INSERT INTO consumable_items
(id, name, description, type, buff_type, buff_value, buff_duration_turns, buy_price, sell_price, icon, tier) VALUES
('strength_elixir', 'Strength Elixir', 'Increases strength by 5 for 3 turns.', 'buff_potion', 'strength', 5, 3, 40, 20, '💪', 'uncommon'),
('intelligence_elixir', 'Intelligence Elixir', 'Increases intelligence by 5 for 3 turns.', 'buff_potion', 'intelligence', 5, 3, 40, 20, '🧠', 'uncommon'),
('dexterity_elixir', 'Dexterity Elixir', 'Increases dexterity by 5 for 3 turns.', 'buff_potion', 'dexterity', 5, 3, 40, 20, '🏃', 'uncommon'),
('iron_skin_potion', 'Iron Skin Potion', 'Increases defense by 10 for 5 turns.', 'buff_potion', 'defense', 10, 5, 60, 30, '🛡️', 'rare'),
('berserker_brew', 'Berserker Brew', 'Increases damage by 15 for 3 turns.', 'buff_potion', 'damage', 15, 3, 75, 37, '⚔️', 'rare');

-- ============================================================================
-- SEED SHOP INVENTORY
-- ============================================================================

-- Add all consumables to shop (unlimited stock)
INSERT INTO shop_inventory (item_type, item_id, available, required_level, stock_quantity)
SELECT 'consumable', id, TRUE, 1, NULL
FROM consumable_items;

-- Note: Equipment items will be added to shop inventory after equipment_items are seeded
-- This happens in the db.rs initialization after RPG seed data is loaded

-- ============================================================================
-- INITIALIZE GOLD FOR EXISTING USERS
-- ============================================================================

-- Give existing users 100 starting gold
UPDATE character_stats SET current_gold = 100 WHERE current_gold IS NULL;
