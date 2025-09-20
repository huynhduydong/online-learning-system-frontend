"use client"

import { useState } from "react"
import { Search, Filter, Star, Clock, Users, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCourses } from "@/hooks/use-courses"
import { formatCurrency, formatDuration } from "@/lib/utils"

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const { data: courses, isLoading, error } = useCourses()

  const categories = ["Tất cả", "Lập trình", "Thiết kế", "Marketing", "Kinh doanh"]

  const filteredCourses =
    courses?.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = !selectedCategory || selectedCategory === "Tất cả" || course.category === selectedCategory
      return matchesSearch && matchesCategory
    }) || []

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Đang tải khóa học...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Có lỗi xảy ra khi tải khóa học</p>
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        </div>
      </div>
    )
  }

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
              <a href="/courses" className="text-foreground font-medium">
                Khóa học
              </a>
              <Button variant="outline">Đăng nhập</Button>
              <Button>Đăng ký</Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Khám phá khóa học</h1>
          <p className="text-muted-foreground">Tìm kiếm và đăng ký các khóa học phù hợp với bạn</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Tìm kiếm khóa học..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="md:w-auto bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Bộ lọc
            </Button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category === "Tất cả" ? "" : category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-muted relative">
                <img
                  src={course.id === "1" ? "/react-course.jpg" : "/figma-course.jpg"}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 right-2">
                  {course.level === "beginner" && "Cơ bản"}
                  {course.level === "intermediate" && "Trung cấp"}
                  {course.level === "advanced" && "Nâng cao"}
                </Badge>
              </div>

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2 mb-2">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-2">
                  <img
                    src={course.id === "1" ? "/instructor-avatar.jpg" : "/instructor-avatar-2.jpg"}
                    alt={course.instructor.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm text-muted-foreground">{course.instructor.name}</span>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatDuration(course.duration)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{course.studentsCount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-primary">{formatCurrency(course.price)}</div>
                  <Button>Đăng ký ngay</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Không tìm thấy khóa học</h3>
            <p className="text-muted-foreground">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
          </div>
        )}
      </div>
    </div>
  )
}
