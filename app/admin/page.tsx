'use client'

/**
 * Admin Dashboard Page
 * Main dashboard for system administrators
 */

import { useState, useEffect } from 'react'
import {
    Users,
    BookOpen,
    GraduationCap,
    Activity,
    TrendingUp,
    AlertTriangle,
    DollarSign,
    Clock
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Mock data for admin dashboard - replace with real API calls
const adminStats = {
    totalUsers: 1247,
    totalStudents: 1089,
    totalInstructors: 43,
    totalCourses: 156,
    activeCourses: 134,
    pendingCourses: 12,
    totalRevenue: 5642350,
    monthlyRevenue: 850000,
    systemHealth: 'good' as 'good' | 'warning' | 'critical'
}

const recentActivities = [
    {
        id: 1,
        type: 'user_registration',
        message: 'Người dùng mới đăng ký: Nguyễn Văn Nam',
        timestamp: '5 phút trước',
        icon: Users
    },
    {
        id: 2,
        type: 'course_created',
        message: 'Khóa học mới được tạo: "React Advanced Patterns"',
        timestamp: '12 phút trước',
        icon: BookOpen
    },
    {
        id: 3,
        type: 'instructor_approved',
        message: 'Giảng viên mới được phê duyệt: Trần Thị Lan',
        timestamp: '1 giờ trước',
        icon: GraduationCap
    },
    {
        id: 4,
        type: 'system_alert',
        message: 'Cảnh báo: CPU usage cao (85%)',
        timestamp: '2 giờ trước',
        icon: AlertTriangle
    }
]

const pendingApprovals = [
    {
        id: 1,
        type: 'course',
        title: 'Machine Learning cơ bản',
        instructor: 'Dr. Phạm Minh Hoàng',
        submittedAt: '2024-01-15',
        status: 'pending'
    },
    {
        id: 2,
        type: 'instructor',
        title: 'Đơn xin trở thành giảng viên',
        instructor: 'Lê Thị Minh',
        submittedAt: '2024-01-14',
        status: 'pending'
    },
    {
        id: 3,
        type: 'course',
        title: 'Docker & Kubernetes',
        instructor: 'Nguyễn Đức Anh',
        submittedAt: '2024-01-13',
        status: 'pending'
    }
]

export default function AdminDashboard() {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Simulate loading time
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="p-6">
                                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                                <div className="h-8 bg-muted rounded w-3/4"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Bảng điều khiển quản trị</h1>
                <p className="text-muted-foreground">
                    Tổng quan về hệ thống và các hoạt động quan trọng
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{adminStats.totalUsers.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            +12% so với tháng trước
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Khóa học</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{adminStats.totalCourses}</div>
                        <p className="text-xs text-muted-foreground">
                            {adminStats.activeCourses} đang hoạt động, {adminStats.pendingCourses} chờ duyệt
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Giảng viên</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{adminStats.totalInstructors}</div>
                        <p className="text-xs text-muted-foreground">
                            +3 giảng viên mới tháng này
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Doanh thu tháng</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {adminStats.monthlyRevenue.toLocaleString()} VND
                        </div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% so với tháng trước
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                    <TabsTrigger value="pending">Chờ phê duyệt</TabsTrigger>
                    <TabsTrigger value="system">Hệ thống</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Activities */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Hoạt động gần đây</CardTitle>
                                <CardDescription>
                                    Các hoạt động quan trọng trong hệ thống
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentActivities.map((activity) => {
                                        const IconComponent = activity.icon
                                        return (
                                            <div key={activity.id} className="flex items-start space-x-3">
                                                <div className="flex-shrink-0">
                                                    <IconComponent className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium">{activity.message}</p>
                                                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* System Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Trạng thái hệ thống</CardTitle>
                                <CardDescription>
                                    Tình trạng hoạt động của các thành phần hệ thống
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Server</span>
                                        <Badge variant="default">Online</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Database</span>
                                        <Badge variant="default">Healthy</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Storage</span>
                                        <Badge variant="secondary">85% sử dụng</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">CDN</span>
                                        <Badge variant="default">Active</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Backup</span>
                                        <Badge variant="default">Updated</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="pending" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Đang chờ phê duyệt</CardTitle>
                            <CardDescription>
                                Các yêu cầu cần được xét duyệt
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {pendingApprovals.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-medium">{item.title}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {item.type === 'course' ? 'Khóa học' : 'Giảng viên'} • {item.instructor}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Gửi lúc: {item.submittedAt}
                                            </p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button size="sm" variant="outline">
                                                Từ chối
                                            </Button>
                                            <Button size="sm">
                                                Phê duyệt
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="system" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Hiệu suất hệ thống</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium">CPU Usage</span>
                                            <span className="text-sm text-muted-foreground">65%</span>
                                        </div>
                                        <div className="w-full bg-secondary rounded-full h-2">
                                            <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium">Memory Usage</span>
                                            <span className="text-sm text-muted-foreground">78%</span>
                                        </div>
                                        <div className="w-full bg-secondary rounded-full h-2">
                                            <div className="bg-orange-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium">Disk Usage</span>
                                            <span className="text-sm text-muted-foreground">45%</span>
                                        </div>
                                        <div className="w-full bg-secondary rounded-full h-2">
                                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Thống kê truy cập</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Người dùng online</span>
                                        <span className="text-sm">324</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Lượt truy cập hôm nay</span>
                                        <span className="text-sm">12,847</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Trang xem nhiều nhất</span>
                                        <span className="text-sm">/courses</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Tỷ lệ thoát</span>
                                        <span className="text-sm">32%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
