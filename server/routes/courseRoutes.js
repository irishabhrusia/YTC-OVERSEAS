const express = require('express');
const router = express.Router();

const {
  getCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { courseSchema } = require('../validations/contentValidation');

// Public routes
router.get('/', getCourses);
router.get('/:slugOrId', getCourseBySlug);

// Admin routes
router.post(
  '/',
  protect,
  authorize('super_admin', 'editor'),
  validate(courseSchema),
  createCourse
);
router.put(
  '/:id',
  protect,
  authorize('super_admin', 'editor'),
  validate(courseSchema.partial()),
  updateCourse
);
router.delete(
  '/:id',
  protect,
  authorize('super_admin', 'editor'),
  deleteCourse
);

module.exports = router;

