# **Coding Puzzles Module - Specification**

## **Overview**

Create a standalone puzzle system separate from the main course structure. Puzzles are coding challenges that test problem-solving skills and reinforce learned concepts. Users can solve the same puzzle in multiple languages.

---

## **Database Schema**

### **New Tables**

```sql
-- Puzzle categories/types
CREATE TABLE IF NOT EXISTS puzzle_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    order_index INTEGER
);

-- Individual puzzles
CREATE TABLE IF NOT EXISTS puzzles (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,  -- Markdown format
    difficulty TEXT NOT NULL,   -- 'easy', 'medium', 'hard', 'expert'
    points INTEGER DEFAULT 100,
    
    -- Metadata
    concepts TEXT,              -- JSON array of concept IDs
    estimated_minutes INTEGER,
    solve_count INTEGER DEFAULT 0,  -- How many users solved it
    average_time INTEGER,       -- Average solve time in seconds
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Optimization challenges (optional)
    has_optimization BOOLEAN DEFAULT FALSE,
    optimal_time_complexity TEXT,      -- e.g., "O(n)"
    optimal_space_complexity TEXT,     -- e.g., "O(1)"
    optimal_lines_of_code INTEGER,     -- For code golf
    
    FOREIGN KEY (category_id) REFERENCES puzzle_categories(id)
);

-- Language-specific puzzle implementations
CREATE TABLE IF NOT EXISTS puzzle_implementations (
    id INTEGER PRIMARY KEY,
    puzzle_id TEXT NOT NULL,
    language_id TEXT NOT NULL,
    
    -- Code templates
    starter_code TEXT,
    solution_code TEXT,
    
    -- Testing
    test_cases TEXT NOT NULL,  -- JSON array of test cases
    hidden_tests TEXT,         -- JSON array of tests not shown to user
    
    -- Hints
    hints TEXT,                -- JSON array of hints
    
    FOREIGN KEY (puzzle_id) REFERENCES puzzles(id),
    FOREIGN KEY (language_id) REFERENCES languages(id),
    UNIQUE(puzzle_id, language_id)
);

-- User puzzle progress
CREATE TABLE IF NOT EXISTS user_puzzle_progress (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    puzzle_id TEXT NOT NULL,
    language_id TEXT NOT NULL,
    
    -- Progress
    status TEXT DEFAULT 'not_started',  -- 'not_started', 'attempted', 'solved', 'optimized'
    attempts INTEGER DEFAULT 0,
    hints_used INTEGER DEFAULT 0,
    
    -- Solution data
    user_solution TEXT,
    solve_time INTEGER,         -- Seconds taken to solve
    solution_lines INTEGER,     -- Lines of code in solution
    
    -- Timestamps
    first_attempt_at TIMESTAMP,
    solved_at TIMESTAMP,
    
    -- Optimization
    is_optimal BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (puzzle_id) REFERENCES puzzles(id),
    FOREIGN KEY (language_id) REFERENCES languages(id),
    UNIQUE(user_id, puzzle_id, language_id)
);

-- Puzzle leaderboards (fastest/shortest solutions)
CREATE TABLE IF NOT EXISTS puzzle_leaderboard (
    id INTEGER PRIMARY KEY,
    puzzle_id TEXT NOT NULL,
    language_id TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    
    metric TEXT NOT NULL,      -- 'time' or 'lines'
    value INTEGER NOT NULL,
    solution_code TEXT,
    achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (puzzle_id) REFERENCES puzzles(id),
    FOREIGN KEY (language_id) REFERENCES languages(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Daily puzzle challenge
CREATE TABLE IF NOT EXISTS daily_puzzles (
    id INTEGER PRIMARY KEY,
    puzzle_id TEXT NOT NULL,
    date DATE NOT NULL UNIQUE,
    bonus_points INTEGER DEFAULT 50,  -- Extra points for daily completion
    
    FOREIGN KEY (puzzle_id) REFERENCES puzzles(id)
);

-- Puzzle achievements
CREATE TABLE IF NOT EXISTS puzzle_achievements (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    requirement_type TEXT,     -- 'count', 'streak', 'difficulty', 'language', 'optimization'
    requirement_value INTEGER,
    xp_reward INTEGER
);

CREATE TABLE IF NOT EXISTS user_puzzle_achievements (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    achievement_id TEXT NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (achievement_id) REFERENCES puzzle_achievements(id),
    UNIQUE(user_id, achievement_id)
);
```

---

## **Puzzle Categories**

### **Category 1: Logic & Algorithms**
```json
{
    "id": "logic-algorithms",
    "name": "Logic & Algorithms",
    "description": "Fundamental problem-solving and algorithmic thinking",
    "icon": "🧠",
    "order_index": 1
}
```

**Example Puzzles:**
- FizzBuzz
- Reverse a String
- Palindrome Checker
- Find Maximum in Array
- Two Sum Problem
- Binary Search Implementation
- Fibonacci Sequence
- Prime Number Checker

### **Category 2: Data Structures**
```json
{
    "id": "data-structures",
    "name": "Data Structures",
    "description": "Master lists, dicts, trees, and more",
    "icon": "📦",
    "order_index": 2
}
```

**Example Puzzles:**
- Stack Implementation
- Queue Implementation
- Valid Parentheses
- Merge Two Sorted Lists
- Remove Duplicates
- Rotate Array
- Linked List Cycle Detection

### **Category 3: String Manipulation**
```json
{
    "id": "string-manipulation",
    "name": "String Manipulation",
    "description": "Text processing and string algorithms",
    "icon": "📝",
    "order_index": 3
}
```

**Example Puzzles:**
- Anagram Detector
- String Compression
- Longest Common Prefix
- Valid Shuffle
- Word Count
- Caesar Cipher
- String Reversal (by word)

### **Category 4: Math & Numbers**
```json
{
    "id": "math-numbers",
    "name": "Math & Numbers",
    "description": "Mathematical problem solving",
    "icon": "🔢",
    "order_index": 4
}
```

**Example Puzzles:**
- Sum of Digits
- Power of Two Checker
- GCD/LCM Calculator
- Factorial
- Perfect Number Checker
- Armstrong Number
- Number to Roman Numerals

### **Category 5: Game Logic**
```json
{
    "id": "game-logic",
    "name": "Game Logic",
    "description": "RPG and game-related challenges",
    "icon": "🎮",
    "order_index": 5
}
```

**Example Puzzles:**
- Damage Calculator
- Inventory Sorter
- Experience Points Calculator
- Combat Simulator
- Loot Drop System
- Quest Chain Validator
- Character Stat Balancer

### **Category 6: Optimization**
```json
{
    "id": "optimization",
    "name": "Optimization",
    "description": "Code golf and performance challenges",
    "icon": "⚡",
    "order_index": 6
}
```

**Example Puzzles:**
- Same puzzles as above, but judged on:
  - Fewest lines of code
  - Best time complexity
  - Best space complexity

---

## **Puzzle Difficulty System**

### **Easy (100 points)**
- Single concept application
- Clear requirements
- 5-15 lines of code
- Examples: FizzBuzz, Reverse String, Even/Odd checker
- Unlock: Available from start

### **Medium (200 points)**
- Multiple concept integration
- Some edge cases to consider
- 15-40 lines of code
- Examples: Palindrome detector, Two Sum, Valid Parentheses
- Unlock: Complete 5 Easy puzzles OR reach Level 5

### **Hard (300 points)**
- Complex logic required
- Multiple edge cases
- 40-80 lines of code
- Examples: Merge Intervals, LRU Cache, Word Ladder
- Unlock: Complete 10 Medium puzzles OR reach Level 10

### **Expert (500 points)**
- Advanced algorithms
- Optimization required
- 80+ lines of code
- Examples: Sudoku Solver, N-Queens, Graph algorithms
- Unlock: Complete 5 Hard puzzles OR reach Level 15

---

## **Puzzle Structure (Detailed)**

### **Puzzle Template**

```json
{
    "id": "two-sum",
    "category_id": "logic-algorithms",
    "title": "Two Sum",
    "description": "## The Challenge\n\nGiven an array of integers and a target sum, find two numbers that add up to the target.\n\n## Input\n- Array of integers: `[2, 7, 11, 15]`\n- Target integer: `9`\n\n## Output\nReturn indices of the two numbers: `[0, 1]` (because 2 + 7 = 9)\n\n## Constraints\n- Array has at least 2 elements\n- Exactly one solution exists\n- Can't use same element twice\n\n## Examples\n```\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\n\nInput: nums = [3,2,4], target = 6\nOutput: [1,2]\n\nInput: nums = [3,3], target = 6\nOutput: [0,1]\n```",
    "difficulty": "medium",
    "points": 200,
    "concepts": ["lists-arrays", "for-loops", "dictionaries-objects"],
    "estimated_minutes": 20,
    "has_optimization": true,
    "optimal_time_complexity": "O(n)",
    "optimal_space_complexity": "O(n)"
}
```

### **Implementation Per Language**

**Python Implementation:**
```json
{
    "puzzle_id": "two-sum",
    "language_id": "python",
    "starter_code": "def two_sum(nums, target):\n    \"\"\"\n    Find two numbers that add up to target.\n    \n    Args:\n        nums: List of integers\n        target: Target sum\n    \n    Returns:\n        List of two indices [i, j]\n    \"\"\"\n    # Your code here\n    pass\n\n# Test your solution\nif __name__ == \"__main__\":\n    print(two_sum([2, 7, 11, 15], 9))  # Should print [0, 1]",
    "solution_code": "def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []",
    "test_cases": [
        {
            "input": {"nums": [2, 7, 11, 15], "target": 9},
            "expected_output": [0, 1],
            "description": "Basic case"
        },
        {
            "input": {"nums": [3, 2, 4], "target": 6},
            "expected_output": [1, 2],
            "description": "Non-zero indices"
        },
        {
            "input": {"nums": [3, 3], "target": 6},
            "expected_output": [0, 1],
            "description": "Duplicate numbers"
        }
    ],
    "hidden_tests": [
        {
            "input": {"nums": [-1, -2, -3, -4, -5], "target": -8},
            "expected_output": [2, 4],
            "description": "Negative numbers"
        },
        {
            "input": {"nums": [0, 4, 3, 0], "target": 0},
            "expected_output": [0, 3],
            "description": "Zero as target"
        }
    ],
    "hints": [
        "Think about what information you need to store as you iterate through the array.",
        "For each number, what would its pair need to be to sum to the target?",
        "A dictionary (hash map) can help you look up complements in O(1) time.",
        "Store each number and its index as you go. Check if the complement exists before storing.",
        "Solution structure:\n1. Create empty dict\n2. For each num at index i:\n   - Calculate complement = target - num\n   - If complement in dict, return [dict[complement], i]\n   - Store num: i in dict"
    ]
}
```

**C# Implementation:**
```json
{
    "puzzle_id": "two-sum",
    "language_id": "csharp",
    "starter_code": "using System;\nusing System.Collections.Generic;\n\npublic class Solution {\n    public int[] TwoSum(int[] nums, int target) {\n        // Your code here\n        return new int[] {};\n    }\n    \n    // Test your solution\n    public static void Main(string[] args) {\n        Solution s = new Solution();\n        int[] result = s.TwoSum(new int[] {2, 7, 11, 15}, 9);\n        Console.WriteLine($\"[{result[0]}, {result[1]}]\");\n    }\n}",
    "solution_code": "using System;\nusing System.Collections.Generic;\n\npublic class Solution {\n    public int[] TwoSum(int[] nums, int target) {\n        Dictionary<int, int> seen = new Dictionary<int, int>();\n        \n        for (int i = 0; i < nums.Length; i++) {\n            int complement = target - nums[i];\n            if (seen.ContainsKey(complement)) {\n                return new int[] { seen[complement], i };\n            }\n            seen[nums[i]] = i;\n        }\n        \n        return new int[] {};\n    }\n}",
    "test_cases": "... same test cases as Python ...",
    "hints": "... similar hints adapted for C# ..."
}
```

**Ruby Implementation:**
```json
{
    "puzzle_id": "two-sum",
    "language_id": "ruby",
    "starter_code": "def two_sum(nums, target)\n  # Your code here\nend\n\n# Test your solution\nif __FILE__ == $0\n  puts two_sum([2, 7, 11, 15], 9).inspect  # Should print [0, 1]\nend",
    "solution_code": "def two_sum(nums, target)\n  seen = {}\n  nums.each_with_index do |num, i|\n    complement = target - num\n    return [seen[complement], i] if seen.key?(complement)\n    seen[num] = i\n  end\n  []\nend",
    "test_cases": "... same test cases ...",
    "hints": "... similar hints adapted for Ruby ..."
}
```

---

## **UI/UX Design**

### **Main Puzzle Hub Page**

```
┌─────────────────────────────────────────────────────────────────┐
│  🧩 CODING PUZZLES                         Daily Streak: 🔥 7   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📊 Your Stats                                                   │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐ │
│  │ Solved       │ Current Rank │ Total Points │ Languages    │ │
│  │ 42 / 150     │ #234         │ 8,400 pts    │ 🐍 🔷 💎   │ │
│  └──────────────┴──────────────┴──────────────┴──────────────┘ │
│                                                                  │
│  ⭐ Daily Challenge                                             │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 🎯 "Reverse Words in String" (Medium)                  │    │
│  │ Complete today for +50 bonus points!                   │    │
│  │ [Start Challenge]                        Ends in 4h 23m │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  📁 Categories                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🧠 Logic & Algorithms            24 / 30 solved         │   │
│  │ ████████████████░░░░░░░░         80%                    │   │
│  │                                                          │   │
│  │ 📦 Data Structures               12 / 25 solved         │   │
│  │ ████████░░░░░░░░░░░░░            48%                    │   │
│  │                                                          │   │
│  │ 📝 String Manipulation           18 / 20 solved         │   │
│  │ ██████████████████░░             90%                    │   │
│  │                                                          │   │
│  │ 🔢 Math & Numbers                8 / 15 solved          │   │
│  │ ██████████░░░░░░░░░░             53%                    │   │
│  │                                                          │   │
│  │ 🎮 Game Logic                    0 / 20 solved          │   │
│  │ ░░░░░░░░░░░░░░░░░░░░             0%  🔒 Unlock at Lvl 5 │   │
│  │                                                          │   │
│  │ ⚡ Optimization                  0 / 30 solved          │   │
│  │ ░░░░░░░░░░░░░░░░░░░░             0%  🔒 Unlock at Lvl 10│   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  [View All Puzzles]  [Leaderboard]  [My Achievements]          │
└─────────────────────────────────────────────────────────────────┘
```

### **Puzzle List View**

```
┌─────────────────────────────────────────────────────────────────┐
│  🧠 Logic & Algorithms                              [← Back]     │
├─────────────────────────────────────────────────────────────────┤
│  Filters: [All] [Easy] [Medium] [Hard] [Expert]                │
│  Sort by: [Difficulty ▼] [Acceptance Rate] [Points]            │
│  Language: [Python ▼] [C#] [Ruby]                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ ✅ FizzBuzz                                    Easy     │    │
│  │ Print FizzBuzz for 1-100                      100 pts  │    │
│  │ Acceptance: 95% | Solved in 🐍 | 2 mins              │    │
│  │ [View Solution]                                        │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 🔄 Reverse String                              Easy     │    │
│  │ Reverse a string in-place                     100 pts  │    │
│  │ Acceptance: 88% | Attempted 3x | Not solved yet       │    │
│  │ [Try Again]                                            │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 🔍 Two Sum                                    Medium    │    │
│  │ Find two numbers that sum to target          200 pts   │    │
│  │ Acceptance: 65% | Not attempted                        │    │
│  │ [Start Puzzle]                                         │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 🔒 Valid Parentheses                          Hard      │    │
│  │ Check if brackets are balanced               300 pts   │    │
│  │ 🔒 Complete 5 Medium puzzles to unlock                 │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### **Puzzle Solving Interface**

```
┌─────────────────────────────────────────────────────────────────┐
│  🔍 Two Sum (Medium)                       [← Back to Puzzles]  │
│  Language: [Python ▼]  [Switch to C#] [Switch to Ruby]         │
├──────────────────────────┬──────────────────────────────────────┤
│  DESCRIPTION             │  CODE EDITOR                         │
│                          │                                      │
│  ## The Challenge        │  def two_sum(nums, target):          │
│                          │      """                             │
│  Given an array of       │      Find two numbers that add up    │
│  integers and a target   │      to target.                      │
│  sum, find two numbers   │      """                             │
│  that add up to target.  │      # Your code here                │
│                          │      pass                            │
│  ## Examples             │                                      │
│  Input: [2,7,11,15], 9   │                                      │
│  Output: [0,1]           │                                      │
│                          │                                      │
│  [Show More ▼]           │  [▶️ Run Tests] [💡 Get Hint]       │
│                          │  [✓ Submit Solution]                 │
│  💡 Hints Used: 0/5      │                                      │
│  ⏱️ Time: 03:45          ├──────────────────────────────────────┤
│  🔄 Attempts: 2          │  TEST RESULTS                        │
│                          │                                      │
│  [View Hints]            │  ✅ Test 1: Basic case (Passed)     │
│  [View Leaderboard]      │  ✅ Test 2: Non-zero indices         │
│  [Save Progress]         │  ❌ Test 3: Duplicate numbers        │
│                          │     Expected: [0, 1]                 │
│                          │     Got: None                        │
│                          │                                      │
│                          │  🔒 2 hidden tests not shown         │
└──────────────────────────┴──────────────────────────────────────┘
```

### **Success Screen**

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│                    🎉 PUZZLE SOLVED! 🎉                         │
│                                                                  │
│                    ⭐ Two Sum Complete ⭐                       │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Points Earned:          +200 pts                      │    │
│  │  Time Taken:             4m 32s                        │    │
│  │  Hints Used:             1 / 5                         │    │
│  │  Solution Length:        8 lines                       │    │
│  │  Your Rank:              #234 → #198 📈               │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  💡 Optimization Challenge Available!                           │
│  Your solution works, but can you optimize it?                  │
│                                                                  │
│  Current:  Time O(n²), Space O(1)                              │
│  Optimal:  Time O(n), Space O(n)                               │
│                                                                  │
│  Solve with optimal complexity for +100 bonus points!          │
│                                                                  │
│  [Try Optimization] [View Solution] [Next Puzzle] [Back]       │
│                                                                  │
│  🏆 Achievements Unlocked:                                      │
│  ⭐ "10 Medium Puzzles Solved" (+250 XP)                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## **Features**

### **1. Language Switching**
- User can switch languages mid-puzzle
- Progress saved per language
- Can solve same puzzle in all 3 languages for 3x points
- Badge for solving puzzle in all available languages

### **2. Hints System**
- 5 progressive hints per puzzle
- Each hint costs 10 points
- Hints unlock gradually (can't skip to hint 5)
- Using hints affects leaderboard ranking

### **3. Test Cases**
- Visible test cases (3-5 shown)
- Hidden test cases (2-3 not shown until submission)
- Real-time test execution as you code
- Clear error messages for failed tests

### **4. Leaderboard**
Two leaderboards per puzzle:
- **Speed Leaderboard:** Fastest solve time
- **Code Golf Leaderboard:** Fewest lines of code

### **5. Daily Challenge**
- One puzzle selected each day
- Bonus points for completion (base points + 50)
- Streak tracking (solve daily challenges X days in a row)
- Extra rewards at 7-day, 30-day, 100-day streaks

### **6. Optimization Challenges**
- After solving, challenge to optimize
- Show current complexity vs optimal
- Bonus points for achieving optimal solution
- Separate "Optimized" badge on profile

### **7. Solution Sharing** (Future)
- View community solutions after solving
- Upvote elegant solutions
- Comment on approaches
- Learn different techniques

### **8. Puzzle Recommendations**
- Based on concepts user struggles with
- Based on course progress
- Similar puzzles
- "Users who solved this also solved..."

---

## **Achievements**

### **Solve Count Achievements**
```json
[
    {
        "id": "first-puzzle",
        "name": "First Steps",
        "description": "Solve your first puzzle",
        "icon": "🎯",
        "requirement_type": "count",
        "requirement_value": 1,
        "xp_reward": 100
    },
    {
        "id": "ten-puzzles",
        "name": "Problem Solver",
        "description": "Solve 10 puzzles",
        "requirement_value": 10,
        "xp_reward": 250
    },
    {
        "id": "fifty-puzzles",
        "name": "Puzzle Master",
        "requirement_value": 50,
        "xp_reward": 1000
    },
    {
        "id": "hundred-puzzles",
        "name": "Centurion",
        "requirement_value": 100,
        "xp_reward": 2500
    }
]
```

### **Difficulty Achievements**
```json
[
    {
        "id": "easy-complete",
        "name": "Easy Rider",
        "description": "Complete all Easy puzzles",
        "icon": "🌱",
        "xp_reward": 500
    },
    {
        "id": "medium-complete",
        "name": "Medium Well Done",
        "description": "Complete all Medium puzzles",
        "icon": "🌿",
        "xp_reward": 1000
    },
    {
        "id": "hard-complete",
        "name": "Hard Core",
        "description": "Complete all Hard puzzles",
        "icon": "🌳",
        "xp_reward": 2000
    }
]
```

### **Streak Achievements**
```json
[
    {
        "id": "daily-streak-7",
        "name": "Week Warrior",
        "description": "Complete daily challenges for 7 days straight",
        "icon": "🔥",
        "requirement_type": "streak",
        "requirement_value": 7,
        "xp_reward": 500
    },
    {
        "id": "daily-streak-30",
        "name": "Monthly Master",
        "requirement_value": 30,
        "xp_reward": 2000
    }
]
```

### **Language Achievements**
```json
[
    {
        "id": "polyglot",
        "name": "Polyglot Programmer",
        "description": "Solve same puzzle in all 3 languages",
        "icon": "🌐",
        "requirement_type": "language",
        "xp_reward": 300
    },
    {
        "id": "python-master",
        "name": "Python Master",
        "description": "Solve 50 puzzles in Python",
        "icon": "🐍",
        "xp_reward": 750
    },
    {
        "id": "csharp-master",
        "name": "C# Master",
        "description": "Solve 50 puzzles in C#",
        "icon": "🔷",
        "xp_reward": 750
    },
    {
        "id": "ruby-master",
        "name": "Ruby Master",
        "description": "Solve 50 puzzles in Ruby",
        "icon": "💎",
        "xp_reward": 750
    }
]
```

### **Optimization Achievements**
```json
[
    {
        "id": "optimizer",
        "name": "The Optimizer",
        "description": "Achieve optimal solution on 10 puzzles",
        "icon": "⚡",
        "requirement_type": "optimization",
        "requirement_value": 10,
        "xp_reward": 500
    },
    {
        "id": "code-golfer",
        "name": "Code Golfer",
        "description": "Top 10 on any Code Golf leaderboard",
        "icon": "⛳",
        "xp_reward": 300
    }
]
```

---

## **Integration with Main App**

### **Dashboard Integration**
Add Puzzle widget to dashboard:
```
┌──────────────────────────────────────┐
│  🧩 Daily Puzzle Challenge           │
├──────────────────────────────────────┤
│  "Reverse Words" (Medium)            │
│  Complete for +250 pts!              │
│                                      │
│  Your Puzzle Stats:                  │
│  42 Solved | Rank #234 | 7🔥        │
│                                      │
│  [Start Daily Puzzle]                │
│  [Browse All Puzzles]                │
└──────────────────────────────────────┘
```

### **Navigation**
Add to main menu:
- Courses
- **Puzzles** 🆕
- Achievements
- Leaderboard
- Profile

### **XP Integration**
Puzzle XP contributes to overall user level:
- Easy puzzle: 100 XP
- Medium puzzle: 200 XP
- Hard puzzle: 300 XP
- Expert puzzle: 500 XP
- Daily bonus: +50 XP
- Optimization bonus: +100 XP

### **Notification System**
Notifications for:
- New daily puzzle available
- Puzzle streak about to break
- Moved up in leaderboard
- New achievement earned
- Friend solved same puzzle

---

## **Sample Puzzles to Create**

### **Easy Puzzles (20 total)**
1. FizzBuzz
2. Reverse String
3. Palindrome Checker
4. Find Maximum
5. Even/Odd Counter
6. Sum of Array
7. Count Vowels
8. Remove Spaces
9. Factorial
10. Is Prime
11. Celsius to Fahrenheit
12. Absolute Value
13. Find Minimum
14. List Contains Value
15. String Length Without len()
16. Sum of Digits
17. Multiply List Elements
18. First and Last Element
19. Count Occurrences
20. Simple Calculator

### **Medium Puzzles (25 total)**
1. Two Sum
2. Valid Parentheses
3. Merge Sorted Lists
4. Remove Duplicates
5. Rotate Array
6. Find Missing Number
7. Longest Common Prefix
8. Anagram Check
9. Binary Search
10. Selection Sort
11. Bubble Sort
12. Reverse Words in String
13. Valid Shuffle
14. Move Zeros
15. Single Number (XOR)
16. Majority Element
17. Intersection of Arrays
18. Plus One (Array)
19. Pascal's Triangle
20. Climbing Stairs (DP)
21. Best Time to Buy Stock
22. Contains Duplicate
23. Product of Array Except Self
24. Valid Sudoku (partial)
25. Group Anagrams

### **Hard Puzzles (20 total)**
1. Merge K Sorted Lists
2. LRU Cache
3. Word Ladder
4. Serialize/Deserialize Tree
5. Course Schedule (Topological Sort)
6. Longest Palindrome Substring
7. Container With Most Water
8. 3Sum
9. Permutations
10. Combinations
11. Letter Combinations Phone
12. Generate Parentheses
13. Subsets
14. Word Search
15. Jump Game
16. Decode Ways
17. Unique Paths
18. Minimum Path Sum
19. Edit Distance
20. Regular Expression Matching

### **Expert Puzzles (15 total)**
1. Sudoku Solver
2. N-Queens
3. Word Break II
4. Palindrome Partitioning II
5. Maximal Rectangle
6. Largest Rectangle Histogram
7. Wildcard Matching
8. Interleaving String
9. Distinct Subsequences
10. Scramble String
11. Best Time Buy/Sell III
12. Binary Tree Max Path Sum
13. Median of Two Sorted Arrays
14. Trapping Rain Water
15. First Missing Positive

---

## **Implementation Tasks**

### **Phase 1: Core Infrastructure**
1. Create database tables
2. Seed puzzle categories
3. Create puzzle management system
4. Build language switching logic

### **Phase 2: UI Components**
5. Build puzzle hub page
6. Create puzzle list view with filters
7. Build puzzle solving interface
8. Create success/failure screens
9. Add leaderboards

### **Phase 3: Content Creation**
10. Create 20 Easy puzzles (all 3 languages)
11. Create 25 Medium puzzles (all 3 languages)
12. Create 20 Hard puzzles (all 3 languages)
13. Write test cases for all puzzles
14. Write hints for all puzzles

### **Phase 4: Features**
15. Implement daily challenge system
16. Add hint system
17. Build leaderboards
18. Create achievement system
19. Add optimization challenges

### **Phase 5: Integration**
20. Integrate with dashboard
21. Add to main navigation
22. Connect XP system
23. Add notifications

### **Phase 6: Polish**
24. Test all puzzles in all languages
25. Balance difficulty ratings
26. Optimize test execution
27. Add puzzle recommendations

---

## **Success Criteria**

Puzzle module is complete when:
- ✅ Database schema created and populated
- ✅ 80+ puzzles available (20 easy, 25 medium, 20 hard, 15 expert)
- ✅ All puzzles work in Python, C#, and Ruby
- ✅ Test cases validate solutions correctly
- ✅ Hints are helpful and progressive
- ✅ Language switching works seamlessly
- ✅ Daily challenge system functions
- ✅ Leaderboards update correctly
- ✅ Achievements track properly
- ✅ UI is responsive and intuitive
- ✅ Integrated with main app
- ✅ XP rewards system works

---

This puzzle module adds a competitive, practice-focused element to the learning platform, allowing users to reinforce concepts through deliberate practice while supporting multiple programming languages.