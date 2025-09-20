/**
 * Dashboard API Service
 * Handles dashboard data fetching and user statistics
 */

import { apiClient } from './client'
import type { ApiResponse } from './types'

export interface DashboardStats {
  totalCourses: number
  completedCourses: number
  inProgressCourses: number
  totalStudyTime: number // in hours
  achievements: number
  currentStreak: number // in days
  weeklyProgress: number // percentage
  monthlyProgress: number // percentage
}

export interface RecentCourse {
  id: string
  title: string
  progress: number // percentage 0-100
  lastAccessed: string // ISO date string
  instructor: string
  instructorAvatar?: string
  thumbnail?: string
  category: string
  duration: number // in minutes
  nextLessonId?: string
  nextLessonTitle?: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earnedAt: string // ISO date string
  category: 'milestone' | 'streak' | 'speed' | 'completion' | 'social'
  points: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface DashboardData {
  user: {
    id: number
    email: string
    first_name: string
    last_name: string
    full_name: string
    profile_image?: string | null
    role: string
    is_active: boolean
    is_verified: boolean
    created_at: string
    confirmed_at?: string | null
    last_login_at: string
    last_activity_at: string
    // Computed properties for backward compatibility
    name: string // Will be mapped from full_name
    avatar?: string // Will be mapped from profile_image
    joinedAt: string // Will be mapped from created_at
    lastLoginAt: string // Will be mapped from last_login_at
  }
  stats: DashboardStats
  recentCourses: RecentCourse[]
  achievements: Achievement[]
  upcomingDeadlines: Array<{
    id: string
    title: string
    type: 'assignment' | 'quiz' | 'course'
    dueDate: string
    courseTitle: string
  }>
  notifications: Array<{
    id: string
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
    createdAt: string
    read: boolean
  }>
}

export interface WeeklyActivity {
  date: string // YYYY-MM-DD
  studyTime: number // in minutes
  coursesAccessed: number
  lessonsCompleted: number
}

export interface LearningPath {
  id: string
  title: string
  description: string
  progress: number
  totalCourses: number
  completedCourses: number
  estimatedTime: number // in hours
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string
}

// API Response interfaces
interface ApiDashboardUser {
  id: number
  email: string
  first_name: string
  last_name: string
  full_name: string
  profile_image?: string | null
  role: string
  is_active: boolean
  is_verified: boolean
  created_at: string
  confirmed_at?: string | null
  last_login_at: string
  last_activity_at: string
}

interface ApiDashboardStats {
  total_enrollments: number
  in_progress_courses: number
  completed_courses: number
  total_learning_time: number
}

interface ApiQuickAction {
  action: string
  title: string
  description: string
  icon: string
}

// New API response structure with data wrapper
interface NewApiDashboardResponse {
  data: {
    notifications: any[]
    recent_activity: any[]
    stats: {
      completed_courses: number
      in_progress_courses: number
      total_courses: number
      total_hours_learned: number
    }
    user: {
      avatar_url: string | null
      created_at: string
      email: string
      email_confirmed: boolean
      first_name: string
      full_name: string
      id: number
      is_active: boolean
      last_activity: string
      last_login: string
      last_name: string
      role: string
    }
  }
  message: string
  success: boolean
}

// Legacy API response structure (for backward compatibility)
interface ApiDashboardResponse {
  dashboard: {
    user: ApiDashboardUser
    statistics: ApiDashboardStats
    recent_courses: any[]
    achievements: any[]
    notifications: any[]
    quick_actions: ApiQuickAction[]
    welcome_message: string
  }
  success: boolean
}

class DashboardService {
  private client = apiClient

  /**
   * Get complete dashboard data for the authenticated user
   */
  async getDashboardData(): Promise<DashboardData> {
    try {
      const response = await this.client.get<NewApiDashboardResponse>('/users/dashboard')
      
      if (response.success && response.data) {
        const { data } = response
        
        // Map new API response to DashboardData interface
        const mappedData: DashboardData = {
          user: {
            // Map from new API structure
            id: data.user.id,
            email: data.user.email,
            first_name: data.user.first_name,
            last_name: data.user.last_name,
            full_name: data.user.full_name,
            profile_image: data.user.avatar_url,
            role: data.user.role,
            is_active: data.user.is_active,
            is_verified: data.user.email_confirmed,
            created_at: data.user.created_at,
            confirmed_at: data.user.email_confirmed ? data.user.created_at : null,
            last_login_at: data.user.last_login,
            last_activity_at: data.user.last_activity,
            // Computed properties for backward compatibility
            name: data.user.full_name,
            avatar: data.user.avatar_url || undefined,
            joinedAt: data.user.created_at,
            lastLoginAt: data.user.last_login,
          },
          stats: {
            totalCourses: data.stats.total_courses,
            completedCourses: data.stats.completed_courses,
            inProgressCourses: data.stats.in_progress_courses,
            totalStudyTime: data.stats.total_hours_learned,
            achievements: 0, // Default value, can be updated later
            currentStreak: 0, // Default value, can be updated later
            weeklyProgress: 0, // Default value, can be updated later
            monthlyProgress: 0, // Default value, can be updated later
          },
          recentCourses: data.recent_activity || [],
          achievements: [], // Default empty array, can be updated later
          upcomingDeadlines: [],
          notifications: data.notifications || [],
        }
        
        return mappedData
      } else {
        throw new Error('Failed to fetch dashboard data')
      }
    } catch (error) {
      console.error('Dashboard data fetch error:', error)
      throw error
    }
  }

  /**
   * Get user statistics only
   */
  async getUserStats(): Promise<DashboardStats> {
    try {
      const response = await this.client.get<ApiResponse<DashboardStats>>('/users/dashboard/stats')
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(response.message || 'Failed to fetch user statistics')
      }
    } catch (error) {
      console.error('User stats fetch error:', error)
      throw error
    }
  }

  /**
   * Get recent courses for the user
   */
  async getRecentCourses(limit: number = 5): Promise<RecentCourse[]> {
    try {
      const response = await this.client.get<ApiResponse<RecentCourse[]>>(
        `/users/dashboard/recent-courses?limit=${limit}`
      )
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(response.message || 'Failed to fetch recent courses')
      }
    } catch (error) {
      console.error('Recent courses fetch error:', error)
      throw error
    }
  }

  /**
   * Get user achievements
   */
  async getAchievements(limit?: number): Promise<Achievement[]> {
    try {
      const url = limit 
        ? `/users/dashboard/achievements?limit=${limit}`
        : '/users/dashboard/achievements'
        
      const response = await this.client.get<ApiResponse<Achievement[]>>(url)
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(response.message || 'Failed to fetch achievements')
      }
    } catch (error) {
      console.error('Achievements fetch error:', error)
      throw error
    }
  }

  /**
   * Get weekly activity data for charts
   */
  async getWeeklyActivity(): Promise<WeeklyActivity[]> {
    try {
      const response = await this.client.get<ApiResponse<WeeklyActivity[]>>('/users/dashboard/weekly-activity')
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(response.message || 'Failed to fetch weekly activity')
      }
    } catch (error) {
      console.error('Weekly activity fetch error:', error)
      throw error
    }
  }

  /**
   * Get learning paths for the user
   */
  async getLearningPaths(): Promise<LearningPath[]> {
    try {
      const response = await this.client.get<ApiResponse<LearningPath[]>>('/users/dashboard/learning-paths')
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(response.message || 'Failed to fetch learning paths')
      }
    } catch (error) {
      console.error('Learning paths fetch error:', error)
      throw error
    }
  }

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      const response = await this.client.patch<ApiResponse<void>>(
        `/api/users/notifications/${notificationId}/read`
      )
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to mark notification as read')
      }
    } catch (error) {
      console.error('Mark notification read error:', error)
      throw error
    }
  }

  /**
   * Update user study streak (called when user completes a lesson)
   */
  async updateStudyStreak(): Promise<{ currentStreak: number; newAchievements?: Achievement[] }> {
    try {
      const response = await this.client.post<ApiResponse<{ currentStreak: number; newAchievements?: Achievement[] }>>(
        '/api/users/dashboard/update-streak'
      )
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(response.message || 'Failed to update study streak')
      }
    } catch (error) {
      console.error('Update study streak error:', error)
      throw error
    }
  }

  /**
   * Get dashboard summary for quick overview
   */
  async getDashboardSummary(): Promise<{
    stats: DashboardStats
    recentCourses: RecentCourse[]
    latestAchievements: Achievement[]
    unreadNotifications: number
  }> {
    try {
      const response = await this.client.get<ApiResponse<{
        stats: DashboardStats
        recentCourses: RecentCourse[]
        latestAchievements: Achievement[]
        unreadNotifications: number
      }>>('/api/users/dashboard/summary')
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(response.message || 'Failed to fetch dashboard summary')
      }
    } catch (error) {
      console.error('Dashboard summary fetch error:', error)
      throw error
    }
  }
}

// Export singleton instance
export const dashboardService = new DashboardService()
export default dashboardService