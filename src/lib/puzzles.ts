/**
 * Puzzle management utilities
 * Interfaces with Tauri backend for puzzle data
 */

import { invoke } from '@tauri-apps/api/core'
import type {
  PuzzleCategory,
  Puzzle,
  PuzzleImplementation,
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

    return {
      id: impl.id,
      puzzleId: impl.puzzle_id,
      languageId: impl.language_id,
      starterCode: impl.starter_code,
      solutionCode: impl.solution_code,
      testCases: JSON.parse(impl.test_cases || '[]'),
      hiddenTests: impl.hidden_tests ? JSON.parse(impl.hidden_tests) : undefined,
      hints: impl.hints ? JSON.parse(impl.hints) : [],
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
  return {
    id: puzzle.id,
    categoryId: puzzle.category_id,
    title: puzzle.title,
    description: puzzle.description,
    difficulty: puzzle.difficulty,
    points: puzzle.points,
    concepts: puzzle.concepts ? JSON.parse(puzzle.concepts) : [],
    estimatedMinutes: puzzle.estimated_minutes || 0,
    solveCount: puzzle.solve_count || 0,
    averageTime: puzzle.average_time,
    hasOptimization: puzzle.has_optimization || false,
    optimalTimeComplexity: puzzle.optimal_time_complexity,
    optimalSpaceComplexity: puzzle.optimal_space_complexity,
    optimalLinesOfCode: puzzle.optimal_lines_of_code,
  }
}
