const express = require('express');
const router = express.Router();
const { getFooterSettings, updateFooterSettings } = require('../controllers/footerController');
const { protect } = require('../middlewares/auth');

// Public route
router.get('/', getFooterSettings);

// Admin update route
router.put('/', protect, updateFooterSettings);

module.exports = router;

