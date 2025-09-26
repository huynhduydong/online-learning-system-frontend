'use client'

import React, { useState } from 'react'
import { Bell, Filter, MoreHorizontal, Settings, Trash2, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { AppContainer } from '@/components/app-container'
import { useNotifications } from '@/hooks/use-notifications'
import { NotificationItem } from '@/components/notifications/notification-item'
import { NotificationPreferences } from '@/components/notifications/notification-preferences'

import type { NotificationType } from '@/lib/notifications/types'

const notificationTypeOptions: { value: NotificationType | 'all'; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'qa.question', label: 'Câu hỏi Q&A' },
  { value: 'qa.answer', label: 'Trả lời Q&A' },
  { value: 'qa.comment', label: 'Bình luận Q&A' },
  { value: 'qa.vote', label: 'Bình chọn Q&A' },
  { value: 'course.enrollment', label: 'Đăng ký khóa học' },
  { value: 'course.update', label: 'Cập nhật khóa học' },
  { value: 'assignment.due', label: 'Hạn nộp bài tập' },
  { value: 'assignment.graded', label: 'Bài tập đã chấm' },
  { value: 'discussion.reply', label: 'Trả lời thảo luận' },
  { value: 'discussion.mention', label: 'Nhắc đến trong thảo luận' },
  { value: 'achievement.earned', label: 'Thành tích đạt được' },
  { value: 'system.maintenance', label: 'Bảo trì hệ thống' },
  { value: 'system.update', label: 'Cập nhật hệ thống' }
]

export default function NotificationsPage() {
  const [showPreferences, setShowPreferences] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread' | 'read'>('all')
  const [selectedType, setSelectedType] = useState<NotificationType | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const {
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
  } = useNotifications({
    autoRefresh: true,
    refreshInterval: 30000,
    initialFilter: { limit: 20, offset: 0 }
  })

  // Filter notifications based on current tab and filters
  const filteredNotifications = React.useMemo(() => {
    let filtered = notifications

    // Filter by read status
    if (selectedTab === 'unread') {
      filtered = filtered.filter(n => !n.read)
    } else if (selectedTab === 'read') {
      filtered = filtered.filter(n => n.read)
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(n => n.type === selectedType)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(query) ||
        n.message?.toLowerCase().includes(query) ||
        n.senderName?.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [notifications, selectedTab, selectedType, searchQuery])

  const handleTabChange = (tab: 'all' | 'unread' | 'read') => {
    setSelectedTab(tab)
    updateFilter({
      read: tab === 'all' ? undefined : tab === 'read'
    })
  }

  const handleTypeChange = (type: NotificationType | 'all') => {
    setSelectedType(type)
    updateFilter({
      type: type === 'all' ? undefined : type
    })
  }

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
    if (selectedTab === 'unread') {
      setSelectedTab('all')
    }
  }

  const handleDeleteAll = async () => {
    // This would need to be implemented in the API
    // For now, we'll just refresh
    await refresh()
  }

  if (showPreferences) {
    return (
      <AppContainer>
        <div className="py-6">
          <NotificationPreferences
            onClose={() => setShowPreferences(false)}
          />
        </div>
      </AppContainer>
    )
  }

  return (
    <AppContainer>
      <div className="py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-6 w-6" />
            <div>
              <h1 className="text-2xl font-bold">Notifications</h1>
              <p className="text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPreferences(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Mark all as read
                </DropdownMenuItem>
                <DropdownMenuItem onClick={refresh}>
                  <Bell className="h-4 w-4 mr-2" />
                  Refresh
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDeleteAll} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete all
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">Total</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{stats.unread}</div>
                <p className="text-xs text-muted-foreground">Unread</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{stats.todayCount}</div>
                <p className="text-xs text-muted-foreground">Today</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">{stats.weekCount}</div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">Thông báo</h1>
                <p className="text-muted-foreground">
                  {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Bạn đã đọc hết thông báo'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Cài đặt
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setShowPreferences(true)}>
                      Tùy chọn thông báo
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={markAllAsRead}>
                      <CheckCheck className="h-4 w-4 mr-2" />
                      Đánh dấu đã đọc tất cả
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={refresh}>
                      Làm mới
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={deleteAllNotifications}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa tất cả
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{totalCount}</div>
                  <p className="text-xs text-muted-foreground">Tổng số</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{unreadCount}</div>
                  <p className="text-xs text-muted-foreground">Chưa đọc</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{todayCount}</div>
                  <p className="text-xs text-muted-foreground">Hôm nay</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{thisWeekCount}</div>
                  <p className="text-xs text-muted-foreground">Tuần này</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Tìm kiếm thông báo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Lọc theo loại" />
                </SelectTrigger>
                <SelectContent>
                  {notificationTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notification Tabs */}
            <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as any)}>
              <TabsList>
                <TabsTrigger value="all" className="relative">
                  Tất cả
                  {totalCount > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                      {totalCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="unread" className="relative">
                  Chưa đọc
                  {unreadCount > 0 && (
                    <Badge variant="default" className="ml-2 h-5 px-1.5 text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="read" className="relative">
                  Đã đọc
                  {readCount > 0 && (
                    <Badge variant="outline" className="ml-2 h-5 px-1.5 text-xs">
                      {readCount}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <NotificationList
                  notifications={filteredNotifications}
                  loading={loading}
                  onNotificationUpdate={handleNotificationUpdate}
                />
              </TabsContent>

              <TabsContent value="unread" className="space-y-4">
                <NotificationList
                  notifications={filteredNotifications.filter(n => !n.read)}
                  loading={loading}
                  onNotificationUpdate={handleNotificationUpdate}
                />
              </TabsContent>

              <TabsContent value="read" className="space-y-4">
                <NotificationList
                  notifications={filteredNotifications.filter(n => n.read)}
                  loading={loading}
                  onNotificationUpdate={handleNotificationUpdate}
                />
              </TabsContent>
            </Tabs>

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={loading}
                >
                  {loading ? 'Đang tải...' : 'Tải thêm'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppContainer>
  )
}


function NotificationList({
  notifications,
  loading,
  onNotificationUpdate
}: {
  notifications: any[]
  loading: boolean
  onNotificationUpdate: (id: string, updates: any) => void
}) {
  if (loading && notifications.length === 0) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {selectedTab === 'unread' ? 'Không có thông báo chưa đọc' : 'Không có thông báo'}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onUpdate={onNotificationUpdate}
        />
      ))}
    </div>
  )
}