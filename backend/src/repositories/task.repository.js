/**
 * Task repository. Every method requires `userId` and folds it directly
 * into the Mongo filter - never fetches a task then checks ownership
 * afterward. This makes "users can only touch their own tasks" a property
 * of the query itself, not a separate step someone could forget to add.
 */

const Task = require('../models/Task.model');

const taskRepository = {
  async create(taskData, userId) {
    return Task.create({ ...taskData, owner: userId });
  },

  /**
   * `filter` is a pre-built Mongo filter object (status, priority, text search)
   * assembled by the service layer - the repository just executes it, scoped
   * to the owner.
   */
  async findAll(userId, filter, { skip, limit, sort }) {
    const query = { owner: userId, ...filter };

    const [tasks, total] = await Promise.all([
      Task.find(query).sort(sort).skip(skip).limit(limit),
      Task.countDocuments(query),
    ]);

    return { tasks, total };
  },

  async findById(taskId, userId) {
    return Task.findOne({ _id: taskId, owner: userId });
  },

  async updateById(taskId, userId, updates) {
    return Task.findOneAndUpdate({ _id: taskId, owner: userId }, updates, {
      new: true, // return the updated document
      runValidators: true, // re-run schema validation (enums, maxlength) on update
    });
  },

  async deleteById(taskId, userId) {
    return Task.findOneAndDelete({ _id: taskId, owner: userId });
  },
};

module.exports = taskRepository;
