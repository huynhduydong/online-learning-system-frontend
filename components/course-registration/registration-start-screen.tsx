'use client'

/**
 * Registration Start Screen Component
 * Shows course details and provides appropriate action buttons based on course type
 */

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Clock, Users, Star, Award, BookOpen } from 'lucide-react'
import type { Course } from '@/lib/api/types'
import { formatCurrency, formatDuration } from '@/lib/utils'

export interface RegistrationStartScreenProps {
  course: Course
  onContinue: () => void
  onCancel: () => void
}

export function RegistrationStartScreen({
  course,
  onContinue,
  onCancel
}: RegistrationStartScreenProps) {
  const isFree = course.price?.current_price === 0 || 
                 course.price?.is_free

  const price = course.price?.current_price || 0
  const originalPrice = course.price?.original_price || 0
  const hasDiscount = originalPrice > 0 && originalPrice > price

  return (
    <div className="space-y-6">
      {/* Course Hero */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Course Thumbnail */}
            <div className="flex-shrink-0">
              <img
                src={course.thumbnail_url || '/placeholder.jpg'}
                alt={course.title || 'Course thumbnail'}
                className="w-full md:w-48 h-32 md:h-36 object-cover rounded-lg"
              />
            </div>

            {/* Course Details */}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {course.title || 'Untitled Course'}
                </h2>
                <p className="text-muted-foreground">
                  {course.short_description || 'No description available'}
                </p>
              </div>

              {/* Instructor */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-xs font-medium">
                    {course.instructor?.name?.charAt(0) || 'I'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {course.instructor?.name || 'Unknown Instructor'}
                  </p>
                  <p className="text-xs text-muted-foreground">Giảng viên</p>
                </div>
              </div>

              {/* Course Stats */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {course.rating && course.rating.average > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{course.rating?.average || 0}</span>
                    <span>({course.rating.count || course.rating.total_ratings || 0})</span>
                  </div>
                )}
                
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{course.stats?.students_count?.toLocaleString() || 0} học viên</span>
                </div>

                {course.stats?.duration_hours && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.stats.duration_hours}h</span>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>
                    {course.difficulty_level === 'beginner' ? 'Cơ bản' : 
                     course.difficulty_level === 'intermediate' ? 'Trung cấp' : 'Nâng cao'}
                  </span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {isFree && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Miễn phí
                  </Badge>
                )}
                
                {course.category && (
                  <Badge variant="outline">
                    {typeof course.category === 'string' ? course.category : course.category?.name || 'Uncategorized'}
                  </Badge>
                )}

                {course.difficulty_level && (
                  <Badge variant="outline">
                    {course.difficulty_level === 'beginner' ? 'Cơ bản' : 
                     course.difficulty_level === 'intermediate' ? 'Trung cấp' : 'Nâng cao'}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Information */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Thông tin giá</h3>
            
            <div className="flex items-center justify-between">
              <div>
                {isFree ? (
                  <div className="text-2xl font-bold text-green-600">
                    Miễn phí
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">
                      {formatCurrency(price)}
                    </div>
                    {hasDiscount && (
                      <div className="flex items-center gap-2">
                        <span className="text-lg line-through text-muted-foreground">
                          {formatCurrency(originalPrice)}
                        </span>
                        <Badge variant="destructive">
                          Giảm {Math.round(((originalPrice - price) / originalPrice) * 100)}%
                        </Badge>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {!isFree && (
                <div className="text-right text-sm text-muted-foreground">
                  <p>Truy cập trọn đời</p>
                  <p>Chứng chỉ hoàn thành</p>
                  <p>Hỗ trợ 24/7</p>
                </div>
              )}
            </div>

            {!isFree && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-primary" />
                  <span className="font-medium">Bao gồm:</span>
                </div>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• Truy cập tất cả video bài giảng</li>
                  <li>• Tài liệu học tập có thể tải xuống</li>
                  <li>• Bài tập thực hành và dự án</li>
                  <li>• Chứng chỉ hoàn thành có giá trị</li>
                  <li>• Hỗ trợ từ giảng viên và cộng đồng</li>
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-4">
        <Separator />
        
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onCancel}
            className="sm:w-auto w-full"
          >
            Hủy
          </Button>
          
          <Button
            onClick={onContinue}
            className="sm:w-auto w-full"
            size="lg"
          >
            {isFree ? 'Đăng ký ngay' : 'Tiếp tục'}
          </Button>
        </div>

        {!isFree && (
          <p className="text-xs text-center text-muted-foreground">
            Bước tiếp theo: Điền thông tin cá nhân và xử lý thanh toán
          </p>
        )}
      </div>
    </div>
  )
}
