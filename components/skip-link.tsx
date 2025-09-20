"use client"

import { cn } from "@/lib/utils"

interface SkipLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export function SkipLink({ href, children, className }: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        // Base styles
        "absolute left-4 top-4 z-50",
        "px-4 py-2 rounded-md",
        "bg-primary text-primary-foreground",
        "font-medium text-sm",
        "border-2 border-primary",
        // Hidden by default, visible on focus
        "opacity-0 -translate-y-2 pointer-events-none",
        "focus:opacity-100 focus:translate-y-0 focus:pointer-events-auto",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        // Smooth transitions
        "transition-all duration-200 ease-in-out",
        // Ensure it's above everything
        "transform-gpu",
        className
      )}
      onFocus={(e) => {
        // Ensure the link is visible when focused
        e.currentTarget.style.opacity = "1"
        e.currentTarget.style.transform = "translateY(0)"
        e.currentTarget.style.pointerEvents = "auto"
      }}
      onBlur={(e) => {
        // Hide the link when focus is lost
        e.currentTarget.style.opacity = "0"
        e.currentTarget.style.transform = "translateY(-0.5rem)"
        e.currentTarget.style.pointerEvents = "none"
      }}
    >
      {children}
    </a>
  )
}

// Predefined skip links for common scenarios
export function SkipToMainContent({ className }: { className?: string }) {
  return (
    <SkipLink href="#main-content" className={className}>
      Chuyển đến nội dung chính
    </SkipLink>
  )
}

export function SkipToNavigation({ className }: { className?: string }) {
  return (
    <SkipLink href="#main-navigation" className={className}>
      Chuyển đến menu điều hướng
    </SkipLink>
  )
}

export function SkipToSearch({ className }: { className?: string }) {
  return (
    <SkipLink href="#search" className={className}>
      Chuyển đến tìm kiếm
    </SkipLink>
  )
}

export function SkipToFooter({ className }: { className?: string }) {
  return (
    <SkipLink href="#footer" className={className}>
      Chuyển đến footer
    </SkipLink>
  )
}

// Skip link container for multiple skip links
interface SkipLinksContainerProps {
  children: React.ReactNode
  className?: string
}

export function SkipLinksContainer({ children, className }: SkipLinksContainerProps) {
  return (
    <div 
      className={cn("sr-only focus-within:not-sr-only", className)}
      role="navigation"
      aria-label="Skip links"
    >
      {children}
    </div>
  )
}