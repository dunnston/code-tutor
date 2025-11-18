import { invoke } from '@tauri-apps/api/core'
import type { ExecutionResult } from '@types/execution'

/**
 * Execute Python code via Tauri backend
 * @param code - Python code to execute
 * @param timeoutMs - Timeout in milliseconds (default: 5000ms)
 */
export async function executePythonCode(
  code: string,
  timeoutMs?: number
): Promise<ExecutionResult> {
  try {
    const result = await invoke<ExecutionResult>('execute_python', {
      code,
      timeoutMs,
    })
    return result
  } catch (error) {
    throw new Error(`${error}`)
  }
}
