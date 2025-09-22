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
    originalPrice: 2000000,
    duration: 1200, // 20 hours
    level: "intermediate",
    category: "Lập trình",
    rating: 4.8,
    reviewCount: 245,
    studentsCount: 1250,
    tags: ["React", "JavaScript", "Frontend"],
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
    reviewCount: 189,
    studentsCount: 890,
    tags: ["Figma", "UI/UX", "Design"],
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
  {
    id: "3",
    title: "Node.js và Express.js Backend Development",
    description: "Học cách xây dựng API RESTful và ứng dụng backend mạnh mẽ với Node.js và Express.js. Khóa học bao gồm cả MongoDB và authentication.",
    instructor: {
      id: "instructor-3",
      name: "Lê Văn C",
      avatar: "/instructor-avatar-3.jpg",
    },
    thumbnail: "/nodejs-course.jpg",
    price: 1800000,
    originalPrice: 2500000,
    duration: 1500,
    level: "intermediate",
    category: "Lập trình",
    rating: 4.7,
    reviewCount: 156,
    studentsCount: 678,
    tags: ["Node.js", "Express", "Backend", "API"],
    lessons: [],
    createdAt: "2024-01-12T00:00:00Z",
    updatedAt: "2024-01-22T00:00:00Z",
  },
  {
    id: "4",
    title: "Digital Marketing từ A-Z",
    description: "Khóa học marketing số toàn diện, từ SEO, SEM, Social Media Marketing đến Email Marketing và Analytics.",
    instructor: {
      id: "instructor-4",
      name: "Phạm Thị D",
      avatar: "/instructor-avatar-4.jpg",
    },
    thumbnail: "/marketing-course.jpg",
    price: 0, // Free course
    duration: 600,
    level: "beginner",
    category: "Marketing",
    rating: 4.3,
    reviewCount: 89,
    studentsCount: 1456,
    tags: ["SEO", "SEM", "Social Media"],
    lessons: [],
    createdAt: "2024-01-08T00:00:00Z",
    updatedAt: "2024-01-25T00:00:00Z",
  },
  {
    id: "5",
    title: "Python cho Data Science",
    description: "Học Python từ cơ bản và ứng dụng vào Data Science với Pandas, NumPy, Matplotlib và Scikit-learn.",
    instructor: {
      id: "instructor-5",
      name: "Hoàng Văn E",
      avatar: "/instructor-avatar-5.jpg",
    },
    thumbnail: "/python-course.jpg",
    price: 2200000,
    duration: 1800,
    level: "advanced",
    category: "Lập trình",
    rating: 4.9,
    reviewCount: 312,
    studentsCount: 543,
    tags: ["Python", "Data Science", "Machine Learning"],
    lessons: [],
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-01-28T00:00:00Z",
  },
  {
    id: "6",
    title: "Photoshop CC 2024 - Chỉnh sửa ảnh chuyên nghiệp",
    description: "Khóa học Photoshop từ cơ bản đến nâng cao, học cách chỉnh sửa ảnh, thiết kế poster, banner chuyên nghiệp.",
    instructor: {
      id: "instructor-6",
      name: "Ngô Thị F",
      avatar: "/instructor-avatar-6.jpg",
    },
    thumbnail: "/photoshop-course.jpg",
    price: 950000,
    duration: 720,
    level: "beginner",
    category: "Thiết kế",
    rating: 4.4,
    reviewCount: 167,
    studentsCount: 789,
    tags: ["Photoshop", "Photo Editing", "Design"],
    lessons: [],
    createdAt: "2024-01-05T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "7",
    title: "Quản lý dự án với Agile và Scrum",
    description: "Học các phương pháp quản lý dự án hiện đại với Agile, Scrum, và các công cụ như Jira, Trello.",
    instructor: {
      id: "instructor-7",
      name: "Vũ Văn G",
      avatar: "/instructor-avatar-7.jpg",
    },
    thumbnail: "/agile-course.jpg",
    price: 1350000,
    duration: 480,
    level: "intermediate",
    category: "Kinh doanh",
    rating: 4.5,
    reviewCount: 98,
    studentsCount: 432,
    tags: ["Agile", "Scrum", "Project Management"],
    lessons: [],
    createdAt: "2024-01-18T00:00:00Z",
    updatedAt: "2024-01-30T00:00:00Z",
  },
  {
    id: "8",
    title: "Tiếng Anh giao tiếp cơ bản",
    description: "Khóa học tiếng Anh giao tiếp hàng ngày, phù hợp cho người mới bắt đầu học tiếng Anh.",
    instructor: {
      id: "instructor-8",
      name: "Sarah Johnson",
      avatar: "/instructor-avatar-8.jpg",
    },
    thumbnail: "/english-course.jpg",
    price: 800000,
    duration: 1080,
    level: "beginner",
    category: "Ngôn ngữ",
    rating: 4.2,
    reviewCount: 234,
    studentsCount: 1123,
    tags: ["English", "Communication", "Speaking"],
    lessons: [],
    createdAt: "2024-01-03T00:00:00Z",
    updatedAt: "2024-01-12T00:00:00Z",
  },
  {
    id: "9",
    title: "Flutter - Phát triển ứng dụng di động",
    description: "Học cách phát triển ứng dụng di động đa nền tảng với Flutter và Dart, từ cơ bản đến nâng cao.",
    instructor: {
      id: "instructor-9",
      name: "Đặng Văn H",
      avatar: "/instructor-avatar-9.jpg",
    },
    thumbnail: "/flutter-course.jpg",
    price: 1750000,
    originalPrice: 2300000,
    duration: 1350,
    level: "intermediate",
    category: "Lập trình",
    rating: 4.6,
    reviewCount: 145,
    studentsCount: 567,
    tags: ["Flutter", "Dart", "Mobile Development"],
    lessons: [],
    createdAt: "2024-01-25T00:00:00Z",
    updatedAt: "2024-02-02T00:00:00Z",
  },
  {
    id: "10",
    title: "Khởi nghiệp và phát triển startup",
    description: "Hướng dẫn từ A-Z về cách khởi nghiệp, xây dựng business plan, tìm kiếm đầu tư và phát triển startup.",
    instructor: {
      id: "instructor-10",
      name: "Trương Văn I",
      avatar: "/instructor-avatar-10.jpg",
    },
    thumbnail: "/startup-course.jpg",
    price: 2500000,
    duration: 900,
    level: "advanced",
    category: "Kinh doanh",
    rating: 4.8,
    reviewCount: 76,
    studentsCount: 234,
    tags: ["Startup", "Business", "Entrepreneurship"],
    lessons: [],
    createdAt: "2024-01-30T00:00:00Z",
    updatedAt: "2024-02-05T00:00:00Z",
  },
  {
    id: "11",
    title: "Adobe Illustrator - Vector Design",
    description: "Học thiết kế vector chuyên nghiệp với Adobe Illustrator, tạo logo, icon, illustration.",
    instructor: {
      id: "instructor-11",
      name: "Lý Thị K",
      avatar: "/instructor-avatar-11.jpg",
    },
    thumbnail: "/illustrator-course.jpg",
    price: 1100000,
    duration: 840,
    level: "intermediate",
    category: "Thiết kế",
    rating: 4.7,
    reviewCount: 123,
    studentsCount: 456,
    tags: ["Illustrator", "Vector", "Logo Design"],
    lessons: [],
    createdAt: "2024-01-14T00:00:00Z",
    updatedAt: "2024-01-24T00:00:00Z",
  },
  {
    id: "12",
    title: "Google Ads và Facebook Ads Mastery",
    description: "Khóa học chuyên sâu về quảng cáo Google Ads và Facebook Ads, tối ưu hóa chiến dịch và ROI.",
    instructor: {
      id: "instructor-12",
      name: "Phan Văn L",
      avatar: "/instructor-avatar-12.jpg",
    },
    thumbnail: "/ads-course.jpg",
    price: 1650000,
    duration: 720,
    level: "advanced",
    category: "Marketing",
    rating: 4.5,
    reviewCount: 187,
    studentsCount: 678,
    tags: ["Google Ads", "Facebook Ads", "PPC"],
    lessons: [],
    createdAt: "2024-01-22T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "13",
    title: "Tiếng Nhật N5 - Sơ cấp",
    description: "Khóa học tiếng Nhật cấp độ N5, học từ vựng, ngữ pháp và kanji cơ bản.",
    instructor: {
      id: "instructor-13",
      name: "Tanaka Hiroshi",
      avatar: "/instructor-avatar-13.jpg",
    },
    thumbnail: "/japanese-course.jpg",
    price: 0, // Free course
    duration: 960,
    level: "beginner",
    category: "Ngôn ngữ",
    rating: 4.3,
    reviewCount: 156,
    studentsCount: 892,
    tags: ["Japanese", "N5", "JLPT"],
    lessons: [],
    createdAt: "2024-01-07T00:00:00Z",
    updatedAt: "2024-01-17T00:00:00Z",
  },
  {
    id: "14",
    title: "DevOps với Docker và Kubernetes",
    description: "Học cách triển khai và quản lý ứng dụng với Docker, Kubernetes, CI/CD pipeline.",
    instructor: {
      id: "instructor-14",
      name: "Nguyễn Văn M",
      avatar: "/instructor-avatar-14.jpg",
    },
    thumbnail: "/devops-course.jpg",
    price: 2800000,
    duration: 1620,
    level: "advanced",
    category: "Lập trình",
    rating: 4.9,
    reviewCount: 89,
    studentsCount: 345,
    tags: ["DevOps", "Docker", "Kubernetes"],
    lessons: [],
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-08T00:00:00Z",
  },
  {
    id: "15",
    title: "Kế toán doanh nghiệp cơ bản",
    description: "Khóa học kế toán doanh nghiệp từ cơ bản, phù hợp cho người mới bắt đầu làm kế toán.",
    instructor: {
      id: "instructor-15",
      name: "Võ Thị N",
      avatar: "/instructor-avatar-15.jpg",
    },
    thumbnail: "/accounting-course.jpg",
    price: 1200000,
    duration: 600,
    level: "beginner",
    category: "Kinh doanh",
    rating: 4.1,
    reviewCount: 67,
    studentsCount: 234,
    tags: ["Accounting", "Finance", "Business"],
    lessons: [],
    createdAt: "2024-01-11T00:00:00Z",
    updatedAt: "2024-01-21T00:00:00Z",
  },
  {
    id: "16",
    title: "WordPress Development từ A-Z",
    description: "Học cách phát triển website với WordPress, từ theme development đến plugin development.",
    instructor: {
      id: "instructor-16",
      name: "Bùi Văn O",
      avatar: "/instructor-avatar-16.jpg",
    },
    thumbnail: "/wordpress-course.jpg",
    price: 1450000,
    duration: 1080,
    level: "intermediate",
    category: "Lập trình",
    rating: 4.4,
    reviewCount: 134,
    studentsCount: 567,
    tags: ["WordPress", "PHP", "Web Development"],
    lessons: [],
    createdAt: "2024-01-16T00:00:00Z",
    updatedAt: "2024-01-26T00:00:00Z",
  }
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

  // Instructor course management endpoints - DISABLED for real API integration
  // These endpoints now use real backend APIs instead of MSW mocking
  
  // NOTE: MSW handlers for /api/instructor/* are disabled
  // Real API calls will go to http://localhost:5000/api/instructor/*

  // Auth endpoints
  http.post("/api/auth/login", async ({ request }) => {
    const { email, password } = (await request.json()) as { email: string; password: string }

    console.log('MSW Login attempt:', { email, password })

    // Mock authentication - accept any valid email/password combo
    if (email && password && email.includes('@') && password.length >= 6) {
      // Determine role based on email for development
      const role = email.includes('instructor') || email.includes('teacher') ? 'instructor' : 'student'
      const userId = role === 'instructor' ? 117 : 1
      
      return HttpResponse.json({
        success: true,
        message: "Login successful",
        access_token: "mock-access-token-123",
        refresh_token: "mock-refresh-token-456",
        expires_in: 3600,
        remember_me: false,
        user: {
          id: userId,
          email: email,
          first_name: role === 'instructor' ? 'Instructor' : 'Test',
          last_name: role === 'instructor' ? 'Demo' : 'User',
          full_name: role === 'instructor' ? 'Instructor Demo' : 'Test User',
          role: role,
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
      
      // Determine role based on email for development
      const role = email.includes('instructor') || email.includes('teacher') ? 'instructor' : 'student'
      const userId = role === 'instructor' ? 117 : 1
      
      const response = {
        success: true,
        message: "Login successful",
        access_token: "mock-access-token-123",
        refresh_token: "mock-refresh-token-456",
        expires_in: 3600,
        remember_me: false,
        user: {
          id: userId,
          email: email,
          first_name: role === 'instructor' ? 'Instructor' : 'Test',
          last_name: role === 'instructor' ? 'Demo' : 'User',
          full_name: role === 'instructor' ? 'Instructor Demo' : 'Test User',
          role: role,
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

  // Course Enrollment Endpoints
  http.post("/api/enrollments/register", async ({ request }) => {
    const body = await request.json() as { course_id: string; full_name: string; email: string; discount_code?: string }
    console.log('MSW Course Registration:', body)

    // Mock enrollment creation
    const enrollmentId = `uuid-${Date.now()}`
    const courseId = body.course_id

    // Simulate course lookup to determine if it's free
    const course = mockCourses.find(c => c.id.toString() === courseId)
    const isFree = course?.price?.current_price === 0 || course?.price?.is_free

    const enrollment = {
      id: enrollmentId,
      course_id: courseId,
      user_id: 123,  // number as per backend implementation
      status: isFree ? 'enrolled' : 'payment_pending',
      payment_status: isFree ? 'completed' : 'pending',
      enrollment_date: new Date().toISOString(),
      activation_date: isFree ? new Date().toISOString() : null,
      payment_amount: course?.price?.current_price || 0,
      discount_applied: body.discount_code ? 50000 : 0, // 50k VND discount if code provided
      access_granted: isFree,
      full_name: body.full_name,
      email: body.email,
      activation_attempts: 0,
      max_retries: 3
    }

    return HttpResponse.json({
      success: true,
      message: "Registration started successfully",
      data: {
        enrollment,
        payment_required: !isFree,
        payment_url: isFree ? undefined : `/payment/process/${enrollmentId}`,
        access_immediate: isFree
      }
    })
  }),

  http.post("/api/enrollments/payment", async ({ request }) => {
    const body = await request.json() as { enrollment_id: string; payment_method: string; payment_details?: any }
    console.log('MSW Payment Processing:', body)

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 80% success rate for demo
    const paymentSuccess = Math.random() > 0.2

    const updatedEnrollment = {
      id: body.enrollment_id,
      course_id: '1',
      user_id: 123,
      status: paymentSuccess ? 'enrolled' : 'payment_failed',
      payment_status: paymentSuccess ? 'completed' : 'failed',
      enrollment_date: new Date().toISOString(),
      activation_date: paymentSuccess ? new Date().toISOString() : null,
      payment_amount: 299000,
      discount_applied: 0,
      access_granted: paymentSuccess,
      full_name: "Test User",
      email: "test@example.com",
      transaction_id: `txn_${Date.now()}`,
      payment_method: body.payment_method
    }

    return HttpResponse.json({
      success: true,
      message: paymentSuccess ? "Payment processed successfully" : "Payment failed",
      data: updatedEnrollment
    })
  }),

  http.post("/api/enrollments/:enrollmentId/activate", async ({ params }) => {
    const { enrollmentId } = params
    console.log('MSW Course Activation:', enrollmentId)

    // Simulate activation delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 90% success rate for activation
    const activationSuccess = Math.random() > 0.1

    return HttpResponse.json({
      success: true,
      message: activationSuccess ? "Course access activated" : "Activation in progress",
      data: {
        success: activationSuccess,
        access_granted: activationSuccess,
        first_lesson_url: activationSuccess ? '/courses/react-basics/lessons/1' : null,
        retry_available: !activationSuccess,
        activation_time: activationSuccess ? new Date().toISOString() : undefined,
        estimated_completion: !activationSuccess ? new Date(Date.now() + 5 * 60 * 1000).toISOString() : undefined
      }
    })
  }),

  http.get("/api/enrollments/:enrollmentId", async ({ params }) => {
    const { enrollmentId } = params
    console.log('MSW Get Enrollment Status:', enrollmentId)

    return HttpResponse.json({
      success: true,
      message: "Enrollment status retrieved",
      data: {
        id: enrollmentId,
        course_id: '1',
        user_id: 123,
        status: 'active',
        payment_status: 'completed',
        enrollment_date: new Date().toISOString(),
        activation_date: new Date().toISOString(),
        payment_amount: 299000,
        discount_applied: 0,
        access_granted: true,
        full_name: "Test User",
        email: "test@example.com",
        course_title: "React Fundamentals",
        course_slug: "react-fundamentals"
      }
    })
  }),

  http.get("/api/enrollments/check-access/:courseId", async ({ params }) => {
    const { courseId } = params
    console.log('MSW Check Course Access:', courseId)

    // For demo, assume user doesn't have access to most courses
    const hasAccess = Math.random() > 0.8

    return HttpResponse.json({
      success: true,
      message: hasAccess ? "Course access checked" : "No access to course",
      data: {
        hasAccess,
        enrollmentStatus: hasAccess ? {
          id: 'demo-enrollment',
          course_id: courseId,
          user_id: 123,
          status: 'active',
          payment_status: 'completed',
          enrollment_date: new Date().toISOString(),
          activation_date: new Date().toISOString(),
          payment_amount: 0,
          discount_applied: 0,
          access_granted: true,
          full_name: "Test User",
          email: "test@example.com"
        } : null,
        nextLessonUrl: hasAccess ? `/courses/${courseId}/lessons/1` : undefined,
        canDownloadCertificate: hasAccess ? false : undefined,
        reasonCode: !hasAccess ? "NOT_ENROLLED" : undefined,
        message: !hasAccess ? "You need to enroll in this course to access the content" : undefined
      }
    })
  }),

  http.get("/api/enrollments/my-courses", async ({ request }) => {
    console.log('MSW Get User Enrollments')

    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')

    return HttpResponse.json({
      success: true,
      message: "User enrollments retrieved",
      data: [
        {
          id: 'enrollment-1',
          course_id: '1',
          user_id: 123,
          status: 'active',
          payment_status: 'completed',
          enrollment_date: '2024-01-01T00:00:00Z',
          activation_date: '2024-01-01T00:00:00Z',
          payment_amount: 299000,
          discount_applied: 0,
          access_granted: true,
          full_name: "Test User",
          email: "test@example.com",
          course: {
            id: '1',
            title: 'React Fundamentals',
            slug: 'react-fundamentals',
            thumbnail_url: '/react-course.jpg',
            difficulty_level: 'beginner',
            instructor: {
              id: 'instructor-1',
              name: 'Nguyễn Văn A',
              avatar: '/instructor-avatar.jpg'
            }
          },
          progress: {
            completed_lessons: 5,
            total_lessons: 20,
            percentage: 25,
            last_accessed: new Date().toISOString(),
            total_time_spent: 1800
          }
        }
      ],
      pagination: {
        current_page: page,
        total_pages: 1,
        total_items: 1,
        per_page: limit
      }
    })
  }),

  http.post("/api/enrollments/:enrollmentId/retry-activation", async ({ params }) => {
    const { enrollmentId } = params
    console.log('MSW Retry Activation:', enrollmentId)

    // Higher success rate on retry
    const retrySuccess = Math.random() > 0.05

    return HttpResponse.json({
      success: true,
      message: retrySuccess ? "Retry activation completed" : "Retry activation failed",
      data: {
        success: retrySuccess,
        access_granted: retrySuccess,
        first_lesson_url: retrySuccess ? '/courses/react-basics/lessons/1' : null,
        retry_available: !retrySuccess,
        activation_time: retrySuccess ? new Date().toISOString() : undefined,
        max_retries_reached: !retrySuccess ? false : undefined,
        next_retry_available_at: !retrySuccess ? new Date(Date.now() + 15 * 60 * 1000).toISOString() : undefined
      }
    })
  }),
]
