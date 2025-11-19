# **Python Fundamentals Course - 30 Lesson Framework**

## **Course Overview**

Expand the existing 10-lesson Python course to 30 lessons with:
- Retention checkpoints every 3-4 lessons
- Progressive complexity
- Challenge lessons that require synthesizing previous concepts
- Minimal scaffolding in challenge lessons (prove understanding)
- RPG-themed practical projects

---

## **Existing Lessons (DO NOT OVERWRITE)**

These 10 lessons already exist in the database. Build around them:

1. Print Statement
2. Variables
3. Conditions
4. Loops
5. Functions
6. Lists
7. Modify Lists
8. Dictionaries
9. Reading and Writing Files
10. Creating Objects with Classes

---

## **New Course Structure (30 Total Lessons)**

### **Module 1: Fundamentals (Lessons 1-5)**

**Lesson 1: Print Statement** ✅ *[Existing - Keep as is]*
- Concept: `input-output`
- Basic print(), strings

**Lesson 2: Variables** ✅ *[Existing - Keep as is]*
- Concept: `variables-and-types`
- Creating variables, types

**Lesson 3: User Input & String Operations** 🆕
- Concept: `string-manipulation`, `input-output`
- Learn: `input()` function, string concatenation, f-strings
- Task: Get user's name and age, create personalized greeting
- Starter code: Comments and structure, student fills in logic
- XP: 100

**Lesson 4: Math Operations** 🆕
- Concept: `operators`
- Learn: +, -, *, /, //, %, **
- Task: Create a simple calculator that takes two numbers and shows all operations
- Starter code: Input structure provided, student writes calculations
- XP: 100

**Lesson 5: ⭐ CHALLENGE - Profile Creator** 🆕
- **Retention Checkpoint**: Print, Variables, Input, Strings, Math
- Task: Create a character profile generator
  - Ask for: name, age, starting gold (number)
  - Calculate: gold after buying a sword (costs 50 gold)
  - Print: Full character profile with remaining gold
- Starter code: Minimal (just comments as guide)
- Success criteria: Must use input(), variables, math, f-strings, print()
- XP: 200

---

### **Module 2: Control Flow (Lessons 6-10)**

**Lesson 6: Conditions** ✅ *[Existing - Keep as is]*
- Concept: `if-statements`
- Basic if statements

**Lesson 7: If/Else Branching** 🆕
- Concept: `if-else`
- Learn: if/else, comparison operators
- Task: Check if player has enough gold to buy an item
- Starter code: Variables provided, student writes if/else
- XP: 100

**Lesson 8: Multiple Conditions (elif)** 🆕
- Concept: `multiple-conditions`
- Learn: elif, multiple branches
- Task: Create a difficulty selector (easy/medium/hard) that sets different enemy health values
- Starter code: Input provided, student writes elif chain
- XP: 150

**Lesson 9: Logical Operators** 🆕
- Concept: `operators` (logical)
- Learn: and, or, not
- Task: Check if player can enter dungeon (must have key AND level >= 5)
- Starter code: Variables provided, student writes complex conditions
- XP: 150

**Lesson 10: ⭐ CHALLENGE - Quest Eligibility Checker** 🆕
- **Retention Checkpoint**: Variables, Input, Conditions, Logical operators
- Task: Create a quest checker system
  - Ask for: player level, has_sword (yes/no), current_health
  - Check multiple quest requirements:
    - Easy Quest: level >= 1
    - Medium Quest: level >= 5 AND has_sword
    - Hard Quest: level >= 10 AND has_sword AND health > 50
  - Print which quests they qualify for
- Starter code: None (just task description)
- Success criteria: Must use input(), multiple if/elif/else, logical operators
- XP: 250

---

### **Module 3: Loops & Repetition (Lessons 11-15)**

**Lesson 11: Loops** ✅ *[Existing - Keep as is]*
- Concept: `for-loops`
- Basic for loops

**Lesson 12: For Loops with Range** 🆕
- Concept: `for-loops`
- Learn: range(start, stop, step)
- Task: Create a countdown timer from 10 to 1
- Starter code: Loop structure outline, student fills in range()
- XP: 100

**Lesson 13: While Loops** 🆕
- Concept: `while-loops`
- Learn: while condition, when to use vs for
- Task: Player keeps attacking until enemy health reaches 0
- Starter code: Variables provided, student writes while loop
- XP: 150

**Lesson 14: Loop Control (break/continue)** 🆕
- Concept: `loop-control`
- Learn: break (exit loop), continue (skip iteration)
- Task: Search through a list of treasure chests, break when you find the "golden chest"
- Starter code: List provided, student writes loop with break
- XP: 150

**Lesson 15: ⭐ CHALLENGE - Battle Simulator** 🆕
- **Retention Checkpoint**: Loops, Conditions, Variables, Math
- Task: Create a simple turn-based battle
  - Player starts with 100 health
  - Enemy starts with 80 health
  - Each turn: Player attacks (15-25 damage), enemy attacks (10-20 damage)
  - Use while loop until one reaches 0 health
  - Print each turn's actions
  - Print winner
- Starter code: None (import random provided)
- Success criteria: Must use while loop, random.randint(), conditions, variables
- XP: 300

---

### **Module 4: Functions (Lessons 16-20)**

**Lesson 16: Functions** ✅ *[Existing - Keep as is]*
- Concept: `function-basics`
- Creating basic functions

**Lesson 17: Function Parameters** 🆕
- Concept: `parameters-arguments`
- Learn: Passing multiple parameters
- Task: Create `calculate_damage(attack_power, defense)` function
- Starter code: Function signature provided, student writes body
- XP: 100

**Lesson 18: Return Values** 🆕
- Concept: `return-values`
- Learn: Returning values, using returned values
- Task: Create `heal_player(current_health, heal_amount, max_health)` that returns new health (can't exceed max)
- Starter code: Function signature and variables, student writes logic and return
- XP: 150

**Lesson 19: Default Parameters** 🆕
- Concept: `default-parameters`
- Learn: Optional parameters with defaults
- Task: Create `cast_spell(spell_name, mana_cost=10, damage=20)` with defaults
- Starter code: Minimal, student writes complete function
- XP: 150

**Lesson 20: ⭐ CHALLENGE - RPG Combat Functions** 🆕
- **Retention Checkpoint**: Functions, Parameters, Returns, Loops, Conditions
- Task: Create a combat system using multiple functions:
  - `player_attack(enemy_health, damage)` - returns new enemy health
  - `enemy_attack(player_health, damage)` - returns new player health
  - `is_alive(health)` - returns True if health > 0
  - `combat_round(player_hp, enemy_hp)` - uses above functions, returns (new_player_hp, new_enemy_hp)
  - Main code: Run combat until someone dies, print result
- Starter code: Function signatures only (no bodies)
- Success criteria: All functions work correctly, proper use of returns, integration
- XP: 350

---

### **Module 5: Lists & Collections (Lessons 21-25)**

**Lesson 21: Lists** ✅ *[Existing - Keep as is]*
- Concept: `lists-arrays`
- Basic list creation and access

**Lesson 22: Modify Lists** ✅ *[Existing - Keep as is]*
- Concept: `lists-arrays`
- append(), remove(), insert()

**Lesson 23: Looping Through Lists** 🆕
- Concept: `for-loops` + `lists-arrays`
- Learn: for item in list, enumerate()
- Task: Loop through inventory list and print each item with number
- Starter code: List provided, student writes loop
- XP: 100

**Lesson 24: List Methods & Operations** 🆕
- Concept: `lists-arrays`
- Learn: len(), sort(), reverse(), count(), index()
- Task: Manage quest log - add quests, remove completed, count active, sort by priority
- Starter code: Empty list and tasks, student implements operations
- XP: 150

**Lesson 25: ⭐ CHALLENGE - Inventory Management System** 🆕
- **Retention Checkpoint**: Lists, Functions, Loops, Conditions
- Task: Create a working inventory system
  - Start with empty inventory list
  - Functions to create:
    - `add_item(inventory, item)` - add to list
    - `remove_item(inventory, item)` - remove from list
    - `show_inventory(inventory)` - print all items numbered
    - `search_item(inventory, item)` - return True if exists
  - Menu loop:
    - 1. Add item
    - 2. Remove item
    - 3. Show inventory
    - 4. Search item
    - 5. Exit
- Starter code: None (just requirements)
- Success criteria: All functions work, menu loop functions properly
- XP: 400

---

### **Module 6: Dictionaries & Data (Lessons 26-28)**

**Lesson 26: Dictionaries** ✅ *[Existing - Keep as is]*
- Concept: `dictionaries-objects`
- Basic dictionary operations

**Lesson 27: Working with Dictionary Data** 🆕
- Concept: `dictionaries-objects`
- Learn: .get(), .keys(), .values(), .items(), updating nested dictionaries
- Task: Manage player stats dictionary (name, level, health, mana, inventory)
  - Update stats after battle
  - Add items to nested inventory
  - Print formatted character sheet
- Starter code: Initial dictionary structure provided, student writes operations
- XP: 150

**Lesson 28: Lists of Dictionaries** 🆕
- Concept: `dictionaries-objects` + `lists-arrays`
- Learn: Storing multiple objects, accessing and modifying
- Task: Create party system - list of character dictionaries
  - Add characters to party
  - Loop through party and print each character's stats
  - Find character by name
  - Update a character's health
- Starter code: One example character, student writes operations
- XP: 200

---

### **Module 7: File Handling (Lessons 29-30)**

**Lesson 29: Reading and Writing Files** ✅ *[Existing - Keep as is]*
- Concept: `reading-files`, `writing-files`
- Basic file operations

**Lesson 30: ⭐ FINAL CHALLENGE - Save/Load Game System** 🆕
- **Retention Checkpoint**: ALL previous concepts
- Task: Create a complete save/load system for RPG character
  - Character data structure:
    - name, level, health, max_health, gold, inventory (list), stats (dict)
  - Functions to create:
    - `create_character()` - asks for inputs, returns character dict
    - `save_character(character, filename)` - writes to file (one line per data)
    - `load_character(filename)` - reads file, returns character dict
    - `display_character(character)` - prints formatted character sheet
    - `level_up(character)` - increases level, max_health, stats
    - `gain_gold(character, amount)` - adds gold
  - Main program:
    - Menu: 1. New Character, 2. Load Character, 3. Display, 4. Level Up, 5. Gain Gold, 6. Save, 7. Exit
- Starter code: None (complete project from scratch)
- Success criteria:
  - All functions work independently
  - File save/load works correctly
  - Menu system functions properly
  - Character data persists between runs
- XP: 500
- Special: Completion awards "Python Fundamentals Master" badge

---

### **Module 8: Object-Oriented Programming (Lesson 31)** 

**Lesson 31: Creating Objects with Classes** ✅ *[Existing - Keep as is]*
- This becomes a bonus/preview lesson for intermediate course
- Concept: `classes-objects`
- Note in lesson: "Congrats on finishing Python Fundamentals! This lesson previews the next course."

---

## **Implementation Instructions for Claude Code**

### **DO NOT OVERWRITE**
- Keep existing 10 lessons exactly as they are
- Use new lesson IDs for new lessons (python-fundamentals-lesson-03, etc.)
- Preserve existing lesson numbers in their current positions

### **Lesson Numbering Strategy**

Since existing lessons are already numbered, here's how to integrate:

**Option A: Renumber Everything** (Recommended)
- Reorder all 30 lessons in proper sequence
- Update `order_index` for all lessons
- Existing lesson content stays the same, just new position

**Option B: Add New Lessons After Existing**
- Keep lessons 1-10 as is
- Add lessons 11-30 as new lessons
- May create awkward flow

**Choose Option A** - Proper pedagogical sequence is more important

### **New Lesson Requirements**

Each new lesson must include:

**1. Basic Information**
```json
{
    "id": "python-fundamentals-lesson-XX",
    "course_id": "python-fundamentals",
    "concept_id": "concept-name-here",
    "title": "Lesson Title",
    "description": "Markdown description explaining what they'll learn and why it matters",
    "order_index": XX,
    "estimated_minutes": 15-30,
    "xp_reward": 100-500
}
```

**2. Description Format (Markdown)**
```markdown
## What You'll Learn
[1-2 sentences about the concept]

## Why This Matters
[1-2 sentences about practical applications]

## Your Challenge
[Clear task description with requirements listed]

[For challenge lessons: Include success criteria]
```

**3. Starter Code Guidelines**

**Regular Lessons (3, 4, 7-9, 12-14, 17-19, 23-24, 27-28):**
- Provide structure with comments
- Show syntax examples
- Leave blanks for student to fill in
- Example:
```python
# Get user input
name = input("Enter your name: ")
age = ___  # Fix this line

# Create greeting using f-string
greeting = ___  # Create f-string here

# Print the greeting
___
```

**Challenge Lessons (5, 10, 15, 20, 25, 30):**
- Minimal to no starter code
- Only provide imports if needed (like random)
- Task description in comments only
- Example:
```python
# CHALLENGE: Profile Creator
# 
# Requirements:
# - Ask for name, age, starting gold
# - Calculate gold after buying sword (50 gold)
# - Print full character profile
# 
# Start coding below:
```

**4. Solution Code**
- Provide ONE working solution (not the only way)
- Use clear variable names
- Include comments explaining logic
- Follow Python conventions (snake_case, etc.)
- Should be slightly more elegant than minimum requirement

**5. Validation Tests**
Each lesson needs 3-5 tests:

**For Regular Lessons:**
```json
[
    {
        "type": "variable_exists",
        "description": "Variable 'health' should exist",
        "variable_name": "health"
    },
    {
        "type": "output",
        "description": "Should print at least 3 lines",
        "validation_code": "len(output.strip().split('\\n')) >= 3"
    },
    {
        "type": "function_exists",
        "description": "Function 'calculate_damage' should exist",
        "function_name": "calculate_damage"
    }
]
```

**For Challenge Lessons:**
```json
[
    {
        "type": "function_returns",
        "description": "player_attack() should reduce enemy health",
        "function_name": "player_attack",
        "test_input": [100, 20],
        "expected_return": 80
    },
    {
        "type": "custom",
        "description": "Combat loop should run until health reaches 0",
        "validation_code": "# Python code that checks the logic"
    }
]
```

**6. Hints (5 hints per lesson)**

**Hint Progression:**
1. Conceptual nudge - what approach to use
2. Specific guidance - which syntax/function to use
3. Structural help - pseudocode or structure
4. Near-solution - code with small blanks
5. Complete solution with explanation

**Example for Challenge Lesson:**
```json
[
    "Think about what data structure would best store character information. You'll need to keep track of multiple values for one character.",
    
    "A dictionary is perfect for this! You can use keys like 'name', 'age', and 'gold' to store different character attributes.",
    
    "Try this structure:\ncharacter = {\n    'name': input('Name: '),\n    'age': ___,\n    'gold': ___\n}\nThen calculate new gold after purchase.",
    
    "Almost there! Here's most of it:\n\nname = input('Enter name: ')\nage = int(input('Enter age: '))\ngold = int(input('Starting gold: '))\n\ngold_after = gold - 50\n\nprint(f'Name: {name}')\n# Complete the rest of the print statements",
    
    "Here's a complete solution: [full solution with explanation of each part]"
]
```

---

## **Challenge Lesson Design Principles**

### **What Makes a Good Challenge:**

1. **Synthesizes Multiple Concepts**
   - Uses 3-5 previous concepts together
   - Requires understanding, not memorization
   - Tests conceptual integration

2. **Minimal Scaffolding**
   - No starter code (or very minimal)
   - Clear requirements instead of structure
   - Student must plan and organize

3. **Realistic Application**
   - Feels like building something real
   - Has practical purpose (inventory, combat, save system)
   - Engages RPG theme naturally

4. **Progressive Difficulty**
   - Early challenges: 2-3 functions, simple logic
   - Mid challenges: 4-5 functions, nested structures
   - Late challenges: Complete systems, file I/O, error handling

5. **Clear Success Criteria**
   - Specific requirements listed
   - Testable outcomes
   - Feature checklist

### **Challenge XP Scaling:**
- Lesson 5: 200 XP (uses 4 concepts)
- Lesson 10: 250 XP (uses 6 concepts)
- Lesson 15: 300 XP (uses 7 concepts)
- Lesson 20: 350 XP (uses 8+ concepts)
- Lesson 25: 400 XP (complete system)
- Lesson 30: 500 XP (capstone project)

---

## **RPG Theme Integration**

Every lesson should use RPG examples:

**Good Examples:**
- Variables: character_name, health_points, mana
- Math: damage calculation, gold transactions
- Conditions: quest eligibility, level requirements
- Loops: combat rounds, dungeon exploration
- Functions: attack(), heal(), cast_spell()
- Lists: inventory, quest_log, party_members
- Dictionaries: character stats, item properties
- Files: save game, load game

**Avoid Generic Examples:**
- Don't use: x, y, foo, bar
- Don't use: boring business examples
- Keep it game-related and engaging

---

## **File Organization**

Create lessons in this structure:

```
/lessons/python-fundamentals/
├── module-1-fundamentals/
│   ├── lesson-01.json  ✅ (existing)
│   ├── lesson-02.json  ✅ (existing)
│   ├── lesson-03.json  🆕 (create)
│   ├── lesson-04.json  🆕 (create)
│   └── lesson-05-challenge.json  🆕 (create)
│
├── module-2-control-flow/
│   ├── lesson-06.json  ✅ (existing)
│   ├── lesson-07.json  🆕 (create)
│   ├── lesson-08.json  🆕 (create)
│   ├── lesson-09.json  🆕 (create)
│   └── lesson-10-challenge.json  🆕 (create)
│
├── module-3-loops/
│   ├── lesson-11.json  ✅ (existing)
│   ├── lesson-12.json  🆕 (create)
│   ├── lesson-13.json  🆕 (create)
│   ├── lesson-14.json  🆕 (create)
│   └── lesson-15-challenge.json  🆕 (create)
│
├── module-4-functions/
│   ├── lesson-16.json  ✅ (existing)
│   ├── lesson-17.json  🆕 (create)
│   ├── lesson-18.json  🆕 (create)
│   ├── lesson-19.json  🆕 (create)
│   └── lesson-20-challenge.json  🆕 (create)
│
├── module-5-lists/
│   ├── lesson-21.json  ✅ (existing)
│   ├── lesson-22.json  ✅ (existing)
│   ├── lesson-23.json  🆕 (create)
│   ├── lesson-24.json  🆕 (create)
│   └── lesson-25-challenge.json  🆕 (create)
│
├── module-6-dictionaries/
│   ├── lesson-26.json  ✅ (existing)
│   ├── lesson-27.json  🆕 (create)
│   └── lesson-28.json  🆕 (create)
│
├── module-7-files/
│   ├── lesson-29.json  ✅ (existing)
│   └── lesson-30-challenge-final.json  🆕 (create)
│
└── module-8-bonus/
    └── lesson-31.json  ✅ (existing - preview)
```

---

## **Database Updates Needed**

Update course record:
```sql
UPDATE courses 
SET lesson_count = 30,
    estimated_hours = 20
WHERE id = 'python-fundamentals';
```

---

## **Success Criteria**

Course expansion is complete when:

1. ✅ All 20 new lessons created (11 regular + 6 challenge + 3 data structure)
2. ✅ Each lesson has complete JSON with all required fields
3. ✅ Challenge lessons have minimal starter code
4. ✅ All validation tests are logical and testable
5. ✅ 5 progressive hints per lesson
6. ✅ RPG theme consistent throughout
7. ✅ Lessons build on each other logically
8. ✅ Challenge lessons appear every 5 lessons
9. ✅ Final challenge (lesson 30) is comprehensive
10. ✅ Existing 10 lessons preserved exactly

---

## **Testing Requirements**

Before marking complete:
- Test that challenge lessons can be completed with provided hints
- Verify validation tests actually work
- Ensure difficulty progression feels right
- Check that RPG examples make sense
- Confirm minimal scaffolding in challenges
- Validate that each challenge synthesizes previous concepts

---
