const express = require('express');
const router = express.Router();
const { getContactSettings, updateContactSettings } = require('../controllers/contactController');
const { protect } = require('../middlewares/auth');

// Public route
router.get('/', getContactSettings);

// Admin update route
router.put('/', protect, updateContactSettings);

module.exports = router;

