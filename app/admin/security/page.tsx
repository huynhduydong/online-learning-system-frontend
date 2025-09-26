'use client'

/**
 * Admin Security Page
 * Security monitoring, threat detection, and access control for administrators
 */

import { useState, useEffect } from 'react'
import {
    Shield,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Eye,
    EyeOff,
    Lock,
    Unlock,
    Key,
    UserCheck,
    Activity,
    Clock,
    Globe,
    Smartphone,
    Monitor,
    AlertCircle,
    Ban,
    RefreshCw,
    Download,
    Filter,
    Search,
    Calendar,
    MapPin,
    Wifi,
    Database,
    Server,
    Bug
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'

// Mock security data
const securityOverview = {
    threatLevel: 'low', // low, medium, high, critical
    activeAlerts: 3,
    blockedAttempts: 127,
    securityScore: 92,
    lastScan: '2024-01-20 14:30',
    vulnerabilities: {
        critical: 0,
        high: 1,
        medium: 3,
        low: 8
    }
}

const recentAlerts = [
    {
        id: 1,
        type: 'failed_login',
        severity: 'medium',
        message: 'Nhiều lần đăng nhập thất bại từ IP: 192.168.1.100',
        timestamp: '2024-01-20 15:45',
        user: 'nguyenvana@email.com',
        ip: '192.168.1.100',
        location: 'Hà Nội, Việt Nam',
        status: 'investigating'
    },
    {
        id: 2,
        type: 'suspicious_activity',
        severity: 'high',
        message: 'Hoạt động bất thường: Truy cập từ nhiều quốc gia trong thời gian ngắn',
        timestamp: '2024-01-20 14:22',
        user: 'suspected_user@email.com',
        ip: '45.123.67.89',
        location: 'Singapore',
        status: 'blocked'
    },
    {
        id: 3,
        type: 'privilege_escalation',
        severity: 'critical',
        message: 'Cố gắng nâng quyền trái phép',
        timestamp: '2024-01-20 13:15',
        user: 'admin_test@email.com',
        ip: '172.16.0.5',
        location: 'TP.HCM, Việt Nam',
        status: 'resolved'
    }
]

const loginAttempts = [
    {
        id: 1,
        email: 'nguyenvana@email.com',
        ip: '192.168.1.100',
        location: 'Hà Nội, Việt Nam',
        device: 'Chrome on Windows',
        timestamp: '2024-01-20 15:45',
        status: 'failed',
        reason: 'Invalid password'
    },
    {
        id: 2,
        email: 'tranthib@email.com',
        ip: '203.162.4.191',
        location: 'TP.HCM, Việt Nam',
        device: 'Safari on iPhone',
        timestamp: '2024-01-20 15:42',
        status: 'success',
        reason: null
    },
    {
        id: 3,
        email: 'hoangvanc@email.com',
        ip: '118.68.122.45',
        location: 'Đà Nẵng, Việt Nam',
        device: 'Firefox on Linux',
        timestamp: '2024-01-20 15:38',
        status: 'blocked',
        reason: 'Too many failed attempts'
    },
    {
        id: 4,
        email: 'admin@example.com',
        ip: '45.123.67.89',
        location: 'Singapore',
        device: 'Chrome on Android',
        timestamp: '2024-01-20 15:35',
        status: 'failed',
        reason: 'Account not found'
    }
]

const accessLogs = [
    {
        id: 1,
        user: 'Nguyễn Văn An',
        email: 'nguyenvana@email.com',
        role: 'student',
        action: 'Login',
        resource: '/dashboard',
        ip: '192.168.1.100',
        timestamp: '2024-01-20 15:45',
        status: 'success'
    },
    {
        id: 2,
        user: 'Trần Thị Bích',
        email: 'tranthib@email.com',
        role: 'instructor',
        action: 'Course Update',
        resource: '/studio/courses/123',
        ip: '203.162.4.191',
        timestamp: '2024-01-20 15:42',
        status: 'success'
    },
    {
        id: 3,
        user: 'Admin System',
        email: 'admin@elearning.com',
        role: 'admin',
        action: 'User Management',
        resource: '/admin/users',
        ip: '10.0.0.1',
        timestamp: '2024-01-20 15:40',
        status: 'success'
    }
]

const systemHealth = {
    database: { status: 'healthy', responseTime: 45, uptime: 99.9 },
    server: { status: 'healthy', cpuUsage: 32, memoryUsage: 68 },
    network: { status: 'healthy', latency: 12, throughput: 95 },
    backup: { status: 'healthy', lastBackup: '2024-01-20 02:00', size: '2.4GB' }
}

const getSeverityColor = (severity: string) => {
    switch (severity) {
        case 'critical':
            return 'bg-red-100 text-red-800'
        case 'high':
            return 'bg-orange-100 text-orange-800'
        case 'medium':
            return 'bg-yellow-100 text-yellow-800'
        case 'low':
            return 'bg-blue-100 text-blue-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'success':
            return 'bg-green-100 text-green-800'
        case 'failed':
            return 'bg-red-100 text-red-800'
        case 'blocked':
            return 'bg-red-100 text-red-800'
        case 'investigating':
            return 'bg-yellow-100 text-yellow-800'
        case 'resolved':
            return 'bg-green-100 text-green-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}

export default function AdminSecurityPage() {
    const [selectedPeriod, setSelectedPeriod] = useState('24h')
    const [searchTerm, setSearchTerm] = useState('')
    const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Bảo mật hệ thống</h1>
                    <p className="text-muted-foreground">
                        Giám sát và quản lý bảo mật toàn diện
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="realtime">Theo dõi thời gian thực</Label>
                        <Switch
                            id="realtime"
                            checked={isRealTimeEnabled}
                            onCheckedChange={setIsRealTimeEnabled}
                        />
                    </div>
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Xuất báo cáo
                    </Button>
                </div>
            </div>

            {/* Security Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className={`border-2 ${securityOverview.threatLevel === 'low' ? 'border-green-200 bg-green-50/30' :
                        securityOverview.threatLevel === 'medium' ? 'border-yellow-200 bg-yellow-50/30' :
                            securityOverview.threatLevel === 'high' ? 'border-orange-200 bg-orange-50/30' :
                                'border-red-200 bg-red-50/30'
                    }`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Mức độ đe dọa</CardTitle>
                        <Shield className={`h-4 w-4 ${securityOverview.threatLevel === 'low' ? 'text-green-600' :
                                securityOverview.threatLevel === 'medium' ? 'text-yellow-600' :
                                    securityOverview.threatLevel === 'high' ? 'text-orange-600' :
                                        'text-red-600'
                            }`} />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold capitalize ${securityOverview.threatLevel === 'low' ? 'text-green-600' :
                                securityOverview.threatLevel === 'medium' ? 'text-yellow-600' :
                                    securityOverview.threatLevel === 'high' ? 'text-orange-600' :
                                        'text-red-600'
                            }`}>
                            {securityOverview.threatLevel === 'low' ? 'Thấp' :
                                securityOverview.threatLevel === 'medium' ? 'Trung bình' :
                                    securityOverview.threatLevel === 'high' ? 'Cao' : 'Cực cao'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Cập nhật {securityOverview.lastScan}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cảnh báo hoạt động</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">
                            {securityOverview.activeAlerts}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Cần xem xét ngay
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đã chặn</CardTitle>
                        <Ban className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {securityOverview.blockedAttempts}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Lượt truy cập bị chặn hôm nay
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Điểm bảo mật</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {securityOverview.securityScore}/100
                        </div>
                        <Progress value={securityOverview.securityScore} className="mt-2" />
                    </CardContent>
                </Card>
            </div>

            {/* Active Alerts */}
            {securityOverview.activeAlerts > 0 && (
                <Alert className="border-red-200 bg-red-50/30">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Cảnh báo bảo mật</AlertTitle>
                    <AlertDescription>
                        Có {securityOverview.activeAlerts} cảnh báo bảo mật cần được xử lý ngay lập tức.
                        Vui lòng kiểm tra tab "Cảnh báo" để xem chi tiết.
                    </AlertDescription>
                </Alert>
            )}

            {/* Main Content Tabs */}
            <Tabs defaultValue="alerts" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="alerts">Cảnh báo</TabsTrigger>
                    <TabsTrigger value="logins">Đăng nhập</TabsTrigger>
                    <TabsTrigger value="access">Nhật ký truy cập</TabsTrigger>
                    <TabsTrigger value="vulnerabilities">Lỗ hổng</TabsTrigger>
                    <TabsTrigger value="system">Hệ thống</TabsTrigger>
                </TabsList>

                {/* Security Alerts */}
                <TabsContent value="alerts" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cảnh báo bảo mật gần đây</CardTitle>
                            <CardDescription>
                                Theo dõi và xử lý các mối đe dọa bảo mật
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentAlerts.map((alert) => (
                                    <div key={alert.id} className="border rounded-lg p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center space-x-2">
                                                <Badge className={getSeverityColor(alert.severity)}>
                                                    {alert.severity === 'critical' ? 'Cực cao' :
                                                        alert.severity === 'high' ? 'Cao' :
                                                            alert.severity === 'medium' ? 'Trung bình' : 'Thấp'}
                                                </Badge>
                                                <Badge className={getStatusColor(alert.status)}>
                                                    {alert.status === 'investigating' ? 'Đang điều tra' :
                                                        alert.status === 'blocked' ? 'Đã chặn' :
                                                            alert.status === 'resolved' ? 'Đã xử lý' : alert.status}
                                                </Badge>
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                                                {alert.timestamp}
                                            </span>
                                        </div>
                                        <div className="text-sm font-medium mb-2">{alert.message}</div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-muted-foreground">
                                            <div>
                                                <span className="font-medium">User:</span> {alert.user}
                                            </div>
                                            <div>
                                                <span className="font-medium">IP:</span> {alert.ip}
                                            </div>
                                            <div>
                                                <span className="font-medium">Location:</span> {alert.location}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Login Attempts */}
                <TabsContent value="logins" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Lịch sử đăng nhập</CardTitle>
                            <CardDescription>
                                Theo dõi tất cả các lần đăng nhập thành công và thất bại
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Filters */}
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Tìm theo email hoặc IP..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                </div>
                                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1h">1 giờ qua</SelectItem>
                                        <SelectItem value="24h">24 giờ qua</SelectItem>
                                        <SelectItem value="7d">7 ngày qua</SelectItem>
                                        <SelectItem value="30d">30 ngày qua</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Login Attempts Table */}
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Email</TableHead>
                                            <TableHead>IP Address</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead>Device</TableHead>
                                            <TableHead>Trạng thái</TableHead>
                                            <TableHead>Thời gian</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loginAttempts.map((attempt) => (
                                            <TableRow key={attempt.id}>
                                                <TableCell className="font-medium">
                                                    {attempt.email}
                                                </TableCell>
                                                <TableCell>{attempt.ip}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-1">
                                                        <MapPin className="h-3 w-3 text-muted-foreground" />
                                                        <span className="text-sm">{attempt.location}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">{attempt.device}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={getStatusColor(attempt.status)}>
                                                        {attempt.status === 'success' ? 'Thành công' :
                                                            attempt.status === 'failed' ? 'Thất bại' :
                                                                attempt.status === 'blocked' ? 'Bị chặn' : attempt.status}
                                                    </Badge>
                                                    {attempt.reason && (
                                                        <div className="text-xs text-muted-foreground mt-1">
                                                            {attempt.reason}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>{attempt.timestamp}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Access Logs */}
                <TabsContent value="access" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Nhật ký truy cập</CardTitle>
                            <CardDescription>
                                Theo dõi hoạt động của người dùng trong hệ thống
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Người dùng</TableHead>
                                            <TableHead>Vai trò</TableHead>
                                            <TableHead>Hành động</TableHead>
                                            <TableHead>Tài nguyên</TableHead>
                                            <TableHead>IP</TableHead>
                                            <TableHead>Thời gian</TableHead>
                                            <TableHead>Trạng thái</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {accessLogs.map((log) => (
                                            <TableRow key={log.id}>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{log.user}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {log.email}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {log.role === 'admin' ? 'Quản trị' :
                                                            log.role === 'instructor' ? 'Giảng viên' :
                                                                log.role === 'student' ? 'Học viên' : log.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{log.action}</TableCell>
                                                <TableCell>
                                                    <code className="text-sm bg-muted px-1 py-0.5 rounded">
                                                        {log.resource}
                                                    </code>
                                                </TableCell>
                                                <TableCell>{log.ip}</TableCell>
                                                <TableCell>{log.timestamp}</TableCell>
                                                <TableCell>
                                                    <Badge className={getStatusColor(log.status)}>
                                                        {log.status === 'success' ? 'Thành công' : log.status}
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

                {/* Vulnerabilities */}
                <TabsContent value="vulnerabilities" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quét lỗ hổng bảo mật</CardTitle>
                            <CardDescription>
                                Kết quả quét và đánh giá lỗ hổng bảo mật hệ thống
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-2xl font-bold text-red-600">
                                        {securityOverview.vulnerabilities.critical}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Cực cao</div>
                                </div>
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-2xl font-bold text-orange-600">
                                        {securityOverview.vulnerabilities.high}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Cao</div>
                                </div>
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {securityOverview.vulnerabilities.medium}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Trung bình</div>
                                </div>
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {securityOverview.vulnerabilities.low}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Thấp</div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Lần quét cuối: {securityOverview.lastScan}
                                    </p>
                                </div>
                                <Button size="sm">
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Quét lại
                                </Button>
                            </div>

                            <div className="space-y-3">
                                <div className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                            <Bug className="h-4 w-4 text-orange-600" />
                                            <span className="font-medium">Outdated Dependencies</span>
                                            <Badge className="bg-orange-100 text-orange-800">High</Badge>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            Sửa
                                        </Button>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Một số thư viện đang sử dụng phiên bản cũ có thể chứa lỗ hổng bảo mật
                                    </p>
                                    <div className="text-xs text-muted-foreground">
                                        Phát hiện: 2024-01-20 | CVE-2023-12345
                                    </div>
                                </div>

                                <div className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                            <Shield className="h-4 w-4 text-yellow-600" />
                                            <span className="font-medium">Weak Password Policy</span>
                                            <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            Cấu hình
                                        </Button>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Chính sách mật khẩu hiện tại chưa đủ mạnh
                                    </p>
                                    <div className="text-xs text-muted-foreground">
                                        Khuyến nghị: Yêu cầu ít nhất 12 ký tự với ký tự đặc biệt
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* System Health */}
                <TabsContent value="system" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Tình trạng hệ thống</CardTitle>
                                <CardDescription>
                                    Giám sát các thành phần hệ thống quan trọng
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Database className="h-4 w-4" />
                                            <span className="text-sm font-medium">Database</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                                            <span className="text-sm text-muted-foreground">
                                                {systemHealth.database.responseTime}ms
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Server className="h-4 w-4" />
                                            <span className="text-sm font-medium">Server</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                                            <span className="text-sm text-muted-foreground">
                                                CPU: {systemHealth.server.cpuUsage}%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Wifi className="h-4 w-4" />
                                            <span className="text-sm font-medium">Network</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                                            <span className="text-sm text-muted-foreground">
                                                {systemHealth.network.latency}ms
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Database className="h-4 w-4" />
                                            <span className="text-sm font-medium">Backup</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                                            <span className="text-sm text-muted-foreground">
                                                {systemHealth.backup.size}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Hiệu suất hệ thống</CardTitle>
                                <CardDescription>
                                    Thống kê chi tiết về hiệu suất
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>CPU Usage</span>
                                            <span>{systemHealth.server.cpuUsage}%</span>
                                        </div>
                                        <Progress value={systemHealth.server.cpuUsage} />
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Memory Usage</span>
                                            <span>{systemHealth.server.memoryUsage}%</span>
                                        </div>
                                        <Progress value={systemHealth.server.memoryUsage} />
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Database Uptime</span>
                                            <span>{systemHealth.database.uptime}%</span>
                                        </div>
                                        <Progress value={systemHealth.database.uptime} />
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Network Throughput</span>
                                            <span>{systemHealth.network.throughput}%</span>
                                        </div>
                                        <Progress value={systemHealth.network.throughput} />
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
