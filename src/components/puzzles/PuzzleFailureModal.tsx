import type { Puzzle, ValidationResult } from '@/types/puzzle'

interface PuzzleFailureModalProps {
  puzzle: Puzzle
  validation: ValidationResult
  hintsAvailable: number
  hintsUsed: number
  onClose: () => void
  onShowHint?: () => void
  onTryAgain: () => void
}

export function PuzzleFailureModal({
  puzzle,
  validation,
  hintsAvailable,
  hintsUsed,
  onClose,
  onShowHint,
  onTryAgain,
}: PuzzleFailureModalProps) {
  const failedTests = validation.testResults.filter(t => !t.passed)
  const hasHintsRemaining = hintsUsed < hintsAvailable

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-navy-900 rounded-xl border-2 border-red-500/50 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-t-xl text-center">
          <div className="flex justify-center mb-3">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Tests Failed</h2>
          <p className="text-red-100 text-lg">Keep trying, you're getting there!</p>
        </div>

        {/* Stats */}
        <div className="p-6 space-y-4">
          {/* Test Results Summary */}
          <div className="bg-navy-800 rounded-lg p-4 border border-red-500/30">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm text-gray-400">Tests Passed</div>
                <div className="text-2xl font-bold text-white">
                  {validation.passedCount} / {validation.totalCount}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Tests Failed</div>
                <div className="text-2xl font-bold text-red-400">{failedTests.length}</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-navy-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all"
                style={{
                  width: `${(validation.passedCount / validation.totalCount) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Failed Tests Details */}
          <div className="bg-navy-800 rounded-lg border border-navy-700">
            <div className="p-4 border-b border-navy-700">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Failed Test Cases
              </h3>
            </div>
            <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
              {failedTests.slice(0, 3).map((test, index) => (
                <div key={index} className="bg-navy-900 rounded p-3 border border-red-500/20">
                  <div className="text-xs font-semibold text-red-400 mb-2">
                    {test.testCase.description || `Test ${index + 1}`}
                  </div>
                  <div className="font-mono text-xs space-y-1">
                    <div className="text-gray-300">
                      <span className="text-gray-500">Input:</span>{' '}
                      {JSON.stringify(test.testCase.input)}
                    </div>
                    <div className="text-green-400">
                      <span className="text-gray-500">Expected:</span>{' '}
                      {JSON.stringify(test.testCase.expectedOutput)}
                    </div>
                    {test.error ? (
                      <div className="text-red-400">
                        <span className="text-gray-500">Error:</span> {test.error}
                      </div>
                    ) : (
                      <div className="text-red-400">
                        <span className="text-gray-500">Actual:</span>{' '}
                        {JSON.stringify(test.actualOutput)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {failedTests.length > 3 && (
                <div className="text-xs text-gray-500 text-center py-2">
                  + {failedTests.length - 3} more failed test(s)
                </div>
              )}
            </div>
          </div>

          {/* Hints Section */}
          {hasHintsRemaining && onShowHint && (
            <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-yellow-400 mb-1">
                    Need help? ({hintsUsed}/{hintsAvailable} hints used)
                  </div>
                  <div className="text-xs text-gray-300 mb-3">
                    Hints can guide you in the right direction without giving away the answer.
                  </div>
                  <button
                    onClick={onShowHint}
                    className="px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 text-xs rounded transition-colors border border-yellow-500/30 font-medium"
                  >
                    Show Next Hint
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Encouragement */}
          <div className="text-center text-sm text-gray-400 italic">
            "Every expert was once a beginner. Keep coding!"
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onTryAgain}
            className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-lg transition-all"
          >
            Try Again
          </button>
          <button
            onClick={onClose}
            className="px-6 bg-navy-800 hover:bg-navy-700 text-white font-semibold py-3 rounded-lg transition-colors border border-navy-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
