/**
 * Single source of truth for task status/priority enums, referenced by
 * both the Mongoose model (schema validation) and the validators (request
 * validation) - so they can never drift out of sync.
 */
const TASK_STATUS = ['To Do', 'In Progress', 'Done'];
const TASK_PRIORITY = ['Low', 'Medium', 'High'];

module.exports = { TASK_STATUS, TASK_PRIORITY };
