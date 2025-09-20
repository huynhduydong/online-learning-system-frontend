/**
 * Authentication API Service
 * All authentication-related API calls
 */

import { apiClient, tokenManager, ApiClientError } from './client'
import { endpoints } from '@/lib/config'
import type {
  LoginRequest,
  LoginResponse,
  ApiLoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenResponse,
  User,
  ResendConfirmationRequest,
  ConfirmEmailResponse,
  ApiResponse,
} from './types'

export class AuthService {
  /**
   * User registration
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await apiClient.post<RegisterResponse>(
        endpoints.auth.register,
        data
      )

      if (response.success) {
        // Don't automatically store tokens and user data after registration
        // User should verify email first before being logged in
        // Return the actual data, not the wrapper response
        return {
          success: response.success,
          message: response.message,
          user: response.user,
          access_token: response.access_token,
          refresh_token: response.refresh_token,
          expires_in: response.expires_in,
          remember_me: response.remember_me
        }
      }

      // Use the specific error message from backend, fallback to generic message
      throw new Error(response.error || 'Đăng ký thất bại')
    } catch (error) {
      if (error instanceof ApiClientError) {
        // Extract error message from API response
        const errorMessage = error.data?.error || error.data?.message || 'Đăng ký thất bại'
        throw new Error(errorMessage)
      }
      throw error
    }
  }

  /**
   * User login
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<ApiLoginResponse>(
        endpoints.auth.login,
        data
      )

      // Backend returns data wrapped in ApiResponse format
      if (response.success && response.data) {
        // Map API user to internal User format
        const apiUser = response.data.user
        const user: User = {
          id: apiUser.id,
          email: apiUser.email,
          first_name: apiUser.full_name.split(' ')[0] || '',
          last_name: apiUser.full_name.split(' ').slice(1).join(' ') || '',
          full_name: apiUser.full_name,
          role: apiUser.role,
          is_active: true, // Default values for missing fields
          is_verified: true,
          profile_image: apiUser.avatar_url,
          created_at: new Date().toISOString(),
          confirmed_at: new Date().toISOString(),
          last_login_at: new Date().toISOString(),
          last_activity_at: new Date().toISOString()
        }

        // Store tokens and user data
        tokenManager.setToken(response.data.access_token)
        tokenManager.setRefreshToken(response.data.refresh_token)
        tokenManager.setUser(user)

        // Return the internal format for backward compatibility
        return {
          success: true,
          message: response.message,
          user: user,
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
          expires_in: 86400, // Default 24 hours
          remember_me: data.remember_me || false
        }
      }

      // Use the specific error message from backend, fallback to generic message
      throw new Error('Đăng nhập thất bại')
    } catch (error) {
      if (error instanceof ApiClientError) {
        // Extract error message from API response
        const errorMessage = error.data?.error || error.data?.message || 'Đăng nhập thất bại'
        throw new Error(errorMessage)
      }
      throw error
    }
  }

  /**
   * User logout
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint to invalidate tokens on server
      await apiClient.post(endpoints.auth.logout)
    } catch (error) {
      // Even if server logout fails, we should clear local tokens
      console.warn('Server logout failed:', error)
    } finally {
      // Always clear local tokens
      tokenManager.removeTokens()
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<string> {
    const refreshToken = tokenManager.getRefreshToken()
    
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await apiClient.post<RefreshTokenResponse>(
      endpoints.auth.refresh,
      { refresh_token: refreshToken }
    )

    if (response.success && response.data?.access_token) {
      tokenManager.setToken(response.data.access_token)
      return response.data.access_token
    }

    throw new Error(response.error || 'Token refresh failed')
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>(endpoints.auth.me)

    if (response.success && response.data) {
      // Update stored user data
      tokenManager.setUser(response.data)
      return response.data
    }

    throw new Error(response.error || 'Failed to get user profile')
  }

  /**
   * Confirm email address
   */
  async confirmEmail(token: string): Promise<ConfirmEmailResponse> {
    const response = await apiClient.post<ConfirmEmailResponse>(
      endpoints.auth.confirmEmail,
      { token }
    )

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.error || 'Email confirmation failed')
  }

  /**
   * Resend email confirmation
   */
  async resendConfirmation(data: ResendConfirmationRequest): Promise<ApiResponse> {
    const response = await apiClient.post(
      endpoints.auth.resendConfirmation,
      data
    )

    if (response.success) {
      return response
    }

    throw new Error(response.error || 'Failed to resend confirmation email')
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!tokenManager.getToken()
  }

  /**
   * Get stored user data
   */
  getStoredUser(): User | null {
    return tokenManager.getUser()
  }

  /**
   * Check if user email is verified
   */
  isEmailVerified(): boolean {
    const user = this.getStoredUser()
    return user?.is_verified || false
  }

  /**
   * Get user role
   */
  getUserRole(): 'student' | 'instructor' | null {
    const user = this.getStoredUser()
    return user?.role || null
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: 'student' | 'instructor'): boolean {
    return this.getUserRole() === role
  }

  /**
   * Clear all authentication data
   */
  clearAuth(): void {
    tokenManager.removeTokens()
  }
}

// Export singleton instance
export const authService = new AuthService()

// Export for convenience
export default authService