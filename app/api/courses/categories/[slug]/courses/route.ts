import { NextRequest, NextResponse } from 'next/server'
import { 
  ApiCoursesResponse,
  Course,
  CoursePagination 
} from '@/lib/api/types'

// Mock courses data by category
const mockCoursesByCategory: Record<string, Course[]> = {
  "lap-trinh-frontend": [
    {
      id: 1,
      title: "React.js từ cơ bản đến nâng cao",
      slug: "reactjs-tu-co-ban-den-nang-cao",
      description: "Học React.js từ những kiến thức cơ bản đến nâng cao với các dự án thực tế",
      thumbnail: "/images/courses/react-course.jpg",
      instructor: {
        id: 1,
        name: "Nguyễn Văn A",
        avatar: "/images/instructors/nguyen-van-a.jpg",
        bio: "Senior Frontend Developer với 5 năm kinh nghiệm"
      },
      category: {
        id: 1,
        name: "Lập trình Frontend",
        slug: "lap-trinh-frontend"
      },
      price: {
        current_price: 299000,
        original_price: 499000,
        currency: "VND"
      },
      rating: {
        average: 4.8,
        count: 156
      },
      stats: {
        students_count: 1250,
        lessons_count: 45,
        duration_hours: 12.5,
        level: "Trung bình"
      },
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-20T15:30:00Z"
    },
    {
      id: 4,
      title: "JavaScript ES6+ và Modern Web Development",
      slug: "javascript-es6-modern-web-development",
      description: "Học JavaScript hiện đại với ES6+ và các framework phổ biến",
      thumbnail: "/images/courses/javascript-course.jpg",
      instructor: {
        id: 1,
        name: "Nguyễn Văn A",
        avatar: "/images/instructors/nguyen-van-a.jpg",
        bio: "Senior Frontend Developer với 5 năm kinh nghiệm"
      },
      category: {
        id: 1,
        name: "Lập trình Frontend",
        slug: "lap-trinh-frontend"
      },
      price: {
        current_price: 199000,
        original_price: 299000,
        currency: "VND"
      },
      rating: {
        average: 4.7,
        count: 98
      },
      stats: {
        students_count: 756,
        lessons_count: 32,
        duration_hours: 8.5,
        level: "Trung bình"
      },
      created_at: "2024-01-12T14:00:00Z",
      updated_at: "2024-01-19T10:00:00Z"
    },
    {
      id: 7,
      title: "HTML & CSS cơ bản",
      slug: "html-css-co-ban",
      description: "Học HTML và CSS từ cơ bản để xây dựng website đầu tiên",
      thumbnail: "/images/courses/html-css-course.jpg",
      instructor: {
        id: 5,
        name: "Hoàng Văn E",
        avatar: "/images/instructors/hoang-van-e.jpg",
        bio: "Web Developer với kinh nghiệm 3 năm"
      },
      category: {
        id: 1,
        name: "Lập trình Frontend",
        slug: "lap-trinh-frontend"
      },
      price: {
        current_price: 0,
        currency: "VND"
      },
      rating: {
        average: 4.3,
        count: 189
      },
      stats: {
        students_count: 3200,
        lessons_count: 25,
        duration_hours: 8.0,
        level: "Cơ bản"
      },
      created_at: "2024-01-01T10:00:00Z",
      updated_at: "2024-01-15T14:00:00Z"
    }
  ],
  "lap-trinh-backend": [
    {
      id: 2,
      title: "Node.js và Express.js cho người mới bắt đầu",
      slug: "nodejs-express-cho-nguoi-moi-bat-dau",
      description: "Học lập trình backend với Node.js và Express.js từ cơ bản",
      thumbnail: "/images/courses/nodejs-course.jpg",
      instructor: {
        id: 2,
        name: "Trần Thị B",
        avatar: "/images/instructors/tran-thi-b.jpg",
        bio: "Backend Developer với 4 năm kinh nghiệm"
      },
      category: {
        id: 2,
        name: "Lập trình Backend",
        slug: "lap-trinh-backend"
      },
      price: {
        current_price: 399000,
        original_price: 599000,
        currency: "VND"
      },
      rating: {
        average: 4.6,
        count: 89
      },
      stats: {
        students_count: 890,
        lessons_count: 38,
        duration_hours: 15.0,
        level: "Cơ bản"
      },
      created_at: "2024-01-10T08:00:00Z",
      updated_at: "2024-01-18T12:00:00Z"
    }
  ],
  "data-science": [
    {
      id: 3,
      title: "Python cho Data Science",
      slug: "python-cho-data-science",
      description: "Khóa học Python chuyên sâu cho Data Science và Machine Learning",
      thumbnail: "/images/courses/python-course.jpg",
      instructor: {
        id: 3,
        name: "Lê Văn C",
        avatar: "/images/instructors/le-van-c.jpg",
        bio: "Data Scientist với kinh nghiệm 7 năm"
      },
      category: {
        id: 3,
        name: "Data Science",
        slug: "data-science"
      },
      price: {
        current_price: 0,
        currency: "VND"
      },
      rating: {
        average: 4.9,
        count: 234
      },
      stats: {
        students_count: 2100,
        lessons_count: 52,
        duration_hours: 20.0,
        level: "Nâng cao"
      },
      created_at: "2024-01-05T09:00:00Z",
      updated_at: "2024-01-22T14:00:00Z"
    }
  ],
  "devops": [
    {
      id: 8,
      title: "Git và GitHub cho người mới bắt đầu",
      slug: "git-github-cho-nguoi-moi-bat-dau",
      description: "Học cách sử dụng Git và GitHub để quản lý mã nguồn",
      thumbnail: "/images/courses/git-course.jpg",
      instructor: {
        id: 6,
        name: "Ngô Thị F",
        avatar: "/images/instructors/ngo-thi-f.jpg",
        bio: "DevOps Engineer với kinh nghiệm 4 năm"
      },
      category: {
        id: 4,
        name: "DevOps",
        slug: "devops"
      },
      price: {
        current_price: 0,
        currency: "VND"
      },
      rating: {
        average: 4.6,
        count: 145
      },
      stats: {
        students_count: 1890,
        lessons_count: 18,
        duration_hours: 6.0,
        level: "Cơ bản"
      },
      created_at: "2024-01-02T09:00:00Z",
      updated_at: "2024-01-12T11:00:00Z"
    }
  ],
  "thiet-ke": [
    {
      id: 9,
      title: "Thiết kế UI/UX cơ bản",
      slug: "thiet-ke-ui-ux-co-ban",
      description: "Học các nguyên tắc cơ bản của thiết kế UI/UX",
      thumbnail: "/images/courses/ui-ux-course.jpg",
      instructor: {
        id: 7,
        name: "Lý Văn G",
        avatar: "/images/instructors/ly-van-g.jpg",
        bio: "UI/UX Designer với kinh nghiệm 5 năm"
      },
      category: {
        id: 5,
        name: "Thiết kế",
        slug: "thiet-ke"
      },
      price: {
        current_price: 0,
        currency: "VND"
      },
      rating: {
        average: 4.4,
        count: 98
      },
      stats: {
        students_count: 1234,
        lessons_count: 22,
        duration_hours: 7.5,
        level: "Cơ bản"
      },
      created_at: "2024-01-04T15:00:00Z",
      updated_at: "2024-01-14T13:00:00Z"
    }
  ],
  "co-so-du-lieu": [
    {
      id: 10,
      title: "SQL cơ bản cho người mới bắt đầu",
      slug: "sql-co-ban-cho-nguoi-moi-bat-dau",
      description: "Học SQL từ cơ bản để làm việc với cơ sở dữ liệu",
      thumbnail: "/images/courses/sql-course.jpg",
      instructor: {
        id: 8,
        name: "Đặng Thị H",
        avatar: "/images/instructors/dang-thi-h.jpg",
        bio: "Database Administrator với kinh nghiệm 6 năm"
      },
      category: {
        id: 6,
        name: "Cơ sở dữ liệu",
        slug: "co-so-du-lieu"
      },
      price: {
        current_price: 0,
        currency: "VND"
      },
      rating: {
        average: 4.5,
        count: 167
      },
      stats: {
        students_count: 987,
        lessons_count: 30,
        duration_hours: 9.0,
        level: "Cơ bản"
      },
      created_at: "2024-01-06T12:00:00Z",
      updated_at: "2024-01-17T10:00:00Z"
    }
  ]
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const { searchParams } = new URL(request.url)
    
    // Get query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sort = searchParams.get('sort') || 'created_at'
    const order = searchParams.get('order') || 'desc'

    // Get courses for the category
    const courses = mockCoursesByCategory[slug] || []
    
    if (courses.length === 0) {
      return NextResponse.json({
        success: false,
        message: `Không tìm thấy khóa học cho danh mục: ${slug}`,
        data: {
          courses: [],
          pagination: {
            current_page: page,
            per_page: limit,
            total: 0,
            total_pages: 0,
            has_next_page: false,
            has_prev_page: false
          }
        }
      }, { status: 404 })
    }

    // Sort courses
    const sortedCourses = [...courses].sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sort) {
        case 'title':
          aValue = a.title
          bValue = b.title
          break
        case 'price':
          aValue = a.price.current_price
          bValue = b.price.current_price
          break
        case 'rating':
          aValue = a.rating.average
          bValue = b.rating.average
          break
        case 'students':
          aValue = a.stats.students_count
          bValue = b.stats.students_count
          break
        case 'created_at':
        default:
          aValue = new Date(a.created_at)
          bValue = new Date(b.created_at)
          break
      }
      
      if (order === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    // Pagination
    const total = sortedCourses.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedCourses = sortedCourses.slice(startIndex, endIndex)

    const pagination: CoursePagination = {
      current_page: page,
      per_page: limit,
      total,
      total_pages: totalPages,
      has_next_page: page < totalPages,
      has_prev_page: page > 1
    }

    const response: ApiCoursesResponse = {
      success: true,
      message: `Danh sách khóa học cho danh mục: ${slug}`,
      data: {
        courses: paginatedCourses,
        pagination
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching courses by category:', error)
    return NextResponse.json({
      success: false,
      message: 'Lỗi server khi lấy danh sách khóa học',
      data: {
        courses: [],
        pagination: {
          current_page: 1,
          per_page: 10,
          total: 0,
          total_pages: 0,
          has_next_page: false,
          has_prev_page: false
        }
      }
    }, { status: 500 })
  }
}