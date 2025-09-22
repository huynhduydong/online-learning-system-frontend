'use client'

/**
 * Dashboard Layout Component
 * Shared layout for all dashboard pages to avoid duplication
 */

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
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
    AlertCircle,
    GraduationCap
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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

interface DashboardLayoutProps {
    children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const { user: authUser, logout } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    // Use dashboard hook for real API data
    const {
        dashboardData,
        loading,
        error,
        refreshDashboard,
    } = useDashboard()

    // Get user data from dashboard data, fallback to auth user for authentication check
    const user = dashboardData?.user || authUser

    useEffect(() => {
        // Check if user is authenticated
        if (!authUser) {
            router.push('/login')
            return
        }
    }, [authUser, router])

    // Handle errors
    useEffect(() => {
        if (error) {
            console.error('Dashboard error:', error)
            // You could show a toast notification here
        }
    }, [error])

    const handleLogout = async () => {
        await logout()
        router.push('/login')
    }

    const sidebarItems = [
        { icon: BarChart3, label: 'Dashboard', href: '/dashboard' },
        { icon: BookOpen, label: 'Khóa học của tôi', href: '/dashboard/courses' },
        { icon: Calendar, label: 'Lịch học', href: '/dashboard/schedule' },
        { icon: Award, label: 'Thành tích', href: '/dashboard/achievements' },
        { icon: Activity, label: 'Tiến độ', href: '/dashboard/progress' },
        { icon: Settings, label: 'Cài đặt', href: '/dashboard/settings' },
        // Development: Add instructor studio link
        ...(process.env.NODE_ENV === 'development' ? [
            { icon: GraduationCap, label: 'Instructor Studio', href: '/studio' }
        ] : [])
    ]

    const isItemActive = (href: string) => {
        if (href === '/dashboard') {
            return pathname === '/dashboard'
        }
        return pathname.startsWith(href)
    }

    if (loading && pathname === '/dashboard') {
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
        <div className="min-h-screen bg-background w-full">
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
                                            variant={isItemActive(item.href) ? "default" : "ghost"}
                                            className="w-full justify-start"
                                            onClick={() => {
                                                router.push(item.href)
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
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:z-50">
                <div className="flex flex-col flex-grow bg-card border-r border-border min-h-screen">
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
                                        variant={isItemActive(item.href) ? "default" : "ghost"}
                                        className="w-full justify-start"
                                        onClick={() => router.push(item.href)}
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
            <div className="lg:pl-64 min-h-screen">
                {/* Top Header */}
                <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-4 lg:px-6">
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
                                    <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
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
                    {children}
                </main>
            </div>
        </div>
    )
}
