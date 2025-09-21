"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMSWReady] = useState(false)
  const initRef = useRef(false)

  useEffect(() => {
    // Prevent double initialization during development hot reload
    if (initRef.current) return
    initRef.current = true

    const init = async () => {
      if (typeof window !== "undefined") {
        try {
          const { worker } = await import("./browser")
          await worker.start({
            onUnhandledRequest: "warn",
            serviceWorker: {
              url: "/mockServiceWorker.js",
            },
          })
          console.log("🎭 MSW service worker started successfully")
          console.log("🔗 API calls will be mocked. Set NEXT_PUBLIC_API_BASE_URL to real API URL to disable MSW")
          setMSWReady(true)
        } catch (error) {
          console.warn("Failed to start MSW service worker:", error)
          // Continue without MSW if it fails
          setMSWReady(true)
        }
      } else {
        // Server-side, just mark as ready
        setMSWReady(true)
      }
    }

    // Simple: If API_BASE_URL is set, use real API. Otherwise use MSW.
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    const useRealAPI = !!apiBaseUrl
    const shouldUseMSW = process.env.NODE_ENV === "development" && !useRealAPI

    if (shouldUseMSW) {
      console.log("🎭 Using Mock API (MSW)")
      console.log("🔧 MSW Provider initializing...")
      init()
    } else {
      console.log("🌐 Using Real API")
      console.log(`📡 API Base URL: ${apiBaseUrl}`)
      console.log("⚠️  MSW is disabled - API calls will go to real backend")
      setMSWReady(true)
    }
  }, [])

  if (!mswReady) {
    return <div>Loading...</div>
  }

  return <>{children}</>
}
