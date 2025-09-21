import { apiClient } from './client'
import type {
  Cart,
  CartItem,
  AddToCartRequest,
  AddToCartResponse,
  UpdateCartItemRequest,
  UpdateCartItemResponse,
  RemoveFromCartResponse,
  GetCartResponse,
  ApplyCouponRequest,
  ApplyCouponResponse,
  RemoveCouponResponse,
  ClearCartResponse,
  MergeCartResponse,
  CartHealthResponse,
  AvailableCouponsResponse,
} from './types'

/**
 * Cart API Service
 * Handles all cart-related API operations based on Cart API Documentation
 */
export class CartApiService {
  private readonly baseUrl = '/cart'

  /**
   * Get current user's cart
   * @returns Promise<Cart> - The user's cart with all items and summary
   */
  async getCart(): Promise<Cart> {
    try {
      const response = await apiClient.get<GetCartResponse>(`${this.baseUrl}/`)
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to fetch cart')
    } catch (error) {
      console.error('Cart API - Get cart error:', error)
      throw error
    }
  }

  /**
   * Add a course to cart
   * @param request - Course ID to add
   * @returns Promise<Cart> - Updated cart with new item
   */
  async addToCart(request: AddToCartRequest): Promise<Cart> {
    try {
      const response = await apiClient.post<AddToCartResponse>(`${this.baseUrl}/add/`, request)
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to add item to cart')
    } catch (error) {
      console.error('Cart API - Add to cart error:', error)
      throw error
    }
  }

  /**
   * Update quantity of a cart item
   * @param itemId - The ID of the cart item to update
   * @param request - New quantity
   * @returns Promise<Cart> - Updated cart
   */
  async updateCartItem(itemId: string, request: UpdateCartItemRequest): Promise<Cart> {
    try {
      const response = await apiClient.put<UpdateCartItemResponse>(
        `${this.baseUrl}/update/${itemId}/`,
        request
      )
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to update cart item')
    } catch (error) {
      console.error('Cart API - Update cart item error:', error)
      throw error
    }
  }

  /**
   * Remove an item from cart
   * @param itemId - The ID of the cart item to remove
   * @returns Promise<Cart> - Updated cart
   */
  async removeFromCart(itemId: string): Promise<Cart> {
    try {
      const response = await apiClient.delete<RemoveFromCartResponse>(
        `${this.baseUrl}/remove/${itemId}/`
      )
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to remove item from cart')
    } catch (error) {
      console.error('Cart API - Remove from cart error:', error)
      throw error
    }
  }

  /**
   * Apply a coupon to cart
   * @param request - Coupon code to apply
   * @returns Promise<Cart> - Updated cart with applied coupon
   */
  async applyCoupon(request: ApplyCouponRequest): Promise<Cart> {
    try {
      const response = await apiClient.post<ApplyCouponResponse>(
        `${this.baseUrl}/coupon/apply/`,
        request
      )
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to apply coupon')
    } catch (error) {
      console.error('Cart API - Apply coupon error:', error)
      throw error
    }
  }

  /**
   * Remove applied coupon from cart
   * @returns Promise<Cart> - Updated cart without coupon
   */
  async removeCoupon(): Promise<Cart> {
    try {
      const response = await apiClient.delete<RemoveCouponResponse>(
        `${this.baseUrl}/coupon/remove/`
      )
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to remove coupon')
    } catch (error) {
      console.error('Cart API - Remove coupon error:', error)
      throw error
    }
  }

  /**
   * Clear all items from cart
   * @returns Promise<{ cartSummary: CartSummary }>
   */
  async clearCart(): Promise<{ cartSummary: any }> {
    try {
      const response = await apiClient.delete<ClearCartResponse>(this.baseUrl)
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to clear cart')
    } catch (error) {
      console.error('Cart API - Clear cart error:', error)
      throw error
    }
  }

  /**
   * Get cart item count (lightweight endpoint for header/nav)
   * @returns Promise<number> - Number of items in cart
   */
  async getCartItemCount(): Promise<number> {
    try {
      const response = await apiClient.get<{ success: boolean, data: { count: number } }>(
        `${this.baseUrl}/count`
      )
      
      if (response.success && response.data) {
        return response.data.count
      }
      
      return 0
    } catch (error) {
      console.error('Cart API - Get cart count error:', error)
      return 0
    }
  }

  /**
   * Check if a course is in cart
   * @param courseId - The course ID to check
   * @returns Promise<boolean> - Whether the course is in cart
   */
  async isInCart(courseId: number): Promise<boolean> {
    try {
      const response = await apiClient.get<{ success: boolean, data: { in_cart: boolean } }>(
        `${this.baseUrl}/check/${courseId}`
      )
      
      if (response.success && response.data) {
        return response.data.in_cart
      }
      
      return false
    } catch (error) {
      console.error('Cart API - Check in cart error:', error)
      return false
    }
  }

  /**
   * Sync local cart with server (New endpoint from documentation)
   * @param cart - Local cart data to sync
   * @returns Promise<Cart> - Merged cart from server
   */
  async syncCart(cart: Cart): Promise<Cart> {
    try {
      const response = await apiClient.post<Cart>(`${this.baseUrl}/sync`, cart)
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to sync cart')
    } catch (error) {
      console.error('Cart API - Sync cart error:', error)
      throw error
    }
  }

  /**
   * Validate cart items and pricing (New endpoint from documentation)
   * @param cart - Cart to validate
   * @returns Promise<Cart> - Validated cart with updated pricing
   */
  async validateCart(cart: Cart): Promise<Cart> {
    try {
      const response = await apiClient.post<Cart>(`${this.baseUrl}/validate`, cart)
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to validate cart')
    } catch (error) {
      console.error('Cart API - Validate cart error:', error)
      throw error
    }
  }

  /**
   * Get cart service health status (New endpoint from documentation)
   * @returns Promise<CartHealthResponse> - Health status
   */
  async getCartHealth(): Promise<CartHealthResponse> {
    try {
      const response = await apiClient.get<CartHealthResponse>(`${this.baseUrl}/health`)
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to get cart health')
    } catch (error) {
      console.error('Cart API - Get cart health error:', error)
      throw error
    }
  }

  /**
   * Get available coupons for user (New endpoint from documentation)
   * @returns Promise<AvailableCouponsResponse> - List of available coupons
   */
  async getAvailableCoupons(): Promise<AvailableCouponsResponse> {
    try {
      const response = await apiClient.get<AvailableCouponsResponse>(`${this.baseUrl}/coupons`)
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to get available coupons')
    } catch (error) {
      console.error('Cart API - Get available coupons error:', error)
      throw error
    }
  }

  /**
   * Merge guest cart with user cart (New endpoint from documentation)
   * @param guestCart - Guest cart to merge
   * @returns Promise<Cart> - Merged cart
   */
  async mergeCart(guestCart: Cart): Promise<Cart> {
    try {
      const response = await apiClient.post<MergeCartResponse>(`${this.baseUrl}/merge`, guestCart)
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'Failed to merge cart')
    } catch (error) {
      console.error('Cart API - Merge cart error:', error)
      throw error
    }
  }
}

// Export singleton instance
export const cartApi = new CartApiService()

// Export individual methods for convenience
export const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  applyCoupon,
  removeCoupon,
  clearCart,
  getCartItemCount,
  isInCart,
  syncCart,
  validateCart,
  getCartHealth,
  getAvailableCoupons,
  mergeCart,
} = cartApi