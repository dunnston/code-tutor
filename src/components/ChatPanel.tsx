import { useState, useRef, useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { aiService } from '@/lib/ai'
import type { AIProviderType } from '@/types/ai'
import { MarkdownRenderer } from './MarkdownRenderer'
import { buildPromptContext } from '@/lib/ai/promptContext'
import { buildPrompt, detectPromptType } from '@/lib/ai/prompts'

export function ChatPanel() {
  const {
    chatMessages,
    addChatMessage,
    chatOpen,
    toggleChat,
    aiProvider,
    setAIProvider,
    currentLesson,
    code,
    progress,
    hintsRevealed,
    lessonStartTime,
    consoleMessages,
  } = useAppStore()

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
  }, [chatMessages])

  const handleSend = async () => {
    if (!input.trim() || isSending || !currentLesson) return

    const userMessage = input.trim()
    setInput('')
    setIsSending(true)

    // Add user message
    addChatMessage({
      role: 'user',
      content: userMessage,
    })

    try {
      // Get last console output for context
      const lastOutput = consoleMessages
        .filter((msg) => msg.type === 'stdout')
        .slice(-3)
        .map((msg) => msg.content)
        .join('\n')

      const lastError = consoleMessages
        .filter((msg) => msg.type === 'error')
        .slice(-1)
        .map((msg) => msg.content)
        .join('\n')

      // Build comprehensive prompt context
      const promptContext = buildPromptContext({
        lesson: currentLesson,
        userCode: code,
        progress,
        chatHistory: chatMessages,
        executionOutput: lastOutput || undefined,
        errorMessage: lastError || null,
        hintsRevealed,
        lessonStartTime,
      })

      // Detect appropriate prompt type
      const promptType = detectPromptType(userMessage, promptContext)

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

      // Send message with enhanced context and dynamic system prompt
      const legacyContext = {
        lessonTitle: currentLesson.title,
        lessonDescription: currentLesson.description,
        userCode: code,
        chatHistory: chatMessages,
      }

      const response = await aiService.sendMessage(
        userPrompt,
        legacyContext,
        systemPrompt
      )

      // Add AI response
      addChatMessage({
        role: 'assistant',
        content: response,
      })
    } catch (error) {
      console.error('AI Error:', error)
      addChatMessage({
        role: 'assistant',
        content: `Sorry, I encountered an error: ${
          error instanceof Error ? error.message : 'Unknown error'
        }. Please check your AI provider settings.`,
      })
    } finally {
      setIsSending(false)
    }
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

  if (!chatOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed right-6 bottom-20 w-14 h-14 bg-accent-500 hover:bg-accent-400 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-50"
        aria-label="Open AI Tutor"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </button>
    )
  }

  return (
    <div className="flex flex-col h-full bg-navy-800 border-l border-navy-700">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-navy-700">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-accent-500"
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
            className="p-1 hover:bg-navy-700 rounded transition-colors"
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
            onClick={toggleChat}
            className="p-1 hover:bg-navy-700 rounded transition-colors"
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
        <div className="p-4 bg-navy-900 border-b border-navy-700">
          <h3 className="text-sm font-semibold text-white mb-3">
            AI Provider
          </h3>
          <div className="space-y-2 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="provider"
                value="ollama"
                checked={aiProvider === 'ollama'}
                onChange={() => handleProviderChange('ollama')}
                className="text-accent-500"
              />
              <span className="text-sm text-gray-300">
                Ollama (Local, Free)
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="provider"
                value="claude"
                checked={aiProvider === 'claude'}
                onChange={() => handleProviderChange('claude')}
                className="text-accent-500"
              />
              <span className="text-sm text-gray-300">
                Claude API (Cloud, Requires Key)
              </span>
            </label>
          </div>

          {aiProvider === 'claude' && (
            <div className="space-y-2">
              <label className="block text-sm text-gray-400">
                Claude API Key
              </label>
              <input
                type="password"
                value={claudeApiKey}
                onChange={(e) => setClaudeApiKey(e.target.value)}
                placeholder="sk-ant-..."
                className="w-full px-3 py-2 bg-navy-800 border border-navy-600 rounded text-sm text-white focus:outline-none focus:border-accent-500"
              />
              <button
                onClick={handleSaveApiKey}
                className="w-full px-3 py-2 bg-accent-500 hover:bg-accent-400 text-white text-sm rounded transition-colors"
              >
                Save API Key
              </button>
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            <p className="text-lg mb-2">👋 Hello!</p>
            <p className="text-sm">
              I'm your AI coding tutor. Ask me questions about the lesson, or
              get hints if you're stuck!
            </p>
            <p className="text-xs mt-4 text-gray-500">
              Using: {aiProvider === 'ollama' ? 'Ollama (Local)' : 'Claude API'}
            </p>
          </div>
        )}

        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-accent-500 text-white'
                  : 'bg-navy-700 text-gray-100'
              }`}
            >
              {message.role === 'user' ? (
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              ) : (
                <div className="text-sm prose prose-invert max-w-none">
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
            <div className="bg-navy-700 px-4 py-2 rounded-lg">
              <p className="text-sm text-gray-400">Thinking...</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-navy-700">
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
            placeholder="Ask a question..."
            disabled={isSending}
            className="flex-1 px-3 py-2 bg-navy-900 border border-navy-600 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent-500 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            className="px-4 py-2 bg-accent-500 hover:bg-accent-400 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
