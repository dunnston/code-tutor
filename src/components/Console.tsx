import { useAppStore } from '@/lib/store'
import { useEffect, useRef } from 'react'

export function Console() {
  const consoleMessages = useAppStore((state) => state.consoleMessages)
  const clearConsole = useAppStore((state) => state.clearConsole)
  const consoleEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [consoleMessages])

  return (
    <div className="h-full bg-navy-900 flex flex-col">
      {/* Console toolbar */}
      <div className="h-10 bg-navy-800 border-t border-b border-navy-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <svg
            className="w-4 h-4 text-accent-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="font-medium">Console Output</span>
          {consoleMessages.length > 0 && (
            <span className="text-xs text-gray-400">
              ({consoleMessages.length} {consoleMessages.length === 1 ? 'message' : 'messages'})
            </span>
          )}
        </div>
        <button
          onClick={clearConsole}
          disabled={consoleMessages.length === 0}
          className="text-xs text-gray-400 hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Console content */}
      <div className="flex-1 overflow-y-auto font-mono text-sm p-4 space-y-1">
        {consoleMessages.length === 0 ? (
          <div className="text-gray-500 italic">
            Run your code to see output here...
          </div>
        ) : (
          consoleMessages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${
                message.type === 'stderr' || message.type === 'error'
                  ? 'text-red-400'
                  : message.type === 'system'
                    ? 'text-accent-500'
                    : 'text-gray-300'
              }`}
            >
              <span className="text-gray-500 select-none">
                {message.timestamp.toLocaleTimeString('en-US', {
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>
              <span className="text-gray-600 select-none">
                {message.type === 'stderr' || message.type === 'error' ? '❌' : '▶'}
              </span>
              <pre className="flex-1 whitespace-pre-wrap break-words">
                {message.content}
              </pre>
            </div>
          ))
        )}
        <div ref={consoleEndRef} />
      </div>
    </div>
  )
}
