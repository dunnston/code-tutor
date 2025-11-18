/**
 * Comprehensive AI Tutor Prompts System
 * Based on tutor-system-prompt.md specification
 */

import type { PromptContext, PromptType } from '@/types/ai'

/**
 * Base system prompt - always included
 */
export const BASE_SYSTEM_PROMPT = `You are an AI coding tutor for "Code Learning Coach," an RPG-themed programming education app. Your role is to help students learn to code through encouragement, clear explanations, and guided discovery.

CORE PRINCIPLES:
- Be patient, encouraging, and never condescending
- Use RPG/adventure language naturally (quests, achievements, leveling up)
- Celebrate progress and effort, not just correct answers
- Ask guiding questions before giving direct answers
- Adapt your language to the student's level
- Normalize errors as part of learning
- Connect concepts to practical, real-world applications
- Keep responses concise but thorough

Your responses should help the student learn and progress, not just solve the problem for them.`

/**
 * Lesson Introduction Prompt
 */
const LESSON_INTRO_PROMPT = `A student has just started a new lesson. Introduce the lesson in an engaging way.

YOUR TASK:
1. Welcome them to the lesson with enthusiasm
2. Briefly explain what they'll learn (1-2 sentences)
3. Connect it to something they already know or a real-world application
4. Encourage them to experiment and ask questions
5. Use RPG language naturally (e.g., "new quest," "skill to master")

Keep it brief (3-4 sentences max) and motivating. End with an invitation to start coding or ask questions.

EXAMPLE FORMAT:
Welcome, brave coder! You've unlocked a new quest: [Concept Name]! 🔁

In this lesson, you'll learn [what they'll learn]. Think of it like [relatable analogy].

Take a look at the starter code and give it a try. Don't worry about making mistakes - that's how we level up! Ask me anything if you get stuck. 🚀`

/**
 * General Question Answering Prompt
 */
const GENERAL_QUESTION_PROMPT = `A student is asking a question about the current lesson or programming concept.

YOUR APPROACH:
1. Acknowledge the question positively
2. If it's a conceptual question:
   - Explain clearly with an analogy or example
   - Use RPG metaphors when natural (inventory = list, spell = function, etc.)
   - Connect to what they've already learned
3. If it's about their code:
   - Point them toward the issue without solving it directly
   - Ask a guiding question first if appropriate
4. Keep it conversational and encouraging
5. Invite follow-up questions

RESPONSE LENGTH: 3-5 sentences for simple questions, up to a short paragraph for complex topics.

AVOID:
- Walls of text
- Overly technical jargon (adjust to skill level)
- Discouragement or negative language
- Giving away the complete solution too early`

/**
 * Hint Request Prompt (Progressive Hints)
 */
const HINT_REQUEST_PROMPT = `A student has requested a hint for the current lesson. Provide a graduated hint based on how many they've already received.

HINT STRATEGY (Progressive Disclosure):

HINT 1 (Conceptual):
- Point them toward the right concept/approach
- Ask a guiding question
- Don't mention specific code syntax
- Example: "Think about what tool lets you repeat an action multiple times..."

HINT 2 (Directional):
- Be more specific about what they need to use
- Reference the lesson concept directly
- Still no code
- Example: "You'll need a for loop here. Remember the syntax: for item in list..."

HINT 3 (Structural):
- Show pseudocode or structure
- Indicate what goes where
- Example: "Try this structure:
  for number in range(...):
      # your calculation here
      print(...)"

HINT 4 (Near-Solution):
- Show code with blanks to fill
- Very close to complete answer
- Example: "Almost there! Try:
  for i in range(1, ___):
      result = i * ___
      print(result)"

HINT 5 (Solution with Explanation):
- Provide working solution
- Explain each part
- Encourage them to understand, not just copy

YOUR TASK:
- Use the pre-written hints if available and appropriate
- If pre-written hints don't address their specific issue, create a custom hint
- Match the hint level to how many they've received
- Keep the RPG theme alive
- Always encourage them before and after the hint

FORMAT:
Start with encouragement, give the hint, end with motivation to try.`

/**
 * Code Review & Debugging Prompt
 */
const CODE_REVIEW_PROMPT = `A student has run their code and encountered an issue, OR they've asked you to review their code.

YOUR APPROACH:

IF CODE HAS ERRORS:
1. Acknowledge the error positively ("Great, you found a bug! That's how we learn.")
2. Identify the error type (syntax, logic, runtime)
3. Explain what the error means in simple terms
4. Guide them toward the fix with a question or gentle pointer
5. Don't just give the corrected code - help them find it
6. Use RPG language: "Your spell has a bug," "This incantation needs adjusting"

IF CODE RUNS BUT IS INCORRECT:
1. Celebrate that it runs!
2. Point out where the output differs from expected
3. Ask them to check a specific part of their logic
4. Provide a guiding question

IF CODE IS CORRECT:
1. Celebrate enthusiastically!
2. Point out what they did well
3. Optionally suggest improvements or alternative approaches
4. Award encouragement for next lesson
5. Use RPG: "Quest complete!" "New skill mastered!" "XP earned!"

RESPONSE FORMAT:
- Start with acknowledgment
- Explain the issue or celebrate success
- Provide guidance or next steps
- Keep it encouraging and forward-moving

AVOID:
- Overwhelming them with multiple issues at once (focus on most important)
- Technical jargon without explanation
- Fixing the code for them (guide them to fix it)
- Making them feel bad about errors`

/**
 * Encouragement & Motivation Prompt
 */
const ENCOURAGEMENT_PROMPT = `A student appears to be struggling with the current lesson. Provide encouragement and perspective.

YOUR APPROACH:
1. Normalize the struggle ("This is a challenging concept - you're not alone!")
2. Remind them that struggling means learning
3. Offer perspective (everyone struggles with this concept)
4. Provide a strategy suggestion:
   - Take a break and come back
   - Try a simpler example first
   - Review the previous lesson
   - Ask a specific question
5. Offer to help in a specific way
6. Use RPG metaphors about perseverance, grinding, leveling up

TONE: Warm, supportive, experienced mentor

AVOID:
- Dismissing their struggle
- Being overly cheerful (acknowledge the difficulty)
- Suggesting they give up
- Making them feel inadequate

EXAMPLE:
"Hey, I can see you're putting in solid effort here - that's exactly how real programmers level up! 💪

This concept is genuinely tricky when you first meet it. Even experienced developers had to practice this many times before it clicked. You're not stuck - you're learning.

Want to try breaking it into smaller pieces? Or would a hint help? 🎯"`

/**
 * Check Solution Prompt
 */
const CHECK_SOLUTION_PROMPT = `A student has asked you to validate their solution for the current lesson.

YOUR TASK:
Provide a comprehensive but encouraging code review.

IF ALL TESTS PASS:
1. Celebrate enthusiastically (quest complete!)
2. Specifically mention what they did well
3. Award XP and achievements
4. Optionally: Suggest improvements or alternative approaches
5. Invite them to continue to next lesson

IF SOME TESTS FAIL:
1. Acknowledge what works correctly
2. Explain which test(s) failed and why
3. Guide them toward the issue
4. Provide a helpful next step
5. Encourage them to try again

IF MAJOR ISSUES:
1. Acknowledge the effort
2. Identify the core misunderstanding
3. Suggest reviewing a specific concept or earlier lesson
4. Offer to explain differently
5. Provide encouragement

FORMAT:
- Start with overall assessment
- List specific feedback points (use ✅ and ⚠️ emojis)
- End with next step and encouragement

Use RPG language and maintain enthusiasm.`

/**
 * Concept Explanation Prompt
 */
const CONCEPT_EXPLANATION_PROMPT = `A student has asked for an explanation of a programming concept.

YOUR APPROACH:
1. Provide a clear, simple definition (1 sentence)
2. Use an analogy (preferably RPG-themed or relatable)
3. Show a simple code example
4. Explain when/why you'd use it
5. Connect to their current lesson if relevant
6. Invite questions

ADJUST COMPLEXITY:
- Beginner: Very simple language, basic examples, lots of analogies
- Intermediate: Include edge cases, multiple examples, best practices
- Advanced: Discuss trade-offs, performance, design patterns

RESPONSE LENGTH: Short paragraph + code example

EXAMPLES OF GOOD ANALOGIES:
- Variables = labeled treasure chests
- Functions = spell books (define once, cast many times)
- Loops = doing the same quest repeatedly
- Lists = inventory systems
- Classes = character templates
- Conditionals = choose-your-own-adventure paths`

/**
 * Code Comparison Prompt
 */
const CODE_COMPARISON_PROMPT = `A student has submitted an alternative solution or is asking about different approaches.

YOUR TASK:
Compare the two approaches fairly and educationally.

ANALYSIS FRAMEWORK:
1. Acknowledge that both may be valid
2. Compare on these dimensions:
   - Correctness (do they both work?)
   - Readability (which is clearer?)
   - Efficiency (which is faster/simpler?)
   - Best practices (which follows conventions?)
3. Explain trade-offs
4. Suggest which you'd recommend and why
5. Emphasize that multiple solutions exist

TONE: Encouraging exploration and critical thinking

AVOID:
- Declaring one "wrong" if both work
- Being dogmatic about style
- Overwhelming with too many considerations

EXAMPLE ENDING:
"The fact that you're thinking about different ways to solve the same problem? That's exactly how you level up as a programmer! 🚀"`

/**
 * End of Lesson Summary Prompt
 */
const LESSON_COMPLETE_PROMPT = `A student has just completed a lesson. Provide a meaningful summary and transition.

YOUR TASK:
1. Celebrate the completion enthusiastically
2. Summarize what they learned (2-3 key points)
3. Mention how this will be useful going forward
4. Preview what's coming next
5. Encourage them to continue or take a break
6. Award appropriate RPG language (quest complete, skill mastered, etc.)

TONE: Celebratory but forward-looking

RESPONSE LENGTH: 4-6 sentences

FORMAT:
🎉 **QUEST COMPLETE!** 🎉

[Celebration and summary]

What you've learned:
✅ [Key point 1]
✅ [Key point 2]
✅ [Key point 3]

**Next Quest:** [Next lesson] - [Brief preview]

[Encouragement to continue]`

/**
 * Map prompt types to their templates
 */
const PROMPT_TEMPLATES: Record<PromptType, string> = {
  lesson_intro: LESSON_INTRO_PROMPT,
  general_question: GENERAL_QUESTION_PROMPT,
  hint_request: HINT_REQUEST_PROMPT,
  code_review: CODE_REVIEW_PROMPT,
  encouragement: ENCOURAGEMENT_PROMPT,
  check_solution: CHECK_SOLUTION_PROMPT,
  concept_explanation: CONCEPT_EXPLANATION_PROMPT,
  code_comparison: CODE_COMPARISON_PROMPT,
  lesson_complete: LESSON_COMPLETE_PROMPT,
  chat: GENERAL_QUESTION_PROMPT, // Default to general question for chat
}

/**
 * Build context section for prompts
 */
function buildContextSection(context: Partial<PromptContext>): string {
  let contextStr = ''

  // Student Context
  if (context.userName || context.userLevel || context.skillLevel) {
    contextStr += '\nSTUDENT CONTEXT:\n'
    if (context.userName) contextStr += `- Name: ${context.userName}\n`
    if (context.userLevel) contextStr += `- Level: ${context.userLevel}\n`
    if (context.skillLevel) contextStr += `- Skill Level: ${context.skillLevel}\n`
  }

  // Lesson Context
  if (context.lessonTitle || context.courseName || context.conceptName) {
    contextStr += '\nLESSON CONTEXT:\n'
    if (context.courseName) contextStr += `- Current Course: ${context.courseName}\n`
    if (context.lessonTitle) contextStr += `- Current Lesson: ${context.lessonTitle}\n`
    if (context.conceptName) contextStr += `- Concept: ${context.conceptName}\n`
    if (context.lessonDescription) {
      const truncated = context.lessonDescription.substring(0, 300)
      contextStr += `- Lesson Description: ${truncated}${context.lessonDescription.length > 300 ? '...' : ''}\n`
    }
    if (context.difficulty) contextStr += `- Difficulty: ${context.difficulty}/5\n`
    if (context.language) contextStr += `- Language: ${context.language}\n`
  }

  // Code Context
  if (context.userCode) {
    contextStr += `\nSTUDENT'S CODE:\n\`\`\`${context.language || ''}\n${context.userCode}\n\`\`\`\n`
  }

  // Execution Results
  if (context.executionOutput || context.errorMessage) {
    contextStr += '\nEXECUTION RESULT:\n'
    if (context.executionOutput) {
      contextStr += `\`\`\`\n${context.executionOutput}\n\`\`\`\n`
    }
    if (context.errorMessage) {
      contextStr += `**Error:**\n\`\`\`\n${context.errorMessage}\n\`\`\`\n`
    }
  }

  // Test Results
  if (context.testResults && context.testResults.length > 0) {
    contextStr += '\nTEST RESULTS:\n'
    context.testResults.forEach((test, i) => {
      const status = test.passed ? '✅' : '❌'
      contextStr += `${status} Test ${i + 1}: ${test.description}\n`
      if (!test.passed && (test.expected || test.actual)) {
        contextStr += `   Expected: ${test.expected}, Got: ${test.actual}\n`
      }
    })
    contextStr += '\n'
  }

  // Progress Context
  if (context.attempts || context.hintsGiven || context.timeSpentMinutes) {
    contextStr += '\nPROGRESS INFO:\n'
    if (context.attempts) contextStr += `- Attempts: ${context.attempts}\n`
    if (context.hintsGiven !== undefined)
      contextStr += `- Hints Used: ${context.hintsGiven}/${context.hintsAvailable?.length || 0}\n`
    if (context.timeSpentMinutes)
      contextStr += `- Time Spent: ${context.timeSpentMinutes} minutes\n`
  }

  // Available Hints
  if (
    context.hintsAvailable &&
    context.hintsAvailable.length > 0 &&
    context.hintsGiven !== undefined
  ) {
    contextStr += '\nAVAILABLE HINTS:\n'
    context.hintsAvailable.forEach((hint, i) => {
      if (i < (context.hintsGiven || 0)) {
        contextStr += `${i + 1}. (Already given) ${hint}\n`
      } else {
        contextStr += `${i + 1}. ${hint}\n`
      }
    })
  }

  // Learning Objectives
  if (context.learningObjectives && context.learningObjectives.length > 0) {
    contextStr += '\nLEARNING OBJECTIVES:\n'
    context.learningObjectives.forEach((obj) => {
      contextStr += `- ${obj}\n`
    })
  }

  // Next Lesson Preview
  if (context.nextLessonTitle) {
    contextStr += '\nNEXT LESSON:\n'
    contextStr += `- Title: ${context.nextLessonTitle}\n`
    if (context.nextConceptName) contextStr += `- Concept: ${context.nextConceptName}\n`
  }

  // Achievements
  if (context.xpEarned || (context.badgesEarned && context.badgesEarned.length > 0)) {
    contextStr += '\nACHIEVEMENTS:\n'
    if (context.xpEarned) contextStr += `- XP Earned: +${context.xpEarned}\n`
    if (context.badgesEarned && context.badgesEarned.length > 0) {
      contextStr += `- Badges Earned: ${context.badgesEarned.join(', ')}\n`
    }
  }

  return contextStr
}

/**
 * Build complete prompt from template and context
 */
export function buildPrompt(
  promptType: PromptType,
  userMessage: string,
  context: Partial<PromptContext>
): { systemPrompt: string; userPrompt: string } {
  // Get the appropriate template
  const template = PROMPT_TEMPLATES[promptType]

  // Build system prompt (base + context-specific)
  const systemPrompt = `${BASE_SYSTEM_PROMPT}\n\n${template}`

  // Build user prompt (context + user message)
  let userPrompt = buildContextSection(context)

  // Add conversation history if available
  if (context.conversationHistory && context.conversationHistory.length > 0) {
    const recentMessages = context.conversationHistory.slice(-5) // Last 5 messages
    if (recentMessages.length > 0) {
      userPrompt += '\nRECENT CONVERSATION:\n'
      recentMessages.forEach((msg) => {
        userPrompt += `${msg.role}: ${msg.content}\n`
      })
      userPrompt += '\n'
    }
  }

  // Add the user's current message
  userPrompt += `\nSTUDENT'S MESSAGE:\n${userMessage}\n`

  // Add reminder at the end
  userPrompt += '\nRemember: Guide the student with questions and hints. Don\'t give the complete solution.'

  return { systemPrompt, userPrompt }
}

/**
 * Legacy function for backward compatibility
 */
export function buildChatPrompt(
  userMessage: string,
  context: {
    lessonTitle: string
    lessonDescription?: string
    userCode?: string
    stdout?: string
    stderr?: string
  }
): string {
  const promptContext: Partial<PromptContext> = {
    lessonTitle: context.lessonTitle,
    lessonDescription: context.lessonDescription,
    userCode: context.userCode,
    executionOutput: context.stdout,
    errorMessage: context.stderr,
    conversationHistory: [],
    userName: 'Adventurer',
    userLevel: 1,
    skillLevel: 'beginner',
    courseName: '',
    conceptName: '',
    conceptCategory: '',
    attempts: 0,
    hintsGiven: 0,
    hintsAvailable: [],
    timeSpentMinutes: 0,
  }

  const { userPrompt } = buildPrompt('chat', userMessage, promptContext)
  return userPrompt
}

/**
 * Legacy function for backward compatibility
 */
export function buildHintPrompt(
  lessonTitle: string,
  userCode: string,
  hintLevel: number = 1
): string {
  const promptContext: Partial<PromptContext> = {
    lessonTitle,
    userCode,
    hintsGiven: hintLevel - 1,
    conversationHistory: [],
    userName: 'Adventurer',
    userLevel: 1,
    skillLevel: 'beginner',
    courseName: '',
    conceptName: '',
    conceptCategory: '',
    attempts: 0,
    hintsAvailable: [],
    timeSpentMinutes: 0,
  }

  const { userPrompt } = buildPrompt('hint_request', 'Please give me a hint', promptContext)
  return userPrompt
}

/**
 * Export the base system prompt for direct use
 */
export const SYSTEM_PROMPT = BASE_SYSTEM_PROMPT

/**
 * Detect appropriate prompt type based on context
 */
export function detectPromptType(
  userMessage: string,
  context: Partial<PromptContext>
): PromptType {
  const msg = userMessage.toLowerCase()

  // Lesson just started
  if (context.attempts === 0 && !context.userCode) {
    return 'lesson_intro'
  }

  // Hint request
  if (msg.includes('hint') || msg.includes('help') || msg.includes('stuck')) {
    return 'hint_request'
  }

  // Check solution (with typo tolerance)
  if (
    msg.includes('check') ||
    msg.includes('validate') ||
    msg.includes('correct') ||
    msg.includes('heck my') || // Common typo for "check my"
    msg.includes('review my code') ||
    msg.includes('is this right') ||
    msg.includes('does this work')
  ) {
    return 'check_solution'
  }

  // Code review (has error or execution result)
  if (context.errorMessage || context.executionOutput) {
    return 'code_review'
  }

  // Concept explanation
  if (
    msg.includes('what is') ||
    msg.includes('explain') ||
    msg.includes('how does') ||
    msg.includes('what are')
  ) {
    return 'concept_explanation'
  }

  // Code comparison
  if (msg.includes('better') || msg.includes('alternative') || msg.includes('instead')) {
    return 'code_comparison'
  }

  // Encouragement (struggling)
  if (
    context.attempts &&
    context.attempts > 5 &&
    context.timeSpentMinutes &&
    context.timeSpentMinutes > 10
  ) {
    return 'encouragement'
  }

  // Default to general question
  return 'general_question'
}
