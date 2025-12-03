/**
 * Dungeon Level Converter
 *
 * Utilities to help convert existing narrative levels into the node-based format
 */

import { DungeonLevel, DungeonNodeType, AbilityType, EnemyType, ItemType, Difficulty } from '../types/dungeonEditor';

/**
 * Create a sample Level 1 based on "The Abandoned Fortress"
 * This serves as a template showing how to structure your level
 */
export function createLevel1Template(): DungeonLevel {
  const now = new Date().toISOString();

  return {
    metadata: {
      id: 'level-1-abandoned-fortress',
      name: 'Level 1: The Abandoned Fortress',
      description: 'Navigate through the crumbling fortress, making choices that determine your path. Face rats, goblins, and traps in this introductory adventure.',
      recommendedLevel: 1,
      difficulty: 'easy' as Difficulty,
      estimatedDuration: 30,
      createdAt: now,
      updatedAt: now,
      isPublished: true,
      version: 1,
      tags: ['tutorial', 'fortress', 'branching'],
    },
    nodes: [
      // Start
      {
        id: 'start-1',
        type: DungeonNodeType.START,
        position: { x: 100, y: 400 },
        data: {
          label: 'Crumbling Gate',
          nodeType: DungeonNodeType.START,
          welcomeMessage: 'You stand before the moss-covered entrance of an ancient fortress. The air smells of decay and old stone. Torch light flickers from within.',
        },
      },

      // Initial Choice: Three paths
      {
        id: 'choice-1',
        type: DungeonNodeType.CHOICE,
        position: { x: 350, y: 400 },
        data: {
          label: 'Three Paths',
          nodeType: DungeonNodeType.CHOICE,
          prompt: 'Three paths lie ahead. Which do you choose?',
          options: [
            { id: 'path-a', text: 'Left Archway (Main Courtyard)', resultText: 'You enter the main courtyard...' },
            { id: 'path-b', text: 'Center Passage (Dark Corridor)', resultText: 'You venture into the dark corridor...' },
            { id: 'path-c', text: 'Right Archway (Overgrown Garden)', resultText: 'You step into the wild garden...' },
          ],
        },
      },

      // PATH A: Courtyard
      {
        id: 'story-courtyard',
        type: DungeonNodeType.STORY,
        position: { x: 600, y: 200 },
        data: {
          label: 'Courtyard Description',
          nodeType: DungeonNodeType.STORY,
          storyText: 'A wide-open courtyard with scattered debris, broken weapon racks, and a dried fountain in the center. Rubble shifts as you approach.',
          autoProgress: false,
        },
      },
      {
        id: 'combat-rats',
        type: DungeonNodeType.COMBAT,
        position: { x: 850, y: 200 },
        data: {
          label: 'Giant Rats',
          nodeType: DungeonNodeType.COMBAT,
          enemies: [
            { type: EnemyType.WOLF, count: 3, level: 1 }, // Using wolf as "giant rat" equivalent
          ],
          difficulty: 'easy' as Difficulty,
          rewardXp: 50,
          rewardGold: 15,
          flavorText: 'Three giant rats emerge from the rubble, hissing!',
        },
      },
      {
        id: 'choice-courtyard',
        type: DungeonNodeType.CHOICE,
        position: { x: 1100, y: 200 },
        data: {
          label: 'Courtyard Investigation',
          nodeType: DungeonNodeType.CHOICE,
          prompt: 'You search the courtyard. What catches your attention?',
          options: [
            { id: 'well', text: 'Inspect the ancient well', resultText: 'You approach the mysterious well...' },
            { id: 'tower', text: 'Enter the guard tower', resultText: 'You climb the tower stairs...' },
            { id: 'barracks', text: 'Investigate the old barracks', resultText: 'You enter the collapsed building...' },
          ],
        },
      },

      // PATH B: Dark Corridor
      {
        id: 'story-corridor',
        type: DungeonNodeType.STORY,
        position: { x: 600, y: 400 },
        data: {
          label: 'Trapped Hallway',
          nodeType: DungeonNodeType.STORY,
          storyText: 'A narrow hallway with flickering torches and scorch marks on the walls. You spot a pressure plate on the floor ahead.',
          autoProgress: false,
        },
      },
      {
        id: 'trap-1',
        type: DungeonNodeType.TRAP,
        position: { x: 850, y: 400 },
        data: {
          label: 'Pressure Plate Trap',
          nodeType: DungeonNodeType.TRAP,
          trapType: 'Falling Rocks',
          damage: 15,
          description: 'A pressure plate triggers falling rocks from the ceiling!',
          avoidCheck: {
            ability: AbilityType.DEXTERITY,
            dc: 12,
          },
        },
      },

      // PATH C: Garden
      {
        id: 'story-garden',
        type: DungeonNodeType.STORY,
        position: { x: 600, y: 600 },
        data: {
          label: 'Wild Garden',
          nodeType: DungeonNodeType.STORY,
          storyText: 'Wild vegetation has overtaken this area. Moonlight streams through breaks in the ceiling. Strange animal sounds echo through the ruins.',
          autoProgress: false,
        },
      },
      {
        id: 'ability-check-garden',
        type: DungeonNodeType.ABILITY_CHECK,
        position: { x: 850, y: 600 },
        data: {
          label: 'Listen Carefully',
          nodeType: DungeonNodeType.ABILITY_CHECK,
          ability: AbilityType.INTELLIGENCE,
          dc: 10,
          successText: 'You recognize the sounds - wolves are nearby! You prepare yourself.',
          failureText: 'The sounds seem harmless. You proceed without caution.',
          allowRetry: false,
        },
      },

      // Converging paths - Throne Room
      {
        id: 'story-throne',
        type: DungeonNodeType.STORY,
        position: { x: 1350, y: 400 },
        data: {
          label: 'Throne Room',
          nodeType: DungeonNodeType.STORY,
          storyText: 'You enter a grand throne room. Tattered banners hang from the walls. A large throne sits atop a raised platform.',
          autoProgress: false,
        },
      },

      // Loot Room
      {
        id: 'loot-1',
        type: DungeonNodeType.LOOT,
        position: { x: 1350, y: 200 },
        data: {
          label: 'Armory Cache',
          nodeType: DungeonNodeType.LOOT,
          description: 'You discover a hidden cache of weapons and supplies!',
          items: [
            { type: ItemType.WEAPON, name: 'Rusty Shortsword', quantity: 1, description: '+3 Attack' },
            { type: ItemType.ARMOR, name: 'Leather Armor', quantity: 1, description: '+2 Defense' },
            { type: ItemType.POTION, name: 'Healing Potion', quantity: 2, description: 'Restores 30 HP' },
          ],
          gold: 50,
          xp: 25,
        },
      },

      // Final Boss
      {
        id: 'boss-1',
        type: DungeonNodeType.BOSS,
        position: { x: 1600, y: 400 },
        data: {
          label: 'Fortress Guardian',
          nodeType: DungeonNodeType.BOSS,
          bossName: 'The Gelatinous Cube',
          bossType: EnemyType.SKELETON,
          bossLevel: 3,
          health: 200,
          abilities: ['Acid Touch', 'Engulf'],
          rewardXp: 300,
          rewardGold: 150,
          rewardItems: [
            { type: ItemType.ARTIFACT, name: 'Mysterious Glowing Crystal', quantity: 1, description: 'Pulses with strange energy' },
          ],
          flavorText: 'A massive gelatinous cube blocks your path, its translucent body revealing the bones of previous victims!',
          introDialog: 'The cube pulses and shifts, sensing your presence...',
        },
      },

      // End
      {
        id: 'end-1',
        type: DungeonNodeType.END,
        position: { x: 1850, y: 400 },
        data: {
          label: 'Fortress Exit',
          nodeType: DungeonNodeType.END,
          completionMessage: 'You emerge victorious from the abandoned fortress. The mysterious crystal pulses warmly in your pack, hinting at deeper mysteries below...',
          finalRewards: {
            xp: 100,
            gold: 75,
            items: [],
          },
        },
      },
    ],
    edges: [
      // Start to first choice
      { id: 'e1', source: 'start-1', target: 'choice-1' },

      // Choice to three paths
      { id: 'e2', source: 'choice-1', target: 'story-courtyard', sourceHandle: 'path-a' },
      { id: 'e3', source: 'choice-1', target: 'story-corridor', sourceHandle: 'path-b' },
      { id: 'e4', source: 'choice-1', target: 'story-garden', sourceHandle: 'path-c' },

      // Path A flow
      { id: 'e5', source: 'story-courtyard', target: 'combat-rats' },
      { id: 'e6', source: 'combat-rats', target: 'choice-courtyard' },
      { id: 'e7', source: 'choice-courtyard', target: 'loot-1', sourceHandle: 'barracks' },
      { id: 'e8', source: 'choice-courtyard', target: 'story-throne', sourceHandle: 'tower' },
      { id: 'e9', source: 'choice-courtyard', target: 'story-throne', sourceHandle: 'well' },

      // Path B flow
      { id: 'e10', source: 'story-corridor', target: 'trap-1' },
      { id: 'e11', source: 'trap-1', target: 'story-throne' },

      // Path C flow
      { id: 'e12', source: 'story-garden', target: 'ability-check-garden' },
      { id: 'e13', source: 'ability-check-garden', target: 'story-throne', sourceHandle: 'success' },
      { id: 'e14', source: 'ability-check-garden', target: 'story-throne', sourceHandle: 'failure' },

      // Converge to boss
      { id: 'e15', source: 'loot-1', target: 'boss-1' },
      { id: 'e16', source: 'story-throne', target: 'boss-1' },

      // Boss to end
      { id: 'e17', source: 'boss-1', target: 'end-1' },
    ],
  };
}

/**
 * Helper: Export level to JSON file
 */
export function exportLevelToJSON(level: DungeonLevel): string {
  return JSON.stringify(level, null, 2);
}

/**
 * Helper: Import level from JSON
 */
export function importLevelFromJSON(jsonString: string): DungeonLevel | null {
  try {
    const level = JSON.parse(jsonString) as DungeonLevel;
    // Basic validation
    if (!level.metadata || !level.nodes || !level.edges) {
      throw new Error('Invalid level structure');
    }
    return level;
  } catch (error) {
    console.error('Failed to import level:', error);
    return null;
  }
}

/**
 * Conversion guide for manual conversion
 */
export const CONVERSION_GUIDE = `
# Converting Markdown Levels to Node Format

## Step 1: Identify Key Components

Read through your markdown level and identify:
- **Story sections** → Story Nodes
- **Combat encounters** → Combat/Boss Nodes
- **Choices/decisions** → Choice Nodes
- **Skill checks** → Ability Check Nodes
- **Traps** → Trap Nodes
- **Rewards/loot** → Loot Nodes
- **Start point** → Start Node
- **End/exit** → End Node

## Step 2: Open the Editor

Press Ctrl+Shift+E to open the dungeon editor

## Step 3: Create Nodes

1. Click node types from the left palette
2. Drag to position them logically (left to right = progression)
3. Click each node to edit its properties in the right panel

## Step 4: Connect the Flow

Drag from output handles to input handles to show the path through your level

## Step 5: Test and Refine

Use the "Validate" button to check for errors

## Tips:

- **Linear sections**: Use Story → Combat → Loot → Story chains
- **Branching**: Use Choice nodes with multiple options
- **Challenges**: Use Ability Check nodes for skill checks
- **Boss fights**: Place Boss nodes before the End node
- **Save often**: Click Save button to preserve your work
`;
