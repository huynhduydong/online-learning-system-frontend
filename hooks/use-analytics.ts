'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { analyticsService } from '@/lib/api/analytics'
import type {
  DashboardStats,
  CourseAnalytics,
  StudentProgress,
  RevenueData,
  EngagementMetrics,
  AssignmentStats,
  QuizStats,
  TimeRange
} from '@/lib/api/analytics'

interface UseAnalyticsOptions {
  autoRefresh?: boolean
  refreshInterval?: number
  initialTimeRange?: TimeRange
}

interface UseAnalyticsReturn {
  // Dashboard Stats
  dashboardStats: DashboardStats | null
  dashboardLoading: boolean
  dashboardError: string | null

  // Course Analytics
  courseAnalytics: CourseAnalytics[]
  courseAnalyticsLoading: boolean
  courseAnalyticsError: string | null
  courseAnalyticsPagination: any

  // Revenue Data
  revenueData: RevenueData[]
  revenueLoading: boolean
  revenueError: string | null

  // Engagement Metrics
  engagementMetrics: EngagementMetrics[]
  engagementLoading: boolean
  engagementError: string | null

  // Assignment Stats
  assignmentStats: AssignmentStats[]
  assignmentStatsLoading: boolean
  assignmentStatsError: string | null

  // Quiz Stats
  quizStats: QuizStats[]
  quizStatsLoading: boolean
  quizStatsError: string | null

  // Time Range
  timeRange: TimeRange
  setTimeRange: (range: TimeRange) => void

  // Actions
  refreshDashboard: () => Promise<void>
  refreshCourseAnalytics: () => Promise<void>
  refreshRevenue: () => Promise<void>
  refreshEngagement: () => Promise<void>
  refreshAssignments: () => Promise<void>
  refreshQuizzes: () => Promise<void>
  refreshAll: () => Promise<void>

  // Course-specific data
  getStudentProgress: (courseId: string, params?: any) => Promise<{ data: StudentProgress[], pagination?: any }>
  exportData: (type: string, params?: any) => Promise<Blob>
}

export function useAnalytics(options: UseAnalyticsOptions = {}): UseAnalyticsReturn {
  const {
    autoRefresh = false,
    refreshInterval = 300000, // 5 minutes
    initialTimeRange = {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
      endDate: new Date().toISOString().split('T')[0] // today
    }
  } = options

  // State for dashboard stats
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [dashboardLoading, setDashboardLoading] = useState(false)
  const [dashboardError, setDashboardError] = useState<string | null>(null)

  // State for course analytics
  const [courseAnalytics, setCourseAnalytics] = useState<CourseAnalytics[]>([])
  const [courseAnalyticsLoading, setCourseAnalyticsLoading] = useState(false)
  const [courseAnalyticsError, setCourseAnalyticsError] = useState<string | null>(null)
  const [courseAnalyticsPagination, setCourseAnalyticsPagination] = useState<any>(null)

  // State for revenue data
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [revenueLoading, setRevenueLoading] = useState(false)
  const [revenueError, setRevenueError] = useState<string | null>(null)

  // State for engagement metrics
  const [engagementMetrics, setEngagementMetrics] = useState<EngagementMetrics[]>([])
  const [engagementLoading, setEngagementLoading] = useState(false)
  const [engagementError, setEngagementError] = useState<string | null>(null)

  // State for assignment stats
  const [assignmentStats, setAssignmentStats] = useState<AssignmentStats[]>([])
  const [assignmentStatsLoading, setAssignmentStatsLoading] = useState(false)
  const [assignmentStatsError, setAssignmentStatsError] = useState<string | null>(null)

  // State for quiz stats
  const [quizStats, setQuizStats] = useState<QuizStats[]>([])
  const [quizStatsLoading, setQuizStatsLoading] = useState(false)
  const [quizStatsError, setQuizStatsError] = useState<string | null>(null)

  // Time range state
  const [timeRange, setTimeRange] = useState<TimeRange>(initialTimeRange)

  // Fetch dashboard stats
  const refreshDashboard = useCallback(async () => {
    setDashboardLoading(true)
    setDashboardError(null)
    try {
      const stats = await analyticsService.getDashboardStats(timeRange)
      setDashboardStats(stats)
    } catch (error) {
      setDashboardError(error instanceof Error ? error.message : 'Failed to fetch dashboard stats')
    } finally {
      setDashboardLoading(false)
    }
  }, [timeRange])

  // Fetch course analytics
  const refreshCourseAnalytics = useCallback(async () => {
    setCourseAnalyticsLoading(true)
    setCourseAnalyticsError(null)
    try {
      const result = await analyticsService.getCourseAnalytics({
        timeRange,
        limit: 10
      })
      setCourseAnalytics(result.data)
      setCourseAnalyticsPagination(result.pagination)
    } catch (error) {
      setCourseAnalyticsError(error instanceof Error ? error.message : 'Failed to fetch course analytics')
    } finally {
      setCourseAnalyticsLoading(false)
    }
  }, [timeRange])

  // Fetch revenue data
  const refreshRevenue = useCallback(async () => {
    setRevenueLoading(true)
    setRevenueError(null)
    try {
      const data = await analyticsService.getRevenueData(timeRange, 'day')
      setRevenueData(data)
    } catch (error) {
      setRevenueError(error instanceof Error ? error.message : 'Failed to fetch revenue data')
    } finally {
      setRevenueLoading(false)
    }
  }, [timeRange])

  // Fetch engagement metrics
  const refreshEngagement = useCallback(async () => {
    setEngagementLoading(true)
    setEngagementError(null)
    try {
      const data = await analyticsService.getEngagementMetrics(timeRange, 'day')
      setEngagementMetrics(data)
    } catch (error) {
      setEngagementError(error instanceof Error ? error.message : 'Failed to fetch engagement metrics')
    } finally {
      setEngagementLoading(false)
    }
  }, [timeRange])

  // Fetch assignment stats
  const refreshAssignments = useCallback(async () => {
    setAssignmentStatsLoading(true)
    setAssignmentStatsError(null)
    try {
      const result = await analyticsService.getAssignmentStats({ limit: 10 })
      setAssignmentStats(result.data)
    } catch (error) {
      setAssignmentStatsError(error instanceof Error ? error.message : 'Failed to fetch assignment stats')
    } finally {
      setAssignmentStatsLoading(false)
    }
  }, [])

  // Fetch quiz stats
  const refreshQuizzes = useCallback(async () => {
    setQuizStatsLoading(true)
    setQuizStatsError(null)
    try {
      const result = await analyticsService.getQuizStats({ limit: 10 })
      setQuizStats(result.data)
    } catch (error) {
      setQuizStatsError(error instanceof Error ? error.message : 'Failed to fetch quiz stats')
    } finally {
      setQuizStatsLoading(false)
    }
  }, [])

  // Refresh all data
  const refreshAll = useCallback(async () => {
    await Promise.all([
      refreshDashboard(),
      refreshCourseAnalytics(),
      refreshRevenue(),
      refreshEngagement(),
      refreshAssignments(),
      refreshQuizzes()
    ])
  }, [refreshDashboard, refreshCourseAnalytics, refreshRevenue, refreshEngagement, refreshAssignments, refreshQuizzes])

  // Get student progress for a specific course
  const getStudentProgress = useCallback(async (courseId: string, params?: any) => {
    return await analyticsService.getStudentProgress(courseId, params)
  }, [])

  // Export data
  const exportData = useCallback(async (type: string, params?: any) => {
    return await analyticsService.exportAnalytics(type as any, {
      timeRange,
      ...params
    })
  }, [timeRange])

  // Initial data fetch
  useEffect(() => {
    refreshAll()
  }, [refreshAll])

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      refreshAll()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, refreshAll])

  // Computed values
  const isLoading = useMemo(() => {
    return dashboardLoading || courseAnalyticsLoading || revenueLoading || 
           engagementLoading || assignmentStatsLoading || quizStatsLoading
  }, [dashboardLoading, courseAnalyticsLoading, revenueLoading, engagementLoading, assignmentStatsLoading, quizStatsLoading])

  const hasError = useMemo(() => {
    return dashboardError || courseAnalyticsError || revenueError || 
           engagementError || assignmentStatsError || quizStatsError
  }, [dashboardError, courseAnalyticsError, revenueError, engagementError, assignmentStatsError, quizStatsError])

  return {
    // Dashboard Stats
    dashboardStats,
    dashboardLoading,
    dashboardError,

    // Course Analytics
    courseAnalytics,
    courseAnalyticsLoading,
    courseAnalyticsError,
    courseAnalyticsPagination,

    // Revenue Data
    revenueData,
    revenueLoading,
    revenueError,

    // Engagement Metrics
    engagementMetrics,
    engagementLoading,
    engagementError,

    // Assignment Stats
    assignmentStats,
    assignmentStatsLoading,
    assignmentStatsError,

    // Quiz Stats
    quizStats,
    quizStatsLoading,
    quizStatsError,

    // Time Range
    timeRange,
    setTimeRange,

    // Actions
    refreshDashboard,
    refreshCourseAnalytics,
    refreshRevenue,
    refreshEngagement,
    refreshAssignments,
    refreshQuizzes,
    refreshAll,

    // Course-specific data
    getStudentProgress,
    exportData
  }
}

// Hook for specific course analytics
export function useCourseAnalytics(courseId: string) {
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<any>(null)

  const fetchStudentProgress = useCallback(async (params?: any) => {
    setLoading(true)
    setError(null)
    try {
      const result = await analyticsService.getStudentProgress(courseId, params)
      setStudentProgress(result.data)
      setPagination(result.pagination)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch student progress')
    } finally {
      setLoading(false)
    }
  }, [courseId])

  useEffect(() => {
    if (courseId) {
      fetchStudentProgress()
    }
  }, [courseId, fetchStudentProgress])

  return {
    studentProgress,
    loading,
    error,
    pagination,
    refresh: fetchStudentProgress
  }
}