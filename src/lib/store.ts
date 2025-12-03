import { create } from 'zustand'
import type { Lesson } from '@/types/lesson'
import type { ConsoleMessage, ExecutionStatus } from '@/types/execution'
import type { ChatMessage, AIProviderType } from '@/types/ai'
import type { UserSettings } from '@components/SettingsModal'
import type { UserCurrency, InventoryItem, UserQuestProgress, ActiveEffect } from '@/types/gamification'
import {
  loadUserCode,
  saveUserCode,
  clearUserCode,
  loadProgress,
  markLessonComplete,
  trackLessonTime,
  type UserProgress,
  type BadgeId,
} from './storage'
import { loadPreferences, savePreferences, applyTheme } from './preferences'

// Notification types for gamification
export interface Notification {
  id: string
  type: 'level-up' | 'badge' | 'streak'
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
    set({ code })

    // Auto-save to local storage with debounce
    if (autoSave) {
      const { currentLesson } = get()
      if (currentLesson) {
        if (autoSaveTimeout) {
          clearTimeout(autoSaveTimeout)
        }
        autoSaveTimeout = setTimeout(() => {
          saveUserCode(currentLesson.id, code)
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
    set((state) => ({
      consoleMessages: [
        ...state.consoleMessages,
        {
          ...message,
          id: Math.random().toString(36).substring(7),
          timestamp: new Date(),
        },
      ],
    })),
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
      import('./storage').then(({ BADGES }) => {
        result.newBadges.forEach((badgeId) => {
          const badge = BADGES[badgeId]
          get().addNotification({
            type: 'badge',
            title: 'Badge Earned!',
            message: `${badge.icon} ${badge.name}: ${badge.description}`,
          })
        })
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
    const { aiService } = await import('./ai')
    if (settings.aiProvider !== 'none') {
      try {
        await aiService.setProvider(settings.aiProvider, {
          claudeApiKey: settings.claudeApiKey,
        })
      } catch (error) {
        console.error('Failed to set AI provider:', error)
      }
    } else {
      await aiService.setProvider('none')
    }

    set({ settings, aiProvider: settings.aiProvider })
  },

  // Runtime status tracking
  runtimeRefreshTrigger: 0,
  triggerRuntimeRefresh: () => {
    set((state) => ({ runtimeRefreshTrigger: state.runtimeRefreshTrigger + 1 }))
  },
}))
