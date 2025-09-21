import { NextRequest, NextResponse } from 'next/server'
import { 
  ApiCategoriesResponse,
  CourseCategory 
} from '@/lib/api/types'

// Mock categories data
const mockCategories: CourseCategory[] = [
  {
    id: 1,
    name: "Lập trình Frontend",
    slug: "lap-trinh-frontend",
    description: "Học lập trình giao diện người dùng với HTML, CSS, JavaScript và các framework hiện đại"
  },
  {
    id: 2,
    name: "Lập trình Backend",
    slug: "lap-trinh-backend",
    description: "Học lập trình server-side với Node.js, Python, Java và các công nghệ backend"
  },
  {
    id: 3,
    name: "Data Science",
    slug: "data-science",
    description: "Học khoa học dữ liệu, machine learning và phân tích dữ liệu"
  },
  {
    id: 4,
    name: "DevOps",
    slug: "devops",
    description: "Học về triển khai, quản lý hệ thống và tự động hóa"
  },
  {
    id: 5,
    name: "Thiết kế",
    slug: "thiet-ke",
    description: "Học thiết kế UI/UX, đồ họa và trải nghiệm người dùng"
  },
  {
    id: 6,
    name: "Cơ sở dữ liệu",
    slug: "co-so-du-lieu",
    description: "Học về cơ sở dữ liệu, SQL và quản lý dữ liệu"
  },
  {
    id: 7,
    name: "Mobile Development",
    slug: "mobile-development",
    description: "Học lập trình ứng dụng di động cho iOS và Android"
  },
  {
    id: 8,
    name: "Cybersecurity",
    slug: "cybersecurity",
    description: "Học về bảo mật thông tin và an ninh mạng"
  }
]

export async function GET(request: NextRequest) {
  try {
    const response: ApiCategoriesResponse = {
      success: true,
      message: "Danh sách danh mục được tải thành công",
      data: {
        categories: mockCategories,
        total_count: mockCategories.length
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Categories API error:', error)
    
    return NextResponse.json({
      success: false,
      message: "Có lỗi xảy ra khi tải danh sách danh mục",
      error: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 })
  }
}