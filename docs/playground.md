# **Code Playground Module - Specification**

## **Overview**

A sandbox environment where users can freely write and execute code without structured lessons. Think of it as a "creative mode" separate from courses and puzzles - a place to experiment, prototype ideas, and test concepts learned.

---

## **Database Schema**

```sql
-- User's saved playground projects
CREATE TABLE IF NOT EXISTS playground_projects (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    
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
    
    FOREIGN KEY (user_id) REFERENCES users(id),
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
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (language_id) REFERENCES languages(id)
);

-- User's snippet library (saved snippets)
CREATE TABLE IF NOT EXISTS user_snippet_library (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    snippet_id TEXT NOT NULL,
    folder TEXT,  -- User organization
    notes TEXT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (snippet_id) REFERENCES playground_snippets(id),
    UNIQUE(user_id, snippet_id)
);

-- Public playground feed (community sharing)
CREATE TABLE IF NOT EXISTS playground_likes (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    project_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (project_id) REFERENCES playground_projects(id),
    UNIQUE(user_id, project_id)
);

CREATE TABLE IF NOT EXISTS playground_comments (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    project_id TEXT NOT NULL,
    comment TEXT NOT NULL,
    parent_comment_id INTEGER,  -- For replies
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (project_id) REFERENCES playground_projects(id),
    FOREIGN KEY (parent_comment_id) REFERENCES playground_comments(id)
);

-- Playground sessions (auto-save)
CREATE TABLE IF NOT EXISTS playground_sessions (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    language_id TEXT NOT NULL,
    
    -- Auto-saved code
    code TEXT,
    
    -- Session data
    last_saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
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
    user_id INTEGER NOT NULL,
    achievement_id TEXT NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (achievement_id) REFERENCES playground_achievements(id),
    UNIQUE(user_id, achievement_id)
);
```

---

## **Playground UI Layout**

### **Main Playground Page**

```
┌─────────────────────────────────────────────────────────────────┐
│  🎨 CODE PLAYGROUND                             [← Back Home]   │
│  Language: [Python ▼]  [C#]  [Ruby]  [GDScript]  [JavaScript]  │
├──────────────────────────┬──────────────────────────────────────┤
│  SIDEBAR                 │  CODE EDITOR                         │
│                          │                                      │
│  💾 MY PROJECTS          │  1  # Write anything you want!       │
│  ┌──────────────────┐   │  2  # No rules, no tests, just code  │
│  │ 🆕 New Project   │   │  3                                   │
│  │ 📁 My Projects   │   │  4  def hello(name):                 │
│  │ ⭐ Favorites     │   │  5      return f"Hello, {name}!"     │
│  │ 🔥 Templates     │   │  6                                   │
│  │ 📚 Snippets      │   │  7  print(hello("World"))            │
│  │ 🌐 Community     │   │  8                                   │
│  └──────────────────┘   │                                      │
│                          │                                      │
│  🔥 QUICK START          │  [▶️ Run Code]  [💾 Save]  [🔄 Clear] │
│  • Blank Canvas          │  [📋 Copy]  [↗️ Share]  [⚙️ Settings]│
│  • Simple Calculator     │                                      │
│  • Mini Game             ├──────────────────────────────────────┤
│  • Character Stats       │  CONSOLE OUTPUT                      │
│  • Data Processor        │                                      │
│                          │  > Hello, World!                     │
│  📦 ASSETS               │                                      │
│  • Import RPG data       │  ✅ Executed in 0.03s                │
│  • Sample datasets       │                                      │
│  • Game sprites (future) │  [Clear Output]                      │
│                          │                                      │
│  💡 INSPIRATION          │                                      │
│  • Random idea generator │                                      │
│  • Coding challenges     │                                      │
│  • Community picks       │                                      │
│                          │                                      │
└──────────────────────────┴──────────────────────────────────────┘
```

---

## **Core Features**

### **1. Multi-Language Support**

**Available Languages:**
- Python
- C#
- Ruby
- GDScript
- JavaScript

**Language-Specific Features:**
- Syntax highlighting
- Auto-completion
- Error detection
- Language-specific imports/modules available
- Standard libraries accessible

**Quick Language Switch:**
- Dropdown at top
- Separate auto-save per language
- Can have multiple projects per language

---

### **2. Project Management**

#### **Creating Projects**

```
┌─────────────────────────────────────────┐
│  Create New Project                      │
├─────────────────────────────────────────┤
│  Name: [                              ] │
│                                          │
│  Description (optional):                 │
│  [                                    ]  │
│  [                                    ]  │
│                                          │
│  Language: [Python ▼]                   │
│                                          │
│  Start from:                             │
│  ◉ Blank Canvas                         │
│  ○ Template (choose below)              │
│                                          │
│  Tags (optional):                        │
│  [#algorithm] [#game] [#utility]        │
│                                          │
│  Privacy:                                │
│  ◉ Private (only you)                   │
│  ○ Unlisted (anyone with link)          │
│  ○ Public (community feed)              │
│                                          │
│  [Cancel]              [Create Project] │
└─────────────────────────────────────────┘
```

#### **My Projects View**

```
┌─────────────────────────────────────────────────────────────────┐
│  📁 MY PROJECTS                     Sort: [Recent ▼]  Search: [ ]│
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ ⭐ RPG Combat System                   Python | Private │    │
│  │ "Testing different damage formulas"                     │    │
│  │ Last edited: 2 hours ago | 156 lines                   │    │
│  │ [Open] [Rename] [Delete] [Share]                       │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 🎮 Mini Adventure Game               Python | Public    │    │
│  │ "Simple text adventure I'm building"                    │    │
│  │ Last edited: Yesterday | 89 lines | 👁️ 23 | ❤️ 5      │    │
│  │ [Open] [Edit] [View Public] [Stats]                    │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 🧮 Fibonacci Different Ways          Python | Private   │    │
│  │ "Comparing recursive vs iterative"                      │    │
│  │ Last edited: 3 days ago | 42 lines                     │    │
│  │ [Open] [Rename] [Delete] [Favorite]                    │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### **3. Templates Library**

#### **Template Categories**

**Beginner Templates:**
```json
[
    {
        "id": "hello-world",
        "name": "Hello World",
        "language": "python",
        "category": "basics",
        "description": "The classic first program",
        "code": "# Welcome to the playground!\n# Try changing the message below\n\nname = \"Adventurer\"\nprint(f\"Hello, {name}!\")\nprint(\"Start coding anything you want!\")",
        "icon": "👋"
    },
    {
        "id": "simple-calculator",
        "name": "Simple Calculator",
        "description": "Basic calculator to expand on",
        "code": "def add(a, b):\n    return a + b\n\ndef subtract(a, b):\n    return a - b\n\n# Try it out!\nprint(add(5, 3))\nprint(subtract(10, 4))",
        "icon": "🧮"
    },
    {
        "id": "character-stats",
        "name": "RPG Character Stats",
        "description": "Create and manage a character",
        "code": "character = {\n    'name': 'Hero',\n    'level': 1,\n    'health': 100,\n    'mana': 50,\n    'gold': 0\n}\n\nprint(f\"{character['name']} - Level {character['level']}\")\nprint(f\"HP: {character['health']} | Mana: {character['mana']}\")\n\n# Add more features!",
        "icon": "⚔️"
    }
]
```

**Intermediate Templates:**
```json
[
    {
        "id": "text-adventure",
        "name": "Text Adventure Game",
        "description": "Simple room-based adventure",
        "code": "# Text Adventure Framework\n\nrooms = {\n    'entrance': {\n        'description': 'You are at the dungeon entrance.',\n        'exits': {'north': 'hallway'},\n        'items': ['torch']\n    },\n    'hallway': {\n        'description': 'A long, dark hallway.',\n        'exits': {'south': 'entrance', 'east': 'treasure'},\n        'items': []\n    },\n    'treasure': {\n        'description': 'A room filled with gold!',\n        'exits': {'west': 'hallway'},\n        'items': ['gold', 'sword']\n    }\n}\n\ncurrent_room = 'entrance'\ninventory = []\n\ndef look():\n    room = rooms[current_room]\n    print(room['description'])\n    if room['items']:\n        print(f\"You see: {', '.join(room['items'])}\")\n    print(f\"Exits: {', '.join(room['exits'].keys())}\")\n\nlook()\n\n# Expand with move(), take(), inventory commands!",
        "icon": "🗺️"
    },
    {
        "id": "inventory-system",
        "name": "Inventory Management",
        "description": "Full inventory with weight limits",
        "code": "class Inventory:\n    def __init__(self, max_weight=100):\n        self.items = []\n        self.max_weight = max_weight\n    \n    def add_item(self, item, weight):\n        if self.current_weight() + weight <= self.max_weight:\n            self.items.append({'name': item, 'weight': weight})\n            return True\n        return False\n    \n    def current_weight(self):\n        return sum(item['weight'] for item in self.items)\n    \n    def show(self):\n        print(f\"Inventory ({self.current_weight()}/{self.max_weight}):\")\n        for item in self.items:\n            print(f\"  - {item['name']} ({item['weight']} kg)\")\n\n# Try it out!\ninv = Inventory()\ninv.add_item('Sword', 10)\ninv.add_item('Potion', 2)\ninv.show()",
        "icon": "🎒"
    },
    {
        "id": "combat-simulator",
        "name": "Combat Simulator",
        "description": "Turn-based battle system",
        "code": "import random\n\nclass Character:\n    def __init__(self, name, health, attack):\n        self.name = name\n        self.health = health\n        self.attack = attack\n    \n    def attack_enemy(self, enemy):\n        damage = random.randint(self.attack - 5, self.attack + 5)\n        enemy.health -= damage\n        print(f\"{self.name} attacks {enemy.name} for {damage} damage!\")\n    \n    def is_alive(self):\n        return self.health > 0\n\n# Create fighters\nplayer = Character(\"Hero\", 100, 20)\nenemy = Character(\"Goblin\", 50, 15)\n\n# Battle loop\nwhile player.is_alive() and enemy.is_alive():\n    player.attack_enemy(enemy)\n    if enemy.is_alive():\n        enemy.attack_enemy(player)\n    print(f\"{player.name}: {player.health} HP | {enemy.name}: {enemy.health} HP\")\n    print(\"-\" * 40)\n\nwinner = player if player.is_alive() else enemy\nprint(f\"{winner.name} wins!\")",
        "icon": "⚔️"
    }
]
```

**Advanced Templates:**
```json
[
    {
        "id": "data-visualizer",
        "name": "Data Visualizer",
        "description": "Process and display data",
        "code": "# Data Analysis Template\n\nstudent_scores = [\n    {'name': 'Alice', 'score': 95},\n    {'name': 'Bob', 'score': 87},\n    {'name': 'Charlie', 'score': 92},\n    {'name': 'Diana', 'score': 78}\n]\n\ndef analyze_scores(scores):\n    total = sum(s['score'] for s in scores)\n    average = total / len(scores)\n    highest = max(scores, key=lambda x: x['score'])\n    lowest = min(scores, key=lambda x: x['score'])\n    \n    print(f\"Total Students: {len(scores)}\")\n    print(f\"Average Score: {average:.2f}\")\n    print(f\"Highest: {highest['name']} ({highest['score']})\")\n    print(f\"Lowest: {lowest['name']} ({lowest['score']})\")\n    \n    # ASCII bar chart\n    print(\"\\nScore Distribution:\")\n    for student in sorted(scores, key=lambda x: x['score'], reverse=True):\n        bar = '█' * (student['score'] // 5)\n        print(f\"{student['name']:10} {bar} {student['score']}\")\n\nanalyze_scores(student_scores)\n\n# Add more analysis!",
        "icon": "📊"
    },
    {
        "id": "state-machine",
        "name": "State Machine",
        "description": "Game state management pattern",
        "code": "# State Machine Pattern for Games\n\nclass State:\n    def enter(self): pass\n    def update(self): pass\n    def exit(self): pass\n\nclass MenuState(State):\n    def enter(self):\n        print(\"=== MAIN MENU ===\")\n        print(\"1. Start Game\")\n        print(\"2. Options\")\n        print(\"3. Exit\")\n    \n    def update(self):\n        choice = input(\"Choose: \")\n        if choice == '1':\n            return 'playing'\n        elif choice == '2':\n            return 'options'\n        elif choice == '3':\n            return 'exit'\n        return 'menu'\n\nclass PlayingState(State):\n    def enter(self):\n        print(\"\\n=== GAME STARTED ===\")\n    \n    def update(self):\n        action = input(\"Action (type 'menu' to quit): \")\n        if action == 'menu':\n            return 'menu'\n        print(f\"You did: {action}\")\n        return 'playing'\n\nclass StateMachine:\n    def __init__(self):\n        self.states = {\n            'menu': MenuState(),\n            'playing': PlayingState()\n        }\n        self.current = 'menu'\n    \n    def run(self):\n        self.states[self.current].enter()\n        while self.current != 'exit':\n            next_state = self.states[self.current].update()\n            if next_state != self.current:\n                self.states[self.current].exit()\n                self.current = next_state\n                if self.current != 'exit':\n                    self.states[self.current].enter()\n\ngame = StateMachine()\ngame.run()",
        "icon": "🎮"
    }
]
```

#### **Template Browser UI**

```
┌─────────────────────────────────────────────────────────────────┐
│  🔥 TEMPLATES                                                    │
├─────────────────────────────────────────────────────────────────┤
│  Filter: [All] [Beginner] [Intermediate] [Advanced]            │
│  Category: [All ▼] [Game] [Algorithm] [Utility] [Data]         │
│  Language: [Python ▼]                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  BEGINNER                                                        │
│  ┌────────────────┬────────────────┬────────────────┐          │
│  │ 👋 Hello       │ 🧮 Calculator  │ ⚔️ Character  │          │
│  │ World          │                │ Stats          │          │
│  │ Start here!    │ Math basics    │ RPG basics     │          │
│  │ [Use]          │ [Use]          │ [Use]          │          │
│  └────────────────┴────────────────┴────────────────┘          │
│                                                                  │
│  INTERMEDIATE                                                    │
│  ┌────────────────┬────────────────┬────────────────┐          │
│  │ 🗺️ Text       │ 🎒 Inventory   │ ⚔️ Combat     │          │
│  │ Adventure      │ System         │ Simulator      │          │
│  │ Room-based     │ Weight limits  │ Turn-based     │          │
│  │ [Use] [Preview]│ [Use] [Preview]│ [Use] [Preview]│          │
│  └────────────────┴────────────────┴────────────────┘          │
│                                                                  │
│  [Show More...]                                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### **4. Snippet Library**

**System Snippets** (Pre-made, curated):
```json
[
    {
        "id": "random-dice",
        "name": "Roll Dice",
        "category": "game",
        "language": "python",
        "description": "Roll N-sided dice",
        "code": "import random\n\ndef roll_dice(sides=6, count=1):\n    return [random.randint(1, sides) for _ in range(count)]\n\n# Usage: roll_dice(20, 2)  # Roll 2 d20s"
    },
    {
        "id": "health-bar",
        "name": "ASCII Health Bar",
        "category": "game",
        "language": "python",
        "description": "Visual health bar",
        "code": "def health_bar(current, maximum, width=20):\n    filled = int((current / maximum) * width)\n    bar = '█' * filled + '░' * (width - filled)\n    percentage = int((current / maximum) * 100)\n    return f\"[{bar}] {current}/{maximum} ({percentage}%)\"\n\n# Usage: print(health_bar(75, 100))"
    },
    {
        "id": "input-validator",
        "name": "Number Input Validator",
        "category": "utility",
        "language": "python",
        "description": "Get valid number from user",
        "code": "def get_number(prompt, min_val=None, max_val=None):\n    while True:\n        try:\n            num = int(input(prompt))\n            if min_val and num < min_val:\n                print(f\"Must be at least {min_val}\")\n                continue\n            if max_val and num > max_val:\n                print(f\"Must be at most {max_val}\")\n                continue\n            return num\n        except ValueError:\n            print(\"Please enter a valid number\")\n\n# Usage: age = get_number(\"Enter age: \", 1, 120)"
    },
    {
        "id": "timer-decorator",
        "name": "Function Timer",
        "category": "utility",
        "language": "python",
        "description": "Measure function execution time",
        "code": "import time\nfrom functools import wraps\n\ndef timer(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        start = time.time()\n        result = func(*args, **kwargs)\n        end = time.time()\n        print(f\"{func.__name__} took {end - start:.4f}s\")\n        return result\n    return wrapper\n\n# Usage:\n# @timer\n# def my_function():\n#     # code here"
    }
]
```

**Snippet Browser:**
```
┌─────────────────────────────────────────────────────────────────┐
│  📚 SNIPPET LIBRARY                                              │
├─────────────────────────────────────────────────────────────────┤
│  [System Snippets] [My Snippets] [Community]                   │
│  Category: [Game ▼]  Language: [Python ▼]  Search: [        ]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 🎲 Roll Dice                                           │    │
│  │ Roll N-sided dice                                       │    │
│  │ ```python                                               │    │
│  │ def roll_dice(sides=6, count=1):                       │    │
│  │     return [random.randint(1, sides) ...]              │    │
│  │ ```                                                     │    │
│  │ [Insert at Cursor] [Copy] [Save to My Library]        │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ ❤️ ASCII Health Bar                                    │    │
│  │ Visual health bar display                               │    │
│  │ [View Code] [Insert] [Copy]                            │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Create Custom Snippet:**
```
┌─────────────────────────────────────────┐
│  Create Snippet                          │
├─────────────────────────────────────────┤
│  Name: [                              ] │
│  Category: [Utility ▼]                  │
│  Language: [Python ▼]                   │
│                                          │
│  Description:                            │
│  [                                    ]  │
│                                          │
│  Code:                                   │
│  ┌────────────────────────────────────┐ │
│  │ def my_function():                 │ │
│  │     pass                           │ │
│  │                                    │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Tags: [#helper] [#custom]              │
│                                          │
│  [Cancel]              [Save Snippet]   │
└─────────────────────────────────────────┘
```

---

### **5. Editor Features**

#### **Code Editor Enhancements**

**Basic Features:**
- Syntax highlighting
- Line numbers
- Auto-indentation
- Bracket matching
- Multi-cursor editing
- Find & replace
- Undo/redo (unlimited)

**Advanced Features:**
- **Auto-save:** Every 30 seconds
- **Version history:** Restore previous versions
- **Keyboard shortcuts:** Standard IDE shortcuts
- **Dark/light themes:** Match UI theme
- **Font size:** Adjustable
- **Line wrapping:** Toggle
- **Minimap:** Code overview (optional)

**Smart Features:**
- **Auto-complete:** Variable names, functions
- **Quick documentation:** Hover for docs
- **Error highlighting:** Real-time syntax check
- **Bracket completion:** Auto-close brackets
- **Comment toggle:** Quick comment/uncomment
- **Code folding:** Collapse functions/classes

#### **Console Features**

**Output Display:**
- Standard output (stdout)
- Error output (stderr) in red
- Execution time display
- Clear output button
- Copy output button
- Download output as text

**Interactive Console (Python REPL):**
```
┌──────────────────────────────────────┐
│  >>> name = "Hero"                   │
│  >>> print(f"Hello, {name}")         │
│  Hello, Hero                         │
│  >>> 2 + 2                           │
│  4                                   │
│  >>> _                               │
│                                      │
│  [Clear] [Switch to Script Mode]    │
└──────────────────────────────────────┘
```

---

### **6. Assets & Resources**

#### **Built-in Datasets**
```json
{
    "rpg_data": {
        "weapons": [
            {"name": "Sword", "damage": 15, "price": 100},
            {"name": "Axe", "damage": 20, "price": 150},
            {"name": "Staff", "damage": 12, "price": 80}
        ],
        "enemies": [
            {"name": "Goblin", "health": 30, "damage": 8, "xp": 25},
            {"name": "Orc", "health": 60, "damage": 15, "xp": 50},
            {"name": "Dragon", "health": 200, "damage": 40, "xp": 500}
        ],
        "items": [
            {"name": "Health Potion", "heal": 50, "price": 20},
            {"name": "Mana Potion", "mana": 30, "price": 15}
        ]
    },
    "sample_data": {
        "students": [...],
        "weather": [...],
        "sales": [...]
    }
}
```

**Import in Code:**
```python
# Python example
from playground_assets import rpg_data

weapons = rpg_data['weapons']
for weapon in weapons:
    print(f"{weapon['name']}: {weapon['damage']} damage")
```

#### **Asset Library UI**
```
┌──────────────────────────────────────┐
│  📦 ASSETS                            │
├──────────────────────────────────────┤
│  ⚔️ RPG Data                         │
│  • Weapons (10 items)                │
│  • Enemies (15 types)                │
│  • Items (20 items)                  │
│  • Spells (12 spells)                │
│  [Import]                            │
│                                      │
│  📊 Sample Datasets                  │
│  • Student scores                    │
│  • Weather data                      │
│  • Sales data                        │
│  [Import]                            │
│                                      │
│  📁 My Datasets                      │
│  • Upload CSV                        │
│  • Upload JSON                       │
│  [Upload]                            │
└──────────────────────────────────────┘
```

---

### **7. Sharing & Community**

#### **Sharing Options**

```
┌─────────────────────────────────────────┐
│  Share Project                           │
├─────────────────────────────────────────┤
│  Project: "RPG Combat System"           │
│                                          │
│  Privacy:                                │
│  ◉ Public - Anyone can view & fork     │
│  ○ Unlisted - Only with link           │
│  ○ Private - Only you                  │
│                                          │
│  Allow:                                  │
│  ☑ Comments                             │
│  ☑ Forks                                │
│  ☐ Collaborative editing                │
│                                          │
│  ✅ Link: playground.app/p/abc123      │
│  [Copy Link] [Copy as Embed]           │
│                                          │
│  Share to:                               │
│  [Discord] [Twitter] [Copy Link]        │
│                                          │
│  [Cancel]              [Save & Share]   │
└─────────────────────────────────────────┘
```

#### **Community Feed**

```
┌─────────────────────────────────────────────────────────────────┐
│  🌐 COMMUNITY PLAYGROUND                                         │
├─────────────────────────────────────────────────────────────────┤
│  [Trending] [New] [Top This Week] [Following]                   │
│  Filter: [Python ▼] [All Categories ▼]                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ ⚔️ Advanced Combat System                 by CodeMaster │    │
│  │ "Fully featured turn-based combat with abilities"       │    │
│  │ Python | 234 lines | 👁️ 1.2K | ❤️ 89 | 🔀 23         │    │
│  │ #game #rpg #combat                                       │    │
│  │ [View Code] [Fork] [❤️ Like] [💬 12 Comments]          │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 🧮 Algorithm Visualizer                  by DataNinja   │    │
│  │ "See sorting algorithms in action!"                     │    │
│  │ Python | 156 lines | 👁️ 890 | ❤️ 67 | 🔀 15          │    │
│  │ #algorithm #visualization #sorting                       │    │
│  │ [View Code] [Fork] [❤️ Like] [💬 8 Comments]           │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### **Forking Projects**
- Click "Fork" on any public project
- Creates copy in your projects
- Links back to original
- Original author credited
- Can be modified freely

---

### **8. Achievements & Gamification**

```json
[
    {
        "id": "first-playground",
        "name": "Sandbox Explorer",
        "description": "Create your first playground project",
        "icon": "🏖️",
        "xp_reward": 100,
        "gold_reward": 100
    },
    {
        "id": "10-projects",
        "name": "Prolific Creator",
        "description": "Create 10 playground projects",
        "requirement_value": 10,
        "xp_reward": 500,
        "gold_reward": 500
    },
    {
        "id": "100-lines",
        "name": "Century Coder",
        "description": "Write 100 lines in a single project",
        "xp_reward": 200,
        "gold_reward": 200
    },
    {
        "id": "first-fork",
        "name": "Code Remixer",
        "description": "Fork someone else's project",
        "xp_reward": 150,
        "gold_reward": 150
    },
    {
        "id": "popular-project",
        "name": "Community Favorite",
        "description": "Get 50 likes on a project",
        "requirement_value": 50,
        "xp_reward": 1000,
        "gold_reward": 1000
    },
    {
        "id": "polyglot-playground",
        "name": "Multi-Lingual Coder",
        "description": "Create projects in all 5 languages",
        "xp_reward": 750,
        "gold_reward": 750
    },
    {
        "id": "snippet-creator",
        "name": "Snippet Master",
        "description": "Create 10 reusable snippets",
        "requirement_value": 10,
        "xp_reward": 400,
        "gold_reward": 400
    },
    {
        "id": "daily-coder",
        "name": "Daily Tinkerer",
        "description": "Use playground 7 days in a row",
        "requirement_value": 7,
        "xp_reward": 500,
        "gold_reward": 500
    }
]
```

---

### **9. Quick Actions & Features**

#### **Keyboard Shortcuts**
```
Ctrl/Cmd + S      - Save project
Ctrl/Cmd + Enter  - Run code
Ctrl/Cmd + /      - Toggle comment
Ctrl/Cmd + D      - Duplicate line
Ctrl/Cmd + F      - Find
Ctrl/Cmd + H      - Replace
Ctrl/Cmd + Z      - Undo
Ctrl/Cmd + Shift + Z - Redo
Ctrl/Cmd + K      - Clear console
Alt + Up/Down     - Move line up/down
```

#### **Right-Click Context Menu**
```
┌──────────────────────┐
│ Cut                  │
│ Copy                 │
│ Paste                │
│ ──────────────────── │
│ Format Code          │
│ Comment/Uncomment    │
│ ──────────────────── │
│ Save as Snippet      │
│ Search in Community  │
└──────────────────────┘
```

#### **Code Actions**
- **Format Code:** Auto-format/prettify
- **Export as Gist:** Export to GitHub Gist
- **Download as File:** Save .py/.cs/.rb file
- **Print Code:** Print-friendly view

---

### **10. Integration with Main App**

#### **Dashboard Widget**
```
┌──────────────────────────────────────┐
│  🎨 PLAYGROUND                       │
├──────────────────────────────────────┤
│  Quick Start:                         │
│  [🆕 New Project]                    │
│                                      │
│  Recent:                              │
│  • RPG Combat (2h ago)               │
│  • Calculator v2 (Yesterday)         │
│                                      │
│  [Open Playground]                   │
└──────────────────────────────────────┘
```

#### **From Lessons**
- "Try this in Playground" button on lessons
- Copy lesson code to playground
- Experiment without lesson constraints
- Return to lesson when ready

#### **From Puzzles**
- "Practice in Playground" after solving
- Test variations
- Build on solution

---

## **Technical Implementation**

### **Code Execution**

**Sandbox Environment:**
- Isolated execution (no file system access)
- Memory limits (256MB)
- CPU time limits (10 seconds)
- No network access
- Safe built-in libraries only

**Language-Specific Execution:**

**Python:**
```python
# Server-side execution
import subprocess
import json

def execute_python(code, timeout=10):
    try:
        result = subprocess.run(
            ['python3', '-c', code],
            capture_output=True,
            timeout=timeout,
            text=True
        )
        return {
            'stdout': result.stdout,
            'stderr': result.stderr,
            'exit_code': result.returncode,
            'success': result.returncode == 0
        }
    except subprocess.TimeoutExpired:
        return {
            'stdout': '',
            'stderr': 'Execution timeout (10s limit)',
            'exit_code': -1,
            'success': False
        }
```

**For other languages, similar subprocess approach**

---

## **Use Cases**

### **Use Case 1: Experimenting with Lesson Concepts**
Student learns about dictionaries in lesson → Opens playground → Tests different dictionary operations → Builds mini-project using dictionaries

### **Use Case 2: Prototyping Game Ideas**
Student has idea for text adventure → Uses template as starting point → Adds custom rooms and items → Shares with community

### **Use Case 3: Testing Algorithm Variations**
Student solving puzzle → Wants to try different approach → Opens playground → Compares implementations → Learns optimization

### **Use Case 4: Building Portfolio**
Student creates impressive project → Makes it public → Gets likes and forks → Adds to resume/portfolio

### **Use Case 5: Learning from Others**
Student finds interesting project in community → Forks it → Modifies and learns → Creates own variation

---

## **Future Enhancements**

### **Phase 2 Features:**
- Collaborative editing (Google Docs style)
- Live code sharing (screen share)
- Embedded playground (iframe for external sites)
- Mobile app with limited editing
- Voice coding (speech-to-code)

### **Phase 3 Features:**
- GPU access for graphics/ML
- Package installation (limited)
- Database connections (SQLite)
- Web preview for HTML/CSS/JS
- Git integration

### **Phase 4 Features:**
- Live streaming coding sessions
- Pair programming mode
- Code review system
- Competitions/hackathons
- Bounty system (rewards for helping others)

---

## **Success Metrics**

Playground is successful when:
- ✅ Users spend time experimenting beyond lessons
- ✅ High project creation rate
- ✅ Active community sharing
- ✅ Templates are frequently used
- ✅ Students learn through experimentation
- ✅ Positive feedback on ease of use
- ✅ Projects showcase learning progress
- ✅ Increased engagement overall

---

The Playground gives users a creative space to apply knowledge, experiment freely, and share creations - turning passive learning into active creation!