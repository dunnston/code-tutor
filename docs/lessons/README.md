# Code Tutor Lessons

This directory contains lesson files for the Code Tutor application. Each lesson is a JSON file that defines the learning content, code challenges, validation criteria, and progression.

## Lesson File Format

### Naming Convention
`{language}-{number}-{slug}.json`

Examples:
- `python-01-scroll-of-print.json`
- `python-02-variables-of-power.json`
- `gdscript-01-godot-basics.json`

### JSON Schema

```json
{
  "id": 1,
  "trackId": 1,
  "language": "python",
  "title": "The Scroll of Print",
  "subtitle": "Your First Spell",
  "difficulty": 1,
  "estimatedTime": "5-10 minutes",
  "xpReward": 100,
  "description": "Markdown content with instructions...",
  "starterCode": "# Initial code shown in editor",
  "solutionCode": "# Hidden solution for reference",
  "hints": [
    "First hint (vague)",
    "Second hint (more specific)",
    "Third hint (very specific)"
  ],
  "validationTests": [
    {
      "type": "output_contains",
      "value": "expected text",
      "description": "Human-readable test description"
    }
  ],
  "learningObjectives": [
    "What students will learn"
  ],
  "previousLessonId": 0,
  "nextLessonId": 2,
  "tags": ["beginner", "print", "strings"]
}
```

## Validation Test Types

### Output-Based Tests
- `output_contains`: Check if output contains specific text
- `output_equals`: Exact output match (whitespace sensitive)
- `output_line_count`: Minimum/maximum line count
- `output_regex`: Regex pattern matching

### Code-Based Tests
- `variable_exists`: Check if a variable is defined
- `variable_type`: Check variable type (str, int, float, bool, list, dict)
- `variable_value`: Check variable equals specific value
- `function_exists`: Check if function is defined
- `function_returns`: Call function and verify return value
- `code_contains`: Check if code includes specific syntax (e.g., "if ", "for ")
- `code_structure`: Advanced checks (proper indentation, no syntax errors)

### Example Test Configurations

**Check output:**
```json
{
  "type": "output_contains",
  "value": "Hello, World!",
  "description": "Should print Hello, World!"
}
```

**Check variable:**
```json
{
  "type": "variable_value",
  "variable": "health",
  "expectedValue": 100,
  "description": "health should be 100"
}
```

**Check function:**
```json
{
  "type": "function_returns",
  "function": "add_numbers",
  "args": [5, 10],
  "expectedReturn": 15,
  "description": "add_numbers(5, 10) should return 15"
}
```

## Difficulty Levels

- **1-3:** Beginner (basic syntax, simple concepts)
- **4-6:** Intermediate (data structures, OOP, file I/O)
- **7-9:** Advanced (APIs, testing, design patterns)
- **10:** Professional (full projects, portfolio pieces)

## XP Rewards

- Beginner lessons: 100-200 XP
- Intermediate lessons: 200-400 XP
- Advanced lessons: 400-700 XP
- Professional projects: 700-1500 XP
- Bonus challenges: +50-100 XP

## Writing New Lessons

### Guidelines

1. **Start with a story/theme** - Make it engaging (Fantasy Quest, Space Adventure, etc.)
2. **Explain the concept** - Use analogies and simple language
3. **Show examples** - Demonstrate before asking students to try
4. **Progressive difficulty** - Start simple, add complexity gradually
5. **Clear objectives** - Tell students what they'll learn
6. **Multiple hints** - Vague → specific progression
7. **Meaningful validation** - Test understanding, not just syntax

### Template

```json
{
  "id": 99,
  "trackId": 1,
  "language": "python",
  "title": "Lesson Title",
  "subtitle": "Short Description",
  "difficulty": 1,
  "estimatedTime": "10-15 minutes",
  "xpReward": 150,
  "description": "# Markdown Title\\n\\nExplanation...\\n\\n## Concept\\n\\nExample code...\\n\\n## Your Quest\\n\\nInstructions...",
  "starterCode": "# Starter code here\\n",
  "solutionCode": "# Solution code here\\n",
  "hints": [
    "Hint 1",
    "Hint 2",
    "Hint 3"
  ],
  "validationTests": [
    {
      "type": "output_contains",
      "value": "expected",
      "description": "Test description"
    }
  ],
  "learningObjectives": [
    "Objective 1",
    "Objective 2"
  ],
  "previousLessonId": 98,
  "nextLessonId": 100,
  "tags": ["beginner", "topic"]
}
```

## Current Lesson Tracks

### Python Fundamentals (Track 1)
- ✅ Lesson 1: The Scroll of Print (print statements)
- ✅ Lesson 2: Variables of Power (variables, data types)
- ✅ Lesson 3: The Conditional Path (if/else statements)
- ✅ Lesson 4: The Loop of Destiny (for loops, range, lists)
- ✅ Lesson 5: The Function Forge (functions, parameters, return)
- 🚧 Lessons 6-15: To be created

### Future Tracks
- JavaScript/React (Track 2)
- GDScript (Track 3)
- C# (Track 4)
- Ruby (Track 5)

## Testing Lessons

Before adding a lesson to production:

1. **Load the JSON** - Ensure it parses correctly
2. **Test validation** - Verify all tests pass with solution code
3. **Test hints** - Make sure hints are helpful without spoiling
4. **Check difficulty** - Is it appropriate for the skill level?
5. **Proofread** - Fix typos, ensure markdown renders correctly
6. **Estimate time** - Test how long it takes to complete

## Contributing

When creating lessons:
- Use consistent formatting
- Follow the Fantasy Quest theme for beginner Python lessons
- Make lessons self-contained (don't assume external knowledge)
- Add common mistakes section when helpful
- Include bonus challenges for advanced students

---

**Need help?** Check existing lessons for examples or consult the PRD for curriculum guidelines.
