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
    Menu,
    GripVertical,
    PanelLeftClose,
    PanelLeftOpen
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
import { QuestionForm } from '@/components/qa/question-form'
import { LessonQASection } from '@/components/qa/lesson-qa-section'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function LessonPage() {
    const params = useParams()
    const router = useRouter()
    const { user } = useAuth()

    const courseSlug = params.slug as string
    const lessonId = params.lessonId as string

    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [sidebarVisible, setSidebarVisible] = useState(true)
    const [isDragging, setIsDragging] = useState(false)
    const [dragStartX, setDragStartX] = useState(0)

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

    // Debug logging
    console.log('Lesson Page Debug:', {
        courseSlug,
        lessonId,
        currentLesson,
        isLoading,
        error
    })

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

    // Draggable toggle functionality
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true)
        setDragStartX(e.clientX)
        e.preventDefault()
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return
        
        const deltaX = e.clientX - dragStartX
        if (Math.abs(deltaX) > 50) { // Threshold for toggle
            setSidebarVisible(deltaX > 0)
            setIsDragging(false)
        }
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    // Add global mouse event listeners for dragging
    useEffect(() => {
        if (isDragging) {
            const handleGlobalMouseMove = (e: MouseEvent) => {
                const deltaX = e.clientX - dragStartX
                if (Math.abs(deltaX) > 50) {
                    setSidebarVisible(deltaX > 0)
                    setIsDragging(false)
                }
            }

            const handleGlobalMouseUp = () => {
                setIsDragging(false)
            }

            document.addEventListener('mousemove', handleGlobalMouseMove)
            document.addEventListener('mouseup', handleGlobalMouseUp)

            return () => {
                document.removeEventListener('mousemove', handleGlobalMouseMove)
                document.removeEventListener('mouseup', handleGlobalMouseUp)
            }
        }
    }, [isDragging, dragStartX])

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

                        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-2">
                            <Accordion type="multiple" className="space-y-2">
                                {course.modules.map((module) => (
                                    <AccordionItem 
                                        key={module.id} 
                                        value={`module-${module.id}`}
                                        className="border rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
                                    >
                                        <AccordionTrigger 
                                            className="font-semibold text-sm text-primary px-3 py-2 bg-muted/30 hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="h-4 w-4" />
                                                    <span>{module.title}</span>
                                                </div>
                                                <Badge variant="outline" className="ml-2 text-xs">
                                                    {module.lessons.length} bài
                                                </Badge>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-2">
                                            <div className="space-y-2 pl-2">
                                                {module.lessons.map((lesson) => (
                                                    <div
                                                        key={lesson.id}
                                                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                                                            lesson.id === currentLesson?.id
                                                                ? 'border-primary bg-primary/5 shadow-sm'
                                                                : lesson.progress.status === 'not_started' && !lesson.is_preview
                                                                    ? 'border-muted bg-muted/20 cursor-not-allowed opacity-60'
                                                                    : 'border-border hover:border-primary/50 hover:bg-muted/10'
                                                        }`}
                                                        onClick={() => (lesson.is_preview || lesson.progress.status !== 'not_started') && navigateToLesson(lesson.id.toString())}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex-shrink-0">
                                                                {lesson.progress.is_completed ? (
                                                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                                                ) : lesson.progress.status === 'in_progress' ? (
                                                                    <div className="h-5 w-5 rounded-full border-2 border-primary bg-primary/20 animate-pulse" />
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
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Desktop Sidebar */}
            <div className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col lg:z-20 lg:h-svh transition-all duration-300 ease-in-out ${sidebarVisible ? 'lg:w-80' : 'lg:w-0'}`}>
                <div className={`flex flex-col flex-grow min-h-0 bg-card border-r border-border transition-opacity duration-300 ${sidebarVisible ? 'opacity-100' : 'opacity-0'} overflow-hidden`}>
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

                    <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-2">
                        <Accordion type="multiple" className="space-y-2">
                            {course.modules.map((module) => (
                                <AccordionItem 
                                    key={module.id} 
                                    value={`module-${module.id}`}
                                    className="border rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
                                >
                                    <AccordionTrigger 
                                        className="text-sm font-semibold text-primary px-3 py-2 bg-muted/30 hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="h-4 w-4" />
                                                <span>{module.title}</span>
                                            </div>
                                            <Badge variant="outline" className="ml-2 text-xs">
                                                {module.lessons.length} bài
                                            </Badge>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-2">
                                        <div className="space-y-2 pl-2">
                                            {module.lessons.map((lesson) => (
                                                <div
                                                    key={lesson.id}
                                                    className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                                                        lesson.id === currentLesson?.id
                                                            ? 'border-primary bg-primary/5 shadow-sm'
                                                            : lesson.progress.status === 'not_started' && !lesson.is_preview
                                                                ? 'border-muted bg-muted/20 cursor-not-allowed opacity-60'
                                                                : 'border-border hover:border-primary/50 hover:bg-muted/10'
                                                    }`}
                                                    onClick={() => (lesson.is_preview || lesson.progress.status !== 'not_started') && navigateToLesson(lesson.id.toString())}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-shrink-0">
                                                            {lesson.progress.is_completed ? (
                                                                <CheckCircle className="h-5 w-5 text-green-600" />
                                                            ) : lesson.progress.status === 'in_progress' ? (
                                                                <div className="h-5 w-5 rounded-full border-2 border-primary bg-primary/20 animate-pulse" />
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
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={`transition-all duration-300 ease-in-out ${sidebarVisible ? 'lg:pl-80' : 'lg:pl-0'}`}>
                {/* Mobile Header */}
                <header className="lg:hidden bg-card border-b border-border px-4 py-3 sticky top-0 z-10 shadow-sm">
                    <div className="flex items-center justify-between">
                        <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)} className="transition-colors duration-200 hover:bg-muted">
                            <Menu className="h-5 w-5" />
                        </Button>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                                Bài {currentLesson.sort_order}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1 text-xs">
                                <Clock className="h-3 w-3" />
                                {formatDuration(currentLesson.duration_minutes)}
                            </Badge>
                        </div>
                    </div>
                </header>

                {/* Draggable Sidebar Toggle Button */}
                <div className={`hidden lg:block fixed top-1/2 z-30 transition-all duration-300 ease-in-out ${sidebarVisible ? 'left-80' : 'left-0'} transform -translate-y-1/2`}>
                    <div 
                        className={`bg-card border border-border rounded-r-lg shadow-lg cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-xl hover:scale-105 ${isDragging ? 'scale-110 shadow-2xl bg-primary/5' : ''} select-none`}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onClick={() => setSidebarVisible(!sidebarVisible)}
                        title={sidebarVisible ? 'Ẩn sidebar (kéo để toggle)' : 'Hiện sidebar (kéo để toggle)'}
                    >
                        <div className="p-2 flex items-center justify-center">
                            {sidebarVisible ? (
                                <PanelLeftClose className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors duration-200" />
                            ) : (
                                <PanelLeftOpen className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors duration-200" />
                            )}
                        </div>
                        <div className="px-1 pb-2">
                            <GripVertical className={`h-4 w-4 text-muted-foreground mx-auto transition-colors duration-200 ${isDragging ? 'text-primary' : ''}`} />
                        </div>
                    </div>
                </div>

                {/* Video Player - Reduced height */}
                <div className="aspect-[16/7] bg-black relative shadow-md">
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        {currentLesson.contents?.find(c => c.content_type && c.content_type.startsWith('video/')) ? (
                            <div className="text-center text-white">
                                <div className="p-4 rounded-full bg-primary/20 backdrop-blur-sm transition-transform duration-200 hover:scale-110 cursor-pointer">
                                    <Play className="h-8 w-8 md:h-12 md:w-12 text-white" />
                                </div>
                                <p className="mt-4">Video Player Placeholder</p>
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

                        {/* Tabbed Content Section */}
                        <Tabs defaultValue="content" className="mb-6">
                            <TabsList className="grid grid-cols-3 mb-4 w-full">
                                <TabsTrigger value="content" className="flex items-center gap-2 transition-all duration-200">
                                    <FileText className="h-4 w-4 md:mr-1" />
                                    <span className="hidden sm:inline">Nội dung bài học</span>
                                    <span className="sm:hidden">Nội dung</span>
                                </TabsTrigger>
                                <TabsTrigger value="resources" className="flex items-center gap-2 transition-all duration-200">
                                    <Download className="h-4 w-4 md:mr-1" />
                                    <span className="hidden sm:inline">Tài liệu</span>
                                    <span className="sm:hidden">Tài liệu</span>
                                </TabsTrigger>
                                <TabsTrigger value="faq" className="flex items-center gap-2 transition-all duration-200">
                                    <BookOpen className="h-4 w-4 md:mr-1" />
                                    <span className="hidden sm:inline">Hỏi đáp</span>
                                    <span className="sm:hidden">Hỏi đáp</span>
                                </TabsTrigger>
                            </TabsList>

                            {/* Lesson Content Tab */}
                            <TabsContent value="content" className="space-y-4 focus-visible:outline-none focus-visible:ring-0 animate-in fade-in-50 duration-300">
                                {currentLesson.contents && currentLesson.contents.length > 0 ? (
                                    <div className="space-y-6">
                                        {currentLesson.contents.map((content) => (
                                            <Card key={content.id} className="shadow-sm hover:shadow transition-all duration-200">
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
                                                        <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/10 transition-colors duration-200">
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
                                ) : (
                                    <Card>
                                        <CardContent className="p-6 text-center">
                                            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                                            <p className="text-muted-foreground">Không có nội dung bài học</p>
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>

                            {/* Resources Tab */}
                            <TabsContent value="resources" className="space-y-4 focus-visible:outline-none focus-visible:ring-0 animate-in fade-in-50 duration-300">
                                <Card className="shadow-sm hover:shadow transition-all duration-200">
                                    <CardContent className="p-6 text-center">
                                        <Download className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                                        <p className="text-muted-foreground">Không có tài liệu bổ sung</p>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* FAQ Tab */}
                            <TabsContent value="faq" className="space-y-4 focus-visible:outline-none focus-visible:ring-0 animate-in fade-in-50 duration-300">
                                {currentLesson && (
                                    <LessonQASection 
                                        lessonId={currentLesson.id.toString()}
                                        lessonTitle={currentLesson.title}
                                        courseId={currentLesson.course_id?.toString()}
                                    />
                                )}
                            </TabsContent>
                        </Tabs>

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

