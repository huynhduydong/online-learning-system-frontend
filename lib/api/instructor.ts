/**
 * Instructor API Service
 * Handles all instructor-related API calls
 */

import { apiClient } from './client'
import type { ApiResponse } from './types'

// Instructor-specific types
export interface InstructorCourse {
  id: number
  title: string
  short_description: string
  slug: string
  status: 'draft' | 'published' | 'archived'
  language: string
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  category: {
    id: number
    name: string
    slug: string
  } | null
  price: {
    amount: number
    is_free: boolean
    currency: string
  }
  thumbnail_url: string | null
  stats: {
    total_enrollments: number
    total_lessons: number
    duration_hours: number
  }
  created_at: string
  updated_at: string
  published_at: string | null
}

export interface InstructorCoursesResponse extends ApiResponse {
  data: {
    courses: InstructorCourse[]
    pagination: {
      current_page: number
      per_page: number
      total: number
      total_pages: number
      has_next: boolean
      has_prev: boolean
    }
  }
}

export interface InstructorCourseDetailResponse extends ApiResponse {
  data: InstructorCourse & {
    description?: string
    preview_video_url?: string | null
    requirements?: string[]
    what_you_will_learn?: string[]
    tags?: string[]
  }
}

export interface CreateCourseRequest {
  title: string
  short_description: string
  slug?: string
  language?: string
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced'
  category_id?: number
  price?: number
  is_free?: boolean
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> { }

export interface CourseActionResponse extends ApiResponse {
  data: {
    id: number
    status: string
    published_at?: string | null
    public_url?: string
  }
}

export interface InstructorCoursesParams {
  page?: number
  per_page?: number
  status?: 'draft' | 'published' | 'all'
  sort_by?: 'created_at' | 'updated_at' | 'title'
  sort_order?: 'asc' | 'desc'
}

export interface InstructorStats {
  total_courses: number
  published_courses: number
  draft_courses: number
  total_students: number
  total_revenue: number
  this_month_revenue: number
  avg_rating: number
  total_reviews: number
}

export interface InstructorStatsResponse extends ApiResponse {
  data: InstructorStats
}

// Module and Lesson Management Types
export interface InstructorModule {
  id: number
  title: string
  description?: string
  order: number
  course_id: number
  lessons: InstructorLesson[]
  created_at: string
  updated_at: string
}

export interface InstructorLesson {
  id: number
  title: string
  description?: string
  duration_minutes: number
  order: number
  module_id: number
  content_type: 'video' | 'text' | 'quiz'
  video_url?: string
  content_data?: any
  /**
   * Indicates if the lesson is available as a preview (API field).
   * The API provides `is_preview` to mark lessons that can be viewed before enrollment.
   * The frontend expects `is_published` to indicate if the lesson is visible to users.
   * These fields may overlap in meaning, but both are present for compatibility.
   * When mapping data, ensure to translate `is_preview` from the API to `is_published` for frontend use.
   */
  is_preview?: boolean    // API actual field
  is_published?: boolean  // Frontend expected field
  created_at: string
  updated_at: string
}

export interface CreateModuleRequest {
  title: string
  description?: string
  order?: number
}

export interface UpdateModuleRequest extends Partial<CreateModuleRequest> { }

export interface CreateLessonRequest {
  title: string
  description?: string
  duration_minutes: number
  order?: number
  content_type: 'video' | 'text' | 'quiz'
  video_url?: string
  content_data?: any
}

export interface UpdateLessonRequest extends Partial<CreateLessonRequest> { }

export interface CourseModulesResponse extends ApiResponse {
  data: InstructorModule[]
}

export interface ModuleResponse extends ApiResponse {
  data: InstructorModule
}

export interface LessonResponse extends ApiResponse {
  data: InstructorLesson
}

export interface ModuleLessonsResponse extends ApiResponse {
  data: InstructorLesson[]
}

class InstructorService {
  private client = apiClient

  /**
   * Get instructor's courses
   */
  async getCourses(params: InstructorCoursesParams = {}): Promise<InstructorCoursesResponse> {
    const queryParams = new URLSearchParams()

    if (params.page) queryParams.append('page', params.page.toString())
    if (params.per_page) queryParams.append('per_page', params.per_page.toString())
    if (params.status) queryParams.append('status', params.status)
    if (params.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params.sort_order) queryParams.append('sort_order', params.sort_order)

    const query = queryParams.toString()
    const url = `/instructor/courses${query ? `?${query}` : ''}`

    return this.client.get<InstructorCoursesResponse>(url)
  }

  /**
   * Get single course details
   */
  async getCourse(id: number): Promise<InstructorCourseDetailResponse> {
    return this.client.get<InstructorCourseDetailResponse>(`/instructor/courses/${id}`)
  }

  /**
   * Create new course
   */
  async createCourse(data: CreateCourseRequest): Promise<InstructorCourseDetailResponse> {
    return this.client.post<InstructorCourseDetailResponse>('/instructor/courses', data)
  }

  /**
   * Update existing course
   */
  async updateCourse(id: number, data: UpdateCourseRequest): Promise<InstructorCourseDetailResponse> {
    return this.client.put<InstructorCourseDetailResponse>(`/instructor/courses/${id}`, data)
  }

  /**
   * Publish course
   */
  async publishCourse(id: number): Promise<CourseActionResponse> {
    return this.client.post<CourseActionResponse>(`/instructor/courses/${id}/publish`, {})
  }

  /**
   * Unpublish course
   */
  async unpublishCourse(id: number): Promise<CourseActionResponse> {
    return this.client.post<CourseActionResponse>(`/instructor/courses/${id}/unpublish`, {})
  }

  /**
   * Delete course
   */
  async deleteCourse(id: number): Promise<ApiResponse> {
    return this.client.delete<ApiResponse>(`/instructor/courses/${id}`)
  }

  /**
   * Duplicate course
   */
  async duplicateCourse(id: number): Promise<InstructorCourseDetailResponse> {
    return this.client.post<InstructorCourseDetailResponse>(`/instructor/courses/${id}/duplicate`, {})
  }

  /**
   * Get instructor statistics
   */
  async getCourseStats(): Promise<InstructorStatsResponse> {
    return this.client.get<InstructorStatsResponse>('/instructor/stats')
  }

  /**
   * Get categories for course creation
   */
  async getCategories(): Promise<ApiResponse<Array<{ id: number; name: string; slug: string; description?: string }>>> {
    return this.client.get<ApiResponse<Array<{ id: number; name: string; slug: string; description?: string }>>>('/courses/categories')
  }

  /**
   * Get languages for course creation
   */
  async getLanguages(): Promise<ApiResponse<Array<{ code: string; name: string }>>> {
    return this.client.get<ApiResponse<Array<{ code: string; name: string }>>>('/courses/languages')
  }

  // ===== MODULE MANAGEMENT =====

  /**
   * Get all modules for a course
   */
  async getCourseModules(courseId: number): Promise<CourseModulesResponse> {
    return this.client.get<CourseModulesResponse>(`/instructor/courses/${courseId}/modules`)
  }

  /**
   * Create new module
   */
  async createModule(courseId: number, data: CreateModuleRequest): Promise<ModuleResponse> {
    return this.client.post<ModuleResponse>(`/instructor/courses/${courseId}/modules`, data)
  }

  /**
   * Update existing module
   */
  async updateModule(courseId: number, moduleId: number, data: UpdateModuleRequest): Promise<ModuleResponse> {
    return this.client.put<ModuleResponse>(`/instructor/courses/${courseId}/modules/${moduleId}`, data)
  }

  /**
   * Delete module
   */
  async deleteModule(courseId: number, moduleId: number): Promise<ApiResponse> {
    return this.client.delete<ApiResponse>(`/instructor/courses/${courseId}/modules/${moduleId}`)
  }

  /**
   * Reorder modules
   */
  async reorderModules(courseId: number, moduleIds: number[]): Promise<ApiResponse> {
    return this.client.post<ApiResponse>(`/instructor/courses/${courseId}/modules/reorder`, {
      module_ids: moduleIds
    })
  }

  // ===== LESSON MANAGEMENT =====

  /**
   * Get all lessons for a module
   */
  async getModuleLessons(courseId: number, moduleId: number): Promise<ModuleLessonsResponse> {
    return this.client.get<ModuleLessonsResponse>(`/instructor/courses/${courseId}/modules/${moduleId}/lessons`)
  }

  /**
   * Create new lesson in module
   */
  async createLesson(courseId: number, moduleId: number, data: CreateLessonRequest): Promise<LessonResponse> {
    return this.client.post<LessonResponse>(`/instructor/courses/${courseId}/modules/${moduleId}/lessons`, data)
  }

  /**
   * Update existing lesson
   */
  async updateLesson(courseId: number, moduleId: number, lessonId: number, data: UpdateLessonRequest): Promise<LessonResponse> {
    return this.client.put<LessonResponse>(`/instructor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, data)
  }

  /**
   * Delete lesson
   */
  async deleteLesson(courseId: number, moduleId: number, lessonId: number): Promise<ApiResponse> {
    return this.client.delete<ApiResponse>(`/instructor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`)
  }

  /**
   * Reorder lessons within module
   */
  async reorderLessons(courseId: number, moduleId: number, lessonIds: number[]): Promise<ApiResponse> {
    return this.client.post<ApiResponse>(`/instructor/courses/${courseId}/modules/${moduleId}/lessons/reorder`, {
      lesson_ids: lessonIds
    })
  }

  /**
   * Publish/Unpublish lesson
   */
  async toggleLessonPublish(courseId: number, moduleId: number, lessonId: number, isPublished: boolean): Promise<LessonResponse> {
    const action = isPublished ? 'publish' : 'unpublish'
    return this.client.post<LessonResponse>(`/instructor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/${action}`, {})
  }
}

export const instructorService = new InstructorService()
export default instructorService
