'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Plus, GraduationCap, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { AppContainer } from '@/components/app-container'

interface StudioLayoutProps {
  children: ReactNode
}

const navigationItems = [
  {
    title: 'Khóa Học Của Tôi',
    href: '/studio',
    icon: BookOpen,
    description: 'Quản lý khóa học của bạn'
  },
  {
    title: 'Tạo Khóa Học',
    href: '/studio/create',
    icon: Plus,
    description: 'Tạo khóa học mới'
  },
  {
    title: 'Bảng Điều Khiển',
    href: '/studio/admin',
    icon: BarChart3,
    description: 'Phân tích và thống kê'
  }
]

export default function StudioLayout({ children }: StudioLayoutProps) {
  // Use regular auth hook instead of useRequireRole for development flexibility
  const { user, isAuthenticated, isLoading } = useAuth()
  const pathname = usePathname()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải studio giảng viên...</p>
        </div>
      </div>
    )
  }

  // Check authentication first
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Vui lòng đăng nhập để truy cập Studio Giảng Viên</p>
          <Button asChild>
            <Link href="/login">Đi đến Đăng Nhập</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Development mode: Allow access regardless of role with warning
  if (process.env.NODE_ENV === 'development' && user?.role !== 'instructor') {
    console.warn(`Studio accessed by user with role: ${user?.role}. This is allowed in development mode.`)
  }

  // Production mode: Strict role checking
  if (process.env.NODE_ENV === 'production' && user?.role !== 'instructor') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Truy cập bị từ chối. Cần quyền giảng viên.</p>
          <Button asChild variant="outline">
            <Link href="/dashboard">Quay lại Bảng Điều Khiển</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <AppContainer>
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <Link
                href="/studio"
                className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
              >
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <GraduationCap className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">Studio Giảng Viên</span>
              </Link>
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Chào mừng, {user?.first_name || user?.full_name}
              </span>
              {process.env.NODE_ENV === 'development' && user?.role !== 'instructor' && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  DEV: {user?.role} role
                </span>
              )}
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard">Thoát Studio</Link>
              </Button>
            </div>
          </div>
        </AppContainer>
      </header>

      <div className="flex">
        {/* Left Sidebar Navigation */}
        <aside className="w-64 border-r border-border bg-muted/10 min-h-[calc(100vh-4rem)]">
          <nav className="p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href === '/studio' && pathname === '/studio')

                return (
                  <li key={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href={item.href as string}>
                        <item.icon className="mr-3 h-4 w-4" />
                        {item.title}
                      </Link>
                    </Button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
