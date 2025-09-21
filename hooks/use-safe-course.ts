import { Course } from '@/lib/api/types'

export function useSafeCourse(course: Course | null | undefined) {
    // Debug logging
    console.log('useSafeCourse input:', course)

    // Create a safe course object with default values
    const safeCourse: Course | null = course ? {
        id: course.id || 0,
        title: course.title || 'Untitled Course',
        short_description: course.short_description || 'No description available',
        slug: course.slug || '',
        thumbnail_url: course.thumbnail_url || '/placeholder.jpg',
        difficulty_level: course.difficulty_level || 'beginner',
        language: course.language || 'vi',
        published_at: course.published_at || new Date().toISOString(),
        category: course.category || { id: 0, name: 'Unknown Category' },
        instructor: course.instructor || {
            id: 0,
            name: 'Unknown Instructor',
            avatar_url: null
        },
        price: course.price || {
            amount: 0,
            is_free: true,
            current: 0
        },
        rating: course.rating || {
            average: null,
            count: 0,
            has_enough_ratings: false
        },
        stats: course.stats || {
            duration_hours: 0,
            students_count: 0,
            lessons_count: 0
        }
    } : null

    console.log('useSafeCourse output:', safeCourse)
    return safeCourse
}