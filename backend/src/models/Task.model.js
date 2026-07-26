/**
 * Task model.
 *
 * `owner` is a required ObjectId ref to User - this is the field every
 * repository query filters on to enforce per-user data isolation.
 *
 * Indexes:
 * - { owner: 1, status: 1 } and { owner: 1, priority: 1 } speed up the
 *   common "my tasks filtered by status/priority" queries.
 * - a text index on title supports the search-by-title feature without
 *   pulling every task into memory and filtering in JS.
 */

const mongoose = require('mongoose');
const { TASK_STATUS, TASK_PRIORITY } = require('../constants/task.constants');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [120, 'Title must be at most 120 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description must be at most 2000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: { values: TASK_STATUS, message: '{VALUE} is not a valid status' },
      default: 'To Do',
    },
    priority: {
      type: String,
      enum: { values: TASK_PRIORITY, message: '{VALUE} is not a valid priority' },
      default: 'Medium',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

taskSchema.index({ owner: 1, status: 1 });
taskSchema.index({ owner: 1, priority: 1 });
taskSchema.index({ title: 'text' });

module.exports = mongoose.model('Task', taskSchema);
