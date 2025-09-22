/**
 * Lessons API Service
 * Handles lesson-related API calls
 */

import { apiClient } from './client'
import type { ApiResponse } from './types'

export interface LessonResource {
    id: string
    title: string
    type: 'pdf' | 'video' | 'link' | 'file'
    url: string
    size?: number
}

export interface Lesson {
    id: string
    title: string
    description: string
    video_url?: string
    duration: number // in seconds
    order: number
    is_completed: boolean
    is_locked: boolean
    content?: string
    resources?: LessonResource[]
}

export interface CourseWithLessons {
    id: string
    title: string
    slug: string
    instructor: {
        name: string
        avatar?: string
    }
    total_lessons: number
    completed_lessons: number
    lessons: Lesson[]
}

export interface LessonProgress {
    lesson_id: string
    is_completed: boolean
    completed_at?: string
    next_lesson?: {
        id: string
        title: string
        is_locked: boolean
    }
}

export interface CourseProgress {
    course_progress: number
    completed_lessons: number
    total_lessons: number
    current_lesson?: {
        id: string
        title: string
    }
    next_lesson?: {
        id: string
        title: string
    }
}

class LessonsService {
    private client = apiClient

    /**
     * Get course with all lessons
     */
    async getCourseWithLessons(courseSlug: string): Promise<CourseWithLessons> {
        try {
            const response = await this.client.get<CourseWithLessons>(
                `/courses/${courseSlug}/lessons`
            )

            if (response.success && response.data) {
                return response.data
            }

            throw new Error(response.error || 'Failed to fetch course lessons')
        } catch (error) {
            console.error('Get course lessons error:', error)
            throw error
        }
    }

    /**
     * Get specific lesson details
     */
    async getLesson(courseSlug: string, lessonId: string): Promise<Lesson> {
        try {
            const response = await this.client.get<Lesson>(
                `/courses/${courseSlug}/lessons/${lessonId}`
            )

            if (response.success && response.data) {
                return response.data
            }

            throw new Error(response.error || 'Failed to fetch lesson')
        } catch (error) {
            console.error('Get lesson error:', error)
            throw error
        }
    }

    /**
     * Mark lesson as completed
     */
    async markLessonComplete(courseSlug: string, lessonId: string): Promise<LessonProgress> {
        try {
            const response = await this.client.post<LessonProgress>(
                `/courses/${courseSlug}/lessons/${lessonId}/complete`
            )

            if (response.success && response.data) {
                return response.data
            }

            throw new Error(response.error || 'Failed to mark lesson complete')
        } catch (error) {
            console.error('Mark lesson complete error:', error)
            throw error
        }
    }

    /**
     * Track lesson progress/watch time
     */
    async trackProgress(
        courseSlug: string,
        lessonId: string,
        progressData: {
            progress_percentage: number
            watch_time: number
        }
    ): Promise<void> {
        try {
            const response = await this.client.post<void>(
                `/courses/${courseSlug}/lessons/${lessonId}/progress`,
                progressData
            )

            if (!response.success) {
                throw new Error(response.error || 'Failed to track progress')
            }
        } catch (error) {
            console.error('Track progress error:', error)
            // Don't throw for progress tracking - it's not critical
        }
    }

    /**
     * Get user's course progress
     */
    async getCourseProgress(courseSlug: string): Promise<CourseProgress> {
        try {
            const response = await this.client.get<CourseProgress>(
                `/users/me/courses/${courseSlug}/progress`
            )

            if (response.success && response.data) {
                return response.data
            }

            throw new Error(response.error || 'Failed to fetch course progress')
        } catch (error) {
            console.error('Get course progress error:', error)
            throw error
        }
    }
}

export const lessonsService = new LessonsService()
