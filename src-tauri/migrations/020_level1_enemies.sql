-- Migration 020: Level 1 Enemy Types
-- All enemies that appear in The Abandoned Fortress (Level 1)

-- ============================================================================
-- COMMON ENEMIES
-- ============================================================================

INSERT OR IGNORE INTO enemy_types (id, name, description, base_health, base_damage, base_defense, behavior_type, gold_drop_min, gold_drop_max, xp_reward, icon) VALUES
('giant_rat', 'Giant Rat', 'A filthy rodent the size of a large dog, with matted fur and gleaming teeth.', 25, 3, 1, 'aggressive', 3, 8, 15, '🐀'),
('goblin', 'Goblin', 'A small, green-skinned humanoid wielding crude weapons and wearing scraps of armor.', 35, 5, 2, 'balanced', 5, 12, 25, '👺'),
('skeleton', 'Skeleton', 'An animated pile of bones held together by dark magic, wielding a rusty sword.', 30, 6, 3, 'defensive', 8, 15, 30, '💀'),
('wolf', 'Wolf', 'A feral wolf with matted fur and hungry eyes, stalking through the ruins.', 40, 7, 2, 'aggressive', 6, 10, 35, '🐺'),
('goblin_archer', 'Goblin Archer', 'A goblin equipped with a crude longbow, preferring to attack from range.', 28, 6, 1, 'balanced', 8, 15, 30, '🏹'),
('skeleton_guard', 'Skeleton Guard', 'A well-armored skeleton wielding a shield and sword, once a fortress guard.', 45, 7, 5, 'defensive', 12, 20, 40, '🛡️'),
('rat_folk', 'Rat-Folk Scavenger', 'A humanoid rat creature, intelligent and cunning, searching for loot.', 32, 5, 2, 'balanced', 7, 14, 28, '🐭'),
('gelatinous_cube_small', 'Small Gelatinous Cube', 'A smaller version of the infamous dungeon scavenger, still dangerous with its acid.', 50, 8, 1, 'aggressive', 15, 30, 50, '🟩');

-- ============================================================================
-- BOSS ENEMIES
-- ============================================================================

INSERT OR IGNORE INTO boss_enemies (id, name, description, floor_number, health, damage, defense, abilities, phases, gold_reward, xp_reward, guaranteed_loot, icon) VALUES
('gelatinous_cube_boss', 'Gelatinous Cube', 'A massive, translucent cube of acidic ooze that fills the ceremonial hall. Bones and treasures float within its gelatinous mass.', 1, 150, 12, 3,
'["Acid Touch", "Engulf", "Acid Splash"]',
'[{"hpThreshold": 50, "effect": "Enraged - Increased attack speed", "description": "The cube pulses angrily, moving faster!"}]',
75, 200,
'["magic_dagger_plus2", "adventurer_sword", "healing_potion", "glowing_crystal"]',
'🟩'),

('young_dragon', 'Young Red Dragon', 'A juvenile dragon guarding its small hoard. Its scales gleam crimson and smoke curls from its nostrils.', 1, 120, 15, 6,
'["Fire Breath", "Claw Attack", "Tail Swipe", "Intimidate"]',
'[{"hpThreshold": 40, "effect": "Desperate Fury - Double damage", "description": "The dragon roars in rage, flames bursting from its maw!"}]',
150, 250,
'["dragon_scale_armor", "magic_sword_plus4", "ruby_gem", "fire_resistance_ring"]',
'🐉');

-- ============================================================================
-- LOOT TABLES (JSON format for equipment drops)
-- ============================================================================

-- Update loot tables for enemies
UPDATE enemy_types SET loot_table = '[
    {"item": "health_potion_small", "chance": 0.15}
]' WHERE id = 'giant_rat';

UPDATE enemy_types SET loot_table = '[
    {"item": "health_potion_small", "chance": 0.2},
    {"item": "rusty_dagger", "chance": 0.1}
]' WHERE id = 'goblin';

UPDATE enemy_types SET loot_table = '[
    {"item": "health_potion_small", "chance": 0.15},
    {"item": "rusty_sword", "chance": 0.12},
    {"item": "bone_fragments", "chance": 0.3}
]' WHERE id = 'skeleton';

UPDATE enemy_types SET loot_table = '[
    {"item": "wolf_pelt", "chance": 0.4},
    {"item": "fresh_meat", "chance": 0.3}
]' WHERE id = 'wolf';

UPDATE enemy_types SET loot_table = '[
    {"item": "longbow", "chance": 0.15},
    {"item": "arrows", "chance": 0.5}
]' WHERE id = 'goblin_archer';

UPDATE enemy_types SET loot_table = '[
    {"item": "iron_shield", "chance": 0.2},
    {"item": "health_potion_medium", "chance": 0.15},
    {"item": "silver_amulet", "chance": 0.1}
]' WHERE id = 'skeleton_guard';

UPDATE enemy_types SET loot_table = '[
    {"item": "health_potion_small", "chance": 0.2},
    {"item": "gold_coins", "chance": 0.4}
]' WHERE id = 'rat_folk';

UPDATE enemy_types SET loot_table = '[
    {"item": "health_potion_medium", "chance": 0.3},
    {"item": "acid_vial", "chance": 0.2},
    {"item": "random_weapon", "chance": 0.15}
]' WHERE id = 'gelatinous_cube_small';
