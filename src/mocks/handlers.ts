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

    // Mock authentication
    if (email === "test@example.com" && password === "password") {
      return HttpResponse.json({
        id: "user-1",
        email: "test@example.com",
        name: "Test User",
        role: "student",
        avatar: "/user-avatar.jpg",
      })
    }

    return new HttpResponse(null, { status: 401 })
  }),

  http.post("/api/auth/logout", () => {
    return HttpResponse.json({ success: true })
  }),

  // Demo endpoint
  http.get("/api/demo", () => {
    return HttpResponse.json({
      message: "MSW is working!",
      timestamp: new Date().toISOString(),
    })
  }),
]
