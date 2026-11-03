const express = require('express');
const router = express.Router();

const {
  getCountries,
  getCountryBySlug,
  createCountry,
  updateCountry,
  deleteCountry,
} = require('../controllers/countryController');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { countrySchema } = require('../validations/contentValidation');

// Public routes
router.get('/', getCountries);
router.get('/:slugOrId', getCountryBySlug);

// Admin routes (protect + authorize super_admin / editor)
router.post(
  '/',
  protect,
  authorize('super_admin', 'editor'),
  validate(countrySchema),
  createCountry
);
router.put(
  '/:id',
  protect,
  authorize('super_admin', 'editor'),
  validate(countrySchema.partial()),
  updateCountry
);
router.delete(
  '/:id',
  protect,
  authorize('super_admin', 'editor'),
  deleteCountry
);

module.exports = router;

