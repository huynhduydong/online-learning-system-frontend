'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Save, ArrowLeft, Eye, AlertCircle } from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'
import { AppContainer } from '@/components/app-container'
import { PageHeading } from '@/components/page-heading'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import instructorService, { 
  type InstructorCourse, 
  type UpdateCourseRequest 
} from '@/lib/api/instructor'
import { useAuth } from '@/contexts/auth-context'

// Generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// Form validation schema
const editCourseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  short_description: z.string().min(1, 'Short description is required').max(500, 'Description must be less than 500 characters'),
  language: z.string().optional(),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  category_id: z.number().optional(),
  price: z.number().min(0, 'Price must be 0 or greater').optional(),
  is_free: z.boolean().default(false),
  slug: z.string().min(1, 'Slug is required'),
})

type EditCourseForm = z.infer<typeof editCourseSchema>

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
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

export default function EditCoursePage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const courseId = parseInt(params.id as string)
  
  const [isLoading, setIsLoading] = useState(false)
  const [course, setCourse] = useState<InstructorCourse | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [languages, setLanguages] = useState<Language[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<EditCourseForm>({
    resolver: zodResolver(editCourseSchema),
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

  // Watch title and is_free for auto-updates
  const titleValue = form.watch('title')
  const isFree = form.watch('is_free')

  // Load course data and supporting data on mount
  useEffect(() => {
    fetchData()
  }, [courseId])

  const fetchData = async () => {
    try {
      setLoadingData(true)
      setError(null)

      // Fetch course, categories, and languages in parallel
      const [courseResponse, categoriesResponse, languagesResponse] = await Promise.all([
        instructorService.getCourse(courseId),
        instructorService.getCategories(),
        instructorService.getLanguages()
      ])

      if (courseResponse.success && courseResponse.data) {
        const courseData = courseResponse.data
        setCourse(courseData)
        
        // Reset form with course data
        form.reset({
          title: courseData.title,
          short_description: courseData.short_description,
          language: courseData.language,
          difficulty_level: courseData.difficulty_level,
          category_id: courseData.category?.id,
          price: courseData.price.amount,
          is_free: courseData.price.is_free,
          slug: courseData.slug,
        })
      } else {
        setError('Course not found')
      }

      if (categoriesResponse.success && categoriesResponse.data) {
        setCategories(categoriesResponse.data)
      }

      if (languagesResponse.success && languagesResponse.data) {
        setLanguages(languagesResponse.data)
      }
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load course data')
    } finally {
      setLoadingData(false)
    }
  }

  // Auto-generate slug when title changes
  useEffect(() => {
    if (titleValue && course && titleValue !== course.title) {
      const slug = generateSlug(titleValue)
      form.setValue('slug', slug)
    }
  }, [titleValue, form, course])

  // Reset price when is_free changes
  useEffect(() => {
    if (isFree) {
      form.setValue('price', 0)
    }
  }, [isFree, form])

  const onSubmit = async (data: EditCourseForm) => {
    if (!course) return

    try {
      setIsLoading(true)
      setError(null)
      
      // Prepare update data
      const updateData: UpdateCourseRequest = {
        title: data.title,
        short_description: data.short_description,
        language: data.language,
        difficulty_level: data.difficulty_level,
        category_id: data.category_id,
        price: data.is_free ? 0 : data.price,
        is_free: data.is_free,
        slug: data.slug,
      }

      console.log('Updating course:', { ...updateData, id: courseId })
      
      const response = await instructorService.updateCourse(courseId, updateData)
      
      if (response.success && response.data) {
        // Update local state
        setCourse(response.data)
        
        // Show success message (could implement toast here)
        console.log('Course updated successfully')
      } else {
        throw new Error('Failed to update course')
      }
      
    } catch (error) {
      console.error('Error updating course:', error)
      setError(error instanceof Error ? error.message : 'Failed to update course')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePublish = async () => {
    if (!course) return

    try {
      setIsLoading(true)
      setError(null)
      
      console.log('Publishing course:', courseId)
      
      const response = await instructorService.publishCourse(courseId)
      
      if (response.success && response.data) {
        // Update course status
        setCourse({ ...course, status: 'published', published_at: response.data.published_at || new Date().toISOString() })
        
        // Show success message
        console.log('Course published successfully')
      } else {
        throw new Error('Failed to publish course')
      }
      
    } catch (error) {
      console.error('Error publishing course:', error)
      setError(error instanceof Error ? error.message : 'Failed to publish course')
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
                title="Loading..."
                description="Loading course details"
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

  // Error state or course not found
  if (error || !course) {
    return (
      <div className="min-h-full">
        <AppContainer className="py-8">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <h1 className="text-2xl font-bold mb-4">
              {course ? 'Error Loading Course' : 'Course Not Found'}
            </h1>
            <p className="text-muted-foreground mb-4">
              {error || 'The course you are looking for does not exist or you don\'t have permission to edit it.'}
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={fetchData}>
                Try Again
              </Button>
              <Button asChild>
                <Link href="/studio">Back to My Courses</Link>
              </Button>
            </div>
          </div>
        </AppContainer>
      </div>
    )
  }

  const getStatusVariant = (status: 'draft' | 'published' | 'archived') => {
    switch (status) {
      case 'published':
        return 'default'
      case 'archived':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getStatusText = (status: 'draft' | 'published' | 'archived') => {
    switch (status) {
      case 'published':
        return 'Published'
      case 'archived':
        return 'Archived'
      default:
        return 'Draft'
    }
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
            <div className="flex-1">
              <PageHeading
                title={course.title}
                description="Edit course details and content"
              />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={getStatusVariant(course.status)}>
                {getStatusText(course.status)}
              </Badge>
              {course.status === 'published' && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/courses/${course.slug}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Live
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
              <CardDescription>
                Update your course information and settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Required Fields */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Basic Information</h3>
                    
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course Title *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your course title"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="short_description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Short Description *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Provide a brief description of your course"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
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
                              {...field}
                              readOnly
                              className="bg-muted"
                            />
                          </FormControl>
                          <FormDescription>
                            Auto-generated from your course title
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Optional Fields */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Additional Settings</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Language</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
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
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="difficulty_level"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Difficulty Level</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
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
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="category_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select 
                            onValueChange={(value) => field.onChange(parseInt(value))} 
                            value={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
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
                              <FormLabel className="text-base">Free Course</FormLabel>
                              <FormDescription>
                                Make this course available for free
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
                              <FormLabel>Price (VND)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="299000"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
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
                      <Link href="/studio">Back to Courses</Link>
                    </Button>
                    <div className="flex gap-2">
                      <Button type="submit" variant="outline" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                      {course.status === 'draft' && (
                        <Button 
                          type="button" 
                          onClick={handlePublish}
                          disabled={isLoading}
                        >
                          Publish Course
                        </Button>
                      )}
                    </div>
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
