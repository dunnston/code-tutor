import type { LanguageConfig, SupportedLanguage } from '@/types/language'

/**
 * Language registry - defines execution configuration for each supported language
 */
export const LANGUAGE_REGISTRY: Record<SupportedLanguage, LanguageConfig> = {
  python: {
    id: 'python',
    name: 'Python',
    extension: '.py',
    monacoLanguage: 'python',
    executionCommand: ['python', '-c'],
    fallbackCommand: ['python3', '-c'],
    checkCommand: ['python', '--version'],
    defaultTimeout: 5000,
    icon: '🐍',
    description: 'General-purpose programming language',
    executionMode: 'inline',
  },
  javascript: {
    id: 'javascript',
    name: 'JavaScript (Node.js)',
    extension: '.js',
    monacoLanguage: 'javascript',
    executionCommand: ['node', '-e'],
    checkCommand: ['node', '--version'],
    defaultTimeout: 5000,
    icon: '📜',
    description: 'JavaScript runtime with Node.js',
    executionMode: 'inline',
  },
  gdscript: {
    id: 'gdscript',
    name: 'GDScript',
    extension: '.gd',
    monacoLanguage: 'python', // GDScript syntax similar to Python
    executionCommand: ['godot', '--headless', '--script'],
    checkCommand: ['godot', '--version'],
    defaultTimeout: 10000, // Godot may take longer to initialize
    icon: '🎮',
    description: 'Godot game engine scripting language',
    executionMode: 'file',
    tempFilePattern: 'temp_script_{timestamp}.gd',
  },
  csharp: {
    id: 'csharp',
    name: 'C#',
    extension: '.cs',
    monacoLanguage: 'csharp',
    executionCommand: ['dotnet', 'script'],
    checkCommand: ['dotnet', '--version'],
    defaultTimeout: 8000, // C# compilation + execution may take longer
    icon: '🔷',
    description: 'C# with .NET runtime',
    executionMode: 'file',
    tempFilePattern: 'temp_script_{timestamp}.csx',
  },
  ruby: {
    id: 'ruby',
    name: 'Ruby',
    extension: '.rb',
    monacoLanguage: 'ruby',
    executionCommand: ['ruby', '-e'],
    checkCommand: ['ruby', '--version'],
    defaultTimeout: 5000,
    icon: '💎',
    description: 'Dynamic, object-oriented programming language',
    executionMode: 'inline',
  },
  bash: {
    id: 'bash',
    name: 'Bash/Git',
    extension: '.sh',
    monacoLanguage: 'shell',
    executionCommand: ['bash', '-c'],
    fallbackCommand: ['sh', '-c'],
    checkCommand: ['bash', '--version'],
    defaultTimeout: 5000,
    icon: '⚡',
    description: 'Shell scripting and Git version control',
    executionMode: 'inline',
  },
}

/**
 * Get language configuration by ID
 */
export function getLanguageConfig(language: SupportedLanguage): LanguageConfig {
  return LANGUAGE_REGISTRY[language]
}

/**
 * Get all supported languages
 */
export function getAllLanguages(): LanguageConfig[] {
  return Object.values(LANGUAGE_REGISTRY)
}

/**
 * Check if a language is supported
 */
export function isLanguageSupported(language: string): language is SupportedLanguage {
  return language in LANGUAGE_REGISTRY
}

/**
 * Get Monaco language ID for a language
 */
export function getMonacoLanguage(language: SupportedLanguage): string {
  return LANGUAGE_REGISTRY[language].monacoLanguage
}
