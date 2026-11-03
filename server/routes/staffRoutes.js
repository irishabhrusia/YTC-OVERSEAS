const express = require('express');
const router = express.Router();

const {
  getStaff,
  createStaff,
  updateStaff,
  resetStaffPassword,
  deleteStaff,
  resendStaffInvite,
} = require('../controllers/staffController');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  createStaffSchema,
  updateStaffSchema,
  resetPasswordSchema,
} = require('../validations/staffValidation');

// All staff routes are strictly protected and accessible only to super_admin
router.use(protect);
router.use(authorize('super_admin'));

router.get('/', getStaff);
router.post('/', validate(createStaffSchema), createStaff);
router.patch('/:id', validate(updateStaffSchema), updateStaff);
router.post('/:id/reset-password', validate(resetPasswordSchema), resetStaffPassword);
router.post('/:id/resend-invite', resendStaffInvite);
router.delete('/:id', deleteStaff);

module.exports = router;

