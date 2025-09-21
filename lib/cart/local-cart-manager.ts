/**
 * LocalCartManager - Simple Local Storage Cart Management
 * 
 * Simple cart management that stores everything in localStorage
 * No API calls until checkout - much simpler and faster
 */

import type { Cart, CartItem } from '../api/types'

const CART_STORAGE_KEY = 'online_learning_cart'

export interface LocalCartItem {
  id: string
  courseId: number
  courseName: string
  coursePrice: number
  courseImage?: string
  quantity: number
  addedAt: string
}

export interface LocalCart {
  id: string
  items: LocalCartItem[]
  couponCode?: string
  discountAmount: number
  createdAt: string
  updatedAt: string
}

export class LocalCartManager {
  private cart: LocalCart | null = null
  private onCartUpdate?: (cart: LocalCart | null) => void

  /**
   * Initialize cart manager
   */
  initialize() {
    this.loadCartFromStorage()
  }

  /**
   * Set cart update callback
   */
  setCartUpdateCallback(callback: ((cart: LocalCart | null) => void) | null) {
    this.onCartUpdate = callback || undefined
  }

  /**
   * Get current cart
   */
  getCart(): LocalCart {
    if (!this.cart) {
      this.cart = this.createEmptyCart()
    }
    return this.cart
  }

  /**
   * Add course to cart
   */
  addToCart(courseId: number, courseName: string, coursePrice: number, courseImage?: string, quantity: number = 1): void {
    console.log('📦 [LOCAL CART] Starting addToCart with:', { courseId, courseName, coursePrice, courseImage, quantity })
    
    if (!this.cart) {
      console.log('📦 [LOCAL CART] No cart exists, creating empty cart')
      this.cart = this.createEmptyCart()
    }

    // Validate quantity
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0')
    }

    // Check if item already exists
    const existingItem = this.cart.items.find(item => item.courseId === courseId)
    console.log('📦 [LOCAL CART] Existing item found:', existingItem)
    
    if (existingItem) {
      // Increase quantity of existing item
      console.log('📦 [LOCAL CART] Updating existing item quantity from', existingItem.quantity, 'to', existingItem.quantity + quantity)
      existingItem.quantity += quantity
    } else {
      // Add new item with specified quantity
      const newItem: LocalCartItem = {
        id: `item_${Date.now()}_${courseId}`,
        courseId,
        courseName,
        coursePrice,
        courseImage,
        quantity,
        addedAt: new Date().toISOString()
      }
      console.log('📦 [LOCAL CART] Adding new item:', newItem)
      this.cart.items.push(newItem)
    }

    console.log('📦 [LOCAL CART] Cart items after addition:', this.cart.items)
    console.log('📦 [LOCAL CART] Cart summary before updateCart:', this.getCartSummary())
    this.updateCart()
  }

  /**
   * Update item quantity
   * @param itemId - The ID of the cart item to update
   * @param quantity - New quantity (if 0 or negative, item will be removed)
   */
  updateItemQuantity(itemId: string, quantity: number): void {
    if (!this.cart) return

    const itemIndex = this.cart.items.findIndex(item => item.id === itemId)
    
    if (itemIndex === -1) {
      console.warn(`Cart item with ID ${itemId} not found`)
      return
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      this.cart.items.splice(itemIndex, 1)
    } else {
      // Update quantity
      this.cart.items[itemIndex].quantity = quantity
    }

    this.updateCart()
  }

  /**
   * Remove item from cart
   */
  removeFromCart(itemId: string): void {
    if (!this.cart) return

    this.cart.items = this.cart.items.filter(item => item.id !== itemId)
    this.updateCart()
  }

  /**
   * Increase item quantity by 1
   * @param itemId - The ID of the cart item to increase
   */
  increaseItemQuantity(itemId: string): void {
    if (!this.cart) return

    const item = this.cart.items.find(item => item.id === itemId)
    if (item) {
      item.quantity += 1
      this.updateCart()
    }
  }

  /**
   * Decrease item quantity by 1 (removes item if quantity becomes 0)
   * @param itemId - The ID of the cart item to decrease
   */
  decreaseItemQuantity(itemId: string): void {
    if (!this.cart) return

    const item = this.cart.items.find(item => item.id === itemId)
    if (item) {
      if (item.quantity <= 1) {
        // Remove item if quantity would become 0
        this.removeFromCart(itemId)
      } else {
        item.quantity -= 1
        this.updateCart()
      }
    }
  }

  /**
   * Apply coupon code
   */
  applyCoupon(couponCode: string, discountAmount: number): void {
    if (!this.cart) return

    this.cart.couponCode = couponCode
    this.cart.discountAmount = discountAmount
    this.updateCart()
  }

  /**
   * Remove coupon
   */
  removeCoupon(): void {
    if (!this.cart) return

    this.cart.couponCode = undefined
    this.cart.discountAmount = 0
    this.updateCart()
  }

  /**
   * Clear entire cart
   */
  clearCart(): void {
    this.cart = this.createEmptyCart()
    this.updateCart()
  }

  /**
   * Check if course is in cart
   */
  isInCart(courseId: number): boolean {
    if (!this.cart) return false
    return this.cart.items.some(item => item.courseId === courseId)
  }

  /**
   * Get cart summary
   */
  getCartSummary() {
    if (!this.cart) {
      return {
        itemsCount: 0,
        subtotal: 0,
        discount: 0,
        total: 0,
        currency: 'USD'
      }
    }

    const itemsCount = this.cart.items.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = this.cart.items.reduce((sum, item) => sum + (item.coursePrice * item.quantity), 0)
    const discount = this.cart.discountAmount || 0
    const total = Math.max(0, subtotal - discount)

    return {
      itemsCount,
      subtotal,
      discount,
      total,
      currency: 'USD'
    }
  }

  /**
   * Get cart for checkout (convert to API format if needed)
   */
  getCartForCheckout(): any {
    const summary = this.getCartSummary()
    return {
      items: this.cart?.items || [],
      summary,
      couponCode: this.cart?.couponCode
    }
  }

  // Private methods

  private createEmptyCart(): LocalCart {
    return {
      id: `cart_${Date.now()}`,
      items: [],
      discountAmount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  private updateCart(): void {
    if (this.cart) {
      this.cart.updatedAt = new Date().toISOString()
      console.log('📦 [LOCAL CART] Updating cart, saving to storage...')
      this.saveCartToStorage()
      console.log('📦 [LOCAL CART] Cart saved to storage, triggering callback...')
      console.log('📦 [LOCAL CART] Callback exists:', !!this.onCartUpdate)
      console.log('📦 [LOCAL CART] Cart summary after update:', this.getCartSummary())
      this.onCartUpdate?.(this.cart)
      console.log('📦 [LOCAL CART] Callback triggered successfully')
    }
  }

  private loadCartFromStorage(): void {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        this.cart = JSON.parse(stored)
      } else {
        this.cart = this.createEmptyCart()
      }
    } catch (error) {
      console.error('Failed to load cart from storage:', error)
      this.cart = this.createEmptyCart()
    }
  }

  private saveCartToStorage(): void {
    try {
      if (this.cart) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cart))
      }
    } catch (error) {
      console.error('Failed to save cart to storage:', error)
    }
  }
}

// Export singleton instance
export const localCartManager = new LocalCartManager()