import { invoke } from '@tauri-apps/api/core'
import type { ExecutionResult } from '@/types/execution'
import type { SupportedLanguage } from '@/types/language'

/**
 * Execute code in any supported language via Tauri backend
 * @param language - Programming language to execute
 * @param code - Code to execute
 * @param timeoutMs - Timeout in milliseconds (default: 5000ms)
 */
export async function executeCode(
  language: SupportedLanguage,
  code: string,
  timeoutMs?: number
): Promise<ExecutionResult> {
  try {
    const result = await invoke<ExecutionResult>('execute_code', {
      language,
      code,
      timeoutMs,
    })
    return result
  } catch (error) {
    throw new Error(`${error}`)
  }
}

/**
 * Check if a language runtime is available on the system
 * @param language - Programming language to check
 * @returns true if runtime is installed and available
 */
export async function checkLanguageRuntime(
  language: SupportedLanguage
): Promise<boolean> {
  try {
    const result = await invoke<boolean>('check_language_runtime', {
      language,
    })
    return result
  } catch (error) {
    console.error(`Failed to check ${language} runtime:`, error)
    return false
  }
}

/**
 * Execute Python code via Tauri backend (legacy function for backward compatibility)
 * @param code - Python code to execute
 * @param timeoutMs - Timeout in milliseconds (default: 5000ms)
 */
export async function executePythonCode(
  code: string,
  timeoutMs?: number
): Promise<ExecutionResult> {
  return executeCode('python', code, timeoutMs)
}
