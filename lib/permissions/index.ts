// Permission system exports
export * from './types'
export * from './checker'

// Re-export commonly used types and functions
export type {
  UserRole,
  Permission,
  User,
  PermissionContext,
  PermissionResult,
  RolePermissions
} from './types'

export {
  hasPermission,
  hasPermissions,
  canModifyOwnContent,
  canAccessCourse,
  canModerateCourse,
  getRolePermissions,
  hasHigherPrivileges,
  filterByPermission,
  PermissionHelpers
} from './checker'

export {
  ROLE_PERMISSIONS,
  PERMISSION_RULES,
  PermissionLevel,
  getPermissionLevel
} from './types'