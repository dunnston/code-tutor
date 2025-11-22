-- RPG Dungeon System Seed Data
-- Floor 1 (MVP), Abilities, Equipment, Enemies, Boss, Encounters, Achievements, Challenges

-- ============================================================================
-- FLOOR 1: THE ENTRANCE (Tutorial Dungeon)
-- ============================================================================

INSERT OR IGNORE INTO dungeon_floors (floor_number, name, description, recommended_level, required_level, enemy_level_range, boss_level, gold_multiplier, xp_multiplier, loot_tier) VALUES
(1, 'The Entrance', 'A damp, dimly lit entrance to the dungeon. The air smells of decay and adventure.', 1, 1, '{"min": 1, "max": 3}', 3, 1.0, 1.0, 1);

-- ============================================================================
-- ABILITIES (All Combat Abilities)
-- ============================================================================

-- Early Game Abilities (Levels 1-5)
INSERT OR IGNORE INTO abilities (id, name, description, type, required_level, mana_cost, cooldown_turns, base_value, scaling_stat, scaling_ratio, icon, animation_text, additional_effects) VALUES
('basic_attack', 'Basic Attack', 'A simple physical attack', 'attack', 1, 0, 0, 10, 'strength', 0.3, '⚔️', 'swings their weapon', NULL),
('power_strike', 'Power Strike', 'Deal 150% weapon damage to a single enemy', 'attack', 1, 5, 0, 15, 'strength', 0.45, '💪', 'strikes with tremendous force', NULL),
('defend', 'Defend', 'Increase defense by 50% for 2 turns', 'buff', 2, 0, 3, 0, 'none', 0, '🛡️', 'takes a defensive stance', '{"defense_multiplier": 1.5, "duration": 2}'),
('quick_jab', 'Quick Jab', 'Deal 80% weapon damage with +20% crit chance', 'attack', 3, 3, 0, 8, 'dexterity', 0.24, '👊', 'delivers a quick jab', '{"crit_bonus": 0.20}'),
('minor_heal', 'Minor Heal', 'Restore 25% of max health', 'heal', 4, 10, 2, 0, 'intelligence', 0, '💚', 'channels healing energy', '{"heal_percent": 0.25}'),
('taunt', 'Taunt', 'Force enemy to target you, gain +30% defense for 1 turn', 'buff', 5, 5, 2, 0, 'none', 0, '😤', 'taunts the enemy', '{"defense_multiplier": 1.3, "duration": 1, "forced_target": true}');

-- Mid Game Abilities (Levels 6-12)
INSERT OR IGNORE INTO abilities (id, name, description, type, required_level, mana_cost, cooldown_turns, base_value, scaling_stat, scaling_ratio, icon, animation_text, additional_effects) VALUES
('whirlwind', 'Whirlwind', 'Deal 80% weapon damage to all enemies', 'attack', 6, 15, 2, 8, 'strength', 0.24, '🌀', 'spins in a whirlwind attack', '{"aoe": true}'),
('poison_strike', 'Poison Strike', 'Deal 100% weapon damage + apply poison (10 damage per turn for 3 turns)', 'attack', 7, 12, 1, 10, 'strength', 0.3, '☠️', 'strikes with a poisoned weapon', '{"dot_damage": 10, "dot_duration": 3}'),
('shield_bash', 'Shield Bash', 'Deal 120% weapon damage, 50% chance to stun for 1 turn', 'attack', 8, 8, 2, 12, 'strength', 0.36, '🛡️', 'bashes with their shield', '{"stun_chance": 0.5, "stun_duration": 1}'),
('mana_drain', 'Mana Drain', 'Deal 90% weapon damage, restore 20% of damage dealt as mana', 'attack', 9, 0, 1, 9, 'intelligence', 0.27, '💙', 'drains the enemy''s essence', '{"mana_leech": 0.2}'),
('battle_cry', 'Battle Cry', 'Increase party''s attack by 25% for 3 turns', 'buff', 10, 15, 4, 0, 'none', 0, '📢', 'lets out a mighty battle cry', '{"attack_multiplier": 1.25, "duration": 3, "party_wide": true}'),
('evasion', 'Evasion', 'Dodge the next 2 attacks', 'buff', 11, 12, 3, 0, 'none', 0, '💨', 'becomes harder to hit', '{"dodge_stacks": 2}'),
('cleave', 'Cleave', 'Deal 130% weapon damage to target and 50% to adjacent enemies', 'attack', 12, 10, 1, 13, 'strength', 0.39, '⚔️', 'cleaves through enemies', '{"splash_damage": 0.5}');

-- Late Game Abilities (Levels 13-20)
INSERT OR IGNORE INTO abilities (id, name, description, type, required_level, mana_cost, cooldown_turns, base_value, scaling_stat, scaling_ratio, icon, animation_text, additional_effects) VALUES
('execute', 'Execute', 'Deal 300% weapon damage if enemy is below 30% health', 'attack', 13, 20, 3, 30, 'strength', 0.9, '💀', 'executes the weakened foe', '{"execute_threshold": 0.3, "execute_multiplier": 3.0}'),
('meteor_strike', 'Meteor Strike', 'Deal heavy damage to all enemies', 'attack', 15, 35, 2, 40, 'intelligence', 1.2, '☄️', 'calls down a meteor', '{"aoe": true}'),
('paralysis', 'Paralysis', '70% chance to stun target for 2 turns', 'debuff', 16, 25, 3, 0, 'intelligence', 0, '⚡', 'unleashes paralyzing magic', '{"stun_chance": 0.7, "stun_duration": 2}'),
('life_steal', 'Life Steal', 'Deal 150% weapon damage, restore 50% of damage as health', 'attack', 17, 20, 2, 15, 'strength', 0.45, '🩸', 'drains life from the enemy', '{"life_leech": 0.5}'),
('berserk', 'Berserk', 'Increase damage by 50%, decrease defense by 30% for 3 turns', 'buff', 18, 15, 5, 0, 'none', 0, '😡', 'enters a berserk rage', '{"damage_multiplier": 1.5, "defense_multiplier": 0.7, "duration": 3}'),
('divine_shield', 'Divine Shield', 'Become invulnerable for 1 turn', 'buff', 19, 30, 3, 0, 'none', 0, '✨', 'is surrounded by divine light', '{"invulnerable": true, "duration": 1}'),
('obliterate', 'Obliterate', 'Deal 400% weapon damage to single target, costs 50% max mana', 'attack', 20, 0, 4, 40, 'strength', 1.2, '💥', 'obliterates the target', '{"mana_cost_percent": 0.5}');

-- Unlock Basic Attack for all existing users
INSERT OR IGNORE INTO user_abilities (user_id, ability_id)
SELECT id, 'basic_attack'
FROM users;

-- ============================================================================
-- EQUIPMENT (5 MVP Items)
-- ============================================================================

-- ============================================================================
-- WEAPONS
-- ============================================================================
INSERT OR IGNORE INTO equipment_items (id, name, description, slot, tier, required_level, damage_bonus, critical_chance_bonus, strength_bonus, icon, value) VALUES
-- Common weapons
('rusty_dagger', 'Rusty Dagger', 'A worn dagger with a rusty blade', 'weapon', 'common', 1, 2, 0.05, 0, '🗡️', 15),
('wooden_sword', 'Wooden Sword', 'A simple training sword', 'weapon', 'common', 1, 5, 0, 0, '🗡️', 20),

-- Uncommon weapons
('iron_sword', 'Iron Sword', 'A well-crafted iron blade', 'weapon', 'uncommon', 3, 5, 0, 3, '⚔️', 100),
('assassins_blade', 'Assassin''s Blade', 'A deadly blade favored by rogues', 'weapon', 'uncommon', 4, 6, 0.10, 0, '🗡️', 150);

INSERT OR IGNORE INTO equipment_items (id, name, description, slot, tier, required_level, damage_bonus, intelligence_bonus, mana_bonus, icon, value) VALUES
('wizards_staff', 'Wizard''s Staff', 'A staff crackling with arcane energy', 'weapon', 'rare', 5, 4, 8, 10, '🪄', 200);

INSERT OR IGNORE INTO equipment_items (id, name, description, slot, tier, required_level, damage_bonus, strength_bonus, critical_chance_bonus, icon, value) VALUES
('flame_tongue', 'Flame Tongue', 'A sword wreathed in magical flames', 'weapon', 'rare', 7, 8, 5, 0.15, '🔥', 350);

-- ============================================================================
-- HELMETS (Head slot)
-- ============================================================================
INSERT OR IGNORE INTO equipment_items (id, name, description, slot, tier, required_level, defense_bonus, dexterity_bonus, icon, value) VALUES
('leather_cap', 'Leather Cap', 'A simple leather cap', 'helmet', 'common', 1, 2, 3, '🧢', 25);

INSERT OR IGNORE INTO equipment_items (id, name, description, slot, tier, required_level, mana_bonus, intelligence_bonus, icon, value) VALUES
('wizards_hat', 'Wizard''s Hat', 'A pointed hat adorned with mystical symbols', 'helmet', 'uncommon', 3, 15, 7, '🎩', 120);

INSERT OR IGNORE INTO equipment_items (id, name, description, slot, tier, required_level, defense_bonus, hp_bonus, strength_bonus, icon, value) VALUES
('knights_helm', 'Knight''s Helm', 'A sturdy steel helmet', 'helmet', 'uncommon', 4, 5, 10, 3, '⛑️', 140);

INSERT OR IGNORE INTO equipment_items (id, name, description, slot, tier, required_level, dexterity_bonus, critical_chance_bonus, defense_bonus, icon, value) VALUES
('shadow_hood', 'Shadow Hood', 'A dark hood that seems to blend with shadows', 'helmet', 'rare', 6, 6, 0.05, 5, '🎭', 280);

INSERT OR IGNORE INTO equipment_items (id, name, description, slot, tier, required_level, intelligence_bonus, mana_bonus, icon, value) VALUES
('crown_of_insight', 'Crown of Insight', 'A regal crown that enhances mental acuity', 'helmet', 'epic', 10, 10, 20, '👑', 600);

-- ============================================================================
-- BOOTS (Feet slot)
-- ============================================================================
INSERT OR IGNORE INTO equipment_items (id, name, description, slot, tier, required_level, defense_bonus, dexterity_bonus, icon, value) VALUES
('worn_boots', 'Worn Boots', 'Old but serviceable boots', 'boots', 'common', 1, 3, 2, '👢', 20),
('boots_of_swiftness', 'Boots of Swiftness', 'Enchanted boots that make you faster', 'boots', 'rare', 6, 3, 8, '👢', 250);

INSERT OR IGNORE INTO equipment_items (id, name, description, slot, tier, required_level, defense_bonus, strength_bonus, hp_bonus, icon, value) VALUES
('steel_greaves', 'Steel Greaves', 'Heavy armored boots', 'boots', 'uncommon', 5, 6, 5, 15, '🥾', 160);

INSERT OR IGNORE INTO equipment_items (id, name, description, slot, tier, required_level, intelligence_bonus, mana_bonus, icon, value) VALUES
('mage_slippers', 'Mage Slippers', 'Comfortable slippers for spellcasters', 'boots', 'uncommon', 4, 4, 10, '🥿', 110);

INSERT OR IGNORE INTO equipment_items (id, name, description, slot, tier, required_level, defense_bonus, strength_bonus, hp_bonus, icon, value) VALUES
('enchanted_sabatons', 'Enchanted Sabatons', 'Magical armored boots with mystical engravings', 'boots', 'epic', 9, 7, 5, 10, '👢', 500);

-- ============================================================================
-- CHEST ARMOR
-- ============================================================================
INSERT OR IGNORE INTO equipment_items (id, name, description, slot, tier, required_level, defense_bonus, mana_bonus, icon, value) VALUES
('tattered_robe', 'Tattered Robe', 'A worn magical robe', 'chest', 'common', 1, 5, 5, '🧥', 30);

INSERT OR IGNORE INTO equipment_items (id, name, description, slot, tier, required_level, defense_bonus, dexterity_bonus, hp_bonus, icon, value) VALUES
('leather_armor', 'Leather Armor', 'Basic leather protection', 'chest', 'common', 1, 8, 3, 10, '🛡️', 50);

INSERT OR IGNORE INTO equipment_items (id, name, description, slot, tier, required_level, defense_bonus, strength_bonus, hp_bonus, icon, value) VALUES
('chainmail', 'Chainmail', 'Sturdy metal links provide good protection', 'chest', 'uncommon', 4, 12, 4, 20, '⚔️', 180),
('plate_armor', 'Plate Armor', 'Heavy full plate armor', 'chest', 'rare', 8, 18, 6, 35, '🛡️', 400);

INSERT OR IGNORE INTO equipment_items (id, name, description, slot, tier, required_level, defense_bonus, intelligence_bonus, mana_bonus, icon, value) VALUES
('robes_of_the_archmage', 'Robes of the Archmage', 'Magnificent robes pulsing with power', 'chest', 'epic', 12, 6, 12, 30, '👘', 700);

-- ============================================================================
-- SHIELDS
-- ============================================================================
INSERT OR IGNORE INTO equipment_items (id, name, description, slot, tier, required_level, defense_bonus, icon, value) VALUES
('wooden_shield', 'Wooden Shield', 'A basic wooden shield', 'shield', 'common', 1, 3, '🛡️', 25);

INSERT OR IGNORE INTO equipment_items (id, name, description, slot, tier, required_level, defense_bonus, hp_bonus, icon, value) VALUES
('iron_shield', 'Iron Shield', 'A solid iron shield', 'shield', 'uncommon', 3, 6, 10, '🛡️', 120),
('tower_shield', 'Tower Shield', 'A massive shield providing excellent protection', 'shield', 'rare', 7, 10, 20, '🛡️', 300);

INSERT OR IGNORE INTO equipment_items (id, name, description, slot, tier, required_level, defense_bonus, dexterity_bonus, icon, value) VALUES
('enchanted_buckler', 'Enchanted Buckler', 'A small magical shield', 'shield', 'rare', 6, 5, 4, '🛡️', 260);

INSERT OR IGNORE INTO equipment_items (id, name, description, slot, tier, required_level, defense_bonus, strength_bonus, hp_bonus, intelligence_bonus, icon, value) VALUES
('dragon_scale_shield', 'Dragon Scale Shield', 'A shield made from genuine dragon scales', 'shield', 'epic', 11, 12, 8, 25, 5, '🐉', 650);

-- ============================================================================
-- ACCESSORIES
-- ============================================================================
INSERT OR IGNORE INTO equipment_items (id, name, description, slot, tier, required_level, strength_bonus, intelligence_bonus, icon, value) VALUES
('ring_of_power', 'Ring of Power', 'A simple ring that increases strength', 'accessory', 'common', 2, 3, 0, '💍', 50);

-- ============================================================================
-- CONSUMABLES (Potions)
-- ============================================================================

-- Health Potions
INSERT OR IGNORE INTO shop_items (id, name, description, category, type, cost_gold, required_level, effects, icon, rarity, is_consumable, max_stack) VALUES
('minor_health_potion', 'Minor Health Potion', 'Restores 25 HP', 'consumable', 'health_potion', 15, 1, '{"type": "heal", "value": 25}', '🧪', 'common', TRUE, 99),
('health_potion', 'Health Potion', 'Restores 50 HP', 'consumable', 'health_potion', 30, 3, '{"type": "heal", "value": 50}', '🧪', 'common', TRUE, 99),
('greater_health_potion', 'Greater Health Potion', 'Restores 100 HP', 'consumable', 'health_potion', 60, 5, '{"type": "heal", "value": 100}', '🧪', 'uncommon', TRUE, 99),
('superior_health_potion', 'Superior Health Potion', 'Restores 200 HP', 'consumable', 'health_potion', 120, 8, '{"type": "heal", "value": 200}', '🧪', 'rare', TRUE, 99),
('supreme_health_potion', 'Supreme Health Potion', 'Restores 350 HP', 'consumable', 'health_potion', 250, 12, '{"type": "heal", "value": 350}', '🧪', 'epic', TRUE, 99);

-- Mana Potions
INSERT OR IGNORE INTO shop_items (id, name, description, category, type, cost_gold, required_level, effects, icon, rarity, is_consumable, max_stack) VALUES
('minor_mana_potion', 'Minor Mana Potion', 'Restores 15 Mana', 'consumable', 'mana_potion', 20, 1, '{"type": "restore_mana", "value": 15}', '💙', 'common', TRUE, 99),
('mana_potion', 'Mana Potion', 'Restores 30 Mana', 'consumable', 'mana_potion', 40, 3, '{"type": "restore_mana", "value": 30}', '💙', 'common', TRUE, 99),
('greater_mana_potion', 'Greater Mana Potion', 'Restores 60 Mana', 'consumable', 'mana_potion', 80, 5, '{"type": "restore_mana", "value": 60}', '💙', 'uncommon', TRUE, 99),
('superior_mana_potion', 'Superior Mana Potion', 'Restores 120 Mana', 'consumable', 'mana_potion', 160, 8, '{"type": "restore_mana", "value": 120}', '💙', 'rare', TRUE, 99),
('supreme_mana_potion', 'Supreme Mana Potion', 'Restores 250 Mana', 'consumable', 'mana_potion', 350, 12, '{"type": "restore_mana", "value": 250}', '💙', 'epic', TRUE, 99);

-- Combination Potions
INSERT OR IGNORE INTO shop_items (id, name, description, category, type, cost_gold, required_level, effects, icon, rarity, is_consumable, max_stack) VALUES
('rejuvenation_potion', 'Rejuvenation Potion', 'Restores 75 HP and 45 Mana', 'consumable', 'combo_potion', 90, 6, '{"type": "combo", "heal": 75, "mana": 45}', '✨', 'rare', TRUE, 50),
('elixir_of_vitality', 'Elixir of Vitality', 'Restores 150 HP and 90 Mana', 'consumable', 'combo_potion', 200, 10, '{"type": "combo", "heal": 150, "mana": 90}', '✨', 'epic', TRUE, 50),
('full_restore', 'Full Restore', 'Completely restores HP and Mana', 'consumable', 'combo_potion', 500, 15, '{"type": "full_restore"}', '🌟', 'legendary', TRUE, 25);

-- ============================================================================
-- ENEMIES (Rats and Slimes for Floor 1)
-- ============================================================================

INSERT OR IGNORE INTO enemy_types (id, name, description, base_health, base_damage, base_defense, behavior_type, gold_drop_min, gold_drop_max, xp_reward, loot_table, icon) VALUES
('rat', 'Giant Rat', 'An oversized rat with beady red eyes and sharp teeth', 30, 5, 0, 'aggressive', 15, 30, 50, '[{"item": "wooden_sword", "chance": 0.05}, {"item": "leather_armor", "chance": 0.03}]', '🐀'),
('slime', 'Slime', 'A gelatinous blob that oozes menacingly', 40, 7, 2, 'balanced', 20, 40, 60, '[{"item": "ring_of_power", "chance": 0.02}]', '🟢'),
('goblin', 'Goblin', 'A small green-skinned creature with sharp claws and a wicked grin', 35, 6, 1, 'aggressive', 18, 35, 55, '[{"item": "wooden_sword", "chance": 0.04}, {"item": "leather_armor", "chance": 0.03}]', '👺'),
('wolf', 'Wild Wolf', 'A fierce wolf with matted fur and hungry eyes', 45, 8, 1, 'aggressive', 22, 42, 65, '[{"item": "leather_armor", "chance": 0.05}, {"item": "ring_of_power", "chance": 0.03}]', '🐺');

-- Associate enemies with Floor 1
INSERT OR IGNORE INTO floor_enemies (floor_number, enemy_id, spawn_weight) VALUES
(1, 'rat', 40),  -- 40% of spawns
(1, 'slime', 30),  -- 30% of spawns
(1, 'goblin', 20),  -- 20% of spawns
(1, 'wolf', 10);  -- 10% of spawns (rarer)

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
-- COMBAT CHALLENGES
-- ============================================================================
-- Note: Multiple choice challenges are loaded from rpg-challenges-multiple-choice.sql
