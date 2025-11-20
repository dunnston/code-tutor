import { invoke } from '@tauri-apps/api/core';
import type {
  UserCurrency,
  UserCurrencyRaw,
  ShopItem,
  ShopItemRaw,
  InventoryItem,
  InventoryItemRaw,
  Quest,
  QuestRaw,
  UserQuestProgress,
  UserQuestProgressRaw,
  ActiveEffect,
  ActiveEffectRaw,
  LevelReward,
  LevelRewardRaw,
  ShopItemCategory,
  QuestType,
} from '../types/gamification';
import {
  convertUserCurrency,
  convertShopItem,
  convertInventoryItem,
  convertQuest,
  convertUserQuestProgress,
  convertActiveEffect,
  convertLevelReward,
} from '../types/gamification';

// ============================================================================
// CURRENCY OPERATIONS
// ============================================================================

export async function getUserCurrency(userId: number): Promise<UserCurrency> {
  const raw = await invoke<UserCurrencyRaw>('get_user_currency', { userId });
  return convertUserCurrency(raw);
}

export async function addCurrency(
  userId: number,
  currencyType: 'gold' | 'gems',
  amount: number,
  reason: string,
  referenceId?: string
): Promise<UserCurrency> {
  const raw = await invoke<UserCurrencyRaw>('add_currency', {
    userId,
    currencyType,
    amount,
    reason,
    referenceId,
  });
  return convertUserCurrency(raw);
}

export async function spendCurrency(
  userId: number,
  currencyType: 'gold' | 'gems',
  amount: number,
  reason: string,
  referenceId?: string
): Promise<UserCurrency> {
  const raw = await invoke<UserCurrencyRaw>('spend_currency', {
    userId,
    currencyType,
    amount,
    reason,
    referenceId,
  });
  return convertUserCurrency(raw);
}

// ============================================================================
// SHOP OPERATIONS
// ============================================================================

export async function getShopItems(
  category?: ShopItemCategory,
  userLevel: number = 1
): Promise<ShopItem[]> {
  const rawItems = await invoke<ShopItemRaw[]>('get_shop_items', {
    category,
    userLevel,
  });
  return rawItems.map(convertShopItem);
}

export async function purchaseItem(
  userId: number,
  itemId: string,
  quantity: number = 1
): Promise<InventoryItem> {
  const raw = await invoke<InventoryItemRaw>('purchase_item', {
    userId,
    itemId,
    quantity,
  });
  return convertInventoryItem(raw);
}

// ============================================================================
// INVENTORY OPERATIONS
// ============================================================================

export async function getUserInventory(userId: number): Promise<InventoryItem[]> {
  const rawItems = await invoke<InventoryItemRaw[]>('get_user_inventory', {
    userId,
  });
  return rawItems.map(convertInventoryItem);
}

export async function useInventoryItem(
  userId: number,
  itemId: string
): Promise<boolean> {
  return await invoke<boolean>('use_inventory_item', {
    userId,
    itemId,
  });
}

// ============================================================================
// QUEST OPERATIONS
// ============================================================================

export async function getQuests(questType: QuestType): Promise<Quest[]> {
  const rawQuests = await invoke<QuestRaw[]>('get_quests', {
    questType,
  });
  return rawQuests.map(convertQuest);
}

export async function getUserQuestProgress(
  userId: number,
  questType: QuestType
): Promise<UserQuestProgress[]> {
  const rawProgress = await invoke<UserQuestProgressRaw[]>(
    'get_user_quest_progress',
    {
      userId,
      questType,
    }
  );
  return rawProgress.map(convertUserQuestProgress);
}

export async function updateQuestProgress(
  userId: number,
  questId: string,
  progress: number
): Promise<UserQuestProgress> {
  const raw = await invoke<UserQuestProgressRaw>('update_quest_progress', {
    userId,
    questId,
    progress,
  });
  return convertUserQuestProgress(raw);
}

// ============================================================================
// ACTIVE EFFECTS OPERATIONS
// ============================================================================

export async function getActiveEffects(userId: number): Promise<ActiveEffect[]> {
  const rawEffects = await invoke<ActiveEffectRaw[]>('get_active_effects', {
    userId,
  });
  return rawEffects.map(convertActiveEffect);
}

// Helper to calculate current multipliers from active effects
export function calculateMultipliers(effects: ActiveEffect[]): {
  xpMultiplier: number;
  goldMultiplier: number;
} {
  let xpMultiplier = 1.0;
  let goldMultiplier = 1.0;

  for (const effect of effects) {
    if (effect.effectType === 'xp_multiplier') {
      xpMultiplier *= effect.effectValue;
    } else if (effect.effectType === 'gold_multiplier') {
      goldMultiplier *= effect.effectValue;
    }
  }

  return { xpMultiplier, goldMultiplier };
}

// ============================================================================
// LEVEL REWARDS OPERATIONS
// ============================================================================

export async function getLevelRewards(level: number): Promise<LevelReward | null> {
  const raw = await invoke<LevelRewardRaw | null>('get_level_rewards', {
    level,
  });
  return raw ? convertLevelReward(raw) : null;
}

export async function claimLevelRewards(
  userId: number,
  level: number
): Promise<LevelReward> {
  const raw = await invoke<LevelRewardRaw>('claim_level_rewards', {
    userId,
    level,
  });
  return convertLevelReward(raw);
}

// ============================================================================
// HELPER FUNCTIONS FOR COMMON OPERATIONS
// ============================================================================

// Award currency for completing a lesson
export async function awardLessonRewards(
  userId: number,
  lessonId: string,
  difficulty: 'easy' | 'medium' | 'hard' | 'expert',
  perfectCompletion: boolean = false
): Promise<{ gold: number; xp: number }> {
  // Base gold rewards by difficulty
  const baseGold = {
    easy: 50,
    medium: 100,
    hard: 150,
    expert: 200,
  }[difficulty];

  // Apply perfect completion bonus
  const goldAmount = perfectCompletion ? Math.floor(baseGold * 1.5) : baseGold;

  // Get active effects to apply multipliers
  const effects = await getActiveEffects(userId);
  const { goldMultiplier } = calculateMultipliers(effects);

  const finalGold = Math.floor(goldAmount * goldMultiplier);

  await addCurrency(userId, 'gold', finalGold, 'lesson_complete', lessonId);

  return { gold: finalGold, xp: baseGold }; // XP would be handled separately
}

// Award currency for solving a puzzle
export async function awardPuzzleRewards(
  userId: number,
  puzzleId: string,
  points: number
): Promise<{ gold: number }> {
  // Get active effects
  const effects = await getActiveEffects(userId);
  const { goldMultiplier } = calculateMultipliers(effects);

  const goldAmount = Math.floor(points * goldMultiplier);

  await addCurrency(userId, 'gold', goldAmount, 'puzzle_solve', puzzleId);

  return { gold: goldAmount };
}

// Check if user can afford an item
export async function canAffordItem(
  userId: number,
  item: ShopItem,
  quantity: number = 1
): Promise<{
  canAfford: boolean;
  needsGold: number;
  needsGems: number;
}> {
  const currency = await getUserCurrency(userId);

  const totalGold = item.costGold * quantity;
  const totalGems = item.costGems * quantity;

  const canAfford = currency.gold >= totalGold && currency.gems >= totalGems;
  const needsGold = Math.max(0, totalGold - currency.gold);
  const needsGems = Math.max(0, totalGems - currency.gems);

  return { canAfford, needsGold, needsGems };
}

// Get inventory organized by category
export async function getInventoryByCategory(userId: number): Promise<{
  consumables: InventoryItem[];
  boosts: InventoryItem[];
  cosmetics: InventoryItem[];
  utilities: InventoryItem[];
}> {
  const inventory = await getUserInventory(userId);

  return {
    consumables: inventory.filter((item) => item.item.category === 'consumable'),
    boosts: inventory.filter((item) => item.item.category === 'boost'),
    cosmetics: inventory.filter((item) => item.item.category === 'cosmetic'),
    utilities: inventory.filter((item) => item.item.category === 'utility'),
  };
}

// Get quest progress with percentage
export async function getQuestProgressWithPercentage(
  userId: number,
  questType: QuestType
): Promise<
  Array<
    UserQuestProgress & {
      progressPercentage: number;
    }
  >
> {
  const progress = await getUserQuestProgress(userId, questType);

  return progress.map((p) => ({
    ...p,
    progressPercentage: Math.min(
      100,
      Math.floor((p.progress / p.quest.objectiveTarget) * 100)
    ),
  }));
}

// Increment quest progress for various actions
export async function incrementQuestProgress(
  userId: number,
  action:
    | 'complete_lesson'
    | 'solve_puzzle'
    | 'earn_xp'
    | 'lesson_no_hints'
    | 'perfect_lesson'
    | 'maintain_streak'
    | 'use_playground',
  amount: number = 1
): Promise<void> {
  // Map actions to objective types
  const objectiveTypeMap: Record<string, string> = {
    complete_lesson: 'complete_lessons',
    solve_puzzle: 'solve_puzzles',
    earn_xp: 'earn_xp',
    lesson_no_hints: 'lesson_no_hints',
    perfect_lesson: 'perfect_lessons',
    maintain_streak: 'maintain_streak',
    use_playground: 'use_playground',
  };

  const objectiveType = objectiveTypeMap[action];

  // Get all active quests
  const dailyProgress = await getUserQuestProgress(userId, 'daily');
  const weeklyProgress = await getUserQuestProgress(userId, 'weekly');

  const allProgress = [...dailyProgress, ...weeklyProgress];

  // Update relevant quests
  for (const progress of allProgress) {
    if (
      progress.quest.objectiveType === objectiveType &&
      !progress.completed
    ) {
      await updateQuestProgress(
        userId,
        progress.questId,
        progress.progress + amount
      );
    }
  }
}

// Check and initialize user quest progress for new quests
export async function initializeQuestProgress(
  userId: number,
  questType: QuestType
): Promise<void> {
  const quests = await getQuests(questType);
  const progress = await getUserQuestProgress(userId, questType);

  const existingQuestIds = new Set(progress.map((p) => p.questId));

  // Initialize progress for new quests
  for (const quest of quests) {
    if (!existingQuestIds.has(quest.id)) {
      await updateQuestProgress(userId, quest.id, 0);
    }
  }
}
