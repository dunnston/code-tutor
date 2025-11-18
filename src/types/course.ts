import type { Lesson } from './lesson'
import type { LanguageId } from './language'

/**
 * Course category for organization
 */
export type CourseCategory = 'backend' | 'game-dev' | 'frontend' | 'general'

/**
 * Course skill level
 */
export type CourseSkillLevel = 'beginner' | 'intermediate' | 'advanced'

/**
 * Course represents a complete learning track (collection of lessons)
 */
export interface Course {
  id: number
  name: string
  description: string
  language: LanguageId
  category: CourseCategory
  skillLevel: CourseSkillLevel
  icon: string // emoji or icon identifier
  estimatedHours: number
  lessonCount: number
  xpTotal: number
  lessons: Lesson[]
  prerequisites?: number[] // course IDs that must be completed first
  featured: boolean
  tags: string[]
}

/**
 * User's progress on a specific course
 */
export interface UserCourseProgress {
  courseId: number
  lessonsCompleted: number
  totalLessons: number
  completionPercentage: number
  lastAccessedLessonId: number | null
  startedAt: string // ISO timestamp
  completedAt?: string // ISO timestamp
  isActive: boolean // is this the user's current active course?
}
