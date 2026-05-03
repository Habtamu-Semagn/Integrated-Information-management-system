/**
 * Database Configuration Integration Tests
 * 
 * NOTE: These tests require a running MongoDB instance.
 * Set MONGODB_URI environment variable before running these tests.
 * 
 * Example:
 * MONGODB_URI=mongodb://localhost:27017/test-db npm test -- database.config.integration.test.js
 * 
 * @module database.config.integration.test
 */

const mongoose = require('mongoose');
const {
  connectDB,
  setupConnectionHandlers,
  getConnectionState,
  isConnected,
  gracefulShutdown,
} = require('./database.config');

describe('Database Configuration Integration Tests', () => {
  // Skip tests if MONGODB_URI is not set
  const shouldSkip = !process.env.MONGODB_URI || process.env.MONGODB_URI.includes('localhost');

  beforeAll(() => {
    if (shouldSkip) {
      console.log('⚠️  Skipping integration tests - MONGODB_URI not configured or using localhost');
      console.log('   To run these tests, set MONGODB_URI to a test database');
    }
  });

  afterEach(async () => {
    // Close connection after each test
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  (shouldSkip ? describe.skip : describe)('Real MongoDB Connection', () => {
    test('should connect to MongoDB successfully', async () => {
      // Act
      await connectDB();

      // Assert
      expect(isConnected()).toBe(true);
      expect(getConnectionState()).toBe('connected');
      expect(mongoose.connection.name).toBeDefined();
    });

    test('should handle connection events', async () => {
      // Arrange
      setupConnectionHandlers();

      // Act
      await connectDB();

      // Assert
      expect(isConnected()).toBe(true);
    });

    test('should provide connection state information', async () => {
      // Arrange
      await connectDB();

      // Act
      const state = getConnectionState();
      const connected = isConnected();

      // Assert
      expect(state).toBe('connected');
      expect(connected).toBe(true);
    });
  });
});

/**
 * Manual Test Instructions
 * 
 * To manually test the database configuration:
 * 
 * 1. Start a local MongoDB instance:
 *    docker run -d -p 27017:27017 --name test-mongo mongo:7.0
 * 
 * 2. Create a .env file in the backend directory:
 *    MONGODB_URI=mongodb://localhost:27017/test-db
 *    JWT_SECRET=test-secret
 *    PORT=5000
 * 
 * 3. Run the server:
 *    npm run dev
 * 
 * 4. Verify the connection logs:
 *    - Should see "✅ MongoDB Connected: localhost"
 *    - Should see "📊 Database: test-db"
 * 
 * 5. Test graceful shutdown:
 *    - Press Ctrl+C
 *    - Should see "🛑 SIGINT received. Closing MongoDB connections..."
 *    - Should see "✅ MongoDB connections closed successfully"
 * 
 * 6. Test retry logic:
 *    - Stop MongoDB: docker stop test-mongo
 *    - Start the server: npm run dev
 *    - Should see retry attempts with 5-second delays
 *    - Start MongoDB: docker start test-mongo
 *    - Server should eventually connect
 */
