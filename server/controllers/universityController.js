const University = require('../models/University');
const Country = require('../models/Country');
const asyncHandler = require('../utils/asyncHandler');
const crudFactory = require('../utils/crudFactory');

/**
 * Public GET /api/universities with filters, search, pagination, and sorting
 */
const getUniversities = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    country,
    course,
    minTuition,
    maxTuition,
    intake,
    featured,
    search,
    sort = 'order',
  } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const filter = { isActive: true };

  // Filter by country (supports ObjectId or country slug)
  if (country) {
    if (country.match(/^[0-9a-fA-F]{24}$/)) {
      filter.country = country;
    } else {
      const foundCountry = await Country.findOne({ slug: country.toLowerCase() });
      if (foundCountry) {
        filter.country = foundCountry._id;
      } else {
        // No match, return empty result
        return res.status(200).json({
          success: true,
          data: {
            universities: [],
            pagination: { total: 0, page: pageNum, limit: limitNum, totalPages: 0 },
          },
        });
      }
    }
  }

  // Filter by popular course
  if (course) {
    filter.popularCourses = { $regex: course, $options: 'i' };
  }

  // Filter by tuition fee range
  if (minTuition !== undefined || maxTuition !== undefined) {
    filter.tuitionFrom = {};
    if (minTuition !== undefined) filter.tuitionFrom.$gte = Number(minTuition);
    if (maxTuition !== undefined) filter.tuitionTo = { $lte: Number(maxTuition) };
  }

  // Filter by intake
  if (intake) {
    filter.intakes = { $regex: intake, $options: 'i' };
  }

  // Filter by featured status
  if (featured !== undefined) {
    filter.isFeatured = featured === 'true' || featured === true;
  }

  // Search by name, city, or description
  if (search && search.trim().length > 0) {
    const searchRegex = { $regex: search.trim(), $options: 'i' };
    filter.$or = [
      { name: searchRegex },
      { city: searchRegex },
      { description: searchRegex },
    ];
  }

  // Determine sort order
  let sortOption = { order: 1, name: 1 };
  if (sort === 'ranking') sortOption = { ranking: 1 };
  if (sort === 'tuitionAsc') sortOption = { tuitionFrom: 1 };
  if (sort === 'tuitionDesc') sortOption = { tuitionTo: -1 };
  if (sort === 'newest') sortOption = { createdAt: -1 };

  const [universities, total] = await Promise.all([
    University.find(filter)
      .populate('country', 'name slug code flagPath')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum),
    University.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: {
      universities,
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

const getUniversityBySlug = crudFactory.getOneBySlugOrId(University, {
  populate: { path: 'country', select: 'name slug code flagPath' },
});

// Helper to resolve country ID from ObjectId, slug, code, or name
const resolveCountryId = async (countryInput) => {
  if (!countryInput) return null;
  if (typeof countryInput === 'object' && countryInput._id) {
    return countryInput._id;
  }
  const str = String(countryInput).trim();
  if (str.match(/^[0-9a-fA-F]{24}$/)) {
    return str;
  }
  const found = await Country.findOne({
    $or: [
      { slug: str.toLowerCase() },
      { code: str.toUpperCase() },
      { name: new RegExp(`^${str}$`, 'i') },
      { shortName: new RegExp(`^${str}$`, 'i') },
    ],
  });
  return found ? found._id : null;
};

const createUniversity = asyncHandler(async (req, res) => {
  // Auto-generate slug from name if not provided
  if (!req.body.slug && req.body.name) {
    req.body.slug = req.body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  // Resolve country
  if (req.body.country) {
    const resolvedId = await resolveCountryId(req.body.country);
    if (resolvedId) {
      req.body.country = resolvedId;
    }
  }

  // Fallback to first active country if none specified or resolved
  if (!req.body.country) {
    const defaultCountry = await Country.findOne({ isActive: true }).sort({ order: 1 });
    if (defaultCountry) {
      req.body.country = defaultCountry._id;
    }
  }

  const doc = await University.create(req.body);
  const populated = await University.findById(doc._id).populate('country', 'name slug code flagPath');

  res.status(201).json({
    success: true,
    data: populated || doc,
  });
});

const updateUniversity = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (req.body.country) {
    const resolvedId = await resolveCountryId(req.body.country);
    if (resolvedId) {
      req.body.country = resolvedId;
    }
  }

  const doc = await University.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  }).populate('country', 'name slug code flagPath');

  if (!doc) {
    return res.status(404).json({
      success: false,
      message: 'University not found',
    });
  }

  res.status(200).json({
    success: true,
    data: doc,
  });
});

const deleteUniversity = crudFactory.deleteOne(University);

module.exports = {
  getUniversities,
  getUniversityBySlug,
  createUniversity,
  updateUniversity,
  deleteUniversity,
};

