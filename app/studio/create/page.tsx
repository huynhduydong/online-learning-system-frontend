'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Save, ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AppContainer } from '@/components/app-container'
import { PageHeading } from '@/components/page-heading'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import instructorService, { type CreateCourseRequest } from '@/lib/api/instructor'
import { useAuth } from '@/contexts/auth-context'

// Generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

// Form validation schema
const createCourseSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc').max(100, 'Tiêu đề phải ít hơn 100 ký tự'),
  short_description: z.string().min(1, 'Mô tả ngắn là bắt buộc').max(500, 'Mô tả phải ít hơn 500 ký tự'),
  language: z.string().optional(),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  category_id: z.number().optional(),
  price: z.number().min(0, 'Giá phải từ 0 trở lên').optional(),
  is_free: z.boolean().default(false),
  slug: z.string().min(1, 'Slug là bắt buộc'),
})

type CreateCourseForm = z.infer<typeof createCourseSchema>

interface Category {
  id: number
  name: string
  slug: string
  description?: string
}

interface Language {
  code: string
  name: string
}

const difficultyLevels = [
  { value: 'beginner', label: 'Người Mới Bắt Đầu' },
  { value: 'intermediate', label: 'Trung Cấp' },
  { value: 'advanced', label: 'Nâng Cao' },
]

export default function CreateCoursePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [languages, setLanguages] = useState<Language[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<CreateCourseForm>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: '',
      short_description: '',
      language: 'vi',
      difficulty_level: 'beginner',
      category_id: undefined,
      price: 0,
      is_free: true,
      slug: '',
    },
  })

  // Watch title to auto-generate slug
  const titleValue = form.watch('title')
  const isFree = form.watch('is_free')

  // Fetch categories and languages on mount
  useEffect(() => {
    fetchSupportingData()
  }, [])

  const fetchSupportingData = async () => {
    try {
      setLoadingData(true)
      setError(null)

      // Fetch categories and languages in parallel
      const [categoriesResponse, languagesResponse] = await Promise.all([
        instructorService.getCategories(),
        instructorService.getLanguages()
      ])

      if (categoriesResponse.success && categoriesResponse.data) {
        setCategories(categoriesResponse.data)
      }

      if (languagesResponse.success && languagesResponse.data) {
        setLanguages(languagesResponse.data)
      }
    } catch (err) {
      console.error('Error fetching supporting data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load form data')
    } finally {
      setLoadingData(false)
    }
  }

  // Auto-generate slug when title changes
  useEffect(() => {
    if (titleValue) {
      const slug = generateSlug(titleValue)
      form.setValue('slug', slug)
    }
  }, [titleValue, form])

  // Reset price when is_free changes
  useEffect(() => {
    if (isFree) {
      form.setValue('price', 0)
    }
  }, [isFree, form])

  const onSubmit = async (data: CreateCourseForm) => {
    try {
      setIsLoading(true)
      
      // Prepare course data for API
      const courseData: CreateCourseRequest = {
        title: data.title,
        short_description: data.short_description,
        slug: data.slug,
        language: data.language,
        difficulty_level: data.difficulty_level,
        category_id: data.category_id,
        price: data.is_free ? 0 : data.price,
        is_free: data.is_free,
      }

      console.log('Creating course:', courseData)
      
      const response = await instructorService.createCourse(courseData)
      
      if (response.success && response.data) {
        // Redirect to studio with success message
        router.push('/studio?created=true')
      } else {
        throw new Error('Failed to create course')
      }
      
    } catch (error) {
      console.error('Error creating course:', error)
      setError(error instanceof Error ? error.message : 'Failed to create course')
    } finally {
      setIsLoading(false)
    }
  }

  // Loading state
  if (loadingData) {
    return (
      <div className="min-h-full">
        <AppContainer className="py-8">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/studio">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <PageHeading
                title="Tạo Khóa Học Mới"
                description="Bước 1: Thông Tin Cơ Bản"
              />
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <LoadingSkeleton variant="card" count={1} />
          </div>
        </AppContainer>
      </div>
    )
  }

  // Error state
  if (error && categories.length === 0) {
    return (
      <div className="min-h-full">
        <AppContainer className="py-8">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/studio">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <PageHeading
                title="Tạo Khóa Học Mới"
                description="Bước 1: Thông Tin Cơ Bản"
              />
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="text-center py-12">
                <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
                <CardTitle className="mb-2">Lỗi Tải Dữ Liệu Form</CardTitle>
                <CardDescription className="mb-4">
                  {error}
                </CardDescription>
                <Button onClick={fetchSupportingData} variant="outline">
                  Thử Lại
                </Button>
              </CardContent>
            </Card>
          </div>
        </AppContainer>
      </div>
    )
  }

  return (
    <div className="min-h-full">
      <AppContainer className="py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/studio">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <PageHeading
              title="Tạo Khóa Học Mới"
              description="Bước 1: Thông Tin Cơ Bản"
            />
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Chi Tiết Khóa Học</CardTitle>
              <CardDescription>
                Cung cấp thông tin cơ bản về khóa học của bạn. Bạn có thể chỉnh sửa những chi tiết này sau.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                </div>
              )}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Required Fields */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Thông Tin Bắt Buộc</h3>
                    
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tiêu Đề Khóa Học *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập tiêu đề khóa học của bạn"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Chọn một tiêu đề rõ ràng, mô tả cho khóa học của bạn
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="short_description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mô Tả Ngắn *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Cung cấp mô tả ngắn gọn về khóa học của bạn"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Tóm tắt những gì học viên sẽ học trong khóa học này
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL Slug</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="url-khoa-hoc"
                              {...field}
                              readOnly
                              className="bg-muted"
                            />
                          </FormControl>
                          <FormDescription>
                            Tự động tạo từ tiêu đề khóa học. Sẽ được sử dụng trong URL khóa học.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Optional Fields */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Thông Tin Tùy Chọn</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ngôn Ngữ</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn ngôn ngữ" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {languages.map((language) => (
                                  <SelectItem key={language.code} value={language.code}>
                                    {language.name}
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
                        name="difficulty_level"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mức Độ Khó</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn mức độ" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {difficultyLevels.map((level) => (
                                  <SelectItem key={level.value} value={level.value}>
                                    {level.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="category_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Danh Mục</FormLabel>
                          <Select 
                            onValueChange={(value) => field.onChange(parseInt(value))} 
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn một danh mục" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id.toString()}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Price Section */}
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="is_free"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Khóa Học Miễn Phí</FormLabel>
                              <FormDescription>
                                Làm cho khóa học này có sẵn miễn phí
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {!isFree && (
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Giá (VND)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="299000"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormDescription>
                                Đặt giá cho khóa học của bạn bằng Đồng Việt Nam
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between pt-6">
                    <Button variant="outline" asChild>
                      <Link href="/studio">Hủy</Link>
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Đang lưu...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Lưu Bản Nháp và Tiếp Tục
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </AppContainer>
    </div>
  )
}
