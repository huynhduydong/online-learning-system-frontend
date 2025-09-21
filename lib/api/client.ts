/**
 * API Client
 * Centralized HTTP client with authentication and error handling
 */

import { config, getApiUrl } from '@/lib/config'
import type { ApiResponse, ApiError } from './types'

// Token management utilities
export const tokenManager = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(config.auth.tokenKey)
  },

  setToken: (token: string): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(config.auth.tokenKey, token)
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(config.auth.refreshTokenKey)
  },

  setRefreshToken: (token: string): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(config.auth.refreshTokenKey, token)
  },

  removeTokens: (): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(config.auth.tokenKey)
    localStorage.removeItem(config.auth.refreshTokenKey)
    localStorage.removeItem(config.auth.userKey)
  },

  setUser: (user: any): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(config.auth.userKey, JSON.stringify(user))
  },

  getUser: (): any | null => {
    if (typeof window === 'undefined') return null
    const user = localStorage.getItem(config.auth.userKey)
    return user ? JSON.parse(user) : null
  },
}

// Custom error class for API errors
export class ApiClientError extends Error {
  public status: number
  public data: ApiError

  constructor(status: number, data: ApiError) {
    super(data.error || data.message || 'API Error')
    this.status = status
    this.data = data
    this.name = 'ApiClientError'
  }
}

// Request configuration interface
interface RequestConfig extends RequestInit {
  timeout?: number
}

// API Client class
class ApiClient {
  private baseUrl: string
  private defaultTimeout: number

  constructor() {
    this.baseUrl = config.api.baseUrl
    this.defaultTimeout = config.api.timeout
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      timeout = this.defaultTimeout,
      headers = {},
      ...restOptions
    } = options

    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      // Prepare headers
      const requestHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        ...headers,
      }

      // Add authorization header if token exists
      const token = tokenManager.getToken()
      if (token) {
        (requestHeaders as Record<string, string>)['Authorization'] = `Bearer ${token}`
      }

      // Make the request
      const response = await fetch(getApiUrl(endpoint), {
        ...restOptions,
        headers: requestHeaders,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // Parse response
      const data = await response.json()

      // Handle non-2xx responses
      if (!response.ok) {
        // Handle 401 Unauthorized - token might be expired
        if (response.status === 401) {
          await this.handleUnauthorized()
        }

        throw new ApiClientError(response.status, data)
      }

      return data
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof ApiClientError) {
        throw error
      }

      // Handle network errors, timeout, etc.
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiClientError(408, {
            success: false,
            error: 'Request timeout',
            message: 'The request took too long to complete',
          })
        }

        throw new ApiClientError(0, {
          success: false,
          error: 'Network error',
          message: error.message,
        })
      }

      throw new ApiClientError(0, {
        success: false,
        error: 'Unknown error',
        message: 'An unexpected error occurred',
      })
    }
  }

  private async handleUnauthorized(): Promise<void> {
    // Try to refresh token
    const refreshToken = tokenManager.getRefreshToken()
    if (refreshToken) {
      try {
        const response = await this.post('/auth/refresh', {
          refresh_token: refreshToken,
        })
        
        if (response.success && response.data?.access_token) {
          tokenManager.setToken(response.data.access_token)
          return
        }
      } catch (error) {
        // Refresh failed, clear tokens
      }
    }

    // Clear tokens and redirect to login
    tokenManager.removeTokens()
    
    // Only redirect if we're in the browser
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }

  // HTTP Methods
  async get<T = any>(endpoint: string, options?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T = any>(
    endpoint: string,
    data?: any,
    options?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T = any>(
    endpoint: string,
    data?: any,
    options?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T = any>(
    endpoint: string,
    data?: any,
    options?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T = any>(endpoint: string, options?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }

  // File upload method
  async upload<T = any>(
    endpoint: string,
    formData: FormData,
    options?: Omit<RequestConfig, 'body'>
  ): Promise<ApiResponse<T>> {
    const { headers = {}, ...restOptions } = options || {}

    // Don't set Content-Type for FormData, let browser set it with boundary
    const requestHeaders: HeadersInit = { ...headers }
    delete (requestHeaders as any)['Content-Type']

    // Add authorization header if token exists
    const token = tokenManager.getToken()
    if (token) {
      (requestHeaders as Record<string, string>)['Authorization'] = `Bearer ${token}`
    }

    return this.request<T>(endpoint, {
      ...restOptions,
      method: 'POST',
      headers: requestHeaders,
      body: formData,
    })
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export utilities
export { tokenManager as auth }