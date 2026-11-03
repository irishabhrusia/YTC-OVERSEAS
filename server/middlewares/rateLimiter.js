const rateLimit = require('express-rate-limit');

// General API rate limiter: 200 requests per 15 minutes per IP
const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 200 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
  handler: (req, res, next, options) => {
    res.status(429).json(options.message);
  },
});

// Rate limiter restricting POST /api/leads
const leadsRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 5 : 100, // 5 in production, 100 in development
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many lead submissions from this IP. Please try again after 15 minutes.',
  },
  handler: (req, res, next, options) => {
    res.status(429).json(options.message);
  },
});

// Strict rate limiter for POST /api/auth/login: 5 in production, 100 in development
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 5 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts from this IP. Please try again after 15 minutes.',
  },
  handler: (req, res, next, options) => {
    res.status(429).json(options.message);
  },
});

// Rate limiter for password reset and forgot-password: 5 requests per 15 minutes per IP
const passwordResetRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many password reset requests from this IP. Please try again after 15 minutes.',
  },
  handler: (req, res, next, options) => {
    res.status(429).json(options.message);
  },
});

module.exports = {
  apiRateLimiter,
  leadsRateLimiter,
  loginRateLimiter,
  passwordResetRateLimiter,
};
