/**
 * Helper functions to build PromptContext from app state
 */

import type { PromptContext } from '@/types/ai'
import type { Lesson } from '@/types/lesson'
import type { UserProgress } from '@/lib/storage'
import type { ChatMessage } from '@/types/ai'

/**
 * Build PromptContext from current application state
 */
export function buildPromptContext(options: {
  lesson: Lesson
  userCode: string
  progress: UserProgress
  chatHistory: ChatMessage[]
  executionOutput?: string
  errorMessage?: string | null
  testResults?: Array<{ passed: boolean; description: string; expected?: string | number; actual?: string | number }>
  hintsRevealed?: number
  lessonStartTime?: number | null
  courseName?: string
  userName?: string
}): Partial<PromptContext> {
  const {
    lesson,
    userCode,
    progress,
    chatHistory,
    executionOutput,
    errorMessage,
    testResults,
    hintsRevealed = 0,
    lessonStartTime,
    courseName = 'Python Fundamentals',
    userName = 'Adventurer',
  } = options

  // Calculate time spent in minutes
  const timeSpentMinutes = lessonStartTime
    ? Math.floor((Date.now() - lessonStartTime) / (1000 * 60))
    : 0

  // Determine skill level based on user level
  const skillLevel: 'beginner' | 'intermediate' | 'advanced' =
    progress.level <= 3 ? 'beginner' : progress.level <= 7 ? 'intermediate' : 'advanced'

  // Extract concept name from lesson tags or title
  const conceptName = lesson.tags[0] || lesson.title.split(':')[0] || 'Programming Basics'

  // Determine concept category
  const conceptCategory = determineConceptCategory(lesson.tags)

  // Count attempts (rough estimate based on execution history)
  // In a real implementation, you'd track this explicitly
  const attempts = 0 // TODO: Track this in lesson state

  // Build the context
  const context: Partial<PromptContext> = {
    // User Info
    userName,
    userLevel: progress.level,
    skillLevel,

    // Course/Lesson Info
    courseName,
    lessonTitle: lesson.title,
    lessonDescription: lesson.description,
    conceptName,
    conceptCategory,
    difficulty: lesson.difficulty,
    language: lesson.language,

    // Code Info
    userCode,
    executionOutput,
    errorMessage,
    testResults,

    // Progress Info
    attempts,
    hintsGiven: hintsRevealed,
    hintsAvailable: lesson.hints,
    timeSpentMinutes,

    // Lesson Info
    validationTests: lesson.validationTests,
    solutionCode: lesson.solutionCode,
    learningObjectives: lesson.learningObjectives,

    // Conversation
    conversationHistory: chatHistory,
  }

  return context
}

/**
 * Add next lesson context to PromptContext (for lesson completion)
 */
export function addNextLessonContext(
  context: Partial<PromptContext>,
  nextLesson: Lesson | null
): Partial<PromptContext> {
  if (!nextLesson) {
    return context
  }

  return {
    ...context,
    nextLessonTitle: nextLesson.title,
    nextConceptName: nextLesson.tags[0] || nextLesson.title.split(':')[0],
  }
}

/**
 * Add achievement context (for lesson completion)
 */
export function addAchievementContext(
  context: Partial<PromptContext>,
  xpEarned: number,
  badgesEarned: string[]
): Partial<PromptContext> {
  return {
    ...context,
    xpEarned,
    badgesEarned,
  }
}

/**
 * Determine concept category from lesson tags
 */
function determineConceptCategory(tags: string[]): string {
  const tagStr = tags.join(' ').toLowerCase()

  if (tagStr.includes('variable') || tagStr.includes('data type')) {
    return 'Data & Variables'
  }
  if (tagStr.includes('loop') || tagStr.includes('iteration')) {
    return 'Control Flow - Loops'
  }
  if (tagStr.includes('conditional') || tagStr.includes('if') || tagStr.includes('decision')) {
    return 'Control Flow - Conditionals'
  }
  if (tagStr.includes('function') || tagStr.includes('method')) {
    return 'Functions'
  }
  if (tagStr.includes('list') || tagStr.includes('array') || tagStr.includes('collection')) {
    return 'Data Structures'
  }
  if (tagStr.includes('class') || tagStr.includes('object')) {
    return 'Object-Oriented Programming'
  }
  if (tagStr.includes('input') || tagStr.includes('output') || tagStr.includes('io')) {
    return 'Input/Output'
  }

  return 'Programming Fundamentals'
}

/**
 * Quick builder for hint requests
 */
export function buildHintContext(
  lesson: Lesson,
  userCode: string,
  progress: UserProgress,
  chatHistory: ChatMessage[],
  hintsRevealed: number,
  lessonStartTime: number | null
): Partial<PromptContext> {
  return buildPromptContext({
    lesson,
    userCode,
    progress,
    chatHistory,
    hintsRevealed,
    lessonStartTime,
  })
}

/**
 * Quick builder for code review requests
 */
export function buildCodeReviewContext(
  lesson: Lesson,
  userCode: string,
  progress: UserProgress,
  chatHistory: ChatMessage[],
  executionOutput: string,
  errorMessage: string | null,
  testResults?: Array<{ passed: boolean; description: string; expected?: string | number; actual?: string | number }>,
  lessonStartTime?: number | null
): Partial<PromptContext> {
  return buildPromptContext({
    lesson,
    userCode,
    progress,
    chatHistory,
    executionOutput,
    errorMessage,
    testResults,
    lessonStartTime,
  })
}
