import React from 'react'
import Link from 'next/link'
import { Course } from '@/lib/api/types'

interface SimpleCourseCardProps {
    course: Course
}

export function SimpleCourseCard({ course }: SimpleCourseCardProps) {
    if (!course) {
        return <div>No course data</div>
    }

    return (
        <Link href={`/courses/${course.slug || ''}`} className="block">
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                <img
                    src={course.thumbnail_url || '/placeholder.jpg'}
                    alt={course.title || 'Course'}
                    className="w-full h-48 object-cover rounded mb-4"
                />
                <h3 className="font-semibold text-lg mb-2">{course.title || 'Untitled'}</h3>
                <p className="text-gray-600 text-sm mb-2">{course.short_description || 'No description'}</p>
                <p className="text-sm text-gray-500">Instructor: {course.instructor?.name || 'Unknown'}</p>
                <p className="text-sm text-gray-500">Students: {course.stats?.students_count || 0}</p>
                <p className="text-sm text-gray-500">Rating: {course.rating?.average || 'N/A'}</p>
            </div>
        </Link>
    )
}