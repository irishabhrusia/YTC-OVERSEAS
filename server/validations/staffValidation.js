const { z } = require('zod');

const createStaffSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Please enter a valid email address'),
  role: z.enum(['super_admin', 'counsellor', 'editor']).default('counsellor'),
  password: z.string().optional(),
});

const updateStaffSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  role: z.enum(['super_admin', 'counsellor', 'editor']).optional(),
  isActive: z.boolean().optional(),
});

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

const changePasswordSchema = z.object({
  currentPassword: z.string({ required_error: 'Current password is required' }).min(1, 'Current password is required'),
  newPassword: z
    .string({ required_error: 'New password is required' })
    .min(10, 'New password must be at least 10 characters long')
    .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

module.exports = {
  createStaffSchema,
  updateStaffSchema,
  resetPasswordSchema,
  changePasswordSchema,
};

