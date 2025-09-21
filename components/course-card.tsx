"use client"

import { Star, Clock, Users, BookOpen } from "lucide-react"
import Link from "next/link"
import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
// Helper functions
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (hours === 0) {
    return `${remainingMinutes}m`
  } else if (remainingMinutes === 0) {
    return `${hours}h`
  } else {
    return `${hours}h ${remainingMinutes}m`
  }
}
import { Course } from "@/lib/api/types"
import { useSafeCourse } from "@/hooks/use-safe-course"

export interface CourseCardProps {
  id: string
  slug: string
  title: string
  description: string
  instructor: {
    id: string
    name: string
    avatar?: string
  }
  thumbnail: string
  price: number
  originalPrice?: number
  duration: number // in minutes
  level: "beginner" | "intermediate" | "advanced"
  category: string
  rating: number
  reviewCount?: number
  studentsCount: number
  isFree?: boolean
  onEnroll?: (courseId: string) => void
}

export interface CourseCardNewProps {
  course: Course | null | undefined
  variant?: 'vertical' | 'horizontal'
  onEnroll?: (courseId: string) => void
}

// New CourseCard component for Course type
export function CourseCard({
  course: rawCourse,
  variant = 'vertical',
  onEnroll
}: CourseCardNewProps) {
  // Tạm thời disable safe course hook để debug
  // const course = useSafeCourse(rawCourse)
  const course = rawCourse
  
  // Guard clause - nếu course không tồn tại thì return null
  if (!course) {
    console.log('CourseCard: course is null/undefined')
    return null
  }

  const handleEnroll = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onEnroll?.(course?.id?.toString() || '')
  }

  const shouldShowRating = useMemo(() => {
    const ratingCount = course?.rating?.count || course?.rating?.total_ratings || 0
    return ratingCount >= 5
  }, [course?.rating?.count, course?.rating?.total_ratings])

  if (variant === 'horizontal') {
    return (
      <Link href={`/courses/${course?.slug || ''}`} className="block">
        <Card className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
          <div className="flex">
            {/* Thumbnail */}
            <div className="w-48 h-32 bg-muted relative overflow-hidden flex-shrink-0">
              <img
                src={course.thumbnail_url || '/placeholder.jpg'}
                alt={course.title || 'Course thumbnail'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Badge className="absolute top-2 right-2 bg-white/90 text-gray-900 hover:bg-white text-xs">
                {course?.difficulty_level === 'beginner' ? 'Cơ bản' : 
                 course?.difficulty_level === 'intermediate' ? 'Trung cấp' : 'Nâng cao'}
              </Badge>
              {(course.price?.current === 0 || course.price?.current_price === 0 || course.price?.is_free) && (
                <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600 text-xs">
                  Miễn phí
                </Badge>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 p-4">
              <div className="flex justify-between h-full">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {course?.title || 'Untitled Course'}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {course?.short_description || 'No description available'}
                  </p>

                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-sm text-muted-foreground font-medium">
                      {course?.instructor?.name || 'Unknown Instructor'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    {shouldShowRating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{course.rating?.average || 0}</span>
                         <span className="text-xs">({course.rating?.count || course.rating?.total_ratings || 0})</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{course.stats?.students_count?.toLocaleString() || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between items-end ml-4">
                  <div className="text-right">
                    {(course?.price?.current === 0 || course?.price?.current_price === 0 || course?.price?.is_free) ? (
                      <div className="text-lg font-bold text-green-600">Miễn phí</div>
                    ) : (
                      <>
                        <div className="text-lg font-bold">{formatCurrency(course?.price?.current || course?.price?.current_price || course?.price?.amount || 0)}</div>
                        {(course?.price?.original || course?.price?.original_price) && (course?.price?.original || course?.price?.original_price || 0) > (course?.price?.current || course?.price?.current_price || course?.price?.amount || 0) && (
                          <div className="text-sm text-muted-foreground line-through">
                            {formatCurrency(course?.price?.original || course?.price?.original_price || 0)}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <Button
                    size="sm"
                    onClick={handleEnroll}
                    className="mt-2"
                  >
                    {(course?.price?.current === 0 || course?.price?.current_price === 0 || course?.price?.is_free) ? 'Học ngay' : 'Đăng ký'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  // Vertical variant (default)
  return (
    <Link href={`/courses/${course?.slug || ''}`} className="block">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
        <div className="aspect-video bg-muted relative overflow-hidden">
          <img
            src={course?.thumbnail_url || '/placeholder.jpg'}
            alt={course?.title || 'Course thumbnail'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-2 right-2 bg-white/90 text-gray-900 hover:bg-white">
            {course?.difficulty_level === 'beginner' ? 'Cơ bản' : 
             course?.difficulty_level === 'intermediate' ? 'Trung cấp' : 'Nâng cao'}
          </Badge>
          {(course?.price?.current === 0 || course?.price?.current_price === 0 || course?.price?.is_free) && (
            <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">
              Miễn phí
            </Badge>
          )}
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                {course?.title || 'Untitled Course'}
              </CardTitle>
              <CardDescription className="line-clamp-2 text-sm">
                {course?.short_description || 'No description available'}
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-3">
            <span className="text-sm text-muted-foreground font-medium">
              {course?.instructor?.name || 'Unknown Instructor'}
            </span>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <div className="flex items-center space-x-4">
              {shouldShowRating && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{course.rating?.average || 0}</span>
                   <span className="text-xs">({course.rating?.count || course.rating?.total_ratings || 0})</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{course.stats?.students_count?.toLocaleString() || 0}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {(course?.price?.current === 0 || course?.price?.current_price === 0 || course?.price?.is_free) ? (
                <span className="text-lg font-bold text-green-600">Miễn phí</span>
              ) : (
                <>
                  <span className="text-lg font-bold">{formatCurrency(course?.price?.current || course?.price?.current_price || course?.price?.amount || 0)}</span>
                  {(course?.price?.original || course?.price?.original_price) && (course?.price?.original || course?.price?.original_price || 0) > (course?.price?.current || course?.price?.current_price || course?.price?.amount || 0) && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatCurrency(course?.price?.original || course?.price?.original_price || 0)}
                    </span>
                  )}
                </>
              )}
            </div>
            <Button
              size="sm"
              onClick={handleEnroll}
            >
              {(course?.price?.current === 0 || course?.price?.current_price === 0 || course?.price?.is_free) ? 'Học ngay' : 'Đăng ký'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

// Legacy CourseCard component for backward compatibility
export function LegacyCourseCard({
  id,
  slug,
  title,
  description,
  instructor,
  thumbnail,
  price,
  originalPrice,
  duration,
  level,
  category,
  rating,
  reviewCount = 0,
  studentsCount,
  isFree = false,
  onEnroll
}: CourseCardProps) {
  const handleEnroll = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation when clicking enroll button
    e.stopPropagation()
    onEnroll?.(id)
  }

  // Chỉ hiển thị đánh giá khi có ít nhất 5 đánh giá
  const shouldShowRating = reviewCount && reviewCount >= 5

  return (
    <Link href={`/courses/${slug}`} className="block">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
        <div className="aspect-video bg-muted relative overflow-hidden">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-2 right-2 bg-white/90 text-gray-900 hover:bg-white">
            {level === 'beginner' ? 'Cơ bản' : level === 'intermediate' ? 'Trung cấp' : 'Nâng cao'}
          </Badge>
          {isFree && (
            <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">
              Miễn phí
            </Badge>
          )}
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                {title}
              </CardTitle>
              <CardDescription className="line-clamp-2 text-sm">
                {description}
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-3">
            <img
              src={instructor.avatar || "/placeholder-user.jpg"}
              alt={instructor.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-sm text-muted-foreground font-medium">
              {instructor.name}
            </span>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <div className="flex items-center space-x-4">
              {rating >= 1 && reviewCount && reviewCount >= 5 && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{rating}</span>
                  <span className="text-xs">({reviewCount})</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(duration)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{studentsCount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {isFree ? (
                <span className="text-lg font-bold text-green-600">Miễn phí</span>
              ) : (
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(price)}
                  </span>
                  {originalPrice && originalPrice > price && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatCurrency(originalPrice)}
                    </span>
                  )}
                </div>
              )}
            </div>
            <Button 
              className="w-full" 
              variant={isFree ? "secondary" : "default"}
              onClick={handleEnroll}
            >
              {isFree ? "Học miễn phí" : "Đăng ký ngay"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}