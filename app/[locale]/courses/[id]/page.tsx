"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Play, Clock, Users, Star, BookOpen, CheckCircle, PlayCircle, Award, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCourse, useEnrollCourse } from "@/hooks/use-courses"
import { formatCurrency, formatDuration } from "@/lib/utils"

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = params.id as string
  const [activeTab, setActiveTab] = useState("overview")

  const { data: course, isLoading, error } = useCourse(courseId)
  const enrollMutation = useEnrollCourse()

  const handleEnroll = async () => {
    try {
      await enrollMutation.mutateAsync(courseId)
      // Show success message or redirect
    } catch (error) {
      console.error("Enrollment failed:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Đang tải thông tin khóa học...</p>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Không tìm thấy khóa học</p>
          <Button onClick={() => window.history.back()}>Quay lại</Button>
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
              <a href="/" className="text-muted-foreground hover:text-foreground">
                Trang chủ
              </a>
              <a href="/courses" className="text-muted-foreground hover:text-foreground">
                Khóa học
              </a>
              <Button variant="outline">Đăng nhập</Button>
              <Button>Đăng ký</Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Course Hero */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <Badge variant="secondary" className="mb-2">
                {course.category}
              </Badge>
              <h1 className="text-3xl font-bold mb-4 text-balance">{course.title}</h1>
              <p className="text-lg text-muted-foreground mb-6 text-pretty">{course.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-6 mb-6">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{course.rating}</span>
                <span className="text-muted-foreground">({course.studentsCount} đánh giá)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span>{course.studentsCount.toLocaleString()} học viên</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>{formatDuration(course.duration)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <span>Tiếng Việt</span>
              </div>
            </div>

            <div className="aspect-video bg-muted rounded-lg relative mb-6">
              <img
                src={course.id === "1" ? "/react-course.jpg" : "/figma-course.jpg"}
                alt={course.title}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button size="lg" className="rounded-full h-16 w-16">
                  <Play className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>

          {/* Enrollment Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <div className="text-3xl font-bold text-primary mb-2">{formatCurrency(course.price)}</div>
                <Button size="lg" className="w-full" onClick={handleEnroll} disabled={enrollMutation.isPending}>
                  {enrollMutation.isPending ? "Đang đăng ký..." : "Đăng ký ngay"}
                </Button>
                <p className="text-sm text-muted-foreground text-center">Đảm bảo hoàn tiền trong 30 ngày</p>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Cấp độ:</span>
                    <Badge variant="outline">
                      {course.level === "beginner" && "Cơ bản"}
                      {course.level === "intermediate" && "Trung cấp"}
                      {course.level === "advanced" && "Nâng cao"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Thời lượng:</span>
                    <span>{formatDuration(course.duration)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Bài học:</span>
                    <span>{course.lessons.length} bài</span>
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
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
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
                  <p className="text-muted-foreground leading-relaxed">{course.description}</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Bạn sẽ học được gì?</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      "Nắm vững các khái niệm cơ bản",
                      "Thực hành với các dự án thực tế",
                      "Áp dụng kiến thức vào công việc",
                      "Nhận chứng chỉ hoàn thành",
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "curriculum" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Chương trình học</h2>
                <div className="space-y-4">
                  {course.lessons.map((lesson, index) => (
                    <Card key={lesson.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{lesson.title}</CardTitle>
                              <CardDescription>{lesson.description}</CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <PlayCircle className="h-4 w-4" />
                            <span className="text-sm">{formatDuration(lesson.duration)}</span>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "instructor" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Giảng viên</h2>
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <img
                        src={course.id === "1" ? "/instructor-avatar.jpg" : "/instructor-avatar-2.jpg"}
                        alt={course.instructor.name}
                        className="w-16 h-16 rounded-full"
                      />
                      <div>
                        <CardTitle className="text-xl">{course.instructor.name}</CardTitle>
                        <CardDescription>Chuyên gia {course.category}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Với hơn 5 năm kinh nghiệm trong lĩnh vực {course.category.toLowerCase()},{course.instructor.name}{" "}
                      đã giúp hàng nghìn học viên nắm vững kiến thức và phát triển sự nghiệp thành công.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Đánh giá từ học viên</h2>
                <div className="space-y-4">
                  {[1, 2, 3].map((review) => (
                    <Card key={review}>
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <img src="/user-avatar.jpg" alt="User" className="w-10 h-10 rounded-full" />
                          <div>
                            <div className="font-semibold">Học viên {review}</div>
                            <div className="flex items-center space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Khóa học rất hay và bổ ích. Giảng viên giải thích rất dễ hiểu và có nhiều ví dụ thực tế. Tôi
                          đã áp dụng được kiến thức vào công việc.
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Khóa học liên quan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2].map((item) => (
                    <div key={item} className="flex space-x-3">
                      <div className="w-16 h-12 bg-muted rounded flex-shrink-0"></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm line-clamp-2">Khóa học {course.category} nâng cao</h4>
                        <p className="text-xs text-muted-foreground">{formatCurrency(1800000)}</p>
                      </div>
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
