const express = require('express');
const taskController = require('../controllers/task.controller');
const protect = require('../middleware/auth.middleware');
const {
  createTaskValidator,
  updateTaskValidator,
  taskIdValidator,
  listTasksValidator,
} = require('../validators/task.validator');

const router = express.Router();

// Every task route requires a valid JWT - applied once here rather than
// on each individual route.
router.use(protect);

router.post('/', createTaskValidator, taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/:id', taskIdValidator, taskController.getTaskById);
router.put('/:id', taskIdValidator, updateTaskValidator, taskController.updateTask);
router.delete('/:id', taskIdValidator, taskController.deleteTask);

module.exports = router;
