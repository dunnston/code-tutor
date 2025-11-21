import { invoke } from '@tauri-apps/api/core'
import type { SupportedLanguage } from '@/types/language'
import { getRuntimePath } from './runtimePaths'

export interface RuntimeStatus {
  language: SupportedLanguage
  available: boolean
  version?: string
  bundled: boolean // Whether this runtime is bundled with the app
  installUrl?: string // Where to download if missing
  customPath?: string // Custom path if configured
}

/**
 * Check if a language runtime is available
 */
export async function checkRuntime(language: SupportedLanguage): Promise<RuntimeStatus> {
  const bundled = isBundledRuntime(language)
  const customPath = getRuntimePath(language)

  try {
    // If custom path is configured, check that first
    if (customPath) {
      console.log(`Checking custom path for ${language}:`, customPath)
      const customPathWorks = await invoke<boolean>('check_runtime_path', {
        language,
        executablePath: customPath
      })

      if (customPathWorks) {
        console.log(`Custom path for ${language} works:`, customPath)
        return {
          language,
          available: true,
          bundled,
          installUrl: getInstallUrl(language),
          customPath,
        }
      } else {
        console.warn(`Custom path for ${language} doesn't work:`, customPath)
      }
    }

    // Fall back to system PATH check
    const available = await invoke<boolean>('check_language_runtime', { language })
    console.log(`Runtime check for ${language}:`, { available, bundled })

    return {
      language,
      available,
      bundled,
      installUrl: getInstallUrl(language),
      customPath: available ? undefined : customPath, // Keep failed custom path to show in UI
    }
  } catch (error) {
    console.error(`Runtime check failed for ${language}:`, error, { bundled })

    return {
      language,
      available: false,
      bundled, // Still check if bundled even on error
      installUrl: getInstallUrl(language),
      customPath,
    }
  }
}

/**
 * Check all runtimes and return their status
 */
export async function checkAllRuntimes(): Promise<Record<SupportedLanguage, RuntimeStatus>> {
  const languages: SupportedLanguage[] = ['python', 'javascript', 'bash', 'csharp', 'gdscript', 'ruby']

  const results = await Promise.all(
    languages.map(lang => checkRuntime(lang))
  )

  return results.reduce((acc, status) => {
    acc[status.language] = status
    return acc
  }, {} as Record<SupportedLanguage, RuntimeStatus>)
}

/**
 * Check if a runtime is bundled with the app
 */
function isBundledRuntime(language: SupportedLanguage): boolean {
  // These languages come bundled with the app
  return language === 'python' || language === 'javascript' || language === 'bash'
}

/**
 * Get installation URL for a runtime
 */
function getInstallUrl(language: SupportedLanguage): string | undefined {
  const urls: Partial<Record<SupportedLanguage, string>> = {
    python: 'https://www.python.org/downloads/',
    javascript: 'https://nodejs.org/en/download/',
    bash: 'https://git-scm.com/downloads', // Git for Windows includes bash
    csharp: 'https://dotnet.microsoft.com/download',
    gdscript: 'https://godotengine.org/download',
    ruby: 'https://www.ruby-lang.org/en/downloads/',
  }

  return urls[language]
}

/**
 * Get user-friendly runtime name
 */
export function getRuntimeName(language: SupportedLanguage): string {
  const names: Record<SupportedLanguage, string> = {
    python: 'Python',
    javascript: 'Node.js',
    bash: 'Git Bash',
    csharp: '.NET SDK',
    gdscript: 'Godot Engine',
    ruby: 'Ruby',
  }

  return names[language]
}

/**
 * Get installation instructions for a runtime
 */
export function getInstallInstructions(language: SupportedLanguage): string {
  const instructions: Record<SupportedLanguage, string> = {
    python: 'Download and install Python 3.10 or later from python.org',
    javascript: 'Download and install Node.js LTS from nodejs.org',
    bash: 'Install Git for Windows (includes Git Bash)',
    csharp: 'Install .NET 8 SDK from dotnet.microsoft.com',
    gdscript: 'Download Godot 4.x from godotengine.org (Standard or Mono version)',
    ruby: 'Download and install Ruby from ruby-lang.org',
  }

  return instructions[language]
}

/**
 * Check if a course can be accessed based on runtime availability
 */
export async function isCourseAvailable(language: SupportedLanguage): Promise<boolean> {
  const status = await checkRuntime(language)
  return status.available || status.bundled
}

/**
 * Get a message for locked courses
 */
export function getLockedCourseMessage(language: SupportedLanguage): string {
  return `This course requires ${getRuntimeName(language)}. Install it in Settings to unlock this course.`
}
