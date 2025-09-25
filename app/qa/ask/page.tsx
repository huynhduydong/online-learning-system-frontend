'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Upload, X, Tag, AlertCircle, CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { qaService } from '@/lib/api/qa'
import type { 
  QuestionCategory, 
  CreateQuestionRequest,
  Tag as TagType,
  Course,
  Lesson
} from '@/lib/api/types'

// Form validation schema
const questionSchema = z.object({
  title: z.string()
    .min(10, 'Tiêu đề phải có ít nhất 10 ký tự')
    .max(200, 'Tiêu đề không được vượt quá 200 ký tự'),
  content: z.string()
    .min(20, 'Nội dung phải có ít nhất 20 ký tự')
    .max(5000, 'Nội dung không được vượt quá 5000 ký tự'),
  category: z.enum(['lesson_content', 'technical_issue', 'administrative', 'support_request', 'bug_report']),
  courseId: z.string().optional(),
  lessonId: z.string().optional(),
  tags: z.array(z.string()).max(5, 'Tối đa 5 tag'),
})

type QuestionFormData = z.infer<typeof questionSchema>

const categoryOptions = [
  { value: 'lesson_content', label: 'Nội dung bài học', description: 'Câu hỏi về kiến thức, bài tập' },
  { value: 'technical_issue', label: 'Vấn đề kỹ thuật', description: 'Lỗi hệ thống, không truy cập được' },
  { value: 'administrative', label: 'Thủ tục hành chính', description: 'Đăng ký, thanh toán, chứng chỉ' },
  { value: 'support_request', label: 'Yêu cầu hỗ trợ', description: 'Cần trợ giúp sử dụng hệ thống' },
  { value: 'bug_report', label: 'Báo cáo lỗi', description: 'Phát hiện lỗi trong hệ thống' }
]

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url?: string
  uploadProgress?: number
}

export default function AskQuestionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // State
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [availableTags, setAvailableTags] = useState<TagType[]>([])
  const [tagInput, setTagInput] = useState('')
  const [courses, setCourses] = useState<Course[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [similarQuestions, setSimilarQuestions] = useState<any[]>([])

  // Form
  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: '',
      content: '',
      category: 'lesson_content',
      courseId: searchParams.get('courseId') || undefined,
      lessonId: searchParams.get('lessonId') || undefined,
      tags: [],
    },
  })

  const watchedTitle = form.watch('title')
  const watchedCourseId = form.watch('courseId')

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load available tags
        const tagsResponse = await qaService.getTags()
        setAvailableTags(tagsResponse.data.tags)

        // Load courses (simplified - would normally come from courses API)
        // setCourses(await coursesService.getCourses())
      } catch (error) {
        console.error('Error loading initial data:', error)
      }
    }

    loadInitialData()
  }, [])

  // Load lessons when course changes
  useEffect(() => {
    if (watchedCourseId) {
      const loadLessons = async () => {
        try {
          // Load lessons for selected course
          // const lessonsResponse = await coursesService.getLessons(watchedCourseId)
          // setLessons(lessonsResponse.data.lessons)
        } catch (error) {
          console.error('Error loading lessons:', error)
        }
      }

      loadLessons()
    } else {
      setLessons([])
      form.setValue('lessonId', undefined)
    }
  }, [watchedCourseId, form])

  // Search for similar questions when title changes
  useEffect(() => {
    if (watchedTitle && watchedTitle.length > 10) {
      const searchSimilar = async () => {
        try {
          const response = await qaService.searchQuestions(watchedTitle, {
            per_page: 3
          })
          setSimilarQuestions(response.questions)
        } catch (error) {
          console.error('Error searching similar questions:', error)
        }
      }

      const debounceTimer = setTimeout(searchSimilar, 500)
      return () => clearTimeout(debounceTimer)
    } else {
      setSimilarQuestions([])
    }
  }, [watchedTitle])

  // File upload handler
  const handleFileUpload = async (files: FileList) => {
    const maxFileSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'application/pdf', 'text/plain']

    for (const file of Array.from(files)) {
      if (file.size > maxFileSize) {
        setSubmitError(`File ${file.name} quá lớn. Kích thước tối đa là 10MB.`)
        continue
      }

      if (!allowedTypes.includes(file.type)) {
        setSubmitError(`File ${file.name} không được hỗ trợ.`)
        continue
      }

      const fileId = Math.random().toString(36).substr(2, 9)
      const uploadedFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadProgress: 0
      }

      setUploadedFiles(prev => [...prev, uploadedFile])

      try {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100))
          setUploadedFiles(prev => prev.map(f => 
            f.id === fileId ? { ...f, uploadProgress: progress } : f
          ))
        }

        // Upload file to server
        const uploadResponse = await qaService.uploadFile(file)
        
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, url: uploadResponse.data.url, uploadProgress: 100 } : f
        ))
      } catch (error) {
        console.error('Upload error:', error)
        setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
        setSubmitError(`Không thể upload file ${file.name}`)
      }
    }
  }

  // Remove uploaded file
  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  // Add tag
  const addTag = (tagName: string) => {
    const currentTags = form.getValues('tags')
    if (currentTags.length >= 5) {
      setSubmitError('Tối đa 5 tag')
      return
    }

    if (!currentTags.includes(tagName)) {
      form.setValue('tags', [...currentTags, tagName])
    }
    setTagInput('')
  }

  // Remove tag
  const removeTag = (tagName: string) => {
    const currentTags = form.getValues('tags')
    form.setValue('tags', currentTags.filter(tag => tag !== tagName))
  }

  // Submit form
  const onSubmit = async (data: QuestionFormData) => {
    try {
      setIsSubmitting(true)
      setSubmitError(null)

      const requestData: CreateQuestionRequest = {
        title: data.title,
        content: data.content,
        category: data.category,
        scope: data.courseId ? 'course' : 'general',
        scope_id: data.courseId ? parseInt(data.courseId) : undefined,
        tags: data.tags, // Send tag names for backend processing
        attachments: uploadedFiles.filter(f => f.url).map(f => ({
          url: f.url!,
          name: f.name,
          type: f.type,
          size: f.size
        }))
      }

      console.log('Submitting question data from ask page:', requestData) // Debug log

      const response = await qaService.createQuestion(requestData)
      
      setSubmitSuccess(true)
      
      // Redirect to question detail page after 2 seconds
      setTimeout(() => {
        router.push(`/qa/${response.data.question.id}`)
      }, 2000)

    } catch (error: any) {
      console.error('Submit error:', error)
      setSubmitError(error.message || 'Có lỗi xảy ra khi đăng câu hỏi')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Câu hỏi đã được đăng thành công!
              </h2>
              <p className="text-gray-600 mb-4">
                Câu hỏi của bạn đã được đăng và sẽ sớm nhận được phản hồi từ cộng đồng.
              </p>
              <p className="text-sm text-gray-500">
                Đang chuyển hướng đến trang câu hỏi...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Đặt câu hỏi</h1>
          <p className="text-gray-600 mt-1">
            Chia sẻ câu hỏi của bạn với cộng đồng học tập
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin câu hỏi</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tiêu đề câu hỏi *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập tiêu đề câu hỏi rõ ràng và cụ thể..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Tiêu đề nên mô tả ngắn gọn vấn đề bạn gặp phải (10-200 ký tự)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Category */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Danh mục *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn danh mục phù hợp" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categoryOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div>
                                  <div className="font-medium">{option.label}</div>
                                  <div className="text-sm text-gray-500">{option.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Course and Lesson */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="courseId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Khóa học (tùy chọn)</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn khóa học" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {courses.map((course) => (
                                <SelectItem key={course.id} value={course.id}>
                                  {course.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lessonId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bài học (tùy chọn)</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                            disabled={!watchedCourseId}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn bài học" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {lessons.map((lesson) => (
                                <SelectItem key={lesson.id} value={lesson.id}>
                                  {lesson.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Content */}
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nội dung chi tiết *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Mô tả chi tiết vấn đề bạn gặp phải, các bước đã thử, kết quả mong muốn..."
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Cung cấp thông tin chi tiết giúp mọi người hiểu và trả lời câu hỏi tốt hơn (20-5000 ký tự)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tags */}
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {field.value.map((tag) => (
                              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                {tag}
                                <X 
                                  className="h-3 w-3 cursor-pointer" 
                                  onClick={() => removeTag(tag)}
                                />
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Thêm tag..."
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault()
                                  if (tagInput.trim()) {
                                    addTag(tagInput.trim())
                                  }
                                }
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                if (tagInput.trim()) {
                                  addTag(tagInput.trim())
                                }
                              }}
                            >
                              <Tag className="h-4 w-4" />
                            </Button>
                          </div>
                          {availableTags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              <span className="text-sm text-gray-500">Gợi ý:</span>
                              {availableTags.slice(0, 10).map((tag) => (
                                <Badge
                                  key={tag.id}
                                  variant="outline"
                                  className="cursor-pointer text-xs"
                                  onClick={() => addTag(tag.name)}
                                >
                                  {tag.name}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <FormDescription>
                          Thêm tag để giúp phân loại câu hỏi (tối đa 5 tag)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* File upload */}
                  <div className="space-y-4">
                    <Label>Tệp đính kèm (tùy chọn)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Kéo thả file hoặc click để chọn
                      </p>
                      <p className="text-xs text-gray-500">
                        Hỗ trợ: JPG, PNG, GIF, MP4, PDF, TXT (tối đa 10MB)
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/mp4,application/pdf,text/plain"
                        onChange={(e) => {
                          if (e.target.files) {
                            handleFileUpload(e.target.files)
                          }
                        }}
                        className="hidden"
                        id="file-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-2"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        Chọn file
                      </Button>
                    </div>

                    {/* Uploaded files */}
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        {uploadedFiles.map((file) => (
                          <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{file.name}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(file.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="text-xs text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </div>
                              {file.uploadProgress !== undefined && file.uploadProgress < 100 && (
                                <Progress value={file.uploadProgress} className="mt-1" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Error message */}
                  {submitError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{submitError}</AlertDescription>
                    </Alert>
                  )}

                  {/* Submit button */}
                  <div className="flex gap-3">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Đang đăng...' : 'Đăng câu hỏi'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                      Hủy
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Similar questions */}
          {similarQuestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Câu hỏi tương tự</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {similarQuestions.map((question) => (
                    <div key={question.id} className="p-3 border rounded-lg">
                      <h4 className="font-medium text-sm mb-1">
                        <a 
                          href={`/qa/${question.id}`}
                          className="text-blue-600 hover:text-blue-800"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {question.title}
                        </a>
                      </h4>
                      <div className="text-xs text-gray-500">
                        {question.answerCount} trả lời • {question.voteCount} vote
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Kiểm tra xem câu hỏi của bạn đã được trả lời chưa
                </p>
              </CardContent>
            </Card>
          )}

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mẹo đặt câu hỏi hay</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  Tiêu đề rõ ràng, cụ thể
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  Mô tả chi tiết vấn đề
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  Đính kèm ảnh chụp màn hình nếu cần
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  Chọn danh mục phù hợp
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  Sử dụng tag để dễ tìm kiếm
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}