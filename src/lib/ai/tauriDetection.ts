/**
 * Reliable Tauri detection utility
 * Used across all AI providers
 */

/**
 * Check if we're running in Tauri environment
 * This checks multiple indicators to be thorough
 */
export function isTauriEnvironment(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  // Check for Tauri API
  if ('__TAURI__' in window) {
    return true
  }

  // Check for Tauri internals (alternative method)
  if ('__TAURI_INTERNALS__' in window) {
    return true
  }

  return false
}

/**
 * Get a diagnostic report of Tauri availability
 */
export function getTauriDiagnostics(): {
  isAvailable: boolean
  hasTauriGlobal: boolean
  hasTauriInternals: boolean
  userAgent: string
} {
  return {
    isAvailable: isTauriEnvironment(),
    hasTauriGlobal: typeof window !== 'undefined' && '__TAURI__' in window,
    hasTauriInternals: typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
  }
}
