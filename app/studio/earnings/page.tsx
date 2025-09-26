'use client'

/**
 * Instructor Earnings Page
 * Track revenue, payments and financial analytics
 */

import { useState } from 'react'
import {
    DollarSign,
    TrendingUp,
    Calendar,
    Download,
    CreditCard,
    Wallet,
    BarChart3,
    Eye
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Mock earnings data
const earningsStats = {
    totalEarnings: 45600000,
    thisMonthEarnings: 15600000,
    pendingPayouts: 8900000,
    availableBalance: 12300000,
    growthRate: 24.5,
    avgCourseRevenue: 5700000
}

const recentTransactions = [
    {
        id: 1,
        type: 'course_sale',
        course: 'React Advanced Patterns',
        student: 'Nguyễn Văn An',
        amount: 1200000,
        commission: 180000,
        netAmount: 1020000,
        date: '2024-01-20',
        status: 'completed'
    },
    {
        id: 2,
        type: 'course_sale',
        course: 'JavaScript ES6+',
        student: 'Trần Thị Bích',
        amount: 900000,
        commission: 135000,
        netAmount: 765000,
        date: '2024-01-19',
        status: 'completed'
    },
    {
        id: 3,
        type: 'payout',
        course: null,
        student: null,
        amount: 5000000,
        commission: 0,
        netAmount: 5000000,
        date: '2024-01-15',
        status: 'pending'
    }
]

const courseRevenue = [
    {
        course: 'React Advanced Patterns',
        totalSales: 342,
        revenue: 41040000,
        avgRating: 4.9
    },
    {
        course: 'JavaScript ES6+ Complete Guide',
        totalSales: 289,
        revenue: 26010000,
        avgRating: 4.7
    },
    {
        course: 'Next.js Full Stack Development',
        totalSales: 198,
        revenue: 23760000,
        avgRating: 4.8
    }
]

export default function InstructorEarningsPage() {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800'
            case 'pending':
                return 'bg-yellow-100 text-yellow-800'
            case 'failed':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Doanh thu & Thu nhập</h1>
                    <p className="text-muted-foreground">
                        Theo dõi thu nhập và quản lý thanh toán
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Xuất báo cáo
                    </Button>
                    <Button size="sm">
                        <Wallet className="h-4 w-4 mr-2" />
                        Rút tiền
                    </Button>
                </div>
            </div>

            {/* Earnings Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng thu nhập</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {formatCurrency(earningsStats.totalEarnings)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Tổng cộng từ tất cả khóa học
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Thu nhập tháng này</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {formatCurrency(earningsStats.thisMonthEarnings)}
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center">
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                            +{earningsStats.growthRate}% so với tháng trước
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Số dư khả dụng</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">
                            {formatCurrency(earningsStats.availableBalance)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Có thể rút ngay
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Chờ thanh toán</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">
                            {formatCurrency(earningsStats.pendingPayouts)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Sẽ được thanh toán trong 7 ngày
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                    <TabsTrigger value="transactions">Giao dịch</TabsTrigger>
                    <TabsTrigger value="courses">Theo khóa học</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Monthly Earnings Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Thu nhập theo tháng</CardTitle>
                                <CardDescription>
                                    Xu hướng doanh thu trong 6 tháng qua
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[
                                        { month: 'Tháng 7', amount: 8200000 },
                                        { month: 'Tháng 8', amount: 9400000 },
                                        { month: 'Tháng 9', amount: 11800000 },
                                        { month: 'Tháng 10', amount: 13200000 },
                                        { month: 'Tháng 11', amount: 14600000 },
                                        { month: 'Tháng 12', amount: 15600000 }
                                    ].map((data, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <span className="text-sm font-medium">{data.month}</span>
                                            <div className="text-right">
                                                <div className="font-medium">
                                                    {formatCurrency(data.amount)}
                                                </div>
                                                <Progress
                                                    value={(data.amount / 16000000) * 100}
                                                    className="w-20 mt-1"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Revenue Breakdown */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Phân tích doanh thu</CardTitle>
                                <CardDescription>
                                    Chi tiết thu nhập theo nguồn
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Doanh thu khóa học</span>
                                        <span className="font-medium">{formatCurrency(42300000)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Phí hoa hồng (-15%)</span>
                                        <span className="font-medium text-red-600">-{formatCurrency(6345000)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Thu nhập ròng</span>
                                        <span className="font-medium text-green-600">{formatCurrency(35955000)}</span>
                                    </div>
                                    <div className="border-t pt-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">Đã rút</span>
                                            <span className="text-sm">{formatCurrency(23655000)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">Còn lại</span>
                                            <span className="text-sm font-medium">{formatCurrency(12300000)}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="transactions" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Lịch sử giao dịch</CardTitle>
                            <CardDescription>
                                Tất cả các giao dịch và thanh toán
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Loại</TableHead>
                                            <TableHead>Khóa học</TableHead>
                                            <TableHead>Học viên</TableHead>
                                            <TableHead>Số tiền gốc</TableHead>
                                            <TableHead>Hoa hồng</TableHead>
                                            <TableHead>Thu nhập ròng</TableHead>
                                            <TableHead>Ngày</TableHead>
                                            <TableHead>Trạng thái</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentTransactions.map((transaction) => (
                                            <TableRow key={transaction.id}>
                                                <TableCell>
                                                    {transaction.type === 'course_sale' ? 'Bán khóa học' : 'Rút tiền'}
                                                </TableCell>
                                                <TableCell>
                                                    {transaction.course || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {transaction.student || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {formatCurrency(transaction.amount)}
                                                </TableCell>
                                                <TableCell>
                                                    {transaction.commission > 0 ?
                                                        formatCurrency(transaction.commission) : '-'}
                                                </TableCell>
                                                <TableCell className="font-medium text-green-600">
                                                    {formatCurrency(transaction.netAmount)}
                                                </TableCell>
                                                <TableCell>{transaction.date}</TableCell>
                                                <TableCell>
                                                    <Badge className={getStatusColor(transaction.status)}>
                                                        {transaction.status === 'completed' ? 'Hoàn thành' :
                                                            transaction.status === 'pending' ? 'Chờ xử lý' :
                                                                'Thất bại'}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="courses" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Doanh thu theo khóa học</CardTitle>
                            <CardDescription>
                                Hiệu suất tài chính của từng khóa học
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {courseRevenue.map((course, index) => (
                                    <div key={index} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-medium">{course.course}</h4>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-green-600">
                                                    {formatCurrency(course.revenue)}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    ★ {course.avgRating} rating
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <span className="text-muted-foreground">Tổng bán</span>
                                                <div className="font-medium">{course.totalSales} khóa học</div>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Giá trung bình</span>
                                                <div className="font-medium">
                                                    {formatCurrency(course.revenue / course.totalSales)}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Thu nhập ròng</span>
                                                <div className="font-medium text-green-600">
                                                    {formatCurrency(course.revenue * 0.85)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
