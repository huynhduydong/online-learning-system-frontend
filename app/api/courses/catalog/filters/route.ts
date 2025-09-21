import { NextResponse } from 'next/server'
import { ApiCatalogFiltersResponse } from '@/lib/api/types'

export async function GET() {
  try {
    // Mock filter data - replace with actual API calls
    const filtersData = {
      categories: [
        { id: 1, name: "Lập trình Frontend", slug: "lap-trinh-frontend", course_count: 45 },
        { id: 2, name: "Lập trình Backend", slug: "lap-trinh-backend", course_count: 32 },
        { id: 3, name: "Data Science", slug: "data-science", course_count: 28 },
        { id: 4, name: "Mobile Development", slug: "mobile-development", course_count: 22 },
        { id: 5, name: "DevOps", slug: "devops", course_count: 18 }
      ],
      levels: [
        { value: "Cơ bản", label: "Cơ bản", course_count: 67 },
        { value: "Trung bình", label: "Trung bình", course_count: 52 },
        { value: "Nâng cao", label: "Nâng cao", course_count: 26 }
      ],
      price_types: [
        { value: "free", label: "Miễn phí", course_count: 34 },
        { value: "paid", label: "Có phí", course_count: 111 }
      ],
      instructors: [
        { id: 1, name: "Nguyễn Văn A", course_count: 12 },
        { id: 2, name: "Trần Thị B", course_count: 8 },
        { id: 3, name: "Lê Văn C", course_count: 15 },
        { id: 4, name: "Phạm Thị D", course_count: 6 },
        { id: 5, name: "Hoàng Văn E", course_count: 9 }
      ],
      rating_ranges: [
        { min: 4.5, label: "4.5 sao trở lên", course_count: 45 },
        { min: 4.0, label: "4.0 sao trở lên", course_count: 89 },
        { min: 3.5, label: "3.5 sao trở lên", course_count: 125 },
        { min: 3.0, label: "3.0 sao trở lên", course_count: 145 }
      ],
      sort_options: [
        { value: "newest", label: "Mới nhất" },
        { value: "oldest", label: "Cũ nhất" },
        { value: "popular", label: "Phổ biến nhất" },
        { value: "rating", label: "Đánh giá cao nhất" }
      ]
    }

    const response: ApiCatalogFiltersResponse = {
      success: true,
      message: "Bộ lọc catalog được tải thành công",
      data: filtersData
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Catalog filters API error:', error)
    
    return NextResponse.json({
      success: false,
      message: "Có lỗi xảy ra khi tải bộ lọc catalog",
      error: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 })
  }
}