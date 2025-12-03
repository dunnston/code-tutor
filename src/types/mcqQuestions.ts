/**
 * Multiple Choice Question Types for Dungeon System
 */

export enum QuestionDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert',
}

export enum ProgrammingLanguage {
  PYTHON = 'python',
  JAVASCRIPT = 'javascript',
  GDSCRIPT = 'gdscript',
  GENERAL = 'general',
}

export interface McqQuestion {
  id: string;
  questionText: string;
  explanation?: string; // Shown after answering
  options: string[]; // Array of answer options
  correctAnswerIndex: number; // 0-based index
  difficulty: QuestionDifficulty;
  topic?: string; // e.g., "variables", "loops", "functions"
  language: ProgrammingLanguage;
  tags?: string[]; // Array of tags for filtering
  createdAt: string;
  updatedAt: string;
}

export interface QuestionListItem {
  id: string;
  questionText: string;
  difficulty: QuestionDifficulty;
  topic?: string;
  language: ProgrammingLanguage;
}

export interface QuestionFilter {
  difficulty?: QuestionDifficulty;
  topic?: string;
  language?: ProgrammingLanguage;
  searchTerm?: string;
}
