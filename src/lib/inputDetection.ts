/**
 * Detect if code requires user input and extract prompts
 */

export interface InputPrompt {
  prompt: string
  index: number
}

/**
 * Detect input() calls in Python code
 */
function detectPythonInput(code: string): InputPrompt[] {
  const prompts: InputPrompt[] = []

  // Match input() calls with optional prompts
  // Handles: input(), input("prompt"), input('prompt')
  const inputRegex = /input\s*\(\s*(?:["']([^"']*)["'])?\s*\)/g

  let match
  let index = 0
  const inputCalls: { prompt: string; inLoop: boolean }[] = []

  // Detect if input is inside a loop
  const loopRegex = /(while\s+.*:|for\s+.*:)/
  const hasLoop = loopRegex.test(code)

  while ((match = inputRegex.exec(code)) !== null) {
    const prompt = match[1] || `Input ${index + 1}:`

    // Check if this input() is inside a loop by checking indentation
    // Find the start of the line containing this input()
    const codeBeforeInput = code.substring(0, match.index)
    const lastNewline = codeBeforeInput.lastIndexOf('\n')
    const lineStart = lastNewline === -1 ? 0 : lastNewline + 1
    const fullLine = code.substring(lineStart).split('\n')[0]
    const isIndented = /^\s{4,}/.test(fullLine) // 4+ spaces = inside block

    inputCalls.push({
      prompt,
      inLoop: hasLoop && isIndented,
    })
    index++
  }

  // If we have input in a loop, pre-generate multiple prompts
  for (const call of inputCalls) {
    if (call.inLoop) {
      // Generate up to 10 prompts for looped input
      for (let i = 0; i < 10; i++) {
        prompts.push({
          prompt: `${call.prompt} (${i + 1}/10)`,
          index: prompts.length,
        })
      }
    } else {
      prompts.push({
        prompt: call.prompt,
        index: prompts.length,
      })
    }
  }

  return prompts
}

/**
 * Detect input requirements in JavaScript code
 */
function detectJavaScriptInput(code: string): InputPrompt[] {
  const prompts: InputPrompt[] = []

  // Match prompt-sync or readline usage
  // This is a simplified detection - may need enhancement
  if (code.includes('prompt(') || code.includes('readline(')) {
    // For now, just indicate that input is needed
    prompts.push({
      prompt: 'Input required:',
      index: 0,
    })
  }

  return prompts
}

/**
 * Detect input requirements in C# code
 */
function detectCSharpInput(code: string): InputPrompt[] {
  const prompts: InputPrompt[] = []

  // Match Console.ReadLine() calls
  const readLineRegex = /Console\.ReadLine\s*\(\s*\)/g

  let index = 0
  while (readLineRegex.exec(code) !== null) {
    prompts.push({
      prompt: `Input ${index + 1}:`,
      index,
    })
    index++
  }

  return prompts
}

/**
 * Detect input requirements in Ruby code
 */
function detectRubyInput(code: string): InputPrompt[] {
  const prompts: InputPrompt[] = []

  // Match gets or gets.chomp calls
  const getsRegex = /gets(?:\.chomp)?/g

  let index = 0
  while (getsRegex.exec(code) !== null) {
    prompts.push({
      prompt: `Input ${index + 1}:`,
      index,
    })
    index++
  }

  return prompts
}

/**
 * Main function to detect input requirements based on language
 */
export function detectInputRequirements(
  code: string,
  language: string
): InputPrompt[] {
  switch (language.toLowerCase()) {
    case 'python':
      return detectPythonInput(code)
    case 'javascript':
      return detectJavaScriptInput(code)
    case 'csharp':
      return detectCSharpInput(code)
    case 'ruby':
      return detectRubyInput(code)
    default:
      return []
  }
}

/**
 * Check if code needs input
 */
export function needsInput(code: string, language: string): boolean {
  return detectInputRequirements(code, language).length > 0
}
