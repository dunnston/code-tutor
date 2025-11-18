import { useState, useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { getNextLesson, getPreviousLesson } from '@/lib/lessons'

export function LessonPanel() {
  const currentLesson = useAppStore((state) => state.currentLesson)
  const setCurrentLesson = useAppStore((state) => state.setCurrentLesson)
  const [hintsRevealed, setHintsRevealed] = useState(0)

  // Reset hints when lesson changes
  useEffect(() => {
    setHintsRevealed(0)
  }, [currentLesson?.id])

  const handleShowNextHint = () => {
    if (currentLesson && hintsRevealed < currentLesson.hints.length) {
      setHintsRevealed(hintsRevealed + 1)
    }
  }

  const handlePrevious = () => {
    if (currentLesson?.previousLessonId) {
      const prevLesson = getPreviousLesson(currentLesson.id)
      if (prevLesson) {
        setCurrentLesson(prevLesson)
      }
    }
  }

  const handleNext = () => {
    if (currentLesson?.nextLessonId) {
      const nextLesson = getNextLesson(currentLesson.id)
      if (nextLesson) {
        setCurrentLesson(nextLesson)
      }
    }
  }

  if (!currentLesson) {
    return (
      <div className="h-full flex items-center justify-center bg-navy-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-navy-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-300 mb-2">
            No Lesson Selected
          </h3>
          <p className="text-sm text-gray-400">
            Choose a lesson from the sidebar to get started
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-navy-900 overflow-y-auto">
      <div className="p-6 max-w-3xl">
        {/* Title */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            {currentLesson.title}
          </h2>
          {currentLesson.subtitle && (
            <p className="text-lg text-accent-500">{currentLesson.subtitle}</p>
          )}
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-navy-700">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-accent-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-semibold text-gray-300">
              {currentLesson.xpReward} XP
            </span>
          </div>
          <span className="text-gray-500">•</span>
          <span className="text-sm text-gray-300">
            {currentLesson.estimatedTime}
          </span>
          <span className="text-gray-500">•</span>
          <div className="flex gap-2">
            {currentLesson.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-navy-800 text-xs text-gray-300 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Description (Markdown content) */}
        <div className="prose prose-invert prose-orange max-w-none mb-6">
          <div
            className="text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: currentLesson.description
                .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-white mb-4">$1</h1>')
                .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-white mb-3 mt-6">$1</h2>')
                .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-white mb-2 mt-4">$1</h3>')
                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 bg-navy-800 text-accent-500 rounded text-sm font-mono">$1</code>')
                .replace(/```python\n([\s\S]*?)\n```/g, '<pre class="bg-navy-800 p-4 rounded-lg overflow-x-auto mb-4"><code class="text-sm font-mono text-gray-300">$1</code></pre>')
                .replace(/```\n([\s\S]*?)\n```/g, '<pre class="bg-navy-800 p-4 rounded-lg overflow-x-auto mb-4"><code class="text-sm font-mono text-gray-300">$1</code></pre>')
                .replace(/\n\n/g, '</p><p class="mb-4">')
                .replace(/^(.+)$/gm, '<p class="mb-4">$1</p>'),
            }}
          />
        </div>

        {/* Learning objectives */}
        {currentLesson.learningObjectives.length > 0 && (
          <div className="bg-navy-800 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Learning Objectives
            </h4>
            <ul className="space-y-2">
              {currentLesson.learningObjectives.map((objective, index) => (
                <li key={index} className="text-sm text-gray-300 flex gap-2">
                  <span className="text-accent-500">•</span>
                  {objective}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Hints Section */}
        {currentLesson.hints && currentLesson.hints.length > 0 && (
          <div className="bg-navy-800 rounded-lg p-4 mb-6 border border-navy-700">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                Hints ({hintsRevealed}/{currentLesson.hints.length})
              </h4>
              {hintsRevealed < currentLesson.hints.length && (
                <button
                  onClick={handleShowNextHint}
                  className="px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 text-xs rounded transition-colors border border-yellow-500/30"
                >
                  Show Next Hint
                </button>
              )}
            </div>

            {hintsRevealed === 0 ? (
              <p className="text-sm text-gray-400 italic">
                Click "Show Next Hint" if you need help. Try solving it yourself first!
              </p>
            ) : (
              <div className="space-y-3">
                {currentLesson.hints.slice(0, hintsRevealed).map((hint, index) => (
                  <div
                    key={index}
                    className="flex gap-3 p-3 bg-navy-900 rounded border-l-2 border-yellow-500/50"
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-400 text-xs font-semibold">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-300">{hint}</p>
                  </div>
                ))}
              </div>
            )}

            {hintsRevealed >= currentLesson.hints.length && (
              <p className="text-xs text-gray-500 mt-3 italic">
                All hints revealed! If you're still stuck, try asking the AI Tutor for guidance.
              </p>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t border-navy-700">
          <button
            onClick={handlePrevious}
            disabled={!currentLesson.previousLessonId}
            className="px-4 py-2 bg-navy-800 hover:bg-navy-700 text-gray-300 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous Lesson
          </button>
          <button
            onClick={handleNext}
            disabled={!currentLesson.nextLessonId}
            className="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Next Lesson
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
