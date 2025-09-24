'use client'

import React, { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { 
  Bell, 
  Check, 
  CheckCheck, 
  MessageSquare, 
  Award, 
  UserPlus,
  Heart,
  MessageCircle,
  Pin,
  Flag,
  Filter,
  Search,
  Trash2,
  MoreHorizontal
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useNotifications } from '@/contexts/notification-context'
import { QANotification } from '@/lib/api/types'

const getNotificationIcon = (type: QANotification['type']) => {
  switch (type) {
    case 'question_answered':
      return <MessageSquare className="h-5 w-5 text-blue-500" />
    case 'answer_accepted':
      return <Award className="h-5 w-5 text-green-500" />
    case 'answer_voted':
      return <Heart className="h-5 w-5 text-red-500" />
    case 'question_commented':
      return <MessageCircle className="h-5 w-5 text-purple-500" />
    case 'answer_commented':
      return <MessageCircle className="h-5 w-5 text-purple-500" />
    case 'question_followed':
      return <UserPlus className="h-5 w-5 text-indigo-500" />
    case 'question_pinned':
      return <Pin className="h-5 w-5 text-yellow-500" />
    case 'question_flagged':
      return <Flag className="h-5 w-5 text-orange-500" />
    default:
      return <Bell className="h-5 w-5 text-gray-500" />
  }
}

const getNotificationTypeLabel = (type: QANotification['type']) => {
  switch (type) {
    case 'question_answered':
      return 'Câu trả lời mới'
    case 'answer_accepted':
      return 'Câu trả lời được chấp nhận'
    case 'answer_voted':
      return 'Bình chọn câu trả lời'
    case 'question_commented':
      return 'Bình luận câu hỏi'
    case 'answer_commented':
      return 'Bình luận câu trả lời'
    case 'question_followed':
      return 'Theo dõi câu hỏi'
    case 'question_pinned':
      return 'Câu hỏi được ghim'
    case 'question_flagged':
      return 'Câu hỏi được báo cáo'
    default:
      return 'Thông báo'
  }
}

interface NotificationItemProps {
  notification: QANotification
  onMarkAsRead: (id: number) => void
  onRemove: (id: number) => void
}

function NotificationItem({ notification, onMarkAsRead, onRemove }: NotificationItemProps) {
  const handleClick = () => {
    if (!notification.is_read) {
      onMarkAsRead(notification.id)
    }
    
    // Navigate to the related content if data contains a link
    if (notification.data?.link) {
      window.location.href = notification.data.link
    }
  }

  return (
    <Card className={cn(
      "cursor-pointer transition-all hover:shadow-md",
      !notification.is_read && "border-blue-200 bg-blue-50/30 dark:border-blue-800 dark:bg-blue-950/20"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            {getNotificationIcon(notification.type)}
          </div>
          
          <div className="flex-1 min-w-0" onClick={handleClick}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-xs">
                    {getNotificationTypeLabel(notification.type)}
                  </Badge>
                  {!notification.is_read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </div>
                
                <h4 className={cn(
                  "text-sm font-medium leading-tight mb-1",
                  !notification.is_read && "font-semibold"
                )}>
                  {notification.title}
                </h4>
                
                <p className="text-sm text-muted-foreground mb-2">
                  {notification.message}
                </p>
                
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(notification.created_at), { 
                    addSuffix: true,
                    locale: vi 
                  })}
                </p>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!notification.is_read && (
                    <DropdownMenuItem onClick={() => onMarkAsRead(notification.id)}>
                      <Check className="h-4 w-4 mr-2" />
                      Đánh dấu đã đọc
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onRemove(notification.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa thông báo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function NotificationList() {
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotifications()

  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'read'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest')

  // Filter and sort notifications
  const filteredNotifications = notifications
    .filter(notification => {
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          notification.title.toLowerCase().includes(query) ||
          notification.message.toLowerCase().includes(query)
        )
      }
      return true
    })
    .filter(notification => {
      // Filter by read status
      switch (filterType) {
        case 'unread':
          return !notification.is_read
        case 'read':
          return notification.is_read
        default:
          return true
      }
    })
    .sort((a, b) => {
      // Sort by date
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB
    })

  const unreadNotifications = notifications.filter(n => !n.is_read)
  const readNotifications = notifications.filter(n => n.is_read)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Thông báo</h1>
          <p className="text-muted-foreground">
            Quản lý và theo dõi các thông báo của bạn
          </p>
        </div>
        
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead}>
            <CheckCheck className="h-4 w-4 mr-2" />
            Đánh dấu tất cả đã đọc ({unreadCount})
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm thông báo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="unread">Chưa đọc ({unreadNotifications.length})</SelectItem>
                <SelectItem value="read">Đã đọc ({readNotifications.length})</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="oldest">Cũ nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Tabs value={filterType} onValueChange={(value: any) => setFilterType(value)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            Tất cả ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Chưa đọc ({unreadNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="read">
            Đã đọc ({readNotifications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filterType} className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchQuery ? 'Không tìm thấy thông báo' : 'Không có thông báo nào'}
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc'
                    : 'Các thông báo mới sẽ xuất hiện ở đây'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onRemove={removeNotification}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}