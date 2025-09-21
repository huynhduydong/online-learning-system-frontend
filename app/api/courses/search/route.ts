import { NextRequest, NextResponse } from 'next/server'
import { 
  ApiCourseSearchResponse, 
  CourseSearchQueryParams,
  SearchCourse,
  CoursePagination 
} from '@/lib/api/types'

// Mock search data for development - replace with actual API calls
const mockSearchCourses: SearchCourse[] = [
  {
    id: 1,
    title: "Lập trình React từ cơ bản đến nâng cao",
    slug: "lap-trinh-react-tu-co-ban-den-nang-cao",
    description: "Khóa học React toàn diện từ cơ bản đến nâng cao với các dự án thực tế",
    thumbnail: "/images/courses/react-course.jpg",
    instructor: {
      id: 1,
      name: "Nguyễn Văn A",
      avatar: "/images/instructors/nguyen-van-a.jpg"
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
    created_at: "2024-01-15T10:00:00Z"
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
      avatar: "/images/instructors/tran-thi-b.jpg"
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
    created_at: "2024-01-10T08:00:00Z"
  },
  {
    id: 3,
    title: "Python cho Data Science",
    slug: "python-cho-data-science",
    description: "Khóa học Python chuyên sâu cho Data Science và Machine Learning",
    thumbnail: "/images/courses/python-course.jpg",
    instructor: {
      id: 3,
      name: "Lê Văn C",
      avatar: "/images/instructors/le-van-c.jpg"
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
    created_at: "2024-01-05T09:00:00Z"
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
      avatar: "/images/instructors/nguyen-van-a.jpg"
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
    created_at: "2024-01-12T14:00:00Z"
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const queryParams: CourseSearchQueryParams = {
      q: searchParams.get('q') || '',
      page: parseInt(searchParams.get('page') || '1'),
      per_page: parseInt(searchParams.get('per_page') || '12'),
      category: searchParams.get('category') || undefined,
      difficulty: searchParams.get('difficulty') as 'beginner' | 'intermediate' | 'advanced' || undefined,
      min_price: searchParams.get('min_price') ? parseFloat(searchParams.get('min_price')!) : undefined,
      max_price: searchParams.get('max_price') ? parseFloat(searchParams.get('max_price')!) : undefined,
      rating: searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : undefined,
      sort_by: searchParams.get('sort_by') as 'relevance' | 'newest' | 'popularity' | 'price' | 'rating' || 'relevance',
      sort_order: searchParams.get('sort_order') as 'asc' | 'desc' || 'desc'
    }

    // Validate search query
    if (!queryParams.q || queryParams.q.trim().length < 2) {
      return NextResponse.json({
        success: false,
        message: "Từ khóa tìm kiếm phải có ít nhất 2 ký tự",
        data: {
          courses: [],
          pagination: {
            current_page: 1,
            total_pages: 0,
            total_items: 0,
            items_per_page: queryParams.limit,
            has_next: false,
            has_previous: false
          },
          search_query: queryParams.q,
          filters_applied: {}
        }
      }, { status: 400 })
    }

    // Search courses by title, description, instructor name, or category
    const searchTerm = queryParams.q.toLowerCase().trim()
    let searchResults = mockSearchCourses.filter(course => 
      course.title.toLowerCase().includes(searchTerm) ||
      course.description.toLowerCase().includes(searchTerm) ||
      course.instructor.name.toLowerCase().includes(searchTerm) ||
      course.category.name.toLowerCase().includes(searchTerm)
    )

    // Apply additional filters
    if (queryParams.category) {
      searchResults = searchResults.filter(course => 
        course.category.slug === queryParams.category
      )
    }

    if (queryParams.difficulty) {
      const difficultyMap: Record<string, string> = {
        'beginner': 'Cơ bản',
        'intermediate': 'Trung bình',
        'advanced': 'Nâng cao'
      }
      searchResults = searchResults.filter(course => 
        course.stats.level === difficultyMap[queryParams.difficulty!]
      )
    }

    if (queryParams.min_price !== undefined) {
      searchResults = searchResults.filter(course => 
        course.price.current_price >= queryParams.min_price!
      )
    }

    if (queryParams.max_price !== undefined) {
      searchResults = searchResults.filter(course => 
        course.price.current_price <= queryParams.max_price!
      )
    }

    if (queryParams.rating) {
      searchResults = searchResults.filter(course => 
        course.rating.average >= queryParams.rating!
      )
    }

    // Sort search results
    const sortMultiplier = queryParams.sort_order === 'asc' ? 1 : -1
    
    switch (queryParams.sort_by) {
      case 'relevance':
        // Simple relevance scoring based on title match
        searchResults.sort((a, b) => {
          const aScore = a.title.toLowerCase().includes(searchTerm) ? 2 : 1
          const bScore = b.title.toLowerCase().includes(searchTerm) ? 2 : 1
          return (bScore - aScore) * sortMultiplier
        })
        break
      case 'newest':
        searchResults.sort((a, b) => 
          (new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) * sortMultiplier
        )
        break
      case 'popularity':
        searchResults.sort((a, b) => 
          (b.stats.students_count - a.stats.students_count) * sortMultiplier
        )
        break
      case 'rating':
        searchResults.sort((a, b) => 
          (b.rating.average - a.rating.average) * sortMultiplier
        )
        break
      case 'price':
        searchResults.sort((a, b) => 
          (b.price.current_price - a.price.current_price) * sortMultiplier
        )
        break
    }

    // Calculate pagination
    const totalResults = searchResults.length
    const totalPages = Math.ceil(totalResults / queryParams.per_page)
    const startIndex = (queryParams.page - 1) * queryParams.per_page
    const endIndex = startIndex + queryParams.per_page
    const paginatedResults = searchResults.slice(startIndex, endIndex)

    const pagination: CoursePagination = {
      current_page: queryParams.page,
      per_page: queryParams.per_page,
      total_pages: totalPages,
      total_items: totalResults,
      has_next: queryParams.page < totalPages,
      has_previous: queryParams.page > 1
    }

    const response: ApiCourseSearchResponse = {
      success: true,
      message: `Tìm thấy ${totalResults} khóa học cho từ khóa "${queryParams.q}"`,
      data: {
        courses: paginatedResults,
        pagination,
        search_query: queryParams.q,
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
    console.error('Course search API error:', error)
    
    return NextResponse.json({
      success: false,
      message: "Có lỗi xảy ra khi tìm kiếm khóa học",
      error: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 })
  }
}