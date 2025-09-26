'use client'

/**
 * Admin Settings Page
 * System configuration and settings management for administrators
 */

import { useState, useEffect } from 'react'
import {
    Settings,
    Save,
    RefreshCw,
    Eye,
    EyeOff,
    Shield,
    Mail,
    Globe,
    Database,
    Bell,
    Lock,
    Users,
    CreditCard,
    Palette,
    Code,
    AlertTriangle,
    CheckCircle,
    Info
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

// Mock settings data
const systemSettings = {
    general: {
        siteName: 'E-Learning Platform',
        siteDescription: 'Nền tảng học trực tuyến hàng đầu Việt Nam',
        contactEmail: 'admin@elearning.com',
        supportEmail: 'support@elearning.com',
        timezone: 'Asia/Ho_Chi_Minh',
        language: 'vi',
        currency: 'VND',
        maintenanceMode: false
    },
    security: {
        requireEmailVerification: true,
        enableTwoFactor: false,
        passwordMinLength: 8,
        sessionTimeout: 30, // minutes
        maxLoginAttempts: 5,
        enableCaptcha: true,
        allowSocialLogin: true
    },
    email: {
        provider: 'smtp',
        smtpHost: 'smtp.gmail.com',
        smtpPort: 587,
        smtpUsername: 'admin@elearning.com',
        smtpPassword: '••••••••',
        smtpSecure: true,
        fromName: 'E-Learning Platform',
        fromEmail: 'noreply@elearning.com'
    },
    payment: {
        enablePayment: true,
        defaultCurrency: 'VND',
        minCoursePrice: 50000,
        maxCoursePrice: 5000000,
        commissionRate: 15, // percentage
        payoutThreshold: 500000,
        autoPayoutEnabled: true
    },
    notifications: {
        enableEmailNotifications: true,
        enablePushNotifications: false,
        enableSMSNotifications: false,
        newUserNotification: true,
        newCourseNotification: true,
        paymentNotification: true,
        systemNotification: true
    },
    content: {
        maxUploadSize: 100, // MB
        allowedFileTypes: ['jpg', 'png', 'pdf', 'mp4', 'mp3'],
        videoQuality: 'auto',
        enableContentModeration: true,
        autoApprovalEnabled: false,
        maxCourseLength: 100 // hours
    }
}

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState(systemSettings)
    const [isSaving, setIsSaving] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            setHasUnsavedChanges(false)
            console.log('Settings saved:', settings)
        } catch (error) {
            console.error('Failed to save settings:', error)
        } finally {
            setIsSaving(false)
        }
    }

    const updateSetting = (section: string, key: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section as keyof typeof prev],
                [key]: value
            }
        }))
        setHasUnsavedChanges(true)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Cài đặt hệ thống</h1>
                    <p className="text-muted-foreground">
                        Quản lý cấu hình và thiết lập hệ thống
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    {hasUnsavedChanges && (
                        <Badge variant="outline" className="text-orange-600">
                            Có thay đổi chưa lưu
                        </Badge>
                    )}
                    <Button
                        onClick={handleSave}
                        disabled={isSaving || !hasUnsavedChanges}
                        size="sm"
                    >
                        {isSaving ? (
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        Lưu thay đổi
                    </Button>
                </div>
            </div>

            {/* Warning Alert */}
            <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Lưu ý quan trọng</AlertTitle>
                <AlertDescription>
                    Việc thay đổi cài đặt hệ thống có thể ảnh hưởng đến hoạt động của toàn bộ nền tảng.
                    Vui lòng cân nhắc kỹ trước khi thực hiện thay đổi.
                </AlertDescription>
            </Alert>

            {/* Settings Tabs */}
            <Tabs defaultValue="general" className="space-y-4">
                <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="general">Chung</TabsTrigger>
                    <TabsTrigger value="security">Bảo mật</TabsTrigger>
                    <TabsTrigger value="email">Email</TabsTrigger>
                    <TabsTrigger value="payment">Thanh toán</TabsTrigger>
                    <TabsTrigger value="notifications">Thông báo</TabsTrigger>
                    <TabsTrigger value="content">Nội dung</TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin chung</CardTitle>
                            <CardDescription>
                                Cấu hình thông tin cơ bản của hệ thống
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="siteName">Tên website</Label>
                                    <Input
                                        id="siteName"
                                        value={settings.general.siteName}
                                        onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contactEmail">Email liên hệ</Label>
                                    <Input
                                        id="contactEmail"
                                        type="email"
                                        value={settings.general.contactEmail}
                                        onChange={(e) => updateSetting('general', 'contactEmail', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="siteDescription">Mô tả website</Label>
                                <Textarea
                                    id="siteDescription"
                                    value={settings.general.siteDescription}
                                    onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="timezone">Múi giờ</Label>
                                    <Select
                                        value={settings.general.timezone}
                                        onValueChange={(value) => updateSetting('general', 'timezone', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Asia/Ho_Chi_Minh">GMT+7 (Việt Nam)</SelectItem>
                                            <SelectItem value="Asia/Bangkok">GMT+7 (Bangkok)</SelectItem>
                                            <SelectItem value="Asia/Singapore">GMT+8 (Singapore)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="language">Ngôn ngữ mặc định</Label>
                                    <Select
                                        value={settings.general.language}
                                        onValueChange={(value) => updateSetting('general', 'language', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="vi">Tiếng Việt</SelectItem>
                                            <SelectItem value="en">English</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="currency">Đơn vị tiền tệ</Label>
                                    <Select
                                        value={settings.general.currency}
                                        onValueChange={(value) => updateSetting('general', 'currency', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="VND">VND (Việt Nam Đồng)</SelectItem>
                                            <SelectItem value="USD">USD (US Dollar)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Chế độ bảo trì</Label>
                                    <div className="text-sm text-muted-foreground">
                                        Kích hoạt để tạm dừng hoạt động website
                                    </div>
                                </div>
                                <Switch
                                    checked={settings.general.maintenanceMode}
                                    onCheckedChange={(checked) => updateSetting('general', 'maintenanceMode', checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Settings */}
                <TabsContent value="security" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cài đặt bảo mật</CardTitle>
                            <CardDescription>
                                Cấu hình các tính năng bảo mật và xác thực
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Yêu cầu xác thực email</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Người dùng phải xác thực email trước khi sử dụng
                                        </div>
                                    </div>
                                    <Switch
                                        checked={settings.security.requireEmailVerification}
                                        onCheckedChange={(checked) => updateSetting('security', 'requireEmailVerification', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Xác thực hai bước</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Bắt buộc xác thực hai bước cho tất cả tài khoản
                                        </div>
                                    </div>
                                    <Switch
                                        checked={settings.security.enableTwoFactor}
                                        onCheckedChange={(checked) => updateSetting('security', 'enableTwoFactor', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Cho phép đăng nhập bằng mạng xã hội</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Google, Facebook, GitHub
                                        </div>
                                    </div>
                                    <Switch
                                        checked={settings.security.allowSocialLogin}
                                        onCheckedChange={(checked) => updateSetting('security', 'allowSocialLogin', checked)}
                                    />
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="passwordMinLength">Độ dài mật khẩu tối thiểu</Label>
                                    <Input
                                        id="passwordMinLength"
                                        type="number"
                                        min="6"
                                        max="50"
                                        value={settings.security.passwordMinLength}
                                        onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="maxLoginAttempts">Số lần đăng nhập sai tối đa</Label>
                                    <Input
                                        id="maxLoginAttempts"
                                        type="number"
                                        min="3"
                                        max="10"
                                        value={settings.security.maxLoginAttempts}
                                        onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sessionTimeout">Thời gian hết hạn phiên (phút)</Label>
                                <Input
                                    id="sessionTimeout"
                                    type="number"
                                    min="5"
                                    max="1440"
                                    value={settings.security.sessionTimeout}
                                    onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Email Settings */}
                <TabsContent value="email" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cấu hình Email</CardTitle>
                            <CardDescription>
                                Thiết lập máy chủ email và thông tin gửi
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fromName">Tên người gửi</Label>
                                    <Input
                                        id="fromName"
                                        value={settings.email.fromName}
                                        onChange={(e) => updateSetting('email', 'fromName', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fromEmail">Email người gửi</Label>
                                    <Input
                                        id="fromEmail"
                                        type="email"
                                        value={settings.email.fromEmail}
                                        onChange={(e) => updateSetting('email', 'fromEmail', e.target.value)}
                                    />
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="smtpHost">SMTP Host</Label>
                                    <Input
                                        id="smtpHost"
                                        value={settings.email.smtpHost}
                                        onChange={(e) => updateSetting('email', 'smtpHost', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="smtpPort">SMTP Port</Label>
                                    <Input
                                        id="smtpPort"
                                        type="number"
                                        value={settings.email.smtpPort}
                                        onChange={(e) => updateSetting('email', 'smtpPort', parseInt(e.target.value))}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="smtpUsername">SMTP Username</Label>
                                    <Input
                                        id="smtpUsername"
                                        value={settings.email.smtpUsername}
                                        onChange={(e) => updateSetting('email', 'smtpUsername', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="smtpPassword">SMTP Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="smtpPassword"
                                            type={showPassword ? 'text' : 'password'}
                                            value={settings.email.smtpPassword}
                                            onChange={(e) => updateSetting('email', 'smtpPassword', e.target.value)}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>SMTP Secure (SSL/TLS)</Label>
                                    <div className="text-sm text-muted-foreground">
                                        Sử dụng kết nối bảo mật
                                    </div>
                                </div>
                                <Switch
                                    checked={settings.email.smtpSecure}
                                    onCheckedChange={(checked) => updateSetting('email', 'smtpSecure', checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Payment Settings */}
                <TabsContent value="payment" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cài đặt thanh toán</CardTitle>
                            <CardDescription>
                                Cấu hình hệ thống thanh toán và hoa hồng
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Bật tính năng thanh toán</Label>
                                    <div className="text-sm text-muted-foreground">
                                        Cho phép thanh toán trực tuyến
                                    </div>
                                </div>
                                <Switch
                                    checked={settings.payment.enablePayment}
                                    onCheckedChange={(checked) => updateSetting('payment', 'enablePayment', checked)}
                                />
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="minCoursePrice">Giá khóa học tối thiểu (VND)</Label>
                                    <Input
                                        id="minCoursePrice"
                                        type="number"
                                        value={settings.payment.minCoursePrice}
                                        onChange={(e) => updateSetting('payment', 'minCoursePrice', parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="maxCoursePrice">Giá khóa học tối đa (VND)</Label>
                                    <Input
                                        id="maxCoursePrice"
                                        type="number"
                                        value={settings.payment.maxCoursePrice}
                                        onChange={(e) => updateSetting('payment', 'maxCoursePrice', parseInt(e.target.value))}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="commissionRate">Tỷ lệ hoa hồng (%)</Label>
                                    <Input
                                        id="commissionRate"
                                        type="number"
                                        min="0"
                                        max="50"
                                        value={settings.payment.commissionRate}
                                        onChange={(e) => updateSetting('payment', 'commissionRate', parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="payoutThreshold">Ngưỡng rút tiền (VND)</Label>
                                    <Input
                                        id="payoutThreshold"
                                        type="number"
                                        value={settings.payment.payoutThreshold}
                                        onChange={(e) => updateSetting('payment', 'payoutThreshold', parseInt(e.target.value))}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Tự động rút tiền</Label>
                                    <div className="text-sm text-muted-foreground">
                                        Tự động chuyển tiền khi đạt ngưỡng
                                    </div>
                                </div>
                                <Switch
                                    checked={settings.payment.autoPayoutEnabled}
                                    onCheckedChange={(checked) => updateSetting('payment', 'autoPayoutEnabled', checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications Settings */}
                <TabsContent value="notifications" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cài đặt thông báo</CardTitle>
                            <CardDescription>
                                Quản lý các loại thông báo và kênh gửi
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Thông báo email</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Gửi thông báo qua email
                                        </div>
                                    </div>
                                    <Switch
                                        checked={settings.notifications.enableEmailNotifications}
                                        onCheckedChange={(checked) => updateSetting('notifications', 'enableEmailNotifications', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Thông báo push</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Gửi thông báo đẩy trên trình duyệt
                                        </div>
                                    </div>
                                    <Switch
                                        checked={settings.notifications.enablePushNotifications}
                                        onCheckedChange={(checked) => updateSetting('notifications', 'enablePushNotifications', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Thông báo SMS</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Gửi thông báo qua tin nhắn
                                        </div>
                                    </div>
                                    <Switch
                                        checked={settings.notifications.enableSMSNotifications}
                                        onCheckedChange={(checked) => updateSetting('notifications', 'enableSMSNotifications', checked)}
                                    />
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h4 className="text-sm font-medium">Loại thông báo</h4>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Người dùng mới</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Thông báo khi có người dùng mới đăng ký
                                        </div>
                                    </div>
                                    <Switch
                                        checked={settings.notifications.newUserNotification}
                                        onCheckedChange={(checked) => updateSetting('notifications', 'newUserNotification', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Khóa học mới</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Thông báo khi có khóa học mới được tạo
                                        </div>
                                    </div>
                                    <Switch
                                        checked={settings.notifications.newCourseNotification}
                                        onCheckedChange={(checked) => updateSetting('notifications', 'newCourseNotification', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Thanh toán</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Thông báo về các giao dịch thanh toán
                                        </div>
                                    </div>
                                    <Switch
                                        checked={settings.notifications.paymentNotification}
                                        onCheckedChange={(checked) => updateSetting('notifications', 'paymentNotification', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Hệ thống</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Thông báo về tình trạng hệ thống
                                        </div>
                                    </div>
                                    <Switch
                                        checked={settings.notifications.systemNotification}
                                        onCheckedChange={(checked) => updateSetting('notifications', 'systemNotification', checked)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Content Settings */}
                <TabsContent value="content" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cài đặt nội dung</CardTitle>
                            <CardDescription>
                                Quản lý upload file và kiểm duyệt nội dung
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="maxUploadSize">Kích thước file tối đa (MB)</Label>
                                    <Input
                                        id="maxUploadSize"
                                        type="number"
                                        min="1"
                                        max="500"
                                        value={settings.content.maxUploadSize}
                                        onChange={(e) => updateSetting('content', 'maxUploadSize', parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="maxCourseLength">Thời lượng khóa học tối đa (giờ)</Label>
                                    <Input
                                        id="maxCourseLength"
                                        type="number"
                                        min="1"
                                        max="500"
                                        value={settings.content.maxCourseLength}
                                        onChange={(e) => updateSetting('content', 'maxCourseLength', parseInt(e.target.value))}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Loại file được phép</Label>
                                <div className="text-sm text-muted-foreground mb-2">
                                    Các định dạng file được phép upload
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {settings.content.allowedFileTypes.map((type) => (
                                        <Badge key={type} variant="secondary">
                                            .{type}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Kiểm duyệt nội dung</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Bật tính năng kiểm duyệt tự động
                                        </div>
                                    </div>
                                    <Switch
                                        checked={settings.content.enableContentModeration}
                                        onCheckedChange={(checked) => updateSetting('content', 'enableContentModeration', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Tự động phê duyệt</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Tự động phê duyệt khóa học mới
                                        </div>
                                    </div>
                                    <Switch
                                        checked={settings.content.autoApprovalEnabled}
                                        onCheckedChange={(checked) => updateSetting('content', 'autoApprovalEnabled', checked)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="videoQuality">Chất lượng video mặc định</Label>
                                <Select
                                    value={settings.content.videoQuality}
                                    onValueChange={(value) => updateSetting('content', 'videoQuality', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="auto">Tự động</SelectItem>
                                        <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                                        <SelectItem value="720p">720p (HD)</SelectItem>
                                        <SelectItem value="480p">480p (SD)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
