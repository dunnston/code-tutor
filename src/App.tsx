import { useEffect, useRef } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { Header } from '@components/Header'
import { LessonPanel } from '@components/LessonPanel'
import { CodeEditor } from '@components/CodeEditor'
import { Console } from '@components/Console'
import { ActionBar } from '@components/ActionBar'
import { ChatPanel } from '@components/ChatPanel'
import { useAppStore } from '@/lib/store'
import { executePythonCode } from '@/lib/tauri'
import { validateCode, getValidationSummary } from '@/lib/validation'
import type { ExecutionResult } from '@types/execution'

// Lesson utilities
import { getFirstLesson } from '@/lib/lessons'

function App() {
  const setCurrentLesson = useAppStore((state) => state.setCurrentLesson)
  const addConsoleMessage = useAppStore((state) => state.addConsoleMessage)
  const setExecutionStatus = useAppStore((state) => state.setExecutionStatus)
  const code = useAppStore((state) => state.code)
  const currentLesson = useAppStore((state) => state.currentLesson)
  const chatOpen = useAppStore((state) => state.chatOpen)
  const completeLesson = useAppStore((state) => state.completeLesson)
  const isLessonCompleted = useAppStore((state) => state.isLessonCompleted)

  // Store last execution result for validation
  const lastExecutionResult = useRef<ExecutionResult | undefined>()

  // Load first lesson on mount
  useEffect(() => {
    const firstLesson = getFirstLesson('python')
    if (firstLesson) {
      setCurrentLesson(firstLesson)
    }
  }, [setCurrentLesson])

  const handleRun = async () => {
    try {
      setExecutionStatus('running')
      addConsoleMessage({
        type: 'system',
        content: '▶ Running code...',
      })

      // Execute Python code via Tauri backend
      const result = await executePythonCode(code)

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
        // Mark lesson as complete and award XP
        completeLesson(currentLesson.id, currentLesson.xpReward)

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
    addConsoleMessage({
      type: 'system',
      content: 'Solution view not yet implemented. Coming soon!',
    })
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

  return (
    <div className="h-screen flex flex-col bg-navy-900">
      <Header />

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
    </div>
  )
}

export default App
