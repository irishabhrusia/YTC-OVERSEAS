const crypto = require('crypto');
const Admin = require('../models/Admin');
const asyncHandler = require('../utils/asyncHandler');
const { generateToken, setTokenCookie } = require('../utils/generateToken');
const { sendPasswordResetEmail } = require('../services/emailService');

/**
 * @desc    Admin login
 * @route   POST /api/auth/login
 * @access  Public (strict rate limited)
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email ? email.toLowerCase().trim() : '';

  // Find admin and explicitly select password field
  const admin = await Admin.findOne({ email: normalizedEmail }).select('+password');

  if (!admin) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  const isMatch = await admin.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  if (!admin.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Account is inactive. Please contact an administrator.',
    });
  }

  // Generate JWT token & set HTTP-only cookie
  const token = generateToken(admin._id, admin.role);
  setTokenCookie(res, token);

  // Update last login timestamp
  admin.lastLoginAt = new Date();
  await admin.save();

  // Return admin data (and token for API clients / Postman)
  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    data: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      mustChangePassword: !!admin.mustChangePassword,
    },
  });
});

/**
 * @desc    Admin logout / clear cookie
 * @route   POST /api/auth/logout
 * @access  Public
 */
const logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

/**
 * @desc    Get currently authenticated admin
 * @route   GET /api/auth/me
 * @access  Protected
 */
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      id: req.admin._id,
      name: req.admin.name,
      email: req.admin.email,
      role: req.admin.role,
      mustChangePassword: !!req.admin.mustChangePassword,
      lastLoginAt: req.admin.lastLoginAt,
    },
  });
});

/**
 * @desc    Change own password
 * @route   PATCH /api/auth/change-password
 * @access  Protected
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const admin = await Admin.findById(req.admin._id).select('+password');
  if (!admin) {
    return res.status(404).json({
      success: false,
      message: 'Admin not found',
    });
  }

  const isMatch = await admin.comparePassword(currentPassword);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect',
    });
  }

  const isSame = await admin.comparePassword(newPassword);
  if (isSame) {
    return res.status(400).json({
      success: false,
      message: 'New password must be different from current password',
    });
  }

  admin.password = newPassword;
  admin.mustChangePassword = false;
  admin.passwordChangedAt = new Date();
  await admin.save();

  // Issue fresh token & HTTP-only cookie
  const token = generateToken(admin._id, admin.role);
  setTokenCookie(res, token);

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
    token,
    data: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      mustChangePassword: false,
    },
  });
});

/**
 * @desc    Request password reset email
 * @route   POST /api/auth/forgot-password
 * @access  Public (Rate limited: 5 req/15 min)
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = email ? email.toLowerCase().trim() : '';

  const genericResponse = {
    success: true,
    message: 'If this email exists, a reset link has been sent',
  };

  const admin = await Admin.findOne({ email: normalizedEmail });
  if (!admin || !admin.isActive) {
    // ALWAYS return identical message for security
    return res.status(200).json(genericResponse);
  }

  // Create random 32-byte token and store SHA-256 hash
  const resetToken = crypto.randomBytes(32).toString('hex');
  admin.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  admin.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
  await admin.save({ validateBeforeSave: false });

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const resetLink = `${clientUrl}/admin/reset-password?token=${resetToken}`;

  try {
    await sendPasswordResetEmail(admin, resetLink);
  } catch (error) {
    console.error('[Auth] Failed to send password reset email:', error);
    admin.passwordResetToken = undefined;
    admin.passwordResetExpires = undefined;
    await admin.save({ validateBeforeSave: false });
  }

  return res.status(200).json(genericResponse);
});

/**
 * @desc    Reset password using token from email
 * @route   POST /api/auth/reset-password
 * @access  Public (Rate limited: 5 req/15 min)
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  // Hash incoming token to match stored SHA-256
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const admin = await Admin.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+password +passwordResetToken +passwordResetExpires');

  if (!admin) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired password reset token',
    });
  }

  // New password must differ from current password
  const isSame = await admin.comparePassword(newPassword);
  if (isSame) {
    return res.status(400).json({
      success: false,
      message: 'New password must be different from current password',
    });
  }

  admin.password = newPassword;
  admin.passwordResetToken = undefined;
  admin.passwordResetExpires = undefined;
  admin.mustChangePassword = false;
  admin.passwordChangedAt = new Date();
  await admin.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successfully. You can now log in with your new password.',
  });
});

module.exports = {
  login,
  logout,
  getMe,
  changePassword,
  forgotPassword,
  resetPassword,
};
