-- Multiple Choice Questions for Dungeon System

CREATE TABLE IF NOT EXISTS mcq_questions (
    id TEXT PRIMARY KEY,
    question_text TEXT NOT NULL,
    explanation TEXT, -- Explanation shown after answering

    -- Answer options (JSON array)
    options TEXT NOT NULL, -- JSON array of strings: ["Option A", "Option B", "Option C", "Option D"]
    correct_answer_index INTEGER NOT NULL, -- 0-based index of correct answer

    -- Categorization
    difficulty TEXT NOT NULL CHECK(difficulty IN ('easy', 'medium', 'hard', 'expert')),
    topic TEXT, -- e.g., "variables", "loops", "functions", "classes"
    language TEXT, -- e.g., "python", "javascript", "general", "gdscript"
    tags TEXT, -- JSON array of tags for filtering

    -- Metadata
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Indexes for quick lookups
CREATE INDEX IF NOT EXISTS idx_mcq_difficulty ON mcq_questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_mcq_topic ON mcq_questions(topic);
CREATE INDEX IF NOT EXISTS idx_mcq_language ON mcq_questions(language);

-- Insert some sample Python questions
INSERT OR IGNORE INTO mcq_questions (id, question_text, explanation, options, correct_answer_index, difficulty, topic, language, tags) VALUES
('py-var-001', 'What is the correct way to create a variable in Python?',
 'In Python, you create variables by simply assigning a value. No type declaration is needed.',
 '["x = 5", "var x = 5", "int x = 5", "let x = 5"]', 0, 'easy', 'variables', 'python', '["basics", "syntax"]'),

('py-loop-001', 'Which keyword is used to create a for loop in Python?',
 'The "for" keyword is used to create loops that iterate over sequences.',
 '["for", "foreach", "loop", "while"]', 0, 'easy', 'loops', 'python', '["control-flow", "loops"]'),

('py-func-001', 'What keyword is used to define a function in Python?',
 'The "def" keyword is used to define functions in Python.',
 '["def", "function", "func", "define"]', 0, 'easy', 'functions', 'python', '["functions", "basics"]'),

('py-list-001', 'How do you access the first element of a list called "items"?',
 'Python uses 0-based indexing, so items[0] accesses the first element.',
 '["items[0]", "items[1]", "items.first()", "first(items)"]', 0, 'easy', 'lists', 'python', '["data-structures", "lists"]'),

('py-cond-001', 'Which operator checks if two values are equal in Python?',
 'The == operator checks for equality, while = is used for assignment.',
 '["==", "=", "equals()", "is"]', 0, 'easy', 'operators', 'python', '["operators", "comparison"]'),

('py-str-001', 'How do you concatenate two strings "Hello" and "World" in Python?',
 'The + operator concatenates strings in Python. You can also use f-strings or .join().',
 '["""Hello"" + "" "" + ""World""", """Hello"".concat(""World"")", """Hello"" & ""World""", "concat(""Hello"", ""World"")"]', 0, 'easy', 'strings', 'python', '["strings", "basics"]'),

('py-bool-001', 'What is the result of: 5 > 3 and 2 < 1?',
 'The "and" operator requires both conditions to be True. Since 2 < 1 is False, the result is False.',
 '["False", "True", "None", "Error"]', 0, 'medium', 'boolean', 'python', '["logic", "operators"]'),

('py-dict-001', 'How do you create an empty dictionary in Python?',
 'Both {} and dict() create empty dictionaries, but {} is more common.',
 ["{}", "[]", "dict[]", "dictionary()"]', 0, 'medium', 'dictionaries', 'python', '["data-structures", "dictionaries"]'),

('py-range-001', 'What does range(3) produce?',
 'range(3) produces numbers from 0 up to (but not including) 3: [0, 1, 2].',
 '["[0, 1, 2]", "[1, 2, 3]", "[0, 1, 2, 3]", "[1, 2]"]', 0, 'medium', 'range', 'python', '["built-in", "sequences"]'),

('py-class-001', 'What keyword is used to create a class in Python?',
 'The "class" keyword is used to define classes in Python.',
 '["class", "Class", "object", "def"]', 0, 'medium', 'classes', 'python', '["oop", "classes"]'),

-- GDScript questions
('gd-var-001', 'What keyword is used to declare a variable in GDScript?',
 'GDScript uses "var" to declare variables, similar to JavaScript.',
 '["var", "let", "const", "auto"]', 0, 'easy', 'variables', 'gdscript', '["basics", "syntax"]'),

('gd-func-001', 'What keyword is used to define a function in GDScript?',
 'GDScript uses "func" to define functions.',
 '["func", "def", "function", "fn"]', 0, 'easy', 'functions', 'gdscript', '["functions", "basics"]'),

('gd-node-001', 'What is the root node in a Godot scene commonly called?',
 'The root node is typically accessed using "get_tree().root" or is the topmost node in the scene tree.',
 '["root", "scene", "main", "parent"]', 0, 'medium', 'nodes', 'gdscript', '["godot", "scene-tree"]'),

('gd-signal-001', 'What keyword is used to emit a signal in GDScript?',
 'The "emit_signal" function is used to emit signals in GDScript.',
 '["emit_signal", "emit", "signal", "trigger"]', 0, 'medium', 'signals', 'gdscript', '["signals", "events"]'),

-- General programming questions
('gen-algo-001', 'What is a variable?',
 'A variable is a named container that stores data values in memory.',
 '["A container that stores data", "A mathematical equation", "A type of loop", "A function parameter"]', 0, 'easy', 'concepts', 'general', '["basics", "theory"]');
