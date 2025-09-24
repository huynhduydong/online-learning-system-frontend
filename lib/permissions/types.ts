// Permission system types for Q&A system

export type UserRole = 
  | 'student'           // Học viên
  | 'instructor'        // Giảng viên
  | 'teaching_assistant' // Trợ giảng
  | 'admin'             // Quản trị hệ thống
  | 'guest'             // Khách truy cập

export type Permission = 
  // Question permissions
  | 'question:create'
  | 'question:read'
  | 'question:update'
  | 'question:delete'
  | 'question:pin'
  | 'question:close'
  | 'question:merge'
  | 'question:change_status'
  | 'question:manage_tags'
  
  // Answer permissions
  | 'answer:create'
  | 'answer:read'
  | 'answer:update'
  | 'answer:delete'
  | 'answer:accept'
  | 'answer:pin'
  
  // Comment permissions
  | 'comment:create'
  | 'comment:read'
  | 'comment:update'
  | 'comment:delete'
  
  // Vote permissions
  | 'vote:question'
  | 'vote:answer'
  | 'vote:comment'
  
  // Moderation permissions
  | 'moderate:hide_content'
  | 'moderate:ban_user'
  | 'moderate:manage_reports'
  
  // Admin permissions
  | 'admin:manage_users'
  | 'admin:manage_courses'
  | 'admin:view_analytics'
  | 'admin:system_config'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  isActive: boolean
  enrolledCourses?: string[]
  instructingCourses?: string[]
  assistingCourses?: string[]
}

export interface PermissionContext {
  user: User
  questionId?: string
  answerId?: string
  commentId?: string
  courseId?: string
  lessonId?: string
  targetUserId?: string
}

export interface RolePermissions {
  [key: string]: Permission[]
}

// Define base permissions first
const GUEST_PERMISSIONS: Permission[] = [
  'question:read',
  'answer:read',
  'comment:read'
]

const STUDENT_PERMISSIONS: Permission[] = [
  // Question permissions
  'question:create',
  'question:read',
  'question:update', // Own questions only
  'question:delete', // Own questions only (when no answers)
  
  // Answer permissions
  'answer:create',
  'answer:read',
  'answer:update', // Own answers only
  'answer:delete', // Own answers only
  'answer:accept', // Own questions only
  
  // Comment permissions
  'comment:create',
  'comment:read',
  'comment:update', // Own comments only
  'comment:delete', // Own comments only
  
  // Vote permissions
  'vote:question',
  'vote:answer',
  'vote:comment'
]

const TEACHING_ASSISTANT_PERMISSIONS: Permission[] = [
  // All student permissions
  ...STUDENT_PERMISSIONS,
  
  // Additional TA permissions
  'question:pin',
  'question:close',
  'question:change_status',
  'question:manage_tags',
  'answer:pin',
  'answer:accept', // For course questions
  'moderate:hide_content'
]

const INSTRUCTOR_PERMISSIONS: Permission[] = [
  // All TA permissions
  ...TEACHING_ASSISTANT_PERMISSIONS,
  
  // Additional instructor permissions
  'question:merge',
  'moderate:ban_user',
  'moderate:manage_reports'
]

const ADMIN_PERMISSIONS: Permission[] = [
  // All permissions
  'question:create',
  'question:read',
  'question:update',
  'question:delete',
  'question:pin',
  'question:close',
  'question:merge',
  'question:change_status',
  'question:manage_tags',
  'answer:create',
  'answer:read',
  'answer:update',
  'answer:delete',
  'answer:accept',
  'answer:pin',
  'comment:create',
  'comment:read',
  'comment:update',
  'comment:delete',
  'vote:question',
  'vote:answer',
  'vote:comment',
  'moderate:hide_content',
  'moderate:ban_user',
  'moderate:manage_reports',
  'admin:manage_users',
  'admin:manage_courses',
  'admin:view_analytics',
  'admin:system_config'
]

// Role-based permissions mapping
export const ROLE_PERMISSIONS: RolePermissions = {
  guest: GUEST_PERMISSIONS,
  student: STUDENT_PERMISSIONS,
  teaching_assistant: TEACHING_ASSISTANT_PERMISSIONS,
  instructor: INSTRUCTOR_PERMISSIONS,
  admin: ADMIN_PERMISSIONS
}

// Permission check result
export interface PermissionResult {
  allowed: boolean
  reason?: string
}

// Context-specific permission rules
export interface PermissionRule {
  permission: Permission
  check: (context: PermissionContext) => PermissionResult
}

// Special conditions for permissions
export const PERMISSION_RULES: PermissionRule[] = [
  // Students can only edit/delete their own questions when no answers exist
  {
    permission: 'question:update',
    check: (context) => {
      if (context.user.role === 'student') {
        // Check if user owns the question and it has no answers
        // This would need to be implemented with actual data
        return { allowed: true } // Simplified for now
      }
      return { allowed: true }
    }
  },
  
  // Students can only delete questions with no answers
  {
    permission: 'question:delete',
    check: (context) => {
      if (context.user.role === 'student') {
        // Check if user owns the question and it has no answers
        return { allowed: true } // Simplified for now
      }
      return { allowed: true }
    }
  },
  
  // Only question author can accept answers for their questions
  {
    permission: 'answer:accept',
    check: (context) => {
      if (context.user.role === 'student') {
        // Check if user owns the question
        return { allowed: true } // Simplified for now
      }
      return { allowed: true }
    }
  },
  
  // Course-specific permissions for instructors/TAs
  {
    permission: 'question:pin',
    check: (context) => {
      if (['instructor', 'teaching_assistant'].includes(context.user.role)) {
        // Check if user has access to the course
        return { allowed: true } // Simplified for now
      }
      return { allowed: true }
    }
  }
]

// Permission levels for UI display
export enum PermissionLevel {
  NONE = 0,
  READ = 1,
  WRITE = 2,
  MODERATE = 3,
  ADMIN = 4
}

export const getPermissionLevel = (role: UserRole): PermissionLevel => {
  switch (role) {
    case 'guest':
      return PermissionLevel.READ
    case 'student':
      return PermissionLevel.WRITE
    case 'teaching_assistant':
      return PermissionLevel.MODERATE
    case 'instructor':
      return PermissionLevel.MODERATE
    case 'admin':
      return PermissionLevel.ADMIN
    default:
      return PermissionLevel.NONE
  }
}