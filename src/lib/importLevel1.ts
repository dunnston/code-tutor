/**
 * Complete Level 1 Import Script
 * Based on "The Abandoned Fortress" markdown documentation
 */

import { DungeonLevel, DungeonNodeType, AbilityType, EnemyType, ItemType, Difficulty } from '../types/dungeonEditor';
import { invoke } from '@/lib/tauri';

/**
 * Create complete Level 1 with all major paths and encounters
 */
export function createCompleteLevel1(): DungeonLevel {
  const now = new Date().toISOString();

  return {
    metadata: {
      id: 'level-1-abandoned-fortress',
      name: 'Level 1: The Abandoned Fortress',
      description: 'A vast, interconnected fortress with three main paths, multiple branching options, hidden areas, and challenging encounters culminating in a boss fight.',
      recommendedLevel: 1,
      difficulty: 'easy' as Difficulty,
      estimatedDuration: 45,
      createdAt: now,
      updatedAt: now,
      isPublished: true,
      version: 1,
      tags: ['tutorial', 'fortress', 'exploration', 'branching'],
    },
    nodes: [
      // START
      {
        id: 'start',
        type: DungeonNodeType.START,
        position: { x: 100, y: 500 },
        data: {
          label: 'Crumbling Gate',
          nodeType: DungeonNodeType.START,
          welcomeMessage: 'You stand before the moss-covered entrance of an ancient fortress. The air smells of decay and old stone. Torch light flickers from within, casting dancing shadows.',
        },
      },

      // INITIAL CHOICE
      {
        id: 'choice-main-paths',
        type: DungeonNodeType.CHOICE,
        position: { x: 350, y: 500 },
        data: {
          label: 'Three Paths Forward',
          nodeType: DungeonNodeType.CHOICE,
          prompt: 'Three paths lie ahead. Which archway do you choose?',
          options: [
            { id: 'path-a', text: 'Left Archway - Main Courtyard', resultText: 'You step through the left arch into the courtyard...' },
            { id: 'path-b', text: 'Center Passage - Dark Corridor', resultText: 'You venture into the dark corridor...' },
            { id: 'path-c', text: 'Right Archway - Overgrown Garden', resultText: 'You enter the wild garden...' },
          ],
        },
      },

      // ==================== PATH A: COURTYARD ====================
      {
        id: 'story-courtyard',
        type: DungeonNodeType.STORY,
        position: { x: 600, y: 200 },
        data: {
          label: 'Main Courtyard',
          nodeType: DungeonNodeType.STORY,
          storyText: 'A wide-open courtyard with scattered debris, broken weapon racks, and a dried fountain in the center. Rubble shifts - something is moving!',
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
          enemies: [{ type: EnemyType.WOLF, count: 3, level: 1 }],
          difficulty: 'easy' as Difficulty,
          rewardXp: 50,
          rewardGold: 15,
          flavorText: 'Three giant rats emerge from the rubble, hissing and showing their teeth!',
        },
      },
      {
        id: 'choice-courtyard-explore',
        type: DungeonNodeType.CHOICE,
        position: { x: 1100, y: 200 },
        data: {
          label: 'Investigate Courtyard',
          nodeType: DungeonNodeType.CHOICE,
          prompt: 'You search the courtyard. What catches your attention?',
          options: [
            { id: 'well', text: 'Inspect the ancient well', resultText: 'You peer into the dark well...' },
            { id: 'tower', text: 'Enter the guard tower', resultText: 'You climb the tower stairs...' },
            { id: 'barracks', text: 'Investigate the old barracks', resultText: 'You enter the collapsed building...' },
          ],
        },
      },
      {
        id: 'ability-check-well',
        type: DungeonNodeType.ABILITY_CHECK,
        position: { x: 1350, y: 100 },
        data: {
          label: 'Examine the Well',
          nodeType: DungeonNodeType.ABILITY_CHECK,
          ability: AbilityType.INTELLIGENCE,
          dc: 10,
          successText: 'The rope looks sturdy! You can hear running water below. You descend safely.',
          failureText: 'The well looks too dangerous. You decide not to risk it.',
          allowRetry: false,
        },
      },
      {
        id: 'story-tower',
        type: DungeonNodeType.STORY,
        position: { x: 1350, y: 200 },
        data: {
          label: 'Guard Tower',
          nodeType: DungeonNodeType.STORY,
          storyText: 'You climb the circular staircase. Arrow slits let in dim light. You hear voices above - goblins!',
          autoProgress: false,
        },
      },
      {
        id: 'combat-barracks',
        type: DungeonNodeType.COMBAT,
        position: { x: 1350, y: 300 },
        data: {
          label: 'Barracks Goblins',
          nodeType: DungeonNodeType.COMBAT,
          enemies: [{ type: EnemyType.GOBLIN, count: 2, level: 1 }],
          difficulty: 'easy' as Difficulty,
          rewardXp: 40,
          rewardGold: 10,
          flavorText: 'Two goblins are looting old armor. They spot you and attack!',
        },
      },

      // ==================== PATH B: DARK CORRIDOR ====================
      {
        id: 'story-corridor',
        type: DungeonNodeType.STORY,
        position: { x: 600, y: 500 },
        data: {
          label: 'Trapped Hallway',
          nodeType: DungeonNodeType.STORY,
          storyText: 'A narrow hallway with flickering torches and scorch marks on the walls. You spot a pressure plate clearly visible on the floor ahead.',
          autoProgress: false,
        },
      },
      {
        id: 'trap-pressure-plate',
        type: DungeonNodeType.TRAP,
        position: { x: 850, y: 500 },
        data: {
          label: 'Pressure Plate',
          nodeType: DungeonNodeType.TRAP,
          trapType: 'Falling Rocks',
          damage: 15,
          description: 'A pressure plate triggers falling rocks from the ceiling!',
          avoidCheck: { ability: AbilityType.DEXTERITY, dc: 12 },
        },
      },
      {
        id: 'choice-corridor-fork',
        type: DungeonNodeType.CHOICE,
        position: { x: 1100, y: 500 },
        data: {
          label: 'The Fork',
          nodeType: DungeonNodeType.CHOICE,
          prompt: 'Past the trap, the corridor splits. Which way?',
          options: [
            { id: 'storage', text: 'Left - Storage Chambers', resultText: 'You explore the storage rooms...' },
            { id: 'throne', text: 'Right - Throne Room', resultText: 'You approach the throne room...' },
            { id: 'library', text: 'Straight - The Library', resultText: 'You enter a dusty library...' },
          ],
        },
      },
      {
        id: 'loot-storage',
        type: DungeonNodeType.LOOT,
        position: { x: 1350, y: 400 },
        data: {
          label: 'Storage Cache',
          nodeType: DungeonNodeType.LOOT,
          description: 'You find a hidden cache and a locked chest!',
          items: [
            { itemSource: 'custom', type: ItemType.POTION, name: 'Healing Potion', quantity: 1, description: 'Restores 30 HP' },
            { itemSource: 'custom', type: ItemType.KEY, name: 'Brass Key', quantity: 1, description: 'Opens mysterious locks' },
          ],
          gold: 50,
          xp: 25,
        },
      },
      {
        id: 'story-library',
        type: DungeonNodeType.STORY,
        position: { x: 1350, y: 600 },
        data: {
          label: 'Ancient Library',
          nodeType: DungeonNodeType.STORY,
          storyText: 'A dusty library with collapsed shelves. You find a tome: "The cube fears flame" and "The dragon\'s hoard lies beyond the crimson door."',
          autoProgress: false,
        },
      },

      // ==================== PATH C: GARDEN ====================
      {
        id: 'story-garden',
        type: DungeonNodeType.STORY,
        position: { x: 600, y: 800 },
        data: {
          label: 'Overgrown Garden',
          nodeType: DungeonNodeType.STORY,
          storyText: 'Wild vegetation has overtaken this area. Moonlight streams through breaks in the ceiling. You hear wolves growling nearby.',
          autoProgress: false,
        },
      },
      {
        id: 'ability-check-wolves',
        type: DungeonNodeType.ABILITY_CHECK,
        position: { x: 850, y: 800 },
        data: {
          label: 'Approach Wolves',
          nodeType: DungeonNodeType.ABILITY_CHECK,
          ability: AbilityType.CHARISMA,
          dc: 12,
          successText: 'The wolves sense your calm demeanor and accept your presence. They leave peacefully.',
          failureText: 'The wolves growl menacingly. You must fight!',
          allowRetry: false,
        },
      },
      {
        id: 'combat-wolves',
        type: DungeonNodeType.COMBAT,
        position: { x: 1100, y: 900 },
        data: {
          label: 'Wolf Pack',
          nodeType: DungeonNodeType.COMBAT,
          enemies: [{ type: EnemyType.WOLF, count: 2, level: 2 }],
          difficulty: 'medium' as Difficulty,
          rewardXp: 60,
          rewardGold: 20,
          flavorText: 'Two wolves attack ferociously!',
        },
      },
      {
        id: 'choice-garden-explore',
        type: DungeonNodeType.CHOICE,
        position: { x: 1100, y: 800 },
        data: {
          label: 'Explore Garden',
          nodeType: DungeonNodeType.CHOICE,
          prompt: 'The garden area is large. Where do you search?',
          options: [
            { id: 'shed', text: 'Search the Gardener\'s Shed', resultText: 'You enter the old shed...' },
            { id: 'greenhouse', text: 'Investigate the Greenhouse Ruins', resultText: 'You approach the broken greenhouse...' },
          ],
        },
      },
      {
        id: 'loot-shed',
        type: DungeonNodeType.LOOT,
        position: { x: 1350, y: 750 },
        data: {
          label: 'Shed Supplies',
          nodeType: DungeonNodeType.LOOT,
          description: 'Old supplies and a rest area. You heal and find useful items.',
          items: [{ itemSource: 'custom', type: ItemType.POTION, name: 'Healing Herbs', quantity: 2, description: 'Restores 15 HP' }],
          gold: 15,
          xp: 10,
        },
      },
      {
        id: 'combat-greenhouse-cube',
        type: DungeonNodeType.COMBAT,
        position: { x: 1350, y: 850 },
        data: {
          label: 'Small Gelatinous Cube',
          nodeType: DungeonNodeType.COMBAT,
          enemies: [{ type: EnemyType.SKELETON, count: 1, level: 2 }],
          difficulty: 'medium' as Difficulty,
          rewardXp: 75,
          rewardGold: 30,
          flavorText: 'A small gelatinous cube blocks your path - a preview of what\'s to come!',
        },
      },

      // ==================== CONVERGENCE: GREAT HALL ====================
      {
        id: 'story-great-hall',
        type: DungeonNodeType.STORY,
        position: { x: 1600, y: 500 },
        data: {
          label: 'The Great Hall',
          nodeType: DungeonNodeType.STORY,
          storyText: 'You enter a massive hall with overturned tables and torn banners. This is where all paths converge. Enemies await!',
          autoProgress: false,
        },
      },
      {
        id: 'combat-great-hall',
        type: DungeonNodeType.COMBAT,
        position: { x: 1850, y: 500 },
        data: {
          label: 'Great Hall Battle',
          nodeType: DungeonNodeType.COMBAT,
          enemies: [
            { type: EnemyType.GOBLIN, count: 3, level: 2 },
            { type: EnemyType.WOLF, count: 1, level: 2 },
          ],
          difficulty: 'hard' as Difficulty,
          rewardXp: 120,
          rewardGold: 50,
          flavorText: 'Three goblins and their tamed wolf charge at you!',
        },
      },
      {
        id: 'choice-great-hall-explore',
        type: DungeonNodeType.CHOICE,
        position: { x: 2100, y: 500 },
        data: {
          label: 'Search Great Hall',
          nodeType: DungeonNodeType.CHOICE,
          prompt: 'The hall is large. What do you investigate?',
          options: [
            { id: 'kitchen', text: 'Search the Kitchen', resultText: 'You enter the old kitchen...' },
            { id: 'crimson', text: 'Approach the Crimson Door', resultText: 'You stand before the legendary crimson door...' },
          ],
        },
      },
      {
        id: 'loot-kitchen',
        type: DungeonNodeType.LOOT,
        position: { x: 2350, y: 400 },
        data: {
          label: 'Kitchen Supplies',
          nodeType: DungeonNodeType.LOOT,
          description: 'Preserved food and supplies from the old kitchen!',
          items: [
            { itemSource: 'custom', type: ItemType.POTION, name: 'Preserved Food', quantity: 1, description: 'Heals 15 HP' },
            { itemSource: 'custom', type: ItemType.WEAPON, name: 'Kitchen Knife', quantity: 1, description: '+2 Attack' },
          ],
          gold: 25,
          xp: 15,
        },
      },

      // ==================== BOSS SEQUENCE ====================
      {
        id: 'story-crimson-door',
        type: DungeonNodeType.STORY,
        position: { x: 2350, y: 600 },
        data: {
          label: 'The Crimson Door',
          nodeType: DungeonNodeType.STORY,
          storyText: 'The legendary crimson door stands before you, carved with ancient runes. Beyond lies the fortress\'s greatest guardian...',
          autoProgress: false,
        },
      },
      {
        id: 'boss-cube',
        type: DungeonNodeType.BOSS,
        position: { x: 2600, y: 500 },
        data: {
          label: 'The Gelatinous Cube',
          nodeType: DungeonNodeType.BOSS,
          bossName: 'The Gelatinous Cube',
          bossType: EnemyType.SKELETON,
          bossLevel: 3,
          health: 250,
          abilities: ['Acid Touch', 'Engulf', 'Dissolve Armor'],
          rewardXp: 500,
          rewardGold: 200,
          rewardItems: [
            { itemSource: 'custom', type: ItemType.ARTIFACT, name: 'Glowing Crystal', quantity: 1, description: 'Mysterious power pulses within' },
            { itemSource: 'custom', type: ItemType.WEAPON, name: 'Enchanted Sword', quantity: 1, description: '+5 Attack, found within the cube' },
          ],
          flavorText: 'A massive gelatinous cube blocks the exit, its translucent body revealing the bones of previous victims! (Hint: Fire is effective against it!)',
          introDialog: 'The cube pulses with hunger, sensing fresh prey...',
        },
      },

      // ==================== END ====================
      {
        id: 'end',
        type: DungeonNodeType.END,
        position: { x: 2850, y: 500 },
        data: {
          label: 'Fortress Exit',
          nodeType: DungeonNodeType.END,
          completionMessage: 'With the Gelatinous Cube defeated, you emerge victorious from the Abandoned Fortress! The mysterious glowing crystal pulses warmly in your pack, hinting at deeper mysteries below...',
          finalRewards: {
            xp: 100,
            gold: 100,
            items: [],
          },
        },
      },
    ],
    edges: [
      // Start to initial choice
      { id: 'e-start', source: 'start', target: 'choice-main-paths' },

      // Initial choice to three paths
      { id: 'e-path-a', source: 'choice-main-paths', target: 'story-courtyard', sourceHandle: 'path-a' },
      { id: 'e-path-b', source: 'choice-main-paths', target: 'story-corridor', sourceHandle: 'path-b' },
      { id: 'e-path-c', source: 'choice-main-paths', target: 'story-garden', sourceHandle: 'path-c' },

      // PATH A flow
      { id: 'e-a1', source: 'story-courtyard', target: 'combat-rats' },
      { id: 'e-a2', source: 'combat-rats', target: 'choice-courtyard-explore' },
      { id: 'e-a3', source: 'choice-courtyard-explore', target: 'ability-check-well', sourceHandle: 'well' },
      { id: 'e-a4', source: 'choice-courtyard-explore', target: 'story-tower', sourceHandle: 'tower' },
      { id: 'e-a5', source: 'choice-courtyard-explore', target: 'combat-barracks', sourceHandle: 'barracks' },
      { id: 'e-a6', source: 'ability-check-well', target: 'story-great-hall', sourceHandle: 'success' },
      { id: 'e-a7', source: 'ability-check-well', target: 'story-great-hall', sourceHandle: 'failure' },
      { id: 'e-a8', source: 'story-tower', target: 'story-great-hall' },
      { id: 'e-a9', source: 'combat-barracks', target: 'story-great-hall' },

      // PATH B flow
      { id: 'e-b1', source: 'story-corridor', target: 'trap-pressure-plate' },
      { id: 'e-b2', source: 'trap-pressure-plate', target: 'choice-corridor-fork' },
      { id: 'e-b3', source: 'choice-corridor-fork', target: 'loot-storage', sourceHandle: 'storage' },
      { id: 'e-b4', source: 'choice-corridor-fork', target: 'story-great-hall', sourceHandle: 'throne' },
      { id: 'e-b5', source: 'choice-corridor-fork', target: 'story-library', sourceHandle: 'library' },
      { id: 'e-b6', source: 'loot-storage', target: 'story-great-hall' },
      { id: 'e-b7', source: 'story-library', target: 'story-great-hall' },

      // PATH C flow
      { id: 'e-c1', source: 'story-garden', target: 'ability-check-wolves' },
      { id: 'e-c2', source: 'ability-check-wolves', target: 'choice-garden-explore', sourceHandle: 'success' },
      { id: 'e-c3', source: 'ability-check-wolves', target: 'combat-wolves', sourceHandle: 'failure' },
      { id: 'e-c4', source: 'combat-wolves', target: 'choice-garden-explore' },
      { id: 'e-c5', source: 'choice-garden-explore', target: 'loot-shed', sourceHandle: 'shed' },
      { id: 'e-c6', source: 'choice-garden-explore', target: 'combat-greenhouse-cube', sourceHandle: 'greenhouse' },
      { id: 'e-c7', source: 'loot-shed', target: 'story-great-hall' },
      { id: 'e-c8', source: 'combat-greenhouse-cube', target: 'story-great-hall' },

      // Great Hall to Boss
      { id: 'e-hall1', source: 'story-great-hall', target: 'combat-great-hall' },
      { id: 'e-hall2', source: 'combat-great-hall', target: 'choice-great-hall-explore' },
      { id: 'e-hall3', source: 'choice-great-hall-explore', target: 'loot-kitchen', sourceHandle: 'kitchen' },
      { id: 'e-hall4', source: 'choice-great-hall-explore', target: 'story-crimson-door', sourceHandle: 'crimson' },
      { id: 'e-hall5', source: 'loot-kitchen', target: 'story-crimson-door' },
      { id: 'e-hall6', source: 'story-crimson-door', target: 'boss-cube' },

      // Boss to End
      { id: 'e-end', source: 'boss-cube', target: 'end' },
    ],
  };
}

/**
 * Import Level 1 into the database
 */
export async function importLevel1ToDatabase(): Promise<void> {
  try {
    const level = createCompleteLevel1();
    await invoke('save_dungeon_level', { level });
    console.log('✅ Level 1 imported successfully!');
    alert('Level 1: The Abandoned Fortress has been imported! Open the editor and click "Load" to see it.');
  } catch (error) {
    console.error('Failed to import Level 1:', error);
    alert('Failed to import Level 1: ' + error);
  }
}
