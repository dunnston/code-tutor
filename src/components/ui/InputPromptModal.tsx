import { useState, useEffect } from 'react'
import type { InputPrompt } from '@/lib/inputDetection'

interface InputPromptModalProps {
  isOpen: boolean
  prompts: InputPrompt[]
  onConfirm: (values: string[]) => void
  onCancel: () => void
}

export function InputPromptModal({
  isOpen,
  prompts,
  onConfirm,
  onCancel,
}: InputPromptModalProps) {
  const [values, setValues] = useState<string[]>([])

  useEffect(() => {
    if (isOpen) {
      // Initialize with empty strings for each prompt
      setValues(prompts.map(() => ''))
    }
  }, [isOpen, prompts])

  const handleConfirm = () => {
    onConfirm(values)
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (index === prompts.length - 1) {
        handleConfirm()
      } else {
        // Focus next input
        const nextInput = document.getElementById(`input-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white">
            Input Required
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            Your code needs {prompts.length} input value{prompts.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="px-6 py-4 space-y-4 max-h-96 overflow-y-auto">
          {prompts.map((prompt, index) => (
            <div key={index}>
              <label
                htmlFor={`input-${index}`}
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                {prompt.prompt}
              </label>
              <input
                id={`input-${index}`}
                type="text"
                value={values[index] || ''}
                onChange={(e) => {
                  const newValues = [...values]
                  newValues[index] = e.target.value
                  setValues(newValues)
                }}
                onKeyDown={(e) => handleKeyDown(e, index)}
                placeholder={`Enter value ${index + 1}`}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                autoFocus={index === 0}
              />
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-slate-700 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-white rounded transition-colors"
          >
            Run Code
          </button>
        </div>

        <div className="px-6 py-3 bg-slate-900 rounded-b-lg">
          <p className="text-xs text-gray-500">
            💡 Tip: Press Enter to move to the next field, or click "Run Code" when done
          </p>
        </div>
      </div>
    </div>
  )
}
