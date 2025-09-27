'use client'

/**
 * Student Dashboard Settings Page
 * Profile management and account settings for students
 */

import { useState } from 'react'
import {
    User,
    Camera,
    Save,
    Eye,
    EyeOff,
    Bell,
    Globe,
    Shield,
    BookOpen,
    Target,
    Palette
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

// Mock student profile data
const studentProfile = {
    personalInfo: {
        firstName: 'Nguyễn',
        lastName: 'Văn An',
        email: 'nguyenvanan@email.com',
        phone: '0901234567',
        bio: 'Sinh viên năm 3 ngành Công nghệ thông tin. Đam mê lập trình web và mobile.',
        avatar: null,
        dateOfBirth: '1999-05-15',
        location: 'Hà Nội, Việt Nam',
        occupation: 'Sinh viên',
        school: 'Đại học Bách Khoa Hà Nội'
    },
    learning: {
        goals: ['Web Development', 'Mobile App Development', 'Data Science'],
        interests: ['JavaScript', 'React', 'Python', 'Machine Learning'],
        learningTime: 'evening', // morning, afternoon, evening, night
        weeklyHours: 10,
        difficulty: 'intermediate' // beginner, intermediate, advanced
    },
    notifications: {
        emailNotifications: true,
        pushNotifications: true,
        courseUpdates: true,
        newCourseAlerts: false,
        assignmentReminders: true,
        weeklyProgress: true,
        marketingEmails: false
    },
    privacy: {
        profileVisibility: 'public',
        showProgress: true,
        showCertificates: true,
        allowMessages: true
    },
    preferences: {
        language: 'vi',
        theme: 'light',
        autoplay: false,
        subtitles: true,
        playbackSpeed: '1.0'
    }
}

export default function StudentSettingsPage() {
    const [profile, setProfile] = useState(studentProfile)
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

    const updateLearning = (field: string, value: string | number) => {
        setProfile(prev => ({
            ...prev,
            learning: {
                ...prev.learning,
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

    const updatePreference = (field: string, value: string | boolean) => {
        setProfile(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                [field]: value
            }
        }))
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Cài đặt tài khoản</h1>
                    <p className="text-muted-foreground">
                        Quản lý thông tin cá nhân và tùy chọn học tập
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
                    <TabsTrigger value="learning">Học tập</TabsTrigger>
                    <TabsTrigger value="notifications">Thông báo</TabsTrigger>
                    <TabsTrigger value="preferences">Tùy chọn</TabsTrigger>
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                                    <Input
                                        id="dateOfBirth"
                                        type="date"
                                        value={profile.personalInfo.dateOfBirth}
                                        onChange={(e) => updatePersonalInfo('dateOfBirth', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Địa điểm</Label>
                                    <Input
                                        id="location"
                                        value={profile.personalInfo.location}
                                        onChange={(e) => updatePersonalInfo('location', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="occupation">Nghề nghiệp</Label>
                                    <Input
                                        id="occupation"
                                        value={profile.personalInfo.occupation}
                                        onChange={(e) => updatePersonalInfo('occupation', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="school">Trường học</Label>
                                    <Input
                                        id="school"
                                        value={profile.personalInfo.school}
                                        onChange={(e) => updatePersonalInfo('school', e.target.value)}
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
                                    placeholder="Chia sẻ về bản thân và mục tiêu học tập..."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Learning Tab */}
                <TabsContent value="learning" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tùy chọn học tập</CardTitle>
                            <CardDescription>
                                Cài đặt mục tiêu và sở thích học tập của bạn
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Mục tiêu học tập</Label>
                                <div className="flex flex-wrap gap-2">
                                    {profile.learning.goals.map((goal, index) => (
                                        <Badge key={index} variant="secondary">
                                            {goal}
                                        </Badge>
                                    ))}
                                    <Button variant="outline" size="sm">
                                        + Thêm mục tiêu
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Lĩnh vực quan tâm</Label>
                                <div className="flex flex-wrap gap-2">
                                    {profile.learning.interests.map((interest, index) => (
                                        <Badge key={index} variant="outline">
                                            {interest}
                                        </Badge>
                                    ))}
                                    <Button variant="outline" size="sm">
                                        + Thêm sở thích
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Thời gian học tập ưa thích</Label>
                                    <Select value={profile.learning.learningTime} onValueChange={(value) => updateLearning('learningTime', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="morning">Buổi sáng</SelectItem>
                                            <SelectItem value="afternoon">Buổi chiều</SelectItem>
                                            <SelectItem value="evening">Buổi tối</SelectItem>
                                            <SelectItem value="night">Ban đêm</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Mức độ khó</Label>
                                    <Select value={profile.learning.difficulty} onValueChange={(value) => updateLearning('difficulty', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="beginner">Mới bắt đầu</SelectItem>
                                            <SelectItem value="intermediate">Trung bình</SelectItem>
                                            <SelectItem value="advanced">Nâng cao</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="weeklyHours">Số giờ học mỗi tuần</Label>
                                <Select value={profile.learning.weeklyHours.toString()} onValueChange={(value) => updateLearning('weeklyHours', parseInt(value))}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5 giờ</SelectItem>
                                        <SelectItem value="10">10 giờ</SelectItem>
                                        <SelectItem value="15">15 giờ</SelectItem>
                                        <SelectItem value="20">20 giờ</SelectItem>
                                        <SelectItem value="25">25+ giờ</SelectItem>
                                    </SelectContent>
                                </Select>
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
                                        <Label>Cập nhật khóa học</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Thông báo về bài học mới và cập nhật
                                        </div>
                                    </div>
                                    <Switch
                                        checked={profile.notifications.courseUpdates}
                                        onCheckedChange={(checked) => updateNotification('courseUpdates', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Khóa học mới</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Thông báo khi có khóa học phù hợp
                                        </div>
                                    </div>
                                    <Switch
                                        checked={profile.notifications.newCourseAlerts}
                                        onCheckedChange={(checked) => updateNotification('newCourseAlerts', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Nhắc nhở bài tập</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Nhắc nhở về deadline và bài tập
                                        </div>
                                    </div>
                                    <Switch
                                        checked={profile.notifications.assignmentReminders}
                                        onCheckedChange={(checked) => updateNotification('assignmentReminders', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Báo cáo tiến độ</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Tổng hợp tiến độ học tập hàng tuần
                                        </div>
                                    </div>
                                    <Switch
                                        checked={profile.notifications.weeklyProgress}
                                        onCheckedChange={(checked) => updateNotification('weeklyProgress', checked)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Preferences Tab */}
                <TabsContent value="preferences" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tùy chọn giao diện</CardTitle>
                            <CardDescription>
                                Cài đặt ngôn ngữ, giao diện và phát video
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Ngôn ngữ</Label>
                                    <Select value={profile.preferences.language} onValueChange={(value) => updatePreference('language', value)}>
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
                                    <Label>Giao diện</Label>
                                    <Select value={profile.preferences.theme} onValueChange={(value) => updatePreference('theme', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="light">Sáng</SelectItem>
                                            <SelectItem value="dark">Tối</SelectItem>
                                            <SelectItem value="system">Theo hệ thống</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h4 className="text-sm font-medium">Cài đặt video</h4>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Tự động phát video</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Tự động chuyển sang video tiếp theo
                                        </div>
                                    </div>
                                    <Switch
                                        checked={profile.preferences.autoplay}
                                        onCheckedChange={(checked) => updatePreference('autoplay', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Hiển thị phụ đề</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Bật phụ đề mặc định
                                        </div>
                                    </div>
                                    <Switch
                                        checked={profile.preferences.subtitles}
                                        onCheckedChange={(checked) => updatePreference('subtitles', checked)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Tốc độ phát mặc định</Label>
                                    <Select value={profile.preferences.playbackSpeed} onValueChange={(value) => updatePreference('playbackSpeed', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0.5">0.5x</SelectItem>
                                            <SelectItem value="0.75">0.75x</SelectItem>
                                            <SelectItem value="1.0">1.0x (Bình thường)</SelectItem>
                                            <SelectItem value="1.25">1.25x</SelectItem>
                                            <SelectItem value="1.5">1.5x</SelectItem>
                                            <SelectItem value="2.0">2.0x</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                                        <Label>Hiển thị tiến độ học tập</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Cho phép người khác xem tiến độ của bạn
                                        </div>
                                    </div>
                                    <Switch
                                        checked={profile.privacy.showProgress}
                                        onCheckedChange={(checked) => setProfile(prev => ({
                                            ...prev,
                                            privacy: { ...prev.privacy, showProgress: checked }
                                        }))}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Hiển thị chứng chỉ</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Cho phép người khác xem chứng chỉ của bạn
                                        </div>
                                    </div>
                                    <Switch
                                        checked={profile.privacy.showCertificates}
                                        onCheckedChange={(checked) => setProfile(prev => ({
                                            ...prev,
                                            privacy: { ...prev.privacy, showCertificates: checked }
                                        }))}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Cho phép tin nhắn</Label>
                                        <div className="text-sm text-muted-foreground">
                                            Người khác có thể gửi tin nhắn cho bạn
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
