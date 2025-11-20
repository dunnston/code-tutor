import type { Puzzle, ValidationResult } from '@/types/puzzle'

interface PuzzleSuccessModalProps {
  puzzle: Puzzle
  validation: ValidationResult
  pointsEarned: number
  solveTime: number // seconds
  hintsUsed: number
  onClose: () => void
  onNextPuzzle?: () => void
}

export function PuzzleSuccessModal({
  puzzle,
  validation,
  pointsEarned,
  solveTime,
  hintsUsed,
  onClose,
  onNextPuzzle,
}: PuzzleSuccessModalProps) {
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-navy-900 rounded-xl border-2 border-green-500/50 max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-t-xl text-center">
          <div className="flex justify-center mb-3">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Puzzle Solved!</h2>
          <p className="text-green-100 text-lg">{puzzle.title}</p>
        </div>

        {/* Stats */}
        <div className="p-6 space-y-4">
          {/* Points Earned or Solution Viewed Warning */}
          {pointsEarned > 0 ? (
            <div className="bg-navy-800 rounded-lg p-4 border border-yellow-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <div>
                    <div className="text-sm text-gray-400">Points Earned</div>
                    <div className="text-2xl font-bold text-yellow-500">+{pointsEarned}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-orange-900/20 border border-orange-600/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-orange-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="text-sm font-semibold text-orange-400 mb-1">
                    No Points Awarded
                  </div>
                  <div className="text-xs text-orange-200">
                    You viewed the solution before solving, so no points were awarded. Great job completing it though!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            {/* Solve Time */}
            <div className="bg-navy-800 rounded-lg p-3 text-center border border-navy-700">
              <div className="text-xs text-gray-400 mb-1">Time</div>
              <div className="text-lg font-semibold text-white">{formatTime(solveTime)}</div>
            </div>

            {/* Tests Passed */}
            <div className="bg-navy-800 rounded-lg p-3 text-center border border-navy-700">
              <div className="text-xs text-gray-400 mb-1">Tests</div>
              <div className="text-lg font-semibold text-green-400">
                {validation.passedCount}/{validation.totalCount}
              </div>
            </div>

            {/* Hints Used */}
            <div className="bg-navy-800 rounded-lg p-3 text-center border border-navy-700">
              <div className="text-xs text-gray-400 mb-1">Hints</div>
              <div className="text-lg font-semibold text-white">{hintsUsed}</div>
            </div>
          </div>

          {/* Optimization Challenge */}
          {puzzle.hasOptimization && (
            <div className="bg-purple-900/20 border border-purple-700/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="text-sm font-semibold text-purple-400 mb-1">
                    Optimization Challenge Available
                  </div>
                  <div className="text-xs text-gray-300">
                    Try optimizing your solution to match the target complexity!
                  </div>
                  {puzzle.optimalTimeComplexity && (
                    <div className="text-xs text-gray-400 mt-1">
                      Target: {puzzle.optimalTimeComplexity} time, {puzzle.optimalSpaceComplexity} space
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          {onNextPuzzle && (
            <button
              onClick={onNextPuzzle}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-lg transition-all"
            >
              Next Puzzle
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 bg-navy-800 hover:bg-navy-700 text-white font-semibold py-3 rounded-lg transition-colors border border-navy-700"
          >
            {onNextPuzzle ? 'View Solution' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  )
}
