const { z } = require('zod');

// Country Schema
const countrySchema = z
  .object({
    slug: z.string().trim().min(2).max(100),
    name: z.string().trim().min(2).max(150),
    shortName: z.string().trim().max(50).optional(),
    code: z.string().trim().max(10).optional(),
    flag: z.string().optional(),
    flagPath: z.string().trim().optional(),
    heroImage: z.string().trim().optional(),
    heroAlt: z.string().trim().optional(),
    accentColor: z.string().trim().optional(),
    badge: z.string().trim().optional(),
    headline: z.string().trim().optional(),
    description: z.string().trim().optional(),
    quickFacts: z
      .object({
        capital: z.string().optional(),
        currency: z.string().optional(),
        intakes: z.string().optional(),
        majorIntakes: z.string().optional(),
        avgTuition: z.string().optional(),
        averageTuition: z.string().optional(),
        livingExpenses: z.string().optional(),
        visaProcessing: z.string().optional(),
        visaType: z.string().optional(),
      })
      .optional(),
    stats: z
      .array(
        z.object({
          _id: z.any().optional(),
          value: z.string().optional(),
          label: z.string().optional(),
        })
      )
      .optional(),
    whyStudy: z
      .array(
        z.object({
          _id: z.any().optional(),
          title: z.string().optional(),
          desc: z.string().optional(),
        })
      )
      .optional(),
    topUniversities: z.any().optional(),
    popularPrograms: z.array(z.string()).optional(),
    visaRequirements: z.array(z.string()).optional(),
    scholarships: z.any().optional(),
    faqs: z.any().optional(),
    seoTitle: z.string().trim().optional(),
    seoDescription: z.string().trim().optional(),
    order: z.number().int().optional(),
    isActive: z.boolean().optional(),
  })
  .passthrough();

// University Schema
const universitySchema = z
  .object({
    name: z.string().trim().min(2).max(200),
    slug: z.string().trim().min(2).max(200),
    country: z.any().optional(),
    city: z.string().trim().optional(),
    logo: z.string().trim().optional(),
    image: z.string().trim().optional(),
    ranking: z.any().optional(),
    tuitionFrom: z.number().optional(),
    tuitionTo: z.number().optional(),
    intakes: z.array(z.string()).optional(),
    website: z.string().trim().optional(),
    description: z.string().trim().optional(),
    popularCourses: z.array(z.string()).optional(),
    isFeatured: z.boolean().optional(),
    order: z.number().int().optional(),
    isActive: z.boolean().optional(),
  })
  .passthrough();

// Course Schema
const courseSchema = z
  .object({
    name: z.string().trim().min(2).max(200),
    slug: z.string().trim().min(2).max(200),
    category: z.string().trim().optional(),
    level: z.enum(['Bachelor', 'Master', 'Diploma', 'PhD']),
    duration: z.string().trim().optional(),
    description: z.string().trim().optional(),
    countries: z.array(z.string()).optional(),
    isPopular: z.boolean().optional(),
    order: z.number().int().optional(),
    isActive: z.boolean().optional(),
  })
  .passthrough();

// Service Schema
const serviceSchema = z
  .object({
    title: z.string().trim().min(2).max(150),
    slug: z.string().trim().optional(),
    description: z.string().trim().min(5),
    icon: z.string().trim().optional(),
    group: z.enum(['study', 'recruitment']),
    order: z.number().int().optional(),
    isActive: z.boolean().optional(),
  })
  .passthrough();

// Testimonial Schema
const testimonialSchema = z
  .object({
    studentName: z.string().trim().min(2).max(150),
    photo: z.string().trim().optional(),
    country: z.string().trim().optional(),
    university: z.string().trim().optional(),
    course: z.string().trim().optional(),
    result: z.string().trim().optional(),
    text: z.string().trim().optional(),
    rating: z.number().min(1).max(5).optional(),
    type: z.enum(['testimonial', 'success_story']).optional(),
    videoUrl: z.string().trim().optional(),
    order: z.number().int().optional(),
    isActive: z.boolean().optional(),
  })
  .passthrough();

// Blog Schema
const blogSchema = z
  .object({
    title: z.string().trim().min(2, 'Blog title must be at least 2 characters').max(250),
    slug: z.string().trim().optional(),
    summary: z.string().trim().optional(),
    excerpt: z.string().trim().optional(),
    content: z.string().trim().optional(),
    coverImage: z.string().trim().optional(),
    author: z.string().trim().optional(),
    tags: z.union([z.array(z.string()), z.string()]).optional(),
    category: z.string().trim().optional(),
    isPublished: z.boolean().optional(),
    publishedAt: z.union([z.string(), z.date()]).optional(),
    seoTitle: z.string().trim().optional(),
    seoDescription: z.string().trim().optional(),
    isActive: z.boolean().optional(),
  })
  .passthrough();

// FAQ Schema
const faqSchema = z
  .object({
    question: z.string().trim().min(5).max(300),
    answer: z.string().trim().min(5).max(2000),
    category: z.string().trim().optional(),
    order: z.number().int().optional(),
    isActive: z.boolean().optional(),
  })
  .passthrough();

// Partner Schema
const partnerSchema = z
  .object({
    name: z.string().trim().min(2).max(150),
    logo: z.string().trim().min(1),
    website: z.string().trim().optional(),
    order: z.number().int().optional(),
    isActive: z.boolean().optional(),
  })
  .passthrough();

module.exports = {
  countrySchema,
  universitySchema,
  courseSchema,
  serviceSchema,
  testimonialSchema,
  blogSchema,
  faqSchema,
  partnerSchema,
};

