const Blog = require('../models/Blog');
const asyncHandler = require('../utils/asyncHandler');
const crudFactory = require('../utils/crudFactory');

const getBlogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, category, search, tag } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const filter = { isActive: true, isPublished: true };

  if (category) {
    filter.category = { $regex: category, $options: 'i' };
  }

  if (tag) {
    filter.tags = tag;
  }

  if (search && search.trim().length > 0) {
    const searchRegex = { $regex: search.trim(), $options: 'i' };
    filter.$or = [
      { title: searchRegex },
      { excerpt: searchRegex },
      { content: searchRegex },
    ];
  }

  const [blogs, total] = await Promise.all([
    Blog.find(filter).sort({ publishedAt: -1 }).skip(skip).limit(limitNum),
    Blog.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: {
      blogs,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
        hasNextPage: pageNum * limitNum < total,
        hasPrevPage: pageNum > 1,
      },
    },
  });
});

const getBlogBySlug = crudFactory.getOneBySlugOrId(Blog);

const createBlog = asyncHandler(async (req, res) => {
  // Normalize title
  const title = (req.body.title || req.body.name || '').trim();
  if (!title) {
    return res.status(400).json({
      success: false,
      message: 'Blog title is required',
    });
  }
  req.body.title = title;

  // Auto-generate slug if missing or empty
  if (!req.body.slug || req.body.slug.trim() === '') {
    req.body.slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') +
      '-' +
      Math.random().toString(36).substring(2, 6);
  } else {
    req.body.slug = req.body.slug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  // Handle summary / excerpt interchangeability
  const excerptText = (req.body.excerpt || req.body.summary || '').trim();
  req.body.excerpt = excerptText;

  // Handle content fallback if empty or too short
  if (!req.body.content || req.body.content.trim().length === 0) {
    req.body.content =
      excerptText || `${title} - Comprehensive insights and expert guidance from YTC Global Education.`;
  }

  // Handle tags string or array
  if (typeof req.body.tags === 'string') {
    req.body.tags = req.body.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }

  if (!req.body.category) {
    req.body.category = 'Study Abroad';
  }

  if (!req.body.author) {
    req.body.author = 'YTC Editorial Team';
  }

  const doc = await Blog.create(req.body);
  res.status(201).json({
    success: true,
    data: doc,
  });
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (req.body.title && (!req.body.slug || req.body.slug.trim() === '')) {
    req.body.slug = req.body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  if (req.body.summary && !req.body.excerpt) {
    req.body.excerpt = req.body.summary;
  }

  if (typeof req.body.tags === 'string') {
    req.body.tags = req.body.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }

  const doc = await Blog.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doc) {
    return res.status(404).json({
      success: false,
      message: 'Blog post not found',
    });
  }

  res.status(200).json({
    success: true,
    data: doc,
  });
});

const deleteBlog = crudFactory.deleteOne(Blog);

module.exports = {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
};

