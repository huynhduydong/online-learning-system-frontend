import React from 'react'
import { CourseCard, CourseCardNewProps } from './course-card'
import { Course } from '@/lib/api/types'

// Safe wrapper cho CourseCard
export function SafeCourseCard(props: CourseCardNewProps) {
  // Nếu course không tồn tại hoặc không hợp lệ, return null
  if (!props.course || typeof props.course !== 'object') {
    return null
  }

  // Kiểm tra các thuộc tính bắt buộc
  const course = props.course
  if (!course.id || !course.slug) {
    return null
  }

  try {
    return <CourseCard {...props} />
  } catch (error) {
    console.error('Error rendering CourseCard:', error)
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
        <p className="text-red-600 text-sm">
          Không thể hiển thị khóa học này. Vui lòng thử lại sau.
        </p>
      </div>
    )
  }
}

export default SafeCourseCard