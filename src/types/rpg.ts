// RPG Dungeon System Types

// ============================================================================
// CHARACTER SYSTEM
// ============================================================================

export type ScalingStat = 'strength' | 'intelligence' | 'dexterity' | 'charisma' | 'none';

export interface CharacterStatsRaw {
  user_id: number;
  level: number;
  strength: number;
  intelligence: number;
  dexterity: number;
  charisma: number;
  max_health: number;
  current_health: number;
  max_mana: number;
  current_mana: number;
  base_damage: number;
  defense: number;
  critical_chance: number;
  dodge_chance: number;
  stat_points_available: number;
  current_gold: number;
  created_at: string;
  updated_at: string;
}

export interface CharacterStats {
  userId: number;
  level: number;
  strength: number;
  intelligence: number;
  dexterity: number;
  charisma: number;
  maxHealth: number;
  currentHealth: number;
  maxMana: number;
  currentMana: number;
  baseDamage: number;
  defense: number;
  criticalChance: number;
  dodgeChance: number;
  statPointsAvailable: number;
  currentGold: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// EQUIPMENT SYSTEM
// ============================================================================

export type EquipmentSlot = 'weapon' | 'shield' | 'helmet' | 'chest' | 'boots' | 'armor' | 'accessory';
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
  shield_id: string | null;
  helmet_id: string | null;
  chest_id: string | null;
  boots_id: string | null;
  updated_at: string;
}

export interface CharacterEquipment {
  userId: number;
  weaponId: string | null;
  armorId: string | null;
  accessoryId: string | null;
  shieldId: string | null;
  helmetId: string | null;
  chestId: string | null;
  bootsId: string | null;
  updatedAt: Date;
}

export interface CharacterEquipmentWithDetailsRaw {
  user_id: number;
  weapon_id: string | null;
  weapon: EquipmentItemRaw | null;
  shield_id: string | null;
  shield: EquipmentItemRaw | null;
  helmet_id: string | null;
  helmet: EquipmentItemRaw | null;
  chest_id: string | null;
  chest: EquipmentItemRaw | null;
  boots_id: string | null;
  boots: EquipmentItemRaw | null;
  armor_id: string | null;
  armor: EquipmentItemRaw | null;
  accessory_id: string | null;
  accessory: EquipmentItemRaw | null;
  updated_at: string;
}

export interface CharacterEquipmentWithDetails {
  userId: number;
  weaponId: string | null;
  weapon: EquipmentItem | null;
  shieldId: string | null;
  shield: EquipmentItem | null;
  helmetId: string | null;
  helmet: EquipmentItem | null;
  chestId: string | null;
  chest: EquipmentItem | null;
  bootsId: string | null;
  boots: EquipmentItem | null;
  armorId: string | null;
  armor: EquipmentItem | null;
  accessoryId: string | null;
  accessory: EquipmentItem | null;
  updatedAt: Date;
}

export interface EquipmentInventoryItemRaw {
  id: number;
  user_id: number;
  equipment_id: string;
  equipment: EquipmentItemRaw;
  quantity: number;
  acquired_at: string;
}

export interface EquipmentInventoryItem {
  id: number;
  userId: number;
  equipmentId: string;
  equipment: EquipmentItem;
  quantity: number;
  acquiredAt: Date;
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

export interface UserAbilityWithLevelRaw {
  id: number;
  user_id: number;
  ability_id: string;
  ability: AbilityRaw;
  unlocked_at: string;
  times_used: number;
  current_level: number;
}

export interface UserAbilityWithLevel {
  id: number;
  userId: number;
  abilityId: string;
  ability: Ability;
  unlockedAt: Date;
  timesUsed: number;
  currentLevel: number;
}

export interface AbilityWithUnlockStatusRaw {
  id: string;
  name: string;
  description: string;
  type: AbilityType;
  required_level: number;
  mana_cost: number;
  cooldown_turns: number;
  base_value: number | null;
  scaling_stat: string | null;
  scaling_ratio: number | null;
  additional_effects: string | null;
  icon: string;
  animation_text: string;
  created_at: string;
  is_unlocked: boolean;
  is_active: boolean;
  active_slot: number | null;
}

export interface AbilityWithUnlockStatus {
  id: string;
  name: string;
  description: string;
  type: AbilityType;
  requiredLevel: number;
  manaCost: number;
  cooldownTurns: number;
  baseValue: number | null;
  scalingStat: string | null;
  scalingRatio: number | null;
  additionalEffects: string | null;
  icon: string;
  animationText: string;
  createdAt: Date;
  isUnlocked: boolean;
  isActive: boolean;
  activeSlot: number | null;
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
  attackAnimation?: string; // Path to attack animation GIF
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
  // Multiple choice fields
  choices?: string | null; // JSON array: ["A) ...", "B) ...", "C) ...", "D) ..."]
  correct_answer?: string | null; // Single letter: "A", "B", "C", or "D"
  // Coding challenge fields (optional)
  starter_code?: string | null;
  solution?: string | null;
  test_cases?: string | null; // JSON
  required_language?: string | null;
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
  // Multiple choice fields
  choices?: string[]; // ["A) ...", "B) ...", "C) ...", "D) ..."]
  correctAnswer?: string; // Single letter: "A", "B", "C", or "D"
  // Coding challenge fields (optional)
  starterCode?: string;
  solution?: string;
  testCases?: Array<{
    input: Record<string, any>;
    expected: any;
  }>;
  requiredLanguage?: string;
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
    charisma: raw.charisma,
    maxHealth: raw.max_health,
    currentHealth: raw.current_health,
    maxMana: raw.max_mana,
    currentMana: raw.current_mana,
    baseDamage: raw.base_damage,
    defense: raw.defense,
    criticalChance: raw.critical_chance,
    dodgeChance: raw.dodge_chance,
    statPointsAvailable: raw.stat_points_available,
    currentGold: raw.current_gold,
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

export function convertCharacterEquipmentWithDetails(raw: CharacterEquipmentWithDetailsRaw): CharacterEquipmentWithDetails {
  return {
    userId: raw.user_id,
    weaponId: raw.weapon_id,
    weapon: raw.weapon ? convertEquipmentItem(raw.weapon) : null,
    shieldId: raw.shield_id,
    shield: raw.shield ? convertEquipmentItem(raw.shield) : null,
    helmetId: raw.helmet_id,
    helmet: raw.helmet ? convertEquipmentItem(raw.helmet) : null,
    chestId: raw.chest_id,
    chest: raw.chest ? convertEquipmentItem(raw.chest) : null,
    bootsId: raw.boots_id,
    boots: raw.boots ? convertEquipmentItem(raw.boots) : null,
    armorId: raw.armor_id,
    armor: raw.armor ? convertEquipmentItem(raw.armor) : null,
    accessoryId: raw.accessory_id,
    accessory: raw.accessory ? convertEquipmentItem(raw.accessory) : null,
    updatedAt: new Date(raw.updated_at),
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

export function convertEquipmentInventoryItem(raw: EquipmentInventoryItemRaw): EquipmentInventoryItem {
  return {
    id: raw.id,
    userId: raw.user_id,
    equipmentId: raw.equipment_id,
    equipment: convertEquipmentItem(raw.equipment),
    quantity: raw.quantity,
    acquiredAt: new Date(raw.acquired_at),
  };
}

export function convertUserAbilityWithLevel(raw: UserAbilityWithLevelRaw): UserAbilityWithLevel {
  return {
    id: raw.id,
    userId: raw.user_id,
    abilityId: raw.ability_id,
    ability: convertAbility(raw.ability),
    unlockedAt: new Date(raw.unlocked_at),
    timesUsed: raw.times_used,
    currentLevel: raw.current_level,
  };
}

export function convertAbilityWithUnlockStatus(raw: AbilityWithUnlockStatusRaw): AbilityWithUnlockStatus {
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
    isUnlocked: raw.is_unlocked,
    isActive: raw.is_active,
    activeSlot: raw.active_slot,
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

export function convertEnemyTypeToRaw(enemy: EnemyType): EnemyTypeRaw {
  return {
    id: enemy.id,
    name: enemy.name,
    description: enemy.description,
    base_health: enemy.baseHealth,
    base_damage: enemy.baseDamage,
    base_defense: enemy.baseDefense,
    behavior_type: enemy.behaviorType,
    gold_drop_min: enemy.goldDropMin,
    gold_drop_max: enemy.goldDropMax,
    xp_reward: enemy.xpReward,
    loot_table: enemy.lootTable ? JSON.stringify(enemy.lootTable) : undefined,
    icon: enemy.icon,
    ascii_art: enemy.asciiArt,
    created_at: enemy.createdAt.toISOString(),
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

export function convertBossEnemyToRaw(boss: BossEnemy): BossEnemyRaw {
  return {
    id: boss.id,
    name: boss.name,
    description: boss.description,
    floor_number: boss.floorNumber,
    health: boss.health,
    damage: boss.damage,
    defense: boss.defense,
    abilities: JSON.stringify(boss.abilities),
    phases: boss.phases ? JSON.stringify(boss.phases) : undefined,
    gold_reward: boss.goldReward,
    xp_reward: boss.xpReward,
    guaranteed_loot: boss.guaranteedLoot ? JSON.stringify(boss.guaranteedLoot) : undefined,
    icon: boss.icon,
    ascii_art: boss.asciiArt,
    created_at: boss.createdAt.toISOString(),
  };
}

export function convertDungeonChallenge(raw: DungeonChallengeRaw): DungeonChallenge {
  return {
    id: raw.id,
    difficulty: raw.difficulty,
    actionType: raw.action_type,
    title: raw.title,
    description: raw.description,
    // Multiple choice fields
    choices: raw.choices ? JSON.parse(raw.choices) : undefined,
    correctAnswer: raw.correct_answer || undefined,
    // Coding challenge fields (optional)
    starterCode: raw.starter_code || undefined,
    solution: raw.solution || undefined,
    testCases: raw.test_cases ? JSON.parse(raw.test_cases) : undefined,
    requiredLanguage: raw.required_language || undefined,
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

// ============================================================================
// NARRATIVE DUNGEON SYSTEM
// ============================================================================

export type NarrativeLocationType = 'start' | 'choice_point' | 'combat' | 'skill_check' | 'treasure' | 'rest' | 'boss' | 'exit';
export type SkillType = 'strength' | 'intelligence' | 'dexterity' | 'charisma';
export type OutcomeType = 'success' | 'failure' | 'critical_success' | 'critical_failure' | 'default';

export interface NarrativeLocationRaw {
  id: string;
  floor_number: number;
  name: string;
  description: string;
  location_type: NarrativeLocationType;
  is_repeatable: boolean;
  icon: string;
  created_at: string;
}

export interface NarrativeLocation {
  id: string;
  floorNumber: number;
  name: string;
  description: string;
  locationType: NarrativeLocationType;
  isRepeatable: boolean;
  icon: string;
  createdAt: Date;
}

export interface NarrativeChoiceRaw {
  id: string;
  location_id: string;
  choice_text: string;
  requires_skill_check: boolean;
  skill_type: SkillType | null;
  skill_dc: number | null;
  challenge_action_type: ChallengeActionType | null;
  display_order: number;
  icon: string | null;
  requires_flag: string | null; // JSON
  created_at: string;
}

export interface NarrativeChoice {
  id: string;
  locationId: string;
  choiceText: string;
  requiresSkillCheck: boolean;
  skillType: SkillType | null;
  skillDc: number | null;
  challengeActionType: ChallengeActionType | null;
  displayOrder: number;
  icon: string | null;
  requiresFlag?: Record<string, boolean>;
  createdAt: Date;
}

export interface NarrativeOutcomeRaw {
  id: string;
  choice_id: string;
  outcome_type: OutcomeType;
  description: string;
  next_location_id: string | null;
  rewards: string | null; // JSON
  penalties: string | null; // JSON
  sets_flags: string | null; // JSON
  triggers_combat: boolean;
  enemy_id: string | null;
  enemy_count: number;
  created_at: string;
}

export interface NarrativeOutcome {
  id: string;
  choiceId: string;
  outcomeType: OutcomeType;
  description: string;
  nextLocationId: string | null;
  rewards?: {
    gold?: number;
    xp?: number;
    items?: string[];
  };
  penalties?: {
    damage?: number;
    goldLoss?: number;
  };
  setsFlags?: Record<string, boolean>;
  triggersCombat: boolean;
  enemyId: string | null;
  enemyCount: number;
  createdAt: Date;
}

export interface UserNarrativeProgressRaw {
  user_id: number;
  floor_number: number;
  current_location_id: string | null;
  visited_locations: string | null; // JSON array
  completed_choices: string | null; // JSON array
  story_flags: string | null; // JSON object
  last_roll: number | null;
  last_skill_type: string | null;
  last_skill_dc: number | null;
  last_modifier: number | null;
  last_challenge_success: boolean | null;
  total_skill_checks: number;
  successful_skill_checks: number;
  created_at: string;
  updated_at: string;
}

export interface UserNarrativeProgress {
  userId: number;
  floorNumber: number;
  currentLocationId: string | null;
  visitedLocations: string[];
  completedChoices: string[];
  storyFlags: Record<string, boolean>;
  lastRoll: number | null;
  lastSkillType: SkillType | null;
  lastSkillDc: number | null;
  lastModifier: number | null;
  lastChallengeSuccess: boolean | null;
  totalSkillChecks: number;
  successfulSkillChecks: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SkillCheckHistoryRaw {
  id: number;
  user_id: number;
  choice_id: string;
  skill_type: SkillType;
  skill_dc: number;
  dice_roll: number;
  stat_modifier: number;
  challenge_success: boolean;
  total_roll: number;
  check_passed: boolean;
  outcome_type: OutcomeType;
  timestamp: string;
}

export interface SkillCheckHistory {
  id: number;
  userId: number;
  choiceId: string;
  skillType: SkillType;
  skillDc: number;
  diceRoll: number;
  statModifier: number;
  challengeSuccess: boolean;
  totalRoll: number;
  checkPassed: boolean;
  outcomeType: OutcomeType;
  timestamp: Date;
}

export interface SkillCheckResult {
  dice_roll: number;
  stat_modifier: number;
  challenge_success: boolean;
  applied_modifier: number;
  total_roll: number;
  dc: number;
  check_passed: boolean;
  outcome_type: OutcomeType;
  outcome: NarrativeOutcomeRaw;
}

// ============================================================================
// NARRATIVE CONVERSION FUNCTIONS
// ============================================================================

export function convertNarrativeLocation(raw: NarrativeLocationRaw): NarrativeLocation {
  return {
    id: raw.id,
    floorNumber: raw.floor_number,
    name: raw.name,
    description: raw.description,
    locationType: raw.location_type,
    isRepeatable: raw.is_repeatable,
    icon: raw.icon,
    createdAt: new Date(raw.created_at),
  };
}

export function convertNarrativeChoice(raw: NarrativeChoiceRaw): NarrativeChoice {
  return {
    id: raw.id,
    locationId: raw.location_id,
    choiceText: raw.choice_text,
    requiresSkillCheck: raw.requires_skill_check,
    skillType: raw.skill_type,
    skillDc: raw.skill_dc,
    challengeActionType: raw.challenge_action_type,
    displayOrder: raw.display_order,
    icon: raw.icon,
    requiresFlag: raw.requires_flag ? JSON.parse(raw.requires_flag) : undefined,
    createdAt: new Date(raw.created_at),
  };
}

export function convertNarrativeOutcome(raw: NarrativeOutcomeRaw): NarrativeOutcome {
  return {
    id: raw.id,
    choiceId: raw.choice_id,
    outcomeType: raw.outcome_type,
    description: raw.description,
    nextLocationId: raw.next_location_id,
    rewards: raw.rewards ? JSON.parse(raw.rewards) : undefined,
    penalties: raw.penalties ? JSON.parse(raw.penalties) : undefined,
    setsFlags: raw.sets_flags ? JSON.parse(raw.sets_flags) : undefined,
    triggersCombat: raw.triggers_combat,
    enemyId: raw.enemy_id,
    enemyCount: raw.enemy_count,
    createdAt: new Date(raw.created_at),
  };
}

export function convertUserNarrativeProgress(raw: UserNarrativeProgressRaw): UserNarrativeProgress {
  return {
    userId: raw.user_id,
    floorNumber: raw.floor_number,
    currentLocationId: raw.current_location_id,
    visitedLocations: raw.visited_locations ? JSON.parse(raw.visited_locations) : [],
    completedChoices: raw.completed_choices ? JSON.parse(raw.completed_choices) : [],
    storyFlags: raw.story_flags ? JSON.parse(raw.story_flags) : {},
    lastRoll: raw.last_roll,
    lastSkillType: raw.last_skill_type as SkillType | null,
    lastSkillDc: raw.last_skill_dc,
    lastModifier: raw.last_modifier,
    lastChallengeSuccess: raw.last_challenge_success,
    totalSkillChecks: raw.total_skill_checks,
    successfulSkillChecks: raw.successful_skill_checks,
    createdAt: new Date(raw.created_at),
    updatedAt: new Date(raw.updated_at),
  };
}

export function convertSkillCheckHistory(raw: SkillCheckHistoryRaw): SkillCheckHistory {
  return {
    id: raw.id,
    userId: raw.user_id,
    choiceId: raw.choice_id,
    skillType: raw.skill_type,
    skillDc: raw.skill_dc,
    diceRoll: raw.dice_roll,
    statModifier: raw.stat_modifier,
    challengeSuccess: raw.challenge_success,
    totalRoll: raw.total_roll,
    checkPassed: raw.check_passed,
    outcomeType: raw.outcome_type,
    timestamp: new Date(raw.timestamp),
  };
}

// ============================================================================
// SHOP SYSTEM
// ============================================================================

export type ConsumableType = 'health_potion' | 'mana_potion' | 'buff_potion' | 'scroll';

export interface ConsumableItemRaw {
  id: string;
  name: string;
  description: string;
  type: ConsumableType;
  health_restore: number;
  mana_restore: number;
  buff_type: string | null;
  buff_value: number;
  buff_duration_turns: number;
  buy_price: number;
  sell_price: number;
  icon: string;
  tier: EquipmentTier;
  stack_size: number;
  created_at: string;
}

export interface ConsumableItem {
  id: string;
  name: string;
  description: string;
  type: ConsumableType;
  healthRestore: number;
  manaRestore: number;
  buffType?: string;
  buffValue: number;
  buffDurationTurns: number;
  buyPrice: number;
  sellPrice: number;
  icon: string;
  tier: EquipmentTier;
  stackSize: number;
  createdAt: Date;
}

export interface UserConsumableInventoryItemRaw {
  id: number;
  user_id: number;
  consumable_id: string;
  consumable: ConsumableItemRaw;
  quantity: number;
  acquired_at: string;
}

export interface UserConsumableInventoryItem {
  id: number;
  userId: number;
  consumableId: string;
  consumable: ConsumableItem;
  quantity: number;
  acquiredAt: Date;
}

export type ShopItemType = 'equipment' | 'consumable';

export type ShopItem =
  | {
      itemType: 'Equipment';
      shop_id: number;
      equipment: EquipmentItemRaw;
      price: number;
      in_stock: boolean;
      required_level: number;
    }
  | {
      itemType: 'Consumable';
      shop_id: number;
      consumable: ConsumableItemRaw;
      price: number;
      in_stock: boolean;
      required_level: number;
    };

export interface ShopItemDisplay {
  shopId: number;
  itemType: ShopItemType;
  itemId: string;
  name: string;
  description: string;
  icon: string;
  tier: EquipmentTier;
  price: number;
  inStock: boolean;
  requiredLevel: number;
  item: EquipmentItem | ConsumableItem;
}

// Converter functions
export function convertConsumableItem(raw: ConsumableItemRaw): ConsumableItem {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    type: raw.type,
    healthRestore: raw.health_restore,
    manaRestore: raw.mana_restore,
    buffType: raw.buff_type || undefined,
    buffValue: raw.buff_value,
    buffDurationTurns: raw.buff_duration_turns,
    buyPrice: raw.buy_price,
    sellPrice: raw.sell_price,
    icon: raw.icon,
    tier: raw.tier,
    stackSize: raw.stack_size,
    createdAt: new Date(raw.created_at),
  };
}

export function convertUserConsumableInventoryItem(raw: UserConsumableInventoryItemRaw): UserConsumableInventoryItem {
  return {
    id: raw.id,
    userId: raw.user_id,
    consumableId: raw.consumable_id,
    consumable: convertConsumableItem(raw.consumable),
    quantity: raw.quantity,
    acquiredAt: new Date(raw.acquired_at),
  };
}

export function convertShopItem(raw: ShopItem): ShopItemDisplay {
  if (raw.itemType === 'Equipment') {
    const equipment = convertEquipmentItem(raw.equipment);
    return {
      shopId: raw.shop_id,
      itemType: 'equipment',
      itemId: raw.equipment.id,
      name: raw.equipment.name,
      description: raw.equipment.description,
      icon: raw.equipment.icon,
      tier: raw.equipment.tier,
      price: raw.price,
      inStock: raw.in_stock,
      requiredLevel: raw.required_level,
      item: equipment,
    };
  } else {
    const consumable = convertConsumableItem(raw.consumable);
    return {
      shopId: raw.shop_id,
      itemType: 'consumable',
      itemId: raw.consumable.id,
      name: raw.consumable.name,
      description: raw.consumable.description,
      icon: raw.consumable.icon,
      tier: raw.consumable.tier,
      price: raw.price,
      inStock: raw.in_stock,
      requiredLevel: raw.required_level,
      item: consumable,
    };
  }
}
