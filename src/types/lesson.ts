// Lesson system types
export interface Lesson {
  id: number
  trackId: number
  language: 'python' | 'javascript' | 'gdscript' | 'csharp' | 'ruby'
  title: string
  subtitle?: string
  difficulty: number
  estimatedTime: string
  xpReward: number
  description: string // Markdown content
  starterCode: string
  solutionCode: string
  hints: string[]
  validationTests: ValidationTest[]
  learningObjectives: string[]
  previousLessonId?: number
  nextLessonId?: number
  tags: string[]
  bonus?: {
    description: string
    xpReward: number
  }
  commonMistakes?: {
    mistake: string
    explanation: string
  }[]
}

export interface ValidationTest {
  type:
    | 'output_contains'
    | 'output_equals'
    | 'output_line_count'
    | 'output_regex'
    | 'variable_exists'
    | 'variable_type'
    | 'variable_value'
    | 'function_exists'
    | 'function_returns'
    | 'code_contains'
    | 'code_structure'
  value?: string | number | boolean
  variable?: string
  function?: string
  args?: unknown[]
  expectedReturn?: unknown
  expectedType?: string
  min?: number
  max?: number
  check?: string
  description: string
}

export interface Track {
  id: number
  name: string
  description: string
  language: string
  orderIndex: number
  lessons: Lesson[]
}
