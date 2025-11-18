import { useAppStore } from '@/lib/store'
import { BADGES, type BadgeId } from '@/lib/storage'

export function AchievementPreview() {
  const progress = useAppStore((state) => state.progress)
  const toggleDashboard = useAppStore((state) => state.toggleDashboard)

  // Get all badges and mark which ones are earned
  const allBadges = Object.keys(BADGES) as BadgeId[]
  const earnedCount = progress.badges.length
  const totalCount = allBadges.length

  // Show first 5 badges (mix of earned and locked)
  const badgesToShow = allBadges.slice(0, 5)

  const handleViewAll = () => {
    toggleDashboard() // Opens the full progress dashboard with all badges
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-100">Achievements</h2>
          <p className="text-sm text-gray-400">
            {earnedCount} of {totalCount} badges earned
          </p>
        </div>
        <button
          onClick={handleViewAll}
          className="text-accent-500 hover:text-accent-400 text-sm font-medium transition-colors"
        >
          View All →
        </button>
      </div>

      <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
        <div className="grid grid-cols-5 gap-4">
          {badgesToShow.map((badgeId) => {
            const badge = BADGES[badgeId]
            const earned = progress.badges.includes(badgeId)

            return (
              <div
                key={badgeId}
                className={`text-center transition-all ${
                  earned ? 'opacity-100 scale-100' : 'opacity-40 grayscale scale-95'
                }`}
                title={badge.description}
              >
                <div
                  className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-2 ${
                    earned
                      ? 'bg-gradient-to-br from-yellow-500 to-orange-600 shadow-lg'
                      : 'bg-navy-700'
                  }`}
                >
                  {badge.icon}
                </div>
                <div className={`text-xs font-medium ${earned ? 'text-gray-200' : 'text-gray-600'}`}>
                  {badge.name}
                </div>
              </div>
            )
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Achievement Progress</span>
            <span>{Math.round((earnedCount / totalCount) * 100)}%</span>
          </div>
          <div className="bg-navy-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full h-2 transition-all duration-500"
              style={{ width: `${(earnedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
