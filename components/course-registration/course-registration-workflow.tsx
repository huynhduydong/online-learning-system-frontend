'use client'

/**
 * Course Registration Workflow Component
 * Handles the complete course registration process from initiation to completion
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { AlertCircle, CheckCircle, Loader2, X } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

import { useAuth } from '@/contexts/auth-context'
import { enrollmentService, type EnrollmentStatus } from '@/lib/api/enrollment'
import type { Course } from '@/lib/api/types'

import { RegistrationStartScreen } from '@/components/course-registration/registration-start-screen'
import { RegistrationInfoForm } from '@/components/course-registration/registration-info-form'
import { PaymentScreen } from '@/components/course-registration/payment-screen'
import { CompletionScreen } from '@/components/course-registration/completion-screen'

export interface CourseRegistrationWorkflowProps {
  course: Course | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: (enrollmentId: string) => void
}

type WorkflowStep =
  | 'auth_check'
  | 'registration_start'
  | 'registration_info'
  | 'payment'
  | 'completion'
  | 'error'

interface WorkflowState {
  step: WorkflowStep
  enrollmentId?: string
  enrollmentStatus?: EnrollmentStatus
  error?: string
  isProcessing: boolean
}

export function CourseRegistrationWorkflow({
  course,
  isOpen,
  onClose,
  onSuccess
}: CourseRegistrationWorkflowProps) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  const [state, setState] = useState<WorkflowState>({
    step: 'auth_check',
    isProcessing: false
  })

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (isOpen && course) {
      setState({
        step: 'auth_check',
        isProcessing: false
      })
      checkAuthAndInitialize()
    } else if (!isOpen) {
      setState({
        step: 'auth_check',
        isProcessing: false
      })
    }
  }, [isOpen, course])

  const checkAuthAndInitialize = async () => {
    if (!course) return

    // Validate required course properties
    if (!course.id || !course.slug) {
      console.error('Course missing required properties:', { id: course.id, slug: course.slug })
      setState(prev => ({
        ...prev,
        step: 'error',
        error: 'Thông tin khóa học không hợp lệ. Vui lòng thử lại sau.',
        isProcessing: false
      }))
      return
    }

    setState(prev => ({ ...prev, isProcessing: true }))

    try {
      // Check if user is authenticated
      if (!isAuthenticated || !user) {
        // Redirect to login with return URL
        const returnUrl = encodeURIComponent(`/courses/${course.slug}?register=true`)
        window.location.href = `/login?return=${returnUrl}`
        onClose()
        return
      }

      // Check if user already has access to this course
      const accessCheck = await enrollmentService.checkCourseAccess(course.id.toString())

      if (accessCheck.hasAccess && accessCheck.enrollmentStatus?.status === 'active') {
        // User already has access - redirect to first lesson
        const firstLessonUrl = `/courses/${course.slug}/lessons/1`
        window.location.href = firstLessonUrl
        onClose()
        return
      }

      if (accessCheck.enrollmentStatus &&
        ['payment_pending', 'enrolled', 'activating'].includes(accessCheck.enrollmentStatus.status)) {
        // Continue with existing enrollment
        setState(prev => ({
          ...prev,
          step: accessCheck.enrollmentStatus!.status === 'payment_pending' ? 'payment' : 'completion',
          enrollmentId: accessCheck.enrollmentStatus!.id,
          enrollmentStatus: accessCheck.enrollmentStatus,
          isProcessing: false
        }))
        return
      }

      // Start new registration process
      setState(prev => ({
        ...prev,
        step: 'registration_start',
        isProcessing: false
      }))

    } catch (error) {
      console.error('Auth check error:', error)
      setState(prev => ({
        ...prev,
        step: 'error',
        error: error instanceof Error ? error.message : 'Có lỗi xảy ra khi kiểm tra trạng thái đăng ký',
        isProcessing: false
      }))
    }
  }

  const handleRegistrationStart = () => {
    if (!course) return

    const isFree = course.price?.current_price === 0 ||
      course.price?.is_free

    if (isFree) {
      // For free courses, proceed directly to registration
      setState(prev => ({ ...prev, step: 'registration_info' }))
    } else {
      // For paid courses, show info form first
      setState(prev => ({ ...prev, step: 'registration_info' }))
    }
  }

  const handleRegistrationInfo = async (data: { fullName: string; email: string; discountCode?: string }) => {
    if (!course || !user) return

    // Validate required course properties
    if (!course.id) {
      console.error('Course missing required id property:', course)
      setState(prev => ({
        ...prev,
        step: 'error',
        error: 'Thông tin khóa học không hợp lệ. Vui lòng thử lại sau.',
        isProcessing: false
      }))
      return
    }

    setState(prev => ({ ...prev, isProcessing: true }))

    try {
      const enrollmentResponse = await enrollmentService.startRegistration({
        course_id: course.id.toString(),
        full_name: data.fullName,
        email: data.email,
        discount_code: data.discountCode
      })

      console.log('Enrollment response received:', enrollmentResponse)

      // Validate response structure
      if (!enrollmentResponse || typeof enrollmentResponse !== 'object') {
        throw new Error('Invalid registration response')
      }

      // Check if enrollment data exists
      if (!enrollmentResponse.enrollment || !enrollmentResponse.enrollment.id) {
        console.error('Invalid enrollment data structure:', enrollmentResponse)
        throw new Error('Registration response missing enrollment data')
      }

      // Determine next step based on course type and payment requirement
      let nextStep: WorkflowStep = 'completion'
      if (enrollmentResponse.access_immediate) {
        // Free course or immediate access
        nextStep = 'completion'
      } else if (enrollmentResponse.payment_required) {
        // Paid course - proceed to payment
        nextStep = 'payment'
      } else {
        // Course enrolled but needs activation
        nextStep = 'completion'
      }

      // Single setState call to avoid render issues
      setState(prev => ({
        ...prev,
        enrollmentId: enrollmentResponse.enrollment.id,
        enrollmentStatus: enrollmentResponse.enrollment,
        step: nextStep,
        isProcessing: false
      }))

    } catch (error) {
      console.error('Registration error:', error)

      // Extract meaningful error message
      let errorMessage = 'Đăng ký thất bại. Vui lòng thử lại.'

      if (error instanceof Error) {
        if (error.message.includes('Validation failed')) {
          errorMessage = 'Thông tin đăng ký không hợp lệ. Vui lòng kiểm tra lại.'
        } else if (error.message.includes('Invalid')) {
          errorMessage = 'Có lỗi xảy ra với dữ liệu đăng ký. Vui lòng thử lại.'
        } else {
          errorMessage = error.message
        }
      }

      setState(prev => ({
        ...prev,
        step: 'error',
        error: errorMessage,
        isProcessing: false
      }))
    }
  }

  const handlePaymentSuccess = (updatedEnrollment: EnrollmentStatus) => {
    setState(prev => ({
      ...prev,
      enrollmentStatus: updatedEnrollment,
      step: 'completion',
      isProcessing: false
    }))
  }

  const handlePaymentError = (error: string) => {
    setState(prev => ({
      ...prev,
      step: 'error',
      error,
      isProcessing: false
    }))
  }

  const handleCompletionSuccess = (firstLessonUrl: string) => {
    if (onSuccess && state.enrollmentId) {
      onSuccess(state.enrollmentId)
    }
    onClose()
    window.location.href = firstLessonUrl
  }

  const handleRetry = () => {
    setState(prev => ({
      ...prev,
      step: 'auth_check',
      error: undefined,
      isProcessing: false
    }))
    checkAuthAndInitialize()
  }

  const getStepProgress = (): number => {
    switch (state.step) {
      case 'auth_check': return 10
      case 'registration_start': return 20
      case 'registration_info': return 40
      case 'payment': return 70
      case 'completion': return 90
      case 'error': return 0
      default: return 0
    }
  }

  const getStepTitle = (): string => {
    switch (state.step) {
      case 'auth_check': return 'Đang kiểm tra...'
      case 'registration_start': return 'Thông tin khóa học'
      case 'registration_info': return 'Thông tin đăng ký'
      case 'payment': return 'Thanh toán'
      case 'completion': return 'Hoàn tất đăng ký'
      case 'error': return 'Có lỗi xảy ra'
      default: return 'Đăng ký khóa học'
    }
  }

  if (!course) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              {getStepTitle()}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {state.step !== 'error' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Tiến độ đăng ký</span>
                <span>{getStepProgress()}%</span>
              </div>
              <Progress value={getStepProgress()} className="h-2" />
            </div>
          )}
        </DialogHeader>

        <div className="space-y-6">
          {state.step === 'auth_check' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Đang kiểm tra trạng thái đăng ký...</p>
            </div>
          )}

          {state.step === 'registration_start' && (
            <RegistrationStartScreen
              course={course}
              onContinue={handleRegistrationStart}
              onCancel={onClose}
            />
          )}

          {state.step === 'registration_info' && (
            <RegistrationInfoForm
              course={course}
              user={user}
              onSubmit={handleRegistrationInfo}
              onBack={() => setState(prev => ({ ...prev, step: 'registration_start' }))}
              isLoading={state.isProcessing}
            />
          )}

          {state.step === 'payment' && state.enrollmentStatus && (
            <PaymentScreen
              course={course}
              enrollment={state.enrollmentStatus}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              onBack={() => setState(prev => ({ ...prev, step: 'registration_info' }))}
            />
          )}

          {state.step === 'completion' && state.enrollmentStatus && (
            <CompletionScreen
              course={course}
              enrollment={state.enrollmentStatus}
              onSuccess={handleCompletionSuccess}
              onRetry={handleRetry}
            />
          )}

          {state.step === 'error' && (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {state.error}
                </AlertDescription>
              </Alert>

              <div className="flex justify-center space-x-3">
                <Button onClick={handleRetry} variant="outline">
                  Thử lại
                </Button>
                <Button onClick={onClose} variant="secondary">
                  Đóng
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
