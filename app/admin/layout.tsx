'use client'

/**
 * Admin Dashboard Layout Component
 * Layout for admin-only dashboard pages with role-based access control
 */

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
    BarChart3,
    Users,
    BookOpen,
    Settings,
    Shield,
    Activity,
    Bell,
    LogOut,
    Menu,
    X,
    RefreshCw,
    AlertCircle,
    Database,
    FileText,
    UserCheck
} from 'lucide-react'

import { Button } from '@/components/ui/button'
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

interface AdminLayoutProps {
    children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { user, logout, isLoading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        // Check if user is authenticated
        if (!isLoading && !user) {
            router.push('/login')
            return
        }

        // Check if user has admin role
        if (!isLoading && user && user.role !== 'admin') {
            // Redirect non-admin users to appropriate dashboard
            switch (user.role) {
                case 'instructor':
                    router.push('/studio')
                    break
                case 'student':
                default:
                    router.push('/dashboard')
                    break
            }
            return
        }
    }, [user, isLoading, router])

    const handleLogout = async () => {
        await logout()
        router.push('/login')
    }

    const adminSidebarItems = [
        { icon: BarChart3, label: 'Dashboard', href: '/admin' },
        { icon: Users, label: 'Quản lý người dùng', href: '/admin/users' },
        { icon: BookOpen, label: 'Quản lý khóa học', href: '/admin/courses' },
        { icon: UserCheck, label: 'Quản lý giảng viên', href: '/admin/instructors' },
        { icon: Database, label: 'Dữ liệu hệ thống', href: '/admin/analytics' },
        { icon: FileText, label: 'Báo cáo', href: '/admin/reports' },
        { icon: Shield, label: 'Bảo mật', href: '/admin/security' },
        { icon: Settings, label: 'Cài đặt hệ thống', href: '/admin/settings' },
    ]

    const isItemActive = (href: string) => {
        if (href === '/admin') {
            return pathname === '/admin'
        }
        return pathname.startsWith(href)
    }

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Đang tải admin dashboard...</p>
                </div>
            </div>
        )
    }

    // Don't render anything if user is not admin (redirects handled in useEffect)
    if (!user || user.role !== 'admin') {
        return null
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
                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                                    <Shield className="text-white h-4 w-4" />
                                </div>
                                <span className="font-bold text-lg">Admin Panel</span>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 p-4">
                            <ul className="space-y-2">
                                {adminSidebarItems.map((item) => (
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
                                        {(user?.full_name || user?.name)?.charAt(0)?.toUpperCase() || 'A'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{user?.full_name || user?.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">Quản trị viên</p>
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
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                                <Shield className="text-white h-4 w-4" />
                            </div>
                            <span className="font-bold text-lg">Admin Panel</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4">
                        <ul className="space-y-2">
                            {adminSidebarItems.map((item) => (
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
                                    {(user?.full_name || user?.name)?.charAt(0)?.toUpperCase() || 'A'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user?.full_name || user?.name}</p>
                                <p className="text-xs text-muted-foreground truncate">Quản trị viên</p>
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
                            <h1 className="text-lg font-semibold">Bảng điều khiển quản trị</h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="icon">
                                <Bell className="h-5 w-5" />
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user?.profile_image || user?.avatar} />
                                            <AvatarFallback>
                                                {(user?.full_name || user?.name)?.charAt(0)?.toUpperCase() || 'A'}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user?.full_name || user?.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                Quản trị viên hệ thống
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => router.push('/admin/settings')}>
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

                {/* Admin Dashboard Content */}
                <main className="p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
