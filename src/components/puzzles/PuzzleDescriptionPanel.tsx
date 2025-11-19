import type { Puzzle, PuzzleImplementation } from '@/types/puzzle'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'

interface PuzzleDescriptionPanelProps {
  puzzle: Puzzle
  implementation: PuzzleImplementation
  hintsRevealed: number
  onShowHint: () => void
}

const difficultyColors: Record<string, string> = {
  easy: 'text-green-400 bg-green-500/20 border-green-500/30',
  medium: 'text-orange-400 bg-orange-500/20 border-orange-500/30',
  hard: 'text-red-400 bg-red-500/20 border-red-500/30',
  expert: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
}

export function PuzzleDescriptionPanel({
  puzzle,
  implementation,
  hintsRevealed,
  onShowHint,
}: PuzzleDescriptionPanelProps) {
  return (
    <div className="h-full bg-navy-900 overflow-y-auto">
      <div className="p-6">
        {/* Title and Meta */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-3">{puzzle.title}</h2>

          <div className="flex items-center gap-3 mb-4">
            {/* Difficulty Badge */}
            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded border ${difficultyColors[puzzle.difficulty]}`}>
              <span className="font-medium text-sm">
                {puzzle.difficulty.charAt(0).toUpperCase() + puzzle.difficulty.slice(1)}
              </span>
            </div>

            {/* Points */}
            <div className="flex items-center gap-1 text-yellow-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-semibold text-sm">{puzzle.points} pts</span>
            </div>

            {/* Estimated Time */}
            {puzzle.estimatedMinutes && (
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{puzzle.estimatedMinutes} min</span>
              </div>
            )}
          </div>

          {/* Concepts/Tags */}
          {puzzle.concepts.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {puzzle.concepts.map((concept) => (
                <span
                  key={concept}
                  className="px-2 py-1 bg-navy-800 text-xs text-gray-400 rounded border border-navy-700"
                >
                  #{concept}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="prose prose-invert prose-orange max-w-none mb-6">
          <MarkdownRenderer content={puzzle.description} />
        </div>

        {/* Test Cases */}
        {implementation.testCases.length > 0 && (
          <div className="bg-navy-800 rounded-lg p-4 mb-6 border border-navy-700">
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Example Test Cases
            </h4>
            <div className="space-y-3">
              {implementation.testCases.map((test, index) => (
                <div key={index} className="bg-navy-900 rounded p-3 border border-navy-700">
                  <div className="text-xs text-gray-400 mb-1">Test {index + 1}: {test.description}</div>
                  <div className="font-mono text-sm space-y-1">
                    <div className="text-gray-300">
                      <span className="text-gray-500">Input:</span> {JSON.stringify(test.input)}
                    </div>
                    <div className="text-green-400">
                      <span className="text-gray-500">Expected:</span> {JSON.stringify(test.expectedOutput)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {implementation.hiddenTests && implementation.hiddenTests.length > 0 && (
              <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>+ {implementation.hiddenTests.length} hidden test(s) will be run on submission</span>
              </div>
            )}
          </div>
        )}

        {/* Hints Section */}
        {implementation.hints.length > 0 && (
          <div className="bg-navy-800 rounded-lg p-4 border border-navy-700">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Hints ({hintsRevealed}/{implementation.hints.length})
              </h4>
              {hintsRevealed < implementation.hints.length && (
                <button
                  onClick={onShowHint}
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
                {implementation.hints.slice(0, hintsRevealed).map((hint, index) => (
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

            {hintsRevealed >= implementation.hints.length && (
              <p className="text-xs text-gray-500 mt-3 italic">
                All hints revealed! You've got this!
              </p>
            )}
          </div>
        )}

        {/* Optimization Challenge (if applicable) */}
        {puzzle.hasOptimization && (
          <div className="mt-6 bg-purple-900/20 border border-purple-700/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <h4 className="text-sm font-semibold text-purple-400">Optimization Challenge</h4>
            </div>
            <p className="text-sm text-gray-300 mb-2">
              After solving, try to optimize your solution!
            </p>
            {puzzle.optimalTimeComplexity && (
              <div className="text-xs text-gray-400">
                Target: {puzzle.optimalTimeComplexity} time, {puzzle.optimalSpaceComplexity} space
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
