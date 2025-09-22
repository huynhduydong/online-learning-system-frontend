'use client'

/**
 * Individual Lesson Page
 * Displays lesson content, video, and navigation
 */

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
    Play,
    Pause,
    ChevronLeft,
    ChevronRight,
    BookOpen,
    CheckCircle,
    Clock,
    FileText,
    Download,
    Volume2,
    Settings,
    Maximize,
    ArrowLeft,
    Menu
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
    Sheet,
    SheetContent,
    SheetTrigger
} from '@/components/ui/sheet'

import { useAuth } from '@/contexts/auth-context'
import { useLesson } from '@/hooks/use-lesson'

export default function LessonPage() {
    const params = useParams()
    const router = useRouter()
    const { user } = useAuth()

    const courseSlug = params.slug as string
    const lessonId = params.lessonId as string

    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    // Use lesson hook for data management
    const {
        course,
        currentLesson,
        nextLesson,
        previousLesson,
        currentModule,
        isLoading,
        error,
        isMarkingComplete,
        isTrackingProgress,
        markComplete,
        trackProgress,
        refreshData
    } = useLesson({ courseSlug, lessonId })

    const handleMarkComplete = async () => {
        if (!currentLesson || currentLesson.progress.is_completed) return

        try {
            await markComplete()
        } catch (error) {
            console.error('Failed to mark lesson complete:', error)
        }
    }

    const navigateToLesson = (newLessonId: string) => {
        router.push(`/courses/${courseSlug}/lessons/${newLessonId}`)
        setSidebarOpen(false)
    }

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        if (hours > 0) {
            return `${hours}h ${mins}m`
        }
        return `${mins}m`
    }

    const formatFileSize = (bytes: number) => {
        const mb = bytes / (1024 * 1024)
        return `${mb.toFixed(1)} MB`
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Đang tải bài học...</p>
                </div>
            </div>
        )
    }

    if (error || !course || !currentLesson) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">
                        {error ? 'Có lỗi xảy ra' : 'Không tìm thấy bài học'}
                    </h2>
                    <p className="text-muted-foreground mb-4">
                        {error || 'Bài học này không tồn tại hoặc bạn không có quyền truy cập'}
                    </p>
                    <div className="flex gap-2 justify-center">
                        <Button onClick={() => router.push('/dashboard/courses')}>
                            Quay lại khóa học
                        </Button>
                        {error && (
                            <Button variant="outline" onClick={refreshData}>
                                Thử lại
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile Sidebar */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetContent side="left" className="w-80 p-0">
                    <div className="flex flex-col h-full">
                        <div className="p-4 border-b">
                            <h3 className="font-semibold">{course.course.title}</h3>
                            <p className="text-sm text-muted-foreground">
                                {course.progress.completed_lessons}/{course.progress.total_lessons} bài học
                            </p>
                            <Progress
                                value={course.progress.completion_percentage}
                                className="mt-2"
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="space-y-4">
                                {course.modules.map((module) => (
                                    <div key={module.id}>
                                        <h4 className="font-semibold text-sm mb-2 text-primary">
                                            {module.title}
                                        </h4>
                                        <div className="space-y-2 pl-2">
                                            {module.lessons.map((lesson) => (
                                                <div
                                                    key={lesson.id}
                                                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${lesson.id === currentLesson?.id
                                                        ? 'border-primary bg-primary/5'
                                                        : lesson.progress.status === 'not_started' && !lesson.is_preview
                                                            ? 'border-muted bg-muted/20 cursor-not-allowed opacity-60'
                                                            : 'border-border hover:border-primary/50'
                                                        }`}
                                                    onClick={() => (lesson.is_preview || lesson.progress.status !== 'not_started') && navigateToLesson(lesson.id.toString())}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-shrink-0">
                                                            {lesson.progress.is_completed ? (
                                                                <CheckCircle className="h-5 w-5 text-green-600" />
                                                            ) : lesson.progress.status === 'in_progress' ? (
                                                                <div className="h-5 w-5 rounded-full border-2 border-primary bg-primary/20" />
                                                            ) : lesson.is_preview ? (
                                                                <div className="h-5 w-5 rounded-full border-2 border-primary" />
                                                            ) : (
                                                                <div className="h-5 w-5 rounded-full border-2 border-muted-foreground bg-muted" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-medium text-sm line-clamp-2">{lesson.title}</p>
                                                                {lesson.is_preview && (
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        Xem trước
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                                <Clock className="h-3 w-3" />
                                                                <span>{formatDuration(lesson.duration_minutes)}</span>
                                                                <span>•</span>
                                                                <span>Bài {lesson.sort_order}</span>
                                                                {lesson.progress.completion_percentage > 0 && lesson.progress.completion_percentage < 100 && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <span>{Math.round(lesson.progress.completion_percentage)}%</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Desktop Sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-80 lg:flex-col">
                <div className="flex flex-col flex-grow bg-card border-r border-border">
                    <div className="p-4 border-b border-border">
                        <Button variant="ghost" onClick={() => router.push('/dashboard/courses')} className="mb-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Quay lại khóa học
                        </Button>
                        <h3 className="font-semibold">{course.course.title}</h3>
                        <p className="text-sm text-muted-foreground">
                            {course.progress.completed_lessons}/{course.progress.total_lessons} bài học
                        </p>
                        <Progress
                            value={course.progress.completion_percentage}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-4">
                            {course.modules.map((module) => (
                                <div key={module.id}>
                                    <h4 className="font-semibold text-sm mb-2 text-primary">
                                        {module.title}
                                    </h4>
                                    <div className="space-y-2 pl-2">
                                        {module.lessons.map((lesson) => (
                                            <div
                                                key={lesson.id}
                                                className={`p-3 rounded-lg border cursor-pointer transition-colors ${lesson.id === currentLesson?.id
                                                    ? 'border-primary bg-primary/5'
                                                    : lesson.progress.status === 'not_started' && !lesson.is_preview
                                                        ? 'border-muted bg-muted/20 cursor-not-allowed opacity-60'
                                                        : 'border-border hover:border-primary/50'
                                                    }`}
                                                onClick={() => (lesson.is_preview || lesson.progress.status !== 'not_started') && navigateToLesson(lesson.id.toString())}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-shrink-0">
                                                        {lesson.progress.is_completed ? (
                                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                                        ) : lesson.progress.status === 'in_progress' ? (
                                                            <div className="h-5 w-5 rounded-full border-2 border-primary bg-primary/20" />
                                                        ) : lesson.is_preview ? (
                                                            <div className="h-5 w-5 rounded-full border-2 border-primary" />
                                                        ) : (
                                                            <div className="h-5 w-5 rounded-full border-2 border-muted-foreground bg-muted" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-medium text-sm line-clamp-2">{lesson.title}</p>
                                                            {lesson.is_preview && (
                                                                <Badge variant="secondary" className="text-xs">
                                                                    Xem trước
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                            <Clock className="h-3 w-3" />
                                                            <span>{formatDuration(lesson.duration_minutes)}</span>
                                                            <span>•</span>
                                                            <span>Bài {lesson.sort_order}</span>
                                                            {lesson.progress.completion_percentage > 0 && lesson.progress.completion_percentage < 100 && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span>{Math.round(lesson.progress.completion_percentage)}%</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:pl-80">
                {/* Mobile Header */}
                <header className="lg:hidden bg-card border-b border-border px-4 py-3">
                    <div className="flex items-center justify-between">
                        <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
                            <Menu className="h-5 w-5" />
                        </Button>
                        <h1 className="font-semibold text-lg line-clamp-1">{currentLesson.title}</h1>
                        <div className="w-10" /> {/* Spacer */}
                    </div>
                </header>

                {/* Video Player */}
                <div className="bg-black aspect-video">
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        {currentLesson.contents?.find(c => c.file_url && c.file_url.includes('video')) ? (
                            <div className="text-center text-white">
                                <Play className="h-16 w-16 mx-auto mb-4" />
                                <p>Video Player Placeholder</p>
                                <p className="text-sm opacity-75 mt-2">
                                    Type: {currentLesson.content_type}
                                </p>
                                <div className="mt-2">
                                    <Progress value={currentLesson.progress.completion_percentage} className="w-64 mx-auto" />
                                    <p className="text-xs opacity-75 mt-1">
                                        {Math.round(currentLesson.progress.completion_percentage)}% hoàn thành
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-white">
                                <FileText className="h-16 w-16 mx-auto mb-4" />
                                <p>Nội dung bài học</p>
                                <p className="text-sm opacity-75 mt-2">
                                    Type: {currentLesson.content_type}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Lesson Content */}
                <div className="p-4 lg:p-6">
                    <div className="max-w-4xl mx-auto">
                        {/* Lesson Header */}
                        <div className="mb-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h1 className="text-2xl font-bold mb-2">{currentLesson.title}</h1>
                                    <p className="text-muted-foreground">{currentLesson.description}</p>
                                    {currentModule && (
                                        <p className="text-sm text-primary mt-1">
                                            Module: {currentModule.title}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <Badge variant="outline" className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {formatDuration(currentLesson.duration_minutes)}
                                    </Badge>
                                    <Badge variant="outline">
                                        Bài {currentLesson.sort_order}
                                    </Badge>
                                    {currentLesson.is_preview && (
                                        <Badge variant="secondary">
                                            Xem trước
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* Progress Info */}
                            {currentLesson.progress.completion_percentage > 0 && !currentLesson.progress.is_completed && (
                                <div className="mb-4">
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span>Tiến trình học tập</span>
                                        <span>{Math.round(currentLesson.progress.completion_percentage)}%</span>
                                    </div>
                                    <Progress value={currentLesson.progress.completion_percentage} />
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3">
                                {!currentLesson.progress.is_completed && (
                                    <Button
                                        onClick={handleMarkComplete}
                                        disabled={isMarkingComplete}
                                    >
                                        {isMarkingComplete ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Đang xử lý...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Đánh dấu hoàn thành
                                            </>
                                        )}
                                    </Button>
                                )}
                                {currentLesson.progress.is_completed && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        <CheckCircle className="h-3 w-3" />
                                        Đã hoàn thành
                                    </Badge>
                                )}
                                {currentLesson.progress.watch_time_seconds > 0 && (
                                    <Badge variant="outline" className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        Đã xem {Math.round(currentLesson.progress.watch_time_seconds / 60)}m
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <Separator className="mb-6" />

                        {/* Lesson Contents */}
                        {currentLesson.contents && currentLesson.contents.length > 0 && (
                            <div className="space-y-6 mb-6">
                                {currentLesson.contents.map((content) => (
                                    <Card key={content.id}>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <FileText className="h-5 w-5" />
                                                {content.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {content.content_data ? (
                                                <div
                                                    className="prose max-w-none"
                                                    dangerouslySetInnerHTML={{ __html: content.content_data }}
                                                />
                                            ) : content.file_url ? (
                                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-primary/10 rounded">
                                                            <FileText className="h-4 w-4 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{content.title}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {content.file_url.includes('video') ? 'Video' :
                                                                    content.file_url.includes('pdf') ? 'PDF' : 'File'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button variant="outline" size="sm" asChild>
                                                        <a href={content.file_url} target="_blank" rel="noopener noreferrer">
                                                            <Download className="h-4 w-4 mr-2" />
                                                            Xem/Tải
                                                        </a>
                                                    </Button>
                                                </div>
                                            ) : (
                                                <p className="text-muted-foreground">Nội dung không khả dụng</p>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="flex justify-between items-center pt-6 border-t">
                            <div>
                                {previousLesson ? (
                                    <Button
                                        variant="outline"
                                        onClick={() => navigateToLesson(previousLesson.id.toString())}
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-2" />
                                        Bài trước: {previousLesson.title}
                                    </Button>
                                ) : (
                                    <div />
                                )}
                            </div>

                            <div>
                                {nextLesson ? (
                                    <Button
                                        onClick={() => navigateToLesson(nextLesson.id.toString())}
                                        disabled={nextLesson.progress.status === 'not_started' && !nextLesson.is_preview}
                                    >
                                        Bài tiếp: {nextLesson.title}
                                        <ChevronRight className="h-4 w-4 ml-2" />
                                    </Button>
                                ) : (
                                    <Button onClick={() => router.push('/dashboard/courses')}>
                                        Hoàn thành khóa học
                                        <CheckCircle className="h-4 w-4 ml-2" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

