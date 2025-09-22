'use client'

/**
 * Completion Screen Component
 * Handles course activation and provides learning access
 */

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  CheckCircle,
  Loader2,
  PlayCircle,
  AlertCircle,
  RefreshCw,
  BookOpen,
  Award,
  Clock,
  ExternalLink
} from 'lucide-react'

import { enrollmentService, type EnrollmentStatus, type ActivationResponse } from '@/lib/api/enrollment'
import type { Course } from '@/lib/api/types'

export interface CompletionScreenProps {
  course: Course
  enrollment: EnrollmentStatus
  onSuccess: (firstLessonUrl: string) => void
  onRetry: () => void
}

type ActivationState =
  | 'activating'
  | 'success'
  | 'delay'
  | 'error'

interface CompletionState {
  activationState: ActivationState
  activationResponse?: ActivationResponse
  error?: string
  retryCount: number
  maxRetries: number
}

export function CompletionScreen({
  course,
  enrollment,
  onSuccess,
  onRetry
}: CompletionScreenProps) {
  const [state, setState] = useState<CompletionState>({
    activationState: 'activating',
    retryCount: 0,
    maxRetries: 3
  })

  const isFree = course.price?.current_price === 0 ||
    course.price?.is_free

  // Start activation process on component mount
  useEffect(() => {
    if (enrollment.access_granted) {
      // Already activated (check access_granted first, status might not be updated yet)
      setState(prev => ({
        ...prev,
        activationState: 'success',
        activationResponse: {
          success: true,
          access_granted: true,
          first_lesson_url: `/courses/${course.slug}/lessons/1`
        }
      }))
    } else {
      // Need to activate
      activateAccess()
    }
  }, [enrollment, course.slug])

  const activateAccess = async () => {
    setState(prev => ({
      ...prev,
      activationState: 'activating',
      error: undefined
    }))

    try {
      // Simulate activation delay for realistic experience
      await new Promise(resolve => setTimeout(resolve, 2000))

      const response = await enrollmentService.activateEnrollment(enrollment.id)

      if (response.success && response.access_granted) {
        setState(prev => ({
          ...prev,
          activationState: 'success',
          activationResponse: response
        }))
      } else if (response.retry_available) {
        setState(prev => ({
          ...prev,
          activationState: 'delay',
          activationResponse: response
        }))
      } else {
        setState(prev => ({
          ...prev,
          activationState: 'error',
          error: 'Không thể kích hoạt quyền truy cập. Vui lòng liên hệ hỗ trợ.'
        }))
      }

    } catch (error) {
      console.error('Activation error:', error)
      setState(prev => ({
        ...prev,
        activationState: 'error',
        error: error instanceof Error ? error.message : 'Có lỗi xảy ra khi kích hoạt khóa học'
      }))
    }
  }

  const handleRetryActivation = async () => {
    if (state.retryCount >= state.maxRetries) {
      setState(prev => ({
        ...prev,
        activationState: 'error',
        error: 'Đã vượt quá số lần thử lại. Vui lòng liên hệ hỗ trợ.'
      }))
      return
    }

    setState(prev => ({
      ...prev,
      retryCount: prev.retryCount + 1
    }))

    try {
      const response = await enrollmentService.retryActivation(enrollment.id)

      if (response.success && response.access_granted) {
        setState(prev => ({
          ...prev,
          activationState: 'success',
          activationResponse: response
        }))
      } else {
        setState(prev => ({
          ...prev,
          activationState: 'delay',
          activationResponse: response
        }))
      }

    } catch (error) {
      console.error('Retry activation error:', error)
      setState(prev => ({
        ...prev,
        activationState: 'error',
        error: error instanceof Error ? error.message : 'Không thể thử lại kích hoạt'
      }))
    }
  }

  const handleStartLearning = () => {
    const firstLessonUrl = state.activationResponse?.first_lesson_url || `/courses/${course.slug}/lessons/1`
    onSuccess(firstLessonUrl)
  }

  const handleContactSupport = () => {
    // Open support contact (could be email, chat, or phone)
    window.open('mailto:support@example.com?subject=Course Activation Issue&body=Course: ' + course.title, '_blank')
  }

  return (
    <div className="space-y-6">
      {/* Success State */}
      {state.activationState === 'success' && (
        <>
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-green-800 mb-2">
                    {isFree ? 'Đăng ký thành công!' : 'Thanh toán thành công!'}
                  </h2>
                  <p className="text-green-700">
                    Quyền truy cập khóa học đã được kích hoạt. Bạn có thể bắt đầu học ngay bây giờ!
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-green-700">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Truy cập trọn đời</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    <span>Chứng chỉ hoàn thành</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5" />
                Sẵn sàng bắt đầu học?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={course.thumbnail_url || '/placeholder.jpg'}
                  alt={course.title || 'Course thumbnail'}
                  className="w-16 h-12 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{course.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Giảng viên: {course.instructor?.name || 'Unknown'}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>{course.stats?.students_count?.toLocaleString() || 0} học viên</span>
                    {course.stats?.duration_hours && (
                      <span>{course.stats.duration_hours}h</span>
                    )}
                  </div>
                </div>
              </div>

              <Button
                onClick={handleStartLearning}
                className="w-full"
                size="lg"
              >
                <PlayCircle className="h-5 w-5 mr-2" />
                Bắt đầu học ngay
              </Button>

              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => window.open('/dashboard', '_blank')}
                  className="text-sm"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Xem trong Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Activating State */}
      {state.activationState === 'activating' && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>

              <div>
                <h2 className="text-xl font-bold mb-2">
                  Đang kích hoạt quyền truy cập...
                </h2>
                <p className="text-muted-foreground">
                  Hệ thống đang đồng bộ hóa khóa học và cấp quyền truy cập cho bạn.
                </p>
              </div>

              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
              </div>

              <p className="text-sm text-muted-foreground">
                Quá trình này thường mất 1-2 phút. Vui lòng không đóng cửa sổ này.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delay State */}
      {state.activationState === 'delay' && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Quá trình kích hoạt đang mất nhiều thời gian hơn bình thường.
                Điều này có thể do tải hệ thống cao.
              </AlertDescription>
            </Alert>

            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">
                Đang xử lý kích hoạt khóa học
              </h3>
              <p className="text-muted-foreground">
                Hệ thống đang xử lý yêu cầu kích hoạt của bạn.
                Bạn có thể thử lại hoặc đợi thêm một chút.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={handleRetryActivation}
                  variant="outline"
                  disabled={state.retryCount >= state.maxRetries}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Thử lại ({state.maxRetries - state.retryCount} lần còn lại)
                </Button>

                <Button onClick={handleContactSupport} variant="outline">
                  Liên hệ hỗ trợ
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {state.activationState === 'error' && (
        <Card className="border-red-200">
          <CardContent className="p-6 space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {state.error}
              </AlertDescription>
            </Alert>

            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">
                Không thể kích hoạt khóa học
              </h3>
              <p className="text-muted-foreground">
                Đã xảy ra lỗi khi kích hoạt quyền truy cập khóa học.
                Đừng lo lắng, việc thanh toán của bạn đã được xử lý thành công.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {state.retryCount < state.maxRetries ? (
                  <Button onClick={handleRetryActivation}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Thử lại
                  </Button>
                ) : (
                  <Button onClick={onRetry} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Bắt đầu lại
                  </Button>
                )}

                <Button onClick={handleContactSupport} variant="outline">
                  Liên hệ hỗ trợ
                </Button>
              </div>

              <div className="text-xs text-muted-foreground">
                <p>ID đăng ký: {enrollment.id}</p>
                <p>Vui lòng cung cấp ID này khi liên hệ hỗ trợ</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
