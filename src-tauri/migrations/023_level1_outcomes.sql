-- Migration 023: Level 1 Narrative Outcomes
-- All outcomes for choices in Level 1
-- Format: Success/Failure for skill checks, Default for simple choices

-- ============================================================================
-- STARTING POINT - Path Selection
-- ============================================================================

INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('start_path_a_out', 'start_path_a', 'default', 'You step through the left archway into the main courtyard. The open space is littered with debris, and you immediately spot movement - giant rats!', 'path_a_courtyard', NULL, NULL, NULL, FALSE, NULL, 0),
('start_path_b_out', 'start_path_b', 'default', 'You enter the dark corridor. Flickering torches cast dancing shadows on the scorch-marked walls. A pressure plate is clearly visible on the floor ahead.', 'path_b_trapped_hall', NULL, NULL, NULL, FALSE, NULL, 0),
('start_path_c_out', 'start_path_c', 'default', 'You pass through the archway into an overgrown garden. Moonlight filters through breaks in the ceiling, and you hear the distant sound of wolves howling.', 'path_c_wild_garden', NULL, NULL, NULL, FALSE, NULL, 0);

-- ============================================================================
-- PATH A: MAIN COURTYARD
-- ============================================================================

-- Courtyard Combat
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('courtyard_fight_out', 'courtyard_fight', 'default', 'Three giant rats emerge from the rubble, teeth bared and ready to attack!', 'path_a_courtyard', NULL, NULL, NULL, TRUE, 'giant_rat', 3);

-- After courtyard combat - this special outcome is set when combat ends successfully
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('courtyard_cleared_out', 'courtyard_fight', 'success', 'Victory! You find 15 gold coins scattered among the debris. The courtyard is now safe to explore.', 'path_a_courtyard_cleared', '{"gold": 15, "xp": 45}', NULL, '{"courtyard_cleared": true}', FALSE, NULL, 0);

-- Courtyard Investigation
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('courtyard_well_out', 'courtyard_check_well', 'default', 'You approach the ancient well. The stone is covered in moss, but the rope looks surprisingly sturdy.', 'path_a_ancient_well', NULL, NULL, NULL, FALSE, NULL, 0),
('courtyard_tower_out', 'courtyard_enter_tower', 'default', 'You approach the guard tower. The heavy wooden door stands slightly ajar, darkness beyond.', 'path_a_guard_tower_entrance', NULL, NULL, NULL, FALSE, NULL, 0),
('courtyard_barracks_out', 'courtyard_check_barracks', 'default', 'You head toward the collapsed barracks. One section is still accessible, and you can hear movement inside.', 'path_a_barracks', NULL, NULL, NULL, FALSE, NULL, 0);

-- Ancient Well - Intelligence check
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('well_examine_success', 'well_examine', 'success', 'Your careful examination reveals the rope is indeed sturdy despite its age. You notice it leads deep underground to what sounds like running water. The well seems safe to descend.', 'path_a_ancient_well', NULL, NULL, '{"knows_well_safe": true}', FALSE, NULL, 0),
('well_examine_fail', 'well_examine', 'failure', 'The well looks treacherous. You can''t tell if the rope would hold your weight. Better to find another way or come back when you''re more skilled.', 'path_a_ancient_well', NULL, NULL, NULL, FALSE, NULL, 0),
('well_descend_out', 'well_descend', 'default', 'You grab the rope and begin your descent into the darkness. Water echoes below as you drop into the underground aqueduct.', 'underground_aqueduct', NULL, NULL, NULL, FALSE, NULL, 0),
('well_mark_out', 'well_mark_later', 'default', 'You decide to mark the well for later exploration and return to the courtyard.', 'path_a_courtyard_cleared', NULL, NULL, '{"marked_well": true}', FALSE, NULL, 0);

-- Guard Tower Entrance
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('tower_stealth_success', 'tower_stealth', 'success', 'You slip through the door silently. The goblins inside are completely unaware of your presence. You have the element of surprise!', 'path_a_guard_tower_floor2', NULL, NULL, '{"tower_surprise_round": true}', FALSE, NULL, 0),
('tower_stealth_fail', 'tower_stealth', 'failure', 'Your foot catches on the door, making it creak loudly! The goblins inside immediately notice you.', 'path_a_guard_tower_floor2', NULL, NULL, NULL, FALSE, NULL, 0),
('tower_bold_out', 'tower_bold', 'default', 'You push the door open and stride in confidently. The goblins look up from their game, grabbing their weapons.', 'path_a_guard_tower_floor2', NULL, NULL, NULL, FALSE, NULL, 0);

-- Guard Tower Floor 2 Combat
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('tower_f2_fight_out', 'tower_f2_fight', 'default', 'Two goblins leap to their feet, drawing crude weapons. Time to fight!', 'path_a_guard_tower_floor2', NULL, NULL, NULL, TRUE, 'goblin', 2);

-- After Floor 2 combat
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('tower_f2_cleared_out', 'tower_f2_fight', 'success', 'The goblins fall! You loot 18 gold from their dice game. A ladder leads up to the third floor, and a door leads to the barracks hallway.', 'path_a_guard_tower_floor3', '{"gold": 18, "xp": 50}', NULL, '{"tower_floor2_cleared": true}', FALSE, NULL, 0);

-- Guard Tower Floor 3 - Door
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('tower_f3_break_success', 'tower_f3_break_door', 'success', 'With a mighty kick, you smash the door open! The officer''s quarters lie beyond.', 'path_a_guard_tower_floor4', NULL, NULL, NULL, FALSE, NULL, 0),
('tower_f3_break_fail', 'tower_f3_break_door', 'failure', 'The door holds firm! The impact hurts your shoulder. You''ll need to find another way or try again.', 'path_a_guard_tower_floor3', NULL, '{"damage": 5}', NULL, FALSE, NULL, 0),
('tower_f3_pick_success', 'tower_f3_pick_lock', 'success', 'Click! Your deft fingers work the lock expertly. The door swings open silently.', 'path_a_guard_tower_floor4', NULL, NULL, NULL, FALSE, NULL, 0),
('tower_f3_pick_fail', 'tower_f3_pick_lock', 'failure', 'The lock is more complex than you thought. It doesn''t budge. Perhaps there''s another way?', 'path_a_guard_tower_floor3', NULL, NULL, NULL, FALSE, NULL, 0),
('tower_f3_key_out', 'tower_f3_use_key', 'default', 'The Silver Key fits perfectly! The door unlocks with a satisfying click.', 'path_a_guard_tower_floor4', NULL, NULL, NULL, FALSE, NULL, 0);

-- Guard Tower Floor 4 Combat
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('tower_f4_fight_out', 'tower_f4_fight', 'default', 'The goblin archer spots you and readies its bow! The fight is on!', 'path_a_guard_tower_floor4', NULL, NULL, NULL, TRUE, 'goblin_archer', 1);

-- After Floor 4 combat
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('tower_f4_cleared_out', 'tower_f4_fight', 'success', 'The archer falls! You claim the longbow, 12 gold, and a quiver of arrows. From this vantage point, you can see the entire fortress.', 'path_a_tower_top_cleared', '{"gold": 12, "xp": 30}', NULL, '{"tower_cleared": true, "has_longbow": true}', FALSE, NULL, 0);

-- Tower Top Actions
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('tower_survey_out', 'tower_top_survey', 'default', 'From here you can see: the trap in Path B (if not yet encountered), a suspicious section of the garden, and a red door in the distance. You also spot the Great Hall through a broken section of roof. This knowledge will serve you well.', 'path_a_tower_top_cleared', NULL, NULL, '{"spotted_trap": true, "spotted_greenhouse": true, "spotted_crimson_door": true, "spotted_great_hall": true}', FALSE, NULL, 0),
('tower_descend_out', 'tower_top_descend', 'default', 'You carefully descend back down the tower. From the second floor, you can see a door leading toward the Great Hall.', 'great_hall', NULL, NULL, NULL, FALSE, NULL, 0);

-- Barracks Combat
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('barracks_fight_out', 'barracks_fight', 'default', 'Two goblins turn from their looting and attack!', 'path_a_barracks', NULL, NULL, NULL, TRUE, 'goblin', 2);

-- After Barracks combat
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('barracks_cleared_out', 'barracks_fight', 'success', 'The goblins are defeated! The barracks is now safe to search.', 'path_a_barracks_cleared', '{"gold": 10, "xp": 50}', NULL, '{"barracks_cleared": true}', FALSE, NULL, 0);

-- Barracks Investigation
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('barracks_beam_success', 'barracks_move_beam', 'success', 'You heave the beam aside with a grunt. Inside the locker you find a rusty shortsword, leather armor, and 10 gold!', 'path_a_barracks_cleared', '{"gold": 10, "items": ["rusty_shortsword", "leather_armor"]}', NULL, '{"locker_opened": true}', FALSE, NULL, 0),
('barracks_beam_fail', 'barracks_move_beam', 'failure', 'The beam is too heavy! You can''t budge it. Perhaps if you were stronger...', 'path_a_barracks_cleared', NULL, NULL, NULL, FALSE, NULL, 0),
('barracks_door_out', 'barracks_small_door', 'default', 'You pass through the small door into a long hallway lined with weapon plaques.', 'armory_hallway', NULL, NULL, NULL, FALSE, NULL, 0),
('barracks_leave_out', 'barracks_leave', 'default', 'You return to the courtyard.', 'path_a_courtyard_cleared', NULL, NULL, NULL, FALSE, NULL, 0);

-- ============================================================================
-- PATH B: DARK CORRIDOR
-- ============================================================================

-- Trapped Hallway
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('trap_disarm_success', 'trap_disarm', 'success', 'Your careful work pays off! You disarm the trap completely. The way forward is safe.', 'path_b_the_fork', NULL, NULL, '{"trap_disarmed": true}', FALSE, NULL, 0),
('trap_disarm_fail', 'trap_disarm', 'failure', 'Click! You triggered it! Rocks fall from the ceiling, striking you hard!', 'path_b_the_fork', NULL, '{"damage": 15}', '{"trap_triggered": true}', FALSE, NULL, 0),
('trap_jump_success', 'trap_jump', 'success', 'You leap gracefully over the pressure plate, landing safely on the other side!', 'path_b_the_fork', NULL, NULL, '{"trap_avoided": true}', FALSE, NULL, 0),
('trap_jump_fail', 'trap_jump', 'failure', 'Your foot clips the edge of the plate! The trap activates, and falling rocks strike you!', 'path_b_the_fork', NULL, '{"damage": 15}', '{"trap_triggered": true}', FALSE, NULL, 0),
('trap_run_success', 'trap_trigger_run', 'success', 'You trigger the trap and dash forward! Rocks crash behind you, but you''re already clear!', 'path_b_the_fork', NULL, NULL, '{"trap_triggered": true}', FALSE, NULL, 0),
('trap_run_fail', 'trap_trigger_run', 'failure', 'You trigger the trap but aren''t fast enough! Some rocks catch you as you run.', 'path_b_the_fork', NULL, '{"damage": 10}', '{"trap_triggered": true}', FALSE, NULL, 0);

-- The Fork - Direction choices
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('fork_storage_out', 'fork_storage', 'default', 'You turn left into a series of storage chambers. The first room appears empty, but looks can be deceiving...', 'path_b_storage_room1', NULL, NULL, NULL, FALSE, NULL, 0),
('fork_throne_out', 'fork_throne', 'default', 'You turn right down a hallway lined with suits of armor. The atmosphere feels ominous.', 'path_b_throne_approach', NULL, NULL, NULL, FALSE, NULL, 0),
('fork_library_out', 'fork_library', 'default', 'You continue straight into an old library. Dust covers everything, and collapsed shelves block parts of the room.', 'path_b_library', NULL, NULL, NULL, FALSE, NULL, 0),
('fork_great_hall_out', 'fork_great_hall', 'default', 'You proceed through the cleared storage passage. The door at the back leads to the Great Hall.', 'great_hall', NULL, NULL, NULL, FALSE, NULL, 0);

-- Storage Room 1
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('storage1_search_success', 'storage1_search', 'success', 'Your keen eye spots a suspicious floor tile! You pry it up and find a hidden cache containing 20 gold!', 'path_b_storage_room1', '{"gold": 20}', NULL, '{"found_storage1_cache": true}', FALSE, NULL, 0),
('storage1_search_fail', 'storage1_search', 'failure', 'Despite your best efforts, the room yields no secrets. Just dusty crates and broken shelves.', 'path_b_storage_room1', NULL, NULL, NULL, FALSE, NULL, 0),
('storage1_next_out', 'storage1_next', 'default', 'You move to the second storage room.', 'path_b_storage_room2', NULL, NULL, NULL, FALSE, NULL, 0),
('storage1_back_out', 'storage1_back', 'default', 'You return to the fork in the corridor.', 'path_b_the_fork', NULL, NULL, NULL, FALSE, NULL, 0);

-- Storage Room 2
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('storage2_pick_success', 'storage2_pick_lock', 'success', 'Click! The lock opens smoothly. Inside you find 30 gold, a healing potion, and a mysterious brass key!', 'path_b_storage_room2', '{"gold": 30, "items": ["healing_potion", "brass_key"]}', NULL, '{"has_brass_key": true, "chest_opened": true}', FALSE, NULL, 0),
('storage2_pick_fail', 'storage2_pick_lock', 'failure', 'The lock is stubborn and refuses to open. Your lockpicks won''t budge it.', 'path_b_storage_room2', NULL, NULL, NULL, FALSE, NULL, 0),
('storage2_smash_success', 'storage2_smash', 'success', 'You bring your weapon down hard! The chest splinters open, revealing 30 gold, a healing potion, and a brass key!', 'path_b_storage_room2', '{"gold": 30, "items": ["healing_potion", "brass_key"]}', NULL, '{"has_brass_key": true, "chest_smashed": true}', FALSE, NULL, 0),
('storage2_smash_fail', 'storage2_smash', 'failure', 'The chest is sturdier than it looks! Your blow glances off, and your arms ache from the impact.', 'path_b_storage_room2', NULL, '{"damage": 3}', NULL, FALSE, NULL, 0),
('storage2_next_out', 'storage2_next', 'default', 'You move to the third and final storage room.', 'path_b_storage_room3', NULL, NULL, NULL, FALSE, NULL, 0);

-- Storage Room 3 Combat
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('storage3_fight_out', 'storage3_fight', 'default', 'As you enter, a skeleton guardian animates with a rattle of bones! Ancient magic compels it to attack!', 'path_b_storage_room3', NULL, NULL, NULL, TRUE, 'skeleton', 1);

-- After Storage 3 combat
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('storage3_cleared_out', 'storage3_fight', 'success', 'The skeleton crumbles to dust! You find 15 gold and gain 30 XP.', 'path_b_storage_room3_cleared', '{"gold": 15, "xp": 30}', NULL, '{"found_fortress_map": true, "storage_cleared": true}', FALSE, NULL, 0);

-- Storage Room 3 Cleared Navigation
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('storage3_to_hall_out', 'storage3_to_hall', 'default', 'You proceed through the door at the back of the storage room. It leads to the Great Hall.', 'great_hall', NULL, NULL, NULL, FALSE, NULL, 0),
('storage3_to_fork_out', 'storage3_to_fork', 'default', 'You return to the fork in the corridor to explore other paths.', 'path_b_the_fork', NULL, NULL, NULL, FALSE, NULL, 0);

-- Throne Room Approach
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('throne_approach_notice_success', 'throne_approach_notice', 'success', 'Something feels wrong... You notice one suit of armor is slightly different from the others! As you watch, it animates - but you''re ready for it!', 'path_b_throne_room', '{"xp": 10}', NULL, '{"noticed_armor_trap": true}', TRUE, 'skeleton', 1),
('throne_approach_notice_fail', 'throne_approach_notice', 'failure', 'The hallway seems fine to you. You walk forward confidently... and a skeleton bursts from one of the armor suits, surprising you!', 'path_b_throne_room', NULL, '{"damage": 8}', '{"ambushed_by_armor": true}', TRUE, 'skeleton', 1),
('throne_approach_walk_out', 'throne_approach_walk', 'default', 'You stride forward boldly. Suddenly, a skeleton bursts from one of the armor suits and attacks!', 'path_b_throne_room', NULL, '{"damage": 8}', '{"ambushed_by_armor": true}', TRUE, 'skeleton', 1),
('throne_approach_walk_victory', 'throne_approach_walk', 'success', 'The animated armor crumbles! You proceed cautiously into the throne room.', 'path_b_throne_room', '{"xp": 30}', NULL, NULL, FALSE, NULL, 0);

-- Throne Room Combat
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('throne_fight_out', 'throne_fight', 'default', 'The throne room erupts into chaos! Two goblins and two skeletons coordinate their attack. This will be tough!', 'path_b_throne_room', NULL, NULL, NULL, TRUE, 'goblin', 2);

-- After throne room combat (special multi-enemy fight)
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('throne_cleared_out', 'throne_fight', 'success', 'Victory! The enemies fall one by one. You collect 25 gold from the bodies. The throne room is yours to explore.', 'path_b_throne_room_cleared', '{"gold": 25, "xp": 100}', NULL, '{"throne_room_cleared": true}', FALSE, NULL, 0);

-- Throne Room Investigation
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('throne_inspect_success', 'throne_inspect_throne', 'success', 'You notice a slight gap behind the throne! Pressing on it reveals a hidden lever. Inside the compartment is an Ornate Silver Key!', 'path_b_throne_room_cleared', '{"items": ["silver_key"]}', NULL, '{"has_silver_key": true, "found_throne_secret": true}', FALSE, NULL, 0),
('throne_inspect_fail', 'throne_inspect_throne', 'failure', 'The throne looks old and decrepit, but you don''t spot anything unusual about it.', 'path_b_throne_room_cleared', NULL, NULL, NULL, FALSE, NULL, 0),
('throne_banners_out', 'throne_check_banners', 'default', 'Behind the torn banner, you find a Rusty Iron Key hanging on a hook! You also find 15 gold in a pouch.', 'path_b_throne_room_cleared', '{"gold": 15, "items": ["iron_key"]}', NULL, '{"has_iron_key": true}', FALSE, NULL, 0),
('throne_search_success', 'throne_search', 'success', 'Your thorough search reveals a slight draft from one wall. Investigating further, you discover a secret passage to the Chapel!', 'path_b_library_secret', NULL, NULL, '{"found_chapel_passage": true}', FALSE, NULL, 0),
('throne_search_fail', 'throne_search', 'failure', 'Despite your efforts, you find nothing more of interest in this room.', 'path_b_throne_room_cleared', NULL, NULL, NULL, FALSE, NULL, 0),
('throne_archway_out', 'throne_archway', 'default', 'You pass through the ceremonial archway into the Great Hall.', 'great_hall', NULL, NULL, NULL, FALSE, NULL, 0);

-- Library
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('library_books_success', 'library_search_books', 'success', 'You find a tome about the fortress history! One passage reads: "The cube fears flame" and another mentions "The dragon''s hoard lies beyond the crimson door."', 'path_b_library', NULL, NULL, '{"knows_cube_weakness": true, "knows_dragon_location": true}', FALSE, NULL, 0),
('library_books_fail', 'library_search_books', 'failure', 'Just dusty old books. Nothing useful here.', 'path_b_library', NULL, NULL, NULL, FALSE, NULL, 0),
('library_desk_out', 'library_desk', 'default', 'You find a journal belonging to the fortress captain! It mentions: "The tower holds our best vantage point. The key to my quarters hangs in the throne room, behind the banner."', 'path_b_library', NULL, NULL, '{"read_captain_journal": true}', FALSE, NULL, 0),
('library_collapsed_success', 'library_collapsed', 'success', 'With effort, you clear enough debris to reveal a secret passage! It leads to the Chapel.', 'path_b_library_secret', NULL, NULL, '{"found_chapel_passage": true}', FALSE, NULL, 0),
('library_collapsed_fail', 'library_collapsed', 'failure', 'The debris is too heavy. You''d need more strength or perhaps some help to move this.', 'path_b_library', NULL, NULL, NULL, FALSE, NULL, 0),
('library_leave_out', 'library_leave', 'default', 'You return to the fork.', 'path_b_the_fork', NULL, NULL, NULL, FALSE, NULL, 0);

-- Library Secret Passage
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('library_secret_chapel_out', 'library_secret_chapel', 'default', 'You follow the narrow passage and emerge in a small, abandoned chapel.', 'the_chapel', NULL, NULL, NULL, FALSE, NULL, 0),
('library_secret_back_out', 'library_secret_back', 'default', 'You return to the library.', 'path_b_library', NULL, NULL, NULL, FALSE, NULL, 0);

-- ============================================================================
-- PATH C: OVERGROWN GARDEN
-- ============================================================================

-- Wild Garden choices
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('garden_sounds_out', 'garden_investigate_sounds', 'default', 'You follow the sounds to find two wolves feeding on remains. They notice your presence...', 'path_c_wolf_encounter', NULL, NULL, NULL, FALSE, NULL, 0),
('garden_shed_out', 'garden_shed', 'default', 'You approach the weathered shed. The door creaks open to reveal a modest interior.', 'path_c_gardener_shed', NULL, NULL, NULL, FALSE, NULL, 0),
('garden_path_out', 'garden_overgrown_path', 'default', 'You push through the overgrown vegetation toward the ruined greenhouse.', 'path_c_greenhouse_ruins', NULL, NULL, NULL, FALSE, NULL, 0);

-- Wolf Encounter
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('wolves_calm_success', 'wolves_calm', 'success', 'Your soothing words calm the wolves. They accept you as non-threatening and leave peacefully. Among the remains you find 20 gold and fresh meat! You continue deeper into the garden.', 'path_c_greenhouse_ruins', '{"gold": 20, "items": ["fresh_meat"]}', NULL, '{"wolves_calmed": true}', FALSE, NULL, 0),
('wolves_calm_fail', 'wolves_calm', 'failure', 'The wolves snarl at your approach. Your attempt backfires - they attack!', 'path_c_wolf_encounter', NULL, NULL, NULL, TRUE, 'wolf', 2),
('wolves_attack_out', 'wolves_attack', 'default', 'You draw your weapon and charge! The wolves bare their fangs and leap to meet you!', 'path_c_wolf_encounter', NULL, NULL, NULL, TRUE, 'wolf', 2),
('wolves_sneak_success', 'wolves_sneak', 'success', 'You move like a shadow, slipping past the wolves undetected. They never notice you! You continue deeper into the garden.', 'path_c_greenhouse_ruins', '{"xp": 10}', NULL, '{"sneaked_past_wolves": true}', FALSE, NULL, 0),
('wolves_sneak_fail', 'wolves_sneak', 'failure', 'A twig snaps under your foot! The wolves'' heads snap toward you. They attack!', 'path_c_wolf_encounter', NULL, NULL, NULL, TRUE, 'wolf', 2);

-- After wolf combat (when combat is triggered by failed skill checks)
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('wolves_defeated_out', 'wolves_attack', 'success', 'The wolves fall! You collect wolf pelts and find 20 gold and fresh meat among the remains. The path ahead leads to the greenhouse ruins and eventually the Great Hall.', 'path_c_wild_garden', '{"gold": 20, "xp": 70, "items": ["wolf_pelt", "fresh_meat"]}', NULL, '{"wolves_defeated": true}', FALSE, NULL, 0),
('wolves_sneak_combat_win', 'wolves_sneak', 'success', 'The wolves fall! You collect wolf pelts and find 20 gold and fresh meat among the remains. The path ahead leads to the greenhouse ruins and eventually the Great Hall.', 'path_c_wild_garden', '{"gold": 20, "xp": 70, "items": ["wolf_pelt", "fresh_meat"]}', NULL, '{"wolves_defeated": true}', FALSE, NULL, 0),
('wolves_calm_combat_win', 'wolves_calm', 'success', 'The wolves fall! You collect wolf pelts and find 20 gold and fresh meat among the remains. The path ahead leads to the greenhouse ruins and eventually the Great Hall.', 'path_c_wild_garden', '{"gold": 20, "xp": 70, "items": ["wolf_pelt", "fresh_meat"]}', NULL, '{"wolves_defeated": true}', FALSE, NULL, 0);

-- Gardener's Shed
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('shed_rest_out', 'shed_rest', 'default', 'You rest on the old bedroll, feeling your wounds heal. A goblin scout bursts in, having followed you!', 'path_c_gardener_shed', '{"heal": 20}', NULL, '{"rested_in_shed": true}', TRUE, 'goblin', 1),
('shed_rest_combat_win', 'shed_rest', 'success', 'After defeating the goblin, you find 15 gold and a crude map showing a rat nest in the cellars.', 'path_c_gardener_shed', '{"gold": 15, "xp": 25}', NULL, '{"found_cellar_map": true}', FALSE, NULL, 0),
('shed_wall_success', 'shed_wall', 'success', 'You discover a hidden tunnel behind the back wall! It connects to the underground aqueduct.', 'path_c_gardener_shed', NULL, NULL, '{"found_shed_tunnel": true}', FALSE, NULL, 0),
('shed_wall_fail', 'shed_wall', 'failure', 'The wall seems solid. Nothing unusual here.', 'path_c_gardener_shed', NULL, NULL, NULL, FALSE, NULL, 0),
('shed_leave_out', 'shed_leave', 'default', 'You exit the shed and return to the garden.', 'path_c_wild_garden', NULL, NULL, NULL, FALSE, NULL, 0);

-- Greenhouse Ruins
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('greenhouse_navigate_success', 'greenhouse_navigate', 'success', 'You carefully pick your way through the broken glass, avoiding all cuts. Well done!', 'path_c_greenhouse_ruins', NULL, NULL, NULL, FALSE, NULL, 0),
('greenhouse_navigate_fail', 'greenhouse_navigate', 'failure', 'Ouch! The glass cuts your feet badly. You take 8 damage and move slower until healed.', 'path_c_greenhouse_ruins', NULL, '{"damage": 8}', '{"cut_feet": true}', FALSE, NULL, 0),
('greenhouse_fight_out', 'greenhouse_fight', 'default', 'A small gelatinous cube oozes toward you, acidic and hungry! This is a preview of what''s to come.', 'path_c_greenhouse_ruins', NULL, NULL, NULL, TRUE, 'gelatinous_cube_small', 1);

-- After greenhouse combat
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('greenhouse_cleared_out', 'greenhouse_fight', 'success', 'The cube dissolves! Within it you find 30 gold and a random weapon it had absorbed. You can now safely explore this area.', 'path_c_greenhouse_cleared', '{"gold": 30, "xp": 50}', NULL, '{"greenhouse_cleared": true}', FALSE, NULL, 0);

-- Greenhouse Investigation
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('greenhouse_herbs_success', 'greenhouse_herbs', 'success', 'You identify healing herbs! You collect enough for 2 healing potions (15 HP each).', 'path_c_greenhouse_cleared', '{"items": ["healing_potion", "healing_potion"]}', NULL, '{"collected_herbs": true}', FALSE, NULL, 0),
('greenhouse_herbs_fail', 'greenhouse_herbs', 'failure', 'You can''t tell which plants are safe. Best not to risk it.', 'path_c_greenhouse_cleared', NULL, NULL, NULL, FALSE, NULL, 0),
('greenhouse_puzzle_success', 'greenhouse_puzzle_door', 'success', 'The puzzle lock clicks open! Beyond lies an alchemist''s laboratory.', 'path_c_alchemist_lab', NULL, NULL, '{"puzzle_solved": true}', FALSE, NULL, 0),
('greenhouse_puzzle_fail', 'greenhouse_puzzle_door', 'failure', 'The puzzle is too complex. The lock remains sealed.', 'path_c_greenhouse_cleared', NULL, NULL, NULL, FALSE, NULL, 0),
('greenhouse_leave_out', 'greenhouse_leave', 'default', 'You return to the garden.', 'path_c_wild_garden', NULL, NULL, NULL, FALSE, NULL, 0);

-- Alchemist Lab
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('lab_potions_success', 'lab_examine_potions', 'success', 'You identify 3 healing potions and 1 strength potion (+2 damage for 3 encounters)!', 'path_c_alchemist_lab', '{"items": ["healing_potion", "healing_potion", "healing_potion", "strength_potion"]}', NULL, '{"identified_potions": true}', FALSE, NULL, 0),
('lab_potions_fail', 'lab_examine_potions', 'failure', 'You grab some random bottles, but one turns out to be poison! You take 10 damage when you test it.', 'path_c_alchemist_lab', '{"items": ["healing_potion", "poison"]}', '{"damage": 10}', '{"grabbed_random_potions": true}', FALSE, NULL, 0),
('lab_desk_out', 'lab_search_desk', 'default', 'You find the alchemist''s notes about the Gelatinous Cube: "Acid resistant, but fire causes rapid dissolution." You also find a formula for fire oil!', 'path_c_alchemist_lab', '{"items": ["fire_oil_formula"]}', NULL, '{"knows_cube_weakness": true, "has_fire_formula": true}', FALSE, NULL, 0),
('lab_cabinet_out', 'lab_locked_cabinet', 'default', 'The brass key fits! Inside you find 50 gold, rare ingredients, and a recipe book.', 'path_c_alchemist_lab', '{"gold": 50, "items": ["recipe_book", "rare_ingredients"]}', NULL, '{"opened_lab_cabinet": true}', FALSE, NULL, 0),
('lab_window_out', 'lab_exit_window', 'default', 'You climb through the window back to the greenhouse.', 'path_c_greenhouse_cleared', NULL, NULL, NULL, FALSE, NULL, 0),
('lab_door_out', 'lab_exit_door', 'default', 'You exit through the door into the Great Hall.', 'great_hall', NULL, NULL, NULL, FALSE, NULL, 0);

-- ============================================================================
-- SECONDARY AREAS
-- ============================================================================

-- Underground Aqueduct Combat
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('aqueduct_fight_out', 'aqueduct_fight', 'default', 'Four giant rats emerge from the dark tunnels, squealing angrily!', 'underground_aqueduct', NULL, NULL, NULL, TRUE, 'giant_rat', 4);

-- After aqueduct combat
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('aqueduct_cleared_out', 'aqueduct_fight', 'success', 'Victory! Among skeletal remains you find 25 gold and a silver ring.', 'underground_aqueduct_cleared', '{"gold": 25, "xp": 60, "items": ["silver_ring"]}', NULL, '{"aqueduct_cleared": true}', FALSE, NULL, 0);

-- Aqueduct Tunnels
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('aqueduct_north_out', 'aqueduct_north', 'default', 'You climb back up through the well into the courtyard. You can proceed to the Great Hall from here.', 'great_hall', NULL, NULL, NULL, FALSE, NULL, 0),
('aqueduct_east_out', 'aqueduct_east', 'default', 'The brass key unlocks the grate! Beyond lies a secret treasury.', 'secret_treasury', NULL, NULL, NULL, FALSE, NULL, 0),
('aqueduct_south_success', 'aqueduct_south', 'success', 'You clear the rubble with raw strength! The tunnel opens to the prison cells.', 'prison_cells', NULL, NULL, '{"cleared_south_tunnel": true}', FALSE, NULL, 0),
('aqueduct_south_fail', 'aqueduct_south', 'failure', 'The rocks are too heavy. You''d need tools or more strength. You can still return north to the courtyard.', 'underground_aqueduct_cleared', NULL, NULL, NULL, FALSE, NULL, 0);

-- Prison Cells
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('prison_cell4_success', 'prison_cell4', 'success', 'You break the lock! Inside, a skeleton lies shackled. Under the straw you find 35 gold and a journal about the dragon''s lair!', 'prison_cells', '{"gold": 35, "items": ["prisoner_journal"]}', NULL, '{"cell4_opened": true, "knows_dragon_location": true}', FALSE, NULL, 0),
('prison_cell4_fail', 'prison_cell4', 'failure', 'The lock won''t budge. You need the key or more strength.', 'prison_cells', NULL, NULL, NULL, FALSE, NULL, 0),
('prison_cell5_out', 'prison_cell5', 'default', 'You squeeze through the collapsed section. Inside, two rat-folk are guarding their stash!', 'prison_cells', NULL, NULL, NULL, TRUE, 'rat_folk', 2),
('prison_cell5_win', 'prison_cell5', 'success', 'The rat-folk are defeated! Their stash contains 20 gold and a dagger.', 'prison_cells', '{"gold": 20, "xp": 56, "items": ["dagger"]}', NULL, '{"cell5_cleared": true}', FALSE, NULL, 0),
('prison_guard_out', 'prison_guard_room', 'default', 'You search the guard room desk. The prisoner log mentions a hidden treasury in the aqueduct''s east passage!', 'prison_cells', '{"items": ["rusty_mace"]}', NULL, '{"read_guard_log": true, "knows_treasury_location": true}', FALSE, NULL, 0),
('prison_exit_out', 'prison_exit', 'default', 'You exit to the armory hallway.', 'armory_hallway', NULL, NULL, NULL, FALSE, NULL, 0);

-- Armory Hallway Trap
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('armory_hall_spot_success', 'armory_hall_spot_trap', 'success', 'You spot and disarm the tripwire! You even collect 10 arrows from the trap mechanism.', 'armory_hallway', '{"items": ["arrows_10"]}', NULL, '{"armory_trap_disarmed": true}', FALSE, NULL, 0),
('armory_hall_spot_fail', 'armory_hall_spot_trap', 'failure', 'You trigger the arrow trap! An arrow strikes you for 12 damage.', 'armory_hallway', NULL, '{"damage": 12}', '{"armory_trap_triggered": true}', FALSE, NULL, 0),
('armory_hall_walk_out', 'armory_hall_walk', 'default', 'You walk forward... THUNK! An arrow strikes you for 12 damage!', 'armory_hallway', NULL, '{"damage": 12}', '{"armory_trap_triggered": true}', FALSE, NULL, 0),
('armory_hall_proceed_out', 'armory_hall_to_armory', 'default', 'You proceed to the armory doors.', 'the_armory', NULL, NULL, NULL, FALSE, NULL, 0);

-- The Armory Combat
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('armory_fight_out', 'armory_fight', 'default', 'A skeleton guard stands watch over the arsenal! It attacks to protect its post!', 'the_armory', NULL, NULL, NULL, TRUE, 'skeleton_guard', 1);

-- After armory combat
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('armory_cleared_out', 'armory_fight', 'success', 'The guard falls! It wore a silver amulet worth 25 gold. The armory is yours.', 'the_armory_cleared', '{"gold": 25, "xp": 40, "items": ["silver_amulet"]}', NULL, '{"armory_cleared": true}', FALSE, NULL, 0);

-- Armory Loot
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('armory_racks_success', 'armory_break_racks', 'success', 'You break open the racks! Battle axe (+3 damage), shield (+3 defense), and chain mail (+4 defense, -1 dexterity) are yours!', 'the_armory_cleared', '{"items": ["battle_axe", "iron_shield", "chain_mail"]}', NULL, '{"racks_broken": true}', FALSE, NULL, 0),
('armory_racks_fail', 'armory_break_racks', 'failure', 'The racks are too sturdy. You can only take the smaller weapons.', 'the_armory_cleared', '{"items": ["dagger", "short_sword"]}', NULL, NULL, FALSE, NULL, 0),
('armory_box_success', 'armory_locked_box', 'success', 'The box opens! Inside is 30 gold.', 'the_armory_cleared', '{"gold": 30}', NULL, '{"box_opened": true}', FALSE, NULL, 0),
('armory_box_fail', 'armory_locked_box', 'failure', 'The box resists your efforts. It won''t open.', 'the_armory_cleared', NULL, NULL, NULL, FALSE, NULL, 0),
('armory_door_out', 'armory_door', 'default', 'You exit through the back door into the Great Hall.', 'great_hall', NULL, NULL, NULL, FALSE, NULL, 0);

-- The Chapel
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('chapel_altar_success', 'chapel_altar', 'success', 'The altar is actually a trap door! It leads down to the secret treasury.', 'secret_treasury', NULL, NULL, '{"found_altar_trapdoor": true}', FALSE, NULL, 0),
('chapel_altar_fail', 'chapel_altar', 'failure', 'The altar looks damaged but otherwise normal.', 'the_chapel', NULL, NULL, NULL, FALSE, NULL, 0),
('chapel_offerings_out', 'chapel_offerings', 'default', 'You collect 40 gold from the offering bowl.', 'the_chapel', '{"gold": 40}', NULL, '{"took_offerings": true}', FALSE, NULL, 0),
('chapel_glass_out', 'chapel_stained_glass', 'default', 'The intact stained glass shows a map of the fortress! Very helpful.', 'the_chapel', NULL, NULL, '{"viewed_chapel_map": true}', FALSE, NULL, 0),
('chapel_prayer_success', 'chapel_prayer', 'success', 'You feel empowered by an ancient blessing! +5 maximum HP for the rest of this level!', 'the_chapel', NULL, NULL, '{"blessed": true}', FALSE, NULL, 0),
('chapel_prayer_fail', 'chapel_prayer', 'failure', 'The prayer books are too damaged to read.', 'the_chapel', NULL, NULL, NULL, FALSE, NULL, 0),
('chapel_hall_out', 'chapel_to_hall', 'default', 'You exit the chapel to the Great Hall.', 'great_hall', NULL, NULL, NULL, FALSE, NULL, 0);

-- Secret Treasury
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('treasury_ward_success', 'treasury_detect_ward', 'success', 'You detect and disarm the magical ward! The treasury is now safe to enter.', 'secret_treasury', NULL, NULL, '{"ward_disarmed": true}', FALSE, NULL, 0),
('treasury_ward_fail', 'treasury_detect_ward', 'failure', 'Lightning shoots from the ward, striking you for 20 damage!', 'secret_treasury', NULL, '{"damage": 20}', '{"ward_triggered": true}', FALSE, NULL, 0),
('treasury_enter_out', 'treasury_enter', 'default', 'You enter the vault! 100 gold, a magic ring (+1 to all checks), enchanted dagger (+3 damage), and a Scroll of Revealing!', 'secret_treasury', '{"gold": 100, "items": ["magic_ring", "enchanted_dagger", "scroll_revealing"]}', NULL, '{"looted_treasury": true}', FALSE, NULL, 0),
('treasury_leave_out', 'treasury_leave', 'default', 'You take the one-way passage to the Great Hall.', 'great_hall', NULL, NULL, NULL, FALSE, NULL, 0);

-- Dragon Treasury
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('dragon_negotiate_success', 'dragon_negotiate', 'success', 'The dragon is impressed by your boldness! It allows you to take 50 gold and one item, avoiding combat.', 'dragon_treasury_cleared', '{"gold": 50, "items": ["dragon_scale"]}', NULL, '{"negotiated_with_dragon": true}', FALSE, NULL, 0),
('dragon_negotiate_fail', 'dragon_negotiate', 'failure', 'The dragon roars in anger at your insolence! It attacks!', 'dragon_treasury', NULL, NULL, NULL, TRUE, 'young_dragon', 1),
('dragon_fight_out', 'dragon_fight', 'default', 'The young dragon roars a challenge! This will be a tough battle!', 'dragon_treasury', NULL, NULL, NULL, TRUE, 'young_dragon', 1);

-- After dragon combat
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('dragon_defeated_out', 'dragon_fight', 'success', 'The dragon falls! Its hoard is yours: 150 gold, dragon scale armor (+5 defense, fire resistance), magic sword (+4 damage), and a ruby worth 75 gold!', 'dragon_treasury_cleared', '{"gold": 225, "xp": 250, "items": ["dragon_scale_armor", "magic_sword_plus4", "ruby_gem"]}', NULL, '{"dragon_defeated": true}', FALSE, NULL, 0);

-- Dragon Hoard
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('dragon_loot_out', 'dragon_loot', 'default', 'You take your time collecting the dragon''s treasure.', 'dragon_treasury_cleared', NULL, NULL, '{"fully_looted_dragon": true}', FALSE, NULL, 0),
('dragon_return_out', 'dragon_return', 'default', 'You return to the Great Hall.', 'great_hall', NULL, NULL, NULL, FALSE, NULL, 0);

-- ============================================================================
-- GREAT HALL & FINALE
-- ============================================================================

-- Great Hall Combat
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('hall_fight_out', 'hall_fight', 'default', 'Three goblins and a tamed wolf attack as you enter! This is a coordinated assault!', 'great_hall', NULL, NULL, NULL, TRUE, 'goblin', 3);

-- After hall combat (includes wolf)
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('hall_cleared_out', 'hall_fight', 'success', 'Victory! You collect 35 gold total and a wolf collar. The Great Hall is now safe.', 'great_hall_cleared', '{"gold": 35, "xp": 120, "items": ["wolf_collar"]}', NULL, '{"great_hall_cleared": true}', FALSE, NULL, 0);

-- Great Hall Exploration
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('hall_balcony_success', 'hall_climb_balcony', 'success', 'You reach the balcony! A skeleton archer''s perch with 20 arrows and 15 gold.', 'great_hall_cleared', '{"gold": 15, "items": ["arrows_20"]}', NULL, '{"reached_balcony": true}', FALSE, NULL, 0),
('hall_balcony_fail', 'hall_climb_balcony', 'failure', 'You lose your grip and fall, taking 8 damage.', 'great_hall_cleared', NULL, '{"damage": 8}', NULL, FALSE, NULL, 0),
('hall_kitchen_out', 'hall_to_kitchen', 'default', 'You enter the old kitchens through the western door.', 'kitchen', NULL, NULL, NULL, FALSE, NULL, 0),
('hall_crimson_success', 'hall_crimson_door', 'success', 'With the Silver Key (or brute force), you open the Crimson Door! A dragon''s lair awaits!', 'dragon_treasury', NULL, NULL, '{"opened_crimson_door": true}', FALSE, NULL, 0),
('hall_crimson_fail', 'hall_crimson_door', 'failure', 'The door won''t budge. You need the Silver Key or incredible strength.', 'great_hall_cleared', NULL, '{"damage": 5}', NULL, FALSE, NULL, 0),
('hall_exit_out', 'hall_main_exit', 'default', 'You pass through the ornate double doors to the Antechamber.', 'antechamber', NULL, NULL, NULL, FALSE, NULL, 0);

-- Kitchen
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('kitchen_hearth_success', 'kitchen_hearth', 'success', 'You find the hidden lever in the hearth! A secret passage opens - an emergency escape tunnel to the outside!', 'kitchen', NULL, NULL, '{"found_escape_tunnel": true}', FALSE, NULL, 0),
('kitchen_hearth_fail', 'kitchen_hearth', 'failure', 'The hearth looks like a normal fireplace.', 'kitchen', NULL, NULL, NULL, FALSE, NULL, 0),
('kitchen_pantry_out', 'kitchen_pantry', 'default', 'You find preserved food (heals 15 HP) but also disturb 3 giant rats! They attack!', 'kitchen', '{"items": ["preserved_food"]}', NULL, NULL, TRUE, 'giant_rat', 3),
('kitchen_pantry_win', 'kitchen_pantry', 'success', 'Rats defeated! Their collection of shiny things yields 25 gold and a silver spoon.', 'kitchen', '{"gold": 25, "xp": 45, "items": ["silver_spoon"]}', NULL, '{"pantry_cleared": true}', FALSE, NULL, 0),
('kitchen_back_out', 'kitchen_back', 'default', 'You return to the Great Hall.', 'great_hall_cleared', NULL, NULL, NULL, FALSE, NULL, 0);

-- Antechamber
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('ante_heal_out', 'ante_heal', 'default', 'The magical fountain restores you to full HP and mana! You feel completely refreshed.', 'antechamber', '{"heal": "full", "restore_mana": "full"}', NULL, '{"used_fountain": true}', FALSE, NULL, 0),
('ante_camp_out', 'ante_camp', 'default', 'You find a journal detailing the Gelatinous Cube: "Fire is its weakness. It absorbed my companion." Also: torch oil (3 uses), rope, and 10 gold.', 'antechamber', '{"gold": 10, "items": ["torch_oil_3", "rope"]}', NULL, '{"read_adventurer_journal": true, "knows_cube_weakness": true}', FALSE, NULL, 0),
('ante_organize_out', 'ante_organize', 'default', 'You take time to organize your equipment and prepare mentally for the final battle.', 'antechamber', NULL, NULL, '{"organized_gear": true}', FALSE, NULL, 0),
('ante_boss_out', 'ante_to_boss', 'default', 'You step through the Grand Archway. Before you looms the massive Gelatinous Cube, filling the ceremonial hall. This is it!', 'boss_arena', NULL, NULL, NULL, FALSE, NULL, 0),
('ante_return_out', 'ante_return', 'default', 'You return to the Great Hall to explore more.', 'great_hall_cleared', NULL, NULL, NULL, FALSE, NULL, 0),
('ante_escape_out', 'ante_escape', 'default', 'You take the coward''s way out through the emergency escape. You''ve fled the dungeon... but you''ll carry the shame. (Coward debuff for Level 2)', 'level1_start', NULL, NULL, '{"fled_level1": true, "coward_debuff": true}', FALSE, NULL, 0);

-- Boss Arena
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('boss_fight_out', 'boss_fight', 'default', 'The Gelatinous Cube pulses toward you! The final battle begins!', 'boss_arena', NULL, NULL, NULL, TRUE, 'gelatinous_cube_boss', 1);

-- After boss victory
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('boss_victory_out', 'boss_fight', 'success', 'The cube dissolves! You''ve conquered Level 1! Within its remains: 75 gold, magic dagger (+2 damage, +1 DEX), adventurer''s sword (+3 damage), 2 healing potions, and a glowing crystal (quest item for Level 2)!', 'level1_complete', '{"gold": 75, "xp": 200, "items": ["magic_dagger_plus2", "adventurer_sword", "healing_potion", "healing_potion", "glowing_crystal"]}', NULL, '{"boss_defeated": true, "level1_complete": true}', FALSE, NULL, 0);

-- Level Complete
INSERT OR REPLACE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, sets_flags, triggers_combat, enemy_id, enemy_count) VALUES
('complete_descend_out', 'complete_descend', 'default', 'Congratulations! You have conquered Level 1 of the dungeon. Level 2 content is coming soon! For now, you can explore the fortress or start a new character.', 'level1_complete', NULL, NULL, '{"proceeding_to_level2": true, "level1_victory": true}', FALSE, NULL, 0),
('complete_rest_out', 'complete_rest', 'default', 'You rest among your hard-won victory, healing fully before the next challenge.', 'level1_complete', '{"heal": "full", "restore_mana": "full"}', NULL, '{"rested_after_boss": true}', FALSE, NULL, 0);
