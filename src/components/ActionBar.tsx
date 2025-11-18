import { useAppStore } from '@/lib/store'

interface ActionBarProps {
  onRun: () => void
  onSubmit: () => void
  onShowSolution: () => void
}

export function ActionBar({ onRun, onSubmit, onShowSolution }: ActionBarProps) {
  const executionStatus = useAppStore((state) => state.executionStatus)
  const resetCode = useAppStore((state) => state.resetCode)
  const currentLesson = useAppStore((state) => state.currentLesson)

  const isRunning = executionStatus === 'running'

  return (
    <div className="h-16 bg-navy-800 border-t border-navy-700 flex items-center justify-between px-6">
      {/* Left: Main actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onSubmit}
          disabled={isRunning || !currentLesson}
          className="px-6 py-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Submit
        </button>

        <button
          onClick={onRun}
          disabled={isRunning || !currentLesson}
          className="px-6 py-2 bg-navy-700 hover:bg-navy-600 text-gray-300 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isRunning ? (
            <>
              <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
              Running...
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
              Run
            </>
          )}
        </button>
      </div>

      {/* Center: Hint */}
      <div className="text-sm text-gray-400">
        <span className="hidden sm:inline">
          Press{' '}
          <kbd className="px-2 py-1 bg-navy-900 rounded text-xs font-mono">
            Ctrl+Enter
          </kbd>{' '}
          to run your code
        </span>
      </div>

      {/* Right: Secondary actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onShowSolution}
          disabled={!currentLesson}
          className="px-4 py-2 bg-navy-700 hover:bg-navy-600 text-gray-400 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
          title="View solution (only use if stuck!)"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          Solution
        </button>

        <button
          onClick={resetCode}
          disabled={!currentLesson}
          className="px-4 py-2 bg-navy-700 hover:bg-navy-600 text-gray-400 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
          title="Reset to starter code"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Reset
        </button>
      </div>
    </div>
  )
}
