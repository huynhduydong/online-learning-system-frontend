"use client"

import { Star, Clock, Users, BookOpen } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDuration } from "@/lib/utils"

export interface CourseCardProps {
  id: string
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

export function CourseCard({
  id,
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
  const handleEnroll = () => {
    onEnroll?.(id)
  }

  // Chỉ hiển thị đánh giá khi có ít nhất 5 đánh giá
  const shouldShowRating = reviewCount && reviewCount >= 5

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
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
          <Button onClick={handleEnroll} size="sm" className="ml-2">
            Đăng ký ngay
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}