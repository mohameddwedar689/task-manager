/**
 * Auth service: business rules only. No req/res here - this is what lets
 * us unit test "does register() reject a duplicate email" by mocking
 * userRepository, with zero HTTP or database involved.
 */

const userRepository = require('../repositories/user.repository');
const { signToken } = require('../utils/jwt');
const { ConflictError, UnauthorizedError } = require('../errors');

async function register({ name, email, password }) {
  const existing = await userRepository.findByEmail(email);
  if (existing) {
    throw new ConflictError('An account with this email already exists');
  }

  const user = await userRepository.create({ name, email, password });
  const token = signToken(user._id);

  return { user, token };
}

async function login({ email, password }) {
  // Explicitly include password since the schema excludes it by default.
  const user = await userRepository.findByEmail(email, { includePassword: true });

  // Deliberately identical error message for "no such user" and "wrong password" -
  // this prevents an attacker from using the login endpoint to enumerate
  // which emails are registered.
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const token = signToken(user._id);
  return { user, token };
}

module.exports = { register, login };
