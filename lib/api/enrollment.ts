/**
 * Course Enrollment API Service
 * Handles course registration, payment processing, and enrollment management
 */

import { apiClient } from './client'
import type { ApiResponse } from './types'

export interface EnrollmentRequest {
  course_id: string
  full_name: string
  email: string
  discount_code?: string
}

export interface PaymentRequest {
  enrollment_id: string
  payment_method: 'credit_card' | 'paypal' | 'bank_transfer'
  payment_details?: Record<string, any>
}

export interface EnrollmentStatus {
  id: string
  course_id: string
  user_id: number  // Backend uses number, not string
  status: 'pending' | 'payment_pending' | 'enrolled' | 'activating' | 'active' | 'cancelled'
  payment_status: 'pending' | 'completed' | 'failed' | 'cancelled'
  enrollment_date: string
  activation_date?: string | null
  payment_amount: number
  discount_applied?: number
  access_granted: boolean
  full_name: string          // Added in backend implementation
  email: string             // Added in backend implementation
  activation_attempts?: number  // Added for retry tracking
  max_retries?: number         // Added for retry tracking
  next_retry_at?: string      // Added for retry tracking
}

export interface EnrollmentResponse {
  enrollment: EnrollmentStatus
  payment_required: boolean
  payment_url?: string
  access_immediate?: boolean
}

export interface ActivationResponse {
  success: boolean
  access_granted: boolean
  first_lesson_url?: string
  retry_available?: boolean
  activation_time?: string
  estimated_completion?: string
  max_retries_reached?: boolean
  next_retry_available_at?: string
}

class EnrollmentService {
  private client = apiClient

  /**
   * Start course registration process
   * Handles both free and paid courses
   */
  async startRegistration(data: EnrollmentRequest): Promise<EnrollmentResponse> {
    try {
      const response = await this.client.post<ApiResponse<EnrollmentResponse>>(
        '/enrollments/register',
        data
      )

      if (response.success && response.data) {
        return response.data as unknown as EnrollmentResponse
      }

      throw new Error(response.error || 'Registration failed')
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  /**
   * Process payment for course enrollment
   */
  async processPayment(data: PaymentRequest): Promise<EnrollmentStatus> {
    try {
      const response = await this.client.post<ApiResponse<EnrollmentStatus>>(
        '/enrollments/payment',
        data
      )

      if (response.success && response.data) {
        return response.data as unknown as EnrollmentStatus
      }

      throw new Error(response.error || 'Payment processing failed')
    } catch (error) {
      console.error('Payment error:', error)
      throw error
    }
  }

  /**
   * Check enrollment status and activate access
   */
  async activateEnrollment(enrollmentId: string): Promise<ActivationResponse> {
    try {
      const response = await this.client.post<ApiResponse<ActivationResponse>>(
        `/enrollments/${enrollmentId}/activate`
      )

      if (response.success && response.data) {
        return response.data as unknown as ActivationResponse
      }

      throw new Error(response.error || 'Activation failed')
    } catch (error) {
      console.error('Activation error:', error)
      throw error
    }
  }

  /**
   * Get enrollment status by ID
   */
  async getEnrollmentStatus(enrollmentId: string): Promise<EnrollmentStatus> {
    try {
      const response = await this.client.get<ApiResponse<EnrollmentStatus>>(
        `/enrollments/${enrollmentId}`
      )

      if (response.success && response.data) {
        return response.data as unknown as EnrollmentStatus
      }

      throw new Error(response.error || 'Failed to get enrollment status')
    } catch (error) {
      console.error('Get enrollment status error:', error)
      throw error
    }
  }

  /**
   * Get user's enrolled courses
   */
  async getUserEnrollments(): Promise<EnrollmentStatus[]> {
    try {
      const response = await this.client.get<ApiResponse<EnrollmentStatus[]>>(
        '/enrollments/my-courses'
      )

      if (response.success && response.data) {
        return response.data as unknown as EnrollmentStatus[]
      }

      throw new Error(response.error || 'Failed to get enrollments')
    } catch (error) {
      console.error('Get user enrollments error:', error)
      throw error
    }
  }

  /**
   * Check if user has access to a specific course
   */
  async checkCourseAccess(courseId: string): Promise<{ hasAccess: boolean; enrollmentStatus?: EnrollmentStatus }> {
    try {
      const response = await this.client.get<ApiResponse<{ hasAccess: boolean; enrollmentStatus?: EnrollmentStatus }>>(
        `/enrollments/check-access/${courseId}`
      )

      if (response.success && response.data) {
        return response.data as unknown as { hasAccess: boolean; enrollmentStatus?: EnrollmentStatus }
      }

      return { hasAccess: false }
    } catch (error) {
      console.error('Check course access error:', error)
      return { hasAccess: false }
    }
  }

  /**
   * Retry enrollment activation (for failed/delayed activations)
   */
  async retryActivation(enrollmentId: string): Promise<ActivationResponse> {
    try {
      const response = await this.client.post<ApiResponse<ActivationResponse>>(
        `/enrollments/${enrollmentId}/retry-activation`
      )

      if (response.success && response.data) {
        return response.data as unknown as ActivationResponse
      }

      throw new Error(response.error || 'Retry activation failed')
    } catch (error) {
      console.error('Retry activation error:', error)
      throw error
    }
  }
}

export const enrollmentService = new EnrollmentService()
