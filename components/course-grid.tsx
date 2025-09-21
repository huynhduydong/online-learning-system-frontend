"use client"

import { useMemo } from "react"
import { BookOpen } from "lucide-react"
import { SimpleCourseCard } from "./simple-course-card"
import { Course } from "@/lib/api/types"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export interface CourseGridProps {
  courses: Course[]
  currentPage: number
  totalPages: number
  coursesPerPage?: number
  onPageChange: (page: number) => void
  onEnroll?: (courseId: string) => void
  isLoading?: boolean
}

export function CourseGrid({
  courses,
  currentPage,
  totalPages,
  coursesPerPage = 12,
  onPageChange,
  onEnroll,
  isLoading = false
}: CourseGridProps) {
  
  // Tính toán courses cho trang hiện tại
  const { currentCourses, startIndex, endIndex } = useMemo(() => {
    const start = (currentPage - 1) * coursesPerPage
    const end = start + coursesPerPage
    return {
      currentCourses: courses.slice(start, end),
      startIndex: start,
      endIndex: end
    }
  }, [courses, currentPage, coursesPerPage])

  // Tạo array các số trang để hiển thị
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('ellipsis')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('ellipsis')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Loading skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: coursesPerPage }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-muted rounded-lg aspect-video mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Không tìm thấy khóa học</h3>
        <p className="text-muted-foreground">
          Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Course Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentCourses.map((course) => (
          <SimpleCourseCard
            key={course.id}
            course={course}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center space-y-4">
          {/* Results info */}
          <p className="text-sm text-muted-foreground">
            Hiển thị {startIndex + 1}-{Math.min(endIndex, courses.length)} trong tổng số {courses.length} khóa học
          </p>

          {/* Pagination controls */}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === 'ellipsis' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => onPageChange(page as number)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext 
                  onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                  className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}