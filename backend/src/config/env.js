/**
 * Centralized environment configuration.
 *
 * Why this file exists:
 * - Every other module imports config values FROM HERE, never from `process.env` directly.
 *   This gives us one place to validate required vars and one place to change defaults.
 * - If a required variable is missing, we fail fast at startup instead of getting a
 *   confusing runtime error later (e.g. "jwt malformed" because JWT_SECRET was undefined).
 */

require('dotenv').config();

const REQUIRED_VARS = ['MONGODB_URI', 'JWT_SECRET'];

function validateEnv() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    // Thrown synchronously at import time -> process crashes immediately on boot
    // rather than failing later on the first request that needs the DB or JWT.
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
        'Check your .env file against .env.example.'
    );
  }
}

validateEnv();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  mongoUri: process.env.MONGODB_URI,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  authRateLimit: {
    windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    max: parseInt(process.env.AUTH_RATE_LIMIT_MAX, 10) || 10,
  },
  isProduction: process.env.NODE_ENV === 'production',
};

module.exports = config;
