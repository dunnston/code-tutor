import type { AIProvider, ChatContext } from '@/types/ai'
import { SYSTEM_PROMPT, buildChatPrompt } from './prompts'
import { invoke } from '@/lib/tauri'

/**
 * Claude API provider (Anthropic)
 */
export class ClaudeProvider implements AIProvider {
  name = 'Claude API'
  type = 'claude' as const
  private apiKey: string
  private model: string

  constructor(apiKey: string, model: string = 'claude-4-sonnet-20250514') {
    this.apiKey = apiKey
    this.model = model
  }

  /**
   * Check if Claude API is available (has valid API key)
   */
  async isAvailable(): Promise<boolean> {
    return this.apiKey.length > 0
  }

  /**
   * Send a message to Claude
   */
  async sendMessage(
    prompt: string,
    context: ChatContext,
    systemPrompt?: string
  ): Promise<string> {
    const messages = this.buildMessages(prompt, context)

    try {
      const response = await invoke<string>('call_claude_api', {
        apiKey: this.apiKey,
        model: this.model,
        systemPrompt: systemPrompt || SYSTEM_PROMPT,
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      })
      return response
    } catch (error) {
      console.error('❌ Claude API error:', error)
      throw new Error(`Claude API error: ${error}`)
    }
  }

  /**
   * Stream a message from Claude (for real-time responses)
   * Note: Streaming not yet implemented via Tauri
   */
  async streamMessage(
    prompt: string,
    context: ChatContext,
    onChunk: (text: string) => void,
    systemPrompt?: string
  ): Promise<void> {
    // For now, fall back to non-streaming
    const response = await this.sendMessage(prompt, context, systemPrompt)
    onChunk(response)
  }

  private buildMessages(
    userMessage: string,
    context: ChatContext
  ): Array<{ role: string; content: string }> {
    const messages: Array<{ role: string; content: string }> = []

    // Add previous chat history (but skip system messages)
    for (const msg of context.chatHistory) {
      if (msg.role !== 'system') {
        messages.push({
          role: msg.role,
          content: msg.content,
        })
      }
    }

    // Add current message with context
    const fullPrompt = buildChatPrompt(userMessage, {
      lessonTitle: context.lessonTitle,
      lessonDescription: context.lessonDescription,
      userCode: context.userCode,
      stdout: context.executionResult?.stdout,
      stderr: context.executionResult?.stderr,
    })

    messages.push({
      role: 'user',
      content: fullPrompt,
    })

    return messages
  }
}
