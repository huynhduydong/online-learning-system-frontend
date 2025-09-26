'use client'

import React, { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { 
  ThumbsUp, 
  ThumbsDown, 
  CheckCircle, 
  MessageCircle, 
  MoreHorizontal,
  User as UserIcon,
  Pin,
  Flag,
  Edit,
  Trash2
} from 'lucide-react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'

import type { Answer } from '@/lib/api/types'
import { User } from '@/lib/permissions/types'
import { useAnswerPermissions } from '@/hooks/use-permissions'
import { PermissionGuard, OwnershipGuard, ModeratorOnly } from '@/components/permissions/permission-guard'

interface AnswerCardProps {
  answer: Answer
  currentUser?: User | null
  questionAuthorId?: string
  isAccepted?: boolean
  canAccept?: boolean
  canEdit?: boolean
  canDelete?: boolean
  canPin?: boolean
  canReport?: boolean
  onVote?: (answerId: string, voteType: 'up' | 'down') => void
  onAccept?: (answerId: string) => void
  onPin?: (answerId: string) => void
  onEdit?: (answerId: string) => void
  onDelete?: (answerId: string) => void
  onReport?: (answerId: string) => void
  onReply?: (answerId: string) => void
  className?: string
}

export function AnswerCard({
  answer,
  currentUser,
  questionAuthorId,
  isAccepted = false,
  canAccept = false,
  canEdit = false,
  canDelete = false,
  canPin = false,
  canReport = false,
  onVote,
  onAccept,
  onPin,
  onEdit,
  onDelete,
  onReport,
  onReply,
  className = ''
}: AnswerCardProps) {
  const answerPermissions = useAnswerPermissions(currentUser, {
    id: answer.id,
    authorId: answer.authorId,
    questionAuthorId,
    courseId: answer.courseId,
    isAccepted
  })
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(answer.userVote || null)

  const handleVote = (voteType: 'up' | 'down') => {
    const newVote = userVote === voteType ? null : voteType
    setUserVote(newVote)
    onVote?.(answer.id, voteType)
  }

  const handleAccept = () => {
    onAccept?.(answer.id)
  }

  const handlePin = () => {
    onPin?.(answer.id)
  }

  const handleEdit = () => {
    onEdit?.(answer.id)
  }

  const handleDelete = () => {
    onDelete?.(answer.id)
  }

  const handleReport = () => {
    onReport?.(answer.id)
  }

  const handleReply = () => {
    onReply?.(answer.id)
  }

  return (
    <Card className={`${className} ${isAccepted ? 'ring-2 ring-green-200 bg-green-50/30' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Author info */}
            <Avatar className="h-8 w-8">
              <AvatarImage src={answer.author.avatar} />
              <AvatarFallback>
                <UserIcon className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{answer.author.name}</span>
                
                {answer.author.role && (
                  <Badge variant="secondary" className="text-xs">
                    {answer.author.role === 'instructor' ? 'Giảng viên' : 
                     answer.author.role === 'ta' ? 'Trợ giảng' : 'Học viên'}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>
                  {formatDistanceToNow(new Date(answer.createdAt), { 
                    addSuffix: true,
                    locale: vi 
                  })}
                </span>
                
                {answer.updatedAt !== answer.createdAt && (
                  <>
                    <span>•</span>
                    <span>đã chỉnh sửa</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Badges */}
            <div className="flex items-center gap-1">
              {isAccepted && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Được chấp nhận
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Câu trả lời được chấp nhận bởi người hỏi hoặc giảng viên</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {answer.isPinned && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Pin className="h-4 w-4 text-orange-500 fill-current" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Câu trả lời được ghim</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            {/* Actions menu */}
            {(answerPermissions.canEdit.allowed || answerPermissions.canDelete.allowed || answerPermissions.canPin.allowed || answerPermissions.canReport.allowed) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {answerPermissions.canEdit.allowed && (
                    <DropdownMenuItem onClick={handleEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                  )}
                  
                  {answerPermissions.canPin.allowed && (
                    <DropdownMenuItem onClick={handlePin}>
                      <Pin className="h-4 w-4 mr-2" />
                      {answer.isPinned ? 'Bỏ ghim' : 'Ghim câu trả lời'}
                    </DropdownMenuItem>
                  )}
                  
                  {(answerPermissions.canEdit.allowed || answerPermissions.canPin.allowed) && (answerPermissions.canDelete.allowed || answerPermissions.canReport.allowed) && (
                    <DropdownMenuSeparator />
                  )}
                  
                  {answerPermissions.canReport.allowed && (
                    <DropdownMenuItem onClick={handleReport}>
                      <Flag className="h-4 w-4 mr-2" />
                      Báo cáo
                    </DropdownMenuItem>
                  )}
                  
                  {answerPermissions.canDelete.allowed && (
                    <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Answer content */}
        <div 
          className="prose prose-sm max-w-none mb-4"
          dangerouslySetInnerHTML={{ __html: answer.content }}
        />

        {/* Attachments */}
        {answer.attachments && answer.attachments.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Tệp đính kèm:</h4>
            <div className="space-y-1">
              {answer.attachments.map((attachment) => (
                <a
                  key={attachment.id}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  <span>{attachment.name}</span>
                  <span className="text-gray-500">({attachment.size})</span>
                </a>
              ))}
            </div>
          </div>
        )}

        <Separator className="my-4" />

        {/* Actions bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Voting */}
            <PermissionGuard
              permission="vote:answer"
              user={currentUser}
            >
              {onVote && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote('up')}
                    className={`h-8 px-2 ${
                      userVote === 'up' 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    <span>{answer.upvotes || 0}</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote('down')}
                    className={`h-8 px-2 ${
                      userVote === 'down' 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    <span>{answer.downvotes || 0}</span>
                  </Button>
                </div>
              )}
            </PermissionGuard>

            {/* Reply button */}
            <PermissionGuard
              permission="comment:create"
              user={currentUser}
            >
              {onReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReply}
                  className="h-8 px-2"
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Trả lời
                </Button>
              )}
            </PermissionGuard>
          </div>

          {/* Accept button */}
          {answerPermissions.canAccept.allowed && !isAccepted && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAccept}
              className="h-8 border-green-200 text-green-700 hover:bg-green-50"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Chấp nhận câu trả lời
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default AnswerCard