import {
  DungeonLevel,
  DungeonNodeType,
  EnemyType,
  ItemType,
  AbilityType,
  Difficulty,
} from '../types/dungeonEditor';

/**
 * Sample Dungeon Level 1: The Goblin Cave (Tutorial Level)
 * A simple linear path with combat and basic encounters
 */
export const sampleLevel1: DungeonLevel = {
  metadata: {
    id: 'sample-goblin-cave',
    name: 'The Goblin Cave',
    description: 'A beginner-friendly dungeon with goblins and basic traps. Perfect for testing the combat system.',
    recommendedLevel: 1,
    difficulty: Difficulty.EASY,
    estimatedDuration: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPublished: false,
    version: 1,
    tags: ['tutorial', 'goblins', 'beginner'],
  },
  nodes: [
    {
      id: 'start-1',
      type: DungeonNodeType.START,
      position: { x: 100, y: 250 },
      data: {
        label: 'Cave Entrance',
        nodeType: DungeonNodeType.START,
        welcomeMessage: 'You stand before a dark cave. Strange sounds echo from within...',
      },
    },
    {
      id: 'story-1',
      type: DungeonNodeType.STORY,
      position: { x: 300, y: 250 },
      data: {
        label: 'The Dark Passage',
        nodeType: DungeonNodeType.STORY,
        storyText: 'You venture deeper into the cave. The walls are damp and covered in moss. You hear chittering sounds ahead.',
        autoProgress: false,
      },
    },
    {
      id: 'combat-1',
      type: DungeonNodeType.COMBAT,
      position: { x: 500, y: 250 },
      data: {
        label: 'Goblin Scouts',
        nodeType: DungeonNodeType.COMBAT,
        enemies: [
          { type: EnemyType.GOBLIN, count: 2, level: 1 },
        ],
        difficulty: Difficulty.EASY,
        rewardXp: 100,
        rewardGold: 50,
        flavorText: 'Two goblin scouts spot you and attack!',
      },
    },
    {
      id: 'loot-1',
      type: DungeonNodeType.LOOT,
      position: { x: 700, y: 250 },
      data: {
        label: 'Scattered Treasure',
        nodeType: DungeonNodeType.LOOT,
        description: 'You find a small stash the goblins were guarding.',
        items: [
          { itemSource: 'custom', type: ItemType.POTION, name: 'Health Potion', quantity: 2, description: 'Restores 50 HP' },
        ],
        gold: 75,
        xp: 25,
      },
    },
    {
      id: 'trap-1',
      type: DungeonNodeType.TRAP,
      position: { x: 900, y: 250 },
      data: {
        label: 'Tripwire Trap',
        nodeType: DungeonNodeType.TRAP,
        trapType: 'Tripwire Alarm',
        damage: 15,
        description: 'A crude tripwire is stretched across the passage!',
        avoidCheck: {
          ability: AbilityType.DEXTERITY,
          dc: 10,
        },
      },
    },
    {
      id: 'boss-1',
      type: DungeonNodeType.BOSS,
      position: { x: 1100, y: 250 },
      data: {
        label: 'Goblin Chief',
        nodeType: DungeonNodeType.BOSS,
        bossName: 'Grunk the Goblin Chief',
        bossType: EnemyType.GOBLIN,
        bossLevel: 3,
        health: 150,
        abilities: ['War Cry', 'Cleave'],
        rewardXp: 500,
        rewardGold: 200,
        rewardItems: [
          { itemSource: 'custom', type: ItemType.WEAPON, name: 'Rusty Short Sword', quantity: 1, description: '+5 Attack' },
        ],
        flavorText: 'The goblin chief roars and charges at you with his crude weapon!',
        introDialog: 'You dare invade MY cave? I\'ll mount your head on the wall!',
      },
    },
    {
      id: 'end-1',
      type: DungeonNodeType.END,
      position: { x: 1300, y: 250 },
      data: {
        label: 'Cave Exit',
        nodeType: DungeonNodeType.END,
        completionMessage: 'You emerge victorious from the goblin cave, your pockets heavier and your skills sharper.',
        finalRewards: {
          xp: 100,
          gold: 50,
          items: [],
        },
      },
    },
  ],
  edges: [
    { id: 'e1', source: 'start-1', target: 'story-1' },
    { id: 'e2', source: 'story-1', target: 'combat-1' },
    { id: 'e3', source: 'combat-1', target: 'loot-1' },
    { id: 'e4', source: 'loot-1', target: 'trap-1' },
    { id: 'e5', source: 'trap-1', target: 'boss-1' },
    { id: 'e6', source: 'boss-1', target: 'end-1' },
  ],
};

/**
 * Sample Dungeon Level 2: The Cursed Tomb (Branching Paths)
 * Includes choice nodes and ability checks
 */
export const sampleLevel2: DungeonLevel = {
  metadata: {
    id: 'sample-cursed-tomb',
    name: 'The Cursed Tomb',
    description: 'An ancient tomb with branching paths and puzzles. Features choice-based gameplay and skill checks.',
    recommendedLevel: 5,
    difficulty: Difficulty.MEDIUM,
    estimatedDuration: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPublished: false,
    version: 1,
    tags: ['undead', 'puzzles', 'choices'],
  },
  nodes: [
    {
      id: 'start-2',
      type: DungeonNodeType.START,
      position: { x: 100, y: 300 },
      data: {
        label: 'Tomb Entrance',
        nodeType: DungeonNodeType.START,
        welcomeMessage: 'An ancient tomb looms before you. The air is thick with dark magic.',
      },
    },
    {
      id: 'choice-1',
      type: DungeonNodeType.CHOICE,
      position: { x: 350, y: 300 },
      data: {
        label: 'Fork in the Path',
        nodeType: DungeonNodeType.CHOICE,
        prompt: 'The corridor splits in two. The left path shows signs of recent disturbance. The right path is covered in ancient runes.',
        options: [
          { id: 'left', text: 'Take the left path (looks dangerous)', resultText: 'You proceed down the disturbed corridor...' },
          { id: 'right', text: 'Take the right path (ancient runes)', resultText: 'You carefully follow the runed passage...' },
        ],
      },
    },
    {
      id: 'combat-2a',
      type: DungeonNodeType.COMBAT,
      position: { x: 550, y: 200 },
      data: {
        label: 'Undead Ambush',
        nodeType: DungeonNodeType.COMBAT,
        enemies: [
          { type: EnemyType.SKELETON, count: 3, level: 5 },
          { type: EnemyType.ZOMBIE, count: 1, level: 5 },
        ],
        difficulty: Difficulty.MEDIUM,
        rewardXp: 300,
        rewardGold: 150,
        flavorText: 'Skeletons rise from the floor to block your path!',
      },
    },
    {
      id: 'ability-1',
      type: DungeonNodeType.ABILITY_CHECK,
      position: { x: 550, y: 400 },
      data: {
        label: 'Ancient Puzzle',
        nodeType: DungeonNodeType.ABILITY_CHECK,
        ability: AbilityType.INTELLIGENCE,
        dc: 15,
        successText: 'You decipher the ancient runes and unlock a secret passage filled with treasure!',
        failureText: 'The runes remain a mystery. You continue forward empty-handed.',
        allowRetry: false,
      },
    },
    {
      id: 'loot-2',
      type: DungeonNodeType.LOOT,
      position: { x: 750, y: 400 },
      data: {
        label: 'Secret Treasure',
        nodeType: DungeonNodeType.LOOT,
        description: 'A hidden cache of ancient treasures!',
        items: [
          { itemSource: 'custom', type: ItemType.SCROLL, name: 'Scroll of Fireball', quantity: 1, description: 'Cast Fireball' },
          { itemSource: 'custom', type: ItemType.ARMOR, name: 'Enchanted Robes', quantity: 1, description: '+10 Defense' },
        ],
        gold: 500,
        xp: 200,
      },
    },
    {
      id: 'boss-2',
      type: DungeonNodeType.BOSS,
      position: { x: 950, y: 300 },
      data: {
        label: 'Ancient Lich',
        nodeType: DungeonNodeType.BOSS,
        bossName: 'Zul\'thar the Eternal',
        bossType: EnemyType.LICH,
        bossLevel: 8,
        health: 500,
        abilities: ['Death Ray', 'Summon Undead', 'Dark Regeneration'],
        rewardXp: 1000,
        rewardGold: 800,
        rewardItems: [
          { itemSource: 'custom', type: ItemType.ARTIFACT, name: 'Phylactery Shard', quantity: 1, description: 'A fragment of dark power' },
        ],
        flavorText: 'The ancient lich awakens, its hollow eyes burning with unholy power!',
        introDialog: 'Foolish mortal... you shall join my army of the dead!',
      },
    },
    {
      id: 'end-2',
      type: DungeonNodeType.END,
      position: { x: 1150, y: 300 },
      data: {
        label: 'Tomb Exit',
        nodeType: DungeonNodeType.END,
        completionMessage: 'With the lich defeated, the curse lifts from the tomb. You emerge into sunlight once more.',
        finalRewards: {
          xp: 500,
          gold: 300,
          items: [
            { itemSource: 'custom', type: ItemType.KEY, name: 'Ancient Key', quantity: 1, description: 'Opens mysterious locks' },
          ],
        },
      },
    },
  ],
  edges: [
    { id: 'e2-1', source: 'start-2', target: 'choice-1' },
    { id: 'e2-2', source: 'choice-1', target: 'combat-2a', sourceHandle: 'left' },
    { id: 'e2-3', source: 'choice-1', target: 'ability-1', sourceHandle: 'right' },
    { id: 'e2-4', source: 'combat-2a', target: 'boss-2' },
    { id: 'e2-5', source: 'ability-1', target: 'loot-2', sourceHandle: 'success' },
    { id: 'e2-6', source: 'ability-1', target: 'boss-2', sourceHandle: 'failure' },
    { id: 'e2-7', source: 'loot-2', target: 'boss-2' },
    { id: 'e2-8', source: 'boss-2', target: 'end-2' },
  ],
};

/**
 * Sample Dungeon Level 3: Dragon's Lair (Complex)
 * A more complex level with multiple branches and varied encounter types
 */
export const sampleLevel3: DungeonLevel = {
  metadata: {
    id: 'sample-dragons-lair',
    name: "Dragon's Lair",
    description: 'Face the ultimate challenge in the dragon\'s mountain lair. Multiple paths, deadly traps, and fierce guardians await.',
    recommendedLevel: 10,
    difficulty: Difficulty.HARD,
    estimatedDuration: 45,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPublished: false,
    version: 1,
    tags: ['dragon', 'epic', 'endgame'],
  },
  nodes: [
    {
      id: 'start-3',
      type: DungeonNodeType.START,
      position: { x: 100, y: 400 },
      data: {
        label: 'Mountain Path',
        nodeType: DungeonNodeType.START,
        welcomeMessage: 'The dragon\'s lair is carved into the mountainside. Heat radiates from the entrance.',
      },
    },
    {
      id: 'story-3',
      type: DungeonNodeType.STORY,
      position: { x: 300, y: 400 },
      data: {
        label: 'The Warning',
        nodeType: DungeonNodeType.STORY,
        storyText: 'Ancient bones litter the entrance. A warning carved in stone reads: "Turn back, or face eternity in flame."',
        autoProgress: false,
      },
    },
    {
      id: 'trap-3',
      type: DungeonNodeType.TRAP,
      position: { x: 500, y: 400 },
      data: {
        label: 'Fire Jet Trap',
        nodeType: DungeonNodeType.TRAP,
        trapType: 'Dragon Fire Trap',
        damage: 50,
        description: 'Jets of dragon fire erupt from the walls!',
        avoidCheck: {
          ability: AbilityType.DEXTERITY,
          dc: 18,
        },
        detectDc: 16,
      },
    },
    {
      id: 'combat-3',
      type: DungeonNodeType.COMBAT,
      position: { x: 700, y: 300 },
      data: {
        label: 'Dragon Cultists',
        nodeType: DungeonNodeType.COMBAT,
        enemies: [
          { type: EnemyType.CULTIST, count: 4, level: 9 },
        ],
        difficulty: Difficulty.HARD,
        rewardXp: 600,
        rewardGold: 400,
        flavorText: 'Fanatical cultists guard the dragon\'s inner sanctum!',
      },
    },
    {
      id: 'choice-3',
      type: DungeonNodeType.CHOICE,
      position: { x: 900, y: 400 },
      data: {
        label: 'The Offering',
        nodeType: DungeonNodeType.CHOICE,
        prompt: 'You find the dragon\'s hoard. Do you take the treasure and risk awakening the beast, or proceed quietly?',
        options: [
          { id: 'steal', text: 'Take the treasure (risky)', resultText: 'Your greed awakens the dragon!' },
          { id: 'sneak', text: 'Leave it and sneak past', resultText: 'You move silently through the shadows...' },
          { id: 'negotiate', text: 'Call out to the dragon', resultText: 'The dragon stirs and regards you with ancient eyes...' },
        ],
      },
    },
    {
      id: 'loot-3',
      type: DungeonNodeType.LOOT,
      position: { x: 1100, y: 300 },
      data: {
        label: 'Dragon Hoard',
        nodeType: DungeonNodeType.LOOT,
        description: 'Mountains of gold and magical artifacts!',
        items: [
          { itemSource: 'custom', type: ItemType.WEAPON, name: 'Dragon Slayer Sword', quantity: 1, description: '+50 Attack vs Dragons' },
          { itemSource: 'custom', type: ItemType.ARTIFACT, name: 'Dragon Scale', quantity: 3, description: 'Crafting material' },
        ],
        gold: 5000,
        xp: 1000,
      },
    },
    {
      id: 'boss-3',
      type: DungeonNodeType.BOSS,
      position: { x: 1100, y: 500 },
      data: {
        label: 'Ancient Dragon',
        nodeType: DungeonNodeType.BOSS,
        bossName: 'Infernus the Eternal Flame',
        bossType: EnemyType.DRAGON,
        bossLevel: 15,
        health: 2000,
        abilities: ['Dragon Breath', 'Wing Buffet', 'Tail Sweep', 'Ancient Magic'],
        rewardXp: 5000,
        rewardGold: 10000,
        rewardItems: [
          { itemSource: 'custom', type: ItemType.ARTIFACT, name: 'Heart of the Dragon', quantity: 1, description: 'Ultimate power' },
        ],
        flavorText: 'The ancient dragon unfurls its massive wings, flames dancing between its teeth!',
        introDialog: 'So, another would-be hero comes to their doom. Let us see if you burn brighter than the rest!',
      },
    },
    {
      id: 'end-3',
      type: DungeonNodeType.END,
      position: { x: 1300, y: 400 },
      data: {
        label: 'Victory',
        nodeType: DungeonNodeType.END,
        completionMessage: 'The dragon falls! You have achieved the impossible. Legends will be sung of your triumph!',
        finalRewards: {
          xp: 2000,
          gold: 5000,
          items: [
            { itemSource: 'custom', type: ItemType.ARTIFACT, name: 'Dragonbone Crown', quantity: 1, description: 'Proof of your legendary deed' },
          ],
        },
      },
    },
  ],
  edges: [
    { id: 'e3-1', source: 'start-3', target: 'story-3' },
    { id: 'e3-2', source: 'story-3', target: 'trap-3' },
    { id: 'e3-3', source: 'trap-3', target: 'combat-3' },
    { id: 'e3-4', source: 'combat-3', target: 'choice-3' },
    { id: 'e3-5', source: 'choice-3', target: 'loot-3', sourceHandle: 'steal' },
    { id: 'e3-6', source: 'choice-3', target: 'boss-3', sourceHandle: 'sneak' },
    { id: 'e3-7', source: 'choice-3', target: 'boss-3', sourceHandle: 'negotiate' },
    { id: 'e3-8', source: 'loot-3', target: 'boss-3' },
    { id: 'e3-9', source: 'boss-3', target: 'end-3' },
  ],
};

// Export all sample levels
export const sampleLevels = [sampleLevel1, sampleLevel2, sampleLevel3];
