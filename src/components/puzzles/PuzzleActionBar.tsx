interface PuzzleActionBarProps {
  onRunTests: () => void
  onSubmit: () => void
  onShowHint: () => void
  onShowSolution: () => void
  onReset: () => void
  executing: boolean
  hintsAvailable: number
  hintsRevealed: number
}

export function PuzzleActionBar({
  onRunTests,
  onSubmit,
  onShowHint,
  onShowSolution,
  onReset,
  executing,
  hintsAvailable,
  hintsRevealed,
}: PuzzleActionBarProps) {
  return (
    <div className="h-14 bg-navy-800 border-t border-b border-navy-700 flex items-center justify-between px-4">
      {/* Left: Primary Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onRunTests}
          disabled={executing}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
        >
          {executing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Running...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Run Tests</span>
            </>
          )}
        </button>

        <button
          onClick={onSubmit}
          disabled={executing}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Submit Solution</span>
        </button>
      </div>

      {/* Right: Helper Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onShowHint}
          disabled={hintsRevealed >= hintsAvailable}
          className="px-3 py-2 bg-navy-700 hover:bg-navy-600 disabled:bg-navy-800 disabled:text-gray-600 text-gray-300 rounded-lg transition-colors text-sm flex items-center gap-2"
          title={hintsRevealed >= hintsAvailable ? 'No more hints available' : 'Show next hint'}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span>Hint ({hintsRevealed}/{hintsAvailable})</span>
        </button>

        <button
          onClick={onReset}
          className="px-3 py-2 bg-navy-700 hover:bg-navy-600 text-gray-300 rounded-lg transition-colors text-sm flex items-center gap-2"
          title="Reset to starter code"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Reset</span>
        </button>

        <button
          onClick={onShowSolution}
          className="px-3 py-2 bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 border border-orange-600/30 rounded-lg transition-colors text-sm flex items-center gap-2"
          title="Reveal solution (no points)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span>Solution</span>
        </button>
      </div>
    </div>
  )
}
