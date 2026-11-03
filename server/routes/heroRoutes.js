const express = require('express');
const router = express.Router();

const {
  getHeroContent,
  updateHeroContent,
} = require('../controllers/heroController');
const { protect, authorize } = require('../middlewares/auth');

// Public route to fetch hero content
router.get('/', getHeroContent);

// Admin routes to update hero content
router.put('/', protect, authorize('super_admin', 'editor'), updateHeroContent);
router.post('/', protect, authorize('super_admin', 'editor'), updateHeroContent);

module.exports = router;

