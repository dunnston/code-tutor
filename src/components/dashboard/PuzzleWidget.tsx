import { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/store'
import { getDailyPuzzleStreak } from '@/lib/puzzles'

export function PuzzleWidget() {
  const setCurrentView = useAppStore((state) => state.setCurrentView)
  const [dailyStreak, setDailyStreak] = useState(0)

  // TODO: Get actual puzzle stats from user progress
  const puzzlesSolved = 0
  const totalPoints = 0

  useEffect(() => {
    loadDailyStreak()
  }, [])

  const loadDailyStreak = async () => {
    try {
      const streakData = await getDailyPuzzleStreak()
      setDailyStreak(streakData.currentStreak)
    } catch (error) {
      console.error('Failed to load daily puzzle streak:', error)
    }
  }

  const handleOpenPuzzles = () => {
    setCurrentView('puzzles')
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-700/50 rounded-xl p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl">🧩</span>
            Coding Puzzles
          </h3>
          <p className="text-gray-400">
            Challenge yourself with algorithmic problems
          </p>
        </div>
        <button
          onClick={handleOpenPuzzles}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
        >
          Browse Puzzles
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-navy-900/50 rounded-lg p-4 border border-purple-700/30">
          <div className="text-sm text-gray-400 mb-1">Solved</div>
          <div className="text-2xl font-bold text-white">{puzzlesSolved}</div>
        </div>
        <div className="bg-navy-900/50 rounded-lg p-4 border border-purple-700/30">
          <div className="text-sm text-gray-400 mb-1">Daily Streak</div>
          <div className="text-2xl font-bold text-orange-500 flex items-center gap-2">
            {dailyStreak}
            <span className="text-xl">🔥</span>
          </div>
        </div>
        <div className="bg-navy-900/50 rounded-lg p-4 border border-purple-700/30">
          <div className="text-sm text-gray-400 mb-1">Points</div>
          <div className="text-2xl font-bold text-green-500">{totalPoints}</div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex gap-3">
        <button
          onClick={handleOpenPuzzles}
          className="flex-1 py-2 bg-navy-800 hover:bg-navy-700 text-gray-300 rounded-lg transition-colors text-sm border border-navy-700"
        >
          Daily Challenge
        </button>
        <button
          onClick={handleOpenPuzzles}
          className="flex-1 py-2 bg-navy-800 hover:bg-navy-700 text-gray-300 rounded-lg transition-colors text-sm border border-navy-700"
        >
          Leaderboard
        </button>
        <button
          onClick={handleOpenPuzzles}
          className="flex-1 py-2 bg-navy-800 hover:bg-navy-700 text-gray-300 rounded-lg transition-colors text-sm border border-navy-700"
        >
          Achievements
        </button>
      </div>
    </div>
  )
}
