import { useAppStore } from '@/lib/store'
import {
  xpForNextLevel,
  xpProgressToNextLevel,
  BADGES,
  exportProgress,
  type BadgeId,
} from '@/lib/storage'

export function ProgressDashboard() {
  const { progress, dashboardOpen, toggleDashboard } = useAppStore()

  if (!dashboardOpen) {
    return null
  }

  const currentLevel = progress.level
  const currentXP = progress.xpEarned
  const nextLevelXP = xpForNextLevel(currentLevel)
  const xpProgress = xpProgressToNextLevel(currentXP)
  const xpInLevel = currentXP - xpForNextLevel(currentLevel - 1)
  const xpNeeded = nextLevelXP - xpForNextLevel(currentLevel - 1)

  const handleExport = () => {
    const data = exportProgress()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `code-tutor-progress-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Calculate stats
  const totalLessons = 10 // Python track
  const completedCount = progress.completedLessons.length
  const completionRate = Math.round((completedCount / totalLessons) * 100)

  // Calculate total time spent
  const totalTimeMs = Object.values(progress.lessonSessions).reduce(
    (sum, session) => sum + session.timeSpentMs,
    0
  )
  const totalHours = Math.floor(totalTimeMs / (1000 * 60 * 60))
  const totalMinutes = Math.floor((totalTimeMs % (1000 * 60 * 60)) / (1000 * 60))

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={toggleDashboard}
      />

      {/* Dashboard Modal */}
      <div className="fixed inset-4 md:inset-10 bg-slate-800 rounded-lg shadow-2xl z-50 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-100">Your Progress</h2>
            <button
              onClick={toggleDashboard}
              className="text-gray-400 hover:text-gray-200 text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Level Card */}
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Level</div>
              <div className="text-3xl font-bold text-orange-400">{currentLevel}</div>
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{xpInLevel} XP</span>
                  <span>{xpNeeded} XP</span>
                </div>
                <div className="bg-slate-600 rounded-full h-2">
                  <div
                    className="bg-orange-500 rounded-full h-2 transition-all duration-300"
                    style={{ width: `${xpProgress * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Lessons Completed Card */}
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Lessons Completed</div>
              <div className="text-3xl font-bold text-green-400">
                {completedCount}/{totalLessons}
              </div>
              <div className="text-sm text-gray-400 mt-2">{completionRate}% Complete</div>
            </div>

            {/* Streak Card */}
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Current Streak</div>
              <div className="text-3xl font-bold text-red-400 flex items-center gap-2">
                {progress.streak.currentStreak > 0 && '🔥'}
                {progress.streak.currentStreak} days
              </div>
              <div className="text-sm text-gray-400 mt-2">
                Best: {progress.streak.longestStreak} days
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{progress.xpEarned}</div>
              <div className="text-xs text-gray-400 mt-1">Total XP</div>
            </div>
            <div className="bg-slate-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{progress.badges.length}</div>
              <div className="text-xs text-gray-400 mt-1">Badges Earned</div>
            </div>
            <div className="bg-slate-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {totalHours}h {totalMinutes}m
              </div>
              <div className="text-xs text-gray-400 mt-1">Time Spent</div>
            </div>
            <div className="bg-slate-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                {progress.streak.totalDaysActive}
              </div>
              <div className="text-xs text-gray-400 mt-1">Days Active</div>
            </div>
          </div>

          {/* Badges Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-100 mb-4">Achievements</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {(Object.keys(BADGES) as BadgeId[]).map((badgeId) => {
                const badge = BADGES[badgeId]
                const earned = progress.badges.includes(badgeId)
                return (
                  <div
                    key={badgeId}
                    className={`bg-slate-700 rounded-lg p-4 text-center transition-all ${
                      earned ? 'opacity-100' : 'opacity-40 grayscale'
                    }`}
                    title={badge.description}
                  >
                    <div className="text-4xl mb-2">{badge.icon}</div>
                    <div className={`text-sm font-medium ${earned ? 'text-gray-100' : 'text-gray-500'}`}>
                      {badge.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{badge.description}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleExport}
              className="bg-slate-700 hover:bg-slate-600 text-gray-200 px-6 py-2 rounded-lg transition-colors"
            >
              Export Progress
            </button>
            <button
              onClick={toggleDashboard}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
