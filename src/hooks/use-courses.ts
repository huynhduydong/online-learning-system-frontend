import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"
import type { Course, ApiCoursesResponse, ApiCourseResponse, CoursesData, NewApiCourseCatalogResponse, CourseCatalogParams } from "@/lib/api/types"

// Build query string from parameters
function buildQueryString(params: CourseCatalogParams): string {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value.toString())
    }
  })
  
  return searchParams.toString()
}

// Fetch courses with filtering support
export function useCourses(params: CourseCatalogParams = {}) {
  const queryString = buildQueryString(params)
  
  return useQuery({
    queryKey: ["courses", params],
    queryFn: async (): Promise<CoursesData> => {
      const endpoint = `/courses/catalog${queryString ? `?${queryString}` : ''}`
      const response = await apiClient.get(endpoint)
      
      // Handle the API response structure  
      console.log("🔍 API Response:", response)
      console.log("🔍 Response.data structure:", response.data)
      console.log("🔍 Has courses?", !!response.data?.courses)
      console.log("🔍 Data keys:", response.data ? Object.keys(response.data) : 'No data')
      
      // Try different response structures
      if (response.success && response.data?.courses) {
        console.log("✅ Found courses in response.data.courses")
        return {
          courses: response.data.courses,
          pagination: response.data.pagination,
          filters_applied: response.data.filters_applied,
          sort_by: response.data.filters_applied?.sort_by || 'popularity'
        }
      }
      
      // Try nested structure (response.data.data.courses)
      if (response.success && response.data?.data?.courses) {
        console.log("✅ Found courses in response.data.data.courses")
        return {
          courses: response.data.data.courses,
          pagination: response.data.data.pagination,
          filters_applied: response.data.data.filters_applied,
          sort_by: response.data.data.filters_applied?.sort_by || 'popularity'
        }
      }
      
      // Try direct courses array
      if (response.success && Array.isArray(response.data)) {
        console.log("✅ Found courses as direct array")
        return {
          courses: response.data,
          pagination: { current_page: 1, per_page: response.data.length, total_pages: 1, total_items: response.data.length, has_next: false, has_previous: false },
          filters_applied: {},
          sort_by: 'popularity'
        }
      }
      
      console.error("❌ Invalid response structure:", response)
      console.error("❌ Expected: response.data.courses, but got:", response.data)
      throw new Error("Invalid API response structure")
    },
    retry: false,
    refetchOnWindowFocus: false,
  })
}

// Fetch single course
export function useCourse(courseId: string) {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: async (): Promise<Course> => {
      const apiResponse = await apiClient.get<ApiCourseResponse>(`/courses/${courseId}`)
      
      // Handle the nested data structure
      if (apiResponse.success && apiResponse.data?.success && apiResponse.data?.data) {
        return apiResponse.data.data
      }
      
      throw new Error("Invalid API response structure")
    },
    enabled: !!courseId,
  })
}

// Enroll in course
export function useEnrollCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (courseId: string) => {
      const response = await apiClient.post(`/courses/${courseId}/enroll`)
      return response
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
      const apiResponse = await apiClient.get('/courses/enrolled')
      
      if (apiResponse.success && apiResponse.data?.success && apiResponse.data.data?.courses) {
        return apiResponse.data.data.courses
      }
      
      throw new Error('Failed to fetch enrolled courses')
    },
  })
}
