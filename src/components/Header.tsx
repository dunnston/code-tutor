import { useAppStore } from '@/lib/store'
import { xpForNextLevel, xpProgressToNextLevel } from '@/lib/storage'
import { getCurrentProfile } from '@/lib/profiles'
import { invoke } from '@tauri-apps/api/core'
import { useEffect, useState } from 'react'
import type { AchievementStats } from '@/lib/achievements'

export function Header() {
  const currentLesson = useAppStore((state) => state.currentLesson)
  const progress = useAppStore((state) => state.progress)
  const toggleDashboard = useAppStore((state) => state.toggleDashboard)
  const toggleSettings = useAppStore((state) => state.toggleSettings)
  const setCurrentView = useAppStore((state) => state.setCurrentView)
  const [achievementStats, setAchievementStats] = useState<AchievementStats | null>(null)

  const currentProfile = getCurrentProfile()

  // Fetch achievement stats for unviewed badge
  useEffect(() => {
    const fetchAchievementStats = async () => {
      try {
        const stats = await invoke<AchievementStats>('get_achievement_stats', {
          userId: 1, // TODO: Get from current profile
        })
        setAchievementStats(stats)
      } catch (error) {
        console.error('Failed to fetch achievement stats:', error)
      }
    }
    fetchAchievementStats()

    // Refresh stats every 10 seconds to catch new achievements
    const interval = setInterval(fetchAchievementStats, 10000)
    return () => clearInterval(interval)
  }, [])

  const currentLevel = progress.level
  const currentXP = progress.xpEarned
  const nextLevelXP = xpForNextLevel(currentLevel)
  const xpProgress = xpProgressToNextLevel(currentXP)
  const xpInLevel = currentXP - xpForNextLevel(currentLevel - 1)
  const xpNeeded = nextLevelXP - xpForNextLevel(currentLevel - 1)

  return (
    <header className="h-16 bg-navy-800 border-b border-navy-700 flex items-center justify-between px-6">
      {/* Logo */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="p-2 hover:bg-navy-700 rounded-lg transition-colors group"
            title="Back to Dashboard"
          >
            <svg
              className="w-5 h-5 text-gray-400 group-hover:text-accent-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center font-bold text-white">
            CT
          </div>
          <h1 className="text-xl font-bold text-white">Code Tutor</h1>
        </div>

        {/* Streak Counter */}
        {progress.streak.currentStreak > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-navy-900 rounded-lg border border-navy-700">
            <span className="text-lg">🔥</span>
            <div className="text-sm">
              <span className="text-orange-500 font-bold">{progress.streak.currentStreak}</span>
              <span className="text-gray-400 ml-1">day streak</span>
            </div>
          </div>
        )}

        {/* Achievements Button */}
        <button
          onClick={() => setCurrentView('achievements')}
          className="flex items-center gap-2 px-3 py-1.5 bg-navy-900 rounded-lg border border-navy-700 hover:border-yellow-500 transition-colors relative"
          title="View all achievements"
        >
          <span className="text-lg">🏆</span>
          <span className="text-sm text-gray-400">Achievements</span>
          {/* Unviewed Badge */}
          {achievementStats && achievementStats.unviewed_achievements > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {achievementStats.unviewed_achievements}
            </div>
          )}
        </button>
      </div>

      {/* Progress indicator */}
      {currentLesson && (
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-300">
            <span className="font-semibold text-white">
              {currentLesson.title}
            </span>
            {currentLesson.subtitle && (
              <span className="text-gray-400 ml-2">
                • {currentLesson.subtitle}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-accent-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-accent-500 font-semibold">
                {currentLesson.xpReward} XP
              </span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-gray-300">{currentLesson.estimatedTime}</span>
            <span className="text-gray-400">•</span>
            <div
              className="px-2 py-1 rounded text-xs font-medium"
              style={{
                backgroundColor:
                  currentLesson.difficulty <= 3
                    ? 'rgba(34, 197, 94, 0.1)'
                    : currentLesson.difficulty <= 6
                      ? 'rgba(251, 146, 60, 0.1)'
                      : 'rgba(239, 68, 68, 0.1)',
                color:
                  currentLesson.difficulty <= 3
                    ? '#22c55e'
                    : currentLesson.difficulty <= 6
                      ? '#fb923c'
                      : '#ef4444',
              }}
              title={`Difficulty: ${currentLesson.difficulty <= 3 ? 'Beginner' : currentLesson.difficulty <= 6 ? 'Intermediate' : 'Advanced'}`}
            >
              Difficulty {currentLesson.difficulty}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Level & XP Progress */}
        <button
          onClick={toggleDashboard}
          className="flex items-center gap-3 px-3 py-1.5 bg-navy-900 rounded-lg border border-navy-700 hover:border-accent-500 transition-colors cursor-pointer group"
          title="Click to view progress dashboard"
        >
          {/* Level Badge */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">{currentLevel}</span>
            </div>
            <div className="text-xs text-gray-400 group-hover:text-gray-300">Level</div>
          </div>

          {/* XP Progress Bar */}
          <div className="flex flex-col gap-1 min-w-[120px]">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">{xpInLevel} XP</span>
              <span className="text-gray-500">{xpNeeded} XP</span>
            </div>
            <div className="bg-navy-700 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-full h-1.5 transition-all duration-300"
                style={{ width: `${xpProgress * 100}%` }}
              />
            </div>
          </div>
        </button>

        {/* Current Profile */}
        {currentProfile && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-navy-900 rounded-lg border border-navy-700">
            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-navy-600">
              <img
                src={currentProfile.avatar}
                alt={currentProfile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm text-gray-300">{currentProfile.name}</span>
          </div>
        )}

        <button
          onClick={toggleSettings}
          className="p-2 hover:bg-navy-700 rounded-lg transition-colors"
          title="Settings"
        >
          <svg
            className="w-5 h-5 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>
    </header>
  )
}
