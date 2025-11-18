-- Course Framework Database Schema
-- IMPORTANT: Uses IF NOT EXISTS to preserve existing data

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

-- Languages (Python, GDScript, C#, JavaScript, Ruby)
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
    category TEXT,  -- 'fundamentals', 'control_flow', 'functions', 'oop', 'data_structures', 'file_data', 'advanced'
    difficulty INTEGER  -- 1-10
);

-- Concept Implementations (Language-specific versions)
CREATE TABLE IF NOT EXISTS concept_implementations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    subtitle TEXT,
    description TEXT,
    order_index INTEGER,

    -- Lesson content
    starter_code TEXT,
    solution_code TEXT,
    validation_tests TEXT,  -- JSON
    hints TEXT,  -- JSON array

    -- Metadata
    estimated_minutes INTEGER,
    estimated_time TEXT,  -- Human-readable format
    xp_reward INTEGER DEFAULT 100,
    difficulty INTEGER DEFAULT 1,
    learning_objectives TEXT,  -- JSON array
    tags TEXT,  -- JSON array

    -- Navigation
    next_lesson_id TEXT,
    previous_lesson_id TEXT,

    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (concept_id) REFERENCES concepts(id)
);

-- User Progress Tables
CREATE TABLE IF NOT EXISTS user_course_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    course_id TEXT NOT NULL,
    status TEXT DEFAULT 'not_started',  -- 'not_started', 'in_progress', 'completed'
    lessons_completed INTEGER DEFAULT 0,
    completion_percentage INTEGER DEFAULT 0,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    UNIQUE(user_id, course_id)
);

CREATE TABLE IF NOT EXISTS user_lesson_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    lesson_id TEXT NOT NULL,
    status TEXT DEFAULT 'not_started',  -- 'not_started', 'in_progress', 'completed'
    attempts INTEGER DEFAULT 0,
    user_code TEXT,
    completed_at TIMESTAMP,
    time_spent INTEGER DEFAULT 0,  -- in seconds
    UNIQUE(user_id, lesson_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category_id);
CREATE INDEX IF NOT EXISTS idx_courses_skill_level ON courses(skill_level_id);
CREATE INDEX IF NOT EXISTS idx_courses_language ON courses(language_id);
CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_concept ON lessons(concept_id);
CREATE INDEX IF NOT EXISTS idx_user_course_progress ON user_course_progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress ON user_lesson_progress(user_id, lesson_id);
