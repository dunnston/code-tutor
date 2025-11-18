// Language registry types

export type SupportedLanguage = 'python' | 'javascript' | 'gdscript' | 'csharp' | 'ruby'

// Alias for convenience
export type LanguageId = SupportedLanguage

/**
 * Language executor configuration
 */
export interface LanguageConfig {
  /** Unique language identifier */
  id: SupportedLanguage
  /** Display name */
  name: string
  /** File extension (e.g., '.py', '.js') */
  extension: string
  /** Monaco editor language ID */
  monacoLanguage: string
  /** Execution command template (use {code} as placeholder for code) */
  executionCommand: string[]
  /** Alternative command if primary fails */
  fallbackCommand?: string[]
  /** Runtime check command (to verify if language is installed) */
  checkCommand: string[]
  /** Expected output from check command */
  checkExpectedOutput?: string
  /** Default timeout in milliseconds */
  defaultTimeout: number
  /** Icon emoji for UI */
  icon: string
  /** Description for UI */
  description: string
  /** Whether to execute from file or inline (-c flag) */
  executionMode: 'inline' | 'file'
  /** File execution requires temp file with specific name pattern */
  tempFilePattern?: string
}

/**
 * Language execution request
 */
export interface LanguageExecutionRequest {
  language: SupportedLanguage
  code: string
  timeoutMs?: number
}

/**
 * Runtime availability check result
 */
export interface RuntimeCheckResult {
  available: boolean
  version?: string
  error?: string
}
