// RPG Dungeon System Types

// ============================================================================
// CHARACTER SYSTEM
// ============================================================================

export type ScalingStat = 'strength' | 'intelligence' | 'dexterity' | 'none';

export interface CharacterStatsRaw {
  user_id: number;
  level: number;
  strength: number;
  intelligence: number;
  dexterity: number;
  max_health: number;
  current_health: number;
  max_mana: number;
  current_mana: number;
  base_damage: number;
  defense: number;
  critical_chance: number;
  dodge_chance: number;
  stat_points_available: number;
  created_at: string;
  updated_at: string;
}

export interface CharacterStats {
  userId: number;
  level: number;
  strength: number;
  intelligence: number;
  dexterity: number;
  maxHealth: number;
  currentHealth: number;
  maxMana: number;
  currentMana: number;
  baseDamage: number;
  defense: number;
  criticalChance: number;
  dodgeChance: number;
  statPointsAvailable: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// EQUIPMENT SYSTEM
// ============================================================================

export type EquipmentSlot = 'weapon' | 'armor' | 'accessory';
export type EquipmentTier = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface EquipmentItemRaw {
  id: string;
  name: string;
  description: string;
  slot: EquipmentSlot;
  tier: EquipmentTier;
  required_level: number;
  required_strength: number;
  required_intelligence: number;
  required_dexterity: number;
  damage_bonus: number;
  defense_bonus: number;
  hp_bonus: number;
  mana_bonus: number;
  strength_bonus: number;
  intelligence_bonus: number;
  dexterity_bonus: number;
  critical_chance_bonus: number;
  dodge_chance_bonus: number;
  special_effects: string | null; // JSON
  icon: string;
  value: number;
  created_at: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  description: string;
  slot: EquipmentSlot;
  tier: EquipmentTier;
  requiredLevel: number;
  requiredStrength: number;
  requiredIntelligence: number;
  requiredDexterity: number;
  damageBonus: number;
  defenseBonus: number;
  hpBonus: number;
  manaBonus: number;
  strengthBonus: number;
  intelligenceBonus: number;
  dexterityBonus: number;
  criticalChanceBonus: number;
  dodgeChanceBonus: number;
  specialEffects?: {
    type: string;
    value: number;
  };
  icon: string;
  value: number;
  createdAt: Date;
}

export interface CharacterEquipmentRaw {
  user_id: number;
  weapon_id: string | null;
  armor_id: string | null;
  accessory_id: string | null;
  updated_at: string;
}

export interface CharacterEquipment {
  userId: number;
  weaponId: string | null;
  armorId: string | null;
  accessoryId: string | null;
  updatedAt: Date;
}

// ============================================================================
// ABILITIES SYSTEM
// ============================================================================

export type AbilityType = 'attack' | 'heal' | 'buff' | 'debuff' | 'special';

export interface AbilityRaw {
  id: string;
  name: string;
  description: string;
  type: AbilityType;
  required_level: number;
  mana_cost: number;
  cooldown_turns: number;
  base_value: number;
  scaling_stat: ScalingStat;
  scaling_ratio: number;
  additional_effects: string | null; // JSON
  icon: string;
  animation_text: string;
  created_at: string;
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  type: AbilityType;
  requiredLevel: number;
  manaCost: number;
  cooldownTurns: number;
  baseValue: number;
  scalingStat: ScalingStat;
  scalingRatio: number;
  additionalEffects?: {
    [key: string]: any;
  };
  icon: string;
  animationText: string;
  createdAt: Date;
}

export interface UserAbilityRaw {
  id: number;
  user_id: number;
  ability_id: string;
  unlocked_at: string;
  times_used: number;
}

export interface UserAbility {
  id: number;
  userId: number;
  abilityId: string;
  ability: Ability;
  unlockedAt: Date;
  timesUsed: number;
}

// ============================================================================
// DUNGEON WORLD
// ============================================================================

export interface DungeonFloorRaw {
  floor_number: number;
  name: string;
  description: string;
  recommended_level: number;
  required_level: number;
  enemy_level_range: string; // JSON
  boss_level: number;
  gold_multiplier: number;
  xp_multiplier: number;
  loot_tier: number;
  created_at: string;
}

export interface DungeonFloor {
  floorNumber: number;
  name: string;
  description: string;
  recommendedLevel: number;
  requiredLevel: number;
  enemyLevelRange: {
    min: number;
    max: number;
  };
  bossLevel: number;
  goldMultiplier: number;
  xpMultiplier: number;
  lootTier: number;
  createdAt: Date;
}

// ============================================================================
// ENEMIES
// ============================================================================

export type EnemyBehavior = 'aggressive' | 'defensive' | 'balanced' | 'caster';

export interface EnemyTypeRaw {
  id: string;
  name: string;
  description: string;
  base_health: number;
  base_damage: number;
  base_defense: number;
  behavior_type: EnemyBehavior;
  gold_drop_min: number;
  gold_drop_max: number;
  xp_reward: number;
  loot_table: string | null; // JSON
  icon: string;
  ascii_art: string | null;
  created_at: string;
}

export interface EnemyType {
  id: string;
  name: string;
  description: string;
  baseHealth: number;
  baseDamage: number;
  baseDefense: number;
  behaviorType: EnemyBehavior;
  goldDropMin: number;
  goldDropMax: number;
  xpReward: number;
  lootTable?: Array<{
    item: string;
    chance: number;
  }>;
  icon: string;
  asciiArt?: string;
  createdAt: Date;
}

export interface BossEnemyRaw {
  id: string;
  name: string;
  description: string;
  floor_number: number;
  health: number;
  damage: number;
  defense: number;
  abilities: string; // JSON array
  phases: string | null; // JSON
  gold_reward: number;
  xp_reward: number;
  guaranteed_loot: string | null; // JSON array
  icon: string;
  ascii_art: string | null;
  created_at: string;
}

export interface BossEnemy {
  id: string;
  name: string;
  description: string;
  floorNumber: number;
  health: number;
  damage: number;
  defense: number;
  abilities: string[];
  phases?: Array<{
    hpThreshold: number;
    effect: string;
    description: string;
  }>;
  goldReward: number;
  xpReward: number;
  guaranteedLoot?: string[];
  icon: string;
  asciiArt?: string;
  createdAt: Date;
}

// Active enemy instance during combat
export interface ActiveEnemy {
  id: string;
  name: string;
  currentHealth: number;
  maxHealth: number;
  damage: number;
  defense: number;
  isBoss: boolean;
  icon: string;
  description: string;
}

// ============================================================================
// ENCOUNTERS
// ============================================================================

export type EncounterType = 'combat' | 'treasure' | 'trap' | 'merchant' | 'puzzle' | 'rest';
export type EncounterRarity = 'common' | 'uncommon' | 'rare';

export interface DungeonEncounterRaw {
  id: string;
  type: EncounterType;
  floor_number: number;
  description_prompt: string;
  required_stat: ScalingStat | 'none';
  difficulty_rating: number;
  rewards: string | null; // JSON
  penalties: string | null; // JSON
  rarity: EncounterRarity;
  created_at: string;
}

export interface DungeonEncounter {
  id: string;
  type: EncounterType;
  floorNumber: number;
  descriptionPrompt: string;
  requiredStat: ScalingStat | 'none';
  difficultyRating: number;
  rewards?: {
    gold?: number;
    xp?: number;
    items?: string[];
    heal?: 'full' | number;
  };
  penalties?: {
    damage?: number;
    goldLoss?: number;
  };
  rarity: EncounterRarity;
  createdAt: Date;
}

// ============================================================================
// DUNGEON PROGRESS
// ============================================================================

export interface UserDungeonProgressRaw {
  user_id: number;
  current_floor: number;
  deepest_floor_reached: number;
  in_combat: boolean;
  current_enemy_id: string | null;
  current_enemy_health: number | null;
  current_room_type: string | null;
  total_enemies_defeated: number;
  total_bosses_defeated: number;
  total_floors_cleared: number;
  total_deaths: number;
  total_gold_earned: number;
  total_xp_earned: number;
  last_room_description: string | null;
  last_action_timestamp: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserDungeonProgress {
  userId: number;
  currentFloor: number;
  deepestFloorReached: number;
  inCombat: boolean;
  currentEnemyId: string | null;
  currentEnemyHealth: number | null;
  currentRoomType: string | null;
  totalEnemiesDefeated: number;
  totalBossesDefeated: number;
  totalFloorsCleared: number;
  totalDeaths: number;
  totalGoldEarned: number;
  totalXpEarned: number;
  lastRoomDescription: string | null;
  lastActionTimestamp: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// COMBAT SYSTEM
// ============================================================================

export interface CombatLogRaw {
  id: number;
  user_id: number;
  enemy_type: string;
  enemy_name: string;
  floor_number: number;
  is_boss: boolean;
  victory: boolean;
  turns_taken: number;
  damage_dealt: number;
  damage_taken: number;
  xp_gained: number;
  gold_gained: number;
  items_looted: string | null; // JSON array
  challenges_attempted: number;
  challenges_succeeded: number;
  timestamp: string;
}

export interface CombatLog {
  id: number;
  userId: number;
  enemyType: string;
  enemyName: string;
  floorNumber: number;
  isBoss: boolean;
  victory: boolean;
  turnsTaken: number;
  damageDealt: number;
  damageTaken: number;
  xpGained: number;
  goldGained: number;
  itemsLooted?: string[];
  challengesAttempted: number;
  challengesSucceeded: number;
  timestamp: Date;
}

export interface DungeonSessionRaw {
  user_id: number;
  session_start: string;
  current_room_type: string | null;
  conversation_context: string | null; // JSON
  combat_turn: number;
  enemy_current_health: number | null;
  ability_cooldowns: string | null; // JSON
  last_action: string | null;
  last_result: string | null;
  active_buffs: string | null; // JSON
  active_debuffs: string | null; // JSON
  rooms_visited_this_session: number;
  enemies_defeated_this_session: number;
  updated_at: string;
}

export interface DungeonSession {
  userId: number;
  sessionStart: Date;
  currentRoomType: string | null;
  conversationContext?: string[];
  combatTurn: number;
  enemyCurrentHealth: number | null;
  abilityCooldowns?: Record<string, number>;
  lastAction: string | null;
  lastResult: string | null;
  activeBuffs?: Array<{
    type: string;
    turnsRemaining: number;
  }>;
  activeDebuffs?: Array<{
    type: string;
    turnsRemaining: number;
  }>;
  roomsVisitedThisSession: number;
  enemiesDefeatedThisSession: number;
  updatedAt: Date;
}

// ============================================================================
// CODING CHALLENGES
// ============================================================================

export type ChallengeDifficulty = 'easy' | 'medium' | 'hard';
export type ChallengeActionType = 'basic_attack' | 'spell' | 'heal' | 'defend';

export interface DungeonChallengeRaw {
  id: string;
  difficulty: ChallengeDifficulty;
  action_type: ChallengeActionType;
  title: string;
  description: string;
  starter_code: string;
  solution: string;
  test_cases: string; // JSON
  required_language: string;
  min_floor: number;
  max_floor: number | null;
  times_used: number;
  success_rate: number;
  created_at: string;
}

export interface DungeonChallenge {
  id: string;
  difficulty: ChallengeDifficulty;
  actionType: ChallengeActionType;
  title: string;
  description: string;
  starterCode: string;
  solution: string;
  testCases: Array<{
    input: Record<string, any>;
    expected: any;
  }>;
  requiredLanguage: string;
  minFloor: number;
  maxFloor: number | null;
  timesUsed: number;
  successRate: number;
  createdAt: Date;
}

// ============================================================================
// ACHIEVEMENTS
// ============================================================================

export type AchievementRequirementType =
  | 'enemies_killed'
  | 'floors_cleared'
  | 'boss_defeated'
  | 'perfect_combat'
  | 'close_call'
  | 'perfect_challenges';

export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface DungeonAchievementRaw {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement_type: AchievementRequirementType;
  requirement_value: number;
  requirement_data: string | null; // JSON
  xp_reward: number;
  gold_reward: number;
  unlock_item: string | null;
  rarity: AchievementRarity;
  display_order: number;
  created_at: string;
}

export interface DungeonAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirementType: AchievementRequirementType;
  requirementValue: number;
  requirementData?: any;
  xpReward: number;
  goldReward: number;
  unlockItem: string | null;
  rarity: AchievementRarity;
  displayOrder: number;
  createdAt: Date;
}

export interface UserDungeonAchievementRaw {
  id: number;
  user_id: number;
  achievement_id: string;
  earned_at: string;
  progress: number;
  completed: boolean;
}

export interface UserDungeonAchievement {
  id: number;
  userId: number;
  achievementId: string;
  achievement: DungeonAchievement;
  earnedAt: Date;
  progress: number;
  completed: boolean;
}

// ============================================================================
// COMBAT STATE
// ============================================================================

export interface CombatState {
  active: boolean;
  turn: number;
  player: {
    health: number;
    maxHealth: number;
    mana: number;
    maxMana: number;
    buffs: Array<{ type: string; turnsRemaining: number }>;
    debuffs: Array<{ type: string; turnsRemaining: number }>;
  };
  enemy: ActiveEnemy;
  lastAction: string | null;
  lastResult: string | null;
  combatLog: string[];
  abilityCooldowns: Record<string, number>;
}

// ============================================================================
// CONVERSION FUNCTIONS
// ============================================================================

export function convertCharacterStats(raw: CharacterStatsRaw): CharacterStats {
  return {
    userId: raw.user_id,
    level: raw.level,
    strength: raw.strength,
    intelligence: raw.intelligence,
    dexterity: raw.dexterity,
    maxHealth: raw.max_health,
    currentHealth: raw.current_health,
    maxMana: raw.max_mana,
    currentMana: raw.current_mana,
    baseDamage: raw.base_damage,
    defense: raw.defense,
    criticalChance: raw.critical_chance,
    dodgeChance: raw.dodge_chance,
    statPointsAvailable: raw.stat_points_available,
    createdAt: new Date(raw.created_at),
    updatedAt: new Date(raw.updated_at),
  };
}

export function convertEquipmentItem(raw: EquipmentItemRaw): EquipmentItem {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    slot: raw.slot,
    tier: raw.tier,
    requiredLevel: raw.required_level,
    requiredStrength: raw.required_strength,
    requiredIntelligence: raw.required_intelligence,
    requiredDexterity: raw.required_dexterity,
    damageBonus: raw.damage_bonus,
    defenseBonus: raw.defense_bonus,
    hpBonus: raw.hp_bonus,
    manaBonus: raw.mana_bonus,
    strengthBonus: raw.strength_bonus,
    intelligenceBonus: raw.intelligence_bonus,
    dexterityBonus: raw.dexterity_bonus,
    criticalChanceBonus: raw.critical_chance_bonus,
    dodgeChanceBonus: raw.dodge_chance_bonus,
    specialEffects: raw.special_effects ? JSON.parse(raw.special_effects) : undefined,
    icon: raw.icon,
    value: raw.value,
    createdAt: new Date(raw.created_at),
  };
}

export function convertAbility(raw: AbilityRaw): Ability {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    type: raw.type,
    requiredLevel: raw.required_level,
    manaCost: raw.mana_cost,
    cooldownTurns: raw.cooldown_turns,
    baseValue: raw.base_value,
    scalingStat: raw.scaling_stat,
    scalingRatio: raw.scaling_ratio,
    additionalEffects: raw.additional_effects ? JSON.parse(raw.additional_effects) : undefined,
    icon: raw.icon,
    animationText: raw.animation_text,
    createdAt: new Date(raw.created_at),
  };
}

export function convertDungeonFloor(raw: DungeonFloorRaw): DungeonFloor {
  return {
    floorNumber: raw.floor_number,
    name: raw.name,
    description: raw.description,
    recommendedLevel: raw.recommended_level,
    requiredLevel: raw.required_level,
    enemyLevelRange: JSON.parse(raw.enemy_level_range),
    bossLevel: raw.boss_level,
    goldMultiplier: raw.gold_multiplier,
    xpMultiplier: raw.xp_multiplier,
    lootTier: raw.loot_tier,
    createdAt: new Date(raw.created_at),
  };
}

export function convertEnemyType(raw: EnemyTypeRaw): EnemyType {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    baseHealth: raw.base_health,
    baseDamage: raw.base_damage,
    baseDefense: raw.base_defense,
    behaviorType: raw.behavior_type,
    goldDropMin: raw.gold_drop_min,
    goldDropMax: raw.gold_drop_max,
    xpReward: raw.xp_reward,
    lootTable: raw.loot_table ? JSON.parse(raw.loot_table) : undefined,
    icon: raw.icon,
    asciiArt: raw.ascii_art || undefined,
    createdAt: new Date(raw.created_at),
  };
}

export function convertBossEnemy(raw: BossEnemyRaw): BossEnemy {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    floorNumber: raw.floor_number,
    health: raw.health,
    damage: raw.damage,
    defense: raw.defense,
    abilities: JSON.parse(raw.abilities),
    phases: raw.phases ? JSON.parse(raw.phases) : undefined,
    goldReward: raw.gold_reward,
    xpReward: raw.xp_reward,
    guaranteedLoot: raw.guaranteed_loot ? JSON.parse(raw.guaranteed_loot) : undefined,
    icon: raw.icon,
    asciiArt: raw.ascii_art || undefined,
    createdAt: new Date(raw.created_at),
  };
}

export function convertDungeonChallenge(raw: DungeonChallengeRaw): DungeonChallenge {
  return {
    id: raw.id,
    difficulty: raw.difficulty,
    actionType: raw.action_type,
    title: raw.title,
    description: raw.description,
    starterCode: raw.starter_code,
    solution: raw.solution,
    testCases: JSON.parse(raw.test_cases),
    requiredLanguage: raw.required_language,
    minFloor: raw.min_floor,
    maxFloor: raw.max_floor,
    timesUsed: raw.times_used,
    successRate: raw.success_rate,
    createdAt: new Date(raw.created_at),
  };
}

export function convertDungeonAchievement(raw: DungeonAchievementRaw): DungeonAchievement {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    icon: raw.icon,
    requirementType: raw.requirement_type,
    requirementValue: raw.requirement_value,
    requirementData: raw.requirement_data ? JSON.parse(raw.requirement_data) : undefined,
    xpReward: raw.xp_reward,
    goldReward: raw.gold_reward,
    unlockItem: raw.unlock_item,
    rarity: raw.rarity,
    displayOrder: raw.display_order,
    createdAt: new Date(raw.created_at),
  };
}
