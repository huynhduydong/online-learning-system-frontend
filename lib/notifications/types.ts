export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: NotificationData
  read: boolean
  createdAt: string
  updatedAt: string
  expiresAt?: string
}

export type NotificationType = 
  | 'question_answered'
  | 'answer_accepted'
  | 'answer_voted'
  | 'question_voted'
  | 'comment_added'
  | 'question_pinned'
  | 'question_closed'
  | 'course_announcement'
  | 'assignment_due'
  | 'grade_released'
  | 'system_maintenance'
  | 'account_security'
  | 'mention'
  | 'follow'

export interface NotificationData {
  questionId?: string
  answerId?: string
  commentId?: string
  courseId?: string
  assignmentId?: string
  userId?: string
  url?: string
  metadata?: Record<string, any>
}

export interface NotificationPreferences {
  userId: string
  emailNotifications: boolean
  pushNotifications: boolean
  inAppNotifications: boolean
  preferences: {
    [K in NotificationType]: {
      email: boolean
      push: boolean
      inApp: boolean
    }
  }
}

export interface CreateNotificationRequest {
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: NotificationData
  expiresAt?: string
}

export interface NotificationFilter {
  read?: boolean
  type?: NotificationType[]
  startDate?: string
  endDate?: string
  limit?: number
  offset?: number
}

export interface NotificationStats {
  total: number
  unread: number
  byType: Record<NotificationType, number>
}

// Notification templates for different types
export const NOTIFICATION_TEMPLATES: Record<NotificationType, {
  title: (data: any) => string
  message: (data: any) => string
  icon: string
  color: string
}> = {
  question_answered: {
    title: (data) => 'Câu hỏi của bạn có câu trả lời mới',
    message: (data) => `${data.answererName} đã trả lời câu hỏi "${data.questionTitle}"`,
    icon: 'MessageCircle',
    color: 'blue'
  },
  answer_accepted: {
    title: (data) => 'Câu trả lời của bạn được chấp nhận',
    message: (data) => `Câu trả lời cho "${data.questionTitle}" đã được chấp nhận`,
    icon: 'CheckCircle',
    color: 'green'
  },
  answer_voted: {
    title: (data) => 'Câu trả lời của bạn được vote',
    message: (data) => `Câu trả lời của bạn nhận được ${data.voteType === 'up' ? 'upvote' : 'downvote'}`,
    icon: 'ThumbsUp',
    color: data.voteType === 'up' ? 'green' : 'red'
  },
  question_voted: {
    title: (data) => 'Câu hỏi của bạn được vote',
    message: (data) => `Câu hỏi "${data.questionTitle}" nhận được ${data.voteType === 'up' ? 'upvote' : 'downvote'}`,
    icon: 'ThumbsUp',
    color: data.voteType === 'up' ? 'green' : 'red'
  },
  comment_added: {
    title: (data) => 'Bình luận mới',
    message: (data) => `${data.commenterName} đã bình luận về ${data.parentType === 'question' ? 'câu hỏi' : 'câu trả lời'} của bạn`,
    icon: 'MessageSquare',
    color: 'blue'
  },
  question_pinned: {
    title: (data) => 'Câu hỏi được ghim',
    message: (data) => `Câu hỏi "${data.questionTitle}" đã được ghim bởi ${data.moderatorName}`,
    icon: 'Pin',
    color: 'yellow'
  },
  question_closed: {
    title: (data) => 'Câu hỏi được đóng',
    message: (data) => `Câu hỏi "${data.questionTitle}" đã được đóng`,
    icon: 'Lock',
    color: 'gray'
  },
  course_announcement: {
    title: (data) => 'Thông báo khóa học',
    message: (data) => `Thông báo mới từ khóa học "${data.courseName}": ${data.announcement}`,
    icon: 'Megaphone',
    color: 'purple'
  },
  assignment_due: {
    title: (data) => 'Bài tập sắp hết hạn',
    message: (data) => `Bài tập "${data.assignmentTitle}" sẽ hết hạn vào ${data.dueDate}`,
    icon: 'Clock',
    color: 'orange'
  },
  grade_released: {
    title: (data) => 'Điểm số được công bố',
    message: (data) => `Điểm cho "${data.assignmentTitle}" đã được công bố`,
    icon: 'Award',
    color: 'green'
  },
  system_maintenance: {
    title: (data) => 'Bảo trì hệ thống',
    message: (data) => `Hệ thống sẽ bảo trì từ ${data.startTime} đến ${data.endTime}`,
    icon: 'Settings',
    color: 'gray'
  },
  account_security: {
    title: (data) => 'Bảo mật tài khoản',
    message: (data) => data.message,
    icon: 'Shield',
    color: 'red'
  },
  mention: {
    title: (data) => 'Bạn được nhắc đến',
    message: (data) => `${data.mentionerName} đã nhắc đến bạn trong ${data.context}`,
    icon: 'AtSign',
    color: 'blue'
  },
  follow: {
    title: (data) => 'Người theo dõi mới',
    message: (data) => `${data.followerName} đã bắt đầu theo dõi bạn`,
    icon: 'UserPlus',
    color: 'green'
  }
}

// Utility functions
export function getNotificationTemplate(type: NotificationType, data: any) {
  const template = NOTIFICATION_TEMPLATES[type]
  return {
    title: template.title(data),
    message: template.message(data),
    icon: template.icon,
    color: template.color
  }
}

export function isNotificationExpired(notification: Notification): boolean {
  if (!notification.expiresAt) return false
  return new Date(notification.expiresAt) < new Date()
}

export function getNotificationAge(notification: Notification): string {
  const now = new Date()
  const created = new Date(notification.createdAt)
  const diffMs = now.getTime() - created.getTime()
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffMinutes < 1) return 'Vừa xong'
  if (diffMinutes < 60) return `${diffMinutes} phút trước`
  if (diffHours < 24) return `${diffHours} giờ trước`
  if (diffDays < 7) return `${diffDays} ngày trước`
  
  return created.toLocaleDateString('vi-VN')
}