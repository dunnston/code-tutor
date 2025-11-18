import { create } from 'zustand'
import type { Lesson } from '@types/lesson'
import type { ConsoleMessage, ExecutionStatus } from '@types/execution'
import { loadUserCode, saveUserCode, clearUserCode } from './storage'

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

  // UI state
  sidebarCollapsed: boolean
  toggleSidebar: () => void
}

// Auto-save timeout
let autoSaveTimeout: NodeJS.Timeout | null = null

export const useAppStore = create<AppState>((set, get) => ({
  // Lesson state
  currentLesson: null,
  setCurrentLesson: (lesson) => {
    set({ currentLesson: lesson })
    // Load saved code or use starter code when lesson changes
    if (lesson) {
      const savedCode = loadUserCode(lesson.id)
      set({ code: savedCode || lesson.starterCode })
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

  // UI state
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}))
