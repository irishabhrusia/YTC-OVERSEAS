const { z } = require('zod');

const jobSchema = z
  .object({
    title: z.string().trim().min(2).max(200),
    slug: z.string().trim().min(2).max(200).optional(),
    category: z.string().trim().min(1).max(100).optional().default('Other'),
    country: z.string().trim().min(2).max(100),
    city: z.string().trim().optional(),
    salaryRange: z.string().trim().optional(),
    experienceRequired: z.string().trim().optional(),
    description: z.string().trim().optional(),
    requirements: z.any().optional(),
    benefits: z.any().optional(),
    openings: z.any().optional(),
    deadline: z.string().optional(),
    isOpen: z.boolean().optional(),
    order: z.number().int().optional(),
    isActive: z.boolean().optional(),
    type: z.string().optional(),
  })
  .passthrough();

const jobApplicationSchema = z.object({
  job: z.string().optional(),
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(20),
  email: z.string().trim().email().optional().or(z.literal('')),
  currentCity: z.string().trim().optional(),
  jobCategory: z.string().trim().optional(),
  preferredCountry: z.string().trim().optional(),
  experience: z.string().trim().optional(),
  message: z.string().trim().max(2000).optional(),
  website: z.string().optional(), // honeypot
});

const updateJobApplicationSchema = z.object({
  status: z
    .enum(['received', 'pending', 'reviewed', 'shortlisted', 'interview', 'rejected', 'placed', 'hired'])
    .optional(),
  note: z.string().trim().max(1000).optional(),
  assignedTo: z.string().optional(),
});

module.exports = {
  jobSchema,
  jobApplicationSchema,
  updateJobApplicationSchema,
};

