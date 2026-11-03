const express = require('express');
const router = express.Router();

const {
  createLead,
  getLeads,
  updateLead,
} = require('../controllers/leadController');
const { protect } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { leadsRateLimiter } = require('../middlewares/rateLimiter');
const {
  createLeadSchema,
  updateLeadSchema,
} = require('../validations/leadValidation');

// POST /api/leads - Public route with rate limiting & Zod validation
router.post('/', leadsRateLimiter, validate(createLeadSchema), createLead);

// GET /api/leads - Protected: list with pagination, filters, search (newest first)
router.get('/', protect, getLeads);

// PATCH /api/leads/:id - Protected: update status and add a note
router.patch('/:id', protect, validate(updateLeadSchema), updateLead);

module.exports = router;
