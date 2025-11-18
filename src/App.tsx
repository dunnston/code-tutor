import { useEffect } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { Header } from '@components/Header'
import { LessonPanel } from '@components/LessonPanel'
import { CodeEditor } from '@components/CodeEditor'
import { Console } from '@components/Console'
import { ActionBar } from '@components/ActionBar'
import { useAppStore } from '@/lib/store'
import { executePythonCode } from '@/lib/tauri'

// Mock lesson data for testing
import lesson1 from '../docs/lessons/python-01-scroll-of-print.json'

function App() {
  const setCurrentLesson = useAppStore((state) => state.setCurrentLesson)
  const addConsoleMessage = useAppStore((state) => state.addConsoleMessage)
  const setExecutionStatus = useAppStore((state) => state.setExecutionStatus)
  const code = useAppStore((state) => state.code)

  // Load first lesson on mount (temporary for testing)
  useEffect(() => {
    setCurrentLesson(lesson1 as any)
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

  const handleSubmit = () => {
    addConsoleMessage({
      type: 'system',
      content: 'Validation not yet implemented. Submit functionality coming soon!',
    })
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
          <Panel defaultSize={40} minSize={25}>
            <LessonPanel />
          </Panel>

          <PanelResizeHandle className="w-1 bg-navy-700 hover:bg-accent-500 transition-colors cursor-col-resize" />

          {/* Right: Code editor + console panel */}
          <Panel defaultSize={60} minSize={40}>
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
        </PanelGroup>
      </div>

      <ActionBar
        onRun={handleRun}
        onSubmit={handleSubmit}
        onShowSolution={handleShowSolution}
      />
    </div>
  )
}

export default App
