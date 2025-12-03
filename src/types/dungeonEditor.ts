// Dungeon Node Editor Type Definitions

import { Node, Edge } from 'reactflow';

// ============================================
// Node Type Enums
// ============================================

export enum DungeonNodeType {
  START = 'start',
  COMBAT = 'combat',
  CHOICE = 'choice',
  ABILITY_CHECK = 'abilityCheck',
  TRAP = 'trap',
  LOOT = 'loot',
  STORY = 'story',
  BOSS = 'boss',
  QUESTION = 'question',
  END = 'end',
}

export enum AbilityType {
  STRENGTH = 'STR',
  DEXTERITY = 'DEX',
  INTELLIGENCE = 'INT',
  CHARISMA = 'CHA',
}

export enum EnemyType {
  GOBLIN = 'goblin',
  ORC = 'orc',
  SKELETON = 'skeleton',
  ZOMBIE = 'zombie',
  SPIDER = 'spider',
  WOLF = 'wolf',
  BANDIT = 'bandit',
  CULTIST = 'cultist',
  DRAGON = 'dragon',
  DEMON = 'demon',
  LICH = 'lich',
}

export enum ItemType {
  WEAPON = 'weapon',
  ARMOR = 'armor',
  POTION = 'potion',
  SCROLL = 'scroll',
  GOLD = 'gold',
  KEY = 'key',
  ARTIFACT = 'artifact',
}

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  DEADLY = 'deadly',
}

// ============================================
// Base Node Data Interface
// ============================================

export interface BaseNodeData {
  label: string;
  description?: string;
  nodeType: DungeonNodeType;
}

// ============================================
// Specific Node Data Interfaces
// ============================================

export interface StartNodeData extends BaseNodeData {
  nodeType: DungeonNodeType.START;
  welcomeMessage?: string;
}

export interface CombatNodeData extends BaseNodeData {
  nodeType: DungeonNodeType.COMBAT;
  enemies: Array<{
    type?: EnemyType; // Legacy support
    customEnemyId?: string; // New custom enemy system
    count: number;
    level: number;
  }>;
  difficulty: Difficulty;
  rewardXp: number;
  rewardGold: number;
  flavorText?: string;
  // MCQ Support for attacks
  useMcqForAttacks?: boolean; // If true, player answers questions to attack
  attackMcqDifficulty?: string; // Filter for attack questions
  attackMcqTopic?: string; // Filter for attack questions
}

export interface ChoiceOption {
  id: string;
  text: string;
  resultText?: string;
  requiresItem?: string;
}

export interface ChoiceNodeData extends BaseNodeData {
  nodeType: DungeonNodeType.CHOICE;
  prompt: string;
  options: ChoiceOption[];
}

export interface AbilityCheckNodeData extends BaseNodeData {
  nodeType: DungeonNodeType.ABILITY_CHECK;
  ability: AbilityType;
  dc: number; // Difficulty Class
  successText: string;
  failureText: string;
  allowRetry: boolean;
  // MCQ Support
  useMcq?: boolean; // If true, use MCQ instead of dice roll
  mcqQuestionId?: string; // ID of the question to use
}

export interface TrapNodeData extends BaseNodeData {
  nodeType: DungeonNodeType.TRAP;
  trapType: string;
  damage: number;
  avoidCheck?: {
    ability: AbilityType;
    dc: number;
  };
  detectDc?: number;
  description: string;
}

export interface LootItem {
  // Item source - either database reference or custom
  itemSource: 'database' | 'custom';

  // For database items
  itemId?: string; // References equipment_items.id or consumable_items.id
  itemCategory?: 'equipment' | 'consumable'; // Which table to reference

  // For custom items (or display name for database items)
  type: ItemType;
  name: string;
  quantity: number;
  description?: string;

  // Additional properties for custom items
  stats?: {
    damage?: number;
    defense?: number;
    health?: number;
    effect?: string;
  };
}

export interface LootNodeData extends BaseNodeData {
  nodeType: DungeonNodeType.LOOT;
  items: LootItem[];
  gold: number;
  xp: number;
  description: string;
}

export interface StoryNodeData extends BaseNodeData {
  nodeType: DungeonNodeType.STORY;
  storyText: string;
  imageUrl?: string;
  autoProgress?: boolean;
}

export interface BossNodeData extends BaseNodeData {
  nodeType: DungeonNodeType.BOSS;
  bossName: string;
  bossType?: EnemyType; // Legacy support
  customEnemyId?: string; // New custom enemy system
  bossLevel: number;
  health: number;
  abilities: string[];
  rewardXp: number;
  rewardGold: number;
  rewardItems: LootItem[];
  flavorText: string;
  introDialog?: string;
}

export interface QuestionNodeData extends BaseNodeData {
  nodeType: DungeonNodeType.QUESTION;
  questionId: string; // References mcq_questions.id
  successText?: string;
  failureText?: string;
}

export interface EndNodeData extends BaseNodeData {
  nodeType: DungeonNodeType.END;
  completionMessage: string;
  finalRewards?: {
    xp: number;
    gold: number;
    items: LootItem[];
  };
}

// ============================================
// Union Type for All Node Data
// ============================================

export type DungeonNodeData =
  | StartNodeData
  | CombatNodeData
  | ChoiceNodeData
  | AbilityCheckNodeData
  | TrapNodeData
  | LootNodeData
  | StoryNodeData
  | BossNodeData
  | QuestionNodeData
  | EndNodeData;

// ============================================
// React Flow Node & Edge Types
// ============================================

export type DungeonNode = Node<DungeonNodeData>;
export type DungeonEdge = Edge;

// ============================================
// Level Metadata & Structure
// ============================================

export interface LevelMetadata {
  id: string;
  name: string;
  description: string;
  recommendedLevel: number;
  difficulty: Difficulty;
  estimatedDuration: number; // in minutes
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  version: number;
  tags?: string[];
}

export interface DungeonLevel {
  metadata: LevelMetadata;
  nodes: DungeonNode[];
  edges: DungeonEdge[];
}

// ============================================
// Validation Results
// ============================================

export interface ValidationError {
  type: 'error' | 'warning';
  nodeId?: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// ============================================
// Editor State
// ============================================

export interface EditorState {
  currentLevel: DungeonLevel | null;
  selectedNode: DungeonNode | null;
  isDirty: boolean;
  validationResult: ValidationResult | null;
}

// ============================================
// Level List Item (for UI)
// ============================================

export interface LevelListItem {
  id: string;
  name: string;
  description: string;
  recommendedLevel: number;
  difficulty: Difficulty;
  isPublished: boolean;
  updatedAt: string;
}
