const express = require('express');
const router = express.Router();

const { getAdminStats } = require('../controllers/statsController');
const { protect } = require('../middlewares/auth');

// GET /api/admin/stats - protected analytics dashboard
router.get('/', protect, getAdminStats);

module.exports = router;

