/**
 * Auth controller: parse request -> call service -> shape response.
 * No business logic lives here on purpose.
 */

const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const { user, token } = await authService.register({ name, email, password });

  sendSuccess(res, {
    statusCode: 201,
    message: 'Account created successfully',
    data: { user, token },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login({ email, password });

  sendSuccess(res, {
    statusCode: 200,
    message: 'Logged in successfully',
    data: { user, token },
  });
});

module.exports = { register, login };
