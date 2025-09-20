import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
  children?: React.ReactNode
}

export function Skeleton({ className, children, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted/50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface LoadingSkeletonProps {
  variant?: "card" | "list" | "table" | "profile" | "course" | "text" | "custom"
  count?: number
  className?: string
  children?: React.ReactNode
}

export function LoadingSkeleton({ 
  variant = "card", 
  count = 1, 
  className,
  children 
}: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case "card":
        return (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        )
      
      case "list":
        return (
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        )
      
      case "table":
        return (
          <div className="space-y-2">
            <div className="flex space-x-4">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        )
      
      case "profile":
        return (
          <div className="flex items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        )
      
      case "course":
        return (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </div>
        )
      
      case "text":
        return (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        )
      
      case "custom":
        return children
      
      default:
        return (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        )
    }
  }

  return (
    <div className={cn("space-y-4", className)} role="status" aria-label="Đang tải...">
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  )
}

// Predefined loading skeletons for common scenarios
export const LoadingSkeletons = {
  CourseCard: ({ count = 3, className }: { count?: number; className?: string }) => (
    <LoadingSkeleton variant="course" count={count} className={className} />
  ),
  
  CourseList: ({ count = 5, className }: { count?: number; className?: string }) => (
    <LoadingSkeleton variant="list" count={count} className={className} />
  ),
  
  UserProfile: ({ className }: { className?: string }) => (
    <LoadingSkeleton variant="profile" count={1} className={className} />
  ),
  
  DataTable: ({ rows = 5, className }: { rows?: number; className?: string }) => (
    <div className={cn("space-y-2", className)}>
      {/* Table Header */}
      <div className="flex space-x-4 p-4 border-b">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      {/* Table Rows */}
      <LoadingSkeleton variant="table" count={rows} className="p-4" />
    </div>
  ),
  
  PageContent: ({ className }: { className?: string }) => (
    <div className={cn("space-y-6", className)}>
      {/* Page Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      
      {/* Content Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LoadingSkeleton variant="card" count={6} />
      </div>
    </div>
  ),
  
  Sidebar: ({ className }: { className?: string }) => (
    <div className={cn("space-y-4", className)}>
      {/* Navigation Items */}
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="flex items-center space-x-3">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  ),
  
  ChatMessage: ({ count = 3, className }: { count?: number; className?: string }) => (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={index % 2 === 0 ? "flex justify-start" : "flex justify-end"}>
          <div className={cn(
            "max-w-xs space-y-2",
            index % 2 === 0 ? "items-start" : "items-end"
          )}>
            <div className="flex items-center space-x-2">
              {index % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full" />}
              <Skeleton className="h-4 w-16" />
              {index % 2 === 1 && <Skeleton className="h-8 w-8 rounded-full" />}
            </div>
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  ),
  
  VideoPlayer: ({ className }: { className?: string }) => (
    <div className={cn("space-y-4", className)}>
      <Skeleton className="h-64 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex items-center space-x-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  )
}