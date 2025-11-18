import { create } from 'zustand'
import type { Lesson } from '@/types/lesson'
import type { ConsoleMessage, ExecutionStatus } from '@/types/execution'
import type { ChatMessage, AIProviderType } from '@/types/ai'
import type { UserSettings } from '@components/SettingsModal'
import {
  loadUserCode,
  saveUserCode,
  clearUserCode,
  loadProgress,
  markLessonComplete,
  updateStreak,
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
  currentView: 'dashboard' | 'learning'
  setCurrentView: (view: 'dashboard' | 'learning') => void

  // Settings & Preferences
  settings: UserSettings
  updateSettings: (settings: UserSettings) => void
}

// Auto-save timeout
let autoSaveTimeout: NodeJS.Timeout | null = null

export const useAppStore = create<AppState>((set, get) => ({
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
    // Update streak on app load
    updateStreak()
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
}))
