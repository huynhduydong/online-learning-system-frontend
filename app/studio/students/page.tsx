'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  Users,
  TrendingUp,
  Clock,
  BookOpen,
  Download,
  Eye,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  XCircle,
  Target
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

import { useAnalytics } from '@/hooks/use-analytics'
import { analyticsService } from '@/lib/api/analytics'
import type { StudentProgress, CourseAnalytics } from '@/lib/api/analytics'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

interface StudentProgressWithCourse extends StudentProgress {
  courseName?: string
  courseId?: string
}

export default function StudentsPage() {
  const [selectedCourse, setSelectedCourse] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('progress')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [studentsData, setStudentsData] = useState<StudentProgressWithCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const {
    courseAnalytics,
    courseAnalyticsLoading,
    dashboardStats,
    timeRange,
    setTimeRange
  } = useAnalytics({
    autoRefresh: true,
    refreshInterval: 300000
  })

  // Fetch students data
  useEffect(() => {
    const fetchStudentsData = async () => {
      if (!courseAnalytics || courseAnalytics.length === 0) {
        return
      }

      setLoading(true)
      setError(null)
      
      try {
        if (selectedCourse === 'all') {
          // Fetch students from all courses
          const allStudents: StudentProgressWithCourse[] = []
          
          for (const course of courseAnalytics) {
            try {
              const result = await analyticsService.getStudentProgress(course.courseId, {
                page: 1,
                limit: 100,
                status: statusFilter === 'all' ? undefined : statusFilter,
                sortBy,
                sortOrder
              })
              
              const studentsWithCourse = result.data.map(student => ({
                ...student,
                courseName: course.courseName,
                courseId: course.courseId
              }))
              
              allStudents.push(...studentsWithCourse)
            } catch (err) {
              console.error(`Error fetching students for course ${course.courseId}:`, err)
            }
          }
          
          setStudentsData(allStudents)
        } else {
          // Fetch students from specific course
          const result = await analyticsService.getStudentProgress(selectedCourse, {
            page: 1,
            limit: 100,
            status: statusFilter === 'all' ? undefined : statusFilter,
            sortBy,
            sortOrder
          })
          
          const course = courseAnalytics.find(c => c.courseId === selectedCourse)
          const studentsWithCourse = result.data.map(student => ({
            ...student,
            courseName: course?.courseName || 'Unknown Course',
            courseId: selectedCourse
          }))
          
          setStudentsData(studentsWithCourse)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch students data')
      } finally {
        setLoading(false)
      }
    }

    fetchStudentsData()
  }, [selectedCourse, statusFilter, sortBy, sortOrder, courseAnalytics])

  // Filter students based on search query
  const filteredStudents = useMemo(() => {
    if (!searchQuery) return studentsData
    
    return studentsData.filter(student =>
      student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.courseName && student.courseName.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [studentsData, searchQuery])

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalStudents = filteredStudents.length
    const activeStudents = filteredStudents.filter(s => s.status === 'active').length
    const completedStudents = filteredStudents.filter(s => s.status === 'completed').length
    const averageProgress = totalStudents > 0 
      ? filteredStudents.reduce((sum, s) => sum + s.progress, 0) / totalStudents 
      : 0
    const totalTimeSpent = filteredStudents.reduce((sum, s) => sum + s.timeSpent, 0)

    return {
      totalStudents,
      activeStudents,
      completedStudents,
      averageProgress,
      totalTimeSpent
    }
  }, [filteredStudents])

  // Progress distribution data for charts
  const progressDistribution = useMemo(() => {
    const ranges = [
      { name: '0-20%', min: 0, max: 20, count: 0 },
      { name: '21-40%', min: 21, max: 40, count: 0 },
      { name: '41-60%', min: 41, max: 60, count: 0 },
      { name: '61-80%', min: 61, max: 80, count: 0 },
      { name: '81-100%', min: 81, max: 100, count: 0 }
    ]

    filteredStudents.forEach(student => {
      const range = ranges.find(r => student.progress >= r.min && student.progress <= r.max)
      if (range) range.count++
    })

    return ranges
  }, [filteredStudents])

  // Status distribution for pie chart
  const statusDistribution = useMemo(() => {
    const statuses = {
      active: 0,
      completed: 0,
      inactive: 0,
      dropped: 0
    }

    filteredStudents.forEach(student => {
      if (statuses.hasOwnProperty(student.status)) {
        statuses[student.status]++
      }
    })

    return Object.entries(statuses).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      status
    }))
  }, [filteredStudents])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'active':
        return <TrendingUp className="h-4 w-4 text-blue-500" />
      case 'inactive':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'dropped':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Users className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'completed':
        return 'default'
      case 'active':
        return 'secondary'
      case 'inactive':
        return 'outline'
      case 'dropped':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const formatTimeSpent = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const exportStudentsData = async () => {
    try {
      const blob = await analyticsService.exportAnalytics('students', {
        courseId: selectedCourse === 'all' ? undefined : selectedCourse,
        timeRange
      })
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `students-data-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  if (loading && studentsData.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading student data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Student Progress Tracking</h1>
          <p className="text-muted-foreground">Monitor and analyze student progress across all courses</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportStudentsData} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.totalStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.activeStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.completedStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.averageProgress.toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Time Spent</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTimeSpent(summaryStats.totalTimeSpent)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search students by name, email, or course..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courseAnalytics.map((course) => (
                  <SelectItem key={course.courseId} value={course.courseId}>
                    {course.courseName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="dropped">Dropped</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="progress">Progress</SelectItem>
                <SelectItem value="lastActivity">Last Activity</SelectItem>
                <SelectItem value="timeSpent">Time Spent</SelectItem>
                <SelectItem value="studentName">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress Analytics</TabsTrigger>
          <TabsTrigger value="students">Student List</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progress Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Progress Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={progressDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Student Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          {/* Course Performance Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Course Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={courseAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="courseName" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="averageProgress" fill="#8884d8" name="Average Progress" />
                  <Bar dataKey="completionRate" fill="#82ca9d" name="Completion Rate" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          {/* Students Table */}
          <Card>
            <CardHeader>
              <CardTitle>Student Details</CardTitle>
              <CardDescription>
                Showing {filteredStudents.length} students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time Spent</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={`${student.studentId}-${student.courseId}`}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{student.studentName}</div>
                            <div className="text-sm text-muted-foreground">{student.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{student.courseName}</div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>{student.progress}%</span>
                              <span className="text-muted-foreground">
                                {student.completedLessons}/{student.totalLessons}
                              </span>
                            </div>
                            <Progress value={student.progress} className="h-2" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(student.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(student.status)}
                              {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>{formatTimeSpent(student.timeSpent)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(student.lastActivity).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
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
        </TabsContent>
      </Tabs>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}