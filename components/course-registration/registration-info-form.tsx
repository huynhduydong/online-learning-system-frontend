'use client'

/**
 * Registration Info Form Component
 * Collects mandatory registration information (full name, email) and optional discount code
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Loader2, Mail, User, Tag, Info } from 'lucide-react'
import type { Course, User as UserType } from '@/lib/api/types'
import { formatCurrency } from '@/lib/utils'

const registrationSchema = z.object({
  fullName: z.string()
    .min(2, 'Họ tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ tên không được vượt quá 100 ký tự')
    .regex(/^[\p{L}\s]+$/u, 'Họ tên chỉ được chứa chữ cái và khoảng trắng'),
  email: z.string()
    .email('Email không hợp lệ')
    .max(255, 'Email không được vượt quá 255 ký tự'),
  discountCode: z.string().optional()
})

type RegistrationFormData = z.infer<typeof registrationSchema>

export interface RegistrationInfoFormProps {
  course: Course
  user: UserType | null
  onSubmit: (data: { fullName: string; email: string; discountCode?: string }) => Promise<void>
  onBack: () => void
  isLoading: boolean
}

export function RegistrationInfoForm({
  course,
  user,
  onSubmit,
  onBack,
  isLoading
}: RegistrationInfoFormProps) {
  const [showDiscountCode, setShowDiscountCode] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: user?.full_name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim(),
      email: user?.email || '',
      discountCode: ''
    },
    mode: 'onChange'
  })

  const watchedDiscountCode = watch('discountCode')

  const isFree = course.price?.current_price === 0 ||
    course.price?.is_free

  const price = course.price?.current_price || course.price?.amount || 0

  const handleFormSubmit = async (data: RegistrationFormData) => {
    try {
      await onSubmit({
        fullName: data.fullName,
        email: data.email,
        discountCode: data.discountCode || undefined
      })
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const fillUserInfo = () => {
    if (user) {
      setValue('fullName', user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim())
      setValue('email', user.email)
    }
  }

  return (
    <div className="space-y-6">
      {/* Course Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">
                {course.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                Giảng viên: {course.instructor?.name || 'Unknown'}
              </p>
              <div className="flex items-center gap-2">
                {isFree ? (
                  <Badge className="bg-green-100 text-green-800">Miễn phí</Badge>
                ) : (
                  <div className="text-lg font-bold text-primary">
                    {formatCurrency(price)}
                  </div>
                )}
              </div>
            </div>
            <img
              src={course.thumbnail_url || '/placeholder.jpg'}
              alt={course.title || 'Course thumbnail'}
              className="w-16 h-12 object-cover rounded"
            />
          </div>
        </CardContent>
      </Card>

      {/* Registration Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Thông tin đăng ký
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Họ và tên đầy đủ
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                {...register('fullName')}
                placeholder="Nhập họ và tên đầy đủ của bạn"
                className={errors.fullName ? 'border-red-500' : ''}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email nhận chứng chỉ
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="Nhập email để nhận chứng chỉ"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Email này sẽ được sử dụng để gửi chứng chỉ và thông báo khóa học
              </p>
            </div>

            {/* Auto-fill suggestion */}
            {user && (user.email !== watch('email') || user.full_name !== watch('fullName')) && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>Sử dụng thông tin từ tài khoản của bạn?</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={fillUserInfo}
                  >
                    Tự động điền
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <Separator />

            {/* Discount Code Section */}
            <div className="space-y-3">
              {!showDiscountCode && !isFree && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDiscountCode(true)}
                  className="flex items-center gap-2"
                >
                  <Tag className="h-4 w-4" />
                  Có mã giảm giá?
                </Button>
              )}

              {(showDiscountCode || isFree) && !isFree && (
                <div className="space-y-2">
                  <Label htmlFor="discountCode" className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Mã giảm giá (tùy chọn)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="discountCode"
                      {...register('discountCode')}
                      placeholder="Nhập mã giảm giá"
                      className="flex-1"
                    />
                    {showDiscountCode && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowDiscountCode(false)
                          setValue('discountCode', '')
                        }}
                      >
                        Hủy
                      </Button>
                    )}
                  </div>
                  {watchedDiscountCode && (
                    <p className="text-xs text-muted-foreground">
                      Mã giảm giá sẽ được áp dụng ở bước thanh toán
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Submit Actions */}
            <div className="space-y-4">
              <Separator />

              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  disabled={isLoading}
                  className="sm:w-auto w-full"
                >
                  Quay lại
                </Button>

                <Button
                  type="submit"
                  disabled={!isValid || isLoading}
                  className="sm:w-auto w-full"
                  size="lg"
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  {isFree ? 'Đăng ký ngay' : 'Tiếp tục thanh toán'}
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Bằng cách tiếp tục, bạn đồng ý với{' '}
                <a href="/terms" className="text-primary underline" target="_blank">
                  Điều khoản sử dụng
                </a>{' '}
                và{' '}
                <a href="/privacy" className="text-primary underline" target="_blank">
                  Chính sách bảo mật
                </a>{' '}
                của chúng tôi.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
