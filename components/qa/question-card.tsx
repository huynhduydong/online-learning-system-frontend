'use client'

import React from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import {
  MessageCircle,
  ThumbsUp,
  Eye,
  Pin,
  CheckCircle,
  Clock,
  User as UserIcon,
  Tag
} from 'lucide-react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import type { Question, QuestionStatus, QuestionCategory } from '@/lib/api/types'
import { User } from '@/lib/permissions/types'
import { useQuestionPermissions } from '@/hooks/use-permissions'
import { PermissionGuard, OwnershipGuard, ModeratorOnly } from '@/components/permissions/permission-guard'

interface QuestionCardProps {
  question: Question
  currentUser?: User | null
  showCourse?: boolean
  showLesson?: boolean
  compact?: boolean
  onVote?: (questionId: string, voteType: 'up' | 'down') => void
  onPin?: (questionId: string) => void
  className?: string
}

const statusConfig = {
  new: {
    label: 'Mới',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Clock
  },
  in_progress: {
    label: 'Đang xử lý',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock
  },
  answered: {
    label: 'Đã trả lời',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle
  },
  closed: {
    label: 'Đã đóng',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: CheckCircle
  }
}

const categoryConfig = {
  lesson_content: {
    label: 'Nội dung bài học',
    color: 'bg-purple-100 text-purple-800'
  },
  technical_issue: {
    label: 'Vấn đề kỹ thuật',
    color: 'bg-red-100 text-red-800'
  },
  administrative: {
    label: 'Thủ tục hành chính',
    color: 'bg-blue-100 text-blue-800'
  },
  support_request: {
    label: 'Yêu cầu hỗ trợ',
    color: 'bg-orange-100 text-orange-800'
  },
  bug_report: {
    label: 'Báo cáo lỗi',
    color: 'bg-red-100 text-red-800'
  }
}

export function QuestionCard({
  question,
  currentUser,
  showCourse = false,
  showLesson = false,
  compact = false,
  onVote,
  onPin,
  className = ''
}: QuestionCardProps) {
  const questionPermissions = useQuestionPermissions(currentUser, {
    id: question.id,
    authorId: question.author.id,
    courseId: question.scope === 'course' ? question.scope_id : undefined,
    hasAnswers: question.answer_count > 0
  })
  const statusInfo = statusConfig[question.status as QuestionStatus]
  const categoryInfo = categoryConfig[question.category as QuestionCategory]
  const StatusIcon = statusInfo.icon

  const handleVoteUp = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onVote?.(question.id, 'up')
  }

  const handlePin = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onPin?.(question.id)
  }

  return (
    <Card className={`hover:shadow-md transition-shadow duration-200 ${className}`}>
      <CardHeader className={compact ? 'pb-2' : 'pb-3'}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {question.is_pinned && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Pin className="h-4 w-4 text-orange-500 fill-current" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Câu hỏi được ghim</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              <Badge variant="outline" className={statusInfo.color}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusInfo.label}
              </Badge>

              {categoryInfo && (
                <Badge variant="secondary" className={categoryInfo.color}>
                  {categoryInfo.label}
                </Badge>
              )}
            </div>

            <Link
              href={`/qa/questions/${question.id}`}
              className="block group"
            >
              <h3 className={`font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 ${compact ? 'text-sm' : 'text-base'
                }`}>
                {question.title}
              </h3>
            </Link>

            {!compact && question.content && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {question.content.replace(/<[^>]*>/g, '')} {/* Strip HTML tags for preview */}
              </p>
            )}

            {/* Course and Lesson info */}
            {(showCourse || showLesson) && (
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                {showCourse && question.courseTitle && (
                  <span>Khóa học: {question.courseTitle}</span>
                )}
                {showCourse && showLesson && question.courseTitle && question.lessonTitle && (
                  <span>•</span>
                )}
                {showLesson && question.lessonTitle && (
                  <span>Bài học: {question.lessonTitle}</span>
                )}
              </div>
            )}

            {/* Tags */}
            {question.tags && question.tags.length > 0 && (
              <div className="flex items-center gap-1 mt-2 flex-wrap">
                <Tag className="h-3 w-3 text-gray-400" />
                {question.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag.id} variant="outline" className="text-xs">
                    {tag.name}
                  </Badge>
                ))}
                {question.tags.length > 3 && (
                  <span className="text-xs text-gray-500">+{question.tags.length - 3}</span>
                )}
              </div>
            )}
          </div>

          {/* Vote button */}
          {onVote && (
            <PermissionGuard
              permission="vote:question"
              user={currentUser}
            >
              <div className="flex flex-col items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleVoteUp}
                  className="h-8 w-8 p-0 hover:bg-blue-50"
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <span className="text-xs font-medium text-gray-600">
                  {question.voteCount || 0}
                </span>
              </div>
            </PermissionGuard>
          )}
        </div>
      </CardHeader>

      <CardContent className={compact ? 'pt-0' : 'pt-2'}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {/* Author info */}
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={question.author.avatar} />
                <AvatarFallback>
                  <UserIcon className="h-3 w-3" />
                </AvatarFallback>
              </Avatar>
              <span>{question.author.name}</span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>{question.answer_count || 0}</span>
              </div>

              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{question.view_count || 0}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Pin button for authorized users */}
            {onPin && questionPermissions.canPin.allowed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePin}
                className="h-8 w-8 p-0"
              >
                <Pin className={`h-4 w-4 ${question.is_pinned ? 'text-orange-500 fill-current' : 'text-gray-400'}`} />
              </Button>
            )}

            {/* Time */}
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(question.created_at), {
                addSuffix: true,
                locale: vi
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default QuestionCard