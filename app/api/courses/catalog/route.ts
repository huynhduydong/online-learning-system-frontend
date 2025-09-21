import { NextRequest, NextResponse } from 'next/server'
import { 
  NewApiCourseCatalogResponse, 
  CourseCatalogQueryParams,
  Course,
  CoursePagination 
} from '@/lib/api/types'

// Mock data for development - replace with actual API calls
const mockCourses: Course[] = [
  {
    id: 1,
    title: "Lập trình React từ cơ bản đến nâng cao",
    slug: "lap-trinh-react-tu-co-ban-den-nang-cao",
    short_description: "Khóa học React toàn diện từ cơ bản đến nâng cao với các dự án thực tế",
    thumbnail_url: "/react-course.jpg",
    difficulty_level: "intermediate",
    language: "vi",
    published_at: "2024-01-15T10:00:00Z",
    instructor: {
      id: 1,
      name: "Nguyễn Văn A",
      full_name: "Nguyễn Văn A",
      bio: "Senior Frontend Developer với 5 năm kinh nghiệm",
      avatar_url: "/instructor-avatar.jpg",
      total_students: 1250,
      total_courses: 8
    },
    category: {
      id: 1,
      name: "Lập trình Frontend",
      slug: "lap-trinh-frontend",
      description: "Học lập trình giao diện người dùng",
      course_count: 45
    },
    price: {
      amount: 299000,
      display: "299.000 VNĐ",
      is_free: false,
      original_price: 499000
    },
    rating: {
      average: 4.8,
      has_enough_ratings: true,
      total_ratings: 156
    },
    stats: {
      duration_hours: 12.5,
      total_enrollments: 1250,
      total_lessons: 45
    }
  },
  {
    id: 2,
    title: "Node.js và Express.js cho người mới bắt đầu",
    slug: "nodejs-express-cho-nguoi-moi-bat-dau",
    short_description: "Học lập trình backend với Node.js và Express.js từ cơ bản",
    thumbnail_url: "/figma-course.jpg",
    difficulty_level: "beginner",
    language: "vi",
    published_at: "2024-01-10T08:00:00Z",
    instructor: {
      id: 2,
      name: "Trần Thị B",
      full_name: "Trần Thị B", 
      bio: "Backend Developer với 4 năm kinh nghiệm",
      avatar_url: "/instructor-avatar-2.jpg",
      total_students: 890,
      total_courses: 5
    },
    category: {
      id: 2,
      name: "Lập trình Backend",
      slug: "lap-trinh-backend",
      description: "Học lập trình phía máy chủ",
      course_count: 32
    },
    price: {
      amount: 199000,
      display: "199.000 VNĐ",
      is_free: false,
      original_price: 299000
    },
    rating: {
      average: 4.5,
      has_enough_ratings: true,
      total_ratings: 89
    },
    stats: {
      duration_hours: 10.0,
      total_enrollments: 890,
      total_lessons: 38
    }
  },
  {
    id: 3,
    title: "Python cho Data Science",
    slug: "python-cho-data-science",
    short_description: "Khóa học Python chuyên sâu cho Data Science và Machine Learning",
    thumbnail_url: "/placeholder.jpg",
    difficulty_level: "advanced",
    language: "vi",
    published_at: "2024-01-05T09:00:00Z",
    instructor: {
      id: 3,
      name: "Lê Văn C",
      full_name: "Lê Văn C",
      bio: "Data Scientist với kinh nghiệm 7 năm",
      avatar_url: "/placeholder-user.jpg",
      total_students: 2100,
      total_courses: 6
    },
    category: {
      id: 3,
      name: "Data Science",
      slug: "data-science",
      description: "Phân tích dữ liệu và machine learning",
      course_count: 28
    },
    price: {
      amount: 0,
      display: "Miễn phí",
      is_free: true,
      original_price: undefined
    },
    rating: {
      average: 4.9,
      has_enough_ratings: true,
      total_ratings: 234
    },
    stats: {
      duration_hours: 20.0,
      total_enrollments: 2100,
      total_lessons: 52
    }
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const queryParams: CourseCatalogQueryParams = {
      page: parseInt(searchParams.get('page') || '1'),
      per_page: parseInt(searchParams.get('per_page') || '12'),
      category: searchParams.get('category') || undefined,
      difficulty: searchParams.get('difficulty') as 'beginner' | 'intermediate' | 'advanced' || undefined,
      min_price: searchParams.get('min_price') ? parseFloat(searchParams.get('min_price')!) : undefined,
      max_price: searchParams.get('max_price') ? parseFloat(searchParams.get('max_price')!) : undefined,
      rating: searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : undefined,
      sort_by: searchParams.get('sort_by') as 'popularity' | 'price' | 'rating' | 'newest' || 'popularity',
      sort_order: searchParams.get('sort_order') as 'asc' | 'desc' || 'desc'
    }

    // Ensure required params have defaults
    const page = queryParams.page || 1
    const perPage = queryParams.per_page || 12

    // Apply filters
    let filteredCourses = [...mockCourses]

    // Filter by category
    if (queryParams.category) {
      filteredCourses = filteredCourses.filter(course => 
        course.category.slug === queryParams.category || course.category.name.toLowerCase() === queryParams.category!.toLowerCase()
      )
    }

    // Filter by difficulty level
    if (queryParams.difficulty) {
      filteredCourses = filteredCourses.filter(course => 
        course.difficulty_level === queryParams.difficulty
      )
    }

    // Filter by minimum price
    if (queryParams.min_price !== undefined) {
      filteredCourses = filteredCourses.filter(course => 
        course.price.amount >= queryParams.min_price!
      )
    }

    // Filter by maximum price
    if (queryParams.max_price !== undefined) {
      filteredCourses = filteredCourses.filter(course => 
        course.price.amount <= queryParams.max_price!
      )
    }

    // Filter by minimum rating
    if (queryParams.rating) {
      filteredCourses = filteredCourses.filter(course => 
        course.rating.average !== null && course.rating.average >= queryParams.rating!
      )
    }

    // Sort courses
    const sortOrder = queryParams.sort_order === 'asc' ? 1 : -1
    
    switch (queryParams.sort_by) {
      case 'newest':
        filteredCourses.sort((a, b) => 
          sortOrder * (new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
        )
        break
      case 'popularity':
        filteredCourses.sort((a, b) => 
          sortOrder * (b.stats.total_enrollments - a.stats.total_enrollments)
        )
        break
      case 'rating':
        filteredCourses.sort((a, b) => 
          sortOrder * ((b.rating.average || 0) - (a.rating.average || 0))
        )
        break
      case 'price':
        filteredCourses.sort((a, b) => 
          sortOrder * (b.price.amount - a.price.amount)
        )
        break
      default:
        filteredCourses.sort((a, b) => 
          sortOrder * (b.stats.total_enrollments - a.stats.total_enrollments)
        )
    }

    // Pagination
    const totalCourses = filteredCourses.length
    const totalPages = Math.ceil(totalCourses / perPage)
    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
    const paginatedCourses = filteredCourses.slice(startIndex, endIndex)

    const pagination: CoursePagination = {
      current_page: page,
      per_page: perPage,
      total_pages: totalPages,
      total_items: totalCourses,
      has_next: page < totalPages,
      has_previous: page > 1
    }

    const response: NewApiCourseCatalogResponse = {
      success: true,
      message: "Course catalog retrieved successfully",
      data: {
        courses: paginatedCourses,
        pagination,
        filters_applied: {
          category: queryParams.category,
          difficulty: queryParams.difficulty,
          min_price: queryParams.min_price,
          max_price: queryParams.max_price,
          rating: queryParams.rating,
          sort_by: queryParams.sort_by,
          sort_order: queryParams.sort_order
        }
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Course catalog API error:', error)
    
    return NextResponse.json({
      success: false,
      message: "Có lỗi xảy ra khi tải danh sách khóa học",
      error: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 })
  }
}
