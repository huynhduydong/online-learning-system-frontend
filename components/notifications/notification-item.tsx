'use client'

import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import {
  MessageSquare,
  ThumbsUp,
  BookOpen,
  Users,
  Award,
  AlertCircle,
  CheckCircle,
  Info,
  X,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Notification, NotificationType } from '@/lib/notifications/types'
import { cn } from '@/lib/utils'

interface NotificationItemProps {
  notification: Notification
  onClick?: () => void
  onDelete?: () => void
  compact?: boolean
  showActions?: boolean
}

const notificationIcons: Record<NotificationType, React.ComponentType<{ className?: string }>> = {
  'qa.question': MessageSquare,
  'qa.answer': MessageSquare,
  'qa.comment': MessageSquare,
  'qa.vote': ThumbsUp,
  'course.enrollment': BookOpen,
  'course.update': BookOpen,
  'assignment.due': AlertCircle,
  'assignment.graded': CheckCircle,
  'discussion.reply': MessageSquare,
  'discussion.mention': Users,
  'achievement.earned': Award,
  'system.maintenance': Info,
  'system.update': Info
}

const notificationColors: Record<NotificationType, string> = {
  'qa.question': 'text-blue-500',
  'qa.answer': 'text-green-500',
  'qa.comment': 'text-purple-500',
  'qa.vote': 'text-orange-500',
  'course.enrollment': 'text-indigo-500',
  'course.update': 'text-indigo-500',
  'assignment.due': 'text-red-500',
  'assignment.graded': 'text-green-500',
  'discussion.reply': 'text-blue-500',
  'discussion.mention': 'text-yellow-500',
  'achievement.earned': 'text-yellow-500',
  'system.maintenance': 'text-gray-500',
  'system.update': 'text-gray-500'
}

export function NotificationItem({
  notification,
  onClick,
  onDelete,
  compact = false,
  showActions = true
}: NotificationItemProps) {
  const Icon = notificationIcons[notification.type] || Info
  const iconColor = notificationColors[notification.type] || 'text-gray-500'

  const formatDate = (date: string) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true
    })
  }

  const handleClick = () => {
    onClick?.()

    // Navigate to related content if URL is provided
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.()
  }

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
          !notification.read && "bg-blue-50 dark:bg-blue-950/20"
        )}
        onClick={handleClick}
      >
        <div className={cn("flex-shrink-0 mt-0.5", iconColor)}>
          <Icon className="h-4 w-4" />
        </div>

        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-sm",
            !notification.read && "font-medium"
          )}>
            {notification.title}
          </p>
          {notification.message && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {notification.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {formatDate(notification.createdAt)}
          </p>
        </div>

        {!notification.read && (
          <div className="flex-shrink-0">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
          </div>
        )}

        {showActions && onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="flex-shrink-0 h-auto p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    )
  }

  return (
    <Card className={cn(
      "transition-colors hover:bg-muted/50 cursor-pointer",
      !notification.read && "border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800"
    )}>
      <CardContent className="p-4" onClick={handleClick}>
        <div className="flex items-start gap-4">
          {/* Avatar or Icon */}
          {notification.senderAvatar ? (
            <Avatar className="h-10 w-10">
              <AvatarImage src={notification.senderAvatar} alt={notification.senderName || ''} />
              <AvatarFallback>
                {notification.senderName?.charAt(0) || <Icon className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className={cn(
              "flex items-center justify-center h-10 w-10 rounded-full bg-muted",
              iconColor
            )}>
              <Icon className="h-5 w-5" />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h4 className={cn(
                  "text-sm",
                  !notification.read && "font-semibold"
                )}>
                  {notification.title}
                </h4>

                {notification.senderName && (
                  <p className="text-xs text-muted-foreground">
                    From {notification.senderName}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {!notification.read && (
                  <Badge variant="secondary" className="text-xs">
                    New
                  </Badge>
                )}

                {showActions && onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="h-auto p-1"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>

            {notification.message && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                {notification.message}
              </p>
            )}

            {/* Metadata */}
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-muted-foreground">
                {formatDate(notification.createdAt)}
              </p>

              {notification.actionUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1 text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.location.href = notification.actionUrl!
                  }}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View details
                </Button>
              )}
            </div>

            {/* Priority indicator */}
            {notification.priority === 'high' && (
              <div className="flex items-center gap-1 mt-2">
                <AlertCircle className="h-3 w-3 text-red-500" />
                <span className="text-xs text-red-500 font-medium">
                  High priority
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}