const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Protect middleware:
 * Authenticates request using cookie 'token' or 'Authorization: Bearer <token>'.
 * Loads admin from database and verifies active status.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check cookie first, then Authorization header (for Postman / CLI)
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, admin user not found',
      });
    }

    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, admin account is inactive',
      });
    }

    // Invalidate tokens issued before password change
    if (admin.passwordChangedAt) {
      const changedTimestamp = parseInt(admin.passwordChangedAt.getTime() / 1000, 10);
      if (decoded.iat < changedTimestamp) {
        return res.status(401).json({
          success: false,
          message: 'Password was recently changed. Please log in again.',
        });
      }
    }

    // Enforce password change requirement
    if (admin.mustChangePassword) {
      const fullPath = (req.baseUrl ? `${req.baseUrl}${req.path}` : req.path).replace(/\/+$/, '');
      const isAllowed =
        (req.method === 'GET' && fullPath === '/api/auth/me') ||
        (req.method === 'POST' && fullPath === '/api/auth/logout') ||
        (req.method === 'PATCH' && fullPath === '/api/auth/change-password');

      if (!isAllowed) {
        return res.status(403).json({
          success: false,
          code: 'PASSWORD_CHANGE_REQUIRED',
          message: 'Password change is required before accessing this resource',
        });
      }
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, invalid or expired token',
    });
  }
});

/**
 * Authorize middleware:
 * Restricts access to admins with specific roles.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to perform this action',
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
};

