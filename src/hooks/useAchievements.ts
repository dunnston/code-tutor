import { useCallback } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { TrackingKey, TRACKING_KEYS } from '@/lib/achievements'

const USER_ID = 1 // Default user for single-user app

/**
 * Hook for tracking achievement progress
 * Provides functions to update progress for various achievement types
 */
export function useAchievements() {
  /**
   * Generic function to update achievement progress by tracking key
   * @param trackingKey The key to track (e.g., 'lessons_completed')
   * @param increment Amount to increment by (default: 1)
   * @returns Array of newly completed achievement IDs
   */
  const updateProgress = useCallback(async (trackingKey: TrackingKey, increment: number = 1): Promise<string[]> => {
    try {
      const completed = await invoke<string[]>('update_achievement_progress', {
        userId: USER_ID,
        trackingKey,
        increment,
      })

      if (completed.length > 0) {
        console.log(`🎉 Achievements unlocked:`, completed)
      }

      return completed
    } catch (err) {
      console.error(`Failed to update achievement progress for ${trackingKey}:`, err)
      return []
    }
  }, [])

  // Learning achievements
  const trackLessonCompleted = useCallback(() => {
    return updateProgress(TRACKING_KEYS.LESSONS_COMPLETED)
  }, [updateProgress])

  const trackPerfectLesson = useCallback(() => {
    return updateProgress(TRACKING_KEYS.LESSONS_PERFECT)
  }, [updateProgress])

  const trackCourseCompleted = useCallback(() => {
    return updateProgress(TRACKING_KEYS.COURSES_COMPLETED)
  }, [updateProgress])

  // Puzzle achievements
  const trackPuzzleSolved = useCallback(() => {
    return updateProgress(TRACKING_KEYS.PUZZLES_SOLVED)
  }, [updateProgress])

  const trackPerfectPuzzle = useCallback(() => {
    return updateProgress(TRACKING_KEYS.PUZZLES_PERFECT)
  }, [updateProgress])

  const trackExpertPuzzle = useCallback(() => {
    return updateProgress(TRACKING_KEYS.PUZZLES_EXPERT_SOLVED)
  }, [updateProgress])

  const trackOptimalSolution = useCallback(() => {
    return updateProgress(TRACKING_KEYS.OPTIMAL_SOLUTIONS)
  }, [updateProgress])

  // Streak achievements
  const updateStreak = useCallback(async (currentStreak: number) => {
    try {
      // Update current streak
      await invoke('update_achievement_progress', {
        userId: USER_ID,
        trackingKey: TRACKING_KEYS.CURRENT_STREAK,
        increment: 0, // We're setting, not incrementing
      })

      // Also check/update longest streak if needed
      // (backend should handle this logic)
      return []
    } catch (err) {
      console.error('Failed to update streak:', err)
      return []
    }
  }, [])

  // Progression achievements
  const trackXpEarned = useCallback((amount: number) => {
    return updateProgress(TRACKING_KEYS.TOTAL_XP_EARNED, amount)
  }, [updateProgress])

  const trackLevelUp = useCallback((newLevel: number) => {
    // Update current level (should trigger level milestone achievements)
    return updateProgress(TRACKING_KEYS.CURRENT_LEVEL, 1)
  }, [updateProgress])

  // Playground achievements
  const trackProjectCreated = useCallback(() => {
    return updateProgress(TRACKING_KEYS.PROJECTS_CREATED)
  }, [updateProgress])

  const trackProjectLike = useCallback(() => {
    return updateProgress(TRACKING_KEYS.PROJECTS_LIKES_RECEIVED)
  }, [updateProgress])

  const trackProjectFork = useCallback(() => {
    return updateProgress(TRACKING_KEYS.PROJECTS_FORKS_RECEIVED)
  }, [updateProgress])

  const trackProjectView = useCallback(() => {
    return updateProgress(TRACKING_KEYS.TOTAL_PROJECT_VIEWS)
  }, [updateProgress])

  // Dungeon achievements
  const trackEnemyDefeated = useCallback(() => {
    return updateProgress(TRACKING_KEYS.ENEMIES_DEFEATED)
  }, [updateProgress])

  const trackBossDefeated = useCallback(() => {
    return updateProgress(TRACKING_KEYS.BOSSES_DEFEATED)
  }, [updateProgress])

  const trackFloorCleared = useCallback(() => {
    return updateProgress(TRACKING_KEYS.FLOORS_CLEARED)
  }, [updateProgress])

  const trackMaxFloor = useCallback((floorNumber: number) => {
    return updateProgress(TRACKING_KEYS.MAX_FLOOR_REACHED, 1)
  }, [updateProgress])

  const trackPerfectCombat = useCallback(() => {
    return updateProgress(TRACKING_KEYS.PERFECT_COMBATS)
  }, [updateProgress])

  // Economic achievements
  const trackGoldEarned = useCallback((amount: number) => {
    return updateProgress(TRACKING_KEYS.LIFETIME_GOLD_EARNED, amount)
  }, [updateProgress])

  const trackGemsEarned = useCallback((amount: number) => {
    return updateProgress(TRACKING_KEYS.LIFETIME_GEMS_EARNED, amount)
  }, [updateProgress])

  const trackShopPurchase = useCallback(() => {
    return updateProgress(TRACKING_KEYS.SHOP_PURCHASES_MADE)
  }, [updateProgress])

  // Social achievements
  const trackUserHelped = useCallback(() => {
    return updateProgress(TRACKING_KEYS.USERS_HELPED)
  }, [updateProgress])

  const trackCustomLessonCreated = useCallback(() => {
    return updateProgress(TRACKING_KEYS.CUSTOM_LESSONS_CREATED)
  }, [updateProgress])

  return {
    // Generic
    updateProgress,

    // Learning
    trackLessonCompleted,
    trackPerfectLesson,
    trackCourseCompleted,

    // Puzzles
    trackPuzzleSolved,
    trackPerfectPuzzle,
    trackExpertPuzzle,
    trackOptimalSolution,

    // Streaks
    updateStreak,

    // Progression
    trackXpEarned,
    trackLevelUp,

    // Playground
    trackProjectCreated,
    trackProjectLike,
    trackProjectFork,
    trackProjectView,

    // Dungeon
    trackEnemyDefeated,
    trackBossDefeated,
    trackFloorCleared,
    trackMaxFloor,
    trackPerfectCombat,

    // Economic
    trackGoldEarned,
    trackGemsEarned,
    trackShopPurchase,

    // Social
    trackUserHelped,
    trackCustomLessonCreated,
  }
}

/**
 * Utility function to track multiple achievements at once
 * Useful for actions that trigger multiple achievement types
 */
export async function trackMultipleAchievements(updates: Array<{ key: TrackingKey; increment?: number }>) {
  const allCompleted: string[] = []

  for (const { key, increment = 1 } of updates) {
    try {
      const completed = await invoke<string[]>('update_achievement_progress', {
        userId: USER_ID,
        trackingKey: key,
        increment,
      })
      allCompleted.push(...completed)
    } catch (err) {
      console.error(`Failed to update ${key}:`, err)
    }
  }

  if (allCompleted.length > 0) {
    console.log(`🎉 Achievements unlocked:`, allCompleted)
  }

  return allCompleted
}
