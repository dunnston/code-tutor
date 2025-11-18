import type { UserSettings } from '@components/SettingsModal'
import type { LanguageId } from '@/types/language'

const PREFERENCES_KEY = 'code-tutor-preferences'
const ONBOARDING_KEY = 'code-tutor-onboarding-complete'
const STARTING_LANGUAGE_KEY = 'code-tutor-starting-language'

// Default settings
export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  aiProvider: 'none',
  claudeApiKey: '',
  fontSize: 14,
  editorTabSize: 4,
  autoSave: true,
  soundEnabled: true,
}

// Load preferences from localStorage
export function loadPreferences(): UserSettings {
  try {
    const stored = localStorage.getItem(PREFERENCES_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { ...DEFAULT_SETTINGS, ...parsed }
    }
  } catch (error) {
    console.error('Failed to load preferences:', error)
  }
  return DEFAULT_SETTINGS
}

// Save preferences to localStorage
export function savePreferences(settings: UserSettings): void {
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error('Failed to save preferences:', error)
  }
}

// Check if onboarding has been completed
export function hasCompletedOnboarding(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_KEY) === 'true'
  } catch {
    return false
  }
}

// Mark onboarding as complete
export function completeOnboarding(selectedLanguage: LanguageId): void {
  try {
    localStorage.setItem(ONBOARDING_KEY, 'true')
    localStorage.setItem(STARTING_LANGUAGE_KEY, selectedLanguage)
  } catch (error) {
    console.error('Failed to save onboarding status:', error)
  }
}

// Get the user's starting language
export function getStartingLanguage(): LanguageId | null {
  try {
    return (localStorage.getItem(STARTING_LANGUAGE_KEY) as LanguageId) || null
  } catch {
    return null
  }
}

// Reset onboarding (for testing or if user wants to start over)
export function resetOnboarding(): void {
  try {
    localStorage.removeItem(ONBOARDING_KEY)
    localStorage.removeItem(STARTING_LANGUAGE_KEY)
  } catch (error) {
    console.error('Failed to reset onboarding:', error)
  }
}

// Apply theme to document
export function applyTheme(theme: 'dark' | 'light'): void {
  if (theme === 'light') {
    document.documentElement.classList.add('light-theme')
  } else {
    document.documentElement.classList.remove('light-theme')
  }
}
