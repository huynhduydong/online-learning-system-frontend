/**
 * Lessons API Service
 * Handles lesson-related API calls
 */

import { apiClient } from './client'
import type { ApiResponse } from './types'

// Updated interfaces to match API documentation

export interface LessonContent {
    id: number
    title: string
    content_data: string | null
    file_url: string | null
    sort_order: number
}

export interface LessonProgress {
    status: 'not_started' | 'in_progress' | 'completed'
    completion_percentage: number
    watch_time_seconds: number
    is_completed: boolean
    started_at?: string
    completed_at?: string | null
    last_accessed_at?: string | null
}

export interface LessonDetails {
    id: number
    title: string
    description: string
    content_type: string
    duration_minutes: number
    sort_order: number
    is_preview: boolean
    contents: LessonContent[]
    progress: LessonProgress
}

export interface Module {
    id: number
    title: string
    sort_order: number
    lessons: LessonInModule[]
}

export interface LessonInModule {
    id: number
    title: string
    sort_order: number
    duration_minutes: number
    is_preview: boolean
    progress: LessonProgress
}

export interface CourseInfo {
    id: number
    title: string
    slug: string
    description: string
    thumbnail_url: string
    total_lessons: number
    duration_hours: number
    instructor: {
        id: number
        name: string
    }
}

export interface CourseProgressSummary {
    id: number
    completed_lessons: number
    total_lessons: number
    completion_percentage: number
    total_watch_time_seconds: number
    is_completed: boolean
    started_at: string
    last_accessed_at: string
}

export interface CourseWithLessons {
    course: CourseInfo
    progress: CourseProgressSummary
    modules: Module[]
}

export interface UserCourseProgress {
    course_progress: {
        id: number
        user_id: number
        course_id: number
        enrollment_id: string
        completed_lessons: number
        total_lessons: number
        completion_percentage: number
        total_watch_time_seconds: number
        is_completed: boolean
        started_at: string
        completed_at: string | null
        last_accessed_at: string
        created_at: string
        updated_at: string
    }
    modules: Module[]
    course: CourseInfo
}

export interface LessonProgressUpdate {
    id: number
    user_id: number
    lesson_id: number
    course_id: number
    status: 'not_started' | 'in_progress' | 'completed'
    watch_time_seconds: number
    completion_percentage: number
    is_completed: boolean
    started_at: string
    completed_at: string | null
    last_accessed_at: string
    created_at: string
    updated_at: string
}

class LessonsService {
    private client = apiClient

    /**
     * Maps API lesson response to internal LessonDetails format
     * @param data API response data
     * @returns Formatted lesson details
     */
    private mapLessonDetailsResponse(data: any): LessonDetails {
        return {
            id: data.id,
            title: data.title,
            description: data.description || '',
            content_type: data.content_type || 'video',
            duration_minutes: data.duration_minutes || 0,
            sort_order: data.sort_order || 0,
            is_preview: data.is_preview || false,
            contents: Array.isArray(data.contents) ? data.contents.map((content: any) => ({
                id: content.id,
                title: content.title || '',
                content_data: content.content_data,
                file_url: content.file_url,
                sort_order: content.sort_order || 0
            })) : [],
            progress: {
                status: data.progress?.status || 'not_started',
                completion_percentage: data.progress?.completion_percentage || 0,
                watch_time_seconds: data.progress?.watch_time_seconds || 0,
                is_completed: data.progress?.is_completed || false,
                started_at: data.progress?.started_at,
                completed_at: data.progress?.completed_at,
                last_accessed_at: data.progress?.last_accessed_at
            }
        };
    }

    /**
     * Get course with all lessons and modules
     * GET /api/courses/{courseSlug}/lessons
     */
    async getCourseWithLessons(courseSlug: string): Promise<CourseWithLessons> {
        try {
            // Thêm các tham số scope và page
            const queryParams = new URLSearchParams({
                scope: 'course',
                scope_id: courseSlug,
                page: '1',
                per_page: '50'
            }).toString()
            
            const response = await this.client.get<CourseWithLessons>(
                `/courses/${courseSlug}/lessons?${queryParams}`
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
     * Get specific lesson details with content and progress
     * GET /api/courses/{courseSlug}/lessons/{lessonId}
     */
    async getLessonDetails(courseSlug: string, lessonId: number): Promise<LessonDetails> {
        try {
            // Tạo URL với tham số query
            const baseUrl = `/courses/${courseSlug}/lessons/${lessonId}`;
            const params = new URLSearchParams({
                scope: 'lesson',
                scope_id: lessonId.toString(),
                page: '1',
                per_page: '20'
            });
            
            const url = `${baseUrl}?${params.toString()}`;
            console.log('Calling API with URL:', url);
            const response = await this.client.get<ApiLessonResponse>(url);

            if (response.success && response.data) {
                return this.mapLessonDetailsResponse(response.data);
            }

            throw new Error(response.error || 'Failed to fetch lesson details');
        } catch (error) {
            console.error('Get lesson details error:', error);
            throw error;
        }
    }

    /**
     * Mark lesson as completed (100%)
     * POST /api/courses/{courseSlug}/lessons/{lessonId}/complete
     */
    async markLessonComplete(courseSlug: string, lessonId: number): Promise<LessonProgressUpdate> {
        try {
            const response = await this.client.post<LessonProgressUpdate>(
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
     * Track lesson progress with watch time and completion percentage
     * POST /api/courses/{courseSlug}/lessons/{lessonId}/progress
     */
    async trackLessonProgress(
        courseSlug: string,
        lessonId: number,
        progressData: {
            watch_time?: number // in seconds
            completion_percentage?: number // 0-100
        }
    ): Promise<LessonProgressUpdate> {
        try {
            // Validate that at least one field is provided
            if (!progressData.watch_time && !progressData.completion_percentage) {
                throw new Error('Either watch_time or completion_percentage must be provided')
            }

            const response = await this.client.post<LessonProgressUpdate>(
                `/courses/${courseSlug}/lessons/${lessonId}/progress`,
                progressData
            )

            if (response.success && response.data) {
                return response.data
            }

            throw new Error(response.error || 'Failed to track lesson progress')
        } catch (error) {
            console.error('Track lesson progress error:', error)
            throw error
        }
    }

    /**
     * Get user's course progress with lesson breakdown
     * GET /api/users/me/courses/{courseSlug}/progress
     */
    async getUserCourseProgress(courseSlug: string): Promise<UserCourseProgress> {
        try {
            const response = await this.client.get<UserCourseProgress>(
                `/users/me/courses/${courseSlug}/progress`
            )

            if (response.success && response.data) {
                return response.data
            }

            throw new Error(response.error || 'Failed to fetch user course progress')
        } catch (error) {
            console.error('Get user course progress error:', error)
            throw error
        }
    }

    // Legacy methods for backward compatibility
    /**
     * @deprecated Use getLessonDetails instead
     */
    async getLesson(courseSlug: string, lessonId: string): Promise<any> {
        return this.getLessonDetails(courseSlug, parseInt(lessonId))
    }

    /**
     * @deprecated Use trackLessonProgress instead
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
            await this.trackLessonProgress(courseSlug, parseInt(lessonId), {
                completion_percentage: progressData.progress_percentage,
                watch_time: progressData.watch_time
            })
        } catch (error) {
            // Don't throw for progress tracking - it's not critical for legacy
            console.warn('Legacy progress tracking failed:', error)
        }
    }

    /**
     * @deprecated Use getUserCourseProgress instead
     */
    async getCourseProgress(courseSlug: string): Promise<any> {
        const userProgress = await this.getUserCourseProgress(courseSlug)
        return {
            course_progress: userProgress.course_progress.completion_percentage,
            completed_lessons: userProgress.course_progress.completed_lessons,
            total_lessons: userProgress.course_progress.total_lessons,
            current_lesson: null, // Not available in new API
            next_lesson: null // Not available in new API
        }
    }
}

export const lessonsService = new LessonsService()
