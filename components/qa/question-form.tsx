'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Upload, X, Tag, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
  QuestionScope,
  CreateQuestionRequest
} from '@/lib/api/types'

// Form validation schema
const questionSchema = z.object({
  title: z.string()
    .min(10, 'Tiêu đề phải có ít nhất 10 ký tự')
    .max(200, 'Tiêu đề không được vượt quá 200 ký tự'),
  content: z.string()
    .min(20, 'Nội dung phải có ít nhất 20 ký tự')
    .max(5000, 'Nội dung không được vượt quá 5000 ký tự'),
  category: z.enum(['general', 'technical', 'course', 'assignment']),
  tags: z.array(z.string()).max(5, 'Tối đa 5 tag'),
})

type QuestionFormData = z.infer<typeof questionSchema>

interface QuestionFormProps {
  defaultScope?: QuestionScope
  defaultScopeId?: string
  defaultCourseId?: string
  lessonTitle?: string
  onSuccess?: () => void
  onCancel?: () => void
  className?: string
}

const categoryOptions = [
  { value: 'general', label: 'Câu hỏi chung', description: 'Câu hỏi tổng quát về hệ thống' },
  { value: 'technical', label: 'Câu hỏi kỹ thuật', description: 'Vấn đề kỹ thuật, lỗi hệ thống' },
  { value: 'course', label: 'Câu hỏi về khóa học', description: 'Nội dung, tài liệu khóa học' },
  { value: 'assignment', label: 'Câu hỏi về bài tập', description: 'Bài tập, đánh giá, kiểm tra' }
]

export function QuestionForm({
  defaultScope = 'lesson',
  defaultScopeId,
  defaultCourseId,
  lessonTitle,
  onSuccess,
  onCancel,
  className = ''
}: QuestionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [newTag, setNewTag] = useState('')

  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: '',
      content: '',
      category: 'general',
      tags: [],
    },
  })

  const { watch, setValue, getValues } = form
  const watchedTags = watch('tags')

  const addTag = () => {
    const trimmedTag = newTag.trim().toLowerCase()
    if (trimmedTag && !watchedTags.includes(trimmedTag) && watchedTags.length < 5) {
      setValue('tags', [...watchedTags, trimmedTag])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setValue('tags', watchedTags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const onSubmit = async (data: QuestionFormData) => {
    try {
      setIsSubmitting(true)
      setSubmitError(null)
      setSubmitSuccess(false)

      const questionData: CreateQuestionRequest = {
        title: data.title,
        content: data.content,
        category: data.category,
        scope: defaultScope,
        scope_id: defaultScopeId ? parseInt(defaultScopeId) : undefined,
        tags: data.tags, // Send tag names for backend processing
      }

      console.log('Submitting question data:', questionData) // Debug log

      await qaService.createQuestion(questionData)
      
      setSubmitSuccess(true)
      form.reset()
      
      // Call success callback after a short delay to show success message
      setTimeout(() => {
        onSuccess?.()
      }, 1500)

    } catch (error: any) {
      console.error('Error creating question:', error)
      setSubmitError(
        error.response?.data?.message || 
        error.message ||
        'Có lỗi xảy ra khi tạo câu hỏi. Vui lòng thử lại.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Câu hỏi của bạn đã được tạo thành công! Giảng viên sẽ sớm trả lời.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {lessonTitle && (
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Đặt câu hỏi về bài học: <span className="font-medium text-foreground">{lessonTitle}</span>
          </p>
        </div>
      )}

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
                    placeholder="Ví dụ: Làm thế nào để implement JWT authentication?"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Tiêu đề ngắn gọn, rõ ràng về vấn đề bạn gặp phải
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Content */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nội dung chi tiết *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Mô tả chi tiết vấn đề bạn gặp phải, những gì bạn đã thử, và kết quả mong muốn..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Cung cấp thông tin chi tiết để nhận được câu trả lời tốt nhất
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
                <Select onValueChange={field.onChange} value={field.value}>
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
                          <div className="text-xs text-muted-foreground">{option.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <FormLabel>Tags (tùy chọn)</FormLabel>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Thêm tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={watchedTags.length >= 5}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addTag}
                      disabled={!newTag.trim() || watchedTags.length >= 5}
                    >
                      <Tag className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {watchedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {watchedTags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <FormDescription>
                  Thêm các từ khóa liên quan để dễ tìm kiếm (tối đa 5 tags)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Error Alert */}
          {submitError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang tạo câu hỏi...
                </>
              ) : (
                'Đăng câu hỏi'
              )}
            </Button>
            
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
            )}
          </div>

          <Alert>
            <AlertDescription>
              <strong>Lưu ý:</strong> Hãy đảm bảo câu hỏi của bạn rõ ràng, chi tiết và liên quan đến nội dung bài học. 
              Câu hỏi chất lượng sẽ nhận được phản hồi nhanh chóng từ giảng viên.
            </AlertDescription>
          </Alert>
        </form>
      </Form>
    </div>
  )
}