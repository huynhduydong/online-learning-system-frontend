'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { notificationsApi } from '@/lib/api/notifications'
import type {
  Notification,
  NotificationFilter,
  NotificationPreferences,
  NotificationStats,
  NotificationType
} from '@/lib/notifications/types'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'

interface UseNotificationsOptions {
  autoRefresh?: boolean
  refreshInterval?: number
  initialFilter?: NotificationFilter
}

interface UseNotificationsReturn {
  notifications: Notification[]
  loading: boolean
  error: string | null
  unreadCount: number
  stats: NotificationStats | null
  hasMore: boolean
  
  // Actions
  refresh: () => Promise<void>
  loadMore: () => Promise<void>
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (notificationId: string) => Promise<void>
  updateFilter: (filter: Partial<NotificationFilter>) => void
  
  // Utilities
  getUnreadNotifications: () => Notification[]
  getNotificationsByType: (type: NotificationType) => Notification[]
}

export function useNotifications(options: UseNotificationsOptions = {}): UseNotificationsReturn {
  const { user } = useAuth()
  const {
    autoRefresh = true,
    refreshInterval = 30000, // 30 seconds
    initialFilter = { limit: 20, offset: 0 }
  } = options

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [stats, setStats] = useState<NotificationStats | null>(null)
  const [filter, setFilter] = useState<NotificationFilter>(initialFilter)
  const [hasMore, setHasMore] = useState(true)

  // Fetch notifications
  const fetchNotifications = useCallback(async (reset = false) => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      const currentFilter = reset ? { ...filter, offset: 0 } : filter
      const response = await notificationsApi.getNotifications(currentFilter)

      if (reset) {
        setNotifications(response.data)
      } else {
        setNotifications(prev => [...prev, ...response.data])
      }

      setHasMore(response.data.length === (currentFilter.limit || 20))
      
      // Update unread count
      const unreadResponse = await notificationsApi.getUnreadCount()
      setUnreadCount(unreadResponse)

    } catch (err) {
      console.error('Error fetching notifications:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications')
    } finally {
      setLoading(false)
    }
  }, [user, filter])

  // Fetch stats
  const fetchStats = useCallback(async () => {
    if (!user) return

    try {
      const statsResponse = await notificationsApi.getStats()
      setStats(statsResponse)
    } catch (err) {
      console.error('Error fetching notification stats:', err)
    }
  }, [user])

  // Refresh notifications
  const refresh = useCallback(async () => {
    await fetchNotifications(true)
    await fetchStats()
  }, [fetchNotifications, fetchStats])

  // Load more notifications
  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return

    const newOffset = (filter.offset || 0) + (filter.limit || 20)
    setFilter(prev => ({ ...prev, offset: newOffset }))
  }, [hasMore, loading, filter])

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationsApi.markAsRead(notificationId)
      
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      )
      
      setUnreadCount(prev => Math.max(0, prev - 1))
      
    } catch (err) {
      console.error('Error marking notification as read:', err)
      toast.error('Không thể đánh dấu thông báo đã đọc')
    }
  }, [])

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationsApi.markAllAsRead()
      
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      )
      
      setUnreadCount(0)
      toast.success('Đã đánh dấu tất cả thông báo đã đọc')
      
    } catch (err) {
      console.error('Error marking all notifications as read:', err)
      toast.error('Không thể đánh dấu tất cả thông báo đã đọc')
    }
  }, [])

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      await notificationsApi.deleteNotification(notificationId)
      
      const deletedNotification = notifications.find(n => n.id === notificationId)
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      
      if (deletedNotification && !deletedNotification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
      
      toast.success('Đã xóa thông báo')
      
    } catch (err) {
      console.error('Error deleting notification:', err)
      toast.error('Không thể xóa thông báo')
    }
  }, [notifications])

  // Update filter
  const updateFilter = useCallback((newFilter: Partial<NotificationFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter, offset: 0 }))
  }, [])

  // Get unread notifications
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(notification => !notification.read)
  }, [notifications])

  // Get notifications by type
  const getNotificationsByType = useCallback((type: NotificationType) => {
    return notifications.filter(notification => notification.type === type)
  }, [notifications])

  // Auto refresh effect
  useEffect(() => {
    if (!autoRefresh || !user) return

    const interval = setInterval(refresh, refreshInterval)
    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, refresh, user])

  // Initial load and filter change effect
  useEffect(() => {
    if (user) {
      fetchNotifications(true)
      fetchStats()
    }
  }, [user, filter.read, filter.type, filter.startDate, filter.endDate, filter.limit])

  return {
    notifications,
    loading,
    error,
    unreadCount,
    stats,
    hasMore,
    refresh,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateFilter,
    getUnreadNotifications,
    getNotificationsByType
  }
}

// Hook for notification preferences
export function useNotificationPreferences() {
  const { user } = useAuth()
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPreferences = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)
      const prefs = await notificationsApi.getPreferences()
      setPreferences(prefs)
    } catch (err) {
      console.error('Error fetching notification preferences:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch preferences')
    } finally {
      setLoading(false)
    }
  }, [user])

  const updatePreferences = useCallback(async (updates: Partial<NotificationPreferences>) => {
    if (!user || !preferences) return

    try {
      const updatedPrefs = await notificationsApi.updatePreferences(updates)
      setPreferences(updatedPrefs)
      toast.success('Đã cập nhật cài đặt thông báo')
    } catch (err) {
      console.error('Error updating notification preferences:', err)
      toast.error('Không thể cập nhật cài đặt thông báo')
    }
  }, [user, preferences])

  useEffect(() => {
    if (user) {
      fetchPreferences()
    }
  }, [user, fetchPreferences])

  return {
    preferences,
    loading,
    error,
    updatePreferences,
    refresh: fetchPreferences
  }
}

// Hook for real-time notifications (WebSocket/SSE)
export function useRealTimeNotifications() {
  const { user } = useAuth()
  const [connected, setConnected] = useState(false)
  const [lastNotification, setLastNotification] = useState<Notification | null>(null)

  useEffect(() => {
    if (!user) return

    // This would be implemented with WebSocket or Server-Sent Events
    // For now, we'll use a placeholder implementation
    
    const connectToNotificationStream = () => {
      // Example WebSocket connection
      // const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/notifications`)
      
      // ws.onopen = () => {
      //   setConnected(true)
      //   console.log('Connected to notification stream')
      // }
      
      // ws.onmessage = (event) => {
      //   const notification = JSON.parse(event.data)
      //   setLastNotification(notification)
      //   
      //   // Show toast notification
      //   toast.info(notification.title, {
      //     description: notification.message
      //   })
      // }
      
      // ws.onclose = () => {
      //   setConnected(false)
      //   console.log('Disconnected from notification stream')
      // }
      
      // return ws
    }

    // const ws = connectToNotificationStream()
    
    // return () => {
    //   if (ws) {
    //     ws.close()
    //   }
    // }
  }, [user])

  return {
    connected,
    lastNotification
  }
}