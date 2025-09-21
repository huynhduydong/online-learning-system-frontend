/**
 * Courses API Service
 * Handles all course-related API calls
 */

import { apiClient } from './client'
import type {
  ApiResponse,
  CourseDetails,
  ApiCourseDetailResponse,
  ApiCourseResponse,
  Course,
  ApiCourseCatalogResponse,
  CourseCatalogQueryParams,
  CourseSearchQueryParams,
  ApiCourseSearchResponse,
  PopularCoursesQueryParams,
  ApiPopularCoursesResponse,
  TopRatedCoursesQueryParams,
  ApiTopRatedCoursesResponse,
  FreeCoursesQueryParams,
  ApiFreeCoursesResponse,
  CourseCategory,
  ApiCategoriesResponse,
  CatalogFiltersData,
  ApiCatalogFiltersResponse,
  CourseReview,
  CourseReviewsQueryParams,
  ApiCourseReviewsResponse,
  SimilarCourse,
  SimilarCoursesQueryParams,
  ApiSimilarCoursesResponse
} from './types'

class CoursesService {
  private client = apiClient

  /**
   * Get course details by slug
   * Supports both new API structure and legacy format
   */
  async getCourseBySlug(slug: string): Promise<CourseDetails> {
    try {
      const response = await this.client.get<ApiCourseDetailResponse | ApiCourseResponse>(`/courses/${slug}`)

      if (response.success) {
        // Check if it's the new API structure with nested data
        if ('data' in response.data && typeof response.data.data === 'object') {
          // New API structure: { data: { data: CourseDetails, success: boolean } }
          const newApiResponse = response as ApiCourseDetailResponse
          return newApiResponse.data.data
        } else {
          // Legacy API structure: { data: CourseDetails }
          const legacyResponse = response as ApiCourseResponse
          return legacyResponse.data
        }
      } else {
        throw new Error(response.message || 'Failed to fetch course details')
      }
    } catch (error) {
      console.error('Course detail fetch error:', error)
      throw error
    }
  }

  /**
   * Get course catalog with filters and pagination
   */
  async getCourseCatalog(params?: CourseCatalogQueryParams): Promise<Course[]> {
    try {
      const queryString = params ? new URLSearchParams(params as any).toString() : ''
      const endpoint = `/courses/catalog${queryString ? `?${queryString}` : ''}`

      const response = await this.client.get<ApiCourseCatalogResponse>(endpoint)

      if (response.success && response.data) {
        return response.data.courses
      } else {
        throw new Error(response.message || 'Failed to fetch course catalog')
      }
    } catch (error) {
      console.error('Course catalog fetch error:', error)
      throw error
    }
  }

  /**
   * Search courses
   */
  async searchCourses(params: CourseSearchQueryParams): Promise<Course[]> {
    try {
      const queryString = new URLSearchParams(params as any).toString()
      const response = await this.client.get<ApiCourseSearchResponse>(`/courses/search?${queryString}`)

      if (response.success && response.data) {
        return response.data.courses
      } else {
        throw new Error(response.message || 'Failed to search courses')
      }
    } catch (error) {
      console.error('Course search error:', error)
      throw error
    }
  }

  /**
   * Get popular courses
   */
  async getPopularCourses(params?: PopularCoursesQueryParams): Promise<Course[]> {
    try {
      const queryString = params ? new URLSearchParams(params as any).toString() : ''
      const endpoint = `/courses/popular${queryString ? `?${queryString}` : ''}`

      const response = await this.client.get<ApiPopularCoursesResponse>(endpoint)

      if (response.success && response.data) {
        return response.data.courses
      } else {
        throw new Error(response.message || 'Failed to fetch popular courses')
      }
    } catch (error) {
      console.error('Popular courses fetch error:', error)
      throw error
    }
  }

  /**
   * Get top rated courses
   */
  async getTopRatedCourses(params?: TopRatedCoursesQueryParams): Promise<Course[]> {
    try {
      const queryString = params ? new URLSearchParams(params as any).toString() : ''
      const endpoint = `/courses/top-rated${queryString ? `?${queryString}` : ''}`

      const response = await this.client.get<ApiTopRatedCoursesResponse>(endpoint)

      if (response.success && response.data) {
        return response.data.courses
      } else {
        throw new Error(response.message || 'Failed to fetch top rated courses')
      }
    } catch (error) {
      console.error('Top rated courses fetch error:', error)
      throw error
    }
  }

  /**
   * Get free courses
   */
  async getFreeCourses(params?: FreeCoursesQueryParams): Promise<Course[]> {
    try {
      const queryString = params ? new URLSearchParams(params as any).toString() : ''
      const endpoint = `/courses/free${queryString ? `?${queryString}` : ''}`

      const response = await this.client.get<ApiFreeCoursesResponse>(endpoint)

      if (response.success && response.data) {
        return response.data.courses
      } else {
        throw new Error(response.message || 'Failed to fetch free courses')
      }
    } catch (error) {
      console.error('Free courses fetch error:', error)
      throw error
    }
  }

  /**
   * Get course categories
   */
  async getCategories(): Promise<CourseCategory[]> {
    try {
      const response = await this.client.get<ApiCategoriesResponse>('/courses/categories')

      if (response.success) {
        // Handle nested data structure from backend
        if (response.data && response.data.data) {
          return response.data.data
        } else if (response.data) {
          return response.data
        }
      }

      throw new Error(response.message || 'Failed to fetch categories')
    } catch (error) {
      console.error('Categories fetch error:', error)
      throw error
    }
  }

  /**
   * Get catalog filters
   */
  async getCatalogFilters(): Promise<CatalogFiltersData> {
    try {
      const response = await this.client.get<ApiCatalogFiltersResponse>('/courses/catalog/filters')

      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(response.message || 'Failed to fetch catalog filters')
      }
    } catch (error) {
      console.error('Catalog filters fetch error:', error)
      throw error
    }
  }

  /**
   * Get course reviews
   */
  async getCourseReviews(courseId: string, params?: CourseReviewsQueryParams): Promise<CourseReview[]> {
    try {
      const queryString = params ? new URLSearchParams(params as any).toString() : ''
      const endpoint = `/courses/${courseId}/reviews${queryString ? `?${queryString}` : ''}`

      const response = await this.client.get<ApiCourseReviewsResponse>(endpoint)

      if (response.success && response.data) {
        return response.data.reviews
      } else {
        throw new Error(response.message || 'Failed to fetch course reviews')
      }
    } catch (error) {
      console.error('Course reviews fetch error:', error)
      throw error
    }
  }

  /**
   * Get similar courses
   */
  async getSimilarCourses(courseId: string, params?: SimilarCoursesQueryParams): Promise<SimilarCourse[]> {
    try {
      const queryString = params ? new URLSearchParams(params as any).toString() : ''
      const endpoint = `/courses/${courseId}/similar${queryString ? `?${queryString}` : ''}`

      const response = await this.client.get<ApiSimilarCoursesResponse>(endpoint)

      if (response.success && response.data) {
        return response.data.courses
      } else {
        throw new Error(response.message || 'Failed to fetch similar courses')
      }
    } catch (error) {
      console.error('Similar courses fetch error:', error)
      throw error
    }
  }

  async getCoursesByCategory(slug: string, params?: CoursesQueryParams): Promise<{ courses: Course[], pagination: CoursePagination }> {
    try {
      const queryString = params ? new URLSearchParams(params as any).toString() : ''
      const endpoint = `/courses/categories/${slug}/courses${queryString ? `?${queryString}` : ''}`

      const response = await this.client.get<ApiCoursesResponse>(endpoint)

      if (response.success && response.data) {
        return {
          courses: response.data.courses,
          pagination: response.data.pagination
        }
      } else {
        throw new Error(response.message || 'Failed to fetch courses by category')
      }
    } catch (error) {
      console.error('Courses by category fetch error:', error)
      throw error
    }
  }
}

// Export singleton instance
export const coursesService = new CoursesService()
export default coursesService