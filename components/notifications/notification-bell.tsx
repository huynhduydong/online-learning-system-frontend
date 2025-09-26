'use client'

import React, { useState } from 'react'
import { Bell, BellRing, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuHeader,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNotifications } from '@/hooks/use-notifications'
import { NotificationItem } from './notification-item'
import { NotificationPreferences } from './notification-preferences'
import { cn } from '@/lib/utils'

interface NotificationBellProps {
  className?: string
}

export function NotificationBell({ className }: NotificationBellProps) {
  const [showPreferences, setShowPreferences] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh
  } = useNotifications({
    autoRefresh: true,
    refreshInterval: 30000,
    initialFilter: { limit: 10, offset: 0 }
  })

  const recentNotifications = notifications.slice(0, 5)

  const handleNotificationClick = async (notificationId: string) => {
    await markAsRead(notificationId)
  }

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      refresh()
    }
  }

  if (showPreferences) {
    return (
      <NotificationPreferences
        onClose={() => setShowPreferences(false)}
      />
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "relative h-9 w-9 rounded-full",
            className
          )}
        >
          {unreadCount > 0 ? (
            <BellRing className="h-4 w-4" />
          ) : (
            <Bell className="h-4 w-4" />
          )}
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 p-0"
        sideOffset={4}
      >
        <DropdownMenuHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">
              Notifications
            </h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="h-auto p-1 text-xs"
                >
                  Mark all as read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreferences(true)}
                className="h-auto p-1"
              >
                <Settings className="h-3 w-3" />
                <span className="sr-only">Settings</span>
              </Button>
            </div>
          </div>
          {unreadCount > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {unreadCount} unread
            </p>
          )}
        </DropdownMenuHeader>

        <DropdownMenuSeparator />

        <ScrollArea className="h-96">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading...
            </div>
          ) : recentNotifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            <div className="p-1">
              {recentNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClick={() => handleNotificationClick(notification.id)}
                  onDelete={() => deleteNotification(notification.id)}
                  compact
                />
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Button
                variant="ghost"
                className="w-full justify-center rounded-none"
                onClick={() => {
                  setIsOpen(false)
                  // Navigate to full notifications page
                  window.location.href = '/notifications'
                }}
              >
                View all
              </Button>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}