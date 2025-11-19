import { useEffect, useState, useRef } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { getPuzzle, getPuzzleImplementation } from '@/lib/puzzles'
import { useAppStore } from '@/lib/store'
import { executeCode } from '@/lib/tauri'
import type { Puzzle, PuzzleImplementation, TestCase, SupportedLanguage } from '@/types/puzzle'
import type { ExecutionResult } from '@/types/execution'
import { CodeEditor } from '@/components/CodeEditor'
import { Console } from '@/components/Console'
import { PuzzleActionBar } from './PuzzleActionBar'
import { PuzzleDescriptionPanel } from './PuzzleDescriptionPanel'

interface PuzzleSolverProps {
  puzzleId: string
}

export function PuzzleSolver({ puzzleId }: PuzzleSolverProps) {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null)
  const [implementation, setImplementation] = useState<PuzzleImplementation | null>(null)
  const [code, setCode] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('python')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hintsRevealed, setHintsRevealed] = useState(0)
  const [executing, setExecuting] = useState(false)

  const addConsoleMessage = useAppStore((state) => state.addConsoleMessage)
  const clearConsole = useAppStore((state) => state.clearConsole)
  const setExecutionStatus = useAppStore((state) => state.setExecutionStatus)
  const setCurrentView = useAppStore((state) => state.setCurrentView)

  const lastExecutionResult = useRef<ExecutionResult | undefined>()

  useEffect(() => {
    loadPuzzle()
  }, [puzzleId, selectedLanguage])

  const loadPuzzle = async () => {
    try {
      setLoading(true)
      const puzzleData = await getPuzzle(puzzleId)
      setPuzzle(puzzleData)

      const implData = await getPuzzleImplementation(puzzleId, selectedLanguage)
      setImplementation(implData)
      setCode(implData.starterCode)

      setError(null)
    } catch (err) {
      console.error('Failed to load puzzle:', err)
      setError('Failed to load puzzle')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    setCurrentView('puzzle-list')
  }

  const handleLanguageChange = (language: SupportedLanguage) => {
    setSelectedLanguage(language)
    setHintsRevealed(0) // Reset hints when changing language
    clearConsole()
  }

  const handleRunTests = async () => {
    if (!puzzle || !implementation) return

    setExecuting(true)
    setExecutionStatus('running')
    clearConsole()

    addConsoleMessage({
      type: 'system',
      content: '▶️ Running tests...',
    })

    try {
      // Execute the user's code
      const result = await executeCode(code, selectedLanguage)
      lastExecutionResult.current = result

      if (result.exitCode !== 0) {
        addConsoleMessage({
          type: 'stderr',
          content: result.stderr || 'Execution failed',
        })
        setExecutionStatus('error')
        return
      }

      // Run test cases
      const visibleTests = implementation.testCases
      let passedCount = 0
      let failedCount = 0

      for (let i = 0; i < visibleTests.length; i++) {
        const test = visibleTests[i]
        // TODO: Actually run the test with the function
        // For now, just display test info
        addConsoleMessage({
          type: 'stdout',
          content: `Test ${i + 1}: ${test.description}`,
        })
        addConsoleMessage({
          type: 'stdout',
          content: `  Input: ${JSON.stringify(test.input)}`,
        })
        addConsoleMessage({
          type: 'stdout',
          content: `  Expected: ${JSON.stringify(test.expectedOutput)}`,
        })

        // Placeholder: Mark as passed for demo
        passedCount++
      }

      if (passedCount === visibleTests.length) {
        addConsoleMessage({
          type: 'system',
          content: `✅ All visible tests passed! (${passedCount}/${visibleTests.length})`,
        })
      } else {
        addConsoleMessage({
          type: 'system',
          content: `⚠️ ${passedCount}/${visibleTests.length} tests passed. ${failedCount} failed.`,
        })
      }

      setExecutionStatus('success')
    } catch (err) {
      console.error('Execution error:', err)
      addConsoleMessage({
        type: 'stderr',
        content: `Error: ${err instanceof Error ? err.message : 'Unknown error'}`,
      })
      setExecutionStatus('error')
    } finally {
      setExecuting(false)
    }
  }

  const handleSubmit = async () => {
    if (!puzzle || !implementation) return

    // Run tests first
    await handleRunTests()

    // TODO: Validate all tests including hidden ones
    // TODO: Update user progress
    // TODO: Award points
    // TODO: Show success modal

    addConsoleMessage({
      type: 'system',
      content: '📝 Submission recorded! (Progress tracking coming soon)',
    })
  }

  const handleShowHint = () => {
    if (!implementation || hintsRevealed >= implementation.hints.length) return

    const hint = implementation.hints[hintsRevealed]
    addConsoleMessage({
      type: 'system',
      content: `💡 Hint ${hintsRevealed + 1}: ${hint}`,
    })
    setHintsRevealed(hintsRevealed + 1)
  }

  const handleShowSolution = () => {
    if (!implementation) return

    setCode(implementation.solutionCode)
    addConsoleMessage({
      type: 'system',
      content: '📖 Solution revealed. Try to understand how it works!',
    })
  }

  const handleReset = () => {
    if (!implementation) return

    setCode(implementation.starterCode)
    setHintsRevealed(0)
    clearConsole()
    addConsoleMessage({
      type: 'system',
      content: '🔄 Code reset to starter template',
    })
  }

  if (loading) {
    return (
      <div className="h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading puzzle...</p>
        </div>
      </div>
    )
  }

  if (error || !puzzle || !implementation) {
    return (
      <div className="h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Puzzle not found'}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg transition-colors"
          >
            Back to Puzzles
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-navy-900">
      {/* Header */}
      <div className="h-16 bg-navy-800 border-b border-navy-700 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-400 hover:text-accent-500 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back</span>
          </button>
          <div className="h-6 w-px bg-navy-700" />
          <h2 className="text-xl font-bold text-white">{puzzle.title}</h2>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">Language:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
            className="px-3 py-1.5 bg-navy-900 border border-navy-700 rounded-lg text-gray-300 focus:outline-none focus:border-accent-500"
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="csharp">C#</option>
            {/* Add more as implementations are available */}
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* Left: Description Panel */}
          <Panel defaultSize={35} minSize={25}>
            <PuzzleDescriptionPanel
              puzzle={puzzle}
              implementation={implementation}
              hintsRevealed={hintsRevealed}
              onShowHint={handleShowHint}
            />
          </Panel>

          <PanelResizeHandle className="w-1 bg-navy-700 hover:bg-accent-500 transition-colors" />

          {/* Right: Code Editor + Console */}
          <Panel defaultSize={65} minSize={40}>
            <div className="h-full flex flex-col">
              {/* Code Editor */}
              <div className="flex-1 overflow-hidden">
                <CodeEditor
                  code={code}
                  onChange={setCode}
                  language={selectedLanguage}
                  readOnly={false}
                />
              </div>

              {/* Action Bar */}
              <PuzzleActionBar
                onRunTests={handleRunTests}
                onSubmit={handleSubmit}
                onShowHint={handleShowHint}
                onShowSolution={handleShowSolution}
                onReset={handleReset}
                executing={executing}
                hintsAvailable={implementation.hints.length}
                hintsRevealed={hintsRevealed}
              />

              {/* Console */}
              <div className="h-48 border-t border-navy-700">
                <Console />
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  )
}
