import { useState, useEffect } from 'react'
import { getAllCourses, getCourseProgress, isCourseUnlocked } from '@/lib/courses'
import { getActivatedCourses } from '@/lib/profiles'
import { checkAllRuntimes, type RuntimeStatus } from '@/lib/runtimeDetection'
import type { CourseCategory } from '@/types/course'
import type { SupportedLanguage } from '@/types/language'
import { CourseCard } from './CourseCard'

interface CourseCatalogProps {
  category?: CourseCategory
  searchQuery?: string
}

export function CourseCatalog({ category, searchQuery = '' }: CourseCatalogProps) {
  const [runtimeStatuses, setRuntimeStatuses] = useState<Record<SupportedLanguage, RuntimeStatus> | null>(null)

  let courses = getAllCourses()
  const activatedCourseIds = getActivatedCourses()

  // Check runtime availability
  useEffect(() => {
    checkAllRuntimes().then(setRuntimeStatuses)
  }, [])

  // Filter out activated courses (only show courses that can be activated)
  courses = courses.filter((course) => !activatedCourseIds.includes(course.id))

  // Filter by category
  if (category) {
    courses = courses.filter((course) => course.category === category)
  }

  // Filter by search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase()
    courses = courses.filter(
      (course) =>
        course.name.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.tags.some((tag) => tag.toLowerCase().includes(query))
    )
  }

  // Sort: featured first, then by skill level
  courses.sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return 0
  })

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No courses found</h3>
        <p className="text-gray-400">Try adjusting your search or filters</p>
      </div>
    )
  }

  // Show loading state while checking runtimes
  if (!runtimeStatuses) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-400">Checking available courses...</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => {
        const progress = getCourseProgress(course.id)
        const isLocked = !isCourseUnlocked(course.id)

        // Check if runtime is available for this course
        // Bundled languages are always available, otherwise check if detected
        const runtimeStatus = runtimeStatuses[course.language as SupportedLanguage]
        const runtimeAvailable = runtimeStatus?.bundled || runtimeStatus?.available || false

        if (course.language === 'bash') {
          console.log('Git/Bash course check:', {
            language: course.language,
            runtimeStatus,
            runtimeAvailable,
            courseName: course.name
          })
        }

        return (
          <CourseCard
            key={course.id}
            course={course}
            progress={progress}
            isLocked={isLocked}
            runtimeAvailable={runtimeAvailable}
          />
        )
      })}
    </div>
  )
}
