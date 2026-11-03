const express = require('express');
const router = express.Router();

const {
  getTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require('../controllers/testimonialController');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { testimonialSchema } = require('../validations/contentValidation');

// Public routes
router.get('/', getTestimonials);
router.get('/:slugOrId', getTestimonialById);

// Admin routes
router.post(
  '/',
  protect,
  authorize('super_admin', 'editor'),
  validate(testimonialSchema),
  createTestimonial
);
router.put(
  '/:id',
  protect,
  authorize('super_admin', 'editor'),
  validate(testimonialSchema.partial()),
  updateTestimonial
);
router.delete(
  '/:id',
  protect,
  authorize('super_admin', 'editor'),
  deleteTestimonial
);

module.exports = router;

