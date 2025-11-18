import type { AIProvider, ChatContext } from '@types/ai'
import { SYSTEM_PROMPT, buildChatPrompt } from './prompts'

/**
 * Claude API provider (Anthropic)
 */
export class ClaudeProvider implements AIProvider {
  name = 'Claude API'
  type = 'claude' as const
  private apiKey: string
  private model: string

  constructor(apiKey: string, model: string = 'claude-3-5-sonnet-20241022') {
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
  async sendMessage(prompt: string, context: ChatContext): Promise<string> {
    const messages = this.buildMessages(prompt, context)

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Claude API request failed: ${error}`)
    }

    const data = await response.json()
    return data.content[0]?.text || 'No response from Claude'
  }

  /**
   * Stream a message from Claude (for real-time responses)
   */
  async streamMessage(
    prompt: string,
    context: ChatContext,
    onChunk: (text: string) => void
  ): Promise<void> {
    const messages = this.buildMessages(prompt, context)

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages,
        stream: true,
      }),
    })

    if (!response.ok) {
      throw new Error(`Claude API request failed: ${response.statusText}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('No response body')
    }

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.substring(6)
          if (jsonStr.trim() === '[DONE]') continue

          try {
            const data = JSON.parse(jsonStr)
            if (data.type === 'content_block_delta') {
              const text = data.delta?.text
              if (text) {
                onChunk(text)
              }
            }
          } catch (e) {
            console.error('Failed to parse chunk:', e)
          }
        }
      }
    }
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
