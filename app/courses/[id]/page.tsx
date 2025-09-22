"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Play, Clock, Users, Star, BookOpen, CheckCircle, PlayCircle, Award, Globe, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { coursesService } from "@/lib/api/courses"
import { formatCurrency, formatDuration } from "@/lib/utils"
import type { CourseDetails } from "@/lib/api/types"
import Link from "next/link"
import { CourseRegistrationWorkflow } from "@/components/course-registration"

export default function CourseDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = params.id as string // Using id param but treating it as slug for backward compatibility
  const [activeTab, setActiveTab] = useState("overview")
  const [course, setCourse] = useState<CourseDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)

  // Check for register parameter
  const shouldAutoOpenRegistration = searchParams.get('register') === 'true'

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const courseData = await coursesService.getCourseBySlug(slug)
        setCourse(courseData)
      } catch (err) {
        console.error("Failed to fetch course:", err)
        setError("Không thể tải thông tin khóa học")
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      fetchCourse()
    }
  }, [slug])

  // Auto-open registration workflow when register=true parameter is detected
  useEffect(() => {
    if (shouldAutoOpenRegistration && course && !isLoading) {
      setIsRegistrationOpen(true)
    }
  }, [shouldAutoOpenRegistration, course, isLoading])

  const handleEnroll = async () => {
    if (!course) return
    setIsRegistrationOpen(true)
  }

  const handleRegistrationClose = () => {
    setIsRegistrationOpen(false)
  }

  const handleRegistrationSuccess = (enrollmentId: string) => {
    setIsRegistrationOpen(false)
    // Redirect to first lesson or dashboard
    console.log("Registration successful:", enrollmentId)
    // You can implement redirect logic here if needed
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold">Online Learning System</h1>
              </div>
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Trang chủ
                </Link>
                <Link href="/courses" className="text-muted-foreground hover:text-foreground">
                  Khóa học
                </Link>
                <Button variant="outline">Đăng nhập</Button>
                <Button>Đăng ký</Button>
              </nav>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Loading skeleton */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-6 w-24 mb-2" />
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-2/3 mb-6" />

              <div className="flex gap-6 mb-6">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
              </div>

              <Skeleton className="aspect-video w-full rounded-lg" />
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-32 mb-4" />
                  <Skeleton className="h-12 w-full" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold">Online Learning System</h1>
              </div>
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Trang chủ
                </Link>
                <Link href="/courses" className="text-muted-foreground hover:text-foreground">
                  Khóa học
                </Link>
                <Button variant="outline">Đăng nhập</Button>
                <Button>Đăng ký</Button>
              </nav>
            </div>
          </div>
        </header>

        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Không tìm thấy khóa học</h2>
            <p className="text-muted-foreground mb-6">{error || "Khóa học bạn tìm kiếm không tồn tại."}</p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
              <Link href="/courses">
                <Button>Xem tất cả khóa học</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: "overview", label: "Tổng quan" },
    { id: "curriculum", label: "Chương trình học" },
    { id: "instructor", label: "Giảng viên" },
    { id: "reviews", label: "Đánh giá" },
  ]

  // Format price display
  const priceDisplay = course.price?.display || formatCurrency(course.price?.amount || 0)
  const isFreeCourse = course.price?.is_free || course.price?.amount === 0

  // Format rating display
  const hasRating = course.rating?.has_enough_ratings && course.rating?.average
  const ratingDisplay = hasRating ? course.rating.average.toFixed(1) : "Chưa có đánh giá"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Online Learning System</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                Trang chủ
              </Link>
              <Link href="/courses" className="text-muted-foreground hover:text-foreground">
                Khóa học
              </Link>
              <Button variant="outline">Đăng nhập</Button>
              <Button>Đăng ký</Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Trang chủ</Link>
          <span>/</span>
          <Link href="/courses" className="hover:text-foreground">Khóa học</Link>
          <span>/</span>
          <Link href={`/courses?category=${course.category?.slug}`} className="hover:text-foreground">
            {course.category?.name}
          </Link>
          <span>/</span>
          <span className="text-foreground">{course.title}</span>
        </nav>

        {/* Course Hero */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <Badge variant="secondary" className="mb-2">
                {course.category?.name}
              </Badge>
              <h1 className="text-3xl font-bold mb-4 text-balance">{course.title}</h1>
              <p className="text-lg text-muted-foreground mb-6 text-pretty">
                {course.short_description || course.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 mb-6">
              {hasRating && (
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{ratingDisplay}</span>
                  <span className="text-muted-foreground">({course.rating.total_ratings} đánh giá)</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span>{course.stats?.total_enrollments?.toLocaleString() || 0} học viên</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>{course.stats?.duration_hours || 0} giờ</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <span>{course.stats?.total_lessons || 0} bài học</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <span>{course.language === 'vi' ? 'Tiếng Việt' : 'English'}</span>
              </div>
            </div>

            <div className="aspect-video bg-muted rounded-lg relative mb-6">
              {course.thumbnail_url ? (
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg">
                  <div className="text-center">
                    <BookOpen className="h-16 w-16 text-primary mx-auto mb-4" />
                    <p className="text-lg font-medium text-primary">{course.title}</p>
                  </div>
                </div>
              )}

              {course.preview_video_url && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button size="lg" className="rounded-full h-16 w-16">
                    <Play className="h-6 w-6" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Enrollment Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <div className="text-3xl font-bold text-primary mb-2">
                  {isFreeCourse ? (
                    <span className="text-green-600">Miễn phí</span>
                  ) : (
                    <div>
                      {priceDisplay}
                      {course.price?.original_price && course.price.original_price > course.price.amount && (
                        <span className="text-lg text-muted-foreground line-through ml-2">
                          {formatCurrency(course.price.original_price)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <Button size="lg" className="w-full" onClick={handleEnroll}>
                  {isFreeCourse ? "Học miễn phí" : "Đăng ký ngay"}
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  {isFreeCourse ? "Truy cập trọn đời" : "Đảm bảo hoàn tiền trong 30 ngày"}
                </p>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Cấp độ:</span>
                    <Badge variant="outline">
                      {course.difficulty_level === "beginner" && "Cơ bản"}
                      {course.difficulty_level === "intermediate" && "Trung cấp"}
                      {course.difficulty_level === "advanced" && "Nâng cao"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Thời lượng:</span>
                    <span>{course.stats?.duration_hours || 0} giờ</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Bài học:</span>
                    <span>{course.stats?.total_lessons || 0} bài</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Ngôn ngữ:</span>
                    <span>{course.language === 'vi' ? 'Tiếng Việt' : 'English'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Chứng chỉ:</span>
                    <div className="flex items-center space-x-1">
                      <Award className="h-4 w-4 text-primary" />
                      <span>Có</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Mô tả khóa học</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      {course.description || course.short_description}
                    </p>
                  </div>
                </div>

                {course.what_you_will_learn && course.what_you_will_learn.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Bạn sẽ học được gì?</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {course.what_you_will_learn.map((item, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {course.requirements && course.requirements.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Yêu cầu</h3>
                    <ul className="space-y-2">
                      {course.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === "curriculum" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Chương trình học</h2>
                  <p className="text-muted-foreground mb-6">
                    {course.stats?.total_lessons || 0} bài học • {course.stats?.duration_hours || 0} giờ học
                  </p>
                </div>

                {course.modules && course.modules.length > 0 ? (
                  <div className="space-y-4">
                    {course.modules.map((module, index) => (
                      <Card key={module.id}>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span>Chương {index + 1}: {module.title}</span>
                            <Badge variant="outline">
                              {module.lessons_count} bài • {Math.round(module.duration_minutes / 60)} giờ
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Chương trình học đang được cập nhật</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === "instructor" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Giảng viên</h2>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{course.instructor?.name}</h3>
                        {course.instructor?.email && (
                          <p className="text-muted-foreground mb-4">{course.instructor.email}</p>
                        )}
                        {course.instructor?.bio && (
                          <p className="text-muted-foreground leading-relaxed">{course.instructor.bio}</p>
                        )}

                        <div className="flex items-center gap-6 mt-4">
                          {course.instructor?.total_students && (
                            <div className="text-center">
                              <div className="font-semibold">{course.instructor.total_students.toLocaleString()}</div>
                              <div className="text-sm text-muted-foreground">Học viên</div>
                            </div>
                          )}
                          {course.instructor?.total_courses && (
                            <div className="text-center">
                              <div className="font-semibold">{course.instructor.total_courses}</div>
                              <div className="text-sm text-muted-foreground">Khóa học</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Đánh giá từ học viên</h2>
                </div>

                {hasRating ? (
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="text-4xl font-bold">{ratingDisplay}</div>
                        <div>
                          <div className="flex items-center space-x-1 mb-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${i < Math.floor(course.rating.average || 0)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                                  }`}
                              />
                            ))}
                          </div>
                          <p className="text-muted-foreground">
                            {course.rating.total_ratings} đánh giá
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Chưa có đánh giá nào cho khóa học này</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Course Tags */}
              {course.tags && course.tags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {course.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Course Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Thông tin khóa học</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ngày tạo:</span>
                    <span>{new Date(course.created_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cập nhật:</span>
                    <span>{new Date(course.updated_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                  {course.published_at && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Xuất bản:</span>
                      <span>{new Date(course.published_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Registration Workflow */}
      <CourseRegistrationWorkflow
        course={course}
        isOpen={isRegistrationOpen}
        onClose={handleRegistrationClose}
        onSuccess={handleRegistrationSuccess}
      />
    </div>
  )
}