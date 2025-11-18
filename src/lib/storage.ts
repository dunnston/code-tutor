/**
 * Local storage utilities for persisting user code and progress
 */

const STORAGE_PREFIX = 'code-tutor:'

/**
 * User progress data structure
 */
export interface UserProgress {
  completedLessons: number[] // Array of completed lesson IDs
  xpEarned: number
  currentLessonId: number | null
  lastUpdated: string // ISO timestamp
}

/**
 * Save user code for a specific lesson
 */
export function saveUserCode(lessonId: number, code: string): void {
  try {
    const key = `${STORAGE_PREFIX}lesson-${lessonId}-code`
    localStorage.setItem(key, code)
  } catch (error) {
    console.error('Failed to save code to local storage:', error)
  }
}

/**
 * Load user code for a specific lesson
 */
export function loadUserCode(lessonId: number): string | null {
  try {
    const key = `${STORAGE_PREFIX}lesson-${lessonId}-code`
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
    const key = `${STORAGE_PREFIX}lesson-${lessonId}-code`
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
 * Load user progress from local storage
 */
export function loadProgress(): UserProgress {
  try {
    const key = `${STORAGE_PREFIX}progress`
    const data = localStorage.getItem(key)

    if (data) {
      return JSON.parse(data) as UserProgress
    }
  } catch (error) {
    console.error('Failed to load progress from local storage:', error)
  }

  // Return default progress if none exists
  return {
    completedLessons: [],
    xpEarned: 0,
    currentLessonId: null,
    lastUpdated: new Date().toISOString(),
  }
}

/**
 * Save user progress to local storage
 */
export function saveProgress(progress: UserProgress): void {
  try {
    const key = `${STORAGE_PREFIX}progress`
    progress.lastUpdated = new Date().toISOString()
    localStorage.setItem(key, JSON.stringify(progress))
  } catch (error) {
    console.error('Failed to save progress to local storage:', error)
  }
}

/**
 * Mark a lesson as completed
 */
export function markLessonComplete(lessonId: number, xpReward: number): void {
  const progress = loadProgress()

  // Only add if not already completed
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId)
    progress.xpEarned += xpReward
    saveProgress(progress)
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
export function isLessonUnlocked(lessonId: number, previousLessonId?: number): boolean {
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
    const key = `${STORAGE_PREFIX}progress`
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Failed to reset progress:', error)
  }
}
