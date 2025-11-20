import { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/store'

interface LeaderboardEntry {
  rank: number
  username: string
  totalPoints: number
  solvedCount: number
  averageTime: number
  isCurrentUser: boolean
}

type LeaderboardPeriod = 'all-time' | 'monthly' | 'weekly'

export function PuzzleLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<LeaderboardPeriod>('all-time')
  const setCurrentView = useAppStore((state) => state.setCurrentView)

  const handleBack = () => {
    setCurrentView('puzzles')
  }

  useEffect(() => {
    loadLeaderboard()
  }, [period])

  const loadLeaderboard = async () => {
    try {
      setLoading(true)
      // TODO: Implement backend API call to fetch leaderboard data
      // For now, showing placeholder data

      // Simulated data - will be replaced with real API call
      const mockData: LeaderboardEntry[] = [
        {
          rank: 1,
          username: 'CodeMaster',
          totalPoints: 2500,
          solvedCount: 25,
          averageTime: 180,
          isCurrentUser: false,
        },
        {
          rank: 2,
          username: 'You',
          totalPoints: 1200,
          solvedCount: 12,
          averageTime: 240,
          isCurrentUser: true,
        },
        {
          rank: 3,
          username: 'PuzzleWizard',
          totalPoints: 1100,
          solvedCount: 11,
          averageTime: 200,
          isCurrentUser: false,
        },
      ]

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      setEntries(mockData)
    } catch (err) {
      console.error('Failed to load leaderboard:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    return `${minutes}m`
  }

  const getRankColor = (rank: number): string => {
    switch (rank) {
      case 1:
        return 'text-yellow-500'
      case 2:
        return 'text-gray-400'
      case 3:
        return 'text-orange-600'
      default:
        return 'text-gray-500'
    }
  }

  const getRankIcon = (rank: number): string => {
    switch (rank) {
      case 1:
        return '🥇'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return ''
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy-900">
      <div className="max-w-4xl mx-auto p-6">
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
            <span className="text-5xl">🏆</span>
            Leaderboard
          </h1>
          <p className="text-gray-400 text-lg">
            See how you rank against other puzzle solvers
          </p>
        </div>

        {/* Period Filter */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setPeriod('all-time')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              period === 'all-time'
                ? 'bg-accent-500 text-white'
                : 'bg-navy-800 text-gray-400 hover:bg-navy-700 border border-navy-700'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              period === 'monthly'
                ? 'bg-accent-500 text-white'
                : 'bg-navy-800 text-gray-400 hover:bg-navy-700 border border-navy-700'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setPeriod('weekly')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              period === 'weekly'
                ? 'bg-accent-500 text-white'
                : 'bg-navy-800 text-gray-400 hover:bg-navy-700 border border-navy-700'
            }`}
          >
            This Week
          </button>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-navy-800 border border-navy-700 rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-navy-900 border-b border-navy-700 text-sm text-gray-400 font-medium">
            <div className="col-span-1">Rank</div>
            <div className="col-span-4">Player</div>
            <div className="col-span-2 text-right">Points</div>
            <div className="col-span-2 text-right">Solved</div>
            <div className="col-span-3 text-right">Avg Time</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-navy-700">
            {entries.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-400">No leaderboard data available yet</p>
                <p className="text-gray-500 text-sm mt-2">Start solving puzzles to compete!</p>
              </div>
            ) : (
              entries.map((entry) => (
                <div
                  key={entry.rank}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 transition-colors ${
                    entry.isCurrentUser
                      ? 'bg-accent-500/10 border-l-4 border-l-accent-500'
                      : 'hover:bg-navy-700/50'
                  }`}
                >
                  {/* Rank */}
                  <div className="col-span-1 flex items-center gap-2">
                    <span className={`text-xl font-bold ${getRankColor(entry.rank)}`}>
                      {getRankIcon(entry.rank) || `#${entry.rank}`}
                    </span>
                  </div>

                  {/* Username */}
                  <div className="col-span-4 flex items-center">
                    <span className={`font-medium ${entry.isCurrentUser ? 'text-accent-400' : 'text-white'}`}>
                      {entry.username}
                      {entry.isCurrentUser && (
                        <span className="ml-2 text-xs text-gray-400">(You)</span>
                      )}
                    </span>
                  </div>

                  {/* Points */}
                  <div className="col-span-2 flex items-center justify-end">
                    <span className="text-green-500 font-bold">{entry.totalPoints.toLocaleString()}</span>
                  </div>

                  {/* Solved Count */}
                  <div className="col-span-2 flex items-center justify-end">
                    <span className="text-gray-300">{entry.solvedCount}</span>
                  </div>

                  {/* Average Time */}
                  <div className="col-span-3 flex items-center justify-end">
                    <span className="text-gray-400">{formatTime(entry.averageTime)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-300">
              <p className="font-medium mb-1">How Rankings Work</p>
              <ul className="list-disc list-inside text-blue-200/80 space-y-1">
                <li>Rankings are based on total points earned from puzzle solutions</li>
                <li>Solving puzzles faster and with fewer hints earns more points</li>
                <li>Viewing the solution disqualifies you from earning points for that puzzle</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
