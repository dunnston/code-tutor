import { useState } from 'react'
import {
  loadProfiles,
  createProfile,
  setCurrentProfile,
  deleteProfile,
  AVATAR_OPTIONS,
  type UserProfile,
} from '@/lib/profiles'

interface ProfileSelectorProps {
  onProfileSelected: (profile: UserProfile) => void
}

export function ProfileSelector({ onProfileSelected }: ProfileSelectorProps) {
  const [profiles, setProfiles] = useState<UserProfile[]>(loadProfiles())
  const [showCreateForm, setShowCreateForm] = useState(profiles.length === 0)
  const [newName, setNewName] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]?.path || '/src/images/avatars/boy-avatar.png')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const handleSelectProfile = (profile: UserProfile) => {
    setCurrentProfile(profile.id)
    onProfileSelected(profile)
  }

  const handleCreateProfile = () => {
    if (newName.trim() && selectedAvatar) {
      const profile = createProfile(newName, selectedAvatar)
      // Reload profiles list to include the new profile
      setProfiles(loadProfiles())
      onProfileSelected(profile)
    }
  }

  const handleDeleteProfile = (profileId: string) => {
    deleteProfile(profileId)
    setShowDeleteConfirm(null)
    // Reload page to refresh profile list
    window.location.reload()
  }

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  if (showCreateForm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900">
        <div className="max-w-lg w-full mx-4 p-8 bg-navy-800 rounded-lg shadow-2xl border border-navy-700">
          <h2 className="text-3xl font-bold text-white mb-2 text-center">
            Create Your Profile
          </h2>
          <p className="text-gray-400 mb-8 text-center">
            Choose a name and avatar to get started
          </p>

          {/* Name Input */}
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">Your Name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter your name..."
              maxLength={20}
              autoFocus
              className="w-full px-4 py-3 bg-navy-700 border border-navy-600 rounded-lg text-white placeholder-gray-500 focus:border-accent-500 focus:outline-none text-lg"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newName.trim()) {
                  handleCreateProfile()
                }
              }}
            />
          </div>

          {/* Avatar Selection */}
          <div className="mb-8">
            <label className="block text-sm text-gray-400 mb-3">
              Choose Your Avatar
            </label>
            <div className="grid grid-cols-4 gap-3">
              {AVATAR_OPTIONS.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => setSelectedAvatar(avatar.path)}
                  className={`w-20 h-20 rounded-lg transition-all overflow-hidden ${
                    selectedAvatar === avatar.path
                      ? 'ring-4 ring-accent-500 scale-105'
                      : 'ring-2 ring-navy-600 hover:ring-navy-500'
                  }`}
                  title={avatar.name}
                >
                  <img
                    src={avatar.path}
                    alt={avatar.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {profiles.length > 0 && (
              <button
                onClick={() => setShowCreateForm(false)}
                className="flex-1 px-6 py-3 bg-navy-700 hover:bg-navy-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleCreateProfile}
              disabled={!newName.trim()}
              className={`flex-1 px-6 py-3 font-semibold rounded-lg transition-colors ${
                newName.trim()
                  ? 'bg-accent-500 hover:bg-accent-600 text-white'
                  : 'bg-navy-600 text-gray-500 cursor-not-allowed'
              }`}
            >
              Create Profile
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900">
      <div className="max-w-2xl w-full mx-4 p-8 bg-navy-800 rounded-lg shadow-2xl border border-navy-700">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">
          Welcome to Code Tutor
        </h2>
        <p className="text-gray-400 mb-8 text-center">
          Select your profile to continue learning
        </p>

        {/* Profile List */}
        <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
          {profiles
            .sort((a, b) => new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime())
            .map((profile) => (
              <div
                key={profile.id}
                className="relative group"
              >
                <button
                  onClick={() => handleSelectProfile(profile)}
                  className="w-full p-4 bg-navy-700 hover:bg-navy-600 rounded-lg transition-colors text-left border-2 border-transparent hover:border-accent-500"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden ring-2 ring-navy-600">
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-lg font-semibold text-white">
                        {profile.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        Last active: {formatDate(profile.lastAccessedAt)}
                      </div>
                    </div>
                    <div className="text-gray-500">
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
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* Delete Button */}
                {showDeleteConfirm === profile.id ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-900/90 rounded-lg p-4">
                    <div className="text-center">
                      <p className="text-white text-sm mb-3">Delete this profile?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeleteProfile(profile.id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="px-4 py-2 bg-navy-700 hover:bg-navy-600 text-white text-sm rounded transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(profile.id)}
                    className="absolute top-2 right-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                    title="Delete profile"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
        </div>

        {/* New Profile Button */}
        <button
          onClick={() => setShowCreateForm(true)}
          className="w-full py-3 border-2 border-dashed border-navy-600 hover:border-accent-500 text-gray-400 hover:text-white rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create New Profile
        </button>
      </div>
    </div>
  )
}
