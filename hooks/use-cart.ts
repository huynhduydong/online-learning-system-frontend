'use client'

import { useMemo } from 'react'
import { useCartContext } from '@/contexts/cart-context'

export function useCart() {
  const cartContext = useCartContext()

  // Calculate cart statistics
  const calculations = useMemo(() => {
    if (!cartContext.cart?.items) {
      return {
        itemsCount: 0,
        subtotal: 0,
        total: 0,
        hasItems: false,
      }
    }

    const itemsCount = cartContext.cart.items.reduce((total, item) => total + item.quantity, 0)
    const subtotal = cartContext.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    const discount = cartContext.cart.coupon?.discount_amount || 0
    const total = Math.max(0, subtotal - discount)
    const hasItems = itemsCount > 0

    return {
      itemsCount,
      subtotal,
      total,
      hasItems,
    }
  }, [cartContext.cart?.items, cartContext.cart?.coupon])

  return {
    // Cart state
    cart: cartContext.cart,
    isLoading: cartContext.isLoading,
    error: cartContext.error,
    
    // Calculated values
    itemsCount: calculations.itemsCount,
    subtotal: calculations.subtotal,
    total: calculations.total,
    hasItems: calculations.hasItems,
    
    // Cart actions
    addToCart: cartContext.addToCart,
    updateCartItem: cartContext.updateCartItem,
    increaseItemQuantity: cartContext.increaseItemQuantity,
    decreaseItemQuantity: cartContext.decreaseItemQuantity,
    removeFromCart: cartContext.removeFromCart,
    applyCoupon: cartContext.applyCoupon,
    removeCoupon: cartContext.removeCoupon,
    clearCart: cartContext.clearCart,
    refreshCart: cartContext.refreshCart,
    isItemInCart: cartContext.isItemInCart,
  }
}

/**
 * Hook for cart actions only (useful when you only need actions)
 * @returns Cart actions without state
 */
export function useCartActions() {
  const {
    addToCart,
    updateCartItem,
    increaseItemQuantity,
    decreaseItemQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    clearCart,
    refreshCart,
  } = useCartContext()

  return {
    addToCart,
    updateCartItem,
    increaseItemQuantity,
    decreaseItemQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    clearCart,
    refreshCart,
  }
}

/**
 * Hook for cart summary information only
 * @returns Cart summary data
 */
export function useCartSummary() {
  const { cart } = useCartContext()

  return useMemo(() => {
    if (!cart) {
      return {
        itemsCount: 0,
        subtotal: 0,
        discount: 0,
        total: 0,
        currency: 'USD',
        hasItems: false,
        appliedCoupon: null,
      }
    }

    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const discount = cart.coupon?.discount_amount || 0
    const total = Math.max(0, subtotal - discount)

    return {
      itemsCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      discount,
      total,
      currency: 'USD',
      hasItems: cart.items.length > 0,
      appliedCoupon: cart.coupon?.code || null,
    }
  }, [cart])
}