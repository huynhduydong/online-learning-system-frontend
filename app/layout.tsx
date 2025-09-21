import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { SkipLinksContainer, SkipToMainContent, SkipToNavigation, SkipToSearch } from "@/components/skip-link"
import { AppHeader } from "@/components/app-header"
import { AppFooter } from "@/components/app-footer"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "Online Learning System",
  description: "Comprehensive online learning platform for students and instructors",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className={`${inter.variable} ${jetbrainsMono.variable}`} lang="vi" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <SkipLinksContainer>
            <SkipToMainContent />
            <SkipToNavigation />
            <SkipToSearch />
          </SkipLinksContainer>
          <div className="flex min-h-screen flex-col">
            <AppHeader />
            <main className="flex-1" id="main-content">
              {children}
            </main>
            <AppFooter />
          </div>
        </Providers>
      </body>
    </html>
  )
}
