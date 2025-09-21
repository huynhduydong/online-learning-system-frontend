import { NextRequest, NextResponse } from 'next/server'
import { 
  ApiCategoriesWithCountResponse,
  CourseCategory 
} from '@/lib/api/types'

// Mock categories data with course counts
const mockCategoriesWithCount: CourseCategory[] = [
  {
    id: 1,
    name: "Lập trình Frontend",
    slug: "lap-trinh-frontend",
    description: "Học lập trình giao diện người dùng với HTML, CSS, JavaScript và các framework hiện đại",
    course_count: 45
  },
  {
    id: 2,
    name: "Lập trình Backend",
    slug: "lap-trinh-backend",
    description: "Học lập trình server-side với Node.js, Python, Java và các công nghệ backend",
    course_count: 32
  },
  {
    id: 3,
    name: "Data Science",
    slug: "data-science",
    description: "Học khoa học dữ liệu, machine learning và phân tích dữ liệu",
    course_count: 28
  },
  {
    id: 4,
    name: "DevOps",
    slug: "devops",
    description: "Học về triển khai, quản lý hệ thống và tự động hóa",
    course_count: 18
  },
  {
    id: 5,
    name: "Thiết kế",
    slug: "thiet-ke",
    description: "Học thiết kế UI/UX, đồ họa và trải nghiệm người dùng",
    course_count: 23
  },
  {
    id: 6,
    name: "Cơ sở dữ liệu",
    slug: "co-so-du-lieu",
    description: "Học về cơ sở dữ liệu, SQL và quản lý dữ liệu",
    course_count: 15
  },
  {
    id: 7,
    name: "Mobile Development",
    slug: "mobile-development",
    description: "Học lập trình ứng dụng di động cho iOS và Android",
    course_count: 21
  },
  {
    id: 8,
    name: "Cybersecurity",
    slug: "cybersecurity",
    description: "Học về bảo mật thông tin và an ninh mạng",
    course_count: 12
  }
]

export async function GET(request: NextRequest) {
  try {
    // Sort categories by course count (descending)
    const sortedCategories = [...mockCategoriesWithCount].sort((a, b) => 
      (b.course_count || 0) - (a.course_count || 0)
    )

    const response: ApiCategoriesWithCountResponse = {
      success: true,
      message: "Danh sách danh mục với số lượng khóa học được tải thành công",
      data: {
        categories: sortedCategories,
        total_count: sortedCategories.length,
        total_courses: sortedCategories.reduce((sum, cat) => sum + (cat.course_count || 0), 0)
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Categories with count API error:', error)
    
    return NextResponse.json({
      success: false,
      message: "Có lỗi xảy ra khi tải danh sách danh mục với số lượng khóa học",
      error: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 })
  }
}