/**
 * express-validator chains for auth endpoints, plus the middleware that
 * turns collected validation errors into our standard ValidationError shape.
 *
 * Kept separate from routes so the same validation rules could be reused
 * (e.g. a future "change password" endpoint reusing the password rule).
 */

const { body, validationResult } = require('express-validator');
const { ValidationError } = require('../errors');

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    return next(new ValidationError('Validation failed', details));
  }
  next();
}

const registerValidator = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),
  handleValidation,
];

const loginValidator = [
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation,
];

module.exports = { registerValidator, loginValidator };
