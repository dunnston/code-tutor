import { useAppStore } from '@/lib/store'
import { getCourseById, getCourseProgress } from '@/lib/courses'
import { getActivatedCourses } from '@/lib/profiles'

export function ActiveCourseCard() {
  const setCurrentLesson = useAppStore((state) => state.setCurrentLesson)
  const setCurrentView = useAppStore((state) => state.setCurrentView)
  const activeCourseIds = getActivatedCourses()

  if (activeCourseIds.length === 0) {
    return (
      <div className="bg-navy-800 rounded-xl p-8 border border-navy-700 text-center">
        <div className="text-5xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No Active Courses</h3>
        <p className="text-gray-400">Activate a course from the Explore Courses section below to start your learning journey!</p>
      </div>
    )
  }

  // Get course data for all activated courses
  const activeCourses = activeCourseIds
    .map(id => ({
      course: getCourseById(id),
      progress: getCourseProgress(id)
    }))
    .filter(item => item.course !== undefined)

  const handleStartCourse = (courseId: number) => {
    const course = getCourseById(courseId)
    if (!course) return

    const firstLesson = course.lessons[0]
    if (firstLesson) {
      setCurrentLesson(firstLesson)
      setCurrentView('learning')
    }
  }

  const handleContinueCourse = (courseId: number) => {
    const course = getCourseById(courseId)
    const progress = getCourseProgress(courseId)
    if (!course) return

    const nextLessonId = progress?.lastAccessedLessonId
    const nextLesson = course.lessons.find(l => l.id === nextLessonId) || course.lessons[0]

    if (nextLesson) {
      setCurrentLesson(nextLesson)
      setCurrentView('learning')
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-100">Your Active Courses</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {activeCourses.map(({ course, progress }) => {
          if (!course) return null

          const hasStarted = progress && progress.lessonsCompleted > 0
          const isCompleted = progress && progress.completionPercentage === 100

          return (
            <div
              key={course.id}
              className="bg-gradient-to-br from-accent-600 to-orange-700 rounded-xl p-6 border border-accent-500 shadow-lg"
            >
              {/* Course Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{course.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{course.name}</h3>
                    <p className="text-orange-100 text-sm">{course.category}</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              {progress && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-orange-100 mb-2">
                    <span className="font-medium">
                      {progress.lessonsCompleted} of {progress.totalLessons} lessons
                    </span>
                    <span className="font-bold">{progress.completionPercentage}%</span>
                  </div>
                  <div className="bg-orange-900/50 rounded-full h-2">
                    <div
                      className="bg-white rounded-full h-2 transition-all duration-500"
                      style={{ width: `${progress.completionPercentage}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="mt-4">
                {isCompleted ? (
                  <button
                    onClick={() => handleContinueCourse(course.id)}
                    className="w-full bg-white hover:bg-gray-100 text-accent-600 font-bold px-6 py-3 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Review Course
                  </button>
                ) : hasStarted ? (
                  <button
                    onClick={() => handleContinueCourse(course.id)}
                    className="w-full bg-white hover:bg-gray-100 text-accent-600 font-bold px-6 py-3 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Continue Course
                  </button>
                ) : (
                  <button
                    onClick={() => handleStartCourse(course.id)}
                    className="w-full bg-white hover:bg-gray-100 text-accent-600 font-bold px-6 py-3 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Start Course
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
