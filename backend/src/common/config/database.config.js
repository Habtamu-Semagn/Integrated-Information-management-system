const mongoose = require('mongoose');

/**
 * Database Configuration Module
 * Handles MongoDB connection with error handling and retry logic
 * 
 * @module database.config
 */

/**
 * Connect to MongoDB with retry logic
 * 
 * @async
 * @function connectDB
 * @returns {Promise<void>}
 * @throws {Error} If connection fails after all retry attempts
 * 
 * Preconditions:
 * - MONGODB_URI environment variable is set
 * - MongoDB server is accessible
 * 
 * Postconditions:
 * - Mongoose connection is established
 * - Connection success message is logged
 * - Connection error handlers are registered
 * 
 * Requirements:
 * - 19.1: Connect to MongoDB using URI from environment variables
 * - 19.2: Log error and retry connection on failure
 * - 19.3: Log success message when connection is established
 * - 19.4: Configure connection pooling for efficient database access
 */
const connectDB = async () => {
  const maxRetries = 5;
  const retryDelay = 5000; // 5 seconds
  let retryCount = 0;

  const mongooseOptions = {
    // Connection pooling configuration
    maxPoolSize: 10, // Maximum number of connections in the pool
    minPoolSize: 2,  // Minimum number of connections in the pool
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    serverSelectionTimeoutMS: 5000, // Timeout for initial server selection
    family: 4, // Use IPv4, skip trying IPv6
  };

  const attemptConnection = async () => {
    try {
      // Attempt to connect to MongoDB
      await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
      
      // Log success message (Requirement 19.3)
      console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
      console.log(`📊 Database: ${mongoose.connection.name}`);
      
      return true;
    } catch (error) {
      retryCount++;
      
      // Log error with retry information (Requirement 19.2)
      console.error(`❌ MongoDB Connection Error (Attempt ${retryCount}/${maxRetries}):`, error.message);
      
      if (retryCount < maxRetries) {
        console.log(`🔄 Retrying connection in ${retryDelay / 1000} seconds...`);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        
        // Recursive retry
        return attemptConnection();
      } else {
        // All retry attempts exhausted
        console.error('💥 Failed to connect to MongoDB after maximum retry attempts');
        throw new Error(`MongoDB connection failed after ${maxRetries} attempts: ${error.message}`);
      }
    }
  };

  // Start connection attempt
  await attemptConnection();
};

/**
 * Setup MongoDB connection event handlers
 * 
 * @function setupConnectionHandlers
 * @returns {void}
 * 
 * Postconditions:
 * - Event handlers are registered for connection lifecycle events
 * - Errors are logged appropriately
 */
const setupConnectionHandlers = () => {
  // Connection error handler
  mongoose.connection.on('error', (error) => {
    console.error('❌ MongoDB connection error:', error.message);
  });

  // Connection disconnected handler
  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
  });

  // Connection reconnected handler
  mongoose.connection.on('reconnected', () => {
    console.log('✅ MongoDB reconnected successfully');
  });

  // Process termination handlers for graceful shutdown (Requirement 19.5)
  process.on('SIGINT', async () => {
    await gracefulShutdown('SIGINT');
  });

  process.on('SIGTERM', async () => {
    await gracefulShutdown('SIGTERM');
  });
};

/**
 * Gracefully close database connections
 * 
 * @async
 * @function gracefulShutdown
 * @param {string} signal - The signal that triggered the shutdown
 * @returns {Promise<void>}
 * 
 * Preconditions:
 * - Mongoose connection exists
 * 
 * Postconditions:
 * - All database connections are closed
 * - Shutdown message is logged
 * - Process exits with code 0
 * 
 * Requirements:
 * - 19.5: Gracefully close database connections on application shutdown
 */
const gracefulShutdown = async (signal) => {
  try {
    console.log(`\n🛑 ${signal} received. Closing MongoDB connections...`);
    
    await mongoose.connection.close();
    
    console.log('✅ MongoDB connections closed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during graceful shutdown:', error.message);
    process.exit(1);
  }
};

/**
 * Get current connection state
 * 
 * @function getConnectionState
 * @returns {string} Current connection state
 */
const getConnectionState = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  
  return states[mongoose.connection.readyState] || 'unknown';
};

/**
 * Check if database is connected
 * 
 * @function isConnected
 * @returns {boolean} True if connected, false otherwise
 */
const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

module.exports = {
  connectDB,
  setupConnectionHandlers,
  gracefulShutdown,
  getConnectionState,
  isConnected,
};
