import type { Course, UserCourseProgress } from '@/types/course'
import { useAppStore } from '@/lib/store'
import { isCourseActivated, activateCourse, getActivatedCourses } from '@/lib/profiles'
import { getCourseById } from '@/lib/courses'
import { getRuntimeName, getLockedCourseMessage } from '@/lib/runtimeDetection'
import type { SupportedLanguage } from '@/types/language'
import { useState } from 'react'
import { AlertModal } from '@/components/ui/AlertModal'

interface CourseCardProps {
  course: Course
  progress: UserCourseProgress | null
  isLocked?: boolean
  runtimeAvailable?: boolean
}

export function CourseCard({ course, progress, isLocked = false, runtimeAvailable = true }: CourseCardProps) {
  const setCurrentLesson = useAppStore((state) => state.setCurrentLesson)
  const setCurrentView = useAppStore((state) => state.setCurrentView)
  const toggleSettings = useAppStore((state) => state.toggleSettings)
  const [isActivated, setIsActivated] = useState(isCourseActivated(course.id))
  const [alertModal, setAlertModal] = useState<{ activeCourseName: string } | null>(null)

  // Course is locked if either isLocked OR runtime is not available
  const effectivelyLocked = isLocked || !runtimeAvailable

  const handleActivateCourse = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (effectivelyLocked) return

    try {
      activateCourse(course.id)
      setIsActivated(true)
    } catch (error) {
      if (error instanceof Error && error.message === 'COURSE_ALREADY_ACTIVE') {
        // Get the currently active course name
        const activeCourseIds = getActivatedCourses()
        const activeCourse = activeCourseIds.length > 0 ? getCourseById(activeCourseIds[0]!) : null
        const activeCourseName = activeCourse ? activeCourse.name : 'another course'

        setAlertModal({ activeCourseName })
      } else {
        // Re-throw other errors
        throw error
      }
    }
  }

  const handleStartCourse = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (effectivelyLocked || !isActivated) return

    // Set first lesson of the course
    const firstLesson = course.lessons[0]
    if (firstLesson) {
      setCurrentLesson(firstLesson)
      setCurrentView('learning')
    }
  }

  const handleContinueCourse = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (effectivelyLocked || !progress || !isActivated) return

    // Find the next lesson to resume
    const nextLessonId = progress.lastAccessedLessonId
    const nextLesson = course.lessons.find((l) => l.id === nextLessonId) || course.lessons[0]

    if (nextLesson) {
      setCurrentLesson(nextLesson)
      setCurrentView('learning')
    }
  }

  const handleOpenSettings = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleSettings()
  }

  const isInProgress = progress && progress.lessonsCompleted > 0 && progress.completionPercentage < 100
  const isCompleted = progress && progress.completionPercentage === 100
  const isNew = !progress || progress.lessonsCompleted === 0

  return (
    <>
      <AlertModal
        isOpen={alertModal !== null}
        title="Course Already Active"
        message={`You already have "${alertModal?.activeCourseName}" activated! You can only have one active course at a time. Please complete or deactivate your current course before activating a new one.`}
        variant="warning"
        confirmText="OK"
        onConfirm={() => setAlertModal(null)}
      />

      <div
        className={`bg-navy-800 rounded-xl p-6 border transition-all ${
          effectivelyLocked
            ? 'border-navy-700 opacity-60'
            : 'border-navy-700 hover:border-accent-500 hover:shadow-lg'
        }`}
      >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{course.icon}</div>
          <div>
            <h3 className="text-lg font-bold text-gray-100">{course.name}</h3>
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
              <span className="capitalize">{course.skillLevel}</span>
              <span>•</span>
              <span>{course.estimatedHours}h</span>
              <span>•</span>
              <span>{course.lessonCount} lessons</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        {!runtimeAvailable && (
          <div className="bg-orange-900/20 px-2 py-1 rounded text-xs text-orange-400 flex items-center gap-1 border border-orange-500/30">
            🔒 Setup Required
          </div>
        )}
        {runtimeAvailable && isLocked && (
          <div className="bg-navy-700 px-2 py-1 rounded text-xs text-gray-500 flex items-center gap-1">
            🔒 Locked
          </div>
        )}
        {!effectivelyLocked && isCompleted && (
          <div className="bg-green-500/10 px-2 py-1 rounded text-xs text-green-400 flex items-center gap-1">
            ✓ Completed
          </div>
        )}
        {!effectivelyLocked && isInProgress && (
          <div className="bg-accent-500/10 px-2 py-1 rounded text-xs text-accent-400 flex items-center gap-1">
            ▶ In Progress
          </div>
        )}
        {!effectivelyLocked && isNew && (
          <div className="bg-blue-500/10 px-2 py-1 rounded text-xs text-blue-400 flex items-center gap-1">
            ✨ New
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-400 mb-4 line-clamp-2">{course.description}</p>

      {/* Progress Bar (if started) */}
      {progress && progress.lessonsCompleted > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>
              {progress.lessonsCompleted}/{progress.totalLessons} lessons
            </span>
            <span>{progress.completionPercentage}%</span>
          </div>
          <div className="bg-navy-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-accent-500 to-orange-600 rounded-full h-2 transition-all duration-500"
              style={{ width: `${progress.completionPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Tags */}
        <div className="flex items-center gap-2">
          {course.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-navy-700 rounded text-xs text-gray-400"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* XP Reward */}
        <div className="flex items-center gap-1 text-xs text-accent-400">
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="font-semibold">{course.xpTotal} XP</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-4 border-t border-navy-700">
        {!runtimeAvailable ? (
          <div className="space-y-2">
            <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-3">
              <p className="text-xs text-orange-300 mb-2">
                {getLockedCourseMessage(course.language as SupportedLanguage)}
              </p>
            </div>
            <button
              onClick={handleOpenSettings}
              className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Go to Settings
            </button>
          </div>
        ) : isLocked ? (
          <button
            disabled
            className="w-full px-4 py-2 bg-navy-700 text-gray-500 rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
          >
            🔒 Locked
          </button>
        ) : !isActivated ? (
          <button
            onClick={handleActivateCourse}
            className="w-full px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Activate Course
          </button>
        ) : isInProgress ? (
          <button
            onClick={handleContinueCourse}
            className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Continue Course
          </button>
        ) : isCompleted ? (
          <button
            onClick={handleContinueCourse}
            className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Review Course
          </button>
        ) : (
          <button
            onClick={handleStartCourse}
            className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Start Course
          </button>
        )}
      </div>
    </div>
    </>
  )
}
