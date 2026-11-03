const express = require('express');
const router = express.Router();

const {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { blogSchema } = require('../validations/contentValidation');

// Public routes
router.get('/', getBlogs);
router.get('/:slugOrId', getBlogBySlug);

// Admin routes
router.post(
  '/',
  protect,
  authorize('super_admin', 'editor'),
  validate(blogSchema),
  createBlog
);
router.put(
  '/:id',
  protect,
  authorize('super_admin', 'editor'),
  validate(blogSchema.partial()),
  updateBlog
);
router.delete(
  '/:id',
  protect,
  authorize('super_admin', 'editor'),
  deleteBlog
);

module.exports = router;

