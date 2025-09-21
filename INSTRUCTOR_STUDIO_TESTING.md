# Instructor Studio Testing Guide

## 🚀 Quick Start for Development

The Instructor Studio has been implemented with mock authentication and API endpoints for development testing.

### 1. Login as Instructor

To access the Instructor Studio, you need to login with an email that contains "instructor" or "teacher":

**Test Credentials:**
- Email: `instructor@example.com` (or any email with "instructor" in it)
- Password: `123456` (or any password 6+ characters)

**Alternative Instructor Emails:**
- `teacher@example.com`
- `john.instructor@test.com`
- `teacher123@demo.com`

### 2. Access the Studio

After logging in, you can access the Instructor Studio in two ways:

1. **Direct URL**: Navigate to `/studio`
2. **From Dashboard**: Look for "Instructor Studio" in the dashboard sidebar (development only)

### 3. Test the Workflow

1. **View My Courses** (`/studio`)
   - See existing courses with Draft/Published status
   - Click "Create New Course" or "Edit Course"

2. **Create New Course** (`/studio/create`)
   - Fill in required fields: Title, Short Description
   - Optional fields: Language, Level, Category, Price
   - Toggle "Free Course" switch
   - Observe auto-generated slug from title
   - Click "Save Draft and Continue"

3. **Edit Course** (`/studio/courses/[id]/edit`)
   - Edit existing course details
   - Save changes or publish draft courses
   - View live course link for published courses

### 4. Mock API Endpoints

The following endpoints are mocked for development:

- `GET /api/instructor/courses` - Get instructor's courses
- `POST /api/instructor/courses` - Create new course
- `PUT /api/instructor/courses/:id` - Update course
- `POST /api/instructor/courses/:id/publish` - Publish course

### 5. Development Notes

- **Role-based access** is temporarily relaxed for development
- **Real API integration** can be added by replacing mock endpoints
- **Authentication checks** will be re-enabled when real API is connected
- All course data is currently mock data stored in memory

### 6. Features Implemented

✅ **Studio Shell Framework**
- Left navigation with "My Courses" and "Create Course"
- Instructor access control guard
- Clean page title display

✅ **My Courses Page**
- Course listing with name and status
- Draft/Published visual indicators
- "Create New Course" action button
- Edit and view course actions

✅ **Create New Course Form**
- Required fields: Title, Short Description
- Optional fields: Language, Level, Category, Price
- Auto-generated slug from title
- Free course toggle switch
- "Save Draft and Continue" functionality

✅ **Status Handling**
- Clear Draft/Published states
- Persistent draft status
- Publishing workflow for draft courses

### 7. Ready for Production

When connecting to real APIs:

1. Remove mock authentication bypasses in `contexts/auth-context.tsx`
2. Replace mock endpoints in `src/mocks/handlers.ts` with real API calls
3. Update course data structures to match backend schema
4. Re-enable strict role checking in `app/studio/layout.tsx`
5. Remove development-only features (like dashboard studio link)

The instructor studio is fully functional and ready for real API integration!
