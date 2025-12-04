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

// Import all GDScript lessons (now 30 lessons - complete beginner course!)
import godot1 from '../../docs/lessons/godot-01-scroll-of-print.json'
import godot2 from '../../docs/lessons/godot-02-variables-of-power.json'
import godot3 from '../../docs/lessons/godot-03-conditional-path.json'
import godot4 from '../../docs/lessons/godot-04-loop-of-destiny.json'
import godot5 from '../../docs/lessons/godot-05-function-forge.json'
import godot6 from '../../docs/lessons/godot-06-array-quest.json'
import godot7 from '../../docs/lessons/godot-07-array-magic.json'
import godot8 from '../../docs/lessons/godot-08-dictionary-codex.json'
import godot9 from '../../docs/lessons/godot-09-node-keeper.json'
import godot10 from '../../docs/lessons/godot-10-class-blueprint.json'
import godot11 from '../../docs/lessons/godot-11-user-input-strings.json'
import godot12 from '../../docs/lessons/godot-12-math-operations.json'
import godot13 from '../../docs/lessons/godot-13-challenge-profile-creator.json'
import godot14 from '../../docs/lessons/godot-14-if-else-branching.json'
import godot15 from '../../docs/lessons/godot-15-multiple-conditions.json'
import godot16 from '../../docs/lessons/godot-16-logical-operators.json'
import godot17 from '../../docs/lessons/godot-17-challenge-quest-eligibility.json'
import godot18 from '../../docs/lessons/godot-18-for-loops-range.json'
import godot19 from '../../docs/lessons/godot-19-while-loops.json'
import godot20 from '../../docs/lessons/godot-20-loop-control.json'
import godot21 from '../../docs/lessons/godot-21-challenge-battle-simulator.json'
import godot22 from '../../docs/lessons/godot-22-advanced-function-parameters.json'
import godot23 from '../../docs/lessons/godot-23-return-values-multiple.json'
import godot24 from '../../docs/lessons/godot-24-array-operations-advanced.json'
import godot25 from '../../docs/lessons/godot-25-challenge-rpg-inventory.json'
import godot26 from '../../docs/lessons/godot-26-dictionary-mastery.json'
import godot27 from '../../docs/lessons/godot-27-nested-data-structures.json'
import godot28 from '../../docs/lessons/godot-28-file-reading.json'
import godot29 from '../../docs/lessons/godot-29-file-writing-json.json'
import godot30 from '../../docs/lessons/godot-30-final-project-rpg-system.json'

// Import all C# lessons (now 30 lessons - complete beginner course!)
import csharp1 from '../../docs/lessons/csharp-01-scroll-of-print.json'
import csharp2 from '../../docs/lessons/csharp-02-variables-of-power.json'
import csharp3 from '../../docs/lessons/csharp-03-conditional-path.json'
import csharp4 from '../../docs/lessons/csharp-04-loop-of-destiny.json'
import csharp5 from '../../docs/lessons/csharp-05-method-forge.json'
import csharp6 from '../../docs/lessons/csharp-06-array-quest.json'
import csharp7 from '../../docs/lessons/csharp-07-array-magic.json'
import csharp8 from '../../docs/lessons/csharp-08-dictionary-codex.json'
import csharp9 from '../../docs/lessons/csharp-09-class-keeper.json'
import csharp10 from '../../docs/lessons/csharp-10-class-blueprint.json'
import csharp11 from '../../docs/lessons/csharp-11-user-input-strings.json'
import csharp12 from '../../docs/lessons/csharp-12-math-operations.json'
import csharp13 from '../../docs/lessons/csharp-13-challenge-profile-creator.json'
import csharp14 from '../../docs/lessons/csharp-14-if-else-branching.json'
import csharp15 from '../../docs/lessons/csharp-15-multiple-conditions.json'
import csharp16 from '../../docs/lessons/csharp-16-logical-operators.json'
import csharp17 from '../../docs/lessons/csharp-17-challenge-quest-eligibility.json'
import csharp18 from '../../docs/lessons/csharp-18-for-loops-range.json'
import csharp19 from '../../docs/lessons/csharp-19-while-loops.json'
import csharp20 from '../../docs/lessons/csharp-20-loop-control.json'
import csharp21 from '../../docs/lessons/csharp-21-challenge-battle-simulator.json'
import csharp22 from '../../docs/lessons/csharp-22-advanced-method-parameters.json'
import csharp23 from '../../docs/lessons/csharp-23-return-values-multiple.json'
import csharp24 from '../../docs/lessons/csharp-24-array-operations-advanced.json'
import csharp25 from '../../docs/lessons/csharp-25-challenge-rpg-inventory.json'
import csharp26 from '../../docs/lessons/csharp-26-dictionary-mastery.json'
import csharp27 from '../../docs/lessons/csharp-27-nested-data-structures.json'
import csharp28 from '../../docs/lessons/csharp-28-file-reading.json'
import csharp29 from '../../docs/lessons/csharp-29-file-writing-json.json'
import csharp30 from '../../docs/lessons/csharp-30-final-project-rpg-system.json'

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

// Import Python Intermediate lessons (31-60)
import lesson59 from '../../docs/lessons/python-31-scope-deep-dive.json'
import lesson60 from '../../docs/lessons/python-32-lambda-functions.json'
import lesson61 from '../../docs/lessons/python-33-list-comprehensions.json'
import lesson62 from '../../docs/lessons/python-34-map-filter-reduce.json'
import lesson63 from '../../docs/lessons/python-35-damage-calculator-challenge.json'
import lesson64 from '../../docs/lessons/python-36-classes-expansion.json'
import lesson65 from '../../docs/lessons/python-37-methods-and-self.json'
import lesson66 from '../../docs/lessons/python-38-str-and-properties.json'
import lesson67 from '../../docs/lessons/python-39-multiple-classes.json'
import lesson68 from '../../docs/lessons/python-40-rpg-character-challenge.json'
import lesson69 from '../../docs/lessons/python-41-inheritance-basics.json'
import lesson70 from '../../docs/lessons/python-42-method-overriding.json'
import lesson71 from '../../docs/lessons/python-43-polymorphism.json'
import lesson72 from '../../docs/lessons/python-44-abstract-base-classes.json'
import lesson73 from '../../docs/lessons/python-45-oop-game-engine-challenge.json'
import lesson74 from '../../docs/lessons/python-46-json-intro.json'
import lesson75 from '../../docs/lessons/python-47-reading-json-files.json'
import lesson76 from '../../docs/lessons/python-48-writing-json-files.json'
import lesson77 from '../../docs/lessons/python-49-complex-json-structures.json'
import lesson78 from '../../docs/lessons/python-50-save-load-challenge.json'
import lesson79 from '../../docs/lessons/python-51-csv-intro.json'
import lesson80 from '../../docs/lessons/python-52-csv-writing.json'
import lesson81 from '../../docs/lessons/python-53-csv-processing.json'
import lesson82 from '../../docs/lessons/python-54-csv-analytics.json'
import lesson83 from '../../docs/lessons/python-55-csv-challenge.json'
import lesson84 from '../../docs/lessons/python-56-exception-handling.json'
import lesson85 from '../../docs/lessons/python-57-try-except-finally.json'
import lesson86 from '../../docs/lessons/python-58-debugging-techniques.json'
import lesson87 from '../../docs/lessons/python-59-character-manager-app.json'
import lesson88 from '../../docs/lessons/python-60-final-rpg-challenge.json'

// Import Python Advanced lessons (61-90)
import lesson89 from '../../docs/lessons/python-61-properties-descriptors.json'
import lesson90 from '../../docs/lessons/python-62-magic-methods.json'
import lesson91 from '../../docs/lessons/python-63-decorators.json'
import lesson92 from '../../docs/lessons/python-64-design-patterns.json'
import lesson93 from '../../docs/lessons/python-65-advanced-combat-challenge.json'
import lesson94 from '../../docs/lessons/python-66-unit-testing-basics.json'
import lesson95 from '../../docs/lessons/python-67-test-fixtures.json'
import lesson96 from '../../docs/lessons/python-68-mocking.json'
import lesson97 from '../../docs/lessons/python-69-tdd.json'
import lesson98 from '../../docs/lessons/python-70-tdd-quest-system.json'
import lesson99 from '../../docs/lessons/python-71-sql-basics.json'
import lesson100 from '../../docs/lessons/python-72-orm-repository.json'
import lesson101 from '../../docs/lessons/python-73-database-relationships.json'
import lesson102 from '../../docs/lessons/python-74-migrations.json'
import lesson103 from '../../docs/lessons/python-75-database-mmo-challenge.json'
import lesson104 from '../../docs/lessons/python-76-async-basics.json'
import lesson105 from '../../docs/lessons/python-77-async-io-operations.json'
import lesson106 from '../../docs/lessons/python-78-concurrency-patterns.json'
import lesson107 from '../../docs/lessons/python-79-async-patterns.json'
import lesson108 from '../../docs/lessons/python-80-async-mmo-challenge.json'
import lesson109 from '../../docs/lessons/python-81-flask-basics.json'
import lesson110 from '../../docs/lessons/python-82-flask-auth.json'
import lesson111 from '../../docs/lessons/python-83-flask-validation.json'
import lesson112 from '../../docs/lessons/python-84-flask-database.json'
import lesson113 from '../../docs/lessons/python-85-flask-api-challenge.json'
import lesson114 from '../../docs/lessons/python-86-profiling-optimization.json'
import lesson115 from '../../docs/lessons/python-87-caching-strategies.json'
import lesson116 from '../../docs/lessons/python-88-logging-monitoring.json'
import lesson117 from '../../docs/lessons/python-89-architecture-planning.json'
import lesson118 from '../../docs/lessons/python-90-final-project.json'

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
  // Godot lessons (30 lessons)
  godot1 as Lesson,
  godot2 as Lesson,
  godot3 as Lesson,
  godot4 as Lesson,
  godot5 as Lesson,
  godot6 as Lesson,
  godot7 as Lesson,
  godot8 as Lesson,
  godot9 as Lesson,
  godot10 as Lesson,
  godot11 as Lesson,
  godot12 as Lesson,
  godot13 as Lesson,
  godot14 as Lesson,
  godot15 as Lesson,
  godot16 as Lesson,
  godot17 as Lesson,
  godot18 as Lesson,
  godot19 as Lesson,
  godot20 as Lesson,
  godot21 as Lesson,
  godot22 as Lesson,
  godot23 as Lesson,
  godot24 as Lesson,
  godot25 as Lesson,
  godot26 as Lesson,
  godot27 as Lesson,
  godot28 as Lesson,
  godot29 as Lesson,
  godot30 as Lesson,
  // C# lessons (30 lessons)
  csharp1 as Lesson,
  csharp2 as Lesson,
  csharp3 as Lesson,
  csharp4 as Lesson,
  csharp5 as Lesson,
  csharp6 as Lesson,
  csharp7 as Lesson,
  csharp8 as Lesson,
  csharp9 as Lesson,
  csharp10 as Lesson,
  csharp11 as Lesson,
  csharp12 as Lesson,
  csharp13 as Lesson,
  csharp14 as Lesson,
  csharp15 as Lesson,
  csharp16 as Lesson,
  csharp17 as Lesson,
  csharp18 as Lesson,
  csharp19 as Lesson,
  csharp20 as Lesson,
  csharp21 as Lesson,
  csharp22 as Lesson,
  csharp23 as Lesson,
  csharp24 as Lesson,
  csharp25 as Lesson,
  csharp26 as Lesson,
  csharp27 as Lesson,
  csharp28 as Lesson,
  csharp29 as Lesson,
  csharp30 as Lesson,
  // JavaScript lessons
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
  lesson59 as Lesson,
  lesson60 as Lesson,
  lesson61 as Lesson,
  lesson62 as Lesson,
  lesson63 as Lesson,
  lesson64 as Lesson,
  lesson65 as Lesson,
  lesson66 as Lesson,
  lesson67 as Lesson,
  lesson68 as Lesson,
  lesson69 as Lesson,
  lesson70 as Lesson,
  lesson71 as Lesson,
  lesson72 as Lesson,
  lesson73 as Lesson,
  lesson74 as Lesson,
  lesson75 as Lesson,
  lesson76 as Lesson,
  lesson77 as Lesson,
  lesson78 as Lesson,
  lesson79 as Lesson,
  lesson80 as Lesson,
  lesson81 as Lesson,
  lesson82 as Lesson,
  lesson83 as Lesson,
  lesson84 as Lesson,
  lesson85 as Lesson,
  lesson86 as Lesson,
  lesson87 as Lesson,
  lesson88 as Lesson,
  lesson89 as Lesson,
  lesson90 as Lesson,
  lesson91 as Lesson,
  lesson92 as Lesson,
  lesson93 as Lesson,
  lesson94 as Lesson,
  lesson95 as Lesson,
  lesson96 as Lesson,
  lesson97 as Lesson,
  lesson98 as Lesson,
  lesson99 as Lesson,
  lesson100 as Lesson,
  lesson101 as Lesson,
  lesson102 as Lesson,
  lesson103 as Lesson,
  lesson104 as Lesson,
  lesson105 as Lesson,
  lesson106 as Lesson,
  lesson107 as Lesson,
  lesson108 as Lesson,
  lesson109 as Lesson,
  lesson110 as Lesson,
  lesson111 as Lesson,
  lesson112 as Lesson,
  lesson113 as Lesson,
  lesson114 as Lesson,
  lesson115 as Lesson,
  lesson116 as Lesson,
  lesson117 as Lesson,
  lesson118 as Lesson,
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
