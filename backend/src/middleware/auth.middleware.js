/**
 * Verifies the Bearer token on protected routes and attaches the
 * authenticated user's id as req.user.id.
 *
 * This is the ONLY place a request is allowed to establish "who is making
 * this request" - controllers and services downstream trust req.user.id
 * completely and never accept a user id from req.body or req.params for
 * ownership checks.
 */

const jwt = require('jsonwebtoken');
const config = require('../config/env');
const userRepository = require('../repositories/user.repository');
const { UnauthorizedError } = require('../errors');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Not authenticated - no token provided');
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, config.jwt.secret);
  } catch (err) {
    // Re-thrown as-is; the global error handler maps
    // JsonWebTokenError / TokenExpiredError to a clean 401.
    throw err;
  }

  const user = await userRepository.findById(decoded.id);
  if (!user) {
    // Token is valid but the user was deleted since it was issued.
    throw new UnauthorizedError('User no longer exists');
  }

  req.user = { id: user._id.toString() };
  next();
});

module.exports = protect;
