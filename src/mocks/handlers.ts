import { http, HttpResponse } from "msw"
import type { Course } from "@/stores/course-store"

// Mock data
const mockCourses: Course[] = [
  {
    id: "1",
    title: "Lập trình React từ cơ bản đến nâng cao",
    description:
      "Khóa học toàn diện về React.js, từ những khái niệm cơ bản đến các kỹ thuật nâng cao. Bạn sẽ học cách xây dựng ứng dụng web hiện đại với React, Redux, và các công cụ phát triển mới nhất.",
    instructor: {
      id: "instructor-1",
      name: "Nguyễn Văn A",
      avatar: "/instructor-avatar.jpg",
    },
    thumbnail: "/react-course.jpg",
    price: 1500000,
    duration: 1200, // 20 hours
    level: "intermediate",
    category: "Lập trình",
    rating: 4.8,
    studentsCount: 1250,
    lessons: [
      {
        id: "lesson-1",
        title: "Giới thiệu về React",
        description: "Tìm hiểu về React và các khái niệm cơ bản",
        videoUrl: "https://example.com/video1.mp4",
        duration: 45,
        order: 1,
      },
      {
        id: "lesson-2",
        title: "Components và Props",
        description: "Học cách tạo và sử dụng components",
        videoUrl: "https://example.com/video2.mp4",
        duration: 60,
        order: 2,
      },
      {
        id: "lesson-3",
        title: "State và Lifecycle",
        description: "Quản lý state và lifecycle trong React",
        videoUrl: "https://example.com/video3.mp4",
        duration: 75,
        order: 3,
      },
    ],
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
  {
    id: "2",
    title: "Thiết kế UI/UX với Figma",
    description:
      "Khóa học thiết kế giao diện người dùng chuyên nghiệp với Figma. Từ những nguyên tắc thiết kế cơ bản đến việc tạo ra các prototype tương tác hoàn chỉnh.",
    instructor: {
      id: "instructor-2",
      name: "Trần Thị B",
      avatar: "/instructor-avatar-2.jpg",
    },
    thumbnail: "/figma-course.jpg",
    price: 1200000,
    duration: 900, // 15 hours
    level: "beginner",
    category: "Thiết kế",
    rating: 4.6,
    studentsCount: 890,
    lessons: [
      {
        id: "lesson-4",
        title: "Giới thiệu Figma",
        description: "Làm quen với giao diện Figma",
        videoUrl: "https://example.com/video4.mp4",
        duration: 30,
        order: 1,
      },
      {
        id: "lesson-5",
        title: "Các công cụ cơ bản",
        description: "Sử dụng các công cụ thiết kế trong Figma",
        videoUrl: "https://example.com/video5.mp4",
        duration: 45,
        order: 2,
      },
    ],
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-18T00:00:00Z",
  },
]

export const handlers = [
  // Get all courses
  http.get("/api/courses", () => {
    return HttpResponse.json(mockCourses)
  }),
  
  // External API handlers for localhost:5000
  http.get("http://localhost:5000/api/courses", () => {
    return HttpResponse.json(mockCourses)
  }),

  // Get single course
  http.get("/api/courses/:id", ({ params }) => {
    const { id } = params
    const course = mockCourses.find((c) => c.id === id)

    if (!course) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json(course)
  }),

  // Enroll in course
  http.post("/api/courses/:id/enroll", ({ params }) => {
    const { id } = params
    const course = mockCourses.find((c) => c.id === id)

    if (!course) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json({ success: true, courseId: id })
  }),

  // Get enrolled courses
  http.get("/api/courses/enrolled", () => {
    return HttpResponse.json(mockCourses.slice(0, 1)) // Return first course as enrolled
  }),

  // Auth endpoints
  http.post("/api/auth/login", async ({ request }) => {
    const { email, password } = (await request.json()) as { email: string; password: string }

    console.log('MSW Login attempt:', { email, password })

    // Mock authentication - accept any valid email/password combo
    if (email && password && email.includes('@') && password.length >= 6) {
      return HttpResponse.json({
        success: true,
        message: "Login successful",
        access_token: "mock-access-token-123",
        refresh_token: "mock-refresh-token-456", 
        expires_in: 3600,
        remember_me: false,
        user: {
          id: 1,
          email: email,
          first_name: "Test",
          last_name: "User",
          full_name: "Test User",
          role: "student",
          is_active: true,
          is_verified: true,
          profile_image: "/user-avatar.jpg",
          created_at: "2024-01-01T00:00:00Z",
          confirmed_at: "2024-01-01T00:00:00Z",
          last_login_at: new Date().toISOString(),
          last_activity_at: new Date().toISOString(),
        }
      })
    }

    console.log('MSW Login failed - invalid credentials')
    return HttpResponse.json({
      success: false,
      error: "Invalid credentials",
      message: "Email or password is incorrect"
    }, { status: 401 })
  }),

  // External auth endpoint  
  http.post("http://localhost:5000/api/auth/login", async ({ request }) => {
    console.log('🔐 MSW intercepted POST http://localhost:5000/api/auth/login')
    
    let requestBody
    try {
      requestBody = await request.json()
      console.log('📋 Request body:', requestBody)
    } catch (error) {
      console.error('❌ Failed to parse request body:', error)
      return HttpResponse.json({
        success: false,
        error: "Invalid request body",
        message: "Request body must be valid JSON"
      }, { status: 400 })
    }

    const { email, password } = requestBody as { email: string; password: string }
    console.log('🔍 Extracted credentials:', { email: email || 'MISSING', password: password ? `${password.length} chars` : 'MISSING' })

    // Mock authentication - accept any valid email/password combo
    if (email && password && email.includes('@') && password.length >= 6) {
      console.log('✅ MSW External Login SUCCESS!')
      const response = {
        success: true,
        message: "Login successful", 
        access_token: "mock-access-token-123",
        refresh_token: "mock-refresh-token-456",
        expires_in: 3600,
        remember_me: false,
        user: {
          id: 1,
          email: email,
          first_name: "Test",
          last_name: "User", 
          full_name: "Test User",
          role: "student",
          is_active: true,
          is_verified: true,
          profile_image: "/user-avatar.jpg",
          created_at: "2024-01-01T00:00:00Z",
          confirmed_at: "2024-01-01T00:00:00Z",
          last_login_at: new Date().toISOString(),
          last_activity_at: new Date().toISOString(),
        }
      }
      console.log('📤 MSW Response:', response)
      return HttpResponse.json(response)
    }

    console.log('❌ MSW External Login failed - invalid credentials')
    console.log('💡 Requirements: email with @ and password ≥6 chars')
    return HttpResponse.json({
      success: false,
      error: "Invalid credentials", 
      message: "Email or password is incorrect"
    }, { status: 401 })
  }),

  http.post("/api/auth/logout", () => {
    return HttpResponse.json({ success: true })
  }),

  // Dashboard endpoints
  http.get("/api/users/dashboard", () => {
    return HttpResponse.json({
      success: true,
      message: "Dashboard data retrieved successfully",
      data: {
        user: {
          id: "user-1",
          name: "Test User",
          email: "test@example.com",
          avatar: "/user-avatar.jpg",
          role: "student",
          joinedAt: "2024-01-01T00:00:00Z",
          lastLoginAt: "2024-01-20T10:00:00Z",
        },
        stats: {
          totalCourses: 5,
          completedCourses: 3,
          inProgressCourses: 2,
          totalStudyTime: 120, // hours
          achievements: 2,
          currentStreak: 7, // days
          weeklyProgress: 85, // percentage
          monthlyProgress: 75, // percentage
        },
        recentCourses: [
          {
            id: "1",
            title: "Lập trình React từ cơ bản đến nâng cao",
            progress: 75,
            lastAccessed: "2024-01-20T00:00:00Z",
            instructor: "Nguyễn Văn A",
            instructorAvatar: "/instructor-avatar.jpg",
            thumbnail: "/react-course.jpg",
            category: "Lập trình",
            duration: 1200,
            nextLessonId: "lesson-3",
            nextLessonTitle: "State và Lifecycle",
          },
          {
            id: "2",
            title: "JavaScript ES6+ và Modern Development",
            progress: 45,
            lastAccessed: "2024-01-19T00:00:00Z",
            instructor: "Trần Thị B",
            instructorAvatar: "/instructor-avatar-2.jpg",
            thumbnail: "/js-course.jpg",
            category: "Lập trình",
            duration: 900,
            nextLessonId: "lesson-5",
            nextLessonTitle: "Arrow Functions",
          },
        ],
        achievements: [
          {
            id: "achievement-1",
            title: "First Course Completed",
            description: "Completed your first course",
            icon: "🎉",
            earnedAt: "2024-01-15T00:00:00Z",
            category: "milestone",
            points: 100,
            rarity: "common",
          },
          {
            id: "achievement-2", 
            title: "Week Streak",
            description: "Maintained a 7-day learning streak",
            icon: "🔥",
            earnedAt: "2024-01-20T00:00:00Z",
            category: "streak",
            points: 150,
            rarity: "rare",
          },
        ],
        upcomingDeadlines: [
          {
            id: "deadline-1",
            title: "React Final Quiz",
            type: "quiz",
            dueDate: "2024-01-25T23:59:00Z",
            courseTitle: "Lập trình React từ cơ bản đến nâng cao",
          },
        ],
        notifications: [
          {
            id: "notif-1",
            title: "New lesson available",
            message: "Check out the new React Hooks lesson!",
            type: "info",
            createdAt: "2024-01-20T08:00:00Z",
            read: false,
          },
        ],
      },
    })
  }),

  // External dashboard endpoint with /api prefix  
  http.get("http://localhost:5000/api/users/dashboard", () => {
    return HttpResponse.json({
      success: true,
      message: "Dashboard data retrieved successfully",
      data: {
        user: {
          id: "user-1",
          name: "Test User",
          email: "test@example.com",
          avatar: "/user-avatar.jpg",
          role: "student",
          joinedAt: "2024-01-01T00:00:00Z",
          lastLoginAt: "2024-01-20T10:00:00Z",
        },
        stats: {
          totalCourses: 5,
          completedCourses: 3,
          inProgressCourses: 2,
          totalStudyTime: 120, // hours
          achievements: 2,
          currentStreak: 7, // days
          weeklyProgress: 85, // percentage
          monthlyProgress: 75, // percentage
        },
        recentCourses: [
          {
            id: "1",
            title: "Lập trình React từ cơ bản đến nâng cao",
            progress: 75,
            lastAccessed: "2024-01-20T00:00:00Z",
            instructor: "Nguyễn Văn A",
            instructorAvatar: "/instructor-avatar.jpg",
            thumbnail: "/react-course.jpg",
            category: "Lập trình",
            duration: 1200,
            nextLessonId: "lesson-3",
            nextLessonTitle: "State và Lifecycle",
          },
          {
            id: "2",
            title: "JavaScript ES6+ và Modern Development",
            progress: 45,
            lastAccessed: "2024-01-19T00:00:00Z",
            instructor: "Trần Thị B",
            instructorAvatar: "/instructor-avatar-2.jpg",
            thumbnail: "/js-course.jpg",
            category: "Lập trình",
            duration: 900,
            nextLessonId: "lesson-5",
            nextLessonTitle: "Arrow Functions",
          },
        ],
        achievements: [
          {
            id: "achievement-1",
            title: "First Course Completed",
            description: "Completed your first course",
            icon: "🎉",
            earnedAt: "2024-01-15T00:00:00Z",
            category: "milestone",
            points: 100,
            rarity: "common",
          },
          {
            id: "achievement-2", 
            title: "Week Streak",
            description: "Maintained a 7-day learning streak",
            icon: "🔥",
            earnedAt: "2024-01-20T00:00:00Z",
            category: "streak",
            points: 150,
            rarity: "rare",
          },
        ],
        upcomingDeadlines: [
          {
            id: "deadline-1",
            title: "React Final Quiz",
            type: "quiz",
            dueDate: "2024-01-25T23:59:00Z",
            courseTitle: "Lập trình React từ cơ bản đến nâng cao",
          },
        ],
        notifications: [
          {
            id: "notif-1",
            title: "New lesson available",
            message: "Check out the new React Hooks lesson!",
            type: "info",
            createdAt: "2024-01-20T08:00:00Z",
            read: false,
          },
        ],
      },
    })
  }),

  // Demo endpoint
  http.get("/api/demo", () => {
    return HttpResponse.json({
      message: "MSW is working!",
      timestamp: new Date().toISOString(),
    })
  }),

  // Debug endpoint to test MSW with exact URL that dashboard calls
  http.get("http://localhost:5000/api/demo", () => {
    console.log('🚀 MSW Demo endpoint hit!')
    return HttpResponse.json({
      message: "MSW localhost:5000 is intercepting!",
      timestamp: new Date().toISOString(),
    })
  }),

  // Test endpoint for debugging login issues
  http.post("http://localhost:5000/api/test-login", async ({ request }) => {
    console.log('🧪 MSW Test Login endpoint hit!')
    const body = await request.json()
    console.log('🧪 Test body:', body)
    return HttpResponse.json({
      success: true,
      message: "Test endpoint working",
      receivedData: body
    })
  }),
]
