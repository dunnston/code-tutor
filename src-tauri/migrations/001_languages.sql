-- Core Languages Table
-- This table must exist before other tables that reference it

CREATE TABLE IF NOT EXISTS languages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    file_extension TEXT
);

-- Insert supported languages
INSERT OR IGNORE INTO languages (id, name, description, icon, file_extension) VALUES
('python', 'Python', 'A versatile, beginner-friendly language perfect for learning programming fundamentals', '🐍', 'py'),
('javascript', 'JavaScript', 'The language of the web, essential for front-end and full-stack development', '🌐', 'js'),
('csharp', 'C#', 'A powerful, modern language for game development with Unity and Godot', '🔷', 'cs'),
('ruby', 'Ruby', 'An elegant, expressive language known for developer happiness', '💎', 'rb'),
('gdscript', 'GDScript', 'Godot''s built-in scripting language, similar to Python', '🎮', 'gd');
