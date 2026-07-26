/**
 * JWT sign helper. Payload is intentionally minimal (just the user id) -
 * the token should be an identity reference, not a data carrier.
 */
const jwt = require('jsonwebtoken');
const config = require('../config/env');

function signToken(userId) {
  return jwt.sign({ id: userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}

module.exports = { signToken };
