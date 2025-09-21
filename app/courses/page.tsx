"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCourses } from "@/src/hooks/use-courses"
import { CourseCard, CourseCardProps } from "@/components/course-card"
import { CourseFilters, CourseFiltersProps } from "@/components/course-filters"
import { CourseSorting, SortOption } from "@/components/course-sorting"
import { CourseGrid } from "@/components/course-grid"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { CourseCatalogParams } from "@/lib/api/types"

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOption, setSortOption] = useState<SortOption>("popularity")
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  
  // Filter states
  const [filters, setFilters] = useState<CourseFiltersProps["filters"]>({
    categories: [],
    priceRange: [0, 2000000],
    levels: [],
    minRating: 0
  })

  // Map sort options to API parameters
  const mapSortToApiParams = (sort: SortOption): { sort_by: string; sort_order: string } => {
    switch (sort) {
      case "popularity":
        return { sort_by: "popularity", sort_order: "DESC" }
      case "price-low-to-high":
        return { sort_by: "price", sort_order: "ASC" }
      case "price-high-to-low":
        return { sort_by: "price", sort_order: "DESC" }
      case "rating":
        return { sort_by: "rating", sort_order: "DESC" }
      case "newest":
        return { sort_by: "newest", sort_order: "DESC" }
      case "oldest":
        return { sort_by: "newest", sort_order: "ASC" }
      default:
        return { sort_by: "popularity", sort_order: "DESC" }
    }
  }

  // Build API parameters
  const apiParams: CourseCatalogParams = useMemo(() => {
    const { sort_by, sort_order } = mapSortToApiParams(sortOption)
    
    const params: CourseCatalogParams = {
      page: currentPage,
      per_page: 12,
      sort_by,
      sort_order,
    }

    // Add filters only if they have values
    if (filters.categories.length > 0) params.category = filters.categories[0]
    if (filters.levels.length > 0) params.difficulty = filters.levels[0]
    if (filters.priceRange[0] > 0) params.min_price = filters.priceRange[0]
    if (filters.priceRange[1] < 2000000) params.max_price = filters.priceRange[1]
    if (filters.minRating > 0) params.rating = filters.minRating

    return params
  }, [currentPage, sortOption, filters])

  const { data: coursesData, isLoading, error } = useCourses(apiParams)

  // Convert courses to CourseCard format
  const courseCards: CourseCardProps[] = useMemo(() => {
    return coursesData?.courses?.map(course => ({
      id: course.id.toString(),
      title: course.title,
      description: course.short_description,
      instructor: course.instructor.name,
      thumbnail: course.thumbnail_url,
      price: course.price.amount,
      originalPrice: course.price.original_price,
      duration: course.stats.duration_hours * 60, // Convert hours to minutes
      level: course.difficulty_level,
      category: course.category.name,
      rating: course.rating.average || 0,
      reviewCount: course.rating.total_ratings,
      studentsCount: course.stats.total_enrollments,
      isFree: course.price.is_free,
    })) || []
  }, [coursesData])

  // Filter courses by search term (client-side for search)
  const filteredAndSortedCourses = useMemo(() => {
    let filtered = courseCards

    // Apply search filter on client side for better UX
    if (searchQuery) {
      filtered = filtered.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesSearch
      })
    }

    return filtered
  }, [courseCards, searchQuery])

  // Pagination from API
  const totalPages = coursesData?.pagination?.total_pages || 1
  const coursesPerPage = coursesData?.pagination?.per_page || 12

  const handleFilterChange = (newFilters: CourseFiltersProps["filters"]) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  // Handle search with debounce effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const handleEnroll = (courseId: string) => {
    // TODO: Implement enrollment logic
    console.log("Enrolling in course:", courseId)
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">Có lỗi xảy ra khi tải khóa học</p>
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Khóa học</h1>
        <p className="text-muted-foreground">
          Khám phá các khóa học chất lượng cao từ các chuyên gia hàng đầu
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-4">
            <CourseFilters
              filters={filters}
              onFiltersChange={handleFilterChange}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Search and Controls */}
          <div className="mb-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Tìm kiếm khóa học..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Controls Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* Results Count */}
              <div className="text-sm text-muted-foreground">
                Tìm thấy {filteredAndSortedCourses.length} khóa học
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Bộ lọc
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Bộ lọc khóa học</SheetTitle>
                      <SheetDescription>
                        Lọc khóa học theo danh mục, giá cả và mức độ
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                      <CourseFilters
                        filters={filters}
                        onFiltersChange={(newFilters) => {
                          handleFilterChange(newFilters)
                          setShowMobileFilters(false)
                        }}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Sort Dropdown */}
                <CourseSorting
                  currentSort={sortOption}
                  onSortChange={setSortOption}
                />
              </div>
            </div>
          </div>

          {/* Course Grid with Pagination */}
          <CourseGrid
            courses={filteredAndSortedCourses}
            currentPage={currentPage}
            totalPages={totalPages}
            coursesPerPage={coursesPerPage}
            onPageChange={setCurrentPage}
            onEnroll={handleEnroll}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}