const express = require('express');
const router = express.Router();

const {
  getAboutContent,
  updateAboutContent,
} = require('../controllers/aboutController');
const { protect, authorize } = require('../middlewares/auth');

// Public route to fetch about page content
router.get('/', getAboutContent);

// Admin routes to update about page content
router.put('/', protect, authorize('super_admin', 'editor'), updateAboutContent);
router.post('/', protect, authorize('super_admin', 'editor'), updateAboutContent);

module.exports = router;

