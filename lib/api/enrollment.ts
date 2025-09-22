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
      console.log('Enrollment request data:', data)

      const response = await this.client.post<ApiResponse<EnrollmentResponse>>(
        '/enrollments/register',
        data
      )

      console.log('Raw enrollment response:', response)

      if (response.success) {
        // Handle the specific API response structure where enrollment data is in 'message'
        let enrollmentData: any = null

        if (response.message && typeof response.message === 'object') {
          // Data is in response.message
          enrollmentData = response.message
        } else if (response.data && typeof response.data === 'object') {
          // Fallback: data might be in response.data
          enrollmentData = response.data
        }

        // Validate the response structure
        if (!enrollmentData || typeof enrollmentData !== 'object') {
          throw new Error('Invalid enrollment response structure')
        }

        // Check if it has the expected enrollment structure
        if (enrollmentData.enrollment && enrollmentData.enrollment.id) {
          return enrollmentData as EnrollmentResponse
        }

        // Check if it's double-wrapped (data.data structure)
        if ('data' in enrollmentData && typeof enrollmentData.data === 'object') {
          return enrollmentData.data as EnrollmentResponse
        }

        // If we reach here, the structure is not what we expected
        console.error('Unexpected enrollment response structure:', enrollmentData)
        throw new Error('Invalid enrollment response structure')
      }

      throw new Error(response.error || response.message || 'Registration failed')
    } catch (error) {
      console.error('Registration error:', error)

      // Handle API client errors with detailed information
      if (error instanceof Error && error.name === 'ApiClientError') {
        const apiError = error as any
        console.error('API Error details:', apiError.data)

        // Extract validation details if available
        if (apiError.data?.details) {
          const validationErrors = Object.entries(apiError.data.details)
            .map(([field, errors]) => `${field}: ${(errors as string[]).join(', ')}`)
            .join('; ')
          throw new Error(`Validation failed: ${validationErrors}`)
        }

        // Use the specific error message from API
        const message = apiError.data?.error || apiError.data?.message || error.message
        throw new Error(message)
      }

      if (error instanceof Error) {
        throw error
      }
      throw new Error('Registration failed')
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

      console.log('Raw processPayment response:', response)

      if (response.success) {
        // Handle the specific API response structure - data might be in 'message' or 'data'
        let enrollmentData: any = null

        if (response.data && typeof response.data === 'object') {
          enrollmentData = response.data
        } else if (response.message && typeof response.message === 'object') {
          enrollmentData = response.message
        }

        if (enrollmentData) {
          console.log('Parsed payment result:', enrollmentData)
          return enrollmentData as EnrollmentStatus
        }
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

      console.log('Raw activateEnrollment response:', response)

      if (response.success) {
        // Handle the specific API response structure
        // For activation endpoint, the actual data is in 'message' field
        let activationData: any = null

        if (response.message && typeof response.message === 'object') {
          // Primary: activation data is in message field
          activationData = response.message
        } else if (response.data && typeof response.data === 'object' && typeof response.data !== 'string') {
          // Fallback: data field (but not if it's just a string like "Course access activated")
          activationData = response.data
        }

        if (activationData) {
          console.log('Parsed activation result:', activationData)
          return activationData as ActivationResponse
        }

        // If we have success but no proper data structure, create a minimal response
        if (response.success) {
          console.log('Creating fallback activation response')
          return {
            success: true,
            access_granted: true
          } as ActivationResponse
        }
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

      console.log('Raw getEnrollmentStatus response:', response)

      if (response.success) {
        // Handle the specific API response structure - data might be in 'message' or 'data'
        let enrollmentData: any = null

        if (response.data && typeof response.data === 'object') {
          enrollmentData = response.data
        } else if (response.message && typeof response.message === 'object') {
          enrollmentData = response.message
        }

        if (enrollmentData) {
          console.log('Parsed enrollment data:', enrollmentData)
          return enrollmentData as EnrollmentStatus
        }
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
  async getUserEnrollments(): Promise<any[]> {
    try {
      const response: any = await this.client.get(
        '/enrollments/my-courses'
      )

      if (response.success && response.data && response.data.enrollments) {
        return response.data.enrollments
      }

      throw new Error('Failed to get enrollments')
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
