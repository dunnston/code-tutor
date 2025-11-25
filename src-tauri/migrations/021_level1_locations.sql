-- Migration 021: Level 1 Narrative Locations
-- All locations/rooms in The Abandoned Fortress (Level 1)

-- ============================================================================
-- STARTING POINT
-- ============================================================================

INSERT INTO narrative_locations (id, floor_number, name, description, location_type, is_repeatable, icon) VALUES
('level1_start', 1, 'The Crumbling Gate',
'You stand before the moss-covered entrance of an ancient fortress. The air smells of decay and old stone. Torch light flickers from within, casting dancing shadows. Three paths lie ahead.',
'start', FALSE, '🏰');

-- ============================================================================
-- PATH A: MAIN COURTYARD
-- ============================================================================

INSERT INTO narrative_locations (id, floor_number, name, description, location_type, is_repeatable, icon) VALUES
('path_a_courtyard', 1, 'The Courtyard',
'A wide-open courtyard with scattered debris, broken weapon racks, and a dried fountain in the center. Giant rats scatter through the rubble.',
'combat', FALSE, '⚔️'),

('path_a_courtyard_cleared', 1, 'The Courtyard (Cleared)',
'The courtyard is now clear of enemies. Three paths of investigation present themselves: an ancient well, the guard tower, and the old barracks.',
'choice_point', FALSE, '🗺️'),

('path_a_ancient_well', 1, 'The Ancient Well',
'You approach the old well. Despite its age, the rope appears sturdy. You can hear running water far below in the darkness.',
'skill_check', TRUE, '🪣'),

('path_a_guard_tower_entrance', 1, 'Guard Tower - Entrance',
'A heavy wooden door stands slightly ajar. You can choose to enter stealthily or boldly announce your presence.',
'choice_point', FALSE, '🗼'),

('path_a_guard_tower_floor2', 1, 'Guard Tower - Guard Room',
'Two goblins are playing dice around a makeshift table. Weapons are scattered about and a ladder leads upward.',
'combat', FALSE, '🎲'),

('path_a_guard_tower_floor3', 1, 'Guard Tower - Officer''s Quarters',
'A locked door blocks your way. You can attempt to break it down or pick the lock if you have the key.',
'skill_check', FALSE, '🚪'),

('path_a_guard_tower_floor4', 1, 'Guard Tower - Tower Top',
'You climb the narrow stairs to reach the tower''s peak. A goblin archer spots you immediately!',
'combat', FALSE, '🏹'),

('path_a_tower_top_cleared', 1, 'Guard Tower - Vantage Point',
'From this height, you can see the entire fortress layout spread before you. The view reveals several points of interest.',
'choice_point', FALSE, '👁️'),

('path_a_barracks', 1, 'The Old Barracks',
'A collapsed building with one section still accessible. Two goblins are looting old armor inside.',
'combat', FALSE, '🏚️'),

('path_a_barracks_cleared', 1, 'The Old Barracks (Cleared)',
'With the goblins defeated, you can investigate the area. A heavy beam blocks a locker, and a small door leads to the armory hallway.',
'choice_point', FALSE, '🔍');

-- ============================================================================
-- PATH B: DARK CORRIDOR
-- ============================================================================

INSERT INTO narrative_locations (id, floor_number, name, description, location_type, is_repeatable, icon) VALUES
('path_b_trapped_hall', 1, 'The Trapped Hallway',
'A narrow hallway with flickering torches. Scorch marks cover the walls, and a pressure plate is clearly visible on the floor.',
'skill_check', FALSE, '⚠️'),

('path_b_the_fork', 1, 'The Fork',
'After navigating the trap, the corridor splits three ways. Each path beckons with unknown dangers and treasures.',
'choice_point', FALSE, '🔱'),

('path_b_storage_room1', 1, 'Storage Room - First Chamber',
'A dusty storage room with empty crates and shelves. The floor looks suspicious in places.',
'skill_check', TRUE, '📦'),

('path_b_storage_room2', 1, 'Storage Room - Second Chamber',
'This room contains a locked chest. The lock looks pickable, or you could just smash it open.',
'skill_check', FALSE, '🔒'),

('path_b_storage_room3', 1, 'Storage Room - Third Chamber',
'A skeleton guardian animates as you enter, drawn by ancient magic to protect this chamber!',
'combat', FALSE, '💀'),

('path_b_throne_approach', 1, 'Throne Room Approach',
'Suits of armor line the walls of this hallway. Something feels wrong about this place...',
'skill_check', FALSE, '🛡️'),

('path_b_throne_room', 1, 'The Throne Room',
'A decrepit throne room with tattered banners and broken stained glass. Enemies lurk within - 2 goblins and 2 skeletons!',
'combat', FALSE, '👑'),

('path_b_throne_room_cleared', 1, 'The Throne Room (Cleared)',
'With your enemies defeated, you can thoroughly search this once-grand chamber. The throne, banners, and ceremonial archway warrant investigation.',
'choice_point', FALSE, '🔎'),

('path_b_library', 1, 'The Library',
'A dusty library with collapsed shelves and scattered books. Knowledge and secrets may still remain here.',
'choice_point', TRUE, '📚'),

('path_b_library_secret', 1, 'The Library - Secret Passage',
'You''ve uncovered a hidden passage behind the collapsed section! It leads deeper into the fortress.',
'choice_point', FALSE, '🚪');

-- ============================================================================
-- PATH C: OVERGROWN GARDEN
-- ============================================================================

INSERT INTO narrative_locations (id, floor_number, name, description, location_type, is_repeatable, icon) VALUES
('path_c_wild_garden', 1, 'The Wild Garden',
'Wild vegetation has overtaken this area. Moonlight streams through breaks in the ceiling. Strange animal sounds echo nearby - wolves, by the sound of it.',
'choice_point', FALSE, '🌿'),

('path_c_wolf_encounter', 1, 'Wolf Den',
'Two wolves are feeding on remains in a corner of the garden. They notice your presence...',
'combat', FALSE, '🐺'),

('path_c_gardener_shed', 1, 'Gardener''s Shed',
'A small, weathered shed tucked in the corner. Inside you find an old bedroll and supplies - this could be a place to rest.',
'rest', TRUE, '🛖'),

('path_c_greenhouse_ruins', 1, 'Greenhouse Ruins',
'The collapsed greenhouse has broken glass everywhere. Strange plants still grow among the debris, and something gelatinous moves in the center.',
'combat', FALSE, '🪴'),

('path_c_greenhouse_cleared', 1, 'Greenhouse Ruins (Safe)',
'With the gelatinous cube destroyed, you can safely explore the greenhouse. Unusual plants and a locked door with a puzzle await.',
'choice_point', FALSE, '🌱'),

('path_c_alchemist_lab', 1, 'Alchemist''s Laboratory',
'A laboratory with bubbling potions still somehow working after all these years. Strange apparatus and ingredient cabinets line the walls.',
'choice_point', TRUE, '⚗️');

-- ============================================================================
-- SECONDARY & SECRET AREAS
-- ============================================================================

INSERT INTO narrative_locations (id, floor_number, name, description, location_type, is_repeatable, icon) VALUES
('underground_aqueduct', 1, 'Underground Aqueduct',
'Ancient waterways beneath the fortress. Ankle-deep water flows through the tunnels, and you can see three passages branching off.',
'combat', FALSE, '💧'),

('underground_aqueduct_cleared', 1, 'Underground Aqueduct (Safe)',
'The rats are defeated. Three tunnels branch from here: north back to the well, east to a locked grate, and south to collapsed rubble.',
'choice_point', FALSE, '🌊'),

('prison_cells', 1, 'The Prison Cells',
'A dark corridor lined with rusted cell doors. Most are empty, but some may still hold secrets... or dangers.',
'choice_point', TRUE, '⛓️'),

('armory_hallway', 1, 'Armory Hallway',
'A long hallway with weapon plaques on the walls. Most are empty, but a tripwire is barely visible on the floor.',
'skill_check', FALSE, '⚔️'),

('the_armory', 1, 'The Armory',
'A surprisingly intact weapon storage room. A skeleton guard stands watch over the arsenal.',
'combat', FALSE, '🗡️'),

('the_armory_cleared', 1, 'The Armory (Safe)',
'The guardian is defeated. Racks of weapons and a locked chest await your inspection.',
'choice_point', FALSE, '⚒️'),

('the_chapel', 1, 'The Chapel',
'A small abandoned chapel with broken pews and a shattered altar. Despite the decay, there''s a sense of peace here.',
'choice_point', TRUE, '⛪'),

('secret_treasury', 1, 'Secret Treasury',
'A hidden vault filled with ancient riches! A magical ward protects the entrance.',
'treasure', FALSE, '💰'),

('dragon_treasury', 1, 'Dragon''s Lair',
'A smaller chamber filled with piles of gold and artifacts. A young red dragon guards its hoard jealously!',
'combat', FALSE, '🐉'),

('dragon_treasury_cleared', 1, 'Dragon''s Hoard',
'The dragon has been defeated (or negotiated with). Its treasure awaits.',
'treasure', FALSE, '💎');

-- ============================================================================
-- CONVERGENCE & FINALE
-- ============================================================================

INSERT INTO narrative_locations (id, floor_number, name, description, location_type, is_repeatable, icon) VALUES
('great_hall', 1, 'The Great Hall',
'A massive hall with a balcony above and long tables overturned. This is where many paths converge. Goblins and a tamed wolf emerge to fight!',
'combat', FALSE, '🏛️'),

('great_hall_cleared', 1, 'The Great Hall (Safe)',
'The hall is clear. Multiple doors and passages lead from here: the kitchens to the west, the crimson door to the north, and the main exit to the east.',
'choice_point', FALSE, '🏰'),

('kitchen', 1, 'The Kitchens',
'An old kitchen area, mostly destroyed. The hearth looks unusual, and the pantry door stands ajar.',
'choice_point', TRUE, '🍳'),

('antechamber', 1, 'The Antechamber',
'A circular room before the final chamber. A healing fountain bubbles peacefully, and an abandoned campsite suggests others have been here recently.',
'rest', FALSE, '⛲'),

('boss_arena', 1, 'The Ceremonial Hall',
'A massive ceremonial hall. The gelatinous cube fills much of the center, slowly pulsing. Treasures and bones float within its acidic mass. The exit door waits beyond.',
'boss', FALSE, '👹'),

('level1_complete', 1, 'Fortress Conquered',
'You stand victorious over the gelatinous cube. The exit to Level 2 beckons, and you''ve claimed the fortress as your own.',
'exit', FALSE, '🎉');
