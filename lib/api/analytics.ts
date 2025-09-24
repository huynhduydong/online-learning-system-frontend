import { apiClient } from './client'

// Analytics Types
export interface DashboardStats {
  totalStudents: number
  totalCourses: number
  totalRevenue: number
  completionRate: number
  averageRating: number
  activeStudents: number
  newEnrollments: number
  pendingAssignments: number
}

export interface CourseAnalytics {
  courseId: string
  courseName: string
  enrolledStudents: number
  completedStudents: number
  averageProgress: number
  averageRating: number
  totalRevenue: number
  completionRate: number
  engagementRate: number
  dropoutRate: number
  lastActivity: string
}

export interface StudentProgress {
  studentId: string
  studentName: string
  email: string
  enrollmentDate: string
  progress: number
  lastActivity: string
  completedLessons: number
  totalLessons: number
  timeSpent: number
  grade: number | null
  status: 'active' | 'inactive' | 'completed' | 'dropped'
}

export interface RevenueData {
  date: string
  revenue: number
  enrollments: number
  refunds: number
}

export interface EngagementMetrics {
  date: string
  activeUsers: number
  sessionDuration: number
  pageViews: number
  completionRate: number
}

export interface AssignmentStats {
  assignmentId: string
  assignmentName: string
  courseId: string
  courseName: string
  totalSubmissions: number
  pendingGrading: number
  averageScore: number
  dueDate: string
  submissionRate: number
}

export interface QuizStats {
  quizId: string
  quizName: string
  courseId: string
  courseName: string
  totalAttempts: number
  averageScore: number
  passRate: number
  averageTimeSpent: number
}

export interface TimeRange {
  startDate: string
  endDate: string
}

// API Response Types
export interface DashboardStatsResponse {
  data: DashboardStats
  success: boolean
  message: string
}

export interface CourseAnalyticsResponse {
  data: CourseAnalytics[]
  success: boolean
  message: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface StudentProgressResponse {
  data: StudentProgress[]
  success: boolean
  message: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface RevenueDataResponse {
  data: RevenueData[]
  success: boolean
  message: string
}

export interface EngagementMetricsResponse {
  data: EngagementMetrics[]
  success: boolean
  message: string
}

export interface AssignmentStatsResponse {
  data: AssignmentStats[]
  success: boolean
  message: string
}

export interface QuizStatsResponse {
  data: QuizStats[]
  success: boolean
  message: string
}

// Analytics API Service
class AnalyticsService {
  private baseUrl = '/api/instructor/analytics'

  // Dashboard Overview
  async getDashboardStats(timeRange?: TimeRange): Promise<DashboardStats> {
    try {
      const params = timeRange ? {
        startDate: timeRange.startDate,
        endDate: timeRange.endDate
      } : {}

      const response = await apiClient.get<DashboardStatsResponse>(`${this.baseUrl}/dashboard`, {
        params
      })

      if (response.success && response.data) {
        return response.data
      }

      throw new Error(response.message || 'Failed to fetch dashboard stats')
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw error
    }
  }

  // Course Analytics
  async getCourseAnalytics(params?: {
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    timeRange?: TimeRange
  }): Promise<{ data: CourseAnalytics[], pagination?: any }> {
    try {
      const queryParams = {
        page: params?.page || 1,
        limit: params?.limit || 10,
        sortBy: params?.sortBy || 'enrolledStudents',
        sortOrder: params?.sortOrder || 'desc',
        ...params?.timeRange
      }

      const response = await apiClient.get<CourseAnalyticsResponse>(`${this.baseUrl}/courses`, {
        params: queryParams
      })

      if (response.success && response.data) {
        return {
          data: response.data,
          pagination: response.pagination
        }
      }

      throw new Error(response.message || 'Failed to fetch course analytics')
    } catch (error) {
      console.error('Error fetching course analytics:', error)
      throw error
    }
  }

  // Student Progress
  async getStudentProgress(courseId: string, params?: {
    page?: number
    limit?: number
    status?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<{ data: StudentProgress[], pagination?: any }> {
    try {
      const queryParams = {
        page: params?.page || 1,
        limit: params?.limit || 20,
        status: params?.status,
        sortBy: params?.sortBy || 'progress',
        sortOrder: params?.sortOrder || 'desc'
      }

      const response = await apiClient.get<StudentProgressResponse>(
        `${this.baseUrl}/courses/${courseId}/students`,
        { params: queryParams }
      )

      if (response.success && response.data) {
        return {
          data: response.data,
          pagination: response.pagination
        }
      }

      throw new Error(response.message || 'Failed to fetch student progress')
    } catch (error) {
      console.error('Error fetching student progress:', error)
      throw error
    }
  }

  // Revenue Analytics
  async getRevenueData(timeRange: TimeRange, granularity: 'day' | 'week' | 'month' = 'day'): Promise<RevenueData[]> {
    try {
      const response = await apiClient.get<RevenueDataResponse>(`${this.baseUrl}/revenue`, {
        params: {
          startDate: timeRange.startDate,
          endDate: timeRange.endDate,
          granularity
        }
      })

      if (response.success && response.data) {
        return response.data
      }

      throw new Error(response.message || 'Failed to fetch revenue data')
    } catch (error) {
      console.error('Error fetching revenue data:', error)
      throw error
    }
  }

  // Engagement Metrics
  async getEngagementMetrics(timeRange: TimeRange, granularity: 'day' | 'week' | 'month' = 'day'): Promise<EngagementMetrics[]> {
    try {
      const response = await apiClient.get<EngagementMetricsResponse>(`${this.baseUrl}/engagement`, {
        params: {
          startDate: timeRange.startDate,
          endDate: timeRange.endDate,
          granularity
        }
      })

      if (response.success && response.data) {
        return response.data
      }

      throw new Error(response.message || 'Failed to fetch engagement metrics')
    } catch (error) {
      console.error('Error fetching engagement metrics:', error)
      throw error
    }
  }

  // Assignment Statistics
  async getAssignmentStats(params?: {
    courseId?: string
    status?: 'pending' | 'graded' | 'overdue'
    page?: number
    limit?: number
  }): Promise<{ data: AssignmentStats[], pagination?: any }> {
    try {
      const queryParams = {
        courseId: params?.courseId,
        status: params?.status,
        page: params?.page || 1,
        limit: params?.limit || 10
      }

      const response = await apiClient.get<AssignmentStatsResponse>(`${this.baseUrl}/assignments`, {
        params: queryParams
      })

      if (response.success && response.data) {
        return {
          data: response.data,
          pagination: response.pagination
        }
      }

      throw new Error(response.message || 'Failed to fetch assignment stats')
    } catch (error) {
      console.error('Error fetching assignment stats:', error)
      throw error
    }
  }

  // Quiz Statistics
  async getQuizStats(params?: {
    courseId?: string
    page?: number
    limit?: number
  }): Promise<{ data: QuizStats[], pagination?: any }> {
    try {
      const queryParams = {
        courseId: params?.courseId,
        page: params?.page || 1,
        limit: params?.limit || 10
      }

      const response = await apiClient.get<QuizStatsResponse>(`${this.baseUrl}/quizzes`, {
        params: queryParams
      })

      if (response.success && response.data) {
        return {
          data: response.data,
          pagination: response.pagination
        }
      }

      throw new Error(response.message || 'Failed to fetch quiz stats')
    } catch (error) {
      console.error('Error fetching quiz stats:', error)
      throw error
    }
  }

  // Export Data
  async exportAnalytics(type: 'courses' | 'students' | 'revenue' | 'engagement', params?: {
    courseId?: string
    timeRange?: TimeRange
    format?: 'csv' | 'xlsx'
  }): Promise<Blob> {
    try {
      const queryParams = {
        type,
        courseId: params?.courseId,
        format: params?.format || 'csv',
        ...params?.timeRange
      }

      const response = await apiClient.get(`${this.baseUrl}/export`, {
        params: queryParams,
        responseType: 'blob'
      })

      return response as Blob
    } catch (error) {
      console.error('Error exporting analytics:', error)
      throw error
    }
  }
}

export const analyticsService = new AnalyticsService()