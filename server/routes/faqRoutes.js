const express = require('express');
const router = express.Router();

const {
  getFaqs,
  getFaqById,
  createFaq,
  updateFaq,
  deleteFaq,
} = require('../controllers/faqController');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { faqSchema } = require('../validations/contentValidation');

// Public routes
router.get('/', getFaqs);
router.get('/:slugOrId', getFaqById);

// Admin routes
router.post(
  '/',
  protect,
  authorize('super_admin', 'editor'),
  validate(faqSchema),
  createFaq
);
router.put(
  '/:id',
  protect,
  authorize('super_admin', 'editor'),
  validate(faqSchema.partial()),
  updateFaq
);
router.delete(
  '/:id',
  protect,
  authorize('super_admin', 'editor'),
  deleteFaq
);

module.exports = router;

