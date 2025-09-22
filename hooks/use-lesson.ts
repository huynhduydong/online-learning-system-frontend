/**
 * Custom hook for lesson management with new API integration
 */

import { useState, useEffect, useCallback } from 'react'
import {
    lessonsService,
    type CourseWithLessons,
    type LessonDetails,
    type LessonInModule,
    type Module
} from '@/lib/api/lessons'

interface UseLessonOptions {
    courseSlug: string
    lessonId: string | number
}

interface UseLessonReturn {
    // Data
    course: CourseWithLessons | null
    currentLesson: LessonDetails | null
    nextLesson: LessonInModule | null
    previousLesson: LessonInModule | null
    currentModule: Module | null

    // States
    isLoading: boolean
    error: string | null
    isMarkingComplete: boolean
    isTrackingProgress: boolean

    // Actions
    markComplete: () => Promise<void>
    trackProgress: (progressPercentage?: number, watchTime?: number) => Promise<void>
    refreshData: () => Promise<void>
    refreshLessonDetails: () => Promise<void>
}

export function useLesson({ courseSlug, lessonId }: UseLessonOptions): UseLessonReturn {
    const [course, setCourse] = useState<CourseWithLessons | null>(null)
    const [currentLesson, setCurrentLesson] = useState<LessonDetails | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isMarkingComplete, setIsMarkingComplete] = useState(false)
    const [isTrackingProgress, setIsTrackingProgress] = useState(false)

    // Convert lessonId to number
    const numericLessonId = typeof lessonId === 'string' ? parseInt(lessonId) : lessonId

    // Fetch course with all lessons and modules
    const fetchCourseData = useCallback(async () => {
        if (!courseSlug) return

        try {
            const courseData = await lessonsService.getCourseWithLessons(courseSlug)
            setCourse(courseData)
            return courseData
        } catch (err) {
            console.error('Failed to fetch course data:', err)
            throw err
        }
    }, [courseSlug])

    // Fetch specific lesson details
    const fetchLessonDetails = useCallback(async () => {
        if (!courseSlug || !numericLessonId) return

        try {
            const lessonData = await lessonsService.getLessonDetails(courseSlug, numericLessonId)
            setCurrentLesson(lessonData)
            return lessonData
        } catch (err) {
            console.error('Failed to fetch lesson details:', err)
            throw err
        }
    }, [courseSlug, numericLessonId])

    // Fetch all data
    const fetchData = useCallback(async () => {
        if (!courseSlug || !numericLessonId) return

        setIsLoading(true)
        setError(null)

        try {
            // Fetch course data and lesson details in parallel
            const [courseData] = await Promise.all([
                fetchCourseData(),
                fetchLessonDetails()
            ])

            // Verify lesson exists in course
            const lessonExists = courseData?.modules.some(module =>
                module.lessons.some(lesson => lesson.id === numericLessonId)
            )

            if (!lessonExists) {
                throw new Error('Lesson not found in this course')
            }

        } catch (err) {
            console.error('Failed to fetch lesson data:', err)
            setError(err instanceof Error ? err.message : 'Failed to load lesson')
        } finally {
            setIsLoading(false)
        }
    }, [courseSlug, numericLessonId, fetchCourseData, fetchLessonDetails])

    // Initial data fetch
    useEffect(() => {
        fetchData()
    }, [fetchData])

    // Find current module containing this lesson
    const currentModule = course?.modules.find(module =>
        module.lessons.some(lesson => lesson.id === numericLessonId)
    ) || null

    // Get all lessons in order across all modules
    const allLessons = course?.modules.flatMap(module => module.lessons) || []

    // Get next lesson
    const nextLesson = (() => {
        if (!course || !numericLessonId) return null
        const currentIndex = allLessons.findIndex(l => l.id === numericLessonId)
        return currentIndex >= 0 && currentIndex < allLessons.length - 1
            ? allLessons[currentIndex + 1]
            : null
    })()

    // Get previous lesson
    const previousLesson = (() => {
        if (!course || !numericLessonId) return null
        const currentIndex = allLessons.findIndex(l => l.id === numericLessonId)
        return currentIndex > 0 ? allLessons[currentIndex - 1] : null
    })()

    // Mark lesson as complete
    const markComplete = useCallback(async () => {
        if (!courseSlug || !numericLessonId || !currentLesson || currentLesson.progress.is_completed) {
            return
        }

        setIsMarkingComplete(true)

        try {
            const result = await lessonsService.markLessonComplete(courseSlug, numericLessonId)

            // Update current lesson progress
            setCurrentLesson(prev => prev ? {
                ...prev,
                progress: {
                    ...prev.progress,
                    status: 'completed',
                    completion_percentage: 100,
                    is_completed: true,
                    completed_at: result.completed_at || new Date().toISOString()
                }
            } : null)

            // Update course progress
            if (course) {
                setCourse(prev => prev ? {
                    ...prev,
                    progress: {
                        ...prev.progress,
                        completed_lessons: prev.progress.completed_lessons + 1,
                        completion_percentage: ((prev.progress.completed_lessons + 1) / prev.progress.total_lessons) * 100
                    },
                    modules: prev.modules.map(module => ({
                        ...module,
                        lessons: module.lessons.map(lesson =>
                            lesson.id === numericLessonId
                                ? {
                                    ...lesson,
                                    progress: {
                                        ...lesson.progress,
                                        status: 'completed',
                                        completion_percentage: 100,
                                        is_completed: true
                                    }
                                }
                                : lesson
                        )
                    }))
                } : null)
            }

        } catch (err) {
            console.error('Failed to mark lesson complete:', err)
            setError(err instanceof Error ? err.message : 'Failed to mark lesson complete')
        } finally {
            setIsMarkingComplete(false)
        }
    }, [courseSlug, numericLessonId, currentLesson, course])

    // Track progress
    const trackProgress = useCallback(async (progressPercentage?: number, watchTime?: number) => {
        if (!courseSlug || !numericLessonId) return
        if (!progressPercentage && !watchTime) return

        setIsTrackingProgress(true)

        try {
            const result = await lessonsService.trackLessonProgress(courseSlug, numericLessonId, {
                completion_percentage: progressPercentage,
                watch_time: watchTime
            })

            // Update current lesson progress
            setCurrentLesson(prev => prev ? {
                ...prev,
                progress: {
                    ...prev.progress,
                    status: result.status,
                    completion_percentage: result.completion_percentage,
                    watch_time_seconds: result.watch_time_seconds,
                    is_completed: result.is_completed,
                    last_accessed_at: result.last_accessed_at
                }
            } : null)

            // Update course progress if lesson became completed
            if (result.is_completed && course && !currentLesson?.progress.is_completed) {
                setCourse(prev => prev ? {
                    ...prev,
                    progress: {
                        ...prev.progress,
                        completed_lessons: prev.progress.completed_lessons + 1,
                        completion_percentage: ((prev.progress.completed_lessons + 1) / prev.progress.total_lessons) * 100
                    }
                } : null)
            }

        } catch (err) {
            // Progress tracking failures are not critical
            console.warn('Progress tracking failed:', err)
        } finally {
            setIsTrackingProgress(false)
        }
    }, [courseSlug, numericLessonId, course, currentLesson])

    // Refresh course data
    const refreshData = useCallback(async () => {
        await fetchData()
    }, [fetchData])

    // Refresh only lesson details
    const refreshLessonDetails = useCallback(async () => {
        try {
            await fetchLessonDetails()
        } catch (err) {
            console.error('Failed to refresh lesson details:', err)
        }
    }, [fetchLessonDetails])

    return {
        // Data
        course,
        currentLesson,
        nextLesson,
        previousLesson,
        currentModule,

        // States
        isLoading,
        error,
        isMarkingComplete,
        isTrackingProgress,

        // Actions
        markComplete,
        trackProgress,
        refreshData,
        refreshLessonDetails
    }
}
