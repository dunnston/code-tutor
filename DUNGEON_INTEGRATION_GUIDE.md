# Dungeon Level Editor - Integration Guide

Complete guide for converting, managing, and playing through your dungeon levels.

---

## 📋 Question 1: How do I convert my existing Level 1?

### Option A: Load the Pre-Made Template (Recommended)

I've created a Level 1 template based on your "Abandoned Fortress" design:

```typescript
import { createLevel1Template } from '@/lib/dungeonLevelConverter';
import { invoke } from '@tauri-apps/api/core';

// Load and save the template
async function importLevel1() {
  const level1 = createLevel1Template();
  await invoke('save_dungeon_level', { level: level1 });
  alert('Level 1 imported successfully!');
}
```

**To use this:**
1. Add this button somewhere in your app (or run from console)
2. Click it once to import Level 1
3. Open the editor (`Ctrl+Shift+E`)
4. Click "Load" button
5. Select "Level 1: The Abandoned Fortress"
6. Edit and customize as needed!

### Option B: Manual Conversion

**Step-by-step process:**

1. **Open the Editor**: Press `Ctrl+Shift+E`
2. **Click "New Level"**
3. **Set Level Metadata**: Click level name and set:
   - Name: "Level 1: The Abandoned Fortress"
   - Recommended Level: 1
   - Difficulty: Easy
   - Description: Your level description

4. **Map Your Level Structure**:

```
From your markdown:
- "Starting Point: The Crumbling Gate" → Start Node
- "PATH A: Main Courtyard" → Choice Node with 3 options
- "Combat encounter: 3 Giant Rats" → Combat Node
- "Intelligence check" → Ability Check Node
- "Trap encounter" → Trap Node
- Final boss → Boss Node
- Exit → End Node
```

5. **Create Nodes Left-to-Right**:
   - Start (far left)
   - Story nodes for descriptions
   - Choice nodes for branching paths
   - Combat/Trap/Ability Check nodes for challenges
   - Loot nodes for rewards
   - Boss node near the end
   - End node (far right)

6. **Connect the Flow**: Drag from output handles to input handles

7. **Save**: Click "Save" button

### Conversion Cheat Sheet

| Markdown Element | Node Type |
|-----------------|-----------|
| Scene description / Narration | Story Node |
| Enemy encounter | Combat Node |
| Boss fight | Boss Node |
| Player decision point | Choice Node |
| Skill check (STR/DEX/INT/CHA) | Ability Check Node |
| Damage trap | Trap Node |
| Treasure/items found | Loot Node |
| Start of level | Start Node |
| End/exit | End Node |

---

## 🎯 Question 2: How does the dungeon crawler know what level to load?

### Level Progression System

I've created a progression system that tracks:
- Which levels the player has completed
- Which levels are unlocked
- Player's current progress

### Integration Methods:

#### Method 1: Sequential Campaign

```typescript
import { getNextLevel, loadLevel, completeLevel } from '@/lib/dungeonLevelProgression';

// In your dungeon crawler component:
async function startCampaign(userId: number) {
  // Get the next uncompleted level
  const levelId = await getNextLevel(userId);

  if (levelId) {
    const level = await loadLevel(levelId);
    // Start playing the level
    playLevel(level);
  } else {
    alert('Campaign complete!');
  }
}

// When player beats the level:
async function onLevelComplete(levelId: string, userId: number) {
  const timeTaken = 1800; // 30 minutes in seconds
  await completeLevel(userId, levelId, timeTaken);

  // Award rewards, then load next level
  const nextLevelId = await getNextLevel(userId);
  if (nextLevelId) {
    const nextLevel = await loadLevel(nextLevelId);
    playLevel(nextLevel);
  }
}
```

#### Method 2: Level Select Screen

```typescript
import { getPublishedLevels, isLevelUnlocked } from '@/lib/dungeonLevelProgression';

function LevelSelectScreen({ userId }: { userId: number }) {
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    async function loadLevels() {
      const publishedLevels = await getPublishedLevels();

      // Add unlock status
      const levelsWithStatus = await Promise.all(
        publishedLevels.map(async (level) => ({
          ...level,
          unlocked: await isLevelUnlocked(userId, level.id),
        }))
      );

      setLevels(levelsWithStatus);
    }
    loadLevels();
  }, [userId]);

  return (
    <div>
      {levels.map((level) => (
        <LevelCard
          key={level.id}
          level={level}
          onClick={() => level.unlocked && playLevel(level.id)}
          locked={!level.unlocked}
        />
      ))}
    </div>
  );
}
```

#### Method 3: Direct Level Loading (for testing)

```typescript
import { loadLevel } from '@/lib/dungeonLevelProgression';

// Load specific level by ID
const level = await loadLevel('level-1-abandoned-fortress');
playLevel(level);
```

### Level Metadata Fields

When creating levels in the editor, use these fields to control progression:

- **`recommendedLevel`**: Player level needed (1-20)
- **`difficulty`**: easy, medium, hard, deadly
- **`isPublished`**: Toggle to make level available in campaign
- **`tags`**: Organize levels (e.g., ['tutorial', 'boss', 'puzzle'])

### Example Campaign Structure:

```
Level 1: Abandoned Fortress (recommendedLevel: 1, difficulty: easy)
  ↓
Level 2: Underground Caverns (recommendedLevel: 2, difficulty: medium)
  ↓
Level 3: Dragon's Lair (recommendedLevel: 5, difficulty: hard)
```

Players must complete Level 1 to unlock Level 2, etc.

---

## 🎮 Question 3: How do I playtest my levels?

### Option 1: Built-in Level Player Component

I've created a `LevelPlayer` component that interprets your node graph and makes it playable:

```typescript
import { LevelPlayer } from '@/components/dungeon-editor/LevelPlayer';
import { loadLevel } from '@/lib/dungeonLevelProgression';

function LevelPlaytest() {
  const [level, setLevel] = useState(null);

  useEffect(() => {
    async function load() {
      const lvl = await loadLevel('level-1-abandoned-fortress');
      setLevel(lvl);
    }
    load();
  }, []);

  return (
    <LevelPlayer
      level={level}
      onComplete={(rewards) => {
        console.log('Level complete!', rewards);
      }}
      onExit={() => {
        // Return to editor or main menu
      }}
    />
  );
}
```

**What the Level Player does:**
- ✅ Interprets all node types
- ✅ Shows story text
- ✅ Simulates combat encounters
- ✅ Handles player choices
- ✅ Rolls dice for ability checks
- ✅ Applies trap damage
- ✅ Awards loot and XP
- ✅ Tracks player stats (HP, gold, XP, inventory)

### Option 2: Quick Playtest from Editor

**Add a "Playtest" button to the editor toolbar:**

```typescript
// In DungeonNodeEditor.tsx, add:
const handlePlaytest = () => {
  // Save current level
  handleSave();

  // Open playtest modal
  setShowPlaytest(true);
};

// Render:
{showPlaytest && (
  <div className="fixed inset-0 z-50 bg-black">
    <LevelPlayer
      level={{ metadata: levelMetadata, nodes, edges }}
      onExit={() => setShowPlaytest(false)}
    />
  </div>
)}
```

### Option 3: Integration with Existing Dungeon Explorer

If you have an existing dungeon crawler system, integrate like this:

```typescript
import { DungeonNode, DungeonLevel } from '@/types/dungeonEditor';

class LevelInterpreter {
  private level: DungeonLevel;
  private currentNode: DungeonNode;

  constructor(level: DungeonLevel) {
    this.level = level;
    this.currentNode = this.findStartNode();
  }

  findStartNode(): DungeonNode {
    return this.level.nodes.find((n) => n.type === 'start')!;
  }

  processNode(nodeId: string) {
    const node = this.level.nodes.find((n) => n.id === nodeId);

    switch (node.type) {
      case 'combat':
        return this.handleCombat(node.data);
      case 'choice':
        return this.handleChoice(node.data);
      case 'story':
        return this.displayStory(node.data);
      // ... etc
    }
  }

  getNextNode(currentNodeId: string, choiceId?: string): DungeonNode {
    const edge = this.level.edges.find(
      (e) => e.source === currentNodeId &&
             (!choiceId || e.sourceHandle === choiceId)
    );

    return this.level.nodes.find((n) => n.id === edge.target);
  }
}
```

---

## 🔄 Complete Workflow

### 1. Create/Edit Levels
```
Press Ctrl+Shift+E → Open Editor → Design level → Save
```

### 2. Publish Level
```
Click level name → Toggle "Published" → Save
```

### 3. Test Level
```
Load level → Open LevelPlayer → Play through → Check for bugs
```

### 4. Integrate into Campaign
```
Set recommendedLevel → Save → Level appears in campaign progression
```

### 5. Player Experience
```
Player completes Level N → Level N+1 unlocks → Player progresses
```

---

## 🛠️ Developer Quick Start

### Import Level 1 Template

```typescript
import { createLevel1Template } from '@/lib/dungeonLevelConverter';
import { invoke } from '@tauri-apps/api/core';

async function setup() {
  const level1 = createLevel1Template();
  await invoke('save_dungeon_level', { level: level1 });
  console.log('Level 1 ready!');
}

setup();
```

### Playtest Any Level

```typescript
import { LevelPlayer } from '@/components/dungeon-editor/LevelPlayer';
import { loadLevel } from '@/lib/dungeonLevelProgression';

function QuickPlaytest({ levelId }: { levelId: string }) {
  const [level, setLevel] = useState(null);

  useEffect(() => {
    loadLevel(levelId).then(setLevel);
  }, [levelId]);

  return <LevelPlayer level={level} />;
}

// Usage:
<QuickPlaytest levelId="level-1-abandoned-fortress" />
```

### Add to Your Main App

```typescript
import { DungeonNodeEditor } from '@/components/dungeon-editor';

// Already integrated with Ctrl+Shift+E in App.tsx
// Just open editor and start designing!
```

---

## 📊 Level Data Format

Levels are stored as JSON in SQLite and can be exported:

```json
{
  "metadata": {
    "id": "level-1-abandoned-fortress",
    "name": "Level 1: The Abandoned Fortress",
    "recommendedLevel": 1,
    "difficulty": "easy",
    "isPublished": true
  },
  "nodes": [
    {
      "id": "start-1",
      "type": "start",
      "position": { "x": 100, "y": 400 },
      "data": { "welcomeMessage": "..." }
    }
  ],
  "edges": [
    { "id": "e1", "source": "start-1", "target": "story-1" }
  ]
}
```

This format is **portable** - you can:
- Export to JSON files
- Share levels with others
- Import into other systems
- Version control your levels

---

## 🎓 Tips & Best Practices

### Level Design
- ✅ Always start with ONE Start node
- ✅ End with at least ONE End node
- ✅ Use Story nodes to set the scene
- ✅ Place Choice nodes before branching paths
- ✅ Put Combat/Boss nodes before major rewards
- ✅ Use Loot nodes after tough encounters

### Progression
- ✅ Level 1 = tutorial, easy difficulty
- ✅ Gradually increase difficulty
- ✅ Reward exploration (hidden Loot nodes)
- ✅ Balance combat frequency
- ✅ Include story beats (Story nodes)

### Testing
- ✅ Playtest every path
- ✅ Verify all choices lead somewhere
- ✅ Check ability check DCs are fair
- ✅ Balance rewards vs. challenge
- ✅ Run "Validate" before publishing

---

## 🚀 You're All Set!

**Summary:**
1. **Convert**: Use `createLevel1Template()` or manually rebuild in editor
2. **Manage**: Levels auto-sequence by `recommendedLevel`, unlocking as players progress
3. **Test**: Use `<LevelPlayer>` component to playtest any level

**Next Steps:**
1. Import Level 1 template
2. Open editor and customize it
3. Playtest using LevelPlayer
4. Publish when ready
5. Create Level 2!

Happy dungeon crafting! 🗺️⚔️✨
