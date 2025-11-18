import type { AIProvider, AIProviderType, ChatContext } from '@/types/ai'
import { OllamaProvider } from './ollama'
import { ClaudeProvider } from './claude'

/**
 * AI service manager - handles provider selection and messaging
 */
export class AIService {
  private currentProvider: AIProvider | null = null
  private ollamaProvider: OllamaProvider
  private claudeProvider: ClaudeProvider | null = null

  constructor() {
    this.ollamaProvider = new OllamaProvider()
  }

  /**
   * Set the AI provider
   */
  async setProvider(
    type: AIProviderType,
    config?: { claudeApiKey?: string; ollamaModel?: string }
  ): Promise<void> {
    switch (type) {
      case 'ollama':
        if (config?.ollamaModel) {
          this.ollamaProvider = new OllamaProvider(config.ollamaModel)
        }
        this.currentProvider = this.ollamaProvider
        break

      case 'claude':
        if (!config?.claudeApiKey) {
          throw new Error('Claude API key is required')
        }
        this.claudeProvider = new ClaudeProvider(config.claudeApiKey)
        this.currentProvider = this.claudeProvider
        break

      case 'none':
        this.currentProvider = null
        break
    }
  }

  /**
   * Get current provider
   */
  getCurrentProvider(): AIProvider | null {
    return this.currentProvider
  }

  /**
   * Check if a provider is available
   */
  async checkProviderAvailability(type: AIProviderType): Promise<boolean> {
    switch (type) {
      case 'ollama':
        return this.ollamaProvider.isAvailable()
      case 'claude':
        return this.claudeProvider?.isAvailable() ?? false
      case 'none':
        return false
    }
  }

  /**
   * Send a message to the current provider
   */
  async sendMessage(
    prompt: string,
    context: ChatContext,
    systemPrompt?: string
  ): Promise<string> {
    if (!this.currentProvider) {
      throw new Error('No AI provider selected')
    }

    const available = await this.currentProvider.isAvailable()
    if (!available) {
      throw new Error(`${this.currentProvider.name} is not available`)
    }

    return this.currentProvider.sendMessage(prompt, context, systemPrompt)
  }

  /**
   * Stream a message from the current provider
   */
  async streamMessage(
    prompt: string,
    context: ChatContext,
    onChunk: (text: string) => void,
    systemPrompt?: string
  ): Promise<void> {
    if (!this.currentProvider) {
      throw new Error('No AI provider selected')
    }

    if (!this.currentProvider.streamMessage) {
      // If streaming is not supported, fall back to regular message
      const response = await this.sendMessage(prompt, context, systemPrompt)
      onChunk(response)
      return
    }

    return this.currentProvider.streamMessage(prompt, context, onChunk, systemPrompt)
  }
}

// Singleton instance
export const aiService = new AIService()

// Export providers for direct use if needed
export { OllamaProvider } from './ollama'
export { ClaudeProvider } from './claude'
export { SYSTEM_PROMPT, buildChatPrompt, buildHintPrompt } from './prompts'
