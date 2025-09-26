'use client'

import React, { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import {
    X,
    ThumbsUp,
    ThumbsDown,
    MessageCircle,
    Award,
    Pin,
    Eye,
    Clock,
    User as UserIcon,
    Tag,
    Send
} from 'lucide-react'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import { ScrollArea } from '@/components/ui/scroll-area'

import { useAuth } from '@/contexts/auth-context'
import { qaService } from '@/lib/api/qa'
import type {
    Question,
    Answer,
    QuestionStatus,
    CreateAnswerRequest,
    User as UserType
} from '@/lib/api/types'

interface QuestionDetailExpansionProps {
    questionId: number
    onClose: () => void
    className?: string
}

const statusConfig = {
    new: { label: 'Mới', color: 'bg-blue-500' },
    in_progress: { label: 'Đang xử lý', color: 'bg-yellow-500' },
    answered: { label: 'Đã trả lời', color: 'bg-green-500' },
    closed: { label: 'Đã đóng', color: 'bg-gray-500' }
}

export function QuestionDetailExpansion({
    questionId,
    onClose,
    className = ''
}: QuestionDetailExpansionProps) {
    const { user } = useAuth()

    // State
    const [question, setQuestion] = useState<Question | null>(null)
    const [answers, setAnswers] = useState<Answer[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [newAnswer, setNewAnswer] = useState('')
    const [submittingAnswer, setSubmittingAnswer] = useState(false)

    // Load question and answers
    useEffect(() => {
        const loadQuestionData = async () => {
            try {
                setLoading(true)
                setError(null)

                // Load question details
                const questionResponse = await qaService.getQuestion(questionId)
                setQuestion(questionResponse)

                // Load answers  
                const answersResponse = await qaService.getAnswers(questionId, 1, 10)
                setAnswers(answersResponse.answers || [])

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
    }, [questionId])

    // Vote handlers
    const handleVoteQuestion = async (voteType: 'up' | 'down') => {
        if (!question || !user) return

        try {
            await qaService.voteQuestion(questionId, voteType)
            setQuestion(prev => prev ? {
                ...prev,
                vote_score: (prev.vote_score || 0) + (voteType === 'up' ? 1 : -1)
            } : null)
            toast.success('Đã bỏ phiếu thành công')
        } catch (err) {
            console.error('Error voting question:', err)
            toast.error('Không thể bỏ phiếu')
        }
    }

    const handleVoteAnswer = async (answerId: number, voteType: 'up' | 'down') => {
        if (!user) return

        try {
            await qaService.voteAnswer(answerId, voteType)
            setAnswers(prev => prev.map(answer =>
                answer.id === answerId
                    ? { ...answer, vote_score: (answer.vote_score || 0) + (voteType === 'up' ? 1 : -1) }
                    : answer
            ))
            toast.success('Đã bỏ phiếu thành công')
        } catch (err) {
            console.error('Error voting answer:', err)
            toast.error('Không thể bỏ phiếu')
        }
    }

    // Submit answer
    const handleSubmitAnswer = async () => {
        if (!newAnswer.trim() || !user) return

        try {
            setSubmittingAnswer(true)

            const answerData: CreateAnswerRequest = {
                question_id: questionId,
                content: newAnswer.trim()
            }

            const response = await qaService.createAnswer(answerData)
            setAnswers(prev => [response, ...prev])
            setNewAnswer('')
            toast.success('Đã gửi câu trả lời thành công')

            // Update question answer count
            setQuestion(prev => prev ? {
                ...prev,
                answer_count: (prev.answer_count || 0) + 1
            } : null)

        } catch (err: any) {
            console.error('Error submitting answer:', err)
            toast.error(err.message || 'Không thể gửi câu trả lời')
        } finally {
            setSubmittingAnswer(false)
        }
    }

    if (loading) {
        return (
            <Card className={`animate-in slide-in-from-bottom-4 duration-300 ${className}`}>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="w-full h-6 bg-gray-200 rounded animate-pulse" />
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                        <div className="h-32 bg-gray-200 rounded animate-pulse" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (error || !question) {
        return (
            <Card className={`border-red-200 ${className}`}>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-red-600">Lỗi</CardTitle>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent>
                    <p className="text-red-600">{error || 'Không thể tải câu hỏi'}</p>
                </CardContent>
            </Card>
        )
    }

    const statusInfo = statusConfig[question.status as QuestionStatus]

    return (
        <Card className={`animate-in slide-in-from-bottom-4 duration-300 border-t-4 border-t-blue-500 ${className}`}>
            {/* Navigation */}
            <CardHeader className="pb-4 border-b">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" onClick={onClose} className="text-sm">
                        <X className="h-4 w-4 mr-2" />

                    </Button>
                </div>
            </CardHeader>

            <CardContent className="p-6">
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
                                <AvatarImage src={question.author.avatar_url || undefined} />
                                <AvatarFallback>
                                    <UserIcon className="h-5 w-5" />
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-medium text-gray-900">{question.author.full_name || question.author.name}</div>
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
                            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No replies yet
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Be the first to reply to this question!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {answers.map((answer, index) => (
                                <div key={answer.id} className="pl-4 border-l-2 border-gray-100">
                                    {/* Reply Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={answer.author.avatar_url || undefined} />
                                                <AvatarFallback>
                                                    <UserIcon className="h-4 w-4" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-gray-900">
                                                        {answer.author.full_name || answer.author.name || 'Anonymous'}
                                                    </span>
                                                    {answer.author.role === 'instructor' && (
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
            </CardContent>
        </Card>
    )
}
