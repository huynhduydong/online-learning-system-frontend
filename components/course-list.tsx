'use client'

import { Course } from "@/lib/api/types"
import { CourseCard } from "./course-card"
import { cn } from "@/lib/utils"

interface CourseListProps {
  courses: Course[]
  viewMode?: 'grid' | 'list'
  onEnroll?: (courseId: string) => void
  className?: string
}

export function CourseList({ 
  courses, 
  viewMode = 'grid', 
  onEnroll,
  className 
}: CourseListProps) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Không tìm thấy khóa học nào.</p>
      </div>
    )
  }

  return (
    <div className={cn(
      viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        : "space-y-4",
      className
    )}>
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          variant={viewMode === 'list' ? 'horizontal' : 'vertical'}
          onEnroll={onEnroll}
        />
      ))}
    </div>
  )
}