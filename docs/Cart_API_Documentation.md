# Cart API Documentation

## Overview
Cart API cung cấp các endpoints để quản lý giỏ hàng trong hệ thống Online Learning System. API được thiết kế để tối ưu với client-side caching và minimize API calls.

## Base URL
```
/api/cart
```

## 🎯 Recommended Frontend Strategy

### Client-Side First Approach
**Khuyến nghị**: Sử dụng localStorage/sessionStorage làm primary storage, API làm backup/sync.

```javascript
// Recommended cart management strategy
const CartManager = {
  // Primary storage: localStorage
  getLocalCart: () => JSON.parse(localStorage.getItem('cart') || '{"items": [], "total": 0}'),
  
  // Save to localStorage immediately
  saveLocalCart: (cart) => localStorage.setItem('cart', JSON.stringify(cart)),
  
  // Sync with server periodically or on important events
  syncWithServer: async () => {
    // Only call API when necessary
  }
};
```

### When to Call APIs
1. **Page Load**: Sync local cart với server cart
2. **Login/Logout**: Merge guest cart hoặc clear cart
3. **Checkout**: Validate cart trước khi payment
4. **Periodic Sync**: Mỗi 5-10 phút hoặc khi user inactive
5. **Cross-device**: Khi detect user login từ device khác

## Authentication
- **Optional**: Hầu hết các endpoints hỗ trợ cả authenticated users và guest users
- **Session Management**: Guest users sử dụng session ID để duy trì cart state
- **User Merge**: Khi guest user đăng nhập, cart sẽ được merge tự động

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

## Cart Data Structure

### Cart Object
```json
{
  "cart_id": 123,
  "items": [
    {
      "id": 456,
      "course_id": 789,
      "course_title": "React Advanced Course",
      "course_instructor": "John Doe",
      "price": 99.99,
      "original_price": 149.99,
      "added_at": "2025-01-21T10:30:00"
    }
  ],
  "item_count": 1,
  "total_amount": 99.99,
  "discount_amount": 0.00,
  "final_amount": 99.99,
  "coupon_code": null,
  "status": "active",
  "created_at": "2025-01-21T10:00:00",
  "updated_at": "2025-01-21T10:30:00",
  "expires_at": "2025-01-28T10:00:00"
}
```

## 🔥 Recommended Minimal API Set

### Core Philosophy: "Client-First, Server-Sync"
Thay vì gọi API cho mỗi action, chúng ta chỉ cần **3 API chính**:

1. **`GET /api/cart/`** - Load initial cart (page load, login)
2. **`POST /api/cart/sync`** - Batch sync all changes 
3. **`POST /api/cart/validate`** - Validate before checkout

### Why This Approach?
- ✅ **Instant UI**: Mọi thao tác update UI ngay lập tức
- ✅ **Better UX**: Không bị lag khi add/remove items
- ✅ **Reduced Load**: Giảm 80% API calls
- ✅ **Offline Support**: Hoạt động khi mất mạng tạm thời
- ✅ **Batch Efficiency**: Sync nhiều operations cùng lúc

---

## 📡 Minimal API Endpoints

### 1. Load Cart (Initial Sync)
**Endpoint:** `GET /api/cart/`
**Usage:** Page load, login, manual refresh
**Frequency:** 1-2 times per session
Lấy thông tin giỏ hàng hiện tại.

**Endpoint:** `GET /api/cart/`

**Authentication:** Optional

**Parameters:** None

**Response:**
```json
{
  "success": true,
  "message": "Cart retrieved successfully",
  "data": {
    // Cart object (see structure above)
  }
}
```

**Example:**
```javascript
// JavaScript fetch example
fetch('/api/cart/', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-jwt-token' // Optional for authenticated users
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

---

### 2. Batch Sync Cart (Recommended)
**Endpoint:** `POST /api/cart/sync`
**Usage:** Background sync, batch operations
**Frequency:** Every 1-5 minutes or on important events

**Request Body:**
```json
{
  "operations": [
    {
      "type": "add",
      "course_id": 789,
      "timestamp": "2025-01-21T10:30:00"
    },
    {
      "type": "remove", 
      "item_id": 456,
      "timestamp": "2025-01-21T10:31:00"
    },
    {
      "type": "apply_coupon",
      "coupon_code": "SAVE20",
      "timestamp": "2025-01-21T10:32:00"
    }
  ],
  "client_cart_state": {
    // Current client cart for conflict resolution
    "items": [...],
    "total_amount": 99.99,
    "last_modified": "2025-01-21T10:32:00"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cart synced successfully",
  "data": {
    "conflicts": [], // Any conflicts found
    "server_cart": {
      // Authoritative server cart state
    },
    "sync_timestamp": "2025-01-21T10:33:00"
  }
}
```

---

### 3. Validate Cart (Pre-Checkout)
**Endpoint:** `POST /api/cart/validate`
**Usage:** Before checkout, price verification
**Frequency:** Once before payment

**Request Body:**
```json
{
  "cart_items": [
    {
      "course_id": 789,
      "expected_price": 99.99
    }
  ],
  "coupon_code": "SAVE20"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cart validated successfully",
  "data": {
    "is_valid": true,
    "price_changes": [], // Any price changes since last sync
    "coupon_valid": true,
    "final_amount": 79.99,
    "validation_token": "abc123" // Use for checkout
  }
}
```

---

## 🗂️ Complete API Reference (Legacy Support)

*Note: Các endpoints dưới đây vẫn available để support legacy clients hoặc specific use cases*

### 2. Add Item to Cart (Legacy)
Thêm course vào giỏ hàng.

**Endpoint:** `POST /api/cart/items`

**Authentication:** Optional

**Request Body:**
```json
{
  "course_id": 789
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item added to cart successfully",
  "data": {
    // Updated cart object
  }
}
```

**Error Cases:**
- `400`: course_id is required
- `400`: Invalid course_id
- `409`: Course already in cart
- `404`: Course not found

**Example:**
```javascript
fetch('/api/cart/items', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-jwt-token' // Optional
  },
  body: JSON.stringify({
    course_id: 789
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

---

### 3. Remove Item from Cart
Xóa item khỏi giỏ hàng.

**Endpoint:** `DELETE /api/cart/items/{item_id}`

**Authentication:** Optional

**Path Parameters:**
- `item_id` (integer): ID của cart item cần xóa

**Response:**
```json
{
  "success": true,
  "message": "Item removed from cart successfully",
  "data": {
    // Updated cart object
  }
}
```

**Error Cases:**
- `400`: Invalid item ID
- `404`: Item not found

**Example:**
```javascript
fetch('/api/cart/items/456', {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-jwt-token' // Optional
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

---

### 4. Apply Coupon
Áp dụng mã giảm giá cho giỏ hàng.

**Endpoint:** `POST /api/cart/apply-coupon`

**Authentication:** Optional

**Request Body:**
```json
{
  "coupon_code": "SAVE20"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Coupon applied successfully",
  "data": {
    // Updated cart object with discount applied
    "cart_id": 123,
    "items": [...],
    "total_amount": 99.99,
    "discount_amount": 19.99,
    "final_amount": 80.00,
    "coupon_code": "SAVE20",
    // ... other cart fields
  }
}
```

**Error Cases:**
- `400`: coupon_code is required
- `400`: coupon_code cannot be empty
- `404`: Coupon not found
- `400`: Coupon expired or invalid

**Example:**
```javascript
fetch('/api/cart/apply-coupon', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-jwt-token' // Optional
  },
  body: JSON.stringify({
    coupon_code: "SAVE20"
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

---

### 5. Remove Coupon
Xóa mã giảm giá khỏi giỏ hàng.

**Endpoint:** `DELETE /api/cart/coupon`

**Authentication:** Optional

**Parameters:** None

**Response:**
```json
{
  "success": true,
  "message": "Coupon removed successfully",
  "data": {
    // Updated cart object without coupon
    "discount_amount": 0.00,
    "coupon_code": null,
    // ... other cart fields
  }
}
```

**Example:**
```javascript
fetch('/api/cart/coupon', {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-jwt-token' // Optional
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

---

### 6. Clear Cart
Xóa tất cả items khỏi giỏ hàng.

**Endpoint:** `DELETE /api/cart/clear`

**Authentication:** Optional

**Parameters:** None

**Response:**
```json
{
  "success": true,
  "message": "Cart cleared successfully"
}
```

**Example:**
```javascript
fetch('/api/cart/clear', {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-jwt-token' // Optional
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

---

### 7. Merge Guest Cart
Merge guest cart khi user đăng nhập.

**Endpoint:** `POST /api/cart/merge`

**Authentication:** Required

**Parameters:** None

**Response:**
```json
{
  "success": true,
  "message": "Guest cart merged successfully",
  "data": {
    // Merged cart object
  }
}
```

**Error Cases:**
- `401`: Authentication required
- `400`: Session ID required

**Example:**
```javascript
fetch('/api/cart/merge', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-jwt-token' // Required
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

---

### 8. Get Available Coupons
Lấy danh sách mã giảm giá có sẵn.

**Endpoint:** `GET /api/cart/coupons`

**Authentication:** Not required

**Query Parameters:**
- `limit` (optional, integer): Số lượng coupons tối đa (default: 10, max: 50)

**Response:**
```json
{
  "success": true,
  "message": "Available coupons retrieved successfully",
  "data": {
    "coupons": [
      {
        "id": 1,
        "code": "SAVE20",
        "description": "Save 20% on all courses",
        "discount_type": "percentage",
        "discount_value": 20.0,
        "min_order_amount": 50.0,
        "max_discount_amount": 100.0,
        "expires_at": "2025-12-31T23:59:59",
        "is_active": true
      }
    ]
  }
}
```

**Example:**
```javascript
fetch('/api/cart/coupons?limit=5', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

---

### 9. Health Check
Kiểm tra trạng thái service.

**Endpoint:** `GET /api/cart/health`

**Authentication:** Not required

**Response:**
```json
{
  "success": true,
  "message": "Cart service is healthy",
  "data": {
    "status": "healthy",
    "service": "cart"
  }
}
```

## 🚀 Optimized Frontend Implementation

### 1. Minimal API Strategy
```javascript
// RECOMMENDED: Minimize API calls with smart caching
class OptimizedCartManager {
  constructor() {
    this.localCart = this.getLocalCart();
    this.lastSync = localStorage.getItem('cart_last_sync');
    this.syncInterval = 5 * 60 * 1000; // 5 minutes
  }

  // Primary method: Add to local cart first
  async addToCart(courseId) {
    // 1. Add to localStorage immediately (instant UI update)
    this.localCart.items.push({
      course_id: courseId,
      added_at: new Date().toISOString(),
      temp_id: Date.now() // Temporary ID for optimistic updates
    });
    this.saveLocalCart();

    // 2. Sync with server in background (no blocking)
    this.queueSync('add', { course_id: courseId });
    
    return { success: true, cart: this.localCart };
  }

  // Queue operations for batch sync
  queueSync(operation, data) {
    const queue = JSON.parse(localStorage.getItem('cart_sync_queue') || '[]');
    queue.push({ operation, data, timestamp: Date.now() });
    localStorage.setItem('cart_sync_queue', JSON.stringify(queue));
    
    // Debounced sync
    clearTimeout(this.syncTimeout);
    this.syncTimeout = setTimeout(() => this.processSyncQueue(), 1000);
  }

  // Process queued operations
  async processSyncQueue() {
    const queue = JSON.parse(localStorage.getItem('cart_sync_queue') || '[]');
    if (queue.length === 0) return;

    try {
      // Batch sync multiple operations
      await this.batchSyncWithServer(queue);
      localStorage.removeItem('cart_sync_queue');
    } catch (error) {
      console.error('Sync failed, will retry later:', error);
      // Keep queue for retry
    }
  }
}
```

### 2. Smart Sync Strategy
```javascript
// Only sync when necessary
const shouldSync = () => {
  const lastSync = localStorage.getItem('cart_last_sync');
  const now = Date.now();
  
  return !lastSync || 
         (now - parseInt(lastSync)) > 5 * 60 * 1000 || // 5 minutes
         hasUnsyncedChanges();
};

// Sync on important events only
window.addEventListener('beforeunload', () => {
  // Quick sync before page unload
  if (hasUnsyncedChanges()) {
    navigator.sendBeacon('/api/cart/sync', JSON.stringify(getLocalCart()));
  }
});
```

### 3. Session Management
```javascript
// Tự động lưu session ID cho guest users
const sessionId = localStorage.getItem('session_id') || generateSessionId();
localStorage.setItem('session_id', sessionId);

// Include session ID in requests (handled automatically by backend)
```

### 2. Cart State Management (React Example)
```javascript
import { useState, useEffect } from 'react';

const useCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cart/');
      const data = await response.json();
      if (data.success) {
        setCart(data.data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (courseId) => {
    try {
      const response = await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course_id: courseId })
      });
      const data = await response.json();
      if (data.success) {
        setCart(data.data);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setCart(data.data);
        return { success: true };
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const applyCoupon = async (couponCode) => {
    try {
      const response = await fetch('/api/cart/apply-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coupon_code: couponCode })
      });
      const data = await response.json();
      if (data.success) {
        setCart(data.data);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return {
    cart,
    loading,
    addToCart,
    removeFromCart,
    applyCoupon,
    refreshCart: fetchCart
  };
};
```

### 3. Login Integration
```javascript
// Sau khi user đăng nhập thành công
const handleLoginSuccess = async (token) => {
  localStorage.setItem('auth_token', token);
  
  // Merge guest cart
  try {
    await fetch('/api/cart/merge', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    // Refresh cart after merge
    fetchCart();
  } catch (error) {
    console.error('Error merging cart:', error);
  }
};
```

## Error Handling

### Common Error Codes
- `400`: Bad Request - Invalid input data
- `401`: Unauthorized - Authentication required
- `404`: Not Found - Resource not found
- `409`: Conflict - Duplicate item in cart
- `500`: Internal Server Error

### Error Handling Example
```javascript
const handleApiCall = async (apiCall) => {
  try {
    const response = await apiCall();
    const data = await response.json();
    
    if (!data.success) {
      // Handle business logic errors
      showErrorMessage(data.message);
      return null;
    }
    
    return data.data;
  } catch (error) {
    // Handle network errors
    showErrorMessage('Network error. Please try again.');
    return null;
  }
};
```

## 📊 Performance Comparison

### Traditional Approach vs Optimized Approach

| Action | Traditional API Calls | Optimized Approach | Improvement |
|--------|----------------------|-------------------|-------------|
| Add 5 items | 5 API calls | 1 sync call | 80% reduction |
| Remove 2 items | 2 API calls | Included in sync | 100% reduction |
| Apply coupon | 1 API call | Included in sync | 100% reduction |
| **Total** | **8 API calls** | **1 API call** | **87.5% reduction** |

### User Experience Impact
- **Traditional**: 8 network requests = 8 potential loading states
- **Optimized**: Instant UI updates + 1 background sync = Smooth UX

---

## 🎯 Implementation Recommendations

### For E-commerce/Learning Platforms
1. **Use Optimized Approach** cho main cart operations
2. **Keep Legacy APIs** cho admin tools hoặc special cases
3. **Implement Conflict Resolution** cho multi-device scenarios
4. **Add Offline Support** với service workers

### API Priority
1. **High Priority**: `GET /cart`, `POST /cart/sync`, `POST /cart/validate`
2. **Medium Priority**: `POST /cart/merge` (login scenarios)
3. **Low Priority**: Individual CRUD operations (legacy support)

---

## 🔧 Technical Notes

1. **Session Persistence**: Guest carts được lưu trong 7 ngày
2. **Cart Expiration**: Carts tự động expire sau 7 ngày không hoạt động
3. **Conflict Resolution**: Server cart luôn là source of truth
4. **Optimistic Updates**: Client updates UI immediately, sync in background
5. **Batch Operations**: Multiple operations được process trong 1 transaction
6. **Price Consistency**: Prices được validate trước checkout
7. **Offline Support**: Operations được queue khi offline, sync khi online

## Testing

Sử dụng Postman collection hoặc curl commands để test APIs:

```bash
# Get cart
curl -X GET "http://localhost:5000/api/cart/" \
  -H "Content-Type: application/json"

# Add item
curl -X POST "http://localhost:5000/api/cart/items" \
  -H "Content-Type: application/json" \
  -d '{"course_id": 1}'

# Apply coupon
curl -X POST "http://localhost:5000/api/cart/apply-coupon" \
  -H "Content-Type: application/json" \
  -d '{"coupon_code": "SAVE20"}'
```