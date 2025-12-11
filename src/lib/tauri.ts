import { invoke as tauriInvoke } from '@tauri-apps/api/core'
import type { ExecutionResult } from '@/types/execution'
import type { SupportedLanguage } from '@/types/language'

// Extend Window interface to include Tauri internals
declare global {
  interface Window {
    __TAURI_INTERNALS__?: {
      invoke: <T>(cmd: string, args?: Record<string, unknown>) => Promise<T>
    }
  }
}

// Default timeout for Tauri invoke calls (10 seconds)
const DEFAULT_INVOKE_TIMEOUT = 10000

/**
 * Check if Tauri runtime is available
 * This must be checked before calling any Tauri APIs
 */
export function isTauriAvailable(): boolean {
  return typeof window !== 'undefined' &&
         window.__TAURI_INTERNALS__ !== undefined &&
         typeof window.__TAURI_INTERNALS__.invoke === 'function'
}

/**
 * Safe invoke wrapper that checks Tauri availability first
 * Throws a helpful error if Tauri is not available
 */
export async function invoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  if (!isTauriAvailable()) {
    throw new Error(`Tauri runtime not available. Cannot execute command: ${cmd}`)
  }
  return tauriInvoke<T>(cmd, args)
}

/**
 * Wrapper for Tauri invoke with timeout protection
 * Prevents the frontend from hanging indefinitely if the backend becomes unresponsive
 * @param command - Tauri command name
 * @param args - Command arguments
 * @param timeoutMs - Timeout in milliseconds (default: 10000ms)
 * @returns Promise that resolves with the command result or rejects on timeout
 */
export async function invokeWithTimeout<T>(
  command: string,
  args?: Record<string, unknown>,
  timeoutMs: number = DEFAULT_INVOKE_TIMEOUT
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timeout: ${command} did not respond within ${timeoutMs}ms`))
    }, timeoutMs)
  })

  return Promise.race([
    invoke<T>(command, args),
    timeoutPromise
  ])
}

/**
 * Execute code in any supported language via Tauri backend
 * @param language - Programming language to execute
 * @param code - Code to execute
 * @param timeoutMs - Timeout in milliseconds (default: 5000ms)
 * @param customExecutablePath - Optional custom path to language executable
 */
export async function executeCode(
  language: SupportedLanguage,
  code: string,
  timeoutMs?: number,
  customExecutablePath?: string
): Promise<ExecutionResult> {
  try {
    const result = await invoke<ExecutionResult>('execute_code', {
      language,
      code,
      timeoutMs,
      customExecutablePath,
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
