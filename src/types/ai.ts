// AI Tutor types

import type { ValidationTest } from './lesson'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

export interface ChatContext {
  lessonTitle: string
  lessonDescription: string
  userCode: string
  executionResult?: {
    stdout: string
    stderr: string
    exitCode: number
  }
  chatHistory: ChatMessage[]
}

/**
 * Comprehensive context for AI prompt generation
 */
export interface PromptContext {
  // User Info
  userName: string
  userLevel: number
  skillLevel: 'beginner' | 'intermediate' | 'advanced'

  // Course/Lesson Info
  courseName: string
  lessonTitle: string
  lessonDescription: string
  conceptName: string
  conceptCategory: string
  difficulty?: number
  language?: string

  // Code Info
  userCode: string
  executionOutput?: string
  errorMessage?: string | null
  testResults?: TestResult[]

  // Progress Info
  attempts: number
  hintsGiven: number
  hintsAvailable: string[]
  timeSpentMinutes: number

  // Lesson Info
  validationTests?: ValidationTest[]
  solutionCode?: string
  learningObjectives?: string[]

  // Next Lesson Info (optional)
  nextLessonTitle?: string
  nextConceptName?: string

  // Achievements (optional)
  xpEarned?: number
  badgesEarned?: string[]

  // Conversation
  conversationHistory: ChatMessage[]

  // Special context
  recentActions?: string[]
  sentiment?: string

  // Playground-specific context
  completedLessons?: Array<{
    id: number
    title: string
    tags: string[]
  }>
  playgroundMode?: boolean

  // Puzzle-specific context
  puzzleTitle?: string
  puzzleDescription?: string
  puzzleDifficulty?: string
  puzzleTestCases?: Array<{
    description: string
    input: Record<string, unknown>
    expectedOutput: unknown
  }>
  puzzleHintsUsed?: number
  puzzleHintsAvailable?: number
  puzzleMode?: boolean
}

/**
 * Test result for validation feedback
 */
export interface TestResult {
  passed: boolean
  description: string
  expected?: string | number
  actual?: string | number
}

/**
 * Types of AI interactions
 */
export type PromptType =
  | 'lesson_intro'
  | 'general_question'
  | 'hint_request'
  | 'code_review'
  | 'encouragement'
  | 'check_solution'
  | 'concept_explanation'
  | 'code_comparison'
  | 'lesson_complete'
  | 'chat'
  | 'playground_ideas'
  | 'playground_help'
  | 'playground_chat'
  | 'playground_challenge'
  | 'puzzle_help'
  | 'puzzle_test_results'
  | 'puzzle_hint'
  | 'puzzle_concept'

export type AIProviderType = 'ollama' | 'claude' | 'none'

export interface AIProvider {
  name: string
  type: AIProviderType
  isAvailable(): Promise<boolean>
  sendMessage(
    prompt: string,
    context: ChatContext,
    systemPrompt?: string
  ): Promise<string>
  streamMessage?(
    prompt: string,
    context: ChatContext,
    onChunk: (text: string) => void,
    systemPrompt?: string
  ): Promise<void>
}

export interface AIConfig {
  provider: AIProviderType
  ollamaModel?: string
  claudeApiKey?: string
}
