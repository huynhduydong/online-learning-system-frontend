'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Upload, X, Tag, AlertCircle } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { ErrorState } from '@/components/error-state'
import { Skeleton } from '@/components/ui/skeleton'

import { qaService } from '@/lib/api/qa'
import type { 
  Question, 
  QuestionCategory, 
  QuestionStatus,
  UpdateQuestionRequest 
} from '@/lib/api/types'

const categoryOptions: { value: QuestionCategory; label: string }[] = [
  { value: 'lesson_content', label: 'Nội dung bài học' },
  { value: 'technical_issue', label: 'Vấn đề kỹ thuật' },
  { value: 'administrative', label: 'Thủ tục hành chính' },
  { value: 'support_request', label: 'Yêu cầu hỗ trợ' },
  { value: 'bug_report', label: 'Báo cáo lỗi hệ thống' }
]

const statusOptions: { value: QuestionStatus; label: string }[] = [
  { value: 'new', label: 'Mới' },
  { value: 'in_progress', label: 'Đang xử lý' },
  { value: 'answered', label: 'Đã trả lời' },
  { value: 'closed', label: 'Đã đóng' }
]

export default function EditQuestionPage() {
  const params = useParams()
  const router = useRouter()
  const questionId = params.id as string

  // State
  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<QuestionCategory>('lesson_content')
  const [status, setStatus] = useState<QuestionStatus>('new')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [courseId, setCourseId] = useState('')
  const [lessonId, setLessonId] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const [existingAttachments, setExistingAttachments] = useState<any[]>([])

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load question data
  useEffect(() => {
    const loadQuestion = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await qaService.getQuestion(questionId)
        const questionData = response.data.question

        setQuestion(questionData)
        setTitle(questionData.title)
        setContent(questionData.content)
        setCategory(questionData.category)
        setStatus(questionData.status)
        setTags(questionData.tags || [])
        setCourseId(questionData.courseId || '')
        setLessonId(questionData.lessonId || '')
        setExistingAttachments(questionData.attachments || [])

      } catch (err: any) {
        console.error('Error loading question:', err)
        setError(err.message || 'Không thể tải câu hỏi')
      } finally {
        setLoading(false)
      }
    }

    if (questionId) {
      loadQuestion()
    }
  }, [questionId])

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = 'Tiêu đề không được để trống'
    } else if (title.length < 10) {
      newErrors.title = 'Tiêu đề phải có ít nhất 10 ký tự'
    } else if (title.length > 200) {
      newErrors.title = 'Tiêu đề không được vượt quá 200 ký tự'
    }

    if (!content.trim()) {
      newErrors.content = 'Nội dung không được để trống'
    } else if (content.length < 20) {
      newErrors.content = 'Nội dung phải có ít nhất 20 ký tự'
    }

    if (!category) {
      newErrors.category = 'Vui lòng chọn danh mục'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handlers
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const validFiles = files.filter(file => {
      const maxSize = 10 * 1024 * 1024 // 10MB
      const allowedTypes = ['image/', 'video/', 'application/pdf', 'text/', 'application/msword', 'application/vnd.openxmlformats-officedocument']
      
      return file.size <= maxSize && allowedTypes.some(type => file.type.startsWith(type))
    })

    if (validFiles.length !== files.length) {
      alert('Một số file không hợp lệ (quá 10MB hoặc định dạng không được hỗ trợ)')
    }

    setAttachments(prev => [...prev, ...validFiles].slice(0, 5)) // Max 5 files
  }

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleRemoveExistingAttachment = (index: number) => {
    setExistingAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)

      const updateData: UpdateQuestionRequest = {
        title: title.trim(),
        content: content.trim(),
        category,
        status,
        tags: tags.length > 0 ? tags : undefined,
        courseId: courseId || undefined,
        lessonId: lessonId || undefined
      }

      // Update question
      await qaService.updateQuestion(questionId, updateData)

      // Handle file uploads if any
      if (attachments.length > 0) {
        const formData = new FormData()
        attachments.forEach(file => {
          formData.append('files', file)
        })
        
        try {
          await qaService.uploadAttachments(questionId, formData)
        } catch (err) {
          console.error('Error uploading attachments:', err)
          // Continue even if upload fails
        }
      }

      // Redirect to question detail
      router.push(`/qa/${questionId}`)

    } catch (err: any) {
      console.error('Error updating question:', err)
      setError(err.message || 'Có lỗi xảy ra khi cập nhật câu hỏi')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <Skeleton className="h-8 w-48" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-10 w-48" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error || !question) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          title="Không thể chỉnh sửa câu hỏi"
          description={error || "Câu hỏi không tồn tại hoặc bạn không có quyền chỉnh sửa"}
          action={
            <Button onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-2xl font-bold">Chỉnh sửa câu hỏi</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Thông tin câu hỏi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title">
                  Tiêu đề câu hỏi <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tiêu đề câu hỏi rõ ràng và cụ thể..."
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  {title.length}/200 ký tự
                </p>
              </div>

              {/* Content */}
              <div>
                <Label htmlFor="content">
                  Nội dung chi tiết <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Mô tả chi tiết vấn đề, cung cấp context và thông tin cần thiết..."
                  className={`min-h-[150px] ${errors.content ? 'border-red-500' : ''}`}
                />
                {errors.content && (
                  <p className="text-sm text-red-500 mt-1">{errors.content}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  {content.length} ký tự
                </p>
              </div>

              {/* Category and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">
                    Danh mục <span className="text-red-500">*</span>
                  </Label>
                  <Select value={category} onValueChange={(value: QuestionCategory) => setCategory(value)}>
                    <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-500 mt-1">{errors.category}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select value={status} onValueChange={(value: QuestionStatus) => setStatus(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Course and Lesson */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="courseId">Khóa học (tùy chọn)</Label>
                  <Input
                    id="courseId"
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    placeholder="ID khóa học"
                  />
                </div>

                <div>
                  <Label htmlFor="lessonId">Bài học (tùy chọn)</Label>
                  <Input
                    id="lessonId"
                    value={lessonId}
                    onChange={(e) => setLessonId(e.target.value)}
                    placeholder="ID bài học"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <Label>Tags (tối đa 5)</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Nhập tag..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                    disabled={tags.length >= 5}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTag}
                    disabled={!newTag.trim() || tags.length >= 5}
                  >
                    <Tag className="h-4 w-4" />
                  </Button>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Existing Attachments */}
              {existingAttachments.length > 0 && (
                <div>
                  <Label>Tệp đính kèm hiện tại</Label>
                  <div className="space-y-2">
                    {existingAttachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{attachment.name}</span>
                          <span className="text-xs text-gray-500">
                            ({(attachment.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveExistingAttachment(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Attachments */}
              <div>
                <Label htmlFor="attachments">Thêm tệp đính kèm mới</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Kéo thả file hoặc click để chọn
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Hỗ trợ: Ảnh, video, PDF, Word, Excel (tối đa 10MB mỗi file, tối đa 5 files)
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    Chọn file
                  </Button>
                </div>

                {attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAttachment(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật câu hỏi'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Hủy
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}