// AI Tutor types

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

export interface ChatContext {
  lessonTitle: string
  lessonDescription: string
  userCode: string
  executionResult?: {
    stdout: string
    stderr: string
    exitCode: number
  }
  chatHistory: ChatMessage[]
}

export type AIProviderType = 'ollama' | 'claude' | 'none'

export interface AIProvider {
  name: string
  type: AIProviderType
  isAvailable(): Promise<boolean>
  sendMessage(prompt: string, context: ChatContext): Promise<string>
  streamMessage?(
    prompt: string,
    context: ChatContext,
    onChunk: (text: string) => void
  ): Promise<void>
}

export interface AIConfig {
  provider: AIProviderType
  ollamaModel?: string
  claudeApiKey?: string
}
