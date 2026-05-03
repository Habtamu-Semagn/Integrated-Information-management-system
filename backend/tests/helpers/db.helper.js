/**
 * Database Test Helper
 * 
 * Provides utilities for database setup and teardown in tests
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

/**
 * Connect to in-memory MongoDB instance
 */
const connect = async () => {
  // Close any existing connections
  await disconnect();

  // Create new in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create({
    binary: {
      version: '7.0.3'
    }
  });
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

/**
 * Disconnect from MongoDB and stop server
 */
const disconnect = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }

  if (mongoServer) {
    await mongoServer.stop();
    mongoServer = null;
  }
};

/**
 * Clear all collections in the database
 */
const clearDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    return;
  }

  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

/**
 * Clear a specific collection
 */
const clearCollection = async (collectionName) => {
  if (mongoose.connection.readyState === 0) {
    return;
  }

  const collection = mongoose.connection.collections[collectionName];
  if (collection) {
    await collection.deleteMany({});
  }
};

module.exports = {
  connect,
  disconnect,
  clearDatabase,
  clearCollection
};
