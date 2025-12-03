-- Custom Enemies and Bosses

CREATE TABLE IF NOT EXISTS custom_enemies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    enemy_type TEXT NOT NULL CHECK(enemy_type IN ('regular', 'boss', 'elite')),
    level INTEGER NOT NULL DEFAULT 1,

    -- Stats
    base_health INTEGER NOT NULL,
    base_attack INTEGER NOT NULL,
    base_defense INTEGER NOT NULL,

    -- Visual
    image_path TEXT,
    attack_animation TEXT, -- JSON with animation data

    -- Behavior
    attacks TEXT NOT NULL, -- JSON array of attack objects

    -- Metadata
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_custom_enemies_type ON custom_enemies(enemy_type);
CREATE INDEX IF NOT EXISTS idx_custom_enemies_level ON custom_enemies(level);

-- Insert some default enemies
INSERT OR IGNORE INTO custom_enemies (id, name, description, enemy_type, level, base_health, base_attack, base_defense, image_path, attack_animation, attacks) VALUES
('goblin-warrior', 'Goblin Warrior', 'A small but fierce goblin armed with a rusty blade', 'regular', 1, 30, 8, 3, '/enemies/goblin.png',
 '{"type":"gif","path":"/animations/goblin-slash.gif","loop":false}',
 '[{"name":"Slash","damage":8,"description":"A quick slash with a rusty blade"}]'),

('giant-rat', 'Giant Rat', 'A disease-ridden oversized rodent', 'regular', 1, 20, 6, 2, '/enemies/rat.png',
 '{"type":"gif","path":"/animations/rat-bite.gif","loop":false}',
 '[{"name":"Bite","damage":6,"description":"A vicious bite that may cause disease"}]'),

('skeleton-archer', 'Skeleton Archer', 'An undead archer with deadly aim', 'regular', 2, 25, 10, 2, '/enemies/skeleton.png',
 '{"type":"gif","path":"/animations/arrow-shot.gif","loop":false}',
 '[{"name":"Arrow Shot","damage":10,"description":"Fires a bone arrow"},{"name":"Volley","damage":7,"description":"Fires multiple arrows at reduced damage"}]'),

('dire-wolf', 'Dire Wolf', 'A massive wolf with glowing red eyes', 'regular', 2, 40, 12, 4, '/enemies/wolf.png',
 '{"type":"gif","path":"/animations/wolf-bite.gif","loop":false}',
 '[{"name":"Bite","damage":12,"description":"A powerful bite attack"},{"name":"Howl","damage":0,"description":"Summons another wolf (if available)"}]'),

('gelatinous-cube', 'Gelatinous Cube', 'A massive transparent ooze that dissolves everything', 'boss', 3, 250, 20, 8, '/enemies/cube.png',
 '{"type":"gif","path":"/animations/acid-attack.gif","loop":false}',
 '[{"name":"Acid Touch","damage":20,"description":"Acidic tentacle attack"},{"name":"Engulf","damage":30,"description":"Attempts to engulf the player, dealing massive damage"},{"name":"Dissolve Armor","damage":10,"description":"Reduces player defense temporarily"}]'),

('orc-chieftain', 'Orc Chieftain', 'A massive orc wielding a brutal war axe', 'boss', 5, 400, 35, 12, '/enemies/orc_boss.png',
 '{"type":"gif","path":"/animations/axe-swing.gif","loop":false}',
 '[{"name":"Cleave","damage":35,"description":"A devastating axe swing"},{"name":"War Cry","damage":0,"description":"Increases attack power"},{"name":"Earthquake Slam","damage":50,"description":"Slams the ground, dealing area damage"}]');
