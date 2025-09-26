'use client'

import React from 'react'
import { Permission, PermissionContext, User } from '@/lib/permissions/types'
import { usePermissions } from '@/hooks/use-permissions'

interface PermissionGuardProps {
  children: React.ReactNode
  permission: Permission | Permission[]
  context?: Partial<PermissionContext>
  requireAll?: boolean
  fallback?: React.ReactNode
  user?: User | null
}

/**
 * Component that conditionally renders children based on user permissions
 */
export function PermissionGuard({
  children,
  permission,
  context,
  requireAll = true,
  fallback = null,
  user
}: PermissionGuardProps) {
  const permissions = usePermissions(user)
  
  const hasAccess = React.useMemo(() => {
    if (Array.isArray(permission)) {
      return permissions.hasPermissions(permission, context, requireAll)
    } else {
      return permissions.hasPermission(permission, context)
    }
  }, [permissions, permission, context, requireAll])
  
  if (!hasAccess.allowed) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: string[]
  fallback?: React.ReactNode
  user?: User | null
}

/**
 * Component that conditionally renders children based on user role
 */
export function RoleGuard({
  children,
  allowedRoles,
  fallback = null,
  user
}: RoleGuardProps) {
  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

interface OwnershipGuardProps {
  children: React.ReactNode
  contentAuthorId: string
  permission: Permission
  fallback?: React.ReactNode
  user?: User | null
}

/**
 * Component that conditionally renders children based on content ownership
 */
export function OwnershipGuard({
  children,
  contentAuthorId,
  permission,
  fallback = null,
  user
}: OwnershipGuardProps) {
  const permissions = usePermissions(user)
  
  const canModify = React.useMemo(() => {
    return permissions.canModifyOwnContent(contentAuthorId, permission)
  }, [permissions, contentAuthorId, permission])
  
  if (!canModify.allowed) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

interface CourseGuardProps {
  children: React.ReactNode
  courseId: string
  requireModeration?: boolean
  fallback?: React.ReactNode
  user?: User | null
}

/**
 * Component that conditionally renders children based on course access
 */
export function CourseGuard({
  children,
  courseId,
  requireModeration = false,
  fallback = null,
  user
}: CourseGuardProps) {
  const permissions = usePermissions(user)
  
  const hasAccess = React.useMemo(() => {
    if (requireModeration) {
      return permissions.canModerateCourse(courseId)
    } else {
      return permissions.canAccessCourse(courseId)
    }
  }, [permissions, courseId, requireModeration])
  
  if (!hasAccess.allowed) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

// Higher-order component for permission checking
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  permission: Permission | Permission[],
  context?: Partial<PermissionContext>,
  requireAll?: boolean
) {
  return function PermissionWrappedComponent(props: P & { user?: User | null }) {
    const { user, ...componentProps } = props
    
    return (
      <PermissionGuard
        permission={permission}
        context={context}
        requireAll={requireAll}
        user={user}
      >
        <Component {...(componentProps as P)} />
      </PermissionGuard>
    )
  }
}

// Higher-order component for role checking
export function withRole<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: string[]
) {
  return function RoleWrappedComponent(props: P & { user?: User | null }) {
    const { user, ...componentProps } = props
    
    return (
      <RoleGuard allowedRoles={allowedRoles} user={user}>
        <Component {...(componentProps as P)} />
      </RoleGuard>
    )
  }
}

// Utility components for common permission scenarios
export const StudentOnly = ({ children, user }: { children: React.ReactNode; user?: User | null }) => (
  <RoleGuard allowedRoles={['student']} user={user}>
    {children}
  </RoleGuard>
)

export const ModeratorOnly = ({ children, user }: { children: React.ReactNode; user?: User | null }) => (
  <RoleGuard allowedRoles={['teaching_assistant', 'instructor', 'admin']} user={user}>
    {children}
  </RoleGuard>
)

export const InstructorOnly = ({ children, user }: { children: React.ReactNode; user?: User | null }) => (
  <RoleGuard allowedRoles={['instructor', 'admin']} user={user}>
    {children}
  </RoleGuard>
)

export const AdminOnly = ({ children, user }: { children: React.ReactNode; user?: User | null }) => (
  <RoleGuard allowedRoles={['admin']} user={user}>
    {children}
  </RoleGuard>
)

// Permission-aware button component
interface PermissionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  permission: Permission | Permission[]
  context?: Partial<PermissionContext>
  requireAll?: boolean
  user?: User | null
  disabledMessage?: string
}

export function PermissionButton({
  children,
  permission,
  context,
  requireAll = true,
  user,
  disabledMessage = 'You do not have permission to perform this action',
  ...buttonProps
}: PermissionButtonProps) {
  const permissions = usePermissions(user)
  
  const hasAccess = React.useMemo(() => {
    if (Array.isArray(permission)) {
      return permissions.hasPermissions(permission, context, requireAll)
    } else {
      return permissions.hasPermission(permission, context)
    }
  }, [permissions, permission, context, requireAll])
  
  return (
    <button
      {...buttonProps}
      disabled={!hasAccess.allowed || buttonProps.disabled}
      title={!hasAccess.allowed ? disabledMessage : buttonProps.title}
    >
      {children}
    </button>
  )
}