'use client'

/**
 * Instructor Settings Page
 * Profile management and account settings for instructors
 */

import { useState } from 'react'
import {
    User,
    Camera,
    Save,
    Eye,
    EyeOff,
    Bell,
    CreditCard,
    Shield,
    Globe,
    BookOpen
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

// Mock instructor profile data
const instructorProfile = {
    personalInfo: {
        firstName: 'Trần',
        lastName: 'Thị Lan',
        email: 'tranthilan@email.com',
        phone: '0901234567',
        bio: 'Chuyên gia Frontend với 8+ năm kinh nghiệm. Từng làm việc tại các công ty công nghệ hàng đầu.',
        avatar: null,
        title: 'Senior Frontend Developer',
        location: 'Hà Nội, Việt Nam',
        website: 'https://tranthilan.dev'
    },
    teaching: {
        expertise: ['React', 'JavaScript', 'TypeScript', 'Next.js'],
        languages: ['Tiếng Việt', 'English'],
        teachingExperience: '5 năm',
        certifications: ['AWS Certified', 'Google Developer Expert']
    },
    notifications: {
        emailNotifications: true,
        pushNotifications: false,
        studentMessages: true,
        courseUpdates: true,
        marketingEmails: false,
        weeklyReport: true
    },
    privacy: {
        profileVisibility: 'public',
        showEmail: false,
        showPhone: false,
        allowMessages: true
    }
}

export default function InstructorSettingsPage() {
    const [profile, setProfile] = useState(instructorProfile)
    const [showPassword, setShowPassword] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsSaving(false)
        console.log('Profile saved:', profile)
    }

    const updatePersonalInfo = (field: string, value: string) => {
        setProfile(prev => ({
            ...prev,
            personalInfo: {
                ...prev.personalInfo,
                [field]: value
            }
        }))
    }

    const updateNotification = (field: string, value: boolean) => {
        setProfile(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [field]: value
            }
        }))
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Cài đặt tài khoản</h1>
                    <p className="text-muted-foreground">
                        Quản lý thông tin cá nhân và cài đặt tài khoản
                    </p>
                </div>
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                        <>Đang lưu...</>
                    ) : (
                        <>
                            <Save className="h-4 w-4 mr-2" />
                            Lưu thay đổi
                        </>
                    )}
                </Button>
            </div>

            {/* Settings Tabs */}
            <Tabs defaultValue="profile" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
                    <TabsTrigger value="teaching">Giảng dạy</TabsTrigger>
                    <TabsTrigger value="notifications">Thông báo</TabsTrigger>
                    <TabsTrigger value="security">Bảo mật</TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin cá nhân</CardTitle>
                            <CardDescription>
                                Cập nhật thông tin cơ bản và ảnh đại diện
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Avatar */}
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={profile.personalInfo.avatar || ''} />
                                    <AvatarFallback className="text-lg">
                                        {profile.personalInfo.firstName.charAt(0)}{profile.personalInfo.lastName.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <Button variant="outline" size="sm">
                                        <Camera className="h-4 w-4 mr-2" />
                                        Thay đổi ảnh
                                    </Button>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        JPG, PNG. Tối đa 5MB
                                    </p>
                                </div>
                            </div>

                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">Tên</Label>
                                    <Input
                                        id="firstName"
                                        value={profile.personalInfo.firstName}
                                        onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Họ</Label>
                                    <Input
                                        id="lastName"
                                        value={profile.personalInfo.lastName}
                                        onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={profile.personalInfo.email}
                                        onChange={(e) => updatePersonalInfo('email', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Số điện thoại</Label>
                                    <Input
                                        id="phone"
                                        value={profile.personalInfo.phone}
                                        onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Chức danh</Label>
                                <Input
                                    id="title"
                                    value={profile.personalInfo.title}
                                    onChange={(e) => updatePersonalInfo('title', e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="location">Địa điểm</Label>
                                    <Input
                                        id="location"
                                        value={profile.personalInfo.location}
                                        onChange={(e) => updatePersonalInfo('location', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="website">Website</Label>
                                    <Input
                                        id="website"
                                        value={profile.personalInfo.website}
                                        onChange={(e) => updatePersonalInfo('website', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Giới thiệu bản thân</Label>
                                <Textarea
                                    id="bio"
                                    rows={4}
                                    value={profile.personalInfo.bio}
                                    onChange={(e) => updatePersonalInfo('bio', e.target.value)}
                                    placeholder="Chia sẻ về kinh nghiệm và chuyên môn của bạn..."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Teaching Tab */}
                <TabsContent value="teaching" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin giảng dạy</CardTitle>
                            <CardDescription>
                                Cập nhật chuyên môn và kinh nghiệm giảng dạy
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Lĩnh vực chuyên môn</Label>
                                <div className="flex flex-wrap gap-2">
                                    {profile.teaching.expertise.map((skill, index) => (
                                        <Badge key={index} variant="secondary">
                                            {skill}
                                        </Badge>
                                    ))}
                                    <Button variant="outline" size="sm">
                                        + Thêm kỹ năng
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Ngôn ngữ giảng dạy</Label>
                                <div className="flex flex-wrap gap-2">
                                    {profile.teaching.languages.map((lang, index) => (
                                        <Badge key={index} variant="outline">
                                            {lang}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="experience">Kinh nghiệm giảng dạy</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn kinh nghiệm" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0-1">Dưới 1 năm</SelectItem>
                                        <SelectItem value="1-3">1-3 năm</SelectItem>
                                        <SelectItem value="3-5">3-5 năm</SelectItem>
                                        <SelectItem value="5+">Trên 5 năm</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Chứng chỉ</Label>
                                <div className="space-y-2">
                                    {profile.teaching.certifications.map((cert, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                                            <span className="text-sm">{cert}</span>
                                            <Button variant="ghost" size="sm">Xóa</Button>
                                        </div>
                                    ))}
                                    <Button variant="outline" size="sm">
                                        + Thêm chứng chỉ
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cài đặt thông báo</CardTitle>
                            <CardDescription>
                                Quản lý các loại thông báo bạn muốn nhận
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Thông báo email</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Nhận thông báo qua email
                                        </div>
                                    </div>
                                    <Switch
                                        checked={profile.notifications.emailNotifications}
                                        onCheckedChange={(checked) => updateNotification('emailNotifications', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Thông báo đẩy</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Nhận thông báo trên trình duyệt
                                        </div>
                                    </div>
                                    <Switch
                                        checked={profile.notifications.pushNotifications}
                                        onCheckedChange={(checked) => updateNotification('pushNotifications', checked)}
                                    />
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Tin nhắn từ học viên</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Thông báo khi có tin nhắn mới
                                        </div>
                                    </div>
                                    <Switch
                                        checked={profile.notifications.studentMessages}
                                        onCheckedChange={(checked) => updateNotification('studentMessages', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Cập nhật khóa học</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Thông báo về đánh giá và bình luận mới
                                        </div>
                                    </div>
                                    <Switch
                                        checked={profile.notifications.courseUpdates}
                                        onCheckedChange={(checked) => updateNotification('courseUpdates', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Báo cáo hàng tuần</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Tổng hợp hoạt động trong tuần
                                        </div>
                                    </div>
                                    <Switch
                                        checked={profile.notifications.weeklyReport}
                                        onCheckedChange={(checked) => updateNotification('weeklyReport', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Email marketing</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Thông tin về tính năng mới và khuyến mãi
                                        </div>
                                    </div>
                                    <Switch
                                        checked={profile.notifications.marketingEmails}
                                        onCheckedChange={(checked) => updateNotification('marketingEmails', checked)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Bảo mật tài khoản</CardTitle>
                            <CardDescription>
                                Cập nhật mật khẩu và cài đặt bảo mật
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                                    <div className="relative">
                                        <Input
                                            id="currentPassword"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Nhập mật khẩu hiện tại"
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

                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">Mật khẩu mới</Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        placeholder="Nhập mật khẩu mới"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Nhập lại mật khẩu mới"
                                    />
                                </div>

                                <Button className="w-full">
                                    Cập nhật mật khẩu
                                </Button>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h4 className="text-sm font-medium">Cài đặt riêng tư</h4>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Hiển thị email công khai</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Cho phép học viên xem email của bạn
                                        </div>
                                    </div>
                                    <Switch
                                        checked={profile.privacy.showEmail}
                                        onCheckedChange={(checked) => setProfile(prev => ({
                                            ...prev,
                                            privacy: { ...prev.privacy, showEmail: checked }
                                        }))}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Cho phép tin nhắn từ học viên</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Học viên có thể gửi tin nhắn cho bạn
                                        </div>
                                    </div>
                                    <Switch
                                        checked={profile.privacy.allowMessages}
                                        onCheckedChange={(checked) => setProfile(prev => ({
                                            ...prev,
                                            privacy: { ...prev.privacy, allowMessages: checked }
                                        }))}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
