-- Dungeon Level Editor Tables

-- Main levels table
CREATE TABLE IF NOT EXISTS dungeon_levels (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    recommended_level INTEGER NOT NULL DEFAULT 1,
    difficulty TEXT NOT NULL CHECK(difficulty IN ('easy', 'medium', 'hard', 'deadly')),
    estimated_duration INTEGER NOT NULL DEFAULT 30,
    is_published BOOLEAN NOT NULL DEFAULT 0,
    version INTEGER NOT NULL DEFAULT 1,
    tags TEXT, -- JSON array
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Nodes for each level (stored as JSON)
CREATE TABLE IF NOT EXISTS dungeon_level_nodes (
    id TEXT PRIMARY KEY,
    level_id TEXT NOT NULL,
    node_data TEXT NOT NULL, -- JSON blob containing all node data
    position_x REAL NOT NULL,
    position_y REAL NOT NULL,
    node_type TEXT NOT NULL,
    FOREIGN KEY (level_id) REFERENCES dungeon_levels(id) ON DELETE CASCADE
);

-- Edges/connections between nodes
CREATE TABLE IF NOT EXISTS dungeon_level_edges (
    id TEXT PRIMARY KEY,
    level_id TEXT NOT NULL,
    source_node_id TEXT NOT NULL,
    target_node_id TEXT NOT NULL,
    source_handle TEXT,
    target_handle TEXT,
    FOREIGN KEY (level_id) REFERENCES dungeon_levels(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_dungeon_level_nodes_level_id ON dungeon_level_nodes(level_id);
CREATE INDEX IF NOT EXISTS idx_dungeon_level_edges_level_id ON dungeon_level_edges(level_id);
CREATE INDEX IF NOT EXISTS idx_dungeon_levels_published ON dungeon_levels(is_published);
CREATE INDEX IF NOT EXISTS idx_dungeon_levels_difficulty ON dungeon_levels(difficulty);
