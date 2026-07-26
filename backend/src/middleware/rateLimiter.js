/**
 * Rate limiter applied only to /api/auth/* - protects login/register from
 * brute-force and credential-stuffing attempts without throttling normal
 * authenticated API usage elsewhere.
 */

const rateLimit = require('express-rate-limit');
const config = require('../config/env');

const authLimiter = rateLimit({
  windowMs: config.authRateLimit.windowMs,
  max: config.authRateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many attempts from this IP. Please try again later.',
  },
});

module.exports = authLimiter;
