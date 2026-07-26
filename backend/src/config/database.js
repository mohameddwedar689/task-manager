/**
 * MongoDB connection via Mongoose.
 *
 * Kept separate from server.js so that:
 * - Tests can import and call connectDB()/disconnectDB() against an in-memory Mongo instance
 *   without booting the whole HTTP server.
 * - server.js stays focused on "start listening", not "how do we reach the DB".
 */

const mongoose = require('mongoose');
const config = require('./env');
const logger = require('./logger');

async function connectDB() {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    // Fail fast: an API with no DB connection should not accept traffic.
    process.exit(1);
  }
}

async function disconnectDB() {
  await mongoose.disconnect();
}

module.exports = { connectDB, disconnectDB };
