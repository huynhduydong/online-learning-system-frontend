import { NextRequest, NextResponse } from 'next/server'
import { 
  ApiTopRatedCoursesResponse, 
  TopRatedCoursesQueryParams,
  Course 
} from '@/lib/api/types'

// Mock top-rated courses data - sorted by rating
const mockTopRatedCourses: Course[] = [
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
    id: 1,
    title: "Lập trình React từ cơ bản đến nâng cao",
    slug: "lap-trinh-react-tu-co-ban-den-nang-cao",
    description: "Khóa học React toàn diện từ cơ bản đến nâng cao với các dự án thực tế",
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
    id: 2,
    title: "Node.js và Express.js cho người mới bắt đầu",
    slug: "nodejs-expressjs-cho-nguoi-moi-bat-dau",
    description: "Học Node.js và Express.js từ cơ bản với các ví dụ thực tế",
    thumbnail: "/images/courses/nodejs-course.jpg",
    instructor: {
      id: 2,
      name: "Trần Thị B",
      avatar: "/images/instructors/tran-thi-b.jpg",
      bio: "Backend Developer chuyên về Node.js"
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
  },
  {
    id: 5,
    title: "Vue.js 3 Composition API",
    slug: "vuejs-3-composition-api",
    description: "Học Vue.js 3 với Composition API và TypeScript",
    thumbnail: "/images/courses/vue-course.jpg",
    instructor: {
      id: 4,
      name: "Phạm Thị D",
      avatar: "/images/instructors/pham-thi-d.jpg",
      bio: "Frontend Developer chuyên về Vue.js"
    },
    category: {
      id: 1,
      name: "Lập trình Frontend",
      slug: "lap-trinh-frontend"
    },
    price: {
      current_price: 349000,
      original_price: 449000,
      currency: "VND"
    },
    rating: {
      average: 4.5,
      count: 67
    },
    stats: {
      students_count: 543,
      lessons_count: 28,
      duration_hours: 10.0,
      level: "Trung bình"
    },
    created_at: "2024-01-08T11:00:00Z",
    updated_at: "2024-01-16T16:00:00Z"
  },
  {
    id: 6,
    title: "Machine Learning cơ bản với Python",
    slug: "machine-learning-co-ban-voi-python",
    description: "Khóa học Machine Learning từ cơ bản đến nâng cao",
    thumbnail: "/images/courses/ml-course.jpg",
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
      current_price: 599000,
      original_price: 799000,
      currency: "VND"
    },
    rating: {
      average: 4.4,
      count: 123
    },
    stats: {
      students_count: 432,
      lessons_count: 48,
      duration_hours: 18.0,
      level: "Nâng cao"
    },
    created_at: "2024-01-03T13:00:00Z",
    updated_at: "2024-01-21T09:00:00Z"
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const queryParams: TopRatedCoursesQueryParams = {
      limit: parseInt(searchParams.get('limit') || '10'),
      category: searchParams.get('category') || undefined,
      difficulty: searchParams.get('difficulty') as 'beginner' | 'intermediate' | 'advanced' | undefined,
      min_price: searchParams.get('min_price') ? parseFloat(searchParams.get('min_price')!) : undefined,
      max_price: searchParams.get('max_price') ? parseFloat(searchParams.get('max_price')!) : undefined,
      rating: searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : undefined
    }

    // Validate parameters
    if (queryParams.limit > 50) {
      queryParams.limit = 50
    }
    
    if (queryParams.rating && (queryParams.rating < 0 || queryParams.rating > 5)) {
      queryParams.rating = undefined
    }

    // Apply filters to top-rated courses
    let filteredCourses = [...mockTopRatedCourses]

    // Filter by category
    if (queryParams.category) {
      filteredCourses = filteredCourses.filter(course => 
        course.category.slug === queryParams.category
      )
    }

    // Filter by difficulty
    if (queryParams.difficulty) {
      const difficultyMap = {
        'beginner': 'Cơ bản',
        'intermediate': 'Trung bình',
        'advanced': 'Nâng cao'
      }
      
      filteredCourses = filteredCourses.filter(course => 
        course.stats.level === difficultyMap[queryParams.difficulty!]
      )
    }

    // Filter by price range
    if (queryParams.min_price !== undefined) {
      filteredCourses = filteredCourses.filter(course => 
        course.price.current_price >= queryParams.min_price!
      )
    }

    if (queryParams.max_price !== undefined) {
      filteredCourses = filteredCourses.filter(course => 
        course.price.current_price <= queryParams.max_price!
      )
    }

    // Filter by minimum rating
    if (queryParams.rating !== undefined) {
      filteredCourses = filteredCourses.filter(course => 
        course.rating.average >= queryParams.rating!
      )
    }

    // Sort by rating (highest first) and then by review count
    filteredCourses.sort((a, b) => {
      if (b.rating.average !== a.rating.average) {
        return b.rating.average - a.rating.average
      }
      return b.rating.count - a.rating.count
    })

    // Limit results
    const limitedCourses = filteredCourses.slice(0, queryParams.limit)

    const response: ApiTopRatedCoursesResponse = {
      success: true,
      message: "Danh sách khóa học được đánh giá cao được tải thành công",
      data: {
        courses: limitedCourses,
        total_count: limitedCourses.length,
        filters_applied: {
          category: queryParams.category,
          difficulty: queryParams.difficulty,
          min_price: queryParams.min_price,
          max_price: queryParams.max_price,
          rating: queryParams.rating,
          limit: queryParams.limit
        }
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Top-rated courses API error:', error)
    
    return NextResponse.json({
      success: false,
      message: "Có lỗi xảy ra khi tải danh sách khóa học được đánh giá cao",
      error: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 })
  }
}