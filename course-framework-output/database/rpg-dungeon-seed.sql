-- RPG Dungeon System Seed Data
-- Floor 1 (MVP), Abilities, Equipment, Enemies, Boss, Encounters, Achievements, Challenges

-- ============================================================================
-- FLOOR 1: THE ENTRANCE (Tutorial Dungeon)
-- ============================================================================

INSERT OR IGNORE INTO dungeon_floors (floor_number, name, description, recommended_level, required_level, enemy_level_range, boss_level, gold_multiplier, xp_multiplier, loot_tier) VALUES
(1, 'The Entrance', 'A damp, dimly lit entrance to the dungeon. The air smells of decay and adventure.', 1, 1, '{"min": 1, "max": 3}', 3, 1.0, 1.0, 1);

-- ============================================================================
-- ABILITIES (Basic Attack, Heal, Fireball, Power Strike)
-- ============================================================================

INSERT OR IGNORE INTO abilities (id, name, description, type, required_level, mana_cost, cooldown_turns, base_value, scaling_stat, scaling_ratio, icon, animation_text) VALUES
('basic_attack', 'Basic Attack', 'A simple physical attack', 'attack', 1, 0, 0, 10, 'strength', 0.3, '⚔️', 'swings their weapon'),
('heal', 'Heal', 'Restore health using mana', 'heal', 3, 15, 0, 30, 'intelligence', 0.2, '❤️', 'channels healing energy'),
('fireball', 'Fireball', 'Hurl a ball of fire at your enemy', 'attack', 5, 20, 0, 25, 'intelligence', 0.5, '🔥', 'launches a blazing fireball'),
('power_strike', 'Power Strike', 'A powerful melee attack', 'attack', 8, 10, 0, 40, 'strength', 0.6, '💪', 'strikes with tremendous force');

-- Unlock Basic Attack for all existing users
INSERT OR IGNORE INTO user_abilities (user_id, ability_id)
SELECT id, 'basic_attack'
FROM users;

-- ============================================================================
-- EQUIPMENT (5 MVP Items)
-- ============================================================================

-- Weapons
INSERT OR IGNORE INTO equipment_items (id, name, description, slot, tier, required_level, damage_bonus, icon, value) VALUES
('wooden_sword', 'Wooden Sword', 'A simple training sword', 'weapon', 'common', 1, 5, '🗡️', 20),
('iron_sword', 'Iron Sword', 'A well-crafted iron blade', 'weapon', 'uncommon', 3, 15, '⚔️', 100);

-- Armor
INSERT OR IGNORE INTO equipment_items (id, name, description, slot, tier, required_level, defense_bonus, hp_bonus, icon, value) VALUES
('leather_armor', 'Leather Armor', 'Basic leather protection', 'armor', 'common', 1, 5, 20, '🛡️', 30),
('chainmail', 'Chainmail Armor', 'Sturdy metal links provide good protection', 'armor', 'uncommon', 4, 10, 40, '🛡️', 150);

-- Accessories
INSERT OR IGNORE INTO equipment_items (id, name, description, slot, tier, required_level, strength_bonus, intelligence_bonus, icon, value) VALUES
('ring_of_power', 'Ring of Power', 'A simple ring that increases strength', 'accessory', 'common', 2, 3, 0, '💍', 50);

-- ============================================================================
-- ENEMIES (Rats and Slimes for Floor 1)
-- ============================================================================

INSERT OR IGNORE INTO enemy_types (id, name, description, base_health, base_damage, base_defense, behavior_type, gold_drop_min, gold_drop_max, xp_reward, loot_table, icon) VALUES
('rat', 'Giant Rat', 'An oversized rat with beady red eyes and sharp teeth', 30, 5, 0, 'aggressive', 15, 30, 50, '[{"item": "wooden_sword", "chance": 0.05}, {"item": "leather_armor", "chance": 0.03}]', '🐀'),
('slime', 'Slime', 'A gelatinous blob that oozes menacingly', 40, 7, 2, 'balanced', 20, 40, 60, '[{"item": "ring_of_power", "chance": 0.02}]', '🟢');

-- Associate enemies with Floor 1
INSERT OR IGNORE INTO floor_enemies (floor_number, enemy_id, spawn_weight) VALUES
(1, 'rat', 60),  -- 60% of spawns
(1, 'slime', 40);  -- 40% of spawns

-- ============================================================================
-- BOSS: GIANT RAT KING (Floor 1)
-- ============================================================================

INSERT OR IGNORE INTO boss_enemies (id, name, description, floor_number, health, damage, defense, abilities, phases, gold_reward, xp_reward, guaranteed_loot, icon) VALUES
('giant_rat_king', 'Giant Rat King', 'A monstrous rat wearing a crude crown. It commands all rats in the dungeon and fights with feral cunning.', 1, 150, 15, 5,
'["basic_attack"]',
'[{"hp_threshold": 50, "effect": "enrage", "description": "Enters a rage, increasing damage by 50%"}]',
200, 500,
'["iron_sword"]',
'🐀👑');

-- ============================================================================
-- ENCOUNTERS (Room types for Floor 1)
-- ============================================================================

-- Combat encounters (handled procedurally, just need weights)
-- Treasure chest
INSERT OR IGNORE INTO dungeon_encounters (id, type, floor_number, description_prompt, required_stat, difficulty_rating, rewards, rarity) VALUES
('floor1_treasure_wooden', 'treasure', 1, 'You discover a wooden chest covered in dust', 'none', 2, '{"gold": 50, "items": ["wooden_sword", "leather_armor"]}', 'common'),
('floor1_treasure_iron', 'treasure', 1, 'An iron-bound chest sits in the corner, its lock rusted but intact', 'none', 4, '{"gold": 100, "items": ["iron_sword", "ring_of_power"]}', 'uncommon');

-- Traps
INSERT OR IGNORE INTO dungeon_encounters (id, type, floor_number, description_prompt, required_stat, difficulty_rating, rewards, penalties, rarity) VALUES
('floor1_trap_spikes', 'trap', 1, 'You notice suspicious floor tiles ahead', 'dexterity', 3, '{"gold": 25}', '{"damage": 15}', 'common'),
('floor1_trap_dart', 'trap', 1, 'A tripwire stretches across the passage', 'dexterity', 4, '{"gold": 40}', '{"damage": 20}', 'uncommon');

-- Rest area
INSERT OR IGNORE INTO dungeon_encounters (id, type, floor_number, description_prompt, required_stat, difficulty_rating, rewards, rarity) VALUES
('floor1_rest', 'rest', 1, 'You find a small alcove with a campfire still smoldering. The air is warmer here.', 'none', 0, '{"heal": "full"}', 'uncommon');

-- ============================================================================
-- ACHIEVEMENTS (MVP set)
-- ============================================================================

INSERT OR IGNORE INTO dungeon_achievements (id, name, description, icon, requirement_type, requirement_value, xp_reward, gold_reward, rarity, display_order) VALUES
('first_blood', 'First Blood', 'Defeat your first enemy in the dungeon', '⚔️', 'enemies_killed', 1, 100, 50, 'common', 1),
('rat_exterminator', 'Rat Exterminator', 'Clear Floor 1 of The Entrance', '🐀', 'floors_cleared', 1, 500, 200, 'uncommon', 2),
('giant_slayer', 'Giant Slayer', 'Defeat your first boss', '🏆', 'boss_defeated', 1, 1000, 500, 'rare', 3),
('flawless_victory', 'Flawless Victory', 'Win combat without taking damage', '💎', 'perfect_combat', 1, 300, 150, 'rare', 4),
('survivor', 'Survivor', 'Win combat with less than 10 HP remaining', '❤️', 'close_call', 1, 200, 100, 'uncommon', 5),
('code_master', 'Code Master', 'Complete 10 combat challenges perfectly', '🧠', 'perfect_challenges', 10, 500, 300, 'rare', 6);

-- ============================================================================
-- COMBAT CHALLENGES (5-10 challenges for Floor 1)
-- ============================================================================

-- Easy challenges for basic attack
INSERT OR IGNORE INTO dungeon_challenges (id, difficulty, action_type, title, description, starter_code, solution, test_cases, min_floor, max_floor) VALUES
('attack_basic_1', 'easy', 'basic_attack', 'Calculate Attack Damage', 'Your basic attack does 10 base damage plus 30% of your strength.\n\nCalculate the total damage.',
'def calculate_damage():\n    base_damage = 10\n    strength = 12\n    # Your code here\n    return ___',
'def calculate_damage():\n    base_damage = 10\n    strength = 12\n    return base_damage + int(strength * 0.3)',
'[{"input": {}, "expected": 13}]', 1, 2);

INSERT OR IGNORE INTO dungeon_challenges (id, difficulty, action_type, title, description, starter_code, solution, test_cases, min_floor, max_floor) VALUES
('attack_basic_2', 'easy', 'basic_attack', 'Weapon Bonus Damage', 'Your weapon adds bonus damage to your attack.\n\nCalculate: base damage + weapon bonus.',
'def calculate_damage():\n    base_damage = 10\n    weapon_bonus = 5\n    # Your code here\n    return ___',
'def calculate_damage():\n    base_damage = 10\n    weapon_bonus = 5\n    return base_damage + weapon_bonus',
'[{"input": {}, "expected": 15}]', 1, 3);

-- Medium challenges for spells
INSERT OR IGNORE INTO dungeon_challenges (id, difficulty, action_type, title, description, starter_code, solution, test_cases, min_floor, max_floor) VALUES
('spell_fireball_1', 'medium', 'spell', 'Fireball Damage Calculation', 'Fireball does 25 base damage plus 50% of your intelligence.\n\nCalculate the total damage.',
'def calculate_fireball_damage():\n    base_damage = 25\n    intelligence = 14\n    # Your code here\n    return ___',
'def calculate_fireball_damage():\n    base_damage = 25\n    intelligence = 14\n    return base_damage + int(intelligence * 0.5)',
'[{"input": {}, "expected": 32}]', 1, 3);

INSERT OR IGNORE INTO dungeon_challenges (id, difficulty, action_type, title, description, starter_code, solution, test_cases, min_floor, max_floor) VALUES
('spell_fireball_2', 'medium', 'spell', 'Critical Fireball', 'Your fireball can deal critical damage!\n\nIf critical hit is True, double the damage. Otherwise, return normal damage.',
'def calculate_critical_damage(damage, is_critical):\n    # Your code here\n    return ___',
'def calculate_critical_damage(damage, is_critical):\n    if is_critical:\n        return damage * 2\n    return damage',
'[{"input": {"damage": 30, "is_critical": true}, "expected": 60}, {"input": {"damage": 30, "is_critical": false}, "expected": 30}]', 1, 3);

-- Easy-medium challenges for healing
INSERT OR IGNORE INTO dungeon_challenges (id, difficulty, action_type, title, description, starter_code, solution, test_cases, min_floor, max_floor) VALUES
('heal_basic_1', 'easy', 'heal', 'Calculate Healing', 'Your heal spell restores 30 HP plus 20% of your intelligence.\n\nCalculate the total healing.',
'def calculate_healing():\n    base_heal = 30\n    intelligence = 14\n    # Your code here\n    return ___',
'def calculate_healing():\n    base_heal = 30\n    intelligence = 14\n    return base_heal + int(intelligence * 0.2)',
'[{"input": {}, "expected": 32}]', 1, 3);

INSERT OR IGNORE INTO dungeon_challenges (id, difficulty, action_type, title, description, starter_code, solution, test_cases, min_floor, max_floor) VALUES
('heal_cap_1', 'medium', 'heal', 'Healing Cap', 'You can only heal up to your maximum HP.\n\nReturn the smaller value: current_hp + healing or max_hp.',
'def calculate_capped_healing(current_hp, max_hp, healing):\n    # Your code here\n    return ___',
'def calculate_capped_healing(current_hp, max_hp, healing):\n    return min(current_hp + healing, max_hp)',
'[{"input": {"current_hp": 70, "max_hp": 100, "healing": 40}, "expected": 100}, {"input": {"current_hp": 70, "max_hp": 100, "healing": 20}, "expected": 90}]', 1, 3);

-- Easy challenges for defend
INSERT OR IGNORE INTO dungeon_challenges (id, difficulty, action_type, title, description, starter_code, solution, test_cases, min_floor, max_floor) VALUES
('defend_basic_1', 'easy', 'defend', 'Calculate Damage Reduction', 'When defending, you reduce incoming damage by 50%.\n\nCalculate the reduced damage.',
'def calculate_reduced_damage(incoming_damage):\n    # Your code here\n    return ___',
'def calculate_reduced_damage(incoming_damage):\n    return int(incoming_damage * 0.5)',
'[{"input": {"incoming_damage": 20}, "expected": 10}]', 1, 3);

-- Power Strike challenge
INSERT OR IGNORE INTO dungeon_challenges (id, difficulty, action_type, title, description, starter_code, solution, test_cases, min_floor, max_floor) VALUES
('power_strike_1', 'medium', 'spell', 'Power Strike Damage', 'Power Strike does 40 base damage plus 60% of your strength.\n\nCalculate the total damage.',
'def calculate_power_strike():\n    base_damage = 40\n    strength = 18\n    # Your code here\n    return ___',
'def calculate_power_strike():\n    base_damage = 40\n    strength = 18\n    return base_damage + int(strength * 0.6)',
'[{"input": {}, "expected": 50}]', 1, 3);

-- More advanced challenge
INSERT OR IGNORE INTO dungeon_challenges (id, difficulty, action_type, title, description, starter_code, solution, test_cases, min_floor, max_floor) VALUES
('combat_combo_1', 'hard', 'basic_attack', 'Combo Attack', 'You build up combo multipliers in combat.\n\nCalculate: base_damage * (1 + combo * 0.1)\n\nRound down to nearest integer.',
'def calculate_combo_damage(base_damage, combo):\n    # Your code here\n    return ___',
'def calculate_combo_damage(base_damage, combo):\n    return int(base_damage * (1 + combo * 0.1))',
'[{"input": {"base_damage": 20, "combo": 3}, "expected": 26}, {"input": {"base_damage": 20, "combo": 0}, "expected": 20}]', 1, 3);
