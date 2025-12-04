/**
 * Parser for multiple-choice questions from markdown format
 * Converts docs/multiple-choice.md into structured question data
 */

import { McqQuestion, QuestionDifficulty, ProgrammingLanguage } from '../types/mcqQuestions';

interface ParsedQuestion {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  difficulty: QuestionDifficulty;
  sectionNumber: number; // Position in the section (1-100)
}

export function parseMultipleChoiceMarkdown(markdownContent: string): McqQuestion[] {
  const questions: McqQuestion[] = [];

  // Split by difficulty sections
  const beginnerMatch = markdownContent.match(/## BEGINNER QUESTIONS[\s\S]*?(?=## INTERMEDIATE QUESTIONS|$)/);
  const intermediateMatch = markdownContent.match(/## INTERMEDIATE QUESTIONS[\s\S]*?(?=## ADVANCED QUESTIONS|$)/);
  const advancedMatch = markdownContent.match(/## ADVANCED QUESTIONS[\s\S]*?$/);

  if (beginnerMatch) {
    const beginnerQuestions = parseSection(beginnerMatch[0], QuestionDifficulty.EASY);
    questions.push(...beginnerQuestions);
  }

  if (intermediateMatch) {
    const intermediateQuestions = parseSection(intermediateMatch[0], QuestionDifficulty.MEDIUM);
    questions.push(...intermediateQuestions);
  }

  if (advancedMatch) {
    const advancedQuestions = parseSection(advancedMatch[0], QuestionDifficulty.HARD);
    questions.push(...advancedQuestions);
  }

  return questions;
}

function parseSection(sectionContent: string, difficulty: QuestionDifficulty): McqQuestion[] {
  const questions: McqQuestion[] = [];

  // Match individual questions - pattern: number. Question text\n   a) option\n   b) option\n   c) option\n   d) option\n   **Answer: X**
  const questionPattern = /(\d+)\.\s+(.+?)\n\s+a\)\s+(.+?)\n\s+b\)\s+(.+?)\n\s+c\)\s+(.+?)\n\s+d\)\s+(.+?)\n\s+\*\*Answer:\s+([a-d])\*\*/gi;

  let match;
  while ((match = questionPattern.exec(sectionContent)) !== null) {
    const [, numberStr, questionText, optionA, optionB, optionC, optionD, answer] = match;
    const number = parseInt(numberStr, 10);

    // Convert answer letter to index (a=0, b=1, c=2, d=3)
    const answerLower = answer.toLowerCase();
    const correctAnswerIndex = answerLower.charCodeAt(0) - 'a'.charCodeAt(0);

    // Generate unique ID
    const difficultyPrefix = difficulty === QuestionDifficulty.EASY ? 'beg'
                           : difficulty === QuestionDifficulty.MEDIUM ? 'int'
                           : 'adv';
    const id = `python-${difficultyPrefix}-${String(number).padStart(3, '0')}`;

    // Infer topic from question content
    const topic = inferTopic(questionText);

    const question: McqQuestion = {
      id,
      questionText: questionText.trim(),
      explanation: undefined,
      options: [
        optionA.trim(),
        optionB.trim(),
        optionC.trim(),
        optionD.trim(),
      ],
      correctAnswerIndex,
      difficulty,
      topic,
      language: ProgrammingLanguage.PYTHON,
      tags: [topic, 'imported', 'bulk-import'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    questions.push(question);
  }

  return questions;
}

/**
 * Infer topic from question text using keyword matching
 */
function inferTopic(questionText: string): string {
  const text = questionText.toLowerCase();

  // Variable-related
  if (text.includes('variable') || text.includes('assignment')) return 'variables';

  // Data types
  if (text.includes('data type') || text.includes('int') || text.includes('float') || text.includes('bool')) return 'data-types';
  if (text.includes('string') || text.includes('concatenate')) return 'strings';
  if (text.includes('list') || text.includes('array')) return 'lists';
  if (text.includes('dictionary') || text.includes('dict')) return 'dictionaries';
  if (text.includes('tuple')) return 'tuples';
  if (text.includes('set')) return 'sets';

  // Control flow
  if (text.includes('if') || text.includes('else') || text.includes('elif') || text.includes('conditional')) return 'conditionals';
  if (text.includes('loop') || text.includes('for') || text.includes('while') || text.includes('range')) return 'loops';
  if (text.includes('break') || text.includes('continue')) return 'loop-control';

  // Functions
  if (text.includes('function') || text.includes('def') || text.includes('return')) return 'functions';
  if (text.includes('lambda')) return 'lambda';
  if (text.includes('decorator')) return 'decorators';
  if (text.includes('generator') || text.includes('yield')) return 'generators';

  // OOP
  if (text.includes('class') || text.includes('object') || text.includes('__init__')) return 'classes';
  if (text.includes('inheritance') || text.includes('subclass')) return 'inheritance';
  if (text.includes('self') || text.includes('method')) return 'methods';
  if (text.includes('property') || text.includes('@property')) return 'properties';

  // Advanced concepts
  if (text.includes('exception') || text.includes('try') || text.includes('except')) return 'exceptions';
  if (text.includes('file') || text.includes('read') || text.includes('write')) return 'file-io';
  if (text.includes('module') || text.includes('import')) return 'modules';
  if (text.includes('async') || text.includes('await')) return 'async';
  if (text.includes('gil') || text.includes('thread')) return 'concurrency';

  // Operators
  if (text.includes('operator') || text.includes('+') || text.includes('==')) return 'operators';
  if (text.includes('and') || text.includes('or') || text.includes('not')) return 'logic';

  // Built-in functions
  if (text.includes('len') || text.includes('max') || text.includes('min') || text.includes('sum')) return 'built-in-functions';
  if (text.includes('map') || text.includes('filter') || text.includes('reduce')) return 'functional-programming';
  if (text.includes('enumerate') || text.includes('zip')) return 'iterables';

  // Standard library
  if (text.includes('collections') || text.includes('itertools') || text.includes('functools')) return 'standard-library';

  // Default
  return 'general';
}

/**
 * Convert questions to format expected by Tauri backend (with JSON strings)
 */
export function convertQuestionsForBackend(questions: McqQuestion[]): any[] {
  return questions.map(q => ({
    id: q.id,
    questionText: q.questionText,
    explanation: q.explanation || null,
    options: JSON.stringify(q.options),
    correctAnswerIndex: q.correctAnswerIndex,
    difficulty: q.difficulty,
    topic: q.topic,
    language: q.language,
    tags: JSON.stringify(q.tags || []),
    createdAt: q.createdAt,
    updatedAt: q.updatedAt,
  }));
}
