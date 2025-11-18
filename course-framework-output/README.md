# Code Learning Coach - Course Framework Implementation

## Overview

This directory contains the comprehensive course framework for the Code Learning Coach application. It includes:

- **Database Schema**: SQLite database structure for courses, lessons, concepts, and progress tracking
- **Seed Data**: Categories, skill levels, languages, concepts, and course definitions
- **Concept Implementations**: Language-specific explanations and examples for 34 programming concepts
- **Lesson Content**: Structured lessons for multiple programming languages (in progress)

## Directory Structure

```
course-framework-output/
├── database/
│   └── schema.sql                    # Complete database schema
│
├── seed-data/
│   ├── categories.json               # 3 categories: Backend, Game Dev, Frontend
│   ├── skill_levels.json             # 3 levels: Beginner, Intermediate, Advanced
│   ├── languages.json                # 5 languages: Python, GDScript, C#, JavaScript, Ruby
│   ├── concepts.json                 # 34 reusable programming concepts
│   └── courses.json                  # 12 course definitions
│
├── concept-implementations/
│   ├── python/                       # ✅ COMPLETE - All 34 concepts
│   │   ├── fundamentals.json         # 5 concepts
│   │   ├── control-flow.json         # 7 concepts
│   │   ├── functions.json            # 5 concepts
│   │   ├── data-structures.json      # 4 concepts
│   │   ├── oop.json                  # 5 concepts
│   │   ├── file-data.json            # 4 concepts
│   │   └── advanced.json             # 4 concepts
│   ├── gdscript/                     # 🔄 IN PROGRESS
│   ├── javascript/                   # 🔄 IN PROGRESS
│   └── csharp/                       # 🔄 IN PROGRESS
│
├── lessons/
│   ├── python-fundamentals/          # 📋 PLANNED - 30 lessons
│   ├── godot-basics/                 # 📋 PLANNED - 25 lessons
│   ├── javascript-fundamentals/      # 📋 PLANNED - 30 lessons
│   └── csharp-fundamentals/          # 📋 PLANNED - 30 lessons
│
├── import-scripts/                   # 🔄 TO BE CREATED
│   ├── import_all.py
│   ├── import_concepts.py
│   └── import_lessons.py
│
└── README.md                         # This file
```

## Database Schema

The database schema includes the following tables:

### Core Tables
- **categories**: Backend, Game Dev, Frontend
- **skill_levels**: Beginner, Intermediate, Advanced
- **languages**: Python, GDScript, C#, JavaScript, Ruby
- **concepts**: 34 reusable programming concepts
- **concept_implementations**: Language-specific versions of concepts
- **courses**: Main learning paths
- **lessons**: Individual learning units within courses

### Progress Tracking
- **user_course_progress**: Track course completion
- **user_lesson_progress**: Track individual lesson progress

All tables use `IF NOT EXISTS` to safely preserve existing data.

## Seed Data

### Categories (3)
1. **Backend Development** 🖥️ - Server-side programming, databases, APIs
2. **Game Development** 🎮 - Build 2D and 3D games
3. **Frontend Development** 🌐 - Web interfaces, user experiences

### Skill Levels (3)
1. **Beginner** 🌱 - New to programming or this language (Level 1+)
2. **Intermediate** 🌿 - Comfortable with basics, ready for more (Level 5+)
3. **Advanced** 🌳 - Master complex topics and patterns (Level 10+)

### Languages (5)
1. **Python** 🐍 - Versatile, beginner-friendly language
2. **GDScript** 🎲 - Godot's game development language
3. **C#** 🔷 - Powerful for games and enterprise
4. **JavaScript** 📜 - Language of the web
5. **Ruby** 💎 - Elegant and expressive programming

### Core Concepts (34)

#### Fundamentals (5)
- Variables & Data Types
- Operators
- String Manipulation
- User Input/Output
- Comments & Documentation

#### Control Flow (7)
- If Statements
- If/Else Branching
- Multiple Conditions
- For Loops
- While Loops
- Loop Control (break/continue)
- Nested Loops

#### Functions (5)
- Function Basics
- Parameters & Arguments
- Return Values
- Variable Scope
- Default Parameters

#### Data Structures (4)
- Lists/Arrays
- Dictionaries/Objects
- Tuples/Records
- Sets

#### Object-Oriented Programming (5)
- Classes & Objects
- Properties & Methods
- Constructors
- Inheritance
- Polymorphism

#### File & Data (4)
- Reading Files
- Writing Files
- JSON Handling
- CSV/Data Parsing

#### Advanced (4)
- Error Handling
- Async/Callbacks
- Regular Expressions
- Testing Basics

### Courses (12)

#### Backend Development
1. **Python Fundamentals** (Beginner) - 30 lessons, 20 hours
2. **Python Applications** (Intermediate) - 30 lessons, 25 hours
3. **Python Mastery** (Advanced) - 30 lessons, 30 hours
4. **C# Fundamentals** (Beginner) - 30 lessons, 20 hours
5. **C# Applications** (Intermediate) - 30 lessons, 25 hours
6. **Ruby Fundamentals** (Beginner) - 30 lessons, 20 hours

#### Game Development
7. **Godot & GDScript Basics** (Beginner) - 25 lessons, 20 hours
8. **Godot 2D Games** (Intermediate) - 25 lessons, 25 hours
9. **Godot 3D & Advanced** (Advanced) - 30 lessons, 30 hours

#### Frontend Development
10. **JavaScript Fundamentals** (Beginner) - 30 lessons, 20 hours
11. **Modern JavaScript** (Intermediate) - 30 lessons, 25 hours
12. **Full Stack JavaScript** (Advanced) - 35 lessons, 35 hours

## Concept Implementations

### Python ✅ COMPLETE

All 34 concepts have been implemented for Python with:
- Detailed explanations
- Comprehensive code examples with game/RPG themes
- Syntax notes
- Common mistakes to avoid

Each concept implementation includes:
```json
{
  "concept_id": "variables-and-types",
  "language_id": "python",
  "explanation": "...",
  "code_example": "...",
  "syntax_notes": "...",
  "common_mistakes": "[...]"
}
```

## Lesson Structure

Each lesson follows this structure:

```json
{
  "id": "course-id-lesson-01",
  "course_id": "course-id",
  "concept_id": "concept-id",
  "title": "Lesson Title",
  "subtitle": "Lesson Subtitle",
  "description": "Markdown-formatted lesson content",
  "order_index": 1,
  "starter_code": "// Initial code",
  "solution_code": "// Solution code",
  "validation_tests": [...],
  "hints": [...],
  "estimated_minutes": 10,
  "estimated_time": "5-10 minutes",
  "xp_reward": 100,
  "difficulty": 1,
  "learning_objectives": [...],
  "tags": [...],
  "next_lesson_id": "course-id-lesson-02",
  "previous_lesson_id": null
}
```

## Integration with Existing App

### Current Lesson System
The app currently uses:
- Static JSON imports from `docs/lessons/*.json`
- `src/lib/lessons.ts` for lesson management
- 30 existing lessons (10 Python, 5 GDScript, 5 C#, 5 JavaScript, 5 Ruby)

### Migration Path
1. Keep existing lessons intact
2. Implement database-based lesson system alongside static system
3. Gradually migrate existing lessons to database
4. Implement course/category selection UI
5. Add progress tracking

## Next Steps

### High Priority
1. ✅ Database schema
2. ✅ Seed data
3. ✅ Python concept implementations
4. 🔄 Create import scripts for database population
5. 🔄 Build Python Fundamentals lessons (30 total)
6. 🔄 Build GDScript/JavaScript/C# concept implementations
7. 🔄 Build corresponding beginner courses

### Medium Priority
- Godot Basics course (25 lessons)
- JavaScript Fundamentals course (30 lessons)
- C# Fundamentals course (30 lessons)

### Lower Priority
- Intermediate/Advanced courses
- Additional concept implementations
- Course recommendation engine

## Usage

### 1. Set Up Database
```bash
# Run schema creation
sqlite3 lessons.db < database/schema.sql
```

### 2. Import Seed Data
```bash
# Use import scripts (to be created)
python import-scripts/import_all.py
```

### 3. Verify Data
```bash
sqlite3 lessons.db
sqlite> SELECT * FROM categories;
sqlite> SELECT * FROM courses;
sqlite> SELECT COUNT(*) FROM concepts;
```

## Implementation Guidelines

### Lesson Content Guidelines

**Progressive Difficulty:**
- Lessons 1-10: Very simple, single concept, lots of scaffolding
- Lessons 11-20: Combine 2 concepts, less hand-holding
- Lessons 21-30: Multiple concepts, real-world problems

**Starter Code:**
- Lessons 1-15: Significant starter code with comments
- Lessons 16-25: Basic structure, students fill in logic
- Lessons 26-30: Minimal starter code, build from scratch

**Validation Tests:**
- At least 1 "happy path" test
- At least 1 edge case (if applicable)
- Clear descriptions visible to users
- Types: `output_contains`, `variable_exists`, `function_exists`, `function_returns`, `code_contains`

**Hints:**
- Hint 1: Conceptual nudge
- Hint 2: More specific guidance
- Hint 3: Code snippet or pseudocode
- Hint 4: Almost the solution
- Hint 5: Link to concept or documentation

**XP Rewards:**
- Simple lessons (1-10): 50-100 XP
- Medium lessons (11-20): 100-150 XP
- Complex lessons (21-25): 150-200 XP
- Project lessons (26-30): 200-500 XP

### Theme Integration
- Use RPG/adventure language naturally
- Examples reference game concepts (health, inventory, quests)
- Maintain consistency with existing UI/UX patterns

## Status Summary

### ✅ Completed
- Database schema with all tables
- 3 categories
- 3 skill levels
- 5 languages
- 34 core concepts
- 12 course definitions
- Python: All 34 concept implementations

### 🔄 In Progress
- Documentation (this README)

### 📋 Planned
- GDScript concept implementations (21 concepts)
- JavaScript concept implementations (21 concepts)
- C# concept implementations (21 concepts)
- Python Fundamentals lessons (30 lessons)
- Godot Basics lessons (25 lessons)
- JavaScript Fundamentals lessons (30 lessons)
- C# Fundamentals lessons (30 lessons)
- Database import scripts
- Integration testing

## Contributing

When creating new lessons:
1. Follow the lesson structure template
2. Use appropriate concept_id links
3. Provide progressive hints
4. Include comprehensive validation tests
5. Use RPG-themed examples where appropriate
6. Test lessons manually before committing

## Support

For questions or issues with the course framework:
1. Review this README
2. Check [docs/course-framework.md](../docs/course-framework.md) for detailed specifications
3. Review existing examples in `concept-implementations/python/`

---

**Last Updated**: Progress as of lesson framework implementation
**Total Concepts**: 34
**Total Courses**: 12 planned
**Languages Supported**: 5
