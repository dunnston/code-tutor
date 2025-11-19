-- Playground Module Database Schema
-- Create tables for user projects, templates, snippets, and community features

-- User's saved playground projects
CREATE TABLE IF NOT EXISTS playground_projects (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL DEFAULT 1,

    -- Project info
    name TEXT NOT NULL,
    description TEXT,
    language_id TEXT NOT NULL,

    -- Code
    code TEXT NOT NULL,

    -- Metadata
    is_public BOOLEAN DEFAULT FALSE,
    is_favorite BOOLEAN DEFAULT FALSE,
    fork_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,

    -- Original if forked
    forked_from_id TEXT,

    -- Tags for categorization
    tags TEXT,  -- JSON array: ["game", "tutorial", "algorithm"]

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_run_at TIMESTAMP,

    FOREIGN KEY (language_id) REFERENCES languages(id),
    FOREIGN KEY (forked_from_id) REFERENCES playground_projects(id)
);

-- Playground templates (starter code)
CREATE TABLE IF NOT EXISTS playground_templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    language_id TEXT NOT NULL,
    category TEXT NOT NULL,  -- 'game', 'algorithm', 'data-viz', 'utility', etc.

    -- Template code
    code TEXT NOT NULL,

    -- Metadata
    difficulty TEXT,  -- 'beginner', 'intermediate', 'advanced'
    tags TEXT,        -- JSON array
    icon TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    order_index INTEGER,

    FOREIGN KEY (language_id) REFERENCES languages(id)
);

-- Playground snippets (reusable code blocks)
CREATE TABLE IF NOT EXISTS playground_snippets (
    id TEXT PRIMARY KEY,
    user_id INTEGER,  -- NULL = system snippet
    name TEXT NOT NULL,
    description TEXT,
    language_id TEXT NOT NULL,
    category TEXT,

    -- Snippet code
    code TEXT NOT NULL,

    -- Usage
    use_count INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (language_id) REFERENCES languages(id)
);

-- User's snippet library (saved snippets)
CREATE TABLE IF NOT EXISTS user_snippet_library (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL DEFAULT 1,
    snippet_id TEXT NOT NULL,
    folder TEXT,  -- User organization
    notes TEXT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (snippet_id) REFERENCES playground_snippets(id),
    UNIQUE(user_id, snippet_id)
);

-- Public playground feed (community sharing)
CREATE TABLE IF NOT EXISTS playground_likes (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL DEFAULT 1,
    project_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (project_id) REFERENCES playground_projects(id),
    UNIQUE(user_id, project_id)
);

CREATE TABLE IF NOT EXISTS playground_comments (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL DEFAULT 1,
    project_id TEXT NOT NULL,
    comment TEXT NOT NULL,
    parent_comment_id INTEGER,  -- For replies
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (project_id) REFERENCES playground_projects(id),
    FOREIGN KEY (parent_comment_id) REFERENCES playground_comments(id)
);

-- Playground sessions (auto-save)
CREATE TABLE IF NOT EXISTS playground_sessions (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL DEFAULT 1,
    language_id TEXT NOT NULL,

    -- Auto-saved code
    code TEXT,

    -- Session data
    last_saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (language_id) REFERENCES languages(id),
    UNIQUE(user_id, language_id)  -- One session per language
);

-- Playground achievements
CREATE TABLE IF NOT EXISTS playground_achievements (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    requirement_type TEXT,
    requirement_value INTEGER,
    xp_reward INTEGER,
    gold_reward INTEGER
);

CREATE TABLE IF NOT EXISTS user_playground_achievements (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL DEFAULT 1,
    achievement_id TEXT NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (achievement_id) REFERENCES playground_achievements(id),
    UNIQUE(user_id, achievement_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_playground_projects_user ON playground_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_playground_projects_language ON playground_projects(language_id);
CREATE INDEX IF NOT EXISTS idx_playground_projects_public ON playground_projects(is_public);
CREATE INDEX IF NOT EXISTS idx_playground_templates_category ON playground_templates(category);
CREATE INDEX IF NOT EXISTS idx_playground_snippets_language ON playground_snippets(language_id);
