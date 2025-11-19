import type { Course, CourseCategory, UserCourseProgress } from '@/types/course'
import { getLessonsByLanguage } from './lessons'
import { loadProgress } from './storage'

/**
 * Course definitions based on lesson tracks
 */
const COURSE_DEFINITIONS: Omit<Course, 'lessons' | 'lessonCount' | 'xpTotal'>[] = [
  {
    id: 1,
    name: 'Python Fundamentals',
    description: 'Master the basics of Python through an epic fantasy adventure. Learn variables, loops, functions, and more!',
    language: 'python',
    category: 'backend',
    skillLevel: 'beginner',
    icon: '🐍',
    estimatedHours: 8,
    featured: true,
    tags: ['beginner', 'python', 'fundamentals', 'backend'],
  },
  {
    id: 2,
    name: 'GDScript for Game Development',
    description: 'Learn GDScript, the language powering Godot Engine. Build games while mastering programming concepts!',
    language: 'gdscript',
    category: 'game-dev',
    skillLevel: 'beginner',
    icon: '🎮',
    estimatedHours: 5,
    featured: true,
    tags: ['beginner', 'gdscript', 'game-dev', 'godot'],
  },
  {
    id: 3,
    name: 'C# Essentials',
    description: 'Dive into C# programming. Perfect for Unity game development and enterprise applications.',
    language: 'csharp',
    category: 'game-dev',
    skillLevel: 'beginner',
    icon: '⚔️',
    estimatedHours: 5,
    featured: true,
    tags: ['beginner', 'csharp', 'game-dev', 'unity'],
  },
  {
    id: 4,
    name: 'JavaScript Basics',
    description: 'Start your web development journey with JavaScript. Learn the language that powers the modern web!',
    language: 'javascript',
    category: 'frontend',
    skillLevel: 'beginner',
    icon: '⚡',
    estimatedHours: 5,
    featured: true,
    tags: ['beginner', 'javascript', 'frontend', 'web'],
  },
  {
    id: 5,
    name: 'Ruby Fundamentals',
    description: 'Explore the elegant world of Ruby. Learn the language beloved by developers for its simplicity.',
    language: 'ruby',
    category: 'backend',
    skillLevel: 'beginner',
    icon: '💎',
    estimatedHours: 5,
    featured: false,
    tags: ['beginner', 'ruby', 'backend'],
  },
  {
    id: 6,
    name: 'Git Essentials',
    description: 'Master version control with Git. Learn to track changes, collaborate with teams, and manage code like a professional developer.',
    language: 'bash',
    category: 'general',
    skillLevel: 'beginner',
    icon: '🛠️',
    estimatedHours: 6,
    featured: true,
    tags: ['beginner', 'git', 'version-control', 'devtools'],
  },
]

/**
 * Get all available courses with lesson data
 */
export function getAllCourses(): Course[] {
  return COURSE_DEFINITIONS.map((def) => {
    const lessons = getLessonsByLanguage(def.language)
    const xpTotal = lessons.reduce((sum, lesson) => sum + lesson.xpReward, 0)

    return {
      ...def,
      lessons,
      lessonCount: lessons.length,
      xpTotal,
    }
  })
}

/**
 * Get course by ID
 */
export function getCourseById(courseId: number): Course | undefined {
  return getAllCourses().find((course) => course.id === courseId)
}

/**
 * Get courses by category
 */
export function getCoursesByCategory(category: CourseCategory): Course[] {
  return getAllCourses().filter((course) => course.category === category)
}

/**
 * Get featured courses
 */
export function getFeaturedCourses(): Course[] {
  return getAllCourses().filter((course) => course.featured)
}

/**
 * Get user's progress for a specific course
 */
export function getCourseProgress(courseId: number): UserCourseProgress | null {
  const course = getCourseById(courseId)
  if (!course) return null

  const progress = loadProgress()
  const lessonIds = course.lessons.map((l) => l.id)
  const completedLessons = lessonIds.filter((id) => progress.completedLessons.includes(id))

  // Find last accessed lesson (highest completed or first incomplete)
  let lastAccessedLessonId: number | null = null
  for (const lesson of course.lessons) {
    if (progress.completedLessons.includes(lesson.id)) {
      lastAccessedLessonId = lesson.id
    } else {
      // First incomplete lesson
      if (lastAccessedLessonId === null || progress.completedLessons.includes(lastAccessedLessonId)) {
        lastAccessedLessonId = lesson.id
      }
      break
    }
  }

  const completionPercentage = Math.round((completedLessons.length / course.lessonCount) * 100)

  return {
    courseId,
    lessonsCompleted: completedLessons.length,
    totalLessons: course.lessonCount,
    completionPercentage,
    lastAccessedLessonId: lastAccessedLessonId || course.lessons[0]?.id || null,
    startedAt: new Date().toISOString(), // TODO: track actual start time
    isActive: progress.currentLessonId !== null && lessonIds.includes(progress.currentLessonId),
  }
}

/**
 * Get all courses with user progress
 */
export function getCoursesWithProgress(): Array<Course & { progress: UserCourseProgress | null }> {
  return getAllCourses().map((course) => ({
    ...course,
    progress: getCourseProgress(course.id),
  }))
}

/**
 * Get user's active course (the one they're currently working on)
 */
export function getActiveCourse(): Course | null {
  const progress = loadProgress()
  if (!progress.currentLessonId) return null

  const courses = getAllCourses()
  for (const course of courses) {
    if (course.lessons.some((l) => l.id === progress.currentLessonId)) {
      return course
    }
  }

  return null
}

/**
 * Check if a course is unlocked (available to start)
 * A course is unlocked if it has no prerequisites or all prerequisites are completed
 */
export function isCourseUnlocked(courseId: number): boolean {
  const course = getCourseById(courseId)
  if (!course) return false

  // No prerequisites = always unlocked
  if (!course.prerequisites || course.prerequisites.length === 0) {
    return true
  }

  // Check if all prerequisite courses are completed
  return course.prerequisites.every((prereqId) => {
    const prereqProgress = getCourseProgress(prereqId)
    return prereqProgress && prereqProgress.completionPercentage === 100
  })
}
