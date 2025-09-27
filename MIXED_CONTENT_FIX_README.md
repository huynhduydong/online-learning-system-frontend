# Mixed Content Error Fix

## Problem Fixed
Fixed Mixed Content error where HTTPS frontend was trying to call HTTP API endpoints:
```
Mixed Content: The page at 'https://online-learning-system-frontend.vercel.app/' was loaded over HTTPS, but requested an insecure resource 'http://103.188.82.252:5000/api/courses/categories'. This request has been blocked.
```

## Solution Implemented
Created a server-side proxy system that handles HTTPS→HTTP API calls through Next.js server:

### 1. Updated API Configuration (`lib/config.ts`)
- Added `useProxy` flag that detects production environment with external API
- Modified `getApiUrl()` to route through `/api/proxy/` in production
- Preserves existing development workflow

### 2. Created Proxy API Route (`app/api/proxy/[...path]/route.ts`)
- Handles all HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Preserves headers, query parameters, and request bodies
- Provides proper CORS headers
- Includes error handling and logging

### 3. Updated Next.js Config (`next.config.mjs`)
- Simplified rewrites configuration
- Proxy now handled through dedicated API route

## Deployment Instructions

### Vercel Environment Variables
Set the following environment variable in your Vercel dashboard:

```
NEXT_PUBLIC_API_BASE_URL=http://103.188.82.252:5000/api
```

**Steps:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add new variable:
   - **Name:** `NEXT_PUBLIC_API_BASE_URL`
   - **Value:** `http://103.188.82.252:5000/api`
   - **Environment:** Production
3. Redeploy your application

### How It Works
- **Development:** Direct API calls to configured endpoint
- **Production:** Routes through `/api/proxy/[...path]` which makes server-side HTTP requests
- **Browser:** Only sees HTTPS requests, preventing Mixed Content errors

### Flow Example
1. Frontend makes request to: `/api/proxy/courses/categories`
2. Proxy route receives request on Next.js server
3. Server makes HTTP request to: `http://103.188.82.252:5000/api/courses/categories`
4. Response is returned through HTTPS to frontend

### Affected Components
- `CourseCategoriesDropdown`
- `CourseCategoriesNav` 
- All course-related API calls
- Any component using `coursesService.getCategories()`

## Testing
After deployment with correct environment variable:
1. Open browser dev tools → Network tab
2. Navigate to courses page
3. Verify API requests go to `/api/proxy/courses/categories`
4. Confirm no Mixed Content errors in console
