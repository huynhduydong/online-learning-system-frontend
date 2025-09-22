/**
 * Custom hook for lesson management
 */

import { useState, useEffect, useCallback } from 'react'
import { lessonsService, type Lesson, type CourseWithLessons } from '@/lib/api/lessons'

interface UseLessonOptions {
    courseSlug: string
    lessonId: string
}

interface UseLessonReturn {
    // Data
    course: CourseWithLessons | null
    currentLesson: Lesson | null
    nextLesson: Lesson | null
    previousLesson: Lesson | null

    // States
    isLoading: boolean
    error: string | null
    isMarkingComplete: boolean

    // Actions
    markComplete: () => Promise<void>
    trackProgress: (progressPercentage: number, watchTime: number) => Promise<void>
    refreshData: () => Promise<void>
}

export function useLesson({ courseSlug, lessonId }: UseLessonOptions): UseLessonReturn {
    const [course, setCourse] = useState<CourseWithLessons | null>(null)
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isMarkingComplete, setIsMarkingComplete] = useState(false)

    // Fetch course and lesson data
    const fetchData = useCallback(async () => {
        if (!courseSlug || !lessonId) return

        setIsLoading(true)
        setError(null)

        try {
            // Fetch course with all lessons
            const courseData = await lessonsService.getCourseWithLessons(courseSlug)
            setCourse(courseData)

            // Find current lesson
            const lesson = courseData.lessons.find(l => l.id === lessonId)
            if (!lesson) {
                throw new Error('Lesson not found')
            }

            setCurrentLesson(lesson)

        } catch (err) {
            console.error('Failed to fetch lesson data:', err)
            setError(err instanceof Error ? err.message : 'Failed to load lesson')
        } finally {
            setIsLoading(false)
        }
    }, [courseSlug, lessonId])

    // Initial data fetch
    useEffect(() => {
        fetchData()
    }, [fetchData])

    // Get next lesson
    const nextLesson = course && currentLesson
        ? (() => {
            const currentIndex = course.lessons.findIndex(l => l.id === currentLesson.id)
            return currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1] : null
        })()
        : null

    // Get previous lesson
    const previousLesson = course && currentLesson
        ? (() => {
            const currentIndex = course.lessons.findIndex(l => l.id === currentLesson.id)
            return currentIndex > 0 ? course.lessons[currentIndex - 1] : null
        })()
        : null

    // Mark lesson as complete
    const markComplete = useCallback(async () => {
        if (!courseSlug || !lessonId || !currentLesson || currentLesson.is_completed) {
            return
        }

        setIsMarkingComplete(true)

        try {
            const result = await lessonsService.markLessonComplete(courseSlug, lessonId)

            // Update local state
            setCurrentLesson(prev => prev ? { ...prev, is_completed: true } : null)

            if (course) {
                setCourse(prev => prev ? {
                    ...prev,
                    completed_lessons: prev.completed_lessons + 1,
                    lessons: prev.lessons.map(lesson =>
                        lesson.id === lessonId
                            ? { ...lesson, is_completed: true }
                            : lesson
                    )
                } : null)
            }

            // Unlock next lesson if specified in response
            if (result.next_lesson && !result.next_lesson.is_locked && course) {
                setCourse(prev => prev ? {
                    ...prev,
                    lessons: prev.lessons.map(lesson =>
                        lesson.id === result.next_lesson?.id
                            ? { ...lesson, is_locked: false }
                            : lesson
                    )
                } : null)
            }

        } catch (err) {
            console.error('Failed to mark lesson complete:', err)
            setError(err instanceof Error ? err.message : 'Failed to mark lesson complete')
        } finally {
            setIsMarkingComplete(false)
        }
    }, [courseSlug, lessonId, currentLesson, course])

    // Track progress
    const trackProgress = useCallback(async (progressPercentage: number, watchTime: number) => {
        if (!courseSlug || !lessonId) return

        try {
            await lessonsService.trackProgress(courseSlug, lessonId, {
                progress_percentage: progressPercentage,
                watch_time: watchTime
            })
        } catch (err) {
            // Progress tracking failures are not critical
            console.warn('Progress tracking failed:', err)
        }
    }, [courseSlug, lessonId])

    // Refresh data
    const refreshData = useCallback(async () => {
        await fetchData()
    }, [fetchData])

    return {
        // Data
        course,
        currentLesson,
        nextLesson,
        previousLesson,

        // States
        isLoading,
        error,
        isMarkingComplete,

        // Actions
        markComplete,
        trackProgress,
        refreshData
    }
}
