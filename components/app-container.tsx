import { cn } from "@/lib/utils"

interface AppContainerProps {
  children: React.ReactNode
  className?: string
  size?: "sm" | "md" | "lg" | "xl" | "full"
  as?: React.ElementType
}

const sizeClasses = {
  sm: "max-w-3xl",
  md: "max-w-5xl", 
  lg: "max-w-7xl",
  xl: "max-w-screen-2xl",
  full: "max-w-none"
}

export function AppContainer({ 
  children, 
  className, 
  size = "lg",
  as: Component = "div"
}: AppContainerProps) {
  return (
    <Component 
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </Component>
  )
}