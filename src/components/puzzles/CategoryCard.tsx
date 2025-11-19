import type { PuzzleCategory } from '@/types/puzzle'

interface CategoryCardProps {
  category: PuzzleCategory
  onClick?: () => void
}

export function CategoryCard({ category, onClick }: CategoryCardProps) {
  // TODO: Get actual progress from user data
  const solvedCount = 0
  const totalCount = 0
  const completionPercentage = totalCount > 0 ? (solvedCount / totalCount) * 100 : 0

  return (
    <button
      onClick={onClick}
      className="bg-navy-800 hover:bg-navy-700 border border-navy-700 hover:border-accent-500/50 rounded-lg p-6 transition-all text-left group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{category.icon}</span>
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-accent-500 transition-colors">
              {category.name}
            </h3>
            <p className="text-sm text-gray-400">{category.description}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">
            {solvedCount} / {totalCount} solved
          </span>
          <span className="text-gray-400">{Math.round(completionPercentage)}%</span>
        </div>
        <div className="bg-navy-900 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-full h-2 transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Status Badge */}
      {totalCount === 0 ? (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-700/50 rounded-full text-xs text-gray-400">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span>Coming Soon</span>
        </div>
      ) : completionPercentage === 100 ? (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full text-xs text-green-400">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Complete</span>
        </div>
      ) : solvedCount > 0 ? (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full text-xs text-blue-400">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span>In Progress</span>
        </div>
      ) : (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-700/50 rounded-full text-xs text-gray-400">
          <span>Not Started</span>
        </div>
      )}
    </button>
  )
}
