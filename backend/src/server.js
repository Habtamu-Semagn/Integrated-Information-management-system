/**
 * Server Entry Point
 * Initializes and starts the Express server with database connection
 * 
 * @module server
 */

require('dotenv').config();
const app = require('./app');
const { connectDB, setupConnectionHandlers } = require('./common/config/database.config');

/**
 * Start the server
 * 
 * @async
 * @function startServer
 * @returns {Promise<void>}
 */
const startServer = async () => {
  try {
    // Validate required environment variables
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is required');
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is required');
    }

    // Setup connection event handlers
    setupConnectionHandlers();

    // Connect to MongoDB
    console.log('🚀 Starting Startup Backend System...');
    await connectDB();

    // Start Express server
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`🌐 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✅ Server initialization complete`);
    });

    // Graceful shutdown handler
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
      });
    });

  } catch (error) {
    console.error('💥 Failed to start server:', error.message);
    process.exit(1);
  }
};

// Start the server
startServer();
