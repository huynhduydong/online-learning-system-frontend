'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Trash2, Tag, ShoppingCart, CreditCard } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useCart, useCartActions, useCartSummary } from '@/hooks/use-cart'

export default function CartPage() {
  const { cart, isLoading } = useCart()
  const { updateCartItem, removeFromCart, applyCoupon, removeCoupon } = useCartActions()
  const summary = useCartSummary()
  
  const [couponCode, setCouponCode] = useState('')
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)

  const items = cart?.items || []

  // Quantity is always 1 for each course, no need for quantity change handler

  const handleRemoveItem = async (itemId: string) => {
    await removeFromCart(itemId)
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    
    setIsApplyingCoupon(true)
    try {
      await applyCoupon(couponCode.trim())
      setCouponCode('')
    } catch (error) {
      console.error('Failed to apply coupon:', error)
    } finally {
      setIsApplyingCoupon(false)
    }
  }

  const handleRemoveCoupon = async () => {
    await removeCoupon()
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/courses">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Tiếp tục mua sắm
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Giỏ hàng</h1>
          <p className="text-muted-foreground">
            {items.length} {items.length === 1 ? 'khóa học' : 'khóa học'} trong giỏ hàng
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        /* Empty Cart State */
        <div className="text-center py-16">
          <ShoppingCart className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
          <h2 className="text-2xl font-semibold mb-2">Giỏ hàng trống</h2>
          <p className="text-muted-foreground mb-6">
            Bạn chưa thêm khóa học nào vào giỏ hàng.
          </p>
          <Link href="/courses">
            <Button size="lg">Xem khóa học</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Course Image */}
                    <div className="relative w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={item.courseImage || '/placeholder-course.jpg'}
                        alt={item.courseName}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Course Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg line-clamp-2">
                            {item.courseName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Course ID: {item.courseId}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Course Meta */}
                      <div className="flex items-center gap-4 mb-3">
                        <Badge variant="secondary">
                          Course
                        </Badge>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            Số lượng: 1
                          </span>
                        </div>

                        <div className="text-right">
                          <div className="text-lg font-semibold">
                            ${(item.coursePrice || 0).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Coupon Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Mã giảm giá
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nhập mã giảm giá"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleApplyCoupon()
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim() || isApplyingCoupon}
                  >
                    {isApplyingCoupon ? 'Đang áp dụng...' : 'Áp dụng'}
                  </Button>
                </div>

                {/* Applied Coupons */}
                {summary.appliedCoupon && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Mã đã áp dụng:</p>
                    <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-md">
                      <div>
                        <span className="text-sm font-medium text-green-800">
                          {summary.appliedCoupon.code}
                        </span>
                        <span className="text-xs text-green-600 ml-2">
                          -{summary.appliedCoupon.discount_type === 'percentage' 
                            ? `${summary.appliedCoupon.discount_value}%` 
                            : `$${summary.appliedCoupon.discount_value}`}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveCoupon()}
                        className="text-green-700 hover:text-green-900 h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tạm tính ({summary.itemsCount} khóa học):</span>
                    <span>${(summary.subtotal || 0).toFixed(2)}</span>
                  </div>
                  
                  {(summary.discount || 0) > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Giảm giá</span>
                      <span>-${(summary.discount || 0).toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span>Thuế</span>
                    <span>$0.00</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Tổng cộng</span>
                    <span>${(summary.total || 0).toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <Button className="w-full" size="lg">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Thanh toán
                  </Button>
                  
                  <Link href="/courses" className="block">
                    <Button variant="outline" className="w-full">
                      Tiếp tục mua sắm
                    </Button>
                  </Link>
                </div>

                {/* Security Badge */}
                <div className="text-center pt-4">
                  <p className="text-xs text-muted-foreground">
                    🔒 Thanh toán bảo mật với mã hóa SSL 256-bit
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}