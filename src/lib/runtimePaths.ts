import type { SupportedLanguage } from '@/types/language'

const RUNTIME_PATHS_KEY = 'code-tutor-runtime-paths'

export interface RuntimePaths {
  godot?: string
  dotnet?: string
  ruby?: string
}

/**
 * Load saved runtime paths from localStorage
 */
export function loadRuntimePaths(): RuntimePaths {
  try {
    const stored = localStorage.getItem(RUNTIME_PATHS_KEY)
    if (stored) {
      return JSON.parse(stored) as RuntimePaths
    }
  } catch (error) {
    console.error('Failed to load runtime paths:', error)
  }
  return {}
}

/**
 * Save runtime paths to localStorage
 */
export function saveRuntimePaths(paths: RuntimePaths): void {
  try {
    localStorage.setItem(RUNTIME_PATHS_KEY, JSON.stringify(paths))
  } catch (error) {
    console.error('Failed to save runtime paths:', error)
  }
}

/**
 * Set custom path for a runtime
 */
export function setRuntimePath(language: SupportedLanguage, path: string): void {
  const paths = loadRuntimePaths()

  // Map language to runtime key
  const key = getPathKey(language)
  if (!key) return

  paths[key] = path
  saveRuntimePaths(paths)
}

/**
 * Get custom path for a runtime
 */
export function getRuntimePath(language: SupportedLanguage): string | undefined {
  const paths = loadRuntimePaths()
  const key = getPathKey(language)
  if (!key) return undefined

  return paths[key]
}

/**
 * Clear custom path for a runtime
 */
export function clearRuntimePath(language: SupportedLanguage): void {
  const paths = loadRuntimePaths()
  const key = getPathKey(language)
  if (!key) return

  delete paths[key]
  saveRuntimePaths(paths)
}

/**
 * Map language to runtime path key
 */
function getPathKey(language: SupportedLanguage): keyof RuntimePaths | null {
  switch (language) {
    case 'gdscript':
      return 'godot'
    case 'csharp':
      return 'dotnet'
    case 'ruby':
      return 'ruby'
    default:
      return null
  }
}

/**
 * Get expected executable name for a runtime
 */
export function getExecutableName(language: SupportedLanguage): string {
  switch (language) {
    case 'gdscript':
      return 'Godot executable (e.g., Godot_v4.x.exe or Godot.exe)'
    case 'csharp':
      return 'dotnet.exe'
    case 'ruby':
      return 'ruby.exe'
    default:
      return ''
  }
}

/**
 * Common installation directories to check
 */
export function getCommonInstallPaths(language: SupportedLanguage): string[] {
  const username = typeof window !== 'undefined' && window.process?.env?.USERNAME
  const userPath = username || 'YourUsername'

  switch (language) {
    case 'gdscript':
      return [
        `C:\\Users\\${userPath}\\Desktop\\Godot.exe`,
        `C:\\Users\\${userPath}\\Desktop\\Godot_v4.*.exe`,
        `C:\\Users\\${userPath}\\Downloads\\Godot.exe`,
        `C:\\Users\\${userPath}\\Downloads\\Godot_v4.*.exe`,
        'C:\\Program Files\\Godot\\Godot.exe',
        'C:\\Program Files (x86)\\Godot\\Godot.exe',
        'C:\\Godot\\Godot.exe',
      ]
    case 'csharp':
      return [
        'C:\\Program Files\\dotnet\\dotnet.exe',
        'C:\\Program Files (x86)\\dotnet\\dotnet.exe',
      ]
    case 'ruby':
      return [
        'C:\\Ruby32-x64\\bin\\ruby.exe',
        'C:\\Ruby31-x64\\bin\\ruby.exe',
        'C:\\Ruby30-x64\\bin\\ruby.exe',
      ]
    default:
      return []
  }
}
