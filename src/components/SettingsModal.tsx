import { useState, useEffect } from 'react'
import type { AIProviderType } from '@/types/ai'

export interface UserSettings {
  theme: 'dark' | 'light'
  aiProvider: AIProviderType
  claudeApiKey: string
  fontSize: number
  editorTabSize: number
  autoSave: boolean
  soundEnabled: boolean
}

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  currentSettings: UserSettings
  onSave: (settings: UserSettings) => void
  onResetProgress: () => void
}

export function SettingsModal({
  isOpen,
  onClose,
  currentSettings,
  onSave,
  onResetProgress,
}: SettingsModalProps) {
  const [settings, setSettings] = useState<UserSettings>(currentSettings)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  useEffect(() => {
    setSettings(currentSettings)
  }, [currentSettings])

  const handleSave = () => {
    onSave(settings)
    onClose()
  }

  const handleReset = () => {
    onResetProgress()
    setShowResetConfirm(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="max-w-2xl w-full mx-4 bg-navy-800 rounded-lg shadow-2xl border border-navy-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-navy-800 border-b border-navy-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Settings</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Theme Settings */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Appearance</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Theme</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSettings({ ...settings, theme: 'dark' })}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                      settings.theme === 'dark'
                        ? 'border-accent-500 bg-accent-500/10 text-white'
                        : 'border-navy-600 bg-navy-700 text-gray-400'
                    }`}
                  >
                    🌙 Dark
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, theme: 'light' })}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                      settings.theme === 'light'
                        ? 'border-accent-500 bg-accent-500/10 text-white'
                        : 'border-navy-600 bg-navy-700 text-gray-400'
                    }`}
                  >
                    ☀️ Light
                  </button>
                </div>
                {settings.theme === 'light' && (
                  <p className="text-xs text-yellow-500 mt-2">
                    ⚠️ Light theme is experimental and may not look perfect
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* AI Settings */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">AI Tutor</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  AI Provider
                </label>
                <select
                  value={settings.aiProvider}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      aiProvider: e.target.value as AIProviderType,
                    })
                  }
                  className="w-full px-4 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white focus:border-accent-500 focus:outline-none"
                >
                  <option value="none">Disabled</option>
                  <option value="ollama">Ollama (Local)</option>
                  <option value="claude">Claude API</option>
                </select>
              </div>

              {settings.aiProvider === 'claude' && (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Claude API Key
                  </label>
                  <input
                    type="password"
                    value={settings.claudeApiKey}
                    onChange={(e) =>
                      setSettings({ ...settings, claudeApiKey: e.target.value })
                    }
                    placeholder="sk-ant-..."
                    className="w-full px-4 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white placeholder-gray-500 focus:border-accent-500 focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Your API key is stored locally and never sent to our servers
                  </p>
                </div>
              )}

              {settings.aiProvider === 'ollama' && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-sm text-blue-300">
                    Make sure Ollama is running locally with a model installed
                    (e.g., llama2, codellama)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Editor Settings */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Editor</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Font Size: {settings.fontSize}px
                </label>
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={settings.fontSize}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      fontSize: parseInt(e.target.value),
                    })
                  }
                  className="w-full accent-accent-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Small</span>
                  <span>Large</span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Tab Size: {settings.editorTabSize} spaces
                </label>
                <select
                  value={settings.editorTabSize}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      editorTabSize: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 bg-navy-700 border border-navy-600 rounded-lg text-white focus:border-accent-500 focus:outline-none"
                >
                  <option value="2">2</option>
                  <option value="4">4</option>
                  <option value="8">8</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Auto-save code</span>
                <button
                  onClick={() =>
                    setSettings({ ...settings, autoSave: !settings.autoSave })
                  }
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.autoSave ? 'bg-accent-500' : 'bg-navy-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.autoSave ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Notifications
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Sound effects</span>
              <button
                onClick={() =>
                  setSettings({ ...settings, soundEnabled: !settings.soundEnabled })
                }
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.soundEnabled ? 'bg-accent-500' : 'bg-navy-600'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="pt-6 border-t border-red-900/30">
            <h3 className="text-lg font-semibold text-red-400 mb-3">
              Danger Zone
            </h3>
            <div className="space-y-3">
              {/* Switch Profile */}
              <button
                onClick={() => {
                  window.location.reload() // Reload to show profile selector
                }}
                className="px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-lg transition-colors"
              >
                Switch Profile
              </button>

              {/* Reset Progress */}
              {!showResetConfirm ? (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition-colors"
                >
                  Reset All Progress
                </button>
              ) : (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-300 mb-3">
                  ⚠️ This will delete all your progress, XP, badges, and saved
                  code. This action cannot be undone!
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    Yes, Reset Everything
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-4 py-2 bg-navy-700 hover:bg-navy-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-navy-800 border-t border-navy-700 px-6 py-4">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
