import { useAppStore } from '@/lib/store'

export function StatsGrid() {
  const progress = useAppStore((state) => state.progress)

  // Calculate total lessons completed
  const totalLessonsCompleted = progress.completedLessons.length

  // Calculate total time spent (convert ms to hours and minutes)
  const totalTimeMs = Object.values(progress.lessonSessions).reduce(
    (sum, session) => sum + session.timeSpentMs,
    0
  )
  const totalHours = Math.floor(totalTimeMs / (1000 * 60 * 60))
  const totalMinutes = Math.floor((totalTimeMs % (1000 * 60 * 60)) / (1000 * 60))

  // Calculate average session time
  const sessionCount = Object.keys(progress.lessonSessions).length
  const avgSessionMs = sessionCount > 0 ? totalTimeMs / sessionCount : 0
  const avgMinutes = Math.floor(avgSessionMs / (1000 * 60))

  // Get this week's stats (simplified - last 7 days)
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const recentSessions = Object.values(progress.lessonSessions).filter((session) => {
    if (!session.completedAt) return false
    return new Date(session.completedAt).getTime() > oneWeekAgo
  })
  const lessonsThisWeek = recentSessions.length

  const stats = [
    {
      label: 'Lessons Completed',
      value: totalLessonsCompleted,
      icon: '✅',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Current Streak',
      value: `${progress.streak.currentStreak} days`,
      icon: '🔥',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
    },
    {
      label: 'Total Time',
      value: totalHours > 0 ? `${totalHours}h ${totalMinutes}m` : `${totalMinutes}m`,
      icon: '⏱️',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'This Week',
      value: `${lessonsThisWeek} lessons`,
      icon: '📅',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: 'Avg. Session',
      value: avgMinutes > 0 ? `${avgMinutes} min` : '-',
      icon: '📊',
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/10',
    },
  ]

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-100 mb-4">Your Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-navy-800 rounded-lg p-4 border border-navy-700 hover:border-navy-600 transition-colors"
          >
            <div className={`text-3xl mb-2 ${stat.bgColor} w-12 h-12 rounded-lg flex items-center justify-center`}>
              {stat.icon}
            </div>
            <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
            <div className="text-xs text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
