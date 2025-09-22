'use client'

/**
 * Lesson Management Component for Studio
 * Allows instructors to create and manage lessons within a course
 */

import { useState, useEffect } from 'react'
import {
    Plus,
    Edit,
    Trash2,
    Video,
    FileText,
    Move,
    Save,
    Upload,
    PlayCircle,
    Loader2,
    AlertCircle
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import instructorService, {
    type InstructorModule,
    type InstructorLesson,
    type CreateModuleRequest,
    type CreateLessonRequest
} from '@/lib/api/instructor'

interface LessonManagementProps {
    courseId: number
}

export function LessonManagement({ courseId }: LessonManagementProps) {
    const [modules, setModules] = useState<InstructorModule[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isAddingModule, setIsAddingModule] = useState(false)
    const [isAddingLesson, setIsAddingLesson] = useState(false)
    const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null)
    const [editingLesson, setEditingLesson] = useState<InstructorLesson | null>(null)
    const [newModuleTitle, setNewModuleTitle] = useState('')
    const [newModuleDescription, setNewModuleDescription] = useState('')
    const [isCreatingModule, setIsCreatingModule] = useState(false)
    const [isCreatingLesson, setIsCreatingLesson] = useState(false)

    // New lesson form state
    const [newLesson, setNewLesson] = useState({
        title: '',
        description: '',
        content_type: 'video' as const,
        duration_minutes: 0,
        video_url: ''
    })

    // Load modules on component mount
    useEffect(() => {
        fetchModules()
    }, [courseId])

    const fetchModules = async () => {
        try {
            setIsLoading(true)
            setError(null)
            const response = await instructorService.getCourseModules(courseId)
            if (response.success) {
                // First, set modules with empty lessons arrays
                const modulesWithEmptyLessons = response.data.map(module => ({
                    ...module,
                    lessons: []
                }))
                setModules(modulesWithEmptyLessons)

                // Then fetch lessons for each module
                await fetchLessonsForModules(response.data)
            } else {
                setError('Không thể tải danh sách chương')
            }
        } catch (err: any) {
            console.error('Failed to fetch modules:', err)

            // Handle "Resource not found" case when course has no modules yet
            if (err?.response?.status === 404 || err?.message?.includes('Resource not found')) {
                // Course exists but has no modules yet - this is normal for new courses
                setModules([])
            } else if (err?.name === 'ApiClientError' && err?.message?.includes('Network error')) {
                // Network/CORS errors - likely backend is down or CORS not configured
                // Show empty state instead of error for better UX
                console.warn('Backend not available - showing empty state')
                setModules([])
            } else {
                // Real error - authentication, permission, etc.
                setError('Có lỗi xảy ra khi tải danh sách chương')
            }
        } finally {
            setIsLoading(false)
        }
    }

    const fetchLessonsForModules = async (modules: any[]) => {
        try {
            // Fetch lessons for all modules in parallel
            const lessonsPromises = modules.map(async (module) => {
                try {
                    const lessonsResponse = await instructorService.getModuleLessons(courseId, module.id)
                    return {
                        moduleId: module.id,
                        lessons: lessonsResponse.success ? lessonsResponse.data : []
                    }
                } catch (err) {
                    console.warn(`Failed to fetch lessons for module ${module.id}:`, err)
                    return {
                        moduleId: module.id,
                        lessons: []
                    }
                }
            })

            const lessonsResults = await Promise.all(lessonsPromises)

            // Update modules with their lessons
            setModules(prevModules =>
                prevModules.map(module => {
                    const moduleLessons = lessonsResults.find(result => result.moduleId === module.id)
                    return {
                        ...module,
                        lessons: (moduleLessons?.lessons || []).map(lesson => ({
                            ...lesson,
                            // Map is_preview to is_published if needed
                            is_published: lesson.is_published ?? false  // Default to false (draft) if no is_published field
                        }))
                    }
                })
            )
        } catch (err) {
            console.error('Failed to fetch lessons for modules:', err)
        }
    }

    const refreshModuleLessons = async (moduleId: number) => {
        try {
            const lessonsResponse = await instructorService.getModuleLessons(courseId, moduleId)
            if (lessonsResponse.success) {
                console.log('🔍 API lessons response:', lessonsResponse.data) // Debug log
                console.log('🔍 Sample lesson fields:', {
                    has_is_published: 'is_published' in (lessonsResponse.data[0] || {}),
                    has_is_preview: 'is_preview' in (lessonsResponse.data[0] || {}),
                    sample_lesson: lessonsResponse.data[0]
                })

                setModules(prevModules =>
                    prevModules.map(module =>
                        module.id === moduleId
                            ? {
                                ...module,
                                lessons: lessonsResponse.data.map(lesson => ({
                                    ...lesson,
                                    // Map is_preview to is_published if needed  
                                    is_published: lesson.is_published ?? false  // Default to false (draft) if no is_published field
                                }))
                            }
                            : module
                    )
                )
            }
        } catch (err) {
            console.warn(`Failed to refresh lessons for module ${moduleId}:`, err)
        }
    }

    const handleAddModule = async () => {
        if (!newModuleTitle.trim()) return

        try {
            setIsCreatingModule(true)
            const moduleData: CreateModuleRequest = {
                title: newModuleTitle,
                description: newModuleDescription || undefined,
                order: modules.length + 1
            }

            const response = await instructorService.createModule(courseId, moduleData)

            if (response.success) {
                // Add lessons array to new module since API doesn't return it
                const newModule = {
                    ...response.data,
                    lessons: [] // Initialize empty lessons array
                }
                setModules(prev => [...prev, newModule])
                setNewModuleTitle('')
                setNewModuleDescription('')
                setIsAddingModule(false)
            } else {
                setError('Không thể tạo chương mới')
            }
        } catch (err) {
            console.error('Failed to create module:', err)
            setError('Có lỗi xảy ra khi tạo chương')
        } finally {
            setIsCreatingModule(false)
        }
    }

    const handleAddLesson = async () => {
        if (!newLesson.title.trim() || !selectedModuleId) return

        const targetModule = modules.find(m => m.id === selectedModuleId)
        if (!targetModule) return

        try {
            setIsCreatingLesson(true)
            const lessonData: CreateLessonRequest = {
                title: newLesson.title,
                description: newLesson.description || undefined,
                duration_minutes: newLesson.duration_minutes,
                order: (targetModule.lessons?.length || 0) + 1,
                content_type: newLesson.content_type,
                video_url: newLesson.video_url || undefined
            }

            const response = await instructorService.createLesson(courseId, selectedModuleId, lessonData)

            if (response.success) {
                setModules(prev => prev.map(module =>
                    module.id === selectedModuleId
                        ? { ...module, lessons: [...(module.lessons || []), response.data] }
                        : module
                ))

                setNewLesson({ title: '', description: '', content_type: 'video', duration_minutes: 0, video_url: '' })
                setIsAddingLesson(false)
                setSelectedModuleId(null)

                // Optionally refresh lessons for the module to ensure sync with backend
                await refreshModuleLessons(selectedModuleId)
            } else {
                setError('Không thể tạo bài học mới')
            }
        } catch (err) {
            console.error('Failed to create lesson:', err)
            setError('Có lỗi xảy ra khi tạo bài học')
        } finally {
            setIsCreatingLesson(false)
        }
    }

    const handleDeleteLesson = async (moduleId: number, lessonId: number) => {
        try {
            const response = await instructorService.deleteLesson(courseId, moduleId, lessonId)

            if (response.success) {
                setModules(prev => prev.map(module =>
                    module.id === moduleId
                        ? { ...module, lessons: (module.lessons || []).filter(lesson => lesson.id !== lessonId) }
                        : module
                ))

                // Optionally refresh lessons for the module to ensure sync with backend
                await refreshModuleLessons(moduleId)
            } else {
                setError('Không thể xóa bài học')
            }
        } catch (err) {
            console.error('Failed to delete lesson:', err)
            setError('Có lỗi xảy ra khi xóa bài học')
        }
    }

    const formatDuration = (minutes: number) => {
        if (minutes < 60) {
            return `${minutes}m`
        }
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return `${hours}h ${mins}m`
    }

    const getContentTypeIcon = (type: string) => {
        switch (type) {
            case 'video':
                return <PlayCircle className="h-4 w-4" />
            case 'text':
                return <FileText className="h-4 w-4" />
            default:
                return <FileText className="h-4 w-4" />
        }
    }

    const getContentTypeBadge = (type: string) => {
        switch (type) {
            case 'video':
                return <Badge variant="default">Video</Badge>
            case 'text':
                return <Badge variant="secondary">Văn bản</Badge>
            case 'quiz':
                return <Badge variant="outline">Kiểm tra</Badge>
            default:
                return <Badge variant="secondary">Nội dung</Badge>
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground">Đang tải nội dung khóa học...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-destructive mr-2" />
                        <div>
                            <h3 className="text-sm font-medium text-destructive">Có lỗi xảy ra</h3>
                            <p className="text-sm text-destructive/80 mt-1">{error}</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setError(null)}
                            className="ml-auto text-destructive hover:text-destructive/80"
                        >
                            Đóng
                        </Button>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Nội dung khóa học</h3>
                    <p className="text-sm text-muted-foreground">
                        Tổ chức khóa học thành các chương và bài học
                    </p>
                </div>
                <Dialog open={isAddingModule} onOpenChange={setIsAddingModule}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Thêm chương
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Thêm chương mới</DialogTitle>
                            <DialogDescription>
                                Tạo chương mới để tổ chức các bài học
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Tên chương</label>
                                <Input
                                    value={newModuleTitle}
                                    onChange={(e) => setNewModuleTitle(e.target.value)}
                                    placeholder="Nhập tên chương"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Mô tả (Tùy chọn)</label>
                                <Textarea
                                    value={newModuleDescription}
                                    onChange={(e) => setNewModuleDescription(e.target.value)}
                                    placeholder="Mô tả những gì học viên sẽ học trong chương này"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddingModule(false)} disabled={isCreatingModule}>
                                Hủy
                            </Button>
                            <Button onClick={handleAddModule} disabled={isCreatingModule}>
                                {isCreatingModule ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Đang tạo...
                                    </>
                                ) : (
                                    'Tạo chương'
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {modules.length === 0 ? (
                <Card className="text-center py-12">
                    <CardContent>
                        <Video className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <CardTitle className="mb-2">Chưa có nội dung</CardTitle>
                        <CardDescription className="mb-4">
                            Bắt đầu xây dựng khóa học bằng cách tạo các chương và bài học
                        </CardDescription>
                        <Button onClick={() => setIsAddingModule(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Tạo chương đầu tiên
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {modules.map((module, moduleIndex) => (
                        <Card key={module.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-base">
                                            Chương {moduleIndex + 1}: {module.title}
                                        </CardTitle>
                                        {module.description && (
                                            <CardDescription>{module.description}</CardDescription>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">
                                            {module.lessons?.length || 0} bài học
                                        </Badge>
                                        <Dialog
                                            open={isAddingLesson && selectedModuleId === module.id}
                                            onOpenChange={(open) => {
                                                setIsAddingLesson(open)
                                                if (open) setSelectedModuleId(module.id)
                                                else setSelectedModuleId(null)
                                            }}
                                        >
                                            <DialogTrigger asChild>
                                                <Button size="sm" variant="outline">
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Thêm bài học
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Thêm bài học mới</DialogTitle>
                                                    <DialogDescription>
                                                        Tạo bài học mới trong {module.title}
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="text-sm font-medium">Tên bài học</label>
                                                        <Input
                                                            value={newLesson.title}
                                                            onChange={(e) => setNewLesson(prev => ({ ...prev, title: e.target.value }))}
                                                            placeholder="Nhập tên bài học"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium">Mô tả</label>
                                                        <Textarea
                                                            value={newLesson.description}
                                                            onChange={(e) => setNewLesson(prev => ({ ...prev, description: e.target.value }))}
                                                            placeholder="Mô tả những gì học viên sẽ học"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="text-sm font-medium">Loại nội dung</label>
                                                            <Select
                                                                value={newLesson.content_type}
                                                                onValueChange={(value) => setNewLesson(prev => ({ ...prev, content_type: value as any }))}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="video">Video</SelectItem>
                                                                    <SelectItem value="text">Văn bản/Bài viết</SelectItem>
                                                                    <SelectItem value="quiz">Bài kiểm tra</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div>
                                                            <label className="text-sm font-medium">Thời lượng (phút)</label>
                                                            <Input
                                                                type="number"
                                                                value={newLesson.duration_minutes}
                                                                onChange={(e) => setNewLesson(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) || 0 }))}
                                                                placeholder="0"
                                                            />
                                                        </div>
                                                    </div>
                                                    {newLesson.content_type === 'video' && (
                                                        <div>
                                                            <label className="text-sm font-medium">URL Video</label>
                                                            <Input
                                                                value={newLesson.video_url}
                                                                onChange={(e) => setNewLesson(prev => ({ ...prev, video_url: e.target.value }))}
                                                                placeholder="https://youtube.com/watch?v=..."
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => setIsAddingLesson(false)} disabled={isCreatingLesson}>
                                                        Hủy
                                                    </Button>
                                                    <Button onClick={handleAddLesson} disabled={isCreatingLesson}>
                                                        {isCreatingLesson ? (
                                                            <>
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                Đang tạo...
                                                            </>
                                                        ) : (
                                                            'Tạo bài học'
                                                        )}
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            </CardHeader>

                            {(module.lessons?.length || 0) > 0 && (
                                <CardContent>
                                    <div className="space-y-2">
                                        {(module.lessons || []).map((lesson, lessonIndex) => (
                                            <div key={lesson.id} className="flex items-center justify-between p-3 rounded-lg border">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        {getContentTypeIcon(lesson.content_type)}
                                                        <span className="text-xs font-medium">{lessonIndex + 1}</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-medium">{lesson.title}</h4>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            {getContentTypeBadge(lesson.content_type)}
                                                            <span>•</span>
                                                            <span>{formatDuration(lesson.duration_minutes)}</span>
                                                            {!lesson.is_published && (
                                                                <>
                                                                    <span>•</span>
                                                                    <Badge variant="secondary" className="text-xs">Bản nháp</Badge>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Button size="sm" variant="ghost">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button size="sm" variant="ghost">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Xóa bài học</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Bạn có chắc chắn muốn xóa "{lesson.title}"? Hành động này không thể hoàn tác.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDeleteLesson(module.id, lesson.id)}
                                                                    className="bg-destructive text-destructive-foreground"
                                                                >
                                                                    Xóa
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
