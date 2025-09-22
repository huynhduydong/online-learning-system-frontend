'use client'

/**
 * Payment Screen Component
 * Handles payment processing for paid courses
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
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
  isPolling: boolean
  pollAttempts: number
  activationAttempted: boolean
}

// Validation schemas for each payment method matching API specifications
const creditCardSchema = z.object({
  card_number: z.string()
    .min(1, "Card number is required")
    .refine((val) => {
      // Remove spaces and validate 13-19 digits
      const digits = val.replace(/\s/g, '')
      return /^\d{13,19}$/.test(digits)
    }, "Card number must be 13-19 digits"),
  card_holder_name: z.string()
    .min(2, "Cardholder name must be at least 2 characters")
    .max(255, "Cardholder name must not exceed 255 characters")
    .refine((val) => {
      // Letters, spaces, hyphens, apostrophes, dots only
      return /^[a-zA-Z\s\-'.]+$/.test(val)
    }, "Cardholder name can only contain letters, spaces, hyphens, apostrophes, and dots"),
  card_expiry: z.string()
    .min(1, "Card expiry is required")
    .refine((val) => {
      // MM/YY format validation
      return /^(0[1-9]|1[0-2])\/\d{2}$/.test(val)
    }, "Card expiry must be in MM/YY format"),
  card_cvv: z.string()
    .min(1, "CVV is required")
    .refine((val) => {
      // 3-4 digits validation
      return /^\d{3,4}$/.test(val)
    }, "CVV must be 3 or 4 digits"),
})

const paypalSchema = z.object({
  paypal_email: z.string()
    .min(1, "PayPal email is required")
    .email("Please enter a valid email address"),
})

const bankTransferSchema = z.object({
  bank_account: z.string()
    .min(1, "Bank account number is required")
    .refine((val) => {
      // 8-20 digits only
      return /^\d{8,20}$/.test(val)
    }, "Bank account must be 8-20 digits"),
  bank_code: z.string()
    .min(3, "Bank code must be at least 3 characters")
    .max(10, "Bank code must not exceed 10 characters")
    .refine((val) => {
      // 3-10 alphanumeric characters
      return /^[A-Za-z0-9]{3,10}$/.test(val)
    }, "Bank code must be 3-10 alphanumeric characters"),
})

type CreditCardFormData = z.infer<typeof creditCardSchema>
type PayPalFormData = z.infer<typeof paypalSchema>
type BankTransferFormData = z.infer<typeof bankTransferSchema>

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
    showRetry: false,
    isPolling: false,
    pollAttempts: 0,
    activationAttempted: false
  })

  // Form hooks for each payment method
  const creditCardForm = useForm<CreditCardFormData>({
    resolver: zodResolver(creditCardSchema),
    defaultValues: {
      card_number: '',
      card_holder_name: '',
      card_expiry: '',
      card_cvv: '',
    },
  })

  const paypalForm = useForm<PayPalFormData>({
    resolver: zodResolver(paypalSchema),
    defaultValues: {
      paypal_email: '',
    },
  })

  const bankTransferForm = useForm<BankTransferFormData>({
    resolver: zodResolver(bankTransferSchema),
    defaultValues: {
      bank_account: '',
      bank_code: '',
    },
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

  // Safe activation function with guard to prevent multiple calls
  const safeActivateEnrollment = async (enrollmentId: string): Promise<boolean> => {
    // Check if activation was already attempted
    if (paymentState.activationAttempted) {
      console.log('Activation already attempted, skipping...')
      return false
    }

    // Mark as attempted to prevent multiple calls
    setPaymentState(prev => ({ ...prev, activationAttempted: true }))

    try {
      console.log('Attempting enrollment activation...')
      const activationResult = await enrollmentService.activateEnrollment(enrollmentId)
      console.log('Activation result:', activationResult)

      if (activationResult.success && activationResult.access_granted) {
        return true
      }
      return false
    } catch (activationError) {
      console.error('Activation error:', activationError)
      return false
    }
  }

  // Poll enrollment status for pending payments
  const pollEnrollmentStatus = async (enrollmentId: string, maxAttempts: number = 6): Promise<boolean> => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        setPaymentState(prev => ({
          ...prev,
          isPolling: true,
          pollAttempts: attempt,
          error: `Đang kiểm tra trạng thái thanh toán... (${attempt}/6)`
        }))

        // Wait before each check (except first one)
        if (attempt > 1) {
          await new Promise(resolve => setTimeout(resolve, 2000))
        }

        const enrollmentStatus = await enrollmentService.getEnrollmentStatus(enrollmentId)
        console.log(`Poll attempt ${attempt}:`, {
          payment_status: enrollmentStatus.payment_status,
          status: enrollmentStatus.status,
          access_granted: enrollmentStatus.access_granted,
          full_enrollment: enrollmentStatus
        })

        if (enrollmentStatus.payment_status === 'completed') {
          // Payment completed, check access status
          console.log('Polling found completed payment, access_granted:', enrollmentStatus.access_granted)

          if (enrollmentStatus.access_granted) {
            console.log('Access already granted during polling, success!')
            onSuccess(enrollmentStatus)
            return true
          } else {
            console.log('Payment completed but access not granted, trying activation during polling...')

            const activationSuccess = await safeActivateEnrollment(enrollmentId)

            if (activationSuccess) {
              const finalEnrollment = {
                ...enrollmentStatus,
                access_granted: true,
                status: 'active' as const
              }
              onSuccess(finalEnrollment)
              return true
            }
          }
        } else if (enrollmentStatus.payment_status === 'failed') {
          setPaymentState(prev => ({
            ...prev,
            isProcessing: false,
            isPolling: false,
            error: 'Thanh toán thất bại. Vui lòng thử lại.',
            showRetry: true
          }))
          return false
        } else if (enrollmentStatus.status === 'enrolled' || enrollmentStatus.status === 'active') {
          // Sometimes payment_status might not be updated but enrollment status shows success
          console.log('Enrollment status indicates success during polling, access_granted:', enrollmentStatus.access_granted)

          if (enrollmentStatus.access_granted) {
            console.log('Access granted via enrollment status, success!')
            onSuccess(enrollmentStatus)
            return true
          } else {
            console.log('Enrollment shows success but access not granted, trying activation...')

            const activationSuccess = await safeActivateEnrollment(enrollmentId)

            if (activationSuccess) {
              const finalEnrollment = {
                ...enrollmentStatus,
                access_granted: true,
                status: 'active' as const
              }
              onSuccess(finalEnrollment)
              return true
            }
          }
        }
      } catch (error) {
        console.error(`Poll attempt ${attempt} failed:`, error)

        if (attempt === maxAttempts) {
          setPaymentState(prev => ({
            ...prev,
            isProcessing: false,
            isPolling: false,
            error: 'Không thể kiểm tra trạng thái thanh toán. Vui lòng liên hệ hỗ trợ hoặc thử lại.',
            showRetry: true
          }))
          return false
        }
      }
    }

    // Max attempts reached without success
    setPaymentState(prev => ({
      ...prev,
      isProcessing: false,
      isPolling: false,
      error: 'Thanh toán có thể đang được xử lý. Vui lòng kiểm tra lại sau hoặc liên hệ hỗ trợ.',
      showRetry: true
    }))
    return false
  }

  const validatePaymentDetails = (): { isValid: boolean; paymentDetails?: any; error?: string } => {
    if (!paymentState.selectedMethod) {
      return { isValid: false, error: 'Vui lòng chọn phương thức thanh toán' }
    }

    try {
      switch (paymentState.selectedMethod) {
        case 'credit_card': {
          const data = creditCardForm.getValues()
          const result = creditCardSchema.safeParse(data)
          if (!result.success) {
            const firstError = result.error.errors[0]
            return { isValid: false, error: firstError.message }
          }
          // Clean up data for API (remove spaces from card number)
          const cleanedData = {
            ...result.data,
            card_number: result.data.card_number.replace(/\s/g, '')
          }
          return { isValid: true, paymentDetails: cleanedData }
        }

        case 'paypal': {
          const data = paypalForm.getValues()
          const result = paypalSchema.safeParse(data)
          if (!result.success) {
            const firstError = result.error.errors[0]
            return { isValid: false, error: firstError.message }
          }
          // Email is already normalized in the form onChange
          return { isValid: true, paymentDetails: result.data }
        }

        case 'bank_transfer': {
          const data = bankTransferForm.getValues()
          const result = bankTransferSchema.safeParse(data)
          if (!result.success) {
            const firstError = result.error.errors[0]
            return { isValid: false, error: firstError.message }
          }
          // Bank code is already uppercased in the form onChange
          return { isValid: true, paymentDetails: result.data }
        }

        default:
          return { isValid: false, error: 'Phương thức thanh toán không hợp lệ' }
      }
    } catch (error) {
      console.error('Validation error:', error)
      return { isValid: false, error: 'Có lỗi xảy ra khi kiểm tra thông tin' }
    }
  }

  const processPayment = async () => {
    if (!paymentState.selectedMethod) return

    const validation = validatePaymentDetails()
    if (!validation.isValid) {
      setPaymentState(prev => ({
        ...prev,
        error: validation.error || 'Thông tin thanh toán không hợp lệ',
        showRetry: false
      }))
      return
    }

    setPaymentState(prev => ({
      ...prev,
      isProcessing: true,
      error: null,
      activationAttempted: false  // Reset for new payment attempt
    }))

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      const updatedEnrollment = await enrollmentService.processPayment({
        enrollment_id: enrollment.id,
        payment_method: paymentState.selectedMethod,
        payment_details: validation.paymentDetails
      })

      console.log('Payment processing result:', {
        payment_status: updatedEnrollment.payment_status,
        status: updatedEnrollment.status,
        access_granted: updatedEnrollment.access_granted,
        full_response: updatedEnrollment
      })

      // Handle successful payment
      if (updatedEnrollment.payment_status === 'completed') {
        console.log('Payment completed! Access granted:', updatedEnrollment.access_granted)

        // Check if access is granted immediately
        if (updatedEnrollment.access_granted) {
          console.log('Access already granted, proceeding to success')
          onSuccess(updatedEnrollment)
          return // Exit early to prevent further processing
        } else if (updatedEnrollment.status === 'enrolled' || updatedEnrollment.status === 'activating') {
          // Payment completed but need activation
          console.log('Payment completed but access not granted, activating...')

          const activationSuccess = await safeActivateEnrollment(enrollment.id)

          if (activationSuccess) {
            // Update enrollment status with activation info
            const finalEnrollment = {
              ...updatedEnrollment,
              access_granted: true,
              status: 'active' as const
            }
            onSuccess(finalEnrollment)
            return // Exit early to prevent further processing
          } else {
            setPaymentState(prev => ({
              ...prev,
              isProcessing: false,
              error: 'Thanh toán thành công nhưng việc kích hoạt khóa học gặp vấn đề. Vui lòng liên hệ hỗ trợ.',
              showRetry: true
            }))
          }
        } else {
          // Payment completed but status unclear - try success anyway
          console.log('Payment completed with unclear status, trying success')
          const successEnrollment = {
            ...updatedEnrollment,
            access_granted: true,
            status: 'active' as const
          }
          onSuccess(successEnrollment)
          return // Exit early to prevent further processing
        }
      } else if (updatedEnrollment.payment_status === 'failed') {
        setPaymentState(prev => ({
          ...prev,
          isProcessing: false,
          error: 'Thanh toán thất bại. Vui lòng kiểm tra thông tin thẻ hoặc thử lại.',
          showRetry: true
        }))
      } else {
        // Payment status not completed/failed - could be pending
        console.log('Payment status unclear, payment_status:', updatedEnrollment.payment_status)

        // Check if we should poll or proceed
        if (updatedEnrollment.access_granted) {
          // Even if payment_status is unclear, if access is granted, proceed
          console.log('Access granted despite unclear payment status, proceeding')
          onSuccess(updatedEnrollment)
          return // Exit early to prevent further processing
        } else {
          // Payment still pending/processing - start polling
          console.log('Payment status unclear and no access, starting polling...')

          // Don't set isProcessing to false yet, keep showing loading
          setPaymentState(prev => ({
            ...prev,
            error: 'Thanh toán đang được xử lý. Đang kiểm tra trạng thái...'
          }))

          // Start polling for status updates
          const pollSuccess = await pollEnrollmentStatus(enrollment.id)

          if (!pollSuccess) {
            // Polling failed or timed out, let user retry
            console.log('Polling failed or timed out')
          }
        }
      }

    } catch (error) {
      console.error('Payment error:', error)

      // Handle API error response format according to API documentation
      let errorMessage = 'Có lỗi xảy ra khi xử lý thanh toán'

      if (error instanceof Error) {
        try {
          // Try to parse the error as JSON API response
          const apiError = JSON.parse(error.message)

          if (apiError.success === false && apiError.error === "Payment failed") {
            // Handle specific API error format
            if (apiError.details && typeof apiError.details === 'object') {
              // Extract field-specific validation errors
              const fieldErrors = Object.entries(apiError.details)
                .map(([field, errors]) => {
                  const errorArray = Array.isArray(errors) ? errors : [errors]
                  return `${field}: ${errorArray.join(', ')}`
                })
                .join('; ')

              errorMessage = fieldErrors || apiError.message || 'Thanh toán thất bại. Vui lòng kiểm tra thông tin và thử lại.'
            } else {
              // General payment failure message
              errorMessage = apiError.message || 'Thanh toán thất bại. Vui lòng kiểm tra thông tin và thử lại.'
            }
          } else {
            // Other API errors
            errorMessage = apiError.message || error.message
          }
        } catch {
          // If not JSON or parsing fails, use the original error message
          errorMessage = error.message
        }
      }

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
      showRetry: false,
      isPolling: false,
      pollAttempts: 0,
      activationAttempted: false  // Reset activation flag for retry
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

      {/* Payment Details Form */}
      {paymentState.selectedMethod && (
        <Card>
          <CardHeader>
            <CardTitle>Thông tin thanh toán</CardTitle>
          </CardHeader>
          <CardContent>
            {paymentState.selectedMethod === 'credit_card' && (
              <Form {...creditCardForm}>
                <div className="space-y-4">
                  <FormField
                    control={creditCardForm.control}
                    name="card_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số thẻ</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="4111 1111 1111 1111"
                            {...field}
                            onChange={(e) => {
                              // Format card number with spaces every 4 digits
                              let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '')
                              value = value.replace(/(\d{4})(?=\d)/g, '$1 ')
                              field.onChange(value)
                            }}
                            maxLength={23} // 19 digits + 4 spaces
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          13-19 digits. Visa, Mastercard, Amex accepted
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={creditCardForm.control}
                    name="card_holder_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên chủ thẻ</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nguyen Van A"
                            {...field}
                            onChange={(e) => {
                              // Filter invalid characters for cardholder name
                              const value = e.target.value.replace(/[^a-zA-Z\s\-'.]/g, '')
                              field.onChange(value)
                            }}
                            maxLength={255}
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          As it appears on your card
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={creditCardForm.control}
                      name="card_expiry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ngày hết hạn</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="12/25"
                              {...field}
                              onChange={(e) => {
                                // Format as MM/YY
                                let value = e.target.value.replace(/\D/g, '')
                                if (value.length >= 2) {
                                  value = value.substring(0, 2) + '/' + value.substring(2, 4)
                                }
                                field.onChange(value)
                              }}
                              maxLength={5}
                            />
                          </FormControl>
                          <p className="text-xs text-muted-foreground">MM/YY</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={creditCardForm.control}
                      name="card_cvv"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVV</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="123"
                              type="password"
                              {...field}
                              onChange={(e) => {
                                // Only allow digits for CVV
                                const value = e.target.value.replace(/\D/g, '')
                                field.onChange(value)
                              }}
                              maxLength={4}
                            />
                          </FormControl>
                          <p className="text-xs text-muted-foreground">3-4 digits on back of card</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </Form>
            )}

            {paymentState.selectedMethod === 'paypal' && (
              <Form {...paypalForm}>
                <div className="space-y-4">
                  <FormField
                    control={paypalForm.control}
                    name="paypal_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email PayPal</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your-email@paypal.com"
                            {...field}
                            onChange={(e) => {
                              // Auto-normalize email (trim and lowercase)
                              const value = e.target.value.trim().toLowerCase()
                              field.onChange(value)
                            }}
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          Email address associated with your PayPal account
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Form>
            )}

            {paymentState.selectedMethod === 'bank_transfer' && (
              <Form {...bankTransferForm}>
                <div className="space-y-4">
                  <FormField
                    control={bankTransferForm.control}
                    name="bank_account"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số tài khoản ngân hàng</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="1234567890123456"
                            {...field}
                            onChange={(e) => {
                              // Only allow digits for bank account
                              const value = e.target.value.replace(/\D/g, '')
                              field.onChange(value)
                            }}
                            maxLength={20}
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          8-20 digits. Check your bank statement or card
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={bankTransferForm.control}
                    name="bank_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mã ngân hàng</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="VCB"
                            {...field}
                            onChange={(e) => {
                              // Auto-uppercase and filter alphanumeric only
                              const value = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
                              field.onChange(value)
                            }}
                            maxLength={10}
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          VCB, TCB, BIDV, VTB, MB, ACB, TPB, STB, EIB, SHB...
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Form>
            )}
          </CardContent>
        </Card>
      )}

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
            disabled={paymentState.isProcessing || paymentState.isPolling}
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
              disabled={!paymentState.selectedMethod || paymentState.isProcessing || paymentState.isPolling}
              className="sm:w-auto w-full"
              size="lg"
            >
              {paymentState.isProcessing || paymentState.isPolling ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {paymentState.isPolling ?
                    `Kiểm tra trạng thái... (${paymentState.pollAttempts}/6)` :
                    'Đang xử lý...'
                  }
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

