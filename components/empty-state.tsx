import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  BookOpen, 
  Search, 
  Users, 
  FileText, 
  ShoppingCart, 
  Heart, 
  Star,
  Inbox,
  FolderOpen,
  Image,
  Video,
  MessageSquare,
  Bell,
  Calendar,
  Settings
} from "lucide-react"

interface EmptyStateProps {
  icon?: keyof typeof iconMap
  title: string
  description?: string
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

const iconMap = {
  book: BookOpen,
  search: Search,
  users: Users,
  file: FileText,
  cart: ShoppingCart,
  heart: Heart,
  star: Star,
  inbox: Inbox,
  folder: FolderOpen,
  image: Image,
  video: Video,
  message: MessageSquare,
  bell: Bell,
  calendar: Calendar,
  settings: Settings
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

export function EmptyState({
  icon = "inbox",
  title,
  description,
  action,
  secondaryAction,
  className,
  size = "md",
  children
}: EmptyStateProps) {
  const IconComponent = iconMap[icon]
  const classes = sizeClasses[size]

  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center text-center",
        classes.container,
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className={cn("flex flex-col items-center", classes.spacing)}>
        {/* Icon */}
        <div className="flex items-center justify-center rounded-full bg-muted/50 p-4">
          <IconComponent 
            className={cn(classes.icon, "text-muted-foreground")}
            aria-hidden="true"
          />
        </div>

        {/* Content */}
        <div className={cn("space-y-2 max-w-md")}>
          <h3 className={classes.title}>
            {title}
          </h3>
          {description && (
            <p className={classes.description}>
              {description}
            </p>
          )}
        </div>

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

// Predefined empty states for common scenarios
export const EmptyStates = {
  NoCourses: (props: Partial<EmptyStateProps>) => (
    <EmptyState
      icon="book"
      title="Chưa có khóa học nào"
      description="Bạn chưa đăng ký khóa học nào. Hãy khám phá các khóa học thú vị của chúng tôi."
      {...props}
    />
  ),
  
  NoSearchResults: (props: Partial<EmptyStateProps>) => (
    <EmptyState
      icon="search"
      title="Không tìm thấy kết quả"
      description="Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm thấy những gì bạn đang tìm kiếm."
      {...props}
    />
  ),
  
  NoFavorites: (props: Partial<EmptyStateProps>) => (
    <EmptyState
      icon="heart"
      title="Chưa có khóa học yêu thích"
      description="Thêm các khóa học vào danh sách yêu thích để dễ dàng truy cập sau này."
      {...props}
    />
  ),
  
  NoNotifications: (props: Partial<EmptyStateProps>) => (
    <EmptyState
      icon="bell"
      title="Không có thông báo mới"
      description="Bạn đã xem hết tất cả thông báo. Chúng tôi sẽ thông báo khi có cập nhật mới."
      {...props}
    />
  ),
  
  NoMessages: (props: Partial<EmptyStateProps>) => (
    <EmptyState
      icon="message"
      title="Chưa có tin nhắn nào"
      description="Bắt đầu cuộc trò chuyện với giảng viên hoặc học viên khác."
      {...props}
    />
  ),
  
  NoFiles: (props: Partial<EmptyStateProps>) => (
    <EmptyState
      icon="folder"
      title="Chưa có tài liệu nào"
      description="Tài liệu khóa học sẽ xuất hiện ở đây khi giảng viên tải lên."
      {...props}
    />
  )
}