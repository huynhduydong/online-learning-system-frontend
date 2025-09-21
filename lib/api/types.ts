/**
 * API Types and Interfaces
 * Type definitions for API requests and responses
 */

// Base API Response
export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
  details?: Record<string, string[]>
}

// User Types
export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  full_name: string
  role: 'student' | 'instructor'
  is_active: boolean
  is_verified: boolean
  profile_image: string | null
  created_at: string
  confirmed_at: string | null
  last_login_at?: string
  last_activity_at?: string
}

// Authentication Types
export interface LoginRequest {
  email: string
  password: string
  remember_me?: boolean
}

// API Login Response (new structure)
export interface ApiLoginResponse {
  success: boolean
  message: string
  data: {
    access_token: string
    refresh_token: string
    user: {
      id: number
      email: string
      full_name: string
      avatar_url: string | null
      role: 'student' | 'instructor'
    }
  }
}

// Internal LoginResponse (for backward compatibility)
export interface LoginResponse {
  success: true
  message: string
  access_token: string
  refresh_token: string
  expires_in: number
  remember_me: boolean
  user: User
}

export interface RegisterRequest {
  email: string
  password: string
  first_name: string
  last_name: string
  role?: 'student' | 'instructor'
}

export interface RegisterResponse {
  success: true
  message: string
  access_token: string
  refresh_token: string
  expires_in: number
  remember_me: boolean
  user: User
}

export interface RefreshTokenResponse {
  success: true
  access_token: string
}

// Profile Types
export interface UserProfile extends User {
  total_enrollments: number
  completed_courses: number
  join_date: string
}

export interface UpdateProfileRequest {
  first_name?: string
  last_name?: string
}

export interface UpdateProfileResponse {
  success: true
  message: string
  profile: UserProfile
}

export interface UploadAvatarResponse {
  success: true
  message: string
  profile_image: string
}

// Dashboard Types
export interface DashboardStats {
  total_enrollments: number
  completed_courses: number
  in_progress_courses: number
  total_learning_time: number
}

export interface DashboardResponse {
  success: true
  dashboard: {
    user: User
    statistics: DashboardStats
    recent_courses: any[]
    achievements: any[]
  }
}

// Error Types
export interface ApiError {
  success: false
  error: string
  message?: string
  details?: Record<string, string[]>
}

// Email Confirmation Types
export interface ResendConfirmationRequest {
  email: string
}

export interface ConfirmEmailResponse {
  success: true
  message: string
}

// Validation Error Details
export interface ValidationErrors {
  [field: string]: string[]
}

// Course API Types (Updated for new API structure)

// Basic Course Types
export interface CourseCategory {
  id: number
  name: string
  slug?: string
  description?: string
  course_count?: number
}

export interface CourseInstructor {
  id: number
  name: string
  full_name?: string
  bio?: string
  avatar_url?: string | null
  total_students?: number
  total_courses?: number
}

export interface CoursePrice {
  amount: number
  display: string
  is_free: boolean
  original_price?: number
}

export interface CourseRating {
  average: number | null
  has_enough_ratings: boolean
  total_ratings: number
}

export interface CourseStats {
  duration_hours: number
  total_enrollments: number
  total_lessons: number
}

// Course Module/Lesson Structure
export interface CourseModule {
  id: number
  title: string
  order: number
  lessons_count: number
  duration_minutes: number
}

// Basic Course Interface
export interface Course {
  id: number
  title: string
  short_description: string
  slug: string
  thumbnail_url: string
  difficulty_level: "beginner" | "intermediate" | "advanced"
  language: string
  published_at: string
  category: CourseCategory
  instructor: CourseInstructor
  price: CoursePrice
  rating: CourseRating
  stats: CourseStats
}

// Detailed Course Interface (for single course endpoint)
export interface CourseDetails extends Course {
  description?: string
  long_description?: string
  level?: string
  duration_hours?: number
  total_students?: number
  total_reviews?: number
  last_updated?: string
  preview_video_url?: string
  is_free?: boolean
  requirements?: string[]
  what_you_will_learn?: string[]
  modules?: CourseModule[]
  created_at?: string
  updated_at?: string
}

// Search Course Interface
export interface SearchCourse extends Course {
  match_score?: number
}

// Course Pagination
export interface CoursePagination {
  current_page: number
  per_page: number
  total_pages: number
  total_items: number
  has_next: boolean
  has_previous: boolean
}

// Course Filters
export interface CourseFilters {
  [key: string]: any
}

// Catalog Data Structure
export interface CoursesData {
  courses: Course[]
  filters_applied: CourseFilters
  pagination: CoursePagination
  sort_by: string
}

// Search Data Structure
export interface SearchCoursesData {
  courses: SearchCourse[]
  pagination: CoursePagination
  search_query: string
}

// Free Courses Data Structure
export interface FreeCoursesData {
  courses: Course[]
  pagination: CoursePagination
}

// Course Review Types
export interface CourseReviewUser {
  id: number
  name: string
  avatar?: string | null
}

export interface CourseReview {
  id: number
  rating: number
  comment: string
  user: CourseReviewUser
  created_at: string
  updated_at: string
}

export interface CourseReviewsQueryParams {
  page?: number
  limit?: number
  rating?: number
  sort?: 'newest' | 'oldest' | 'rating_high' | 'rating_low'
}

export interface RatingDistribution {
  "5": number
  "4": number
  "3": number
  "2": number
  "1": number
}

export interface RatingSummary {
  average_rating: number
  total_reviews: number
  rating_distribution: RatingDistribution
}

export interface CourseReviewsData {
  reviews: CourseReview[]
  pagination: CoursePagination
  rating_summary: RatingSummary
}

// Similar Courses
export interface SimilarCourse extends Course {
  similarity_score: number
}

// Catalog Filters Response
export interface CatalogFiltersData {
  categories: CourseCategory[]
  levels: string[]
  price_range: {
    min: number
    max: number
  }
  instructors: CourseInstructor[]
}

// Similar Courses Types
export interface SimilarCoursesQueryParams {
  limit?: number
  level?: 'beginner' | 'intermediate' | 'advanced'
  category_id?: number
}

// Health Check Types
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  version: string
  environment: string
  services: {
    database: 'connected' | 'disconnected'
    cache: 'connected' | 'disconnected'
    external_apis: 'connected' | 'disconnected'
  }
  uptime: number
  memory_usage: {
    used: number
    total: number
    percentage: number
  }
  system_info: {
    node_version: string
    platform: string
    arch: string
  }
}

// API Response Types
export interface ApiCourseCatalogResponse {
  success: boolean
  message: string
  data: {
    courses: Course[]
    pagination: CoursePagination
    filters_applied: {
      category?: string
      difficulty?: string
      min_price?: number
      max_price?: number
      rating?: number
      sort_by?: string
      sort_order?: string
    }
  }
}

export interface ApiCourseSearchResponse {
  success: boolean
  message: string
  data: {
    courses: SearchCourse[]
    pagination: CoursePagination
    search_query: string
    filters_applied: {
      category?: string
      difficulty?: 'beginner' | 'intermediate' | 'advanced'
      min_price?: number
      max_price?: number
      rating?: number
      sort_by?: 'relevance' | 'newest' | 'popularity' | 'price' | 'rating'
      sort_order?: 'asc' | 'desc'
    }
  }
}

export interface ApiCoursesResponse {
  success: boolean
  message: string
  data: {
    success: boolean
    data: CoursesData
  }
}

export interface ApiCourseResponse {
  success: boolean
  message: string
  data: CourseDetails
}

export interface ApiSearchCoursesResponse {
  success: boolean
  message: string
  data: SearchCoursesData
}

export interface ApiFreeCoursesResponse {
  success: boolean
  message: string
  data: {
    courses: Course[]
    pagination: CoursePagination
    filters_applied: {
      category?: string
      difficulty?: 'beginner' | 'intermediate' | 'advanced'
      min_price?: number
      max_price?: number
      rating?: number
      sort?: 'newest' | 'oldest' | 'popular' | 'rating'
    }
  }
}

export interface ApiCategoriesResponse {
  success: boolean
  message: string
  data: CourseCategory[]
}

export interface ApiCatalogFiltersResponse {
  success: boolean
  message: string
  data: CatalogFiltersData
}

export interface ApiCourseReviewsResponse {
  success: boolean
  message: string
  data: {
    reviews: CourseReview[]
    pagination: CoursePagination
    rating_stats: {
      average: number
      total_count: number
      rating_distribution: {
        5: number
        4: number
        3: number
        2: number
        1: number
      }
    }
    filters_applied: {
      rating?: number
      sort?: string
    }
  }
}

export interface ApiSimilarCoursesResponse {
  success: boolean
  message: string
  data: {
    courses: SimilarCourse[]
    total_count: number
    filters_applied: {
      level?: string
      category_id?: number
      limit?: number
    }
    recommendation_algorithm: string
  }
}

export interface ApiPopularCoursesResponse {
  success: boolean
  message: string
  data: {
    courses: Course[]
    total_count: number
    filters_applied: {
      category?: string
      difficulty?: 'beginner' | 'intermediate' | 'advanced'
      min_price?: number
      max_price?: number
      rating?: number
      limit?: number
    }
  }
}

export interface ApiTopRatedCoursesResponse {
  success: boolean
  message: string
  data: {
    courses: Course[]
    total_count: number
    filters_applied: {
      category?: string
      difficulty?: 'beginner' | 'intermediate' | 'advanced'
      min_price?: number
      max_price?: number
      rating?: number
      limit?: number
    }
  }
}

export interface ApiHealthCheckResponse {
  success: boolean
  message: string
  data: {
    status: string
  }
}

export interface CategoryWithCount extends CourseCategory {
  course_count: number
}

export interface ApiCategoriesWithCountResponse {
  success: boolean
  message: string
  data: {
    categories: CategoryWithCount[]
    total_count: number
  }
}

// Query Parameters Types
export interface CourseCatalogQueryParams {
  page?: number
  per_page?: number
  category?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  min_price?: number
  max_price?: number
  rating?: number
  sort_by?: 'popularity' | 'price' | 'rating' | 'newest'
  sort_order?: 'asc' | 'desc'
}

export interface CourseSearchQueryParams {
  q: string
  page?: number
  per_page?: number
  category?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  min_price?: number
  max_price?: number
  rating?: number
  sort_by?: 'relevance' | 'newest' | 'popularity' | 'price' | 'rating'
  sort_order?: 'asc' | 'desc'
}

export interface PopularCoursesQueryParams {
  limit?: number
  category?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  min_price?: number
  max_price?: number
  rating?: number
}

export interface TopRatedCoursesQueryParams {
  limit?: number
  category?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  min_price?: number
  max_price?: number
  rating?: number
}

export interface FreeCoursesQueryParams {
  page?: number
  limit?: number
  category?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  min_price?: number
  max_price?: number
  rating?: number
  sort?: 'newest' | 'oldest' | 'popular' | 'rating'
}

export interface CourseCatalogParams {
  page?: number
  per_page?: number
  category?: string
  difficulty?: string
  min_price?: number
  max_price?: number
  rating?: number
  sort_by?: 'popularity' | 'price' | 'rating' | 'newest'
  sort_order?: 'asc' | 'desc'
}

// New API Catalog Response Structure (matches the new API format)
export interface NewApiCourseCatalogResponse {
  success: boolean
  message: string
  data: {
    courses: Course[]
    pagination: CoursePagination
    filters_applied: {
      category?: string
      difficulty?: string
      min_price?: number
      max_price?: number
      rating?: number
      sort_by?: string
      sort_order?: string
    }
  }
}

export interface CourseSearchParams {
  q: string
  page?: number
  per_page?: number
}

export interface CourseListParams {
  page?: number
  per_page?: number
  limit?: number
}