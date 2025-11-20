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
'medium', 150, '["arrays", "hash-tables", "iteration"]', 20, 1, 'O(n)', 'O(n)');

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
'medium', 150, '["strings", "two-pointers", "comparison"]', 15, 0);

-- ============================================================================
-- TRULY EASY PUZZLES (Beginner-Friendly)
-- ============================================================================

-- Puzzle 6: Sum All Numbers
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization) VALUES
('sum-all-numbers', 'data-structures', 'Sum All Numbers',
'## Problem

Given a list of numbers, return the sum of all the numbers.

## Examples

```
Input: nums = [1, 2, 3, 4, 5]
Output: 15
Explanation: 1 + 2 + 3 + 4 + 5 = 15
```

```
Input: nums = [10, 20, 30]
Output: 60
```

```
Input: nums = [-5, 5, -3, 3]
Output: 0
```

## Constraints

- 0 ≤ nums.length ≤ 1000
- -10^9 ≤ nums[i] ≤ 10^9

## Your Task

Complete the function `sum_all(nums)` that returns the sum of all numbers in the list.

**Hint**: Use a loop to add each number to a running total!',
'easy', 50, '["arrays", "loops", "addition"]', 5, 0);

-- Puzzle 7: Count Even Numbers
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization) VALUES
('count-evens', 'math-numbers', 'Count Even Numbers',
'## Problem

Given a list of integers, count how many of them are even numbers.

A number is even if it is divisible by 2 (no remainder when divided by 2).

## Examples

```
Input: nums = [1, 2, 3, 4, 5, 6]
Output: 3
Explanation: 2, 4, and 6 are even
```

```
Input: nums = [1, 3, 5, 7]
Output: 0
Explanation: No even numbers
```

```
Input: nums = [2, 4, 6, 8]
Output: 4
Explanation: All numbers are even
```

## Constraints

- 0 ≤ nums.length ≤ 1000
- -10^9 ≤ nums[i] ≤ 10^9

## Your Task

Complete the function `count_evens(nums)` that returns the count of even numbers.

**Hint**: Use the modulo operator `%` to check if a number is divisible by 2!',
'easy', 50, '["arrays", "loops", "modulo", "conditionals"]', 5, 0);

-- Puzzle 8: Largest of Three
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization) VALUES
('largest-of-three', 'logic-algorithms', 'Largest of Three',
'## Problem

Given three numbers, return the largest one.

## Examples

```
Input: a = 5, b = 10, c = 3
Output: 10
```

```
Input: a = -1, b = -5, c = -3
Output: -1
```

```
Input: a = 7, b = 7, c = 3
Output: 7
```

## Constraints

- -10^9 ≤ a, b, c ≤ 10^9

## Your Task

Complete the function `largest_of_three(a, b, c)` that returns the largest number.

**Hint**: Use if statements to compare the numbers!',
'easy', 50, '["comparison", "conditionals"]', 5, 0);

-- Puzzle 9: List Contains
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization) VALUES
('list-contains', 'data-structures', 'List Contains',
'## Problem

Given a list of numbers and a target number, return `True` if the target is in the list, `False` otherwise.

## Examples

```
Input: nums = [1, 2, 3, 4, 5], target = 3
Output: True
```

```
Input: nums = [10, 20, 30], target = 15
Output: False
```

```
Input: nums = [], target = 5
Output: False
```

## Constraints

- 0 ≤ nums.length ≤ 1000
- -10^9 ≤ nums[i] ≤ 10^9
- -10^9 ≤ target ≤ 10^9

## Your Task

Complete the function `list_contains(nums, target)` that returns True or False.

**Hint**: Loop through each number and check if it equals the target!',
'easy', 50, '["arrays", "loops", "search"]', 5, 0);

-- Puzzle 10: Repeat String
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization) VALUES
('repeat-string', 'string-manipulation', 'Repeat String',
'## Problem

Given a string and a number n, return the string repeated n times.

## Examples

```
Input: text = "ha", n = 3
Output: "hahaha"
```

```
Input: text = "Hello", n = 2
Output: "HelloHello"
```

```
Input: text = "x", n = 5
Output: "xxxxx"
```

## Constraints

- 0 ≤ text.length ≤ 100
- 0 ≤ n ≤ 100

## Your Task

Complete the function `repeat_string(text, n)` that returns the repeated string.

**Hint**: You can use string multiplication in Python: `"hi" * 3` gives `"hihihi"`',
'easy', 50, '["strings", "loops"]', 5, 0);

-- Puzzle 11: Is Positive
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization) VALUES
('is-positive', 'math-numbers', 'Is Positive',
'## Problem

Given a number, return `True` if it is positive (greater than 0), `False` otherwise.

Note: Zero is not positive!

## Examples

```
Input: num = 5
Output: True
```

```
Input: num = -10
Output: False
```

```
Input: num = 0
Output: False
Explanation: Zero is not positive
```

## Constraints

- -10^9 ≤ num ≤ 10^9

## Your Task

Complete the function `is_positive(num)` that returns True or False.

**Hint**: Use a simple comparison with the > operator!',
'easy', 50, '["comparison", "conditionals"]', 5, 0);

-- Puzzle 12: Get Last Item
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization) VALUES
('get-last-item', 'data-structures', 'Get Last Item',
'## Problem

Given a non-empty list, return the last item in the list.

## Examples

```
Input: items = [1, 2, 3, 4, 5]
Output: 5
```

```
Input: items = ["apple", "banana", "cherry"]
Output: "cherry"
```

```
Input: items = [42]
Output: 42
```

## Constraints

- 1 ≤ items.length ≤ 1000

## Your Task

Complete the function `get_last_item(items)` that returns the last item.

**Hint**: In Python, you can use negative indexing: `items[-1]` gets the last item!',
'easy', 50, '["arrays", "indexing"]', 5, 0);

-- ============================================================================
-- EASY GAME LOGIC PUZZLES
-- ============================================================================

-- Puzzle 11: Player Health After Damage
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization) VALUES
('player-health', 'game-logic', 'Player Health',
'## Problem

Your player takes damage in battle! Calculate their remaining health after taking damage.

If health drops to 0 or below, return 0 (the player is defeated).

## Examples

```
Input: current_health = 100, damage = 30
Output: 70
Explanation: 100 - 30 = 70
```

```
Input: current_health = 20, damage = 50
Output: 0
Explanation: Player is defeated (cannot have negative health)
```

```
Input: current_health = 50, damage = 25
Output: 25
```

## Constraints

- 0 ≤ current_health ≤ 1000
- 0 ≤ damage ≤ 1000

## Your Task

Complete the function `calculate_health(current_health, damage)` that returns the remaining health.

**Hint**: Subtract damage from health, but make sure it does not go below 0!',
'easy', 50, '["arithmetic", "comparison", "conditionals"]', 5, 0);

-- Puzzle 12: Can Level Up
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization) VALUES
('can-level-up', 'game-logic', 'Can Level Up?',
'## Problem

In an RPG, you level up when you have enough XP. Check if a player can level up.

To level up from level N to level N+1, you need `N * 100` XP.

## Examples

```
Input: current_level = 1, current_xp = 150
Output: True
Explanation: Need 100 XP to reach level 2, have 150
```

```
Input: current_level = 5, current_xp = 400
Output: False
Explanation: Need 500 XP to reach level 6, only have 400
```

```
Input: current_level = 3, current_xp = 300
Output: True
Explanation: Need exactly 300 XP to reach level 4
```

## Constraints

- 1 ≤ current_level ≤ 100
- 0 ≤ current_xp ≤ 100000

## Your Task

Complete the function `can_level_up(current_level, current_xp)` that returns True or False.

**Hint**: Calculate the required XP, then compare with current XP!',
'easy', 50, '["arithmetic", "comparison"]', 5, 0);

-- Puzzle 13: Gold After Purchase
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization) VALUES
('gold-after-purchase', 'game-logic', 'Gold After Purchase',
'## Problem

You want to buy an item from the shop. Calculate how much gold you will have left after the purchase.

If you do not have enough gold, return -1 (cannot afford it).

## Examples

```
Input: current_gold = 100, item_cost = 30
Output: 70
```

```
Input: current_gold = 50, item_cost = 75
Output: -1
Explanation: Not enough gold!
```

```
Input: current_gold = 100, item_cost = 100
Output: 0
Explanation: Spent all your gold
```

## Constraints

- 0 ≤ current_gold ≤ 100000
- 0 ≤ item_cost ≤ 100000

## Your Task

Complete the function `gold_after_purchase(current_gold, item_cost)` that returns remaining gold or -1.

**Hint**: First check if you can afford it, then subtract!',
'easy', 50, '["arithmetic", "comparison", "conditionals"]', 5, 0);

-- Puzzle 14: Total Attack Damage
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization) VALUES
('total-attack-damage', 'game-logic', 'Total Attack Damage',
'## Problem

Calculate the total damage from an attack. Damage is the base weapon damage plus a strength bonus.

Each strength point adds 2 damage.

## Examples

```
Input: weapon_damage = 10, strength = 5
Output: 20
Explanation: 10 + (5 * 2) = 20
```

```
Input: weapon_damage = 25, strength = 0
Output: 25
Explanation: No strength bonus
```

```
Input: weapon_damage = 15, strength = 10
Output: 35
Explanation: 15 + (10 * 2) = 35
```

## Constraints

- 0 ≤ weapon_damage ≤ 1000
- 0 ≤ strength ≤ 100

## Your Task

Complete the function `total_damage(weapon_damage, strength)` that returns the total damage.

**Hint**: Multiply strength by 2, then add to weapon damage!',
'easy', 50, '["arithmetic", "multiplication"]', 5, 0);

-- Puzzle 15: Has Required Item
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization) VALUES
('has-required-item', 'game-logic', 'Has Required Item?',
'## Problem

Check if the player has a specific item in their inventory.

## Examples

```
Input: inventory = ["sword", "shield", "potion"], required_item = "shield"
Output: True
```

```
Input: inventory = ["bow", "arrow"], required_item = "sword"
Output: False
```

```
Input: inventory = [], required_item = "key"
Output: False
```

## Constraints

- 0 ≤ inventory.length ≤ 100
- Item names are lowercase strings

## Your Task

Complete the function `has_item(inventory, required_item)` that returns True or False.

**Hint**: This is just like the List Contains puzzle, but with strings!',
'easy', 50, '["arrays", "loops", "search"]', 5, 0);

-- Puzzle 16: Is Boss Battle
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization) VALUES
('is-boss-battle', 'game-logic', 'Is Boss Battle?',
'## Problem

In your game, boss battles occur when the enemy health exceeds 100.

Check if the current enemy is a boss.

## Examples

```
Input: enemy_hp = 150
Output: True
Explanation: HP > 100, this is a boss!
```

```
Input: enemy_hp = 50
Output: False
Explanation: Regular enemy
```

```
Input: enemy_hp = 100
Output: False
Explanation: Exactly 100 is not a boss (must be greater than 100)
```

## Constraints

- 1 ≤ enemy_hp ≤ 10000

## Your Task

Complete the function `is_boss_battle(enemy_hp)` that returns True or False.

**Hint**: Just check if enemy_hp is greater than 100!',
'easy', 50, '["comparison", "conditionals"]', 5, 0);

-- Puzzle 17: Shield Block
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization) VALUES
('shield-block', 'game-logic', 'Shield Block',
'## Problem

Your shield blocks some damage! Calculate how much damage gets through after your shield blocks.

The shield reduces damage by its shield value. Damage cannot go below 0.

## Examples

```
Input: incoming_damage = 50, shield_value = 20
Output: 30
Explanation: 50 - 20 = 30 damage gets through
```

```
Input: incoming_damage = 30, shield_value = 40
Output: 0
Explanation: Shield blocks all damage
```

```
Input: incoming_damage = 100, shield_value = 100
Output: 0
Explanation: Shield blocks exactly all damage
```

## Constraints

- 0 ≤ incoming_damage ≤ 1000
- 0 ≤ shield_value ≤ 1000

## Your Task

Complete the function `shield_block(incoming_damage, shield_value)` that returns the damage taken.

**Hint**: Subtract shield from damage, but make sure result is not negative!',
'easy', 50, '["arithmetic", "comparison", "conditionals"]', 5, 0);

-- ============================================================================
-- EASY OPTIMIZATION PUZZLES
-- ============================================================================

-- Puzzle 16: Count Vowels
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization) VALUES
('count-vowels', 'optimization', 'Count Vowels',
'## Problem

Count how many vowels (a, e, i, o, u) are in a string. Ignore case.

## Examples

```
Input: text = "hello"
Output: 2
Explanation: e and o
```

```
Input: text = "AEIOU"
Output: 5
Explanation: All vowels
```

```
Input: text = "xyz"
Output: 0
Explanation: No vowels
```

## Constraints

- 0 ≤ text.length ≤ 1000
- text consists of letters only

## Your Task

Complete the function `count_vowels(text)` that returns the count.

**Hint**: Convert to lowercase first, then check each letter!',
'easy', 50, '["strings", "loops", "conditionals"]', 5, 0);

-- Puzzle 17: First Positive Number
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization) VALUES
('first-positive', 'optimization', 'First Positive',
'## Problem

Find the first positive number in a list. Return -1 if there are no positive numbers.

This teaches early return - stop as soon as you find what you need!

## Examples

```
Input: nums = [-5, -2, 3, 8, -1]
Output: 3
Explanation: First positive number
```

```
Input: nums = [-10, -20, -30]
Output: -1
Explanation: No positive numbers
```

```
Input: nums = [0, -5, 10]
Output: 10
Explanation: 0 is not positive
```

## Constraints

- 0 ≤ nums.length ≤ 1000
- -10^9 ≤ nums[i] ≤ 10^9

## Your Task

Complete the function `first_positive(nums)` that returns the first positive number or -1.

**Hint**: Return immediately when you find a positive number - do not keep looping!',
'easy', 50, '["arrays", "loops", "early-return"]', 5, 0);

-- Puzzle 18: Add Until Limit
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization) VALUES
('add-until-limit', 'optimization', 'Add Until Limit',
'## Problem

Add numbers from a list to a running total. Stop when the total would exceed the limit.

Return how many numbers you were able to add.

## Examples

```
Input: nums = [1, 2, 3, 4, 5], limit = 6
Output: 3
Explanation: 1+2+3 = 6 (stop before adding 4)
```

```
Input: nums = [10, 20, 30], limit = 25
Output: 1
Explanation: Can only add 10 (adding 20 would exceed 25)
```

```
Input: nums = [5, 5, 5], limit = 20
Output: 3
Explanation: 5+5+5 = 15 (under the limit)
```

## Constraints

- 0 ≤ nums.length ≤ 1000
- 0 ≤ nums[i] ≤ 1000
- 0 ≤ limit ≤ 100000

## Your Task

Complete the function `add_until_limit(nums, limit)` that returns the count.

**Hint**: Keep a running total and stop when adding the next number would go over!',
'easy', 50, '["arrays", "loops", "break"]', 5, 0);

-- Puzzle 19: Sum Until Zero
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization) VALUES
('sum-until-zero', 'optimization', 'Sum Until Zero',
'## Problem

Add numbers from a list until you encounter a zero. Return the sum.

Stop immediately when you hit a zero (do not include it in the sum).

## Examples

```
Input: nums = [5, 10, 15, 0, 20, 30]
Output: 30
Explanation: 5 + 10 + 15 = 30, then stop at 0
```

```
Input: nums = [1, 2, 3, 4, 5]
Output: 15
Explanation: No zero, add all numbers
```

```
Input: nums = [0, 10, 20]
Output: 0
Explanation: First number is zero, return 0
```

## Constraints

- 0 ≤ nums.length ≤ 1000
- -1000 ≤ nums[i] ≤ 1000

## Your Task

Complete the function `sum_until_zero(nums)` that returns the sum.

**Hint**: Use a loop with early return or break when you find a zero!',
'easy', 50, '["arrays", "loops", "early-return"]', 5, 0);

-- Puzzle 20: Count in Range
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization) VALUES
('count-in-range', 'optimization', 'Count in Range',
'## Problem

Count how many numbers in a list fall within a given range (inclusive).

A number is in range if: min_val ≤ number ≤ max_val

## Examples

```
Input: nums = [1, 5, 10, 15, 20], min_val = 5, max_val = 15
Output: 3
Explanation: 5, 10, and 15 are in range
```

```
Input: nums = [3, 7, 2, 9, 1], min_val = 5, max_val = 10
Output: 2
Explanation: 7 and 9 are in range
```

```
Input: nums = [1, 2, 3], min_val = 10, max_val = 20
Output: 0
Explanation: No numbers in range
```

## Constraints

- 0 ≤ nums.length ≤ 1000
- -10^9 ≤ nums[i] ≤ 10^9
- min_val ≤ max_val

## Your Task

Complete the function `count_in_range(nums, min_val, max_val)` that returns the count.

**Hint**: Loop through and check if each number is >= min_val AND <= max_val!',
'easy', 50, '["arrays", "loops", "comparison"]', 5, 0);

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
  {"input": {"nums": [1, 5, 3, 7], "target": 10}, "expectedOutput": [2, 3], "description": "Non-adjacent indices", "hidden": true}
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
  {"input": {"nums": [1, 5, 3, 7], "target": 10}, "expectedOutput": [2, 3], "description": "Non-adjacent indices", "hidden": true}
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

-- ============================================================================
-- EASY PUZZLE IMPLEMENTATIONS
-- ============================================================================

-- Sum All Numbers - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('sum-all-numbers', 'python',
'def sum_all(nums):
    """
    Return the sum of all numbers in the list.
    """
    # Your code here
    pass
',
'def sum_all(nums):
    total = 0
    for num in nums:
        total += num
    return total
',
'[
  {"input": {"nums": [1, 2, 3, 4, 5]}, "expectedOutput": 15, "description": "Basic sum"},
  {"input": {"nums": [10, 20, 30]}, "expectedOutput": 60, "description": "Larger numbers"},
  {"input": {"nums": [-5, 5, -3, 3]}, "expectedOutput": 0, "description": "Positive and negative"},
  {"input": {"nums": []}, "expectedOutput": 0, "description": "Empty list", "hidden": true},
  {"input": {"nums": [100]}, "expectedOutput": 100, "description": "Single number", "hidden": true}
]',
'["Create a variable to store the total", "Start the total at 0", "Loop through each number in the list", "Add each number to the total"]');

-- Count Evens - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('count-evens', 'python',
'def count_evens(nums):
    """
    Count how many even numbers are in the list.
    """
    # Your code here
    pass
',
'def count_evens(nums):
    count = 0
    for num in nums:
        if num % 2 == 0:
            count += 1
    return count
',
'[
  {"input": {"nums": [1, 2, 3, 4, 5, 6]}, "expectedOutput": 3, "description": "Mixed numbers"},
  {"input": {"nums": [1, 3, 5, 7]}, "expectedOutput": 0, "description": "All odd"},
  {"input": {"nums": [2, 4, 6, 8]}, "expectedOutput": 4, "description": "All even"},
  {"input": {"nums": []}, "expectedOutput": 0, "description": "Empty list", "hidden": true},
  {"input": {"nums": [0, 2, -2, -4]}, "expectedOutput": 4, "description": "Zero and negatives", "hidden": true}
]',
'["Create a counter variable starting at 0", "Loop through each number", "Check if the number is divisible by 2", "Use the modulo operator: num % 2 == 0"]');

-- Largest of Three - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('largest-of-three', 'python',
'def largest_of_three(a, b, c):
    """
    Return the largest of three numbers.
    """
    # Your code here
    pass
',
'def largest_of_three(a, b, c):
    if a >= b and a >= c:
        return a
    elif b >= c:
        return b
    else:
        return c
',
'[
  {"input": {"a": 5, "b": 10, "c": 3}, "expectedOutput": 10, "description": "b is largest"},
  {"input": {"a": -1, "b": -5, "c": -3}, "expectedOutput": -1, "description": "Negative numbers"},
  {"input": {"a": 7, "b": 7, "c": 3}, "expectedOutput": 7, "description": "Two numbers tied"},
  {"input": {"a": 100, "b": 50, "c": 75}, "expectedOutput": 100, "description": "a is largest", "hidden": true},
  {"input": {"a": 5, "b": 5, "c": 5}, "expectedOutput": 5, "description": "All equal", "hidden": true}
]',
'["Compare a with b", "Compare a with c", "Use if-elif-else to check all cases", "You can also use max(a, b, c) as a shortcut!"]');

-- List Contains - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('list-contains', 'python',
'def list_contains(nums, target):
    """
    Return True if target is in the list, False otherwise.
    """
    # Your code here
    pass
',
'def list_contains(nums, target):
    for num in nums:
        if num == target:
            return True
    return False
',
'[
  {"input": {"nums": [1, 2, 3, 4, 5], "target": 3}, "expectedOutput": true, "description": "Target found"},
  {"input": {"nums": [10, 20, 30], "target": 15}, "expectedOutput": false, "description": "Target not found"},
  {"input": {"nums": [], "target": 5}, "expectedOutput": false, "description": "Empty list"},
  {"input": {"nums": [7, 7, 7], "target": 7}, "expectedOutput": true, "description": "Duplicates", "hidden": true},
  {"input": {"nums": [-5, 0, 5], "target": 0}, "expectedOutput": true, "description": "Zero target", "hidden": true}
]',
'["Loop through each number in the list", "Check if the current number equals the target", "Return True immediately when you find it", "Return False after the loop if not found"]');

-- Repeat String - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('repeat-string', 'python',
'def repeat_string(text, n):
    """
    Return the string repeated n times.
    """
    # Your code here
    pass
',
'def repeat_string(text, n):
    return text * n
',
'[
  {"input": {"text": "ha", "n": 3}, "expectedOutput": "hahaha", "description": "Basic repeat"},
  {"input": {"text": "Hello", "n": 2}, "expectedOutput": "HelloHello", "description": "Word repeat"},
  {"input": {"text": "x", "n": 5}, "expectedOutput": "xxxxx", "description": "Single character"},
  {"input": {"text": "abc", "n": 0}, "expectedOutput": "", "description": "Zero repeats", "hidden": true},
  {"input": {"text": "", "n": 10}, "expectedOutput": "", "description": "Empty string", "hidden": true}
]',
'["Python strings support multiplication", "Use the * operator", "text * n repeats the string n times", "This is the simplest solution - just one line!"]');

-- ==================================
-- GAME LOGIC PUZZLE IMPLEMENTATIONS
-- ==================================

-- Player Health - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('player-health', 'python',
'def calculate_health(current_health, damage):
    """
    Calculate remaining health after taking damage.
    """
    # Your code here
    pass
',
'def calculate_health(current_health, damage):
    remaining = current_health - damage
    if remaining < 0:
        return 0
    return remaining
',
'[
  {"input": {"current_health": 100, "damage": 30}, "expectedOutput": 70, "description": "Basic damage"},
  {"input": {"current_health": 20, "damage": 50}, "expectedOutput": 0, "description": "Defeated"},
  {"input": {"current_health": 50, "damage": 25}, "expectedOutput": 25, "description": "Half health"},
  {"input": {"current_health": 100, "damage": 100}, "expectedOutput": 0, "description": "Exact defeat", "hidden": true},
  {"input": {"current_health": 75, "damage": 0}, "expectedOutput": 75, "description": "No damage", "hidden": true}
]',
'["Subtract damage from current health", "Check if the result is less than 0", "If less than 0, return 0 instead", "You can also use max(0, current_health - damage)"]');

-- Can Level Up - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('can-level-up', 'python',
'def can_level_up(current_level, current_xp):
    """
    Check if player has enough XP to level up.
    """
    # Your code here
    pass
',
'def can_level_up(current_level, current_xp):
    required_xp = current_level * 100
    return current_xp >= required_xp
',
'[
  {"input": {"current_level": 1, "current_xp": 150}, "expectedOutput": true, "description": "Can level up"},
  {"input": {"current_level": 5, "current_xp": 400}, "expectedOutput": false, "description": "Not enough XP"},
  {"input": {"current_level": 3, "current_xp": 300}, "expectedOutput": true, "description": "Exact XP needed"},
  {"input": {"current_level": 10, "current_xp": 999}, "expectedOutput": false, "description": "High level", "hidden": true},
  {"input": {"current_level": 1, "current_xp": 100}, "expectedOutput": true, "description": "Minimum to level", "hidden": true}
]',
'["Calculate required XP: level * 100", "Compare current XP with required XP", "Use >= for the comparison", "Return True or False"]');

-- Gold After Purchase - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('gold-after-purchase', 'python',
'def gold_after_purchase(current_gold, item_cost):
    """
    Calculate gold remaining after purchase.
    """
    # Your code here
    pass
',
'def gold_after_purchase(current_gold, item_cost):
    if current_gold < item_cost:
        return -1
    return current_gold - item_cost
',
'[
  {"input": {"current_gold": 100, "item_cost": 30}, "expectedOutput": 70, "description": "Can afford"},
  {"input": {"current_gold": 50, "item_cost": 75}, "expectedOutput": -1, "description": "Cannot afford"},
  {"input": {"current_gold": 100, "item_cost": 100}, "expectedOutput": 0, "description": "Exact cost"},
  {"input": {"current_gold": 0, "item_cost": 10}, "expectedOutput": -1, "description": "No gold", "hidden": true},
  {"input": {"current_gold": 1000, "item_cost": 1}, "expectedOutput": 999, "description": "Cheap item", "hidden": true}
]',
'["First check if you have enough gold", "If not enough, return -1", "If enough, subtract and return the result", "Use an if statement to check"]');

-- Total Damage - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('total-attack-damage', 'python',
'def total_damage(weapon_damage, strength):
    """
    Calculate total attack damage.
    """
    # Your code here
    pass
',
'def total_damage(weapon_damage, strength):
    strength_bonus = strength * 2
    return weapon_damage + strength_bonus
',
'[
  {"input": {"weapon_damage": 10, "strength": 5}, "expectedOutput": 20, "description": "With strength"},
  {"input": {"weapon_damage": 25, "strength": 0}, "expectedOutput": 25, "description": "No strength"},
  {"input": {"weapon_damage": 15, "strength": 10}, "expectedOutput": 35, "description": "High strength"},
  {"input": {"weapon_damage": 0, "strength": 20}, "expectedOutput": 40, "description": "Only strength", "hidden": true},
  {"input": {"weapon_damage": 50, "strength": 1}, "expectedOutput": 52, "description": "Low strength", "hidden": true}
]',
'["Each strength point adds 2 damage", "Multiply strength by 2", "Add the result to weapon damage", "You can write it in one line!"]');

-- Has Item - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('has-required-item', 'python',
'def has_item(inventory, required_item):
    """
    Check if inventory contains the required item.
    """
    # Your code here
    pass
',
'def has_item(inventory, required_item):
    for item in inventory:
        if item == required_item:
            return True
    return False
',
'[
  {"input": {"inventory": ["sword", "shield", "potion"], "required_item": "shield"}, "expectedOutput": true, "description": "Has item"},
  {"input": {"inventory": ["bow", "arrow"], "required_item": "sword"}, "expectedOutput": false, "description": "Missing item"},
  {"input": {"inventory": [], "required_item": "key"}, "expectedOutput": false, "description": "Empty inventory"},
  {"input": {"inventory": ["potion", "potion", "potion"], "required_item": "potion"}, "expectedOutput": true, "description": "Multiple same", "hidden": true},
  {"input": {"inventory": ["Sword"], "required_item": "sword"}, "expectedOutput": false, "description": "Case sensitive", "hidden": true}
]',
'["Loop through each item in inventory", "Compare each item with required_item", "Return True if you find a match", "Return False after the loop if not found"]');

-- ========================================
-- OPTIMIZATION PUZZLE IMPLEMENTATIONS
-- ========================================

-- Count Vowels - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('count-vowels', 'python',
'def count_vowels(text):
    """
    Count vowels in the text.
    """
    # Your code here
    pass
',
'def count_vowels(text):
    text = text.lower()
    count = 0
    vowels = "aeiou"
    for char in text:
        if char in vowels:
            count += 1
    return count
',
'[
  {"input": {"text": "hello"}, "expectedOutput": 2, "description": "Lowercase"},
  {"input": {"text": "AEIOU"}, "expectedOutput": 5, "description": "All vowels"},
  {"input": {"text": "xyz"}, "expectedOutput": 0, "description": "No vowels"},
  {"input": {"text": "Programming"}, "expectedOutput": 3, "description": "Mixed case", "hidden": true},
  {"input": {"text": ""}, "expectedOutput": 0, "description": "Empty string", "hidden": true}
]',
'["Convert text to lowercase first", "Create a string or list of vowels: aeiou", "Loop through each character", "Check if character is in vowels"]');

-- First Positive - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('first-positive', 'python',
'def first_positive(nums):
    """
    Find the first positive number.
    """
    # Your code here
    pass
',
'def first_positive(nums):
    for num in nums:
        if num > 0:
            return num
    return -1
',
'[
  {"input": {"nums": [-5, -2, 3, 8, -1]}, "expectedOutput": 3, "description": "First positive"},
  {"input": {"nums": [-10, -20, -30]}, "expectedOutput": -1, "description": "No positives"},
  {"input": {"nums": [0, -5, 10]}, "expectedOutput": 10, "description": "Zero not positive"},
  {"input": {"nums": [1, 2, 3]}, "expectedOutput": 1, "description": "All positive", "hidden": true},
  {"input": {"nums": []}, "expectedOutput": -1, "description": "Empty list", "hidden": true}
]',
'["Loop through each number", "Check if number is greater than 0", "Return immediately when you find one", "Return -1 if the loop finishes without finding any"]');

-- Add Until Limit - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('add-until-limit', 'python',
'def add_until_limit(nums, limit):
    """
    Count how many numbers can be added before exceeding limit.
    """
    # Your code here
    pass
',
'def add_until_limit(nums, limit):
    total = 0
    count = 0
    for num in nums:
        if total + num > limit:
            break
        total += num
        count += 1
    return count
',
'[
  {"input": {"nums": [1, 2, 3, 4, 5], "limit": 6}, "expectedOutput": 3, "description": "Stop at limit"},
  {"input": {"nums": [10, 20, 30], "limit": 25}, "expectedOutput": 1, "description": "Large numbers"},
  {"input": {"nums": [5, 5, 5], "limit": 20}, "expectedOutput": 3, "description": "All fit"},
  {"input": {"nums": [100], "limit": 50}, "expectedOutput": 0, "description": "First too big", "hidden": true},
  {"input": {"nums": [], "limit": 100}, "expectedOutput": 0, "description": "Empty list", "hidden": true}
]',
'["Keep a running total", "Before adding each number, check if it would exceed the limit", "If it would exceed, stop (use break)", "Count how many you were able to add"]');

-- ==================================
-- NEW BASIC PUZZLE IMPLEMENTATIONS
-- ==================================

-- Is Positive - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('is-positive', 'python',
'def is_positive(num):
    """
    Check if number is positive (greater than 0).
    """
    # Your code here
    pass
',
'def is_positive(num):
    return num > 0
',
'[
  {"input": {"num": 5}, "expectedOutput": true, "description": "Positive number"},
  {"input": {"num": -10}, "expectedOutput": false, "description": "Negative number"},
  {"input": {"num": 0}, "expectedOutput": false, "description": "Zero is not positive"},
  {"input": {"num": 100}, "expectedOutput": true, "description": "Large positive", "hidden": true},
  {"input": {"num": -1}, "expectedOutput": false, "description": "Negative one", "hidden": true}
]',
'["Use the > comparison operator", "Compare num with 0", "Return the result of the comparison", "This can be done in one line!"]');

-- Get Last Item - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('get-last-item', 'python',
'def get_last_item(items):
    """
    Return the last item in the list.
    """
    # Your code here
    pass
',
'def get_last_item(items):
    return items[-1]
',
'[
  {"input": {"items": [1, 2, 3, 4, 5]}, "expectedOutput": 5, "description": "Numbers"},
  {"input": {"items": ["apple", "banana", "cherry"]}, "expectedOutput": "cherry", "description": "Strings"},
  {"input": {"items": [42]}, "expectedOutput": 42, "description": "Single item"},
  {"input": {"items": [10, 20]}, "expectedOutput": 20, "description": "Two items", "hidden": true},
  {"input": {"items": ["last"]}, "expectedOutput": "last", "description": "One string", "hidden": true}
]',
'["Python supports negative indexing", "Index -1 means the last item", "Use items[-1] to get the last item", "This is the simplest solution - just one line!"]');

-- ==========================================
-- NEW GAME LOGIC PUZZLE IMPLEMENTATIONS
-- ==========================================

-- Is Boss Battle - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('is-boss-battle', 'python',
'def is_boss_battle(enemy_hp):
    """
    Check if this is a boss battle (HP > 100).
    """
    # Your code here
    pass
',
'def is_boss_battle(enemy_hp):
    return enemy_hp > 100
',
'[
  {"input": {"enemy_hp": 150}, "expectedOutput": true, "description": "Boss enemy"},
  {"input": {"enemy_hp": 50}, "expectedOutput": false, "description": "Regular enemy"},
  {"input": {"enemy_hp": 100}, "expectedOutput": false, "description": "Exactly 100"},
  {"input": {"enemy_hp": 101}, "expectedOutput": true, "description": "Just over 100", "hidden": true},
  {"input": {"enemy_hp": 1000}, "expectedOutput": true, "description": "High HP boss", "hidden": true}
]',
'["Use the > comparison operator", "Compare enemy_hp with 100", "Return the result directly", "This is a one-liner!"]');

-- Shield Block - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('shield-block', 'python',
'def shield_block(incoming_damage, shield_value):
    """
    Calculate damage after shield blocks.
    """
    # Your code here
    pass
',
'def shield_block(incoming_damage, shield_value):
    damage_taken = incoming_damage - shield_value
    if damage_taken < 0:
        return 0
    return damage_taken
',
'[
  {"input": {"incoming_damage": 50, "shield_value": 20}, "expectedOutput": 30, "description": "Partial block"},
  {"input": {"incoming_damage": 30, "shield_value": 40}, "expectedOutput": 0, "description": "Full block"},
  {"input": {"incoming_damage": 100, "shield_value": 100}, "expectedOutput": 0, "description": "Exact block"},
  {"input": {"incoming_damage": 75, "shield_value": 25}, "expectedOutput": 50, "description": "Half damage", "hidden": true},
  {"input": {"incoming_damage": 10, "shield_value": 50}, "expectedOutput": 0, "description": "Overkill shield", "hidden": true}
]',
'["Subtract shield_value from incoming_damage", "Check if result is negative", "If negative, return 0", "You can also use max(0, incoming_damage - shield_value)"]');

-- ============================================
-- NEW OPTIMIZATION PUZZLE IMPLEMENTATIONS
-- ============================================

-- Sum Until Zero - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('sum-until-zero', 'python',
'def sum_until_zero(nums):
    """
    Add numbers until you hit a zero.
    """
    # Your code here
    pass
',
'def sum_until_zero(nums):
    total = 0
    for num in nums:
        if num == 0:
            break
        total += num
    return total
',
'[
  {"input": {"nums": [5, 10, 15, 0, 20, 30]}, "expectedOutput": 30, "description": "Stop at zero"},
  {"input": {"nums": [1, 2, 3, 4, 5]}, "expectedOutput": 15, "description": "No zero"},
  {"input": {"nums": [0, 10, 20]}, "expectedOutput": 0, "description": "Zero first"},
  {"input": {"nums": [10, 20, 30, 0]}, "expectedOutput": 60, "description": "Zero at end", "hidden": true},
  {"input": {"nums": []}, "expectedOutput": 0, "description": "Empty list", "hidden": true}
]',
'["Create a total variable starting at 0", "Loop through each number", "Check if the number is 0", "If it is 0, stop immediately using break"]');

-- Count in Range - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('count-in-range', 'python',
'def count_in_range(nums, min_val, max_val):
    """
    Count numbers within the range (inclusive).
    """
    # Your code here
    pass
',
'def count_in_range(nums, min_val, max_val):
    count = 0
    for num in nums:
        if num >= min_val and num <= max_val:
            count += 1
    return count
',
'[
  {"input": {"nums": [1, 5, 10, 15, 20], "min_val": 5, "max_val": 15}, "expectedOutput": 3, "description": "Some in range"},
  {"input": {"nums": [3, 7, 2, 9, 1], "min_val": 5, "max_val": 10}, "expectedOutput": 2, "description": "Mixed numbers"},
  {"input": {"nums": [1, 2, 3], "min_val": 10, "max_val": 20}, "expectedOutput": 0, "description": "None in range"},
  {"input": {"nums": [5, 10, 15], "min_val": 5, "max_val": 15}, "expectedOutput": 3, "description": "All in range", "hidden": true},
  {"input": {"nums": [], "min_val": 0, "max_val": 100}, "expectedOutput": 0, "description": "Empty list", "hidden": true}
]',
'["Create a counter starting at 0", "Loop through each number", "Check if num >= min_val AND num <= max_val", "Increment counter if both conditions are true"]');

-- ============================================================================
-- MEDIUM DIFFICULTY PUZZLES
-- ============================================================================

-- ============================================================================
-- MEDIUM LOGIC & ALGORITHMS PUZZLES
-- ============================================================================

-- Puzzle: Find Missing Number
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization, optimal_time_complexity, optimal_space_complexity) VALUES
('find-missing-number', 'logic-algorithms', 'Find Missing Number',
'## Problem

Given an array containing n distinct numbers from 0 to n, find the one number that is missing from the array.

## Examples

```
Input: nums = [3, 0, 1]
Output: 2
Explanation: n = 3 since there are 3 numbers, range is [0,1,2,3], missing number is 2
```

```
Input: nums = [0, 1]
Output: 2
Explanation: n = 2, range is [0,1,2], missing is 2
```

```
Input: nums = [9,6,4,2,3,5,7,0,1]
Output: 8
```

## Constraints

- n = nums.length
- 1 ≤ n ≤ 10000
- 0 ≤ nums[i] ≤ n
- All numbers in nums are unique

## Your Task

Complete the function `find_missing_number(nums)` that returns the missing number.

**Challenge**: Can you solve it in O(n) time and O(1) space?',
'medium', 150, '["arrays", "math", "bit-manipulation"]', 20, 1, 'O(n)', 'O(1)');

-- Puzzle: Merge Sorted Arrays
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization, optimal_time_complexity, optimal_space_complexity) VALUES
('merge-sorted-arrays', 'logic-algorithms', 'Merge Sorted Arrays',
'## Problem

Given two sorted arrays, merge them into a single sorted array.

## Examples

```
Input: arr1 = [1, 3, 5], arr2 = [2, 4, 6]
Output: [1, 2, 3, 4, 5, 6]
```

```
Input: arr1 = [1, 2, 3], arr2 = [4, 5, 6]
Output: [1, 2, 3, 4, 5, 6]
```

```
Input: arr1 = [], arr2 = [1, 2, 3]
Output: [1, 2, 3]
```

## Constraints

- 0 ≤ arr1.length, arr2.length ≤ 1000
- -10^9 ≤ arr1[i], arr2[i] ≤ 10^9
- arr1 and arr2 are sorted in ascending order

## Your Task

Complete the function `merge_sorted(arr1, arr2)` that returns the merged sorted array.

**Challenge**: Merge them efficiently without using built-in sort.',
'medium', 150, '["arrays", "two-pointers", "sorting"]', 20, 1, 'O(n+m)', 'O(n+m)');

-- Puzzle: Valid Parentheses
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization, optimal_time_complexity, optimal_space_complexity) VALUES
('valid-parentheses', 'logic-algorithms', 'Valid Parentheses',
'## Problem

Given a string containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.

An input string is valid if:
- Open brackets are closed by the same type of brackets
- Open brackets are closed in the correct order

## Examples

```
Input: s = "()"
Output: true
```

```
Input: s = "()[]{}"
Output: true
```

```
Input: s = "(]"
Output: false
```

```
Input: s = "([)]"
Output: false
```

```
Input: s = "{[]}"
Output: true
```

## Constraints

- 1 ≤ s.length ≤ 10000
- s consists of parentheses only: ()[]{}

## Your Task

Complete the function `valid_parentheses(s)` that returns True or False.',
'medium', 150, '["stack", "string", "parsing"]', 20, 1, 'O(n)', 'O(n)');

-- ============================================================================
-- MEDIUM DATA STRUCTURES PUZZLES
-- ============================================================================

-- Puzzle: Remove Duplicates
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization, optimal_time_complexity, optimal_space_complexity) VALUES
('remove-duplicates', 'data-structures', 'Remove Duplicates',
'## Problem

Given a sorted array, remove the duplicates in-place and return the new length. Return a list with unique elements in their original order.

## Examples

```
Input: nums = [1, 1, 2]
Output: [1, 2]
```

```
Input: nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]
Output: [0, 1, 2, 3, 4]
```

```
Input: nums = [1, 2, 3]
Output: [1, 2, 3]
```

## Constraints

- 0 ≤ nums.length ≤ 10000
- -10^9 ≤ nums[i] ≤ 10^9
- nums is sorted in ascending order

## Your Task

Complete the function `remove_duplicates(nums)` that returns a list without duplicates.',
'medium', 150, '["arrays", "two-pointers", "in-place"]', 20, 1, 'O(n)', 'O(1)');

-- Puzzle: Rotate Array
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization, optimal_time_complexity, optimal_space_complexity) VALUES
('rotate-array', 'data-structures', 'Rotate Array',
'## Problem

Given an array, rotate it to the right by k steps.

## Examples

```
Input: nums = [1, 2, 3, 4, 5, 6, 7], k = 3
Output: [5, 6, 7, 1, 2, 3, 4]
Explanation: Rotate right 3 times
```

```
Input: nums = [-1, -100, 3, 99], k = 2
Output: [3, 99, -1, -100]
```

```
Input: nums = [1, 2], k = 3
Output: [2, 1]
Explanation: k=3 is same as k=1 for length 2
```

## Constraints

- 1 ≤ nums.length ≤ 10000
- -2^31 ≤ nums[i] ≤ 2^31 - 1
- 0 ≤ k ≤ 10^5

## Your Task

Complete the function `rotate_array(nums, k)` that returns the rotated array.

**Hint**: Consider what happens when k is larger than array length.',
'medium', 150, '["arrays", "rotation", "modulo"]', 20, 1, 'O(n)', 'O(1)');

-- Puzzle: Find Intersection
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization, optimal_time_complexity, optimal_space_complexity) VALUES
('find-intersection', 'data-structures', 'Find Intersection',
'## Problem

Given two arrays, return their intersection (elements that appear in both arrays). Each element in the result must be unique.

## Examples

```
Input: nums1 = [1, 2, 2, 1], nums2 = [2, 2]
Output: [2]
```

```
Input: nums1 = [4, 9, 5], nums2 = [9, 4, 9, 8, 4]
Output: [4, 9] or [9, 4]
```

```
Input: nums1 = [1, 2, 3], nums2 = [4, 5, 6]
Output: []
```

## Constraints

- 0 ≤ nums1.length, nums2.length ≤ 1000
- 0 ≤ nums1[i], nums2[i] ≤ 1000

## Your Task

Complete the function `find_intersection(nums1, nums2)` that returns a list of unique common elements.',
'medium', 150, '["arrays", "hash-set", "intersection"]', 20, 1, 'O(n+m)', 'O(min(n,m))');

-- ============================================================================
-- MEDIUM STRING MANIPULATION PUZZLES
-- ============================================================================

-- Puzzle: First Unique Character
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization, optimal_time_complexity, optimal_space_complexity) VALUES
('first-unique-char', 'string-manipulation', 'First Unique Character',
'## Problem

Given a string, find the first non-repeating character and return its index. If it does not exist, return -1.

## Examples

```
Input: s = "leetcode"
Output: 0
Explanation: "l" appears only once
```

```
Input: s = "loveleetcode"
Output: 2
Explanation: "v" is the first unique character
```

```
Input: s = "aabb"
Output: -1
```

## Constraints

- 1 ≤ s.length ≤ 10000
- s consists of only lowercase letters

## Your Task

Complete the function `first_unique_char(s)` that returns the index or -1.',
'medium', 150, '["strings", "hash-map", "counting"]', 20, 1, 'O(n)', 'O(1)');

-- Puzzle: Longest Common Prefix
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization, optimal_time_complexity, optimal_space_complexity) VALUES
('longest-common-prefix', 'string-manipulation', 'Longest Common Prefix',
'## Problem

Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string.

## Examples

```
Input: strs = ["flower", "flow", "flight"]
Output: "fl"
```

```
Input: strs = ["dog", "racecar", "car"]
Output: ""
Explanation: No common prefix
```

```
Input: strs = ["interspecies", "interstellar", "interstate"]
Output: "inters"
```

## Constraints

- 1 ≤ strs.length ≤ 200
- 0 ≤ strs[i].length ≤ 200
- strs[i] consists of only lowercase letters

## Your Task

Complete the function `longest_common_prefix(strs)` that returns the longest common prefix.',
'medium', 150, '["strings", "comparison", "prefix"]', 20, 1, 'O(S)', 'O(1)');

-- Puzzle: Anagram Groups
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization, optimal_time_complexity, optimal_space_complexity) VALUES
('anagram-groups', 'string-manipulation', 'Group Anagrams',
'## Problem

Given an array of strings, group anagrams together. Anagrams are words with the same characters in different orders.

## Examples

```
Input: strs = ["eat", "tea", "tan", "ate", "nat", "bat"]
Output: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]
```

```
Input: strs = [""]
Output: [[""]]
```

```
Input: strs = ["a"]
Output: [["a"]]
```

## Constraints

- 1 ≤ strs.length ≤ 10000
- 0 ≤ strs[i].length ≤ 100
- strs[i] consists of lowercase letters

## Your Task

Complete the function `group_anagrams(strs)` that returns a list of grouped anagrams.

**Hint**: Think about how to identify anagrams using sorting or character counting.',
'medium', 150, '["strings", "hash-map", "sorting", "anagrams"]', 25, 1, 'O(n*k*log(k))', 'O(n*k)');

-- ============================================================================
-- MEDIUM MATH & NUMBERS PUZZLES
-- ============================================================================

-- Puzzle: Prime Checker
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization, optimal_time_complexity, optimal_space_complexity) VALUES
('is-prime', 'math-numbers', 'Prime Number Checker',
'## Problem

Determine if a given number is prime. A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.

## Examples

```
Input: n = 7
Output: true
Explanation: 7 is only divisible by 1 and 7
```

```
Input: n = 4
Output: false
Explanation: 4 = 2 × 2
```

```
Input: n = 1
Output: false
Explanation: 1 is not prime by definition
```

```
Input: n = 17
Output: true
```

## Constraints

- 1 ≤ n ≤ 10^6

## Your Task

Complete the function `is_prime(n)` that returns True if n is prime, False otherwise.

**Challenge**: Can you make it efficient for large numbers? (Hint: You only need to check up to √n)',
'medium', 150, '["math", "loops", "optimization", "prime-numbers"]', 20, 1, 'O(√n)', 'O(1)');

-- Puzzle: Factorial Trailing Zeros
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization, optimal_time_complexity, optimal_space_complexity) VALUES
('trailing-zeros', 'math-numbers', 'Factorial Trailing Zeros',
'## Problem

Given an integer n, return the number of trailing zeros in n! (n factorial).

Note: Do NOT calculate the factorial directly - it will be too large!

## Examples

```
Input: n = 5
Output: 1
Explanation: 5! = 120, which has 1 trailing zero
```

```
Input: n = 10
Output: 2
Explanation: 10! = 3628800, which has 2 trailing zeros
```

```
Input: n = 25
Output: 6
Explanation: 25! has 6 trailing zeros
```

## Constraints

- 0 ≤ n ≤ 10^4

## Your Task

Complete the function `trailing_zeros(n)` that returns the count of trailing zeros.

**Hint**: Trailing zeros come from factors of 10, which come from 2×5. Count factors of 5!',
'medium', 150, '["math", "factorial", "number-theory"]', 25, 1, 'O(log n)', 'O(1)');

-- Puzzle: Power of Two
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization, optimal_time_complexity, optimal_space_complexity) VALUES
('power-of-two', 'math-numbers', 'Power of Two',
'## Problem

Given an integer n, return true if it is a power of two. Otherwise, return false.

A number is a power of two if there exists an integer x such that n = 2^x.

## Examples

```
Input: n = 1
Output: true
Explanation: 2^0 = 1
```

```
Input: n = 16
Output: true
Explanation: 2^4 = 16
```

```
Input: n = 3
Output: false
```

```
Input: n = 64
Output: true
Explanation: 2^6 = 64
```

## Constraints

- -2^31 ≤ n ≤ 2^31 - 1

## Your Task

Complete the function `is_power_of_two(n)` that returns True or False.

**Challenge**: Can you solve it without loops? (Hint: Think about binary representation)',
'medium', 150, '["math", "bit-manipulation", "powers"]', 20, 1, 'O(1)', 'O(1)');

-- ============================================================================
-- MEDIUM GAME LOGIC PUZZLES
-- ============================================================================

-- Puzzle: Combat Calculator
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization) VALUES
('combat-calculator', 'game-logic', 'Combat Calculator',
'## Problem

Calculate damage in an RPG combat system with the following rules:
- Base damage = weapon_damage + (strength * 2)
- Critical hit (if is_critical = True): damage × 1.5
- Armor reduces damage: final_damage = damage - (armor × 0.5)
- Minimum damage is always 1 (even if armor is high)

Return the final damage as an integer (rounded down).

## Examples

```
Input: weapon_damage = 10, strength = 5, armor = 2, is_critical = false
Output: 19
Explanation: (10 + 10) - 1 = 19
```

```
Input: weapon_damage = 20, strength = 10, armor = 5, is_critical = true
Output: 57
Explanation: ((20 + 20) * 1.5) - 2.5 = 57.5 → 57
```

```
Input: weapon_damage = 5, strength = 0, armor = 10, is_critical = false
Output: 1
Explanation: 5 - 5 = 0, but minimum is 1
```

## Constraints

- 0 ≤ weapon_damage ≤ 1000
- 0 ≤ strength ≤ 100
- 0 ≤ armor ≤ 100
- is_critical is a boolean

## Your Task

Complete the function `calculate_combat_damage(weapon_damage, strength, armor, is_critical)` that returns the final damage.',
'medium', 150, '["arithmetic", "game-mechanics", "conditionals"]', 20, 0);

-- Puzzle: Inventory Management
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization) VALUES
('inventory-management', 'game-logic', 'Inventory Management',
'## Problem

Manage an RPG inventory system. Given a list of items (each with a name and weight) and a max_capacity, determine which items can be carried.

Add items in order until adding the next item would exceed capacity. Return the list of item names that fit.

## Examples

```
Input: items = [{"name": "sword", "weight": 10}, {"name": "shield", "weight": 15}, {"name": "potion", "weight": 5}], max_capacity = 20
Output: ["sword", "shield"]
Explanation: sword(10) + shield(15) = 25 > 20, so only sword(10) + potion would be 15, but we add in order
```

```
Input: items = [{"name": "coin", "weight": 1}, {"name": "gem", "weight": 2}, {"name": "key", "weight": 1}], max_capacity = 3
Output: ["coin", "gem"]
```

```
Input: items = [{"name": "hammer", "weight": 50}], max_capacity = 20
Output: []
Explanation: First item too heavy
```

## Constraints

- 0 ≤ items.length ≤ 100
- 1 ≤ item weight ≤ 100
- 1 ≤ max_capacity ≤ 1000

## Your Task

Complete the function `manage_inventory(items, max_capacity)` that returns a list of item names.',
'medium', 150, '["arrays", "dictionaries", "greedy"]', 20, 0);

-- Puzzle: Quest Completion Checker
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization) VALUES
('quest-checker', 'game-logic', 'Quest Completion Checker',
'## Problem

Check if a player can complete a quest. A quest has requirements:
- Minimum level
- Required items (list of item names)
- Minimum gold

Given player stats (level, inventory list, gold), return True if all requirements are met.

## Examples

```
Input:
  player = {"level": 5, "inventory": ["sword", "shield"], "gold": 100}
  quest = {"min_level": 3, "required_items": ["sword"], "min_gold": 50}
Output: true
```

```
Input:
  player = {"level": 2, "inventory": ["potion"], "gold": 10}
  quest = {"min_level": 5, "required_items": ["sword"], "min_gold": 20}
Output: false
Explanation: Level too low, missing sword, not enough gold
```

```
Input:
  player = {"level": 10, "inventory": ["sword", "shield", "bow"], "gold": 500}
  quest = {"min_level": 8, "required_items": ["sword", "bow"], "min_gold": 100}
Output: true
```

## Constraints

- 1 ≤ player level ≤ 100
- 0 ≤ inventory items ≤ 50
- 0 ≤ gold ≤ 1000000

## Your Task

Complete the function `can_complete_quest(player, quest)` that returns True or False.',
'medium', 150, '["dictionaries", "logic", "validation"]', 25, 0);

-- ============================================================================
-- MEDIUM OPTIMIZATION PUZZLES
-- ============================================================================

-- Puzzle: Find Peak Element
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization, optimal_time_complexity, optimal_space_complexity) VALUES
('find-peak', 'optimization', 'Find Peak Element',
'## Problem

A peak element is an element that is strictly greater than its neighbors. Find any peak element and return its index.

You may imagine that nums[-1] = nums[n] = -∞.

## Examples

```
Input: nums = [1, 2, 3, 1]
Output: 2
Explanation: 3 is a peak element
```

```
Input: nums = [1, 2, 1, 3, 5, 6, 4]
Output: 5
Explanation: 6 is a peak (or index 1 with value 2)
```

```
Input: nums = [1]
Output: 0
```

## Constraints

- 1 ≤ nums.length ≤ 1000
- -2^31 ≤ nums[i] ≤ 2^31 - 1
- nums[i] != nums[i + 1] for all valid i

## Your Task

Complete the function `find_peak(nums)` that returns the index of a peak element.

**Challenge**: Can you solve it in O(log n) time using binary search?',
'medium', 150, '["arrays", "binary-search", "optimization"]', 25, 1, 'O(log n)', 'O(1)');

-- Puzzle: Maximum Subarray Sum
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization, optimal_time_complexity, optimal_space_complexity) VALUES
('max-subarray-sum', 'optimization', 'Maximum Subarray Sum',
'## Problem

Find the contiguous subarray within an array which has the largest sum.

## Examples

```
Input: nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
Output: 6
Explanation: [4, -1, 2, 1] has the largest sum = 6
```

```
Input: nums = [1]
Output: 1
```

```
Input: nums = [5, 4, -1, 7, 8]
Output: 23
Explanation: Entire array
```

```
Input: nums = [-1, -2, -3]
Output: -1
Explanation: Least negative
```

## Constraints

- 1 ≤ nums.length ≤ 10^5
- -10^4 ≤ nums[i] ≤ 10^4

## Your Task

Complete the function `max_subarray_sum(nums)` that returns the maximum sum.

**Challenge**: Solve it using Kadane''s algorithm in O(n) time!',
'medium', 150, '["arrays", "dynamic-programming", "kadanes-algorithm"]', 25, 1, 'O(n)', 'O(1)');

-- Puzzle: Best Time to Buy and Sell
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization, optimal_time_complexity, optimal_space_complexity) VALUES
('best-time-buy-sell', 'optimization', 'Best Time to Buy and Sell',
'## Problem

You are given an array of stock prices where prices[i] is the price on day i.

Find the maximum profit you can achieve by buying on one day and selling on a later day. If no profit is possible, return 0.

## Examples

```
Input: prices = [7, 1, 5, 3, 6, 4]
Output: 5
Explanation: Buy on day 2 (price=1), sell on day 5 (price=6), profit = 6-1 = 5
```

```
Input: prices = [7, 6, 4, 3, 1]
Output: 0
Explanation: No profit possible (prices only decrease)
```

```
Input: prices = [2, 4, 1, 7, 5]
Output: 6
Explanation: Buy at 1, sell at 7
```

## Constraints

- 1 ≤ prices.length ≤ 10^5
- 0 ≤ prices[i] ≤ 10^4

## Your Task

Complete the function `max_profit(prices)` that returns the maximum profit.

**Challenge**: Solve in O(n) time with single pass!',
'medium', 150, '["arrays", "optimization", "greedy", "tracking"]', 20, 1, 'O(n)', 'O(1)');

-- ============================================================================
-- MEDIUM PUZZLE IMPLEMENTATIONS - PYTHON
-- ============================================================================

-- Find Missing Number - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('find-missing-number', 'python',
'def find_missing_number(nums):
    """
    Find the missing number in the range [0, n].
    """
    # Your code here
    pass
',
'def find_missing_number(nums):
    n = len(nums)
    expected_sum = n * (n + 1) // 2
    actual_sum = sum(nums)
    return expected_sum - actual_sum
',
'[
  {"input": {"nums": [3, 0, 1]}, "expectedOutput": 2, "description": "Small array"},
  {"input": {"nums": [0, 1]}, "expectedOutput": 2, "description": "Missing last"},
  {"input": {"nums": [9, 6, 4, 2, 3, 5, 7, 0, 1]}, "expectedOutput": 8, "description": "Larger array"},
  {"input": {"nums": [0]}, "expectedOutput": 1, "description": "Single element", "hidden": true},
  {"input": {"nums": [1]}, "expectedOutput": 0, "description": "Missing zero", "hidden": true}
]',
'["The sum of 0 to n is n*(n+1)/2", "Calculate the expected sum", "Calculate the actual sum", "The difference is the missing number"]');

-- Merge Sorted Arrays - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('merge-sorted-arrays', 'python',
'def merge_sorted(arr1, arr2):
    """
    Merge two sorted arrays into one sorted array.
    """
    # Your code here
    pass
',
'def merge_sorted(arr1, arr2):
    result = []
    i, j = 0, 0
    while i < len(arr1) and j < len(arr2):
        if arr1[i] <= arr2[j]:
            result.append(arr1[i])
            i += 1
        else:
            result.append(arr2[j])
            j += 1
    result.extend(arr1[i:])
    result.extend(arr2[j:])
    return result
',
'[
  {"input": {"arr1": [1, 3, 5], "arr2": [2, 4, 6]}, "expectedOutput": [1, 2, 3, 4, 5, 6], "description": "Interleaved"},
  {"input": {"arr1": [1, 2, 3], "arr2": [4, 5, 6]}, "expectedOutput": [1, 2, 3, 4, 5, 6], "description": "Sequential"},
  {"input": {"arr1": [], "arr2": [1, 2, 3]}, "expectedOutput": [1, 2, 3], "description": "Empty first"},
  {"input": {"arr1": [1, 5, 9], "arr2": [2, 3, 4]}, "expectedOutput": [1, 2, 3, 4, 5, 9], "description": "Mixed order", "hidden": true},
  {"input": {"arr1": [0], "arr2": [0]}, "expectedOutput": [0, 0], "description": "Duplicates", "hidden": true}
]',
'["Use two pointers, one for each array", "Compare elements at both pointers", "Add the smaller element to result", "Don''t forget to add remaining elements from either array"]');

-- Valid Parentheses - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('valid-parentheses', 'python',
'def valid_parentheses(s):
    """
    Check if parentheses are valid and properly matched.
    """
    # Your code here
    pass
',
'def valid_parentheses(s):
    stack = []
    pairs = {"(": ")", "{": "}", "[": "]"}

    for char in s:
        if char in pairs:
            stack.append(char)
        else:
            if not stack or pairs[stack.pop()] != char:
                return False

    return len(stack) == 0
',
'[
  {"input": {"s": "()"}, "expectedOutput": true, "description": "Simple pair"},
  {"input": {"s": "()[]{}"}, "expectedOutput": true, "description": "Multiple types"},
  {"input": {"s": "(]"}, "expectedOutput": false, "description": "Mismatched"},
  {"input": {"s": "([)]"}, "expectedOutput": false, "description": "Wrong order"},
  {"input": {"s": "{[]}"}, "expectedOutput": true, "description": "Nested", "hidden": true},
  {"input": {"s": "((("}, "expectedOutput": false, "description": "Unclosed", "hidden": true}
]',
'["Use a stack data structure", "Push opening brackets onto the stack", "For closing brackets, check if they match the top of stack", "Stack should be empty at the end"]');

-- Remove Duplicates - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('remove-duplicates', 'python',
'def remove_duplicates(nums):
    """
    Remove duplicates from sorted array.
    """
    # Your code here
    pass
',
'def remove_duplicates(nums):
    if not nums:
        return []

    result = [nums[0]]
    for i in range(1, len(nums)):
        if nums[i] != nums[i-1]:
            result.append(nums[i])

    return result
',
'[
  {"input": {"nums": [1, 1, 2]}, "expectedOutput": [1, 2], "description": "Simple case"},
  {"input": {"nums": [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]}, "expectedOutput": [0, 1, 2, 3, 4], "description": "Multiple duplicates"},
  {"input": {"nums": [1, 2, 3]}, "expectedOutput": [1, 2, 3], "description": "No duplicates"},
  {"input": {"nums": [1, 1, 1, 1]}, "expectedOutput": [1], "description": "All same", "hidden": true},
  {"input": {"nums": []}, "expectedOutput": [], "description": "Empty array", "hidden": true}
]',
'["Array is already sorted", "Compare each element with the previous one", "Only add to result if different from previous", "You could also use a set, but that changes order"]');

-- Rotate Array - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('rotate-array', 'python',
'def rotate_array(nums, k):
    """
    Rotate array to the right by k steps.
    """
    # Your code here
    pass
',
'def rotate_array(nums, k):
    if not nums:
        return []

    n = len(nums)
    k = k % n

    return nums[-k:] + nums[:-k] if k > 0 else nums
',
'[
  {"input": {"nums": [1, 2, 3, 4, 5, 6, 7], "k": 3}, "expectedOutput": [5, 6, 7, 1, 2, 3, 4], "description": "Normal rotation"},
  {"input": {"nums": [-1, -100, 3, 99], "k": 2}, "expectedOutput": [3, 99, -1, -100], "description": "Negative numbers"},
  {"input": {"nums": [1, 2], "k": 3}, "expectedOutput": [2, 1], "description": "k > length"},
  {"input": {"nums": [1, 2, 3], "k": 0}, "expectedOutput": [1, 2, 3], "description": "No rotation", "hidden": true},
  {"input": {"nums": [1, 2, 3, 4], "k": 4}, "expectedOutput": [1, 2, 3, 4], "description": "Full rotation", "hidden": true}
]',
'["Use modulo to handle k > array length", "Slicing can help: take last k elements", "Concatenate last k elements with first n-k elements", "Watch out for k = 0"]');

-- Find Intersection - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('find-intersection', 'python',
'def find_intersection(nums1, nums2):
    """
    Find intersection of two arrays (unique elements).
    """
    # Your code here
    pass
',
'def find_intersection(nums1, nums2):
    set1 = set(nums1)
    set2 = set(nums2)
    return list(set1 & set2)
',
'[
  {"input": {"nums1": [1, 2, 2, 1], "nums2": [2, 2]}, "expectedOutput": [2], "description": "With duplicates"},
  {"input": {"nums1": [4, 9, 5], "nums2": [9, 4, 9, 8, 4]}, "expectedOutput": [4, 9], "description": "Multiple common"},
  {"input": {"nums1": [1, 2, 3], "nums2": [4, 5, 6]}, "expectedOutput": [], "description": "No intersection"},
  {"input": {"nums1": [1], "nums2": [1]}, "expectedOutput": [1], "description": "Single match", "hidden": true},
  {"input": {"nums1": [], "nums2": [1, 2]}, "expectedOutput": [], "description": "Empty array", "hidden": true}
]',
'["Convert both arrays to sets", "Use set intersection operation", "Convert result back to list", "Sets automatically handle duplicates"]');

-- First Unique Character - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('first-unique-char', 'python',
'def first_unique_char(s):
    """
    Find index of first non-repeating character.
    """
    # Your code here
    pass
',
'def first_unique_char(s):
    char_count = {}
    for char in s:
        char_count[char] = char_count.get(char, 0) + 1

    for i, char in enumerate(s):
        if char_count[char] == 1:
            return i

    return -1
',
'[
  {"input": {"s": "leetcode"}, "expectedOutput": 0, "description": "First character unique"},
  {"input": {"s": "loveleetcode"}, "expectedOutput": 2, "description": "Middle character unique"},
  {"input": {"s": "aabb"}, "expectedOutput": -1, "description": "No unique characters"},
  {"input": {"s": "z"}, "expectedOutput": 0, "description": "Single character", "hidden": true},
  {"input": {"s": "aabbc"}, "expectedOutput": 4, "description": "Last character unique", "hidden": true}
]',
'["Count frequency of each character", "Use a dictionary to store counts", "Iterate through string again to find first with count 1", "Return index or -1 if not found"]');

-- Longest Common Prefix - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('longest-common-prefix', 'python',
'def longest_common_prefix(strs):
    """
    Find longest common prefix among strings.
    """
    # Your code here
    pass
',
'def longest_common_prefix(strs):
    if not strs:
        return ""

    prefix = strs[0]
    for s in strs[1:]:
        while not s.startswith(prefix):
            prefix = prefix[:-1]
            if not prefix:
                return ""

    return prefix
',
'[
  {"input": {"strs": ["flower", "flow", "flight"]}, "expectedOutput": "fl", "description": "Common prefix"},
  {"input": {"strs": ["dog", "racecar", "car"]}, "expectedOutput": "", "description": "No common prefix"},
  {"input": {"strs": ["interspecies", "interstellar", "interstate"]}, "expectedOutput": "inters", "description": "Longer prefix"},
  {"input": {"strs": ["a"]}, "expectedOutput": "a", "description": "Single string", "hidden": true},
  {"input": {"strs": ["", "b"]}, "expectedOutput": "", "description": "Empty string", "hidden": true}
]',
'["Start with first string as potential prefix", "Compare with each other string", "Shrink prefix until it matches", "Use startswith() method"]');

-- Group Anagrams - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('anagram-groups', 'python',
'def group_anagrams(strs):
    """
    Group strings that are anagrams together.
    """
    # Your code here
    pass
',
'def group_anagrams(strs):
    from collections import defaultdict

    groups = defaultdict(list)
    for s in strs:
        key = "".join(sorted(s))
        groups[key].append(s)

    return list(groups.values())
',
'[
  {"input": {"strs": ["eat", "tea", "tan", "ate", "nat", "bat"]}, "expectedOutput": [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]], "description": "Multiple groups"},
  {"input": {"strs": [""]}, "expectedOutput": [[""]], "description": "Empty string"},
  {"input": {"strs": ["a"]}, "expectedOutput": [["a"]], "description": "Single string"},
  {"input": {"strs": ["abc", "bca", "cab", "xyz"]}, "expectedOutput": [["abc", "bca", "cab"], ["xyz"]], "description": "Two groups", "hidden": true}
]',
'["Anagrams have the same characters when sorted", "Use sorted string as a key", "Use a dictionary to group by key", "Return the values (groups) as a list"]');

-- Prime Checker - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('is-prime', 'python',
'def is_prime(n):
    """
    Check if n is a prime number.
    """
    # Your code here
    pass
',
'def is_prime(n):
    if n <= 1:
        return False
    if n <= 3:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False

    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6

    return True
',
'[
  {"input": {"n": 7}, "expectedOutput": true, "description": "Small prime"},
  {"input": {"n": 4}, "expectedOutput": false, "description": "Composite"},
  {"input": {"n": 1}, "expectedOutput": false, "description": "One is not prime"},
  {"input": {"n": 17}, "expectedOutput": true, "description": "Larger prime"},
  {"input": {"n": 100}, "expectedOutput": false, "description": "Even composite", "hidden": true},
  {"input": {"n": 97}, "expectedOutput": true, "description": "Two-digit prime", "hidden": true}
]',
'["Handle special cases: n <= 1 is false, 2 and 3 are prime", "Check divisibility by 2 and 3", "Only check up to sqrt(n)", "Primes > 3 are of form 6k±1"]');

-- Factorial Trailing Zeros - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('trailing-zeros', 'python',
'def trailing_zeros(n):
    """
    Count trailing zeros in n factorial.
    """
    # Your code here
    pass
',
'def trailing_zeros(n):
    count = 0
    power_of_5 = 5

    while power_of_5 <= n:
        count += n // power_of_5
        power_of_5 *= 5

    return count
',
'[
  {"input": {"n": 5}, "expectedOutput": 1, "description": "5! = 120"},
  {"input": {"n": 10}, "expectedOutput": 2, "description": "10! has 2 zeros"},
  {"input": {"n": 25}, "expectedOutput": 6, "description": "25! has 6 zeros"},
  {"input": {"n": 0}, "expectedOutput": 0, "description": "Zero factorial", "hidden": true},
  {"input": {"n": 100}, "expectedOutput": 24, "description": "Large number", "hidden": true}
]',
'["Trailing zeros come from factors of 10", "10 = 2 × 5, and there are always more 2s than 5s", "Count factors of 5 in n!", "Don''t forget numbers like 25 = 5² contribute 2 factors"]');

-- Power of Two - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('power-of-two', 'python',
'def is_power_of_two(n):
    """
    Check if n is a power of 2.
    """
    # Your code here
    pass
',
'def is_power_of_two(n):
    return n > 0 and (n & (n - 1)) == 0
',
'[
  {"input": {"n": 1}, "expectedOutput": true, "description": "2^0 = 1"},
  {"input": {"n": 16}, "expectedOutput": true, "description": "2^4 = 16"},
  {"input": {"n": 3}, "expectedOutput": false, "description": "Not a power of 2"},
  {"input": {"n": 64}, "expectedOutput": true, "description": "2^6 = 64"},
  {"input": {"n": 0}, "expectedOutput": false, "description": "Zero", "hidden": true},
  {"input": {"n": -16}, "expectedOutput": false, "description": "Negative", "hidden": true}
]',
'["Powers of 2 have only one bit set in binary", "Use bit manipulation: n & (n-1)", "This clears the rightmost set bit", "Result is 0 only if n was a power of 2"]');

-- Combat Calculator - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('combat-calculator', 'python',
'def calculate_combat_damage(weapon_damage, strength, armor, is_critical):
    """
    Calculate final combat damage with all modifiers.
    """
    # Your code here
    pass
',
'def calculate_combat_damage(weapon_damage, strength, armor, is_critical):
    # Base damage
    damage = weapon_damage + (strength * 2)

    # Critical hit
    if is_critical:
        damage = damage * 1.5

    # Armor reduction
    damage = damage - (armor * 0.5)

    # Minimum damage is 1
    return max(1, int(damage))
',
'[
  {"input": {"weapon_damage": 10, "strength": 5, "armor": 2, "is_critical": false}, "expectedOutput": 19, "description": "Basic attack"},
  {"input": {"weapon_damage": 20, "strength": 10, "armor": 5, "is_critical": true}, "expectedOutput": 57, "description": "Critical hit"},
  {"input": {"weapon_damage": 5, "strength": 0, "armor": 10, "is_critical": false}, "expectedOutput": 1, "description": "High armor"},
  {"input": {"weapon_damage": 15, "strength": 3, "armor": 0, "is_critical": false}, "expectedOutput": 21, "description": "No armor", "hidden": true},
  {"input": {"weapon_damage": 8, "strength": 4, "armor": 3, "is_critical": true}, "expectedOutput": 22, "description": "All modifiers", "hidden": true}
]',
'["Calculate base damage first", "Apply critical multiplier if needed", "Subtract armor reduction", "Ensure minimum damage is 1", "Use int() to round down"]');

-- Inventory Management - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('inventory-management', 'python',
'def manage_inventory(items, max_capacity):
    """
    Determine which items fit in inventory.
    """
    # Your code here
    pass
',
'def manage_inventory(items, max_capacity):
    result = []
    current_weight = 0

    for item in items:
        if current_weight + item["weight"] <= max_capacity:
            result.append(item["name"])
            current_weight += item["weight"]
        else:
            break

    return result
',
'[
  {"input": {"items": [{"name": "sword", "weight": 10}, {"name": "shield", "weight": 15}], "max_capacity": 20}, "expectedOutput": ["sword"], "description": "Partial fit"},
  {"input": {"items": [{"name": "coin", "weight": 1}, {"name": "gem", "weight": 2}, {"name": "key", "weight": 1}], "max_capacity": 3}, "expectedOutput": ["coin", "gem"], "description": "Multiple items"},
  {"input": {"items": [{"name": "hammer", "weight": 50}], "max_capacity": 20}, "expectedOutput": [], "description": "Too heavy"},
  {"input": {"items": [{"name": "a", "weight": 5}, {"name": "b", "weight": 5}, {"name": "c", "weight": 5}], "max_capacity": 15}, "expectedOutput": ["a", "b", "c"], "description": "All fit", "hidden": true}
]',
'["Track current weight as you add items", "Check if adding next item exceeds capacity", "Add items in order until capacity reached", "Access dictionary values with item[\"name\"] and item[\"weight\"]"]');

-- Quest Checker - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('quest-checker', 'python',
'def can_complete_quest(player, quest):
    """
    Check if player meets all quest requirements.
    """
    # Your code here
    pass
',
'def can_complete_quest(player, quest):
    # Check level
    if player["level"] < quest["min_level"]:
        return False

    # Check gold
    if player["gold"] < quest["min_gold"]:
        return False

    # Check items
    for required_item in quest["required_items"]:
        if required_item not in player["inventory"]:
            return False

    return True
',
'[
  {"input": {"player": {"level": 5, "inventory": ["sword", "shield"], "gold": 100}, "quest": {"min_level": 3, "required_items": ["sword"], "min_gold": 50}}, "expectedOutput": true, "description": "Can complete"},
  {"input": {"player": {"level": 2, "inventory": ["potion"], "gold": 10}, "quest": {"min_level": 5, "required_items": ["sword"], "min_gold": 20}}, "expectedOutput": false, "description": "Multiple failures"},
  {"input": {"player": {"level": 10, "inventory": ["sword", "shield", "bow"], "gold": 500}, "quest": {"min_level": 8, "required_items": ["sword", "bow"], "min_gold": 100}}, "expectedOutput": true, "description": "Multiple requirements met"},
  {"input": {"player": {"level": 5, "inventory": [], "gold": 100}, "quest": {"min_level": 5, "required_items": [], "min_gold": 100}}, "expectedOutput": true, "description": "No items required", "hidden": true}
]',
'["Check each requirement separately", "Level: compare player level with min_level", "Gold: compare player gold with min_gold", "Items: check if each required item is in inventory", "All checks must pass"]');

-- Find Peak - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('find-peak', 'python',
'def find_peak(nums):
    """
    Find index of a peak element.
    """
    # Your code here
    pass
',
'def find_peak(nums):
    # Simple solution: find any peak
    for i in range(len(nums)):
        is_peak = True
        if i > 0 and nums[i] <= nums[i-1]:
            is_peak = False
        if i < len(nums) - 1 and nums[i] <= nums[i+1]:
            is_peak = False
        if is_peak:
            return i
    return 0
',
'[
  {"input": {"nums": [1, 2, 3, 1]}, "expectedOutput": 2, "description": "Peak at end"},
  {"input": {"nums": [1, 2, 1, 3, 5, 6, 4]}, "expectedOutput": 5, "description": "Multiple peaks"},
  {"input": {"nums": [1]}, "expectedOutput": 0, "description": "Single element"},
  {"input": {"nums": [1, 2]}, "expectedOutput": 1, "description": "Two elements", "hidden": true},
  {"input": {"nums": [2, 1]}, "expectedOutput": 0, "description": "Descending", "hidden": true}
]',
'["A peak is greater than its neighbors", "Edge elements have only one neighbor", "Linear search is O(n), binary search is O(log n)", "Any peak is valid - return index of first one found"]');

-- Maximum Subarray Sum - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('max-subarray-sum', 'python',
'def max_subarray_sum(nums):
    """
    Find maximum sum of contiguous subarray.
    """
    # Your code here
    pass
',
'def max_subarray_sum(nums):
    max_sum = nums[0]
    current_sum = nums[0]

    for i in range(1, len(nums)):
        current_sum = max(nums[i], current_sum + nums[i])
        max_sum = max(max_sum, current_sum)

    return max_sum
',
'[
  {"input": {"nums": [-2, 1, -3, 4, -1, 2, 1, -5, 4]}, "expectedOutput": 6, "description": "Mixed numbers"},
  {"input": {"nums": [1]}, "expectedOutput": 1, "description": "Single element"},
  {"input": {"nums": [5, 4, -1, 7, 8]}, "expectedOutput": 23, "description": "Mostly positive"},
  {"input": {"nums": [-1, -2, -3]}, "expectedOutput": -1, "description": "All negative"},
  {"input": {"nums": [1, 2, 3, 4, 5]}, "expectedOutput": 15, "description": "All positive", "hidden": true}
]',
'["This is Kadane''s algorithm", "Track current subarray sum", "At each position, decide: extend current or start new", "Keep track of maximum sum seen", "current_sum = max(num, current_sum + num)"]');

-- Best Time to Buy and Sell - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('best-time-buy-sell', 'python',
'def max_profit(prices):
    """
    Find maximum profit from buying and selling stock.
    """
    # Your code here
    pass
',
'def max_profit(prices):
    if not prices:
        return 0

    min_price = prices[0]
    max_profit = 0

    for price in prices[1:]:
        max_profit = max(max_profit, price - min_price)
        min_price = min(min_price, price)

    return max_profit
',
'[
  {"input": {"prices": [7, 1, 5, 3, 6, 4]}, "expectedOutput": 5, "description": "Buy low, sell high"},
  {"input": {"prices": [7, 6, 4, 3, 1]}, "expectedOutput": 0, "description": "Prices decrease"},
  {"input": {"prices": [2, 4, 1, 7, 5]}, "expectedOutput": 6, "description": "Multiple valleys"},
  {"input": {"prices": [1, 2]}, "expectedOutput": 1, "description": "Simple profit", "hidden": true},
  {"input": {"prices": [3, 3, 3]}, "expectedOutput": 0, "description": "Flat prices", "hidden": true}
]',
'["Track minimum price seen so far", "For each price, calculate profit if sold today", "Update maximum profit", "Keep updating minimum price as you go", "Single pass solution"]');

-- ============================================================================
-- HARD PUZZLES
-- ============================================================================

-- ============================================================================
-- LOGIC & ALGORITHMS (HARD)
-- ============================================================================

-- Merge Intervals
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization, optimal_time_complexity, optimal_space_complexity) VALUES
('merge-intervals', 'logic-algorithms', 'Merge Intervals',
'## Problem

Given an array of intervals where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals and return an array of the non-overlapping intervals.

## Examples

```
Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
Explanation: [1,3] and [2,6] overlap, so merge them into [1,6]
```

```
Input: intervals = [[1,4],[4,5]]
Output: [[1,5]]
Explanation: [1,4] and [4,5] are considered overlapping
```

```
Input: intervals = [[1,4],[0,2],[3,5]]
Output: [[0,5]]
Explanation: After sorting and merging, all intervals overlap
```

## Constraints

- 1 ≤ intervals.length ≤ 10^4
- intervals[i].length == 2
- 0 ≤ start_i ≤ end_i ≤ 10^4

## Your Task

Complete the function `merge_intervals(intervals)` that returns the merged intervals.',
'hard', 300, '["arrays", "sorting", "greedy", "interval-merging"]', 35, 1, 'O(n log n)', 'O(n)');

-- Longest Increasing Subsequence
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization, optimal_time_complexity, optimal_space_complexity) VALUES
('longest-increasing-subsequence', 'logic-algorithms', 'Longest Increasing Subsequence',
'## Problem

Given an integer array `nums`, return the **length** of the longest strictly increasing subsequence.

A **subsequence** is a sequence derived from an array by deleting some or no elements without changing the order of the remaining elements.

## Examples

```
Input: nums = [10,9,2,5,3,7,101,18]
Output: 4
Explanation: The longest increasing subsequence is [2,3,7,101] (length 4)
```

```
Input: nums = [0,1,0,3,2,3]
Output: 4
Explanation: One possible LIS is [0,1,2,3]
```

```
Input: nums = [7,7,7,7,7]
Output: 1
Explanation: Single element is the only strictly increasing subsequence
```

## Constraints

- 1 ≤ nums.length ≤ 2500
- -10^4 ≤ nums[i] ≤ 10^4

## Your Task

Complete the function `longest_increasing_subsequence(nums)` that returns the length of the LIS.',
'hard', 350, '["dynamic-programming", "arrays", "binary-search", "subsequences"]', 45, 1, 'O(n log n)', 'O(n)');

-- Valid Parentheses Advanced
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization, optimal_time_complexity, optimal_space_complexity) VALUES
('valid-parentheses-wildcard', 'logic-algorithms', 'Valid Parentheses with Wildcards',
'## Problem

Given a string `s` containing only three types of characters: `(`, `)` and `*`, return true if `s` is **valid**.

The `*` character can be treated as:
- A single left parenthesis `(`
- A single right parenthesis `)`
- An empty string `""`

## Examples

```
Input: s = "()"
Output: true
```

```
Input: s = "(*)"
Output: true
Explanation: * can be empty, (, or )
```

```
Input: s = "(*))"
Output: true
Explanation: Use * as ( to balance
```

```
Input: s = "((*))"
Output: true
```

```
Input: s = ")("
Output: false
```

## Constraints

- 1 ≤ s.length ≤ 100
- s[i] is `(`, `)` or `*`

## Your Task

Complete the function `is_valid_parentheses(s)` that returns true if the string is valid.',
'hard', 320, '["strings", "stack", "greedy", "two-pass"]', 40, 1, 'O(n)', 'O(1)');

-- ============================================================================
-- DATA STRUCTURES (HARD)
-- ============================================================================

-- LRU Cache
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization, optimal_time_complexity, optimal_space_complexity) VALUES
('lru-cache', 'data-structures', 'LRU Cache Implementation',
'## Problem

Design a data structure that follows **Least Recently Used (LRU)** cache constraints.

Implement `LRUCache` with these operations:
- `get(key)`: Return the value if key exists, otherwise return -1
- `put(key, value)`: Update or insert the key-value pair. If cache is at capacity, evict the least recently used key.

Both operations must run in **O(1)** average time.

## Examples

```
cache = LRUCache(2)  # capacity = 2
cache.put(1, 1)      # cache: {1=1}
cache.put(2, 2)      # cache: {1=1, 2=2}
cache.get(1)         # returns 1
cache.put(3, 3)      # evicts key 2, cache: {1=1, 3=3}
cache.get(2)         # returns -1 (not found)
cache.put(4, 4)      # evicts key 1, cache: {3=3, 4=4}
cache.get(1)         # returns -1
cache.get(3)         # returns 3
cache.get(4)         # returns 4
```

## Constraints

- 1 ≤ capacity ≤ 3000
- 0 ≤ key ≤ 10^4
- 0 ≤ value ≤ 10^5
- At most 2 × 10^5 calls to get and put

## Your Task

Implement a class with `__init__(capacity)`, `get(key)`, and `put(key, value)` methods.',
'hard', 400, '["hash-tables", "doubly-linked-list", "design", "cache"]', 50, 1, 'O(1)', 'O(capacity)');

-- Binary Tree Maximum Path Sum
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization, optimal_time_complexity, optimal_space_complexity) VALUES
('binary-tree-max-path', 'data-structures', 'Binary Tree Maximum Path Sum',
'## Problem

A **path** in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge. A path does not need to pass through the root.

The **path sum** is the sum of the node values in the path.

Given the `root` of a binary tree, return the **maximum path sum** of any non-empty path.

## Tree Representation

Trees are given as a list where `null` represents no node:
- `[1,2,3]` means: root=1, left=2, right=3
- `[1,2,null,3]` means: root=1, left=2 (with left child 3), no right child

## Examples

```
Input: root = [1,2,3]
Output: 6
Explanation: Path is 2 -> 1 -> 3
```

```
Input: root = [-10,9,20,null,null,15,7]
Output: 42
Explanation: Path is 15 -> 20 -> 7
```

```
Input: root = [-3]
Output: -3
```

## Constraints

- 1 ≤ number of nodes ≤ 3 × 10^4
- -1000 ≤ Node.val ≤ 1000

## Your Task

Complete `max_path_sum(root)` that takes a tree as list and returns maximum path sum.

**Note**: You''ll need to build the tree from the list first.',
'hard', 380, '["trees", "recursion", "dfs", "post-order-traversal"]', 45, 1, 'O(n)', 'O(h)');

-- Flatten Nested List Iterator
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization, optimal_time_complexity, optimal_space_complexity) VALUES
('flatten-nested-list', 'data-structures', 'Flatten Nested List Iterator',
'## Problem

Given a nested list of integers, implement an iterator to flatten it.

Each element is either:
- An integer
- A list whose elements may also be integers or other lists

The list format: `[1, [2, [3, 4]], 5]` has 5 integers when flattened: `[1, 2, 3, 4, 5]`

## Examples

```
Input: nested_list = [[1,1],2,[1,1]]
Output: [1,1,2,1,1]
Explanation: Flatten all nested lists
```

```
Input: nested_list = [1,[4,[6]]]
Output: [1,4,6]
```

```
Input: nested_list = [[]]
Output: []
Explanation: Empty nested list
```

## Constraints

- 1 ≤ nested_list.length ≤ 500
- Integer values are in range [-10^6, 10^6]
- Nesting depth ≤ 1000

## Your Task

Complete the function `flatten(nested_list)` that returns a flattened list of integers.',
'hard', 330, '["stacks", "recursion", "dfs", "iteration"]', 35, 1, 'O(n)', 'O(d)');

-- ============================================================================
-- STRING MANIPULATION (HARD)
-- ============================================================================

-- Regular Expression Matching
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization, optimal_time_complexity, optimal_space_complexity) VALUES
('regex-matching', 'string-manipulation', 'Regular Expression Matching',
'## Problem

Implement regular expression matching with support for `.` and `*` where:
- `.` matches any single character
- `*` matches zero or more of the **preceding element**

The matching should cover the **entire** input string (not partial).

## Examples

```
Input: s = "aa", pattern = "a"
Output: false
Explanation: "a" does not match entire string "aa"
```

```
Input: s = "aa", pattern = "a*"
Output: true
Explanation: * means zero or more ''a''s
```

```
Input: s = "ab", pattern = ".*"
Output: true
Explanation: .* means zero or more of any character
```

```
Input: s = "mississippi", pattern = "mis*is*p*."
Output: false
```

## Constraints

- 1 ≤ s.length ≤ 20
- 1 ≤ pattern.length ≤ 30
- s contains only lowercase English letters
- pattern contains only lowercase letters, `.`, and `*`

## Your Task

Complete `is_match(s, pattern)` that returns true if the string matches the pattern.',
'hard', 450, '["strings", "dynamic-programming", "recursion", "backtracking"]', 60, 1, 'O(m*n)', 'O(m*n)');

-- Longest Palindromic Substring
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization, optimal_time_complexity, optimal_space_complexity) VALUES
('longest-palindromic-substring', 'string-manipulation', 'Longest Palindromic Substring',
'## Problem

Given a string `s`, return the **longest palindromic substring** in `s`.

A **palindrome** is a string that reads the same forward and backward.

## Examples

```
Input: s = "babad"
Output: "bab"
Explanation: "aba" is also valid
```

```
Input: s = "cbbd"
Output: "bb"
```

```
Input: s = "racecar"
Output: "racecar"
Explanation: The entire string is a palindrome
```

```
Input: s = "ac"
Output: "a" or "c"
```

## Constraints

- 1 ≤ s.length ≤ 1000
- s consists of only lowercase and uppercase English letters

## Your Task

Complete `longest_palindrome(s)` that returns the longest palindromic substring.

If there are multiple answers, return any one.',
'hard', 370, '["strings", "dynamic-programming", "expand-from-center", "manacher"]', 45, 1, 'O(n)', 'O(n)');

-- Word Break II
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization, optimal_time_complexity, optimal_space_complexity) VALUES
('word-break-ii', 'string-manipulation', 'Word Break II',
'## Problem

Given a string `s` and a dictionary of strings `word_dict`, add spaces in `s` to construct sentences where each word is a valid dictionary word.

Return **all** possible sentences in any order.

The same word in the dictionary may be reused multiple times.

## Examples

```
Input: s = "catsanddog", word_dict = ["cat","cats","and","sand","dog"]
Output: ["cats and dog","cat sand dog"]
```

```
Input: s = "pineapplepenapple", word_dict = ["apple","pen","applepen","pine","pineapple"]
Output: ["pine apple pen apple","pineapple pen apple","pine applepen apple"]
```

```
Input: s = "catsandog", word_dict = ["cats","dog","sand","and","cat"]
Output: []
Explanation: No valid way to break the string
```

## Constraints

- 1 ≤ s.length ≤ 20
- 1 ≤ word_dict.length ≤ 1000
- 1 ≤ word_dict[i].length ≤ 10
- All words in word_dict are unique

## Your Task

Complete `word_break(s, word_dict)` that returns all possible sentences.',
'hard', 390, '["strings", "backtracking", "dynamic-programming", "memoization"]', 50, 1, 'O(2^n)', 'O(2^n)');

-- ============================================================================
-- MATH & NUMBERS (HARD)
-- ============================================================================

-- Median of Two Sorted Arrays
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization, optimal_time_complexity, optimal_space_complexity) VALUES
('median-two-sorted-arrays', 'math-numbers', 'Median of Two Sorted Arrays',
'## Problem

Given two sorted arrays `nums1` and `nums2`, return the **median** of the two sorted arrays.

The overall run time complexity should be **O(log(m+n))**.

## Examples

```
Input: nums1 = [1,3], nums2 = [2]
Output: 2.0
Explanation: Merged array = [1,2,3], median is 2
```

```
Input: nums1 = [1,2], nums2 = [3,4]
Output: 2.5
Explanation: Merged array = [1,2,3,4], median is (2+3)/2 = 2.5
```

```
Input: nums1 = [], nums2 = [1]
Output: 1.0
```

## Constraints

- 0 ≤ nums1.length, nums2.length ≤ 1000
- 1 ≤ nums1.length + nums2.length ≤ 2000
- -10^6 ≤ nums1[i], nums2[i] ≤ 10^6

## Your Task

Complete `find_median(nums1, nums2)` that returns the median as a float.

**Challenge**: Solve in O(log(m+n)) time without merging the arrays!',
'hard', 420, '["arrays", "binary-search", "divide-and-conquer", "math"]', 55, 1, 'O(log(m+n))', 'O(1)');

-- Count Primes (Sieve)
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization, optimal_time_complexity, optimal_space_complexity) VALUES
('count-primes', 'math-numbers', 'Count Primes',
'## Problem

Given an integer `n`, return the **number of prime numbers** that are strictly less than `n`.

A **prime number** is a natural number greater than 1 that has no positive divisors other than 1 and itself.

## Examples

```
Input: n = 10
Output: 4
Explanation: Primes less than 10 are [2, 3, 5, 7]
```

```
Input: n = 0
Output: 0
```

```
Input: n = 1
Output: 0
```

```
Input: n = 100
Output: 25
```

## Constraints

- 0 ≤ n ≤ 5 × 10^6

## Your Task

Complete `count_primes(n)` that returns the count of primes less than n.

**Hint**: Use the Sieve of Eratosthenes algorithm for optimal performance!',
'hard', 340, '["math", "number-theory", "sieve-of-eratosthenes", "arrays"]', 40, 1, 'O(n log log n)', 'O(n)');

-- Power Function (Fast Exponentiation)
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization, optimal_time_complexity, optimal_space_complexity) VALUES
('power-function', 'math-numbers', 'Implement Power Function',
'## Problem

Implement `pow(x, n)` which calculates `x` raised to the power `n` (i.e., x^n).

## Examples

```
Input: x = 2.0, n = 10
Output: 1024.0
```

```
Input: x = 2.1, n = 3
Output: 9.261
```

```
Input: x = 2.0, n = -2
Output: 0.25
Explanation: 2^-2 = 1/(2^2) = 1/4 = 0.25
```

```
Input: x = 1.0, n = 1000000
Output: 1.0
```

## Constraints

- -100.0 < x < 100.0
- -2^31 ≤ n ≤ 2^31 - 1
- -10^4 ≤ x^n ≤ 10^4

## Your Task

Complete `my_pow(x, n)` that calculates x^n efficiently.

**Challenge**: Solve in O(log n) time using fast exponentiation!',
'hard', 360, '["math", "recursion", "divide-and-conquer", "binary-exponentiation"]', 45, 1, 'O(log n)', 'O(log n)');

-- ============================================================================
-- GAME LOGIC (HARD)
-- ============================================================================

-- Knight Shortest Path
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization, optimal_time_complexity, optimal_space_complexity) VALUES
('knight-shortest-path', 'game-logic', 'Knight''s Shortest Path',
'## Problem

In a chess game, a knight has a unique L-shaped move: 2 squares in one direction and 1 square perpendicular.

Given:
- A chessboard of size `n × n`
- Starting position `[start_x, start_y]`
- Target position `[end_x, end_y]`

Return the **minimum number of moves** needed for the knight to reach the target.

## Examples

```
Input: n = 8, start = [0, 0], end = [7, 7]
Output: 6
Explanation: One optimal path: (0,0) -> (2,1) -> (4,2) -> (6,3) -> (7,5) -> (5,6) -> (7,7)
```

```
Input: n = 8, start = [0, 0], end = [1, 2]
Output: 1
Explanation: Knight can reach in one move
```

```
Input: n = 5, start = [2, 2], end = [2, 2]
Output: 0
Explanation: Already at target
```

## Constraints

- 3 ≤ n ≤ 100
- 0 ≤ start_x, start_y, end_x, end_y < n

## Your Task

Complete `knight_moves(n, start, end)` that returns minimum moves.

**Hint**: Use BFS to find the shortest path!',
'hard', 380, '["graphs", "bfs", "shortest-path", "game-mechanics"]', 45, 1, 'O(n²)', 'O(n²)');

-- Equipment Loadout Optimizer
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization, optimal_time_complexity, optimal_space_complexity) VALUES
('equipment-loadout', 'game-logic', 'Optimal Equipment Loadout',
'## Problem

You have a weight capacity and various equipment items. Each item has a weight and a power value.

Select items to maximize total power without exceeding weight capacity.

Input:
- `capacity`: Maximum weight you can carry
- `items`: List of `[weight, power]` pairs

## Examples

```
Input: capacity = 10, items = [[5, 60], [3, 50], [4, 70], [2, 30]]
Output: 120
Explanation: Select items with weights [3, 4] for powers [50, 70]
```

```
Input: capacity = 5, items = [[1, 10], [2, 15], [3, 40]]
Output: 55
Explanation: Select items with weights [2, 3] for powers [15, 40]
```

```
Input: capacity = 6, items = [[5, 10], [4, 40], [6, 30]]
Output: 40
Explanation: Select item with weight 4 for power 40
```

## Constraints

- 1 ≤ capacity ≤ 1000
- 1 ≤ items.length ≤ 200
- 1 ≤ weight, power ≤ 1000

## Your Task

Complete `max_loadout_power(capacity, items)` that returns maximum power achievable.

**This is the classic 0/1 Knapsack problem!**',
'hard', 400, '["dynamic-programming", "knapsack", "optimization", "game-mechanics"]', 50, 1, 'O(n*W)', 'O(n*W)');

-- Boss Battle Optimal Strategy
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization, optimal_time_complexity, optimal_space_complexity) VALUES
('boss-battle-strategy', 'game-logic', 'Boss Battle Damage Calculator',
'## Problem

You''re fighting a boss with complex damage mechanics:

1. Each attack deals base damage
2. Every 3rd attack is a **critical hit** (3x damage)
3. Boss has a shield that absorbs the first X damage each turn
4. Boss regenerates Y health every 5 turns

Given:
- `boss_health`: Boss starting HP
- `base_damage`: Your attack damage
- `shield`: Damage absorbed per turn
- `regen`: Health regenerated every 5 turns

Return the **minimum number of turns** to defeat the boss.

## Examples

```
Input: boss_health = 100, base_damage = 20, shield = 5, regen = 10
Output: 7
Explanation:
Turn 1: 20-5=15 dmg, Boss: 85
Turn 2: 20-5=15 dmg, Boss: 70
Turn 3: 60-5=55 dmg (crit), Boss: 15
Turn 4: 20-5=15 dmg, Boss: 0
```

```
Input: boss_health = 200, base_damage = 10, shield = 3, regen = 15
Output: 25
```

## Constraints

- 1 ≤ boss_health ≤ 10000
- 1 ≤ base_damage ≤ 100
- 0 ≤ shield < base_damage
- 0 ≤ regen ≤ 50

## Your Task

Complete `turns_to_defeat(boss_health, base_damage, shield, regen)` that returns minimum turns.',
'hard', 360, '["simulation", "math", "game-mechanics", "loops"]', 40, 1, 'O(n)', 'O(1)');

-- ============================================================================
-- OPTIMIZATION (HARD)
-- ============================================================================

-- Maximum Subarray Sum
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization, optimal_time_complexity, optimal_space_complexity, optimal_lines_of_code) VALUES
('maximum-subarray', 'optimization', 'Maximum Subarray Sum',
'## Problem

Given an integer array `nums`, find the **contiguous subarray** with the largest sum and return its **sum**.

## Examples

```
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: Subarray [4,-1,2,1] has the largest sum 6
```

```
Input: nums = [1]
Output: 1
```

```
Input: nums = [5,4,-1,7,8]
Output: 23
Explanation: The entire array is the maximum subarray
```

```
Input: nums = [-1,-2,-3]
Output: -1
Explanation: When all negative, return the largest single element
```

## Constraints

- 1 ≤ nums.length ≤ 10^5
- -10^4 ≤ nums[i] ≤ 10^4

## Your Task

Complete `max_subarray(nums)` that returns the maximum sum.

**Challenge**: Solve in O(n) time and O(1) space using Kadane''s Algorithm!',
'hard', 350, '["arrays", "dynamic-programming", "kadane-algorithm", "optimization"]', 40, 1, 'O(n)', 'O(1)', 8);

-- Trapping Rain Water
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization, optimal_time_complexity, optimal_space_complexity, optimal_lines_of_code) VALUES
('trapping-rain-water', 'optimization', 'Trapping Rain Water',
'## Problem

Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.

## Examples

```
Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6
Explanation: Water trapped = 6 units
```

```
Input: height = [4,2,0,3,2,5]
Output: 9
Explanation: Water fills valleys between peaks
```

```
Input: height = [3,0,2,0,4]
Output: 7
```

## Visual Example

```
height = [0,1,0,2,1,0,1,3,2,1,2,1]

       █
   █   █ █   █
 █ █ █ █ █ █ █
 0 1 0 2 1 0 1 3 2 1 2 1

Water fills 6 units total
```

## Constraints

- 1 ≤ height.length ≤ 2 × 10^4
- 0 ≤ height[i] ≤ 10^5

## Your Task

Complete `trap_water(height)` that returns units of water trapped.

**Challenge**: Solve in O(n) time and O(1) space using two pointers!',
'hard', 410, '["arrays", "two-pointers", "stack", "dynamic-programming"]', 50, 1, 'O(n)', 'O(1)', 15);

-- Minimum Window Substring
INSERT OR IGNORE INTO puzzles (id, category_id, title, description, difficulty, points, concepts, estimated_minutes, has_optimization, optimal_time_complexity, optimal_space_complexity) VALUES
('minimum-window-substring', 'optimization', 'Minimum Window Substring',
'## Problem

Given two strings `s` and `t`, return the **minimum window substring** of `s` such that every character in `t` (including duplicates) is included in the window.

If no such substring exists, return the empty string `""`.

## Examples

```
Input: s = "ADOBECODEBANC", t = "ABC"
Output: "BANC"
Explanation: Minimum window containing A, B, C
```

```
Input: s = "a", t = "a"
Output: "a"
```

```
Input: s = "a", t = "aa"
Output: ""
Explanation: t has two ''a''s but s only has one
```

```
Input: s = "ab", t = "b"
Output: "b"
```

## Constraints

- 1 ≤ s.length, t.length ≤ 10^5
- s and t consist of uppercase and lowercase English letters

## Your Task

Complete `min_window(s, t)` that returns the minimum window substring.

**Challenge**: Solve in O(m+n) time using sliding window technique!',
'hard', 440, '["strings", "sliding-window", "hash-tables", "two-pointers"]', 55, 1, 'O(m+n)', 'O(k)');

-- ============================================================================
-- HARD PUZZLE IMPLEMENTATIONS - PYTHON
-- ============================================================================

-- Merge Intervals - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('merge-intervals', 'python',
'def merge_intervals(intervals):
    """
    Merge overlapping intervals.

    Args:
        intervals: List of [start, end] pairs

    Returns:
        List of merged intervals
    """
    # Your code here
    pass
',
'def merge_intervals(intervals):
    if not intervals:
        return []

    # Sort intervals by start time
    intervals.sort(key=lambda x: x[0])

    merged = [intervals[0]]

    for current in intervals[1:]:
        last = merged[-1]

        # Check if overlapping
        if current[0] <= last[1]:
            # Merge by extending end time
            merged[-1] = [last[0], max(last[1], current[1])]
        else:
            # No overlap, add new interval
            merged.append(current)

    return merged
',
'[
  {"input": {"intervals": [[1,3],[2,6],[8,10],[15,18]]}, "expectedOutput": [[1,6],[8,10],[15,18]], "description": "Multiple overlaps"},
  {"input": {"intervals": [[1,4],[4,5]]}, "expectedOutput": [[1,5]], "description": "Edge touching"},
  {"input": {"intervals": [[1,4],[0,2],[3,5]]}, "expectedOutput": [[0,5]], "description": "Unsorted input"},
  {"input": {"intervals": [[1,4]]}, "expectedOutput": [[1,4]], "description": "Single interval", "hidden": true},
  {"input": {"intervals": [[1,4],[2,3]]}, "expectedOutput": [[1,4]], "description": "Contained interval", "hidden": true}
]',
'["First, sort intervals by start time", "Use a result list, start with first interval", "For each interval, check if it overlaps with the last merged interval", "If overlapping, extend the end time", "If not overlapping, add as new interval", "Overlaps when current_start <= last_end"]');

-- Longest Increasing Subsequence - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('longest-increasing-subsequence', 'python',
'def longest_increasing_subsequence(nums):
    """
    Find length of longest increasing subsequence.

    Args:
        nums: List of integers

    Returns:
        Length of LIS
    """
    # Your code here
    pass
',
'def longest_increasing_subsequence(nums):
    if not nums:
        return 0

    # dp[i] = length of LIS ending at index i
    dp = [1] * len(nums)

    for i in range(1, len(nums)):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)

    return max(dp)
',
'[
  {"input": {"nums": [10,9,2,5,3,7,101,18]}, "expectedOutput": 4, "description": "Standard case"},
  {"input": {"nums": [0,1,0,3,2,3]}, "expectedOutput": 4, "description": "Multiple LIS"},
  {"input": {"nums": [7,7,7,7,7]}, "expectedOutput": 1, "description": "All same"},
  {"input": {"nums": [1,3,6,7,9,4,10,5,6]}, "expectedOutput": 6, "description": "Complex case", "hidden": true},
  {"input": {"nums": [5,4,3,2,1]}, "expectedOutput": 1, "description": "Decreasing", "hidden": true}
]',
'["Use dynamic programming", "dp[i] = length of LIS ending at index i", "For each position, check all previous positions", "If nums[j] < nums[i], we can extend that subsequence", "Take maximum over all possible extensions", "Final answer is max(dp)"]');

-- Valid Parentheses Wildcard - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('valid-parentheses-wildcard', 'python',
'def is_valid_parentheses(s):
    """
    Check if parentheses string with wildcards is valid.

    Args:
        s: String containing (, ), and *

    Returns:
        True if valid, False otherwise
    """
    # Your code here
    pass
',
'def is_valid_parentheses(s):
    # Track range of possible open parentheses count
    min_open = 0  # Minimum possible open parens
    max_open = 0  # Maximum possible open parens

    for char in s:
        if char == ''('':
            min_open += 1
            max_open += 1
        elif char == '')'':
            min_open -= 1
            max_open -= 1
        else:  # *
            min_open -= 1  # Treat * as )
            max_open += 1  # Treat * as (

        # If max_open < 0, too many ) that cant be balanced
        if max_open < 0:
            return False

        # min_open cant go negative (treat extra * as empty)
        min_open = max(0, min_open)

    # Valid if we can have exactly 0 open parens
    return min_open == 0
',
'[
  {"input": {"s": "()"}, "expectedOutput": true, "description": "Simple valid"},
  {"input": {"s": "(*)"}, "expectedOutput": true, "description": "Wildcard balance"},
  {"input": {"s": "(*))"}, "expectedOutput": true, "description": "Extra close"},
  {"input": {"s": ")("}, "expectedOutput": false, "description": "Wrong order"},
  {"input": {"s": "((*))"}, "expectedOutput": true, "description": "Nested", "hidden": true},
  {"input": {"s": "***"}, "expectedOutput": true, "description": "All wildcards", "hidden": true}
]',
'["Track range of possible open parentheses counts", "Maintain min and max possible open parens", "For (, both min and max increase by 1", "For ), both decrease by 1", "For *, min decreases (treat as )), max increases (treat as ()", "If max becomes negative, impossible to balance", "Keep min >= 0 (treat extra * as empty)", "Valid if min = 0 at end"]');

-- LRU Cache - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('lru-cache', 'python',
'class LRUCache:
    def __init__(self, capacity):
        """
        Initialize LRU cache with given capacity.
        """
        # Your code here
        pass

    def get(self, key):
        """
        Get value for key. Return -1 if not found.
        """
        # Your code here
        pass

    def put(self, key, value):
        """
        Put key-value pair. Evict LRU if at capacity.
        """
        # Your code here
        pass
',
'from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key):
        if key not in self.cache:
            return -1
        # Move to end (most recently used)
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key, value):
        if key in self.cache:
            # Update and move to end
            self.cache.move_to_end(key)
        self.cache[key] = value

        if len(self.cache) > self.capacity:
            # Remove least recently used (first item)
            self.cache.popitem(last=False)
',
'[
  {"input": {"operations": ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"], "args": [[2], [1,1], [2,2], [1], [3,3], [2], [4,4], [1], [3], [4]]}, "expectedOutput": [null, null, null, 1, null, -1, null, -1, 3, 4], "description": "Standard operations"},
  {"input": {"operations": ["LRUCache", "put", "get", "put", "get", "get"], "args": [[1], [2,1], [2], [3,2], [2], [3]]}, "expectedOutput": [null, null, 1, null, -1, 2], "description": "Capacity 1"},
  {"input": {"operations": ["LRUCache", "put", "put", "put", "put", "get", "get"], "args": [[2], [2,1], [1,1], [2,3], [4,1], [1], [2]]}, "expectedOutput": [null, null, null, null, null, -1, 3], "description": "Eviction test", "hidden": true}
]',
'["Use OrderedDict which maintains insertion order", "For get: move key to end if exists", "For put: add/update key and move to end", "If over capacity, remove first item (LRU)", "OrderedDict.move_to_end() marks as recently used", "OrderedDict.popitem(last=False) removes oldest"]');

-- Binary Tree Max Path - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('binary-tree-max-path', 'python',
'def max_path_sum(root):
    """
    Find maximum path sum in binary tree.

    Args:
        root: Tree as list (e.g., [1,2,3])

    Returns:
        Maximum path sum
    """
    # Your code here
    pass
',
'class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def max_path_sum(root):
    def build_tree(arr):
        if not arr or arr[0] is None:
            return None

        root = TreeNode(arr[0])
        queue = [root]
        i = 1

        while queue and i < len(arr):
            node = queue.pop(0)

            if i < len(arr) and arr[i] is not None:
                node.left = TreeNode(arr[i])
                queue.append(node.left)
            i += 1

            if i < len(arr) and arr[i] is not None:
                node.right = TreeNode(arr[i])
                queue.append(node.right)
            i += 1

        return root

    tree = build_tree(root)
    max_sum = float(''-inf'')

    def dfs(node):
        nonlocal max_sum

        if not node:
            return 0

        # Get max path from left and right (ignore negative)
        left = max(0, dfs(node.left))
        right = max(0, dfs(node.right))

        # Path through current node
        current_max = node.val + left + right
        max_sum = max(max_sum, current_max)

        # Return max single path for parent
        return node.val + max(left, right)

    dfs(tree)
    return max_sum
',
'[
  {"input": {"root": [1,2,3]}, "expectedOutput": 6, "description": "Simple tree"},
  {"input": {"root": [-10,9,20,null,null,15,7]}, "expectedOutput": 42, "description": "Skip negative nodes"},
  {"input": {"root": [-3]}, "expectedOutput": -3, "description": "Single node"},
  {"input": {"root": [1,2]}, "expectedOutput": 3, "description": "Left child only", "hidden": true},
  {"input": {"root": [5,4,8,11,null,13,4,7,2]}, "expectedOutput": 48, "description": "Complex tree", "hidden": true}
]',
'["Build tree from list representation first", "Use DFS post-order traversal", "For each node, calculate path going through it", "Path through node = node.val + left_max + right_max", "Return single path to parent: node.val + max(left, right)", "Ignore negative paths (use max(0, path))", "Track global maximum"]');

-- Flatten Nested List - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('flatten-nested-list', 'python',
'def flatten(nested_list):
    """
    Flatten a nested list of integers.

    Args:
        nested_list: Nested list structure

    Returns:
        Flattened list of integers
    """
    # Your code here
    pass
',
'def flatten(nested_list):
    result = []

    def helper(item):
        if isinstance(item, list):
            for sub_item in item:
                helper(sub_item)
        else:
            result.append(item)

    helper(nested_list)
    return result
',
'[
  {"input": {"nested_list": [[1,1],2,[1,1]]}, "expectedOutput": [1,1,2,1,1], "description": "Mixed nesting"},
  {"input": {"nested_list": [1,[4,[6]]]}, "expectedOutput": [1,4,6], "description": "Deep nesting"},
  {"input": {"nested_list": [[]]}, "expectedOutput": [], "description": "Empty nested"},
  {"input": {"nested_list": [1,2,3]}, "expectedOutput": [1,2,3], "description": "Already flat", "hidden": true},
  {"input": {"nested_list": [[[[1]]]]}, "expectedOutput": [1], "description": "Very deep", "hidden": true}
]',
'["Use recursion to process nested structure", "Check if item is a list using isinstance()", "If list, recursively flatten each element", "If integer, add to result", "Can also use iterative approach with a stack"]');

-- Regex Matching - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('regex-matching', 'python',
'def is_match(s, pattern):
    """
    Check if string matches regex pattern.

    Args:
        s: Input string
        pattern: Pattern with . and *

    Returns:
        True if matches, False otherwise
    """
    # Your code here
    pass
',
'def is_match(s, pattern):
    m, n = len(s), len(pattern)

    # dp[i][j] = does s[0:i] match pattern[0:j]
    dp = [[False] * (n + 1) for _ in range(m + 1)]

    # Empty string matches empty pattern
    dp[0][0] = True

    # Handle patterns like a*, a*b*, etc. that can match empty
    for j in range(2, n + 1):
        if pattern[j-1] == ''*'':
            dp[0][j] = dp[0][j-2]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if pattern[j-1] == s[i-1] or pattern[j-1] == ''.'':
                # Characters match
                dp[i][j] = dp[i-1][j-1]
            elif pattern[j-1] == ''*'':
                # * can mean zero or more of previous char
                # Zero occurrence: dp[i][j-2]
                dp[i][j] = dp[i][j-2]

                # One or more occurrence
                if pattern[j-2] == s[i-1] or pattern[j-2] == ''.'':
                    dp[i][j] = dp[i][j] or dp[i-1][j]

    return dp[m][n]
',
'[
  {"input": {"s": "aa", "pattern": "a"}, "expectedOutput": false, "description": "Pattern too short"},
  {"input": {"s": "aa", "pattern": "a*"}, "expectedOutput": true, "description": "Star repeats"},
  {"input": {"s": "ab", "pattern": ".*"}, "expectedOutput": true, "description": "Dot star matches all"},
  {"input": {"s": "mississippi", "pattern": "mis*is*p*."}, "expectedOutput": false, "description": "Complex mismatch"},
  {"input": {"s": "aab", "pattern": "c*a*b"}, "expectedOutput": true, "description": "Multiple stars", "hidden": true}
]',
'["Use dynamic programming", "dp[i][j] = does s[0:i] match pattern[0:j]", "Base case: empty string matches empty pattern", "Handle * in pattern matching empty (j-2)", "If current chars match or pattern has ., check dp[i-1][j-1]", "If pattern has *, can match zero (dp[i][j-2]) or more (dp[i-1][j])", "Build table bottom-up"]');

-- Longest Palindromic Substring - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('longest-palindromic-substring', 'python',
'def longest_palindrome(s):
    """
    Find longest palindromic substring.

    Args:
        s: Input string

    Returns:
        Longest palindromic substring
    """
    # Your code here
    pass
',
'def longest_palindrome(s):
    if not s:
        return ""

    start = 0
    max_len = 0

    def expand_around_center(left, right):
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return right - left - 1

    for i in range(len(s)):
        # Odd length palindrome (single center)
        len1 = expand_around_center(i, i)
        # Even length palindrome (two centers)
        len2 = expand_around_center(i, i + 1)

        current_max = max(len1, len2)

        if current_max > max_len:
            max_len = current_max
            start = i - (current_max - 1) // 2

    return s[start:start + max_len]
',
'[
  {"input": {"s": "babad"}, "expectedOutput": "bab", "description": "Multiple answers"},
  {"input": {"s": "cbbd"}, "expectedOutput": "bb", "description": "Even length"},
  {"input": {"s": "racecar"}, "expectedOutput": "racecar", "description": "Entire string"},
  {"input": {"s": "ac"}, "expectedOutput": "a", "description": "Single char"},
  {"input": {"s": "abcba"}, "expectedOutput": "abcba", "description": "Odd palindrome", "hidden": true}
]',
'["Expand around center approach", "For each position, try as palindrome center", "Check both odd-length (single center) and even-length (two centers)", "Expand outward while characters match", "Track longest palindrome found", "Return substring using start position and length"]');

-- Word Break II - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('word-break-ii', 'python',
'def word_break(s, word_dict):
    """
    Find all possible word breaks.

    Args:
        s: Input string
        word_dict: List of valid words

    Returns:
        List of all possible sentences
    """
    # Your code here
    pass
',
'def word_break(s, word_dict):
    word_set = set(word_dict)
    memo = {}

    def backtrack(start):
        if start in memo:
            return memo[start]

        if start == len(s):
            return [[]]

        sentences = []

        for end in range(start + 1, len(s) + 1):
            word = s[start:end]
            if word in word_set:
                # Recursively get sentences for remaining string
                for sentence in backtrack(end):
                    sentences.append([word] + sentence)

        memo[start] = sentences
        return sentences

    result = backtrack(0)
    return [" ".join(sentence) for sentence in result]
',
'[
  {"input": {"s": "catsanddog", "word_dict": ["cat","cats","and","sand","dog"]}, "expectedOutput": ["cats and dog","cat sand dog"], "description": "Multiple solutions"},
  {"input": {"s": "pineapplepenapple", "word_dict": ["apple","pen","applepen","pine","pineapple"]}, "expectedOutput": ["pine apple pen apple","pineapple pen apple","pine applepen apple"], "description": "Many combinations"},
  {"input": {"s": "catsandog", "word_dict": ["cats","dog","sand","and","cat"]}, "expectedOutput": [], "description": "No solution"},
  {"input": {"s": "a", "word_dict": ["a"]}, "expectedOutput": ["a"], "description": "Single char", "hidden": true}
]',
'["Use backtracking with memoization", "Try each possible word from current position", "If word is in dictionary, recursively solve rest", "Memoize results for each starting position", "Build sentences by combining word + remaining sentences", "Convert list of words to space-separated string"]');

-- Median Two Sorted Arrays - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('median-two-sorted-arrays', 'python',
'def find_median(nums1, nums2):
    """
    Find median of two sorted arrays.

    Args:
        nums1: First sorted array
        nums2: Second sorted array

    Returns:
        Median as float
    """
    # Your code here
    pass
',
'def find_median(nums1, nums2):
    # Ensure nums1 is smaller
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1

    m, n = len(nums1), len(nums2)
    total = m + n
    half = total // 2

    left, right = 0, m

    while left <= right:
        i = (left + right) // 2
        j = half - i

        # Get boundary values
        nums1_left = nums1[i-1] if i > 0 else float(''-inf'')
        nums1_right = nums1[i] if i < m else float(''inf'')
        nums2_left = nums2[j-1] if j > 0 else float(''-inf'')
        nums2_right = nums2[j] if j < n else float(''inf'')

        # Check if partition is correct
        if nums1_left <= nums2_right and nums2_left <= nums1_right:
            # Found correct partition
            if total % 2 == 0:
                return (max(nums1_left, nums2_left) + min(nums1_right, nums2_right)) / 2
            else:
                return min(nums1_right, nums2_right)
        elif nums1_left > nums2_right:
            right = i - 1
        else:
            left = i + 1

    return 0.0
',
'[
  {"input": {"nums1": [1,3], "nums2": [2]}, "expectedOutput": 2.0, "description": "Odd total"},
  {"input": {"nums1": [1,2], "nums2": [3,4]}, "expectedOutput": 2.5, "description": "Even total"},
  {"input": {"nums1": [], "nums2": [1]}, "expectedOutput": 1.0, "description": "Empty array"},
  {"input": {"nums1": [2], "nums2": []}, "expectedOutput": 2.0, "description": "Other empty", "hidden": true},
  {"input": {"nums1": [1,2], "nums2": [1,2]}, "expectedOutput": 1.5, "description": "Duplicates", "hidden": true}
]',
'["Use binary search on smaller array", "Partition both arrays into left and right halves", "Left half has (m+n+1)//2 elements total", "Find partition where max(left) <= min(right)", "If odd length, median is min(right)", "If even length, median is (max(left) + min(right)) / 2", "Adjust partition based on comparison"]');

-- Count Primes - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('count-primes', 'python',
'def count_primes(n):
    """
    Count prime numbers less than n.

    Args:
        n: Upper limit (exclusive)

    Returns:
        Count of primes
    """
    # Your code here
    pass
',
'def count_primes(n):
    if n <= 2:
        return 0

    # Sieve of Eratosthenes
    is_prime = [True] * n
    is_prime[0] = is_prime[1] = False

    i = 2
    while i * i < n:
        if is_prime[i]:
            # Mark all multiples as not prime
            for j in range(i * i, n, i):
                is_prime[j] = False
        i += 1

    return sum(is_prime)
',
'[
  {"input": {"n": 10}, "expectedOutput": 4, "description": "Small n"},
  {"input": {"n": 0}, "expectedOutput": 0, "description": "Zero"},
  {"input": {"n": 1}, "expectedOutput": 0, "description": "One"},
  {"input": {"n": 100}, "expectedOutput": 25, "description": "Larger n"},
  {"input": {"n": 2}, "expectedOutput": 0, "description": "Edge case", "hidden": true}
]',
'["Use Sieve of Eratosthenes algorithm", "Create boolean array, assume all numbers are prime", "Mark 0 and 1 as not prime", "For each prime i, mark all multiples as not prime", "Start marking from i*i (earlier multiples already marked)", "Count remaining True values"]');

-- Power Function - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('power-function', 'python',
'def my_pow(x, n):
    """
    Calculate x raised to power n.

    Args:
        x: Base
        n: Exponent (can be negative)

    Returns:
        x^n as float
    """
    # Your code here
    pass
',
'def my_pow(x, n):
    if n == 0:
        return 1.0

    if n < 0:
        x = 1 / x
        n = -n

    def fast_pow(base, exp):
        if exp == 0:
            return 1.0

        half = fast_pow(base, exp // 2)

        if exp % 2 == 0:
            return half * half
        else:
            return half * half * base

    return fast_pow(x, n)
',
'[
  {"input": {"x": 2.0, "n": 10}, "expectedOutput": 1024.0, "description": "Positive power"},
  {"input": {"x": 2.1, "n": 3}, "expectedOutput": 9.261, "description": "Decimal base"},
  {"input": {"x": 2.0, "n": -2}, "expectedOutput": 0.25, "description": "Negative power"},
  {"input": {"x": 1.0, "n": 1000000}, "expectedOutput": 1.0, "description": "Large exponent"},
  {"input": {"x": 2.0, "n": 0}, "expectedOutput": 1.0, "description": "Zero exponent", "hidden": true}
]',
'["Use fast exponentiation (binary exponentiation)", "Handle negative exponent: convert to 1/x with positive n", "Recursively calculate pow(x, n//2)", "If n is even: result = half * half", "If n is odd: result = half * half * x", "This reduces O(n) to O(log n)"]');

-- Knight Shortest Path - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('knight-shortest-path', 'python',
'def knight_moves(n, start, end):
    """
    Find minimum knight moves on chessboard.

    Args:
        n: Board size (n x n)
        start: [x, y] starting position
        end: [x, y] target position

    Returns:
        Minimum number of moves
    """
    # Your code here
    pass
',
'from collections import deque

def knight_moves(n, start, end):
    if start == end:
        return 0

    # 8 possible knight moves
    moves = [
        (2, 1), (2, -1), (-2, 1), (-2, -1),
        (1, 2), (1, -2), (-1, 2), (-1, -2)
    ]

    visited = set()
    queue = deque([(start[0], start[1], 0)])  # (x, y, distance)
    visited.add((start[0], start[1]))

    while queue:
        x, y, dist = queue.popleft()

        for dx, dy in moves:
            nx, ny = x + dx, y + dy

            if nx == end[0] and ny == end[1]:
                return dist + 1

            if 0 <= nx < n and 0 <= ny < n and (nx, ny) not in visited:
                visited.add((nx, ny))
                queue.append((nx, ny, dist + 1))

    return -1
',
'[
  {"input": {"n": 8, "start": [0, 0], "end": [7, 7]}, "expectedOutput": 6, "description": "Corner to corner"},
  {"input": {"n": 8, "start": [0, 0], "end": [1, 2]}, "expectedOutput": 1, "description": "One move"},
  {"input": {"n": 5, "start": [2, 2], "end": [2, 2]}, "expectedOutput": 0, "description": "Same position"},
  {"input": {"n": 8, "start": [0, 0], "end": [2, 1]}, "expectedOutput": 1, "description": "Knight move", "hidden": true},
  {"input": {"n": 8, "start": [0, 0], "end": [4, 4]}, "expectedOutput": 4, "description": "Multiple moves", "hidden": true}
]',
'["Use BFS for shortest path", "Knight has 8 possible L-shaped moves", "Start from initial position with distance 0", "For each position, try all 8 moves", "Check if new position is target", "Track visited positions to avoid cycles", "Return distance when target is reached"]');

-- Equipment Loadout - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('equipment-loadout', 'python',
'def max_loadout_power(capacity, items):
    """
    Find maximum power within weight capacity.

    Args:
        capacity: Maximum weight
        items: List of [weight, power] pairs

    Returns:
        Maximum achievable power
    """
    # Your code here
    pass
',
'def max_loadout_power(capacity, items):
    n = len(items)
    # dp[i][w] = max power using first i items with capacity w
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        weight, power = items[i-1]

        for w in range(capacity + 1):
            # Dont take item i
            dp[i][w] = dp[i-1][w]

            # Take item i if it fits
            if weight <= w:
                dp[i][w] = max(dp[i][w], dp[i-1][w-weight] + power)

    return dp[n][capacity]
',
'[
  {"input": {"capacity": 10, "items": [[5, 60], [3, 50], [4, 70], [2, 30]]}, "expectedOutput": 120, "description": "Standard knapsack"},
  {"input": {"capacity": 5, "items": [[1, 10], [2, 15], [3, 40]]}, "expectedOutput": 55, "description": "Take two items"},
  {"input": {"capacity": 6, "items": [[5, 10], [4, 40], [6, 30]]}, "expectedOutput": 40, "description": "Take best single"},
  {"input": {"capacity": 50, "items": [[10, 60], [20, 100], [30, 120]]}, "expectedOutput": 220, "description": "All items fit", "hidden": true}
]',
'["This is the 0/1 Knapsack problem", "Use dynamic programming", "dp[i][w] = max power using first i items with capacity w", "For each item, choose to take it or not", "If taking: power = dp[i-1][w-weight] + current_power", "If not taking: power = dp[i-1][w]", "Take maximum of both choices"]');

-- Boss Battle Strategy - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('boss-battle-strategy', 'python',
'def turns_to_defeat(boss_health, base_damage, shield, regen):
    """
    Calculate turns needed to defeat boss.

    Args:
        boss_health: Boss HP
        base_damage: Your damage per turn
        shield: Damage absorbed per turn
        regen: Health regenerated every 5 turns

    Returns:
        Number of turns to defeat
    """
    # Your code here
    pass
',
'def turns_to_defeat(boss_health, base_damage, shield, regen):
    current_health = boss_health
    turn = 0

    while current_health > 0:
        turn += 1

        # Calculate damage this turn
        if turn % 3 == 0:
            # Critical hit
            damage = base_damage * 3
        else:
            # Normal attack
            damage = base_damage

        # Apply shield reduction
        actual_damage = max(0, damage - shield)
        current_health -= actual_damage

        # Check if boss is defeated before regen
        if current_health <= 0:
            break

        # Boss regenerates every 5 turns
        if turn % 5 == 0:
            current_health += regen

    return turn
',
'[
  {"input": {"boss_health": 100, "base_damage": 20, "shield": 5, "regen": 10}, "expectedOutput": 7, "description": "With crits and regen"},
  {"input": {"boss_health": 50, "base_damage": 20, "shield": 0, "regen": 0}, "expectedOutput": 3, "description": "Simple case"},
  {"input": {"boss_health": 200, "base_damage": 10, "shield": 3, "regen": 15}, "expectedOutput": 25, "description": "High regen"},
  {"input": {"boss_health": 60, "base_damage": 25, "shield": 5, "regen": 5}, "expectedOutput": 3, "description": "Crit kills", "hidden": true}
]',
'["Simulate the battle turn by turn", "Every 3rd turn is critical hit (3x damage)", "Subtract shield from damage each turn", "Every 5th turn, boss regenerates health", "Check if boss is defeated after damage, before regen", "Continue until boss health <= 0"]');

-- Maximum Subarray - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('maximum-subarray', 'python',
'def max_subarray(nums):
    """
    Find maximum subarray sum.

    Args:
        nums: List of integers

    Returns:
        Maximum sum
    """
    # Your code here
    pass
',
'def max_subarray(nums):
    max_sum = nums[0]
    current_sum = nums[0]

    for i in range(1, len(nums)):
        # Either extend current subarray or start new one
        current_sum = max(nums[i], current_sum + nums[i])
        max_sum = max(max_sum, current_sum)

    return max_sum
',
'[
  {"input": {"nums": [-2,1,-3,4,-1,2,1,-5,4]}, "expectedOutput": 6, "description": "Classic case"},
  {"input": {"nums": [1]}, "expectedOutput": 1, "description": "Single element"},
  {"input": {"nums": [5,4,-1,7,8]}, "expectedOutput": 23, "description": "All positive"},
  {"input": {"nums": [-1,-2,-3]}, "expectedOutput": -1, "description": "All negative"},
  {"input": {"nums": [-2,-1]}, "expectedOutput": -1, "description": "Two negatives", "hidden": true}
]',
'["Use Kadane''s Algorithm", "Track current_sum and max_sum", "For each element, decide: extend current subarray or start new", "current_sum = max(nums[i], current_sum + nums[i])", "Update max_sum if current_sum is larger", "O(n) time, O(1) space"]');

-- Trapping Rain Water - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('trapping-rain-water', 'python',
'def trap_water(height):
    """
    Calculate trapped rain water.

    Args:
        height: List of bar heights

    Returns:
        Units of water trapped
    """
    # Your code here
    pass
',
'def trap_water(height):
    if not height:
        return 0

    left, right = 0, len(height) - 1
    left_max, right_max = 0, 0
    water = 0

    while left < right:
        if height[left] < height[right]:
            if height[left] >= left_max:
                left_max = height[left]
            else:
                water += left_max - height[left]
            left += 1
        else:
            if height[right] >= right_max:
                right_max = height[right]
            else:
                water += right_max - height[right]
            right -= 1

    return water
',
'[
  {"input": {"height": [0,1,0,2,1,0,1,3,2,1,2,1]}, "expectedOutput": 6, "description": "Standard case"},
  {"input": {"height": [4,2,0,3,2,5]}, "expectedOutput": 9, "description": "Valley between peaks"},
  {"input": {"height": [3,0,2,0,4]}, "expectedOutput": 7, "description": "Multiple valleys"},
  {"input": {"height": [2,0,2]}, "expectedOutput": 2, "description": "Simple trap", "hidden": true},
  {"input": {"height": [5,4,3,2,1]}, "expectedOutput": 0, "description": "No trap possible", "hidden": true}
]',
'["Use two pointers from both ends", "Track left_max and right_max heights", "Move pointer with smaller height", "Water at position = min(left_max, right_max) - height", "If current height >= max, update max", "Otherwise, add trapped water", "O(n) time, O(1) space"]');

-- Minimum Window Substring - Python
INSERT OR IGNORE INTO puzzle_implementations (puzzle_id, language_id, starter_code, solution_code, test_cases, hints) VALUES
('minimum-window-substring', 'python',
'def min_window(s, t):
    """
    Find minimum window substring containing all chars of t.

    Args:
        s: Source string
        t: Target string

    Returns:
        Minimum window substring
    """
    # Your code here
    pass
',
'def min_window(s, t):
    if not s or not t:
        return ""

    from collections import Counter

    # Count characters in t
    target_count = Counter(t)
    required = len(target_count)

    left, right = 0, 0
    formed = 0  # Number of unique chars in window with desired frequency
    window_counts = {}

    # (window_length, left, right)
    ans = float(''inf''), None, None

    while right < len(s):
        # Add character from right
        char = s[right]
        window_counts[char] = window_counts.get(char, 0) + 1

        # Check if frequency matches
        if char in target_count and window_counts[char] == target_count[char]:
            formed += 1

        # Try to contract window from left
        while left <= right and formed == required:
            char = s[left]

            # Update result if smaller window
            if right - left + 1 < ans[0]:
                ans = (right - left + 1, left, right)

            # Remove from left
            window_counts[char] -= 1
            if char in target_count and window_counts[char] < target_count[char]:
                formed -= 1

            left += 1

        right += 1

    return "" if ans[0] == float(''inf'') else s[ans[1]:ans[2] + 1]
',
'[
  {"input": {"s": "ADOBECODEBANC", "t": "ABC"}, "expectedOutput": "BANC", "description": "Standard case"},
  {"input": {"s": "a", "t": "a"}, "expectedOutput": "a", "description": "Single char"},
  {"input": {"s": "a", "t": "aa"}, "expectedOutput": "", "description": "Not enough chars"},
  {"input": {"s": "ab", "t": "b"}, "expectedOutput": "b", "description": "Simple match"},
  {"input": {"s": "abc", "t": "cba"}, "expectedOutput": "abc", "description": "Entire string", "hidden": true}
]',
'["Use sliding window technique", "Count characters needed from t", "Expand window by moving right pointer", "When all chars are included, try to shrink from left", "Track minimum window that satisfies condition", "Use two hashmaps: one for target, one for window", "formed variable tracks how many unique chars match required frequency"]');