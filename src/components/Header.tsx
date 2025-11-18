import { useAppStore } from '@/lib/store'

export function Header() {
  const currentLesson = useAppStore((state) => state.currentLesson)

  return (
    <header className="h-16 bg-navy-800 border-b border-navy-700 flex items-center justify-between px-6">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center font-bold text-white">
          CT
        </div>
        <h1 className="text-xl font-bold text-white">Code Tutor</h1>
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
            >
              Level {currentLesson.difficulty}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
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
