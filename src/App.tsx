import { useEffect, useRef, useState } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { Header } from '@components/Header'
import { Dashboard } from '@components/Dashboard'
import { LessonPanel } from '@components/LessonPanel'
import { CodeEditor } from '@components/CodeEditor'
import { Console } from '@components/Console'
import { ActionBar } from '@components/ActionBar'
import { ChatPanel } from '@components/ChatPanel'
import { NotificationContainer } from '@components/NotificationToast'
import { ProgressDashboard } from '@components/ProgressDashboard'
import { WelcomeScreen } from '@components/WelcomeScreen'
import { SettingsModal } from '@components/SettingsModal'
import { ProfileSelector } from '@components/ProfileSelector'
import { SolutionConfirmModal } from '@components/SolutionConfirmModal'
import { PuzzleHub } from '@components/puzzles/PuzzleHub'
import { PuzzleList } from '@components/puzzles/PuzzleList'
import { useAppStore } from '@/lib/store'
import { executeCode } from '@/lib/tauri'
import { validateCode, getValidationSummary } from '@/lib/validation'
import { updateStreak, recordLessonAttempt, clearAllData } from '@/lib/storage'
import { hasCompletedOnboarding, completeOnboarding, resetOnboarding } from '@/lib/preferences'
import { getCurrentProfile, type UserProfile } from '@/lib/profiles'
import { aiService } from '@/lib/ai'
import type { ExecutionResult } from '@/types/execution'
import type { LanguageId } from '@/types/language'

function App() {
  const addConsoleMessage = useAppStore((state) => state.addConsoleMessage)
  const setExecutionStatus = useAppStore((state) => state.setExecutionStatus)
  const code = useAppStore((state) => state.code)
  const setCode = useAppStore((state) => state.setCode)
  const currentLesson = useAppStore((state) => state.currentLesson)
  const chatOpen = useAppStore((state) => state.chatOpen)
  const completeLesson = useAppStore((state) => state.completeLesson)
  const isLessonCompleted = useAppStore((state) => state.isLessonCompleted)
  const hintsRevealed = useAppStore((state) => state.hintsRevealed)
  const refreshProgress = useAppStore((state) => state.refreshProgress)
  const settingsOpen = useAppStore((state) => state.settingsOpen)
  const toggleSettings = useAppStore((state) => state.toggleSettings)
  const settings = useAppStore((state) => state.settings)
  const updateSettings = useAppStore((state) => state.updateSettings)
  const currentView = useAppStore((state) => state.currentView)
  const currentPuzzleCategoryId = useAppStore((state) => state.currentPuzzleCategoryId)

  // Profile & Onboarding state
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(getCurrentProfile())
  const [showWelcome, setShowWelcome] = useState(false)
  const [showSolutionModal, setShowSolutionModal] = useState(false)

  // Store last execution result for validation
  const lastExecutionResult = useRef<ExecutionResult | undefined>()

  // Handle profile selection
  const handleProfileSelected = (profile: UserProfile) => {
    setCurrentProfile(profile)

    // Clear current lesson to prevent stale data
    const setCurrentLesson = useAppStore.getState().setCurrentLesson
    setCurrentLesson(null)

    // Refresh progress data for the new profile
    refreshProgress()

    // Check if this profile has completed onboarding
    setShowWelcome(!hasCompletedOnboarding())
  }

  // Handle onboarding completion
  const handleOnboardingComplete = (selectedLanguage: LanguageId) => {
    completeOnboarding(selectedLanguage)
    setShowWelcome(false)
    // Navigate to dashboard instead of loading a lesson
    // User will activate courses from the dashboard
  }

  // Handle reset progress
  const handleResetProgress = () => {
    clearAllData()
    resetOnboarding()
    refreshProgress()
    toggleSettings()
    // Reload the page to restart onboarding
    window.location.reload()
  }

  // Handle logout
  const handleLogout = () => {
    // Clear current profile from localStorage
    localStorage.removeItem('code-tutor-current-profile')
    // Set current profile to null to show ProfileSelector
    setCurrentProfile(null)
    // Reset to dashboard view for when user logs back in
    const setCurrentView = useAppStore.getState().setCurrentView
    setCurrentView('dashboard')
  }

  // Initialize on mount: update streak, refresh progress, and set up AI provider
  useEffect(() => {
    // Don't auto-load lesson anymore - users start from dashboard
    // Update streak on app load
    updateStreak()
    refreshProgress()

    // Initialize AI provider based on saved settings
    const initAI = async () => {
      if (settings.aiProvider !== 'none') {
        try {
          await aiService.setProvider(settings.aiProvider, {
            claudeApiKey: settings.claudeApiKey,
          })
        } catch (error) {
          console.error('Failed to initialize AI provider:', error)
        }
      }
    }
    initAI()
  }, [refreshProgress])

  const handleRun = async () => {
    if (!currentLesson) {
      addConsoleMessage({
        type: 'error',
        content: '❌ No lesson loaded',
      })
      return
    }

    try {
      setExecutionStatus('running')
      addConsoleMessage({
        type: 'system',
        content: '▶ Running code...',
      })

      // Execute code in the lesson's language via Tauri backend
      const result = await executeCode(currentLesson.language, code)

      // Store result for validation
      lastExecutionResult.current = result

      // Display stdout
      if (result.stdout) {
        addConsoleMessage({
          type: 'stdout',
          content: result.stdout.trim(),
        })
      }

      // Display stderr (if any)
      if (result.stderr) {
        addConsoleMessage({
          type: 'stderr',
          content: result.stderr.trim(),
        })
      }

      // Display execution time and exit code
      addConsoleMessage({
        type: 'system',
        content: `✓ Execution completed in ${result.executionTimeMs}ms (exit code: ${result.exitCode})`,
      })

      setExecutionStatus(result.exitCode === 0 ? 'success' : 'error')
    } catch (error) {
      addConsoleMessage({
        type: 'error',
        content: `❌ ${error instanceof Error ? error.message : 'Unknown error'}`,
      })
      setExecutionStatus('error')
    }
  }

  const handleSubmit = async () => {
    if (!currentLesson) {
      addConsoleMessage({
        type: 'error',
        content: '❌ No lesson loaded',
      })
      return
    }

    // Record this attempt
    recordLessonAttempt(currentLesson.id, hintsRevealed)

    addConsoleMessage({
      type: 'system',
      content: '🔍 Validating your solution...',
    })

    // Run validation tests
    const results = await validateCode(
      code,
      currentLesson.validationTests,
      lastExecutionResult.current
    )

    const summary = getValidationSummary(results)

    // Display each test result
    results.forEach((result) => {
      addConsoleMessage({
        type: result.passed ? 'stdout' : 'stderr',
        content: result.message,
      })
    })

    // Display summary
    if (summary.allPassed) {
      // Check if lesson was already completed
      const alreadyCompleted = isLessonCompleted(currentLesson.id)

      if (!alreadyCompleted) {
        // Mark lesson as complete and award XP (also triggers badge checks and notifications)
        completeLesson(currentLesson.id, currentLesson.xpReward, hintsRevealed)

        addConsoleMessage({
          type: 'system',
          content: `🎉 All tests passed! (${summary.passed}/${summary.total}) - Earned ${currentLesson.xpReward} XP!`,
        })
      } else {
        addConsoleMessage({
          type: 'system',
          content: `✅ All tests passed! (${summary.passed}/${summary.total}) - Lesson already completed.`,
        })
      }
    } else {
      addConsoleMessage({
        type: 'system',
        content: `⚠️ ${summary.passed}/${summary.total} tests passed. ${summary.failed} test(s) failed. Keep trying!`,
      })
    }
  }

  const handleShowSolution = () => {
    if (!currentLesson) return
    setShowSolutionModal(true)
  }

  const handleConfirmShowSolution = () => {
    if (!currentLesson) return

    // Close the modal
    setShowSolutionModal(false)

    // Set the code to the solution
    setCode(currentLesson.solutionCode, false) // false = don't auto-save

    // Check if lesson was already completed
    const alreadyCompleted = isLessonCompleted(currentLesson.id)

    if (!alreadyCompleted) {
      // Complete the lesson with 0 XP
      completeLesson(currentLesson.id, 0, hintsRevealed)

      addConsoleMessage({
        type: 'system',
        content: '📖 Solution revealed. Lesson completed with 0 XP.',
      })
    } else {
      addConsoleMessage({
        type: 'system',
        content: '📖 Solution revealed. (Lesson already completed)',
      })
    }
  }

  const handleCancelShowSolution = () => {
    setShowSolutionModal(false)
  }

  // Keyboard shortcut: Ctrl/Cmd + Enter to run
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        handleRun()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [code])

  // Show profile selector if no profile is active
  if (!currentProfile) {
    return <ProfileSelector onProfileSelected={handleProfileSelected} />
  }

  return (
    <div className="h-screen flex flex-col bg-navy-900">
      {/* Show Header only in learning view */}
      {currentView === 'learning' && <Header />}

      {/* Dashboard View */}
      {currentView === 'dashboard' && <Dashboard onLogout={handleLogout} />}

      {/* Puzzle View */}
      {currentView === 'puzzles' && <PuzzleHub />}

      {/* Puzzle List View */}
      {currentView === 'puzzle-list' && currentPuzzleCategoryId && (
        <PuzzleList categoryId={currentPuzzleCategoryId} />
      )}

      {/* Learning View */}
      {currentView === 'learning' && (
        <>
          <div className="flex-1 overflow-hidden">
            <PanelGroup direction="horizontal">
              {/* Left: Lesson content panel */}
              <Panel defaultSize={chatOpen ? 30 : 40} minSize={20}>
                <LessonPanel />
              </Panel>

              <PanelResizeHandle className="w-1 bg-navy-700 hover:bg-accent-500 transition-colors cursor-col-resize" />

              {/* Middle: Code editor + console panel */}
              <Panel defaultSize={chatOpen ? 40 : 60} minSize={30}>
                <PanelGroup direction="vertical">
                  {/* Top: Code editor */}
                  <Panel defaultSize={65} minSize={30}>
                    <CodeEditor />
                  </Panel>

                  <PanelResizeHandle className="h-1 bg-navy-700 hover:bg-accent-500 transition-colors cursor-row-resize" />

                  {/* Bottom: Console */}
                  <Panel defaultSize={35} minSize={20}>
                    <Console />
                  </Panel>
                </PanelGroup>
              </Panel>

              {/* Right: AI Chat panel (conditional) */}
              {chatOpen && (
                <>
                  <PanelResizeHandle className="w-1 bg-navy-700 hover:bg-accent-500 transition-colors cursor-col-resize" />
                  <Panel defaultSize={30} minSize={20}>
                    <ChatPanel />
                  </Panel>
                </>
              )}
            </PanelGroup>
          </div>

          {/* Floating chat button when closed */}
          {!chatOpen && <ChatPanel />}

          <ActionBar
            onRun={handleRun}
            onSubmit={handleSubmit}
            onShowSolution={handleShowSolution}
          />
        </>
      )}

      {/* Gamification UI */}
      <NotificationContainer />
      <ProgressDashboard />

      {/* Onboarding & Settings */}
      {showWelcome && <WelcomeScreen onComplete={handleOnboardingComplete} />}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={toggleSettings}
        currentSettings={settings}
        onSave={updateSettings}
        onResetProgress={handleResetProgress}
      />

      {/* Solution Confirmation Modal */}
      <SolutionConfirmModal
        isOpen={showSolutionModal}
        onConfirm={handleConfirmShowSolution}
        onCancel={handleCancelShowSolution}
      />
    </div>
  )
}

export default App
