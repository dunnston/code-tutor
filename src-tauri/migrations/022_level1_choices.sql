-- Migration 022: Level 1 Narrative Choices
-- All choices/actions available at each location in Level 1

-- ============================================================================
-- STARTING POINT - Path Selection
-- ============================================================================

INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('start_path_a', 'level1_start', 'Enter through the left archway to the Main Courtyard', FALSE, NULL, NULL, NULL, 1, '⬅️'),
('start_path_b', 'level1_start', 'Take the center passage down the Dark Corridor', FALSE, NULL, NULL, NULL, 2, '⬆️'),
('start_path_c', 'level1_start', 'Go right through the archway to the Overgrown Garden', FALSE, NULL, NULL, NULL, 3, '➡️');

-- ============================================================================
-- PATH A: MAIN COURTYARD
-- ============================================================================

-- Courtyard - Initial combat (auto-triggers, no choice needed for combat itself)
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('courtyard_fight', 'path_a_courtyard', 'Fight the Giant Rats (3x)', FALSE, NULL, NULL, NULL, 1, '⚔️');

-- Courtyard Cleared - Investigation options
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('courtyard_check_well', 'path_a_courtyard_cleared', 'Inspect the Ancient Well', FALSE, NULL, NULL, NULL, 1, '🪣'),
('courtyard_enter_tower', 'path_a_courtyard_cleared', 'Enter the Guard Tower', FALSE, NULL, NULL, NULL, 2, '🗼'),
('courtyard_check_barracks', 'path_a_courtyard_cleared', 'Investigate the Old Barracks', FALSE, NULL, NULL, NULL, 3, '🏚️');

-- Ancient Well - Intelligence check
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('well_examine', 'path_a_ancient_well', 'Examine the well carefully (INT check)', TRUE, 'intelligence', 12, 'basic_attack', 1, '🔍'),
('well_descend', 'path_a_ancient_well', 'Descend into the well immediately', FALSE, NULL, NULL, NULL, 2, '⬇️'),
('well_mark_later', 'path_a_ancient_well', 'Mark it for later and return to courtyard', FALSE, NULL, NULL, NULL, 3, '🔙');

-- Guard Tower Entrance
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('tower_stealth', 'path_a_guard_tower_entrance', 'Enter stealthily (DEX check)', TRUE, 'dexterity', 10, 'basic_attack', 1, '🤫'),
('tower_bold', 'path_a_guard_tower_entrance', 'Enter boldly', FALSE, NULL, NULL, NULL, 2, '🚪');

-- Guard Tower Floor 2 - Combat
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('tower_f2_fight', 'path_a_guard_tower_floor2', 'Fight the Goblins (2x)', FALSE, NULL, NULL, NULL, 1, '⚔️');

-- Guard Tower Floor 3 - Locked door
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('tower_f3_break_door', 'path_a_guard_tower_floor3', 'Break down the door (STR check)', TRUE, 'strength', 14, 'basic_attack', 1, '💪'),
('tower_f3_pick_lock', 'path_a_guard_tower_floor3', 'Pick the lock (DEX check)', TRUE, 'dexterity', 12, 'basic_attack', 2, '🔓'),
('tower_f3_use_key', 'path_a_guard_tower_floor3', 'Use the Silver Key (if you have it)', FALSE, NULL, NULL, NULL, 3, '🔑');

-- Guard Tower Floor 4 - Combat
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('tower_f4_fight', 'path_a_guard_tower_floor4', 'Fight the Goblin Archer', FALSE, NULL, NULL, NULL, 1, '⚔️');

-- Tower Top Cleared - Vantage point
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('tower_top_survey', 'path_a_tower_top_cleared', 'Survey the fortress from above', FALSE, NULL, NULL, NULL, 1, '👁️'),
('tower_top_descend', 'path_a_tower_top_cleared', 'Descend back down', FALSE, NULL, NULL, NULL, 2, '⬇️');

-- Barracks - Combat
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('barracks_fight', 'path_a_barracks', 'Fight the Goblins (2x)', FALSE, NULL, NULL, NULL, 1, '⚔️');

-- Barracks Cleared - Investigation
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('barracks_move_beam', 'path_a_barracks_cleared', 'Move the heavy beam blocking the locker (STR check)', TRUE, 'strength', 13, 'basic_attack', 1, '💪'),
('barracks_small_door', 'path_a_barracks_cleared', 'Go through the small door to Armory Hallway', FALSE, NULL, NULL, NULL, 2, '🚪'),
('barracks_leave', 'path_a_barracks_cleared', 'Return to the courtyard', FALSE, NULL, NULL, NULL, 3, '🔙');

-- ============================================================================
-- PATH B: DARK CORRIDOR
-- ============================================================================

-- Trapped Hallway - Trap handling
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('trap_disarm', 'path_b_trapped_hall', 'Disarm the trap carefully (INT check)', TRUE, 'intelligence', 12, 'basic_attack', 1, '🛠️'),
('trap_jump', 'path_b_trapped_hall', 'Jump over the pressure plate (DEX check)', TRUE, 'dexterity', 13, 'basic_attack', 2, '🦘'),
('trap_trigger_run', 'path_b_trapped_hall', 'Trigger it and run (DEX check)', TRUE, 'dexterity', 11, 'basic_attack', 3, '🏃');

-- The Fork - Three directions
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('fork_storage', 'path_b_the_fork', 'Turn left into the Storage Chambers', FALSE, NULL, NULL, NULL, 1, '⬅️'),
('fork_throne', 'path_b_the_fork', 'Turn right toward the Throne Room', FALSE, NULL, NULL, NULL, 2, '➡️'),
('fork_library', 'path_b_the_fork', 'Continue straight to the Library', FALSE, NULL, NULL, NULL, 3, '⬆️');

-- Storage Room 1 - Hidden cache
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('storage1_search', 'path_b_storage_room1', 'Search for hidden caches (INT check)', TRUE, 'intelligence', 11, 'basic_attack', 1, '🔍'),
('storage1_next', 'path_b_storage_room1', 'Move to the next room', FALSE, NULL, NULL, NULL, 2, '➡️'),
('storage1_back', 'path_b_storage_room1', 'Return to the fork', FALSE, NULL, NULL, NULL, 3, '🔙');

-- Storage Room 2 - Locked chest
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('storage2_pick_lock', 'path_b_storage_room2', 'Pick the lock (DEX check)', TRUE, 'dexterity', 12, 'basic_attack', 1, '🔓'),
('storage2_smash', 'path_b_storage_room2', 'Smash the chest open (STR check)', TRUE, 'strength', 13, 'basic_attack', 2, '🔨'),
('storage2_next', 'path_b_storage_room2', 'Leave it and move to the next room', FALSE, NULL, NULL, NULL, 3, '➡️');

-- Storage Room 3 - Combat
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('storage3_fight', 'path_b_storage_room3', 'Fight the Skeleton Guardian', FALSE, NULL, NULL, NULL, 1, '⚔️');

-- Throne Room Approach - Armor trap
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('throne_approach_notice', 'path_b_throne_approach', 'Sense danger and investigate (CHA/INT check)', TRUE, 'intelligence', 13, 'basic_attack', 1, '🔍'),
('throne_approach_walk', 'path_b_throne_approach', 'Walk through confidently', FALSE, NULL, NULL, NULL, 2, '🚶');

-- Throne Room - Combat
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('throne_fight', 'path_b_throne_room', 'Fight the enemies (2 Goblins + 2 Skeletons)', FALSE, NULL, NULL, NULL, 1, '⚔️');

-- Throne Room Cleared - Investigation
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('throne_inspect_throne', 'path_b_throne_room_cleared', 'Inspect the throne carefully (INT check)', TRUE, 'intelligence', 14, 'basic_attack', 1, '👑'),
('throne_check_banners', 'path_b_throne_room_cleared', 'Check behind the banners', FALSE, NULL, NULL, NULL, 2, '🚩'),
('throne_search', 'path_b_throne_room_cleared', 'Search thoroughly for secrets (INT check)', TRUE, 'intelligence', 15, 'basic_attack', 3, '🔍'),
('throne_archway', 'path_b_throne_room_cleared', 'Exit through the ceremonial archway to Great Hall', FALSE, NULL, NULL, NULL, 4, '🚪');

-- Library - Multiple options
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('library_search_books', 'path_b_library', 'Search for useful books (INT check)', TRUE, 'intelligence', 12, 'basic_attack', 1, '📖'),
('library_desk', 'path_b_library', 'Investigate the intact desk', FALSE, NULL, NULL, NULL, 2, '🪑'),
('library_collapsed', 'path_b_library', 'Check the collapsed section (STR check)', TRUE, 'strength', 14, 'basic_attack', 3, '🏗️'),
('library_leave', 'path_b_library', 'Return to the fork', FALSE, NULL, NULL, NULL, 4, '🔙');

-- Library Secret Passage
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('library_secret_chapel', 'path_b_library_secret', 'Follow the passage to the Chapel', FALSE, NULL, NULL, NULL, 1, '➡️'),
('library_secret_back', 'path_b_library_secret', 'Go back to the library', FALSE, NULL, NULL, NULL, 2, '🔙');

-- ============================================================================
-- PATH C: OVERGROWN GARDEN
-- ============================================================================

-- Wild Garden - Wolf encounter options
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('garden_investigate_sounds', 'path_c_wild_garden', 'Investigate the wolf sounds', FALSE, NULL, NULL, NULL, 1, '🐺'),
('garden_shed', 'path_c_wild_garden', 'Search the Gardener''s Shed', FALSE, NULL, NULL, NULL, 2, '🛖'),
('garden_overgrown_path', 'path_c_wild_garden', 'Follow the overgrown path deeper', FALSE, NULL, NULL, NULL, 3, '🌿');

-- Wolf Encounter - Combat or calm
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('wolves_calm', 'path_c_wolf_encounter', 'Attempt to calm them (CHA check)', TRUE, 'charisma', 13, 'basic_attack', 1, '🤝'),
('wolves_attack', 'path_c_wolf_encounter', 'Attack preemptively', FALSE, NULL, NULL, NULL, 2, '⚔️'),
('wolves_sneak', 'path_c_wolf_encounter', 'Sneak past them (DEX check)', TRUE, 'dexterity', 12, 'basic_attack', 3, '🤫');

-- Gardener's Shed - Rest area
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('shed_rest', 'path_c_gardener_shed', 'Rest here and heal (20 HP)', FALSE, NULL, NULL, NULL, 1, '💤'),
('shed_wall', 'path_c_gardener_shed', 'Investigate the back wall (INT check)', TRUE, 'intelligence', 13, 'basic_attack', 2, '🔍'),
('shed_leave', 'path_c_gardener_shed', 'Leave the shed', FALSE, NULL, NULL, NULL, 3, '🚪');

-- Greenhouse Ruins - Combat
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('greenhouse_navigate', 'path_c_greenhouse_ruins', 'Navigate the broken glass carefully (DEX check)', TRUE, 'dexterity', 11, 'basic_attack', 1, '🪟'),
('greenhouse_fight', 'path_c_greenhouse_ruins', 'Fight the Small Gelatinous Cube', FALSE, NULL, NULL, NULL, 2, '⚔️');

-- Greenhouse Cleared - Investigation
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('greenhouse_herbs', 'path_c_greenhouse_cleared', 'Identify healing herbs (INT check)', TRUE, 'intelligence', 12, 'basic_attack', 1, '🌿'),
('greenhouse_puzzle_door', 'path_c_greenhouse_cleared', 'Solve the puzzle lock (INT check)', TRUE, 'intelligence', 14, 'basic_attack', 2, '🔐'),
('greenhouse_leave', 'path_c_greenhouse_cleared', 'Return to the garden', FALSE, NULL, NULL, NULL, 3, '🔙');

-- Alchemist Lab - Multiple options
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('lab_examine_potions', 'path_c_alchemist_lab', 'Examine the potions (INT check)', TRUE, 'intelligence', 13, 'basic_attack', 1, '⚗️'),
('lab_search_desk', 'path_c_alchemist_lab', 'Search the desk for notes', FALSE, NULL, NULL, NULL, 2, '📝'),
('lab_locked_cabinet', 'path_c_alchemist_lab', 'Open the locked cabinet (need Brass Key)', FALSE, NULL, NULL, NULL, 3, '🔐'),
('lab_exit_window', 'path_c_alchemist_lab', 'Exit through the window to Greenhouse', FALSE, NULL, NULL, NULL, 4, '🪟'),
('lab_exit_door', 'path_c_alchemist_lab', 'Exit through the door to Great Hall', FALSE, NULL, NULL, NULL, 5, '🚪');

-- ============================================================================
-- SECONDARY AREAS
-- ============================================================================

-- Underground Aqueduct - Combat
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('aqueduct_fight', 'underground_aqueduct', 'Fight the Giant Rats (4x)', FALSE, NULL, NULL, NULL, 1, '⚔️');

-- Aqueduct Cleared - Three tunnels
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('aqueduct_north', 'underground_aqueduct_cleared', 'Take the north tunnel back to the well', FALSE, NULL, NULL, NULL, 1, '⬆️'),
('aqueduct_east', 'underground_aqueduct_cleared', 'Try the locked east grate (need Brass Key)', FALSE, NULL, NULL, NULL, 2, '➡️'),
('aqueduct_south', 'underground_aqueduct_cleared', 'Clear the collapsed south tunnel (STR check)', TRUE, 'strength', 15, 'basic_attack', 3, '⬇️');

-- Prison Cells - Investigation
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('prison_cell4', 'prison_cells', 'Open Cell 4 (need Iron Key or STR check)', TRUE, 'strength', 14, 'basic_attack', 1, '🔓'),
('prison_cell5', 'prison_cells', 'Squeeze through collapsed Cell 5', FALSE, NULL, NULL, NULL, 2, '🚪'),
('prison_guard_room', 'prison_cells', 'Search the guard room', FALSE, NULL, NULL, NULL, 3, '🔍'),
('prison_exit', 'prison_cells', 'Exit to Armory Hallway', FALSE, NULL, NULL, NULL, 4, '🚪');

-- Armory Hallway - Trap
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('armory_hall_spot_trap', 'armory_hallway', 'Carefully look for traps (DEX check)', TRUE, 'dexterity', 12, 'basic_attack', 1, '👀'),
('armory_hall_walk', 'armory_hallway', 'Walk through normally', FALSE, NULL, NULL, NULL, 2, '🚶'),
('armory_hall_to_armory', 'armory_hallway', 'Proceed to the Armory', FALSE, NULL, NULL, NULL, 3, '➡️');

-- The Armory - Combat
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('armory_fight', 'the_armory', 'Fight the Skeleton Guard', FALSE, NULL, NULL, NULL, 1, '⚔️');

-- Armory Cleared - Loot
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('armory_break_racks', 'the_armory_cleared', 'Break open weapon racks (STR check)', TRUE, 'strength', 13, 'basic_attack', 1, '💪'),
('armory_locked_box', 'the_armory_cleared', 'Open the locked box (DEX or STR)', TRUE, 'dexterity', 12, 'basic_attack', 2, '🔐'),
('armory_door', 'the_armory_cleared', 'Exit through back door to Great Hall', FALSE, NULL, NULL, NULL, 3, '🚪');

-- The Chapel - Peaceful area
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('chapel_altar', 'the_chapel', 'Investigate the altar (INT check)', TRUE, 'intelligence', 14, 'basic_attack', 1, '⛪'),
('chapel_offerings', 'the_chapel', 'Collect the gold offerings', FALSE, NULL, NULL, NULL, 2, '💰'),
('chapel_stained_glass', 'the_chapel', 'Examine the stained glass window', FALSE, NULL, NULL, NULL, 3, '🪟'),
('chapel_prayer', 'the_chapel', 'Search the prayer books for blessings (CHA check)', TRUE, 'charisma', 12, 'basic_attack', 4, '📖'),
('chapel_to_hall', 'the_chapel', 'Exit to Great Hall', FALSE, NULL, NULL, NULL, 5, '🚪');

-- Secret Treasury - Treasure room
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('treasury_detect_ward', 'secret_treasury', 'Detect the magical ward (INT check)', TRUE, 'intelligence', 15, 'basic_attack', 1, '✨'),
('treasury_enter', 'secret_treasury', 'Enter the treasury', FALSE, NULL, NULL, NULL, 2, '🚪'),
('treasury_leave', 'secret_treasury', 'Leave via passage to Great Hall', FALSE, NULL, NULL, NULL, 3, '🚶');

-- Dragon Treasury - Boss fight or negotiation
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('dragon_negotiate', 'dragon_treasury', 'Attempt to negotiate (CHA check)', TRUE, 'charisma', 16, 'basic_attack', 1, '💬'),
('dragon_fight', 'dragon_treasury', 'Fight the Young Dragon', FALSE, NULL, NULL, NULL, 2, '⚔️');

-- Dragon Treasury Cleared
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('dragon_loot', 'dragon_treasury_cleared', 'Collect the dragon''s hoard', FALSE, NULL, NULL, NULL, 1, '💎'),
('dragon_return', 'dragon_treasury_cleared', 'Return to Great Hall', FALSE, NULL, NULL, NULL, 2, '🔙');

-- ============================================================================
-- GREAT HALL & FINALE
-- ============================================================================

-- Great Hall - Combat
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('hall_fight', 'great_hall', 'Fight the enemies (3 Goblins + 1 Wolf)', FALSE, NULL, NULL, NULL, 1, '⚔️');

-- Great Hall Cleared - Multiple exits
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('hall_climb_balcony', 'great_hall_cleared', 'Climb to the balcony (STR/DEX check)', TRUE, 'dexterity', 12, 'basic_attack', 1, '🪜'),
('hall_to_kitchen', 'great_hall_cleared', 'Enter the kitchens (west door)', FALSE, NULL, NULL, NULL, 2, '🍳'),
('hall_crimson_door', 'great_hall_cleared', 'Try the Crimson Door (need Silver Key or STR check)', TRUE, 'strength', 18, 'basic_attack', 3, '🚪'),
('hall_main_exit', 'great_hall_cleared', 'Take the main exit to the Antechamber', FALSE, NULL, NULL, NULL, 4, '🚪');

-- Kitchen - Investigation
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('kitchen_hearth', 'kitchen', 'Investigate the hearth (INT check)', TRUE, 'intelligence', 13, 'basic_attack', 1, '🔥'),
('kitchen_pantry', 'kitchen', 'Check the pantry', FALSE, NULL, NULL, NULL, 2, '🍞'),
('kitchen_back', 'kitchen', 'Return to Great Hall', FALSE, NULL, NULL, NULL, 3, '🔙');

-- Antechamber - Safe zone before boss
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('ante_heal', 'antechamber', 'Use the healing fountain (restore full HP)', FALSE, NULL, NULL, NULL, 1, '⛲'),
('ante_camp', 'antechamber', 'Search the abandoned campsite', FALSE, NULL, NULL, NULL, 2, '🏕️'),
('ante_organize', 'antechamber', 'Organize equipment and prepare', FALSE, NULL, NULL, NULL, 3, '🎒'),
('ante_to_boss', 'antechamber', 'Enter the Grand Archway to face the boss', FALSE, NULL, NULL, NULL, 4, '🚪'),
('ante_return', 'antechamber', 'Return to Great Hall (explore more)', FALSE, NULL, NULL, NULL, 5, '🔙'),
('ante_escape', 'antechamber', 'Take the narrow side passage (emergency escape)', FALSE, NULL, NULL, NULL, 6, '🏃');

-- Boss Arena
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('boss_fight', 'boss_arena', 'Fight the Gelatinous Cube!', FALSE, NULL, NULL, NULL, 1, '⚔️');

-- Level Complete
INSERT INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('complete_descend', 'level1_complete', 'Descend to Level 2', FALSE, NULL, NULL, NULL, 1, '⬇️'),
('complete_rest', 'level1_complete', 'Rest and heal before continuing', FALSE, NULL, NULL, NULL, 2, '💤');
