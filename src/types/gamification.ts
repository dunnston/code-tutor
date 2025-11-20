// ============================================================================
// CURRENCY TYPES
// ============================================================================

export interface UserCurrency {
  userId: number;
  gold: number;
  gems: number;
  lifetimeGoldEarned: number;
  lifetimeGemsEarned: number;
}

export interface CurrencyTransaction {
  id: number;
  userId: number;
  currencyType: 'gold' | 'gems';
  amount: number; // Positive = earned, negative = spent
  reason: string;
  referenceId?: string;
  balanceAfter: number;
  createdAt: string;
}

// ============================================================================
// SHOP & INVENTORY TYPES
// ============================================================================

export type ShopItemCategory = 'consumable' | 'boost' | 'cosmetic' | 'utility';
export type ShopItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface ShopItemEffects {
  type: string;
  value?: number;
  duration?: string;
  durationSeconds?: number;
  [key: string]: any;
}

export interface ShopItem {
  id: string;
  name: string;
  description?: string;
  category: ShopItemCategory;
  itemType: string; // Specific type within category
  costGold: number;
  costGems: number;
  requiredLevel: number;
  isLimitedTime: boolean;
  availableUntil?: string;
  stockLimit?: number;
  effects: string; // JSON string
  effectsParsed?: ShopItemEffects; // Parsed effects
  icon?: string;
  rarity?: ShopItemRarity;
  isConsumable: boolean;
  maxStack: number;
}

export interface InventoryItem {
  id: number;
  userId: number;
  itemId: string;
  quantity: number;
  acquiredAt: string;
  item: ShopItem;
}

export interface PurchaseHistory {
  id: number;
  userId: number;
  itemId: string;
  quantity: number;
  costGold: number;
  costGems: number;
  purchasedAt: string;
}

// ============================================================================
// QUEST TYPES
// ============================================================================

export type QuestType = 'daily' | 'weekly' | 'special';

export type QuestObjectiveType =
  | 'complete_lessons'
  | 'solve_puzzles'
  | 'earn_xp'
  | 'lesson_no_hints'
  | 'perfect_lessons'
  | 'maintain_streak'
  | 'use_playground';

export interface Quest {
  id: string;
  questType: QuestType;
  title: string;
  description?: string;
  objectiveType: QuestObjectiveType;
  objectiveTarget: number;
  rewardXp: number;
  rewardGold: number;
  rewardGems: number;
  rewardItemId?: string;
  icon?: string;
  orderIndex: number;
}

export interface UserQuestProgress {
  id: number;
  userId: number;
  questId: string;
  progress: number;
  completed: boolean;
  completedAt?: string;
  quest: Quest;
}

// ============================================================================
// ACTIVE EFFECTS TYPES
// ============================================================================

export type EffectType =
  | 'xp_multiplier'
  | 'gold_multiplier'
  | 'puzzle_points_multiplier'
  | 'streak_protection'
  | 'free_hint'
  | 'skip_timer'
  | 'auto_save'
  | 'item_effect';

export interface ActiveEffect {
  id: number;
  userId: number;
  effectType: EffectType;
  effectValue: number;
  startedAt: string;
  expiresAt?: string;
  sourceItemId?: string;
  metadata?: string;
}

// ============================================================================
// LEVEL REWARDS TYPES
// ============================================================================

export interface LevelReward {
  level: number;
  xpRequired: number;
  rewardGold: number;
  rewardGems: number;
  rewardItems?: string; // JSON array of item IDs
  rewardItemsParsed?: string[]; // Parsed item IDs
  unlocksFeature?: string; // JSON array of feature keys
  unlocksFeatureParsed?: string[]; // Parsed features
  unlocksCategory?: string;
  title?: string;
  description?: string;
  icon?: string;
}

// ============================================================================
// UI TYPES
// ============================================================================

export interface ShopFilters {
  category?: ShopItemCategory;
  rarity?: ShopItemRarity;
  priceRange?: {
    minGold?: number;
    maxGold?: number;
    minGems?: number;
    maxGems?: number;
  };
  searchQuery?: string;
}

export interface QuestBoardFilters {
  type: QuestType;
  showCompleted?: boolean;
}

// ============================================================================
// HELPER TYPES FOR UI
// ============================================================================

export interface PurchaseConfirmation {
  item: ShopItem;
  quantity: number;
  totalGold: number;
  totalGems: number;
  currentGold: number;
  currentGems: number;
  canAfford: boolean;
}

export interface QuestProgressDisplay extends UserQuestProgress {
  progressPercentage: number;
  isAvailable: boolean;
  timeUntilReset?: string;
}

export interface InventoryDisplay {
  consumables: InventoryItem[];
  boosts: InventoryItem[];
  cosmetics: InventoryItem[];
  utilities: InventoryItem[];
}

export interface ActiveEffectsDisplay {
  xpMultiplier: number; // Combined XP multiplier
  goldMultiplier: number; // Combined gold multiplier
  effects: ActiveEffect[];
  hasStreakProtection: boolean;
  autoSaveEnabled: boolean;
}

// ============================================================================
// API RETURN TYPES (matching Rust backend snake_case)
// ============================================================================

export interface UserCurrencyRaw {
  user_id: number;
  gold: number;
  gems: number;
  lifetime_gold_earned: number;
  lifetime_gems_earned: number;
}

export interface ShopItemRaw {
  id: string;
  name: string;
  description: string | null;
  category: string;
  item_type: string;
  cost_gold: number;
  cost_gems: number;
  required_level: number;
  is_limited_time: boolean;
  available_until: string | null;
  stock_limit: number | null;
  effects: string;
  icon: string | null;
  rarity: string | null;
  is_consumable: boolean;
  max_stack: number;
}

export interface InventoryItemRaw {
  id: number;
  user_id: number;
  item_id: string;
  quantity: number;
  acquired_at: string;
  item: ShopItemRaw;
}

export interface QuestRaw {
  id: string;
  quest_type: string;
  title: string;
  description: string | null;
  objective_type: string;
  objective_target: number;
  reward_xp: number;
  reward_gold: number;
  reward_gems: number;
  reward_item_id: string | null;
  icon: string | null;
  order_index: number;
}

export interface UserQuestProgressRaw {
  id: number;
  user_id: number;
  quest_id: string;
  progress: number;
  completed: boolean;
  completed_at: string | null;
  quest: QuestRaw;
}

export interface ActiveEffectRaw {
  id: number;
  user_id: number;
  effect_type: string;
  effect_value: number;
  started_at: string;
  expires_at: string | null;
  source_item_id: string | null;
  metadata: string | null;
}

export interface LevelRewardRaw {
  level: number;
  xp_required: number;
  reward_gold: number;
  reward_gems: number;
  reward_items: string | null;
  unlocks_feature: string | null;
  unlocks_category: string | null;
  title: string | null;
  description: string | null;
  icon: string | null;
}

// ============================================================================
// CONVERSION HELPERS
// ============================================================================

export function convertUserCurrency(raw: UserCurrencyRaw): UserCurrency {
  return {
    userId: raw.user_id,
    gold: raw.gold,
    gems: raw.gems,
    lifetimeGoldEarned: raw.lifetime_gold_earned,
    lifetimeGemsEarned: raw.lifetime_gems_earned,
  };
}

export function convertShopItem(raw: ShopItemRaw): ShopItem {
  let effectsParsed: ShopItemEffects | undefined;
  try {
    effectsParsed = JSON.parse(raw.effects);
  } catch (e) {
    console.error('Failed to parse effects:', e);
  }

  return {
    id: raw.id,
    name: raw.name,
    description: raw.description || undefined,
    category: raw.category as ShopItemCategory,
    itemType: raw.item_type,
    costGold: raw.cost_gold,
    costGems: raw.cost_gems,
    requiredLevel: raw.required_level,
    isLimitedTime: raw.is_limited_time,
    availableUntil: raw.available_until || undefined,
    stockLimit: raw.stock_limit || undefined,
    effects: raw.effects,
    effectsParsed,
    icon: raw.icon || undefined,
    rarity: raw.rarity as ShopItemRarity | undefined,
    isConsumable: raw.is_consumable,
    maxStack: raw.max_stack,
  };
}

export function convertInventoryItem(raw: InventoryItemRaw): InventoryItem {
  return {
    id: raw.id,
    userId: raw.user_id,
    itemId: raw.item_id,
    quantity: raw.quantity,
    acquiredAt: raw.acquired_at,
    item: convertShopItem(raw.item),
  };
}

export function convertQuest(raw: QuestRaw): Quest {
  return {
    id: raw.id,
    questType: raw.quest_type as QuestType,
    title: raw.title,
    description: raw.description || undefined,
    objectiveType: raw.objective_type as QuestObjectiveType,
    objectiveTarget: raw.objective_target,
    rewardXp: raw.reward_xp,
    rewardGold: raw.reward_gold,
    rewardGems: raw.reward_gems,
    rewardItemId: raw.reward_item_id || undefined,
    icon: raw.icon || undefined,
    orderIndex: raw.order_index,
  };
}

export function convertUserQuestProgress(raw: UserQuestProgressRaw): UserQuestProgress {
  return {
    id: raw.id,
    userId: raw.user_id,
    questId: raw.quest_id,
    progress: raw.progress,
    completed: raw.completed,
    completedAt: raw.completed_at || undefined,
    quest: convertQuest(raw.quest),
  };
}

export function convertActiveEffect(raw: ActiveEffectRaw): ActiveEffect {
  return {
    id: raw.id,
    userId: raw.user_id,
    effectType: raw.effect_type as EffectType,
    effectValue: raw.effect_value,
    startedAt: raw.started_at,
    expiresAt: raw.expires_at || undefined,
    sourceItemId: raw.source_item_id || undefined,
    metadata: raw.metadata || undefined,
  };
}

export function convertLevelReward(raw: LevelRewardRaw): LevelReward {
  let rewardItemsParsed: string[] | undefined;
  let unlocksFeatureParsed: string[] | undefined;

  if (raw.reward_items) {
    try {
      rewardItemsParsed = JSON.parse(raw.reward_items);
    } catch (e) {
      console.error('Failed to parse reward_items:', e);
    }
  }

  if (raw.unlocks_feature) {
    try {
      unlocksFeatureParsed = JSON.parse(raw.unlocks_feature);
    } catch (e) {
      console.error('Failed to parse unlocks_feature:', e);
    }
  }

  return {
    level: raw.level,
    xpRequired: raw.xp_required,
    rewardGold: raw.reward_gold,
    rewardGems: raw.reward_gems,
    rewardItems: raw.reward_items || undefined,
    rewardItemsParsed,
    unlocksFeature: raw.unlocks_feature || undefined,
    unlocksFeatureParsed,
    unlocksCategory: raw.unlocks_category || undefined,
    title: raw.title || undefined,
    description: raw.description || undefined,
    icon: raw.icon || undefined,
  };
}
