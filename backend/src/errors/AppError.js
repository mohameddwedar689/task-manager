/**
 * AppError - base class for all "expected" / operational errors.
 *
 * The key idea: we distinguish "operational errors" (bad input, not found,
 * unauthorized - things we anticipated and can show a clean message for)
 * from "programmer errors" (a bug - null pointer, undefined is not a function).
 *
 * `isOperational = true` is the flag the global error handler uses to decide:
 * - operational error -> safe to send `message` to the client
 * - non-operational error -> log full details, send a generic "Something went wrong"
 *   to the client so we never leak stack traces or internals.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
