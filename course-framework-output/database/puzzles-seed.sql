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

-- ============================================================================
-- STARTER PUZZLES
-- ============================================================================

-- Puzzle 1: Two Sum
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization, optimal_time_complexity, optimal_space_complexity) VALUES
('two-sum', 'logic-algorithms', 'Two Sum',
'## Problem

Given an array of integers `nums` and an integer `target`, return the **indices** of the two numbers that add up to `target`.

You may assume that each input has **exactly one solution**, and you may not use the same element twice.

## Example

```
Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
Explanation: nums[0] + nums[1] = 2 + 7 = 9
```

```
Input: nums = [3, 2, 4], target = 6
Output: [1, 2]
```

## Constraints

- 2 ≤ nums.length ≤ 1000
- -10^9 ≤ nums[i] ≤ 10^9
- -10^9 ≤ target ≤ 10^9
- Only one valid answer exists

## Your Task

Complete the function `two_sum(nums, target)` that returns a list of two indices.',
'easy', 100, '["arrays", "hash-tables", "iteration"]', 15, 1, 'O(n)', 'O(n)');

-- Puzzle 2: Reverse String
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization) VALUES
('reverse-string', 'string-manipulation', 'Reverse String',
'## Problem

Write a function that reverses a string.

## Examples

```
Input: "hello"
Output: "olleh"
```

```
Input: "Python"
Output: "nohtyP"
```

```
Input: "12345"
Output: "54321"
```

## Constraints

- 0 ≤ s.length ≤ 1000
- s consists of printable ASCII characters

## Your Task

Complete the function `reverse_string(s)` that returns the reversed string.',
'easy', 100, '["strings", "iteration"]', 10, 0);

-- Puzzle 3: FizzBuzz
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization) VALUES
('fizzbuzz', 'math-numbers', 'FizzBuzz',
'## Problem

Write a function that returns a list of strings from 1 to n where:
- For multiples of 3, add "Fizz" instead of the number
- For multiples of 5, add "Buzz" instead of the number
- For multiples of both 3 and 5, add "FizzBuzz"
- Otherwise, add the number as a string

## Example

```
Input: n = 15
Output: ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"]
```

## Constraints

- 1 ≤ n ≤ 10000

## Your Task

Complete the function `fizzbuzz(n)` that returns a list of strings.',
'easy', 150, '["loops", "conditionals", "modulo"]', 15, 0);

-- Puzzle 4: Find Maximum
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization) VALUES
('find-maximum', 'data-structures', 'Find Maximum',
'## Problem

Given a non-empty array of integers, return the largest number.

## Examples

```
Input: nums = [1, 5, 3, 9, 2]
Output: 9
```

```
Input: nums = [-10, -5, -20, -3]
Output: -3
```

```
Input: nums = [42]
Output: 42
```

## Constraints

- 1 ≤ nums.length ≤ 10000
- -10^9 ≤ nums[i] ≤ 10^9

## Your Task

Complete the function `find_maximum(nums)` that returns the maximum value.',
'easy', 100, '["arrays", "iteration", "comparison"]', 10, 0);

-- Puzzle 5: Is Palindrome
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization) VALUES
('is-palindrome', 'string-manipulation', 'Is Palindrome',
'## Problem

A palindrome is a string that reads the same forward and backward.

Write a function that determines if a given string is a palindrome, **ignoring case**.

## Examples

```
Input: s = "racecar"
Output: true
```

```
Input: s = "hello"
Output: false
```

```
Input: s = "A man a plan a canal Panama"
Output: false  (spaces count!)
```

```
Input: s = "Madam"
Output: true
```

## Constraints

- 0 ≤ s.length ≤ 1000
- s consists of printable ASCII characters

## Your Task

Complete the function `is_palindrome(s)` that returns true or false.',
'easy', 150, '["strings", "two-pointers", "comparison"]', 15, 0);

-- ============================================================================
-- PUZZLE IMPLEMENTATIONS
-- ============================================================================

-- Two Sum - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('two-sum', 'python',
'def two_sum(nums, target):
    """
    Find two numbers that add up to target.
    Return their indices as a list.
    """
    # Your code here
    pass
',
'def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
',
'[
  {"input": {"nums": [2, 7, 11, 15], "target": 9}, "expectedOutput": [0, 1], "description": "Basic case"},
  {"input": {"nums": [3, 2, 4], "target": 6}, "expectedOutput": [1, 2], "description": "Answer not at start"},
  {"input": {"nums": [3, 3], "target": 6}, "expectedOutput": [0, 1], "description": "Duplicate numbers"},
  {"input": {"nums": [1, 5, 3, 7], "target": 10}, "expectedOutput": [1, 3], "description": "Non-adjacent indices", "hidden": true}
]',
'["Think about what you need to find for each number", "You need to check if target - current_number exists", "Use a dictionary to store numbers you''ve seen", "Store the number as key and its index as value"]');

-- Two Sum - JavaScript
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('two-sum', 'javascript',
'function two_sum(nums, target) {
    // Find two numbers that add up to target
    // Return their indices as an array

    // Your code here
}
',
'function two_sum(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }
        seen.set(nums[i], i);
    }
    return [];
}
',
'[
  {"input": {"nums": [2, 7, 11, 15], "target": 9}, "expectedOutput": [0, 1], "description": "Basic case"},
  {"input": {"nums": [3, 2, 4], "target": 6}, "expectedOutput": [1, 2], "description": "Answer not at start"},
  {"input": {"nums": [3, 3], "target": 6}, "expectedOutput": [0, 1], "description": "Duplicate numbers"},
  {"input": {"nums": [1, 5, 3, 7], "target": 10}, "expectedOutput": [1, 3], "description": "Non-adjacent indices", "hidden": true}
]',
'["Think about what you need to find for each number", "You need to check if target - current_number exists", "Use a Map to store numbers you''ve seen", "Store the number as key and its index as value"]');

-- Reverse String - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('reverse-string', 'python',
'def reverse_string(s):
    """
    Reverse the input string.
    """
    # Your code here
    pass
',
'def reverse_string(s):
    return s[::-1]
',
'[
  {"input": {"s": "hello"}, "expectedOutput": "olleh", "description": "Simple word"},
  {"input": {"s": "Python"}, "expectedOutput": "nohtyP", "description": "Mixed case"},
  {"input": {"s": "12345"}, "expectedOutput": "54321", "description": "Numbers"},
  {"input": {"s": ""}, "expectedOutput": "", "description": "Empty string", "hidden": true},
  {"input": {"s": "a"}, "expectedOutput": "a", "description": "Single character", "hidden": true}
]',
'["You can iterate through the string backwards", "Python has slicing syntax with negative step", "The syntax is s[start:end:step]", "Use s[::-1] to reverse"]');

-- Reverse String - JavaScript
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('reverse-string', 'javascript',
'function reverse_string(s) {
    // Reverse the input string

    // Your code here
}
',
'function reverse_string(s) {
    return s.split("").reverse().join("");
}
',
'[
  {"input": {"s": "hello"}, "expectedOutput": "olleh", "description": "Simple word"},
  {"input": {"s": "Python"}, "expectedOutput": "nohtyP", "description": "Mixed case"},
  {"input": {"s": "12345"}, "expectedOutput": "54321", "description": "Numbers"},
  {"input": {"s": ""}, "expectedOutput": "", "description": "Empty string", "hidden": true},
  {"input": {"s": "a"}, "expectedOutput": "a", "description": "Single character", "hidden": true}
]',
'["Strings in JavaScript are immutable", "You can convert string to array with split()", "Arrays have a reverse() method", "Use join() to convert array back to string"]');

-- FizzBuzz - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('fizzbuzz', 'python',
'def fizzbuzz(n):
    """
    Return a list of FizzBuzz values from 1 to n.
    """
    # Your code here
    pass
',
'def fizzbuzz(n):
    result = []
    for i in range(1, n + 1):
        if i % 15 == 0:
            result.append("FizzBuzz")
        elif i % 3 == 0:
            result.append("Fizz")
        elif i % 5 == 0:
            result.append("Buzz")
        else:
            result.append(str(i))
    return result
',
'[
  {"input": {"n": 5}, "expectedOutput": ["1", "2", "Fizz", "4", "Buzz"], "description": "First 5 numbers"},
  {"input": {"n": 15}, "expectedOutput": ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"], "description": "Up to FizzBuzz"},
  {"input": {"n": 1}, "expectedOutput": ["1"], "description": "Single number", "hidden": true}
]',
'["Use a loop from 1 to n (inclusive)", "Check divisibility by 15 first (both 3 and 5)", "Use modulo operator % to check divisibility", "Remember to convert numbers to strings"]');

-- FizzBuzz - JavaScript
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('fizzbuzz', 'javascript',
'function fizzbuzz(n) {
    // Return an array of FizzBuzz values from 1 to n

    // Your code here
}
',
'function fizzbuzz(n) {
    const result = [];
    for (let i = 1; i <= n; i++) {
        if (i % 15 === 0) {
            result.push("FizzBuzz");
        } else if (i % 3 === 0) {
            result.push("Fizz");
        } else if (i % 5 === 0) {
            result.push("Buzz");
        } else {
            result.push(String(i));
        }
    }
    return result;
}
',
'[
  {"input": {"n": 5}, "expectedOutput": ["1", "2", "Fizz", "4", "Buzz"], "description": "First 5 numbers"},
  {"input": {"n": 15}, "expectedOutput": ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"], "description": "Up to FizzBuzz"},
  {"input": {"n": 1}, "expectedOutput": ["1"], "description": "Single number", "hidden": true}
]',
'["Use a loop from 1 to n (inclusive)", "Check divisibility by 15 first (both 3 and 5)", "Use modulo operator % to check divisibility", "Remember to convert numbers to strings"]');

-- Find Maximum - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('find-maximum', 'python',
'def find_maximum(nums):
    """
    Find and return the maximum value in the array.
    """
    # Your code here
    pass
',
'def find_maximum(nums):
    return max(nums)
',
'[
  {"input": {"nums": [1, 5, 3, 9, 2]}, "expectedOutput": 9, "description": "Mixed positive numbers"},
  {"input": {"nums": [-10, -5, -20, -3]}, "expectedOutput": -3, "description": "All negative numbers"},
  {"input": {"nums": [42]}, "expectedOutput": 42, "description": "Single element"},
  {"input": {"nums": [5, 5, 5, 5]}, "expectedOutput": 5, "description": "All same", "hidden": true}
]',
'["Python has a built-in max() function", "You could also iterate and track the largest value", "Initialize with first element, then compare rest", "Or use max(nums) for the simplest solution"]');

-- Find Maximum - JavaScript
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('find-maximum', 'javascript',
'function find_maximum(nums) {
    // Find and return the maximum value in the array

    // Your code here
}
',
'function find_maximum(nums) {
    return Math.max(...nums);
}
',
'[
  {"input": {"nums": [1, 5, 3, 9, 2]}, "expectedOutput": 9, "description": "Mixed positive numbers"},
  {"input": {"nums": [-10, -5, -20, -3]}, "expectedOutput": -3, "description": "All negative numbers"},
  {"input": {"nums": [42]}, "expectedOutput": 42, "description": "Single element"},
  {"input": {"nums": [5, 5, 5, 5]}, "expectedOutput": 5, "description": "All same", "hidden": true}
]',
'["JavaScript has Math.max() function", "Use spread operator ... to pass array elements", "Math.max(...nums) will work", "Or iterate through and track the largest"]');

-- Is Palindrome - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('is-palindrome', 'python',
'def is_palindrome(s):
    """
    Check if string is a palindrome (ignoring case).
    """
    # Your code here
    pass
',
'def is_palindrome(s):
    s_lower = s.lower()
    return s_lower == s_lower[::-1]
',
'[
  {"input": {"s": "racecar"}, "expectedOutput": true, "description": "Simple palindrome"},
  {"input": {"s": "hello"}, "expectedOutput": false, "description": "Not a palindrome"},
  {"input": {"s": "Madam"}, "expectedOutput": true, "description": "Mixed case palindrome"},
  {"input": {"s": "A"}, "expectedOutput": true, "description": "Single character", "hidden": true},
  {"input": {"s": ""}, "expectedOutput": true, "description": "Empty string", "hidden": true}
]',
'["Convert to lowercase first for case-insensitive check", "Compare string with its reverse", "Use s.lower() to convert to lowercase", "Compare with reversed string using s[::-1]"]');

-- Is Palindrome - JavaScript
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('is-palindrome', 'javascript',
'function is_palindrome(s) {
    // Check if string is a palindrome (ignoring case)

    // Your code here
}
',
'function is_palindrome(s) {
    const lower = s.toLowerCase();
    const reversed = lower.split("").reverse().join("");
    return lower === reversed;
}
',
'[
  {"input": {"s": "racecar"}, "expectedOutput": true, "description": "Simple palindrome"},
  {"input": {"s": "hello"}, "expectedOutput": false, "description": "Not a palindrome"},
  {"input": {"s": "Madam"}, "expectedOutput": true, "description": "Mixed case palindrome"},
  {"input": {"s": "A"}, "expectedOutput": true, "description": "Single character", "hidden": true},
  {"input": {"s": ""}, "expectedOutput": true, "description": "Empty string", "hidden": true}
]',
'["Convert to lowercase first for case-insensitive check", "Compare string with its reverse", "Use toLowerCase() to convert", "Reverse using split, reverse, and join"]');
