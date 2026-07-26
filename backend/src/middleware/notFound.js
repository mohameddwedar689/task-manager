/**
 * Catches any request that didn't match a defined route and forwards
 * a NotFoundError into the error-handling pipeline, so unmatched routes
 * get the same consistent JSON error shape as everything else.
 */
const { NotFoundError } = require('../errors');

function notFound(req, res, next) {
  next(new NotFoundError(`Route not found: ${req.method} ${req.originalUrl}`));
}

module.exports = notFound;
