import { useEffect, useState } from 'react'
import { checkAllRuntimes, getRuntimeName, getInstallInstructions, type RuntimeStatus } from '@/lib/runtimeDetection'
import type { SupportedLanguage } from '@/types/language'

export function RuntimeStatusPanel() {
  const [runtimes, setRuntimes] = useState<Record<SupportedLanguage, RuntimeStatus> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRuntimes()
  }, [])

  const loadRuntimes = async () => {
    setLoading(true)
    try {
      const status = await checkAllRuntimes()
      setRuntimes(status)
    } catch (error) {
      console.error('Failed to check runtimes:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !runtimes) {
    return (
      <div className="p-6 bg-slate-800 rounded-lg">
        <p className="text-gray-400">Checking installed runtimes...</p>
      </div>
    )
  }

  const available = Object.values(runtimes).filter(r => r.available)
  const missing = Object.values(runtimes).filter(r => !r.available)

  return (
    <div className="space-y-4">
      <div className="bg-slate-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Language Runtimes</h2>

        {/* Available Runtimes */}
        {available.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-green-400 mb-2">✓ Available</h3>
            <div className="space-y-2">
              {available.map((runtime) => (
                <div
                  key={runtime.language}
                  className="flex items-center justify-between p-3 bg-slate-700/50 rounded"
                >
                  <span className="text-white">{getRuntimeName(runtime.language)}</span>
                  <span className="text-green-400 text-sm">Ready</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Missing Runtimes */}
        {missing.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-orange-400 mb-2">⚠ Not Installed</h3>
            <div className="space-y-2">
              {missing.map((runtime) => (
                <div
                  key={runtime.language}
                  className="p-3 bg-slate-700/50 rounded space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white">{getRuntimeName(runtime.language)}</span>
                    <span className="text-orange-400 text-sm">Not Found</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {getInstallInstructions(runtime.language)}
                  </p>
                  {runtime.installUrl && (
                    <a
                      href={runtime.installUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-xs text-orange-400 hover:text-orange-300 underline"
                    >
                      Download →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={loadRuntimes}
          className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition-colors"
        >
          Refresh Status
        </button>
      </div>

      {missing.length > 0 && (
        <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
          <p className="text-sm text-orange-300">
            Some language courses require additional software. Install the runtimes above to unlock all courses!
          </p>
        </div>
      )}
    </div>
  )
}
