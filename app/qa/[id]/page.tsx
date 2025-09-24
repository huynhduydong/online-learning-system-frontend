'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Share2,
  Bookmark,
  Flag,
  Edit,
  Trash2,
  MessageSquare,
  Award,
  Pin,
  Eye,
  Clock,
  User,
  Tag,
  ThumbsUp,
  ThumbsDown,
  BookmarkCheck,
  PinOff,
  Lock,
  Unlock
} from 'lucide-react'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import { AnswerCard, CommentThread } from '@/components/qa'
import { ErrorState } from '@/components/error-state'
import { Skeleton } from '@/components/ui/skeleton'
import { PermissionGuard, OwnershipGuard } from '@/components/permissions/permission-guard'
import { useAuth } from '@/contexts/auth-context'
import { useQuestionPermissions } from '@/hooks/use-permissions'

import { qaApi } from '@/lib/api/qa'
import type {
  Question,
  Answer,
  QuestionStatus,
  CreateAnswerRequest,
  CreateCommentRequest,
  User as UserType
} from '@/lib/api/types'

const statusConfig = {
  new: { label: 'Mới', color: 'bg-blue-500' },
  in_progress: { label: 'Đang xử lý', color: 'bg-yellow-500' },
  answered: { label: 'Đã trả lời', color: 'bg-green-500' },
  closed: { label: 'Đã đóng', color: 'bg-gray-500' }
}

export default function QuestionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const questionId = params.id as string
  const { user } = useAuth()

  // State
  const [question, setQuestion] = useState<Question | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newAnswer, setNewAnswer] = useState('')
  const [submittingAnswer, setSubmittingAnswer] = useState(false)

  // Permission checks
  const questionPermissions = useQuestionPermissions(
    user,
    question?.courseId,
    question?.authorId,
    question?.status
  )

  const [isBookmarked, setIsBookmarked] = useState(false)
  const [activeTab, setActiveTab] = useState('answers')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'votes'>('votes')

  // Load question and answers
  useEffect(() => {
    const loadQuestionData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Load question details
        const questionResponse = await qaService.getQuestion(questionId)
        setQuestion(questionResponse.data.question)

        // Load answers
        const answersResponse = await qaService.getAnswers(questionId, {
          sortBy,
          sortOrder: sortBy === 'oldest' ? 'asc' : 'desc'
        })
        setAnswers(answersResponse.data.answers)

        // Check if bookmarked
        try {
          const bookmarkResponse = await qaService.getBookmarkStatus(questionId)
          setIsBookmarked(bookmarkResponse.data.isBookmarked)
        } catch (err) {
          // Ignore bookmark check errors
        }

        // Increment view count
        await qaService.incrementViews(questionId)

      } catch (err: any) {
        console.error('Error loading question:', err)
        setError(err.message || 'Không thể tải câu hỏi')
      } finally {
        setLoading(false)
      }
    }

    if (questionId) {
      loadQuestionData()
    }
  }, [questionId, sortBy])

  // Handlers
  const handleVoteQuestion = async (voteType: 'up' | 'down') => {
    if (!question) return

    try {
      await qaService.voteQuestion(questionId, voteType)
      setQuestion(prev => prev ? {
        ...prev,
        voteCount: (prev.voteCount || 0) + (voteType === 'up' ? 1 : -1)
      } : null)
    } catch (err) {
      console.error('Error voting question:', err)
    }
  }

  const handleVoteAnswer = async (answerId: string, voteType: 'up' | 'down') => {
    try {
      await qaService.voteAnswer(answerId, voteType)
      setAnswers(prev => prev.map(answer =>
        answer.id === answerId
          ? { ...answer, voteCount: (answer.voteCount || 0) + (voteType === 'up' ? 1 : -1) }
          : answer
      ))
    } catch (err) {
      console.error('Error voting answer:', err)
    }
  }

  const handleAcceptAnswer = async (answerId: string) => {
    try {
      await qaService.acceptAnswer(answerId)
      setAnswers(prev => prev.map(answer => ({
        ...answer,
        isAccepted: answer.id === answerId
      })))

      if (question) {
        setQuestion(prev => prev ? { ...prev, hasAcceptedAnswer: true } : null)
      }
    } catch (err) {
      console.error('Error accepting answer:', err)
    }
  }

  const handleBookmark = async () => {
    try {
      if (isBookmarked) {
        await qaService.removeBookmark(questionId)
      } else {
        await qaService.addBookmark(questionId)
      }
      setIsBookmarked(!isBookmarked)
    } catch (err) {
      console.error('Error toggling bookmark:', err)
    }
  }

  const handlePin = async () => {
    if (!question) return

    try {
      await qaService.pinQuestion(questionId)
      setQuestion(prev => prev ? { ...prev, isPinned: !prev.isPinned } : null)
    } catch (err) {
      console.error('Error pinning question:', err)
    }
  }

  const handleSubmitAnswer = async () => {
    if (!answerContent.trim()) return

    try {
      setIsSubmittingAnswer(true)

      const requestData: CreateAnswerRequest = {
        questionId,
        content: answerContent.trim()
      }

      const response = await qaService.createAnswer(requestData)
      setAnswers(prev => [response.data.answer, ...prev])
      setAnswerContent('')

      // Update question answer count
      if (question) {
        setQuestion(prev => prev ? {
          ...prev,
          answerCount: (prev.answerCount || 0) + 1
        } : null)
      }

    } catch (err: any) {
      console.error('Error submitting answer:', err)
      alert(err.message || 'Có lỗi xảy ra khi đăng trả lời')
    } finally {
      setIsSubmittingAnswer(false)
    }
  }

  const handleDeleteQuestion = async () => {
    try {
      await qaService.deleteQuestion(questionId)
      router.push('/qa')
    } catch (err) {
      console.error('Error deleting question:', err)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-32" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error || !question) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          title="Không tìm thấy câu hỏi"
          description={error || "Câu hỏi không tồn tại hoặc đã bị xóa"}
          action={
            <Button onClick={() => router.push('/qa')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại danh sách
            </Button>
          }
        />
      </div>
    )
  }

  const sortedAnswers = [...answers].sort((a, b) => {
    // Accepted answers always come first
    if (a.isAccepted && !b.isAccepted) return -1
    if (!a.isAccepted && b.isAccepted) return 1

    // Then sort by selected criteria
    switch (sortBy) {
      case 'votes':
        return (b.voteCount || 0) - (a.voteCount || 0)
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      default:
        return 0
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </div>

        {/* Question */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {question.isPinned && (
                    <Pin className="h-4 w-4 text-yellow-500" />
                  )}
                  <Badge
                    variant="secondary"
                    className={`${statusConfig[question.status].color} text-white`}
                  >
                    {statusConfig[question.status].label}
                  </Badge>
                  <Badge variant="outline">
                    {question.category}
                  </Badge>
                </div>

                <CardTitle className="text-2xl mb-3">
                  {question.title}
                </CardTitle>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {question.author.name}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatDate(question.createdAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {question.viewCount || 0} lượt xem
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {question.answerCount || 0} trả lời
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBookmark}
                  className={isBookmarked ? 'bg-blue-50 text-blue-600' : ''}
                >
                  <Bookmark className="h-4 w-4" />
                </Button>

                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      •••
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <PermissionGuard permissions={['qa.edit']} fallback={null}>
                      {canEdit && (
                        <DropdownMenuItem onClick={() => router.push(`/qa/${questionId}/edit`)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                      )}
                    </PermissionGuard>
                    <PermissionGuard permissions={['qa.pin']} fallback={null}>
                      {canPin && (
                        <DropdownMenuItem onClick={handlePin}>
                          <Pin className="h-4 w-4 mr-2" />
                          {question.isPinned ? 'Bỏ ghim' : 'Ghim câu hỏi'}
                        </DropdownMenuItem>
                      )}
                    </PermissionGuard>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Flag className="h-4 w-4 mr-2" />
                      Báo cáo
                    </DropdownMenuItem>
                    <PermissionGuard permissions={['qa.delete']} fallback={null}>
                      {canDelete && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Xóa câu hỏi
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa câu hỏi này? Hành động này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDeleteQuestion}>
                                Xóa
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </PermissionGuard>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Question content */}
            <div className="prose max-w-none mb-6">
              <p className="whitespace-pre-wrap">{question.content}</p>
            </div>

            {/* Tags */}
            {question.tags && question.tags.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <Tag className="h-4 w-4 text-gray-500" />
                <div className="flex flex-wrap gap-1">
                  {question.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Attachments */}
            {question.attachments && question.attachments.length > 0 && (
              <div className="space-y-2 mb-4">
                <h4 className="font-medium">Tệp đính kèm:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {question.attachments.map((attachment, index) => (
                    <a
                      key={index}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50"
                    >
                      <span className="text-sm">{attachment.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(attachment.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Voting */}
            <div className="flex items-center gap-4">
              <PermissionGuard permissions={['qa.vote']} fallback={null}>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVoteQuestion('up')}
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <span className="font-medium">{question.voteCount || 0}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVoteQuestion('down')}
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </div>
              </PermissionGuard>
            </div>
          </CardContent>
        </Card>

        {/* Answers section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {answers.length} trả lời
              </CardTitle>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sắp xếp:</span>
                <Button
                  variant={sortBy === 'votes' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('votes')}
                >
                  Nhiều vote
                </Button>
                <Button
                  variant={sortBy === 'newest' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('newest')}
                >
                  Mới nhất
                </Button>
                <Button
                  variant={sortBy === 'oldest' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('oldest')}
                >
                  Cũ nhất
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="answers">Trả lời</TabsTrigger>
                <TabsTrigger value="write">Viết trả lời</TabsTrigger>
              </TabsList>

              <TabsContent value="answers">
                {sortedAnswers.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Chưa có trả lời nào
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Hãy là người đầu tiên trả lời câu hỏi này!
                    </p>
                    <Button onClick={() => setActiveTab('write')}>
                      Viết trả lời
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {sortedAnswers.map((answer) => (
                      <div key={answer.id}>
                        <AnswerCard
                          answer={answer}
                          currentUser={user}
                          questionAuthorId={question?.authorId}
                          onVote={handleVoteAnswer}
                          onAccept={handleAcceptAnswer}
                          onEdit={handleEditAnswer}
                          onDelete={handleDeleteAnswer}
                          onReport={handleReportAnswer}
                        />

                        {/* Comments */}
                        <div className="ml-8 mt-4">
                          <CommentThread
                            parentId={answer.id}
                            parentType="answer"
                            comments={answer.comments || []}
                            currentUser={user}
                            onAddComment={(content) => handleAddComment(answer.id, content)}
                            onEditComment={handleEditComment}
                            onDeleteComment={handleDeleteComment}
                          />
                        </div>

                        {answer !== sortedAnswers[sortedAnswers.length - 1] && (
                          <Separator className="mt-6" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="write">
                <PermissionGuard
                  permissions={['qa.answer']}
                  fallback={
                    <div className="text-center py-8">
                      <p className="text-gray-600">Bạn không có quyền trả lời câu hỏi này.</p>
                    </div>
                  }
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Viết trả lời của bạn
                      </label>
                      <Textarea
                        placeholder="Chia sẻ kiến thức và kinh nghiệm của bạn để giúp đỡ người hỏi..."
                        value={newAnswer}
                        onChange={(e) => setNewAnswer(e.target.value)}
                        className="min-h-[150px]"
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={handleSubmitAnswer}
                        disabled={!newAnswer.trim() || submittingAnswer}
                      >
                        {submittingAnswer ? 'Đang đăng...' : 'Đăng trả lời'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setActiveTab('answers')}
                      >
                        Hủy
                      </Button>
                    </div>

                    <Alert>
                      <AlertDescription>
                        Hãy đảm bảo trả lời của bạn có chất lượng, hữu ích và trả lời đúng câu hỏi được đặt ra.
                      </AlertDescription>
                    </Alert>
                  </div>
                </PermissionGuard>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}