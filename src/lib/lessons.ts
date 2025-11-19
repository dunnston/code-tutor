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

// Import all Git lessons
import lesson31 from '../../docs/lessons/git-01-version-control-intro.json'
import lesson32 from '../../docs/lessons/git-02-init-and-status.json'
import lesson33 from '../../docs/lessons/git-03-staging-and-committing.json'
import lesson34 from '../../docs/lessons/git-04-history-and-diffs.json'
import lesson35 from '../../docs/lessons/git-05-branching-basics.json'
import lesson36 from '../../docs/lessons/git-06-merging-branches.json'
import lesson37 from '../../docs/lessons/git-07-working-with-remotes.json'
import lesson38 from '../../docs/lessons/git-08-undoing-changes.json'

// Import extended Python lessons (11-30)
import lesson39 from '../../docs/lessons/python-11-user-input-strings.json'
import lesson40 from '../../docs/lessons/python-12-math-operations.json'
import lesson41 from '../../docs/lessons/python-13-challenge-profile-creator.json'
import lesson42 from '../../docs/lessons/python-14-if-else-branching.json'
import lesson43 from '../../docs/lessons/python-15-multiple-conditions.json'
import lesson44 from '../../docs/lessons/python-16-logical-operators.json'
import lesson45 from '../../docs/lessons/python-17-challenge-quest-eligibility.json'
import lesson46 from '../../docs/lessons/python-18-for-loops-range.json'
import lesson47 from '../../docs/lessons/python-19-while-loops.json'
import lesson48 from '../../docs/lessons/python-20-loop-control.json'
import lesson49 from '../../docs/lessons/python-21-challenge-battle-simulator.json'
import lesson50 from '../../docs/lessons/python-22-advanced-function-parameters.json'
import lesson51 from '../../docs/lessons/python-23-return-values-multiple.json'
import lesson52 from '../../docs/lessons/python-24-list-operations-advanced.json'
import lesson53 from '../../docs/lessons/python-25-challenge-rpg-inventory.json'
import lesson54 from '../../docs/lessons/python-26-dictionary-mastery.json'
import lesson55 from '../../docs/lessons/python-27-nested-data-structures.json'
import lesson56 from '../../docs/lessons/python-28-file-reading.json'
import lesson57 from '../../docs/lessons/python-29-file-writing-json.json'
import lesson58 from '../../docs/lessons/python-30-final-project-rpg-system.json'

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
  lesson31 as Lesson,
  lesson32 as Lesson,
  lesson33 as Lesson,
  lesson34 as Lesson,
  lesson35 as Lesson,
  lesson36 as Lesson,
  lesson37 as Lesson,
  lesson38 as Lesson,
  lesson39 as Lesson,
  lesson40 as Lesson,
  lesson41 as Lesson,
  lesson42 as Lesson,
  lesson43 as Lesson,
  lesson44 as Lesson,
  lesson45 as Lesson,
  lesson46 as Lesson,
  lesson47 as Lesson,
  lesson48 as Lesson,
  lesson49 as Lesson,
  lesson50 as Lesson,
  lesson51 as Lesson,
  lesson52 as Lesson,
  lesson53 as Lesson,
  lesson54 as Lesson,
  lesson55 as Lesson,
  lesson56 as Lesson,
  lesson57 as Lesson,
  lesson58 as Lesson,
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
