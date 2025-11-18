# **Code Learning Coach - Course Framework Specification**

## **Project Goal**

Create a comprehensive course framework with reusable programming concepts across multiple languages, organized by category and skill level. This framework will integrate with your existing RPG-themed app and preserve any existing lessons.

---

## **Database Schema**

### **Core Tables**

```sql
-- Categories (Backend, Game Dev, Frontend)
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    order_index INTEGER
);

-- Skill Levels (Beginner, Intermediate, Advanced)
CREATE TABLE IF NOT EXISTS skill_levels (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    order_index INTEGER,
    min_level INTEGER,
    icon TEXT
);

-- Languages (Python, GDScript, C#, JavaScript)
CREATE TABLE IF NOT EXISTS languages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    file_extension TEXT
);

-- Courses (The main learning paths)
CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL,
    skill_level_id TEXT NOT NULL,
    language_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    estimated_hours INTEGER,
    lesson_count INTEGER,
    prerequisites TEXT,  -- JSON array of course IDs
    order_index INTEGER,
    is_featured BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (skill_level_id) REFERENCES skill_levels(id),
    FOREIGN KEY (language_id) REFERENCES languages(id)
);

-- Core Concepts (Reusable programming concepts)
CREATE TABLE IF NOT EXISTS concepts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,  -- 'fundamentals', 'control_flow', 'functions', 'oop', 'data', 'advanced'
    difficulty INTEGER  -- 1-10
);

-- Concept Implementations (Language-specific versions)
CREATE TABLE IF NOT EXISTS concept_implementations (
    id INTEGER PRIMARY KEY,
    concept_id TEXT NOT NULL,
    language_id TEXT NOT NULL,
    explanation TEXT,
    code_example TEXT,
    syntax_notes TEXT,
    common_mistakes TEXT,  -- JSON array
    
    FOREIGN KEY (concept_id) REFERENCES concepts(id),
    FOREIGN KEY (language_id) REFERENCES languages(id),
    UNIQUE(concept_id, language_id)
);

-- Lessons (Individual learning units within a course)
CREATE TABLE IF NOT EXISTS lessons (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL,
    concept_id TEXT,  -- Optional link to reusable concept
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER,
    
    -- Lesson content
    starter_code TEXT,
    solution_code TEXT,
    validation_tests TEXT,  -- JSON
    hints TEXT,  -- JSON array
    
    -- Metadata
    estimated_minutes INTEGER,
    xp_reward INTEGER DEFAULT 100,
    
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (concept_id) REFERENCES concepts(id)
);

-- User Progress Tables
CREATE TABLE IF NOT EXISTS user_course_progress (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    course_id TEXT NOT NULL,
    status TEXT DEFAULT 'not_started',
    lessons_completed INTEGER DEFAULT 0,
    completion_percentage INTEGER DEFAULT 0,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    UNIQUE(user_id, course_id)
);

CREATE TABLE IF NOT EXISTS user_lesson_progress (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    lesson_id TEXT NOT NULL,
    status TEXT DEFAULT 'not_started',
    attempts INTEGER DEFAULT 0,
    user_code TEXT,
    completed_at TIMESTAMP,
    time_spent INTEGER DEFAULT 0,
    UNIQUE(user_id, lesson_id)
);
```

---

## **Seed Data Requirements**

### **1. Categories** (3 total)
```json
[
    {
        "id": "backend",
        "name": "Backend Development",
        "description": "Server-side programming, databases, APIs",
        "icon": "🖥️",
        "order_index": 1
    },
    {
        "id": "gamedev",
        "name": "Game Development",
        "description": "Build 2D and 3D games",
        "icon": "🎮",
        "order_index": 2
    },
    {
        "id": "frontend",
        "name": "Frontend Development",
        "description": "Web interfaces, user experiences",
        "icon": "🌐",
        "order_index": 3
    }
]
```

### **2. Skill Levels** (3 total)
```json
[
    {
        "id": "beginner",
        "name": "Beginner",
        "description": "New to programming or this language",
        "order_index": 1,
        "min_level": 1,
        "icon": "🌱"
    },
    {
        "id": "intermediate",
        "name": "Intermediate",
        "description": "Comfortable with basics, ready for more",
        "order_index": 2,
        "min_level": 5,
        "icon": "🌿"
    },
    {
        "id": "advanced",
        "name": "Advanced",
        "description": "Master complex topics and patterns",
        "order_index": 3,
        "min_level": 10,
        "icon": "🌳"
    }
]
```

### **3. Languages** (4 total)
```json
[
    {
        "id": "python",
        "name": "Python",
        "description": "Versatile, beginner-friendly language",
        "icon": "🐍",
        "file_extension": ".py"
    },
    {
        "id": "gdscript",
        "name": "GDScript",
        "description": "Godot's game development language",
        "icon": "🎲",
        "file_extension": ".gd"
    },
    {
        "id": "csharp",
        "name": "C#",
        "description": "Powerful for games and enterprise",
        "icon": "🔷",
        "file_extension": ".cs"
    },
    {
        "id": "javascript",
        "name": "JavaScript",
        "description": "Language of the web",
        "icon": "📜",
        "file_extension": ".js"
    }
]
```

---

## **Core Concepts List** (34 total - reusable across languages)

### **Fundamentals (5 concepts)**
```json
[
    {
        "id": "variables-and-types",
        "name": "Variables & Data Types",
        "description": "Storing and working with different types of data",
        "category": "fundamentals",
        "difficulty": 1
    },
    {
        "id": "operators",
        "name": "Operators",
        "description": "Math, comparison, and logical operations",
        "category": "fundamentals",
        "difficulty": 2
    },
    {
        "id": "string-manipulation",
        "name": "String Manipulation",
        "description": "Working with text data",
        "category": "fundamentals",
        "difficulty": 2
    },
    {
        "id": "input-output",
        "name": "User Input/Output",
        "description": "Getting input from users and displaying results",
        "category": "fundamentals",
        "difficulty": 1
    },
    {
        "id": "comments",
        "name": "Comments & Documentation",
        "description": "Documenting your code",
        "category": "fundamentals",
        "difficulty": 1
    }
]
```

### **Control Flow (7 concepts)**
```json
[
    {
        "id": "if-statements",
        "name": "If Statements",
        "description": "Making decisions in code",
        "category": "control_flow",
        "difficulty": 2
    },
    {
        "id": "if-else",
        "name": "If/Else Branching",
        "description": "Two-way decision making",
        "category": "control_flow",
        "difficulty": 2
    },
    {
        "id": "multiple-conditions",
        "name": "Multiple Conditions",
        "description": "Handling multiple cases with elif/else if",
        "category": "control_flow",
        "difficulty": 3
    },
    {
        "id": "for-loops",
        "name": "For Loops",
        "description": "Repeating actions a specific number of times",
        "category": "control_flow",
        "difficulty": 3
    },
    {
        "id": "while-loops",
        "name": "While Loops",
        "description": "Repeating while a condition is true",
        "category": "control_flow",
        "difficulty": 3
    },
    {
        "id": "loop-control",
        "name": "Loop Control",
        "description": "Breaking out and skipping iterations",
        "category": "control_flow",
        "difficulty": 4
    },
    {
        "id": "nested-loops",
        "name": "Nested Loops",
        "description": "Loops inside loops",
        "category": "control_flow",
        "difficulty": 4
    }
]
```

### **Functions (5 concepts)**
```json
[
    {
        "id": "function-basics",
        "name": "Function Basics",
        "description": "Creating reusable code blocks",
        "category": "functions",
        "difficulty": 3
    },
    {
        "id": "parameters-arguments",
        "name": "Parameters & Arguments",
        "description": "Passing data to functions",
        "category": "functions",
        "difficulty": 3
    },
    {
        "id": "return-values",
        "name": "Return Values",
        "description": "Getting results from functions",
        "category": "functions",
        "difficulty": 3
    },
    {
        "id": "scope",
        "name": "Variable Scope",
        "description": "Where variables are accessible",
        "category": "functions",
        "difficulty": 4
    },
    {
        "id": "default-parameters",
        "name": "Default Parameters",
        "description": "Optional function parameters",
        "category": "functions",
        "difficulty": 4
    }
]
```

### **Data Structures (4 concepts)**
```json
[
    {
        "id": "lists-arrays",
        "name": "Lists/Arrays",
        "description": "Ordered collections of items",
        "category": "data_structures",
        "difficulty": 3
    },
    {
        "id": "dictionaries-objects",
        "name": "Dictionaries/Objects",
        "description": "Key-value pair collections",
        "category": "data_structures",
        "difficulty": 4
    },
    {
        "id": "tuples",
        "name": "Tuples/Records",
        "description": "Immutable ordered collections",
        "category": "data_structures",
        "difficulty": 4
    },
    {
        "id": "sets",
        "name": "Sets",
        "description": "Unique item collections",
        "category": "data_structures",
        "difficulty": 4
    }
]
```

### **Object-Oriented Programming (5 concepts)**
```json
[
    {
        "id": "classes-objects",
        "name": "Classes & Objects",
        "description": "Creating custom data types",
        "category": "oop",
        "difficulty": 5
    },
    {
        "id": "properties-methods",
        "name": "Properties & Methods",
        "description": "Object attributes and behaviors",
        "category": "oop",
        "difficulty": 5
    },
    {
        "id": "constructors",
        "name": "Constructors",
        "description": "Initializing objects",
        "category": "oop",
        "difficulty": 5
    },
    {
        "id": "inheritance",
        "name": "Inheritance",
        "description": "Creating specialized classes",
        "category": "oop",
        "difficulty": 6
    },
    {
        "id": "polymorphism",
        "name": "Polymorphism",
        "description": "Objects taking multiple forms",
        "category": "oop",
        "difficulty": 7
    }
]
```

### **File & Data (4 concepts)**
```json
[
    {
        "id": "reading-files",
        "name": "Reading Files",
        "description": "Loading data from files",
        "category": "file_data",
        "difficulty": 4
    },
    {
        "id": "writing-files",
        "name": "Writing Files",
        "description": "Saving data to files",
        "category": "file_data",
        "difficulty": 4
    },
    {
        "id": "json-handling",
        "name": "JSON Handling",
        "description": "Working with JSON data",
        "category": "file_data",
        "difficulty": 5
    },
    {
        "id": "csv-parsing",
        "name": "CSV/Data Parsing",
        "description": "Working with structured data files",
        "category": "file_data",
        "difficulty": 5
    }
]
```

### **Advanced (4 concepts)**
```json
[
    {
        "id": "error-handling",
        "name": "Error Handling",
        "description": "Gracefully handling errors",
        "category": "advanced",
        "difficulty": 5
    },
    {
        "id": "async-basics",
        "name": "Async/Callbacks",
        "description": "Non-blocking code execution",
        "category": "advanced",
        "difficulty": 7
    },
    {
        "id": "regular-expressions",
        "name": "Regular Expressions",
        "description": "Pattern matching in text",
        "category": "advanced",
        "difficulty": 7
    },
    {
        "id": "testing-basics",
        "name": "Testing Basics",
        "description": "Writing tests for your code",
        "category": "advanced",
        "difficulty": 6
    }
]
```

---

## **Initial Course Structure**

### **Backend Category Courses**

#### **Course 1: Python Fundamentals** (Beginner)
```json
{
    "id": "python-fundamentals",
    "category_id": "backend",
    "skill_level_id": "beginner",
    "language_id": "python",
    "name": "Python Fundamentals",
    "description": "Learn Python from scratch - variables, loops, functions, and data structures",
    "estimated_hours": 20,
    "lesson_count": 30,
    "prerequisites": null,
    "order_index": 1,
    "is_featured": true
}
```

**Module Outline:**
- Module 1: Hello World & Variables (5 lessons) - Concepts: input-output, variables-and-types, operators, string-manipulation, comments
- Module 2: Control Flow (7 lessons) - Concepts: if-statements, if-else, multiple-conditions, for-loops, while-loops, loop-control, nested-loops
- Module 3: Functions (5 lessons) - Concepts: function-basics, parameters-arguments, return-values, scope, default-parameters
- Module 4: Data Structures (8 lessons) - Concepts: lists-arrays, dictionaries-objects, tuples, sets
- Module 5: Practical Project (5 lessons) - Integration: reading-files, writing-files, error-handling, final project

#### **Course 2: Python Applications** (Intermediate)
```json
{
    "id": "python-applications",
    "category_id": "backend",
    "skill_level_id": "intermediate",
    "language_id": "python",
    "name": "Python Applications",
    "description": "Build complete applications with OOP, file handling, and external libraries",
    "estimated_hours": 25,
    "lesson_count": 30,
    "prerequisites": ["python-fundamentals"],
    "order_index": 2,
    "is_featured": false
}
```

**Module Outline:**
- Module 6: Advanced Functions (5 lessons) - Lambda, comprehensions, recursion
- Module 7: Object-Oriented Programming (8 lessons) - Concepts: classes-objects, properties-methods, constructors, inheritance, polymorphism
- Module 8: Working with Data (7 lessons) - Concepts: json-handling, csv-parsing, data validation
- Module 9: Libraries & Tools (5 lessons) - pip, modules, standard library
- Module 10: Complete Application Project (5 lessons) - Multi-file application

#### **Course 3: Python Mastery** (Advanced)
```json
{
    "id": "python-mastery",
    "category_id": "backend",
    "skill_level_id": "advanced",
    "language_id": "python",
    "name": "Python Mastery",
    "description": "Professional Python with async, testing, and web frameworks",
    "estimated_hours": 30,
    "lesson_count": 30,
    "prerequisites": ["python-applications"],
    "order_index": 3,
    "is_featured": false
}
```

**Module Outline:**
- Module 11: Advanced OOP (5 lessons) - Decorators, magic methods, design patterns
- Module 12: Async & Performance (5 lessons) - Concept: async-basics, threading, optimization
- Module 13: Testing & Quality (5 lessons) - Concept: testing-basics, TDD, documentation
- Module 14: Web Development (8 lessons) - Flask/FastAPI, REST APIs
- Module 15: Capstone Project (7 lessons) - Full-stack application

### **Game Dev Category Courses**

#### **Course 4: Godot & GDScript Basics** (Beginner)
```json
{
    "id": "godot-basics",
    "category_id": "gamedev",
    "skill_level_id": "beginner",
    "language_id": "gdscript",
    "name": "Godot & GDScript Basics",
    "description": "Learn game development with Godot engine and GDScript",
    "estimated_hours": 20,
    "lesson_count": 25,
    "prerequisites": null,
    "order_index": 1,
    "is_featured": true
}
```

**Module Outline:**
- Module 1: GDScript Fundamentals (8 lessons) - Reuse concepts 1-12 (fundamentals + control flow)
- Module 2: Godot Nodes & Scenes (5 lessons) - Engine-specific
- Module 3: 2D Game Basics (6 lessons) - Movement, collision, sprites
- Module 4: Input & UI (3 lessons) - Controls, menus
- Module 5: First Game Project (3 lessons) - Complete simple game

#### **Course 5: Godot 2D Games** (Intermediate)
```json
{
    "id": "godot-2d-games",
    "category_id": "gamedev",
    "skill_level_id": "intermediate",
    "language_id": "gdscript",
    "name": "Godot 2D Games",
    "description": "Build complete 2D games with physics, AI, and polish",
    "estimated_hours": 25,
    "lesson_count": 25,
    "prerequisites": ["godot-basics"],
    "order_index": 2,
    "is_featured": false
}
```

#### **Course 6: Godot 3D & Advanced** (Advanced)
```json
{
    "id": "godot-3d-advanced",
    "category_id": "gamedev",
    "skill_level_id": "advanced",
    "language_id": "gdscript",
    "name": "Godot 3D & Advanced",
    "description": "3D games, advanced systems, optimization, and deployment",
    "estimated_hours": 30,
    "lesson_count": 30,
    "prerequisites": ["godot-2d-games"],
    "order_index": 3,
    "is_featured": false
}
```

### **Frontend Category Courses**

#### **Course 7: JavaScript Fundamentals** (Beginner)
```json
{
    "id": "javascript-fundamentals",
    "category_id": "frontend",
    "skill_level_id": "beginner",
    "language_id": "javascript",
    "name": "JavaScript Fundamentals",
    "description": "Learn JavaScript for web development - from basics to DOM manipulation",
    "estimated_hours": 20,
    "lesson_count": 30,
    "prerequisites": null,
    "order_index": 1,
    "is_featured": true
}
```

**Module Outline:**
- Modules 1-4: Reuse concepts 1-21 (fundamentals through data structures)
- Module 5: Web Specific (10 lessons) - DOM manipulation, events, browser APIs

#### **Course 8: Modern JavaScript** (Intermediate)
```json
{
    "id": "modern-javascript",
    "category_id": "frontend",
    "skill_level_id": "intermediate",
    "language_id": "javascript",
    "name": "Modern JavaScript",
    "description": "ES6+, async programming, and modern frameworks",
    "estimated_hours": 25,
    "lesson_count": 30,
    "prerequisites": ["javascript-fundamentals"],
    "order_index": 2,
    "is_featured": false
}
```

#### **Course 9: Full Stack JavaScript** (Advanced)
```json
{
    "id": "fullstack-javascript",
    "category_id": "frontend",
    "skill_level_id": "advanced",
    "language_id": "javascript",
    "name": "Full Stack JavaScript",
    "description": "React, Node.js, databases, and deployment",
    "estimated_hours": 35,
    "lesson_count": 35,
    "prerequisites": ["modern-javascript"],
    "order_index": 3,
    "is_featured": false
}
```

---

## **Lesson Structure Template**

```typescript
interface Lesson {
    id: string;                    // Format: {course_id}-lesson-{number}
    course_id: string;
    concept_id: string | null;     // Link to reusable concept
    title: string;
    description: string;           // Markdown format
    order_index: number;
    starter_code: string;
    solution_code: string;
    validation_tests: string;      // JSON stringified array
    hints: string;                 // JSON stringified array
    estimated_minutes: number;
    xp_reward: number;
}
```

---

## **Concept Implementation Example Structure**

```json
{
    "concept_id": "variables-and-types",
    "language_id": "python",
    "explanation": "In Python, variables are created by assignment. You don't need to declare the type - Python figures it out automatically (dynamic typing).",
    "code_example": "# Creating variables\nname = \"Hero\"  # String\nage = 25  # Integer\nheight = 5.9  # Float\nis_active = True  # Boolean",
    "syntax_notes": "Variable names must start with a letter or underscore. Use snake_case for variable names (Python convention).",
    "common_mistakes": [
        "Starting variable names with numbers",
        "Using reserved keywords (class, for, if, etc.)",
        "Forgetting quotes around strings"
    ]
}
```

---

## **Tasks for Claude Code**

### **Phase 1: Database & Core Data (PRIORITY)**
1. **DO NOT overwrite existing database tables** - Use `CREATE TABLE IF NOT EXISTS`
2. Create migration script that checks for existing data before inserting
3. Create seed data files for:
   - 3 categories
   - 3 skill levels  
   - 4 languages
   - 34 core concepts
   - 9 course definitions

### **Phase 2: Concept Implementations**
4. Create concept implementations for Python (all 34 concepts)
5. Create concept implementations for GDScript (focus on concepts 1-21)
6. Create concept implementations for JavaScript (focus on concepts 1-21)

### **Phase 3: Lesson Content - Python Fundamentals**
7. Build 30 lessons for "Python Fundamentals" course
8. **Check for existing lessons first** - Do not overwrite
9. Use naming convention: `python-fundamentals-lesson-{01-30}`
10. Each lesson needs:
    - Title, description (markdown)
    - Starter code with helpful comments
    - Solution code (one good solution)
    - 3-5 validation tests (JSON array)
    - 3-5 graduated hints (JSON array)
    - XP reward (50-500 based on complexity)
    - Link to concept_id where applicable

### **Phase 4: Additional Priority Courses**
11. Build "Godot & GDScript Basics" - 25 lessons
12. Build "JavaScript Fundamentals" - 30 lessons

### **Phase 5: Remaining Courses**
13. Build remaining intermediate/advanced courses as outlined

---

## **Implementation Guidelines**

### **Database Safety**
- Always use `IF NOT EXISTS` for table creation
- Check for existing records before inserting seed data
- Provide "upsert" logic (insert if not exists, skip if exists)
- Never drop tables or delete existing user data

### **Lesson Content Guidelines**

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
- Types: `output`, `variable_exists`, `function_exists`, `function_returns`, `custom`

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

### **Theme Integration**
- Lessons should fit naturally with the existing RPG theme
- Use adventure/quest language where appropriate
- Examples can reference game concepts (health, inventory, quests, etc.)
- Maintain consistency with existing UI/UX patterns

---

## **File Organization**

```
/course-framework-output/
├── database/
│   ├── schema.sql                 # CREATE IF NOT EXISTS
│   └── seed_data.sql              # INSERT OR IGNORE
│
├── seed-data/
│   ├── categories.json
│   ├── skill_levels.json
│   ├── languages.json
│   ├── concepts.json
│   └── courses.json
│
├── concept-implementations/
│   ├── python/
│   │   ├── fundamentals.json
│   │   ├── control-flow.json
│   │   ├── functions.json
│   │   ├── data-structures.json
│   │   ├── oop.json
│   │   ├── file-data.json
│   │   └── advanced.json
│   ├── gdscript/
│   │   └── [similar structure]
│   └── javascript/
│       └── [similar structure]
│
├── lessons/
│   ├── python-fundamentals/
│   │   ├── module-1-hello-world-variables/
│   │   │   ├── lesson-01.json
│   │   │   ├── lesson-02.json
│   │   │   ├── lesson-03.json
│   │   │   ├── lesson-04.json
│   │   │   └── lesson-05.json
│   │   ├── module-2-control-flow/
│   │   │   └── [lessons 06-12]
│   │   ├── module-3-functions/
│   │   │   └── [lessons 13-17]
│   │   ├── module-4-data-structures/
│   │   │   └── [lessons 18-25]
│   │   └── module-5-practical-project/
│   │       └── [lessons 26-30]
│   │
│   ├── godot-basics/
│   │   └── [25 lessons organized by module]
│   │
│   └── javascript-fundamentals/
│       └── [30 lessons organized by module]
│
├── import-scripts/
│   ├── import_all.py              # Master import script
│   ├── import_concepts.py
│   └── import_lessons.py
│
└── README.md
```

---

## **Success Criteria**

The course framework is complete when:

1. ✅ Database schema created with IF NOT EXISTS safety
2. ✅ All seed data defined and safely importable
3. ✅ Python concept implementations (34 concepts)
4. ✅ GDScript concept implementations (fundamentals)
5. ✅ JavaScript concept implementations (fundamentals)
6. ✅ Python Fundamentals course: 30 complete lessons
7. ✅ Godot Basics course: 25 complete lessons
8. ✅ JavaScript Fundamentals course: 30 complete lessons
9. ✅ Import scripts that check existing data
10. ✅ Documentation for integration

---

## **Priority Order**

**High Priority:**
- Database schema (safe, non-destructive)
- Core seed data
- Python concept implementations
- Python Fundamentals course (30 lessons)

**Medium Priority:**
- Godot Basics course (25 lessons)
- GDScript concept implementations
- JavaScript Fundamentals course (30 lessons)

**Lower Priority:**
- Intermediate/Advanced courses
- Additional concept implementations

---

## **Critical Notes**

- **Preserve existing content** - Never overwrite existing lessons, themes, or user data
- **RPG theme compatible** - Use quest/adventure language naturally
- **Modular design** - Each component should work independently
- **Validation flexibility** - Tests should allow multiple correct approaches
- **Real-world examples** - Make lessons practical and engaging
- **Clear progression** - Each lesson builds on previous concepts

---

This specification provides everything needed to build the course framework while respecting your existing RPG-themed app and any lessons already created.