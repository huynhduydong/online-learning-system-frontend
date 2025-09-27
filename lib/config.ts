/**
 * Environment Configuration
 * Centralized configuration for API endpoints and environment variables
 */

export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api',
    timeout: 30000, // 30 seconds
  },

  // Authentication Configuration
  auth: {
    tokenKey: 'access_token',
    refreshTokenKey: 'refresh_token',
    userKey: 'user',
    tokenExpiry: 60 * 60 * 1000, // 1 hour in milliseconds
    refreshTokenExpiry: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  },

  // Rate Limiting (for client-side awareness)
  rateLimits: {
    registration: 20, // per minute
    login: 10, // per minute
    emailResend: 3, // per minute
    general: 200, // per day
  },

  // File Upload Configuration
  upload: {
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
    avatarSize: 200, // 200x200px
  },

  // Validation Rules
  validation: {
    password: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumber: true,
    },
    name: {
      minLength: 2,
    },
  },

  // App Configuration
  app: {
    name: 'Online Learning System',
    version: '1.0.0',
    supportEmail: 'support@onlinelearning.com',
  },
} as const

// API Endpoints
export const endpoints = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
    confirmEmail: '/auth/confirm-email',
    resendConfirmation: '/auth/resend-confirmation',
  },
  users: {
    profile: '/users/profile',
    uploadAvatar: '/users/upload-avatar',
    dashboard: '/users/dashboard',
  },
} as const

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  // Normalize baseUrl to remove trailing slash
  const baseUrl = config.api.baseUrl.replace(/\/+$/, '')
  // Normalize endpoint to ensure leading slash
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`

  return `${baseUrl}${normalizedEndpoint}`
}

// Helper function to check if we're in development
export const isDevelopment = process.env.NODE_ENV === 'development'

// Helper function to check if we're in production
export const isProduction = process.env.NODE_ENV === 'production'