import type { Puzzle, PuzzleDifficulty } from '@/types/puzzle'

interface PuzzleCardProps {
  puzzle: Puzzle
  onClick?: () => void
}

const difficultyColors: Record<PuzzleDifficulty, { bg: string; text: string; border: string }> = {
  easy: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  medium: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
  hard: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
  expert: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
}

export function PuzzleCard({ puzzle, onClick }: PuzzleCardProps) {
  const difficultyColor = difficultyColors[puzzle.difficulty]

  // TODO: Get actual user progress
  const isSolved = false
  const isAttempted = false
  const userAttempts = 0

  return (
    <button
      onClick={onClick}
      className="bg-navy-800 hover:bg-navy-700 border border-navy-700 hover:border-accent-500/50 rounded-lg p-6 transition-all text-left group w-full"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left: Puzzle Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {/* Status Icon */}
            {isSolved ? (
              <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            ) : isAttempted ? (
              <div className="flex-shrink-0 w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
            ) : (
              <div className="flex-shrink-0 w-6 h-6 bg-gray-700/50 rounded-full" />
            )}

            {/* Title */}
            <h3 className="text-xl font-bold text-white group-hover:text-accent-500 transition-colors">
              {puzzle.title}
            </h3>
          </div>

          {/* Description Preview */}
          <p className="text-sm text-gray-400 mb-3 line-clamp-2">
            {puzzle.description.replace(/[#*`]/g, '').slice(0, 150)}...
          </p>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm text-gray-400">
            {/* Difficulty Badge */}
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded ${difficultyColor.bg} ${difficultyColor.border} border`}>
              <span className={`font-medium ${difficultyColor.text}`}>
                {puzzle.difficulty.charAt(0).toUpperCase() + puzzle.difficulty.slice(1)}
              </span>
            </div>

            {/* Points */}
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{puzzle.points} pts</span>
            </div>

            {/* Estimated Time */}
            {puzzle.estimatedMinutes && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{puzzle.estimatedMinutes} min</span>
              </div>
            )}

            {/* Solve Count */}
            {puzzle.solveCount > 0 && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>{puzzle.solveCount} solved</span>
              </div>
            )}
          </div>

          {/* Concepts/Tags */}
          {puzzle.concepts.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {puzzle.concepts.slice(0, 3).map((concept) => (
                <span
                  key={concept}
                  className="px-2 py-1 bg-navy-900 text-xs text-gray-400 rounded border border-navy-700"
                >
                  #{concept}
                </span>
              ))}
              {puzzle.concepts.length > 3 && (
                <span className="px-2 py-1 text-xs text-gray-500">
                  +{puzzle.concepts.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right: Action & Status */}
        <div className="flex flex-col items-end gap-2">
          {/* Start Button */}
          <div className="px-4 py-2 bg-accent-500 group-hover:bg-accent-600 text-white rounded-lg transition-colors text-sm font-medium">
            {isSolved ? 'View Solution' : isAttempted ? 'Continue' : 'Start Puzzle'}
          </div>

          {/* User Stats (if attempted) */}
          {isAttempted && userAttempts > 0 && (
            <div className="text-xs text-gray-500">
              {userAttempts} attempt{userAttempts !== 1 ? 's' : ''}
            </div>
          )}

          {/* Optimization Badge */}
          {puzzle.hasOptimization && (
            <div className="flex items-center gap-1 text-xs text-purple-400" title="Has optimization challenge">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <span>Optimize</span>
            </div>
          )}
        </div>
      </div>
    </button>
  )
}
