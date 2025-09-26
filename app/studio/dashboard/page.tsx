'use client'

/**
 * Instructor Dashboard Overview Page
 * Main dashboard with key metrics and insights for instructors
 */

import { useState, useEffect } from 'react'
import {
    BarChart3,
    BookOpen,
    Users,
    DollarSign,
    Star,
    TrendingUp,
    TrendingDown,
    Eye,
    PlayCircle,
    MessageSquare,
    Clock,
    Target,
    Award,
    Calendar,
    Activity
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Mock data for instructor dashboard
const dashboardStats = {
    totalStudents: 1247,
    activeCourses: 8,
    monthlyEarnings: 15600000,
    averageRating: 4.8,
    totalViews: 25678,
    completionRate: 72,
    newStudentsThisMonth: 189,
    earningsGrowth: 24.5
}

const recentCourses = [
    {
        id: 1,
        title: 'React Advanced Patterns',
        students: 342,
        rating: 4.9,
        revenue: 4560000,
        views: 5234,
        status: 'published',
        progress: 95
    },
    {
        id: 2,
        title: 'JavaScript ES6+ Complete Guide',
        students: 289,
        rating: 4.7,
        revenue: 3890000,
        views: 4567,
        status: 'published',
        progress: 88
    },
    {
        id: 3,
        title: 'Next.js Full Stack Development',
        students: 198,
        rating: 4.8,
        revenue: 2890000,
        views: 3456,
        status: 'draft',
        progress: 65
    }
]

const recentActivities = [
    {
        id: 1,
        type: 'enrollment',
        message: 'Nguyễn Văn An đã đăng ký khóa học React Advanced Patterns',
        timestamp: '5 phút trước',
        course: 'React Advanced Patterns'
    },
    {
        id: 2,
        type: 'review',
        message: 'Trần Thị Bích đã đánh giá 5 sao cho JavaScript ES6+',
        timestamp: '12 phút trước',
        course: 'JavaScript ES6+ Complete Guide'
    },
    {
        id: 3,
        type: 'completion',
        message: 'Lê Minh Cường đã hoàn thành 85% khóa học React Advanced',
        timestamp: '1 giờ trước',
        course: 'React Advanced Patterns'
    },
    {
        id: 4,
        type: 'question',
        message: 'Phạm Thị Diệu đã đặt câu hỏi trong bài giảng Hooks',
        timestamp: '2 giờ trước',
        course: 'React Advanced Patterns'
    }
]

const upcomingTasks = [
    {
        id: 1,
        task: 'Cập nhật bài giảng về React 18 Features',
        course: 'React Advanced Patterns',
        dueDate: '2024-01-25',
        priority: 'high'
    },
    {
        id: 2,
        task: 'Trả lời 5 câu hỏi từ học viên',
        course: 'JavaScript ES6+',
        dueDate: '2024-01-23',
        priority: 'medium'
    },
    {
        id: 3,
        task: 'Hoàn thành module Authentication',
        course: 'Next.js Full Stack',
        dueDate: '2024-01-28',
        priority: 'high'
    }
]

const monthlyData = [
    { month: 'T7', students: 45, earnings: 6200000, views: 3456 },
    { month: 'T8', students: 67, earnings: 8900000, views: 4123 },
    { month: 'T9', students: 89, earnings: 12400000, views: 5234 },
    { month: 'T10', students: 123, earnings: 16800000, views: 6789 },
    { month: 'T11', students: 156, earnings: 18900000, views: 7456 },
    { month: 'T12', students: 189, earnings: 15600000, views: 6234 }
]

export default function InstructorDashboard() {
    const [selectedPeriod, setSelectedPeriod] = useState('monthly')

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)
    }

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'enrollment':
                return <Users className="h-4 w-4 text-blue-500" />
            case 'review':
                return <Star className="h-4 w-4 text-yellow-500" />
            case 'completion':
                return <Target className="h-4 w-4 text-green-500" />
            case 'question':
                return <MessageSquare className="h-4 w-4 text-purple-500" />
            default:
                return <Activity className="h-4 w-4 text-gray-500" />
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-800'
            case 'medium':
                return 'bg-yellow-100 text-yellow-800'
            case 'low':
                return 'bg-green-100 text-green-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Giảng viên</h1>
                <p className="text-muted-foreground">
                    Tổng quan về hoạt động giảng dạy và thu nhập của bạn
                </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng học viên</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardStats.totalStudents.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground flex items-center">
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                            +{dashboardStats.newStudentsThisMonth} trong tháng này
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Khóa học</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboardStats.activeCourses}</div>
                        <p className="text-xs text-muted-foreground">
                            6 đã xuất bản, 2 đang soạn thảo
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Thu nhập tháng</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {formatCurrency(dashboardStats.monthlyEarnings)}
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center">
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                            +{dashboardStats.earningsGrowth}% so với tháng trước
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đánh giá TB</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{dashboardStats.averageRating}</div>
                        <p className="text-xs text-muted-foreground">
                            Dựa trên 1,247 đánh giá
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Course Performance */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Course Performance */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Hiệu suất khóa học</CardTitle>
                            <CardDescription>
                                Thống kê về các khóa học của bạn
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentCourses.map((course) => (
                                    <div key={course.id} className="border rounded-lg p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h4 className="font-medium">{course.title}</h4>
                                                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                                                    <span>{course.students} học viên</span>
                                                    <span>★ {course.rating}</span>
                                                    <span>{course.views.toLocaleString()} lượt xem</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium text-green-600">
                                                    {formatCurrency(course.revenue)}
                                                </div>
                                                <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                                                    {course.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span>Tiến độ hoàn thành</span>
                                                <span>{course.progress}%</span>
                                            </div>
                                            <Progress value={course.progress} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Monthly Performance Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Thống kê theo tháng</CardTitle>
                            <CardDescription>
                                Xu hướng học viên và thu nhập trong 6 tháng qua
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {monthlyData.slice(-3).map((month, index) => (
                                    <div key={month.month} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="text-sm font-medium">{month.month}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {month.students} học viên mới
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium">
                                                {formatCurrency(month.earnings)}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {month.views.toLocaleString()} lượt xem
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Activities & Tasks */}
                <div className="space-y-6">
                    {/* Recent Activities */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Hoạt động gần đây</CardTitle>
                            <CardDescription>
                                Cập nhật mới nhất từ học viên
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivities.map((activity) => (
                                    <div key={activity.id} className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 mt-1">
                                            {getActivityIcon(activity.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium">{activity.message}</p>
                                            <div className="flex items-center justify-between mt-1">
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {activity.course}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {activity.timestamp}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upcoming Tasks */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Nhiệm vụ sắp tới</CardTitle>
                            <CardDescription>
                                Các công việc cần hoàn thành
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {upcomingTasks.map((task) => (
                                    <div key={task.id} className="border rounded-lg p-3">
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="text-sm font-medium">{task.task}</h4>
                                            <Badge className={getPriorityColor(task.priority)}>
                                                {task.priority === 'high' ? 'Cao' :
                                                    task.priority === 'medium' ? 'TB' : 'Thấp'}
                                            </Badge>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            <div>{task.course}</div>
                                            <div className="flex items-center mt-1">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                Hạn: {task.dueDate}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button className="w-full mt-4" variant="outline">
                                Xem tất cả nhiệm vụ
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Thống kê nhanh</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Lượt xem tuần này</span>
                                    <span className="font-medium">{dashboardStats.totalViews.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Tỷ lệ hoàn thành</span>
                                    <span className="font-medium">{dashboardStats.completionRate}%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Câu hỏi chưa trả lời</span>
                                    <span className="font-medium text-orange-600">7</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Đánh giá mới</span>
                                    <span className="font-medium text-blue-600">12</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
