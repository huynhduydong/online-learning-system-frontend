'use client'

/**
 * Dashboard Page
 * Main dashboard with user statistics, recent courses, and achievements
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  BookOpen, 
  Users, 
  Award, 
  TrendingUp, 
  Clock, 
  Star,
  Calendar,
  Target,
  PlayCircle,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  Bell,
  Settings,
  LogOut,
  User,
  Menu,
  X,
  RefreshCw,
  AlertCircle
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

import { useAuth } from '@/contexts/auth-context'
import { useDashboard } from '@/hooks/use-dashboard'
import { formatCurrency } from '@/lib/utils'

export default function DashboardPage({ params }: { params: { locale: string } }) {
  const { user: authUser, logout } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { locale } = params
  
  // Use dashboard hook for real API data
  const {
    dashboardData,
    stats,
    recentCourses,
    achievements,
    loading,
    error,
    refreshDashboard,
    markNotificationRead,
    updateStreak
  } = useDashboard()

  // Get user data from dashboard data, fallback to auth user for authentication check
  const user = dashboardData?.user || authUser

  useEffect(() => {
    // Check if user is authenticated
    if (!authUser) {
      router.push(`/${locale}/login`)
      return
    }
  }, [authUser, router, locale])

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error('Dashboard error:', error)
      // You could show a toast notification here
    }
  }, [error])

  const handleLogout = async () => {
    await logout()
    router.push(`/${locale}/login`)
  }

  const sidebarItems = [
    { icon: BarChart3, label: 'Dashboard', href: `/${locale}/dashboard`, active: true },
    { icon: BookOpen, label: 'Khóa học của tôi', href: `/${locale}/dashboard/courses` },
    { icon: Calendar, label: 'Lịch học', href: `/${locale}/dashboard/schedule` },
    { icon: Award, label: 'Thành tích', href: `/${locale}/dashboard/achievements` },
    { icon: Activity, label: 'Tiến độ', href: `/${locale}/dashboard/progress` },
    { icon: Settings, label: 'Cài đặt', href: `/${locale}/dashboard/settings` }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">EL</span>
                </div>
                <span className="font-bold text-lg">E-Learning</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {sidebarItems.map((item) => (
                  <li key={item.href}>
                    <Button
                      variant={item.active ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => {
                        if (!item.active) router.push(item.href)
                        setSidebarOpen(false)
                      }}
                    >
                      <item.icon className="mr-3 h-4 w-4" />
                      {item.label}
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* User Info */}
            <div className="p-4 border-t">
              <div className="flex items-center space-x-3 mb-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profile_image || user?.avatar} />
                  <AvatarFallback>
                    {(user?.full_name || user?.name)?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.full_name || user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Đăng xuất
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-card border-r border-border">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">EL</span>
              </div>
              <span className="font-bold text-lg">E-Learning</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => (
                <li key={item.href}>
                  <Button
                    variant={item.active ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      if (!item.active) router.push(item.href)
                    }}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profile_image || user?.avatar} />
                <AvatarFallback>
                  {(user?.full_name || user?.name)?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.full_name || user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="bg-card border-b border-border px-4 py-4 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                  Chào mừng trở lại, {user?.full_name || user?.name}!
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshDashboard}
                disabled={loading}
                className="hidden sm:flex"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profile_image || user?.avatar} />
                      <AvatarFallback>
                        {(user?.full_name || user?.name)?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.full_name || user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push(`/${locale}/dashboard/settings`)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Cài đặt
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 lg:p-6">
          {/* Error Alert */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-destructive mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-destructive">
                    Có lỗi xảy ra
                  </h3>
                  <p className="text-sm text-destructive/80 mt-1">
                    {error}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refreshDashboard}
                  className="ml-auto text-destructive hover:text-destructive/80"
                >
                  Thử lại
                </Button>
              </div>
            </div>
          )}
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg p-6 border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    Chào mừng trở lại, {user?.full_name || user?.name}! 👋
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    Hôm nay là ngày tuyệt vời để tiếp tục hành trình học tập của bạn.
                  </p>
                  <div className="flex items-center space-x-4">
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <Target className="h-3 w-3" />
                      <span>Streak: {stats?.currentStreak || 0} ngày</span>
                    </Badge>
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{stats?.totalStudyTime || 0}h học tập</span>
                    </Badge>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng khóa học</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalCourses || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +2 từ tháng trước
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đã hoàn thành</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.completedCourses || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.totalCourses > 0 && stats?.completedCourses
                    ? Math.round((stats.completedCourses / stats.totalCourses) * 100)
                    : 0}% tỷ lệ hoàn thành
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đang học</CardTitle>
                <PlayCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.inProgressCourses || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Tiếp tục học tập
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Thành tích</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.achievements || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +3 tuần này
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Courses and Achievements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Courses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Khóa học gần đây</span>
                </CardTitle>
                <CardDescription>
                  Tiếp tục học từ nơi bạn đã dừng lại
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentCourses.map((course) => (
                  <div key={course.id} className="flex items-center space-x-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{course.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Giảng viên: {course.instructor}
                      </p>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>Tiến độ</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Tiếp tục
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  Xem tất cả khóa học
                </Button>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Thành tích mới nhất</span>
                </CardTitle>
                <CardDescription>
                  Những thành tích bạn đã đạt được
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-4 p-3 rounded-lg border border-border">
                    <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center text-2xl">
                      {achievement.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Đạt được: {new Date(achievement.earnedAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {achievement.category}
                    </Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  Xem tất cả thành tích
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}