import { getAllCourses, getCourseProgress, isCourseUnlocked } from '@/lib/courses'
import { getActivatedCourses } from '@/lib/profiles'
import type { CourseCategory } from '@/types/course'
import { CourseCard } from './CourseCard'

interface CourseCatalogProps {
  category?: CourseCategory
  searchQuery?: string
}

export function CourseCatalog({ category, searchQuery = '' }: CourseCatalogProps) {
  let courses = getAllCourses()
  const activatedCourseIds = getActivatedCourses()

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => {
        const progress = getCourseProgress(course.id)
        const isLocked = !isCourseUnlocked(course.id)

        return (
          <CourseCard
            key={course.id}
            course={course}
            progress={progress}
            isLocked={isLocked}
          />
        )
      })}
    </div>
  )
}
