/**
 * Multi-user profile management
 * Each profile has its own progress, settings, and saved code
 */

export interface UserProfile {
  id: string // Unique profile ID (generated on creation)
  name: string // User's chosen name
  avatar: string // Avatar image path
  createdAt: string // ISO timestamp
  lastAccessedAt: string // ISO timestamp
  activeCourses: number[] // Array of active course IDs
  dbUserId?: number // Database user ID (for multi-user support)
}

const PROFILES_KEY = 'code-tutor-profiles'
const CURRENT_PROFILE_KEY = 'code-tutor-current-profile'

// Available avatar images
export interface AvatarOption {
  id: string
  name: string
  path: string
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: 'dragon', name: 'Dragon Born', path: '/avatars/dragon-born.png' },
  { id: 'female-archer', name: 'Female Archer', path: '/avatars/female-archer.png' },
  { id: 'female-rouge', name: 'Female Rogue', path: '/avatars/female-rouge.png' },
  { id: 'male-rouge', name: 'Male Rogue', path: '/avatars/male-rouge.png' },
  { id: 'wizard', name: 'Wizard', path: '/avatars/wizzard.png' },
]

/**
 * Generate a unique profile ID
 */
function generateProfileId(): string {
  return `profile_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Load all profiles from localStorage
 */
export function loadProfiles(): UserProfile[] {
  try {
    const stored = localStorage.getItem(PROFILES_KEY)
    if (stored) {
      const profiles = JSON.parse(stored) as UserProfile[]

      // Migration: Add activeCourses to existing profiles that don't have it
      let needsSave = false
      const migratedProfiles = profiles.map(profile => {
        if (!profile.activeCourses) {
          needsSave = true
          return { ...profile, activeCourses: [] }
        }
        return profile
      })

      // Save migrated profiles if needed
      if (needsSave) {
        saveProfiles(migratedProfiles)
      }

      return migratedProfiles
    }
  } catch (error) {
    console.error('Failed to load profiles:', error)
  }
  return []
}

/**
 * Save profiles to localStorage
 */
export function saveProfiles(profiles: UserProfile[]): void {
  try {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles))
  } catch (error) {
    console.error('Failed to save profiles:', error)
  }
}

/**
 * Ensure profile has a database user ID
 * Always validates by calling getOrCreateUser to handle database resets
 */
export async function ensureProfileHasDbUser(profile: UserProfile): Promise<number> {
  // Always call getOrCreateUser to ensure the user exists in the current database
  // This handles cases where the database was reset/deleted but localStorage persisted
  const { getOrCreateUser } = await import('./gamification')
  const dbUserId = await getOrCreateUser(profile.id)

  // Update the profile with the dbUserId if it changed or wasn't set
  if (profile.dbUserId !== dbUserId) {
    const profiles = loadProfiles()
    const index = profiles.findIndex((p) => p.id === profile.id)
    if (index !== -1) {
      profiles[index]!.dbUserId = dbUserId
      saveProfiles(profiles)
    }
  }

  return dbUserId
}

/**
 * Get the currently active profile
 */
export function getCurrentProfile(): UserProfile | null {
  try {
    const profileId = localStorage.getItem(CURRENT_PROFILE_KEY)
    if (profileId) {
      const profiles = loadProfiles()
      const profile = profiles.find((p) => p.id === profileId)
      if (profile) {
        return profile
      }
    }
  } catch (error) {
    console.error('Failed to get current profile:', error)
  }
  return null
}

/**
 * Set the currently active profile
 */
export function setCurrentProfile(profileId: string): void {
  try {
    const profiles = loadProfiles()
    const profile = profiles.find((p) => p.id === profileId)

    if (profile) {
      // Update last accessed time
      profile.lastAccessedAt = new Date().toISOString()
      saveProfiles(profiles)

      // Set as current profile
      localStorage.setItem(CURRENT_PROFILE_KEY, profileId)
    }
  } catch (error) {
    console.error('Failed to set current profile:', error)
  }
}

/**
 * Create a new profile
 */
export function createProfile(name: string, avatar: string): UserProfile {
  const newProfile: UserProfile = {
    id: generateProfileId(),
    name: name.trim(),
    avatar,
    createdAt: new Date().toISOString(),
    lastAccessedAt: new Date().toISOString(),
    activeCourses: [], // Start with no active courses
  }

  const profiles = loadProfiles()
  profiles.push(newProfile)
  saveProfiles(profiles)

  // Set as current profile
  setCurrentProfile(newProfile.id)

  return newProfile
}

/**
 * Update an existing profile
 */
export function updateProfile(profileId: string, updates: Partial<Pick<UserProfile, 'name' | 'avatar'>>): void {
  const profiles = loadProfiles()
  const index = profiles.findIndex((p) => p.id === profileId)

  if (index !== -1) {
    const profile = profiles[index]!
    if (updates.name !== undefined) {
      profile.name = updates.name
    }
    if (updates.avatar !== undefined) {
      profile.avatar = updates.avatar
    }
    saveProfiles(profiles)
  }
}

/**
 * Delete a profile and all its data
 */
export function deleteProfile(profileId: string): void {
  // Remove profile from list
  const profiles = loadProfiles()
  const filtered = profiles.filter((p) => p.id !== profileId)
  saveProfiles(filtered)

  // Clear current profile if it was deleted
  const currentId = localStorage.getItem(CURRENT_PROFILE_KEY)
  if (currentId === profileId) {
    localStorage.removeItem(CURRENT_PROFILE_KEY)
  }

  // Delete all profile-specific data
  const keysToRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.includes(profileId)) {
      keysToRemove.push(key)
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key))
}

/**
 * Check if any profiles exist
 */
export function hasProfiles(): boolean {
  return loadProfiles().length > 0
}

/**
 * Get profile storage key (for scoping data by profile)
 */
export function getProfileStorageKey(baseKey: string, profileId?: string): string {
  const id = profileId || getCurrentProfile()?.id
  if (!id) {
    throw new Error('No active profile')
  }
  return `${baseKey}:${id}`
}

/**
 * Activate a course for the current profile
 * Only one course can be active at a time
 * @throws Error if another course is already active
 */
export function activateCourse(courseId: number): void {
  const profile = getCurrentProfile()
  if (!profile) {
    throw new Error('No active profile')
  }

  // Don't add if already activated
  if (profile.activeCourses.includes(courseId)) {
    return
  }

  // Check if any other course is already active
  if (profile.activeCourses.length > 0) {
    throw new Error('COURSE_ALREADY_ACTIVE')
  }

  const profiles = loadProfiles()
  const index = profiles.findIndex((p) => p.id === profile.id)

  if (index !== -1) {
    profiles[index]!.activeCourses.push(courseId)
    saveProfiles(profiles)
  }
}

/**
 * Deactivate a course for the current profile
 */
export function deactivateCourse(courseId: number): void {
  const profile = getCurrentProfile()
  if (!profile) {
    throw new Error('No active profile')
  }

  const profiles = loadProfiles()
  const index = profiles.findIndex((p) => p.id === profile.id)

  if (index !== -1) {
    profiles[index]!.activeCourses = profiles[index]!.activeCourses.filter((id) => id !== courseId)
    saveProfiles(profiles)
  }
}

/**
 * Check if a course is activated for the current profile
 */
export function isCourseActivated(courseId: number): boolean {
  const profile = getCurrentProfile()
  if (!profile) return false
  return profile.activeCourses.includes(courseId)
}

/**
 * Get all activated course IDs for the current profile
 */
export function getActivatedCourses(): number[] {
  const profile = getCurrentProfile()
  if (!profile) return []
  return profile.activeCourses
}
