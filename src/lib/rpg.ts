// RPG System API - TypeScript wrapper for Tauri commands
import { invoke } from '@tauri-apps/api/core';
import type {
  CharacterStats,
  CharacterStatsRaw,
  EquipmentItem,
  EquipmentItemRaw,
  CharacterEquipment,
  CharacterEquipmentRaw,
  EquipmentInventoryItem,
  EquipmentInventoryItemRaw,
  Ability,
  AbilityRaw,
  UserAbilityWithLevel,
  UserAbilityWithLevelRaw,
  AbilityWithUnlockStatus,
  AbilityWithUnlockStatusRaw,
  DungeonFloor,
  DungeonFloorRaw,
  UserDungeonProgress,
  UserDungeonProgressRaw,
  EnemyType,
  EnemyTypeRaw,
  BossEnemy,
  BossEnemyRaw,
  DungeonEncounter,
  DungeonEncounterRaw,
  DungeonChallenge,
  DungeonChallengeRaw,
  NarrativeLocation,
  NarrativeLocationRaw,
  NarrativeChoice,
  NarrativeChoiceRaw,
  NarrativeOutcome,
  NarrativeOutcomeRaw,
  UserNarrativeProgress,
  UserNarrativeProgressRaw,
  SkillCheckResult,
  ShopItem,
  ShopItemDisplay,
  ShopItemType,
  ConsumableItem,
  ConsumableItemRaw,
  UserConsumableInventoryItem,
  UserConsumableInventoryItemRaw,
} from '../types/rpg';
import {
  convertCharacterStats,
  convertEquipmentItem,
  convertEquipmentInventoryItem,
  convertAbility,
  convertUserAbilityWithLevel,
  convertAbilityWithUnlockStatus,
  convertDungeonFloor,
  convertEnemyType,
  convertEnemyTypeToRaw,
  convertBossEnemy,
  convertBossEnemyToRaw,
  convertDungeonChallenge,
  convertNarrativeLocation,
  convertNarrativeChoice,
  convertNarrativeOutcome,
  convertUserNarrativeProgress,
  convertShopItem,
  convertUserConsumableInventoryItem,
} from '../types/rpg';

// ============================================================================
// CHARACTER MANAGEMENT
// ============================================================================

export async function getCharacterStats(userId: number): Promise<CharacterStats> {
  const raw = await invoke<CharacterStatsRaw>('get_character_stats', { userId });
  return convertCharacterStats(raw);
}

export async function updateCharacterHealth(
  userId: number,
  currentHealth: number
): Promise<CharacterStats> {
  const raw = await invoke<CharacterStatsRaw>('update_character_health', {
    userId,
    currentHealth,
  });
  return convertCharacterStats(raw);
}

export async function updateCharacterMana(
  userId: number,
  currentMana: number
): Promise<CharacterStats> {
  const raw = await invoke<CharacterStatsRaw>('update_character_mana', {
    userId,
    currentMana,
  });
  return convertCharacterStats(raw);
}

export async function distributeStatPoints(
  userId: number,
  strengthIncrease: number,
  intelligenceIncrease: number,
  dexterityIncrease: number
): Promise<CharacterStats> {
  const raw = await invoke<CharacterStatsRaw>('distribute_stat_points', {
    userId,
    strengthIncrease,
    intelligenceIncrease,
    dexterityIncrease,
  });
  return convertCharacterStats(raw);
}

export async function restoreHealthAndMana(userId: number): Promise<CharacterStats> {
  const raw = await invoke<CharacterStatsRaw>('restore_health_and_mana', { userId });
  return convertCharacterStats(raw);
}

// ============================================================================
// EQUIPMENT MANAGEMENT
// ============================================================================

export async function getEquipmentItems(): Promise<EquipmentItem[]> {
  const rawItems = await invoke<EquipmentItemRaw[]>('get_equipment_items');
  return rawItems.map(convertEquipmentItem);
}

export async function getCharacterEquipment(userId: number): Promise<CharacterEquipment> {
  const raw = await invoke<CharacterEquipmentRaw>('get_character_equipment', { userId });
  return {
    userId: raw.user_id,
    weaponId: raw.weapon_id,
    armorId: raw.armor_id,
    accessoryId: raw.accessory_id,
    shieldId: raw.shield_id,
    helmetId: raw.helmet_id,
    chestId: raw.chest_id,
    bootsId: raw.boots_id,
    updatedAt: new Date(raw.updated_at),
  };
}

export async function equipItem(
  userId: number,
  itemId: string,
  slot: string
): Promise<CharacterEquipment> {
  const raw = await invoke<CharacterEquipmentRaw>('equip_item', {
    userId,
    itemId,
    slot,
  });
  return {
    userId: raw.user_id,
    weaponId: raw.weapon_id,
    armorId: raw.armor_id,
    accessoryId: raw.accessory_id,
    shieldId: raw.shield_id,
    helmetId: raw.helmet_id,
    chestId: raw.chest_id,
    bootsId: raw.boots_id,
    updatedAt: new Date(raw.updated_at),
  };
}

export async function unequipItem(userId: number, slot: string): Promise<CharacterEquipment> {
  const raw = await invoke<CharacterEquipmentRaw>('unequip_item', {
    userId,
    slot,
  });
  return {
    userId: raw.user_id,
    weaponId: raw.weapon_id,
    armorId: raw.armor_id,
    accessoryId: raw.accessory_id,
    shieldId: raw.shield_id,
    helmetId: raw.helmet_id,
    chestId: raw.chest_id,
    bootsId: raw.boots_id,
    updatedAt: new Date(raw.updated_at),
  };
}

// ============================================================================
// CHARACTER SHEET & PROGRESSION
// ============================================================================

export async function getEquipmentInventory(userId: number): Promise<EquipmentInventoryItem[]> {
  const rawItems = await invoke<EquipmentInventoryItemRaw[]>('get_equipment_inventory', { userId });
  return rawItems.map(convertEquipmentInventoryItem);
}

export async function equipItemToSlot(
  userId: number,
  equipmentId: string,
  slot: string
): Promise<CharacterEquipment> {
  const raw = await invoke<CharacterEquipmentRaw>('equip_item_to_slot', {
    userId,
    equipmentId,
    slot,
  });
  return {
    userId: raw.user_id,
    weaponId: raw.weapon_id,
    armorId: raw.armor_id,
    accessoryId: raw.accessory_id,
    shieldId: raw.shield_id,
    helmetId: raw.helmet_id,
    chestId: raw.chest_id,
    bootsId: raw.boots_id,
    updatedAt: new Date(raw.updated_at),
  };
}

export async function unequipItemFromSlot(userId: number, slot: string): Promise<CharacterEquipment> {
  const raw = await invoke<CharacterEquipmentRaw>('unequip_item_from_slot', {
    userId,
    slot,
  });
  return {
    userId: raw.user_id,
    weaponId: raw.weapon_id,
    armorId: raw.armor_id,
    accessoryId: raw.accessory_id,
    shieldId: raw.shield_id,
    helmetId: raw.helmet_id,
    chestId: raw.chest_id,
    bootsId: raw.boots_id,
    updatedAt: new Date(raw.updated_at),
  };
}

export async function spendStatPointOnHealth(userId: number): Promise<CharacterStats> {
  const raw = await invoke<CharacterStatsRaw>('spend_stat_point_on_health', { userId });
  return convertCharacterStats(raw);
}

export async function spendStatPointOnMana(userId: number): Promise<CharacterStats> {
  const raw = await invoke<CharacterStatsRaw>('spend_stat_point_on_mana', { userId });
  return convertCharacterStats(raw);
}

export async function spendStatPointOnStat(
  userId: number,
  statName: 'strength' | 'intelligence' | 'dexterity' | 'charisma'
): Promise<CharacterStats> {
  const raw = await invoke<CharacterStatsRaw>('spend_stat_point_on_stat', {
    userId,
    statName,
  });
  return convertCharacterStats(raw);
}

export async function spendStatPointOnAbility(
  userId: number,
  abilityId: string
): Promise<CharacterStats> {
  const raw = await invoke<CharacterStatsRaw>('spend_stat_point_on_ability', {
    userId,
    abilityId,
  });
  return convertCharacterStats(raw);
}

export async function getUserAbilitiesWithLevels(userId: number): Promise<UserAbilityWithLevel[]> {
  const rawAbilities = await invoke<UserAbilityWithLevelRaw[]>('get_user_abilities_with_levels', {
    userId,
  });
  return rawAbilities.map(convertUserAbilityWithLevel);
}

// ============================================================================
// ABILITIES
// ============================================================================

export async function getUserAbilities(userId: number): Promise<Ability[]> {
  const rawAbilities = await invoke<AbilityRaw[]>('get_user_abilities', { userId });
  return rawAbilities.map(convertAbility);
}

export async function unlockAbility(userId: number, abilityId: string): Promise<void> {
  await invoke('unlock_ability', { userId, abilityId });
}

export async function checkAbilityUnlocks(userId: number): Promise<Ability[]> {
  const rawAbilities = await invoke<AbilityRaw[]>('check_ability_unlocks', { userId });
  return rawAbilities.map(convertAbility);
}

export async function getAllAbilitiesWithStatus(
  userId: number
): Promise<AbilityWithUnlockStatus[]> {
  const rawAbilities = await invoke<AbilityWithUnlockStatusRaw[]>('get_all_abilities_with_status', {
    userId,
  });
  return rawAbilities.map(convertAbilityWithUnlockStatus);
}

export async function setActiveAbility(
  userId: number,
  abilityId: string,
  slotNumber: number
): Promise<void> {
  await invoke('set_active_ability', { userId, abilityId, slotNumber });
}

export async function removeActiveAbility(userId: number, slotNumber: number): Promise<void> {
  await invoke('remove_active_ability', { userId, slotNumber });
}

// ============================================================================
// DUNGEON EXPLORATION
// ============================================================================

export async function getDungeonFloor(floorNumber: number): Promise<DungeonFloor> {
  const raw = await invoke<DungeonFloorRaw>('get_dungeon_floor', { floorNumber });
  return convertDungeonFloor(raw);
}

export async function getAvailableFloors(): Promise<DungeonFloor[]> {
  const rawFloors = await invoke<DungeonFloorRaw[]>('get_available_floors');
  return rawFloors.map(convertDungeonFloor);
}

export async function getUserDungeonProgress(userId: number): Promise<UserDungeonProgress> {
  const raw = await invoke<UserDungeonProgressRaw>('get_user_dungeon_progress', { userId });
  return {
    userId: raw.user_id,
    currentFloor: raw.current_floor,
    deepestFloorReached: raw.deepest_floor_reached,
    inCombat: raw.in_combat,
    currentEnemyId: raw.current_enemy_id,
    currentEnemyHealth: raw.current_enemy_health,
    currentRoomType: raw.current_room_type,
    totalEnemiesDefeated: raw.total_enemies_defeated,
    totalBossesDefeated: raw.total_bosses_defeated,
    totalFloorsCleared: raw.total_floors_cleared,
    totalDeaths: raw.total_deaths,
    totalGoldEarned: raw.total_gold_earned,
    totalXpEarned: raw.total_xp_earned,
    lastRoomDescription: raw.last_room_description,
    lastActionTimestamp: raw.last_action_timestamp ? new Date(raw.last_action_timestamp) : null,
    createdAt: new Date(raw.created_at),
    updatedAt: new Date(raw.updated_at),
  };
}

export async function updateDungeonFloor(
  userId: number,
  floorNumber: number
): Promise<UserDungeonProgress> {
  const raw = await invoke<UserDungeonProgressRaw>('update_dungeon_floor', {
    userId,
    floorNumber,
  });
  return {
    userId: raw.user_id,
    currentFloor: raw.current_floor,
    deepestFloorReached: raw.deepest_floor_reached,
    inCombat: raw.in_combat,
    currentEnemyId: raw.current_enemy_id,
    currentEnemyHealth: raw.current_enemy_health,
    currentRoomType: raw.current_room_type,
    totalEnemiesDefeated: raw.total_enemies_defeated,
    totalBossesDefeated: raw.total_bosses_defeated,
    totalFloorsCleared: raw.total_floors_cleared,
    totalDeaths: raw.total_deaths,
    totalGoldEarned: raw.total_gold_earned,
    totalXpEarned: raw.total_xp_earned,
    lastRoomDescription: raw.last_room_description,
    lastActionTimestamp: raw.last_action_timestamp ? new Date(raw.last_action_timestamp) : null,
    createdAt: new Date(raw.created_at),
    updatedAt: new Date(raw.updated_at),
  };
}

// ============================================================================
// ENEMIES
// ============================================================================

export async function getRandomEnemyForFloor(floorNumber: number): Promise<EnemyType> {
  const raw = await invoke<EnemyTypeRaw>('get_random_enemy_for_floor', { floorNumber });
  return convertEnemyType(raw);
}

export async function getBossForFloor(floorNumber: number): Promise<BossEnemy> {
  const raw = await invoke<BossEnemyRaw>('get_boss_for_floor', { floorNumber });
  return convertBossEnemy(raw);
}

export async function getEnemyById(enemyId: string): Promise<EnemyType> {
  const raw = await invoke<EnemyTypeRaw>('get_enemy_by_id', { enemyId });
  return convertEnemyType(raw);
}

// ============================================================================
// ENCOUNTERS
// ============================================================================

export async function getRandomEncounter(
  floorNumber: number,
  encounterType: string
): Promise<DungeonEncounter> {
  const raw = await invoke<DungeonEncounterRaw>('get_random_encounter', {
    floorNumber,
    encounterType,
  });
  return {
    id: raw.id,
    type: raw.encounter_type as any,
    floorNumber: raw.floor_number,
    descriptionPrompt: raw.description_prompt,
    requiredStat: raw.required_stat as any,
    difficultyRating: raw.difficulty_rating,
    rewards: raw.rewards ? JSON.parse(raw.rewards) : undefined,
    penalties: raw.penalties ? JSON.parse(raw.penalties) : undefined,
    rarity: raw.rarity as any,
    createdAt: new Date(raw.created_at),
  };
}

// ============================================================================
// CHALLENGES
// ============================================================================

export async function getChallengeForAction(
  actionType: string,
  floorNumber: number,
  difficulty?: string
): Promise<DungeonChallenge> {
  const raw = await invoke<DungeonChallengeRaw>('get_challenge_for_action', {
    actionType,
    floorNumber,
    difficulty,
  });
  return convertDungeonChallenge(raw);
}

export async function recordChallengeAttempt(
  userId: number,
  challengeId: string,
  success: boolean,
  timeTakenSeconds: number
): Promise<void> {
  await invoke('record_challenge_attempt', {
    userId,
    challengeId,
    success,
    timeTakenSeconds,
  });
}

// ============================================================================
// COMBAT
// ============================================================================

export interface ActiveCombat {
  userId: number;
  enemyId: string;
  enemyName: string;
  enemyCurrentHealth: number;
  enemyMaxHealth: number;
  enemyDamage: number;
  enemyDefense: number;
  isBoss: boolean;
  icon: string;
  combatTurn: number;
  abilityCooldowns?: Record<string, number>;
  activeBuffs?: Array<{ type: string; turnsRemaining: number }>;
  activeDebuffs?: Array<{ type: string; turnsRemaining: number }>;
}

export interface DamageResult {
  damage: number;
  isCritical: boolean;
  isDodged: boolean;
}

export interface CombatTurnResult {
  playerDamageDealt: number;
  playerDamageTaken: number;
  enemyCurrentHealth: number;
  playerCurrentHealth: number;
  playerCurrentMana: number;
  enemyDefeated: boolean;
  playerDefeated: boolean;
  isCritical: boolean;
  isDodged: boolean;
  turnNumber: number;
}

export interface CombatRewards {
  xpGained: number;
  goldGained: number;
  itemsLooted: string[];
}

export async function startCombat(userId: number, enemy: EnemyType): Promise<ActiveCombat> {
  // Convert enemy to raw format for Rust backend
  const enemyRaw = convertEnemyTypeToRaw(enemy);
  const result = await invoke<any>('start_combat', { userId, enemy: enemyRaw });
  return {
    userId: result.user_id,
    enemyId: result.enemy_id,
    enemyName: result.enemy_name,
    enemyCurrentHealth: result.enemy_current_health,
    enemyMaxHealth: result.enemy_max_health,
    enemyDamage: result.enemy_damage,
    enemyDefense: result.enemy_defense,
    isBoss: result.is_boss,
    icon: result.icon,
    combatTurn: result.combat_turn,
    abilityCooldowns: result.ability_cooldowns ? JSON.parse(result.ability_cooldowns) : undefined,
    activeBuffs: result.active_buffs ? JSON.parse(result.active_buffs) : undefined,
    activeDebuffs: result.active_debuffs ? JSON.parse(result.active_debuffs) : undefined,
  };
}

export async function startBossCombat(userId: number, boss: BossEnemy): Promise<ActiveCombat> {
  // Convert boss to raw format for Rust backend
  const bossRaw = convertBossEnemyToRaw(boss);
  const result = await invoke<any>('start_boss_combat', { userId, boss: bossRaw });
  return {
    userId: result.user_id,
    enemyId: result.enemy_id,
    enemyName: result.enemy_name,
    enemyCurrentHealth: result.enemy_current_health,
    enemyMaxHealth: result.enemy_max_health,
    enemyDamage: result.enemy_damage,
    enemyDefense: result.enemy_defense,
    isBoss: result.is_boss,
    icon: result.icon,
    combatTurn: result.combat_turn,
    abilityCooldowns: result.ability_cooldowns ? JSON.parse(result.ability_cooldowns) : undefined,
    activeBuffs: result.active_buffs ? JSON.parse(result.active_buffs) : undefined,
    activeDebuffs: result.active_debuffs ? JSON.parse(result.active_debuffs) : undefined,
  };
}

export async function executeCombatTurn(
  userId: number,
  abilityId: string,
  challengeSuccess: boolean
): Promise<CombatTurnResult> {
  const result = await invoke<any>('execute_combat_turn', {
    userId,
    abilityId,
    challengeSuccess,
  });
  return {
    playerDamageDealt: result.player_damage_dealt,
    playerDamageTaken: result.player_damage_taken,
    enemyCurrentHealth: result.enemy_current_health,
    playerCurrentHealth: result.player_current_health,
    playerCurrentMana: result.player_current_mana,
    enemyDefeated: result.enemy_defeated,
    playerDefeated: result.player_defeated,
    isCritical: result.is_critical,
    isDodged: result.is_dodged,
    turnNumber: result.turn_number,
  };
}

export async function endCombatVictory(
  userId: number,
  enemy: EnemyType,
  turnsTaken: number,
  damageDealt: number,
  damageTaken: number
): Promise<CombatRewards> {
  // Convert enemy to raw format for Rust backend
  const enemyRaw = convertEnemyTypeToRaw(enemy);
  const result = await invoke<any>('end_combat_victory', {
    userId,
    enemy: enemyRaw,
    turnsTaken,
    damageDealt,
    damageTaken,
  });
  return {
    xpGained: result.xp_gained,
    goldGained: result.gold_gained,
    itemsLooted: result.items_looted,
  };
}

export async function endCombatDefeat(userId: number): Promise<void> {
  await invoke('end_combat_defeat', { userId });
}

// ============================================================================
// NARRATIVE DUNGEON SYSTEM
// ============================================================================

export async function rollD20(): Promise<number> {
  return await invoke<number>('roll_d20');
}

export async function getUserNarrativeProgress(userId: number): Promise<UserNarrativeProgress> {
  const raw = await invoke<UserNarrativeProgressRaw>('get_user_narrative_progress', { userId });
  return convertUserNarrativeProgress(raw);
}

export async function getNarrativeLocation(locationId: string): Promise<NarrativeLocation> {
  const raw = await invoke<NarrativeLocationRaw>('get_narrative_location', { locationId });
  return convertNarrativeLocation(raw);
}

export async function getLocationChoices(locationId: string, userId: number): Promise<NarrativeChoice[]> {
  const rawChoices = await invoke<NarrativeChoiceRaw[]>('get_location_choices', { locationId, userId });
  return rawChoices.map(convertNarrativeChoice);
}

export async function startNarrativeDungeon(
  userId: number,
  floorNumber: number
): Promise<{ location: NarrativeLocation; progress: UserNarrativeProgress }> {
  const result = await invoke<[NarrativeLocationRaw, UserNarrativeProgressRaw]>(
    'start_narrative_dungeon',
    { userId, floorNumber }
  );
  return {
    location: convertNarrativeLocation(result[0]),
    progress: convertUserNarrativeProgress(result[1]),
  };
}

export async function resolveSkillCheck(
  userId: number,
  choiceId: string,
  diceRoll: number,
  statModifier: number,
  challengeSuccess: boolean
): Promise<SkillCheckResult> {
  const result = await invoke<SkillCheckResult>('resolve_skill_check', {
    userId,
    choiceId,
    diceRoll,
    statModifier,
    challengeSuccess,
  });
  return result;
}

export async function applyNarrativeOutcome(
  userId: number,
  outcome: NarrativeOutcomeRaw
): Promise<UserNarrativeProgress> {
  const raw = await invoke<UserNarrativeProgressRaw>('apply_narrative_outcome', {
    userId,
    outcome,
  });
  return convertUserNarrativeProgress(raw);
}

export async function makeSimpleChoice(
  userId: number,
  choiceId: string
): Promise<{ outcome: NarrativeOutcome; progress: UserNarrativeProgress }> {
  const result = await invoke<[NarrativeOutcomeRaw, UserNarrativeProgressRaw]>('make_simple_choice', {
    userId,
    choiceId,
  });
  return {
    outcome: convertNarrativeOutcome(result[0]),
    progress: convertUserNarrativeProgress(result[1]),
  };
}

// ============================================================================
// SHOP SYSTEM
// ============================================================================

export async function getShopItems(userId: number): Promise<ShopItemDisplay[]> {
  const items = await invoke<ShopItem[]>('get_rpg_shop_items', { userId });
  return items.map(convertShopItem);
}

export async function purchaseShopItem(
  userId: number,
  shopId: number,
  itemType: ShopItemType,
  itemId: string,
  quantity: number = 1
): Promise<CharacterStats> {
  const raw = await invoke<CharacterStatsRaw>('purchase_shop_item', {
    userId,
    shopId,
    itemType,
    itemId,
    quantity,
  });
  return convertCharacterStats(raw);
}

export async function sellEquipmentItem(
  userId: number,
  equipmentId: string
): Promise<CharacterStats> {
  const raw = await invoke<CharacterStatsRaw>('sell_equipment_item', {
    userId,
    equipmentId,
  });
  return convertCharacterStats(raw);
}

export async function getConsumableInventory(userId: number): Promise<UserConsumableInventoryItem[]> {
  const items = await invoke<UserConsumableInventoryItemRaw[]>('get_consumable_inventory', { userId });
  return items.map(convertUserConsumableInventoryItem);
}

export async function useConsumable(
  userId: number,
  consumableId: string
): Promise<CharacterStats> {
  const raw = await invoke<CharacterStatsRaw>('use_consumable', {
    userId,
    consumableId,
  });
  return convertCharacterStats(raw);
}

export async function setTownState(userId: number, inTown: boolean): Promise<void> {
  await invoke('set_town_state', { userId, inTown });
}

export async function getTownState(userId: number): Promise<boolean> {
  return await invoke<boolean>('get_town_state', { userId });
}
