import { renderHook, act } from "@testing-library/react"
import { useAuthStore } from "@/stores/auth-store"
import jest from "jest" // Declare the jest variable

// Mock fetch
global.fetch = jest.fn()

describe("Auth Store", () => {
  beforeEach(() => {
    // Reset store state
    useAuthStore.getState().logout()
    jest.clearAllMocks()
  })

  it("should have initial state", () => {
    const { result } = renderHook(() => useAuthStore())

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isLoading).toBe(false)
  })

  it("should handle successful login", async () => {
    const mockUser = {
      id: "1",
      email: "test@example.com",
      name: "Test User",
      role: "student" as const,
    }
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    })

    const { result } = renderHook(() => useAuthStore())

    await act(async () => {
      await result.current.login("test@example.com", "password")
    })

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.isLoading).toBe(false)
  })

  it("should handle logout", () => {
    const { result } = renderHook(() => useAuthStore())

    // Set initial authenticated state
    act(() => {
      result.current.setUser({
        id: "1",
        email: "test@example.com",
        name: "Test User",
        role: "student",
      })
    })

    expect(result.current.isAuthenticated).toBe(true)

    // Logout
    act(() => {
      result.current.logout()
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })
})
