'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter,
  ChevronDown,
  AlertCircle,
  Loader2
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { QuestionCard } from './question-card'
import { QuestionForm } from './question-form'
import { qaService } from '@/lib/api/qa'
import { useAuth } from '@/contexts/auth-context'
import type { Question, QuestionQueryParams } from '@/lib/api/types'

interface LessonQASectionProps {
  lessonId: string
  courseId: string
  lessonTitle: string
  className?: string
}

export function LessonQASection({ 
  lessonId, 
  courseId, 
  lessonTitle, 
  className = '' 
}: LessonQASectionProps) {
  console.log('LessonQASection rendered with lessonId:', lessonId, 'courseId:', courseId)
  
  const { user } = useAuth()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('questions')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('newest')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Load questions for this lesson
  useEffect(() => {
    loadQuestions()
  }, [lessonId, searchQuery, statusFilter, categoryFilter, sortBy, page, refreshTrigger])

  const loadQuestions = async () => {
    try {
      setLoading(true)
      setError(null)

      const params: QuestionQueryParams = {
        scope: 'lesson',
        scope_id: parseInt(lessonId),
        page,
        per_page: 10,
        sort_by: sortBy as any,
      }

      if (searchQuery) params.q = searchQuery
      if (statusFilter !== 'all') params.status = [statusFilter as any]
      if (categoryFilter !== 'all') params.category = [categoryFilter as any]

      console.log('Making API call to getQuestions with params:', params)
      const response = await qaService.getQuestions(params)
      console.log('API response received:', response)
      
      if (page === 1) {
        setQuestions(response.questions)
      } else {
        setQuestions(prev => [...prev, ...response.questions])
      }
      
      setHasMore(response.pagination?.has_next || response.pagination?.page < response.pagination?.totalPages)
    } catch (err) {
      console.error('Error loading questions:', err)
      
      // Handle specific database schema errors
      if (err instanceof Error) {
        if (err.name === 'DatabaseSchemaError' || err.name === 'VoteSchemaError') {
          setError(`Lỗi cơ sở dữ liệu: ${err.message}`)
        } else if (err.message.includes('Unknown column') || err.message.includes('votable_type')) {
          setError('Hệ thống đang được cập nhật. Vui lòng liên hệ quản trị viên để khắc phục vấn đề cơ sở dữ liệu.')
        } else {
          setError('Không thể tải danh sách câu hỏi. Vui lòng thử lại.')
        }
      } else {
        setError('Không thể tải danh sách câu hỏi. Vui lòng thử lại.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleQuestionCreated = () => {
    setActiveTab('questions')
    setPage(1)
    setRefreshTrigger(prev => prev + 1)
  }

  const handleVote = async (questionId: string, voteType: 'up' | 'down') => {
    try {
      await qaService.voteQuestion(questionId, voteType)
      // Refresh questions to show updated vote counts
      setRefreshTrigger(prev => prev + 1)
    } catch (err) {
      console.error('Error voting:', err)
    }
  }

  const handlePin = async (questionId: string) => {
    try {
      await qaService.toggleQuestionPin(questionId)
      setRefreshTrigger(prev => prev + 1)
    } catch (err) {
      console.error('Error pinning question:', err)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    setRefreshTrigger(prev => prev + 1)
  }

  const handleFilterChange = () => {
    setPage(1)
    setRefreshTrigger(prev => prev + 1)
  }

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1)
    }
  }

  const questionCount = questions.length
  const unansweredCount = questions.filter(q => q.answer_count === 0).length

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Hỏi đáp về bài học
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{questionCount} câu hỏi</span>
          {unansweredCount > 0 && (
            <Badge variant="outline" className="text-orange-600 border-orange-200">
              {unansweredCount} chưa trả lời
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="questions">
              Câu hỏi ({questionCount})
            </TabsTrigger>
            <TabsTrigger value="ask">
              Đặt câu hỏi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="space-y-4">
            {/* Search and Filters */}
            <div className="space-y-3">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm câu hỏi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit" variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
              </form>

              <div className="flex gap-2 flex-wrap">
                <Select value={statusFilter} onValueChange={(value) => {
                  setStatusFilter(value)
                  handleFilterChange()
                }}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="new">Mới</SelectItem>
                    <SelectItem value="in_progress">Đang xử lý</SelectItem>
                    <SelectItem value="answered">Đã trả lời</SelectItem>
                    <SelectItem value="closed">Đã đóng</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={(value) => {
                  setCategoryFilter(value)
                  handleFilterChange()
                }}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="lesson_content">Nội dung bài học</SelectItem>
                    <SelectItem value="technical_issue">Vấn đề kỹ thuật</SelectItem>
                    <SelectItem value="support_request">Yêu cầu hỗ trợ</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value) => {
                  setSortBy(value)
                  handleFilterChange()
                }}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Sắp xếp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Mới nhất</SelectItem>
                    <SelectItem value="oldest">Cũ nhất</SelectItem>
                    <SelectItem value="most_votes">Nhiều vote</SelectItem>
                    <SelectItem value="most_answers">Nhiều trả lời</SelectItem>
                    <SelectItem value="unanswered">Chưa trả lời</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Questions List */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loading && page === 1 ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Đang tải câu hỏi...</span>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Chưa có câu hỏi nào</h3>
                <p className="text-muted-foreground mb-4">
                  Hãy là người đầu tiên đặt câu hỏi về bài học này!
                </p>
                <Button onClick={() => setActiveTab('ask')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Đặt câu hỏi đầu tiên
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    currentUser={user}
                    showLesson={false}
                    showCourse={false}
                    onVote={handleVote}
                    onPin={handlePin}
                  />
                ))}

                {hasMore && (
                  <div className="text-center pt-4">
                    <Button 
                      variant="outline" 
                      onClick={loadMore}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Đang tải...
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-2" />
                          Xem thêm câu hỏi
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="ask">
            <QuestionForm
              defaultScope="lesson"
              defaultScopeId={lessonId}
              defaultCourseId={courseId}
              lessonTitle={lessonTitle}
              onSuccess={handleQuestionCreated}
              onCancel={() => setActiveTab('questions')}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}