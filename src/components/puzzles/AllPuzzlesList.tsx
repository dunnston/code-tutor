import { useEffect, useState } from 'react'
import { getPuzzleCategories, getPuzzlesByCategory } from '@/lib/puzzles'
import { useAppStore } from '@/lib/store'
import type { Puzzle, PuzzleDifficulty } from '@/types/puzzle'
import { PuzzleCard } from './PuzzleCard'

type SortOption = 'difficulty' | 'points' | 'acceptance' | 'title' | 'category'

export function AllPuzzlesList() {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [difficultyFilter, setDifficultyFilter] = useState<PuzzleDifficulty | 'all'>('all')
  const [sortBy, setSortBy] = useState<SortOption>('difficulty')
  const setCurrentView = useAppStore((state) => state.setCurrentView)
  const setCurrentPuzzleId = useAppStore((state) => state.setCurrentPuzzleId)

  const handlePuzzleClick = (puzzleId: string) => {
    setCurrentPuzzleId(puzzleId)
    setCurrentView('puzzle-solver')
  }

  const handleBack = () => {
    setCurrentView('puzzles')
  }

  useEffect(() => {
    loadAllPuzzles()
  }, [])

  const loadAllPuzzles = async () => {
    try {
      setLoading(true)
      // Get all categories
      const categories = await getPuzzleCategories()

      // Fetch puzzles from all categories
      const allPuzzles: Puzzle[] = []
      for (const category of categories) {
        try {
          const categoryPuzzles = await getPuzzlesByCategory(category.id)
          allPuzzles.push(...categoryPuzzles)
        } catch (err) {
          console.error(`Failed to load puzzles for category ${category.id}:`, err)
        }
      }

      setPuzzles(allPuzzles)
      setError(null)
    } catch (err) {
      console.error('Failed to load all puzzles:', err)
      setError('Failed to load puzzles')
    } finally {
      setLoading(false)
    }
  }

  // Filter puzzles by difficulty
  const filteredPuzzles = difficultyFilter === 'all'
    ? puzzles
    : puzzles.filter(p => p.difficulty === difficultyFilter)

  // Sort puzzles
  const sortedPuzzles = [...filteredPuzzles].sort((a, b) => {
    switch (sortBy) {
      case 'difficulty':
        const difficultyOrder = { easy: 1, medium: 2, hard: 3, expert: 4 }
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
      case 'points':
        return b.points - a.points
      case 'title':
        return a.title.localeCompare(b.title)
      case 'category':
        return a.categoryId.localeCompare(b.categoryId)
      case 'acceptance':
        // TODO: Calculate acceptance rate when we have user progress data
        return 0
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading puzzles...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={loadAllPuzzles}
            className="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy-900">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="mb-4 flex items-center gap-2 text-gray-400 hover:text-accent-500 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Puzzle Hub</span>
          </button>

          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="text-5xl">🧩</span>
            All Puzzles
          </h1>
          <p className="text-gray-400 text-lg">
            Browse all available coding puzzles across all categories
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="bg-navy-800 border border-navy-700 rounded-lg p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Difficulty Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-400">Difficulty:</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setDifficultyFilter('all')}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    difficultyFilter === 'all'
                      ? 'bg-accent-500 text-white'
                      : 'bg-navy-900 text-gray-400 hover:text-gray-300'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setDifficultyFilter('easy')}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    difficultyFilter === 'easy'
                      ? 'bg-green-500 text-white'
                      : 'bg-navy-900 text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Easy
                </button>
                <button
                  onClick={() => setDifficultyFilter('medium')}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    difficultyFilter === 'medium'
                      ? 'bg-orange-500 text-white'
                      : 'bg-navy-900 text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Medium
                </button>
                <button
                  onClick={() => setDifficultyFilter('hard')}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    difficultyFilter === 'hard'
                      ? 'bg-red-500 text-white'
                      : 'bg-navy-900 text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Hard
                </button>
                <button
                  onClick={() => setDifficultyFilter('expert')}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    difficultyFilter === 'expert'
                      ? 'bg-purple-500 text-white'
                      : 'bg-navy-900 text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Expert
                </button>
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 ml-auto">
              <label className="text-sm text-gray-400">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-1 bg-navy-900 border border-navy-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-accent-500"
              >
                <option value="difficulty">Difficulty</option>
                <option value="points">Points</option>
                <option value="title">Title</option>
                <option value="category">Category</option>
                <option value="acceptance">Acceptance Rate</option>
              </select>
            </div>
          </div>
        </div>

        {/* Puzzle Count */}
        <div className="mb-4 text-sm text-gray-400">
          Showing {sortedPuzzles.length} of {puzzles.length} puzzles
        </div>

        {/* Puzzle Grid */}
        {sortedPuzzles.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-navy-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-400 text-lg mb-2">No puzzles found</p>
            <p className="text-gray-500 text-sm">
              {difficultyFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Puzzles coming soon!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {sortedPuzzles.map(puzzle => (
              <PuzzleCard
                key={puzzle.id}
                puzzle={puzzle}
                onClick={() => handlePuzzleClick(puzzle.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
