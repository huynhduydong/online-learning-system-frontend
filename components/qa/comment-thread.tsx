'use client'

import React, { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { 
  MessageCircle, 
  MoreHorizontal,
  User as UserIcon,
  Reply,
  Edit,
  Trash2,
  Flag,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'

import type { Comment } from '@/lib/api/types'
import { User } from '@/lib/permissions/types'
import { useCommentPermissions } from '@/hooks/use-permissions'
import { PermissionGuard, OwnershipGuard } from '@/components/permissions/permission-guard'

interface CommentThreadProps {
  comments: Comment[]
  parentType: 'question' | 'answer'
  parentId: string
  currentUser?: User | null
  onAddComment?: (parentId: string, content: string, parentCommentId?: string) => void
  onEditComment?: (commentId: string, content: string) => void
  onDeleteComment?: (commentId: string) => void
  onReportComment?: (commentId: string) => void
  className?: string
}

interface CommentItemProps {
  comment: Comment
  level: number
  currentUser?: User | null
  onReply: (commentId: string, content: string) => void
  onEdit: (commentId: string, content: string) => void
  onDelete: (commentId: string) => void
  onReport: (commentId: string) => void
}

function CommentItem({
  comment,
  level,
  currentUser,
  onReply,
  onEdit,
  onDelete,
  onReport
}: CommentItemProps) {
  const { canEdit, canDelete, canReport } = useCommentPermissions(currentUser, comment)
  const [isReplying, setIsReplying] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [editContent, setEditContent] = useState(comment.content)
  const [showReplies, setShowReplies] = useState(true)

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent.trim())
      setReplyContent('')
      setIsReplying(false)
    }
  }

  const handleEdit = () => {
    if (editContent.trim() && editContent !== comment.content) {
      onEdit(comment.id, editContent.trim())
      setIsEditing(false)
    } else {
      setIsEditing(false)
    }
  }

  const handleDelete = () => {
    onDelete(comment.id)
  }

  const handleReport = () => {
    onReport(comment.id)
  }



  return (
    <div className={`${level > 0 ? 'ml-6 border-l-2 border-gray-100 pl-4' : ''}`}>
      <div className="flex items-start gap-3 py-3">
        {/* Avatar */}
        <Avatar className="h-7 w-7 mt-1">
          <AvatarImage src={comment.author.avatar} />
          <AvatarFallback>
            <UserIcon className="h-3 w-3" />
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Author and timestamp */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm text-gray-900">
              {comment.author.name}
            </span>
            
            {comment.author.role && (
              <Badge variant="secondary" className="text-xs">
                {comment.author.role === 'instructor' ? 'Giảng viên' : 
                 comment.author.role === 'ta' ? 'Trợ giảng' : 'Học viên'}
              </Badge>
            )}
            
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(comment.createdAt), { 
                addSuffix: true,
                locale: vi 
              })}
            </span>
            
            {comment.updatedAt !== comment.createdAt && (
              <span className="text-xs text-gray-500">(đã chỉnh sửa)</span>
            )}
          </div>

          {/* Content */}
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[60px] text-sm"
                placeholder="Nhập bình luận..."
              />
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleEdit}>
                  Lưu
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(false)
                    setEditContent(comment.content)
                  }}
                >
                  Hủy
                </Button>
              </div>
            </div>
          ) : (
            <div 
              className="text-sm text-gray-700 mb-2 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: comment.content }}
            />
          )}

          {/* Actions */}
          {!isEditing && (
            <div className="flex items-center gap-2">
              <PermissionGuard
                permission="comment:create"
                user={currentUser}
                fallback={null}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsReplying(!isReplying)}
                  className="h-7 px-2 text-xs text-gray-500 hover:text-gray-700"
                >
                  <Reply className="h-3 w-3 mr-1" />
                  Trả lời
                </Button>
              </PermissionGuard>

              {(canEdit || canDelete || canReport) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <OwnershipGuard
                      permission="comment:edit"
                      user={currentUser}
                      resource={comment}
                      fallback={null}
                    >
                      <DropdownMenuItem onClick={() => setIsEditing(true)}>
                        <Edit className="h-3 w-3 mr-2" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                    </OwnershipGuard>
                    
                    {canEdit && (canDelete || canReport) && (
                      <DropdownMenuSeparator />
                    )}
                    
                    <PermissionGuard
                      permission="comment:report"
                      user={currentUser}
                      fallback={null}
                    >
                      <DropdownMenuItem onClick={handleReport}>
                        <Flag className="h-3 w-3 mr-2" />
                        Báo cáo
                      </DropdownMenuItem>
                    </PermissionGuard>
                    
                    <OwnershipGuard
                      permission="comment:delete"
                      user={currentUser}
                      resource={comment}
                      fallback={null}
                    >
                      <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                        <Trash2 className="h-3 w-3 mr-2" />
                        Xóa
                      </DropdownMenuItem>
                    </OwnershipGuard>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}

          {/* Reply form */}
          {isReplying && (
            <div className="mt-3 space-y-2">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[60px] text-sm"
                placeholder="Nhập phản hồi..."
              />
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleReply} disabled={!replyContent.trim()}>
                  Gửi
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    setIsReplying(false)
                    setReplyContent('')
                  }}
                >
                  Hủy
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.length > 3 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplies(!showReplies)}
              className="h-7 px-2 text-xs text-gray-500 hover:text-gray-700 mb-2"
            >
              {showReplies ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  Ẩn {comment.replies.length} phản hồi
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Hiện {comment.replies.length} phản hồi
                </>
              )}
            </Button>
          )}
          
          {(showReplies || comment.replies.length <= 3) && (
            <div className="space-y-1">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  level={level + 1}
                  currentUser={currentUser}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onReport={onReport}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function CommentThread({
  comments,
  parentType,
  parentId,
  currentUser,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onReportComment,
  className = ''
}: CommentThreadProps) {
  const { canCreate } = useCommentPermissions(currentUser)
  const [newComment, setNewComment] = useState('')
  const [isAddingComment, setIsAddingComment] = useState(false)

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment?.(parentId, newComment.trim())
      setNewComment('')
      setIsAddingComment(false)
    }
  }

  const handleReply = (commentId: string, content: string) => {
    onAddComment?.(parentId, content, commentId)
  }

  const handleEdit = (commentId: string, content: string) => {
    onEditComment?.(commentId, content)
  }

  const handleDelete = (commentId: string) => {
    onDeleteComment?.(commentId)
  }

  const handleReport = (commentId: string) => {
    onReportComment?.(commentId)
  }

  if (!comments || comments.length === 0) {
    return (
      <div className={className}>
        <PermissionGuard
          permission="comment:create"
          user={currentUser}
          fallback={null}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Chưa có bình luận nào</span>
            </div>
            
            {isAddingComment ? (
              <div className="space-y-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px]"
                  placeholder="Thêm bình luận..."
                />
                <div className="flex items-center gap-2">
                  <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                    Gửi bình luận
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsAddingComment(false)
                      setNewComment('')
                    }}
                  >
                    Hủy
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => setIsAddingComment(true)}
                className="w-full"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Thêm bình luận
              </Button>
            )}
          </div>
        </PermissionGuard>
      </div>
    )
  }

  return (
    <div className={className}>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="h-4 w-4 text-gray-600" />
            <span className="font-medium text-gray-900">
              Bình luận ({comments.length})
            </span>
          </div>

          <div className="space-y-1">
            {comments.map((comment, index) => (
              <div key={comment.id}>
                <CommentItem
                  comment={comment}
                  level={0}
                  currentUser={currentUser}
                  onReply={handleReply}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onReport={handleReport}
                />
                {index < comments.length - 1 && <Separator className="my-2" />}
              </div>
            ))}
          </div>

          <PermissionGuard
            permission="comment:create"
            user={currentUser}
            fallback={null}
          >
            <div className="mt-4 pt-4 border-t">
              {isAddingComment ? (
                <div className="space-y-2">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[80px]"
                    placeholder="Thêm bình luận..."
                  />
                  <div className="flex items-center gap-2">
                    <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                      Gửi bình luận
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsAddingComment(false)
                        setNewComment('')
                      }}
                    >
                      Hủy
                    </Button>
                  </div>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddingComment(true)}
                  className="w-full"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Thêm bình luận
                </Button>
              )}
            </div>
          </PermissionGuard>
        </CardContent>
      </Card>
    </div>
  )
}

export default CommentThread