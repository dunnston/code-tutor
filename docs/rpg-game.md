# **RPG Dungeon System - Complete Specification**

## **Overview**

Integrate a text-based RPG dungeon crawler into the learning app where user levels, XP, and learning directly impact combat effectiveness and dungeon progression. The AI acts as dungeon master, narrating the adventure and responding to player actions. Combat and exploration require solving coding challenges to succeed.

**Core Principle:** Learning makes you stronger. XP and levels are now meaningful because they directly affect your power in the dungeon.

---

## **Purpose & Motivation**

**Problem:** XP and levels currently don't mean anything - no motivation to level up.

**Solution:** Build an RPG minigame where:
- Levels = stat increases and new abilities
- Stats/items = power (damage, health, success rates)
- Coding challenges = action success/failure
- AI dungeon master = dynamic storytelling

**Player Motivation:**
- Want to get stronger → Need to level up → Need to complete lessons/puzzles
- Want better gear → Need gold → Earn from lessons/dungeon
- Want to progress deeper → Need to be stronger → Learn more
- Engaging game loop separate from but enhanced by learning

---

## **Database Schema**

```sql
-- Character stats (one per user)
CREATE TABLE IF NOT EXISTS character_stats (
    user_id INTEGER PRIMARY KEY,
    
    -- Core stats
    level INTEGER DEFAULT 1,
    
    -- Primary attributes (increase with level)
    strength INTEGER DEFAULT 10,
    intelligence INTEGER DEFAULT 10,
    dexterity INTEGER DEFAULT 10,
    
    -- Derived stats
    max_health INTEGER DEFAULT 100,
    current_health INTEGER DEFAULT 100,
    max_mana INTEGER DEFAULT 50,
    current_mana INTEGER DEFAULT 50,
    
    -- Combat stats
    base_damage INTEGER DEFAULT 10,
    defense INTEGER DEFAULT 5,
    critical_chance REAL DEFAULT 0.05,  -- 5%
    dodge_chance REAL DEFAULT 0.05,     -- 5%
    
    -- Progression
    stat_points_available INTEGER DEFAULT 0,  -- Unspent points from leveling
    
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Equipment slots
CREATE TABLE IF NOT EXISTS character_equipment (
    user_id INTEGER PRIMARY KEY,
    
    -- Equipment slots (item IDs)
    weapon_id TEXT,
    armor_id TEXT,
    accessory_id TEXT,
    
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Abilities/Spells unlocked by level
CREATE TABLE IF NOT EXISTS abilities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,  -- 'attack', 'heal', 'buff', 'debuff'
    
    -- Requirements
    required_level INTEGER NOT NULL,
    mana_cost INTEGER DEFAULT 0,
    cooldown_turns INTEGER DEFAULT 0,
    
    -- Effects
    base_value INTEGER,  -- Damage, healing, etc.
    scaling_stat TEXT,   -- 'strength', 'intelligence', 'dexterity'
    scaling_ratio REAL,  -- How much stat affects power (0.5 = 50% of stat added)
    
    -- Visual
    icon TEXT,
    animation_text TEXT  -- For AI to use in narration
);

-- User's unlocked abilities
CREATE TABLE IF NOT EXISTS user_abilities (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    ability_id TEXT NOT NULL,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    times_used INTEGER DEFAULT 0,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (ability_id) REFERENCES abilities(id),
    UNIQUE(user_id, ability_id)
);

-- Dungeon floors/levels
CREATE TABLE IF NOT EXISTS dungeon_floors (
    floor_number INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    
    -- Requirements
    recommended_level INTEGER,
    required_level INTEGER,  -- Minimum level to enter
    
    -- Difficulty
    enemy_level_range TEXT,  -- JSON: {"min": 5, "max": 8}
    boss_level INTEGER,
    
    -- Rewards
    gold_multiplier REAL DEFAULT 1.0,
    xp_multiplier REAL DEFAULT 1.0,
    loot_tier INTEGER DEFAULT 1
);

-- Enemy types
CREATE TABLE IF NOT EXISTS enemy_types (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    
    -- Base stats (scaled by floor)
    base_health INTEGER NOT NULL,
    base_damage INTEGER NOT NULL,
    base_defense INTEGER DEFAULT 0,
    
    -- AI behavior
    behavior_type TEXT,  -- 'aggressive', 'defensive', 'balanced', 'caster'
    
    -- Loot
    gold_drop_min INTEGER,
    gold_drop_max INTEGER,
    xp_reward INTEGER,
    loot_table TEXT,  -- JSON array of possible item drops
    
    -- Visual
    icon TEXT,
    ascii_art TEXT  -- Optional for display
);

-- Boss enemies (special enemies)
CREATE TABLE IF NOT EXISTS boss_enemies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    floor_number INTEGER NOT NULL,
    
    -- Stats (fixed, not scaled)
    health INTEGER NOT NULL,
    damage INTEGER NOT NULL,
    defense INTEGER NOT NULL,
    
    -- Special abilities
    abilities TEXT,  -- JSON array of ability IDs
    
    -- Rewards
    gold_reward INTEGER,
    xp_reward INTEGER,
    guaranteed_loot TEXT,  -- JSON array of item IDs
    
    -- Status
    is_defeated BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (floor_number) REFERENCES dungeon_floors(floor_number)
);

-- User dungeon progress
CREATE TABLE IF NOT EXISTS user_dungeon_progress (
    user_id INTEGER PRIMARY KEY,
    
    -- Progress
    current_floor INTEGER DEFAULT 1,
    deepest_floor_reached INTEGER DEFAULT 1,
    
    -- Current state
    in_combat BOOLEAN DEFAULT FALSE,
    current_enemy_id TEXT,
    current_enemy_health INTEGER,
    
    -- Statistics
    total_enemies_defeated INTEGER DEFAULT 0,
    total_bosses_defeated INTEGER DEFAULT 0,
    total_floors_cleared INTEGER DEFAULT 0,
    total_deaths INTEGER DEFAULT 0,
    
    -- Last action
    last_room_description TEXT,
    last_action_timestamp TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Combat log (for history/stats)
CREATE TABLE IF NOT EXISTS dungeon_combat_log (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    enemy_type TEXT NOT NULL,
    floor_number INTEGER NOT NULL,
    
    -- Outcome
    victory BOOLEAN NOT NULL,
    turns_taken INTEGER,
    damage_dealt INTEGER,
    damage_taken INTEGER,
    
    -- Rewards
    xp_gained INTEGER,
    gold_gained INTEGER,
    items_looted TEXT,  -- JSON array
    
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Dungeon encounters (room events)
CREATE TABLE IF NOT EXISTS dungeon_encounters (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,  -- 'combat', 'treasure', 'trap', 'merchant', 'puzzle', 'rest'
    floor_number INTEGER NOT NULL,
    
    -- Description for AI
    description_prompt TEXT,
    
    -- Requirements/Conditions
    required_stat TEXT,  -- For stat checks
    difficulty_rating INTEGER,  -- 1-10
    
    -- Rewards/Consequences
    rewards TEXT,  -- JSON
    penalties TEXT,  -- JSON
    
    -- Frequency
    rarity TEXT,  -- 'common', 'uncommon', 'rare'
    
    FOREIGN KEY (floor_number) REFERENCES dungeon_floors(floor_number)
);

-- Active dungeon session (for AI context)
CREATE TABLE IF NOT EXISTS dungeon_session (
    user_id INTEGER PRIMARY KEY,
    
    -- Session data
    session_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    current_room_type TEXT,
    conversation_context TEXT,  -- JSON of recent AI messages
    
    -- Combat state (if in combat)
    combat_turn INTEGER DEFAULT 0,
    enemy_current_health INTEGER,
    ability_cooldowns TEXT,  -- JSON: {"fireball": 2, "heal": 0}
    
    -- Temporary effects
    active_buffs TEXT,  -- JSON array
    active_debuffs TEXT,  -- JSON array
    
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Dungeon achievements
CREATE TABLE IF NOT EXISTS dungeon_achievements (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    
    -- Requirements
    requirement_type TEXT,  -- 'floors_cleared', 'boss_defeated', 'enemies_killed', etc.
    requirement_value INTEGER,
    
    -- Rewards
    xp_reward INTEGER,
    gold_reward INTEGER,
    unlock_item TEXT  -- Special item reward
);

CREATE TABLE IF NOT EXISTS user_dungeon_achievements (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    achievement_id TEXT NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (achievement_id) REFERENCES dungeon_achievements(id),
    UNIQUE(user_id, achievement_id)
);
```

---

## **Character System**

### **Core Stats**

**Primary Attributes (increase with level):**
- **Strength (STR):** Affects physical damage, carrying capacity
- **Intelligence (INT):** Affects magic damage, loot quality, puzzle hints
- **Dexterity (DEX):** Affects dodge chance, critical hit chance, initiative

**Derived Stats (calculated from primary + equipment):**
- **Max Health:** Base 100 + (Level × 10) + equipment bonuses
- **Max Mana:** Base 50 + (Intelligence × 2) + equipment bonuses
- **Base Damage:** 10 + equipment weapon damage
- **Defense:** 5 + equipment armor + (STR / 5)
- **Critical Chance:** 5% + (DEX × 0.5%)
- **Dodge Chance:** 5% + (DEX × 0.3%)

### **Leveling Up**

**When user levels up:**
1. Display level up modal with fanfare
2. Show stat increases:
   - All primary stats +2
   - Max HP +10
   - Max Mana +5
3. Award 3 stat points to distribute manually
4. Check for ability unlocks
5. Fully restore HP and Mana
6. Award gold: Level × 100

**Stat Point Distribution:**
User can spend 3 points across STR, INT, DEX however they want.

**Ability Unlocks:**
- Level 1: Basic Attack (free, always available)
- Level 3: Heal (restore 30 HP, costs 15 mana)
- Level 5: Fireball (25 damage + INT bonus, costs 20 mana)
- Level 8: Power Strike (40 damage + STR bonus, costs 10 mana)
- Level 10: Lightning Bolt (30 damage + INT bonus, hits multiple, costs 25 mana)
- Level 12: Shield (reduce damage 50% for 3 turns, costs 15 mana)
- Level 15: Frost Nova (20 damage, slows enemy, costs 20 mana)
- Level 18: Berserk (double damage, take extra damage, 3 turns, costs 20 mana)
- Level 20: Meteor (60 damage + INT bonus, costs 40 mana)
- Level 25: Full Heal (restore all HP, costs 50 mana)

---

## **Equipment System**

### **Equipment Slots**
- Weapon (affects damage)
- Armor (affects defense and HP)
- Accessory (various bonuses)

### **Equipment Tiers**
- **Common:** Basic items, +10-20% bonus
- **Uncommon:** Decent items, +25-40% bonus
- **Rare:** Good items, +50-75% bonus
- **Epic:** Great items, +80-120% bonus
- **Legendary:** Best items, +150-200% bonus

### **Example Equipment**

**Weapons:**
```json
{
    "wooden_sword": {
        "name": "Wooden Sword",
        "tier": "common",
        "damage_bonus": 5,
        "description": "A simple training sword"
    },
    "steel_sword": {
        "name": "Steel Sword",
        "tier": "uncommon",
        "damage_bonus": 15,
        "str_requirement": 15,
        "description": "A well-crafted blade"
    },
    "flame_blade": {
        "name": "Flame Blade",
        "tier": "rare",
        "damage_bonus": 25,
        "additional_effect": "10 fire damage over time",
        "str_requirement": 20,
        "description": "Wreathed in eternal flames"
    }
}
```

**Armor:**
```json
{
    "leather_armor": {
        "name": "Leather Armor",
        "tier": "common",
        "defense_bonus": 5,
        "hp_bonus": 20,
        "description": "Basic protection"
    },
    "plate_armor": {
        "name": "Plate Armor",
        "tier": "rare",
        "defense_bonus": 20,
        "hp_bonus": 50,
        "str_requirement": 18,
        "description": "Heavy metal plating"
    }
}
```

**Accessories:**
```json
{
    "ring_of_power": {
        "name": "Ring of Power",
        "tier": "rare",
        "str_bonus": 5,
        "description": "Increases strength"
    },
    "amulet_of_wisdom": {
        "name": "Amulet of Wisdom",
        "tier": "epic",
        "int_bonus": 8,
        "mana_bonus": 30,
        "description": "Enhances magical abilities"
    }
}
```

### **Equipment Management**
- View current equipment on character sheet
- Equip/unequip from inventory
- Compare stats before equipping
- Equipment requirements (level, stats) enforced
- Visual indication of equipped items

---

## **Dungeon Structure**

### **Floor Progression**

**Floor 1: The Entrance** (Tutorial)
- Recommended Level: 1-3
- Enemies: Rats, Slimes
- Boss: Giant Rat
- Purpose: Learn combat basics

**Floor 2: Dark Corridors**
- Recommended Level: 4-6
- Enemies: Goblins, Bats
- Boss: Goblin Chief
- Introduces: Traps, treasure chests

**Floor 3: Ancient Ruins**
- Recommended Level: 7-10
- Enemies: Skeletons, Zombies
- Boss: Skeleton King
- Introduces: Puzzles, merchants

**Floor 4: Volcanic Caverns**
- Recommended Level: 11-14
- Enemies: Fire Elementals, Lava Beasts
- Boss: Magma Golem
- Introduces: Environmental hazards

**Floor 5: Frozen Depths**
- Recommended Level: 15-18
- Enemies: Ice Wraiths, Frost Giants
- Boss: Ice Dragon
- High difficulty, best rewards

**Floor 6+:** Endless floors with scaling difficulty (future expansion)

### **Room Types**

**Combat (60% chance):**
- Random enemy encounter
- Must defeat to proceed
- Rewards: XP, gold, possible loot

**Treasure (15% chance):**
- Locked chest or pile of treasure
- Requires puzzle to open
- Rewards: Gold, items, equipment

**Trap (10% chance):**
- Requires DEX check to avoid
- Puzzle to disarm
- Failure: Take damage or debuff
- Success: Sometimes loot

**Merchant (5% chance):**
- NPC selling items
- Can buy potions, equipment
- Prices higher than shop

**Puzzle (5% chance):**
- Logic puzzle separate from combat
- No combat penalty for failure
- Rewards: Bonus XP, rare items

**Rest Area (5% chance):**
- Safe zone
- Restore HP/Mana
- Save progress
- Can exit dungeon safely

---

## **Combat System**

### **Combat Flow**

**Initiative Phase:**
1. Combat begins (AI narrates enemy appearance)
2. Determine who goes first (based on DEX, higher goes first)
3. Display combat modal

**Player Turn:**
1. Show available actions (based on unlocked abilities, mana, cooldowns)
2. Player selects action
3. Coding challenge appears based on action
4. Player solves challenge
5. Evaluate solution:
   - **Correct:** Action succeeds at full power
   - **Incorrect:** Action fails or reduced effectiveness
6. Calculate and apply damage/effects
7. AI narrates result
8. Check if enemy defeated → end combat
9. Else → Enemy turn

**Enemy Turn:**
1. Enemy AI selects action (based on behavior type)
2. Auto-resolve (no coding challenge)
3. Calculate and apply damage to player
4. AI narrates result
5. Check if player defeated → death handling
6. Else → Player turn

**Combat End:**
- Victory: Rewards (XP, gold, loot)
- Defeat: Death handling (respawn, penalties)

### **Coding Challenges During Combat**

**Challenge Selection:**
Based on action type and user's current course progress:
- If in Python Fundamentals → Python basic challenges
- If in Intermediate → Intermediate challenges
- If in Advanced → Advanced challenges

**Challenge Types by Action:**

**Basic Attack:**
- Easy challenge
- Example: "Write a function that returns damage"
- Success: Full damage
- Failure: 50% damage (still hits, but weaker)

**Spell/Ability:**
- Medium challenge
- Example: "Calculate spell damage with this formula"
- Success: Full effect + bonus
- Failure: No effect, mana still consumed

**Heal:**
- Easy-medium challenge
- Example: "Calculate healing amount"
- Success: Full heal
- Failure: 50% heal

**Defend:**
- Easy challenge
- Example: "Return defense calculation"
- Success: Block 50% damage next turn
- Failure: Block 25% damage

**Challenge Presentation:**
```
┌─────────────────────────────────────────┐
│  You cast Fireball!                      │
│  Write code to calculate the damage:     │
│                                          │
│  base_damage = 25                        │
│  intelligence = 18                       │
│                                          │
│  Return: base + (intelligence * 0.5)    │
│                                          │
│  [Code Editor]                           │
│  def calculate_damage():                 │
│      # Your code here                    │
│      return ___                          │
│                                          │
│  [Run] [Hint] [Skip (50% power)]        │
└─────────────────────────────────────────┘
```

**Challenge Difficulty Scaling:**
- Floor 1-2: Very easy (direct calculations)
- Floor 3-4: Easy-medium (simple logic)
- Floor 5+: Medium-hard (complex logic, multiple steps)

**Failure Handling:**
- Don't punish too harshly
- Failed basic attack → still does some damage
- Failed ability → wastes mana but small effect
- Failed heal → partial heal
- **Never:** Complete miss on all failures (frustrating)

---

## **AI Dungeon Master Integration**

### **AI Roles**

**Narrator:**
- Describes room entrances
- Sets atmosphere
- Reacts to player actions
- Describes combat actions
- Tells story of the dungeon

**Combat Director:**
- Announces enemy appearance
- Narrates attacks and abilities
- Describes damage and effects
- Announces victory/defeat

**Guide:**
- Provides hints if player stuck
- Explains game mechanics
- Suggests strategies
- Encourages player

### **AI System Prompts**

**Base Dungeon Master Prompt:**
```
You are the Dungeon Master for a text-based RPG integrated into a coding learning app. Your role is to narrate the player's adventure through a dungeon, making the experience engaging and immersive while maintaining consistency with game mechanics.

PLAYER CONTEXT:
- Name: {user_name}
- Level: {level}
- Class: {implied_by_stats}
- Current Floor: {floor_number}
- HP: {current_hp}/{max_hp}
- Stats: STR {str}, INT {int}, DEX {dex}

CURRENT SITUATION:
{room_type} on Floor {floor_number}
{enemy_info_if_combat}

YOUR RESPONSIBILITIES:
1. Narrate what the player sees/experiences (2-3 sentences)
2. Maintain fantasy RPG atmosphere
3. React to player actions dynamically
4. Describe combat dramatically but concisely
5. Provide encouragement and tension
6. Stay in character as omniscient narrator

TONE: Epic fantasy, encouraging, dramatic but not overly verbose

GUIDELINES:
- Keep responses under 100 words unless crucial
- Use vivid but simple language
- Adapt tone to situation (tension in combat, calm in rest)
- Reference player's stats/actions naturally
- Never break immersion or mention "game mechanics" directly
```

**Combat Narration Prompt:**
```
COMBAT SITUATION:
Player: {player_name} (HP: {hp}/{max_hp})
Enemy: {enemy_name} (HP: {enemy_hp}/{enemy_max_hp})
Last Action: {last_action}
Result: {success/failure}

Narrate the result of the player's action in 1-2 sentences.

If player succeeded: Describe the attack/spell dramatically
If player failed: Describe the miss or fizzle, but keep it encouraging

Then narrate the enemy's response in 1 sentence.

Keep it exciting but brief. Use RPG combat language.
```

**Exploration Prompt:**
```
The player enters a new room on Floor {floor}.
Room Type: {room_type}

Describe what they see in 2-3 sentences. Include:
- Visual atmosphere
- Any immediate threats or opportunities
- Sense of deeper dungeon ahead

Make it feel like an adventure, but don't be too wordy.
```

### **AI Integration Points**

**When to Call AI:**
1. Entering new room
2. Before combat starts (enemy introduction)
3. After player action in combat
4. Finding treasure/puzzles
5. Encountering NPCs
6. Player asks questions
7. Significant events (level up, boss defeat, floor cleared)

**When NOT to Call AI:**
- Showing ability list
- Opening character sheet
- Viewing inventory
- Mechanical UI interactions
- Between combat turns (just update UI)

**AI Context Management:**
Keep last 5-10 AI responses in session for context continuity.

---

## **UI Design**

### **Dungeon Entry Point (Dashboard Widget)**

```
┌──────────────────────────────────────┐
│  ⚔️ DUNGEON CRAWLER                  │
├──────────────────────────────────────┤
│  Level 8 Warrior                      │
│  Floor: 3 | HP: 85/100               │
│                                      │
│  "The skeleton guards stir as you   │
│  approach the ancient door..."       │
│                                      │
│  [Continue Adventure]                │
│  [Character Sheet] [Inventory]      │
└──────────────────────────────────────┘
```

### **Main Dungeon View**

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚔️ DUNGEON - FLOOR 3: Ancient Ruins               [X] Exit     │
├───────────────────┬─────────────────────────────────────────────┤
│  CHARACTER        │  EXPLORATION                                │
│                   │                                             │
│  🧙 CodeWarrior  │  You descend deeper into the ruins.        │
│  Level 8          │  Torchlight flickers across ancient        │
│                   │  stone walls covered in mysterious          │
│  HP: 85/100       │  runes. The air grows colder.              │
│  ████████░░       │                                             │
│                   │  Ahead you see four passages...            │
│  MP: 40/60        │                                             │
│  ██████░░░░       │  What do you do?                           │
│                   │                                             │
│  STR: 18          │  ┌────────────────────────────────────┐   │
│  INT: 14          │  │ 🔍 Search the Room                 │   │
│  DEX: 12          │  │ Look for treasure or clues         │   │
│                   │  └────────────────────────────────────┘   │
│  ⚔️ Steel Sword  │                                             │
│  🛡️ Leather      │  ┌────────────────────────────────────┐   │
│                   │  │ 🚪 North Passage                   │   │
│  [Character]      │  │ Proceed deeper into dungeon        │   │
│  [Inventory]      │  └────────────────────────────────────┘   │
│  [Abilities]      │                                             │
│                   │  ┌────────────────────────────────────┐   │
│  Floor: 3/5       │  │ 🪜 Climb to Upper Level            │   │
│  Progress: 60%    │  │ Requires DEX check                 │   │
│                   │  └────────────────────────────────────┘   │
│  Enemies: 23      │                                             │
│  Bosses: 2        │  ┌────────────────────────────────────┐   │
│                   │  │ 💬 Ask Dungeon Master              │   │
│  [Rest Area]      │  │ Get hints or information           │   │
│  [Leave Dungeon]  │  └────────────────────────────────────┘   │
│                   │                                             │
└───────────────────┴─────────────────────────────────────────────┘
```

### **Combat Modal**

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚔️ COMBAT                                         [?] Help     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🧟 SKELETON WARRIOR                                            │
│  HP: 35/60  ██████████░░░░░░░░░░                              │
│                                                                  │
│  A skeletal warrior raises its rusty blade. Its eye sockets    │
│  glow with an eerie green light as it prepares to strike!      │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  🧙 YOU (Level 8)                                               │
│  HP: 85/100  ████████████████░░░░                             │
│  MP: 40/60   ████████████░░░░░░░░                             │
├─────────────────────────────────────────────────────────────────┤
│  YOUR TURN - Choose Your Action:                               │
│                                                                  │
│  ┌─────────────────┬─────────────────┬─────────────────┐      │
│  │ ⚔️ Basic Attack │ 🔥 Fireball    │ ❤️ Heal         │      │
│  │ Free            │ 20 MP           │ 15 MP           │      │
│  │ ~15 damage      │ ~34 damage      │ ~30 HP          │      │
│  │ [Attack]        │ [Cast]          │ [Heal]          │      │
│  └─────────────────┴─────────────────┴─────────────────┘      │
│                                                                  │
│  ┌─────────────────┬─────────────────┬─────────────────┐      │
│  │ 💪 Power Strike │ 🛡️ Defend      │ 🏃 Flee         │      │
│  │ 10 MP           │ Free            │ 50% chance      │      │
│  │ ~52 damage      │ -50% dmg taken  │                 │      │
│  │ [Strike]        │ [Defend]        │ [Run]           │      │
│  └─────────────────┴─────────────────┴─────────────────┘      │
│                                                                  │
│  💡 Tip: Fireball deals the most damage but costs mana!        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### **Coding Challenge During Combat**

```
┌─────────────────────────────────────────────────────────────────┐
│  🔥 CASTING FIREBALL                              Time: 01:23   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  You begin to channel magical energy, flames swirling around    │
│  your hands. Focus your power to unleash the spell!             │
│                                                                  │
│  Calculate the damage your fireball will deal:                  │
│                                                                  │
│  Base Damage: 25                                                │
│  Your Intelligence: 14                                          │
│  Bonus Damage Formula: intelligence * 0.5                       │
│                                                                  │
│  Write a function that returns the total damage:                │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ def calculate_fireball_damage():                       │    │
│  │     base_damage = 25                                   │    │
│  │     intelligence = 14                                  │    │
│  │     # Your code here                                   │    │
│  │     return ___                                         │    │
│  │                                                         │    │
│  │                                                         │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  [▶️ Execute Spell] [💡 Get Hint (-5 dmg)] [⏭️ Skip (50%)]    │
│                                                                  │
│  Hint available: 1 remaining                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### **Combat Result**

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚔️ COMBAT RESULT                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ✅ Success! Perfect execution!                                 │
│                                                                  │
│  🔥 Your fireball erupts in a brilliant explosion!              │
│  The skeleton warrior is engulfed in flames!                    │
│                                                                  │
│  💥 You dealt 32 damage! (25 base + 7 INT bonus)               │
│                                                                  │
│  🧟 Skeleton Warrior: 35 → 3 HP                                │
│                                                                  │
│  The skeleton staggers, barely clinging to existence. It        │
│  raises its blade for a desperate counterattack!                │
│                                                                  │
│  ⚔️ Skeleton Warrior attacks!                                   │
│  It swings wildly, dealing 8 damage!                            │
│                                                                  │
│  🧙 You: 85 → 77 HP                                             │
│                                                                  │
│  [Continue]                                                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### **Victory Screen**

```
┌─────────────────────────────────────────────────────────────────┐
│  🎉 VICTORY!                                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  The skeleton crumbles to dust. You stand victorious!          │
│                                                                  │
│  ⚔️ Skeleton Warrior Defeated!                                  │
│                                                                  │
│  REWARDS:                                                        │
│  ✨ +150 XP                                                     │
│  💰 +45 Gold                                                    │
│  🎁 Loot: Iron Sword (equipped!)                               │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 📊 Combat Statistics:                                   │    │
│  │ Turns: 4                                                │    │
│  │ Damage Dealt: 78                                        │    │
│  │ Damage Taken: 23                                        │    │
│  │ Coding Accuracy: 3/4 (75%)                             │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  💪 New Attack Power: 15 → 20 (+5 from Iron Sword)            │
│                                                                  │
│  [Continue Exploring] [Rest & Recover] [Leave Dungeon]         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### **Character Sheet Modal**

```
┌─────────────────────────────────────────────────────────────────┐
│  📋 CHARACTER SHEET                                 [X] Close   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🧙 CodeWarrior                                    Level 8      │
│  "Warrior of Code, Slayer of Bugs"                              │
│                                                                  │
│  ┌─────────────────────┬──────────────────────────────────┐   │
│  │ PRIMARY STATS       │ COMBAT STATS                     │   │
│  ├─────────────────────┼──────────────────────────────────┤   │
│  │ 💪 Strength: 18     │ ❤️ Health: 85 / 100             │   │
│  │ 🧠 Intelligence: 14 │ 💙 Mana: 40 / 60                │   │
│  │ ⚡ Dexterity: 12    │ ⚔️ Damage: 25 (10+15 weapon)    │   │
│  │                     │ 🛡️ Defense: 10 (5+5 armor)      │   │
│  │ 📊 XP: 2,450/3,000  │ 💥 Critical: 11%                │   │
│  │ ━━━━━━━━━━░░░░ 82% │ 🌀 Dodge: 8.6%                  │   │
│  └─────────────────────┴──────────────────────────────────┘   │
│                                                                  │
│  ⚙️ EQUIPMENT                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ Weapon: ⚔️ Iron Sword (+15 dmg) [Uncommon]           │    │
│  │ Armor: 🛡️ Leather Armor (+5 def, +20 HP) [Common]    │    │
│  │ Accessory: Empty                                       │    │
│  │                                                         │    │
│  │ [View Inventory] [Manage Equipment]                    │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ✨ ABILITIES (5 unlocked)                                      │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ ⚔️ Basic Attack - Always available                     │    │
│  │ ❤️ Heal - Restore 30 HP (15 MP)                       │    │
│  │ 🔥 Fireball - 25 + INT dmg (20 MP)                    │    │
│  │ 💪 Power Strike - 40 + STR dmg (10 MP)                │    │
│  │                                                         │    │
│  │ 🔒 Next Unlock: Lightning Bolt (Level 10)             │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  🏆 DUNGEON PROGRESS                                            │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ Current Floor: 3/5                                     │    │
│  │ Deepest Reached: Floor 3                               │    │
│  │ Enemies Defeated: 23                                   │    │
│  │ Bosses Defeated: 2                                     │    │
│  │ Deaths: 1                                              │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  💎 STAT POINTS AVAILABLE: 3                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ Distribute your stat points:                           │    │
│  │ Strength:     [+] (Currently 18)                       │    │
│  │ Intelligence: [+] (Currently 14)                       │    │
│  │ Dexterity:    [+] (Currently 12)                       │    │
│  │                                                         │    │
│  │ [Reset] [Apply Changes]                                │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## **Death & Respawn System**

### **When Player Reaches 0 HP**

**Option 1: Soft Penalty (Recommended)**
```
┌─────────────────────────────────────────┐
│  💀 YOU HAVE FALLEN                      │
├─────────────────────────────────────────┤
│  The darkness claims you...              │
│                                          │
│  But a true coder never gives up!       │
│                                          │
│  PENALTIES:                              │
│  • Lose 10% of current gold             │
│  • Return to start of floor             │
│  • HP/MP restored to full               │
│                                          │
│  "Every failure teaches us something    │
│  new. Learn and try again!"             │
│                                          │
│  [Respawn] [Leave Dungeon]              │
└─────────────────────────────────────────┘
```

**Penalties:**
- Lose 10% of carried gold (not banked gold)
- Return to entrance of current floor
- Fully restore HP/Mana
- Increment death counter
- Lose floor progress (must re-clear rooms)

**No Penalty:**
- Keep all XP earned
- Keep all equipment
- Keep all abilities
- Keep level

### **Respawn Location**
Safe zone at start of current floor (not all the way back to Floor 1).

---

## **Boss Battles**

### **Boss Characteristics**

**Differences from Regular Combat:**
- Fixed stats (don't scale randomly)
- Multiple phases (health thresholds trigger new abilities)
- Special abilities/mechanics
- Higher reward
- More dramatic AI narration
- Can't flee

**Example Boss: Giant Rat (Floor 1)**
```
Boss: Giant Rat King
HP: 150
Damage: 15
Abilities:
- Phase 1 (100-150 HP): Normal attacks
- Phase 2 (50-99 HP): Summons 2 small rats (must defeat first)
- Phase 3 (0-49 HP): Enraged, +50% damage

Rewards:
- 500 XP
- 200 Gold
- Guaranteed: Rat King Crown (accessory, +3 all stats)
```

**Boss Battle UI:**
- Special boss health bar (segmented by phases)
- Warning when phase changes
- Unique AI narration style
- Epic music indicator (UI note: "Epic battle music plays")

---

## **Treasure & Loot**

### **Treasure Chests**

**Types:**
- **Wooden Chest:** Easy puzzle, common loot
- **Iron Chest:** Medium puzzle, uncommon loot
- **Golden Chest:** Hard puzzle, rare loot
- **Legendary Chest:** Expert puzzle, epic/legendary loot

**Puzzle to Open:**
Present coding challenge based on chest tier.
Success = open chest, failure = can retry or skip.

**Loot Tables by Floor:**

**Floor 1:**
- 50-100 gold
- Common weapons/armor
- Health potions

**Floor 2:**
- 100-200 gold
- Uncommon weapons/armor
- Health/Mana potions

**Floor 3:**
- 200-400 gold
- Rare equipment
- Special items (stat boosters)

**Floor 4+:**
- 400-800 gold
- Epic/Legendary equipment
- Rare consumables

---

## **Merchants**

### **Merchant Encounters**

**When Encountered:**
- 5% chance per room
- Safe interaction (no combat)
- Can buy/sell
- Prices 20% higher than regular shop
- Stock rotates per floor

**Merchant Inventory:**
```
┌─────────────────────────────────────────┐
│  🧙 WANDERING MERCHANT                   │
├─────────────────────────────────────────┤
│  "Greetings, adventurer! Care to trade?"│
│                                          │
│  YOUR GOLD: 450                         │
│                                          │
│  FOR SALE:                               │
│  • Health Potion x3      60g each       │
│  • Mana Potion x2        45g each       │
│  • Steel Sword           300g           │
│  • Ring of Power         500g           │
│                                          │
│  I'LL BUY:                               │
│  • Old equipment at 50% value           │
│                                          │
│  [Buy] [Sell] [Leave]                   │
└─────────────────────────────────────────┘
```

---

## **Rest Areas**

### **Rest Functionality**

**When Found:**
- Fully restore HP and Mana
- Save progress
- Can leave dungeon safely (no penalty)
- Can manage inventory/equipment
- Can talk to AI for story/hints
- Cooldowns reset

**Rest Area UI:**
```
┌─────────────────────────────────────────┐
│  🛏️ REST AREA                            │
├─────────────────────────────────────────┤
│  You discover a safe chamber with a     │
│  warm fire and provisions. The dungeon  │
│  feels distant here.                    │
│                                          │
│  ✨ You feel restored!                   │
│  HP: 100/100  MP: 60/60                 │
│                                          │
│  [Continue Exploring]                   │
│  [Manage Equipment]                     │
│  [Leave Dungeon Safely]                 │
│  [Talk to Dungeon Master]               │
│                                          │
└─────────────────────────────────────────┘
```

---

## **Stat Checks & Exploration**

### **Stat Check System**

**When Triggered:**
- Climbing (DEX check)
- Investigating clues (INT check)
- Breaking doors (STR check)
- Sneaking (DEX check)
- Deciphering runes (INT check)

**Check Resolution:**
1. Player attempts action
2. Coding challenge presented
3. Challenge difficulty based on stat:
   - High stat = easier puzzle
   - Low stat = harder puzzle
4. Success = action succeeds
5. Failure = action fails (minor penalty or alternate path)

**Example - Climbing:**
```
You see a ladder leading up to a higher level.
DEX check required.

Your DEX: 12 (Medium difficulty)

Challenge: Write a function that calculates climb success...
```

---

## **Integration with Main App**

### **Where Dungeon Appears**

**Dashboard:**
- Prominent widget showing current status
- Quick continue button
- Character preview

**Main Navigation:**
- "Dungeon" in main menu
- Badge showing if in active combat
- Notification if haven't visited in 24h

### **XP and Currency Integration**

**XP Earned in Dungeon:**
- Counts toward user level
- Same XP system as lessons/puzzles
- Contributes to overall progress

**Gold Earned:**
- Added to user's total gold
- Can be spent in main shop
- Dungeon-specific items also available

**Lesson → Dungeon Connection:**
- "Take a break" button in lessons → Go to dungeon
- "Get stronger to continue" prompt if stuck
- Mention dungeon in level-up messages

---

## **Achievements**

### **Dungeon Achievements**

```json
[
    {
        "id": "first-blood",
        "name": "First Blood",
        "description": "Defeat your first enemy",
        "icon": "⚔️",
        "xp_reward": 100,
        "gold_reward": 50
    },
    {
        "id": "floor-1-clear",
        "name": "Rat Exterminator",
        "description": "Clear Floor 1",
        "icon": "🐀",
        "xp_reward": 500,
        "gold_reward": 200
    },
    {
        "id": "giant-slayer",
        "name": "Giant Slayer",
        "description": "Defeat your first boss",
        "icon": "🏆",
        "xp_reward": 1000,
        "gold_reward": 500
    },
    {
        "id": "perfectionist",
        "name": "Flawless Victory",
        "description": "Win combat without taking damage",
        "icon": "💎",
        "xp_reward": 300,
        "gold_reward": 150
    },
    {
        "id": "survivor",
        "name": "Survivor",
        "description": "Win combat with less than 10 HP",
        "icon": "❤️",
        "xp_reward": 200,
        "gold_reward": 100
    },
    {
        "id": "code-master",
        "name": "Code Master",
        "description": "Complete 10 challenges perfectly",
        "icon": "🧠",
        "xp_reward": 500,
        "gold_reward": 300
    },
    {
        "id": "treasure-hunter",
        "name": "Treasure Hunter",
        "description": "Open 25 treasure chests",
        "icon": "💰",
        "xp_reward": 400,
        "gold_reward": 250
    },
    {
        "id": "dungeon-master",
        "name": "Dungeon Master",
        "description": "Reach Floor 5",
        "icon": "🗝️",
        "xp_reward": 2000,
        "gold_reward": 1000
    }
]
```

---

## **Balancing Guidelines**

### **Combat Difficulty**

**Floor 1 Enemies:**
- HP: 30-50
- Damage: 5-10
- Player should win with 60-80% HP remaining

**Floor 3 Enemies:**
- HP: 80-120
- Damage: 15-25
- Player should win with 40-60% HP remaining

**Floor 5 Enemies:**
- HP: 150-200
- Damage: 30-40
- Strategic ability use required

**Boss Guidelines:**
- 3-5x regular enemy HP
- 1.5-2x regular enemy damage
- Should take 8-12 turns to defeat
- Player should use 60-80% of mana

### **Reward Scaling**

**Gold per Floor:**
- Floor 1: 20-50 per enemy
- Floor 3: 50-100 per enemy
- Floor 5: 100-200 per enemy

**XP per Floor:**
- Floor 1: 50-100 per enemy
- Floor 3: 100-200 per enemy
- Floor 5: 200-400 per enemy

**Equipment Tier by Floor:**
- Floor 1-2: Common and Uncommon
- Floor 3-4: Uncommon and Rare
- Floor 5+: Rare, Epic, Legendary

---

## **Technical Implementation Notes**

### **Combat Challenge Generation**

**Challenge Pool:**
Maintain database of coding challenges categorized by:
- Difficulty (easy, medium, hard)
- Concept (loops, functions, conditionals, etc.)
- Language (Python, C#, Ruby, etc.)

**Challenge Selection Logic:**
1. Determine difficulty based on floor
2. Filter by player's course progress
3. Select appropriate challenge
4. Personalize (use player name, enemy name in challenge)

### **AI Response Caching**

**Cache common scenarios:**
- Room descriptions by type
- Common enemy introductions
- Standard combat narration

**Generate fresh for:**
- Boss encounters
- Unique situations
- Player questions
- Critical moments

### **State Management**

**Session State:**
Keep in memory during active session:
- Current room
- Combat state
- AI conversation history
- Temporary buffs/debuffs

**Persistent State:**
Save to database:
- Floor progress
- Character stats
- Inventory
- Achievements

---

## **Future Expansion Ideas**

### **Phase 2 Features:**
- Multiplayer dungeons (co-op)
- PvP arena
- Crafting system
- Pet/companion system
- Daily dungeon challenges
- Seasonal events

### **Phase 3 Features:**
- Guild dungeons
- Raid bosses
- Dungeon building (create your own)
- Trading marketplace
- Character specializations/classes

---

## **Success Metrics**

Dungeon system is successful when:
- ✅ Users level up more actively
- ✅ Time in app increases
- ✅ Dungeon played daily
- ✅ Users excited about next level
- ✅ Currency spending increases
- ✅ Retention improves
- ✅ Users mention dungeon in feedback
- ✅ Learning outcomes maintained/improved

---

## **Implementation Priority**

### **MVP (Phase 1):**
1. Character stats system
2. Floor 1 only (tutorial dungeon)
3. Basic combat with 2-3 enemy types
4. 3-4 abilities
5. Simple equipment (5 items)
6. AI narration
7. Basic challenges
8. One boss

### **Phase 2:**
9. Floors 2-3
10. More enemies and abilities
11. Treasure chests
12. Merchants
13. Rest areas
14. Death/respawn

### **Phase 3:**
15. Floors 4-5
16. More equipment variety
17. Advanced abilities
18. Achievements
19. Polish and balance

---
