'use client'

/**
 * Admin Users Management Page
 * Comprehensive user management interface for administrators
 */

import { useState, useEffect } from 'react'
import {
    Users,
    Search,
    Filter,
    Plus,
    MoreHorizontal,
    Edit,
    Trash2,
    Ban,
    CheckCircle,
    Mail,
    Phone,
    Calendar,
    Download,
    Eye
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Mock user data - replace with real API calls
const mockUsers = [
    {
        id: 1,
        name: 'Nguyễn Văn An',
        email: 'nguyenvanan@email.com',
        role: 'student',
        status: 'active',
        joinedAt: '2024-01-15',
        lastActivity: '2024-01-20',
        coursesCount: 5,
        avatar: null
    },
    {
        id: 2,
        name: 'Trần Thị Bích',
        email: 'tranthybich@email.com',
        role: 'instructor',
        status: 'active',
        joinedAt: '2023-12-10',
        lastActivity: '2024-01-19',
        coursesCount: 12,
        avatar: null
    },
    {
        id: 3,
        name: 'Lê Minh Cường',
        email: 'leminhcuong@email.com',
        role: 'student',
        status: 'inactive',
        joinedAt: '2023-11-05',
        lastActivity: '2024-01-10',
        coursesCount: 2,
        avatar: null
    },
    {
        id: 4,
        name: 'Phạm Thị Diệu',
        email: 'phamthidieu@email.com',
        role: 'admin',
        status: 'active',
        joinedAt: '2023-10-01',
        lastActivity: '2024-01-20',
        coursesCount: 0,
        avatar: null
    },
    {
        id: 5,
        name: 'Hoàng Văn Em',
        email: 'hoangvanem@email.com',
        role: 'student',
        status: 'suspended',
        joinedAt: '2024-01-01',
        lastActivity: '2024-01-18',
        coursesCount: 3,
        avatar: null
    }
]

const userStats = {
    total: 1247,
    active: 1089,
    inactive: 98,
    suspended: 60,
    students: 1089,
    instructors: 43,
    admins: 15
}

const getRoleColor = (role: string) => {
    switch (role) {
        case 'admin':
            return 'bg-red-100 text-red-800'
        case 'instructor':
            return 'bg-blue-100 text-blue-800'
        case 'student':
            return 'bg-green-100 text-green-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'active':
            return 'bg-green-100 text-green-800'
        case 'inactive':
            return 'bg-yellow-100 text-yellow-800'
        case 'suspended':
            return 'bg-red-100 text-red-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState(mockUsers)
    const [filteredUsers, setFilteredUsers] = useState(mockUsers)
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [isLoading, setIsLoading] = useState(false)

    // Filter users based on search and filters
    useEffect(() => {
        let filtered = users

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Role filter
        if (roleFilter !== 'all') {
            filtered = filtered.filter(user => user.role === roleFilter)
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(user => user.status === statusFilter)
        }

        setFilteredUsers(filtered)
    }, [users, searchTerm, roleFilter, statusFilter])

    const handleUserAction = (userId: number, action: string) => {
        console.log(`Action ${action} for user ${userId}`)
        // Implement actual user actions here
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý người dùng</h1>
                    <p className="text-muted-foreground">
                        Quản lý tất cả người dùng trong hệ thống
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Xuất Excel
                    </Button>
                    <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm người dùng
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userStats.total.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            +12% so với tháng trước
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{userStats.active}</div>
                        <p className="text-xs text-muted-foreground">
                            87% tổng số người dùng
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Học viên</CardTitle>
                        <Users className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{userStats.students}</div>
                        <p className="text-xs text-muted-foreground">
                            {userStats.instructors} giảng viên
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bị tạm khóa</CardTitle>
                        <Ban className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{userStats.suspended}</div>
                        <p className="text-xs text-muted-foreground">
                            Cần xem xét
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh sách người dùng</CardTitle>
                    <CardDescription>
                        Quản lý và theo dõi tất cả người dùng trong hệ thống
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
                                    placeholder="Tìm theo tên hoặc email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                        <div>
                            <Label>Vai trò</Label>
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="student">Học viên</SelectItem>
                                    <SelectItem value="instructor">Giảng viên</SelectItem>
                                    <SelectItem value="admin">Quản trị</SelectItem>
                                </SelectContent>
                            </Select>
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
                                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                                    <SelectItem value="suspended">Bị khóa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Người dùng</TableHead>
                                    <TableHead>Vai trò</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead>Ngày tham gia</TableHead>
                                    <TableHead>Hoạt động cuối</TableHead>
                                    <TableHead>Khóa học</TableHead>
                                    <TableHead className="text-right">Hành động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={user.avatar || ''} />
                                                    <AvatarFallback>
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">{user.name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getRoleColor(user.role)}>
                                                {user.role === 'student' ? 'Học viên' :
                                                    user.role === 'instructor' ? 'Giảng viên' :
                                                        'Quản trị'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(user.status)}>
                                                {user.status === 'active' ? 'Hoạt động' :
                                                    user.status === 'inactive' ? 'Không hoạt động' :
                                                        'Bị khóa'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{user.joinedAt}</TableCell>
                                        <TableCell>{user.lastActivity}</TableCell>
                                        <TableCell>{user.coursesCount}</TableCell>
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
                                                        onClick={() => handleUserAction(user.id, 'view')}
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Xem chi tiết
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleUserAction(user.id, 'edit')}
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Chỉnh sửa
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleUserAction(user.id, 'email')}
                                                    >
                                                        <Mail className="mr-2 h-4 w-4" />
                                                        Gửi email
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    {user.status === 'active' ? (
                                                        <DropdownMenuItem
                                                            onClick={() => handleUserAction(user.id, 'suspend')}
                                                            className="text-red-600"
                                                        >
                                                            <Ban className="mr-2 h-4 w-4" />
                                                            Tạm khóa
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem
                                                            onClick={() => handleUserAction(user.id, 'activate')}
                                                            className="text-green-600"
                                                        >
                                                            <CheckCircle className="mr-2 h-4 w-4" />
                                                            Kích hoạt
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem
                                                        onClick={() => handleUserAction(user.id, 'delete')}
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Xóa tài khoản
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
                            Hiển thị {filteredUsers.length} trên tổng số {users.length} người dùng
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
