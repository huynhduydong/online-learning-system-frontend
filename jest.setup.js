"use client"

import "@testing-library/jest-dom"
import jest from "jest"

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return ""
  },
}))

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key) => key,
  useLocale: () => "vi",
}))

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = "http://localhost:3000/api"
process.env.NEXT_PUBLIC_APP_NAME = "Online Learning System"
