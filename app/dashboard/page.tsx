'use client'

/**
 * Dashboard Home Page
 * Main dashboard with user statistics, recent courses, and achievements
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  BookOpen,
  Clock,
  Target,
  PlayCircle,
  CheckCircle,
  Award
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

import { useAuth } from '@/contexts/auth-context'
import { useDashboard } from '@/hooks/use-dashboard'

export default function DashboardPage() {
  const { user: authUser } = useAuth()
  const router = useRouter()

  // Use dashboard hook for real API data
  const {
    dashboardData,
    stats,
    recentCourses,
    achievements,
    loading,
    error,
  } = useDashboard()

  // Get user data from dashboard data, fallback to auth user for authentication check
  const user = dashboardData?.user || authUser

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-muted rounded-lg mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Chào mừng trở lại, {user?.full_name || user?.name}!
        </p>
      </div>
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
    </>
  )
}