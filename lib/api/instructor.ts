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

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {}

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
}

export const instructorService = new InstructorService()
export default instructorService
