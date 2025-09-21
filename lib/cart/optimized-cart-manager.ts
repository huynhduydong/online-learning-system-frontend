/**
 * OptimizedCartManager - Client-First Cart Management
 * 
 * Implements the recommended cart strategy from Cart API Documentation:
 * - localStorage as primary storage
 * - Instant UI updates
 * - Batch sync with server using new sync endpoint
 * - Minimal API calls (87.5% reduction)
 */

import { cartApi } from '../api/cart'
import type { Cart, CartItem, AddToCartRequest, UpdateCartItemRequest, ApplyCouponRequest } from '../api/types'

interface QueuedOperation {
  type: 'add' | 'update' | 'remove' | 'applyCoupon' | 'removeCoupon' | 'clear'
  data?: any
  itemId?: number
  timestamp: number
}

export class OptimizedCartManager {
  private cart: Cart | null = null
  private syncQueue: QueuedOperation[] = []
  private isSyncing = false
  private syncTimeout: NodeJS.Timeout | null = null
  private onCartUpdate?: (cart: Cart | null) => void
  private onSyncStatusChange?: (isSyncing: boolean) => void

  /**
   * Initialize cart manager
   */
  async initialize() {
    try {
      await this.loadInitialCart()
    } catch (error) {
      console.error('Cart manager initialization failed:', error)
      // Initialize with empty cart to prevent crashes
      this.cart = this.getEmptyCart()
      this.onCartUpdate?.(this.cart)
      // Don't throw error to prevent app crash
    }
  }

  /**
   * Set cart update callback
   */
  setCartUpdateCallback(callback: ((cart: Cart | null) => void) | null) {
    this.onCartUpdate = callback || undefined
  }

  /**
   * Set sync status callback
   */
  setSyncStatusCallback(callback: ((isSyncing: boolean) => void) | null) {
    this.onSyncStatusChange = callback || undefined
  }

  /**
   * Sync with server
   */
  async syncWithServer() {
    await this.processSyncQueue()
  }

  /**
   * Load cart from localStorage and sync with server
   */
  private async loadInitialCart() {
    // Load from localStorage first
    const localCart = this.getLocalCart()
    if (localCart) {
      this.cart = localCart
      this.onCartUpdate?.(localCart)
    } else {
      // Initialize with empty cart if no local cart exists
      this.cart = this.getEmptyCart()
      this.onCartUpdate?.(this.cart)
    }

    // Then sync with server (non-blocking)
    try {
      const serverCart = await cartApi.getCart()
      this.updateLocalCart(serverCart)
    } catch (error) {
      console.error('Failed to load cart from server:', error)
      // If we have no local cart and server fails, ensure we have empty cart
      if (!localCart) {
        this.cart = this.getEmptyCart()
        this.onCartUpdate?.(this.cart)
      }
      // Don't throw error - let app continue with local cart or empty cart
    }
  }

  /**
   * Add item to cart - instant UI update + background sync
   */
  async addToCart(courseId: number): Promise<void> {
    // 1. Update local cart immediately for instant UI
    const currentCart = this.getCart()
    
    // Check if item already exists
    const existingItem = currentCart.items.find(item => item.course.id === courseId)
    if (existingItem) {
      throw new Error('Course already in cart')
    }

    // Create optimistic item (will be replaced by server response)
    const optimisticItem: CartItem = {
      id: `temp_${Date.now()}`, // Temporary ID
      course: {
        id: courseId,
        title: `Course ${courseId}`, // Will be updated by server
        instructor: 'Loading...',
        price: {
          current_price: 0,
          original_price: 0,
          discount_percentage: 0
        },
        thumbnail: '',
        slug: '',
        description: '',
        duration: 0,
        level: 'beginner',
        category: '',
        rating: 0,
        students_count: 0,
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      quantity: 1,
      added_at: new Date().toISOString()
    }

    const updatedCart: Cart = {
      ...currentCart,
      items: [...currentCart.items, optimisticItem],
      summary: {
        ...currentCart.summary,
        items_count: currentCart.summary.items_count + 1
      }
    }

    this.updateLocalCart(updatedCart)

    // 2. Queue sync operation
    this.queueOperation({
      type: 'add',
      data: { course_id: courseId },
      timestamp: Date.now()
    })
  }

  /**
   * Update cart item quantity - DEPRECATED
   * Each course can only have quantity = 1, use removeFromCart instead
   */
  async updateCartItem(itemId: string, quantity: number): Promise<void> {
    console.warn('updateCartItem is deprecated. Each course can only have quantity = 1. Use removeFromCart instead.')
    
    // If quantity is 0 or less, remove the item
    if (quantity <= 0) {
      await this.removeFromCart(itemId)
      return
    }
    
    // For any quantity > 1, warn and keep quantity = 1
    if (quantity > 1) {
      console.warn('Quantity cannot be greater than 1 for courses. Keeping quantity = 1.')
    }
    
    // Do nothing - quantity remains 1
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(itemId: string): Promise<void> {
    const currentCart = this.getCart()
    const removedItem = currentCart.items.find(item => item.id === itemId)
    const updatedItems = currentCart.items.filter(item => item.id !== itemId)

    const updatedCart: Cart = {
      ...currentCart,
      items: updatedItems,
      summary: {
        ...currentCart.summary,
        items_count: currentCart.summary.items_count - (removedItem?.quantity || 0)
      }
    }

    this.updateLocalCart(updatedCart)

    this.queueOperation({
      type: 'remove',
      data: { item_id: itemId },
      timestamp: Date.now()
    })
  }

  /**
   * Apply coupon
   */
  async applyCoupon(couponCode: string): Promise<boolean> {
    const currentCart = this.getCart()
    
    // Optimistic update
    const updatedCart: Cart = {
      ...currentCart,
      applied_coupon: {
        id: 0,
        code: couponCode,
        type: 'percentage',
        value: 10, // Temporary value
        is_active: true,
        discount_amount: 0
      }
    }

    this.updateLocalCart(updatedCart)

    this.queueOperation({
      type: 'applyCoupon',
      data: { coupon_code: couponCode },
      timestamp: Date.now()
    })

    return true
  }

  /**
   * Remove coupon
   */
  async removeCoupon(): Promise<void> {
    const currentCart = this.getCart()
    
    const updatedCart: Cart = {
      ...currentCart,
      applied_coupon: null
    }

    this.updateLocalCart(updatedCart)

    this.queueOperation({
      type: 'removeCoupon',
      timestamp: Date.now()
    })
  }

  /**
   * Clear cart
   */
  async clearCart(): Promise<void> {
    const emptyCart = this.getEmptyCart()
    this.updateLocalCart(emptyCart)

    this.queueOperation({
      type: 'clear',
      timestamp: Date.now()
    })
  }

  /**
   * Clear local cart data
   */
  clearLocalCart(): void {
    this.cart = null
    localStorage.removeItem('cart')
    this.onCartUpdate?.(null)
  }

  /**
   * Check if cart is stale
   */
  isCartStale(): boolean {
    if (!this.cart) return true
    const lastUpdate = new Date(this.cart.updated_at)
    const now = new Date()
    const diffInMinutes = (now.getTime() - lastUpdate.getTime()) / (1000 * 60)
    return diffInMinutes > 30 // Consider stale after 30 minutes
  }

  /**
   * Get current cart
   */
  getCart(): Cart {
    if (!this.cart) {
      return this.getEmptyCart()
    }
    return this.cart
  }

  /**
   * Force sync with server
   */
  async forceSync(): Promise<void> {
    await this.processSyncQueue()
  }

  /**
   * Check if cart needs validation (using new validate endpoint)
   */
  async validateCart(): Promise<Cart> {
    const currentCart = this.getCart()
    return await cartApi.validateCart(currentCart)
  }

  /**
   * Get available coupons (using new endpoint)
   */
  async getAvailableCoupons() {
    return await cartApi.getAvailableCoupons()
  }

  /**
   * Get cart health status (using new endpoint)
   */
  async getCartHealth() {
    return await cartApi.getCartHealth()
  }

  /**
   * Merge guest cart with user cart (using new endpoint)
   */
  async mergeGuestCart(guestCart: Cart): Promise<Cart> {
    const mergedCart = await cartApi.mergeCart(guestCart)
    this.updateLocalCart(mergedCart)
    return mergedCart
  }

  // Private methods

  private queueOperation(operation: QueuedOperation) {
    this.syncQueue.push(operation)
    this.scheduleBatchSync()
  }

  private scheduleBatchSync() {
    if (this.syncTimeout) {
      clearTimeout(this.syncTimeout)
    }

    // Batch sync after 2 seconds of inactivity
    this.syncTimeout = setTimeout(() => {
      this.processSyncQueue()
    }, 2000)
  }

  /**
   * Process sync queue - batch sync with server using new sync endpoint
   */
  private async processSyncQueue(): Promise<void> {
    if (this.syncQueue.length === 0 || this.isSyncing) return

    this.isSyncing = true
    this.onSyncStatusChange?.(true)

    try {
      // Use new sync endpoint for efficient batch sync
      const currentCart = this.getCart()
      const syncedCart = await cartApi.syncCart(currentCart)
      
      // Update local cart with synced data
      this.updateLocalCart(syncedCart)
      
      // Clear queue after successful sync
      this.syncQueue = []
      
    } catch (error) {
      console.error('Sync failed:', error)
      
      // Fallback: process operations individually if sync endpoint fails
      try {
        for (const operation of this.syncQueue) {
          try {
            switch (operation.type) {
              case 'add':
                await cartApi.addToCart(operation.data as AddToCartRequest)
                break
              case 'update':
                await cartApi.updateCartItem(operation.data.item_id, operation.data as UpdateCartItemRequest)
                break
              case 'remove':
                await cartApi.removeFromCart(operation.data.item_id)
                break
              case 'applyCoupon':
                await cartApi.applyCoupon(operation.data as ApplyCouponRequest)
                break
              case 'removeCoupon':
                await cartApi.removeCoupon()
                break
              case 'clear':
                await cartApi.clearCart()
                break
            }
          } catch (error) {
            console.error(`Failed to sync operation ${operation.type}:`, error)
          }
        }

        // Clear queue and refresh cart after fallback
        this.syncQueue = []
        const serverCart = await cartApi.getCart()
        this.updateLocalCart(serverCart)
        
      } catch (fallbackError) {
        console.error('Fallback sync also failed:', fallbackError)
      }
    } finally {
      this.isSyncing = false
      this.onSyncStatusChange?.(false)
    }
  }

  private updateLocalCart(cart: Cart) {
    this.cart = cart
    this.saveToLocalStorage(cart)
    this.onCartUpdate?.(cart)
  }

  private getLocalCart(): Cart | null {
    try {
      const stored = localStorage.getItem('cart')
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error)
      return null
    }
  }

  private saveToLocalStorage(cart: Cart) {
    try {
      localStorage.setItem('cart', JSON.stringify(cart))
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error)
    }
  }

  private getEmptyCart(): Cart {
    return {
      id: 0,
      items: [],
      summary: {
        items_count: 0,
        subtotal: 0,
        discount: 0,
        total: 0
      },
      applied_coupon: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }
}

// Export singleton instance
export const cartManager = new OptimizedCartManager()