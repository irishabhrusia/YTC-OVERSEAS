const Job = require('../models/Job');
const asyncHandler = require('../utils/asyncHandler');
const crudFactory = require('../utils/crudFactory');

const getJobs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, category, country, search } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const isAdmin = req.originalUrl && req.originalUrl.includes('/admin/');
  const filter = isAdmin ? {} : { isActive: true, isOpen: true };

  if (category) {
    filter.category = category;
  }
  if (country) {
    filter.country = { $regex: country, $options: 'i' };
  }
  if (search && search.trim().length > 0) {
    const searchRegex = { $regex: search.trim(), $options: 'i' };
    filter.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { city: searchRegex },
    ];
  }

  const [jobs, total] = await Promise.all([
    Job.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limitNum),
    Job.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: {
      jobs,
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

const getJobBySlug = crudFactory.getOneBySlugOrId(Job);

const createJob = asyncHandler(async (req, res) => {
  if (!req.body.slug && req.body.title) {
    req.body.slug =
      req.body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') +
      '-' +
      Math.random().toString(36).substring(2, 6);
  }

  if (!req.body.description && req.body.title) {
    req.body.description = `Recruitment opportunity for ${req.body.title} in ${req.body.country || 'our global partner location'}.`;
  }

  if (!req.body.category) {
    req.body.category = 'Other';
  }

  if (typeof req.body.openings === 'string') {
    req.body.openings = parseInt(req.body.openings, 10) || 1;
  }

  if (typeof req.body.requirements === 'string') {
    req.body.requirements = req.body.requirements
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  if (typeof req.body.benefits === 'string') {
    req.body.benefits = req.body.benefits
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  const doc = await Job.create(req.body);
  res.status(201).json({
    success: true,
    data: doc,
  });
});

const updateJob = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (typeof req.body.openings === 'string') {
    req.body.openings = parseInt(req.body.openings, 10) || 1;
  }

  if (typeof req.body.requirements === 'string') {
    req.body.requirements = req.body.requirements
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  if (typeof req.body.benefits === 'string') {
    req.body.benefits = req.body.benefits
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  const doc = await Job.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doc) {
    return res.status(404).json({
      success: false,
      message: 'Job not found',
    });
  }

  res.status(200).json({
    success: true,
    data: doc,
  });
});

const deleteJob = crudFactory.deleteOne(Job);

module.exports = {
  getJobs,
  getJobBySlug,
  createJob,
  updateJob,
  deleteJob,
};

