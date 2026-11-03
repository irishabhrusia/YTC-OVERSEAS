const express = require('express');
const router = express.Router();

const {
  getUniversities,
  getUniversityBySlug,
  createUniversity,
  updateUniversity,
  deleteUniversity,
} = require('../controllers/universityController');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { universitySchema } = require('../validations/contentValidation');

// Public routes
router.get('/', getUniversities);
router.get('/:slugOrId', getUniversityBySlug);

// Admin routes
router.post(
  '/',
  protect,
  authorize('super_admin', 'editor'),
  validate(universitySchema),
  createUniversity
);
router.put(
  '/:id',
  protect,
  authorize('super_admin', 'editor'),
  validate(universitySchema.partial()),
  updateUniversity
);
router.delete(
  '/:id',
  protect,
  authorize('super_admin', 'editor'),
  deleteUniversity
);

module.exports = router;

