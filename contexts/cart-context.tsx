'use client'

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { localCartManager, type LocalCart } from '@/lib/cart/local-cart-manager'
import { coursesService } from '@/lib/api/courses'

// Cart state interface - Simplified for local storage
interface CartState {
  cart: LocalCart | null
  isLoading: boolean
  error: string | null
  isInitialized: boolean
}

// Cart actions - Simplified for local storage
type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CART'; payload: LocalCart | null }
  | { type: 'SET_INITIALIZED'; payload: boolean }

// Initial state - Simplified for local storage
const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
  isInitialized: false,
}

// Cart reducer - Simplified for local storage
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        cart: action.payload,
        isLoading: false,
        error: null,
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      }
    default:
      return state
  }
}

// Cart context type - Simplified for local storage
interface CartContextType {
  cart: LocalCart | null
  isLoading: boolean
  error: string | null
  addToCart: (courseId: string, quantity?: number) => Promise<void>
  updateCartItem: (itemId: string, quantity: number) => Promise<void>
  increaseItemQuantity: (itemId: string) => Promise<void>
  decreaseItemQuantity: (itemId: string) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  applyCoupon: (couponCode: string) => Promise<{ success: boolean }>
  removeCoupon: () => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
  isItemInCart: (courseId: string | number) => boolean
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Cart provider props
interface CartProviderProps {
  children: React.ReactNode
}

// Cart provider component
export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Initialize cart from local storage
  useEffect(() => {
    const initializeCart = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })
        
        // Initialize the cart manager first
        localCartManager.initialize()
        
        // Set up callback to automatically update state when cart changes
        localCartManager.setCartUpdateCallback((updatedCart) => {
          dispatch({ type: 'SET_CART', payload: updatedCart })
        })
        
        // Load cart from local storage
        const cart = localCartManager.getCart()
        dispatch({ type: 'SET_CART', payload: cart })
        
      } catch (error) {
        console.error('Failed to initialize cart:', error)
        dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize cart' })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
        dispatch({ type: 'SET_INITIALIZED', payload: true })
      }
    }

    initializeCart()

    // Cleanup callback on unmount
    return () => {
      localCartManager.setCartUpdateCallback(null)
    }
  }, [])

  // Refresh cart data from local storage
  const refreshCart = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const cart = localCartManager.getCart()
      dispatch({ type: 'SET_CART', payload: cart })
    } catch (error) {
      console.error('Failed to refresh cart:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to refresh cart' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  // Add item to cart
  const addToCart = useCallback(async (courseIdOrSlug: string, quantity: number = 1) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      // Fetch course details from API
      // Try to determine if it's an ID (numeric string) or slug
      let courseDetails
      
      if (/^\d+$/.test(courseIdOrSlug)) {
        // It's a numeric ID, convert to number and get by ID
        courseDetails = await coursesService.getCourseById(parseInt(courseIdOrSlug))
      } else {
        // It's a slug, get by slug
        courseDetails = await coursesService.getCourseBySlug(courseIdOrSlug)
      }
      
      // Add to cart with full course information
      localCartManager.addToCart(
        courseDetails.id,
        courseDetails.title,
        courseDetails.price?.current_price || courseDetails.price?.amount || 0,
        courseDetails.thumbnail_url,
        quantity
      )
      
      // No need to manually dispatch SET_CART - callback will handle it automatically
    } catch (error) {
      console.error('Failed to add to cart:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add item to cart' })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  // Update cart item quantity
  const updateCartItem = useCallback(async (itemId: string, quantity: number) => {
    try {
      localCartManager.updateItemQuantity(itemId, quantity)
      // No need to manually dispatch SET_CART - callback will handle it automatically
    } catch (error) {
      console.error('Failed to update cart item:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update cart item' })
      throw error
    }
  }, [])

  const increaseItemQuantity = useCallback(async (itemId: string) => {
    try {
      localCartManager.increaseItemQuantity(itemId)
      // No need to manually dispatch SET_CART - callback will handle it automatically
    } catch (error) {
      console.error('Error increasing item quantity:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to increase item quantity' })
      throw error
    }
  }, [])

  const decreaseItemQuantity = useCallback(async (itemId: string) => {
    try {
      localCartManager.decreaseItemQuantity(itemId)
      // No need to manually dispatch SET_CART - callback will handle it automatically
    } catch (error) {
      console.error('Error decreasing item quantity:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to decrease item quantity' })
      throw error
    }
  }, [])

  // Remove item from cart
  const removeFromCart = useCallback(async (itemId: string) => {
    try {
      localCartManager.removeFromCart(itemId)
      // No need to manually dispatch SET_CART - callback will handle it automatically
    } catch (error) {
      console.error('Failed to remove from cart:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove item from cart' })
      throw error
    }
  }, [])

  // Apply coupon
  const applyCoupon = useCallback(async (couponCode: string) => {
    try {
      // For now, apply with 0 discount - this should be calculated by API later
      localCartManager.applyCoupon(couponCode, 0)
      // No need to manually dispatch SET_CART - callback will handle it automatically
      return { success: true }
    } catch (error) {
      console.error('Failed to apply coupon:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to apply coupon' })
      throw error
    }
  }, [])

  // Remove coupon
  const removeCoupon = useCallback(async () => {
    try {
      localCartManager.removeCoupon()
      // No need to manually dispatch SET_CART - callback will handle it automatically
    } catch (error) {
      console.error('Failed to remove coupon:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove coupon' })
      throw error
    }
  }, [])

  // Clear cart
  const clearCart = useCallback(async () => {
    try {
      localCartManager.clearCart()
      // No need to manually dispatch SET_CART - callback will handle it automatically
    } catch (error) {
      console.error('Failed to clear cart:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to clear cart' })
      throw error
    }
  }, [])

  // Check if item is in cart
  const isItemInCart = useCallback((courseId: string | number) => {
    const numericCourseId = typeof courseId === 'string' ? parseInt(courseId, 10) : courseId
    return localCartManager.isInCart(numericCourseId)
  }, [])

  // Context value
  const contextValue: CartContextType = {
      cart: state.cart,
      isLoading: state.isLoading,
      error: state.error,
      addToCart,
      updateCartItem,
      increaseItemQuantity,
      decreaseItemQuantity,
      removeFromCart,
      applyCoupon,
      removeCoupon,
      clearCart,
      refreshCart,
      isItemInCart,
    }

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  )
}

// Hook to use cart context
export function useCartContext(): CartContextType {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider')
  }
  return context
}