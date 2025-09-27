'use client'

/**
 * Admin Instructors Management Page
 * Instructor management interface for administrators
 */

import { useState, useEffect } from 'react'
import {
    GraduationCap,
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
    BookOpen,
    Award,
    Mail,
    Phone,
    Download,
    Calendar,
    DollarSign
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
import { Progress } from '@/components/ui/progress'

// Mock instructor data
const mockInstructors = [
    {
        id: 1,
        name: 'Trần Thị Lan',
        email: 'tranthilan@email.com',
        phone: '0901234567',
        specialization: 'Frontend Development',
        status: 'active',
        joinedAt: '2023-08-15',
        lastActivity: '2024-01-20',
        courses: 8,
        students: 1247,
        rating: 4.9,
        reviews: 156,
        earnings: 25600000,
        avatar: null,
        verified: true,
        bio: 'Chuyên gia Frontend với 8+ năm kinh nghiệm'
    },
    {
        id: 2,
        name: 'Dr. Phạm Minh Hoàng',
        email: 'phamminhhoang@email.com',
        phone: '0912345678',
        specialization: 'Machine Learning',
        status: 'pending',
        joinedAt: '2024-01-15',
        lastActivity: '2024-01-18',
        courses: 0,
        students: 0,
        rating: 0,
        reviews: 0,
        earnings: 0,
        avatar: null,
        verified: false,
        bio: 'Tiến sĩ AI/ML từ Đại học Stanford'
    },
    {
        id: 3,
        name: 'Nguyễn Hữu Đức',
        email: 'nguyenhuuduc@email.com',
        phone: '0923456789',
        specialization: 'Digital Marketing',
        status: 'active',
        joinedAt: '2023-11-20',
        lastActivity: '2024-01-19',
        courses: 5,
        students: 834,
        rating: 4.7,
        reviews: 89,
        earnings: 18200000,
        avatar: null,
        verified: true,
        bio: 'Marketing Manager với 6+ năm kinh nghiệm'
    },
    {
        id: 4,
        name: 'Lê Thị Minh Châu',
        email: 'leminhchau@email.com',
        phone: '0934567890',
        specialization: 'UI/UX Design',
        status: 'suspended',
        joinedAt: '2023-10-05',
        lastActivity: '2024-01-10',
        courses: 3,
        students: 245,
        rating: 4.2,
        reviews: 23,
        earnings: 6800000,
        avatar: null,
        verified: true,
        bio: 'Senior UX Designer tại các công ty top tech'
    },
    {
        id: 5,
        name: 'Hoàng Văn Tuấn',
        email: 'hoangvantuan@email.com',
        phone: '0945678901',
        specialization: 'Backend Development',
        status: 'inactive',
        joinedAt: '2023-09-12',
        lastActivity: '2024-01-05',
        courses: 2,
        students: 123,
        rating: 4.0,
        reviews: 12,
        earnings: 3400000,
        avatar: null,
        verified: false,
        bio: 'Full-stack developer with Node.js expertise'
    }
]

const instructorStats = {
    total: 43,
    active: 32,
    pending: 6,
    inactive: 3,
    suspended: 2,
    totalStudents: 12847,
    totalEarnings: 128600000,
    avgRating: 4.6
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'active':
            return 'bg-green-100 text-green-800'
        case 'pending':
            return 'bg-yellow-100 text-yellow-800'
        case 'inactive':
            return 'bg-gray-100 text-gray-800'
        case 'suspended':
            return 'bg-red-100 text-red-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}

export default function AdminInstructorsPage() {
    const [instructors, setInstructors] = useState(mockInstructors)
    const [filteredInstructors, setFilteredInstructors] = useState(mockInstructors)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [specializationFilter, setSpecializationFilter] = useState('all')

    // Filter instructors
    useEffect(() => {
        let filtered = instructors

        if (searchTerm) {
            filtered = filtered.filter(instructor =>
                instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                instructor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(instructor => instructor.status === statusFilter)
        }

        if (specializationFilter !== 'all') {
            filtered = filtered.filter(instructor => instructor.specialization === specializationFilter)
        }

        setFilteredInstructors(filtered)
    }, [instructors, searchTerm, statusFilter, specializationFilter])

    const handleInstructorAction = (instructorId: number, action: string) => {
        console.log(`Action ${action} for instructor ${instructorId}`)
        // Implement instructor actions
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý giảng viên</h1>
                    <p className="text-muted-foreground">
                        Quản lý và theo dõi tất cả giảng viên trong hệ thống
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Xuất danh sách
                    </Button>
                    <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Mời giảng viên
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng giảng viên</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{instructorStats.total}</div>
                        <p className="text-xs text-muted-foreground">
                            +3 giảng viên mới tháng này
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{instructorStats.active}</div>
                        <p className="text-xs text-muted-foreground">
                            {instructorStats.pending} chờ phê duyệt
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
                            {instructorStats.totalStudents.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Trung bình 299 học viên/giảng viên
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đánh giá TB</CardTitle>
                        <Star className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{instructorStats.avgRating}</div>
                        <p className="text-xs text-muted-foreground">
                            Dựa trên 1,247 đánh giá
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh sách giảng viên</CardTitle>
                    <CardDescription>
                        Quản lý và theo dõi tất cả giảng viên trong hệ thống
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
                                    placeholder="Tìm theo tên, email hoặc chuyên môn..."
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
                                    <SelectItem value="active">Hoạt động</SelectItem>
                                    <SelectItem value="pending">Chờ duyệt</SelectItem>
                                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                                    <SelectItem value="suspended">Bị tạm khóa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Chuyên môn</Label>
                            <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="Frontend Development">Frontend Dev</SelectItem>
                                    <SelectItem value="Backend Development">Backend Dev</SelectItem>
                                    <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                                    <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                                    <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Instructors Table */}
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Giảng viên</TableHead>
                                    <TableHead>Chuyên môn</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead>Khóa học</TableHead>
                                    <TableHead>Học viên</TableHead>
                                    <TableHead>Đánh giá</TableHead>
                                    <TableHead>Thu nhập</TableHead>
                                    <TableHead className="text-right">Hành động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredInstructors.map((instructor) => (
                                    <TableRow key={instructor.id}>
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={instructor.avatar || ''} />
                                                    <AvatarFallback>
                                                        {instructor.name.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-medium">{instructor.name}</span>
                                                        {instructor.verified && (
                                                            <CheckCircle className="h-4 w-4 text-blue-500" />
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {instructor.email}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        Tham gia: {instructor.joinedAt}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{instructor.specialization}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {instructor.bio}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(instructor.status)}>
                                                {instructor.status === 'active' ? 'Hoạt động' :
                                                    instructor.status === 'pending' ? 'Chờ duyệt' :
                                                        instructor.status === 'inactive' ? 'Không hoạt động' :
                                                            'Bị tạm khóa'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-center">
                                                <div className="font-medium">{instructor.courses}</div>
                                                <div className="text-xs text-muted-foreground">khóa học</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-center">
                                                <div className="font-medium">{instructor.students.toLocaleString()}</div>
                                                <div className="text-xs text-muted-foreground">học viên</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {instructor.rating > 0 ? (
                                                <div className="flex items-center space-x-1">
                                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                    <span className="text-sm font-medium">{instructor.rating}</span>
                                                    <span className="text-sm text-muted-foreground">
                                                        ({instructor.reviews})
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">Chưa có</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-center">
                                                <div className="font-medium">
                                                    {instructor.earnings.toLocaleString()} VND
                                                </div>
                                                <div className="text-xs text-muted-foreground">tổng thu nhập</div>
                                            </div>
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
                                                        onClick={() => handleInstructorAction(instructor.id, 'view')}
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Xem hồ sơ
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleInstructorAction(instructor.id, 'edit')}
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Chỉnh sửa
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleInstructorAction(instructor.id, 'courses')}
                                                    >
                                                        <BookOpen className="mr-2 h-4 w-4" />
                                                        Xem khóa học
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleInstructorAction(instructor.id, 'email')}
                                                    >
                                                        <Mail className="mr-2 h-4 w-4" />
                                                        Gửi email
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    {instructor.status === 'pending' && (
                                                        <>
                                                            <DropdownMenuItem
                                                                onClick={() => handleInstructorAction(instructor.id, 'approve')}
                                                                className="text-green-600"
                                                            >
                                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                                Phê duyệt
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleInstructorAction(instructor.id, 'reject')}
                                                                className="text-red-600"
                                                            >
                                                                <XCircle className="mr-2 h-4 w-4" />
                                                                Từ chối
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                    {instructor.status === 'active' && (
                                                        <DropdownMenuItem
                                                            onClick={() => handleInstructorAction(instructor.id, 'suspend')}
                                                            className="text-red-600"
                                                        >
                                                            <XCircle className="mr-2 h-4 w-4" />
                                                            Tạm khóa
                                                        </DropdownMenuItem>
                                                    )}
                                                    {instructor.status === 'suspended' && (
                                                        <DropdownMenuItem
                                                            onClick={() => handleInstructorAction(instructor.id, 'reactivate')}
                                                            className="text-green-600"
                                                        >
                                                            <CheckCircle className="mr-2 h-4 w-4" />
                                                            Kích hoạt lại
                                                        </DropdownMenuItem>
                                                    )}
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
                            Hiển thị {filteredInstructors.length} trên tổng số {instructors.length} giảng viên
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
