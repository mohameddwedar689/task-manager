/**
 * Validation chains for task endpoints. Shares the same handleValidation
 * pattern as auth - collected errors become a single ValidationError with
 * per-field details.
 */

const { body, param, query, validationResult } = require('express-validator');
const { TASK_STATUS, TASK_PRIORITY } = require('../constants/task.constants');
const { ValidationError } = require('../errors');

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    return next(new ValidationError('Validation failed', details));
  }
  next();
}

const createTaskValidator = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 120 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('status').optional().isIn(TASK_STATUS).withMessage(`Status must be one of: ${TASK_STATUS.join(', ')}`),
  body('priority')
    .optional()
    .isIn(TASK_PRIORITY)
    .withMessage(`Priority must be one of: ${TASK_PRIORITY.join(', ')}`),
  body('dueDate').optional({ nullable: true }).isISO8601().withMessage('dueDate must be a valid date'),
  handleValidation,
];

// Same rules as create, but every field is optional (partial update via PATCH-like PUT).
const updateTaskValidator = [
  body('title').optional().trim().notEmpty().isLength({ max: 120 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('status').optional().isIn(TASK_STATUS).withMessage(`Status must be one of: ${TASK_STATUS.join(', ')}`),
  body('priority')
    .optional()
    .isIn(TASK_PRIORITY)
    .withMessage(`Priority must be one of: ${TASK_PRIORITY.join(', ')}`),
  body('dueDate').optional({ nullable: true }).isISO8601().withMessage('dueDate must be a valid date'),
  handleValidation,
];

const taskIdValidator = [param('id').isMongoId().withMessage('Invalid task id'), handleValidation];

// const listTasksValidator = [
//   query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
//   query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be 1-100'),
//   query('status').optional().isIn(TASK_STATUS),
//   query('priority').optional().isIn(TASK_PRIORITY),
//   handleValidation,
// ];

module.exports = {
  createTaskValidator,
  updateTaskValidator,
  taskIdValidator,
  // listTasksValidator,
};
