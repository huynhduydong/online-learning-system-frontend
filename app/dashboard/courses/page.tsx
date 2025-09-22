'use client'

/**
 * My Courses Dashboard Page
 * Shows all enrolled courses with progress and access status
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    BookOpen,
    Clock,
    PlayCircle,
    CheckCircle,
    AlertCircle,
    Search,
    Filter,
    Download,
    MoreHorizontal
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { enrollmentService } from '@/lib/api/enrollment'
import { lessonsService } from '@/lib/api/lessons'

// API Response interfaces
interface ApiEnrollment {
    id: string
    course_id: number
    user_id: number
    status: string
    access_granted: boolean
    enrollment_date: string
    activation_date: string
    payment_status: string
    payment_amount: number
    discount_applied: number
    email: string
    full_name: string
    course: {
        id: number
        title: string
        slug: string
        thumbnail_url: string
        difficulty_level: string
        instructor: {
            name: string
            avatar?: string
        } | null
    }
    progress: {
        completed_lessons: number
        total_lessons: number
        percentage: number
        last_accessed: string | null
        total_time_spent: number
    }
}

interface EnrolledCourse {
    id: string
    title: string
    slug: string
    thumbnail_url?: string
    instructor: {
        name: string
        avatar?: string
    }
    progress: number
    status: 'active' | 'completed' | 'expired' | 'suspended'
    enrollment_date: string
    last_accessed?: string
    next_lesson?: {
        id: string
        title: string
        url: string
    }
    total_lessons: number
    completed_lessons: number
    certificate_available?: boolean
    rating?: number
    firstLessonId?: number | null
}

export default function MyCoursesPage() {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [isLoading, setIsLoading] = useState(true)
    const [courses, setCourses] = useState<EnrolledCourse[]>([])
    const [error, setError] = useState<string | null>(null)

    // Cache for lesson data to avoid repeated API calls
    const [lessonsCache, setLessonsCache] = useState<Record<string, any>>({})

    // Helper function to get lesson information for a course
    const getLessonInfo = async (courseSlug: string, completedLessons: number, totalLessons: number) => {
        try {
            // Check cache first
            if (lessonsCache[courseSlug]) {
                const cached = lessonsCache[courseSlug]
                return {
                    firstLessonId: cached.firstLessonId,
                    nextLessonId: completedLessons < totalLessons ? cached.lessons[completedLessons]?.id : null
                }
            }

            // Fetch lesson data if not cached
            const courseData = await lessonsService.getCourseWithLessons(courseSlug)
            const allLessons = courseData.modules.flatMap(module => module.lessons)

            // Cache the data
            setLessonsCache(prev => ({
                ...prev,
                [courseSlug]: {
                    firstLessonId: allLessons[0]?.id,
                    lessons: allLessons
                }
            }))

            return {
                firstLessonId: allLessons[0]?.id,
                nextLessonId: completedLessons < totalLessons ? allLessons[completedLessons]?.id : null
            }
        } catch (error) {
            console.error(`Failed to get lesson info for ${courseSlug}:`, error)
            return {
                firstLessonId: null,
                nextLessonId: null
            }
        }
    }

    // Real API call to get enrolled courses
    useEffect(() => {
        const fetchMyCourses = async () => {
            setIsLoading(true)
            setError(null)

            try {
                // Use real API to get enrollments
                const enrollments = await enrollmentService.getUserEnrollments()

                // Map enrollment data to course format for UI with real lesson IDs
                const filteredEnrollments = enrollments.filter((enrollment: ApiEnrollment) => enrollment.access_granted)

                const mappedCourses: EnrolledCourse[] = await Promise.all(
                    filteredEnrollments.map(async (enrollment: ApiEnrollment) => {
                        // Get real progress data from API response
                        const progressPercentage = enrollment.progress?.percentage || 0
                        const totalLessons = enrollment.progress?.total_lessons || 0
                        const completedLessons = enrollment.progress?.completed_lessons || 0
                        const courseSlug = enrollment.course?.slug || enrollment.course_id.toString().toLowerCase()

                        // Get real lesson IDs
                        const lessonInfo = await getLessonInfo(courseSlug, completedLessons, totalLessons)

                        return {
                            id: enrollment.course_id.toString(),
                            title: enrollment.course?.title || `Course ${enrollment.course_id}`,
                            slug: courseSlug,
                            thumbnail_url: enrollment.course?.thumbnail_url || '/placeholder.jpg',
                            instructor: {
                                name: enrollment.course?.instructor?.name || 'Chưa có giảng viên',
                                avatar: enrollment.course?.instructor?.avatar || '/instructor-avatar.jpg'
                            },
                            progress: progressPercentage,
                            status: mapEnrollmentStatusToCourseStatus(enrollment.status, enrollment.access_granted),
                            enrollment_date: enrollment.enrollment_date,
                            last_accessed: enrollment.progress?.last_accessed || enrollment.enrollment_date,
                            next_lesson: lessonInfo.nextLessonId ? {
                                id: lessonInfo.nextLessonId.toString(),
                                title: `Lesson ${completedLessons + 1}`,
                                url: `/courses/${courseSlug}/lessons/${lessonInfo.nextLessonId}`
                            } : undefined,
                            total_lessons: totalLessons,
                            completed_lessons: completedLessons,
                            certificate_available: progressPercentage >= 100,
                            rating: undefined, // Course rating not available in enrollment data
                            // Store first lesson ID for navigation
                            firstLessonId: lessonInfo.firstLessonId
                        }
                    })
                )

                setCourses(mappedCourses)
            } catch (err) {
                console.error('Failed to fetch enrolled courses:', err)
                setError('Không thể tải danh sách khóa học. Vui lòng thử lại sau.')

                // Fallback to empty array on error
                setCourses([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchMyCourses()
    }, [])

    // Helper function to map enrollment status to course status
    const mapEnrollmentStatusToCourseStatus = (
        enrollmentStatus: string,
        hasAccess: boolean
    ): EnrolledCourse['status'] => {
        if (!hasAccess) return 'suspended'

        switch (enrollmentStatus) {
            case 'active':
                return 'active'
            case 'enrolled':
                return 'active'
            case 'activating':
                return 'active'
            case 'cancelled':
                return 'suspended'
            case 'pending':
            case 'payment_pending':
                return 'suspended'
            case 'completed':
                return 'completed'
            default:
                return 'active'
        }
    }

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.instructor.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || course.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            active: { variant: 'default' as const, text: 'Đang học', icon: PlayCircle },
            completed: { variant: 'secondary' as const, text: 'Hoàn thành', icon: CheckCircle },
            expired: { variant: 'destructive' as const, text: 'Hết hạn', icon: Clock },
            suspended: { variant: 'outline' as const, text: 'Tạm dừng', icon: AlertCircle }
        }

        const config = statusConfig[status as keyof typeof statusConfig]
        const Icon = config.icon

        return (
            <Badge variant={config.variant} className="flex items-center gap-1">
                <Icon className="h-3 w-3" />
                {config.text}
            </Badge>
        )
    }

    const handleContinueLearning = (course: EnrolledCourse) => {
        if (course.status === 'completed') {
            // Go to first lesson for review
            if (course.firstLessonId) {
                router.push(`/courses/${course.slug}/lessons/${course.firstLessonId}`)
            } else {
                // Fallback to course page if no lesson ID available
                router.push(`/courses/${course.slug}`)
            }
        } else if (course.next_lesson) {
            // Continue from next lesson (URL already has correct lesson ID)
            router.push(course.next_lesson.url as any)
        } else {
            // Start from beginning
            if (course.firstLessonId) {
                router.push(`/courses/${course.slug}/lessons/${course.firstLessonId}`)
            } else {
                // Fallback to course page if no lesson ID available
                router.push(`/courses/${course.slug}`)
            }
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-muted rounded mb-4 w-64"></div>
                    <div className="h-4 bg-muted rounded mb-8 w-48"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Card key={i} className="animate-pulse">
                                <div className="h-48 bg-muted rounded-t-lg"></div>
                                <CardContent className="p-4">
                                    <div className="h-4 bg-muted rounded mb-2"></div>
                                    <div className="h-3 bg-muted rounded mb-4 w-2/3"></div>
                                    <div className="h-2 bg-muted rounded mb-2"></div>
                                    <div className="h-8 bg-muted rounded"></div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Khóa học của tôi</h1>
                <p className="text-muted-foreground">
                    Bạn đang tham gia {courses.length} khóa học
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Tìm kiếm khóa học..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="active">Đang học</SelectItem>
                        <SelectItem value="completed">Hoàn thành</SelectItem>
                        <SelectItem value="expired">Hết hạn</SelectItem>
                        <SelectItem value="suspended">Tạm dừng</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Error State */}
            {error ? (
                <Card className="text-center py-12">
                    <CardContent>
                        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Có lỗi xảy ra</h3>
                        <p className="text-muted-foreground mb-4">{error}</p>
                        <Button onClick={() => window.location.reload()}>
                            Thử lại
                        </Button>
                    </CardContent>
                </Card>
            ) : /* Course Grid */
                filteredCourses.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardContent>
                            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">
                                {searchTerm || statusFilter !== 'all' ? 'Không tìm thấy khóa học' : 'Chưa có khóa học'}
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                {searchTerm || statusFilter !== 'all'
                                    ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc'
                                    : 'Hãy khám phá và đăng ký các khóa học mới'
                                }
                            </p>
                            <Button onClick={() => router.push('/courses')}>
                                Khám phá khóa học
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course) => (
                            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="relative">
                                    <img
                                        src={course.thumbnail_url || '/placeholder.jpg'}
                                        alt={course.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="absolute top-3 left-3">
                                        {getStatusBadge(course.status)}
                                    </div>
                                    {course.certificate_available && (
                                        <div className="absolute top-3 right-3">
                                            <Badge variant="outline" className="bg-white/90">
                                                Chứng chỉ
                                            </Badge>
                                        </div>
                                    )}
                                </div>

                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-semibold text-lg line-clamp-2 flex-1">
                                            {course.title}
                                        </h3>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Tải xuống
                                                </DropdownMenuItem>
                                                {course.certificate_available && (
                                                    <DropdownMenuItem>
                                                        <CheckCircle className="h-4 w-4 mr-2" />
                                                        Tải chứng chỉ
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <p className="text-sm text-muted-foreground mb-3 flex items-center">
                                        <BookOpen className="h-4 w-4 mr-1" />
                                        {course.instructor.name}
                                    </p>

                                    <div className="space-y-3">
                                        {/* Progress */}
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Tiến độ</span>
                                                <span>{course.progress}%</span>
                                            </div>
                                            <Progress value={course.progress} className="h-2" />
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {course.completed_lessons}/{course.total_lessons} bài học
                                            </p>
                                        </div>

                                        {/* Next lesson or status */}
                                        {course.status === 'active' && course.next_lesson ? (
                                            <div className="text-sm">
                                                <p className="text-muted-foreground">Bài tiếp theo:</p>
                                                <p className="font-medium line-clamp-1">{course.next_lesson.title}</p>
                                            </div>
                                        ) : course.status === 'completed' ? (
                                            <div className="flex items-center text-sm text-green-600">
                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                Đã hoàn thành
                                            </div>
                                        ) : null}

                                        {/* Action Button */}
                                        <Button
                                            onClick={() => handleContinueLearning(course)}
                                            className="w-full"
                                            variant={course.status === 'completed' ? 'outline' : 'default'}
                                        >
                                            {course.status === 'completed' ? (
                                                <>
                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                    Ôn tập
                                                </>
                                            ) : (
                                                <>
                                                    <PlayCircle className="h-4 w-4 mr-2" />
                                                    Tiếp tục học
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
        </>
    )
}
