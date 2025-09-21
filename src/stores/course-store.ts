import { create } from "zustand"

export interface Course {
  id: string
  title: string
  description: string
  instructor: {
    id: string
    name: string
    avatar?: string
  }
  thumbnail: string
  price: number
  originalPrice?: number
  duration: number // in minutes
  level: "beginner" | "intermediate" | "advanced"
  category: string
  rating: number
  reviewCount?: number
  studentsCount: number
  tags?: string[]
  lessons: Lesson[]
  createdAt: string
  updatedAt: string
}

export interface Lesson {
  id: string
  title: string
  description: string
  videoUrl: string
  duration: number // in minutes
  order: number
  isCompleted?: boolean
}

interface CourseState {
  courses: Course[]
  currentCourse: Course | null
  enrolledCourses: Course[]
  isLoading: boolean
  searchQuery: string
  selectedCategory: string

  // Actions
  setCourses: (courses: Course[]) => void
  setCurrentCourse: (course: Course | null) => void
  setEnrolledCourses: (courses: Course[]) => void
  setLoading: (loading: boolean) => void
  setSearchQuery: (query: string) => void
  setSelectedCategory: (category: string) => void
  enrollInCourse: (courseId: string) => void
  markLessonComplete: (courseId: string, lessonId: string) => void
}

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  currentCourse: null,
  enrolledCourses: [],
  isLoading: false,
  searchQuery: "",
  selectedCategory: "",

  setCourses: (courses) => set({ courses }),
  setCurrentCourse: (course) => set({ currentCourse: course }),
  setEnrolledCourses: (courses) => set({ enrolledCourses: courses }),
  setLoading: (loading) => set({ isLoading: loading }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  enrollInCourse: (courseId) => {
    const { courses, enrolledCourses } = get()
    const course = courses.find((c) => c.id === courseId)
    if (course && !enrolledCourses.find((c) => c.id === courseId)) {
      set({ enrolledCourses: [...enrolledCourses, course] })
    }
  },

  markLessonComplete: (courseId, lessonId) => {
    const { enrolledCourses } = get()
    const updatedCourses = enrolledCourses.map((course) => {
      if (course.id === courseId) {
        return {
          ...course,
          lessons: course.lessons.map((lesson) => (lesson.id === lessonId ? { ...lesson, isCompleted: true } : lesson)),
        }
      }
      return course
    })
    set({ enrolledCourses: updatedCourses })
  },
}))
