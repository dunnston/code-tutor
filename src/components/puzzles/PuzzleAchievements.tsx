import { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/store'

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  requirementType: 'count' | 'streak' | 'difficulty' | 'language' | 'optimization'
  requirementValue: number
  xpReward: number
  earned: boolean
  earnedAt?: string
  progress?: number
}

type AchievementFilter = 'all' | 'earned' | 'locked'

export function PuzzleAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<AchievementFilter>('all')
  const setCurrentView = useAppStore((state) => state.setCurrentView)

  const handleBack = () => {
    setCurrentView('puzzles')
  }

  useEffect(() => {
    loadAchievements()
  }, [])

  const loadAchievements = async () => {
    try {
      setLoading(true)
      // TODO: Implement backend API call to fetch achievements
      // For now, showing placeholder data

      // Simulated achievement data
      const mockAchievements: Achievement[] = [
        {
          id: 'first-puzzle',
          name: 'First Steps',
          description: 'Solve your first puzzle',
          icon: '🎯',
          requirementType: 'count',
          requirementValue: 1,
          xpReward: 50,
          earned: true,
          earnedAt: new Date().toISOString(),
          progress: 1,
        },
        {
          id: 'puzzle-master',
          name: 'Puzzle Master',
          description: 'Solve 10 puzzles',
          icon: '🏅',
          requirementType: 'count',
          requirementValue: 10,
          xpReward: 200,
          earned: false,
          progress: 3,
        },
        {
          id: 'speed-demon',
          name: 'Speed Demon',
          description: 'Solve a puzzle in under 1 minute',
          icon: '⚡',
          requirementType: 'count',
          requirementValue: 1,
          xpReward: 100,
          earned: false,
          progress: 0,
        },
        {
          id: 'perfect-week',
          name: 'Perfect Week',
          description: 'Solve at least one puzzle every day for 7 days',
          icon: '🔥',
          requirementType: 'streak',
          requirementValue: 7,
          xpReward: 300,
          earned: false,
          progress: 2,
        },
        {
          id: 'hard-mode',
          name: 'Hard Mode',
          description: 'Solve a hard difficulty puzzle',
          icon: '💪',
          requirementType: 'difficulty',
          requirementValue: 1,
          xpReward: 150,
          earned: false,
          progress: 0,
        },
        {
          id: 'polyglot',
          name: 'Polyglot',
          description: 'Solve the same puzzle in 3 different languages',
          icon: '🌐',
          requirementType: 'language',
          requirementValue: 3,
          xpReward: 250,
          earned: false,
          progress: 1,
        },
        {
          id: 'optimizer',
          name: 'The Optimizer',
          description: 'Submit an optimal solution for a puzzle',
          icon: '🎓',
          requirementType: 'optimization',
          requirementValue: 1,
          xpReward: 200,
          earned: false,
          progress: 0,
        },
        {
          id: 'century-club',
          name: 'Century Club',
          description: 'Solve 100 puzzles',
          icon: '💯',
          requirementType: 'count',
          requirementValue: 100,
          xpReward: 1000,
          earned: false,
          progress: 3,
        },
      ]

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      setAchievements(mockAchievements)
    } catch (err) {
      console.error('Failed to load achievements:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'earned') return achievement.earned
    if (filter === 'locked') return !achievement.earned
    return true
  })

  const earnedCount = achievements.filter(a => a.earned).length
  const totalXpEarned = achievements
    .filter(a => a.earned)
    .reduce((sum, a) => sum + a.xpReward, 0)

  const getProgressPercentage = (achievement: Achievement): number => {
    if (!achievement.progress) return 0
    return Math.min(100, (achievement.progress / achievement.requirementValue) * 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading achievements...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy-900">
      <div className="max-w-5xl mx-auto p-6">
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
            My Achievements
          </h1>
          <p className="text-gray-400 text-lg">
            Track your puzzle-solving milestones and accomplishments
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-navy-800 border border-navy-700 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Achievements Earned</div>
            <div className="text-3xl font-bold text-white">
              {earnedCount} <span className="text-lg text-gray-500">/ {achievements.length}</span>
            </div>
          </div>
          <div className="bg-navy-800 border border-navy-700 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">XP from Achievements</div>
            <div className="text-3xl font-bold text-green-500">{totalXpEarned} XP</div>
          </div>
          <div className="bg-navy-800 border border-navy-700 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Completion Rate</div>
            <div className="text-3xl font-bold text-accent-500">
              {achievements.length > 0 ? Math.round((earnedCount / achievements.length) * 100) : 0}%
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filter === 'all'
                ? 'bg-accent-500 text-white'
                : 'bg-navy-800 text-gray-400 hover:bg-navy-700 border border-navy-700'
            }`}
          >
            All ({achievements.length})
          </button>
          <button
            onClick={() => setFilter('earned')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filter === 'earned'
                ? 'bg-accent-500 text-white'
                : 'bg-navy-800 text-gray-400 hover:bg-navy-700 border border-navy-700'
            }`}
          >
            Earned ({earnedCount})
          </button>
          <button
            onClick={() => setFilter('locked')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filter === 'locked'
                ? 'bg-accent-500 text-white'
                : 'bg-navy-800 text-gray-400 hover:bg-navy-700 border border-navy-700'
            }`}
          >
            Locked ({achievements.length - earnedCount})
          </button>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`bg-navy-800 border rounded-lg p-5 transition-all ${
                achievement.earned
                  ? 'border-green-500/50 shadow-lg shadow-green-500/10'
                  : 'border-navy-700 opacity-75'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`text-5xl ${
                    achievement.earned ? '' : 'grayscale opacity-50'
                  }`}
                >
                  {achievement.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className={`text-lg font-bold ${
                        achievement.earned ? 'text-white' : 'text-gray-400'
                      }`}>
                        {achievement.name}
                      </h3>
                      {achievement.earned && achievement.earnedAt && (
                        <p className="text-xs text-green-400">
                          Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-accent-400 font-medium">
                      <span>+{achievement.xpReward}</span>
                      <span className="text-xs">XP</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-400 mb-3">
                    {achievement.description}
                  </p>

                  {/* Progress Bar */}
                  {!achievement.earned && achievement.progress !== undefined && (
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress} / {achievement.requirementValue}</span>
                      </div>
                      <div className="w-full h-2 bg-navy-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent-500 transition-all duration-300"
                          style={{ width: `${getProgressPercentage(achievement)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Earned Badge */}
                  {achievement.earned && (
                    <div className="flex items-center gap-2 text-sm text-green-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Completed</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-2">No achievements found</p>
            <p className="text-gray-500 text-sm">
              {filter === 'earned'
                ? 'Start solving puzzles to earn achievements!'
                : 'Try selecting a different filter'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
