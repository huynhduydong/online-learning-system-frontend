import { apiClient } from './client'
import type {
  Notification,
  NotificationPreferences,
  CreateNotificationRequest,
  NotificationFilter,
  NotificationStats
} from '@/lib/notifications/types'

export interface GetNotificationsResponse {
  data: Notification[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface NotificationApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
}

class NotificationsApi {
  private readonly baseUrl = '/notifications'

  // Get user notifications with filtering
  async getNotifications(filter?: NotificationFilter): Promise<GetNotificationsResponse> {
    try {
      const params = new URLSearchParams()
      
      if (filter?.read !== undefined) {
        params.append('read', filter.read.toString())
      }
      if (filter?.type?.length) {
        params.append('type', filter.type.join(','))
      }
      if (filter?.startDate) {
        params.append('startDate', filter.startDate)
      }
      if (filter?.endDate) {
        params.append('endDate', filter.endDate)
      }
      if (filter?.limit) {
        params.append('limit', filter.limit.toString())
      }
      if (filter?.offset) {
        params.append('offset', filter.offset.toString())
      }

      const response = await apiClient.get<NotificationApiResponse<GetNotificationsResponse>>(
        `${this.baseUrl}?${params.toString()}`
      )

      if (response.success && response.data) {
        return response.data
      }

      // Handle legacy API format
      if (Array.isArray(response)) {
        return {
          data: response as Notification[],
          pagination: {
            total: response.length,
            page: 1,
            limit: response.length,
            totalPages: 1
          }
        }
      }

      throw new Error('Failed to fetch notifications')
    } catch (error) {
      console.error('Error fetching notifications:', error)
      throw error
    }
  }

  // Get unread notifications count
  async getUnreadCount(): Promise<number> {
    try {
      const response = await apiClient.get<NotificationApiResponse<{ count: number }>>(
        `${this.baseUrl}/unread-count`
      )

      if (response.success && response.data) {
        return response.data.count
      }

      // Handle legacy API format
      if (typeof response === 'number') {
        return response
      }

      return 0
    } catch (error) {
      console.error('Error fetching unread count:', error)
      return 0
    }
  }

  // Get notification statistics
  async getStats(): Promise<NotificationStats> {
    try {
      const response = await apiClient.get<NotificationApiResponse<NotificationStats>>(
        `${this.baseUrl}/stats`
      )

      if (response.success && response.data) {
        return response.data
      }

      throw new Error('Failed to fetch notification stats')
    } catch (error) {
      console.error('Error fetching notification stats:', error)
      throw error
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const response = await apiClient.patch<NotificationApiResponse>(
        `${this.baseUrl}/${notificationId}/read`
      )

      if (!response.success) {
        throw new Error(response.message || 'Failed to mark notification as read')
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  }

  // Mark multiple notifications as read
  async markMultipleAsRead(notificationIds: string[]): Promise<void> {
    try {
      const response = await apiClient.patch<NotificationApiResponse>(
        `${this.baseUrl}/mark-read`,
        { notificationIds }
      )

      if (!response.success) {
        throw new Error(response.message || 'Failed to mark notifications as read')
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error)
      throw error
    }
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<void> {
    try {
      const response = await apiClient.patch<NotificationApiResponse>(
        `${this.baseUrl}/mark-all-read`
      )

      if (!response.success) {
        throw new Error(response.message || 'Failed to mark all notifications as read')
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      throw error
    }
  }

  // Delete notification
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const response = await apiClient.delete<NotificationApiResponse>(
        `${this.baseUrl}/${notificationId}`
      )

      if (!response.success) {
        throw new Error(response.message || 'Failed to delete notification')
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
      throw error
    }
  }

  // Delete multiple notifications
  async deleteMultiple(notificationIds: string[]): Promise<void> {
    try {
      const response = await apiClient.delete<NotificationApiResponse>(
        `${this.baseUrl}/batch`,
        { data: { notificationIds } }
      )

      if (!response.success) {
        throw new Error(response.message || 'Failed to delete notifications')
      }
    } catch (error) {
      console.error('Error deleting notifications:', error)
      throw error
    }
  }

  // Get notification preferences
  async getPreferences(): Promise<NotificationPreferences> {
    try {
      const response = await apiClient.get<NotificationApiResponse<NotificationPreferences>>(
        `${this.baseUrl}/preferences`
      )

      if (response.success && response.data) {
        return response.data
      }

      throw new Error('Failed to fetch notification preferences')
    } catch (error) {
      console.error('Error fetching notification preferences:', error)
      throw error
    }
  }

  // Update notification preferences
  async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    try {
      const response = await apiClient.patch<NotificationApiResponse<NotificationPreferences>>(
        `${this.baseUrl}/preferences`,
        preferences
      )

      if (response.success && response.data) {
        return response.data
      }

      throw new Error('Failed to update notification preferences')
    } catch (error) {
      console.error('Error updating notification preferences:', error)
      throw error
    }
  }

  // Create notification (admin/system use)
  async createNotification(notification: CreateNotificationRequest): Promise<Notification> {
    try {
      const response = await apiClient.post<NotificationApiResponse<Notification>>(
        this.baseUrl,
        notification
      )

      if (response.success && response.data) {
        return response.data
      }

      throw new Error('Failed to create notification')
    } catch (error) {
      console.error('Error creating notification:', error)
      throw error
    }
  }

  // Subscribe to push notifications
  async subscribeToPush(subscription: PushSubscription): Promise<void> {
    try {
      const response = await apiClient.post<NotificationApiResponse>(
        `${this.baseUrl}/push/subscribe`,
        {
          subscription: subscription.toJSON()
        }
      )

      if (!response.success) {
        throw new Error(response.message || 'Failed to subscribe to push notifications')
      }
    } catch (error) {
      console.error('Error subscribing to push notifications:', error)
      throw error
    }
  }

  // Unsubscribe from push notifications
  async unsubscribeFromPush(): Promise<void> {
    try {
      const response = await apiClient.delete<NotificationApiResponse>(
        `${this.baseUrl}/push/unsubscribe`
      )

      if (!response.success) {
        throw new Error(response.message || 'Failed to unsubscribe from push notifications')
      }
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error)
      throw error
    }
  }

  // Test notification (development/admin use)
  async sendTestNotification(type: string, data?: any): Promise<void> {
    try {
      const response = await apiClient.post<NotificationApiResponse>(
        `${this.baseUrl}/test`,
        { type, data }
      )

      if (!response.success) {
        throw new Error(response.message || 'Failed to send test notification')
      }
    } catch (error) {
      console.error('Error sending test notification:', error)
      throw error
    }
  }
}

export const notificationsApi = new NotificationsApi()