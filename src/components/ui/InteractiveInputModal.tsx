import { useState, useEffect, useRef } from 'react'
import type { InputPrompt } from '@/lib/inputDetection'

interface InteractiveInputModalProps {
  isOpen: boolean
  prompts: InputPrompt[]
  onConfirm: (values: string[]) => void
  onCancel: () => void
}

export function InteractiveInputModal({
  isOpen,
  prompts,
  onConfirm,
  onCancel,
}: InteractiveInputModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [values, setValues] = useState<string[]>([])
  const [currentValue, setCurrentValue] = useState('')
  const [history, setHistory] = useState<Array<{ prompt: string; value: string }>>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setCurrentIndex(0)
      setValues([])
      setCurrentValue('')
      setHistory([])
    }
  }, [isOpen])

  useEffect(() => {
    // Auto-focus input when it appears
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, currentIndex])

  const handleSubmit = () => {
    if (currentValue.trim() === '') return

    const newHistory = [...history, { prompt: prompts[currentIndex].prompt, value: currentValue }]
    const newValues = [...values, currentValue]

    setHistory(newHistory)
    setValues(newValues)
    setCurrentValue('')

    // Check if we have more prompts
    if (currentIndex < prompts.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // All inputs collected, run the code
      onConfirm(newValues)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onCancel()
    }
  }

  if (!isOpen) return null

  const currentPrompt = prompts[currentIndex]
  const progress = ((currentIndex) / prompts.length) * 100

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-lg shadow-2xl max-w-2xl w-full mx-4 border border-slate-700">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Program Running
            </h3>
            <span className="text-sm text-gray-400">
              Input {currentIndex + 1} of {prompts.length}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-orange-500 h-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* History of previous inputs */}
        {history.length > 0 && (
          <div className="px-6 py-3 bg-slate-900 border-b border-slate-700 max-h-40 overflow-y-auto">
            <div className="space-y-2 font-mono text-sm">
              {history.map((item, idx) => (
                <div key={idx} className="text-gray-400">
                  <div className="text-gray-500">{item.prompt}</div>
                  <div className="text-green-400 ml-2">→ {item.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current input prompt */}
        <div className="px-6 py-6">
          <div className="mb-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                ?
              </div>
              <div className="flex-1">
                <label
                  htmlFor="interactive-input"
                  className="block text-base font-medium text-white mb-3"
                >
                  {currentPrompt.prompt}
                </label>
                <input
                  ref={inputRef}
                  id="interactive-input"
                  type="text"
                  value={currentValue}
                  onChange={(e) => setCurrentValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your answer..."
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition-all"
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              💡 Press <kbd className="px-2 py-1 bg-slate-700 rounded text-gray-300">Enter</kbd> to submit
              {currentIndex < prompts.length - 1 ? ' and continue' : ' and run code'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={currentValue.trim() === ''}
                className="px-5 py-2 bg-orange-500 hover:bg-orange-400 disabled:bg-slate-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium text-sm flex items-center gap-2"
              >
                {currentIndex < prompts.length - 1 ? (
                  <>
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    Run Code
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer hint */}
        <div className="px-6 py-3 bg-slate-900 rounded-b-lg border-t border-slate-700">
          <p className="text-xs text-gray-500 flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Your program is waiting for input. Enter a value to continue execution.
          </p>
        </div>
      </div>
    </div>
  )
}
