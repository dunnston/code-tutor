// Code execution types
export interface ExecutionResult {
  stdout: string
  stderr: string
  exitCode: number
  executionTimeMs: number
}

export interface ConsoleMessage {
  id: string
  type: 'stdout' | 'stderr' | 'system' | 'error' | 'success'
  content: string
  timestamp: Date
}

export type ExecutionStatus = 'idle' | 'running' | 'success' | 'error'
