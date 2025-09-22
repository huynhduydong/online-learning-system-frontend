"use client"

import * as React from "react"
import Link from "next/link"
import { Search, Menu, User, Bell, Settings, LogOut } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { AppContainer } from "./app-container"
import { ThemeToggle } from "./theme-toggle"
import { CourseCategoriesNav } from "./course-categories-nav"

interface NavItem {
  title: string
  href: string
  description?: string
}

interface AppHeaderProps {
  className?: string
  navItems?: NavItem[]
  user?: {
    name: string
    email: string
    avatar?: string
  }
  onSearch?: (query: string) => void
  showSearch?: boolean
  showNotifications?: boolean
  notificationCount?: number
}

const defaultNavItems: NavItem[] = [
  {
    title: "Trang chủ",
    href: "/",
    description: "Trang chủ của hệ thống"
  },
  {
    title: "Giảng viên",
    href: "/instructors",
    description: "Thông tin giảng viên"
  },
  {
    title: "Về chúng tôi",
    href: "/about",
    description: "Thông tin về chúng tôi"
  }
]

export function AppHeader({
  className,
  navItems,
  user: userProp,
  onSearch,
  showSearch = true,
  showNotifications = true,
  notificationCount = 0
}: AppHeaderProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isSearchFocused, setIsSearchFocused] = React.useState(false)

  // Use auth context for user data and authentication
  const { user: authUser, logout, isAuthenticated } = useAuth()

  // Prefer auth context user over props
  const user = authUser || userProp

  // Helper functions for safe property access
  const getUserName = () => {
    if (authUser) return authUser.full_name || `${authUser.first_name} ${authUser.last_name}`.trim()
    return userProp?.name || 'User'
  }

  const getUserAvatar = () => {
    if (authUser) return authUser.profile_image || undefined
    return userProp?.avatar
  }

  const finalNavItems = navItems || defaultNavItems

  const handleLogout = async () => {
    try {
      await logout()
      // Redirect to home page after logout
      window.location.href = '/'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchQuery)
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
      role="banner"
    >
      <AppContainer>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
              aria-label="Về trang chủ"
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">EL</span>
              </div>
              <span className="hidden font-bold sm:inline-block text-lg">
                E-Learning
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6" role="navigation" aria-label="Menu điều hướng chính">
            <CourseCategoriesNav />
            {finalNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1"
                title={item.description}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          {showSearch && (
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Tìm kiếm khóa học..."
                  className={cn(
                    "pl-10 pr-4 transition-all duration-200",
                    isSearchFocused && "ring-2 ring-primary"
                  )}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  aria-label="Tìm kiếm khóa học"
                />
              </form>
            </div>
          )}

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search */}
            {showSearch && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Search className="h-5 w-5" />
                    <span className="sr-only">Tìm kiếm</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="top" className="h-auto">
                  <SheetHeader>
                    <SheetTitle>Tìm kiếm</SheetTitle>
                    <SheetDescription>
                      Tìm kiếm khóa học, giảng viên hoặc nội dung
                    </SheetDescription>
                  </SheetHeader>
                  <form onSubmit={handleSearch} className="mt-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Nhập từ khóa tìm kiếm..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                      />
                    </div>
                  </form>
                </SheetContent>
              </Sheet>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            {showNotifications && (
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                  >
                    {notificationCount > 99 ? "99+" : notificationCount}
                  </Badge>
                )}
                <span className="sr-only">
                  Thông báo {notificationCount > 0 && `(${notificationCount})`}
                </span>
              </Button>
            )}

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={getUserAvatar()} alt={getUserName()} />
                      <AvatarFallback>{getUserName().charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{getUserName()}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Hồ sơ</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Cài đặt</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Đăng nhập</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Đăng ký</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Mở menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Điều hướng trang web
                  </SheetDescription>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-6" role="navigation" aria-label="Menu điều hướng di động">
                  <div className="px-2 py-1">
                    <CourseCategoriesNav className="w-full" isMobile={true} />
                  </div>
                  {finalNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-sm font-medium transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1"
                    >
                      {item.title}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </AppContainer>
    </header>
  )
}