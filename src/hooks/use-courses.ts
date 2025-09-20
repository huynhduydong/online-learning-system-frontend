import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { Course } from "@/stores/course-store"

const API_URL = process.env.NEXT_PUBLIC_API_URL

// Fetch all courses
export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async (): Promise<Course[]> => {
      const response = await fetch(`${API_URL}/courses`)
      if (!response.ok) {
        throw new Error("Failed to fetch courses")
      }
      return response.json()
    },
  })
}

// Fetch single course
export function useCourse(courseId: string) {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: async (): Promise<Course> => {
      const response = await fetch(`${API_URL}/courses/${courseId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch course")
      }
      return response.json()
    },
    enabled: !!courseId,
  })
}

// Enroll in course
export function useEnrollCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (courseId: string) => {
      const response = await fetch(`${API_URL}/courses/${courseId}/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to enroll in course")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] })
      queryClient.invalidateQueries({ queryKey: ["enrolled-courses"] })
    },
  })
}

// Fetch enrolled courses
export function useEnrolledCourses() {
  return useQuery({
    queryKey: ["enrolled-courses"],
    queryFn: async (): Promise<Course[]> => {
      const response = await fetch(`${API_URL}/courses/enrolled`)
      if (!response.ok) {
        throw new Error("Failed to fetch enrolled courses")
      }
      return response.json()
    },
  })
}
