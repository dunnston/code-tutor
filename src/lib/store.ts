import { create } from 'zustand'
import type { Lesson } from '@/types/lesson'
import type { ConsoleMessage, ExecutionStatus } from '@/types/execution'
import type { ChatMessage, AIProviderType } from '@/types/ai'
import type { UserSettings } from '@components/SettingsModal'
import type { UserCurrency, InventoryItem, UserQuestProgress, ActiveEffect } from '@/types/gamification'
import type { DailyPuzzleChallenge, DailyPuzzleStreak } from '@/types/puzzle'
import {
  loadUserCode,
  saveUserCode,
  clearUserCode,
  loadProgress,
  saveProgress,
  markLessonComplete,
  trackLessonTime,
  calculateLevel,
  type UserProgress,
  type BadgeId,
} from './storage'
import { loadPreferences, savePreferences, applyTheme } from './preferences'

// Notification types for gamification
export interface Notification {
  id: string
  type: 'level-up' | 'badge' | 'streak' | 'warning'
  title: string
  message: string
  timestamp: Date
}

export interface LevelUpData {
  oldLevel: number
  newLevel: number
}

export interface BadgeData {
  badgeId: BadgeId
  name: string
  description: string
  icon: string
}

interface AppState {
  // Current user
  currentUserId: number | null
  setCurrentUserId: (userId: number | null) => void

  // Current lesson
  currentLesson: Lesson | null
  setCurrentLesson: (lesson: Lesson | null) => void

  // Code editor
  code: string
  setCode: (code: string, autoSave?: boolean) => void
  resetCode: () => void

  // Console
  consoleMessages: ConsoleMessage[]
  addConsoleMessage: (message: Omit<ConsoleMessage, 'id' | 'timestamp'>) => void
  clearConsole: () => void

  // Execution state
  executionStatus: ExecutionStatus
  setExecutionStatus: (status: ExecutionStatus) => void

  // Progress tracking
  progress: UserProgress
  completeLesson: (lessonId: number, xpReward: number, hintsUsed: number) => void
  isLessonCompleted: (lessonId: number) => boolean
  refreshProgress: () => void
  addXP: (xp: number) => void

  // Gamification
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  dismissNotification: (id: string) => void
  hintsRevealed: number
  revealNextHint: () => void
  resetHints: () => void
  lessonStartTime: number | null
  startLessonTimer: () => void
  stopLessonTimer: () => void

  // AI Chat
  chatMessages: ChatMessage[]
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  clearChat: () => void
  chatOpen: boolean
  toggleChat: () => void
  aiProvider: AIProviderType
  setAIProvider: (provider: AIProviderType) => void

  // UI state
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  dashboardOpen: boolean
  toggleDashboard: () => void
  settingsOpen: boolean
  toggleSettings: () => void
  currentView: 'dashboard' | 'learning' | 'puzzles' | 'puzzle-list' | 'puzzle-solver' | 'playground' | 'shop' | 'inventory' | 'quests' | 'puzzle-all' | 'puzzle-leaderboard' | 'puzzle-achievements' | 'achievements'
  setCurrentView: (view: 'dashboard' | 'learning' | 'puzzles' | 'puzzle-list' | 'puzzle-solver' | 'playground' | 'shop' | 'inventory' | 'quests' | 'puzzle-all' | 'puzzle-leaderboard' | 'puzzle-achievements' | 'achievements') => void

  // Puzzle state
  currentPuzzleCategoryId: string | null
  setCurrentPuzzleCategoryId: (categoryId: string | null) => void
  currentPuzzleId: string | null
  setCurrentPuzzleId: (puzzleId: string | null) => void

  // Daily puzzle state
  dailyPuzzle: DailyPuzzleChallenge | null
  dailyPuzzleStreak: DailyPuzzleStreak | null
  setDailyPuzzle: (puzzle: DailyPuzzleChallenge | null) => void
  setDailyPuzzleStreak: (streak: DailyPuzzleStreak | null) => void
  refreshDailyPuzzle: (userId?: number) => Promise<void>

  // Playground state
  playgroundProjectId: string | null
  setPlaygroundProjectId: (projectId: string | null) => void
  playgroundLanguage: string
  setPlaygroundLanguage: (languageId: string) => void
  playgroundCode: string
  setPlaygroundCode: (code: string) => void

  // Gamification - Currency & Shop
  userCurrency: UserCurrency | null
  setUserCurrency: (currency: UserCurrency | null) => void
  refreshCurrency: (userId?: number) => Promise<void>

  // Gamification - Inventory
  inventory: InventoryItem[]
  setInventory: (inventory: InventoryItem[]) => void
  refreshInventory: (userId?: number) => Promise<void>

  // Gamification - Quests
  dailyQuests: UserQuestProgress[]
  weeklyQuests: UserQuestProgress[]
  setDailyQuests: (quests: UserQuestProgress[]) => void
  setWeeklyQuests: (quests: UserQuestProgress[]) => void
  refreshQuests: (userId?: number) => Promise<void>

  // Gamification - Active Effects
  activeEffects: ActiveEffect[]
  setActiveEffects: (effects: ActiveEffect[]) => void
  refreshActiveEffects: (userId?: number) => Promise<void>

  // Settings & Preferences
  settings: UserSettings
  updateSettings: (settings: UserSettings) => void

  // Runtime status tracking
  runtimeRefreshTrigger: number
  triggerRuntimeRefresh: () => void
}

// Auto-save timeout
let autoSaveTimeout: NodeJS.Timeout | null = null
// Track if quota warning has been shown to avoid repeated notifications
let quotaWarningShown = false

export const useAppStore = create<AppState>((set, get) => ({
  // User state
  currentUserId: null,
  setCurrentUserId: (userId) => set({ currentUserId: userId }),

  // Lesson state
  currentLesson: null,
  setCurrentLesson: (lesson) => {
    // Stop timer for previous lesson
    const { stopLessonTimer, resetHints, startLessonTimer } = get()
    stopLessonTimer()

    set({ currentLesson: lesson })

    // Load saved code or use starter code when lesson changes
    if (lesson) {
      const savedCode = loadUserCode(lesson.id)
      set({ code: savedCode || lesson.starterCode })

      // Reset hints and start timer for new lesson
      resetHints()
      startLessonTimer()

      // Switch to learning view
      set({ currentView: 'learning' })
    }
  },

  // Code state
  code: '',
  setCode: (code, autoSave = true) => {
    // Validate size before saving (1MB limit)
    const MAX_SAVE_SIZE = 1_000_000
    if (code.length > MAX_SAVE_SIZE) {
      console.warn(`Code exceeds maximum save size (${MAX_SAVE_SIZE} bytes)`)
      set({ code })
      return
    }

    set({ code })

    // Auto-save to local storage with debounce
    if (autoSave) {
      const { currentLesson, addNotification } = get()
      if (currentLesson) {
        if (autoSaveTimeout) {
          clearTimeout(autoSaveTimeout)
        }
        autoSaveTimeout = setTimeout(() => {
          const result = saveUserCode(currentLesson.id, code)
          if (!result.success) {
            console.warn('Auto-save failed:', result.message)
            // Only show quota warning once per session to avoid spamming
            if (result.error === 'quota_exceeded' && !quotaWarningShown) {
              quotaWarningShown = true
              addNotification({
                type: 'warning',
                title: 'Storage Full',
                message: 'Auto-save disabled due to storage limits. Your code will not persist after closing the app.',
              })
            }
          } else {
            // Reset warning flag on successful save
            quotaWarningShown = false
          }
        }, 1000) // 1 second debounce
      }
    }
  },
  resetCode: () => {
    const { currentLesson } = get()
    if (currentLesson) {
      set({ code: currentLesson.starterCode })
      // Clear saved code from local storage
      clearUserCode(currentLesson.id)
    }
  },

  // Console state
  consoleMessages: [],
  addConsoleMessage: (message) =>
    set((state) => {
      const MAX_CONSOLE_MESSAGES = 1000
      const newMessages = [
        ...state.consoleMessages,
        {
          ...message,
          id: Math.random().toString(36).substring(7),
          timestamp: new Date(),
        },
      ]
      // Keep only the most recent messages to prevent memory leaks
      const trimmedMessages = newMessages.length > MAX_CONSOLE_MESSAGES
        ? newMessages.slice(-MAX_CONSOLE_MESSAGES)
        : newMessages
      return { consoleMessages: trimmedMessages }
    }),
  clearConsole: () => set({ consoleMessages: [] }),

  // Execution state
  executionStatus: 'idle',
  setExecutionStatus: (status) => set({ executionStatus: status }),

  // Progress state
  progress: loadProgress(),
  completeLesson: (lessonId, xpReward, hintsUsed) => {
    const { hintsRevealed, addNotification, stopLessonTimer } = get()

    // Stop lesson timer and record time
    stopLessonTimer()

    // Mark lesson complete and get results
    const result = markLessonComplete(lessonId, xpReward, hintsUsed || hintsRevealed)
    set({ progress: loadProgress() })

    // Show level-up notification
    if (result.leveledUp) {
      addNotification({
        type: 'level-up',
        title: 'Level Up!',
        message: `Congratulations! You've reached Level ${result.newLevel}!`,
      })
    }

    // Show badge notifications
    if (result.newBadges.length > 0) {
      // Import BADGES here to avoid circular dependency
      import('./storage')
        .then(({ BADGES }) => {
          result.newBadges.forEach((badgeId) => {
            const badge = BADGES[badgeId]
            if (badge) {
              get().addNotification({
                type: 'badge',
                title: 'Badge Earned!',
                message: `${badge.icon} ${badge.name}: ${badge.description}`,
              })
            }
          })
        })
        .catch((error) => {
          console.error('Failed to load badges for notification:', error)
        })
    }
  },
  isLessonCompleted: (lessonId) => {
    const { progress } = get()
    return progress.completedLessons.includes(lessonId)
  },
  refreshProgress: () => {
    set({ progress: loadProgress() })
  },
  addXP: (xp) => {
    const { progress, addNotification } = get()
    const oldLevel = progress.level

    // Validate XP to prevent overflow and invalid values
    const MAX_XP_PER_ACTION = 10000
    const MAX_TOTAL_XP = Number.MAX_SAFE_INTEGER - 1000000
    const validatedXp = Math.min(Math.max(0, xp), MAX_XP_PER_ACTION)

    if (xp !== validatedXp) {
      console.warn(`XP value ${xp} clamped to ${validatedXp}`)
    }

    const newXpEarned = Math.min(progress.xpEarned + validatedXp, MAX_TOTAL_XP)
    const newLevel = calculateLevel(newXpEarned)

    const updatedProgress = {
      ...progress,
      xpEarned: newXpEarned,
      level: newLevel,
      lastUpdated: new Date().toISOString(),
    }

    saveProgress(updatedProgress)
    set({ progress: updatedProgress })

    // Show level-up notification if leveled up
    if (newLevel > oldLevel) {
      addNotification({
        type: 'level-up',
        title: 'Level Up!',
        message: `Congratulations! You've reached Level ${newLevel}!`,
      })
    }
  },

  // Gamification state
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          ...notification,
          id: Math.random().toString(36).substring(7),
          timestamp: new Date(),
        },
      ],
    })),
  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  hintsRevealed: 0,
  revealNextHint: () =>
    set((state) => ({
      hintsRevealed: state.hintsRevealed + 1,
    })),
  resetHints: () => set({ hintsRevealed: 0 }),

  lessonStartTime: null,
  startLessonTimer: () => {
    set({ lessonStartTime: Date.now() })
  },
  stopLessonTimer: () => {
    const { lessonStartTime, currentLesson } = get()
    if (lessonStartTime && currentLesson) {
      const timeSpent = Date.now() - lessonStartTime
      trackLessonTime(currentLesson.id, timeSpent)
      set({ lessonStartTime: null })
    }
  },

  // AI Chat state
  chatMessages: [],
  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [
        ...state.chatMessages,
        {
          ...message,
          id: Math.random().toString(36).substring(7),
          timestamp: new Date(),
        },
      ],
    })),
  clearChat: () => set({ chatMessages: [] }),
  chatOpen: false,
  toggleChat: () => set((state) => ({ chatOpen: !state.chatOpen })),
  aiProvider: 'none',
  setAIProvider: (provider) => set({ aiProvider: provider }),

  // UI state
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  dashboardOpen: false,
  toggleDashboard: () => set((state) => ({ dashboardOpen: !state.dashboardOpen })),
  settingsOpen: false,
  toggleSettings: () => set((state) => ({ settingsOpen: !state.settingsOpen })),
  currentView: 'dashboard',
  setCurrentView: (view) => set({ currentView: view }),

  // Puzzle state
  currentPuzzleCategoryId: null,
  setCurrentPuzzleCategoryId: (categoryId) => set({ currentPuzzleCategoryId: categoryId }),
  currentPuzzleId: null,
  setCurrentPuzzleId: (puzzleId) => set({ currentPuzzleId: puzzleId }),

  // Daily puzzle state
  dailyPuzzle: null,
  dailyPuzzleStreak: null,
  setDailyPuzzle: (puzzle) => set({ dailyPuzzle: puzzle }),
  setDailyPuzzleStreak: (streak) => set({ dailyPuzzleStreak: streak }),
  refreshDailyPuzzle: async (userId?: number) => {
    const effectiveUserId = userId ?? get().currentUserId
    if (!effectiveUserId) {
      console.warn('No user ID available for refreshDailyPuzzle')
      return
    }

    try {
      const { getDailyPuzzle, getDailyPuzzleStreak } = await import('./puzzles')
      const results = await Promise.allSettled([
        getDailyPuzzle(effectiveUserId),
        getDailyPuzzleStreak(effectiveUserId),
      ])

      // Handle results individually to prevent one failure from blocking the other
      if (results[0].status === 'fulfilled') {
        set({ dailyPuzzle: results[0].value })
      } else {
        console.error('Failed to get daily puzzle:', results[0].reason)
      }

      if (results[1].status === 'fulfilled') {
        set({ dailyPuzzleStreak: results[1].value })
      } else {
        console.error('Failed to get daily puzzle streak:', results[1].reason)
      }
    } catch (error) {
      console.error('Failed to refresh daily puzzle:', error)
    }
  },

  // Playground state
  playgroundProjectId: null,
  setPlaygroundProjectId: (projectId) => set({ playgroundProjectId: projectId }),
  playgroundLanguage: 'python',
  setPlaygroundLanguage: (languageId) => set({ playgroundLanguage: languageId }),
  playgroundCode: '',
  setPlaygroundCode: (code) => set({ playgroundCode: code }),

  // Gamification state
  userCurrency: null,
  setUserCurrency: (currency) => set({ userCurrency: currency }),
  refreshCurrency: async (userId) => {
    const { getUserCurrency } = await import('./gamification')
    const effectiveUserId = userId ?? get().currentUserId
    if (!effectiveUserId) {
      console.error('No user ID available for refreshCurrency')
      return
    }
    try {
      const currency = await getUserCurrency(effectiveUserId)
      set({ userCurrency: currency })
    } catch (error) {
      console.error('Failed to refresh currency:', error)
    }
  },

  inventory: [],
  setInventory: (inventory) => set({ inventory }),
  refreshInventory: async (userId) => {
    const { getUserInventory } = await import('./gamification')
    const effectiveUserId = userId ?? get().currentUserId
    if (!effectiveUserId) {
      console.error('No user ID available for refreshInventory')
      return
    }
    try {
      const inventory = await getUserInventory(effectiveUserId)
      set({ inventory })
    } catch (error) {
      console.error('Failed to refresh inventory:', error)
    }
  },

  dailyQuests: [],
  weeklyQuests: [],
  setDailyQuests: (quests) => set({ dailyQuests: quests }),
  setWeeklyQuests: (quests) => set({ weeklyQuests: quests }),
  refreshQuests: async (userId) => {
    const { getUserQuestProgress } = await import('./gamification')
    const effectiveUserId = userId ?? get().currentUserId
    if (!effectiveUserId) {
      console.error('No user ID available for refreshQuests')
      return
    }
    try {
      const daily = await getUserQuestProgress(effectiveUserId, 'daily')
      const weekly = await getUserQuestProgress(effectiveUserId, 'weekly')
      set({ dailyQuests: daily, weeklyQuests: weekly })
    } catch (error) {
      console.error('Failed to refresh quests:', error)
    }
  },

  activeEffects: [],
  setActiveEffects: (effects) => set({ activeEffects: effects }),
  refreshActiveEffects: async (userId) => {
    const { getActiveEffects } = await import('./gamification')
    const effectiveUserId = userId ?? get().currentUserId
    if (!effectiveUserId) {
      console.error('No user ID available for refreshActiveEffects')
      return
    }
    try {
      const effects = await getActiveEffects(effectiveUserId)
      set({ activeEffects: effects })
    } catch (error) {
      console.error('Failed to refresh active effects:', error)
    }
  },

  // Settings & Preferences
  settings: loadPreferences(),
  updateSettings: async (settings) => {
    savePreferences(settings)
    applyTheme(settings.theme)

    // Initialize AI provider
    try {
      const { aiService } = await import('./ai')
      if (settings.aiProvider !== 'none') {
        await aiService.setProvider(settings.aiProvider, {
          claudeApiKey: settings.claudeApiKey,
        })
      } else {
        await aiService.setProvider('none')
      }
    } catch (error) {
      console.error('Failed to set AI provider:', error)
    }

    set({ settings, aiProvider: settings.aiProvider })
  },

  // Runtime status tracking
  runtimeRefreshTrigger: 0,
  triggerRuntimeRefresh: () => {
    set((state) => ({ runtimeRefreshTrigger: state.runtimeRefreshTrigger + 1 }))
  },
}))
