-- Playground Templates Seed Data
-- Beginner, Intermediate, and Advanced templates for all languages

-- ============================================================================
-- PYTHON TEMPLATES
-- ============================================================================

-- Beginner Templates
INSERT INTO playground_templates (id, name, description, language_id, category, code, difficulty, tags, icon, is_featured, order_index) VALUES
('hello-world-py', 'Hello World', 'The classic first program', 'python', 'basics', '# Welcome to the playground!
# Try changing the message below

name = "Adventurer"
print(f"Hello, {name}!")
print("Start coding anything you want!")', 'beginner', '["basics", "starter"]', '👋', TRUE, 1),

('simple-calculator-py', 'Simple Calculator', 'Basic calculator to expand on', 'python', 'utility', 'def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    if b == 0:
        return "Error: Division by zero"
    return a / b

# Try it out!
print(f"5 + 3 = {add(5, 3)}")
print(f"10 - 4 = {subtract(10, 4)}")
print(f"6 * 7 = {multiply(6, 7)}")
print(f"20 / 4 = {divide(20, 4)}")', 'beginner', '["utility", "math"]', '🧮', TRUE, 2),

('character-stats-py', 'RPG Character Stats', 'Create and manage a character', 'python', 'game', 'character = {
    ''name'': ''Hero'',
    ''level'': 1,
    ''health'': 100,
    ''mana'': 50,
    ''gold'': 0,
    ''strength'': 10,
    ''intelligence'': 8
}

def display_character(char):
    print(f"\n=== {char[''name'']} - Level {char[''level'']} ===")
    print(f"HP: {char[''health'']} | Mana: {char[''mana'']}")
    print(f"STR: {char[''strength'']} | INT: {char[''intelligence'']}")
    print(f"Gold: {char[''gold'']} coins")

def level_up(char):
    char[''level''] += 1
    char[''health''] += 10
    char[''mana''] += 5
    char[''strength''] += 2
    char[''intelligence''] += 1
    print(f"\n🎉 Level Up! {char[''name'']} is now level {char[''level'']}!")

display_character(character)
level_up(character)
display_character(character)', 'beginner', '["game", "rpg"]', '⚔️', TRUE, 3);

-- Intermediate Templates
INSERT INTO playground_templates (id, name, description, language_id, category, code, difficulty, tags, icon, is_featured, order_index) VALUES
('text-adventure-py', 'Text Adventure Game', 'Simple room-based adventure', 'python', 'game', '# Text Adventure Framework

rooms = {
    ''entrance'': {
        ''description'': ''You are at the dungeon entrance. Torches light the way.'',
        ''exits'': {''north'': ''hallway''},
        ''items'': [''torch'']
    },
    ''hallway'': {
        ''description'': ''A long, dark hallway stretches before you.'',
        ''exits'': {''south'': ''entrance'', ''east'': ''treasure'', ''west'': ''armory''},
        ''items'': []
    },
    ''treasure'': {
        ''description'': ''A room filled with glittering gold and jewels!'',
        ''exits'': {''west'': ''hallway''},
        ''items'': [''gold'', ''ruby'']
    },
    ''armory'': {
        ''description'': ''Weapons and armor line the walls.'',
        ''exits'': {''east'': ''hallway''},
        ''items'': [''sword'', ''shield'']
    }
}

current_room = ''entrance''
inventory = []

def look():
    room = rooms[current_room]
    print(f"\n{room[''description'']}")
    if room[''items'']:
        print(f"You see: {", ".join(room[''items''])}")
    print(f"Exits: {", ".join(room[''exits''].keys())}")

def move(direction):
    global current_room
    room = rooms[current_room]
    if direction in room[''exits'']:
        current_room = room[''exits''][direction]
        look()
    else:
        print("You can''t go that way!")

def take(item):
    room = rooms[current_room]
    if item in room[''items'']:
        room[''items''].remove(item)
        inventory.append(item)
        print(f"You took the {item}.")
    else:
        print(f"There''s no {item} here.")

# Start game
print("=== DUNGEON ADVENTURE ===")
look()

# Example commands:
# move(''north'')
# take(''torch'')
# print(f"Inventory: {inventory}")', 'intermediate', '["game", "adventure"]', '🗺️', TRUE, 4),

('inventory-system-py', 'Inventory Management', 'Full inventory with weight limits', 'python', 'game', 'class Inventory:
    def __init__(self, max_weight=100):
        self.items = []
        self.max_weight = max_weight

    def add_item(self, name, weight, quantity=1):
        """Add item to inventory"""
        if self.current_weight() + (weight * quantity) <= self.max_weight:
            # Check if item already exists
            for item in self.items:
                if item[''name''] == name:
                    item[''quantity''] += quantity
                    print(f"Added {quantity}x {name}")
                    return True

            # Add new item
            self.items.append({
                ''name'': name,
                ''weight'': weight,
                ''quantity'': quantity
            })
            print(f"Added {quantity}x {name}")
            return True
        else:
            print(f"Not enough space! Need {weight * quantity} kg, only {self.max_weight - self.current_weight()} kg available.")
            return False

    def remove_item(self, name, quantity=1):
        """Remove item from inventory"""
        for item in self.items:
            if item[''name''] == name:
                if item[''quantity''] >= quantity:
                    item[''quantity''] -= quantity
                    if item[''quantity''] == 0:
                        self.items.remove(item)
                    print(f"Removed {quantity}x {name}")
                    return True
                else:
                    print(f"Not enough {name}! Only have {item[''quantity'']}.")
                    return False
        print(f"{name} not in inventory.")
        return False

    def current_weight(self):
        """Calculate total weight"""
        return sum(item[''weight''] * item[''quantity''] for item in self.items)

    def show(self):
        """Display inventory"""
        print(f"\n=== INVENTORY ({self.current_weight()}/{self.max_weight} kg) ===")
        if not self.items:
            print("  (empty)")
        else:
            for item in sorted(self.items, key=lambda x: x[''name'']):
                total_weight = item[''weight''] * item[''quantity'']
                print(f"  • {item[''name'']} x{item[''quantity'']} ({total_weight} kg)")

# Try it out!
inv = Inventory(max_weight=50)
inv.add_item(''Sword'', 10)
inv.add_item(''Health Potion'', 2, 3)
inv.add_item(''Gold Coin'', 0.1, 100)
inv.add_item(''Shield'', 15)
inv.show()
inv.remove_item(''Health Potion'', 1)
inv.show()', 'intermediate', '["game", "inventory"]', '🎒', TRUE, 5),

('combat-simulator-py', 'Combat Simulator', 'Turn-based battle system', 'python', 'game', 'import random

class Character:
    def __init__(self, name, health, attack, defense):
        self.name = name
        self.max_health = health
        self.health = health
        self.attack = attack
        self.defense = defense
        self.is_defending = False

    def attack_enemy(self, enemy):
        """Attack an enemy"""
        damage = random.randint(self.attack - 3, self.attack + 3)

        # Apply enemy defense
        if enemy.is_defending:
            damage = max(1, damage - enemy.defense * 2)
            print(f"💢 {enemy.name} is defending!")
        else:
            damage = max(1, damage - enemy.defense)

        enemy.health -= damage
        print(f"⚔️  {self.name} attacks {enemy.name} for {damage} damage!")

        self.is_defending = False

    def defend(self):
        """Raise defense for next turn"""
        self.is_defending = True
        print(f"🛡️  {self.name} raises their shield!")

    def heal(self, amount):
        """Heal health"""
        old_health = self.health
        self.health = min(self.max_health, self.health + amount)
        healed = self.health - old_health
        print(f"💚 {self.name} heals for {healed} HP!")
        self.is_defending = False

    def is_alive(self):
        """Check if character is alive"""
        return self.health > 0

    def status(self):
        """Show health bar"""
        bar_length = 20
        filled = int((self.health / self.max_health) * bar_length)
        bar = ''█'' * filled + ''░'' * (bar_length - filled)
        return f"{self.name:12} [{bar}] {self.health}/{self.max_health} HP"

# Create fighters
player = Character("Hero", 100, 20, 5)
enemy = Character("Goblin", 60, 15, 3)

print("=== BATTLE START ===\n")

# Battle loop
turn = 1
while player.is_alive() and enemy.is_alive():
    print(f"--- Turn {turn} ---")
    print(player.status())
    print(enemy.status())
    print()

    # Player turn
    player.attack_enemy(enemy)

    # Enemy turn (if alive)
    if enemy.is_alive():
        # Simple AI
        if enemy.health < 20 and random.random() < 0.3:
            enemy.heal(15)
        elif random.random() < 0.2:
            enemy.defend()
        else:
            enemy.attack_enemy(player)

    print()
    turn += 1

# Battle result
print("=== BATTLE END ===")
winner = player if player.is_alive() else enemy
print(f"🏆 {winner.name} wins!")
if player.is_alive():
    print(player.status())', 'intermediate', '["game", "combat", "rpg"]', '⚔️', TRUE, 6);

-- Advanced Templates
INSERT INTO playground_templates (id, name, description, language_id, category, code, difficulty, tags, icon, is_featured, order_index) VALUES
('data-visualizer-py', 'Data Visualizer', 'Process and display data with ASCII charts', 'python', 'utility', '# Data Analysis Template

student_scores = [
    {''name'': ''Alice'', ''score'': 95, ''subject'': ''Math''},
    {''name'': ''Bob'', ''score'': 87, ''subject'': ''Math''},
    {''name'': ''Charlie'', ''score'': 92, ''subject'': ''Math''},
    {''name'': ''Diana'', ''score'': 78, ''subject'': ''Math''},
    {''name'': ''Eve'', ''score'': 88, ''subject'': ''Math''}
]

def analyze_scores(scores):
    """Analyze and visualize score data"""
    total = sum(s[''score''] for s in scores)
    average = total / len(scores)
    highest = max(scores, key=lambda x: x[''score''])
    lowest = min(scores, key=lambda x: x[''score''])

    print("=== SCORE ANALYSIS ===\n")
    print(f"Total Students: {len(scores)}")
    print(f"Average Score:  {average:.2f}")
    print(f"Highest:        {highest[''name'']} ({highest[''score'']})")
    print(f"Lowest:         {lowest[''name'']} ({lowest[''score'']})")

    # Grade distribution
    grades = {''A'': 0, ''B'': 0, ''C'': 0, ''D'': 0, ''F'': 0}
    for s in scores:
        if s[''score''] >= 90: grades[''A''] += 1
        elif s[''score''] >= 80: grades[''B''] += 1
        elif s[''score''] >= 70: grades[''C''] += 1
        elif s[''score''] >= 60: grades[''D''] += 1
        else: grades[''F''] += 1

    print("\n=== GRADE DISTRIBUTION ===")
    for grade, count in grades.items():
        bar = ''█'' * count + ''░'' * (len(scores) - count)
        print(f"{grade}: [{bar}] {count}")

    # ASCII bar chart
    print("\n=== SCORE CHART ===")
    for student in sorted(scores, key=lambda x: x[''score''], reverse=True):
        bar = ''█'' * (student[''score''] // 5)
        print(f"{student[''name'']:10} {bar} {student[''score'']}")

analyze_scores(student_scores)

# Try adding more data or analysis!', 'advanced', '["data", "visualization"]', '📊', TRUE, 7),

('state-machine-py', 'State Machine', 'Game state management pattern', 'python', 'game', '# State Machine Pattern for Games

class State:
    """Base state class"""
    def enter(self):
        pass

    def update(self):
        pass

    def exit(self):
        pass

class MenuState(State):
    def enter(self):
        print("\\n=== MAIN MENU ===")
        print("1. Start Game")
        print("2. Options")
        print("3. Exit")

    def update(self):
        choice = input("Choose: ")
        if choice == ''1'':
            return ''playing''
        elif choice == ''2'':
            return ''options''
        elif choice == ''3'':
            return ''exit''
        else:
            print("Invalid choice!")
        return ''menu''

class PlayingState(State):
    def __init__(self):
        self.score = 0

    def enter(self):
        print("\\n=== GAME STARTED ===")
        print("Type ''menu'' to return to menu")
        print("Type ''score'' to see your score")
        print("Type any action to play!")
        self.score = 0

    def update(self):
        action = input("> ").lower()

        if action == ''menu'':
            return ''menu''
        elif action == ''score'':
            print(f"Score: {self.score}")
        else:
            self.score += 10
            print(f"You did: {action} (+10 points)")

        return ''playing''

    def exit(self):
        print(f"\\nFinal Score: {self.score}")

class OptionsState(State):
    def enter(self):
        print("\\n=== OPTIONS ===")
        print("1. Sound: ON")
        print("2. Difficulty: Normal")
        print("3. Back to Menu")

    def update(self):
        choice = input("Choose: ")
        if choice == ''3'':
            return ''menu''
        else:
            print("Option changed! (not really)")
        return ''options''

class StateMachine:
    """Manages game states"""
    def __init__(self):
        self.states = {
            ''menu'': MenuState(),
            ''playing'': PlayingState(),
            ''options'': OptionsState()
        }
        self.current = ''menu''

    def run(self):
        """Main game loop"""
        self.states[self.current].enter()

        while self.current != ''exit'':
            next_state = self.states[self.current].update()

            if next_state != self.current:
                self.states[self.current].exit()
                self.current = next_state

                if self.current != ''exit'':
                    self.states[self.current].enter()

        print("\\nThanks for playing!")

# Run the game
game = StateMachine()
# Uncomment to run:
# game.run()', 'advanced', '["game", "pattern", "architecture"]', '🎮', TRUE, 8);

-- ============================================================================
-- PLAYGROUND SNIPPETS (Reusable Code Blocks)
-- ============================================================================

-- Game Snippets
INSERT INTO playground_snippets (id, user_id, name, description, language_id, category, code, use_count) VALUES
('dice-roller-py', NULL, 'Roll Dice', 'Roll N-sided dice', 'python', 'game', 'import random

def roll_dice(sides=6, count=1):
    """Roll dice and return results"""
    rolls = [random.randint(1, sides) for _ in range(count)]
    return rolls

# Usage: roll_dice(20, 2)  # Roll 2 d20s', 0),

('health-bar-py', NULL, 'ASCII Health Bar', 'Visual health bar display', 'python', 'game', 'def health_bar(current, maximum, width=20):
    """Display ASCII health bar"""
    filled = int((current / maximum) * width)
    bar = ''█'' * filled + ''░'' * (width - filled)
    percentage = int((current / maximum) * 100)
    return f"[{bar}] {current}/{maximum} ({percentage}%)"

# Usage: print(health_bar(75, 100))', 0),

('damage-calculator-py', NULL, 'Damage Calculator', 'Calculate damage with variance', 'python', 'game', 'import random

def calculate_damage(base_damage, attack, defense, crit_chance=0.1):
    """Calculate damage with critical hits"""
    # Variance: ±20%
    variance = random.uniform(0.8, 1.2)
    damage = (base_damage + attack - defense) * variance

    # Critical hit
    is_crit = random.random() < crit_chance
    if is_crit:
        damage *= 2
        return int(damage), True

    return int(max(1, damage)), False

# Usage: dmg, crit = calculate_damage(20, 15, 5)', 0),

('random-item-py', NULL, 'Random Item Generator', 'Generate random items with rarity', 'python', 'game', 'import random

def generate_item():
    """Generate random item with rarity"""
    rarities = [
        (''Common'', 0.50),
        (''Uncommon'', 0.30),
        (''Rare'', 0.15),
        (''Epic'', 0.04),
        (''Legendary'', 0.01)
    ]

    roll = random.random()
    cumulative = 0
    for rarity, chance in rarities:
        cumulative += chance
        if roll <= cumulative:
            break

    items = {
        ''Common'': [''Stick'', ''Rock'', ''Cloth''],
        ''Uncommon'': [''Iron Sword'', ''Leather Armor''],
        ''Rare'': [''Steel Sword'', ''Chainmail''],
        ''Epic'': [''Enchanted Blade'', ''Dragon Scale''],
        ''Legendary'': [''Excalibur'', ''Godly Armor'']
    }

    item = random.choice(items[rarity])
    return f"{rarity} {item}"

# Usage: print(generate_item())', 0);

-- Utility Snippets
INSERT INTO playground_snippets (id, user_id, name, description, language_id, category, code, use_count) VALUES
('input-validator-py', NULL, 'Number Input Validator', 'Get valid number from user', 'python', 'utility', 'def get_number(prompt, min_val=None, max_val=None):
    """Get valid number input from user"""
    while True:
        try:
            num = int(input(prompt))
            if min_val is not None and num < min_val:
                print(f"Must be at least {min_val}")
                continue
            if max_val is not None and num > max_val:
                print(f"Must be at most {max_val}")
                continue
            return num
        except ValueError:
            print("Please enter a valid number")

# Usage: age = get_number("Enter age: ", 1, 120)', 0),

('timer-decorator-py', NULL, 'Function Timer', 'Measure function execution time', 'python', 'utility', 'import time
from functools import wraps

def timer(func):
    """Decorator to time function execution"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.4f}s")
        return result
    return wrapper

# Usage:
# @timer
# def my_function():
#     pass', 0),

('pretty-print-py', NULL, 'Pretty Print Data', 'Format dictionaries nicely', 'python', 'utility', 'def pretty_print(data, indent=0):
    """Pretty print nested dictionaries and lists"""
    spacing = "  " * indent

    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, (dict, list)):
                print(f"{spacing}{key}:")
                pretty_print(value, indent + 1)
            else:
                print(f"{spacing}{key}: {value}")
    elif isinstance(data, list):
        for item in data:
            if isinstance(item, (dict, list)):
                pretty_print(item, indent)
            else:
                print(f"{spacing}- {item}")
    else:
        print(f"{spacing}{data}")

# Usage: pretty_print(my_dict)', 0),

('menu-system-py', NULL, 'Menu System', 'Create interactive menus', 'python', 'utility', 'def menu(title, options):
    """Display menu and get user choice"""
    print(f"\\n=== {title} ===")
    for i, option in enumerate(options, 1):
        print(f"{i}. {option}")

    while True:
        try:
            choice = int(input("Choose: "))
            if 1 <= choice <= len(options):
                return choice - 1
            else:
                print(f"Please choose 1-{len(options)}")
        except ValueError:
            print("Please enter a number")

# Usage:
# choice = menu("Main Menu", ["Start", "Options", "Exit"])
# print(f"You chose: {choice}")', 0);

-- ============================================================================
-- PLAYGROUND ACHIEVEMENTS
-- ============================================================================

INSERT INTO playground_achievements (id, name, description, icon, requirement_type, requirement_value, xp_reward, gold_reward) VALUES
('first-playground', 'Sandbox Explorer', 'Create your first playground project', '🏖️', 'count', 1, 100, 100),
('10-projects', 'Prolific Creator', 'Create 10 playground projects', '🎨', 'count', 10, 500, 500),
('100-lines', 'Century Coder', 'Write 100 lines in a single project', '📜', 'lines', 100, 200, 200),
('first-fork', 'Code Remixer', 'Fork someone else''s project', '🔀', 'fork', 1, 150, 150),
('popular-project', 'Community Favorite', 'Get 50 likes on a project', '⭐', 'likes', 50, 1000, 1000),
('polyglot-playground', 'Multi-Lingual Coder', 'Create projects in all 5 languages', '🌐', 'languages', 5, 750, 750),
('snippet-creator', 'Snippet Master', 'Create 10 reusable snippets', '📚', 'snippets', 10, 400, 400),
('daily-coder', 'Daily Tinkerer', 'Use playground 7 days in a row', '🔥', 'streak', 7, 500, 500);
