const { z } = require('zod');

const loginSchema = z
  .object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, 'Password is required'),
  })
  .strict();

const forgotPasswordSchema = z
  .object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
  })
  .strict();

const resetPasswordSchema = z
  .object({
    token: z.string({ required_error: 'Token is required' }).min(1, 'Token is required'),
    newPassword: z
      .string({ required_error: 'New password is required' })
      .min(10, 'Password must be at least 10 characters long')
      .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
  })
  .strict();

const changePasswordSchema = z
  .object({
    currentPassword: z.string({ required_error: 'Current password is required' }).min(1, 'Current password is required'),
    newPassword: z
      .string({ required_error: 'New password is required' })
      .min(10, 'Password must be at least 10 characters long')
      .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
  })
  .strict();

module.exports = {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
};

