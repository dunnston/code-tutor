-- Migration 025: Shop Refresh System
-- Adds dynamic shop inventory with rarity-based randomization and 2-hour refresh

-- ============================================================================
-- SHOP REFRESH TRACKING
-- ============================================================================

-- Track when shop inventory was last refreshed
CREATE TABLE IF NOT EXISTS shop_refresh_state (
    id INTEGER PRIMARY KEY CHECK (id = 1), -- Singleton table
    last_refresh_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    next_refresh_time TIMESTAMP NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, '+2 hours')),
    refresh_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initialize the singleton row with next_refresh_time set to NOW to force immediate refresh
INSERT OR IGNORE INTO shop_refresh_state (id, last_refresh_time, next_refresh_time, refresh_count)
VALUES (1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);

-- ============================================================================
-- ACTIVE SHOP INVENTORY
-- ============================================================================

-- Active shop inventory (randomly selected items based on rarity)
-- This table is cleared and repopulated every 2 hours
CREATE TABLE IF NOT EXISTS shop_active_inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_type TEXT NOT NULL CHECK (item_type IN ('equipment', 'consumable')),
    item_id TEXT NOT NULL,

    -- Display order and price
    display_order INTEGER NOT NULL,
    price INTEGER NOT NULL,

    -- Stock (for limited items)
    stock_quantity INTEGER, -- NULL = unlimited

    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_shop_active_inventory ON shop_active_inventory(item_type, display_order);

-- ============================================================================
-- RARITY WEIGHTS CONFIGURATION
-- ============================================================================

-- Define rarity weights for shop item selection
-- Higher weight = more likely to appear
CREATE TABLE IF NOT EXISTS shop_rarity_weights (
    tier TEXT PRIMARY KEY CHECK (tier IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
    weight REAL NOT NULL, -- Probability weight (0.0 to 1.0)
    max_items_per_refresh INTEGER NOT NULL, -- Max items of this tier per refresh
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed rarity weights
-- Common: 60% chance, up to 8 items
-- Uncommon: 25% chance, up to 5 items
-- Rare: 10% chance, up to 3 items
-- Epic: 4% chance, up to 2 items
-- Legendary: 1% chance, up to 1 item
INSERT OR REPLACE INTO shop_rarity_weights (tier, weight, max_items_per_refresh) VALUES
('common', 0.60, 8),
('uncommon', 0.25, 5),
('rare', 0.10, 3),
('epic', 0.04, 2),
('legendary', 0.01, 1);

-- ============================================================================
-- TRIGGER INITIAL SHOP POPULATION
-- ============================================================================

-- Note: The shop_active_inventory will be populated on first access
-- by the check_and_refresh_shop() function in Rust.
-- The next_refresh_time is set to current time to force an immediate refresh
-- on the first shop access.

-- Force immediate refresh by setting next_refresh_time to now
-- This will trigger on any existing row from a previous migration
UPDATE shop_refresh_state
SET next_refresh_time = CURRENT_TIMESTAMP,
    last_refresh_time = CURRENT_TIMESTAMP
WHERE id = 1;