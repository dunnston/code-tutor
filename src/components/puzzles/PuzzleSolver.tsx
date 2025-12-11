import { useEffect, useState, useRef } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import {
  getPuzzle,
  getPuzzleImplementation,
  getPuzzleProgress,
  recordPuzzleAttempt,
  recordHintUsed,
  recordSolutionViewed,
  markPuzzleSolved,
  getDailyPuzzle,
  completeDailyPuzzle,
} from '@/lib/puzzles'
import { validatePuzzleSolution, formatTestResults } from '@/lib/puzzleValidation'
import { useAppStore } from '@/lib/store'
import { executeCode } from '@/lib/tauri'
import { incrementQuestProgress } from '@/lib/gamification'
import { useAchievements } from '@/hooks/useAchievements'
import type {
  Puzzle,
  PuzzleImplementation,
  SupportedLanguage,
  ValidationResult,
} from '@/types/puzzle'
import type { ExecutionResult } from '@/types/execution'
import { CodeEditor } from '@/components/CodeEditor'
import { Console } from '@/components/Console'
import { PuzzleActionBar } from './PuzzleActionBar'
import { PuzzleDescriptionPanel } from './PuzzleDescriptionPanel'
import { PuzzleSuccessModal } from './PuzzleSuccessModal'
import { PuzzleFailureModal } from './PuzzleFailureModal'
import { SolutionWarningModal } from './SolutionWarningModal'
import { PuzzleChatPanel } from './PuzzleChatPanel'

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
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showFailureModal, setShowFailureModal] = useState(false)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [pointsEarned, setPointsEarned] = useState(0)
  const [solveStartTime, setSolveStartTime] = useState<number>(Date.now())
  const [showSolutionWarning, setShowSolutionWarning] = useState(false)
  const [solutionViewed, setSolutionViewed] = useState(false)

  const addConsoleMessage = useAppStore((state) => state.addConsoleMessage)
  const clearConsole = useAppStore((state) => state.clearConsole)
  const setExecutionStatus = useAppStore((state) => state.setExecutionStatus)
  const setCurrentView = useAppStore((state) => state.setCurrentView)
  const addXP = useAppStore((state) => state.addXP)
  const consoleMessages = useAppStore((state) => state.consoleMessages)
  const currentUserId = useAppStore((state) => state.currentUserId)

  // Achievement tracking
  const { trackPuzzleSolved, trackPerfectPuzzle, trackXpEarned } = useAchievements()

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

      // Load user progress if exists
      if (!currentUserId) {
        console.warn('No user ID available for loading puzzle progress')
        setCode(implData.starterCode)
        setHintsRevealed(0)
        setSolutionViewed(false)
        setSolveStartTime(Date.now())
        setError(null)
        setLoading(false)
        return
      }
      const progress = await getPuzzleProgress(currentUserId, puzzleId, selectedLanguage)
      if (progress && progress.userSolution) {
        // Restore previous solution
        setCode(progress.userSolution)
        setHintsRevealed(progress.hintsUsed)
        setSolutionViewed(progress.solutionViewed)
      } else {
        setCode(implData.starterCode)
        setHintsRevealed(0)
        setSolutionViewed(false)
      }

      // Reset solve start time
      setSolveStartTime(Date.now())
      setError(null)
    } catch (err) {
      console.error('Failed to load puzzle:', err)
      setError('Failed to load puzzle')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    // Navigate back to the puzzle hub instead of puzzle-list
    // This avoids issues if currentPuzzleCategoryId is not set
    setCurrentView('puzzles')
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
      // Validate solution against visible test cases only
      const validation = await validatePuzzleSolution(
        code,
        selectedLanguage,
        implementation,
        false // Don't include hidden tests
      )

      setValidationResult(validation)

      // Display results
      const resultText = formatTestResults(validation)
      addConsoleMessage({
        type: 'stdout',
        content: resultText,
      })

      if (validation.allPassed) {
        addConsoleMessage({
          type: 'system',
          content: `✅ All visible tests passed! (${validation.passedCount}/${validation.totalCount})`,
        })
        setExecutionStatus('success')
      } else {
        addConsoleMessage({
          type: 'system',
          content: `⚠️ ${validation.passedCount}/${validation.totalCount} tests passed.`,
        })
        setExecutionStatus('error')
      }

      // Record attempt (save progress)
      if (currentUserId) {
        await recordPuzzleAttempt(currentUserId, puzzleId, selectedLanguage, code)
      }
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

    setExecuting(true)
    setExecutionStatus('running')
    clearConsole()

    addConsoleMessage({
      type: 'system',
      content: '📝 Submitting solution...',
    })

    try {
      // Validate solution against ALL test cases (visible + hidden)
      const validation = await validatePuzzleSolution(
        code,
        selectedLanguage,
        implementation,
        true // Include hidden tests
      )

      setValidationResult(validation)

      // Display results
      const resultText = formatTestResults(validation)
      addConsoleMessage({
        type: 'stdout',
        content: resultText,
      })

      if (validation.allPassed) {
        // Calculate solve time
        const solveTimeSeconds = Math.floor((Date.now() - solveStartTime) / 1000)

        // Mark as solved and award points
        if (!currentUserId) {
          console.warn('No user ID available for marking puzzle solved')
          return
        }
        const points = await markPuzzleSolved(
          currentUserId,
          puzzleId,
          selectedLanguage,
          code,
          solveTimeSeconds
        )

        setPointsEarned(points)

        // Add XP to user profile
        addXP(points)

        // Track quest progress
        if (currentUserId) {
          try {
            await incrementQuestProgress(currentUserId, 'solve_puzzle')
            if (points > 0) {
              await incrementQuestProgress(currentUserId, 'earn_xp', points)
            }

            // Refresh currency and quests to show updated gold and quest progress
            const { refreshCurrency, refreshQuests } = useAppStore.getState()
            await refreshCurrency()
            await refreshQuests()
          } catch (error) {
            console.error('Failed to update quest progress:', error)
          }
        }

        // Track achievements
        try {
          await trackPuzzleSolved()
          if (points > 0) {
            await trackXpEarned(points)
          }
          if (hintsRevealed === 0 && !solutionViewed) {
            await trackPerfectPuzzle()
          }
        } catch (error) {
          console.error('Failed to track achievements:', error)
        }

        // Check if this is today's daily puzzle and award bonus
        try {
          if (!currentUserId) throw new Error('No user ID')
          const dailyChallenge = await getDailyPuzzle(currentUserId)
          if (dailyChallenge.puzzleId === puzzleId && !dailyChallenge.completedToday) {
            const bonusPoints = await completeDailyPuzzle(currentUserId, puzzleId, selectedLanguage)
            if (bonusPoints > 0) {
              addConsoleMessage({
                type: 'success',
                content: `🎉 Daily Challenge Complete! +${bonusPoints} bonus points!`,
              })

              // Add bonus XP to user profile
              addXP(bonusPoints)

              // Refresh daily puzzle state
              const { refreshDailyPuzzle } = useAppStore.getState()
              await refreshDailyPuzzle()
            }
          }
        } catch (error) {
          console.error('Failed to check daily puzzle:', error)
          // Non-critical, continue
        }

        addConsoleMessage({
          type: 'system',
          content: `🎉 Puzzle solved! You earned ${points} points!`,
        })
        setExecutionStatus('success')

        // Show success modal
        setShowSuccessModal(true)
      } else {
        addConsoleMessage({
          type: 'system',
          content: `❌ ${validation.passedCount}/${validation.totalCount} tests passed. Keep trying!`,
        })
        setExecutionStatus('error')

        // Show failure modal
        setShowFailureModal(true)
      }

      // Record attempt
      if (currentUserId) {
        await recordPuzzleAttempt(currentUserId, puzzleId, selectedLanguage, code)
      }
    } catch (err) {
      console.error('Submission error:', err)
      addConsoleMessage({
        type: 'stderr',
        content: `Error: ${err instanceof Error ? err.message : 'Unknown error'}`,
      })
      setExecutionStatus('error')
    } finally {
      setExecuting(false)
    }
  }

  const handleShowHint = async () => {
    if (!implementation || hintsRevealed >= implementation.hints.length) return

    const hint = implementation.hints[hintsRevealed]
    addConsoleMessage({
      type: 'system',
      content: `💡 Hint ${hintsRevealed + 1}: ${hint}`,
    })
    setHintsRevealed(hintsRevealed + 1)

    // Record hint usage in database
    if (currentUserId) {
      try {
        await recordHintUsed(currentUserId, puzzleId, selectedLanguage)
      } catch (err) {
        console.error('Failed to record hint usage:', err)
      }
    }
  }

  const handleShowSolution = () => {
    if (!implementation) return

    // Show warning modal if solution not already viewed
    if (!solutionViewed) {
      setShowSolutionWarning(true)
    } else {
      // Already viewed, just show it again
      revealSolution()
    }
  }

  const revealSolution = async () => {
    if (!implementation) return

    // Record solution viewed if first time
    if (!solutionViewed && currentUserId) {
      try {
        await recordSolutionViewed(currentUserId, puzzleId, selectedLanguage)
        setSolutionViewed(true)
      } catch (err) {
        console.error('Failed to record solution viewed:', err)
      }
    }

    setCode(implementation.solutionCode)
    addConsoleMessage({
      type: 'system',
      content: solutionViewed
        ? '📖 Solution displayed again.'
        : '📖 Solution revealed. You will not earn points for this puzzle in this language.',
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

      {/* Success Modal */}
      {showSuccessModal && validationResult && (
        <PuzzleSuccessModal
          puzzle={puzzle}
          validation={validationResult}
          pointsEarned={pointsEarned}
          solveTime={Math.floor((Date.now() - solveStartTime) / 1000)}
          hintsUsed={hintsRevealed}
          onClose={() => setShowSuccessModal(false)}
          onNextPuzzle={() => {
            // TODO: Navigate to next puzzle in category
            setShowSuccessModal(false)
          }}
        />
      )}

      {/* Failure Modal */}
      {showFailureModal && validationResult && (
        <PuzzleFailureModal
          puzzle={puzzle}
          validation={validationResult}
          hintsAvailable={implementation?.hints.length || 0}
          hintsUsed={hintsRevealed}
          onClose={() => setShowFailureModal(false)}
          onShowHint={async () => {
            setShowFailureModal(false)
            await handleShowHint()
          }}
          onTryAgain={() => setShowFailureModal(false)}
        />
      )}

      {/* Solution Warning Modal */}
      <SolutionWarningModal
        isOpen={showSolutionWarning}
        puzzleTitle={puzzle?.title || ''}
        languageName={selectedLanguage === 'python' ? 'Python' : selectedLanguage === 'javascript' ? 'JavaScript' : 'C#'}
        onCancel={() => setShowSolutionWarning(false)}
        onConfirm={() => {
          setShowSolutionWarning(false)
          revealSolution()
        }}
      />

      {/* AI Tutor Chat Panel */}
      {puzzle && implementation && (
        <PuzzleChatPanel
          puzzle={puzzle}
          implementation={implementation}
          userCode={code}
          hintsRevealed={hintsRevealed}
          consoleOutput={consoleMessages.map(m => m.content).join('\n')}
        />
      )}
    </div>
  )
}
