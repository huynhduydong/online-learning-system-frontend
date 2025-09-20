import { cn } from "@/lib/utils"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

interface BreadcrumbItem {
  title: string
  href?: string
}

interface PageHeadingProps {
  title: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
  children?: React.ReactNode
  className?: string
  size?: "sm" | "md" | "lg"
  align?: "left" | "center"
}

const sizeClasses = {
  sm: {
    title: "text-2xl font-bold",
    description: "text-base text-muted-foreground"
  },
  md: {
    title: "text-3xl font-bold",
    description: "text-lg text-muted-foreground"
  },
  lg: {
    title: "text-4xl font-bold",
    description: "text-xl text-muted-foreground"
  }
}

export function PageHeading({
  title,
  description,
  breadcrumbs,
  children,
  className,
  size = "md",
  align = "left"
}: PageHeadingProps) {
  const alignClasses = align === "center" ? "text-center" : "text-left"

  return (
    <div className={cn("space-y-4", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {item.href ? (
                    <BreadcrumbLink 
                      href={item.href}
                      className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                    >
                      {item.title}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.title}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      {/* Header Content */}
      <div className={cn("space-y-2", alignClasses)}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <h1 
              className={cn(
                sizeClasses[size].title,
                "tracking-tight"
              )}
            >
              {title}
            </h1>
            {description && (
              <p className={cn(sizeClasses[size].description, "max-w-3xl")}>
                {description}
              </p>
            )}
          </div>
          
          {/* Action buttons or additional content */}
          {children && (
            <div className="flex-shrink-0">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}