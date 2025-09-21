'use client'

/**
 * Payment Screen Component
 * Handles payment processing for paid courses
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CreditCard, 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  X,
  DollarSign,
  Shield,
  Clock
} from 'lucide-react'

import { enrollmentService, type EnrollmentStatus } from '@/lib/api/enrollment'
import type { Course } from '@/lib/api/types'
import { formatCurrency } from '@/lib/utils'

export interface PaymentScreenProps {
  course: Course
  enrollment: EnrollmentStatus
  onSuccess: (updatedEnrollment: EnrollmentStatus) => void
  onError: (error: string) => void
  onBack: () => void
}

type PaymentMethod = 'credit_card' | 'paypal' | 'bank_transfer'

interface PaymentState {
  isProcessing: boolean
  selectedMethod: PaymentMethod | null
  error: string | null
  showRetry: boolean
}

export function PaymentScreen({
  course,
  enrollment,
  onSuccess,
  onError,
  onBack
}: PaymentScreenProps) {
  const [paymentState, setPaymentState] = useState<PaymentState>({
    isProcessing: false,
    selectedMethod: null,
    error: null,
    showRetry: false
  })

  const finalAmount = enrollment.payment_amount - (enrollment.discount_applied || 0)

  const paymentMethods = [
    {
      id: 'credit_card' as PaymentMethod,
      name: 'Thẻ tín dụng/Ghi nợ',
      description: 'Visa, Mastercard, JCB',
      icon: CreditCard,
      recommended: true
    },
    {
      id: 'paypal' as PaymentMethod,
      name: 'PayPal',
      description: 'Thanh toán an toàn qua PayPal',
      icon: DollarSign
    },
    {
      id: 'bank_transfer' as PaymentMethod,
      name: 'Chuyển khoản ngân hàng',
      description: 'Chuyển khoản trực tiếp',
      icon: Shield
    }
  ]

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setPaymentState(prev => ({
      ...prev,
      selectedMethod: method,
      error: null,
      showRetry: false
    }))
  }

  const processPayment = async () => {
    if (!paymentState.selectedMethod) return

    setPaymentState(prev => ({ ...prev, isProcessing: true, error: null }))

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      const updatedEnrollment = await enrollmentService.processPayment({
        enrollment_id: enrollment.id,
        payment_method: paymentState.selectedMethod
      })

      if (updatedEnrollment.payment_status === 'completed') {
        onSuccess(updatedEnrollment)
      } else if (updatedEnrollment.payment_status === 'failed') {
        setPaymentState(prev => ({
          ...prev,
          isProcessing: false,
          error: 'Thanh toán thất bại. Vui lòng kiểm tra thông tin thẻ hoặc thử lại.',
          showRetry: true
        }))
      } else {
        setPaymentState(prev => ({
          ...prev,
          isProcessing: false,
          error: 'Thanh toán đang được xử lý. Vui lòng đợi...'
        }))
      }

    } catch (error) {
      console.error('Payment error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi xử lý thanh toán'
      
      setPaymentState(prev => ({
        ...prev,
        isProcessing: false,
        error: errorMessage,
        showRetry: true
      }))
    }
  }

  const handleRetry = () => {
    setPaymentState(prev => ({
      ...prev,
      error: null,
      showRetry: false
    }))
  }

  const handleCancel = () => {
    setPaymentState(prev => ({
      ...prev,
      error: 'Thanh toán đã bị hủy. Bạn có thể thử lại sau.',
      showRetry: true,
      isProcessing: false
    }))
  }

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Tóm tắt đơn hàng
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
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">
                {formatCurrency(enrollment.payment_amount)}
              </div>
            </div>
          </div>

          {enrollment.discount_applied && enrollment.discount_applied > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Giá gốc:</span>
                  <span>{formatCurrency(enrollment.payment_amount)}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Giảm giá:</span>
                  <span>-{formatCurrency(enrollment.discount_applied)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Tổng thanh toán:</span>
                  <span>{formatCurrency(finalAmount)}</span>
                </div>
              </div>
            </>
          )}

          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="font-medium">Thanh toán an toàn 100%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Thông tin thanh toán được mã hóa SSL 256-bit
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Chọn phương thức thanh toán</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {paymentMethods.map((method) => {
            const Icon = method.icon
            const isSelected = paymentState.selectedMethod === method.id
            
            return (
              <div
                key={method.id}
                className={`
                  p-4 border rounded-lg cursor-pointer transition-all
                  ${isSelected 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                  }
                `}
                onClick={() => handlePaymentMethodSelect(method.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{method.name}</span>
                        {method.recommended && (
                          <Badge variant="secondary" className="text-xs">
                            Khuyến nghị
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {method.description}
                      </p>
                    </div>
                  </div>
                  <div className={`
                    w-4 h-4 rounded-full border-2 transition-all
                    ${isSelected 
                      ? 'border-primary bg-primary' 
                      : 'border-border'
                    }
                  `}>
                    {isSelected && (
                      <CheckCircle className="h-3 w-3 text-white -ml-0.5 -mt-0.5" />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Error Message */}
      {paymentState.error && (
        <Alert variant={paymentState.showRetry ? "destructive" : "default"}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{paymentState.error}</AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="space-y-4">
        <Separator />
        
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={paymentState.isProcessing}
            className="sm:w-auto w-full"
          >
            Quay lại
          </Button>

          {paymentState.showRetry ? (
            <div className="flex gap-2 sm:w-auto w-full">
              <Button
                variant="outline"
                onClick={handleRetry}
                className="flex-1 sm:w-auto"
              >
                Thử lại
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancel}
                className="flex-1 sm:w-auto"
              >
                Hủy
              </Button>
            </div>
          ) : (
            <Button
              onClick={processPayment}
              disabled={!paymentState.selectedMethod || paymentState.isProcessing}
              className="sm:w-auto w-full"
              size="lg"
            >
              {paymentState.isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Thanh toán {formatCurrency(finalAmount)}
                </>
              )}
            </Button>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Thời gian xử lý: 2-5 phút</span>
        </div>
      </div>
    </div>
  )
}

