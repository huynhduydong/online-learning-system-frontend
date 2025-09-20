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