# **Python Applications (Intermediate) - 30 Lesson Framework**

## **Course Overview**

**Course ID:** `python-applications`
**Category:** Backend
**Skill Level:** Intermediate
**Prerequisites:** `python-fundamentals` (must be completed)
**Estimated Hours:** 25-30 hours
**Total Lessons:** 30

This course builds on Python Fundamentals by teaching:
- Advanced function techniques
- Object-oriented programming
- Working with external libraries
- Data handling (JSON, CSV)
- Building complete multi-file applications
- Error handling and debugging
- Code organization and best practices

**Theme:** Building a complete RPG game engine from scratch across the course

---

## **Course Structure**

### **Module 1: Advanced Functions (Lessons 1-5)**

**Lesson 1: Function Review & Scope Deep Dive**
- Concept: `scope`
- Learn: Local vs global, LEGB rule, global keyword
- Task: Debug a gold tracking system where global/local scope is misused
- Starter code: Broken code provided, student must fix scope issues
- Challenge: Fix 5 different scope bugs
- XP: 100

**Lesson 2: Lambda Functions**
- Concept: Advanced functions
- Learn: Lambda syntax, when to use lambda vs def
- Task: Create lambda functions for damage calculations (critical hits, armor reduction, elemental bonus)
- Starter code: Regular functions provided, student converts to lambdas where appropriate
- XP: 150

**Lesson 3: List Comprehensions**
- Concept: Advanced functions + lists
- Learn: List comprehension syntax, filtering, transforming
- Task: Process inventory lists (filter by rarity, apply discounts, extract names)
- Starter code: Examples with for loops, student converts to comprehensions
- XP: 150

**Lesson 4: Map, Filter, Reduce**
- Concept: Advanced functions
- Learn: Functional programming concepts, when to use each
- Task: Process player stats across entire party (map: level up all, filter: find wounded, reduce: total gold)
- Starter code: Data provided, student writes map/filter/reduce operations
- XP: 200

**Lesson 5: ⭐ CHALLENGE - Damage Calculator System**
- **Retention Checkpoint**: Advanced functions, lambdas, comprehensions
- Task: Build a flexible combat damage system
  - Create lambdas for: physical_damage, magic_damage, critical_hit, armor_reduction
  - Function: `calculate_damage(base, damage_type, is_critical, armor)` - uses lambdas
  - Function: `apply_damage_to_party(party_list, damage)` - uses comprehension
  - Function: `get_alive_members(party_list)` - uses filter
  - Process a battle where multiple party members take different damage types
- Starter code: Data structures only
- Success: Must use lambdas, comprehensions, and functional techniques appropriately
- XP: 300

---

### **Module 2: Object-Oriented Programming Fundamentals (Lessons 6-10)**

**Lesson 6: Classes Review & Expansion**
- Concept: `classes-objects`
- Learn: Review class basics, `__init__`, self, multiple attributes
- Task: Expand basic `Character` class with health, mana, level, experience attributes
- Starter code: Minimal class structure, student adds attributes and `__init__`
- XP: 100

**Lesson 7: Methods & Self**
- Concept: `properties-methods`
- Learn: Instance methods, using self, methods vs functions
- Task: Add methods to Character: `take_damage(amount)`, `heal(amount)`, `gain_xp(amount)`, `level_up()`
- Starter code: Class structure with empty methods, student implements
- XP: 150

**Lesson 8: Class Properties & `__str__`**
- Concept: `properties-methods`
- Learn: `__str__` method, property access, encapsulation concepts
- Task: Add `__str__` method to Character for nice printing, add `is_alive` property, `is_full_health` property
- Starter code: Existing class from previous lessons, student adds new features
- XP: 150

**Lesson 9: Multiple Classes Working Together**
- Concept: `classes-objects`
- Learn: Classes using other classes, composition
- Task: Create `Enemy` class and `Battle` class that manages Character vs Enemy combat
- Starter code: Character class provided, student creates Enemy and Battle classes
- XP: 200

**Lesson 10: ⭐ CHALLENGE - RPG Character System**
- **Retention Checkpoint**: OOP fundamentals, classes, methods
- Task: Build a complete character management system
  - Classes needed:
    - `Character(name, char_class)` - warrior/mage/rogue, different stats
    - `Inventory(max_slots)` - manage items with weight limits
    - `Skill(name, mana_cost, cooldown)` - character abilities
  - Each class needs multiple methods
  - Character should contain Inventory and multiple Skills
  - Create 3 different characters with different classes
  - Demonstrate all methods working
- Starter code: None (full OOP design from scratch)
- Success: Proper use of classes, methods, composition, `__str__` methods
- XP: 350

---

### **Module 3: Inheritance & Advanced OOP (Lessons 11-15)**

**Lesson 11: Inheritance Basics**
- Concept: `inheritance`
- Learn: Parent/child classes, super(), overriding methods
- Task: Create `Warrior`, `Mage`, `Rogue` classes that inherit from base `Character`
- Starter code: Base Character class provided, student creates subclasses
- XP: 150

**Lesson 12: Method Overriding**
- Concept: `inheritance`
- Learn: Overriding parent methods, calling parent with super()
- Task: Override `attack()` method in each character class (warriors do more physical, mages use mana, rogues have crit chance)
- Starter code: Class structure provided, student overrides methods
- XP: 150

**Lesson 13: Polymorphism**
- Concept: `polymorphism`
- Learn: Same method name, different behavior, duck typing
- Task: Create different enemy types (Goblin, Dragon, Skeleton) with different attack behaviors, then loop through mixed list calling attack()
- Starter code: Base Enemy class, student creates subclasses and demonstrates polymorphism
- XP: 200

**Lesson 14: Class Variables vs Instance Variables**
- Concept: `classes-objects`
- Learn: Class-level attributes, when to use each, class methods
- Task: Add class variable tracking (total_characters_created, total_gold_in_world) that updates across all instances
- Starter code: Character class provided, student adds class variables and tracks them
- XP: 150

**Lesson 15: ⭐ CHALLENGE - Enemy Type System**
- **Retention Checkpoint**: Inheritance, polymorphism, OOP
- Task: Build a complete enemy encounter system
  - Base `Enemy` class with health, damage, xp_reward
  - Subclasses: `Goblin` (low health, low damage), `Orc` (medium, medium), `Dragon` (high, high, special ability)
  - Each enemy type has unique attack behavior
  - `Boss` class that inherits from Enemy but adds special abilities
  - Create `Dungeon` class that stores list of enemies and has method `spawn_wave(difficulty)` that creates appropriate enemies
  - Battle simulation showing polymorphism in action
- Starter code: None
- Success: Proper inheritance hierarchy, method overriding, polymorphism demonstrated
- XP: 400

---

### **Module 4: Working with Data - JSON (Lessons 16-20)**

**Lesson 16: JSON Basics**
- Concept: `json-handling`
- Learn: What JSON is, json.dumps(), json.loads(), Python dict ↔ JSON
- Task: Convert character dictionary to JSON string and back
- Starter code: Character dict provided, student writes JSON operations
- XP: 100

**Lesson 17: Reading JSON Files**
- Concept: `json-handling` + `reading-files`
- Learn: json.load(), reading from files, handling JSON structure
- Task: Load a quest database from JSON file, search for specific quest, display details
- Starter code: JSON file provided, student writes loading and search code
- XP: 150

**Lesson 18: Writing JSON Files**
- Concept: `json-handling` + `writing-files`
- Learn: json.dump(), pretty printing, writing complex data
- Task: Save entire party roster (list of character dicts) to JSON file with proper formatting
- Starter code: Data structure provided, student writes save function
- XP: 150

**Lesson 19: Complex JSON Structures**
- Concept: `json-handling`
- Learn: Nested JSON, lists of objects, accessing deeply nested data
- Task: Load a complex game world JSON (regions → cities → NPCs → quests) and query it
- Starter code: Complex JSON provided, student writes query functions
- XP: 200

**Lesson 20: ⭐ CHALLENGE - Save/Load Character System (JSON)**
- **Retention Checkpoint**: JSON, file handling, OOP
- Task: Create a complete character persistence system
  - Functions needed:
    - `character_to_dict(character_obj)` - convert Character object to dictionary
    - `dict_to_character(char_dict)` - rebuild Character object from dictionary
    - `save_party(party_list, filename)` - save list of characters to JSON
    - `load_party(filename)` - load and recreate character objects
    - `backup_save(filename)` - create timestamped backup before overwriting
  - Create multiple characters with full stats
  - Save to JSON file
  - Load back and verify all data intact
  - Demonstrate characters working after load
- Starter code: Character class only
- Success: Data persists correctly, objects rebuild with all methods functional
- XP: 400

---

### **Module 5: Working with Data - CSV & Processing (Lessons 21-25)**

**Lesson 21: CSV Basics**
- Concept: `csv-parsing`
- Learn: csv module, reading rows, DictReader
- Task: Load item database from CSV (name, type, value, rarity), display all items
- Starter code: CSV file provided, import csv shown, student writes reader
- XP: 150

**Lesson 22: Processing CSV Data**
- Concept: `csv-parsing`
- Learn: Filtering, sorting, aggregating CSV data
- Task: Load monster stats CSV, find strongest by type, calculate average HP, sort by danger level
- Starter code: CSV file provided, student writes analysis functions
- XP: 150

**Lesson 23: Writing to CSV**
- Concept: `csv-parsing`
- Learn: csv.writer, DictWriter, creating new CSVs
- Task: Export combat log to CSV (turn number, attacker, damage, target health)
- Starter code: Combat data in list of dicts, student writes CSV export
- XP: 150

**Lesson 24: Data Processing Pipeline**
- Concept: `csv-parsing` + advanced functions
- Learn: Reading CSV → processing → writing results
- Task: Load equipment CSV, apply stat modifiers, filter by character class, export enhanced items CSV
- Starter code: Input CSV provided, student builds complete pipeline
- XP: 200

**Lesson 25: ⭐ CHALLENGE - Game Analytics System**
- **Retention Checkpoint**: CSV, JSON, file handling, data processing
- Task: Build analytics system for RPG game
  - Load player_stats.csv (name, class, level, gold, kills, deaths)
  - Load combat_log.json (list of combat encounters with details)
  - Analysis functions:
    - `top_players(n, sort_by)` - return top N players by metric
    - `class_statistics()` - return dict with stats per class
    - `generate_leaderboard()` - formatted leaderboard text
    - `export_report(filename)` - write analysis to new CSV
  - Combine data from CSV and JSON
  - Create comprehensive report
- Starter code: Data files only
- Success: Reads both formats, processes correctly, generates meaningful analytics
- XP: 450

---

### **Module 6: Error Handling & Debugging (Lessons 26-28)**

**Lesson 26: Try/Except Deep Dive**
- Concept: `error-handling`
- Learn: Specific exceptions, multiple except blocks, else, finally
- Task: Add error handling to file operations (FileNotFoundError, JSONDecodeError, etc.)
- Starter code: Working but fragile code provided, student adds robust error handling
- XP: 150

**Lesson 27: Raising Exceptions & Custom Errors**
- Concept: `error-handling`
- Learn: raise keyword, creating custom exception classes
- Task: Create custom exceptions (NotEnoughManaError, InventoryFullError, InvalidLevelError) and use them in game code
- Starter code: Game functions provided, student adds validation and custom exceptions
- XP: 200

**Lesson 28: Debugging Techniques**
- Concept: Advanced debugging
- Learn: Print debugging, assert statements, reading tracebacks
- Task: Debug a complex battle system with 5 hidden bugs (logic errors, off-by-one, None handling, etc.)
- Starter code: Buggy but complex code provided, student must find and fix all bugs
- XP: 200

---

### **Module 7: Building Complete Applications (Lessons 29-30)**

**Lesson 29: Multi-File Organization**
- Concept: Code organization
- Learn: Splitting code into modules, imports, `if __name__ == "__main__"`
- Task: Reorganize monolithic RPG code into separate files:
  - `character.py` - Character classes
  - `combat.py` - Battle system
  - `items.py` - Item and inventory systems
  - `save_load.py` - File handling
  - `main.py` - Game loop
  - Get everything working with proper imports
- Starter code: All code in one file provided, student splits and organizes
- XP: 250

**Lesson 30: ⭐ FINAL PROJECT - Complete RPG Game Engine**
- **Retention Checkpoint**: ALL intermediate concepts
- Task: Build a complete, playable text-based RPG from scratch
  - **Requirements:**
    - Multi-file structure (separate modules)
    - OOP: Character, Enemy, Item, Inventory classes with inheritance
    - Save/Load system (JSON for game state)
    - Combat system with turn-based battles
    - Inventory management
    - Shop system (buy/sell items)
    - Quest system (load from JSON, track completion)
    - Level up system with experience
    - At least 3 character classes with different abilities
    - At least 5 enemy types
    - Error handling throughout
    - Game loop with menu system:
      - Explore (encounter random enemies)
      - Inventory
      - Character status
      - Shop
      - Quests
      - Save game
      - Load game
      - Quit
  - **Technical Requirements:**
    - Must use inheritance and polymorphism
    - Must use JSON for quests, items, save data
    - Must use CSV for item shop database
    - Must handle errors gracefully
    - Must be organized across multiple files
    - Must include README with how to play
  - **Bonus Features:**
    - Boss battles
    - Equipment system (armor, weapons)
    - Magic/skill system
    - Achievement tracking
- Starter code: None (complete project from scratch)
- Success Criteria:
  - All required features work
  - Code is well-organized
  - OOP principles applied correctly
  - Data persists between sessions
  - No crashes from user input
  - Demonstrates mastery of all intermediate concepts
- XP: 1000
- Special: Completion awards "Python Applications Master" badge + unlocks Advanced course

---

## **Learning Objectives by Module**

### **Module 1: Advanced Functions**
- Write concise lambda functions
- Use list comprehensions effectively
- Apply functional programming concepts
- Choose appropriate technique for task

### **Module 2: OOP Fundamentals**
- Design classes with appropriate attributes
- Write instance methods using self
- Implement `__str__` and other special methods
- Compose classes together

### **Module 3: Inheritance & Advanced OOP**
- Create class hierarchies
- Override methods appropriately
- Use polymorphism effectively
- Understand class vs instance variables

### **Module 4: JSON Data**
- Read and write JSON files
- Navigate complex JSON structures
- Serialize/deserialize objects
- Choose JSON vs other formats

### **Module 5: CSV Data**
- Read and write CSV files
- Process tabular data
- Perform data analysis
- Build data pipelines

### **Module 6: Error Handling**
- Handle exceptions gracefully
- Create custom exceptions
- Debug systematically
- Write robust code

### **Module 7: Complete Applications**
- Organize code into modules
- Structure larger projects
- Integrate multiple concepts
- Build polished applications

---

## **Challenge Lesson Design Philosophy**

### **Intermediate Challenges Differ from Beginner:**

**Beginner Challenges:**
- Use 3-5 concepts
- Single file solutions
- 50-100 lines of code
- Clear step-by-step requirements

**Intermediate Challenges:**
- Use 5-8+ concepts
- Multi-function/class solutions
- 100-300 lines of code
- High-level requirements (student plans structure)
- Must demonstrate understanding of *when* to use concepts, not just *how*

### **Scaffolding Reduction:**
- Lessons 1-10: Some structure provided
- Lessons 11-20: Minimal structure, mostly requirements
- Lessons 21-28: Requirements only, student designs solution
- Lesson 29: Refactoring exercise (given working code to improve)
- Lesson 30: Completely independent project

---

## **XP Progression**

**Regular Lessons:** 100-200 XP
**Challenge Lessons:**
- Lesson 5: 300 XP (advanced functions)
- Lesson 10: 350 XP (OOP basics)
- Lesson 15: 400 XP (inheritance)
- Lesson 20: 400 XP (JSON integration)
- Lesson 25: 450 XP (data processing)
- Lesson 30: 1000 XP (final project)

**Total Course XP:** ~6500 XP (including regular lessons)

---

## **Hints Strategy for Intermediate**

### **Hint Complexity Increases:**

**Early Lessons (1-10):**
- Still provide 5 progressive hints
- Hint 4-5 can show significant code

**Mid Lessons (11-20):**
- 5 hints but less detailed
- Focus on approach, not code
- Hint 5 shows structure, not solution

**Late Lessons (21-28):**
- 3-4 hints (expect more independence)
- Conceptual guidance primarily
- Final hint is approach, not code

**Final Project (Lesson 30):**
- 3 hints maximum
- High-level architecture suggestions
- Point to documentation/previous lessons
- No code provided in hints

---

## **Prerequisites Checking**

Before allowing course activation:
```sql
SELECT COUNT(*) FROM user_course_progress 
WHERE user_id = ? 
AND course_id = 'python-fundamentals' 
AND status = 'completed'
```

Show locked message:
```
🔒 This course is locked!

To unlock Python Applications (Intermediate), you must first complete:
- ✅ Python Fundamentals (Beginner)

Keep learning, adventurer! Master the basics before taking on advanced quests.
```

---

## **Project Continuity**

Each challenge builds on previous challenges:
- Lesson 5: Damage calculator functions
- Lesson 10: Character system classes
- Lesson 15: Enemy system with inheritance
- Lesson 20: Save/load for characters
- Lesson 25: Analytics for game data
- Lesson 30: Combines ALL previous systems into complete game

By Lesson 30, students have built pieces of a complete RPG throughout the course. The final project is assembling and expanding those pieces.

---

## **Estimated Time per Lesson**

- Regular lessons (1-4, 6-9, etc.): 20-30 minutes
- Complex lessons (inheritance, JSON, CSV): 30-40 minutes
- Challenge lessons: 60-90 minutes
- Final project: 4-6 hours (can span multiple sessions)

**Total course time:** 25-30 hours

---

## **Success Criteria**

Student has mastered intermediate Python when they can:
- ✅ Write classes with inheritance hierarchies
- ✅ Work with JSON and CSV data
- ✅ Handle errors gracefully
- ✅ Organize code into modules
- ✅ Use advanced function techniques appropriately
- ✅ Build complete applications independently
- ✅ Debug complex issues systematically
- ✅ Make design decisions about code structure

---

## **Connection to Advanced Course**

The advanced course (Python Mastery) would build on this by adding:
- Async programming
- Database integration (SQLite)
- Web frameworks (Flask/FastAPI)
- APIs and HTTP
- Testing frameworks
- Decorators and metaclasses
- Performance optimization
- Design patterns

---
