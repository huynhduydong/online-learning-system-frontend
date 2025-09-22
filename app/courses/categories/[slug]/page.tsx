'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { coursesService } from '@/lib/api/courses'
import { Course, CoursePagination, CourseCategory } from '@/lib/api/types'
import { CourseCard } from '@/components/course-card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ChevronLeft, ChevronRight, Filter, Grid, List } from 'lucide-react'
import Link from 'next/link'

interface CategoryCoursesPageProps { }

export default function CategoryCoursesPage({ }: CategoryCoursesPageProps) {
  const params = useParams()
  const slug = params.slug as string

  const [courses, setCourses] = useState<Course[]>([])
  const [pagination, setPagination] = useState<CoursePagination | null>(null)
  const [category, setCategory] = useState<CourseCategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Query parameters
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [limit] = useState(12)

  // Fetch courses and category info
  useEffect(() => {
    const fetchCourses = async () => {
      if (!slug) return

      setLoading(true)
      setError(null)

      try {
        const result = await coursesService.getCoursesByCategory(slug, {
          page: currentPage,
          limit,
          sort: sortBy,
          order: sortOrder
        })

        setCourses(result.courses)
        setPagination(result.pagination)
        setCategory(result.category)
      } catch (error) {
        console.error('Error fetching courses:', error)
        setError('Không thể tải danh sách khóa học. Vui lòng thử lại sau.')
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [slug, currentPage, sortBy, sortOrder, limit])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSortChange = (value: string) => {
    const [sort, order] = value.split('-')
    setSortBy(sort)
    setSortOrder(order as 'asc' | 'desc')
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-4">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href="/courses" className="hover:text-foreground">
            Khóa học
          </Link>
          <span>/</span>
          <span className="text-foreground">{category?.name || slug}</span>
        </nav>

        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">
            {category?.name || 'Khóa học'}
          </h1>
        </div>
        {category?.description && (
          <p className="text-muted-foreground text-lg">
            {category.description}
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {pagination?.total || 0} khóa học
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Sort */}
          <Select value={`${sortBy}-${sortOrder}`} onValueChange={handleSortChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at-desc">Mới nhất</SelectItem>
              <SelectItem value="created_at-asc">Cũ nhất</SelectItem>
              <SelectItem value="title-asc">Tên A-Z</SelectItem>
              <SelectItem value="title-desc">Tên Z-A</SelectItem>
              <SelectItem value="price-asc">Giá thấp đến cao</SelectItem>
              <SelectItem value="price-desc">Giá cao đến thấp</SelectItem>
              <SelectItem value="rating-desc">Đánh giá cao nhất</SelectItem>
              <SelectItem value="students-desc">Nhiều học viên nhất</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode */}
          <div className="flex items-center border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {courses && courses.length > 0 ? (
        <div className={`grid gap-6 mb-8 ${viewMode === 'grid'
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          : 'grid-cols-1'
          }`}>
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              variant={viewMode === 'list' ? 'horizontal' : 'vertical'}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">
            Không có khóa học nào trong danh mục này
          </p>
          <Link href="/courses">
            <Button>Xem tất cả khóa học</Button>
          </Link>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination.has_prev}
          >
            <ChevronLeft className="h-4 w-4" />
            Trước
          </Button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
              const page = i + 1
              return (
                <Button
                  key={page}
                  variant={page === currentPage ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.has_next}
          >
            Sau
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}