import { invoke } from '@tauri-apps/api/core'
import type { ExecutionResult } from '@types/execution'

/**
 * Execute Python code via Tauri backend
 */
export async function executePythonCode(code: string): Promise<ExecutionResult> {
  try {
    const result = await invoke<ExecutionResult>('execute_python', { code })
    return result
  } catch (error) {
    throw new Error(`Failed to execute code: ${error}`)
  }
}
