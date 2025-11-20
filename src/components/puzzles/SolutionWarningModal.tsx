interface SolutionWarningModalProps {
  isOpen: boolean
  puzzleTitle: string
  languageName: string
  onCancel: () => void
  onConfirm: () => void
}

export function SolutionWarningModal({
  isOpen,
  puzzleTitle,
  languageName,
  onCancel,
  onConfirm,
}: SolutionWarningModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-navy-800 border border-orange-600/30 rounded-xl shadow-2xl max-w-lg w-full mx-4 p-6">
        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-orange-600/20 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-white text-center mb-4">
          View Solution?
        </h3>

        {/* Warning Message */}
        <div className="bg-orange-900/20 border border-orange-600/30 rounded-lg p-4 mb-6">
          <p className="text-orange-200 text-sm leading-relaxed mb-3">
            <strong className="text-orange-400">⚠️ Warning:</strong> Viewing the
            solution will have permanent consequences:
          </p>
          <ul className="space-y-2 text-orange-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-0.5">•</span>
              <span>
                This puzzle will be permanently marked as <strong>"Solution Viewed"</strong>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-0.5">•</span>
              <span>
                You will <strong>not earn any points</strong> for solving this puzzle in{' '}
                <strong>{languageName}</strong>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-0.5">•</span>
              <span>You can still practice and learn from the code</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 mt-0.5">•</span>
              <span>
                <strong className="text-orange-400">This cannot be undone</strong>
              </span>
            </li>
          </ul>
        </div>

        {/* Puzzle Info */}
        <div className="bg-navy-900/50 rounded-lg p-3 mb-6 border border-navy-700">
          <div className="text-sm text-gray-400">Puzzle:</div>
          <div className="text-white font-medium">{puzzleTitle}</div>
          <div className="text-sm text-gray-400 mt-1">Language: {languageName}</div>
        </div>

        {/* Encouragement */}
        <p className="text-gray-300 text-sm text-center mb-6 italic">
          💡 Consider using hints first, or taking a break and coming back with fresh eyes.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-navy-700 hover:bg-navy-600 text-gray-200 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium"
          >
            View Solution Anyway
          </button>
        </div>
      </div>
    </div>
  )
}
