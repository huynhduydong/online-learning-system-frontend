import { NextRequest, NextResponse } from 'next/server'
import { ApiCourseResponse, CourseDetails } from '@/lib/api/types'

// Mock detailed course data for development - replace with actual API calls
const mockCourseDetails: Record<string, CourseDetails> = {
  "lap-trinh-react-tu-co-ban-den-nang-cao": {
    id: 1,
    title: "Lập trình React từ cơ bản đến nâng cao",
    slug: "lap-trinh-react-tu-co-ban-den-nang-cao",
    description: "Khóa học React toàn diện từ cơ bản đến nâng cao với các dự án thực tế. Bạn sẽ học được từ những khái niệm cơ bản nhất của React cho đến các kỹ thuật nâng cao như State Management, Performance Optimization, và Testing.",
    thumbnail: "/images/courses/react-course.jpg",
    instructor: {
      id: 1,
      name: "Nguyễn Văn A",
      avatar: "/images/instructors/nguyen-van-a.jpg",
      bio: "Senior Frontend Developer với 5 năm kinh nghiệm làm việc tại các công ty công nghệ hàng đầu. Chuyên gia về React, TypeScript và Modern JavaScript.",
      experience_years: 5,
      total_students: 3500,
      total_courses: 12,
      rating: 4.8
    },
    category: {
      id: 1,
      name: "Lập trình Frontend",
      slug: "lap-trinh-frontend",
      description: "Các khóa học về phát triển giao diện người dùng"
    },
    price: {
      current_price: 299000,
      original_price: 499000,
      currency: "VND",
      discount_percentage: 40
    },
    rating: {
      average: 4.8,
      count: 156,
      distribution: {
        5: 89,
        4: 45,
        3: 15,
        2: 5,
        1: 2
      }
    },
    stats: {
      students_count: 1250,
      lessons_count: 45,
      duration_hours: 12.5,
      level: "Trung bình",
      language: "Tiếng Việt",
      last_updated: "2024-01-20T15:30:00Z"
    },
    modules: [
      {
        id: 1,
        title: "Giới thiệu về React",
        description: "Tìm hiểu về React và cách thiết lập môi trường phát triển",
        lessons_count: 8,
        duration_hours: 2.5,
        order: 1
      },
      {
        id: 2,
        title: "Components và JSX",
        description: "Học cách tạo và sử dụng React Components",
        lessons_count: 12,
        duration_hours: 3.0,
        order: 2
      },
      {
        id: 3,
        title: "State và Props",
        description: "Quản lý state và truyền dữ liệu giữa các components",
        lessons_count: 10,
        duration_hours: 2.8,
        order: 3
      },
      {
        id: 4,
        title: "Hooks và Context API",
        description: "Sử dụng React Hooks và Context API cho state management",
        lessons_count: 9,
        duration_hours: 2.5,
        order: 4
      },
      {
        id: 5,
        title: "Dự án thực tế",
        description: "Xây dựng ứng dụng Todo App hoàn chỉnh",
        lessons_count: 6,
        duration_hours: 1.7,
        order: 5
      }
    ],
    requirements: [
      "Kiến thức cơ bản về HTML, CSS",
      "Hiểu biết về JavaScript ES6+",
      "Có máy tính cài đặt Node.js"
    ],
    what_you_will_learn: [
      "Nắm vững các khái niệm cơ bản của React",
      "Tạo và quản lý React Components",
      "Sử dụng React Hooks hiệu quả",
      "Quản lý state với Context API",
      "Xây dựng ứng dụng React hoàn chỉnh",
      "Best practices trong React development"
    ],
    tags: ["React", "JavaScript", "Frontend", "Web Development", "ES6"],
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-20T15:30:00Z"
  },
  "nodejs-expressjs-cho-nguoi-moi-bat-dau": {
    id: 2,
    title: "Node.js và Express.js cho người mới bắt đầu",
    slug: "nodejs-expressjs-cho-nguoi-moi-bat-dau",
    description: "Học Node.js và Express.js từ cơ bản với các ví dụ thực tế. Khóa học sẽ giúp bạn xây dựng được các ứng dụng web backend hoàn chỉnh.",
    thumbnail: "/images/courses/nodejs-course.jpg",
    instructor: {
      id: 2,
      name: "Trần Thị B",
      avatar: "/images/instructors/tran-thi-b.jpg",
      bio: "Backend Developer chuyên về Node.js với 4 năm kinh nghiệm. Đã tham gia phát triển nhiều hệ thống lớn.",
      experience_years: 4,
      total_students: 2100,
      total_courses: 8,
      rating: 4.6
    },
    category: {
      id: 2,
      name: "Lập trình Backend",
      slug: "lap-trinh-backend",
      description: "Các khóa học về phát triển backend và server-side"
    },
    price: {
      current_price: 399000,
      original_price: 599000,
      currency: "VND",
      discount_percentage: 33
    },
    rating: {
      average: 4.6,
      count: 89,
      distribution: {
        5: 52,
        4: 28,
        3: 7,
        2: 2,
        1: 0
      }
    },
    stats: {
      students_count: 890,
      lessons_count: 38,
      duration_hours: 15.0,
      level: "Cơ bản",
      language: "Tiếng Việt",
      last_updated: "2024-01-18T12:00:00Z"
    },
    modules: [
      {
        id: 1,
        title: "Giới thiệu Node.js",
        description: "Tìm hiểu về Node.js và cách cài đặt",
        lessons_count: 6,
        duration_hours: 2.0,
        order: 1
      },
      {
        id: 2,
        title: "NPM và Module System",
        description: "Quản lý packages và modules trong Node.js",
        lessons_count: 8,
        duration_hours: 2.5,
        order: 2
      },
      {
        id: 3,
        title: "Express.js Framework",
        description: "Xây dựng web server với Express.js",
        lessons_count: 12,
        duration_hours: 4.0,
        order: 3
      },
      {
        id: 4,
        title: "Database Integration",
        description: "Kết nối và làm việc với MongoDB",
        lessons_count: 8,
        duration_hours: 3.5,
        order: 4
      },
      {
        id: 5,
        title: "Authentication & Security",
        description: "Bảo mật ứng dụng và xác thực người dùng",
        lessons_count: 4,
        duration_hours: 3.0,
        order: 5
      }
    ],
    requirements: [
      "Kiến thức cơ bản về JavaScript",
      "Hiểu biết về HTTP và REST API",
      "Có máy tính cài đặt Node.js"
    ],
    what_you_will_learn: [
      "Nắm vững Node.js runtime environment",
      "Xây dựng REST API với Express.js",
      "Kết nối và thao tác với database",
      "Implement authentication và authorization",
      "Deploy ứng dụng Node.js lên production"
    ],
    tags: ["Node.js", "Express.js", "Backend", "JavaScript", "API"],
    created_at: "2024-01-10T08:00:00Z",
    updated_at: "2024-01-18T12:00:00Z"
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    // Find course by slug
    const courseDetails = mockCourseDetails[slug]

    if (!courseDetails) {
      return NextResponse.json({
        success: false,
        message: "Không tìm thấy khóa học",
        error: "Course not found"
      }, { status: 404 })
    }

    const response: ApiCourseResponse = {
      success: true,
      message: "Chi tiết khóa học được tải thành công",
      data: courseDetails
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Course details API error:', error)
    
    return NextResponse.json({
      success: false,
      message: "Có lỗi xảy ra khi tải chi tiết khóa học",
      error: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 })
  }
}