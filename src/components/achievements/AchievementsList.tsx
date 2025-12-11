import { useState, useEffect, useMemo } from 'react'
import { invoke } from '@tauri-apps/api/core'
import {
  AchievementWithProgress,
  AchievementStats,
  AchievementTier,
  AchievementCategory,
  TIER_CONFIG,
  getProgressPercentage,
} from '@/lib/achievements'
import { useAppStore } from '@/lib/store'

type FilterType = 'all' | 'completed' | 'locked' | 'in-progress'
type SortType = 'name' | 'completion' | 'progress' | 'tier' | 'rewards'

export function AchievementsList() {
  const [achievements, setAchievements] = useState<AchievementWithProgress[]>([])
  const [stats, setStats] = useState<AchievementStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [categoryFilter, setCategoryFilter] = useState<AchievementCategory | 'all'>('all')
  const [tierFilter, setTierFilter] = useState<AchievementTier | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortType>('tier')

  const currentUserId = useAppStore((state) => state.currentUserId)

  useEffect(() => {
    if (currentUserId) {
      loadAchievements()
      loadStats()
    }
  }, [categoryFilter, tierFilter, currentUserId])

  // Mark all completed achievements as viewed when this component mounts
  useEffect(() => {
    if (!currentUserId) return

    const markAsViewed = async () => {
      try {
        await invoke('mark_achievements_as_viewed', {
          userId: currentUserId,
          achievementIds: null, // null = mark all completed as viewed
        })
        // Reload stats to clear the badge count
        loadStats()
      } catch (err) {
        console.error('Failed to mark achievements as viewed:', err)
      }
    }

    // Delay slightly to give user a chance to see the "NEW" badges
    const timeout = setTimeout(markAsViewed, 2000)
    return () => clearTimeout(timeout)
  }, [currentUserId])

  const loadAchievements = async () => {
    if (!currentUserId) return
    try {
      setLoading(true)
      const result = await invoke<AchievementWithProgress[]>('get_achievements', {
        userId: currentUserId,
        categoryFilter: categoryFilter !== 'all' ? categoryFilter : null,
        tierFilter: tierFilter !== 'all' ? tierFilter : null,
        completionFilter: null, // We'll filter on frontend
      })
      setAchievements(result)
      setError(null)
    } catch (err) {
      console.error('Failed to load achievements:', err)
      setError('Failed to load achievements')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    if (!currentUserId) return
    try {
      const result = await invoke<AchievementStats>('get_achievement_stats', { userId: currentUserId })
      setStats(result)
    } catch (err) {
      console.error('Failed to load achievement stats:', err)
    }
  }

  // Filter and sort achievements
  const filteredAndSortedAchievements = useMemo(() => {
    let filtered = achievements

    // Apply completion filter
    if (filterType === 'completed') {
      filtered = filtered.filter((a) => a.progress?.completed)
    } else if (filterType === 'locked') {
      filtered = filtered.filter((a) => !a.progress?.completed)
    } else if (filterType === 'in-progress') {
      filtered = filtered.filter(
        (a) =>
          a.progress &&
          !a.progress.completed &&
          a.progress.current_progress > 0 &&
          a.requirement_value
      )
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (a) =>
          a.name.toLowerCase().includes(query) || a.description.toLowerCase().includes(query)
      )
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'completion':
          const aCompleted = a.progress?.completed ? 1 : 0
          const bCompleted = b.progress?.completed ? 1 : 0
          return bCompleted - aCompleted
        case 'progress':
          const aProgress = getProgressPercentage(a)
          const bProgress = getProgressPercentage(b)
          return bProgress - aProgress
        case 'tier':
          const tierOrder = { bronze: 1, silver: 2, gold: 3, platinum: 4, secret: 5 }
          return tierOrder[a.tier] - tierOrder[b.tier]
        case 'rewards':
          const aReward = a.xp_reward + a.gold_reward + a.gem_reward
          const bReward = b.xp_reward + b.gold_reward + b.gem_reward
          return bReward - aReward
        default:
          return 0
      }
    })

    return sorted
  }, [achievements, filterType, searchQuery, sortBy])

  // Group achievements by category
  const achievementsByCategory = useMemo(() => {
    const groups: Record<string, AchievementWithProgress[]> = {}
    filteredAndSortedAchievements.forEach((achievement) => {
      if (!groups[achievement.category_id]) {
        groups[achievement.category_id] = []
      }
      groups[achievement.category_id].push(achievement)
    })
    return groups
  }, [filteredAndSortedAchievements])

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

  if (error) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={loadAchievements}
            className="px-6 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="text-5xl">🏆</span>
            Achievements
          </h1>
          <p className="text-gray-400 text-lg">Track your progress and unlock rewards</p>
        </div>

        {/* Stats Summary */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-navy-800 border border-navy-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Completed</div>
              <div className="text-3xl font-bold text-white">
                {stats.completed_achievements}{' '}
                <span className="text-lg text-gray-500">/ {stats.total_achievements}</span>
              </div>
              <div className="text-sm text-accent-400 mt-1">
                {stats.completion_percentage.toFixed(1)}%
              </div>
            </div>

            <div className="bg-navy-800 border border-navy-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">XP Earned</div>
              <div className="text-3xl font-bold text-green-500">{stats.total_xp_earned}</div>
            </div>

            <div className="bg-navy-800 border border-navy-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Gold Earned</div>
              <div className="text-3xl font-bold text-yellow-500">{stats.total_gold_earned}</div>
            </div>

            <div className="bg-navy-800 border border-navy-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Gems Earned</div>
              <div className="text-3xl font-bold text-cyan-500">{stats.total_gems_earned}</div>
            </div>
          </div>
        )}

        {/* Tier Stats */}
        {stats && (
          <div className="bg-navy-800 border border-navy-700 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">By Tier</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(stats.by_tier).map(([tier, count]) => {
                const tierKey = tier.replace('_completed', '') as AchievementTier
                const config = TIER_CONFIG[tierKey]
                return (
                  <div key={tier} className="text-center">
                    <div
                      className={`text-2xl font-bold ${config.color} mb-1`}
                    >
                      {count}
                    </div>
                    <div className="text-sm text-gray-400">{config.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-navy-800 border border-navy-700 rounded-lg p-6 mb-6">
          {/* Completion Filter */}
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-2">Filter by Status</div>
            <div className="flex flex-wrap gap-2">
              {(['all', 'completed', 'locked', 'in-progress'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterType(filter)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    filterType === filter
                      ? 'bg-accent-500 text-white'
                      : 'bg-navy-700 text-gray-400 hover:bg-navy-600'
                  }`}
                >
                  {filter === 'all'
                    ? `All (${achievements.length})`
                    : filter === 'completed'
                      ? `Completed (${achievements.filter((a) => a.progress?.completed).length})`
                      : filter === 'locked'
                        ? `Locked (${achievements.filter((a) => !a.progress?.completed).length})`
                        : `In Progress (${achievements.filter((a) => a.progress && !a.progress.completed && a.progress.current_progress > 0).length})`}
                </button>
              ))}
            </div>
          </div>

          {/* Category and Tier Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as AchievementCategory | 'all')}
                className="w-full px-4 py-2 bg-navy-700 text-white rounded-lg border border-navy-600 focus:border-accent-500 focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="learning">📚 Learning</option>
                <option value="puzzles">🧩 Puzzles</option>
                <option value="streaks">🔥 Streaks</option>
                <option value="progression">⭐ Progression</option>
                <option value="playground">🎨 Playground</option>
                <option value="dungeon">⚔️ Dungeon</option>
                <option value="economic">💰 Economic</option>
                <option value="social">👥 Social</option>
                <option value="mastery">👑 Mastery</option>
                <option value="secret">❓ Secret</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Tier</label>
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value as AchievementTier | 'all')}
                className="w-full px-4 py-2 bg-navy-700 text-white rounded-lg border border-navy-600 focus:border-accent-500 focus:outline-none"
              >
                <option value="all">All Tiers</option>
                <option value="bronze">🥉 Bronze</option>
                <option value="silver">🥈 Silver</option>
                <option value="gold">🥇 Gold</option>
                <option value="platinum">💎 Platinum</option>
                <option value="secret">❓ Secret</option>
              </select>
            </div>
          </div>

          {/* Search and Sort */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search achievements..."
                className="w-full px-4 py-2 bg-navy-700 text-white rounded-lg border border-navy-600 focus:border-accent-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortType)}
                className="w-full px-4 py-2 bg-navy-700 text-white rounded-lg border border-navy-600 focus:border-accent-500 focus:outline-none"
              >
                <option value="tier">Tier</option>
                <option value="name">Name</option>
                <option value="completion">Completion</option>
                <option value="progress">Progress</option>
                <option value="rewards">Rewards</option>
              </select>
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        {filteredAndSortedAchievements.length === 0 ? (
          <div className="text-center py-12 bg-navy-800 border border-navy-700 rounded-lg">
            <p className="text-gray-400 text-lg mb-2">No achievements found</p>
            <p className="text-gray-500 text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          Object.entries(achievementsByCategory).map(([category, categoryAchievements]) => (
            <div key={category} className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 capitalize">
                {category.replace('_', ' ')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryAchievements.map((achievement) => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

interface AchievementCardProps {
  achievement: AchievementWithProgress
}

function AchievementCard({ achievement }: AchievementCardProps) {
  const isCompleted = achievement.progress?.completed ?? false
  const isNewlyCompleted = isCompleted && !achievement.progress?.viewed_at
  const progress = getProgressPercentage(achievement)
  const tierConfig = TIER_CONFIG[achievement.tier]

  return (
    <div
      className={`bg-navy-800 border rounded-lg p-5 transition-all relative ${
        isCompleted
          ? 'border-green-500/50 shadow-lg shadow-green-500/10'
          : 'border-navy-700 opacity-90 hover:opacity-100'
      }`}
    >
      {/* NEW Badge for unviewed achievements */}
      {isNewlyCompleted && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse shadow-lg">
          NEW!
        </div>
      )}

      {/* Tier Badge */}
      <div className="flex items-start justify-between mb-3">
        <div className={`text-5xl ${isCompleted ? '' : 'grayscale opacity-50'}`}>
          {achievement.icon}
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-bold ${tierConfig.bgColor} ${tierConfig.color}`}
        >
          {tierConfig.label}
        </div>
      </div>

      {/* Title and Description */}
      <h3 className={`text-lg font-bold mb-2 ${isCompleted ? 'text-white' : 'text-gray-400'}`}>
        {achievement.name}
      </h3>

      {isCompleted && achievement.progress?.completed_at && (
        <p className="text-xs text-green-400 mb-2">
          Earned {new Date(achievement.progress.completed_at).toLocaleDateString()}
        </p>
      )}

      <p className="text-sm text-gray-400 mb-4">{achievement.description}</p>

      {/* Progress Bar */}
      {!isCompleted && achievement.progress && achievement.requirement_value && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Progress</span>
            <span>
              {achievement.progress.current_progress} / {achievement.requirement_value}
            </span>
          </div>
          <div className="w-full h-2 bg-navy-900 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${tierConfig.gradient} transition-all duration-300`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Rewards */}
      <div className="flex items-center gap-3 text-sm">
        {achievement.xp_reward > 0 && (
          <div className="flex items-center gap-1 text-green-400">
            <span>+{achievement.xp_reward}</span>
            <span className="text-xs">XP</span>
          </div>
        )}
        {achievement.gold_reward > 0 && (
          <div className="flex items-center gap-1 text-yellow-400">
            <span>+{achievement.gold_reward}</span>
            <span className="text-xs">Gold</span>
          </div>
        )}
        {achievement.gem_reward > 0 && (
          <div className="flex items-center gap-1 text-cyan-400">
            <span>+{achievement.gem_reward}</span>
            <span className="text-xs">Gems</span>
          </div>
        )}
        {achievement.unlock_item_id && (
          <div className="flex items-center gap-1 text-purple-400">
            <span className="text-xs">🎁 Item Unlock</span>
          </div>
        )}
      </div>

      {/* Completed Badge */}
      {isCompleted && (
        <div className="mt-4 flex items-center gap-2 text-sm text-green-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Completed</span>
        </div>
      )}
    </div>
  )
}
