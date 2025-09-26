'use client'

/**
 * Student Schedule Page
 * Manage learning schedule, upcoming classes, and study planning
 */

import { useState } from 'react'
import {
    Calendar,
    Clock,
    Plus,
    Bell,
    BookOpen,
    Target,
    ChevronLeft,
    ChevronRight,
    Filter,
    Eye,
    Edit,
    Trash2,
    AlertCircle,
    CheckCircle,
    PlayCircle,
    Video,
    FileText,
    Users
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// Mock schedule data
const currentDate = new Date('2024-01-22')
const today = new Date()

const upcomingClasses = [
    {
        id: 1,
        title: 'React Advanced Patterns - Bài 18',
        course: 'React Advanced Patterns',
        instructor: 'Trần Thị Lan',
        type: 'video',
        scheduledTime: '2024-01-22 14:00',
        duration: 45, // minutes
        status: 'upcoming',
        description: 'Custom Hooks và Performance Optimization'
    },
    {
        id: 2,
        title: 'JavaScript ES6+ - Quiz Chapter 8',
        course: 'JavaScript ES6+',
        instructor: 'Nguyễn Hữu Đức',
        type: 'quiz',
        scheduledTime: '2024-01-22 16:30',
        duration: 30,
        status: 'upcoming',
        description: 'Async/Await và Promise handling'
    },
    {
        id: 3,
        title: 'Next.js - Live Session',
        course: 'Next.js Full Stack',
        instructor: 'Phạm Thị Diệu',
        type: 'live',
        scheduledTime: '2024-01-23 19:00',
        duration: 90,
        status: 'upcoming',
        description: 'Q&A Session và Code Review'
    }
]

const todaySchedule = [
    {
        id: 1,
        time: '09:00',
        title: 'Morning Study Session',
        course: 'JavaScript ES6+',
        type: 'study',
        duration: 60,
        completed: true
    },
    {
        id: 2,
        time: '14:00',
        title: 'React Advanced Patterns - Bài 18',
        course: 'React Advanced Patterns',
        type: 'video',
        duration: 45,
        completed: false,
        isLive: true
    },
    {
        id: 3,
        time: '16:30',
        title: 'JavaScript Quiz',
        course: 'JavaScript ES6+',
        type: 'quiz',
        duration: 30,
        completed: false
    },
    {
        id: 4,
        time: '20:00',
        title: 'Practice Time',
        course: 'Personal Study',
        type: 'practice',
        duration: 90,
        completed: false
    }
]

const weeklySchedule = [
    {
        day: 'Thứ 2',
        date: '22/01',
        events: [
            { time: '09:00', title: 'JavaScript ES6+ Study', type: 'study' },
            { time: '14:00', title: 'React Advanced - Bài 18', type: 'video' },
            { time: '16:30', title: 'JavaScript Quiz', type: 'quiz' }
        ]
    },
    {
        day: 'Thứ 3',
        date: '23/01',
        events: [
            { time: '19:00', title: 'Next.js Live Session', type: 'live' },
            { time: '20:30', title: 'Code Practice', type: 'practice' }
        ]
    },
    {
        day: 'Thứ 4',
        date: '24/01',
        events: [
            { time: '09:00', title: 'HTML/CSS Review', type: 'study' },
            { time: '15:00', title: 'React Project Work', type: 'practice' }
        ]
    },
    {
        day: 'Thứ 5',
        date: '25/01',
        events: [
            { time: '14:00', title: 'JavaScript Assignment Due', type: 'deadline' },
            { time: '18:00', title: 'Study Group', type: 'group' }
        ]
    },
    {
        day: 'Thứ 6',
        date: '26/01',
        events: [
            { time: '10:00', title: 'React Final Project', type: 'practice' },
            { time: '16:00', title: 'Mentor Session', type: 'meeting' }
        ]
    },
    {
        day: 'Thứ 7',
        date: '27/01',
        events: [
            { time: '09:00', title: 'Weekend Study', type: 'study' }
        ]
    },
    {
        day: 'Chủ nhật',
        date: '28/01',
        events: [
            { time: '10:00', title: 'Weekly Review', type: 'review' }
        ]
    }
]

const deadlines = [
    {
        id: 1,
        title: 'JavaScript ES6+ Final Assignment',
        course: 'JavaScript ES6+',
        dueDate: '2024-01-25',
        dueTime: '23:59',
        priority: 'high',
        completed: false,
        description: 'Build a complete Todo App with ES6+ features'
    },
    {
        id: 2,
        title: 'React Portfolio Project',
        course: 'React Advanced Patterns',
        dueDate: '2024-01-30',
        dueTime: '18:00',
        priority: 'medium',
        completed: false,
        description: 'Create a personal portfolio using advanced React patterns'
    },
    {
        id: 3,
        title: 'CSS Grid Layout Quiz',
        course: 'HTML & CSS',
        dueDate: '2024-01-24',
        dueTime: '15:00',
        priority: 'low',
        completed: true,
        description: 'Complete the CSS Grid assessment'
    }
]

const studySessions = [
    {
        id: 1,
        title: 'Morning Focus Time',
        time: '09:00 - 10:30',
        recurring: 'daily',
        courses: ['JavaScript ES6+', 'React Advanced']
    },
    {
        id: 2,
        title: 'Evening Practice',
        time: '20:00 - 21:30',
        recurring: 'weekdays',
        courses: ['Personal Projects']
    },
    {
        id: 3,
        title: 'Weekend Deep Dive',
        time: '10:00 - 12:00',
        recurring: 'weekends',
        courses: ['New Topics', 'Review']
    }
]

export default function StudentSchedulePage() {
    const [selectedView, setSelectedView] = useState('today')
    const [selectedFilter, setSelectedFilter] = useState('all')

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'video':
                return <Video className="h-4 w-4" />
            case 'quiz':
                return <FileText className="h-4 w-4" />
            case 'live':
                return <Users className="h-4 w-4" />
            case 'practice':
                return <Target className="h-4 w-4" />
            case 'study':
                return <BookOpen className="h-4 w-4" />
            case 'deadline':
                return <AlertCircle className="h-4 w-4" />
            default:
                return <Clock className="h-4 w-4" />
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'video':
                return 'bg-blue-100 text-blue-800'
            case 'quiz':
                return 'bg-purple-100 text-purple-800'
            case 'live':
                return 'bg-red-100 text-red-800'
            case 'practice':
                return 'bg-green-100 text-green-800'
            case 'study':
                return 'bg-yellow-100 text-yellow-800'
            case 'deadline':
                return 'bg-orange-100 text-orange-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'border-l-red-500 bg-red-50'
            case 'medium':
                return 'border-l-yellow-500 bg-yellow-50'
            case 'low':
                return 'border-l-green-500 bg-green-50'
            default:
                return 'border-l-gray-500 bg-gray-50'
        }
    }

    const formatTime = (dateTimeString: string) => {
        const date = new Date(dateTimeString)
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const isToday = (dateString: string) => {
        const date = new Date(dateString)
        const today = new Date()
        return date.toDateString() === today.toDateString()
    }

    const isUpcoming = (dateTimeString: string) => {
        const eventTime = new Date(dateTimeString)
        const now = new Date()
        return eventTime > now
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Lịch học</h1>
                    <p className="text-muted-foreground">
                        Quản lý thời gian học tập và theo dõi deadline
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Select value={selectedView} onValueChange={setSelectedView}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">Hôm nay</SelectItem>
                            <SelectItem value="week">Tuần này</SelectItem>
                            <SelectItem value="month">Tháng này</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm lịch học
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hôm nay</CardTitle>
                        <Calendar className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {todaySchedule.length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {todaySchedule.filter(s => s.completed).length} hoàn thành
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sắp tới</CardTitle>
                        <Clock className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">
                            {upcomingClasses.length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Bài học trong 24h
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Deadline</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {deadlines.filter(d => !d.completed).length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Chưa hoàn thành
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Thời gian học</CardTitle>
                        <Target className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">5.5h</div>
                        <p className="text-xs text-muted-foreground">
                            Hôm nay
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="schedule" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="schedule">Lịch học</TabsTrigger>
                    <TabsTrigger value="upcoming">Sắp diễn ra</TabsTrigger>
                    <TabsTrigger value="deadlines">Deadline</TabsTrigger>
                    <TabsTrigger value="study-plan">Kế hoạch học</TabsTrigger>
                </TabsList>

                {/* Schedule Tab */}
                <TabsContent value="schedule" className="space-y-4">
                    {selectedView === 'today' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Lịch hôm nay - {currentDate.toLocaleDateString('vi-VN')}</CardTitle>
                                <CardDescription>
                                    Các hoạt động học tập trong ngày
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {todaySchedule.map((item) => (
                                        <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                                            <div className="text-center min-w-[60px]">
                                                <div className="font-medium">{item.time}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {item.duration}min
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2">
                                                    {getTypeIcon(item.type)}
                                                    <h4 className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                                                        {item.title}
                                                    </h4>
                                                    {item.isLive && (
                                                        <Badge className="bg-red-100 text-red-800">
                                                            LIVE
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">{item.course}</p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {item.completed ? (
                                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                                ) : (
                                                    <Button size="sm" variant={item.isLive ? 'default' : 'outline'}>
                                                        {item.isLive ? (
                                                            <>
                                                                <PlayCircle className="h-4 w-4 mr-2" />
                                                                Tham gia
                                                            </>
                                                        ) : (
                                                            'Bắt đầu'
                                                        )}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {selectedView === 'week' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Lịch tuần này</CardTitle>
                                <CardDescription>
                                    Tổng quan lịch học trong 7 ngày
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                                    {weeklySchedule.map((day, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="text-center">
                                                <div className="font-medium">{day.day}</div>
                                                <div className="text-sm text-muted-foreground">{day.date}</div>
                                            </div>
                                            <div className="space-y-2">
                                                {day.events.map((event, eventIndex) => (
                                                    <div key={eventIndex} className={`p-2 rounded text-xs ${getTypeColor(event.type)}`}>
                                                        <div className="font-medium">{event.time}</div>
                                                        <div className="truncate">{event.title}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Upcoming Tab */}
                <TabsContent value="upcoming" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Bài học sắp diễn ra</CardTitle>
                            <CardDescription>
                                Các bài học và hoạt động trong 24 giờ tới
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {upcomingClasses.map((classItem) => (
                                    <div key={classItem.id} className="border rounded-lg p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start space-x-3">
                                                <div className={`p-2 rounded-lg ${getTypeColor(classItem.type)}`}>
                                                    {getTypeIcon(classItem.type)}
                                                </div>
                                                <div>
                                                    <h4 className="font-medium">{classItem.title}</h4>
                                                    <p className="text-sm text-muted-foreground mb-1">
                                                        {classItem.course} • {classItem.instructor}
                                                    </p>
                                                    <p className="text-sm">{classItem.description}</p>
                                                    <div className="flex items-center space-x-2 mt-2 text-sm text-muted-foreground">
                                                        <Clock className="h-3 w-3" />
                                                        <span>{formatTime(classItem.scheduledTime)}</span>
                                                        <span>• {classItem.duration} phút</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button variant="outline" size="sm">
                                                    <Bell className="h-4 w-4 mr-2" />
                                                    Nhắc nhở
                                                </Button>
                                                {classItem.type === 'live' ? (
                                                    <Button size="sm">
                                                        <Users className="h-4 w-4 mr-2" />
                                                        Tham gia
                                                    </Button>
                                                ) : (
                                                    <Button size="sm">
                                                        <PlayCircle className="h-4 w-4 mr-2" />
                                                        Bắt đầu
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Deadlines Tab */}
                <TabsContent value="deadlines" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Deadline & Bài tập</CardTitle>
                            <CardDescription>
                                Theo dõi các deadline và bài tập cần hoàn thành
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {deadlines.map((deadline) => (
                                    <div key={deadline.id} className={`border-l-4 rounded-lg p-4 ${getPriorityColor(deadline.priority)}`}>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2">
                                                    <h4 className={`font-medium ${deadline.completed ? 'line-through text-muted-foreground' : ''}`}>
                                                        {deadline.title}
                                                    </h4>
                                                    {deadline.completed && (
                                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    {deadline.course}
                                                </p>
                                                <p className="text-sm">{deadline.description}</p>
                                                <div className="flex items-center space-x-4 mt-2 text-sm">
                                                    <div className="flex items-center space-x-1">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>{deadline.dueDate}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <Clock className="h-3 w-3" />
                                                        <span>{deadline.dueTime}</span>
                                                    </div>
                                                    <Badge className={
                                                        deadline.priority === 'high' ? 'bg-red-100 text-red-800' :
                                                            deadline.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-green-100 text-green-800'
                                                    }>
                                                        {deadline.priority === 'high' ? 'Cao' :
                                                            deadline.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                                                    </Badge>
                                                </div>
                                            </div>
                                            {!deadline.completed && (
                                                <div className="flex space-x-2">
                                                    <Button variant="outline" size="sm">
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Chỉnh sửa
                                                    </Button>
                                                    <Button size="sm">
                                                        Bắt đầu làm
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Study Plan Tab */}
                <TabsContent value="study-plan" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Kế hoạch học tập</CardTitle>
                            <CardDescription>
                                Lên kế hoạch và theo dõi thói quen học tập
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {studySessions.map((session) => (
                                    <div key={session.id} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium">{session.title}</h4>
                                                <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                                                    <div className="flex items-center space-x-1">
                                                        <Clock className="h-3 w-3" />
                                                        <span>{session.time}</span>
                                                    </div>
                                                    <span>• {session.recurring}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 mt-2">
                                                    {session.courses.map((course, index) => (
                                                        <Badge key={index} variant="outline">
                                                            {course}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button variant="outline" size="sm">
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Sửa
                                                </Button>
                                                <Button variant="outline" size="sm">
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Xóa
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <Button className="w-full" variant="outline">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Thêm kế hoạch học tập
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
