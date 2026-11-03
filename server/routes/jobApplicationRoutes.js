const express = require('express');
const router = express.Router();

const {
  submitApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  downloadCv,
} = require('../controllers/jobApplicationController');
const { protect } = require('../middlewares/auth');
const { cvUpload } = require('../middlewares/upload');
const validate = require('../middlewares/validate');
const { updateJobApplicationSchema } = require('../validations/recruitmentValidation');
const { leadsRateLimiter } = require('../middlewares/rateLimiter');

// Public route: submit application with optional CV file upload (multipart/form-data)
router.post('/', leadsRateLimiter, cvUpload.single('cv'), submitApplication);

// Admin routes: protected
router.get('/', protect, getApplications);
router.get('/:id', protect, getApplicationById);
router.patch('/:id', protect, validate(updateJobApplicationSchema), updateApplication);
router.get('/:id/cv', protect, downloadCv);

module.exports = router;

