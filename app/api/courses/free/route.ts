import { NextRequest, NextResponse } from 'next/server'
import { 
  ApiFreeCoursesResponse, 
  FreeCoursesQueryParams,
  Course,
  CoursePagination 
} from '@/lib/api/types'

// Mock free courses data
const mockFreeCourses: Course[] = [
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
  },
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
  },
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
  },
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const queryParams: FreeCoursesQueryParams = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      category: searchParams.get('category') || undefined,
      difficulty: searchParams.get('difficulty') || undefined,
      min_price: parseFloat(searchParams.get('min_price') || '0'),
      max_price: parseFloat(searchParams.get('max_price') || '0') || undefined,
      rating: parseFloat(searchParams.get('rating') || '0') || undefined,
      sort: searchParams.get('sort') as 'newest' | 'oldest' | 'popular' | 'rating' || 'newest'
    }

    // Validate parameters
    if (queryParams.page < 1) queryParams.page = 1
    if (queryParams.limit > 50) queryParams.limit = 50
    if (queryParams.limit < 1) queryParams.limit = 10

    // Apply filters to free courses
    let filteredCourses = [...mockFreeCourses]

    // Filter by category
    if (queryParams.category) {
      filteredCourses = filteredCourses.filter(course => 
        course.category.slug === queryParams.category
      )
    }

    // Filter by difficulty
    if (queryParams.difficulty) {
      const difficultyMap: { [key: string]: string } = {
        'beginner': 'Cơ bản',
        'intermediate': 'Trung bình',
        'advanced': 'Nâng cao'
      }
      
      const targetDifficulty = difficultyMap[queryParams.difficulty] || queryParams.difficulty
      filteredCourses = filteredCourses.filter(course => 
        course.stats.level === targetDifficulty
      )
    }

    // Filter by price range (for free courses, this mainly affects courses with price 0)
    if (queryParams.min_price !== undefined && queryParams.min_price > 0) {
      filteredCourses = filteredCourses.filter(course => 
        course.price.current_price >= queryParams.min_price!
      )
    }

    if (queryParams.max_price !== undefined && queryParams.max_price > 0) {
      filteredCourses = filteredCourses.filter(course => 
        course.price.current_price <= queryParams.max_price!
      )
    }

    // Filter by minimum rating
    if (queryParams.rating !== undefined && queryParams.rating > 0) {
      filteredCourses = filteredCourses.filter(course => 
        course.rating.average >= queryParams.rating!
      )
    }

    // Sort courses
    switch (queryParams.sort) {
      case 'newest':
        filteredCourses.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case 'oldest':
        filteredCourses.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
      case 'popular':
        filteredCourses.sort((a, b) => b.stats.students_count - a.stats.students_count)
        break
      case 'rating':
        filteredCourses.sort((a, b) => {
          if (b.rating.average !== a.rating.average) {
            return b.rating.average - a.rating.average
          }
          return b.rating.count - a.rating.count
        })
        break
      default:
        filteredCourses.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    // Calculate pagination
    const totalCourses = filteredCourses.length
    const totalPages = Math.ceil(totalCourses / queryParams.limit)
    const startIndex = (queryParams.page - 1) * queryParams.limit
    const endIndex = startIndex + queryParams.limit
    const paginatedCourses = filteredCourses.slice(startIndex, endIndex)

    const pagination: CoursePagination = {
      current_page: queryParams.page,
      total_pages: totalPages,
      total_items: totalCourses,
      items_per_page: queryParams.limit,
      has_next: queryParams.page < totalPages,
      has_previous: queryParams.page > 1
    }

    const response: ApiFreeCoursesResponse = {
      success: true,
      message: "Danh sách khóa học miễn phí được tải thành công",
      data: {
        courses: paginatedCourses,
        pagination,
        filters_applied: {
          category: queryParams.category,
          difficulty: queryParams.difficulty,
          min_price: queryParams.min_price,
          max_price: queryParams.max_price,
          rating: queryParams.rating,
          sort: queryParams.sort
        }
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Free courses API error:', error)
    
    return NextResponse.json({
      success: false,
      message: "Có lỗi xảy ra khi tải danh sách khóa học miễn phí",
      error: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 })
  }
}