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
        <Card className={`animate-in slide-in-from-bottom-4 duration-300 ${className}`}>
            {/* Header */}
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            {question.is_pinned && (
                                <Pin className="h-4 w-4 text-orange-500 fill-current" />
                            )}
                            <Badge variant="secondary" className={`${statusInfo.color} text-white`}>
                                {statusInfo.label}
                            </Badge>
                            <Badge variant="outline">
                                {question.category}
                            </Badge>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 leading-tight">
                            {question.title}
                        </h2>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Author and meta */}
                <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={question.author.avatar_url || undefined} />
                            <AvatarFallback>
                                <UserIcon className="h-4 w-4" />
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium text-sm">{question.author.full_name}</p>
                            <p className="text-xs text-gray-500">
                                {formatDistanceToNow(new Date(question.created_at), {
                                    addSuffix: true,
                                    locale: vi
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{question.view_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{question.answer_count || 0}</span>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Question Content */}
                <div>
                    <div className="prose prose-sm max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: question.content.replace(/\n/g, '<br>') }} />
                    </div>

                    {/* Tags */}
                    {question.tags && question.tags.length > 0 && (
                        <div className="flex items-center gap-2 mt-4">
                            <Tag className="h-4 w-4 text-gray-400" />
                            <div className="flex flex-wrap gap-1">
                                {question.tags.map((tag, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                        {typeof tag === 'string' ? tag : tag.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Question voting */}
                    <div className="flex items-center gap-2 mt-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVoteQuestion('up')}
                            disabled={!user}
                            className="h-8 w-8 p-0 hover:bg-green-50"
                        >
                            <ThumbsUp className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium">{question.vote_score || 0}</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVoteQuestion('down')}
                            disabled={!user}
                            className="h-8 w-8 p-0 hover:bg-red-50"
                        >
                            <ThumbsDown className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <Separator />

                {/* Answers Section */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">
                        Câu trả lời ({answers.length})
                    </h3>

                    {/* Answer Form */}
                    {user && (
                        <Card className="border-blue-200 bg-blue-50/30">
                            <CardContent className="pt-4">
                                <Textarea
                                    placeholder="Viết câu trả lời của bạn..."
                                    value={newAnswer}
                                    onChange={(e) => setNewAnswer(e.target.value)}
                                    className="min-h-[100px] bg-white"
                                />
                                <div className="flex justify-end mt-3">
                                    <Button
                                        onClick={handleSubmitAnswer}
                                        disabled={!newAnswer.trim() || submittingAnswer}
                                        size="sm"
                                    >
                                        <Send className="h-4 w-4 mr-2" />
                                        {submittingAnswer ? 'Đang gửi...' : 'Gửi câu trả lời'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Answers List */}
                    <div className="max-h-96 overflow-y-auto">
                        <div className="space-y-4 pr-4">
                            {answers.length > 0 ? (
                                answers.map((answer) => (
                                    <Card key={answer.id} className="border-gray-200">
                                        <CardContent className="pt-4">
                                            <div className="flex items-start gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={answer.author.avatar_url || undefined} />
                                                    <AvatarFallback>
                                                        <UserIcon className="h-4 w-4" />
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <p className="font-medium text-sm">{answer.author.full_name}</p>
                                                        {answer.is_accepted && (
                                                            <Badge className="bg-green-500 text-white">
                                                                <Award className="h-3 w-3 mr-1" />
                                                                Được chấp nhận
                                                            </Badge>
                                                        )}
                                                        <p className="text-xs text-gray-500">
                                                            {formatDistanceToNow(new Date(answer.created_at), {
                                                                addSuffix: true,
                                                                locale: vi
                                                            })}
                                                        </p>
                                                    </div>

                                                    <div className="prose prose-sm max-w-none mb-3">
                                                        <div dangerouslySetInnerHTML={{ __html: answer.content.replace(/\n/g, '<br>') }} />
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleVoteAnswer(answer.id, 'up')}
                                                            disabled={!user}
                                                            className="h-8 w-8 p-0 hover:bg-green-50"
                                                        >
                                                            <ThumbsUp className="h-4 w-4" />
                                                        </Button>
                                                        <span className="text-sm font-medium">{answer.vote_score || 0}</span>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleVoteAnswer(answer.id, 'down')}
                                                            disabled={!user}
                                                            className="h-8 w-8 p-0 hover:bg-red-50"
                                                        >
                                                            <ThumbsDown className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    <MessageCircle className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                                    <p>Chưa có câu trả lời nào</p>
                                    {user && (
                                        <p className="text-sm">Hãy là người đầu tiên trả lời câu hỏi này!</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
