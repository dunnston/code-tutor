/**
 * Puzzle management utilities
 * Interfaces with Tauri backend for puzzle data
 */

import { invoke } from '@/lib/tauri'
import type {
  PuzzleCategory,
  Puzzle,
  PuzzleImplementation,
  DailyPuzzleChallenge,
  DailyPuzzleStreak,
} from '@/types/puzzle'

/**
 * Get all puzzle categories
 */
export async function getPuzzleCategories(): Promise<PuzzleCategory[]> {
  try {
    const categories = await invoke<any[]>('get_puzzle_categories')
    // Map snake_case from Rust to camelCase for TypeScript
    return categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      icon: cat.icon,
      orderIndex: cat.order_index,
    }))
  } catch (error) {
    console.error('Failed to get puzzle categories:', error)
    throw error
  }
}

/**
 * Get puzzles by category
 */
export async function getPuzzlesByCategory(categoryId: string): Promise<Puzzle[]> {
  try {
    const puzzles = await invoke<any[]>('get_puzzles_by_category', { categoryId })
    // Map snake_case from Rust to camelCase for TypeScript
    return puzzles.map(mapPuzzleFromRust)
  } catch (error) {
    console.error(`Failed to get puzzles for category ${categoryId}:`, error)
    throw error
  }
}

/**
 * Get a single puzzle by ID
 */
export async function getPuzzle(puzzleId: string): Promise<Puzzle> {
  try {
    const puzzle = await invoke<any>('get_puzzle', { puzzleId })
    return mapPuzzleFromRust(puzzle)
  } catch (error) {
    console.error(`Failed to get puzzle ${puzzleId}:`, error)
    throw error
  }
}

/**
 * Get puzzle implementation for a specific language
 */
export async function getPuzzleImplementation(
  puzzleId: string,
  languageId: string
): Promise<PuzzleImplementation> {
  try {
    const impl = await invoke<any>('get_puzzle_implementation', {
      puzzleId,
      languageId,
    })

    // Safely parse JSON fields with error handling
    let testCases: PuzzleImplementation['testCases'] = []
    let hiddenTests: PuzzleImplementation['hiddenTests'] = undefined
    let hints: string[] = []

    try {
      testCases = JSON.parse(impl.test_cases || '[]')
    } catch (parseError) {
      console.error('Failed to parse test_cases JSON:', parseError)
      testCases = []
    }

    try {
      hiddenTests = impl.hidden_tests ? JSON.parse(impl.hidden_tests) : undefined
    } catch (parseError) {
      console.error('Failed to parse hidden_tests JSON:', parseError)
      hiddenTests = undefined
    }

    try {
      hints = impl.hints ? JSON.parse(impl.hints) : []
    } catch (parseError) {
      console.error('Failed to parse hints JSON:', parseError)
      hints = []
    }

    return {
      id: impl.id,
      puzzleId: impl.puzzle_id,
      languageId: impl.language_id,
      starterCode: impl.starter_code,
      solutionCode: impl.solution_code,
      testCases,
      hiddenTests,
      hints,
    }
  } catch (error) {
    console.error(`Failed to get puzzle implementation ${puzzleId}/${languageId}:`, error)
    throw error
  }
}

/**
 * Check if a puzzle has an implementation for a language
 */
export async function hasPuzzleImplementation(
  puzzleId: string,
  languageId: string
): Promise<boolean> {
  try {
    return await invoke<boolean>('has_puzzle_implementation', {
      puzzleId,
      languageId,
    })
  } catch (error) {
    console.error(`Failed to check puzzle implementation ${puzzleId}/${languageId}:`, error)
    return false
  }
}

/**
 * Helper function to map Rust puzzle to TypeScript Puzzle
 */
function mapPuzzleFromRust(puzzle: any): Puzzle {
  // Safely parse concepts JSON
  let concepts: string[] = []
  try {
    concepts = puzzle.concepts ? JSON.parse(puzzle.concepts) : []
  } catch (parseError) {
    console.error('Failed to parse puzzle concepts JSON:', parseError)
    concepts = []
  }

  return {
    id: puzzle.id,
    categoryId: puzzle.category_id,
    title: puzzle.title,
    description: puzzle.description,
    difficulty: puzzle.difficulty,
    points: puzzle.points,
    concepts,
    estimatedMinutes: puzzle.estimated_minutes || 0,
    solveCount: puzzle.solve_count || 0,
    averageTime: puzzle.average_time,
    hasOptimization: puzzle.has_optimization || false,
    optimalTimeComplexity: puzzle.optimal_time_complexity,
    optimalSpaceComplexity: puzzle.optimal_space_complexity,
    optimalLinesOfCode: puzzle.optimal_lines_of_code,
  }
}

// ============================================================================
// USER PROGRESS TRACKING
// ============================================================================

/**
 * Get all puzzle progress for a user
 */
export async function getAllPuzzleProgress(userId: number): Promise<import('@/types/puzzle').UserPuzzleProgress[]> {
  try {
    const progressList = await invoke<any[]>('get_all_puzzle_progress', { userId })

    return progressList.map(progress => ({
      id: progress.id,
      userId: progress.user_id,
      puzzleId: progress.puzzle_id,
      languageId: progress.language_id,
      status: progress.status,
      attempts: progress.attempts,
      hintsUsed: progress.hints_used,
      userSolution: progress.user_solution,
      solveTime: progress.solve_time,
      solutionLines: progress.solution_lines,
      firstAttemptAt: progress.first_attempt_at,
      solvedAt: progress.solved_at,
      lastAttemptAt: progress.last_attempt_at,
      isOptimal: progress.is_optimal,
      solutionViewed: progress.solution_viewed || false,
      solutionViewedAt: progress.solution_viewed_at,
    }))
  } catch (error) {
    console.error('Failed to get all puzzle progress:', error)
    return []
  }
}

/**
 * Get user progress for a puzzle
 */
export async function getPuzzleProgress(
  userId: number,
  puzzleId: string,
  languageId: string
): Promise<import('@/types/puzzle').UserPuzzleProgress | null> {
  try {
    const progress = await invoke<any>('get_puzzle_progress', {
      userId,
      puzzleId,
      languageId,
    })

    if (!progress) return null

    return {
      id: progress.id,
      userId: progress.user_id,
      puzzleId: progress.puzzle_id,
      languageId: progress.language_id,
      status: progress.status,
      attempts: progress.attempts,
      hintsUsed: progress.hints_used,
      userSolution: progress.user_solution,
      solveTime: progress.solve_time,
      solutionLines: progress.solution_lines,
      firstAttemptAt: progress.first_attempt_at,
      solvedAt: progress.solved_at,
      lastAttemptAt: progress.last_attempt_at,
      isOptimal: progress.is_optimal,
      solutionViewed: progress.solution_viewed || false,
      solutionViewedAt: progress.solution_viewed_at,
    }
  } catch (error) {
    console.error(`Failed to get puzzle progress ${puzzleId}/${languageId}:`, error)
    return null
  }
}

/**
 * Record a puzzle attempt
 */
export async function recordPuzzleAttempt(
  userId: number,
  puzzleId: string,
  languageId: string,
  userSolution: string
): Promise<void> {
  try {
    await invoke('record_puzzle_attempt', {
      userId,
      puzzleId,
      languageId,
      userSolution,
    })
  } catch (error) {
    console.error(`Failed to record puzzle attempt ${puzzleId}/${languageId}:`, error)
    throw error
  }
}

/**
 * Record hint usage
 */
export async function recordHintUsed(
  userId: number,
  puzzleId: string,
  languageId: string
): Promise<void> {
  try {
    await invoke('record_hint_used', {
      userId,
      puzzleId,
      languageId,
    })
  } catch (error) {
    console.error(`Failed to record hint ${puzzleId}/${languageId}:`, error)
    throw error
  }
}

/**
 * Record that the user viewed the solution
 */
export async function recordSolutionViewed(
  userId: number,
  puzzleId: string,
  languageId: string
): Promise<void> {
  try {
    await invoke('record_solution_viewed', {
      userId,
      puzzleId,
      languageId,
    })
  } catch (error) {
    console.error(`Failed to record solution viewed ${puzzleId}/${languageId}:`, error)
    throw error
  }
}

/**
 * Mark puzzle as solved and award points
 */
export async function markPuzzleSolved(
  userId: number,
  puzzleId: string,
  languageId: string,
  userSolution: string,
  solveTimeSeconds: number
): Promise<number> {
  try {
    const points = await invoke<number>('mark_puzzle_solved', {
      userId,
      puzzleId,
      languageId,
      userSolution,
      solveTimeSeconds,
    })
    return points
  } catch (error) {
    console.error(`Failed to mark puzzle solved ${puzzleId}/${languageId}:`, error)
    throw error
  }
}

// ============================================================================
// DAILY PUZZLE CHALLENGE
// ============================================================================

/**
 * Get today's daily puzzle challenge
 */
export async function getDailyPuzzle(userId: number): Promise<DailyPuzzleChallenge> {
  try {
    const challenge = await invoke<any>('get_daily_puzzle', { userId })

    return {
      id: challenge.id,
      puzzleId: challenge.puzzle_id,
      date: challenge.date,
      bonusPoints: challenge.bonus_points,
      puzzle: mapPuzzleFromRust(challenge.puzzle),
      completedToday: challenge.completed_today,
      completedLanguages: challenge.completed_languages,
    }
  } catch (error) {
    console.error('Failed to get daily puzzle:', error)
    throw error
  }
}

/**
 * Complete today's daily puzzle and get bonus points awarded
 */
export async function completeDailyPuzzle(
  userId: number,
  puzzleId: string,
  languageId: string
): Promise<number> {
  try {
    const bonusPoints = await invoke<number>('complete_daily_puzzle', {
      userId,
      puzzleId,
      languageId,
    })
    return bonusPoints
  } catch (error) {
    console.error('Failed to complete daily puzzle:', error)
    throw error
  }
}

/**
 * Get daily puzzle streak information
 */
export async function getDailyPuzzleStreak(userId: number): Promise<DailyPuzzleStreak> {
  try {
    const streak = await invoke<any>('get_daily_puzzle_streak', { userId })

    return {
      currentStreak: streak.current_streak,
      longestStreak: streak.longest_streak,
      totalCompleted: streak.total_completed,
      lastCompletionDate: streak.last_completion_date,
    }
  } catch (error) {
    console.error('Failed to get daily puzzle streak:', error)
    throw error
  }
}
