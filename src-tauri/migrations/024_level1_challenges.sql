-- Migration 024: Level 1 Coding Challenges
-- Multiple choice coding questions for skill checks
-- Challenge types: basic_attack (general), spell (magic), heal (restoration), defend (protection)

-- ============================================================================
-- STRENGTH CHALLENGES - Physical problem solving, algorithms, optimization
-- ============================================================================

INSERT INTO dungeon_challenges (id, difficulty, action_type, title, description, choices, correct_answer, min_floor, max_floor) VALUES
('str_basic_1', 'easy', 'basic_attack', 'Breaking Down Barriers',
'What is the time complexity of searching for an element in an unsorted array?

def search(arr, target):
    for item in arr:
        if item == target:
            return True
    return False',
'["A) O(1)", "B) O(log n)", "C) O(n)", "D) O(n²)"]',
'C', 1, 3),

('str_basic_2', 'easy', 'basic_attack', 'Raw Force',
'Which sorting algorithm would you use to sort an already nearly-sorted array most efficiently?

A) Bubble Sort
B) Quick Sort
C) Merge Sort
D) Insertion Sort',
'["A) Bubble Sort", "B) Quick Sort", "C) Merge Sort", "D) Insertion Sort"]',
'D', 1, 3),

('str_basic_3', 'medium', 'basic_attack', 'Heavy Lifting',
'What will this code output?

nums = [1, 2, 3, 4, 5]
result = sum([x * 2 for x in nums if x % 2 == 0])
print(result)',
'["A) 12", "B) 10", "C) 30", "D) 6"]',
'A', 1, 3),

('str_basic_4', 'medium', 'basic_attack', 'Moving Obstacles',
'Which data structure would be most efficient for implementing an undo feature in a text editor?

A) Array
B) Hash Map
C) Stack
D) Queue',
'["A) Array", "B) Hash Map", "C) Stack", "D) Queue"]',
'C', 1, 3),

('str_basic_5', 'hard', 'basic_attack', 'Maximum Strength',
'What is the space complexity of this recursive function?

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)',
'["A) O(1)", "B) O(n)", "C) O(2^n)", "D) O(log n)"]',
'B', 1, 3);

-- ============================================================================
-- DEXTERITY CHALLENGES - Quick thinking, syntax, debugging, reflex
-- ============================================================================

INSERT INTO dungeon_challenges (id, difficulty, action_type, title, description, choices, correct_answer, min_floor, max_floor) VALUES
('dex_basic_1', 'easy', 'basic_attack', 'Quick Reflexes',
'What is the output of this code?

x = [1, 2, 3]
y = x
y.append(4)
print(len(x))',
'["A) 3", "B) 4", "C) Error", "D) None"]',
'B', 1, 3),

('dex_basic_2', 'easy', 'basic_attack', 'Swift Movement',
'Which operator checks if two variables refer to the same object in memory in Python?

A) ==
B) is
C) ===
D) equals',
'["A) ==", "B) is", "C) ===", "D) equals"]',
'B', 1, 3),

('dex_basic_3', 'medium', 'basic_attack', 'Dodging Errors',
'What will happen when this code runs?

def greet(name="World"):
    return f"Hello, {name}!"

print(greet())',
'["A) Error", "B) Hello, !", "C) Hello, World!", "D) Hello, name!"]',
'C', 1, 3),

('dex_basic_4', 'medium', 'basic_attack', 'Precise Strike',
'What is the bug in this code?

def get_evens(numbers):
    evens = []
    for i in range(len(numbers)):
        if numbers[i] % 2 = 0:
            evens.append(numbers[i])
    return evens',
'["A) range should be range(numbers)", "B) Should use == not =", "C) append syntax is wrong", "D) No bug"]',
'B', 1, 3),

('dex_basic_5', 'hard', 'basic_attack', 'Lightning Speed',
'What does this list comprehension do?

result = [x for x in range(10) if x % 2 == 0 if x % 3 == 0]',
'["A) Numbers divisible by 2 OR 3", "B) Numbers divisible by 2 AND 3", "C) Numbers divisible by 6", "D) B and C are both correct"]',
'D', 1, 3);

-- ============================================================================
-- INTELLIGENCE CHALLENGES - Logic puzzles, patterns, algorithms
-- ============================================================================

INSERT INTO dungeon_challenges (id, difficulty, action_type, title, description, choices, correct_answer, min_floor, max_floor) VALUES
('int_basic_1', 'easy', 'basic_attack', 'Pattern Recognition',
'What will this code print?

for i in range(3):
    for j in range(i):
        print("*", end="")
    print()',
'["A) ***", "B) *\n**\n***", "C) \n*\n**", "D) **\n***\n****"]',
'C', 1, 3),

('int_basic_2', 'easy', 'basic_attack', 'Logical Deduction',
'Which of these correctly checks if a number is between 10 and 20 (inclusive)?

A) if x >= 10 and x <= 20
B) if 10 <= x <= 20
C) if x in range(10, 21)
D) All of the above',
'["A) if x >= 10 and x <= 20", "B) if 10 <= x <= 20", "C) if x in range(10, 21)", "D) All of the above"]',
'D', 1, 3),

('int_basic_3', 'medium', 'basic_attack', 'Code Analysis',
'What is the final value of count?

count = 0
for i in range(5):
    if i % 2 == 1:
        count += i
print(count)',
'["A) 4", "B) 6", "C) 10", "D) 5"]',
'A', 1, 3),

('int_basic_4', 'medium', 'basic_attack', 'Secret Mechanisms',
'What does this function return for mystery(16)?

def mystery(n):
    count = 0
    while n > 1:
        n = n // 2
        count += 1
    return count',
'["A) 3", "B) 4", "C) 5", "D) 16"]',
'B', 1, 3),

('int_basic_5', 'hard', 'basic_attack', 'Master Puzzle',
'What will this code output?

def func(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 2:
        return 1
    memo[n] = func(n-1, memo) + func(n-2, memo)
    return memo[n]

print(func(5))',
'["A) 3", "B) 5", "C) 8", "D) 13"]',
'B', 1, 3);

-- ============================================================================
-- CHARISMA CHALLENGES - Code readability, best practices, communication
-- ============================================================================

INSERT INTO dungeon_challenges (id, difficulty, action_type, title, description, choices, correct_answer, min_floor, max_floor) VALUES
('cha_basic_1', 'easy', 'basic_attack', 'Clear Communication',
'Which variable name follows Python naming conventions best?

A) UserName
B) user_name
C) userName
D) username',
'["A) UserName", "B) user_name", "C) userName", "D) username"]',
'B', 1, 3),

('cha_basic_2', 'easy', 'basic_attack', 'Code Charm',
'What is the Pythonic way to swap two variables?

A) temp = a; a = b; b = temp
B) a, b = b, a
C) swap(a, b)
D) a = a + b; b = a - b; a = a - b',
'["A) temp = a; a = b; b = temp", "B) a, b = b, a", "C) swap(a, b)", "D) a = a + b; b = a - b; a = a - b"]',
'B', 1, 3),

('cha_basic_3', 'medium', 'basic_attack', 'Persuasive Code',
'Which is the most readable way to check if a string is empty?

A) if len(s) == 0:
B) if s == "":
C) if not s:
D) All are equally readable',
'["A) if len(s) == 0:", "B) if s == \"\":", "C) if not s:", "D) All are equally readable"]',
'C', 1, 3),

('cha_basic_4', 'medium', 'basic_attack', 'Social Engineering',
'What is the most Pythonic way to iterate over a list with indices?

A) for i in range(len(items)): print(i, items[i])
B) for i, item in enumerate(items): print(i, item)
C) i = 0; for item in items: print(i, item); i += 1
D) for item in items: print(items.index(item), item)',
'["A) for i in range(len(items)): print(i, items[i])", "B) for i, item in enumerate(items): print(i, item)", "C) i = 0; for item in items: print(i, item); i += 1", "D) for item in items: print(items.index(item), item)"]',
'B', 1, 3),

('cha_basic_5', 'hard', 'basic_attack', 'Master Diplomat',
'Which code snippet best demonstrates the Single Responsibility Principle?

A) A class that handles database, validation, and logging
B) Separate classes for database, validation, and logging
C) One function that does everything
D) Global variables for shared state',
'["A) A class that handles database, validation, and logging", "B) Separate classes for database, validation, and logging", "C) One function that does everything", "D) Global variables for shared state"]',
'B', 1, 3);

-- ============================================================================
-- ADDITIONAL VARIETY CHALLENGES
-- ============================================================================

INSERT INTO dungeon_challenges (id, difficulty, action_type, title, description, choices, correct_answer, min_floor, max_floor) VALUES
-- More Strength
('str_adv_1', 'medium', 'basic_attack', 'Breaking Barriers',
'What is the output?

def modify_list(lst):
    lst.append(4)
    lst = [1, 2, 3]

nums = [1, 2]
modify_list(nums)
print(len(nums))',
'["A) 2", "B) 3", "C) 4", "D) Error"]',
'B', 1, 3),

-- More Dexterity
('dex_adv_1', 'medium', 'basic_attack', 'Quick Fingers',
'What is the output?

x = "hello"
y = x.replace("l", "L")
print(x, y)',
'["A) heLLo heLLo", "B) hello heLLo", "C) heLLo hello", "D) hello hello"]',
'B', 1, 3),

-- More Intelligence
('int_adv_1', 'medium', 'basic_attack', 'Clever Solution',
'What algorithm does this implement?

def algo(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = algo(arr[:mid])
    right = algo(arr[mid:])
    return merge(left, right)',
'["A) Quick Sort", "B) Merge Sort", "C) Bubble Sort", "D) Insertion Sort"]',
'B', 1, 3),

-- More Charisma
('cha_adv_1', 'medium', 'basic_attack', 'Elegant Expression',
'Which is the most Pythonic way to create a dictionary from two lists?

keys = ["a", "b", "c"]
values = [1, 2, 3]',
'["A) {k: v for k, v in zip(keys, values)}", "B) dict(zip(keys, values))", "C) Both A and B are good", "D) for loop with dict[key] = value"]',
'C', 1, 3),

-- Cross-skill challenges
('mixed_1', 'easy', 'basic_attack', 'Fundamental Knowledge',
'What is the difference between a list and a tuple in Python?

A) Lists are mutable, tuples are immutable
B) Tuples are faster than lists
C) Lists use [], tuples use ()
D) All of the above',
'["A) Lists are mutable, tuples are immutable", "B) Tuples are faster than lists", "C) Lists use [], tuples use ()", "D) All of the above"]',
'D', 1, 3),

('mixed_2', 'medium', 'basic_attack', 'Data Structures',
'When should you use a set instead of a list in Python?

A) When you need ordered elements
B) When you need unique elements and don''t care about order
C) When you need to access elements by index
D) When you need to store key-value pairs',
'["A) When you need ordered elements", "B) When you need unique elements and don''t care about order", "C) When you need to access elements by index", "D) When you need to store key-value pairs"]',
'B', 1, 3),

('mixed_3', 'hard', 'basic_attack', 'Advanced Concepts',
'What is a closure in Python?

A) A way to close files
B) A function that references variables from its enclosing scope
C) A type of loop
D) A method to end a program',
'["A) A way to close files", "B) A function that references variables from its enclosing scope", "C) A type of loop", "D) A method to end a program"]',
'B', 1, 3);

-- Update success rates to 0.0 for new challenges
UPDATE dungeon_challenges SET times_used = 0, success_rate = 0.0 WHERE min_floor = 1;
