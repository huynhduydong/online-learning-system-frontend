'use client'

/**
 * Student Progress Page
 * Track learning progress, completed courses, and learning analytics
 */

import { useState } from 'react'
import {
    TrendingUp,
    Clock,
    Target,
    Calendar,
    BookOpen,
    Award,
    BarChart3,
    Activity,
    PlayCircle,
    CheckCircle,
    Star,
    Timer,
    Flame
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Mock progress data
const progressStats = {
    totalCourses: 8,
    completedCourses: 3,
    inProgressCourses: 4,
    totalHours: 127,
    weeklyGoal: 10,
    weeklyProgress: 8.5,
    streak: 12,
    totalCertificates: 3,
    skillPoints: 2450
}

const coursesProgress = [
    {
        id: 1,
        title: 'React Advanced Patterns',
        instructor: 'Trần Thị Lan',
        progress: 85,
        completedLessons: 17,
        totalLessons: 20,
        timeSpent: 45, // hours
        lastActivity: '2024-01-20',
        status: 'in_progress',
        difficulty: 'Advanced',
        rating: 4.9
    },
    {
        id: 2,
        title: 'JavaScript ES6+ Complete Guide',
        instructor: 'Nguyễn Hữu Đức',
        progress: 100,
        completedLessons: 25,
        totalLessons: 25,
        timeSpent: 38,
        lastActivity: '2024-01-18',
        status: 'completed',
        difficulty: 'Intermediate',
        rating: 4.7,
        completedAt: '2024-01-18',
        certificateId: 'CERT-JS-001'
    },
    {
        id: 3,
        title: 'HTML & CSS Fundamentals',
        instructor: 'Lê Minh Cường',
        progress: 100,
        completedLessons: 15,
        totalLessons: 15,
        timeSpent: 22,
        lastActivity: '2024-01-10',
        status: 'completed',
        difficulty: 'Beginner',
        rating: 4.5,
        completedAt: '2024-01-10',
        certificateId: 'CERT-HTML-001'
    },
    {
        id: 4,
        title: 'Next.js Full Stack Development',
        instructor: 'Phạm Thị Diệu',
        progress: 42,
        completedLessons: 8,
        totalLessons: 19,
        timeSpent: 22,
        lastActivity: '2024-01-19',
        status: 'in_progress',
        difficulty: 'Advanced',
        rating: 4.8
    }
]

const weeklyActivity = [
    { day: 'T2', hours: 2.5, lessons: 3 },
    { day: 'T3', hours: 1.5, lessons: 2 },
    { day: 'T4', hours: 0, lessons: 0 },
    { day: 'T5', hours: 3, lessons: 4 },
    { day: 'T6', hours: 1.5, lessons: 2 },
    { day: 'T7', hours: 0, lessons: 0 },
    { day: 'CN', hours: 0, lessons: 0 }
]

const skillsProgress = [
    { skill: 'JavaScript', level: 'Advanced', progress: 85, courses: 3 },
    { skill: 'React', level: 'Intermediate', progress: 72, courses: 2 },
    { skill: 'HTML/CSS', level: 'Advanced', progress: 90, courses: 2 },
    { skill: 'Node.js', level: 'Beginner', progress: 35, courses: 1 },
    { skill: 'TypeScript', level: 'Beginner', progress: 28, courses: 1 }
]

const achievements = [
    {
        id: 1,
        title: 'First Course Completed',
        description: 'Hoàn thành khóa học đầu tiên',
        icon: '🎯',
        earnedAt: '2024-01-10',
        points: 100
    },
    {
        id: 2,
        title: 'Week Streak',
        description: 'Học liên tục 7 ngày',
        icon: '🔥',
        earnedAt: '2024-01-15',
        points: 150
    },
    {
        id: 3,
        title: 'JavaScript Master',
        description: 'Hoàn thành tất cả khóa học JavaScript',
        icon: '⚡',
        earnedAt: '2024-01-18',
        points: 300
    }
]

export default function StudentProgressPage() {
    const [selectedPeriod, setSelectedPeriod] = useState('week')

    const getProgressColor = (progress: number) => {
        if (progress >= 80) return 'text-green-600'
        if (progress >= 50) return 'text-yellow-600'
        return 'text-red-600'
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800'
            case 'in_progress':
                return 'bg-blue-100 text-blue-800'
            case 'not_started':
                return 'bg-gray-100 text-gray-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Beginner':
                return 'bg-green-100 text-green-800'
            case 'Intermediate':
                return 'bg-yellow-100 text-yellow-800'
            case 'Advanced':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tiến độ học tập</h1>
                    <p className="text-muted-foreground">
                        Theo dõi quá trình học tập và phát triển kỹ năng
                    </p>
                </div>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="week">Tuần này</SelectItem>
                        <SelectItem value="month">Tháng này</SelectItem>
                        <SelectItem value="year">Năm này</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Khóa học đã hoàn thành</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {progressStats.completedCourses}/{progressStats.totalCourses}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {Math.round((progressStats.completedCourses / progressStats.totalCourses) * 100)}% hoàn thành
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng thời gian học</CardTitle>
                        <Clock className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{progressStats.totalHours}h</div>
                        <p className="text-xs text-muted-foreground">
                            +8.5h tuần này
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Streak học tập</CardTitle>
                        <Flame className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{progressStats.streak} ngày</div>
                        <p className="text-xs text-muted-foreground">
                            Kỷ lục cá nhân
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Điểm kỹ năng</CardTitle>
                        <Star className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{progressStats.skillPoints.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            +450 điểm tuần này
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Weekly Goal */}
            <Card>
                <CardHeader>
                    <CardTitle>Mục tiêu tuần này</CardTitle>
                    <CardDescription>
                        Theo dõi tiến độ đạt mục tiêu học tập hàng tuần
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium">
                                    {progressStats.weeklyProgress}h / {progressStats.weeklyGoal}h
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Còn {progressStats.weeklyGoal - progressStats.weeklyProgress}h để đạt mục tiêu
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-blue-600">
                                    {Math.round((progressStats.weeklyProgress / progressStats.weeklyGoal) * 100)}%
                                </div>
                            </div>
                        </div>
                        <Progress value={(progressStats.weeklyProgress / progressStats.weeklyGoal) * 100} />

                        {/* Weekly Activity Chart */}
                        <div className="grid grid-cols-7 gap-2 mt-4">
                            {weeklyActivity.map((day, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-xs text-muted-foreground mb-1">{day.day}</div>
                                    <div
                                        className="bg-blue-100 rounded-sm mx-auto"
                                        style={{
                                            height: `${Math.max(20, day.hours * 20)}px`,
                                            width: '24px'
                                        }}
                                    />
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {day.hours}h
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Main Content Tabs */}
            <Tabs defaultValue="courses" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="courses">Khóa học</TabsTrigger>
                    <TabsTrigger value="skills">Kỹ năng</TabsTrigger>
                    <TabsTrigger value="achievements">Thành tích</TabsTrigger>
                </TabsList>

                {/* Courses Progress */}
                <TabsContent value="courses" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tiến độ khóa học</CardTitle>
                            <CardDescription>
                                Chi tiết về các khóa học bạn đang theo học
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {coursesProgress.map((course) => (
                                    <div key={course.id} className="border rounded-lg p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h4 className="font-medium">{course.title}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Giảng viên: {course.instructor}
                                                </p>
                                                <div className="flex items-center space-x-2 mt-2">
                                                    <Badge className={getDifficultyColor(course.difficulty)}>
                                                        {course.difficulty}
                                                    </Badge>
                                                    <Badge className={getStatusColor(course.status)}>
                                                        {course.status === 'completed' ? 'Hoàn thành' : 'Đang học'}
                                                    </Badge>
                                                    <div className="flex items-center space-x-1">
                                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                        <span className="text-xs">{course.rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-lg font-bold ${getProgressColor(course.progress)}`}>
                                                    {course.progress}%
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {course.completedLessons}/{course.totalLessons} bài học
                                                </div>
                                            </div>
                                        </div>

                                        <Progress value={course.progress} className="mb-3" />

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <span className="text-muted-foreground">Thời gian học</span>
                                                <div className="font-medium">{course.timeSpent}h</div>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Hoạt động cuối</span>
                                                <div className="font-medium">{course.lastActivity}</div>
                                            </div>
                                            {course.status === 'completed' && (
                                                <>
                                                    <div>
                                                        <span className="text-muted-foreground">Hoàn thành</span>
                                                        <div className="font-medium">{course.completedAt}</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Chứng chỉ</span>
                                                        <div className="font-medium text-green-600">
                                                            {course.certificateId}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {course.status === 'in_progress' && (
                                            <div className="flex justify-end mt-3">
                                                <Button size="sm">
                                                    <PlayCircle className="h-4 w-4 mr-2" />
                                                    Tiếp tục học
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Skills Progress */}
                <TabsContent value="skills" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Phát triển kỹ năng</CardTitle>
                            <CardDescription>
                                Theo dõi sự tiến bộ trong các kỹ năng lập trình
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {skillsProgress.map((skill, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <h4 className="font-medium">{skill.skill}</h4>
                                                <Badge variant="outline">{skill.level}</Badge>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium">{skill.progress}%</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {skill.courses} khóa học
                                                </div>
                                            </div>
                                        </div>
                                        <Progress value={skill.progress} />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Achievements */}
                <TabsContent value="achievements" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thành tích đã đạt được</CardTitle>
                            <CardDescription>
                                Các cột mốc và thành tích trong quá trình học tập
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {achievements.map((achievement) => (
                                    <div key={achievement.id} className="border rounded-lg p-4 text-center">
                                        <div className="text-4xl mb-2">{achievement.icon}</div>
                                        <h4 className="font-medium mb-1">{achievement.title}</h4>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            {achievement.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-muted-foreground">
                                                {achievement.earnedAt}
                                            </span>
                                            <Badge variant="secondary">
                                                +{achievement.points} điểm
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
