# Dungeon Node Editor

A powerful visual editor for creating dungeon levels using a node-based workflow. Built with React, TypeScript, React Flow, and Tauri.

## 🎯 Features

### Visual Node-Based Editing
- Drag-and-drop node creation
- Visual connections between nodes to define game flow
- Minimap for navigation in large levels
- Undo/redo support via React Flow

### 9 Node Types
1. **Start Node** - Entry point for the level
2. **Combat Node** - Configure enemy encounters with multiple enemy types
3. **Boss Node** - Special combat with unique boss configuration
4. **Choice Node** - Branching dialogue/decisions with multiple outcomes
5. **Ability Check Node** - Skill checks (STR/DEX/INT/CHA) with DC values
6. **Trap Node** - Damage-dealing traps with optional avoidance checks
7. **Loot Node** - Rewards (items, gold, XP)
8. **Story Node** - Display narrative text and advance the plot
9. **End Node** - Marks level completion with final rewards

### Level Management
- Save levels to SQLite database
- Load and edit existing levels
- Duplicate levels for quick variations
- Delete unwanted levels
- Export levels to JSON for use in game engines
- Level metadata (name, description, difficulty, recommended level, etc.)

### Validation System
- Ensures levels have start and end nodes
- Detects disconnected nodes
- Validates proper node connections
- Shows clear error messages

## 📦 Installation

The editor is already integrated into this Tauri application. All dependencies are installed.

### Required Dependencies
```json
{
  "reactflow": "^11.x",
  "react": "^18.x",
  "@tauri-apps/api": "^2.x"
}
```

### Backend Dependencies (Rust)
```toml
[dependencies]
rusqlite = { version = "0.31", features = ["bundled"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
uuid = { version = "1.6", features = ["v4"] }
chrono = "0.4"
```

## 🚀 Usage

### Basic Integration

```tsx
import { DungeonNodeEditor } from './components/dungeon-editor';

function App() {
  return <DungeonNodeEditor />;
}
```

### With Initial Level

```tsx
import { DungeonNodeEditor } from './components/dungeon-editor';
import { sampleLevel1 } from './data/sampleDungeonLevels';

function App() {
  return <DungeonNodeEditor initialLevel={sampleLevel1} />;
}
```

### Custom Save Handler

```tsx
import { DungeonNodeEditor } from './components/dungeon-editor';
import { DungeonLevel } from './types/dungeonEditor';

function App() {
  const handleSave = (level: DungeonLevel) => {
    console.log('Saving level:', level);
    // Custom save logic here
  };

  return <DungeonNodeEditor onSave={handleSave} />;
}
```

## 🎮 How to Use the Editor

### Creating a New Level

1. Click **"New Level"** button in the toolbar
2. Edit level metadata by clicking the level name
3. Add nodes by clicking node types in the left palette
4. Drag nodes to position them on the canvas
5. Connect nodes by dragging from output handles to input handles
6. Click nodes to edit their properties in the right panel
7. Click **"Validate"** to check for errors
8. Click **"Save"** to persist the level

### Node Connection Rules

- **Start Node**: Can only have outgoing connections
- **End Node**: Can only have incoming connections
- **Choice Node**: Has multiple output handles (one per choice option)
- **Ability Check Node**: Has two outputs (success/failure)
- **All Other Nodes**: Have one input and one output

### Keyboard Shortcuts

- **Delete**: Remove selected node(s)
- **Ctrl/Cmd + C**: Copy selected node(s)
- **Ctrl/Cmd + V**: Paste copied node(s)
- **Ctrl/Cmd + Z**: Undo
- **Ctrl/Cmd + Shift + Z**: Redo

## 📊 Data Structure

### Level JSON Format

```json
{
  "metadata": {
    "id": "unique-level-id",
    "name": "Level Name",
    "description": "Level description",
    "recommendedLevel": 5,
    "difficulty": "medium",
    "estimatedDuration": 30,
    "isPublished": false,
    "version": 1,
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z",
    "tags": ["tag1", "tag2"]
  },
  "nodes": [
    {
      "id": "start-1",
      "type": "start",
      "position": { "x": 100, "y": 250 },
      "data": {
        "label": "Cave Entrance",
        "nodeType": "start",
        "welcomeMessage": "Welcome message..."
      }
    }
  ],
  "edges": [
    {
      "id": "e1",
      "source": "start-1",
      "target": "combat-1"
    }
  ]
}
```

## 🎨 Node Type Details

### Combat Node
```typescript
{
  enemies: [
    { type: "goblin", count: 3, level: 5 }
  ],
  difficulty: "medium",
  rewardXp: 300,
  rewardGold: 150,
  flavorText: "Enemies appear!"
}
```

### Choice Node
```typescript
{
  prompt: "What do you do?",
  options: [
    {
      id: "option-1",
      text: "Attack",
      resultText: "You charge forward!"
    },
    {
      id: "option-2",
      text: "Sneak past",
      resultText: "You move quietly..."
    }
  ]
}
```

### Ability Check Node
```typescript
{
  ability: "STR", // STR, DEX, INT, CHA
  dc: 15,
  successText: "You succeed!",
  failureText: "You fail...",
  allowRetry: false
}
```

### Boss Node
```typescript
{
  bossName: "Dragon Lord",
  bossType: "dragon",
  bossLevel: 10,
  health: 1000,
  abilities: ["Fire Breath", "Wing Buffet"],
  rewardXp: 5000,
  rewardGold: 1000,
  rewardItems: [...],
  flavorText: "The boss appears!",
  introDialog: "You dare challenge me?"
}
```

## 🗄️ Database Schema

The editor uses three SQLite tables:

### dungeon_levels
Stores level metadata
```sql
CREATE TABLE dungeon_levels (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  recommended_level INTEGER,
  difficulty TEXT,
  estimated_duration INTEGER,
  is_published BOOLEAN,
  version INTEGER,
  tags TEXT,
  created_at TEXT,
  updated_at TEXT
);
```

### dungeon_level_nodes
Stores node data
```sql
CREATE TABLE dungeon_level_nodes (
  id TEXT PRIMARY KEY,
  level_id TEXT NOT NULL,
  node_data TEXT NOT NULL, -- JSON
  position_x REAL,
  position_y REAL,
  node_type TEXT,
  FOREIGN KEY (level_id) REFERENCES dungeon_levels(id)
);
```

### dungeon_level_edges
Stores connections between nodes
```sql
CREATE TABLE dungeon_level_edges (
  id TEXT PRIMARY KEY,
  level_id TEXT NOT NULL,
  source_node_id TEXT,
  target_node_id TEXT,
  source_handle TEXT,
  target_handle TEXT,
  FOREIGN KEY (level_id) REFERENCES dungeon_levels(id)
);
```

## 🔧 Tauri Commands

### Backend API

```rust
// Save a level
#[tauri::command]
fn save_dungeon_level(level: DungeonLevel) -> Result<(), String>

// Load a level
#[tauri::command]
fn load_dungeon_level(level_id: String) -> Result<DungeonLevel, String>

// List all levels
#[tauri::command]
fn list_dungeon_levels() -> Result<Vec<LevelListItem>, String>

// Delete a level
#[tauri::command]
fn delete_dungeon_level(level_id: String) -> Result<(), String>

// Duplicate a level
#[tauri::command]
fn duplicate_dungeon_level(level_id: String, new_name: String) -> Result<String, String>
```

### Frontend Usage

```typescript
import { invoke } from '@tauri-apps/api/core';

// Save level
await invoke('save_dungeon_level', { level });

// Load level
const level = await invoke<DungeonLevel>('load_dungeon_level', {
  levelId: 'level-id'
});

// List levels
const levels = await invoke<LevelListItem[]>('list_dungeon_levels');

// Delete level
await invoke('delete_dungeon_level', { levelId: 'level-id' });

// Duplicate level
const newId = await invoke<string>('duplicate_dungeon_level', {
  levelId: 'level-id',
  newName: 'Copy of Level'
});
```

## 🎨 Customization

### Adding New Node Types

1. **Add to TypeScript types** (`src/types/dungeonEditor.ts`):
```typescript
export enum DungeonNodeType {
  // ... existing types
  MERCHANT = 'merchant',
}

export interface MerchantNodeData extends BaseNodeData {
  nodeType: DungeonNodeType.MERCHANT;
  items: ShopItem[];
  greeting: string;
}
```

2. **Create node component** (`src/components/dungeon-editor/nodes/MerchantNode.tsx`):
```tsx
export const MerchantNode: React.FC<NodeProps<MerchantNodeData>> = (props) => {
  return (
    <DungeonNodeBase {...props} icon="🛒" color="#10b981">
      <div>{props.data.greeting}</div>
    </DungeonNodeBase>
  );
};
```

3. **Add to node types registry** (`src/components/dungeon-editor/nodes/index.ts`):
```typescript
export const nodeTypes = {
  // ... existing types
  [DungeonNodeType.MERCHANT]: MerchantNode,
};
```

4. **Add to node palette** (`src/components/dungeon-editor/NodePalette.tsx`)

5. **Add properties panel** (`src/components/dungeon-editor/NodePropertiesPanel.tsx`)

### Styling

The editor uses Tailwind CSS with a dark theme. Colors are defined per node type:

- Start/End: Green (`#10b981`)
- Combat: Red (`#ef4444`)
- Boss: Dark Red (`#be123c`)
- Choice: Purple (`#8b5cf6`)
- Ability Check: Amber (`#f59e0b`)
- Trap: Red (`#dc2626`)
- Loot: Cyan (`#06b6d4`)
- Story: Indigo (`#6366f1`)

## 📚 Sample Levels

Three sample levels are included:

1. **The Goblin Cave** - Beginner tutorial (Easy)
2. **The Cursed Tomb** - Branching paths (Medium)
3. **Dragon's Lair** - Complex multi-path (Hard)

Import them from `src/data/sampleDungeonLevels.ts`.

## 🐛 Troubleshooting

### Nodes won't connect
- Ensure you're dragging from an output handle to an input handle
- Check that the source node allows outgoing connections
- Verify the target node allows incoming connections

### Level won't save
- Check browser console for errors
- Ensure database migrations have run
- Verify Tauri backend is running

### Properties panel not updating
- Click the node again to refresh
- Check that node IDs are unique
- Ensure data structure matches TypeScript types

## 🚢 Deploying Levels to Game

Export your level as JSON and import it into your game engine:

```typescript
// In your game engine
import levelData from './levels/my-level.json';

function playLevel(levelData: DungeonLevel) {
  // Start at the start node
  const startNode = levelData.nodes.find(n => n.type === 'start');

  // Process nodes based on edges and game logic
  // ...
}
```

## 📄 License

MIT - Free to use in your projects

## 🤝 Contributing

Feel free to extend the editor with new node types, features, or improvements!

---

**Happy dungeon crafting!** 🗺️⚔️
