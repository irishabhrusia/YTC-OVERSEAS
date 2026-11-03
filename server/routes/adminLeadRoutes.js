const express = require('express');
const router = express.Router();

const {
  getAdminLeads,
  getAdminLeadById,
  updateAdminLead,
  deleteAdminLead,
  exportLeadsCsv,
} = require('../controllers/adminLeadController');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { updateLeadSchema } = require('../validations/leadValidation');

// Export CSV route (must be placed before /:id)
router.get('/export', protect, exportLeadsCsv);

// List leads with filters, search, pagination, and counsellor scoping
router.get('/', protect, getAdminLeads);

// Get single lead details
router.get('/:id', protect, getAdminLeadById);

// Update status, assigned counsellor, and add notes
router.patch('/:id', protect, validate(updateLeadSchema), updateAdminLead);

// Delete lead (super_admin only)
router.delete('/:id', protect, authorize('super_admin'), deleteAdminLead);

module.exports = router;

