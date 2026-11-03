const express = require('express');
const router = express.Router();

const {
  login,
  logout,
  getMe,
  changePassword,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { loginRateLimiter, passwordResetRateLimiter } = require('../middlewares/rateLimiter');
const {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} = require('../validations/authValidation');

// POST /api/auth/login - strict rate limit & Zod validation
router.post('/login', loginRateLimiter, validate(loginSchema), login);

// POST /api/auth/logout - clear cookie
router.post('/logout', logout);

// POST /api/auth/forgot-password - request password reset email (rate limited: 5 req/15 min)
router.post(
  '/forgot-password',
  passwordResetRateLimiter,
  validate(forgotPasswordSchema),
  forgotPassword
);

// POST /api/auth/reset-password - reset password using email token (rate limited: 5 req/15 min)
router.post(
  '/reset-password',
  passwordResetRateLimiter,
  validate(resetPasswordSchema),
  resetPassword
);

// GET /api/auth/me - protected route returning current admin profile
router.get('/me', protect, getMe);

// PATCH /api/auth/change-password - change password for logged-in admin
router.patch('/change-password', protect, validate(changePasswordSchema), changePassword);

module.exports = router;
