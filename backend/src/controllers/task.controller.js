/**
 * Task controller. Every handler reads userId from req.user.id (set by the
 * `protect` middleware from the verified JWT) - never from req.body or
 * req.params. This is the concrete enforcement of "never trust client IDs".
 */

const taskService = require('../services/task.service');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.body, req.user.id);
  sendSuccess(res, { statusCode: 201, message: 'Task created', data: task });
});

const getTasks = asyncHandler(async (req, res) => {
  const { tasks, meta } = await taskService.getTasks(req.query, req.user.id);
  sendSuccess(res, { statusCode: 200, message: 'Tasks retrieved', data: tasks, meta });
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.params.id, req.user.id);
  sendSuccess(res, { statusCode: 200, message: 'Task retrieved', data: task });
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(req.params.id, req.user.id, req.body);
  sendSuccess(res, { statusCode: 200, message: 'Task updated', data: task });
});

const deleteTask = asyncHandler(async (req, res) => {
  await taskService.deleteTask(req.params.id, req.user.id);
  sendSuccess(res, { statusCode: 200, message: 'Task deleted', data: null });
});

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
