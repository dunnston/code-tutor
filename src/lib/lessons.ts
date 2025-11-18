import type { Lesson } from '@types/lesson'

// Import all Python lessons
import lesson1 from '../../docs/lessons/python-01-scroll-of-print.json'
import lesson2 from '../../docs/lessons/python-02-variables-of-power.json'
import lesson3 from '../../docs/lessons/python-03-conditional-path.json'
import lesson4 from '../../docs/lessons/python-04-loop-of-destiny.json'
import lesson5 from '../../docs/lessons/python-05-function-forge.json'
import lesson6 from '../../docs/lessons/python-06-list-quest.json'
import lesson7 from '../../docs/lessons/python-07-list-magic.json'
import lesson8 from '../../docs/lessons/python-08-dictionary-codex.json'
import lesson9 from '../../docs/lessons/python-09-scroll-keeper.json'
import lesson10 from '../../docs/lessons/python-10-class-blueprint.json'

/**
 * All available lessons
 */
const ALL_LESSONS: Lesson[] = [
  lesson1 as Lesson,
  lesson2 as Lesson,
  lesson3 as Lesson,
  lesson4 as Lesson,
  lesson5 as Lesson,
  lesson6 as Lesson,
  lesson7 as Lesson,
  lesson8 as Lesson,
  lesson9 as Lesson,
  lesson10 as Lesson,
]

/**
 * Get all lessons
 */
export function getAllLessons(): Lesson[] {
  return ALL_LESSONS
}

/**
 * Get lesson by ID
 */
export function getLessonById(id: number): Lesson | undefined {
  return ALL_LESSONS.find((lesson) => lesson.id === id)
}

/**
 * Get lessons by language
 */
export function getLessonsByLanguage(language: string): Lesson[] {
  return ALL_LESSONS.filter((lesson) => lesson.language === language)
}

/**
 * Get lessons by track ID
 */
export function getLessonsByTrack(trackId: number): Lesson[] {
  return ALL_LESSONS.filter((lesson) => lesson.trackId === trackId)
}

/**
 * Get next lesson in sequence
 */
export function getNextLesson(currentLessonId: number): Lesson | undefined {
  const currentLesson = getLessonById(currentLessonId)
  if (!currentLesson || !currentLesson.nextLessonId) {
    return undefined
  }
  return getLessonById(currentLesson.nextLessonId)
}

/**
 * Get previous lesson in sequence
 */
export function getPreviousLesson(currentLessonId: number): Lesson | undefined {
  const currentLesson = getLessonById(currentLessonId)
  if (!currentLesson || !currentLesson.previousLessonId) {
    return undefined
  }
  return getLessonById(currentLesson.previousLessonId)
}

/**
 * Get first lesson for a language
 */
export function getFirstLesson(language: string = 'python'): Lesson | undefined {
  const lessons = getLessonsByLanguage(language)
  return lessons.find((lesson) => !lesson.previousLessonId)
}
