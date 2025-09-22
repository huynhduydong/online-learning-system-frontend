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
    Star,
    Calendar,
    TrendingUp,
    ArrowLeft,
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

import { useAuth } from '@/contexts/auth-context'
import { useDashboard } from '@/hooks/use-dashboard'
import { formatCurrency } from '@/lib/utils'

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
}

export default function MyCoursesPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [isLoading, setIsLoading] = useState(true)
    const [courses, setCourses] = useState<EnrolledCourse[]>([])

    // Mock data - replace with real API call
    useEffect(() => {
        const fetchMyCourses = async () => {
            setIsLoading(true)

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Mock enrolled courses data
            const mockCourses: EnrolledCourse[] = [
                {
                    id: '1',
                    title: 'React Fundamentals',
                    slug: 'react-fundamentals',
                    thumbnail_url: '/react-course.jpg',
                    instructor: {
                        name: 'John Doe',
                        avatar: '/instructor-avatar.jpg'
                    },
                    progress: 65,
                    status: 'active',
                    enrollment_date: '2024-01-15',
                    last_accessed: '2024-01-20',
                    next_lesson: {
                        id: '7',
                        title: 'State Management with Hooks',
                        url: '/courses/react-fundamentals/lessons/7'
                    },
                    total_lessons: 12,
                    completed_lessons: 8,
                    rating: 4.8
                },
                {
                    id: '2',
                    title: 'Digital Marketing Strategy',
                    slug: 'digital-marketing-strategy',
                    thumbnail_url: '/placeholder.jpg',
                    instructor: {
                        name: 'Jane Smith',
                        avatar: '/instructor-avatar-2.jpg'
                    },
                    progress: 100,
                    status: 'completed',
                    enrollment_date: '2023-12-01',
                    last_accessed: '2024-01-10',
                    total_lessons: 15,
                    completed_lessons: 15,
                    certificate_available: true,
                    rating: 5.0
                },
                {
                    id: '3',
                    title: 'Advanced JavaScript Patterns',
                    slug: 'advanced-javascript',
                    thumbnail_url: '/placeholder.jpg',
                    instructor: {
                        name: 'Mike Johnson',
                        avatar: '/instructor-avatar.jpg'
                    },
                    progress: 25,
                    status: 'active',
                    enrollment_date: '2024-01-18',
                    last_accessed: '2024-01-19',
                    next_lesson: {
                        id: '3',
                        title: 'Prototype Chain Deep Dive',
                        url: '/courses/advanced-javascript/lessons/3'
                    },
                    total_lessons: 20,
                    completed_lessons: 5
                }
            ]

            setCourses(mockCourses)
            setIsLoading(false)
        }

        fetchMyCourses()
    }, [])

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
            router.push(`/courses/${course.slug}/lessons/1`)
        } else if (course.next_lesson) {
            // Continue from next lesson
            router.push(course.next_lesson.url as any)
        } else {
            // Start from beginning
            router.push(`/courses/${course.slug}/lessons/1`)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center gap-4 mb-8">
                        <Button variant="ghost" onClick={() => router.back()}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Quay lại
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">Khóa học của tôi</h1>
                            <p className="text-muted-foreground">Quản lý và tiếp tục học tập</p>
                        </div>
                    </div>

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
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold">Khóa học của tôi</h1>
                        <p className="text-muted-foreground">
                            Bạn đang tham gia {courses.length} khóa học
                        </p>
                    </div>
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

                {/* Course Grid */}
                {filteredCourses.length === 0 ? (
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
            </div>
        </div>
    )
}
