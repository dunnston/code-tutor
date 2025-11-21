-- ============================================================================
-- RPG DUNGEON - MULTIPLE CHOICE CHALLENGES
-- ============================================================================
-- Programming knowledge questions themed for combat

-- ============================================================================
-- BASIC ATTACK CHALLENGES (Easy programming fundamentals)
-- ============================================================================

INSERT OR IGNORE INTO dungeon_challenges (id, difficulty, action_type, title, description, choices, correct_answer, min_floor, max_floor) VALUES
('attack_vars_1', 'easy', 'basic_attack', 'Variable Attack', 'Your attack needs a power boost! Which keyword declares a variable in Python?',
'["A) var", "B) let", "C) def", "D) No keyword needed"]', 'D', 1, 3),

('attack_types_1', 'easy', 'basic_attack', 'Data Type Strike', 'Your sword deals different damage types! Which is NOT a Python data type?',
'["A) int", "B) str", "C) bool", "D) char"]', 'D', 1, 3),

('attack_ops_1', 'easy', 'basic_attack', 'Operator Slash', 'Calculate your attack damage! What does the % operator do in Python?',
'["A) Percentage calculation", "B) Modulo (remainder)", "C) Exponentiation", "D) Division"]', 'B', 1, 3),

('attack_string_1', 'easy', 'basic_attack', 'String Slice', 'Your blade cuts through strings! What does \"hello\"[1] return?',
'["A) h", "B) e", "C) l", "D) Error"]', 'B', 1, 3),

('attack_compare_1', 'easy', 'basic_attack', 'Comparison Strike', 'Compare enemy stats! What does == do in Python?',
'["A) Assigns a value", "B) Checks equality", "C) Checks inequality", "D) Adds two numbers"]', 'B', 1, 3);

-- ============================================================================
-- SPELL CHALLENGES (Medium - Logic and control flow)
-- ============================================================================

INSERT OR IGNORE INTO dungeon_challenges (id, difficulty, action_type, title, description, choices, correct_answer, min_floor, max_floor) VALUES
('spell_if_1', 'medium', 'spell', 'Conditional Fireball', 'Your spell needs precise targeting! What does this code print?\n\nif 5 > 3:\n    print("Fire")\nelse:\n    print("Ice")',
'["A) Fire", "B) Ice", "C) FireIce", "D) Nothing"]', 'A', 1, 3),

('spell_loop_1', 'medium', 'spell', 'Lightning Loop', 'Your lightning strikes multiple times! How many times does this loop run?\n\nfor i in range(3):\n    print("Zap")',
'["A) 2 times", "B) 3 times", "C) 4 times", "D) Infinite"]', 'B', 1, 3),

('spell_list_1', 'medium', 'spell', 'Arcane Array', 'Your spell draws from a list of elements! What does [1, 2, 3][1] return?',
'["A) 1", "B) 2", "C) 3", "D) Error"]', 'B', 1, 3),

('spell_func_1', 'medium', 'spell', 'Function Blast', 'Cast a spell function! What keyword defines a function in Python?',
'["A) func", "B) function", "C) def", "D) define"]', 'C', 1, 3),

('spell_bool_1', 'medium', 'spell', 'Boolean Beam', 'Your spell checks conditions! What does (True and False) evaluate to?',
'["A) True", "B) False", "C) None", "D) Error"]', 'B', 1, 3),

('spell_return_1', 'medium', 'spell', 'Return Ritual', 'Your spell must return power! What does this function return?\n\ndef magic():\n    return 5 + 3',
'["A) 5", "B) 3", "C) 8", "D) None"]', 'C', 1, 3);

-- ============================================================================
-- HEAL CHALLENGES (Easy-Medium - Data structures)
-- ============================================================================

INSERT OR IGNORE INTO dungeon_challenges (id, difficulty, action_type, title, description, choices, correct_answer, min_floor, max_floor) VALUES
('heal_dict_1', 'medium', 'heal', 'Healing Potion Dictionary', 'Your healing potion is stored in a dict! What does {\"hp\": 50}[\"hp\"] return?',
'["A) hp", "B) 50", "C) {\"hp\": 50}", "D) Error"]', 'B', 1, 3),

('heal_len_1', 'easy', 'heal', 'Measure Vitality', 'Check your health pool size! What does len([1, 2, 3, 4]) return?',
'["A) 3", "B) 4", "C) 5", "D) 10"]', 'B', 1, 3),

('heal_string_1', 'easy', 'heal', 'String Restoration', 'Restore HP with string methods! What does \"HEAL\".lower() return?',
'["A) HEAL", "B) heal", "C) Heal", "D) hEaL"]', 'B', 1, 3),

('heal_max_1', 'medium', 'heal', 'Maximum Health', 'Find your max HP! What does max(50, 75, 60) return?',
'["A) 50", "B) 60", "C) 75", "D) 185"]', 'C', 1, 3),

('heal_min_1', 'medium', 'heal', 'Minimum Health', 'Check minimum HP needed! What does min(10, 5, 8) return?',
'["A) 5", "B) 8", "C) 10", "D) 23"]', 'A', 1, 3);

-- ============================================================================
-- DEFEND CHALLENGES (Easy - Syntax and basics)
-- ============================================================================

INSERT OR IGNORE INTO dungeon_challenges (id, difficulty, action_type, title, description, choices, correct_answer, min_floor, max_floor) VALUES
('defend_syntax_1', 'easy', 'defend', 'Shield Syntax', 'Raise your defensive shield! Which is valid Python syntax?',
'["A) print \"hello\"", "B) print(\"hello\")", "C) print[\"hello\"]", "D) print<\"hello\">"]', 'B', 1, 3),

('defend_indent_1', 'easy', 'defend', 'Indentation Block', 'Your shield requires proper structure! What defines code blocks in Python?',
'["A) Curly braces {}", "B) Parentheses ()", "C) Indentation", "D) Semicolons ;"]', 'C', 1, 3),

('defend_comment_1', 'easy', 'defend', 'Comment Shield', 'Hide notes from the enemy! Which creates a comment in Python?',
'["A) // comment", "B) /* comment */", "C) # comment", "D) <!-- comment -->"]', 'C', 1, 3);

-- ============================================================================
-- HARD CHALLENGES (Advanced concepts for higher floors)
-- ============================================================================

INSERT OR IGNORE INTO dungeon_challenges (id, difficulty, action_type, title, description, choices, correct_answer, min_floor, max_floor) VALUES
('advanced_slice_1', 'hard', 'spell', 'Advanced Slice Attack', 'Slice through arrays with precision! What does [1, 2, 3, 4, 5][1:4] return?',
'["A) [1, 2, 3]", "B) [2, 3, 4]", "C) [2, 3, 4, 5]", "D) [1, 2, 3, 4]"]', 'B', 2, 5),

('advanced_power_1', 'hard', 'spell', 'Power Calculation', 'Exponential spell power! What does 2 ** 3 return in Python?',
'["A) 5", "B) 6", "C) 8", "D) 9"]', 'C', 2, 5),

('advanced_none_1', 'hard', 'heal', 'Void Healing', 'Understanding the void! What does None represent in Python?',
'["A) Zero", "B) Empty string", "C) Absence of value", "D) False"]', 'C', 2, 5),

('advanced_type_1', 'hard', 'basic_attack', 'Type Conversion Strike', 'Convert damage types! What does int(\"42\") return?',
'["A) \"42\"", "B) 42", "C) Error", "D) 42.0"]', 'B', 2, 5);
