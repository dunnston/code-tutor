import { useState, useRef, useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { aiService } from '@/lib/ai'
import type { AIProviderType, PromptType } from '@/types/ai'
import { MarkdownRenderer } from '../MarkdownRenderer'
import { buildPrompt } from '@/lib/ai/prompts'
import { getLessonById } from '@/lib/lessons'

interface PlaygroundChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface PlaygroundChatPanelProps {
  isOpen: boolean
  onToggle: () => void
}

export function PlaygroundChatPanel({ isOpen, onToggle }: PlaygroundChatPanelProps) {
  const {
    aiProvider,
    setAIProvider,
    progress,
    playgroundCode,
    playgroundLanguage,
  } = useAppStore()

  const [messages, setMessages] = useState<PlaygroundChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [claudeApiKey, setClaudeApiKey] = useState(
    localStorage.getItem('claudeApiKey') || ''
  )
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        role,
        content,
        timestamp: new Date(),
      },
    ])
  }

  const detectPlaygroundPromptType = (userMessage: string): PromptType => {
    const msg = userMessage.toLowerCase()

    // Challenge request
    if (
      msg.includes('challenge') ||
      msg.includes('test me') ||
      msg.includes('quiz') ||
      msg.includes('exercise')
    ) {
      return 'playground_challenge'
    }

    // Project ideas request
    if (
      msg.includes('idea') ||
      msg.includes('project') ||
      msg.includes('what should i build') ||
      msg.includes('what can i build') ||
      msg.includes('suggest')
    ) {
      return 'playground_ideas'
    }

    // Practice request
    if (
      msg.includes('practice') ||
      msg.includes('what should i practice')
    ) {
      return 'playground_ideas'
    }

    // Help with current code
    if (
      msg.includes('help') ||
      msg.includes('stuck') ||
      msg.includes('error') ||
      msg.includes('debug') ||
      msg.includes('fix')
    ) {
      return 'playground_help'
    }

    // Default to general playground chat
    return 'playground_chat'
  }

  const sendMessage = async (userMessage: string) => {
    setIsSending(true)
    addMessage('user', userMessage)

    try {
      // Get completed lessons with details
      const completedLessons = progress.completedLessons
        .map((lessonId) => {
          const lesson = getLessonById(lessonId)
          if (!lesson) return null
          return {
            id: lesson.id,
            title: lesson.title,
            tags: lesson.tags,
          }
        })
        .filter((l) => l !== null)

      // Build prompt context for playground
      const promptContext = {
        userName: 'Adventurer',
        userLevel: progress.level,
        skillLevel:
          progress.level <= 3
            ? ('beginner' as const)
            : progress.level <= 7
            ? ('intermediate' as const)
            : ('advanced' as const),
        courseName: '',
        lessonTitle: 'Playground',
        lessonDescription: 'Free-form coding practice area',
        conceptName: 'Playground',
        conceptCategory: 'Practice',
        language: playgroundLanguage,
        userCode: playgroundCode,
        attempts: 0,
        hintsGiven: 0,
        hintsAvailable: [],
        timeSpentMinutes: 0,
        conversationHistory: messages,
        playgroundMode: true,
        completedLessons,
      }

      // Detect appropriate prompt type
      const promptType = detectPlaygroundPromptType(userMessage)
      console.log(`🎯 Detected playground prompt type: ${promptType}`)

      // Build the complete prompt
      const { systemPrompt, userPrompt } = buildPrompt(
        promptType,
        userMessage,
        promptContext
      )

      // Get current provider
      const provider = aiService.getCurrentProvider()
      if (!provider) {
        throw new Error('No AI provider configured. Please select one in settings.')
      }

      // Send message
      const legacyContext = {
        lessonTitle: 'Playground',
        lessonDescription: 'Free-form coding practice',
        userCode: playgroundCode,
        chatHistory: messages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: m.timestamp,
        })),
      }

      const response = await aiService.sendMessage(
        userPrompt,
        legacyContext,
        systemPrompt
      )

      addMessage('assistant', response)
    } catch (error) {
      console.error('AI Error:', error)
      addMessage(
        'assistant',
        `Sorry, I encountered an error: ${
          error instanceof Error ? error.message : 'Unknown error'
        }. Please check your AI provider settings.`
      )
    } finally {
      setIsSending(false)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isSending) return

    const userMessage = input.trim()
    setInput('')
    await sendMessage(userMessage)
  }

  const handleQuickAction = async (action: 'ideas' | 'practice' | 'challenge') => {
    const prompts = {
      ideas: 'Give me some project ideas based on what I\'ve learned',
      practice: 'What should I practice to reinforce what I\'ve learned?',
      challenge: 'Give me a coding challenge to test my skills',
    }

    await sendMessage(prompts[action])
  }

  const handleProviderChange = async (provider: AIProviderType) => {
    if (provider === 'claude' && !claudeApiKey) {
      setShowSettings(true)
      return
    }

    try {
      await aiService.setProvider(provider, { claudeApiKey })
      setAIProvider(provider)
    } catch (error) {
      console.error('Failed to set provider:', error)
      alert('Failed to initialize AI provider. Please check your settings.')
    }
  }

  const handleSaveApiKey = () => {
    localStorage.setItem('claudeApiKey', claudeApiKey)
    handleProviderChange('claude')
    setShowSettings(false)
  }

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-orange-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <h2 className="text-lg font-semibold text-white">AI Tutor</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1 hover:bg-slate-800 rounded transition-colors"
            aria-label="Settings"
          >
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-slate-800 rounded transition-colors"
            aria-label="Close chat"
          >
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 bg-slate-800 border-b border-slate-700">
          <h3 className="text-sm font-semibold text-white mb-3">AI Provider</h3>
          <div className="space-y-2 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="provider"
                value="ollama"
                checked={aiProvider === 'ollama'}
                onChange={() => handleProviderChange('ollama')}
                className="text-orange-500"
              />
              <span className="text-sm text-gray-300">Ollama (Local, Free)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="provider"
                value="claude"
                checked={aiProvider === 'claude'}
                onChange={() => handleProviderChange('claude')}
                className="text-orange-500"
              />
              <span className="text-sm text-gray-300">
                Claude API (Cloud, Requires Key)
              </span>
            </label>
          </div>

          {aiProvider === 'claude' && (
            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Claude API Key</label>
              <input
                type="password"
                value={claudeApiKey}
                onChange={(e) => setClaudeApiKey(e.target.value)}
                placeholder="sk-ant-..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-sm text-white focus:outline-none focus:border-orange-500"
              />
              <button
                onClick={handleSaveApiKey}
                className="w-full px-3 py-2 bg-orange-500 hover:bg-orange-400 text-white text-sm rounded transition-colors"
              >
                Save API Key
              </button>
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            <p className="text-lg mb-2">Welcome to the Playground!</p>
            <p className="text-sm mb-6">
              I'm here to help you practice what you've learned. Ask me for project
              ideas, or get help with code you're working on!
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-col gap-3 max-w-xs mx-auto mb-6">
              <button
                onClick={() => handleQuickAction('ideas')}
                disabled={isSending}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Give me project ideas
              </button>

              <button
                onClick={() => handleQuickAction('practice')}
                disabled={isSending}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                What should I practice?
              </button>

              <button
                onClick={() => handleQuickAction('challenge')}
                disabled={isSending}
                className="px-4 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Give me a challenge
              </button>
            </div>

            <p className="text-xs mt-4 text-gray-500">
              Using: {aiProvider === 'ollama' ? 'Ollama (Local)' : 'Claude API'}
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[85%] min-w-0 px-4 py-2 rounded-lg overflow-hidden ${
                message.role === 'user'
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-800 text-gray-100'
              }`}
            >
              {message.role === 'user' ? (
                <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
              ) : (
                <div className="text-sm prose prose-invert max-w-none overflow-hidden">
                  <MarkdownRenderer content={message.content} />
                </div>
              )}
              <p className="text-xs opacity-70 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex justify-start">
            <div className="bg-slate-800 px-4 py-2 rounded-lg">
              <p className="text-sm text-gray-400">Thinking...</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Ask for ideas or help..."
            disabled={isSending}
            className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
