'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, BookOpen, Eye, Edit, MoreVertical, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AppContainer } from '@/components/app-container'
import { PageHeading } from '@/components/page-heading'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import instructorService, { type InstructorCourse } from '@/lib/api/instructor'
import { useAuth } from '@/contexts/auth-context'

export default function StudioPage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<InstructorCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch instructor courses
  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await instructorService.getCourses({
        sort_by: 'updated_at',
        sort_order: 'desc'
      })
      
      if (response.success && response.data) {
        setCourses(response.data.courses)
      } else {
        setError('Failed to load courses')
      }
    } catch (err) {
      console.error('Error fetching courses:', err)
      setError(err instanceof Error ? err.message : 'Failed to load courses')
    } finally {
      setLoading(false)
    }
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-full">
        <AppContainer className="py-8">
          <div className="flex items-center justify-between mb-8">
            <PageHeading
              title="My Courses"
              description="Manage and create your courses"
            />
            <Button asChild>
              <Link href="/studio/create">
                <Plus className="mr-2 h-4 w-4" />
                Create New Course
              </Link>
            </Button>
          </div>
          <LoadingSkeleton variant="card" count={6} />
        </AppContainer>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-full">
        <AppContainer className="py-8">
          <div className="flex items-center justify-between mb-8">
            <PageHeading
              title="My Courses"
              description="Manage and create your courses"
            />
            <Button asChild>
              <Link href="/studio/create">
                <Plus className="mr-2 h-4 w-4" />
                Create New Course
              </Link>
            </Button>
          </div>
          
          <Card className="text-center py-12">
            <CardContent>
              <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
              <CardTitle className="mb-2">Error Loading Courses</CardTitle>
              <CardDescription className="mb-4">
                {error}
              </CardDescription>
              <Button onClick={fetchCourses} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </AppContainer>
      </div>
    )
  }

  return (
    <div className="min-h-full">
      <AppContainer className="py-8">
        <div className="flex items-center justify-between mb-8">
          <PageHeading
            title="My Courses"
            description="Manage and create your courses"
          />
          <Button asChild>
            <Link href="/studio/create">
              <Plus className="mr-2 h-4 w-4" />
              Create New Course
            </Link>
          </Button>
        </div>

        {courses.length === 0 ? (
          // Empty state
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="mb-2">No courses yet</CardTitle>
              <CardDescription className="mb-4">
                Start creating your first course to share your knowledge with students.
              </CardDescription>
              <Button asChild>
                <Link href="/studio/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Course
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          // Courses grid
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card key={course.id} className="relative group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg mb-2 line-clamp-2">
                        {course.title}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusVariant(course.status)}>
                          {getStatusText(course.status)}
                        </Badge>
                        {course.status === 'published' && (
                          <span className="text-sm text-muted-foreground">
                            {course.stats.total_enrollments} students
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/studio/courses/${course.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Course
                          </Link>
                        </DropdownMenuItem>
                        {course.status === 'published' && (
                          <DropdownMenuItem asChild>
                            <Link href={`/courses/${course.slug}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Live Course
                            </Link>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div>Created: {new Date(course.created_at).toLocaleDateString()}</div>
                    <div>Last updated: {new Date(course.updated_at).toLocaleDateString()}</div>
                    {course.status === 'published' && course.published_at && (
                      <div>Published: {new Date(course.published_at).toLocaleDateString()}</div>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      asChild
                    >
                      <Link href={`/studio/courses/${course.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        {course.status === 'draft' ? 'Continue Editing' : 'Edit Course'}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </AppContainer>
    </div>
  )
}
