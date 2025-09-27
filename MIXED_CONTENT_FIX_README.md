# Mixed Content Error Fix

## Problem Fixed
Fixed Mixed Content error where HTTPS frontend was trying to call HTTP API endpoints:
```
Mixed Content: The page at 'https://online-learning-system-frontend.vercel.app/' was loaded over HTTPS, but requested an insecure resource 'http://103.188.82.252:5000/api/courses/categories'. This request has been blocked.
```

## Solution Implemented
Created a smart catch-all proxy system using Next.js API routes:

### 1. Updated API Configuration (`lib/config.ts`)
- Simplified to always use `/api` endpoints
- Proxy logic handled automatically server-side
- Zero frontend code changes required

### 2. Created Smart Catch-all Route (`app/api/[...path]/route.ts`)
- Automatically detects if external API should be used
- Handles all HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Preserves headers, query parameters, and request bodies
- Falls back to local routes when using localhost
- Includes proper CORS headers and error handling

### 3. Updated Next.js Config (`next.config.mjs`)
- Removed complex rewrites
- Pure server-side proxy approach

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
- **With localhost API:** Uses existing local API routes in `app/api/`
- **With external API:** Catch-all route proxies to `http://103.188.82.252:5000`
- **Browser:** Always sees HTTPS `/api/` requests
- **Zero frontend changes:** API calls remain the same

### Flow Example
1. Frontend makes request to: `/api/courses/categories`
2. If external API configured: Catch-all route proxies to `http://103.188.82.252:5000/courses/categories`
3. If localhost: Uses existing `app/api/courses/categories/route.ts`
4. Response returned through HTTPS to frontend

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
