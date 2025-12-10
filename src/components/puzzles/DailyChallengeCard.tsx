import { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/store'
import { getDailyPuzzle, getDailyPuzzleStreak } from '@/lib/puzzles'
import type { DailyPuzzleChallenge, DailyPuzzleStreak } from '@/types/puzzle'

export function DailyChallengeCard() {
  const [challenge, setChallenge] = useState<DailyPuzzleChallenge | null>(null)
  const [streak, setStreak] = useState<DailyPuzzleStreak | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeUntilMidnight, setTimeUntilMidnight] = useState('')

  const { setCurrentPuzzleId, setCurrentView } = useAppStore()

  useEffect(() => {
    loadDailyChallenge()

    // Update countdown every minute
    const interval = setInterval(() => {
      setTimeUntilMidnight(getTimeUntilMidnight())
    }, 60000)

    // Initial countdown
    setTimeUntilMidnight(getTimeUntilMidnight())

    return () => clearInterval(interval)
  }, [])

  const loadDailyChallenge = async () => {
    try {
      setLoading(true)
      const [challengeData, streakData] = await Promise.all([
        getDailyPuzzle(),
        getDailyPuzzleStreak(),
      ])
      setChallenge(challengeData)
      setStreak(streakData)
      setError(null)
    } catch (err) {
      console.error('Failed to load daily challenge:', err)
      setError('Failed to load daily challenge')
    } finally {
      setLoading(false)
    }
  }

  const handleStartChallenge = () => {
    if (challenge) {
      setCurrentPuzzleId(challenge.puzzleId)
      setCurrentView('puzzle-solver')
    }
  }

  const getTimeUntilMidnight = () => {
    const now = new Date()
    const midnight = new Date(now)
    midnight.setHours(24, 0, 0, 0)
    const diff = midnight.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-700/50 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-purple-700/30 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-purple-700/30 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  if (error || !challenge) {
    return (
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-700/50 rounded-lg p-6">
        <div className="text-center">
          <p className="text-red-400 mb-2">{error || 'No challenge available'}</p>
          <button
            onClick={loadDailyChallenge}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const difficultyColors = {
    easy: 'text-green-400 bg-green-500/20',
    medium: 'text-yellow-400 bg-yellow-500/20',
    hard: 'text-orange-400 bg-orange-500/20',
    expert: 'text-red-400 bg-red-500/20',
  }

  return (
    <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-700/50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            Daily Challenge
          </h3>
          <p className="text-sm text-gray-400">
            New puzzle in {timeUntilMidnight}
          </p>
        </div>
        {streak && streak.currentStreak > 0 && (
          <div className="text-right">
            <div className="text-sm text-gray-400">Streak</div>
            <div className="text-2xl font-bold text-orange-500 flex items-center gap-1">
              {streak.currentStreak}
              <span className="text-xl">🔥</span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-navy-900/50 rounded-lg p-4 mb-4 border border-purple-700/30">
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-lg font-semibold text-white">{challenge.puzzle.title}</h4>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              difficultyColors[challenge.puzzle.difficulty]
            }`}
          >
            {challenge.puzzle.difficulty.toUpperCase()}
          </span>
        </div>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {challenge.puzzle.description.substring(0, 150)}...
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>💎 {challenge.puzzle.points} pts</span>
          <span className="text-purple-400 font-semibold">⚡ +{challenge.bonusPoints} bonus</span>
          {challenge.puzzle.estimatedMinutes && (
            <span>⏱️ ~{challenge.puzzle.estimatedMinutes} min</span>
          )}
        </div>
      </div>

      {challenge.completedToday ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Completed Today!</span>
            {challenge.completedLanguages.length > 0 && (
              <span className="text-xs text-gray-400">
                ({challenge.completedLanguages.join(', ')})
              </span>
            )}
          </div>
          <button
            onClick={handleStartChallenge}
            className="px-4 py-2 bg-navy-800 hover:bg-navy-700 text-gray-300 rounded-lg transition-colors text-sm border border-navy-700"
          >
            Try Another Language
          </button>
        </div>
      ) : (
        <button
          onClick={handleStartChallenge}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium shadow-lg hover:shadow-purple-500/50"
        >
          Start Challenge
        </button>
      )}
    </div>
  )
}
