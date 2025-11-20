import { useEffect } from 'react'

export interface AlertModalProps {
  isOpen: boolean
  title: string
  message: string
  variant?: 'error' | 'info' | 'warning' | 'success'
  confirmText?: string
  onConfirm: () => void
}

export function AlertModal({
  isOpen,
  title,
  message,
  variant = 'info',
  confirmText = 'OK',
  onConfirm,
}: AlertModalProps) {
  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onConfirm()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
    }
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onConfirm])

  if (!isOpen) return null

  const variantStyles = {
    error: {
      icon: (
        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      button: 'bg-red-600 hover:bg-red-700 text-white',
    },
    warning: {
      icon: (
        <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    },
    success: {
      icon: (
        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      button: 'bg-green-600 hover:bg-green-700 text-white',
    },
    info: {
      icon: (
        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
  }

  const { icon, button } = variantStyles[variant]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onConfirm}
      />

      {/* Modal */}
      <div className="relative bg-navy-800 border border-navy-700 rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
        {/* Header with Icon */}
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 mt-1">{icon}</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-100">{title}</h3>
          </div>
          <button
            onClick={onConfirm}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Message */}
        <p className="text-gray-300 mb-6 ml-10">{message}</p>

        {/* Actions */}
        <div className="flex justify-end">
          <button
            onClick={onConfirm}
            className={`px-6 py-2 rounded-lg transition-colors font-medium ${button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
