import { useEffect, useState } from 'react'
import { getPuzzleCategories, getPuzzlesByCategory, getAllPuzzleProgress } from '@/lib/puzzles'
import { useAppStore } from '@/lib/store'
import type { PuzzleCategory, UserPuzzleProgress, Puzzle } from '@/types/puzzle'
import { CategoryCard } from './CategoryCard'
import { DailyChallengeCard } from './DailyChallengeCard'

export function PuzzleHub() {
  const [categories, setCategories] = useState<PuzzleCategory[]>([])
  const [puzzleCounts, setPuzzleCounts] = useState<Record<string, number>>({})
  const [solvedCounts, setSolvedCounts] = useState<Record<string, number>>({})
  const [totalSolved, setTotalSolved] = useState(0)
  const [totalPuzzles, setTotalPuzzles] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const setCurrentView = useAppStore((state) => state.setCurrentView)
  const dailyPuzzleStreak = useAppStore((state) => state.dailyPuzzleStreak)

  const handleBackToDashboard = () => {
    setCurrentView('dashboard')
  }

  const handleCategoryClick = (categoryId: string) => {
    const setCurrentPuzzleCategoryId = useAppStore.getState().setCurrentPuzzleCategoryId
    setCurrentPuzzleCategoryId(categoryId)
    setCurrentView('puzzle-list')
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await getPuzzleCategories()
      setCategories(data)

      // Fetch puzzle counts and puzzle data for each category
      const counts: Record<string, number> = {}
      const allPuzzles: Puzzle[] = []
      const puzzlesByCategory: Record<string, Puzzle[]> = {}

      for (const category of data) {
        try {
          const puzzles = await getPuzzlesByCategory(category.id)
          counts[category.id] = puzzles.length
          allPuzzles.push(...puzzles)
          puzzlesByCategory[category.id] = puzzles
        } catch (err) {
          console.error(`Failed to load puzzles for category ${category.id}:`, err)
          counts[category.id] = 0
          puzzlesByCategory[category.id] = []
        }
      }
      setPuzzleCounts(counts)
      setTotalPuzzles(allPuzzles.length)

      // Fetch user progress
      const currentUserId = useAppStore.getState().currentUserId
      if (!currentUserId) {
        console.warn('No user ID available for loading puzzle progress')
        return
      }
      const progress = await getAllPuzzleProgress(currentUserId)

      // Create a set of solved puzzle IDs (unique by puzzleId, not language)
      const solvedPuzzleIds = new Set<string>()
      let pointsEarned = 0

      // Add null checks for progress data
      for (const p of progress) {
        if (p && typeof p === 'object' && p.status === 'solved' && typeof p.puzzleId === 'string') {
          solvedPuzzleIds.add(p.puzzleId)
        }
      }

      // Calculate solved counts per category and total points
      const solved: Record<string, number> = {}
      for (const category of data) {
        const categoryPuzzles = puzzlesByCategory[category.id] || []
        let categorySolved = 0
        for (const puzzle of categoryPuzzles) {
          if (puzzle && puzzle.id && solvedPuzzleIds.has(puzzle.id)) {
            categorySolved++
            // Safely access points with fallback
            pointsEarned += (puzzle.points ?? 0)
          }
        }
        solved[category.id] = categorySolved
      }

      setSolvedCounts(solved)
      setTotalSolved(solvedPuzzleIds.size)
      setTotalPoints(pointsEarned)

      setError(null)
    } catch (err) {
      console.error('Failed to load puzzle categories:', err)
      setError('Failed to load puzzle categories')
    } finally {
      setLoading(false)
    }
  }

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
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={loadCategories}
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
            onClick={handleBackToDashboard}
            className="mb-4 flex items-center gap-2 text-gray-400 hover:text-accent-500 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="text-5xl">🧩</span>
            Coding Puzzles
          </h1>
          <p className="text-gray-400 text-lg">
            Challenge yourself with coding problems and level up your skills
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-navy-800 rounded-lg p-4 border border-navy-700">
            <div className="text-sm text-gray-400 mb-1">Solved</div>
            <div className="text-3xl font-bold text-white">{totalSolved} <span className="text-lg text-gray-500">/ {totalPuzzles}</span></div>
          </div>
          <div className="bg-navy-800 rounded-lg p-4 border border-navy-700">
            <div className="text-sm text-gray-400 mb-1">Current Rank</div>
            <div className="text-3xl font-bold text-accent-500">#—</div>
          </div>
          <div className="bg-navy-800 rounded-lg p-4 border border-navy-700">
            <div className="text-sm text-gray-400 mb-1">Total Points</div>
            <div className="text-3xl font-bold text-green-500">{totalPoints} pts</div>
          </div>
          <div className="bg-navy-800 rounded-lg p-4 border border-navy-700">
            <div className="text-sm text-gray-400 mb-1">Streak</div>
            <div className="text-3xl font-bold text-orange-500 flex items-center gap-2">
              <span>{dailyPuzzleStreak?.currentStreak ?? 0}</span>
              <span className="text-2xl">🔥</span>
            </div>
          </div>
        </div>

        {/* Daily Challenge */}
        <div className="mb-8">
          <DailyChallengeCard />
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📁</span>
            Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map(category => (
              <CategoryCard
                key={category.id}
                category={category}
                totalCount={puzzleCounts[category.id] || 0}
                solvedCount={solvedCounts[category.id] || 0}
                onClick={() => handleCategoryClick(category.id)}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setCurrentView('puzzle-all')}
            className="px-6 py-3 bg-navy-800 hover:bg-navy-700 text-gray-300 rounded-lg transition-colors border border-navy-700"
          >
            View All Puzzles
          </button>
          <button
            onClick={() => setCurrentView('puzzle-leaderboard')}
            className="px-6 py-3 bg-navy-800 hover:bg-navy-700 text-gray-300 rounded-lg transition-colors border border-navy-700"
          >
            Leaderboard
          </button>
          <button
            onClick={() => setCurrentView('puzzle-achievements')}
            className="px-6 py-3 bg-navy-800 hover:bg-navy-700 text-gray-300 rounded-lg transition-colors border border-navy-700"
          >
            My Achievements
          </button>
        </div>
      </div>
    </div>
  )
}
