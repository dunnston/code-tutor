import { useAppStore } from '@/lib/store'
import { getCurrentProfile } from '@/lib/profiles'
import { xpForNextLevel, xpProgressToNextLevel } from '@/lib/storage'

interface ProfileHeaderProps {
  onLogout?: () => void
}

export function ProfileHeader({ onLogout }: ProfileHeaderProps) {
  const progress = useAppStore((state) => state.progress)
  const toggleSettings = useAppStore((state) => state.toggleSettings)
  const currentProfile = getCurrentProfile()

  const currentLevel = progress.level
  const currentXP = progress.xpEarned
  const nextLevelXP = xpForNextLevel(currentLevel)
  const xpProgress = xpProgressToNextLevel(currentXP)
  const xpInLevel = currentXP - xpForNextLevel(currentLevel - 1)
  const xpNeeded = nextLevelXP - xpForNextLevel(currentLevel - 1)

  if (!currentProfile) return null

  return (
    <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
      <div className="flex items-start justify-between">
        {/* Left: Profile Info */}
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-accent-500/30">
            <img
              src={currentProfile.avatar}
              alt={currentProfile.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Profile Details */}
          <div>
            <h1 className="text-3xl font-bold text-gray-100 mb-1">{currentProfile.name}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{currentLevel}</span>
                </div>
                <span>Level {currentLevel}</span>
              </div>

              {progress.streak.currentStreak > 0 && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <span className="text-lg">🔥</span>
                    <span>{progress.streak.currentStreak} day streak</span>
                  </div>
                </>
              )}

              <span>•</span>
              <span>{progress.xpEarned} total XP</span>
            </div>

            {/* XP Progress Bar */}
            <div className="mt-4 w-80">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>{xpInLevel} XP</span>
                <span className="text-gray-500">{xpNeeded} XP to Level {currentLevel + 1}</span>
              </div>
              <div className="bg-navy-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-full h-3 transition-all duration-500"
                  style={{ width: `${xpProgress * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {onLogout && (
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-navy-700 hover:bg-navy-600 text-gray-300 hover:text-white rounded-lg transition-colors flex items-center gap-2"
              title="Logout"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          )}
          <button
            onClick={toggleSettings}
            className="p-2 hover:bg-navy-700 rounded-lg transition-colors"
            title="Settings"
          >
            <svg
              className="w-6 h-6 text-gray-400 hover:text-gray-200"
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
      </div>
    </div>
  )
}
