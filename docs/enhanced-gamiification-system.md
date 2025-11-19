# **Enhanced Gamification System - Currency, Shop & Meaningful Progression**

## **Overview**

Transform the learning app into a full RPG experience with:
- Dual currency system (Gold + Gems)
- Shop with consumables, boosts, and cosmetics
- Meaningful level-based unlocks
- Progressive feature reveals
- Prestige/mastery system for endgame

---

## **Currency System**

### **Gold Coins 🪙 (Primary Currency)**

**How to Earn:**
- Complete lesson: 50-200 gold (based on difficulty)
- Complete challenge lesson: 300-500 gold
- Solve puzzle: 100-500 gold (based on difficulty)
- Daily quest completion: 100 gold
- Maintain streak: 25 gold per day
- Level up: 500 gold
- Achievement unlock: 100-1000 gold
- Perfect lesson (no hints, first try): +50% gold bonus

**What It's For:**
- Basic shop items
- Consumables
- Common cosmetics
- Streak protection
- Hint unlocks

**Balance:** Should feel abundant, encourages spending

### **Gems 💎 (Premium Currency)**

**How to Earn:**
- Complete full course: 100 gems
- Weekly quest completion: 25 gems
- Major achievement: 10-50 gems
- Daily login bonus (day 7, 14, 21, 30): 5-20 gems
- Reach milestone levels (5, 10, 15, 20, 25, 30): 25-100 gems
- Win leaderboard position (top 10): 50 gems
- Complete all puzzles in category: 75 gems
- Rare/difficult accomplishments

**What It's For:**
- Premium cosmetics
- Rare items
- Experience boosts
- Course unlocks (skip level requirements)
- Avatar customization
- Exclusive themes

**Balance:** Should feel scarce and valuable, earned through dedication

---

## **Database Schema**

```sql
-- User currency
CREATE TABLE IF NOT EXISTS user_currency (
    user_id INTEGER PRIMARY KEY,
    gold INTEGER DEFAULT 0,
    gems INTEGER DEFAULT 0,
    lifetime_gold_earned INTEGER DEFAULT 0,
    lifetime_gems_earned INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Shop items
CREATE TABLE IF NOT EXISTS shop_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,  -- 'consumable', 'boost', 'cosmetic', 'utility'
    type TEXT NOT NULL,      -- Specific type within category
    
    -- Pricing
    cost_gold INTEGER DEFAULT 0,
    cost_gems INTEGER DEFAULT 0,
    
    -- Availability
    required_level INTEGER DEFAULT 1,
    is_limited_time BOOLEAN DEFAULT FALSE,
    available_until TIMESTAMP,
    stock_limit INTEGER,     -- NULL = unlimited, else limited quantity
    
    -- Effects (JSON for flexibility)
    effects TEXT NOT NULL,   -- JSON: {"type": "xp_boost", "value": 1.5, "duration": 3600}
    
    -- Metadata
    icon TEXT,
    rarity TEXT,            -- 'common', 'uncommon', 'rare', 'epic', 'legendary'
    is_consumable BOOLEAN DEFAULT TRUE,
    max_stack INTEGER DEFAULT 99,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User inventory
CREATE TABLE IF NOT EXISTS user_inventory (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    item_id TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (item_id) REFERENCES shop_items(id),
    UNIQUE(user_id, item_id)
);

-- Active effects on user
CREATE TABLE IF NOT EXISTS user_active_effects (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    effect_type TEXT NOT NULL,
    effect_value REAL NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    source_item_id TEXT,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (source_item_id) REFERENCES shop_items(id)
);

-- Transaction history
CREATE TABLE IF NOT EXISTS currency_transactions (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    currency_type TEXT NOT NULL,  -- 'gold' or 'gems'
    amount INTEGER NOT NULL,      -- Positive = earned, negative = spent
    reason TEXT NOT NULL,
    reference_id TEXT,            -- Lesson ID, item ID, etc.
    balance_after INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Purchase history
CREATE TABLE IF NOT EXISTS purchase_history (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    item_id TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    cost_gold INTEGER DEFAULT 0,
    cost_gems INTEGER DEFAULT 0,
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (item_id) REFERENCES shop_items(id)
);

-- Daily/Weekly quests
CREATE TABLE IF NOT EXISTS quests (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,          -- 'daily', 'weekly', 'special'
    title TEXT NOT NULL,
    description TEXT,
    
    -- Requirements
    objective_type TEXT NOT NULL, -- 'complete_lessons', 'solve_puzzles', 'earn_xp', etc.
    objective_target INTEGER NOT NULL,
    
    -- Rewards
    reward_xp INTEGER DEFAULT 0,
    reward_gold INTEGER DEFAULT 0,
    reward_gems INTEGER DEFAULT 0,
    reward_item_id TEXT,
    
    -- Availability
    start_date DATE,
    end_date DATE,
    repeatable BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (reward_item_id) REFERENCES shop_items(id)
);

CREATE TABLE IF NOT EXISTS user_quest_progress (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    quest_id TEXT NOT NULL,
    progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    last_reset TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (quest_id) REFERENCES quests(id),
    UNIQUE(user_id, quest_id)
);

-- Level rewards/unlocks
CREATE TABLE IF NOT EXISTS level_rewards (
    level INTEGER PRIMARY KEY,
    xp_required INTEGER NOT NULL,
    
    -- Rewards
    reward_gold INTEGER DEFAULT 0,
    reward_gems INTEGER DEFAULT 0,
    reward_items TEXT,           -- JSON array of item IDs
    
    -- Unlocks
    unlocks_feature TEXT,        -- JSON array: ["intermediate_courses", "shop_premium", etc.]
    unlocks_category TEXT,       -- Puzzle category, course category
    
    -- Display
    title TEXT,                  -- "Apprentice Coder", "Code Warrior", etc.
    description TEXT,
    icon TEXT
);
```

---

## **Shop Categories & Items**

### **Category 1: Consumables (Gold)**

#### **Experience Potions**
```json
{
    "id": "xp-potion-small",
    "name": "Minor XP Potion",
    "description": "Gain 50% bonus XP for the next lesson",
    "category": "consumable",
    "type": "xp_boost",
    "cost_gold": 200,
    "cost_gems": 0,
    "effects": {
        "type": "xp_multiplier",
        "value": 1.5,
        "duration": "next_lesson"
    },
    "icon": "🧪",
    "rarity": "common",
    "max_stack": 10
}
```

```json
{
    "id": "xp-potion-medium",
    "name": "XP Potion",
    "description": "Gain 100% bonus XP for the next 3 lessons",
    "cost_gold": 500,
    "effects": {
        "type": "xp_multiplier",
        "value": 2.0,
        "duration": "3_lessons"
    },
    "icon": "⚗️",
    "rarity": "uncommon",
    "max_stack": 5
}
```

```json
{
    "id": "xp-potion-large",
    "name": "Grand XP Potion",
    "description": "Gain 200% bonus XP for 1 hour",
    "cost_gems": 25,
    "effects": {
        "type": "xp_multiplier",
        "value": 3.0,
        "duration_seconds": 3600
    },
    "icon": "🍾",
    "rarity": "rare",
    "max_stack": 3
}
```

#### **Gold Boosters**
```json
{
    "id": "gold-boost",
    "name": "Treasure Hunter's Charm",
    "description": "Earn 50% more gold for 24 hours",
    "cost_gold": 1000,
    "effects": {
        "type": "gold_multiplier",
        "value": 1.5,
        "duration_seconds": 86400
    },
    "icon": "🪙",
    "rarity": "uncommon"
}
```

#### **Streak Protection**
```json
{
    "id": "streak-shield",
    "name": "Streak Shield",
    "description": "Protects your streak if you miss ONE day. Consumed automatically.",
    "cost_gold": 500,
    "effects": {
        "type": "streak_protection",
        "value": 1,
        "duration": "until_used"
    },
    "icon": "🛡️",
    "rarity": "uncommon",
    "max_stack": 3
}
```

```json
{
    "id": "eternal-shield",
    "name": "Eternal Streak Shield",
    "description": "Protect your streak for up to 7 days. Premium item.",
    "cost_gems": 100,
    "effects": {
        "type": "streak_protection",
        "value": 7,
        "duration": "until_used"
    },
    "icon": "🛡️✨",
    "rarity": "epic",
    "max_stack": 1
}
```

#### **Hint Tokens**
```json
{
    "id": "hint-scroll",
    "name": "Hint Scroll",
    "description": "Unlock one hint for free (no point cost)",
    "cost_gold": 150,
    "effects": {
        "type": "free_hint",
        "value": 1
    },
    "icon": "📜",
    "rarity": "common",
    "max_stack": 20
}
```

#### **Time Savers**
```json
{
    "id": "fast-forward",
    "name": "Time Crystal",
    "description": "Skip lesson timer requirements (for timed challenges)",
    "cost_gems": 10,
    "effects": {
        "type": "skip_timer",
        "value": 1
    },
    "icon": "⏩",
    "rarity": "rare",
    "max_stack": 5
}
```

---

### **Category 2: Boosts (Gold/Gems)**

#### **Learning Boosts**
```json
{
    "id": "focus-mode",
    "name": "Focus Elixir",
    "description": "2x XP for all activities for 2 hours",
    "cost_gems": 50,
    "effects": {
        "type": "xp_multiplier",
        "value": 2.0,
        "duration_seconds": 7200
    },
    "icon": "🧠",
    "rarity": "rare"
}
```

```json
{
    "id": "weekend-warrior",
    "name": "Weekend Warrior Buff",
    "description": "Available Fri-Sun only. 3x XP for 4 hours",
    "cost_gold": 2000,
    "is_limited_time": true,
    "effects": {
        "type": "xp_multiplier",
        "value": 3.0,
        "duration_seconds": 14400
    },
    "icon": "⚔️",
    "rarity": "epic"
}
```

#### **Challenge Boosts**
```json
{
    "id": "puzzle-master",
    "name": "Puzzle Master Brew",
    "description": "2x points from puzzles for 1 hour",
    "cost_gold": 800,
    "effects": {
        "type": "puzzle_points_multiplier",
        "value": 2.0,
        "duration_seconds": 3600
    },
    "icon": "🧩",
    "rarity": "uncommon"
}
```

---

### **Category 3: Cosmetics (Gems)**

#### **Avatars**
```json
{
    "id": "avatar-warrior",
    "name": "Warrior Avatar",
    "description": "Legendary warrior avatar frame",
    "category": "cosmetic",
    "type": "avatar",
    "cost_gems": 100,
    "effects": {"type": "cosmetic", "avatar_id": "warrior"},
    "icon": "⚔️",
    "rarity": "rare",
    "is_consumable": false
}
```

```json
{
    "id": "avatar-mage",
    "name": "Archmage Avatar",
    "cost_gems": 150,
    "effects": {"type": "cosmetic", "avatar_id": "mage"},
    "icon": "🧙",
    "rarity": "epic",
    "is_consumable": false
}
```

#### **Themes**
```json
{
    "id": "theme-dark-forest",
    "name": "Dark Forest Theme",
    "description": "UI theme: Dark greens with forest ambiance",
    "category": "cosmetic",
    "type": "theme",
    "cost_gems": 200,
    "required_level": 10,
    "effects": {"type": "cosmetic", "theme_id": "dark_forest"},
    "icon": "🌲",
    "rarity": "epic",
    "is_consumable": false
}
```

```json
{
    "id": "theme-cyberpunk",
    "name": "Cyberpunk Neon Theme",
    "cost_gems": 300,
    "required_level": 20,
    "effects": {"type": "cosmetic", "theme_id": "cyberpunk"},
    "icon": "🌆",
    "rarity": "legendary",
    "is_consumable": false
}
```

#### **Badges & Titles**
```json
{
    "id": "title-code-knight",
    "name": "Code Knight Title",
    "description": "Display 'Code Knight' under your name",
    "category": "cosmetic",
    "type": "title",
    "cost_gems": 50,
    "required_level": 5,
    "effects": {"type": "cosmetic", "title": "Code Knight"},
    "icon": "🛡️",
    "rarity": "uncommon",
    "is_consumable": false
}
```

#### **Celebration Effects**
```json
{
    "id": "fireworks-celebration",
    "name": "Fireworks Celebration",
    "description": "Fireworks animation when completing lessons",
    "cost_gems": 75,
    "effects": {"type": "cosmetic", "celebration": "fireworks"},
    "icon": "🎆",
    "rarity": "rare",
    "is_consumable": false
}
```

---

### **Category 4: Utility (Gold/Gems)**

#### **Course Access**
```json
{
    "id": "early-access-intermediate",
    "name": "Intermediate Access Pass",
    "description": "Unlock Intermediate courses before level requirement",
    "category": "utility",
    "type": "unlock",
    "cost_gems": 250,
    "effects": {
        "type": "unlock_courses",
        "skill_level": "intermediate"
    },
    "icon": "🔓",
    "rarity": "epic",
    "is_consumable": true,
    "max_stack": 1
}
```

```json
{
    "id": "early-access-advanced",
    "name": "Advanced Access Pass",
    "cost_gems": 500,
    "effects": {
        "type": "unlock_courses",
        "skill_level": "advanced"
    },
    "icon": "🔓✨",
    "rarity": "legendary",
    "is_consumable": true,
    "max_stack": 1
}
```

#### **Retry Tokens**
```json
{
    "id": "retry-token",
    "name": "Retry Token",
    "description": "Reset a failed challenge lesson attempt",
    "cost_gold": 300,
    "effects": {
        "type": "retry_lesson"
    },
    "icon": "🔄",
    "rarity": "uncommon",
    "max_stack": 10
}
```

#### **Auto-Save Scrolls**
```json
{
    "id": "auto-save-scroll",
    "name": "Auto-Save Scroll",
    "description": "Automatically saves your code every 30 seconds for 1 week",
    "cost_gold": 500,
    "effects": {
        "type": "auto_save",
        "duration_seconds": 604800
    },
    "icon": "💾",
    "rarity": "uncommon"
}
```

---

### **Category 5: Limited Time / Seasonal**

```json
{
    "id": "halloween-boost",
    "name": "Spooky XP Cauldron",
    "description": "Available October only. 5x XP for 30 minutes!",
    "cost_gold": 1000,
    "is_limited_time": true,
    "available_until": "2025-11-01T00:00:00Z",
    "effects": {
        "type": "xp_multiplier",
        "value": 5.0,
        "duration_seconds": 1800
    },
    "icon": "🎃",
    "rarity": "legendary"
}
```

---

## **Meaningful Level Progression**

### **Level 1-5: Tutorial Phase**
**Focus:** Learn the basics, understand the system

**Level 1 Unlocks:**
- ✅ Basic Python course access
- ✅ Easy puzzles
- ✅ Shop (consumables only)
- ✅ Daily quests
- **Reward:** 500 gold, Welcome Package (3 small XP potions)

**Level 2:**
- **Reward:** 500 gold, Hint Scroll x3

**Level 3:**
- ✅ Unlock: Chat with AI tutor (limit: 10 messages/day)
- **Reward:** 500 gold, 5 gems, Streak Shield

**Level 4:**
- **Reward:** 500 gold, Gold Boost potion

**Level 5:**
- ✅ Unlock: Medium puzzles
- ✅ Unlock: Cosmetics shop section
- ✅ Unlock: Title: "Apprentice Coder"
- ✅ Unlock: Game Logic puzzle category
- **Reward:** 750 gold, 25 gems, Choice of 1 common cosmetic

---

### **Level 6-10: Novice Phase**
**Focus:** Building foundations, proving consistency

**Level 6:**
- **Reward:** 750 gold, XP Potion x2

**Level 7:**
- ✅ Unlock: Weekly quests
- **Reward:** 750 gold, 10 gems

**Level 8:**
- ✅ Unlock: Leaderboards (view only)
- **Reward:** 1000 gold

**Level 9:**
- ✅ Unlock: AI Tutor unlimited messages
- **Reward:** 1000 gold, 15 gems

**Level 10:**
- ✅ Unlock: Intermediate courses (Python Applications, Godot Basics)
- ✅ Unlock: Hard puzzles
- ✅ Unlock: Title: "Code Warrior"
- ✅ Unlock: Optimization puzzle category
- ✅ Unlock: GDScript language for puzzles
- **Reward:** 1500 gold, 50 gems, Intermediate Access achievement

---

### **Level 11-15: Intermediate Phase**
**Focus:** Mastering intermediate concepts, specialization

**Level 11:**
- **Reward:** 1500 gold, 20 gems

**Level 12:**
- ✅ Unlock: Can create custom challenges (share with friends)
- **Reward:** 1500 gold, Focus Elixir

**Level 13:**
- ✅ Unlock: Leaderboards (competitive entry)
- **Reward:** 2000 gold, 25 gems

**Level 14:**
- **Reward:** 2000 gold, Weekend Warrior Buff

**Level 15:**
- ✅ Unlock: Expert puzzles
- ✅ Unlock: C# language for puzzles
- ✅ Unlock: Title: "Code Wizard"
- ✅ Unlock: Premium themes
- **Reward:** 2500 gold, 75 gems, Choice of 1 rare cosmetic

---

### **Level 16-20: Advanced Phase**
**Focus:** Professional development, advanced topics

**Level 16:**
- **Reward:** 2500 gold, 30 gems

**Level 17:**
- ✅ Unlock: Can mentor lower-level students (help in forums)
- **Reward:** 2500 gold, 35 gems

**Level 18:**
- **Reward:** 3000 gold, 40 gems

**Level 19:**
- ✅ Unlock: Beta access to new features
- **Reward:** 3000 gold, 45 gems

**Level 20:**
- ✅ Unlock: Advanced courses (Python Mastery, Godot 3D, Full Stack JS)
- ✅ Unlock: Title: "Code Master"
- ✅ Unlock: Legendary cosmetics
- ✅ Unlock: Create and publish custom lessons
- **Reward:** 5000 gold, 100 gems, Legendary avatar frame

---

### **Level 21-25: Expert Phase**
**Focus:** Mastery, contribution, teaching

**Level 21:**
- **Reward:** 3500 gold, 50 gems

**Level 22:**
- ✅ Unlock: Ruby language for puzzles
- **Reward:** 3500 gold, 55 gems

**Level 23:**
- **Reward:** 4000 gold, 60 gems

**Level 24:**
- ✅ Unlock: Advanced leaderboard (separate from regular)
- **Reward:** 4000 gold, 65 gems

**Level 25:**
- ✅ Unlock: Title: "Coding Legend"
- ✅ Unlock: All languages for all puzzles
- ✅ Unlock: Can contribute to official puzzle bank
- ✅ Unlock: Special "Legend" badge on profile
- **Reward:** 7500 gold, 150 gems, Unique legendary cosmetic set

---

### **Level 26-30: Prestige Preparation**
**Focus:** Completing everything, preparing for prestige

**Level 26-29:**
- **Rewards:** Increasing gold (5000-8000), gems (75-100)

**Level 30:**
- ✅ Unlock: Prestige system (see below)
- ✅ Title: "Grand Master Programmer"
- ✅ Unlock: All features permanently
- ✅ Special gold/platinum profile frame
- **Reward:** 10,000 gold, 250 gems, Complete cosmetic collection unlock

---

## **Prestige System (Level 30+)**

### **What is Prestige?**
At level 30, users can "prestige" - reset to level 1 but keep:
- ✅ All cosmetics purchased
- ✅ All courses unlocked
- ✅ All achievements earned
- ✅ Prestige badge on profile
- ✅ Permanent XP boost (+10% per prestige level)
- ✅ Special prestige-only shop items

**Lose temporarily:**
- Level (reset to 1)
- Currency (converted to prestige points)
- Active boosts

**Why Prestige?**
- Prestige ranks (P1, P2, P3, etc.)
- Exclusive cosmetics per prestige level
- Increased XP multipliers stack
- Special "Prestige" leaderboard
- Unique titles: "Prestige Master", "Eternal Coder"
- Access to endgame content

---

## **Daily & Weekly Quests**

### **Daily Quests (Reset at midnight)**

```json
[
    {
        "id": "daily-lesson",
        "title": "Daily Devotion",
        "description": "Complete 1 lesson",
        "objective_type": "complete_lessons",
        "objective_target": 1,
        "reward_xp": 100,
        "reward_gold": 100,
        "reward_gems": 0
    },
    {
        "id": "daily-three-lessons",
        "title": "Learning Spree",
        "description": "Complete 3 lessons",
        "objective_target": 3,
        "reward_xp": 300,
        "reward_gold": 300,
        "reward_gems": 5
    },
    {
        "id": "daily-puzzle",
        "title": "Puzzle Master",
        "description": "Solve 2 puzzles",
        "objective_type": "solve_puzzles",
        "objective_target": 2,
        "reward_xp": 200,
        "reward_gold": 200,
        "reward_gems": 0
    },
    {
        "id": "daily-xp",
        "title": "XP Grinder",
        "description": "Earn 500 XP",
        "objective_type": "earn_xp",
        "objective_target": 500,
        "reward_gold": 250,
        "reward_gems": 5
    },
    {
        "id": "daily-no-hints",
        "title": "Self-Sufficient",
        "description": "Complete a lesson without using hints",
        "objective_type": "lesson_no_hints",
        "objective_target": 1,
        "reward_xp": 150,
        "reward_gold": 200,
        "reward_gems": 3
    }
]
```

**Daily Quest Board Display:**
```
┌──────────────────────────────────────┐
│  📋 Daily Quests (Resets in 4h 23m) │
├──────────────────────────────────────┤
│  ✅ Daily Devotion (Complete!)      │
│     +100 XP, +100 Gold              │
│                                      │
│  ⬜ Learning Spree (1/3)            │
│     ━━━━━━░░░░░░░░░░ 33%           │
│     Reward: 300 XP, 300 Gold, 5💎  │
│                                      │
│  ⬜ Puzzle Master (0/2)             │
│     ░░░░░░░░░░░░░░░░ 0%            │
│     Reward: 200 XP, 200 Gold        │
│                                      │
│  Complete all daily quests:          │
│  BONUS: +100 Gold, +10 Gems! 🎁     │
└──────────────────────────────────────┘
```

### **Weekly Quests (Reset Monday 00:00)**

```json
[
    {
        "id": "weekly-grind",
        "title": "Weekly Warrior",
        "description": "Complete 15 lessons this week",
        "objective_type": "complete_lessons",
        "objective_target": 15,
        "reward_xp": 1000,
        "reward_gold": 1500,
        "reward_gems": 25
    },
    {
        "id": "weekly-puzzles",
        "title": "Puzzle Enthusiast",
        "description": "Solve 10 puzzles this week",
        "objective_type": "solve_puzzles",
        "objective_target": 10,
        "reward_xp": 800,
        "reward_gold": 1200,
        "reward_gems": 20
    },
    {
        "id": "weekly-perfect",
        "title": "Perfectionist",
        "description": "Complete 5 lessons perfectly (no hints, first try)",
        "objective_type": "perfect_lessons",
        "objective_target": 5,
        "reward_xp": 1500,
        "reward_gold": 2000,
        "reward_gems": 50
    },
    {
        "id": "weekly-streak",
        "title": "Consistent Coder",
        "description": "Maintain your streak for 7 days",
        "objective_type": "maintain_streak",
        "objective_target": 7,
        "reward_gold": 1000,
        "reward_gems": 30,
        "reward_item_id": "streak-shield"
    }
]
```

---

## **Shop UI Design**

### **Main Shop Page**

```
┌─────────────────────────────────────────────────────────────────┐
│  🏪 MYSTICAL CODE SHOP                   💰 4,250 | 💎 75      │
├─────────────────────────────────────────────────────────────────┤
│  [Consumables] [Boosts] [Cosmetics] [Utility] [⏰ Limited]     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ⚡ FEATURED ITEMS                                              │
│  ┌────────────────┬────────────────┬────────────────┐          │
│  │ 🧪 XP Potion   │ 🛡️ Streak     │ ⚔️ Weekend    │          │
│  │ +50% XP boost  │ Shield         │ Warrior        │          │
│  │ Next lesson    │ Protect 1 day  │ 3x XP 4hr     │          │
│  │                │                │ Fri-Sun only!  │          │
│  │ 💰 200 gold   │ 💰 500 gold   │ 💰 2000 gold  │          │
│  │ [Buy]          │ [Buy]          │ [Buy]          │          │
│  └────────────────┴────────────────┴────────────────┘          │
│                                                                  │
│  🔥 CONSUMABLES                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 🧪 Minor XP Potion              💰 200  [Buy]  Own: 3 │    │
│  │ ⚗️ XP Potion                    💰 500  [Buy]  Own: 1 │    │
│  │ 🍾 Grand XP Potion              💎 25   [Buy]  Own: 0 │    │
│  │ 🪙 Treasure Hunter's Charm      💰 1000 [Buy]  Own: 0 │    │
│  │ 🛡️ Streak Shield                💰 500  [Buy]  Own: 2 │    │
│  │ 🛡️✨ Eternal Streak Shield      💎 100  [Buy]  Own: 0 │    │
│  │ 📜 Hint Scroll                  💰 150  [Buy]  Own: 5 │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  [View More...]                                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### **Purchase Confirmation Modal**

```
┌─────────────────────────────────────────┐
│  Confirm Purchase                        │
├─────────────────────────────────────────┤
│                                          │
│  🧪 Minor XP Potion                     │
│                                          │
│  +50% XP for your next lesson           │
│                                          │
│  Cost: 💰 200 gold                      │
│  Your balance: 💰 4,250                 │
│  After purchase: 💰 4,050               │
│                                          │
│  Quantity: [1] [5] [10]                 │
│  Total cost: 💰 200                     │
│                                          │
│  [Cancel]          [Buy Now]            │
│                                          │
└─────────────────────────────────────────┘
```

---

## **Inventory UI**

```
┌─────────────────────────────────────────────────────────────────┐
│  🎒 INVENTORY                                                    │
├─────────────────────────────────────────────────────────────────┤
│  [All Items] [Consumables] [Boosts] [Cosmetics] [Utility]      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ⚡ ACTIVE EFFECTS                                              │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 🪙 Treasure Hunter's Charm    ━━━━━━━━░░  18h left    │    │
│  │ +50% gold from all sources                             │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  📦 CONSUMABLES                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 🧪 Minor XP Potion x3                [Use]             │    │
│  │ ⚗️ XP Potion x1                      [Use]             │    │
│  │ 🛡️ Streak Shield x2                 Auto-use           │    │
│  │ 📜 Hint Scroll x5                    [Use]             │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ✨ COSMETICS                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ ⚔️ Warrior Avatar               [Equipped] ✓          │    │
│  │ 🧙 Archmage Avatar              [Equip]               │    │
│  │ 🌲 Dark Forest Theme            [Apply]               │    │
│  │ 🎆 Fireworks Celebration        [Equipped] ✓          │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## **Additional Meaningful Unlocks**

### **Feature Unlocks by Level**

**Level 3:** Chat with AI tutor (limited)
**Level 5:** Cosmetics, medium puzzles
**Level 7:** Weekly quests
**Level 9:** Unlimited AI tutor
**Level 10:** Intermediate courses, hard puzzles
**Level 12:** Create custom challenges
**Level 13:** Compete on leaderboards
**Level 15:** Expert puzzles, C# language
**Level 17:** Mentor lower students
**Level 20:** Advanced courses, create lessons
**Level 22:** Ruby language
**Level 25:** Contribute to puzzle bank
**Level 30:** Prestige system

### **Currency Scaling**

**Early Levels (1-10):**
- Lesson rewards: 50-100 gold
- Abundant feeling, encourage spending
- Easy to buy consumables

**Mid Levels (11-20):**
- Lesson rewards: 100-200 gold
- Balanced economy
- Can save for cosmetics

**High Levels (21-30):**
- Lesson rewards: 200-500 gold
- Saving for premium items
- Gems become more valuable

### **Seasonal Events**

**Halloween (October):**
- Special "Spooky" shop items
- Bonus XP for completing "haunted" challenges
- Limited time cosmetics
- Special quests with higher rewards

**Winter (December):**
- "Frost Festival" event
- Ice/snow themed items
- Bonus gems for streaks
- Gift system (send items to friends)

**Spring (March):**
- "Code Bloom" event
- Growth-themed cosmetics
- XP boost for new courses started
- Plant/nature themes

**Summer (July):**
- "Summer Code Camp"
- Beach/vacation themes
- Relaxed learning bonuses
- Community challenges

---

## **Social & Competitive Features**

### **Guilds/Clans (Level 15+)**
- Create or join guild
- Guild quests (collaborative)
- Guild shop (exclusive items)
- Guild leaderboards
- Guild chat
- Share currency with guild members

### **Trading System (Level 20+)**
- Trade non-consumable items
- Trade currency (limited)
- Gift system
- Auction house for rare items

### **Challenges (Level 12+)**
- Challenge friends to specific puzzles
- Bet gold on outcomes
- Winner takes pool
- Leaderboard for challenge wins

---

## **Monetization (Optional Future)**

If you ever want to monetize (optional):

**Fair Model:**
- Everything earnable through gameplay
- Gem packs for those who want shortcuts
- Cosmetic-only premium purchases
- Ad-free option
- "Support the Developer" bundle

**Never Gate:**
- Educational content
- Core features
- Progress itself
- Competitive advantages

**Can Offer:**
- Cosmetics
- Convenience (more daily quests, faster timers)
- Time savers
- Special events early access

---

## **Implementation Priority**

### **Phase 1: Core Systems**
1. Currency tables and tracking
2. Shop database and items
3. Transaction logging
4. Basic shop UI
5. Purchase flow
6. Inventory system

### **Phase 2: Consumables**
7. XP potions implementation
8. Gold boosters
9. Streak shields (auto-use)
10. Hint scrolls
11. Effect tracking system

### **Phase 3: Progression**
12. Level rewards table
13. Unlock system
14. Feature gating by level
15. Level-up rewards delivery
16. Progress UI updates

### **Phase 4: Quests**
17. Daily quest system
18. Weekly quest system
19. Quest tracking UI
20. Quest completion rewards
21. Quest reset logic

### **Phase 5: Cosmetics**
22. Avatar system
23. Theme system
24. Title system
25. Celebration effects
26. Cosmetic application

### **Phase 6: Polish**
27. Shop animations
28. Purchase confirmations
29. Inventory management
30. Active effects display
31. Economy balancing

---

## **Economy Balance Guidelines**

### **Gold Income vs Expense**

**Daily gold income (active player):**
- 3 lessons: 300 gold
- 2 puzzles: 400 gold
- Daily quests: 600 gold
- Streak bonus: 25 gold
- **Total: ~1,325 gold/day**

**Typical spending:**
- 2 XP potions/week: 400 gold
- 1 streak shield/week: 500 gold
- Saving for cosmetics: Variable
- **Total: ~900 gold/week (129/day)**

**Net positive:** ~1,200 gold/day saved for big purchases

### **Gem Income vs Expense**

**Weekly gem income:**
- Daily quests: 35 gems
- Weekly quests: 45 gems
- Level up (once): 25-50 gems
- **Total: ~80-130 gems/week**

**Typical spending:**
- Save for cosmetics (100-300 gems)
- Occasional premium boost: 25-50 gems
- **Rate:** 1 major cosmetic per 2-4 weeks

**This feels rewarding but encourages smart spending**

---

## **Success Metrics**

Gamification is successful when:
- ✅ Users engage with shop regularly
- ✅ Currency feels valuable but not grindy
- ✅ Level-ups feel meaningful
- ✅ Users excited about next unlock
- ✅ Daily quests drive engagement
- ✅ Cosmetics feel aspirational
- ✅ Economy is balanced (not too easy/hard)
- ✅ Prestige system provides endgame
- ✅ No pay-to-win feeling
- ✅ Progression feels fair

---

This gamification system transforms the learning app into a full RPG experience with meaningful progression, exciting rewards, and reasons to engage daily while maintaining focus on actual learning outcomes.