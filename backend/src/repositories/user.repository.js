/**
 * User repository - the only module allowed to query the User collection directly.
 * Services depend on this interface, not on Mongoose. If we ever needed to
 * switch database drivers, this is the only file that would change.
 */

const User = require('../models/User.model');

const userRepository = {
  async create(userData) {
    return User.create(userData);
  },

  async findByEmail(email, { includePassword = false } = {}) {
    const query = User.findOne({ email });
    if (includePassword) query.select('+password');
    return query;
  },

  async findById(id) {
    return User.findById(id);
  },
};

module.exports = userRepository;
