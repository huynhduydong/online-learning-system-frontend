'use client'

/**
 * Admin Analytics Page
 * Advanced data analytics and insights dashboard for administrators
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
    MoreHorizontal,
    Globe,
    Smartphone,
    Monitor,
    Tablet,
    MousePointer,
    PlayCircle,
    MessageSquare,
    Share2
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Mock analytics data
const overviewMetrics = {
    totalPageViews: 156789,
    uniqueVisitors: 45623,
    bounceRate: 32.4,
    avgSessionDuration: 8.5, // minutes
    conversionRate: 12.8,
    revenueGrowth: 24.6
}

const realTimeStats = {
    currentVisitors: 324,
    activePages: [
        { page: '/courses', visitors: 89, percentage: 27.5 },
        { page: '/courses/react-advanced', visitors: 56, percentage: 17.3 },
        { page: '/dashboard', visitors: 43, percentage: 13.3 },
        { page: '/login', visitors: 38, percentage: 11.7 },
        { page: '/register', visitors: 31, percentage: 9.6 }
    ],
    topCountries: [
        { country: 'Vietnam', visitors: 198, percentage: 61.1 },
        { country: 'Singapore', visitors: 45, percentage: 13.9 },
        { country: 'Thailand', visitors: 32, percentage: 9.9 },
        { country: 'Malaysia', visitors: 28, percentage: 8.6 },
        { country: 'Philippines', visitors: 21, percentage: 6.5 }
    ]
}

const deviceAnalytics = {
    desktop: { users: 25634, percentage: 56.2, sessions: 45678 },
    mobile: { users: 15234, percentage: 33.4, sessions: 28965 },
    tablet: { users: 4755, percentage: 10.4, sessions: 8756 }
}

const trafficSources = [
    { source: 'Organic Search', users: 18945, percentage: 41.5, growth: 12.3 },
    { source: 'Direct', users: 12678, percentage: 27.8, growth: 8.7 },
    { source: 'Social Media', users: 7834, percentage: 17.2, growth: 24.6 },
    { source: 'Email Marketing', users: 4523, percentage: 9.9, growth: 15.2 },
    { source: 'Paid Ads', users: 1643, percentage: 3.6, growth: -2.1 }
]

const courseAnalytics = [
    {
        id: 1,
        title: 'React Advanced Patterns',
        views: 5234,
        enrollments: 342,
        conversionRate: 6.5,
        revenue: 4560000,
        avgRating: 4.9,
        completionRate: 87
    },
    {
        id: 2,
        title: 'Digital Marketing 2024',
        views: 4567,
        enrollments: 289,
        conversionRate: 6.3,
        revenue: 3890000,
        avgRating: 4.7,
        completionRate: 92
    },
    {
        id: 3,
        title: 'UI/UX Design Fundamentals',
        views: 3892,
        enrollments: 234,
        conversionRate: 6.0,
        revenue: 3120000,
        avgRating: 4.8,
        completionRate: 78
    },
    {
        id: 4,
        title: 'Python for Data Science',
        views: 3456,
        enrollments: 198,
        conversionRate: 5.7,
        revenue: 2890000,
        avgRating: 4.6,
        completionRate: 83
    }
]

const userBehavior = {
    avgPagesPerSession: 4.2,
    avgSessionDuration: 8.5,
    newVsReturning: {
        newUsers: 67.3,
        returningUsers: 32.7
    },
    topExitPages: [
        { page: '/courses/checkout', exits: 234, percentage: 15.6 },
        { page: '/login', exits: 189, percentage: 12.6 },
        { page: '/courses', exits: 167, percentage: 11.1 },
        { page: '/register', exits: 145, percentage: 9.7 }
    ]
}

export default function AdminAnalyticsPage() {
    const [selectedPeriod, setSelectedPeriod] = useState('7d')
    const [selectedMetric, setSelectedMetric] = useState('pageviews')

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
        return num.toString()
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)
    }

    const formatPercentage = (value: number, showSign: boolean = true) => {
        const sign = showSign && value > 0 ? '+' : ''
        return `${sign}${value.toFixed(1)}%`
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Phân tích dữ liệu</h1>
                    <p className="text-muted-foreground">
                        Thống kê chi tiết về người dùng, lưu lượng và hiệu suất
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="24h">24 giờ qua</SelectItem>
                            <SelectItem value="7d">7 ngày qua</SelectItem>
                            <SelectItem value="30d">30 ngày qua</SelectItem>
                            <SelectItem value="90d">90 ngày qua</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Xuất báo cáo
                    </Button>
                </div>
            </div>

            {/* Real-time Stats */}
            <Card className="border-green-200 bg-green-50/30">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Thống kê thời gian thực</span>
                    </CardTitle>
                    <CardDescription>
                        Người dùng đang hoạt động ngay bây giờ
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-green-600 mb-2">
                        {realTimeStats.currentVisitors.toLocaleString()} người dùng online
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-sm font-medium mb-3">Trang đang xem nhiều nhất</h4>
                            <div className="space-y-2">
                                {realTimeStats.activePages.slice(0, 3).map((page, index) => (
                                    <div key={page.page} className="flex items-center justify-between">
                                        <span className="text-sm truncate">{page.page}</span>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium">{page.visitors}</span>
                                            <span className="text-xs text-muted-foreground">
                                                ({page.percentage}%)
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium mb-3">Quốc gia truy cập nhiều nhất</h4>
                            <div className="space-y-2">
                                {realTimeStats.topCountries.slice(0, 3).map((country) => (
                                    <div key={country.country} className="flex items-center justify-between">
                                        <span className="text-sm">{country.country}</span>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium">{country.visitors}</span>
                                            <span className="text-xs text-muted-foreground">
                                                ({country.percentage}%)
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Overview Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Lượt xem trang</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatNumber(overviewMetrics.totalPageViews)}</div>
                        <p className="text-xs text-muted-foreground flex items-center">
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                            +12.5% so với tuần trước
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Người dùng duy nhất</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatNumber(overviewMetrics.uniqueVisitors)}</div>
                        <p className="text-xs text-muted-foreground flex items-center">
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                            +8.2% so với tuần trước
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tỷ lệ thoát</CardTitle>
                        <MousePointer className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overviewMetrics.bounceRate}%</div>
                        <p className="text-xs text-muted-foreground flex items-center">
                            <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
                            -2.1% so với tuần trước
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Thời gian trung bình</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overviewMetrics.avgSessionDuration}m</div>
                        <p className="text-xs text-muted-foreground flex items-center">
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                            +15.3% so với tuần trước
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tỷ lệ chuyển đổi</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overviewMetrics.conversionRate}%</div>
                        <p className="text-xs text-muted-foreground flex items-center">
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                            +3.7% so với tuần trước
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tăng trưởng doanh thu</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatPercentage(overviewMetrics.revenueGrowth)}</div>
                        <p className="text-xs text-muted-foreground flex items-center">
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                            So với tháng trước
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Analytics Tabs */}
            <Tabs defaultValue="traffic" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="traffic">Lưu lượng</TabsTrigger>
                    <TabsTrigger value="devices">Thiết bị</TabsTrigger>
                    <TabsTrigger value="courses">Khóa học</TabsTrigger>
                    <TabsTrigger value="behavior">Hành vi</TabsTrigger>
                </TabsList>

                <TabsContent value="traffic" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Traffic Sources */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Nguồn lưu lượng</CardTitle>
                                <CardDescription>
                                    Phân tích nguồn gốc của người dùng
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {trafficSources.map((source) => (
                                        <div key={source.source} className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">{source.source}</span>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm font-medium">
                                                        {formatNumber(source.users)}
                                                    </span>
                                                    <span className={`text-xs ${source.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {formatPercentage(source.growth)}
                                                    </span>
                                                </div>
                                            </div>
                                            <Progress value={source.percentage} />
                                            <div className="text-xs text-muted-foreground">
                                                {source.percentage}% tổng lưu lượng
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Geographic Data */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Phân bố địa lý</CardTitle>
                                <CardDescription>
                                    Người dùng theo quốc gia và khu vực
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {realTimeStats.topCountries.map((country) => (
                                        <div key={country.country} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <Globe className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">{country.country}</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium">{country.visitors}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {country.percentage}%
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="devices" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Monitor className="h-5 w-5" />
                                    <span>Desktop</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-600">
                                    {formatNumber(deviceAnalytics.desktop.users)}
                                </div>
                                <div className="text-sm text-muted-foreground mb-2">
                                    {deviceAnalytics.desktop.percentage}% người dùng
                                </div>
                                <div className="space-y-1">
                                    <div className="text-xs text-muted-foreground">Sessions</div>
                                    <div className="text-sm font-medium">
                                        {formatNumber(deviceAnalytics.desktop.sessions)}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Smartphone className="h-5 w-5" />
                                    <span>Mobile</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                    {formatNumber(deviceAnalytics.mobile.users)}
                                </div>
                                <div className="text-sm text-muted-foreground mb-2">
                                    {deviceAnalytics.mobile.percentage}% người dùng
                                </div>
                                <div className="space-y-1">
                                    <div className="text-xs text-muted-foreground">Sessions</div>
                                    <div className="text-sm font-medium">
                                        {formatNumber(deviceAnalytics.mobile.sessions)}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Tablet className="h-5 w-5" />
                                    <span>Tablet</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-purple-600">
                                    {formatNumber(deviceAnalytics.tablet.users)}
                                </div>
                                <div className="text-sm text-muted-foreground mb-2">
                                    {deviceAnalytics.tablet.percentage}% người dùng
                                </div>
                                <div className="space-y-1">
                                    <div className="text-xs text-muted-foreground">Sessions</div>
                                    <div className="text-sm font-medium">
                                        {formatNumber(deviceAnalytics.tablet.sessions)}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="courses" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Hiệu suất khóa học</CardTitle>
                            <CardDescription>
                                Phân tích chi tiết về lượt xem và chuyển đổi
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {courseAnalytics.map((course) => (
                                    <div key={course.id} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-medium">{course.title}</h4>
                                            <Badge variant="outline">
                                                {course.conversionRate}% chuyển đổi
                                            </Badge>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <div className="text-muted-foreground">Lượt xem</div>
                                                <div className="font-medium">{formatNumber(course.views)}</div>
                                            </div>
                                            <div>
                                                <div className="text-muted-foreground">Đăng ký</div>
                                                <div className="font-medium">{course.enrollments}</div>
                                            </div>
                                            <div>
                                                <div className="text-muted-foreground">Doanh thu</div>
                                                <div className="font-medium">{formatCurrency(course.revenue)}</div>
                                            </div>
                                            <div>
                                                <div className="text-muted-foreground">Hoàn thành</div>
                                                <div className="font-medium">{course.completionRate}%</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="behavior" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* User Behavior */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Hành vi người dùng</CardTitle>
                                <CardDescription>
                                    Phân tích cách người dùng tương tác với trang web
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Trang xem/phiên trung bình</span>
                                        <span className="text-sm">{userBehavior.avgPagesPerSession}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Thời gian phiên trung bình</span>
                                        <span className="text-sm">{userBehavior.avgSessionDuration} phút</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium">Người dùng mới vs cũ</div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span>Người dùng mới</span>
                                                <span>{userBehavior.newVsReturning.newUsers}%</span>
                                            </div>
                                            <Progress value={userBehavior.newVsReturning.newUsers} />
                                            <div className="flex justify-between text-xs">
                                                <span>Người dùng cũ</span>
                                                <span>{userBehavior.newVsReturning.returningUsers}%</span>
                                            </div>
                                            <Progress value={userBehavior.newVsReturning.returningUsers} />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Exit Pages */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Trang thoát nhiều nhất</CardTitle>
                                <CardDescription>
                                    Các trang người dùng thường rời khỏi website
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {userBehavior.topExitPages.map((page, index) => (
                                        <div key={page.page} className="flex items-center space-x-3">
                                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-medium">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium truncate">{page.page}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {page.exits} lượt thoát
                                                </div>
                                            </div>
                                            <div className="text-sm text-red-600">
                                                {page.percentage}%
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
