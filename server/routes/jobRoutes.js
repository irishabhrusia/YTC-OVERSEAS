const express = require('express');
const router = express.Router();

const {
  getJobs,
  getJobBySlug,
  createJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { jobSchema } = require('../validations/recruitmentValidation');

// Public routes
router.get('/', getJobs);
router.get('/:slugOrId', getJobBySlug);

// Admin routes
router.post(
  '/',
  protect,
  authorize('super_admin', 'editor'),
  validate(jobSchema),
  createJob
);
router.put(
  '/:id',
  protect,
  authorize('super_admin', 'editor'),
  validate(jobSchema.partial()),
  updateJob
);
router.delete(
  '/:id',
  protect,
  authorize('super_admin', 'editor'),
  deleteJob
);

module.exports = router;

