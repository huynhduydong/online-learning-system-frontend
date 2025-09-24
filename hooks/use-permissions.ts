'use client'

import { useMemo } from 'react'
import { 
  Permission, 
  PermissionContext, 
  PermissionResult, 
  User 
} from '@/lib/permissions/types'
import { 
  hasPermission, 
  hasPermissions, 
  canModifyOwnContent,
  canAccessCourse,
  canModerateCourse,
  PermissionHelpers
} from '@/lib/permissions/checker'

/**
 * Hook for checking user permissions
 */
export function usePermissions(user: User | null) {
  return useMemo(() => {
    if (!user) {
      return {
        hasPermission: () => ({ allowed: false, reason: 'User not authenticated' }),
        hasPermissions: () => ({ allowed: false, reason: 'User not authenticated' }),
        canModifyOwnContent: () => ({ allowed: false, reason: 'User not authenticated' }),
        canAccessCourse: () => ({ allowed: false, reason: 'User not authenticated' }),
        canModerateCourse: () => ({ allowed: false, reason: 'User not authenticated' }),
        helpers: {
          canCreateQuestion: () => ({ allowed: false, reason: 'User not authenticated' }),
          canEditQuestion: () => ({ allowed: false, reason: 'User not authenticated' }),
          canDeleteQuestion: () => ({ allowed: false, reason: 'User not authenticated' }),
          canAcceptAnswer: () => ({ allowed: false, reason: 'User not authenticated' }),
          canPinContent: () => ({ allowed: false, reason: 'User not authenticated' })
        }
      }
    }

    return {
      /**
       * Check single permission
       */
      hasPermission: (
        permission: Permission,
        context?: Partial<PermissionContext>
      ): PermissionResult => {
        const fullContext: PermissionContext = { user, ...context }
        return hasPermission(permission, fullContext)
      },

      /**
       * Check multiple permissions
       */
      hasPermissions: (
        permissions: Permission[],
        context?: Partial<PermissionContext>,
        requireAll: boolean = true
      ): PermissionResult => {
        const fullContext: PermissionContext = { user, ...context }
        return hasPermissions(permissions, fullContext, requireAll)
      },

      /**
       * Check if user can modify their own content
       */
      canModifyOwnContent: (
        contentAuthorId: string,
        permission: Permission
      ): PermissionResult => {
        return canModifyOwnContent(user, contentAuthorId, permission)
      },

      /**
       * Check course access
       */
      canAccessCourse: (courseId: string): PermissionResult => {
        return canAccessCourse(user, courseId)
      },

      /**
       * Check course moderation rights
       */
      canModerateCourse: (courseId: string): PermissionResult => {
        return canModerateCourse(user, courseId)
      },

      /**
       * Permission helpers for common UI scenarios
       */
      helpers: {
        canCreateQuestion: (courseId?: string) => 
          PermissionHelpers.canCreateQuestion(user, courseId),
        
        canEditQuestion: (questionAuthorId: string, hasAnswers: boolean) =>
          PermissionHelpers.canEditQuestion(user, questionAuthorId, hasAnswers),
        
        canDeleteQuestion: (questionAuthorId: string, hasAnswers: boolean) =>
          PermissionHelpers.canDeleteQuestion(user, questionAuthorId, hasAnswers),
        
        canAcceptAnswer: (questionAuthorId: string, courseId?: string) =>
          PermissionHelpers.canAcceptAnswer(user, questionAuthorId, courseId),
        
        canPinContent: (courseId?: string) =>
          PermissionHelpers.canPinContent(user, courseId)
      }
    }
  }, [user])
}

/**
 * Hook for checking specific permission with automatic context
 */
export function usePermission(
  permission: Permission,
  context?: Partial<PermissionContext>
) {
  const user = null // This should come from your auth context
  const permissions = usePermissions(user)
  
  return useMemo(() => {
    return permissions.hasPermission(permission, context)
  }, [permissions, permission, context])
}

/**
 * Hook for question-specific permissions
 */
export function useQuestionPermissions(
  user: User | null,
  question?: {
    id: string
    authorId: string
    courseId?: string
    hasAnswers: boolean
  }
) {
  const permissions = usePermissions(user)
  
  return useMemo(() => {
    if (!question) {
      return {
        canView: { allowed: false, reason: 'Question not found' },
        canEdit: { allowed: false, reason: 'Question not found' },
        canDelete: { allowed: false, reason: 'Question not found' },
        canPin: { allowed: false, reason: 'Question not found' },
        canClose: { allowed: false, reason: 'Question not found' },
        canAcceptAnswers: { allowed: false, reason: 'Question not found' }
      }
    }

    return {
      canView: permissions.hasPermission('question:read', {
        questionId: question.id,
        courseId: question.courseId
      }),
      
      canEdit: permissions.helpers.canEditQuestion(
        question.authorId,
        question.hasAnswers
      ),
      
      canDelete: permissions.helpers.canDeleteQuestion(
        question.authorId,
        question.hasAnswers
      ),
      
      canPin: permissions.helpers.canPinContent(question.courseId),
      
      canClose: permissions.hasPermission('question:close', {
        questionId: question.id,
        courseId: question.courseId
      }),
      
      canAcceptAnswers: permissions.helpers.canAcceptAnswer(
        question.authorId,
        question.courseId
      )
    }
  }, [permissions, question])
}

/**
 * Hook for answer-specific permissions
 */
export function useAnswerPermissions(
  user: User | null,
  answer?: {
    id: string
    authorId: string
    questionAuthorId: string
    courseId?: string
  }
) {
  const permissions = usePermissions(user)
  
  return useMemo(() => {
    if (!answer) {
      return {
        canView: { allowed: false, reason: 'Answer not found' },
        canEdit: { allowed: false, reason: 'Answer not found' },
        canDelete: { allowed: false, reason: 'Answer not found' },
        canAccept: { allowed: false, reason: 'Answer not found' },
        canPin: { allowed: false, reason: 'Answer not found' }
      }
    }

    return {
      canView: permissions.hasPermission('answer:read', {
        answerId: answer.id,
        courseId: answer.courseId
      }),
      
      canEdit: permissions.canModifyOwnContent(
        answer.authorId,
        'answer:update'
      ),
      
      canDelete: permissions.canModifyOwnContent(
        answer.authorId,
        'answer:delete'
      ),
      
      canAccept: permissions.helpers.canAcceptAnswer(
        answer.questionAuthorId,
        answer.courseId
      ),
      
      canPin: permissions.helpers.canPinContent(answer.courseId)
    }
  }, [permissions, answer])
}

/**
 * Hook for comment-specific permissions
 */
export function useCommentPermissions(
  user: User | null,
  comment?: {
    id: string
    authorId: string
    courseId?: string
  }
) {
  const permissions = usePermissions(user)
  
  return useMemo(() => {
    if (!comment) {
      return {
        canView: { allowed: false, reason: 'Comment not found' },
        canEdit: { allowed: false, reason: 'Comment not found' },
        canDelete: { allowed: false, reason: 'Comment not found' },
        canReport: { allowed: false, reason: 'Comment not found' }
      }
    }

    return {
      canView: permissions.hasPermission('comment:read', {
        commentId: comment.id,
        courseId: comment.courseId
      }),
      
      canEdit: permissions.canModifyOwnContent(
        comment.authorId,
        'comment:update'
      ),
      
      canDelete: permissions.canModifyOwnContent(
        comment.authorId,
        'comment:delete'
      ),
      
      canReport: permissions.hasPermission('moderate:manage_reports', {
        commentId: comment.id,
        courseId: comment.courseId
      })
    }
  }, [permissions, comment])
}

/**
 * Hook for role-based UI rendering
 */
export function useRoleBasedUI(user: User | null) {
  return useMemo(() => {
    if (!user) {
      return {
        isGuest: true,
        isStudent: false,
        isTA: false,
        isInstructor: false,
        isAdmin: false,
        canModerate: false,
        canAdminister: false
      }
    }

    return {
      isGuest: user.role === 'guest',
      isStudent: user.role === 'student',
      isTA: user.role === 'teaching_assistant',
      isInstructor: user.role === 'instructor',
      isAdmin: user.role === 'admin',
      canModerate: ['teaching_assistant', 'instructor', 'admin'].includes(user.role),
      canAdminister: user.role === 'admin'
    }
  }, [user])
}