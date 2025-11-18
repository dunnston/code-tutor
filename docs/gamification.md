Excellent additions! Let me add a comprehensive **Gamification & Engagement** section to the spec:

---

# **Gamification & Engagement Features** (Phase 4+)

## **1. XP & Leveling System**

### **XP Sources**
```typescript
interface XPReward {
    action: string;
    baseXP: number;
    multipliers?: XPMultiplier[];
}

const XP_REWARDS = {
    // Lessons
    COMPLETE_LESSON: 100,
    COMPLETE_LESSON_FIRST_TRY: 150,  // No hints used
    COMPLETE_LESSON_PERFECT: 200,    // No errors, first try
    
    // Practice
    SOLVE_PUZZLE: 50,
    SOLVE_PUZZLE_OPTIMAL: 100,       // Best solution
    
    // Engagement
    DAILY_LOGIN: 10,
    MAINTAIN_STREAK: 25,             // Per day of streak
    CODE_REVIEW: 20,                 // Review own old code
    
    // Social (future)
    HELP_ANOTHER_USER: 75,
    SHARE_SOLUTION: 30,
    
    // Achievements
    UNLOCK_ACHIEVEMENT: 500,
    
    // Bonus
    WEEKEND_CODING: 50,              // 2x on weekends
    EARLY_BIRD: 25,                  // Code before 9am
    NIGHT_OWL: 25,                   // Code after 9pm
};
```

### **Level Progression**
```typescript
interface Level {
    level: number;
    xpRequired: number;
    title: string;
    unlocksFeature?: string;
}

const LEVELS = [
    { level: 1, xpRequired: 0, title: "Novice Coder" },
    { level: 2, xpRequired: 500, title: "Code Apprentice" },
    { level: 3, xpRequired: 1200, title: "Script Writer" },
    { level: 4, xpRequired: 2500, title: "Bug Hunter" },
    { level: 5, xpRequired: 5000, title: "Logic Master", unlocksFeature: "Hard Puzzles" },
    { level: 10, xpRequired: 15000, title: "Code Wizard", unlocksFeature: "Game Mode" },
    { level: 15, xpRequired: 35000, title: "Algorithm Sage" },
    { level: 20, xpRequired: 75000, title: "Programming Legend" },
];
```

**Visual Elements:**
- XP bar at top of screen (fills progressively)
- Level-up animation with confetti 🎉
- Title display next to user name
- XP gain notifications ("+100 XP - Perfect Solution!")

---

## **2. Streak System**

### **Streak Tracking**
```typescript
interface Streak {
    currentStreak: number;      // Days in a row
    longestStreak: number;      // Personal record
    lastActivityDate: Date;
    freezesAvailable: number;   // "Streak Freeze" powerups
}

// Streak rewards
const STREAK_REWARDS = {
    3: { badge: "3-Day Warrior", xpBonus: 100 },
    7: { badge: "Week Master", xpBonus: 300, unlocks: "Streak Freeze" },
    30: { badge: "Monthly Champion", xpBonus: 1000, unlocks: "Golden Theme" },
    100: { badge: "Centurion Coder", xpBonus: 5000, unlocks: "Custom Avatar" },
};
```

**Streak Features:**
- 🔥 Fire emoji with number next to username
- Streak calendar view (green squares like GitHub)
- "Don't break the streak!" reminder notification
- **Streak Freeze:** Use once to maintain streak if you miss a day (earned at 7-day streak)
- Weekend multiplier: 1.5x XP on Sat/Sun to encourage consistency

**UI Display:**
```
┌─────────────────────────────────────┐
│  🔥 12 Day Streak!                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━ 86%     │
│  Keep coding to reach 14 days!      │
│                                      │
│  📅 This Week:                      │
│  M  T  W  T  F  S  S                │
│  ✅ ✅ ✅ ✅ ⬜ ⬜ ⬜              │
└─────────────────────────────────────┘
```

---

## **3. Badges & Achievements**

### **Achievement Categories**

**🎓 Learning Achievements**
```typescript
const LEARNING_BADGES = [
    {
        id: "first_steps",
        name: "First Steps",
        description: "Complete your first lesson",
        icon: "👶",
        xpReward: 100
    },
    {
        id: "variable_master",
        name: "Variable Master",
        description: "Complete all variable lessons",
        icon: "📦",
        xpReward: 300
    },
    {
        id: "loop_legend",
        name: "Loop Legend",
        description: "Write 100 loops",
        icon: "🔁",
        xpReward: 500,
        progress: { current: 0, target: 100 }
    },
    {
        id: "function_guru",
        name: "Function Guru",
        description: "Create 50 functions",
        icon: "⚙️",
        xpReward: 500
    },
    {
        id: "error_crusher",
        name: "Error Crusher",
        description: "Fix 100 errors",
        icon: "🐛",
        xpReward: 750
    },
    {
        id: "track_complete",
        name: "Track Champion",
        description: "Complete an entire learning track",
        icon: "🏆",
        xpReward: 1000
    }
];
```

**⚡ Speed Achievements**
```typescript
const SPEED_BADGES = [
    {
        id: "speed_demon",
        name: "Speed Demon",
        description: "Complete 3 lessons in one day",
        icon: "⚡",
        xpReward: 300
    },
    {
        id: "marathon_coder",
        name: "Marathon Coder",
        description: "Code for 2 hours straight",
        icon: "🏃",
        xpReward: 500
    },
    {
        id: "efficiency_expert",
        name: "Efficiency Expert",
        description: "Complete a lesson in under 5 minutes",
        icon: "⏱️",
        xpReward: 400
    }
];
```

**🎮 Game Mode Achievements**
```typescript
const GAME_BADGES = [
    {
        id: "first_victory",
        name: "First Victory",
        description: "Win your first code game",
        icon: "🎯",
        xpReward: 200
    },
    {
        id: "puzzle_solver",
        name: "Puzzle Solver",
        description: "Complete 10 coding puzzles",
        icon: "🧩",
        xpReward: 500
    },
    {
        id: "algorithm_master",
        name: "Algorithm Master",
        description: "Solve a hard puzzle with optimal solution",
        icon: "🧠",
        xpReward: 1000
    }
];
```

**🌟 Special Achievements**
```typescript
const SPECIAL_BADGES = [
    {
        id: "early_adopter",
        name: "Early Adopter",
        description: "Used the app in its first month",
        icon: "🌱",
        xpReward: 500,
        secret: true  // Not shown until earned
    },
    {
        id: "perfectionist",
        name: "Perfectionist",
        description: "Complete 10 lessons without a single error",
        icon: "💎",
        xpReward: 1500,
        secret: true
    },
    {
        id: "helping_hand",
        name: "Helping Hand",
        description: "Help another user solve a problem",
        icon: "🤝",
        xpReward: 750,
        future: true  // When multiplayer added
    }
];
```

**Badge Display:**
- Badge collection screen (grid view)
- Locked badges shown as silhouettes
- Progress bars for incremental badges
- Badge showcase on profile (display top 3)
- Notification popup when earned

---

## **4. Coding Puzzles**

### **Puzzle Categories**

**🧩 Logic Puzzles**
```python
# Example: FizzBuzz
"""
Write a program that prints numbers 1-100.
- For multiples of 3, print "Fizz"
- For multiples of 5, print "Buzz"  
- For multiples of both, print "FizzBuzz"
"""

# Example: Palindrome Checker
"""
Write a function that checks if a word is a palindrome.
palindrome("racecar") → True
palindrome("hello") → False
"""
```

**🎯 Algorithm Challenges**
```python
# Example: Find Maximum
"""
Write a function that finds the largest number in a list.
find_max([3, 7, 2, 9, 1]) → 9
"""

# Example: Reverse String
"""
Write a function that reverses a string without using [::-1]
reverse("hello") → "olleh"
"""
```

**🎮 Game Challenges**
```python
# Example: Guess the Number
"""
Create a number guessing game where:
- Computer picks random number 1-100
- User has 7 guesses
- Show "Higher" or "Lower" hints
"""

# Example: Rock Paper Scissors
"""
Implement Rock Paper Scissors vs computer:
- Get user choice
- Generate computer choice
- Determine winner
- Play multiple rounds
"""
```

**Puzzle Structure:**
```typescript
interface Puzzle {
    id: string;
    title: string;
    difficulty: "easy" | "medium" | "hard" | "expert";
    category: "logic" | "algorithm" | "game" | "optimization";
    description: string;
    starterCode?: string;
    testCases: TestCase[];
    hints: string[];
    
    // Rewards
    xpReward: number;
    badgeReward?: string;
    
    // Optimization challenge
    optimalSolution?: {
        timeComplexity: string;  // "O(n)"
        spaceComplexity: string; // "O(1)"
        linesOfCode: number;     // For "code golf"
    };
    
    // Leaderboard
    allowLeaderboard: boolean;
    leaderboardMetric: "speed" | "efficiency" | "elegance";
}
```

**Puzzle UI:**
```
┌────────────────────────────────────────────┐
│  🧩 Daily Puzzle Challenge                │
├────────────────────────────────────────────┤
│  Difficulty: ⭐⭐⭐ Medium                 │
│  Category: Algorithm                       │
│  XP Reward: 150 (+50 bonus if optimal)    │
│                                            │
│  Challenge: "Sum of Evens"                 │
│  ─────────────────────────────────         │
│  Write a function that returns the sum    │
│  of all even numbers in a list.           │
│                                            │
│  sum_evens([1,2,3,4,5,6]) → 12           │
│                                            │
│  Test Cases: 5 hidden tests               │
│  ⏱️ Average solve time: 8 minutes         │
│  👥 Solved by: 342 users                  │
│                                            │
│  [Start Puzzle]  [View Leaderboard]       │
└────────────────────────────────────────────┘
```

---

## **5. Game Mode** 🎮

### **Concept: Code to Play**

Users write code that controls game characters/actions in real-time.

### **Game Mode Examples**

**Game 1: Code Quest (RPG Style)**
```python
# User writes code to control hero
class Hero:
    def explore_dungeon(self):
        # User fills this in
        if self.see_enemy():
            self.attack()
        elif self.health < 30:
            self.heal()
        else:
            self.move_forward()

# Game simulates dungeon run with user's code
```

**Visual:**
- 2D sprite hero moving through dungeon
- Real-time execution showing decisions
- Score based on: gold collected, enemies defeated, health remaining

**Game 2: Code Racer**
```python
# Control a car through obstacles
def drive(car, obstacles):
    # User writes driving logic
    if obstacles.ahead():
        car.turn_left()
    elif car.speed < 50:
        car.accelerate()
    else:
        car.maintain_speed()
```

**Visual:**
- Top-down racing track
- User's code vs AI opponents
- Leaderboard for fastest times

**Game 3: Robot Builder**
```python
# Build and program a robot
class Robot:
    def __init__(self):
        self.parts = []
    
    def scan_environment(self):
        # User programs robot behavior
        pass
    
    def take_action(self):
        # User decides what robot does
        pass
```

**Visual:**
- Grid world with resources/obstacles
- Robot collects items based on user's code
- Different challenges (maze, collection, defense)

**Game 4: Code Combat (Multiplayer Future)**
```python
# Write AI for combat units
class Fighter:
    def choose_action(self, enemy):
        # User programs combat strategy
        if self.health > enemy.health:
            return self.aggressive_attack()
        else:
            return self.defensive_move()
```

**Visual:**
- Turn-based combat visualization
- User's code vs other users' code
- ELO ranking system

### **Game Mode Features**

```typescript
interface GameMode {
    id: string;
    title: string;
    description: string;
    difficulty: number;
    
    // Game settings
    gameType: "simulation" | "puzzle" | "competitive";
    starterCode: string;
    allowedFunctions: string[];  // Limit available functions
    
    // Scoring
    objectives: GameObjective[];
    leaderboard: boolean;
    
    // Rewards
    xpBase: number;
    xpPerObjective: number;
    unlockBadge?: string;
}

interface GameObjective {
    id: string;
    description: string;
    points: number;
    required: boolean;  // Must complete to win
}
```

**Game Mode UI:**
```
┌─────────────────────────────────────────────────────┐
│  🎮 GAME MODE: Robot Maze                          │
├──────────────────────┬──────────────────────────────┤
│  CODE EDITOR         │   GAME WORLD                 │
│                      │                              │
│  class Robot:        │   ┌────────────────┐        │
│    def move(self):   │   │ R ░░░ ⭐️ ░░░ │        │
│      if wall_ahead:  │   │ ░ ██ ░ ██ ░░░ │        │
│        turn_left()   │   │ ░░░░░ ██ ⭐️ ░ │        │
│      else:           │   │ ██ ░░░░░░░░░░ │        │
│        forward()     │   │ ░░ ██ ⭐️ ██ E │        │
│                      │   └────────────────┘        │
│  [▶️ Run Game]      │                              │
│  [⏸️ Pause]         │   Score: 150                │
│  [🔄 Reset]         │   Stars: 2/3 ⭐⭐⚫       │
│                      │   Time: 18.5s               │
├──────────────────────┴──────────────────────────────┤
│  Objectives:                                        │
│  ✅ Reach the exit                                 │
│  ✅ Collect 2 stars                                │
│  ⬜ Complete in under 15 seconds                   │
└─────────────────────────────────────────────────────┘
```

---

## **6. Rewards & Unlockables**

### **Cosmetic Rewards**
```typescript
interface Cosmetics {
    // Themes
    themes: [
        { id: "dark", name: "Dark Mode", unlockLevel: 1 },
        { id: "synthwave", name: "Synthwave", unlockLevel: 5, xpCost: 1000 },
        { id: "forest", name: "Forest", unlockLevel: 10, xpCost: 2000 },
        { id: "golden", name: "Golden", unlockedBy: "30_day_streak" },
    ],
    
    // Avatars
    avatars: [
        { id: "default", name: "Default", unlockLevel: 1 },
        { id: "ninja", name: "Code Ninja", unlockLevel: 8 },
        { id: "wizard", name: "Code Wizard", unlockLevel: 15 },
        { id: "robot", name: "Robot", earnedBy: "complete_robot_game" },
    ],
    
    // Editor themes
    editorThemes: [
        { id: "vscode_dark", name: "VS Code Dark", unlockLevel: 1 },
        { id: "monokai", name: "Monokai", unlockLevel: 5 },
        { id: "dracula", name: "Dracula", unlockLevel: 10 },
    ],
    
    // Celebration effects
    celebrationEffects: [
        { id: "confetti", name: "Confetti", unlockLevel: 1 },
        { id: "fireworks", name: "Fireworks", unlockLevel: 12 },
        { id: "sparkles", name: "Sparkles", earnedBy: "perfectionist_badge" },
    ],
}
```

### **Functional Unlocks**
```typescript
interface FeatureUnlocks {
    unlocks: [
        {
            feature: "hints_unlimited",
            name: "Unlimited Hints",
            unlockedAt: "level_3",
            description: "Remove hint cooldown timer"
        },
        {
            feature: "code_templates",
            name: "Code Templates",
            unlockedAt: "level_5",
            description: "Access pre-built code snippets"
        },
        {
            feature: "hard_puzzles",
            name: "Hard Puzzles",
            unlockedAt: "level_5",
            description: "Unlock challenging puzzles"
        },
        {
            feature: "game_mode",
            name: "Game Mode",
            unlockedAt: "level_10",
            description: "Play coding games"
        },
        {
            feature: "custom_challenges",
            name: "Create Challenges",
            unlockedAt: "level_15",
            description: "Design your own puzzles"
        },
    ]
}
```

### **In-App Currency** (Optional)
```typescript
interface Currency {
    name: "Code Coins";
    earnedFrom: [
        "daily_login",      // 10 coins
        "complete_lesson",  // 50 coins
        "solve_puzzle",     // 30 coins
        "maintain_streak",  // 25 coins/day
    ];
    
    spendOn: [
        { item: "hint", cost: 20, description: "Get a hint without cooldown" },
        { item: "solution_peek", cost: 100, description: "See solution for stuck lesson" },
        { item: "streak_freeze", cost: 200, description: "Protect your streak" },
        { item: "cosmetic_item", cost: 500, description: "Unlock special theme" },
        { item: "skip_lesson", cost: 300, description: "Skip a lesson (not recommended!)" },
    ];
}
```

---

## **7. Social & Competition** (Future Phase)

### **Leaderboards**
```typescript
interface Leaderboard {
    type: "global" | "friends" | "weekly" | "monthly";
    metric: "xp" | "streak" | "puzzles_solved" | "speed";
    
    // Different boards
    boards: [
        { name: "Top Coders", sortBy: "total_xp" },
        { name: "Speed Demons", sortBy: "lessons_per_hour" },
        { name: "Puzzle Masters", sortBy: "puzzles_solved" },
        { name: "Streak Champions", sortBy: "current_streak" },
        { name: "This Week", sortBy: "weekly_xp", resetWeekly: true },
    ];
}
```

### **Challenge Friends** (Future)
- Send coding challenges to other users
- Head-to-head puzzle solving races
- Collaborative problem solving
- Code review and feedback

### **Community Features** (Future)
- Share solutions (with spoiler warnings)
- Upvote elegant code
- Comment on approaches
- Create and share custom puzzles

---

## **8. Daily/Weekly Quests**

### **Quest System**
```typescript
interface Quest {
    id: string;
    type: "daily" | "weekly" | "special";
    title: string;
    description: string;
    objectives: QuestObjective[];
    rewards: QuestReward[];
    expiresAt: Date;
}

// Example Daily Quests
const DAILY_QUESTS = [
    {
        id: "daily_coder",
        title: "Daily Coder",
        description: "Complete any lesson today",
        objectives: [{ type: "complete_lesson", target: 1 }],
        rewards: [{ type: "xp", amount: 100 }, { type: "coins", amount: 50 }]
    },
    {
        id: "bug_hunter",
        title: "Bug Hunter",
        description: "Fix 3 errors in your code",
        objectives: [{ type: "fix_errors", target: 3 }],
        rewards: [{ type: "xp", amount: 75 }]
    },
    {
        id: "speed_run",
        title: "Speed Runner",
        description: "Complete a lesson in under 10 minutes",
        objectives: [{ type: "lesson_speed", maxTime: 600 }],
        rewards: [{ type: "xp", amount: 150 }, { type: "badge", id: "speed_demon" }]
    }
];

// Example Weekly Quests
const WEEKLY_QUESTS = [
    {
        id: "weekly_warrior",
        title: "Weekly Warrior",
        description: "Complete 10 lessons this week",
        objectives: [{ type: "complete_lesson", target: 10 }],
        rewards: [{ type: "xp", amount: 1000 }, { type: "coins", amount: 500 }]
    },
    {
        id: "puzzle_master",
        title: "Puzzle Master",
        description: "Solve 5 coding puzzles",
        objectives: [{ type: "solve_puzzle", target: 5 }],
        rewards: [{ type: "xp", amount: 750 }, { type: "unlock", feature: "hard_puzzles" }]
    }
];
```

**Quest UI:**
```
┌──────────────────────────────────────┐
│  📋 Daily Quests (Resets in 6h)     │
├──────────────────────────────────────┤
│  ✅ Daily Coder                     │
│     Complete any lesson              │
│     Reward: 100 XP, 50 Coins         │
│                                      │
│  ⬜ Bug Hunter (1/3)                │
│     Fix 3 errors                     │
│     ━━━━━━░░░░░░░░░░░░░░ 33%       │
│     Reward: 75 XP                    │
│                                      │
│  ⬜ Speed Runner                    │
│     Complete lesson < 10 min         │
│     Reward: 150 XP, Badge            │
└──────────────────────────────────────┘
```

---

## **9. Progress Visualization**

### **Dashboard Stats**
```typescript
interface DashboardStats {
    // Overall Progress
    totalXP: number;
    currentLevel: number;
    xpToNextLevel: number;
    
    // Engagement
    currentStreak: number;
    longestStreak: number;
    totalCodingTime: number;  // Minutes
    lastActivityDate: Date;
    
    // Achievements
    badgesEarned: number;
    totalBadges: number;
    
    // Learning
    lessonsCompleted: number;
    totalLessons: number;
    tracksCompleted: string[];
    
    // Challenges
    puzzlesSolved: number;
    gamesWon: number;
    
    // This Week
    weeklyXP: number;
    weeklyLessons: number;
    weeklyPuzzles: number;
    
    // Fun Stats
    linesOfCode: number;
    errorsFixed: number;
    hintsUsed: number;
    perfectSolutions: number;
}
```

**Dashboard UI:**
```
┌───────────────────────────────────────────────────────────┐
│  Ryan - Level 8 Code Wizard                    🔥 12 Days │
│  ━━━━━━━━━━━━━━━━━━━━━░░░░░░ 4,250 / 5,000 XP         │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  📊 Your Stats                                           │
│  ┌──────────────┬──────────────┬──────────────┐        │
│  │ Lessons      │ Puzzles      │ Games Won    │        │
│  │ 42 / 60      │ 18 solved    │ 5 victories  │        │
│  │ ━━━━━━ 70%   │ ⭐⭐⭐       │ 🏆          │        │
│  └──────────────┴──────────────┴──────────────┘        │
│                                                           │
│  🏅 Recent Achievements                                  │
│  ┌───────────────────────────────────────────┐         │
│  │ 💎 Perfectionist (Yesterday)              │         │
│  │ ⚡ Speed Demon (2 days ago)               │         │
│  │ 🔁 Loop Legend (1 week ago)               │         │
│  └───────────────────────────────────────────┘         │
│                                                           │
│  📈 This Week                                            │
│  Mon Tue Wed Thu Fri Sat Sun                            │
│  250 180 300 220 0   0   0  XP                          │
│  ▓▓▓ ▓▓▒ ▓▓▓ ▓▓▒ ░░░ ░░░ ░░░                           │
│                                                           │
│  🎯 Daily Quest Progress                                │
│  ✅ Complete 1 lesson (100 XP)                          │
│  ⬜ Solve a puzzle (0/1)                                │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

---

## **10. Notifications & Reminders**

### **Smart Notifications**
```typescript
interface Notification {
    type: "streak" | "achievement" | "quest" | "encouragement";
    title: string;
    message: string;
    action?: string;
    timing: "immediate" | "scheduled";
}

const NOTIFICATION_TYPES = [
    // Streak protection
    {
        type: "streak",
        title: "Don't break your streak! 🔥",
        message: "You haven't coded today. Keep your 12-day streak alive!",
        timing: "8pm if no activity",
    },
    
    // Achievement unlock
    {
        type: "achievement",
        title: "New Badge Unlocked! 🏅",
        message: "You earned 'Loop Legend'! +500 XP",
        timing: "immediate",
        action: "View Badge"
    },
    
    // Quest reminder
    {
        type: "quest",
        title: "Daily Quest Available 📋",
        message: "New challenges await! Earn bonus XP today.",
        timing: "9am daily",
        action: "View Quests"
    },
    
    // Level up
    {
        type: "level_up",
        title: "Level Up! 🎉",
        message: "You're now Level 9! New features unlocked.",
        timing: "immediate",
        action: "See Rewards"
    },
    
    // Encouragement
    {
        type: "encouragement",
        title: "Keep going! 💪",
        message: "You're 70% through Python Basics!",
        timing: "after 3 days inactive",
        action: "Continue Learning"
    },
    
    // Competition
    {
        type: "leaderboard",
        title: "You moved up! 📈",
        message: "You're now #8 on the weekly leaderboard!",
        timing: "immediate"
    }
];
```

---

## **Database Schema Updates**

Add these tables for gamification:

```sql
-- XP and levels
CREATE TABLE user_xp (
    user_id INTEGER PRIMARY KEY,
    total_xp INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Streaks
CREATE TABLE user_streaks (
    user_id INTEGER PRIMARY KEY,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    freeze_uses_remaining INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Badges/Achievements
CREATE TABLE badges (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    xp_reward INTEGER,
    secret BOOLEAN DEFAULT FALSE,
    category TEXT  -- 'learning', 'speed', 'game', 'special'
);

CREATE TABLE user_badges (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    badge_id TEXT,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (badge_id) REFERENCES badges(id)
);

-- Puzzles
CREATE TABLE puzzles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    difficulty TEXT,  -- 'easy', 'medium', 'hard', 'expert'
    category TEXT,
    description TEXT,
    starter_code TEXT,
    test_cases TEXT,  -- JSON
    hints TEXT,  -- JSON array
    xp_reward INTEGER,
    optimal_solution TEXT  -- JSON with metrics
);

CREATE TABLE user_puzzle_progress (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    puzzle_id TEXT,
    solved BOOLEAN DEFAULT FALSE,
    attempts INTEGER DEFAULT 0,
    best_time INTEGER,  -- Seconds
    solution_code TEXT,
    solved_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (puzzle_id) REFERENCES puzzles(id)
);

-- Games
CREATE TABLE games (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    game_type TEXT,
    difficulty INTEGER,
    starter_code TEXT,
    objectives TEXT,  -- JSON
    xp_reward INTEGER
);

CREATE TABLE user_game_scores (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    game_id TEXT,
    score INTEGER,
    completed BOOLEAN,
    play_time INTEGER,  -- Seconds
    played_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (game_id) REFERENCES games(id)
);

-- Quests
CREATE TABLE quests (
    id TEXT PRIMARY KEY,
    type TEXT,  -- 'daily', 'weekly', 'special'
    title TEXT NOT NULL,
    description TEXT,
    objectives TEXT,  -- JSON
    rewards TEXT,  -- JSON
    start_date DATE,
    end_date DATE
);

CREATE TABLE user_quest_progress (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    quest_id TEXT,
    progress TEXT,  -- JSON with objective progress
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (quest_id) REFERENCES quests(id)
);

-- XP transactions log
CREATE TABLE xp_transactions (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    amount INTEGER,
    reason TEXT,  -- 'lesson_complete', 'puzzle_solve', 'badge_earn', etc.
    reference_id TEXT,  -- ID of lesson/puzzle/badge
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Stats tracking
CREATE TABLE user_stats (
    user_id INTEGER PRIMARY KEY,
    total_coding_time INTEGER DEFAULT 0,  -- Minutes
    lines_of_code INTEGER DEFAULT 0,
    errors_fixed INTEGER DEFAULT 0,
    hints_used INTEGER DEFAULT 0,
    perfect_solutions INTEGER DEFAULT 0,
    last_updated TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## **Implementation Priority**

### **Phase 4A: Basic Gamification**
1. XP and leveling system
2. Basic achievements (first 10 badges)
3. Streak tracking
4. Progress dashboard

### **Phase 4B: Puzzles**
1. Puzzle database and UI
2. First 20 puzzles (easy/medium)
3. Puzzle validation system
4. Leaderboards

### **Phase 4C: Game Mode**
1. First simple game (Robot Maze)
2. Game execution engine
3. Visualization
4. Game objectives tracking

### **Phase 4D: Advanced Features**
1. Daily/weekly quests
2. More badges (30+ total)
3. Unlockable cosmetics
4. Social features

---

This should give you a complete gamification system that will keep your kids (and you!) engaged for months! The progression is designed to:

1. **Hook early** - Quick wins, easy badges, visible progress
2. **Build habits** - Streaks, daily quests, notifications
3. **Maintain interest** - Puzzles, games, new unlocks
4. **Long-term engagement** - Leaderboards, achievements, mastery
