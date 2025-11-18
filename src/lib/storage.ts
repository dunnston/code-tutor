/**
 * Local storage utilities for persisting user code and progress
 */

const STORAGE_PREFIX = 'code-tutor:'

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
