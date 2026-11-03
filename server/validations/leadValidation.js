const { z } = require('zod');

// Phone validation helper (10 to 15 digits, allowing +, spaces, dashes, parentheses)
const phoneSchema = z
  .string({ required_error: 'Phone number is required' })
  .trim()
  .min(1, 'Phone number is required')
  .refine(
    (val) => {
      const allowedChars = /^[0-9+\s\-()]+$/.test(val);
      const digits = val.replace(/\D/g, '');
      return allowedChars && digits.length >= 10 && digits.length <= 15;
    },
    { message: 'Phone must contain 10 to 15 digits (plus, spaces, dashes allowed)' }
  );

// Email validation helper (valid format if provided)
const emailSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (val) => {
      if (!val || val.length === 0) return true;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    },
    { message: 'Please provide a valid email address' }
  );

// Schema for POST /api/leads
const createLeadSchema = z
  .object({
    // Honeypot field
    website: z.string().optional(),

    type: z.enum(
      [
        'consultation',
        'contact',
        'eligibility',
        'job_application',
        'employer_inquiry',
      ],
      {
        required_error: 'Lead type is required',
        invalid_type_error: 'Invalid lead type',
      }
    ),

    name: z
      .string({ required_error: 'Name is required' })
      .trim()
      .min(2, 'Name must be between 2 and 100 characters')
      .max(100, 'Name must be between 2 and 100 characters'),

    phone: phoneSchema,

    email: emailSchema,

    country: z.string().trim().max(100).optional(),
    course: z.string().trim().max(100).optional(),
    degreeLevel: z.string().trim().max(100).optional(),
    preferredCallTime: z.string().trim().max(100).optional(),
    jobCategory: z.string().trim().max(100).optional(),
    preferredCountry: z.string().trim().max(100).optional(),
    experience: z.string().trim().max(100).optional(),
    currentCity: z.string().trim().max(100).optional(),

    companyName: z.string().trim().max(150).optional(),
    positionsNeeded: z.string().trim().max(300).optional(),
    workersCount: z.string().trim().max(100).optional(),

    message: z
      .string()
      .trim()
      .max(2000, 'Message cannot exceed 2000 characters')
      .optional(),

    sourcePage: z.string().trim().max(200).optional(),
    status: z
      .enum(['new', 'contacted', 'in_progress', 'converted', 'closed'])
      .optional(),
    assignedTo: z.string().trim().max(100).optional(),
  })
  .strict(); // Rejects unknown fields

// Schema for PATCH /api/leads/:id
const updateLeadSchema = z
  .object({
    status: z
      .enum(['new', 'contacted', 'in_progress', 'converted', 'closed'], {
        invalid_type_error: 'Invalid status value',
      })
      .optional(),

    note: z
      .string()
      .trim()
      .min(1, 'Note cannot be empty')
      .max(2000, 'Note cannot exceed 2000 characters')
      .optional(),

    assignedTo: z.string().trim().max(100).optional(),
  })
  .strict(); // Rejects unknown fields

module.exports = {
  createLeadSchema,
  updateLeadSchema,
};

