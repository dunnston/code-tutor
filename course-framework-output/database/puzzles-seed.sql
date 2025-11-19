-- Puzzle System Seed Data
-- Initial data for puzzle categories and achievements

-- ============================================================================
-- PUZZLE CATEGORIES
-- ============================================================================
INSERT OR IGNORE INTO puzzle_categories (id, name, description, icon, order_index) VALUES
('logic-algorithms', 'Logic & Algorithms', 'Fundamental problem-solving and algorithmic thinking', '🧠', 1),
('data-structures', 'Data Structures', 'Master lists, dicts, trees, and more', '📦', 2),
('string-manipulation', 'String Manipulation', 'Text processing and string algorithms', '📝', 3),
('math-numbers', 'Math & Numbers', 'Mathematical problem solving', '🔢', 4),
('game-logic', 'Game Logic', 'RPG and game-related challenges', '🎮', 5),
('optimization', 'Optimization', 'Code golf and performance challenges', '⚡', 6);

-- ============================================================================
-- PUZZLE ACHIEVEMENTS
-- ============================================================================

-- Solve Count Achievements
INSERT OR IGNORE INTO puzzle_achievements (id, name, description, icon, requirement_type, requirement_value, xp_reward) VALUES
('first-puzzle', 'First Steps', 'Solve your first puzzle', '🎯', 'count', 1, 100),
('ten-puzzles', 'Problem Solver', 'Solve 10 puzzles', '🧩', 'count', 10, 250),
('twenty-five-puzzles', 'Puzzle Enthusiast', 'Solve 25 puzzles', '⭐', 'count', 25, 500),
('fifty-puzzles', 'Puzzle Master', 'Solve 50 puzzles', '💫', 'count', 50, 1000),
('hundred-puzzles', 'Centurion', 'Solve 100 puzzles', '👑', 'count', 100, 2500);

-- Difficulty Achievements
INSERT OR IGNORE INTO puzzle_achievements (id, name, description, icon, requirement_type, requirement_value, xp_reward) VALUES
('easy-complete', 'Easy Rider', 'Complete all Easy puzzles', '🌱', 'difficulty', 0, 500),
('medium-complete', 'Medium Well Done', 'Complete all Medium puzzles', '🌿', 'difficulty', 0, 1000),
('hard-complete', 'Hard Core', 'Complete all Hard puzzles', '🌳', 'difficulty', 0, 2000),
('expert-complete', 'Expert Elite', 'Complete all Expert puzzles', '🎓', 'difficulty', 0, 5000);

-- Streak Achievements
INSERT OR IGNORE INTO puzzle_achievements (id, name, description, icon, requirement_type, requirement_value, xp_reward) VALUES
('daily-streak-3', '3-Day Streak', 'Complete daily challenges for 3 days straight', '🔥', 'streak', 3, 150),
('daily-streak-7', 'Week Warrior', 'Complete daily challenges for 7 days straight', '🔥', 'streak', 7, 500),
('daily-streak-14', 'Two-Week Champion', 'Complete daily challenges for 14 days straight', '🔥', 'streak', 14, 1000),
('daily-streak-30', 'Monthly Master', 'Complete daily challenges for 30 days straight', '🔥', 'streak', 30, 2000),
('daily-streak-100', 'Century Streak', 'Complete daily challenges for 100 days straight', '🔥', 'streak', 100, 10000);

-- Language Achievements
INSERT OR IGNORE INTO puzzle_achievements (id, name, description, icon, requirement_type, requirement_value, xp_reward) VALUES
('polyglot', 'Polyglot Programmer', 'Solve same puzzle in 3 different languages', '🌐', 'language', 1, 300),
('polyglot-master', 'Polyglot Master', 'Solve 10 puzzles in 3 different languages', '🌍', 'language', 10, 1500),
('python-novice', 'Python Novice', 'Solve 10 puzzles in Python', '🐍', 'language', 10, 250),
('python-adept', 'Python Adept', 'Solve 25 puzzles in Python', '🐍', 'language', 25, 500),
('python-master', 'Python Master', 'Solve 50 puzzles in Python', '🐍', 'language', 50, 750),
('csharp-novice', 'C# Novice', 'Solve 10 puzzles in C#', '🔷', 'language', 10, 250),
('csharp-adept', 'C# Adept', 'Solve 25 puzzles in C#', '🔷', 'language', 25, 500),
('csharp-master', 'C# Master', 'Solve 50 puzzles in C#', '🔷', 'language', 50, 750),
('ruby-novice', 'Ruby Novice', 'Solve 10 puzzles in Ruby', '💎', 'language', 10, 250),
('ruby-adept', 'Ruby Adept', 'Solve 25 puzzles in Ruby', '💎', 'language', 25, 500),
('ruby-master', 'Ruby Master', 'Solve 50 puzzles in Ruby', '💎', 'language', 50, 750);

-- Optimization Achievements
INSERT OR IGNORE INTO puzzle_achievements (id, name, description, icon, requirement_type, requirement_value, xp_reward) VALUES
('optimizer', 'The Optimizer', 'Achieve optimal solution on 10 puzzles', '⚡', 'optimization', 10, 500),
('optimization-master', 'Optimization Master', 'Achieve optimal solution on 25 puzzles', '⚡', 'optimization', 25, 1500),
('code-golfer', 'Code Golfer', 'Top 10 on any Code Golf leaderboard', '⛳', 'optimization', 1, 300),
('speed-demon', 'Speed Demon', 'Top 10 on any Speed leaderboard', '🏃', 'optimization', 1, 300);

-- Category-Specific Achievements
INSERT OR IGNORE INTO puzzle_achievements (id, name, description, icon, requirement_type, requirement_value, xp_reward) VALUES
('logic-master', 'Logic Master', 'Complete all Logic & Algorithms puzzles', '🧠', 'count', 0, 1000),
('data-structures-master', 'Data Structures Master', 'Complete all Data Structures puzzles', '📦', 'count', 0, 1000),
('string-master', 'String Master', 'Complete all String Manipulation puzzles', '📝', 'count', 0, 1000),
('math-master', 'Math Master', 'Complete all Math & Numbers puzzles', '🔢', 'count', 0, 1000),
('game-logic-master', 'Game Logic Master', 'Complete all Game Logic puzzles', '🎮', 'count', 0, 1000),
('optimization-category-master', 'Ultimate Optimizer', 'Complete all Optimization puzzles', '⚡', 'count', 0, 2000);
