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
  Unlock,
  MoreHorizontal
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
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

import { qaService } from '@/lib/api/qa'
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

  // Permission checks - simplified for now
  const questionPermissions = {
    canEdit: { allowed: user?.id === question?.author?.id },
    canPin: { allowed: user?.role === 'instructor' },
    canDelete: { allowed: user?.id === question?.author?.id || user?.role === 'instructor' }
  }

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
        const questionResponse = await qaService.getQuestion(parseInt(questionId))
        setQuestion(questionResponse)

        // Load answers
        const answersResponse = await qaService.getAnswers(parseInt(questionId), 1, 10)
        setAnswers(answersResponse.answers || [])

        // Note: Bookmark and view count features would need API implementation
        // For now, we'll skip these features

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
      await qaService.voteQuestion(parseInt(questionId), voteType)
      setQuestion(prev => prev ? {
        ...prev,
        vote_score: (prev.vote_score || 0) + (voteType === 'up' ? 1 : -1)
      } : null)
    } catch (err) {
      console.error('Error voting question:', err)
    }
  }

  const handleVoteAnswer = async (answerId: number, voteType: 'up' | 'down') => {
    try {
      await qaService.voteAnswer(answerId, voteType)
      setAnswers(prev => prev.map(answer =>
        answer.id === answerId
          ? { ...answer, vote_score: (answer.vote_score || 0) + (voteType === 'up' ? 1 : -1) }
          : answer
      ))
    } catch (err) {
      console.error('Error voting answer:', err)
    }
  }

  const handleAcceptAnswer = async (answerId: number) => {
    try {
      await qaService.acceptAnswer(answerId)
      setAnswers(prev => prev.map(answer => ({
        ...answer,
        is_accepted: answer.id === answerId
      })))

      if (question) {
        setQuestion(prev => prev ? { ...prev, accepted_answer_id: answerId } : null)
      }
    } catch (err) {
      console.error('Error accepting answer:', err)
    }
  }

  const handleBookmark = async () => {
    // Bookmark functionality would need API implementation
    toast.info('Bookmark feature coming soon')
  }

  const handlePin = async () => {
    // Pin functionality would need API implementation  
    toast.info('Pin feature coming soon')
  }

  const handleSubmitAnswer = async () => {
    if (!newAnswer.trim()) return

    try {
      setSubmittingAnswer(true)

      const requestData: CreateAnswerRequest = {
        question_id: parseInt(questionId),
        content: newAnswer.trim()
      }

      const response = await qaService.createAnswer(requestData)
      setAnswers(prev => [response, ...prev])
      setNewAnswer('')

      // Update question answer count
      if (question) {
        setQuestion(prev => prev ? {
          ...prev,
          answer_count: (prev.answer_count || 0) + 1
        } : null)
      }

    } catch (err: any) {
      console.error('Error submitting answer:', err)
      toast.error(err.message || 'Error posting reply')
    } finally {
      setSubmittingAnswer(false)
    }
  }

  const handleDeleteQuestion = async () => {
    try {
      await qaService.deleteQuestion(parseInt(questionId))
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
          title="Question not found"
          description={error || "The question does not exist or has been deleted"}
          action={{
            label: "Back to questions",
            onClick: () => router.push('/qa'),
            variant: "outline" as const
          }}
        />
      </div>
    )
  }

  const sortedAnswers = [...answers].sort((a, b) => {
    // Accepted answers always come first
    if (a.is_accepted && !b.is_accepted) return -1
    if (!a.is_accepted && b.is_accepted) return 1

    // Then sort by selected criteria
    switch (sortBy) {
      case 'votes':
        return (b.vote_score || 0) - (a.vote_score || 0)
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      default:
        return 0
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => router.push('/qa')} className="text-sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Questions
          </Button>
        </div>

        {/* Question */}
        <div className="mb-6">
          {/* Question Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {question.title}
          </h1>

          {/* Question Meta Information */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* Author Info */}
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-gray-900">{question.author.name}</div>
                  <div className="text-sm text-gray-600">
                    {question.scope === 'lesson' && question.scope_title && (
                      <span>Lecture {question.scope_id}</span>
                    )}
                    {question.scope !== 'lesson' && question.scope_title && (
                      <span>{question.scope_title}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Time Posted */}
              <div className="text-sm text-gray-600">
                {formatDistanceToNow(new Date(question.created_at), {
                  addSuffix: true,
                  locale: vi
                })}
              </div>
            </div>

            {/* Right Side - Upvotes and Actions */}
            <div className="flex items-center gap-3">
              {/* Upvote Count */}
              <div className="flex items-center gap-2 text-sm">
                <ThumbsUp className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{question.vote_score || 0}</span>
              </div>

              {/* Actions Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Share2 className="h-4 w-4 mr-2" />
                    Copy link
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Flag className="h-4 w-4 mr-2" />
                    Report
                  </DropdownMenuItem>
                  {questionPermissions?.canEdit?.allowed && (
                    <DropdownMenuItem onClick={() => router.push(`/qa/${questionId}/edit`)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {questionPermissions?.canPin?.allowed && (
                    <DropdownMenuItem onClick={handlePin}>
                      <Pin className="h-4 w-4 mr-2" />
                      {question.is_pinned ? 'Unpin' : 'Pin'}
                    </DropdownMenuItem>
                  )}
                  {questionPermissions?.canDelete?.allowed && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm deletion</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this question? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteQuestion}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Question Content */}
          <div className="mb-8">
            <div className="prose max-w-none text-gray-800 leading-relaxed">
              {/* Enhanced content renderer with code highlighting */}
              <div
                className="whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: question.content
                    // Simple code highlighting - wrap code in backticks with styling
                    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-orange-600 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
                    // Block code with triple backticks
                    .replace(/```([^`]+)```/g, '<pre class="bg-gray-100 border border-gray-200 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-orange-600 font-mono text-sm">$1</code></pre>')
                }}
              />
            </div>

            {/* Optional ending like "GLHF!" */}
            {question.content.toLowerCase().includes('glhf') && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-gray-600 text-sm italic">GLHF!</p>
              </div>
            )}
          </div>
        </div>

        {/* Replies Section */}
        <div className="border-t border-gray-200 pt-8">
          {/* Replies Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {answers.length} replies
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-sm text-gray-600">
                Follow replies
              </Button>
            </div>
          </div>

          {/* Replies List */}
          {answers.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No replies yet
              </h3>
              <p className="text-gray-600 mb-4">
                Be the first to reply to this question!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedAnswers.map((answer, index) => (
                <div key={answer.id} className="pl-4 border-l-2 border-gray-100">
                  {/* Reply Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {answer.author?.name || 'Anonymous'}
                          </span>
                          {answer.author?.role === 'instructor' && (
                            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                              Instructor
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(answer.created_at), {
                            addSuffix: true,
                            locale: vi
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Vote Controls */}
                      {user && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVoteAnswer(answer.id, 'up')}
                            className="h-8 w-8 p-0"
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <span className="text-sm font-medium min-w-[20px] text-center">
                            {answer.vote_score || 0}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVoteAnswer(answer.id, 'down')}
                            className="h-8 w-8 p-0"
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                        </div>
                      )}

                      {/* Actions Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Flag className="h-4 w-4 mr-2" />
                            Report
                          </DropdownMenuItem>
                          {user?.id === answer.author?.id && (
                            <>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Reply Content */}
                  <div className="ml-11 mb-4">
                    <div
                      className="prose max-w-none text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: answer.content
                          .replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-orange-600 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
                          .replace(/```([^`]+)```/g, '<pre class="bg-gray-100 border border-gray-200 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-orange-600 font-mono text-sm">$1</code></pre>')
                      }}
                    />
                  </div>

                  {/* Reply Border */}
                  {index < answers.length - 1 && (
                    <div className="ml-11 mt-6 border-b border-gray-100"></div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add Reply Section */}
          {user && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Add a reply
                  </label>
                  <Textarea
                    placeholder="Share your knowledge and help answer this question..."
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={!newAnswer.trim() || submittingAnswer}
                  >
                    {submittingAnswer ? 'Posting...' : 'Post Reply'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setNewAnswer('')}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}