/**
 * Local storage utilities for persisting user code and progress
 * All data is scoped by profile to support multi-user profiles
 */

import { getProfileStorageKey } from './profiles'

const STORAGE_PREFIX = 'code-tutor:'

/**
 * Badge types for achievements
 */
export type BadgeId =
  | 'first-steps'
  | 'streak-master'
  | 'speed-demon'
  | 'persistent'
  | 'independent'
  | 'level-5'
  | 'level-10'
  | 'python-novice'
  | 'python-master'
  | 'early-bird'

export interface Badge {
  id: BadgeId
  name: string
  description: string
  icon: string // emoji or icon identifier
  earnedAt?: string // ISO timestamp when earned
}

/**
 * Lesson session data for time tracking
 */
export interface LessonSession {
  lessonId: number
  timeSpentMs: number // milliseconds spent on this lesson
  hintsUsed: number
  attempts: number // number of submit attempts
  completedAt?: string // ISO timestamp
}

/**
 * Streak tracking data
 */
export interface StreakData {
  lastLoginDate: string // ISO date string (YYYY-MM-DD)
  currentStreak: number // consecutive days
  longestStreak: number // all-time best
  totalDaysActive: number // total unique days with activity
}

/**
 * User progress data structure
 */
export interface UserProgress {
  // Basic progress
  completedLessons: number[] // Array of completed lesson IDs
  xpEarned: number
  currentLessonId: number | null
  lastUpdated: string // ISO timestamp

  // Gamification
  level: number // calculated from XP
  badges: BadgeId[] // earned badge IDs
  streak: StreakData

  // Detailed tracking
  lessonSessions: Record<number, LessonSession> // lesson ID -> session data
}

/**
 * Result of a save operation
 */
export type SaveResult = {
  success: true
} | {
  success: false
  error: 'quota_exceeded' | 'unknown'
  message: string
}

/**
 * Save user code for a specific lesson
 * Returns a SaveResult indicating success or failure
 */
export function saveUserCode(lessonId: number, code: string): SaveResult {
  try {
    const key = getProfileStorageKey(`${STORAGE_PREFIX}lesson-${lessonId}-code`)
    localStorage.setItem(key, code)
    return { success: true }
  } catch (error) {
    // Check if it's a quota exceeded error
    if (error instanceof DOMException && (
      error.name === 'QuotaExceededError' ||
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      error.code === 22 // Legacy quota exceeded code
    )) {
      return {
        success: false,
        error: 'quota_exceeded',
        message: 'Storage quota exceeded. Your code is too large to save automatically.'
      }
    }
    console.error('Failed to save code to local storage:', error)
    return {
      success: false,
      error: 'unknown',
      message: 'Failed to save code to local storage.'
    }
  }
}

/**
 * Load user code for a specific lesson
 */
export function loadUserCode(lessonId: number): string | null {
  try {
    const key = getProfileStorageKey(`${STORAGE_PREFIX}lesson-${lessonId}-code`)
    return localStorage.getItem(key)
  } catch (error) {
    console.error('Failed to load code from local storage:', error)
    return null
  }
}

/**
 * Clear user code for a specific lesson
 */
export function clearUserCode(lessonId: number): void {
  try {
    const key = getProfileStorageKey(`${STORAGE_PREFIX}lesson-${lessonId}-code`)
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Failed to clear code from local storage:', error)
  }
}

/**
 * Auto-save code with debouncing
 */
export function createAutoSave(lessonId: number, delayMs: number = 1000) {
  let timeoutId: NodeJS.Timeout | null = null

  return (code: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      saveUserCode(lessonId, code)
    }, delayMs)
  }
}

/**
 * Calculate level from XP using exponential formula
 * Level 1 = 0-99 XP, Level 2 = 100-249 XP, etc.
 */
export function calculateLevel(xp: number): number {
  if (xp < 100) return 1
  // Each level requires more XP: 100, 150, 200, 250...
  return Math.floor(Math.sqrt(xp / 50)) + 1
}

/**
 * Calculate XP required for next level
 */
export function xpForNextLevel(currentLevel: number): number {
  const nextLevel = currentLevel + 1
  return Math.pow(nextLevel - 1, 2) * 50
}

/**
 * Calculate XP progress to next level (0-1)
 */
export function xpProgressToNextLevel(xp: number): number {
  const currentLevel = calculateLevel(xp)
  const currentLevelXP = xpForNextLevel(currentLevel - 1)
  const nextLevelXP = xpForNextLevel(currentLevel)
  const xpInLevel = xp - currentLevelXP
  const xpNeeded = nextLevelXP - currentLevelXP
  return xpInLevel / xpNeeded
}

/**
 * Load user progress from local storage
 */
export function loadProgress(): UserProgress {
  try {
    const key = getProfileStorageKey(`${STORAGE_PREFIX}progress`)
    const data = localStorage.getItem(key)

    if (data) {
      const progress = JSON.parse(data) as UserProgress

      // Migrate old data if needed (add missing fields)
      if (!progress.level) progress.level = calculateLevel(progress.xpEarned)
      if (!progress.badges) progress.badges = []
      if (!progress.streak) {
        progress.streak = {
          lastLoginDate: new Date().toISOString().split('T')[0]!,
          currentStreak: 0,
          longestStreak: 0,
          totalDaysActive: 0,
        }
      }
      if (!progress.lessonSessions) progress.lessonSessions = {}

      return progress
    }
  } catch (error) {
    console.error('Failed to load progress from local storage:', error)
  }

  // Return default progress if none exists
  const today = new Date().toISOString().split('T')[0]!
  return {
    completedLessons: [],
    xpEarned: 0,
    currentLessonId: null,
    lastUpdated: new Date().toISOString(),
    level: 1,
    badges: [],
    streak: {
      lastLoginDate: today,
      currentStreak: 0,
      longestStreak: 0,
      totalDaysActive: 0,
    },
    lessonSessions: {},
  }
}

/**
 * Save user progress to local storage
 */
export function saveProgress(progress: UserProgress): void {
  try {
    const key = getProfileStorageKey(`${STORAGE_PREFIX}progress`)
    progress.lastUpdated = new Date().toISOString()
    localStorage.setItem(key, JSON.stringify(progress))
  } catch (error) {
    console.error('Failed to save progress to local storage:', error)
  }
}

/**
 * Mark a lesson as completed
 * Returns information about level-ups and badges earned
 */
export function markLessonComplete(
  lessonId: number,
  xpReward: number,
  hintsUsed: number = 0
): { leveledUp: boolean; oldLevel: number; newLevel: number; newBadges: BadgeId[] } {
  const progress = loadProgress()
  const oldLevel = progress.level

  // Only process if not already completed
  if (!progress.completedLessons.includes(lessonId)) {
    // Add XP and update level
    progress.completedLessons.push(lessonId)
    progress.xpEarned += xpReward
    progress.level = calculateLevel(progress.xpEarned)

    // Mark lesson session as completed
    if (!progress.lessonSessions[lessonId]) {
      progress.lessonSessions[lessonId] = {
        lessonId,
        timeSpentMs: 0,
        hintsUsed: 0,
        attempts: 0,
      }
    }
    progress.lessonSessions[lessonId].completedAt = new Date().toISOString()
    progress.lessonSessions[lessonId].hintsUsed = hintsUsed

    // Check for special badges
    const session = progress.lessonSessions[lessonId]

    // Speed Demon - completed in under 5 minutes
    if (session.timeSpentMs < 5 * 60 * 1000 && !progress.badges.includes('speed-demon')) {
      progress.badges.push('speed-demon')
    }

    // Persistent - 5+ attempts
    if (session.attempts >= 5 && !progress.badges.includes('persistent')) {
      progress.badges.push('persistent')
    }

    // Independent - no hints used
    if (hintsUsed === 0 && !progress.badges.includes('independent')) {
      progress.badges.push('independent')
    }

    // Early Bird - completed before 8 AM
    const hour = new Date().getHours()
    if (hour < 8 && !progress.badges.includes('early-bird')) {
      progress.badges.push('early-bird')
    }

    saveProgress(progress)

    // Check for other badges
    const newBadges = checkAndAwardBadges(progress)

    return {
      leveledUp: progress.level > oldLevel,
      oldLevel,
      newLevel: progress.level,
      newBadges,
    }
  }

  return {
    leveledUp: false,
    oldLevel,
    newLevel: oldLevel,
    newBadges: [],
  }
}

/**
 * Check if a lesson is completed
 */
export function isLessonCompleted(lessonId: number): boolean {
  const progress = loadProgress()
  return progress.completedLessons.includes(lessonId)
}

/**
 * Check if a lesson is unlocked (accessible to the user)
 * A lesson is unlocked if:
 * - It has no previous lesson (it's the first lesson), OR
 * - Its previous lesson has been completed
 */
export function isLessonUnlocked(_lessonId: number, previousLessonId?: number): boolean {
  // First lesson is always unlocked
  if (!previousLessonId) {
    return true
  }

  // Check if previous lesson is completed
  return isLessonCompleted(previousLessonId)
}

/**
 * Reset all progress (for testing or user request)
 */
export function resetProgress(): void {
  try {
    const key = getProfileStorageKey(`${STORAGE_PREFIX}progress`)
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Failed to reset progress:', error)
  }
}

/**
 * Badge definitions
 */
export const BADGES: Record<BadgeId, Omit<Badge, 'earnedAt'>> = {
  'first-steps': {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎯',
  },
  'streak-master': {
    id: 'streak-master',
    name: 'Streak Master',
    description: 'Maintain a 7-day learning streak',
    icon: '🔥',
  },
  'speed-demon': {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Complete a lesson in under 5 minutes',
    icon: '⚡',
  },
  'persistent': {
    id: 'persistent',
    name: 'Persistent Learner',
    description: 'Retry a lesson 5 or more times before succeeding',
    icon: '💪',
  },
  'independent': {
    id: 'independent',
    name: 'Independent Thinker',
    description: 'Complete a lesson without using any hints',
    icon: '🧠',
  },
  'level-5': {
    id: 'level-5',
    name: 'Rising Star',
    description: 'Reach Level 5',
    icon: '⭐',
  },
  'level-10': {
    id: 'level-10',
    name: 'Code Master',
    description: 'Reach Level 10',
    icon: '👑',
  },
  'python-novice': {
    id: 'python-novice',
    name: 'Python Novice',
    description: 'Complete first 5 Python lessons',
    icon: '🐍',
  },
  'python-master': {
    id: 'python-master',
    name: 'Python Master',
    description: 'Complete all 10 Python lessons',
    icon: '🏆',
  },
  'early-bird': {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Complete a lesson before 8 AM',
    icon: '🌅',
  },
}

/**
 * Update daily streak on login/activity
 * @param userId - Optional user ID for quest progress tracking
 */
export async function updateStreak(userId?: number): Promise<void> {
  const progress = loadProgress()
  const today = new Date().toISOString().split('T')[0]!
  const lastLogin = progress.streak.lastLoginDate

  // Same day - no change (unless it's a new user with 0 streak)
  if (lastLogin === today && progress.streak.currentStreak > 0) {
    return
  }

  // Handle first day for new users
  if (progress.streak.currentStreak === 0 && lastLogin === today) {
    progress.streak.currentStreak = 1
    progress.streak.longestStreak = 1
    progress.streak.totalDaysActive = 1
    saveProgress(progress)
    return
  }

  // Calculate days difference
  const lastDate = new Date(lastLogin)
  const todayDate = new Date(today)
  const daysDiff = Math.floor(
    (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  let streakContinued = false

  if (daysDiff === 1) {
    // Consecutive day - increment streak
    progress.streak.currentStreak += 1
    progress.streak.longestStreak = Math.max(
      progress.streak.longestStreak,
      progress.streak.currentStreak
    )
    streakContinued = true
  } else if (daysDiff > 1) {
    // Streak broken - reset to 1
    progress.streak.currentStreak = 1
  }

  progress.streak.lastLoginDate = today
  progress.streak.totalDaysActive += 1

  saveProgress(progress)

  // Track streak maintenance for quests (only if streak continued and userId provided)
  if (streakContinued && userId) {
    try {
      const { incrementQuestProgress } = await import('./gamification')
      await incrementQuestProgress(userId, 'maintain_streak')
    } catch (error) {
      console.error('Failed to track streak maintenance:', error)
    }
  }
}

/**
 * Check and award badges based on current progress
 * Returns array of newly earned badge IDs
 */
export function checkAndAwardBadges(progress: UserProgress): BadgeId[] {
  const newBadges: BadgeId[] = []

  // Helper to check if badge already earned
  const hasBadge = (badgeId: BadgeId) => progress.badges.includes(badgeId)

  // First Steps - complete first lesson
  if (!hasBadge('first-steps') && progress.completedLessons.length >= 1) {
    newBadges.push('first-steps')
  }

  // Streak Master - 7 day streak
  if (!hasBadge('streak-master') && progress.streak.currentStreak >= 7) {
    newBadges.push('streak-master')
  }

  // Level badges
  if (!hasBadge('level-5') && progress.level >= 5) {
    newBadges.push('level-5')
  }
  if (!hasBadge('level-10') && progress.level >= 10) {
    newBadges.push('level-10')
  }

  // Python track badges
  if (!hasBadge('python-novice') && progress.completedLessons.length >= 5) {
    newBadges.push('python-novice')
  }
  if (!hasBadge('python-master') && progress.completedLessons.length >= 10) {
    newBadges.push('python-master')
  }

  // Add newly earned badges to progress
  if (newBadges.length > 0) {
    progress.badges.push(...newBadges)
    saveProgress(progress)
  }

  return newBadges
}

/**
 * Track time spent on a lesson
 */
export function trackLessonTime(lessonId: number, timeMs: number): void {
  const progress = loadProgress()

  if (!progress.lessonSessions[lessonId]) {
    progress.lessonSessions[lessonId] = {
      lessonId,
      timeSpentMs: 0,
      hintsUsed: 0,
      attempts: 0,
    }
  }

  progress.lessonSessions[lessonId].timeSpentMs += timeMs

  saveProgress(progress)
}

/**
 * Record a lesson attempt (submit button clicked)
 */
export function recordLessonAttempt(lessonId: number, hintsUsed: number): void {
  const progress = loadProgress()

  if (!progress.lessonSessions[lessonId]) {
    progress.lessonSessions[lessonId] = {
      lessonId,
      timeSpentMs: 0,
      hintsUsed: 0,
      attempts: 0,
    }
  }

  progress.lessonSessions[lessonId].attempts += 1
  progress.lessonSessions[lessonId].hintsUsed = hintsUsed

  saveProgress(progress)
}

/**
 * Get progress export data (for backup/download)
 */
export function exportProgress(): string {
  const progress = loadProgress()
  return JSON.stringify(progress, null, 2)
}

/**
 * Clear all user data (progress, saved code, etc.)
 * Use with caution - this is destructive!
 */
export function clearAllData(): void {
  try {
    // Get all keys that start with our prefix
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key)
      }
    }

    // Remove all our data
    keysToRemove.forEach((key) => localStorage.removeItem(key))
  } catch (error) {
    console.error('Failed to clear all data:', error)
  }
}
