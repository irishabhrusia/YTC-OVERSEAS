const crypto = require('crypto');
const Admin = require('../models/Admin');
const asyncHandler = require('../utils/asyncHandler');
const { sendStaffInviteEmail } = require('../services/emailService');

/**
 * GET /api/admin/staff: List all admin staff
 */
const getStaff = asyncHandler(async (req, res) => {
  const staff = await Admin.find().select('-password').sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: staff,
  });
});

/**
 * POST /api/admin/staff: Create new staff account and send invite link (super_admin only)
 */
const createStaff = asyncHandler(async (req, res) => {
  const { name, email, role } = req.body;

  const normalizedEmail = email.toLowerCase().trim();
  const existing = await Admin.findOne({ email: normalizedEmail });

  if (existing) {
    return res.status(400).json({
      success: false,
      message: 'Staff account with this email already exists',
    });
  }

  // Generate a random temporary password internally (never exposed or emailed)
  const tempPassword = crypto.randomBytes(32).toString('base64');

  // Create staff with mustChangePassword = true
  const staff = await Admin.create({
    name: name.trim(),
    email: normalizedEmail,
    role: role || 'counsellor',
    password: tempPassword,
    mustChangePassword: true,
  });

  // Generate 24-hour invite token (same hashing as password reset)
  const inviteToken = crypto.randomBytes(32).toString('hex');
  staff.passwordResetToken = crypto.createHash('sha256').update(inviteToken).digest('hex');
  staff.passwordResetExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  await staff.save();

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const inviteLink = `${clientUrl}/admin/reset-password?token=${inviteToken}&invite=1`;

  try {
    await sendStaffInviteEmail(staff, inviteLink);
  } catch (error) {
    console.error('[Staff] Failed to send staff invite email:', error);
  }

  res.status(201).json({
    success: true,
    message: 'Staff created and invitation email sent successfully',
    data: {
      id: staff._id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
      isActive: staff.isActive,
      mustChangePassword: staff.mustChangePassword,
    },
  });
});

/**
 * PATCH /api/admin/staff/:id: Update staff details (super_admin only)
 */
const updateStaff = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, role, isActive } = req.body;

  const staff = await Admin.findById(id);
  if (!staff) {
    return res.status(404).json({
      success: false,
      message: 'Staff member not found',
    });
  }

  // Cannot deactivate oneself
  if (req.admin._id.toString() === id && isActive === false) {
    return res.status(400).json({
      success: false,
      message: 'You cannot deactivate your own account',
    });
  }

  // Cannot remove or demote the last super_admin
  if (staff.role === 'super_admin' && role && role !== 'super_admin') {
    const superAdminCount = await Admin.countDocuments({ role: 'super_admin' });
    if (superAdminCount <= 1) {
      return res.status(400).json({
        success: false,
        message: 'Cannot demote the last remaining super admin',
      });
    }
  }

  if (name) staff.name = name.trim();
  if (role) staff.role = role;
  if (isActive !== undefined) staff.isActive = isActive;

  await staff.save();

  res.status(200).json({
    success: true,
    message: 'Staff updated successfully',
    data: {
      id: staff._id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
      isActive: staff.isActive,
    },
  });
});

/**
 * POST /api/admin/staff/:id/reset-password: Reset password for staff member (super_admin only)
 */
const resetStaffPassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  const staff = await Admin.findById(id);
  if (!staff) {
    return res.status(404).json({
      success: false,
      message: 'Staff member not found',
    });
  }

  staff.password = password;
  await staff.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successfully',
  });
});

/**
 * DELETE /api/admin/staff/:id: Delete staff member (super_admin only)
 */
const deleteStaff = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Cannot delete yourself
  if (req.admin._id.toString() === id) {
    return res.status(400).json({
      success: false,
      message: 'You cannot delete your own account',
    });
  }

  const staff = await Admin.findById(id);
  if (!staff) {
    return res.status(404).json({
      success: false,
      message: 'Staff member not found',
    });
  }

  // Cannot delete last super_admin
  if (staff.role === 'super_admin') {
    const superAdminCount = await Admin.countDocuments({ role: 'super_admin' });
    if (superAdminCount <= 1) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete the last remaining super admin',
      });
    }
  }

  await Admin.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Staff deleted successfully',
  });
});

/**
 * POST /api/admin/staff/:id/resend-invite: Resend staff activation invite email (super_admin only)
 */
const resendStaffInvite = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const staff = await Admin.findById(id);
  if (!staff) {
    return res.status(404).json({
      success: false,
      message: 'Staff member not found',
    });
  }

  if (!staff.isActive) {
    return res.status(400).json({
      success: false,
      message: 'Cannot send invitation to an inactive staff account',
    });
  }

  // Generate new 24-hour invite token
  const inviteToken = crypto.randomBytes(32).toString('hex');
  staff.passwordResetToken = crypto.createHash('sha256').update(inviteToken).digest('hex');
  staff.passwordResetExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  staff.mustChangePassword = true;
  await staff.save();

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const inviteLink = `${clientUrl}/admin/reset-password?token=${inviteToken}&invite=1`;

  try {
    await sendStaffInviteEmail(staff, inviteLink);
  } catch (error) {
    console.error('[Staff] Failed to resend staff invite email:', error);
  }

  res.status(200).json({
    success: true,
    message: 'Invitation email resent successfully',
  });
});

module.exports = {
  getStaff,
  createStaff,
  updateStaff,
  resetStaffPassword,
  deleteStaff,
  resendStaffInvite,
};

