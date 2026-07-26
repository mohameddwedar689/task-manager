/**
 * Task service. Orchestrates the repository + query helper; this is where
 * "what does GET /tasks with these query params actually mean" is decided.
 */

const taskRepository = require('../repositories/task.repository');
const { buildTaskQuery } = require('../helpers/taskQuery.helper');
const { NotFoundError } = require('../errors');

async function createTask(taskData, userId) {
  return taskRepository.create(taskData, userId);
}

async function getTasks(rawQuery, userId) {
  const { filter, pagination, sort } = buildTaskQuery(rawQuery);
  const { tasks, total } = await taskRepository.findAll(userId, filter, {
    skip: pagination.skip,
    limit: pagination.limit,
    sort,
  });

  return {
    tasks,
    meta: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(total / pagination.limit) || 1,
    },
  };
}

async function getTaskById(taskId, userId) {
  const task = await taskRepository.findById(taskId, userId);
  if (!task) {
    // Same 404 whether the task doesn't exist OR belongs to someone else -
    // this avoids leaking which task IDs exist in the system to a user
    // probing IDs that aren't theirs.
    throw new NotFoundError('Task not found');
  }
  return task;
}

async function updateTask(taskId, userId, updates) {
  const task = await taskRepository.updateById(taskId, userId, updates);
  if (!task) {
    throw new NotFoundError('Task not found');
  }
  return task;
}

async function deleteTask(taskId, userId) {
  const task = await taskRepository.deleteById(taskId, userId);
  if (!task) {
    throw new NotFoundError('Task not found');
  }
  return task;
}

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
