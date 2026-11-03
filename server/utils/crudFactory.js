const asyncHandler = require('./asyncHandler');

/**
 * Reusable CRUD factory for Mongoose models
 */
const crudFactory = {
  createOne: (Model) =>
    asyncHandler(async (req, res) => {
      if (req.body.code && !req.body.flag && typeof req.body.code === 'string' && req.body.code.trim().length === 2) {
        try {
          const codePoints = req.body.code.trim().toUpperCase().split('').map((c) => 127397 + c.charCodeAt(0));
          req.body.flag = String.fromCodePoint(...codePoints);
        } catch (_) {}
      }
      const doc = await Model.create(req.body);
      res.status(201).json({
        success: true,
        data: doc,
      });
    }),

  getAll: (Model, options = {}) =>
    asyncHandler(async (req, res) => {
      const {
        defaultFilter = { isActive: true },
        populate = null,
        defaultSort = { order: 1, createdAt: -1 },
      } = options;

      // In admin routes (or if specified), allow seeing inactive items
      const isAdminRoute = req.originalUrl && req.originalUrl.includes('/admin/');
      const filter = isAdminRoute ? {} : { ...defaultFilter };

      // Optional category/type filtering from query if present
      if (req.query.category) filter.category = req.query.category;
      if (req.query.type) filter.type = req.query.type;
      if (req.query.group) filter.group = req.query.group;

      // Pagination support — safe defaults, max 500 per page
      const pageNum = Math.max(1, parseInt(req.query.page, 10) || 1);
      const limitNum = Math.min(500, Math.max(1, parseInt(req.query.limit, 10) || 200));
      const skip = (pageNum - 1) * limitNum;

      let query = Model.find(filter).sort(defaultSort).skip(skip).limit(limitNum);
      if (populate) query = query.populate(populate);

      const [docs, total] = await Promise.all([
        query,
        Model.countDocuments(filter),
      ]);

      res.status(200).json({
        success: true,
        data: docs,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum) || 1,
          hasNextPage: pageNum * limitNum < total,
          hasPrevPage: pageNum > 1,
        },
      });
    }),

  getOneBySlugOrId: (Model, options = {}) =>
    asyncHandler(async (req, res) => {
      const { slugOrId } = req.params;
      const { populate = null } = options;

      const isAdminRoute = req.originalUrl && req.originalUrl.includes('/admin/');
      const baseFilter = isAdminRoute ? {} : { isActive: true };

      let query;
      if (slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
        query = Model.findOne({ _id: slugOrId, ...baseFilter });
      } else {
        query = Model.findOne({ slug: slugOrId.toLowerCase(), ...baseFilter });
      }

      if (populate) query = query.populate(populate);

      const doc = await query;
      if (!doc) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found',
        });
      }

      res.status(200).json({
        success: true,
        data: doc,
      });
    }),

  updateOne: (Model) =>
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      if (req.body.code && !req.body.flag && typeof req.body.code === 'string' && req.body.code.trim().length === 2) {
        try {
          const codePoints = req.body.code.trim().toUpperCase().split('').map((c) => 127397 + c.charCodeAt(0));
          req.body.flag = String.fromCodePoint(...codePoints);
        } catch (_) {}
      }
      const doc = await Model.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!doc) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found',
        });
      }

      res.status(200).json({
        success: true,
        data: doc,
      });
    }),

  deleteOne: (Model) =>
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const doc = await Model.findByIdAndDelete(id);

      if (!doc) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Resource deleted successfully',
      });
    }),
};

module.exports = crudFactory;

