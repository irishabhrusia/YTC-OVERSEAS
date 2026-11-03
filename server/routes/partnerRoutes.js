const express = require('express');
const router = express.Router();

const {
  getPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner,
} = require('../controllers/partnerController');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { partnerSchema } = require('../validations/contentValidation');

// Public routes
router.get('/', getPartners);
router.get('/:slugOrId', getPartnerById);

// Admin routes
router.post(
  '/',
  protect,
  authorize('super_admin', 'editor'),
  validate(partnerSchema),
  createPartner
);
router.put(
  '/:id',
  protect,
  authorize('super_admin', 'editor'),
  validate(partnerSchema.partial()),
  updatePartner
);
router.delete(
  '/:id',
  protect,
  authorize('super_admin', 'editor'),
  deletePartner
);

module.exports = router;

