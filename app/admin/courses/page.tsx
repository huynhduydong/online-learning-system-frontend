'use client'

/**
 * Admin Courses Management Page
 * Course management interface for administrators
 */

import { useState, useEffect } from 'react'
import {
    BookOpen,
    Search,
    Filter,
    Plus,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    Star,
    Users,
    DollarSign,
    Download,
    Play,
    Pause
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// Mock course data
const mockCourses = [
    {
        id: 1,
        title: 'React Advanced Patterns',
        instructor: 'Trần Thị Lan',
        instructorId: 2,
        category: 'Programming',
        status: 'published',
        price: 1200000,
        enrollments: 342,
        rating: 4.8,
        reviews: 89,
        createdAt: '2024-01-10',
        lastUpdated: '2024-01-18',
        thumbnail: null,
        duration: '40 giờ',
        lessons: 25
    },
    {
        id: 2,
        title: 'Machine Learning Cơ Bản',
        instructor: 'Dr. Phạm Minh Hoàng',
        instructorId: 3,
        category: 'Data Science',
        status: 'pending',
        price: 1800000,
        enrollments: 0,
        rating: 0,
        reviews: 0,
        createdAt: '2024-01-15',
        lastUpdated: '2024-01-15',
        thumbnail: null,
        duration: '60 giờ',
        lessons: 40
    },
    {
        id: 3,
        title: 'Digital Marketing 2024',
        instructor: 'Nguyễn Hữu Đức',
        instructorId: 4,
        category: 'Marketing',
        status: 'published',
        price: 900000,
        enrollments: 156,
        rating: 4.5,
        reviews: 42,
        createdAt: '2023-12-20',
        lastUpdated: '2024-01-12',
        thumbnail: null,
        duration: '30 giờ',
        lessons: 18
    },
    {
        id: 4,
        title: 'UI/UX Design Masterclass',
        instructor: 'Lê Thị Minh Châu',
        instructorId: 5,
        category: 'Design',
        status: 'draft',
        price: 1500000,
        enrollments: 0,
        rating: 0,
        reviews: 0,
        createdAt: '2024-01-08',
        lastUpdated: '2024-01-16',
        thumbnail: null,
        duration: '45 giờ',
        lessons: 32
    },
    {
        id: 5,
        title: 'JavaScript ES6+ Complete Guide',
        instructor: 'Hoàng Văn Tuấn',
        instructorId: 6,
        category: 'Programming',
        status: 'rejected',
        price: 1100000,
        enrollments: 0,
        rating: 0,
        reviews: 0,
        createdAt: '2024-01-05',
        lastUpdated: '2024-01-14',
        thumbnail: null,
        duration: '35 giờ',
        lessons: 28
    }
]

const courseStats = {
    total: 156,
    published: 134,
    pending: 12,
    draft: 8,
    rejected: 2,
    totalEnrollments: 12847,
    totalRevenue: 45600000
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'published':
            return 'bg-green-100 text-green-800'
        case 'pending':
            return 'bg-yellow-100 text-yellow-800'
        case 'draft':
            return 'bg-blue-100 text-blue-800'
        case 'rejected':
            return 'bg-red-100 text-red-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}

const getCategoryColor = (category: string) => {
    switch (category) {
        case 'Programming':
            return 'bg-purple-100 text-purple-800'
        case 'Design':
            return 'bg-pink-100 text-pink-800'
        case 'Marketing':
            return 'bg-orange-100 text-orange-800'
        case 'Data Science':
            return 'bg-indigo-100 text-indigo-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}

export default function AdminCoursesPage() {
    const [courses, setCourses] = useState(mockCourses)
    const [filteredCourses, setFilteredCourses] = useState(mockCourses)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [categoryFilter, setCategoryFilter] = useState('all')

    // Filter courses
    useEffect(() => {
        let filtered = courses

        if (searchTerm) {
            filtered = filtered.filter(course =>
                course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(course => course.status === statusFilter)
        }

        if (categoryFilter !== 'all') {
            filtered = filtered.filter(course => course.category === categoryFilter)
        }

        setFilteredCourses(filtered)
    }, [courses, searchTerm, statusFilter, categoryFilter])

    const handleCourseAction = (courseId: number, action: string) => {
        console.log(`Action ${action} for course ${courseId}`)
        // Implement course actions
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý khóa học</h1>
                    <p className="text-muted-foreground">
                        Quản lý tất cả khóa học trong hệ thống
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Xuất báo cáo
                    </Button>
                    <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Tạo khóa học
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng khóa học</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{courseStats.total}</div>
                        <p className="text-xs text-muted-foreground">
                            +8 khóa học mới tháng này
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đã xuất bản</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{courseStats.published}</div>
                        <p className="text-xs text-muted-foreground">
                            {courseStats.pending} chờ phê duyệt
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng học viên</CardTitle>
                        <Users className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {courseStats.totalEnrollments.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Trung bình 82 học viên/khóa
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {courseStats.totalRevenue.toLocaleString()} VND
                        </div>
                        <p className="text-xs text-muted-foreground">
                            +15% so với tháng trước
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh sách khóa học</CardTitle>
                    <CardDescription>
                        Quản lý và theo dõi tất cả khóa học trong hệ thống
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Filters */}
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="flex-1">
                            <Label htmlFor="search">Tìm kiếm</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="search"
                                    placeholder="Tìm theo tên khóa học hoặc giảng viên..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                        <div>
                            <Label>Trạng thái</Label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="published">Đã xuất bản</SelectItem>
                                    <SelectItem value="pending">Chờ duyệt</SelectItem>
                                    <SelectItem value="draft">Bản nháp</SelectItem>
                                    <SelectItem value="rejected">Bị từ chối</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Danh mục</Label>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="Programming">Lập trình</SelectItem>
                                    <SelectItem value="Design">Thiết kế</SelectItem>
                                    <SelectItem value="Marketing">Marketing</SelectItem>
                                    <SelectItem value="Data Science">Data Science</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Courses Table */}
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Khóa học</TableHead>
                                    <TableHead>Giảng viên</TableHead>
                                    <TableHead>Danh mục</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead>Giá</TableHead>
                                    <TableHead>Học viên</TableHead>
                                    <TableHead>Đánh giá</TableHead>
                                    <TableHead className="text-right">Hành động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCourses.map((course) => (
                                    <TableRow key={course.id}>
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                <div className="h-12 w-16 bg-muted rounded-md flex items-center justify-center">
                                                    <BookOpen className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">{course.title}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {course.lessons} bài học • {course.duration}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{course.instructor}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getCategoryColor(course.category)}>
                                                {course.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(course.status)}>
                                                {course.status === 'published' ? 'Đã xuất bản' :
                                                    course.status === 'pending' ? 'Chờ duyệt' :
                                                        course.status === 'draft' ? 'Bản nháp' :
                                                            'Bị từ chối'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {course.price === 0 ? 'Miễn phí' : `${course.price.toLocaleString()} VND`}
                                        </TableCell>
                                        <TableCell>{course.enrollments}</TableCell>
                                        <TableCell>
                                            {course.rating > 0 ? (
                                                <div className="flex items-center space-x-1">
                                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                    <span className="text-sm font-medium">{course.rating}</span>
                                                    <span className="text-sm text-muted-foreground">
                                                        ({course.reviews})
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">Chưa có</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleCourseAction(course.id, 'view')}
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Xem chi tiết
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleCourseAction(course.id, 'edit')}
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Chỉnh sửa
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    {course.status === 'pending' && (
                                                        <>
                                                            <DropdownMenuItem
                                                                onClick={() => handleCourseAction(course.id, 'approve')}
                                                                className="text-green-600"
                                                            >
                                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                                Phê duyệt
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleCourseAction(course.id, 'reject')}
                                                                className="text-red-600"
                                                            >
                                                                <XCircle className="mr-2 h-4 w-4" />
                                                                Từ chối
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                    {course.status === 'published' && (
                                                        <DropdownMenuItem
                                                            onClick={() => handleCourseAction(course.id, 'unpublish')}
                                                            className="text-orange-600"
                                                        >
                                                            <Pause className="mr-2 h-4 w-4" />
                                                            Tạm dừng
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleCourseAction(course.id, 'delete')}
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Xóa khóa học
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between pt-4">
                        <div className="text-sm text-muted-foreground">
                            Hiển thị {filteredCourses.length} trên tổng số {courses.length} khóa học
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" disabled>
                                Trước
                            </Button>
                            <Button variant="outline" size="sm">
                                Tiếp
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
