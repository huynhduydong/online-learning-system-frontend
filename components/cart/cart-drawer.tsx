'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, X, Tag, Trash2 } from 'lucide-react'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useCart, useCartActions } from '@/hooks/use-cart'
import { formatCurrency } from '@/lib/utils'

interface CartDrawerProps {
  children?: React.ReactNode
}

export function CartDrawer({ children }: CartDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  const router = useRouter()

  const { cart, isLoading, subtotal, total, itemsCount, appliedCoupon } = useCart()
  const { updateCartItem, removeFromCart, applyCoupon, removeCoupon } = useCartActions()
  
  const items = cart?.items || []

  // Quantity is always 1 for each course, no need for quantity change handler

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

  const itemCount = itemsCount

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button variant="outline" size="icon" className="relative">
            <ShoppingCart className="h-4 w-4" />
            {itemCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {itemCount}
              </Badge>
            )}
          </Button>
        )}
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Giỏ hàng ({itemsCount})
        </SheetTitle>
        </SheetHeader>

        <div className="flex-1 flex flex-col min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium">Giỏ hàng trống</p>
                  <p className="text-sm text-muted-foreground">Thêm khóa học để bắt đầu!</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
                      <div className="w-16 h-16 bg-muted rounded-md flex-shrink-0">
                        {item.courseImage ? (
                          <img
                            src={item.courseImage}
                            alt={item.courseName}
                            className="w-full h-full object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted rounded-md" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2 mb-1">
                          {item.courseName}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          Course ID: {item.courseId}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              Số lượng: 1
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">
                              {formatCurrency(item.coursePrice)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive hover:text-destructive"
                              onClick={() => removeFromCart(item.id)}
                              disabled={isLoading}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="space-y-4 pt-4 border-t">
                {/* Coupon Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <span className="text-sm font-medium">Mã giảm giá</span>
                  </div>
                  
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Đã áp dụng: {appliedCoupon.code}
                        </Badge>
                        <span className="text-sm text-green-700">
                          -{formatCurrency(appliedCoupon.discountAmount)}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveCoupon}
                        className="text-green-700 hover:text-green-800 hover:bg-green-100"
                      >
                        Xóa
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Nhập mã giảm giá"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1"
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
                        className="px-3"
                      >
                        {isApplyingCoupon ? 'Đang áp dụng...' : 'Áp dụng'}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Summary Section */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tạm tính</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  
                  {cart?.discountAmount && cart.discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Giảm giá</span>
                      <span>-{formatCurrency(cart.discountAmount)}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold">
                    <span>Tổng cộng</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="pt-4">
            <div className="w-full space-y-2">
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => {
                  setIsOpen(false)
                  router.push('/cart')
                }}
              >
                Xem giỏ hàng
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                size="lg"
                onClick={() => {
                  setIsOpen(false)
                  router.push('/checkout')
                }}
              >
                Thanh toán
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}