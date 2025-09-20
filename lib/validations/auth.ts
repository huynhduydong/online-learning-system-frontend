/**
 * Authentication Form Validation Schemas
 * Zod schemas for login and registration forms
 */

import { z } from 'zod'
import { config } from '@/lib/config'

// Base email validation
const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(255, 'Email must be less than 255 characters')

// Password validation based on config
const passwordSchema = z
  .string()
  .min(config.validation.password.minLength, `Password must be at least ${config.validation.password.minLength} characters`)
  .max(128, 'Password must be less than 128 characters')
  .refine(
    (password) => {
      if (!config.validation.password.requireUppercase) return true
      return /[A-Z]/.test(password)
    },
    'Password must contain at least one uppercase letter'
  )
  .refine(
    (password) => {
      if (!config.validation.password.requireLowercase) return true
      return /[a-z]/.test(password)
    },
    'Password must contain at least one lowercase letter'
  )
  .refine(
    (password) => {
      if (!config.validation.password.requireNumber) return true
      return /\d/.test(password)
    },
    'Password must contain at least one number'
  )

// Name validation
const nameSchema = z
  .string()
  .min(config.validation.name.minLength, `Name must be at least ${config.validation.name.minLength} characters`)
  .max(50, 'Tên phải ít hơn 50 ký tự')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')

// Login form schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  remember_me: z.boolean().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>

// Registration form schema
export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    first_name: nameSchema,
    last_name: nameSchema,
    role: z.enum(['student', 'instructor']).default('student'),
    terms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }
  )

export type RegisterFormData = z.infer<typeof registerSchema>

// Password reset request schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

// Password reset schema
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }
  )

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

// Email confirmation resend schema
export const resendConfirmationSchema = z.object({
  email: emailSchema,
})

export type ResendConfirmationFormData = z.infer<typeof resendConfirmationSchema>

// Profile update schema
export const updateProfileSchema = z.object({
  first_name: nameSchema,
  last_name: nameSchema,
})

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>

// Change password schema
export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, 'Current password is required'),
    new_password: passwordSchema,
    confirm_password: z.string().min(1, 'Please confirm your new password'),
  })
  .refine(
    (data) => data.new_password === data.confirm_password,
    {
      message: 'Passwords do not match',
      path: ['confirm_password'],
    }
  )
  .refine(
    (data) => data.current_password !== data.new_password,
    {
      message: 'New password must be different from current password',
      path: ['new_password'],
    }
  )

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>