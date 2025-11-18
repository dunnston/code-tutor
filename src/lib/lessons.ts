import type { Lesson } from '@/types/lesson'

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

// Import all GDScript lessons
import lesson11 from '../../docs/lessons/gdscript-01-node-awakens.json'
import lesson12 from '../../docs/lessons/gdscript-02-variables-realm.json'
import lesson13 from '../../docs/lessons/gdscript-03-decision-path.json'
import lesson14 from '../../docs/lessons/gdscript-04-loop-dimension.json'
import lesson15 from '../../docs/lessons/gdscript-05-function-forge.json'

// Import all C# lessons
import lesson16 from '../../docs/lessons/csharp-01-console-awakens.json'
import lesson17 from '../../docs/lessons/csharp-02-variables-types.json'
import lesson18 from '../../docs/lessons/csharp-03-decision-gate.json'
import lesson19 from '../../docs/lessons/csharp-04-loop-chamber.json'
import lesson20 from '../../docs/lessons/csharp-05-methods-power.json'

// Import all JavaScript lessons
import lesson21 from '../../docs/lessons/javascript-01-console-awakens.json'
import lesson22 from '../../docs/lessons/javascript-02-variables-realm.json'
import lesson23 from '../../docs/lessons/javascript-03-decision-crossroads.json'
import lesson24 from '../../docs/lessons/javascript-04-loop-nexus.json'
import lesson25 from '../../docs/lessons/javascript-05-function-factory.json'

// Import all Ruby lessons
import lesson26 from '../../docs/lessons/ruby-01-puts-awakening.json'
import lesson27 from '../../docs/lessons/ruby-02-variable-garden.json'
import lesson28 from '../../docs/lessons/ruby-03-conditional-flow.json'
import lesson29 from '../../docs/lessons/ruby-04-iteration-realm.json'
import lesson30 from '../../docs/lessons/ruby-05-method-mastery.json'

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
  lesson11 as Lesson,
  lesson12 as Lesson,
  lesson13 as Lesson,
  lesson14 as Lesson,
  lesson15 as Lesson,
  lesson16 as Lesson,
  lesson17 as Lesson,
  lesson18 as Lesson,
  lesson19 as Lesson,
  lesson20 as Lesson,
  lesson21 as Lesson,
  lesson22 as Lesson,
  lesson23 as Lesson,
  lesson24 as Lesson,
  lesson25 as Lesson,
  lesson26 as Lesson,
  lesson27 as Lesson,
  lesson28 as Lesson,
  lesson29 as Lesson,
  lesson30 as Lesson,
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
