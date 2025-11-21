/**
 * Puzzle test validation utilities
 * Runs test cases against user code and validates output
 */

import { executeCode } from '@/lib/tauri'
import { getRuntimePath } from '@/lib/runtimePaths'
import type {
  TestCase,
  TestResult,
  ValidationResult,
  PuzzleImplementation,
  SupportedLanguage,
} from '@/types/puzzle'

/**
 * Validate user solution against test cases
 */
export async function validatePuzzleSolution(
  userCode: string,
  language: SupportedLanguage,
  implementation: PuzzleImplementation,
  includeHidden: boolean = false
): Promise<ValidationResult> {
  const testResults: TestResult[] = []

  // Combine visible and hidden tests
  const testsToRun: TestCase[] = [...implementation.testCases]
  if (includeHidden && implementation.hiddenTests) {
    testsToRun.push(...implementation.hiddenTests)
  }

  // Run each test case
  for (const testCase of testsToRun) {
    const result = await runTestCase(userCode, language, testCase)
    testResults.push(result)
  }

  const passedCount = testResults.filter(r => r.passed).length
  const allPassed = passedCount === testResults.length

  return {
    allPassed,
    passedCount,
    totalCount: testResults.length,
    testResults,
  }
}

/**
 * Run a single test case
 */
async function runTestCase(
  userCode: string,
  language: SupportedLanguage,
  testCase: TestCase
): Promise<TestResult> {
  try {
    const startTime = Date.now()

    // Build test code that calls the user's function
    const testCode = buildTestCode(userCode, language, testCase)

    // Get custom runtime path if configured
    const customPath = getRuntimePath(language)

    // Execute the test
    const executionResult = await executeCode(language, testCode, undefined, customPath)
    const executionTime = Date.now() - startTime

    if (executionResult.exitCode !== 0) {
      return {
        passed: false,
        testCase,
        error: executionResult.stderr || executionResult.stdout,
        executionTime,
      }
    }

    // Parse the output and compare with expected
    const actualOutput = parseOutput(executionResult.stdout, language)
    const passed = compareOutputs(actualOutput, testCase.expectedOutput)

    return {
      passed,
      testCase,
      actualOutput,
      executionTime,
    }
  } catch (error) {
    return {
      passed: false,
      testCase,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Build test code that calls user function with test inputs
 */
function buildTestCode(
  userCode: string,
  language: SupportedLanguage,
  testCase: TestCase
): string {
  const input = testCase.input

  switch (language) {
    case 'python':
      return buildPythonTestCode(userCode, input)
    case 'javascript':
      return buildJavaScriptTestCode(userCode, input)
    case 'csharp':
      return buildCSharpTestCode(userCode, input)
    default:
      throw new Error(`Test generation for ${language} not yet implemented`)
  }
}

/**
 * Build Python test code
 */
function buildPythonTestCode(userCode: string, input: Record<string, unknown>): string {
  // Find the function name from user code
  const functionMatch = userCode.match(/def\s+(\w+)\s*\(/)
  if (!functionMatch) {
    throw new Error('No function definition found in user code')
  }
  const functionName = functionMatch[1]

  // Build function call with arguments
  const args = Object.values(input)
    .map(arg => JSON.stringify(arg))
    .join(', ')

  return `${userCode}

# Test execution
import json
result = ${functionName}(${args})
print(json.dumps(result))
`
}

/**
 * Build JavaScript test code
 */
function buildJavaScriptTestCode(userCode: string, input: Record<string, unknown>): string {
  const functionMatch = userCode.match(/function\s+(\w+)\s*\(/)
  if (!functionMatch) {
    throw new Error('No function definition found in user code')
  }
  const functionName = functionMatch[1]

  const args = Object.values(input)
    .map(arg => JSON.stringify(arg))
    .join(', ')

  return `${userCode}

// Test execution
const result = ${functionName}(${args});
console.log(JSON.stringify(result));
`
}

/**
 * Build C# test code
 */
function buildCSharpTestCode(userCode: string, input: Record<string, unknown>): string {
  // For C#, we need to find the method and class
  const methodMatch = userCode.match(/(?:public\s+)?(?:static\s+)?\w+\s+(\w+)\s*\(/)
  if (!methodMatch) {
    throw new Error('No method definition found in user code')
  }
  const methodName = methodMatch[1]

  const args = Object.values(input)
    .map(arg => {
      if (Array.isArray(arg)) {
        return `new[] { ${arg.join(', ')} }`
      }
      if (typeof arg === 'string') {
        return `"${arg}"`
      }
      return String(arg)
    })
    .join(', ')

  return `${userCode}

// Test execution
using System;
using System.Text.Json;

var result = Solution.${methodName}(${args});
Console.WriteLine(JsonSerializer.Serialize(result));
`
}

/**
 * Parse execution output to extract result
 */
function parseOutput(output: string, language: SupportedLanguage): any {
  try {
    // Get the last line of output (should be the JSON result)
    const lines = output.trim().split('\n')
    const lastLine = lines[lines.length - 1]

    return JSON.parse(lastLine)
  } catch (error) {
    // If parsing fails, return raw output
    return output.trim()
  }
}

/**
 * Compare actual output with expected output
 */
function compareOutputs(actual: any, expected: any): boolean {
  // Deep equality check
  return JSON.stringify(actual) === JSON.stringify(expected)
}

/**
 * Format test results for display
 */
export function formatTestResults(results: ValidationResult): string {
  const lines: string[] = []

  lines.push(`Test Results: ${results.passedCount}/${results.totalCount} passed\n`)

  results.testResults.forEach((result, index) => {
    const status = result.passed ? '✓ PASS' : '✗ FAIL'
    const description = result.testCase.description || `Test ${index + 1}`

    lines.push(`${status}: ${description}`)

    if (!result.passed) {
      lines.push(`  Input: ${JSON.stringify(result.testCase.input)}`)
      lines.push(`  Expected: ${JSON.stringify(result.testCase.expectedOutput)}`)

      if (result.error) {
        lines.push(`  Error: ${result.error}`)
      } else {
        lines.push(`  Actual: ${JSON.stringify(result.actualOutput)}`)
      }
    }

    if (result.executionTime) {
      lines.push(`  Time: ${result.executionTime}ms`)
    }

    lines.push('')
  })

  return lines.join('\n')
}
