import type { ValidationTest } from '@types/lesson'
import type { ExecutionResult } from '@types/execution'

export interface ValidationResult {
  passed: boolean
  test: ValidationTest
  message: string
}

/**
 * Validate user code against lesson test criteria
 */
export async function validateCode(
  code: string,
  tests: ValidationTest[],
  executionResult?: ExecutionResult
): Promise<ValidationResult[]> {
  const results: ValidationResult[] = []

  for (const test of tests) {
    const result = await runValidationTest(code, test, executionResult)
    results.push(result)
  }

  return results
}

/**
 * Run a single validation test
 */
async function runValidationTest(
  code: string,
  test: ValidationTest,
  executionResult?: ExecutionResult
): Promise<ValidationResult> {
  switch (test.type) {
    case 'output_contains':
      return validateOutputContains(test, executionResult)

    case 'output_equals':
      return validateOutputEquals(test, executionResult)

    case 'output_line_count':
      return validateOutputLineCount(test, executionResult)

    case 'output_regex':
      return validateOutputRegex(test, executionResult)

    case 'code_contains':
      return validateCodeContains(code, test)

    case 'variable_exists':
    case 'variable_type':
    case 'variable_value':
    case 'function_exists':
    case 'function_returns':
    case 'code_structure':
      return {
        passed: false,
        test,
        message: `Validation type '${test.type}' not yet implemented`,
      }

    default:
      return {
        passed: false,
        test,
        message: `Unknown validation type: ${test.type}`,
      }
  }
}

/**
 * Check if output contains expected text
 */
function validateOutputContains(
  test: ValidationTest,
  executionResult?: ExecutionResult
): ValidationResult {
  if (!executionResult) {
    return {
      passed: false,
      test,
      message: 'No execution result available',
    }
  }

  const output = executionResult.stdout
  const expectedValue = String(test.value || '')

  if (output.includes(expectedValue)) {
    return {
      passed: true,
      test,
      message: `✓ ${test.description}`,
    }
  }

  return {
    passed: false,
    test,
    message: `✗ ${test.description} - Expected output to contain: "${expectedValue}"`,
  }
}

/**
 * Check if output exactly equals expected text
 */
function validateOutputEquals(
  test: ValidationTest,
  executionResult?: ExecutionResult
): ValidationResult {
  if (!executionResult) {
    return {
      passed: false,
      test,
      message: 'No execution result available',
    }
  }

  const output = executionResult.stdout.trim()
  const expectedValue = String(test.value || '').trim()

  if (output === expectedValue) {
    return {
      passed: true,
      test,
      message: `✓ ${test.description}`,
    }
  }

  return {
    passed: false,
    test,
    message: `✗ ${test.description} - Expected: "${expectedValue}", got: "${output}"`,
  }
}

/**
 * Check if output has minimum/maximum line count
 */
function validateOutputLineCount(
  test: ValidationTest,
  executionResult?: ExecutionResult
): ValidationResult {
  if (!executionResult) {
    return {
      passed: false,
      test,
      message: 'No execution result available',
    }
  }

  const lines = executionResult.stdout.trim().split('\n').filter(line => line.length > 0)
  const lineCount = lines.length

  if (test.min !== undefined && lineCount < test.min) {
    return {
      passed: false,
      test,
      message: `✗ ${test.description} - Expected at least ${test.min} lines, got ${lineCount}`,
    }
  }

  if (test.max !== undefined && lineCount > test.max) {
    return {
      passed: false,
      test,
      message: `✗ ${test.description} - Expected at most ${test.max} lines, got ${lineCount}`,
    }
  }

  return {
    passed: true,
    test,
    message: `✓ ${test.description}`,
  }
}

/**
 * Check if output matches regex pattern
 */
function validateOutputRegex(
  test: ValidationTest,
  executionResult?: ExecutionResult
): ValidationResult {
  if (!executionResult) {
    return {
      passed: false,
      test,
      message: 'No execution result available',
    }
  }

  const output = executionResult.stdout
  const pattern = new RegExp(String(test.value || ''))

  if (pattern.test(output)) {
    return {
      passed: true,
      test,
      message: `✓ ${test.description}`,
    }
  }

  return {
    passed: false,
    test,
    message: `✗ ${test.description} - Output did not match pattern: ${test.value}`,
  }
}

/**
 * Check if code contains specific string
 */
function validateCodeContains(
  code: string,
  test: ValidationTest
): ValidationResult {
  const expectedValue = String(test.value || '')

  if (code.includes(expectedValue)) {
    return {
      passed: true,
      test,
      message: `✓ ${test.description}`,
    }
  }

  return {
    passed: false,
    test,
    message: `✗ ${test.description} - Code should contain: "${expectedValue}"`,
  }
}

/**
 * Get summary of validation results
 */
export function getValidationSummary(results: ValidationResult[]): {
  total: number
  passed: number
  failed: number
  allPassed: boolean
} {
  const total = results.length
  const passed = results.filter((r) => r.passed).length
  const failed = total - passed

  return {
    total,
    passed,
    failed,
    allPassed: failed === 0,
  }
}
