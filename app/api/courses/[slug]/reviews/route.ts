import { NextRequest, NextResponse } from 'next/server'
import { 
  ApiCourseReviewsResponse,
  CourseReviewsQueryParams,
  CourseReview,
  CoursePagination 
} from '@/lib/api/types'

// Mock reviews data
const mockReviews: Record<string, CourseReview[]> = {
  'lap-trinh-react-tu-co-ban-den-nang-cao': [
    {
      id: 1,
      user: {
        id: 101,
        name: "Nguyễn Văn An",
        avatar: "/images/users/user1.jpg"
      },
      rating: 5,
      comment: "Khóa học rất hay và chi tiết. Giảng viên giải thích rất dễ hiểu, từ cơ bản đến nâng cao. Tôi đã học được rất nhiều kiến thức về React.",
      created_at: "2024-01-20T10:30:00Z",
      updated_at: "2024-01-20T10:30:00Z"
    },
    {
      id: 2,
      user: {
        id: 102,
        name: "Trần Thị Bình",
        avatar: "/images/users/user2.jpg"
      },
      rating: 4,
      comment: "Nội dung khóa học tốt, có nhiều ví dụ thực tế. Tuy nhiên, một số phần hơi nhanh, cần xem lại nhiều lần.",
      created_at: "2024-01-18T14:15:00Z",
      updated_at: "2024-01-18T14:15:00Z"
    },
    {
      id: 3,
      user: {
        id: 103,
        name: "Lê Văn Cường",
        avatar: "/images/users/user3.jpg"
      },
      rating: 5,
      comment: "Xuất sắc! Đây là khóa học React tốt nhất tôi từng tham gia. Cảm ơn giảng viên!",
      created_at: "2024-01-15T09:45:00Z",
      updated_at: "2024-01-15T09:45:00Z"
    }
  ],
  'python-cho-data-science': [
    {
      id: 4,
      user: {
        id: 104,
        name: "Phạm Thị Dung",
        avatar: "/images/users/user4.jpg"
      },
      rating: 5,
      comment: "Khóa học Python cho Data Science rất chất lượng. Từ cơ bản đến nâng cao, có nhiều bài tập thực hành.",
      created_at: "2024-01-22T16:20:00Z",
      updated_at: "2024-01-22T16:20:00Z"
    },
    {
      id: 5,
      user: {
        id: 105,
        name: "Hoàng Văn Em",
        avatar: "/images/users/user5.jpg"
      },
      rating: 4,
      comment: "Nội dung hay, giảng viên có kinh nghiệm. Tuy nhiên, cần thêm một số ví dụ về machine learning.",
      created_at: "2024-01-19T11:30:00Z",
      updated_at: "2024-01-19T11:30:00Z"
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
    const queryParams: CourseReviewsQueryParams = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      rating: searchParams.get('rating') ? parseInt(searchParams.get('rating')!) : undefined,
      sort: searchParams.get('sort') as 'newest' | 'oldest' | 'rating_high' | 'rating_low' || 'newest'
    }

    // Validate parameters
    if (queryParams.page < 1) queryParams.page = 1
    if (queryParams.limit > 50) queryParams.limit = 50
    if (queryParams.limit < 1) queryParams.limit = 10

    // Get reviews for the course
    let courseReviews = mockReviews[slug] || []

    // Filter by rating if specified
    if (queryParams.rating) {
      courseReviews = courseReviews.filter(review => review.rating === queryParams.rating)
    }

    // Sort reviews
    switch (queryParams.sort) {
      case 'newest':
        courseReviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case 'oldest':
        courseReviews.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
      case 'rating_high':
        courseReviews.sort((a, b) => b.rating - a.rating)
        break
      case 'rating_low':
        courseReviews.sort((a, b) => a.rating - b.rating)
        break
      default:
        courseReviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    // Calculate pagination
    const totalReviews = courseReviews.length
    const totalPages = Math.ceil(totalReviews / queryParams.limit)
    const startIndex = (queryParams.page - 1) * queryParams.limit
    const endIndex = startIndex + queryParams.limit
    const paginatedReviews = courseReviews.slice(startIndex, endIndex)

    const pagination: CoursePagination = {
      current_page: queryParams.page,
      total_pages: totalPages,
      total_items: totalReviews,
      items_per_page: queryParams.limit,
      has_next: queryParams.page < totalPages,
      has_previous: queryParams.page > 1
    }

    // Calculate rating statistics
    const ratingStats = {
      average: totalReviews > 0 ? courseReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0,
      total_count: totalReviews,
      rating_distribution: {
        5: courseReviews.filter(r => r.rating === 5).length,
        4: courseReviews.filter(r => r.rating === 4).length,
        3: courseReviews.filter(r => r.rating === 3).length,
        2: courseReviews.filter(r => r.rating === 2).length,
        1: courseReviews.filter(r => r.rating === 1).length
      }
    }

    const response: ApiCourseReviewsResponse = {
      success: true,
      message: "Danh sách đánh giá khóa học được tải thành công",
      data: {
        reviews: paginatedReviews,
        pagination,
        rating_stats: ratingStats,
        filters_applied: {
          rating: queryParams.rating,
          sort: queryParams.sort
        }
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Course reviews API error:', error)
    
    return NextResponse.json({
      success: false,
      message: "Có lỗi xảy ra khi tải danh sách đánh giá khóa học",
      error: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 })
  }
}