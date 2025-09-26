'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, Filter, Plus, SortAsc, SortDesc } from 'lucide-react'
import { PermissionGuard } from '@/components/permissions/permission-guard'
import { useAuth } from '@/contexts/auth-context'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

import { QuestionCard } from '@/components/qa'
import { EmptyState } from '@/components/empty-state'
import { ErrorState } from '@/components/error-state'
import { Pagination } from '@/components/pagination'

import { qaService } from '@/lib/api/qa'
import type {
  Question,
  QuestionStatus,
  QuestionCategory,
  QuestionsListResponse,
  QuestionsSearchParams
} from '@/lib/api/types'

const ITEMS_PER_PAGE = 10

const statusOptions = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'new', label: 'Mới' },
  { value: 'in_progress', label: 'Đang xử lý' },
  { value: 'answered', label: 'Đã trả lời' },
  { value: 'closed', label: 'Đã đóng' }
]

const categoryOptions = [
  { value: 'all', label: 'Tất cả danh mục' },
  { value: 'lesson_content', label: 'Nội dung bài học' },
  { value: 'technical_issue', label: 'Vấn đề kỹ thuật' },
  { value: 'administrative', label: 'Thủ tục hành chính' },
  { value: 'support_request', label: 'Yêu cầu hỗ trợ' },
  { value: 'bug_report', label: 'Báo cáo lỗi' }
]

const sortOptions = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'oldest', label: 'Cũ nhất' },
  { value: 'most_votes', label: 'Nhiều vote nhất' },
  { value: 'most_answers', label: 'Nhiều trả lời nhất' },
  { value: 'most_views', label: 'Nhiều lượt xem nhất' }
]

export default function QAPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()

  // State
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [totalQuestions, setTotalQuestions] = useState(0)

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'all')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') || 'newest')
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'))
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'all')

  // Debounced search
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Build search params
  const searchParamsObj = useMemo((): QuestionsSearchParams => {
    const params: QuestionsSearchParams = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      sortBy: selectedSort as any,
      sortOrder: selectedSort.includes('oldest') ? 'asc' : 'desc'
    }

    if (debouncedSearchQuery) {
      params.search = debouncedSearchQuery
    }

    if (selectedStatus !== 'all') {
      params.status = selectedStatus as QuestionStatus
    }

    if (selectedCategory !== 'all') {
      params.category = selectedCategory as QuestionCategory
    }

    // Tab-specific filters
    switch (activeTab) {
      case 'unanswered':
        params.hasAcceptedAnswer = false
        break
      case 'pinned':
        params.isPinned = true
        break
      case 'my_questions':
        params.authorId = 'current_user' // This would be replaced with actual user ID
        break
    }

    return params
  }, [currentPage, debouncedSearchQuery, selectedStatus, selectedCategory, selectedSort, activeTab])

  // Fetch questions
  const fetchQuestions = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await qaService.getQuestions(searchParamsObj)

      setQuestions(response.questions)
      setTotalPages(response.pagination?.totalPages || 1)
      setTotalQuestions(response.pagination?.total || response.questions.length)
    } catch (err) {
      console.error('Error fetching questions:', err)
      setError('Không thể tải danh sách câu hỏi. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [searchParamsObj])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()

    if (debouncedSearchQuery) params.set('q', debouncedSearchQuery)
    if (selectedStatus !== 'all') params.set('status', selectedStatus)
    if (selectedCategory !== 'all') params.set('category', selectedCategory)
    if (selectedSort !== 'newest') params.set('sort', selectedSort)
    if (currentPage !== 1) params.set('page', currentPage.toString())
    if (activeTab !== 'all') params.set('tab', activeTab)

    const newUrl = params.toString() ? `?${params.toString()}` : ''
    router.replace(`/qa${newUrl}`, { scroll: false })
  }, [debouncedSearchQuery, selectedStatus, selectedCategory, selectedSort, currentPage, activeTab, router])

  // Handlers
  const handleVote = async (questionId: string, voteType: 'up' | 'down') => {
    try {
      await qaService.voteQuestion(questionId, voteType)
      // Update local state
      setQuestions(prev => prev.map(q =>
        q.id === questionId
          ? { ...q, voteCount: (q.voteCount || 0) + (voteType === 'up' ? 1 : -1) }
          : q
      ))
    } catch (err) {
      console.error('Error voting:', err)
    }
  }

  const handlePin = async (questionId: string) => {
    try {
      await qaService.pinQuestion(questionId)
      // Update local state
      setQuestions(prev => prev.map(q =>
        q.id === questionId
          ? { ...q, isPinned: !q.isPinned }
          : q
      ))
    } catch (err) {
      console.error('Error pinning question:', err)
    }
  }

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedStatus('all')
    setSelectedCategory('all')
    setSelectedSort('newest')
    setCurrentPage(1)
    setActiveTab('all')
  }

  const hasActiveFilters = searchQuery || selectedStatus !== 'all' || selectedCategory !== 'all' || selectedSort !== 'newest'

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          title="Lỗi tải dữ liệu"
          description={error}
          action={
            <Button onClick={fetchQuestions}>
              Thử lại
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hỏi đáp</h1>
          <p className="text-gray-600 mt-1">
            Đặt câu hỏi và nhận phản hồi từ cộng đồng học tập
          </p>
        </div>

        <PermissionGuard permission="question:create">
          <Button
            onClick={() => router.push('/qa/ask')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Đặt câu hỏi
          </Button>
        </PermissionGuard>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Tìm kiếm và lọc</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm câu hỏi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {selectedSort === 'newest' && <SortDesc className="h-4 w-4 mr-2" />}
                  {selectedSort === 'oldest' && <SortAsc className="h-4 w-4 mr-2" />}
                  {!['newest', 'oldest'].includes(selectedSort) && <Filter className="h-4 w-4 mr-2" />}
                  {sortOptions.find(opt => opt.value === selectedSort)?.label}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Sắp xếp theo</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setSelectedSort(option.value)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {hasActiveFilters && (
              <Button variant="ghost" onClick={resetFilters}>
                Xóa bộ lọc
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="unanswered">Chưa trả lời</TabsTrigger>
          <TabsTrigger value="pinned">Được ghim</TabsTrigger>
          <TabsTrigger value="my_questions">Câu hỏi của tôi</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {/* Results summary */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              {loading ? (
                <Skeleton className="h-4 w-32" />
              ) : (
                `Hiển thị ${questions.length} trong tổng số ${totalQuestions} câu hỏi`
              )}
            </div>
          </div>

          {/* Questions list */}
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : questions.length === 0 ? (
            <EmptyState
              title="Không tìm thấy câu hỏi"
              description={
                hasActiveFilters
                  ? "Không có câu hỏi nào phù hợp với bộ lọc của bạn. Hãy thử điều chỉnh bộ lọc."
                  : "Chưa có câu hỏi nào được đăng. Hãy là người đầu tiên đặt câu hỏi!"
              }
              action={
                hasActiveFilters ? (
                  <Button onClick={resetFilters}>
                    Xóa bộ lọc
                  </Button>
                ) : (
                  <Button onClick={() => router.push('/qa/ask')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Đặt câu hỏi đầu tiên
                  </Button>
                )
              }
            />
          ) : (
            <div className="space-y-4">
              {questions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  currentUser={user}
                  showCourse={true}
                  showLesson={true}
                  onVote={handleVote}
                  onPin={handlePin}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && questions.length > 0 && totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}