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
  email?: string
  full_name?: string
  bio?: string
  avatar_url?: string | null
  avatar?: string
  total_students?: number
  total_courses?: number
}

export interface CoursePrice {
  /**
   * The current price of the course (use current_price).
   * 'amount' is deprecated; use 'current_price' instead.
   */
  current_price?: number
  original_price?: number
  display?: string
  is_free?: boolean
}

export interface CourseRating {
  average: number | null
  count?: number
  total_ratings?: number
  has_enough_ratings?: boolean
}

export interface CourseStats {
  duration_hours?: number
  students_count?: number
  lessons_count?: number
  total_enrollments?: number
  total_lessons?: number
  level?: string
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
  preview_video_url?: string | null
  is_free?: boolean
  requirements?: string[]
  what_you_will_learn?: string[]
  modules?: CourseModule[]
  tags?: string[] | null
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
  pages: number
  total: number
  has_next: boolean
  has_prev: boolean
  next_page: number | null
  prev_page: number | null
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

// New API Course Detail Response (with nested data structure)
export interface ApiCourseDetailResponse {
  success: boolean
  message: string
  data: {
    data: CourseDetails
    success: boolean
  }
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
    total_courses?: number
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

// Query params for courses by category
export interface CoursesQueryParams {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
}

// API response for courses by category
export interface ApiCoursesByCategoryResponse {
  success: boolean
  message: string
  data: {
    success: boolean
    data: {
      category: CourseCategory & {
        icon?: string
      }
      courses: Course[]
      pagination: CoursePagination
    }
  }
}

// ===== Q&A SYSTEM TYPES =====

// Q&A Types
export type QuestionStatus = 'new' | 'in_progress' | 'answered' | 'closed'

// Question Categories
export type QuestionCategory =
  | 'general'             // Câu hỏi chung
  | 'technical'           // Câu hỏi kỹ thuật
  | 'technical_question'  // Câu hỏi kỹ thuật (new API format)
  | 'course'              // Câu hỏi về khóa học
  | 'course_content'      // Nội dung khóa học
  | 'assignment'          // Câu hỏi về bài tập
  | 'assignment_help'     // Hỗ trợ bài tập
  | 'general_discussion'  // Thảo luận chung
  | 'lesson_content'      // Nội dung bài học
  | 'technical_issue'     // Vấn đề kỹ thuật
  | 'administrative'      // Thủ tục hành chính
  | 'support_request'     // Yêu cầu hỗ trợ
  | 'bug_report'          // Báo cáo lỗi hệ thống

// Question scope enum
export type QuestionScope = 'course' | 'chapter' | 'lesson' | 'quiz' | 'assignment'

// User role for Q&A permissions
export type QAUserRole = 'student' | 'instructor' | 'ta' | 'admin' | 'guest'

// Base user interface for Q&A
export interface QAUser {
  id: number
  full_name?: string
  name?: string // For backward compatibility with new API format
  email?: string
  avatar_url?: string | null
  role?: QAUserRole
}

// Question tag interface
export interface QuestionTag {
  id: number
  name: string
  color?: string
  description?: string
  usage_count?: number
}

// Question attachment interface
export interface QuestionAttachment {
  id: number
  filename: string
  original_filename: string
  file_url: string
  file_size: number
  file_type: string
  uploaded_at: string
}

// Question vote interface
export interface QuestionVote {
  id: number
  user_id: number
  question_id: number
  vote_type: 'up' | 'down'
  created_at: string
}

// Answer vote interface
export interface AnswerVote {
  id: number
  user_id: number
  answer_id: number
  vote_type: 'up' | 'down'
  created_at: string
}

// Question interface
export interface Question {
  id: number
  title: string
  content: string
  status: QuestionStatus
  category: QuestionCategory
  scope: QuestionScope
  scope_id?: number // ID of course/chapter/lesson/quiz/assignment
  scope_title?: string // Title of the scope item
  is_pinned: boolean
  is_featured: boolean
  view_count: number
  vote_score: number
  answer_count: number
  accepted_answer_id?: number | null
  author: QAUser
  tags: QuestionTag[] | string[] // Support both tag objects and string arrays
  attachments: QuestionAttachment[]
  created_at: string
  updated_at: string
  last_activity_at: string
  // User interaction data
  user_vote?: 'up' | 'down' | null
  is_following?: boolean
}

// Answer interface
export interface Answer {
  id: number
  question_id: number
  content: string
  is_accepted: boolean
  is_pinned: boolean
  vote_score: number
  comment_count: number
  author: QAUser
  attachments: QuestionAttachment[]
  created_at: string
  updated_at: string
  // User interaction data
  user_vote?: 'up' | 'down' | null
}

// Comment interface
export interface Comment {
  id: number
  content: string
  commentable_type: 'question' | 'answer'
  commentable_id: number
  parent_id?: number | null // For nested comments
  author: QAUser
  mentions: QAUser[] // Users mentioned in the comment
  created_at: string
  updated_at: string
  // Nested comments
  replies?: Comment[]
  reply_count?: number
}

// Question with answers and comments
export interface QuestionDetail extends Question {
  answers: Answer[]
  comments: Comment[]
  related_questions?: Question[]
}

// Question creation request
export interface CreateQuestionRequest {
  title: string
  content: string
  category: QuestionCategory
  scope: QuestionScope
  scope_id?: number
  tag_ids?: number[]
  tags?: string[] // For backward compatibility with tag names
  attachments?: File[]
}

// Question update request
export interface UpdateQuestionRequest {
  title?: string
  content?: string
  category?: QuestionCategory
  status?: QuestionStatus
  tag_ids?: number[]
  is_pinned?: boolean
  is_featured?: boolean
}

// Answer creation request
export interface CreateAnswerRequest {
  question_id: number
  content: string
  attachments?: File[] // Note: Not supported in current API implementation
}

// Answer update request
export interface UpdateAnswerRequest {
  content?: string
  is_pinned?: boolean
}

// Comment creation request
export interface CreateCommentRequest {
  content: string
  commentable_type: 'question' | 'answer'
  commentable_id: number
  parent_id?: number
  mentioned_user_ids?: number[]
}

// Vote request
export interface VoteRequest {
  vote_type: 'up' | 'down'
}

// Question search and filter params
export interface QuestionQueryParams {
  page?: number
  per_page?: number
  q?: string // Search query
  status?: QuestionStatus[] | QuestionStatus
  category?: QuestionCategory[] | QuestionCategory
  scope?: QuestionScope[] | QuestionScope
  scope_id?: number
  tag_ids?: number[]
  author_id?: number
  sort_by?: 'newest' | 'oldest' | 'most_votes' | 'most_answers' | 'most_views' | 'last_activity'
  sort_order?: 'asc' | 'desc'
  unanswered_only?: boolean
  pinned_only?: boolean
  featured_only?: boolean
}

// Question statistics
export interface QuestionStats {
  total_questions: number
  answered_questions: number
  unanswered_questions: number
  questions_by_status: Record<QuestionStatus, number>
  questions_by_category: Record<QuestionCategory, number>
  top_tags: Array<{
    tag: QuestionTag
    question_count: number
  }>
  most_active_users: Array<{
    user: QAUser
    question_count: number
    answer_count: number
  }>
}

// Pagination for Q&A
export interface QAPagination {
  current_page?: number
  page?: number
  per_page?: number
  limit?: number
  total: number
  total_pages?: number
  totalPages?: number
  has_next?: boolean
  has_prev?: boolean
  next_page?: number | null
  prev_page?: number | null
}

// API Response interfaces for Q&A

// API Response for Questions (new format with nested data structure)
export interface ApiQuestionsResponse {
  success: boolean
  message: string
  data: {
    data: Question[] // Nested array of questions
    pagination: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
  }
}

// Legacy API Response for Questions (for backward compatibility)
export interface LegacyApiQuestionsResponse {
  success: boolean
  message: string
  data: {
    questions: Question[]
    pagination: QAPagination
    filters_applied?: QuestionQueryParams
    stats?: QuestionStats
  }
  pagination?: QAPagination
}

export interface ApiQuestionResponse {
  success: boolean
  message: string
  data: Question
}

export interface ApiCreateQuestionResponse {
  success: boolean
  message: string
  data: Question
}

export interface ApiAnswersResponse {
  success: boolean
  message: string
  data: {
    answers: Answer[]
    pagination: QAPagination
  }
}

export interface ApiAnswerResponse {
  success: boolean
  message: string
  data: Answer
}

export interface ApiCreateAnswerResponse {
  success: boolean
  message: string
  data: Answer
}

export interface ApiCommentsResponse {
  success: boolean
  message: string
  data: {
    comments: Comment[]
    pagination: QAPagination
  }
}

export interface ApiCommentResponse {
  success: boolean
  message: string
  data: Comment
}

export interface ApiCreateCommentResponse {
  success: boolean
  message: string
  data: Comment
}

export interface ApiVoteResponse {
  success: boolean
  message: string
  data: {
    vote_score: number
    user_vote: 'up' | 'down' | null
  }
}

export interface ApiTagsResponse {
  success: boolean
  message: string
  data: {
    tags: QuestionTag[]
    pagination?: QAPagination
  }
}

export interface ApiQuestionStatsResponse {
  success: boolean
  message: string
  data: QuestionStats
}

// Notification types for Q&A
export interface QANotification {
  id: number
  type: 'new_answer' | 'answer_accepted' | 'question_mentioned' | 'answer_mentioned' | 'comment_reply' | 'question_status_changed'
  title: string
  message: string
  data: {
    question_id?: number
    answer_id?: number
    comment_id?: number
    user_id?: number
  }
  is_read: boolean
  created_at: string
}

export interface ApiNotificationsResponse {
  success: boolean
  message: string
  data: {
    notifications: QANotification[]
    pagination: QAPagination
    unread_count: number
  }
}