'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { QANotification } from '@/lib/api/types'
import { qaApi } from '@/lib/api/qa'
import { useAuth } from './auth-context'
import { useToast } from '@/hooks/use-toast'

interface NotificationContextType {
  notifications: QANotification[]
  unreadCount: number
  isLoading: boolean
  error: string | null
  fetchNotifications: () => Promise<void>
  markAsRead: (notificationId: number) => Promise<void>
  markAllAsRead: () => Promise<void>
  addNotification: (notification: Omit<QANotification, 'id' | 'created_at'>) => void
  removeNotification: (notificationId: number) => void
  clearError: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

interface NotificationProviderProps {
  children: React.ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<QANotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  const fetchNotifications = useCallback(async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await qaApi.getNotifications(1, 50) // Get first 50 notifications
      setNotifications(data.notifications)
      setUnreadCount(data.unread_count)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch notifications'
      setError(errorMessage)
      console.error('Error fetching notifications:', err)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      await qaApi.markNotificationAsRead(notificationId)
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true }
            : notification
        )
      )
      
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark notification as read'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
      console.error('Error marking notification as read:', err)
    }
  }, [toast])

  const markAllAsRead = useCallback(async () => {
    try {
      await qaApi.markAllNotificationsAsRead()
      
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      )
      
      setUnreadCount(0)
      
      toast({
        title: 'Success',
        description: 'All notifications marked as read'
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark all notifications as read'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
      console.error('Error marking all notifications as read:', err)
    }
  }, [toast])

  const addNotification = useCallback((notification: Omit<QANotification, 'id' | 'created_at'>) => {
    const newNotification: QANotification = {
      ...notification,
      id: Date.now(), // Temporary ID for real-time notifications
      created_at: new Date().toISOString(),
    }
    
    setNotifications(prev => [newNotification, ...prev])
    
    if (!newNotification.is_read) {
      setUnreadCount(prev => prev + 1)
    }

    // Show toast for new notifications
    toast({
      title: newNotification.title,
      description: newNotification.message,
      duration: 5000,
    })
  }, [toast])

  const removeNotification = useCallback((notificationId: number) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === notificationId)
      if (notification && !notification.is_read) {
        setUnreadCount(count => Math.max(0, count - 1))
      }
      return prev.filter(n => n.id !== notificationId)
    })
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Fetch notifications when user logs in
  useEffect(() => {
    if (user) {
      fetchNotifications()
    } else {
      // Clear notifications when user logs out
      setNotifications([])
      setUnreadCount(0)
      setError(null)
    }
  }, [user, fetchNotifications])

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    if (!user) return

    const interval = setInterval(() => {
      fetchNotifications()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [user, fetchNotifications])

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    clearError,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}