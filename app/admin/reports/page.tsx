'use client'

/**
 * Admin Reports Page
 * Comprehensive reporting and analytics dashboard for administrators
 */

import { useState, useEffect } from 'react'
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Calendar,
    Download,
    Filter,
    Users,
    BookOpen,
    DollarSign,
    Activity,
    Eye,
    Clock,
    Target,
    Award,
    PieChart,
    LineChart,
    MoreHorizontal
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'

// Mock report data
const overviewStats = {
    totalRevenue: 128600000,
    revenueGrowth: 15.2,
    totalUsers: 1247,
    userGrowth: 12.4,
    totalCourses: 156,
    courseGrowth: 8.7,
    totalEnrollments: 12847,
    enrollmentGrowth: 22.1
}

const monthlyData = [
    { month: 'Jan 2024', revenue: 8200000, users: 89, courses: 12, enrollments: 856 },
    { month: 'Feb 2024', revenue: 9400000, users: 156, courses: 8, enrollments: 1234 },
    { month: 'Mar 2024', revenue: 10800000, users: 234, courses: 15, enrollments: 1456 },
    { month: 'Apr 2024', revenue: 12200000, users: 189, courses: 11, enrollments: 1678 },
    { month: 'May 2024', revenue: 11600000, users: 167, courses: 9, enrollments: 1523 },
    { month: 'Jun 2024', revenue: 13800000, users: 298, courses: 18, enrollments: 1889 }
]

const topCourses = [
    {
        id: 1,
        title: 'React Advanced Patterns',
        instructor: 'Trần Thị Lan',
        enrollments: 342,
        revenue: 4560000,
        rating: 4.9,
        completionRate: 87
    },
    {
        id: 2,
        title: 'Digital Marketing 2024',
        instructor: 'Nguyễn Hữu Đức',
        enrollments: 289,
        revenue: 3890000,
        rating: 4.7,
        completionRate: 92
    },
    {
        id: 3,
        title: 'UI/UX Design Fundamentals',
        instructor: 'Lê Thị Minh Châu',
        enrollments: 234,
        revenue: 3120000,
        rating: 4.8,
        completionRate: 78
    },
    {
        id: 4,
        title: 'Python for Data Science',
        instructor: 'Dr. Phạm Minh Hoàng',
        enrollments: 198,
        revenue: 2890000,
        rating: 4.6,
        completionRate: 83
    },
    {
        id: 5,
        title: 'JavaScript Masterclass',
        instructor: 'Hoàng Văn Tuấn',
        enrollments: 167,
        revenue: 2340000,
        rating: 4.5,
        completionRate: 75
    }
]

const userEngagement = {
    dailyActiveUsers: 324,
    weeklyActiveUsers: 1247,
    monthlyActiveUsers: 3456,
    avgSessionDuration: 45, // minutes
    bounceRate: 32,
    courseCompletionRate: 68
}

const categoryPerformance = [
    { category: 'Programming', courses: 45, enrollments: 5234, revenue: 42600000 },
    { category: 'Design', courses: 28, enrollments: 3456, revenue: 28900000 },
    { category: 'Marketing', courses: 32, enrollments: 2890, revenue: 23400000 },
    { category: 'Data Science', courses: 18, enrollments: 1456, revenue: 18700000 },
    { category: 'Business', courses: 15, enrollments: 1234, revenue: 15600000 },
    { category: 'Languages', courses: 12, enrollments: 987, revenue: 12300000 }
]

export default function AdminReportsPage() {
    const [selectedPeriod, setSelectedPeriod] = useState('monthly')
    const [selectedMetric, setSelectedMetric] = useState('revenue')

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)
    }

    const formatPercentage = (value: number) => {
        return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Báo cáo hệ thống</h1>
                    <p className="text-muted-foreground">
                        Phân tích chi tiết về hiệu suất và tăng trưởng
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="daily">Hàng ngày</SelectItem>
                            <SelectItem value="weekly">Hàng tuần</SelectItem>
                            <SelectItem value="monthly">Hàng tháng</SelectItem>
                            <SelectItem value="yearly">Hàng năm</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Xuất báo cáo
                    </Button>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(overviewStats.totalRevenue)}
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center">
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                            {formatPercentage(overviewStats.revenueGrowth)} so với tháng trước
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Người dùng</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overviewStats.totalUsers.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground flex items-center">
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                            {formatPercentage(overviewStats.userGrowth)} so với tháng trước
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Khóa học</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overviewStats.totalCourses}</div>
                        <p className="text-xs text-muted-foreground flex items-center">
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                            {formatPercentage(overviewStats.courseGrowth)} so với tháng trước
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đăng ký học</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overviewStats.totalEnrollments.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground flex items-center">
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                            {formatPercentage(overviewStats.enrollmentGrowth)} so với tháng trước
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                    <TabsTrigger value="courses">Khóa học</TabsTrigger>
                    <TabsTrigger value="users">Người dùng</TabsTrigger>
                    <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Monthly Performance */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Hiệu suất theo tháng</CardTitle>
                                <CardDescription>
                                    Doanh thu và đăng ký học trong 6 tháng qua
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {monthlyData.slice(-3).map((month, index) => (
                                        <div key={month.month} className="flex items-center justify-between">
                                            <div>
                                                <div className="font-medium">{month.month}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {month.enrollments} đăng ký mới
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium">
                                                    {formatCurrency(month.revenue)}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {month.courses} khóa học mới
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* User Engagement */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Tương tác người dùng</CardTitle>
                                <CardDescription>
                                    Thống kê hoạt động và tương tác của người dùng
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Người dùng hoạt động hàng ngày</span>
                                        <span className="text-sm">{userEngagement.dailyActiveUsers}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Thời gian học trung bình</span>
                                        <span className="text-sm">{userEngagement.avgSessionDuration} phút</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Tỷ lệ hoàn thành khóa học</span>
                                        <span className="text-sm">{userEngagement.courseCompletionRate}%</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Tỷ lệ hoàn thành</span>
                                            <span>{userEngagement.courseCompletionRate}%</span>
                                        </div>
                                        <Progress value={userEngagement.courseCompletionRate} />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Tỷ lệ thoát (Bounce Rate)</span>
                                            <span>{userEngagement.bounceRate}%</span>
                                        </div>
                                        <Progress value={userEngagement.bounceRate} className="bg-red-100" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="courses" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Top Performing Courses */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Khóa học hàng đầu</CardTitle>
                                <CardDescription>
                                    Top 5 khóa học có doanh thu cao nhất
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {topCourses.map((course, index) => (
                                        <div key={course.id} className="flex items-center space-x-4">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium truncate">{course.title}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {course.instructor} • {course.enrollments} học viên
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium">
                                                    {formatCurrency(course.revenue)}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {course.completionRate}% hoàn thành
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Category Performance */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Hiệu suất theo danh mục</CardTitle>
                                <CardDescription>
                                    Phân tích doanh thu theo từng danh mục
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {categoryPerformance.slice(0, 4).map((category) => (
                                        <div key={category.category} className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">{category.category}</span>
                                                <span className="text-sm text-muted-foreground">
                                                    {formatCurrency(category.revenue)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>{category.courses} khóa học</span>
                                                <span>{category.enrollments.toLocaleString()} đăng ký</span>
                                            </div>
                                            <Progress
                                                value={(category.revenue / categoryPerformance[0].revenue) * 100}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="users" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Người dùng hoạt động</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-blue-600">
                                            {userEngagement.dailyActiveUsers}
                                        </div>
                                        <div className="text-sm text-muted-foreground">Hàng ngày</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">
                                            {userEngagement.weeklyActiveUsers.toLocaleString()}
                                        </div>
                                        <div className="text-sm text-muted-foreground">Hàng tuần</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-purple-600">
                                            {userEngagement.monthlyActiveUsers.toLocaleString()}
                                        </div>
                                        <div className="text-sm text-muted-foreground">Hàng tháng</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Thời gian học</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-orange-600">
                                            {userEngagement.avgSessionDuration}
                                        </div>
                                        <div className="text-sm text-muted-foreground">Phút/phiên</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">Phân bố thời gian học</div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span>0-30 phút</span>
                                                <span>35%</span>
                                            </div>
                                            <Progress value={35} />
                                            <div className="flex justify-between text-xs">
                                                <span>30-60 phút</span>
                                                <span>45%</span>
                                            </div>
                                            <Progress value={45} />
                                            <div className="flex justify-between text-xs">
                                                <span>60+ phút</span>
                                                <span>20%</span>
                                            </div>
                                            <Progress value={20} />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Hoàn thành khóa học</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-green-600">
                                            {userEngagement.courseCompletionRate}%
                                        </div>
                                        <div className="text-sm text-muted-foreground">Tỷ lệ hoàn thành</div>
                                    </div>
                                    <div className="space-y-2">
                                        <Progress value={userEngagement.courseCompletionRate} />
                                        <div className="text-xs text-muted-foreground text-center">
                                            Trung bình ngành: 65%
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="revenue" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Xu hướng doanh thu</CardTitle>
                                <CardDescription>
                                    Doanh thu theo tháng trong 6 tháng qua
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {monthlyData.map((month) => (
                                        <div key={month.month} className="flex items-center justify-between">
                                            <div>
                                                <div className="font-medium">{month.month}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {month.enrollments} đăng ký
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium">
                                                    {formatCurrency(month.revenue)}
                                                </div>
                                                <div className="text-sm text-green-600">
                                                    +{((month.revenue / 8000000 - 1) * 100).toFixed(1)}%
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Doanh thu theo danh mục</CardTitle>
                                <CardDescription>
                                    Phân bố doanh thu theo từng danh mục khóa học
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {categoryPerformance.map((category) => (
                                        <div key={category.category} className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">{category.category}</span>
                                                <span className="text-sm font-medium">
                                                    {formatCurrency(category.revenue)}
                                                </span>
                                            </div>
                                            <Progress
                                                value={(category.revenue / categoryPerformance[0].revenue) * 100}
                                            />
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>{category.courses} khóa học</span>
                                                <span>
                                                    {((category.revenue / overviewStats.totalRevenue) * 100).toFixed(1)}% tổng doanh thu
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
