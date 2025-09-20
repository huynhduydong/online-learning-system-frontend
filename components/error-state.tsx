import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  AlertTriangle, 
  XCircle, 
  Wifi, 
  Server, 
  Shield, 
  Clock,
  RefreshCw,
  Home,
  ArrowLeft,
  Bug,
  HelpCircle
} from "lucide-react"

interface ErrorStateProps {
  type?: "error" | "warning" | "network" | "server" | "forbidden" | "timeout" | "notFound"
  title?: string
  description?: string
  error?: Error | string
  showError?: boolean
  action?: {
    label: string
    onClick: () => void
    variant?: "default" | "outline" | "secondary" | "ghost" | "link"
  }
  secondaryAction?: {
    label: string
    onClick: () => void
    variant?: "default" | "outline" | "secondary" | "ghost" | "link"
  }
  className?: string
  size?: "sm" | "md" | "lg"
  children?: React.ReactNode
}

const errorTypeConfig = {
  error: {
    icon: XCircle,
    title: "Đã xảy ra lỗi",
    description: "Có lỗi không mong muốn xảy ra. Vui lòng thử lại sau.",
    iconColor: "text-destructive"
  },
  warning: {
    icon: AlertTriangle,
    title: "Cảnh báo",
    description: "Có vấn đề cần được chú ý.",
    iconColor: "text-warning"
  },
  network: {
    icon: Wifi,
    title: "Lỗi kết nối",
    description: "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet của bạn.",
    iconColor: "text-destructive"
  },
  server: {
    icon: Server,
    title: "Lỗi máy chủ",
    description: "Máy chủ đang gặp sự cố. Chúng tôi đang khắc phục vấn đề này.",
    iconColor: "text-destructive"
  },
  forbidden: {
    icon: Shield,
    title: "Không có quyền truy cập",
    description: "Bạn không có quyền truy cập vào tài nguyên này.",
    iconColor: "text-destructive"
  },
  timeout: {
    icon: Clock,
    title: "Hết thời gian chờ",
    description: "Yêu cầu mất quá nhiều thời gian để xử lý. Vui lòng thử lại.",
    iconColor: "text-warning"
  },
  notFound: {
    icon: HelpCircle,
    title: "Không tìm thấy",
    description: "Trang hoặc tài nguyên bạn đang tìm kiếm không tồn tại.",
    iconColor: "text-muted-foreground"
  }
}

const sizeClasses = {
  sm: {
    container: "py-8",
    icon: "h-12 w-12",
    title: "text-lg font-semibold",
    description: "text-sm text-muted-foreground",
    spacing: "space-y-3"
  },
  md: {
    container: "py-12",
    icon: "h-16 w-16",
    title: "text-xl font-semibold",
    description: "text-base text-muted-foreground",
    spacing: "space-y-4"
  },
  lg: {
    container: "py-16",
    icon: "h-20 w-20",
    title: "text-2xl font-semibold",
    description: "text-lg text-muted-foreground",
    spacing: "space-y-6"
  }
}

export function ErrorState({
  type = "error",
  title,
  description,
  error,
  showError = false,
  action,
  secondaryAction,
  className,
  size = "md",
  children
}: ErrorStateProps) {
  const config = errorTypeConfig[type]
  const IconComponent = config.icon
  const classes = sizeClasses[size]

  const displayTitle = title || config.title
  const displayDescription = description || config.description

  const errorMessage = error instanceof Error ? error.message : error

  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center text-center",
        classes.container,
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className={cn("flex flex-col items-center", classes.spacing)}>
        {/* Icon */}
        <div className="flex items-center justify-center rounded-full bg-muted/50 p-4">
          <IconComponent 
            className={cn(classes.icon, config.iconColor)}
            aria-hidden="true"
          />
        </div>

        {/* Content */}
        <div className={cn("space-y-2 max-w-md")}>
          <h3 className={classes.title}>
            {displayTitle}
          </h3>
          <p className={classes.description}>
            {displayDescription}
          </p>
        </div>

        {/* Error Details */}
        {showError && errorMessage && (
          <Alert className="max-w-md text-left">
            <Bug className="h-4 w-4" />
            <AlertDescription className="text-sm font-mono">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        {(action || secondaryAction) && (
          <div className="flex flex-col sm:flex-row gap-3">
            {action && (
              <Button
                onClick={action.onClick}
                variant={action.variant || "default"}
                className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                onClick={secondaryAction.onClick}
                variant={secondaryAction.variant || "outline"}
                className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}

        {/* Custom children */}
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

// Predefined error states for common scenarios
export const ErrorStates = {
  NetworkError: (props: Partial<ErrorStateProps>) => (
    <ErrorState
      type="network"
      action={{
        label: "Thử lại",
        onClick: () => window.location.reload(),
        variant: "default"
      }}
      {...props}
    />
  ),
  
  ServerError: (props: Partial<ErrorStateProps>) => (
    <ErrorState
      type="server"
      action={{
        label: "Làm mới trang",
        onClick: () => window.location.reload(),
        variant: "default"
      }}
      secondaryAction={{
        label: "Về trang chủ",
        onClick: () => window.location.href = "/",
        variant: "outline"
      }}
      {...props}
    />
  ),
  
  NotFound: (props: Partial<ErrorStateProps>) => (
    <ErrorState
      type="notFound"
      title="Trang không tồn tại"
      description="Trang bạn đang tìm kiếm có thể đã bị xóa hoặc không tồn tại."
      action={{
        label: "Về trang chủ",
        onClick: () => window.location.href = "/",
        variant: "default"
      }}
      secondaryAction={{
        label: "Quay lại",
        onClick: () => window.history.back(),
        variant: "outline"
      }}
      {...props}
    />
  ),
  
  Forbidden: (props: Partial<ErrorStateProps>) => (
    <ErrorState
      type="forbidden"
      action={{
        label: "Đăng nhập",
        onClick: () => window.location.href = "/login",
        variant: "default"
      }}
      secondaryAction={{
        label: "Về trang chủ",
        onClick: () => window.location.href = "/",
        variant: "outline"
      }}
      {...props}
    />
  ),
  
  LoadingTimeout: (props: Partial<ErrorStateProps>) => (
    <ErrorState
      type="timeout"
      action={{
        label: "Thử lại",
        onClick: () => window.location.reload(),
        variant: "default"
      }}
      {...props}
    />
  )
}