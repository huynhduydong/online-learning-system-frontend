'use client'

/**
 * Conditional Wrapper Component
 * Conditionally renders header and footer based on current route
 */

import { usePathname } from 'next/navigation'
import { AppHeader } from './app-header'
import { AppFooter } from './app-footer'

interface ConditionalWrapperProps {
    children: React.ReactNode
}

export function ConditionalWrapper({ children }: ConditionalWrapperProps) {
    const pathname = usePathname()

    // Routes that should have fullscreen layout (no header/footer)
    const fullscreenRoutes = [
        '/dashboard',
        '/studio',
        '/admin'
    ]

    // Check if current route should be fullscreen
    const isFullscreen = fullscreenRoutes.some(route =>
        pathname === route || pathname.startsWith(route + '/')
    )

    if (isFullscreen) {
        return <>{children}</>
    }

    return (
        <div className="flex min-h-screen flex-col">
            <AppHeader />
            <main className="flex-1" id="main-content">
                {children}
            </main>
            <AppFooter />
        </div>
    )
}
