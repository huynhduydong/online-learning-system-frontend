import { 
  Permission, 
  PermissionContext, 
  PermissionResult, 
  ROLE_PERMISSIONS, 
  PERMISSION_RULES,
  UserRole,
  User
} from './types'

/**
 * Check if a user has a specific permission
 */
export function hasPermission(
  permission: Permission,
  context: PermissionContext
): PermissionResult {
  const { user } = context
  
  // Check if user is active
  if (!user.isActive) {
    return {
      allowed: false,
      reason: 'User account is inactive'
    }
  }
  
  // Get base permissions for user role
  const rolePermissions = ROLE_PERMISSIONS[user.role] || []
  
  // Check if permission is in role permissions
  if (!rolePermissions.includes(permission)) {
    return {
      allowed: false,
      reason: `Role '${user.role}' does not have permission '${permission}'`
    }
  }
  
  // Check context-specific rules
  const rule = PERMISSION_RULES.find(r => r.permission === permission)
  if (rule) {
    return rule.check(context)
  }
  
  return { allowed: true }
}

/**
 * Check multiple permissions at once
 */
export function hasPermissions(
  permissions: Permission[],
  context: PermissionContext,
  requireAll: boolean = true
): PermissionResult {
  const results = permissions.map(permission => 
    hasPermission(permission, context)
  )
  
  if (requireAll) {
    const failedResult = results.find(result => !result.allowed)
    if (failedResult) {
      return failedResult
    }
    return { allowed: true }
  } else {
    const successResult = results.find(result => result.allowed)
    if (successResult) {
      return { allowed: true }
    }
    return {
      allowed: false,
      reason: 'User does not have any of the required permissions'
    }
  }
}

/**
 * Check if user can perform action on their own content
 */
export function canModifyOwnContent(
  user: User,
  contentAuthorId: string,
  permission: Permission
): PermissionResult {
  // Check if user owns the content
  if (user.id !== contentAuthorId) {
    return {
      allowed: false,
      reason: 'User can only modify their own content'
    }
  }
  
  // Check if user has the permission
  return hasPermission(permission, { user })
}

/**
 * Check if user can access course-related content
 */
export function canAccessCourse(
  user: User,
  courseId: string
): PermissionResult {
  // Admin can access all courses
  if (user.role === 'admin') {
    return { allowed: true }
  }
  
  // Check if user is enrolled, instructing, or assisting in the course
  const hasAccess = 
    user.enrolledCourses?.includes(courseId) ||
    user.instructingCourses?.includes(courseId) ||
    user.assistingCourses?.includes(courseId)
  
  if (!hasAccess) {
    return {
      allowed: false,
      reason: 'User does not have access to this course'
    }
  }
  
  return { allowed: true }
}

/**
 * Check if user can moderate content in a course
 */
export function canModerateCourse(
  user: User,
  courseId: string
): PermissionResult {
  // Admin can moderate all courses
  if (user.role === 'admin') {
    return { allowed: true }
  }
  
  // Check if user is instructor or TA for the course
  const canModerate = 
    user.instructingCourses?.includes(courseId) ||
    user.assistingCourses?.includes(courseId)
  
  if (!canModerate) {
    return {
      allowed: false,
      reason: 'User cannot moderate this course'
    }
  }
  
  return { allowed: true }
}

/**
 * Get all permissions for a user role
 */
export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || []
}

/**
 * Check if role has higher privileges than another role
 */
export function hasHigherPrivileges(role1: UserRole, role2: UserRole): boolean {
  const hierarchy: Record<UserRole, number> = {
    guest: 0,
    student: 1,
    teaching_assistant: 2,
    instructor: 3,
    admin: 4
  }
  
  return hierarchy[role1] > hierarchy[role2]
}

/**
 * Filter content based on user permissions
 */
export function filterByPermission<T extends { authorId: string; courseId?: string }>(
  items: T[],
  user: User,
  permission: Permission
): T[] {
  return items.filter(item => {
    const context: PermissionContext = {
      user,
      courseId: item.courseId
    }
    
    const result = hasPermission(permission, context)
    
    // For read permissions, also check course access
    if (permission.includes('read') && item.courseId) {
      const courseAccess = canAccessCourse(user, item.courseId)
      return result.allowed && courseAccess.allowed
    }
    
    return result.allowed
  })
}

/**
 * Permission-based UI helpers
 */
export const PermissionHelpers = {
  /**
   * Check if user can create questions
   */
  canCreateQuestion: (user: User, courseId?: string): PermissionResult => {
    const context: PermissionContext = { user, courseId }
    
    if (courseId) {
      const courseAccess = canAccessCourse(user, courseId)
      if (!courseAccess.allowed) return courseAccess
    }
    
    return hasPermission('question:create', context)
  },
  
  /**
   * Check if user can edit a question
   */
  canEditQuestion: (user: User, questionAuthorId: string, hasAnswers: boolean): PermissionResult => {
    const context: PermissionContext = { user }
    
    // Check basic permission
    const basePermission = hasPermission('question:update', context)
    if (!basePermission.allowed) return basePermission
    
    // Students can only edit their own questions without answers
    if (user.role === 'student') {
      if (user.id !== questionAuthorId) {
        return {
          allowed: false,
          reason: 'Students can only edit their own questions'
        }
      }
      
      if (hasAnswers) {
        return {
          allowed: false,
          reason: 'Cannot edit questions that already have answers'
        }
      }
    }
    
    return { allowed: true }
  },
  
  /**
   * Check if user can delete a question
   */
  canDeleteQuestion: (user: User, questionAuthorId: string, hasAnswers: boolean): PermissionResult => {
    const context: PermissionContext = { user }
    
    // Check basic permission
    const basePermission = hasPermission('question:delete', context)
    if (!basePermission.allowed) return basePermission
    
    // Students can only delete their own questions without answers
    if (user.role === 'student') {
      if (user.id !== questionAuthorId) {
        return {
          allowed: false,
          reason: 'Students can only delete their own questions'
        }
      }
      
      if (hasAnswers) {
        return {
          allowed: false,
          reason: 'Cannot delete questions that have answers'
        }
      }
    }
    
    return { allowed: true }
  },
  
  /**
   * Check if user can accept an answer
   */
  canAcceptAnswer: (user: User, questionAuthorId: string, courseId?: string): PermissionResult => {
    const context: PermissionContext = { user, courseId }
    
    // Check basic permission
    const basePermission = hasPermission('answer:accept', context)
    if (!basePermission.allowed) return basePermission
    
    // Question author can always accept answers
    if (user.id === questionAuthorId) {
      return { allowed: true }
    }
    
    // Instructors and TAs can accept answers in their courses
    if (['instructor', 'teaching_assistant'].includes(user.role) && courseId) {
      return canModerateCourse(user, courseId)
    }
    
    return {
      allowed: false,
      reason: 'Only question author or course moderators can accept answers'
    }
  },
  
  /**
   * Check if user can pin content
   */
  canPinContent: (user: User, courseId?: string): PermissionResult => {
    const context: PermissionContext = { user, courseId }
    
    // Check basic permission
    const basePermission = hasPermission('question:pin', context)
    if (!basePermission.allowed) return basePermission
    
    // Check course moderation rights
    if (courseId) {
      return canModerateCourse(user, courseId)
    }
    
    return { allowed: true }
  }
}