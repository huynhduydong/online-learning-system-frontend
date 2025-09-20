/**
 * Dashboard Data Hook
 * Custom hook for managing dashboard data, statistics, and user activity
 */

import { useState, useEffect, useCallback } from 'react'
import { dashboardService, type DashboardData, type DashboardStats, type RecentCourse, type Achievement } from '@/lib/api/dashboard'

interface UseDashboardReturn {
  // Data
  dashboardData: DashboardData | null
  stats: DashboardStats | null
  recentCourses: RecentCourse[]
  achievements: Achievement[]
  
  // Loading states
  loading: boolean
  statsLoading: boolean
  coursesLoading: boolean
  achievementsLoading: boolean
  
  // Error states
  error: string | null
  statsError: string | null
  coursesError: string | null
  achievementsError: string | null
  
  // Actions
  refreshDashboard: () => Promise<void>
  refreshStats: () => Promise<void>
  refreshCourses: () => Promise<void>
  refreshAchievements: () => Promise<void>
  markNotificationRead: (notificationId: string) => Promise<void>
  updateStreak: () => Promise<void>
}

export function useDashboard(): UseDashboardReturn {
  // Data states
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentCourses, setRecentCourses] = useState<RecentCourse[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  
  // Loading states
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(false)
  const [coursesLoading, setCoursesLoading] = useState(false)
  const [achievementsLoading, setAchievementsLoading] = useState(false)
  
  // Error states
  const [error, setError] = useState<string | null>(null)
  const [statsError, setStatsError] = useState<string | null>(null)
  const [coursesError, setCoursesError] = useState<string | null>(null)
  const [achievementsError, setAchievementsError] = useState<string | null>(null)

  // Fetch complete dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await dashboardService.getDashboardData()
      setDashboardData(data)
      setStats(data.stats)
      setRecentCourses(data.recentCourses)
      setAchievements(data.achievements)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard data'
      setError(errorMessage)
      console.error('Dashboard fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch user statistics only
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true)
      setStatsError(null)
      
      const statsData = await dashboardService.getUserStats()
      setStats(statsData)
      
      // Update dashboard data if it exists
      setDashboardData(prev => prev ? { ...prev, stats: statsData } : null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch statistics'
      setStatsError(errorMessage)
      console.error('Stats fetch error:', err)
    } finally {
      setStatsLoading(false)
    }
  }, [])

  // Fetch recent courses
  const fetchRecentCourses = useCallback(async () => {
    try {
      setCoursesLoading(true)
      setCoursesError(null)
      
      const coursesData = await dashboardService.getRecentCourses(5)
      setRecentCourses(coursesData)
      
      // Update dashboard data if it exists
      setDashboardData(prev => prev ? { ...prev, recentCourses: coursesData } : null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch recent courses'
      setCoursesError(errorMessage)
      console.error('Recent courses fetch error:', err)
    } finally {
      setCoursesLoading(false)
    }
  }, [])

  // Fetch achievements
  const fetchAchievements = useCallback(async () => {
    try {
      setAchievementsLoading(true)
      setAchievementsError(null)
      
      const achievementsData = await dashboardService.getAchievements(10)
      setAchievements(achievementsData)
      
      // Update dashboard data if it exists
      setDashboardData(prev => prev ? { ...prev, achievements: achievementsData } : null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch achievements'
      setAchievementsError(errorMessage)
      console.error('Achievements fetch error:', err)
    } finally {
      setAchievementsLoading(false)
    }
  }, [])

  // Mark notification as read
  const markNotificationRead = useCallback(async (notificationId: string) => {
    try {
      await dashboardService.markNotificationAsRead(notificationId)
      
      // Update local state
      if (dashboardData?.notifications) {
        const updatedNotifications = dashboardData.notifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
        
        setDashboardData(prev => prev ? {
          ...prev,
          notifications: updatedNotifications
        } : null)
      }
    } catch (err) {
      console.error('Mark notification read error:', err)
      throw err
    }
  }, [dashboardData])

  // Update study streak
  const updateStreak = useCallback(async () => {
    try {
      const result = await dashboardService.updateStudyStreak()
      
      // Update stats with new streak
      if (stats) {
        setStats(prev => prev ? { ...prev, currentStreak: result.currentStreak } : null)
      }
      
      // Add new achievements if any
      if (result.newAchievements && result.newAchievements.length > 0) {
        setAchievements(prev => [...result.newAchievements!, ...prev])
        
        // Update dashboard data
        if (dashboardData) {
          setDashboardData(prev => prev ? {
            ...prev,
            stats: { ...prev.stats, currentStreak: result.currentStreak },
            achievements: [...result.newAchievements!, ...prev.achievements]
          } : null)
        }
      }
      
      return result
    } catch (err) {
      console.error('Update streak error:', err)
      throw err
    }
  }, [stats, achievements, dashboardData])

  // Refresh functions
  const refreshDashboard = useCallback(async () => {
    await fetchDashboardData()
  }, [fetchDashboardData])

  const refreshStats = useCallback(async () => {
    await fetchStats()
  }, [fetchStats])

  const refreshCourses = useCallback(async () => {
    await fetchRecentCourses()
  }, [fetchRecentCourses])

  const refreshAchievements = useCallback(async () => {
    await fetchAchievements()
  }, [fetchAchievements])

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  return {
    // Data
    dashboardData,
    stats,
    recentCourses,
    achievements,
    
    // Loading states
    loading,
    statsLoading,
    coursesLoading,
    achievementsLoading,
    
    // Error states
    error,
    statsError,
    coursesError,
    achievementsError,
    
    // Actions
    refreshDashboard,
    refreshStats,
    refreshCourses,
    refreshAchievements,
    markNotificationRead,
    updateStreak
  }
}

// Hook for dashboard summary (lighter version)
export function useDashboardSummary() {
  const [summary, setSummary] = useState<{
    stats: DashboardStats
    recentCourses: RecentCourse[]
    latestAchievements: Achievement[]
    unreadNotifications: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const summaryData = await dashboardService.getDashboardSummary()
      setSummary(summaryData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard summary'
      setError(errorMessage)
      console.error('Dashboard summary fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshSummary = useCallback(async () => {
    await fetchSummary()
  }, [fetchSummary])

  useEffect(() => {
    fetchSummary()
  }, [fetchSummary])

  return {
    summary,
    loading,
    error,
    refreshSummary
  }
}