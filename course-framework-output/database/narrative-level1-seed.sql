-- ============================================================================
-- NARRATIVE DUNGEON - LEVEL 1: THE ABANDONED FORTRESS
-- ============================================================================
-- Starting location and three main branching paths with skill checks

-- ============================================================================
-- LOCATIONS
-- ============================================================================

-- Starting location
INSERT OR IGNORE INTO narrative_locations (id, floor_number, name, description, location_type, is_repeatable, icon) VALUES
('level1_start', 1, 'The Crumbling Gate',
 'You stand before the moss-covered entrance of an ancient fortress. The air smells of decay and old stone. Torch light flickers from within, casting dancing shadows. Three paths lie ahead.',
 'start', FALSE, '🏰');

-- Path A locations
INSERT OR IGNORE INTO narrative_locations (id, floor_number, name, description, location_type, is_repeatable, icon) VALUES
('level1_courtyard', 1, 'The Main Courtyard',
 'A wide-open courtyard with scattered debris, broken weapon racks, and a dried fountain in the center. The area is eerily quiet.',
 'choice_point', FALSE, '🏛️'),
('level1_ancient_well', 1, 'The Ancient Well',
 'You approach an old stone well in the courtyard. The rope looks worn but might still hold.',
 'skill_check', FALSE, '🪣');

-- Path B locations
INSERT OR IGNORE INTO narrative_locations (id, floor_number, name, description, location_type, is_repeatable, icon) VALUES
('level1_dark_corridor', 1, 'Dark Corridor',
 'A narrow hallway with flickering torches and scorch marks on the walls. You notice a suspicious pressure plate on the floor ahead.',
 'skill_check', FALSE, '🕯️'),
('level1_corridor_fork', 1, 'The Fork',
 'The corridor splits into three directions. Each path disappears into shadow.',
 'choice_point', FALSE, '🔱');

-- Path C locations
INSERT OR IGNORE INTO narrative_locations (id, floor_number, name, description, location_type, is_repeatable, icon) VALUES
('level1_garden', 1, 'Overgrown Garden',
 'Wild vegetation has overtaken this area. Moonlight streams through breaks in the ceiling. You hear the sound of animals growling nearby.',
 'choice_point', FALSE, '🌿'),
('level1_wolf_encounter', 1, 'The Wolves',
 'Two wolves are feeding on remains in the garden. They haven''t noticed you yet.',
 'skill_check', FALSE, '🐺');

-- ============================================================================
-- STARTING CHOICES (Three main paths)
-- ============================================================================

-- Choice 1: Take the left archway (Path A - Courtyard)
INSERT OR IGNORE INTO narrative_choices (id, location_id, choice_text, requires_skill_check, display_order, icon) VALUES
('start_to_courtyard', 'level1_start', 'Take the left archway into the main courtyard', FALSE, 1, '⬅️');

-- Choice 2: Take the center passage (Path B - Corridor)
INSERT OR IGNORE INTO narrative_choices (id, location_id, choice_text, requires_skill_check, display_order, icon) VALUES
('start_to_corridor', 'level1_start', 'Enter the center passage', FALSE, 2, '⬆️');

-- Choice 3: Take the right archway (Path C - Garden)
INSERT OR IGNORE INTO narrative_choices (id, location_id, choice_text, requires_skill_check, display_order, icon) VALUES
('start_to_garden', 'level1_start', 'Take the right archway through the overgrown garden', FALSE, 3, '➡️');

-- ============================================================================
-- STARTING OUTCOMES (Simple navigation)
-- ============================================================================

INSERT OR IGNORE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, triggers_combat) VALUES
('outcome_start_courtyard', 'start_to_courtyard', 'default',
 'You step through the left archway. The courtyard opens before you, debris crunching under your feet.',
 'level1_courtyard', FALSE),

('outcome_start_corridor', 'start_to_corridor', 'default',
 'You enter the dark corridor. The torches cast dancing shadows on the stone walls.',
 'level1_dark_corridor', FALSE),

('outcome_start_garden', 'start_to_garden', 'default',
 'You step into the overgrown garden. The air is heavy with the scent of wild plants and decay.',
 'level1_garden', FALSE);

-- ============================================================================
-- PATH A: COURTYARD - Investigate the Well (Intelligence Check)
-- ============================================================================

-- Courtyard choices
INSERT OR IGNORE INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('courtyard_inspect_well', 'level1_courtyard', 'Inspect the ancient well', TRUE, 'intelligence', 12, 'basic_attack', 1, '🪣'),
('courtyard_explore_more', 'level1_courtyard', 'Look for another path', FALSE, NULL, NULL, NULL, 2, '🔍');

-- Well inspection outcomes
INSERT OR IGNORE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, triggers_combat) VALUES
('outcome_well_success', 'courtyard_inspect_well', 'success',
 'Your keen eye notices the rope is surprisingly sturdy despite its age. It leads deep underground, and you can hear running water below. This could be a way into the fortress depths!',
 'level1_ancient_well', '{"xp": 25}', FALSE),

('outcome_well_failure', 'courtyard_inspect_well', 'failure',
 'The well looks too dangerous. You can''t tell if the rope would hold your weight, and the darkness below is impenetrable.',
 'level1_courtyard', NULL, FALSE),

('outcome_well_critical_success', 'courtyard_inspect_well', 'critical_success',
 'Not only is the rope sturdy, but you notice ancient markings on the well''s edge - this was once used as a secret entrance! You also spot a glint of gold in the shadows.',
 'level1_ancient_well', '{"gold": 15, "xp": 50}', FALSE);

-- Explore more (simple choice to demonstrate alternate path)
INSERT OR IGNORE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, triggers_combat) VALUES
('outcome_courtyard_explore', 'courtyard_explore_more', 'default',
 'You spot a guard tower entrance across the courtyard and what looks like old barracks.',
 'level1_courtyard', FALSE);

-- ============================================================================
-- PATH B: DARK CORRIDOR - Trap Encounter (Multiple Skill Checks)
-- ============================================================================

-- Corridor trap choices
INSERT OR IGNORE INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('corridor_disarm_trap', 'level1_dark_corridor', 'Attempt to carefully disarm the pressure plate', TRUE, 'intelligence', 14, 'spell', 1, '🔧'),
('corridor_jump_trap', 'level1_dark_corridor', 'Try to jump over the trap', TRUE, 'dexterity', 13, 'basic_attack', 2, '🤸'),
('corridor_trigger_and_run', 'level1_dark_corridor', 'Trigger it intentionally and try to run past', TRUE, 'dexterity', 11, 'basic_attack', 3, '🏃');

-- Disarm trap outcomes
INSERT OR IGNORE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, triggers_combat) VALUES
('outcome_disarm_success', 'corridor_disarm_trap', 'success',
 'With steady hands, you carefully disable the mechanism. The trap is now harmless, and you proceed safely.',
 'level1_corridor_fork', '{"xp": 50}', FALSE),

('outcome_disarm_failure', 'corridor_disarm_trap', 'failure',
 'Your hand slips! Rocks crash down from above!',
 'level1_corridor_fork', NULL, FALSE),

('outcome_disarm_failure_penalty', 'corridor_disarm_trap', 'failure',
 NULL,
 NULL, NULL, FALSE);

-- Update failure outcome to include damage
UPDATE narrative_outcomes SET penalties = '{"damage": 15}' WHERE id = 'outcome_disarm_failure';

-- Jump trap outcomes
INSERT OR IGNORE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, triggers_combat) VALUES
('outcome_jump_success', 'corridor_jump_trap', 'success',
 'You leap gracefully over the pressure plate, landing softly on the other side!',
 'level1_corridor_fork', '{"xp": 30}', NULL, FALSE),

('outcome_jump_failure', 'corridor_jump_trap', 'failure',
 'You don''t quite make it! Your foot catches the edge, triggering the trap. Rocks rain down!',
 'level1_corridor_fork', NULL, '{"damage": 15}', FALSE);

-- Trigger and run outcomes
INSERT OR IGNORE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, penalties, triggers_combat) VALUES
('outcome_run_success', 'corridor_trigger_and_run', 'success',
 'You trigger the trap and sprint forward! The rocks crash behind you as you dive to safety!',
 'level1_corridor_fork', '{"xp": 20}', NULL, FALSE),

('outcome_run_failure', 'corridor_trigger_and_run', 'failure',
 'You''re not quite fast enough! Some of the falling rocks clip you as you run.',
 'level1_corridor_fork', NULL, '{"damage": 10}', FALSE),

('outcome_run_critical', 'corridor_trigger_and_run', 'critical_success',
 'You dash forward with incredible speed! Not only do you avoid the rocks entirely, but you spot a hidden alcove with treasure!',
 'level1_corridor_fork', '{"gold": 20, "xp": 40}', NULL, FALSE);

-- ============================================================================
-- PATH C: GARDEN - Wolf Encounter (Charisma Check)
-- ============================================================================

-- Garden choices
INSERT OR IGNORE INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('garden_approach_wolves', 'level1_garden', 'Investigate the growling sounds', FALSE, NULL, NULL, NULL, 1, '🐺'),
('garden_avoid_wolves', 'level1_garden', 'Quietly move away and explore elsewhere', FALSE, NULL, NULL, NULL, 2, '🤫');

-- Approach wolves - leads to detailed encounter
INSERT OR IGNORE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, triggers_combat) VALUES
('outcome_approach_wolves', 'garden_approach_wolves', 'default',
 'You move closer to the sounds. Two wolves turn to face you, their eyes gleaming in the moonlight. They growl warily.',
 'level1_wolf_encounter', FALSE);

-- Wolf encounter choices
INSERT OR IGNORE INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('wolf_calm', 'level1_wolf_encounter', 'Speak softly and try to calm them', TRUE, 'charisma', 14, 'heal', 1, '🤝'),
('wolf_attack', 'level1_wolf_encounter', 'Attack them preemptively', FALSE, NULL, NULL, NULL, 2, '⚔️'),
('wolf_sneak', 'level1_wolf_encounter', 'Try to sneak past while they''re distracted', TRUE, 'dexterity', 13, 'basic_attack', 3, '🥷');

-- Calm wolves outcomes
INSERT OR IGNORE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, triggers_combat) VALUES
('outcome_wolf_calm_success', 'wolf_calm', 'success',
 'Your soothing words and calm demeanor work! The wolves relax, accepting your presence. They even leave behind some of their findings: fresh meat and scattered coins.',
 'level1_garden', '{"gold": 20, "xp": 75}', FALSE),

('outcome_wolf_calm_failure', 'wolf_calm', 'failure',
 'The wolves don''t respond well to your approach. They bare their teeth and prepare to attack!',
 NULL, NULL, TRUE),

('outcome_wolf_calm_critical', 'wolf_calm', 'critical_success',
 'The wolves not only accept you, but one nuzzles your hand affectionately! They lead you to a hidden cache with treasure before leaving peacefully.',
 'level1_garden', '{"gold": 35, "xp": 100}', FALSE);

-- Add enemy references for combat outcomes
UPDATE narrative_outcomes SET enemy_id = 'wolf', enemy_count = 2 WHERE id = 'outcome_wolf_calm_failure';

-- Attack wolves outcome (always triggers combat for easy testing)
INSERT OR IGNORE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, triggers_combat, enemy_id, enemy_count) VALUES
('outcome_wolf_attack', 'wolf_attack', 'default',
 'You draw your weapon and charge! Two wild wolves emerge from the shadows, ready for battle!',
 'level1_garden', TRUE, 'wolf', 2);

-- Sneak past outcomes
INSERT OR IGNORE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, triggers_combat, enemy_id, enemy_count) VALUES
('outcome_wolf_sneak_success', 'wolf_sneak', 'success',
 'Moving like a shadow, you slip past the distracted wolves completely unnoticed.',
 'level1_garden', '{"xp": 50}', FALSE, NULL, 1),

('outcome_wolf_sneak_failure', 'wolf_sneak', 'failure',
 'A twig snaps under your foot! The wolves whip around and spot you immediately!',
 'level1_garden', NULL, TRUE, 'wolf', 2);

-- Avoid wolves (go around)
INSERT OR IGNORE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, triggers_combat) VALUES
('outcome_avoid_wolves', 'garden_avoid_wolves', 'default',
 'You wisely decide to give the wolves a wide berth and explore another section of the garden.',
 'level1_garden', FALSE);

-- ============================================================================
-- CORRIDOR FORK CHOICES (from Path B)
-- ============================================================================

INSERT OR IGNORE INTO narrative_choices (id, location_id, choice_text, requires_skill_check, display_order, icon) VALUES
('fork_left', 'level1_corridor_fork', 'Take the left passage toward storage chambers', FALSE, 1, '⬅️'),
('fork_right', 'level1_corridor_fork', 'Take the right passage toward the throne room', FALSE, 2, '➡️'),
('fork_straight', 'level1_corridor_fork', 'Continue straight ahead', FALSE, 3, '⬆️');

-- Placeholder outcomes for fork (can be expanded)
INSERT OR IGNORE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, triggers_combat) VALUES
('outcome_fork_left', 'fork_left', 'default',
 'You head down the left passage. The air grows colder, and you see old storage rooms ahead.',
 'level1_corridor_fork', FALSE),

('outcome_fork_right', 'fork_right', 'default',
 'The right passage leads you toward what appears to be a more ornate section of the fortress. You can see the remains of tapestries on the walls.',
 'level1_corridor_fork', FALSE),

('outcome_fork_straight', 'fork_straight', 'default',
 'You continue straight and soon find yourself approaching a set of dusty double doors.',
 'level1_corridor_fork', FALSE);

-- ============================================================================
-- WELL CHOICES (from successful Intelligence check in courtyard)
-- ============================================================================

INSERT OR IGNORE INTO narrative_choices (id, location_id, choice_text, requires_skill_check, skill_type, skill_dc, challenge_action_type, display_order, icon) VALUES
('well_descend', 'level1_ancient_well', 'Descend into the depths', TRUE, 'strength', 12, 'basic_attack', 1, '⬇️'),
('well_return', 'level1_ancient_well', 'Return to the courtyard', FALSE, NULL, NULL, NULL, 2, '🔙');

-- Descend outcomes
INSERT OR IGNORE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, rewards, triggers_combat) VALUES
('outcome_well_descend_success', 'well_descend', 'success',
 'You carefully climb down the rope. Your arms burn, but you make it safely to the aqueduct below. Water drips echoing in the darkness.',
 'level1_courtyard', '{"xp": 50}', FALSE),

('outcome_well_descend_failure', 'well_descend', 'failure',
 'Halfway down, your grip slips! You tumble the rest of the way, landing hard in shallow water.',
 'level1_courtyard', NULL, FALSE);

-- Add damage to descent failure
UPDATE narrative_outcomes SET penalties = '{"damage": 12}' WHERE id = 'outcome_well_descend_failure';

-- Return to courtyard
INSERT OR IGNORE INTO narrative_outcomes (id, choice_id, outcome_type, description, next_location_id, triggers_combat) VALUES
('outcome_well_return', 'well_return', 'default',
 'You step back from the well and return to the main courtyard.',
 'level1_courtyard', FALSE);
