/**
 * Spins up an in-memory MongoDB instance for integration tests so we
 * exercise real Mongoose queries (including the ownership filter, unique
 * email constraint, etc.) without needing a real MongoDB installation
 * or touching a real database.
 *
 * NOTE: the first run downloads a mongod binary, which requires network
 * access. This will work on a normal developer machine or CI runner;
 * it cannot run inside network-restricted sandboxes.
 */
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

async function connect() {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
}

async function closeDatabase() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongod) await mongod.stop();
}

async function clearDatabase() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}

module.exports = { connect, closeDatabase, clearDatabase };
