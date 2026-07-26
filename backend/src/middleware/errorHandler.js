/**
 * Global error-handling middleware. Must be registered LAST in app.js
 * (after all routes) - Express recognizes it as an error handler because
 * it takes 4 arguments (err, req, res, next).
 *
 * Responsibilities:
 * 1. Translate known Mongoose errors (bad ObjectId, duplicate key, validation)
 *    into our AppError types so they get clean, consistent messages.
 * 2. Never leak stack traces or internal error messages for unexpected
 *    (non-operational) errors - log them fully server-side, return a
 *    generic message to the client.
 */

const logger = require('../config/logger');
const config = require('../config/env');
const { AppError, ValidationError, NotFoundError, ConflictError } = require('../errors');

function normalizeError(err) {
  // Invalid MongoDB ObjectId (e.g. GET /tasks/not-a-valid-id)
  if (err.name === 'CastError') {
    return new NotFoundError(`Invalid ${err.path}: ${err.value}`);
  }

  // Mongoose schema validation failure
  if (err.name === 'ValidationError' && err.errors) {
    const details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return new ValidationError('Validation failed', details);
  }

  // Duplicate key (e.g. unique email already registered)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return new ConflictError(`${field} already in use`);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return new AppError('Invalid authentication token', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return new AppError('Authentication token expired', 401);
  }

  return err;
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const normalized = normalizeError(err);

  const statusCode = normalized.statusCode || 500;
  const isOperational = normalized.isOperational === true;

  if (isOperational) {
    logger.warn(`${req.method} ${req.originalUrl} -> ${statusCode}: ${normalized.message}`);
  } else {
    // Unexpected/programmer error: log full stack, never show it to the client.
    logger.error(`${req.method} ${req.originalUrl} -> 500: ${err.stack || err.message}`);
  }

  const responseBody = {
    success: false,
    message: isOperational ? normalized.message : 'Something went wrong. Please try again later.',
  };

  if (normalized.details) {
    responseBody.errors = normalized.details;
  }

  // Only ever include stack traces outside production, for local debugging.
  if (!config.isProduction && !isOperational) {
    responseBody.stack = err.stack;
  }

  res.status(isOperational ? statusCode : 500).json(responseBody);
}

module.exports = errorHandler;
