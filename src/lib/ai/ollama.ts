import type { AIProvider, ChatContext } from '@types/ai'
import { SYSTEM_PROMPT, buildChatPrompt } from './prompts'

/**
 * Ollama local LLM provider
 */
export class OllamaProvider implements AIProvider {
  name = 'Ollama (Local)'
  type = 'ollama' as const
  private baseUrl = 'http://localhost:11434'
  private model: string

  constructor(model: string = 'llama3.2:latest') {
    this.model = model
  }

  /**
   * Check if Ollama is running and available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 2000)

      const response = await fetch(`${this.baseUrl}/api/tags`, {
        signal: controller.signal,
      })

      clearTimeout(timeout)
      return response.ok
    } catch {
      return false
    }
  }

  /**
   * Send a message to Ollama
   */
  async sendMessage(prompt: string, context: ChatContext): Promise<string> {
    const fullPrompt = this.buildPrompt(prompt, context)

    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        prompt: fullPrompt,
        stream: false,
        system: SYSTEM_PROMPT,
      }),
    })

    if (!response.ok) {
      throw new Error(`Ollama request failed: ${response.statusText}`)
    }

    const data = await response.json()
    return data.response
  }

  /**
   * Stream a message from Ollama (for real-time responses)
   */
  async streamMessage(
    prompt: string,
    context: ChatContext,
    onChunk: (text: string) => void
  ): Promise<void> {
    const fullPrompt = this.buildPrompt(prompt, context)

    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        prompt: fullPrompt,
        stream: true,
        system: SYSTEM_PROMPT,
      }),
    })

    if (!response.ok) {
      throw new Error(`Ollama request failed: ${response.statusText}`)
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
        if (line.trim()) {
          try {
            const data = JSON.parse(line)
            if (data.response) {
              onChunk(data.response)
            }
          } catch (e) {
            console.error('Failed to parse chunk:', e)
          }
        }
      }
    }
  }

  private buildPrompt(userMessage: string, context: ChatContext): string {
    return buildChatPrompt(userMessage, {
      lessonTitle: context.lessonTitle,
      lessonDescription: context.lessonDescription,
      userCode: context.userCode,
      stdout: context.executionResult?.stdout,
      stderr: context.executionResult?.stderr,
    })
  }
}
