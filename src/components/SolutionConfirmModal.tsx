interface SolutionConfirmModalProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function SolutionConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
}: SolutionConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-navy-800 border-2 border-accent-500 rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
        {/* Warning Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-accent-500"
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

        {/* Warning Text */}
        <h2 className="text-2xl font-bold text-white text-center mb-4">
          View Solution?
        </h2>
        <p className="text-gray-300 text-center mb-6">
          Viewing the solution will complete this lesson with{' '}
          <span className="text-accent-500 font-bold text-xl">0 XP</span>.
        </p>
        <p className="text-gray-400 text-sm text-center mb-8">
          You won't earn any experience points or achievements for this lesson.
          Are you sure you want to continue?
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-navy-700 hover:bg-navy-600 text-white font-semibold rounded-lg transition-colors"
          >
            Keep Trying
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-lg transition-colors"
          >
            Show Solution
          </button>
        </div>
      </div>
    </div>
  )
}