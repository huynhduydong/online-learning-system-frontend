'use client'

/**
 * Authentication Context
 * Manages user authentication state and provides auth methods
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { authService } from '@/lib/api/auth'
import type { User, LoginRequest, RegisterRequest } from '@/lib/api/types'

interface AuthContextType {
  // State
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isEmailVerified: boolean

  // Actions
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  clearError: () => void

  // Error handling
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Computed values
  const isAuthenticated = !!user && authService.isAuthenticated()
  const isEmailVerified = user?.is_verified || false

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Check if user is already authenticated
      if (authService.isAuthenticated()) {
        // Try to get fresh user data from server
        try {
          const userData = await authService.getCurrentUser()
          setUser(userData)
        } catch (error) {
          console.error('Failed to get current user:', error)
          
          // Check if it's an authentication error (401, 422, etc.)
          const isAuthError = error instanceof Error && 
            (error.message.includes('401') || 
             error.message.includes('422') || 
             error.message.includes('Unauthorized') ||
             error.message.includes('UNPROCESSABLE'))
          
          if (isAuthError) {
            // Clear invalid tokens and auth state
            authService.clearAuth()
            setUser(null)
          } else {
            // For other errors, try to use stored user data
            const storedUser = authService.getStoredUser()
            if (storedUser) {
              setUser(storedUser)
            } else {
              // Clear invalid tokens
              authService.clearAuth()
            }
          }
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      authService.clearAuth()
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (data: LoginRequest) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await authService.login(data)
      setUser(response.user)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterRequest) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await authService.register(data)
      // Don't automatically log in user after registration
      // They need to verify their email first
      // setUser(response.user)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      setError(null)

      await authService.logout()
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
      // Even if logout fails, clear local state
      authService.clearAuth()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshUser = async () => {
    try {
      setError(null)

      if (authService.isAuthenticated()) {
        const userData = await authService.getCurrentUser()
        setUser(userData)
      }
    } catch (error) {
      console.error('Refresh user error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to refresh user data'
      setError(errorMessage)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value: AuthContextType = {
    // State
    user,
    isLoading,
    isAuthenticated,
    isEmailVerified,

    // Actions
    login,
    register,
    logout,
    refreshUser,
    clearError,

    // Error handling
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook for protected routes
export function useRequireAuth() {
  const auth = useAuth()

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/login'
    }
  }, [auth.isLoading, auth.isAuthenticated])

  return auth
}

// Hook to check specific role
export function useRequireRole(role: 'student' | 'instructor') {
  const auth = useRequireAuth()

  useEffect(() => {
    if (!auth.isLoading && auth.isAuthenticated && auth.user?.role !== role) {
      // Redirect to unauthorized page or dashboard
      window.location.href = '/unauthorized'
    }
  }, [auth.isLoading, auth.isAuthenticated, auth.user?.role, role])

  return auth
}