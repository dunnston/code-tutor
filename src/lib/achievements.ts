// Achievement System Types and Utilities

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'secret'
export type AchievementCategory =
  | 'learning'
  | 'puzzles'
  | 'streaks'
  | 'progression'
  | 'playground'
  | 'dungeon'
  | 'economic'
  | 'social'
  | 'mastery'
  | 'secret'

export type RequirementType = 'count' | 'streak' | 'level' | 'perfect' | 'speed' | 'collection' | 'custom'

export interface Achievement {
  id: string
  category_id: AchievementCategory
  name: string
  description: string
  icon: string
  tier: AchievementTier
  requirement_type: RequirementType
  requirement_value: number | null
  requirement_data: string | null
  xp_reward: number
  gold_reward: number
  gem_reward: number
  unlock_item_id: string | null
  unlock_item_type: string | null
  is_secret: boolean
  required_level: number
  required_achievement_id: string | null
  display_order: number
  is_repeatable: boolean
  tracking_key: string | null
}

export interface UserAchievementProgress {
  achievement_id: string
  current_progress: number
  completed: boolean
  completed_at: string | null
  times_completed: number
  viewed_at: string | null
}

export interface AchievementWithProgress extends Achievement {
  progress?: UserAchievementProgress
}

export interface AchievementStats {
  total_achievements: number
  completed_achievements: number
  unviewed_achievements: number
  completion_percentage: number
  total_xp_earned: number
  total_gold_earned: number
  total_gems_earned: number
  by_tier: TierStats
}

export interface TierStats {
  bronze_completed: number
  silver_completed: number
  gold_completed: number
  platinum_completed: number
  secret_completed: number
}

export interface AchievementNotification {
  id: number
  achievement_id: string
  achievement: Achievement
}

export interface AchievementCategoryInfo {
  id: string
  name: string
  description: string
  icon: string
  display_order: number
}

// Tier configuration
export const TIER_CONFIG: Record<
  AchievementTier,
  { color: string; gradient: string; label: string; bgColor: string }
> = {
  bronze: {
    color: 'text-orange-400',
    gradient: 'from-orange-600 to-orange-800',
    label: 'Bronze',
    bgColor: 'bg-orange-900/20',
  },
  silver: {
    color: 'text-gray-300',
    gradient: 'from-gray-400 to-gray-600',
    label: 'Silver',
    bgColor: 'bg-gray-800/20',
  },
  gold: {
    color: 'text-yellow-400',
    gradient: 'from-yellow-500 to-yellow-700',
    label: 'Gold',
    bgColor: 'bg-yellow-900/20',
  },
  platinum: {
    color: 'text-cyan-300',
    gradient: 'from-cyan-400 to-blue-600',
    label: 'Platinum',
    bgColor: 'bg-cyan-900/20',
  },
  secret: {
    color: 'text-purple-400',
    gradient: 'from-purple-500 to-pink-600',
    label: 'Secret',
    bgColor: 'bg-purple-900/20',
  },
}

// Category configuration
export const CATEGORY_CONFIG: Record<AchievementCategory, { color: string; bgColor: string }> = {
  learning: { color: 'text-blue-400', bgColor: 'bg-blue-900/20' },
  puzzles: { color: 'text-purple-400', bgColor: 'bg-purple-900/20' },
  streaks: { color: 'text-orange-400', bgColor: 'bg-orange-900/20' },
  progression: { color: 'text-green-400', bgColor: 'bg-green-900/20' },
  playground: { color: 'text-pink-400', bgColor: 'bg-pink-900/20' },
  dungeon: { color: 'text-red-400', bgColor: 'bg-red-900/20' },
  economic: { color: 'text-yellow-400', bgColor: 'bg-yellow-900/20' },
  social: { color: 'text-cyan-400', bgColor: 'bg-cyan-900/20' },
  mastery: { color: 'text-indigo-400', bgColor: 'bg-indigo-900/20' },
  secret: { color: 'text-purple-400', bgColor: 'bg-purple-900/20' },
}

// Utility functions
export function getProgressPercentage(achievement: AchievementWithProgress): number {
  if (!achievement.progress || !achievement.requirement_value) return 0
  return Math.min(100, (achievement.progress.current_progress / achievement.requirement_value) * 100)
}

export function isAchievementCompleted(achievement: AchievementWithProgress): boolean {
  return achievement.progress?.completed ?? false
}

export function formatAchievementRequirement(achievement: Achievement): string {
  if (achievement.requirement_type === 'count' && achievement.requirement_value) {
    return `${achievement.requirement_value}x`
  }
  if (achievement.requirement_type === 'streak' && achievement.requirement_value) {
    return `${achievement.requirement_value} day streak`
  }
  if (achievement.requirement_type === 'level' && achievement.requirement_value) {
    return `Reach level ${achievement.requirement_value}`
  }
  return ''
}

export function getTierLabel(tier: AchievementTier): string {
  return TIER_CONFIG[tier].label
}

export function getTierColor(tier: AchievementTier): string {
  return TIER_CONFIG[tier].color
}

export function getCategoryColor(category: AchievementCategory): string {
  return CATEGORY_CONFIG[category].color
}

// Tracking keys for achievement progress updates
export const TRACKING_KEYS = {
  // Learning
  LESSONS_COMPLETED: 'lessons_completed',
  LESSONS_PERFECT: 'lessons_perfect',
  COURSES_COMPLETED: 'courses_completed',

  // Puzzles
  PUZZLES_SOLVED: 'puzzles_solved',
  PUZZLES_PERFECT: 'puzzles_perfect',
  PUZZLES_EXPERT_SOLVED: 'puzzles_expert_solved',
  OPTIMAL_SOLUTIONS: 'optimal_solutions',

  // Streaks
  CURRENT_STREAK: 'current_streak',
  LONGEST_STREAK: 'longest_streak',

  // XP and Level
  TOTAL_XP_EARNED: 'total_xp_earned',
  CURRENT_LEVEL: 'current_level',

  // Playground
  PROJECTS_CREATED: 'projects_created',
  PROJECTS_LIKES_RECEIVED: 'projects_likes_received',
  PROJECTS_FORKS_RECEIVED: 'projects_forks_received',
  TOTAL_PROJECT_VIEWS: 'total_project_views',

  // Dungeon
  ENEMIES_DEFEATED: 'enemies_defeated',
  BOSSES_DEFEATED: 'bosses_defeated',
  FLOORS_CLEARED: 'floors_cleared',
  MAX_FLOOR_REACHED: 'max_floor_reached',
  PERFECT_COMBATS: 'perfect_combats',

  // Economic
  LIFETIME_GOLD_EARNED: 'lifetime_gold_earned',
  LIFETIME_GEMS_EARNED: 'lifetime_gems_earned',
  SHOP_PURCHASES_MADE: 'shop_purchases_made',

  // Social
  USERS_HELPED: 'users_helped',
  CUSTOM_LESSONS_CREATED: 'custom_lessons_created',
} as const

export type TrackingKey = (typeof TRACKING_KEYS)[keyof typeof TRACKING_KEYS]
