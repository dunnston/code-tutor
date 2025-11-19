-- Gamification System Seed Data
-- Shop Items, Daily Quests, Weekly Quests

-- ============================================================================
-- SHOP ITEMS - CONSUMABLES
-- ============================================================================

-- Experience Potions
INSERT OR IGNORE INTO shop_items (id, name, description, category, type, cost_gold, cost_gems, effects, icon, rarity, is_consumable, max_stack) VALUES
('xp-potion-small', 'Minor XP Potion', 'Gain 50% bonus XP for the next lesson', 'consumable', 'xp_boost', 200, 0, '{"type": "xp_multiplier", "value": 1.5, "duration": "next_lesson"}', '🧪', 'common', TRUE, 10),
('xp-potion-medium', 'XP Potion', 'Gain 100% bonus XP for the next 3 lessons', 'consumable', 'xp_boost', 500, 0, '{"type": "xp_multiplier", "value": 2.0, "duration": "3_lessons"}', '⚗️', 'uncommon', TRUE, 5),
('xp-potion-large', 'Grand XP Potion', 'Gain 200% bonus XP for 1 hour', 'consumable', 'xp_boost', 0, 25, '{"type": "xp_multiplier", "value": 3.0, "duration_seconds": 3600}', '🍾', 'rare', TRUE, 3);

-- Gold Boosters
INSERT OR IGNORE INTO shop_items (id, name, description, category, type, cost_gold, cost_gems, effects, icon, rarity, is_consumable, max_stack) VALUES
('gold-boost', 'Treasure Hunter''s Charm', 'Earn 50% more gold for 24 hours', 'consumable', 'gold_boost', 1000, 0, '{"type": "gold_multiplier", "value": 1.5, "duration_seconds": 86400}', '🪙', 'uncommon', TRUE, 3);

-- Streak Protection
INSERT OR IGNORE INTO shop_items (id, name, description, category, type, cost_gold, cost_gems, effects, icon, rarity, is_consumable, max_stack) VALUES
('streak-shield', 'Streak Shield', 'Protects your streak if you miss ONE day. Consumed automatically.', 'consumable', 'streak_protection', 500, 0, '{"type": "streak_protection", "value": 1, "duration": "until_used"}', '🛡️', 'uncommon', TRUE, 3),
('eternal-shield', 'Eternal Streak Shield', 'Protect your streak for up to 7 days. Premium item.', 'consumable', 'streak_protection', 0, 100, '{"type": "streak_protection", "value": 7, "duration": "until_used"}', '🛡️✨', 'epic', TRUE, 1);

-- Hint Tokens
INSERT OR IGNORE INTO shop_items (id, name, description, category, type, cost_gold, cost_gems, effects, icon, rarity, is_consumable, max_stack) VALUES
('hint-scroll', 'Hint Scroll', 'Unlock one hint for free (no point cost)', 'consumable', 'free_hint', 150, 0, '{"type": "free_hint", "value": 1}', '📜', 'common', TRUE, 20);

-- Time Savers
INSERT OR IGNORE INTO shop_items (id, name, description, category, type, cost_gold, cost_gems, effects, icon, rarity, is_consumable, max_stack) VALUES
('fast-forward', 'Time Crystal', 'Skip lesson timer requirements (for timed challenges)', 'consumable', 'skip_timer', 0, 10, '{"type": "skip_timer", "value": 1}', '⏩', 'rare', TRUE, 5);

-- ============================================================================
-- SHOP ITEMS - BOOSTS
-- ============================================================================

INSERT OR IGNORE INTO shop_items (id, name, description, category, type, cost_gold, cost_gems, effects, icon, rarity, is_consumable, max_stack) VALUES
('focus-mode', 'Focus Elixir', '2x XP for all activities for 2 hours', 'boost', 'xp_boost', 0, 50, '{"type": "xp_multiplier", "value": 2.0, "duration_seconds": 7200}', '🧠', 'rare', TRUE, 3),
('puzzle-master', 'Puzzle Master Brew', '2x points from puzzles for 1 hour', 'boost', 'puzzle_boost', 800, 0, '{"type": "puzzle_points_multiplier", "value": 2.0, "duration_seconds": 3600}', '🧩', 'uncommon', TRUE, 5);

-- ============================================================================
-- SHOP ITEMS - COSMETICS
-- ============================================================================

-- Avatars
INSERT OR IGNORE INTO shop_items (id, name, description, category, type, cost_gold, cost_gems, required_level, effects, icon, rarity, is_consumable, max_stack) VALUES
('avatar-warrior', 'Warrior Avatar', 'Legendary warrior avatar frame', 'cosmetic', 'avatar', 0, 100, 5, '{"type": "cosmetic", "avatar_id": "warrior"}', '⚔️', 'rare', FALSE, 1),
('avatar-mage', 'Archmage Avatar', 'Master of the arcane arts', 'cosmetic', 'avatar', 0, 150, 10, '{"type": "cosmetic", "avatar_id": "mage"}', '🧙', 'epic', FALSE, 1),
('avatar-ninja', 'Shadow Ninja Avatar', 'Silent and deadly', 'cosmetic', 'avatar', 0, 150, 10, '{"type": "cosmetic", "avatar_id": "ninja"}', '🥷', 'epic', FALSE, 1),
('avatar-robot', 'Robot Avatar', 'Mechanical precision', 'cosmetic', 'avatar', 0, 100, 8, '{"type": "cosmetic", "avatar_id": "robot"}', '🤖', 'rare', FALSE, 1);

-- Themes
INSERT OR IGNORE INTO shop_items (id, name, description, category, type, cost_gold, cost_gems, required_level, effects, icon, rarity, is_consumable, max_stack) VALUES
('theme-dark-forest', 'Dark Forest Theme', 'UI theme: Dark greens with forest ambiance', 'cosmetic', 'theme', 0, 200, 10, '{"type": "cosmetic", "theme_id": "dark_forest"}', '🌲', 'epic', FALSE, 1),
('theme-cyberpunk', 'Cyberpunk Neon Theme', 'Futuristic neon lights and cyber aesthetics', 'cosmetic', 'theme', 0, 300, 20, '{"type": "cosmetic", "theme_id": "cyberpunk"}', '🌆', 'legendary', FALSE, 1),
('theme-ocean', 'Ocean Depths Theme', 'Calm blue waters and sea creatures', 'cosmetic', 'theme', 0, 200, 15, '{"type": "cosmetic", "theme_id": "ocean"}', '🌊', 'epic', FALSE, 1);

-- Titles
INSERT OR IGNORE INTO shop_items (id, name, description, category, type, cost_gold, cost_gems, required_level, effects, icon, rarity, is_consumable, max_stack) VALUES
('title-code-knight', 'Code Knight Title', 'Display "Code Knight" under your name', 'cosmetic', 'title', 0, 50, 5, '{"type": "cosmetic", "title": "Code Knight"}', '🛡️', 'uncommon', FALSE, 1),
('title-bug-hunter', 'Bug Hunter Title', 'Display "Bug Hunter" under your name', 'cosmetic', 'title', 0, 50, 8, '{"type": "cosmetic", "title": "Bug Hunter"}', '🐛', 'uncommon', FALSE, 1),
('title-algorithm-master', 'Algorithm Master Title', 'Display "Algorithm Master" under your name', 'cosmetic', 'title', 0, 75, 15, '{"type": "cosmetic", "title": "Algorithm Master"}', '🎯', 'rare', FALSE, 1);

-- Celebration Effects
INSERT OR IGNORE INTO shop_items (id, name, description, category, type, cost_gold, cost_gems, required_level, effects, icon, rarity, is_consumable, max_stack) VALUES
('fireworks-celebration', 'Fireworks Celebration', 'Fireworks animation when completing lessons', 'cosmetic', 'celebration', 0, 75, 10, '{"type": "cosmetic", "celebration": "fireworks"}', '🎆', 'rare', FALSE, 1),
('confetti-celebration', 'Confetti Burst', 'Confetti explosion on success', 'cosmetic', 'celebration', 0, 50, 5, '{"type": "cosmetic", "celebration": "confetti"}', '🎊', 'uncommon', FALSE, 1);

-- ============================================================================
-- SHOP ITEMS - UTILITY
-- ============================================================================

-- Course Access
INSERT OR IGNORE INTO shop_items (id, name, description, category, type, cost_gold, cost_gems, effects, icon, rarity, is_consumable, max_stack) VALUES
('early-access-intermediate', 'Intermediate Access Pass', 'Unlock Intermediate courses before level requirement', 'utility', 'unlock', 0, 250, '{"type": "unlock_courses", "skill_level": "intermediate"}', '🔓', 'epic', TRUE, 1),
('early-access-advanced', 'Advanced Access Pass', 'Unlock Advanced courses before level requirement', 'utility', 'unlock', 0, 500, '{"type": "unlock_courses", "skill_level": "advanced"}', '🔓✨', 'legendary', TRUE, 1);

-- Retry Tokens
INSERT OR IGNORE INTO shop_items (id, name, description, category, type, cost_gold, cost_gems, effects, icon, rarity, is_consumable, max_stack) VALUES
('retry-token', 'Retry Token', 'Reset a failed challenge lesson attempt', 'utility', 'retry', 300, 0, '{"type": "retry_lesson"}', '🔄', 'uncommon', TRUE, 10);

-- Auto-Save
INSERT OR IGNORE INTO shop_items (id, name, description, category, type, cost_gold, cost_gems, effects, icon, rarity, is_consumable, max_stack) VALUES
('auto-save-scroll', 'Auto-Save Scroll', 'Automatically saves your code every 30 seconds for 1 week', 'utility', 'auto_save', 500, 0, '{"type": "auto_save", "duration_seconds": 604800}', '💾', 'uncommon', TRUE, 3);

-- ============================================================================
-- DAILY QUESTS
-- ============================================================================

INSERT OR IGNORE INTO quests (id, type, title, description, objective_type, objective_target, reward_xp, reward_gold, reward_gems, repeatable, icon, order_index) VALUES
('daily-lesson', 'daily', 'Daily Devotion', 'Complete 1 lesson', 'complete_lessons', 1, 100, 100, 0, TRUE, '📚', 1),
('daily-three-lessons', 'daily', 'Learning Spree', 'Complete 3 lessons', 'complete_lessons', 3, 300, 300, 5, TRUE, '🔥', 2),
('daily-puzzle', 'daily', 'Puzzle Master', 'Solve 2 puzzles', 'solve_puzzles', 2, 200, 200, 0, TRUE, '🧩', 3),
('daily-xp', 'daily', 'XP Grinder', 'Earn 500 XP', 'earn_xp', 500, 0, 250, 5, TRUE, '⚡', 4),
('daily-no-hints', 'daily', 'Self-Sufficient', 'Complete a lesson without using hints', 'lesson_no_hints', 1, 150, 200, 3, TRUE, '💪', 5);

-- ============================================================================
-- WEEKLY QUESTS
-- ============================================================================

INSERT OR IGNORE INTO quests (id, type, title, description, objective_type, objective_target, reward_xp, reward_gold, reward_gems, repeatable, icon, order_index) VALUES
('weekly-grind', 'weekly', 'Weekly Warrior', 'Complete 15 lessons this week', 'complete_lessons', 15, 1000, 1500, 25, TRUE, '⚔️', 1),
('weekly-puzzles', 'weekly', 'Puzzle Enthusiast', 'Solve 10 puzzles this week', 'solve_puzzles', 10, 800, 1200, 20, TRUE, '🧠', 2),
('weekly-perfect', 'weekly', 'Perfectionist', 'Complete 5 lessons perfectly (no hints, first try)', 'perfect_lessons', 5, 1500, 2000, 50, TRUE, '✨', 3),
('weekly-streak', 'weekly', 'Consistent Coder', 'Maintain your streak for 7 days', 'maintain_streak', 7, 0, 1000, 30, TRUE, '🔥', 4);

-- ============================================================================
-- STARTER PACKAGES
-- ============================================================================

-- Give new users a welcome package in their inventory
-- This would be triggered by backend logic when a new user is created
-- For now, we'll add some starter items via seed data

-- Note: User inventory should be populated by backend when users make purchases
-- This is just structure reference
