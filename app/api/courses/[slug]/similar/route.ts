import { NextRequest, NextResponse } from 'next/server'
import { 
  ApiSimilarCoursesResponse,
  SimilarCoursesQueryParams,
  SearchCourse 
} from '@/lib/api/types'

// Mock similar courses data
const mockSimilarCourses: Record<string, SearchCourse[]> = {
  'lap-trinh-react-tu-co-ban-den-nang-cao': [
    {
      id: 2,
      title: "Vue.js từ Cơ bản đến Nâng cao",
      slug: "vuejs-tu-co-ban-den-nang-cao",
      description: "Học Vue.js từ những kiến thức cơ bản nhất đến các kỹ thuật nâng cao",
      thumbnail: "/images/courses/vuejs-course.jpg",
      price: {
        current_price: 899000,
        original_price: 1299000,
        currency: "VND",
        discount_percentage: 31
      },
      instructor: {
        id: 2,
        name: "Trần Văn B",
        avatar: "/images/instructors/instructor2.jpg",
        title: "Frontend Developer"
      },
      category: {
        id: 1,
        name: "Lập trình Frontend",
        slug: "lap-trinh-frontend"
      },
      level: "intermediate",
      duration: 1800,
      rating: 4.6,
      total_students: 1250,
      total_lessons: 45,
      language: "vi",
      status: "published",
      created_at: "2024-01-10T00:00:00Z",
      updated_at: "2024-01-20T00:00:00Z"
    },
    {
      id: 3,
      title: "Angular cho Người Mới Bắt đầu",
      slug: "angular-cho-nguoi-moi-bat-dau",
      description: "Khóa học Angular dành cho người mới bắt đầu với lập trình web",
      thumbnail: "/images/courses/angular-course.jpg",
      price: {
        current_price: 799000,
        original_price: 1199000,
        currency: "VND",
        discount_percentage: 33
      },
      instructor: {
        id: 3,
        name: "Lê Thị C",
        avatar: "/images/instructors/instructor3.jpg",
        title: "Full-stack Developer"
      },
      category: {
        id: 1,
        name: "Lập trình Frontend",
        slug: "lap-trinh-frontend"
      },
      level: "beginner",
      duration: 1500,
      rating: 4.4,
      total_students: 890,
      total_lessons: 38,
      language: "vi",
      status: "published",
      created_at: "2024-01-05T00:00:00Z",
      updated_at: "2024-01-18T00:00:00Z"
    },
    {
      id: 4,
      title: "JavaScript ES6+ và Modern Web Development",
      slug: "javascript-es6-modern-web-development",
      description: "Nắm vững JavaScript ES6+ và các kỹ thuật phát triển web hiện đại",
      thumbnail: "/images/courses/javascript-course.jpg",
      price: {
        current_price: 699000,
        original_price: 999000,
        currency: "VND",
        discount_percentage: 30
      },
      instructor: {
        id: 1,
        name: "Nguyễn Văn A",
        avatar: "/images/instructors/instructor1.jpg",
        title: "Senior Frontend Developer"
      },
      category: {
        id: 1,
        name: "Lập trình Frontend",
        slug: "lap-trinh-frontend"
      },
      level: "intermediate",
      duration: 1200,
      rating: 4.7,
      total_students: 2100,
      total_lessons: 32,
      language: "vi",
      status: "published",
      created_at: "2023-12-20T00:00:00Z",
      updated_at: "2024-01-15T00:00:00Z"
    }
  ],
  'python-cho-data-science': [
    {
      id: 5,
      title: "Machine Learning với Python",
      slug: "machine-learning-voi-python",
      description: "Học Machine Learning từ cơ bản đến nâng cao với Python",
      thumbnail: "/images/courses/ml-python-course.jpg",
      price: {
        current_price: 1299000,
        original_price: 1799000,
        currency: "VND",
        discount_percentage: 28
      },
      instructor: {
        id: 4,
        name: "Phạm Văn D",
        avatar: "/images/instructors/instructor4.jpg",
        title: "Data Scientist"
      },
      category: {
        id: 2,
        name: "Data Science",
        slug: "data-science"
      },
      level: "intermediate",
      duration: 2400,
      rating: 4.8,
      total_students: 1800,
      total_lessons: 60,
      language: "vi",
      status: "published",
      created_at: "2024-01-08T00:00:00Z",
      updated_at: "2024-01-22T00:00:00Z"
    },
    {
      id: 6,
      title: "Deep Learning và Neural Networks",
      slug: "deep-learning-neural-networks",
      description: "Khám phá thế giới Deep Learning và Neural Networks",
      thumbnail: "/images/courses/deep-learning-course.jpg",
      price: {
        current_price: 1599000,
        original_price: 2199000,
        currency: "VND",
        discount_percentage: 27
      },
      instructor: {
        id: 5,
        name: "Hoàng Thị E",
        avatar: "/images/instructors/instructor5.jpg",
        title: "AI Research Engineer"
      },
      category: {
        id: 2,
        name: "Data Science",
        slug: "data-science"
      },
      level: "advanced",
      duration: 3000,
      rating: 4.9,
      total_students: 950,
      total_lessons: 75,
      language: "vi",
      status: "published",
      created_at: "2024-01-12T00:00:00Z",
      updated_at: "2024-01-25T00:00:00Z"
    }
  ]
}

interface RouteParams {
  params: {
    slug: string
  }
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = params
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const queryParams: SimilarCoursesQueryParams = {
      limit: parseInt(searchParams.get('limit') || '6'),
      level: searchParams.get('level') as 'beginner' | 'intermediate' | 'advanced' || undefined,
      category_id: searchParams.get('category_id') ? parseInt(searchParams.get('category_id')!) : undefined
    }

    // Validate parameters
    if (queryParams.limit > 20) queryParams.limit = 20
    if (queryParams.limit < 1) queryParams.limit = 6

    // Get similar courses for the course
    let similarCourses = mockSimilarCourses[slug] || []

    // Filter by level if specified
    if (queryParams.level) {
      similarCourses = similarCourses.filter(course => course.level === queryParams.level)
    }

    // Filter by category if specified
    if (queryParams.category_id) {
      similarCourses = similarCourses.filter(course => course.category.id === queryParams.category_id)
    }

    // Limit results
    similarCourses = similarCourses.slice(0, queryParams.limit)

    // Calculate similarity score (mock implementation)
    const coursesWithSimilarity = similarCourses.map(course => ({
      ...course,
      similarity_score: Math.round((Math.random() * 0.3 + 0.7) * 100) / 100 // Random score between 0.7-1.0
    }))

    // Sort by similarity score (highest first)
    coursesWithSimilarity.sort((a, b) => b.similarity_score - a.similarity_score)

    const response: ApiSimilarCoursesResponse = {
      success: true,
      message: "Danh sách khóa học tương tự được tải thành công",
      data: {
        courses: coursesWithSimilarity,
        total_count: coursesWithSimilarity.length,
        filters_applied: {
          level: queryParams.level,
          category_id: queryParams.category_id,
          limit: queryParams.limit
        },
        recommendation_algorithm: "content_based_filtering"
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Similar courses API error:', error)
    
    return NextResponse.json({
      success: false,
      message: "Có lỗi xảy ra khi tải danh sách khóa học tương tự",
      error: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 })
  }
}