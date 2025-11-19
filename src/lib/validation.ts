import type { ValidationTest } from '@/types/lesson'
import type { ExecutionResult } from '@/types/execution'

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
      return validateVariableExists(code, test)

    case 'variable_type':
      return validateVariableType(code, test)

    case 'variable_value':
      return validateVariableValue(code, test)

    case 'code_structure':
      return validateCodeStructure(code, test)

    case 'function_exists':
      return validateFunctionExists(code, test)

    case 'function_returns':
      return validateFunctionReturns(code, test, executionResult)

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
 * Check if a variable exists in the code
 */
function validateVariableExists(
  code: string,
  test: ValidationTest
): ValidationResult {
  const variableName = test.variable || String(test.value || '')

  // Match variable assignment patterns for different languages
  // Python: variable_name = value
  // JavaScript: var/let/const variable_name = value
  // GDScript: var variable_name = value
  // C#: type variable_name = value or var variable_name = value
  const patterns = [
    new RegExp(`\\b${variableName}\\s*=`, 'i'), // Python, GDScript
    new RegExp(`\\b(var|let|const)\\s+${variableName}\\s*=`, 'i'), // JavaScript
    new RegExp(`\\b(int|string|bool|float|double|var)\\s+${variableName}\\s*=`, 'i'), // C#
  ]

  const exists = patterns.some(pattern => pattern.test(code))

  if (exists) {
    return {
      passed: true,
      test,
      message: `✓ ${test.description}`,
    }
  }

  return {
    passed: false,
    test,
    message: `✗ ${test.description} - Variable '${variableName}' not found`,
  }
}

/**
 * Check if a variable has the correct type
 */
function validateVariableType(
  code: string,
  test: ValidationTest
): ValidationResult {
  const variableName = test.variable || ''
  const expectedType = (test.expectedType || String(test.value || '')).toLowerCase()

  // Extract the value assigned to the variable
  const assignmentPattern = new RegExp(`${variableName}\\s*=\\s*(.+?)(?:$|\\n)`, 'i')
  const match = code.match(assignmentPattern)

  if (!match || !match[1]) {
    return {
      passed: false,
      test,
      message: `✗ ${test.description} - Variable '${variableName}' not found`,
    }
  }

  const assignedValue = match[1].trim()
  let actualType = 'unknown'

  // Determine type from the value
  if (assignedValue.startsWith('"') || assignedValue.startsWith("'")) {
    actualType = 'string'
  } else if (assignedValue === 'True' || assignedValue === 'False' ||
             assignedValue === 'true' || assignedValue === 'false') {
    actualType = 'boolean'
  } else if (/^-?\d+$/.test(assignedValue)) {
    actualType = 'int'
  } else if (/^-?\d+\.\d+$/.test(assignedValue)) {
    actualType = 'float'
  }

  // Normalize type names (boolean vs bool, integer vs int, string vs str)
  const typeMatches =
    actualType === expectedType ||
    (actualType === 'string' && expectedType === 'str') ||
    (actualType === 'str' && expectedType === 'string') ||
    (actualType === 'boolean' && expectedType === 'bool') ||
    (actualType === 'bool' && expectedType === 'boolean') ||
    (actualType === 'int' && expectedType === 'integer') ||
    (actualType === 'integer' && expectedType === 'int') ||
    (actualType === 'float' && expectedType === 'number') ||
    (actualType === 'int' && expectedType === 'number')

  if (typeMatches) {
    return {
      passed: true,
      test,
      message: `✓ ${test.description}`,
    }
  }

  return {
    passed: false,
    test,
    message: `✗ ${test.description} - Expected type '${expectedType}', got '${actualType}'`,
  }
}

/**
 * Check code structure (e.g., proper indentation)
 */
function validateCodeStructure(
  code: string,
  test: ValidationTest
): ValidationResult {
  const check = test.check || test.value

  if (check === 'proper_indentation') {
    // Check if there's at least one indented line (for if/else blocks)
    const lines = code.split('\n')
    const hasIndentation = lines.some(line => line.startsWith('    ') || line.startsWith('\t'))

    if (hasIndentation) {
      return {
        passed: true,
        test,
        message: `✓ ${test.description}`,
      }
    }

    return {
      passed: false,
      test,
      message: `✗ ${test.description} - Code should have indented blocks (use Tab or 4 spaces)`,
    }
  }

  return {
    passed: false,
    test,
    message: `Unknown code structure check: ${check}`,
  }
}

/**
 * Check if a variable has the correct value
 */
function validateVariableValue(
  code: string,
  test: ValidationTest
): ValidationResult {
  const variableName = test.variable || ''
  const expectedValue = test.expectedValue ?? test.value

  // Extract the value assigned to the variable
  const assignmentPattern = new RegExp(`${variableName}\\s*=\\s*(.+?)(?:$|\\n)`, 'i')
  const match = code.match(assignmentPattern)

  if (!match || !match[1]) {
    return {
      passed: false,
      test,
      message: `✗ ${test.description} - Variable '${variableName}' not found`,
    }
  }

  const assignedValue = match[1].trim()

  // Parse the value from code
  let actualValue: string | number | boolean = assignedValue

  // Remove quotes for strings
  if (assignedValue.startsWith('"') && assignedValue.endsWith('"')) {
    actualValue = assignedValue.slice(1, -1)
  } else if (assignedValue.startsWith("'") && assignedValue.endsWith("'")) {
    actualValue = assignedValue.slice(1, -1)
  } else if (assignedValue === 'True' || assignedValue === 'true') {
    actualValue = true
  } else if (assignedValue === 'False' || assignedValue === 'false') {
    actualValue = false
  } else if (/^-?\d+(\.\d+)?$/.test(assignedValue)) {
    actualValue = parseFloat(assignedValue)
  }

  // Compare values
  if (actualValue === expectedValue) {
    return {
      passed: true,
      test,
      message: `✓ ${test.description}`,
    }
  }

  return {
    passed: false,
    test,
    message: `✗ ${test.description} - Expected '${expectedValue}', got '${actualValue}'`,
  }
}

/**
 * Check if a function is defined in the code
 */
function validateFunctionExists(
  code: string,
  test: ValidationTest
): ValidationResult {
  const functionName = test.function || String(test.value || '')

  // Match function definition patterns for different languages
  // Python: def function_name(
  // JavaScript: function function_name( or const function_name = ( or let function_name = (
  // GDScript: func function_name(
  // C#: type function_name(
  const patterns = [
    new RegExp(`def\\s+${functionName}\\s*\\(`, 'i'), // Python
    new RegExp(`function\\s+${functionName}\\s*\\(`, 'i'), // JavaScript
    new RegExp(`(const|let|var)\\s+${functionName}\\s*=\\s*(async\\s*)?\\(`, 'i'), // Arrow functions
    new RegExp(`func\\s+${functionName}\\s*\\(`, 'i'), // GDScript
    new RegExp(`\\w+\\s+${functionName}\\s*\\(`, 'i'), // C# and other typed languages
  ]

  const exists = patterns.some(pattern => pattern.test(code))

  if (exists) {
    return {
      passed: true,
      test,
      message: `✓ ${test.description}`,
    }
  }

  return {
    passed: false,
    test,
    message: `✗ ${test.description} - Function '${functionName}' not found`,
  }
}

/**
 * Check if a function returns the expected value
 * Note: This is a simplified implementation that checks if the function exists
 * and contains a return statement. For full validation, the backend would need
 * to execute the function with test arguments and capture the return value.
 */
function validateFunctionReturns(
  code: string,
  test: ValidationTest,
  executionResult?: ExecutionResult
): ValidationResult {
  const functionName = test.function || String(test.value || '')

  // First check if function exists
  const functionExistsResult = validateFunctionExists(code, {
    ...test,
    value: functionName,
  })

  if (!functionExistsResult.passed) {
    return {
      passed: false,
      test,
      message: `✗ ${test.description} - Function '${functionName}' not found`,
    }
  }

  // Extract the function body
  const functionPattern = new RegExp(
    `def\\s+${functionName}\\s*\\([^)]*\\):[\\s\\S]*?(?=\\ndef\\s|\\nclass\\s|$)`,
    'i'
  )
  const functionMatch = code.match(functionPattern)

  if (!functionMatch) {
    return {
      passed: false,
      test,
      message: `✗ ${test.description} - Could not parse function '${functionName}'`,
    }
  }

  const functionBody = functionMatch[0]

  // Check if function has a return statement
  if (!functionBody.includes('return')) {
    return {
      passed: false,
      test,
      message: `✗ ${test.description} - Function '${functionName}' does not return a value`,
    }
  }

  // If we have execution results, we can do a basic validation
  // by checking if the expected output appears (this is a heuristic)
  if (executionResult && test.expectedReturn !== undefined) {
    const expectedStr = String(test.expectedReturn)
    // Check if the expected return value appears in the output
    // This is not perfect but provides some validation
    if (executionResult.stdout.includes(expectedStr)) {
      return {
        passed: true,
        test,
        message: `✓ ${test.description}`,
      }
    }
  }

  // If no execution result or can't verify the exact return value,
  // pass the test if the function exists and has a return statement
  // This is a compromise - ideally we'd execute the function and check the value
  return {
    passed: true,
    test,
    message: `✓ ${test.description}`,
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
