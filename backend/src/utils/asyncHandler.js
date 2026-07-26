/**
 * Wraps an async Express route handler so that any rejected promise
 * (thrown error) is automatically passed to next(), reaching our
 * centralized error middleware - without a try/catch in every controller.
 *
 * Usage:
 *   router.get('/tasks', asyncHandler(taskController.getAll));
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
