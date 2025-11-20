// Puzzle System Types

export type PuzzleDifficulty = 'easy' | 'medium' | 'hard' | 'expert'
export type PuzzleStatus = 'not_started' | 'attempted' | 'solved' | 'optimized'
export type LeaderboardMetric = 'time' | 'lines'
export type SupportedLanguage = 'python' | 'javascript' | 'csharp' | 'gdscript' | 'ruby'

/**
 * Puzzle Category
 */
export interface PuzzleCategory {
  id: string
  name: string
  description: string
  icon: string
  orderIndex: number
}

/**
 * Test Case for puzzle validation
 */
export interface TestCase {
  input: Record<string, unknown>
  expectedOutput: unknown
  description: string
  hidden?: boolean
}

/**
 * Main Puzzle Definition
 */
export interface Puzzle {
  id: string
  categoryId: string
  title: string
  description: string // Markdown format
  difficulty: PuzzleDifficulty
  points: number

  // Metadata
  concepts: string[] // Array of concept IDs
  estimatedMinutes: number
  solveCount: number
  averageTime?: number // seconds

  // Optimization
  hasOptimization: boolean
  optimalTimeComplexity?: string // e.g., "O(n)"
  optimalSpaceComplexity?: string // e.g., "O(1)"
  optimalLinesOfCode?: number
}

/**
 * Language-specific puzzle implementation
 */
export interface PuzzleImplementation {
  id: number
  puzzleId: string
  languageId: SupportedLanguage

  // Code templates
  starterCode: string
  solutionCode: string

  // Testing
  testCases: TestCase[]
  hiddenTests?: TestCase[]

  // Hints
  hints: string[]
}

/**
 * Complete puzzle with implementation for a specific language
 */
export interface PuzzleWithImplementation extends Puzzle {
  implementation: PuzzleImplementation
}

/**
 * User's progress on a specific puzzle in a specific language
 */
export interface UserPuzzleProgress {
  id: number
  userId: number
  puzzleId: string
  languageId: SupportedLanguage

  // Progress
  status: PuzzleStatus
  attempts: number
  hintsUsed: number

  // Solution data
  userSolution?: string
  solveTime?: number // seconds
  solutionLines?: number

  // Timestamps
  firstAttemptAt?: string
  solvedAt?: string
  lastAttemptAt?: string

  // Optimization
  isOptimal: boolean

  // Solution viewing tracking
  solutionViewed: boolean
  solutionViewedAt?: string
}

/**
 * Leaderboard entry
 */
export interface LeaderboardEntry {
  id: number
  puzzleId: string
  languageId: SupportedLanguage
  userId: number
  metric: LeaderboardMetric
  value: number
  solutionCode?: string
  achievedAt: string
}

/**
 * Daily puzzle challenge
 */
export interface DailyPuzzle {
  id: number
  puzzleId: string
  date: string // YYYY-MM-DD format
  bonusPoints: number
}

/**
 * Achievement types
 */
export type AchievementType = 'count' | 'streak' | 'difficulty' | 'language' | 'optimization'

/**
 * Puzzle achievement
 */
export interface PuzzleAchievement {
  id: string
  name: string
  description: string
  icon: string
  requirementType: AchievementType
  requirementValue: number
  xpReward: number
}

/**
 * User's earned achievement
 */
export interface UserPuzzleAchievement {
  id: number
  userId: number
  achievementId: string
  earnedAt: string
  // Populated from join
  achievement?: PuzzleAchievement
}

/**
 * Puzzle stats for user
 */
export interface PuzzleStats {
  totalSolved: number
  totalAttempted: number
  totalPoints: number
  currentRank: number
  easyCompleted: number
  mediumCompleted: number
  hardCompleted: number
  expertCompleted: number
  achievementCount: number
  currentStreak: number
  longestStreak: number
  languageStats: {
    [key in SupportedLanguage]?: {
      solved: number
      attempted: number
    }
  }
}

/**
 * Category progress
 */
export interface CategoryProgress {
  category: PuzzleCategory
  totalPuzzles: number
  solvedPuzzles: number
  completionPercentage: number
}

/**
 * Test result from running a single test case
 */
export interface TestResult {
  passed: boolean
  testCase: TestCase
  actualOutput?: any
  error?: string
  executionTime?: number // milliseconds
}

/**
 * Complete test validation result
 */
export interface ValidationResult {
  allPassed: boolean
  passedCount: number
  totalCount: number
  testResults: TestResult[]
  executionError?: string
}
