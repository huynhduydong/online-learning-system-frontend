"use client"

import { useAuthStore } from "@/stores/auth-store"
import { useMutation } from "@tanstack/react-query"

export function useAuth() {
  const { user, isAuthenticated, isLoading, login, logout, setUser, setLoading } = useAuthStore()

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      return login(email, password)
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // Call API to logout if needed
      await fetch("/api/auth/logout", { method: "POST" })
      logout()
    },
  })

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || loginMutation.isPending || logoutMutation.isPending,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    setUser,
    setLoading,
    loginError: loginMutation.error,
    logoutError: logoutMutation.error,
  }
}
