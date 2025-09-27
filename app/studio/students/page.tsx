'use client'

/**
 * Instructor Students Management Page
 * Manage and track student progress across all courses
 */

import { useState, useEffect } from 'react'
import {
  Users,
  Search,
  MoreHorizontal,
  Eye,
  MessageSquare,
  BookOpen,
  Target,
  Award,
  Mail,
  Download
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'

// Mock student data
const studentStats = {
  totalStudents: 1247,
  activeStudents: 892,
  completedStudents: 234,
  avgProgress: 68
}

const students = [
  {
    id: 1,
    name: 'Nguyễn Văn An',
    email: 'nguyenvanan@email.com',
    avatar: null,
    enrolledCourses: 3,
    completedCourses: 1,
    totalProgress: 75,
    lastActive: '2024-01-20',
    joinDate: '2023-12-15'
  },
  {
    id: 2,
    name: 'Trần Thị Bích',
    email: 'tranthib@email.com',
    avatar: null,
    enrolledCourses: 2,
    completedCourses: 2,
    totalProgress: 100,
    lastActive: '2024-01-19',
    joinDate: '2023-11-20'
  },
  {
    id: 3,
    name: 'Lê Minh Cường',
    email: 'leminhcuong@email.com',
    avatar: null,
    enrolledCourses: 1,
    completedCourses: 0,
    totalProgress: 45,
    lastActive: '2024-01-18',
    joinDate: '2024-01-10'
  }
]

export default function InstructorStudentsPage() {
  const [studentsList, setStudents] = useState(students)
  const [filteredStudents, setFilteredStudents] = useState(students)
  const [searchTerm, setSearchTerm] = useState('')

  // Filter students
  useEffect(() => {
    let filtered = studentsList

    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredStudents(filtered)
  }, [studentsList, searchTerm])

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600'
    if (progress >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý học viên</h1>
          <p className="text-muted-foreground">
            Theo dõi tiến độ và quản lý học viên của bạn
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Xuất danh sách
          </Button>
          <Button size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Gửi thông báo
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng học viên</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentStats.totalStudents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +189 trong tháng này
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang học</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{studentStats.activeStudents}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((studentStats.activeStudents / studentStats.totalStudents) * 100)}% tổng số
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã hoàn thành</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{studentStats.completedStudents}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((studentStats.completedStudents / studentStats.totalStudents) * 100)}% tỷ lệ hoàn thành
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiến độ TB</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{studentStats.avgProgress}%</div>
            <Progress value={studentStats.avgProgress} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách học viên</CardTitle>
          <CardDescription>
            Quản lý và theo dõi tiến độ học tập của học viên
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="search">Tìm kiếm</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                  id="search"
                  placeholder="Tìm theo tên hoặc email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
              />
            </div>
          </div>
          </div>

          {/* Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                  <TableHead>Học viên</TableHead>
                  <TableHead>Khóa học</TableHead>
                  <TableHead>Tiến độ</TableHead>
                  <TableHead>Hoạt động cuối</TableHead>
                  <TableHead>Ngày tham gia</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                        <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={student.avatar || ''} />
                          <AvatarFallback>
                            {student.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                          <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {student.email}
                          </div>
                        </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                        <div className="text-sm">
                          {student.enrolledCourses} khóa học
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {student.completedCourses} hoàn thành
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                      <div className="space-y-2">
                        <div className={`text-sm font-medium ${getProgressColor(student.totalProgress)}`}>
                          {student.totalProgress}%
                            </div>
                        <Progress value={student.totalProgress} className="w-20" />
                          </div>
                        </TableCell>
                    <TableCell>{student.lastActive}</TableCell>
                    <TableCell>{student.joinDate}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                              <DropdownMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Gửi tin nhắn
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
    </div>
  )
}