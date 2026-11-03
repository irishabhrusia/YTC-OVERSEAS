const express = require('express');
const router = express.Router();

const {
  getServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { serviceSchema } = require('../validations/contentValidation');

// Public routes
router.get('/', getServices);
router.get('/:slugOrId', getServiceBySlug);

// Admin routes
router.post(
  '/',
  protect,
  authorize('super_admin', 'editor'),
  validate(serviceSchema),
  createService
);
router.put(
  '/:id',
  protect,
  authorize('super_admin', 'editor'),
  validate(serviceSchema.partial()),
  updateService
);
router.delete(
  '/:id',
  protect,
  authorize('super_admin', 'editor'),
  deleteService
);

module.exports = router;

