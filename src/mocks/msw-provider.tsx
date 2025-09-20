"use client"

import type React from "react"

import { useEffect, useState } from "react"

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMSWReady] = useState(false)

  useEffect(() => {
    const init = async () => {
      if (typeof window !== "undefined") {
        const { worker } = await import("./browser")
        await worker.start({
          onUnhandledRequest: "bypass",
        })
        setMSWReady(true)
      }
    }

    // Temporarily disable MSW to fix SVG data URL error
    // if (process.env.NODE_ENV === "development") {
    //   init()
    // } else {
      setMSWReady(true)
    // }
  }, [])

  if (!mswReady) {
    return <div>Loading...</div>
  }

  return <>{children}</>
}
