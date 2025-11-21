import { useEffect, useState } from 'react'
import { checkAllRuntimes, getRuntimeName, getInstallInstructions, type RuntimeStatus } from '@/lib/runtimeDetection'
import type { SupportedLanguage } from '@/types/language'
import { open } from '@tauri-apps/plugin-shell'
import { setRuntimePath, clearRuntimePath, getExecutableName } from '@/lib/runtimePaths'
import { open as openDialog } from '@tauri-apps/plugin-dialog'
import { useAppStore } from '@/lib/store'

export function RuntimeStatusPanel() {
  const [runtimes, setRuntimes] = useState<Record<SupportedLanguage, RuntimeStatus> | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [browsing, setBrowsing] = useState<SupportedLanguage | null>(null)
  const triggerRuntimeRefresh = useAppStore((state) => state.triggerRuntimeRefresh)

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

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadRuntimes()
    setRefreshing(false)
    // Trigger global refresh so other components (like CourseCatalog) update
    triggerRuntimeRefresh()
  }

  const handleInstall = async (url: string) => {
    try {
      await open(url)
    } catch (error) {
      console.error('Failed to open URL:', error)
    }
  }

  const handleBrowseExecutable = async (language: SupportedLanguage) => {
    setBrowsing(language)
    try {
      const selectedPath = await openDialog({
        title: `Select ${getRuntimeName(language)} Executable`,
        filters: [{
          name: 'Executable',
          extensions: ['exe']
        }],
        multiple: false,
        directory: false,
      })

      if (selectedPath) {
        // Save the selected path
        setRuntimePath(language, selectedPath)

        // Refresh runtimes to check if the path works
        await loadRuntimes()

        // Trigger global refresh so other components (like CourseCatalog) update
        triggerRuntimeRefresh()
      }
    } catch (error) {
      console.error('Failed to select executable:', error)
    } finally {
      setBrowsing(null)
    }
  }

  const handleClearPath = async (language: SupportedLanguage) => {
    clearRuntimePath(language)
    await loadRuntimes()
    // Trigger global refresh so other components (like CourseCatalog) update
    triggerRuntimeRefresh()
  }

  if (loading || !runtimes) {
    return (
      <div className="p-6 bg-slate-800 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="animate-spin h-5 w-5 border-2 border-orange-500 border-t-transparent rounded-full"></div>
          <p className="text-gray-400">Checking installed runtimes...</p>
        </div>
      </div>
    )
  }

  const bundled = Object.values(runtimes).filter(r => r.bundled)
  const optional = Object.values(runtimes).filter(r => !r.bundled)
  const optionalAvailable = optional.filter(r => r.available)
  const optionalMissing = optional.filter(r => !r.available)

  return (
    <div className="space-y-4">
      {/* Bundled Runtimes (Always Available) */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">📦</span>
          <h2 className="text-xl font-bold text-white">Built-in Languages</h2>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          These languages work out of the box - no installation required!
        </p>
        <div className="space-y-2">
          {bundled.map((runtime) => (
            <div
              key={runtime.language}
              className="flex items-center justify-between p-3 bg-green-900/20 border border-green-500/30 rounded"
            >
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-white font-medium">{getRuntimeName(runtime.language)}</span>
              </div>
              <span className="text-green-400 text-sm">Ready</span>
            </div>
          ))}
        </div>
      </div>

      {/* Optional Runtimes */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🔧</span>
          <h2 className="text-xl font-bold text-white">Optional Languages</h2>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          Install these to unlock additional courses
        </p>

        {/* Installed Optional Runtimes */}
        {optionalAvailable.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-green-400 mb-2">Installed</h3>
            <div className="space-y-2">
              {optionalAvailable.map((runtime) => (
                <div
                  key={runtime.language}
                  className="p-3 bg-slate-700/50 rounded space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-white">{getRuntimeName(runtime.language)}</span>
                    </div>
                    <span className="text-green-400 text-sm">Available</span>
                  </div>
                  {runtime.customPath && (
                    <div className="bg-green-900/20 rounded p-2">
                      <p className="text-xs text-green-400 mb-1">Using Custom Path:</p>
                      <p className="text-xs text-green-300 font-mono break-all">{runtime.customPath}</p>
                      <button
                        onClick={() => handleClearPath(runtime.language)}
                        className="mt-2 px-2 py-1 bg-slate-600 hover:bg-slate-500 text-white rounded text-xs font-medium transition-colors"
                      >
                        Clear (Use System PATH)
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Not Installed Optional Runtimes */}
        {optionalMissing.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-orange-400 mb-2">Not Installed</h3>
            <div className="space-y-3">
              {optionalMissing.map((runtime) => (
                <div
                  key={runtime.language}
                  className="p-4 bg-slate-700/50 rounded space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">🔒</span>
                      <span className="text-white font-medium">{getRuntimeName(runtime.language)}</span>
                    </div>
                    <span className="text-orange-400 text-sm">Locked</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {getInstallInstructions(runtime.language)}
                  </p>
                  {runtime.language === 'gdscript' && (
                    <p className="text-xs text-blue-400 mt-1">
                      💡 Godot can run as a standalone executable. Use the Browse button to locate it (e.g., on your Desktop or Downloads folder).
                    </p>
                  )}

                  {/* Show custom path if configured */}
                  {runtime.customPath && (
                    <div className="bg-slate-800/50 rounded p-2">
                      <p className="text-xs text-gray-400 mb-1">Custom Path:</p>
                      <p className="text-xs text-orange-300 font-mono break-all">{runtime.customPath}</p>
                      <p className="text-xs text-orange-400 mt-1">⚠ Path doesn't work. Try browsing again.</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {runtime.installUrl && (
                      <button
                        onClick={() => handleInstall(runtime.installUrl!)}
                        className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded text-sm font-medium transition-colors"
                      >
                        Download & Install
                      </button>
                    )}
                    <button
                      onClick={() => handleBrowseExecutable(runtime.language)}
                      disabled={browsing === runtime.language}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      {browsing === runtime.language ? (
                        <>
                          <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></div>
                          Browsing...
                        </>
                      ) : (
                        <>
                          📂 Browse for {getExecutableName(runtime.language)}
                        </>
                      )}
                    </button>
                  </div>

                  {runtime.customPath && (
                    <button
                      onClick={() => handleClearPath(runtime.language)}
                      className="w-full px-3 py-1.5 bg-slate-600 hover:bg-slate-500 text-white rounded text-xs font-medium transition-colors"
                    >
                      Clear Custom Path
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Refresh Button */}
      <button
        onClick={handleRefresh}
        disabled={refreshing}
        className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white rounded font-medium transition-colors flex items-center justify-center gap-2"
      >
        {refreshing ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            Checking...
          </>
        ) : (
          <>
            🔄 Check Again
          </>
        )}
      </button>

      {optionalMissing.length > 0 && (
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <p className="text-sm text-blue-300">
            💡 <strong>Tip:</strong> After installing a language, click "Check Again" to unlock the courses!
          </p>
        </div>
      )}
    </div>
  )
}
