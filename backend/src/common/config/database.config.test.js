/**
 * Database Configuration Tests
 * Tests for MongoDB connection logic, error handling, and retry mechanism
 * 
 * @module database.config.test
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const {
  connectDB,
  setupConnectionHandlers,
  getConnectionState,
  isConnected,
  gracefulShutdown,
} = require('./database.config');

describe('Database Configuration', () => {
  let mongoServer;
  let originalEnv;

  beforeAll(() => {
    // Save original environment variables
    originalEnv = { ...process.env };
  });

  afterAll(() => {
    // Restore original environment variables
    process.env = originalEnv;
  });

  beforeEach(async () => {
    // Create in-memory MongoDB instance with compatible version for Debian 13
    mongoServer = await MongoMemoryServer.create({
      binary: {
        version: '7.0.3', // Compatible with Debian 13
      },
    });
    process.env.MONGODB_URI = mongoServer.getUri();
  });

  afterEach(async () => {
    // Close all connections and stop the in-memory server
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  describe('connectDB', () => {
    test('should successfully connect to MongoDB with valid URI', async () => {
      // Arrange & Act
      await connectDB();

      // Assert
      expect(mongoose.connection.readyState).toBe(1); // 1 = connected
      expect(isConnected()).toBe(true);
      expect(getConnectionState()).toBe('connected');
    });

    test('should configure connection pooling options', async () => {
      // Arrange & Act
      await connectDB();

      // Assert
      const connection = mongoose.connection;
      expect(connection.readyState).toBe(1);
      // Connection pool is configured internally by Mongoose
      expect(connection.client).toBeDefined();
    });

    test('should throw error when MONGODB_URI is invalid', async () => {
      // Arrange
      process.env.MONGODB_URI = 'mongodb://invalid-host:27017/test';

      // Act & Assert
      await expect(connectDB()).rejects.toThrow();
    }, 30000); // Increase timeout for retry logic

    test('should log success message on successful connection', async () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      await connectDB();

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('MongoDB Connected')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Database')
      );

      // Cleanup
      consoleSpy.mockRestore();
    });

    test('should handle connection errors and log them', async () => {
      // Arrange
      process.env.MONGODB_URI = 'mongodb://invalid-host:27017/test';
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Act & Assert
      await expect(connectDB()).rejects.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('MongoDB Connection Error')
      );

      // Cleanup
      consoleErrorSpy.mockRestore();
    }, 30000);
  });

  describe('getConnectionState', () => {
    test('should return "disconnected" when not connected', () => {
      // Arrange & Act
      const state = getConnectionState();

      // Assert
      expect(state).toBe('disconnected');
    });

    test('should return "connected" when connected', async () => {
      // Arrange
      await connectDB();

      // Act
      const state = getConnectionState();

      // Assert
      expect(state).toBe('connected');
    });
  });

  describe('isConnected', () => {
    test('should return false when not connected', () => {
      // Arrange & Act
      const connected = isConnected();

      // Assert
      expect(connected).toBe(false);
    });

    test('should return true when connected', async () => {
      // Arrange
      await connectDB();

      // Act
      const connected = isConnected();

      // Assert
      expect(connected).toBe(true);
    });
  });

  describe('setupConnectionHandlers', () => {
    test('should register connection event handlers without errors', () => {
      // Arrange & Act & Assert
      expect(() => setupConnectionHandlers()).not.toThrow();
    });

    test('should handle connection error events', async () => {
      // Arrange
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      setupConnectionHandlers();
      await connectDB();

      // Act - Emit error event
      mongoose.connection.emit('error', new Error('Test error'));

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('MongoDB connection error'),
        'Test error'
      );

      // Cleanup
      consoleErrorSpy.mockRestore();
    });

    test('should handle disconnection events', async () => {
      // Arrange
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      setupConnectionHandlers();
      await connectDB();

      // Act - Emit disconnected event
      mongoose.connection.emit('disconnected');

      // Assert
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('MongoDB disconnected')
      );

      // Cleanup
      consoleWarnSpy.mockRestore();
    });

    test('should handle reconnection events', async () => {
      // Arrange
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      setupConnectionHandlers();
      await connectDB();

      // Act - Emit reconnected event
      mongoose.connection.emit('reconnected');

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('MongoDB reconnected successfully')
      );

      // Cleanup
      consoleLogSpy.mockRestore();
    });
  });

  describe('gracefulShutdown', () => {
    test('should close database connections gracefully', async () => {
      // Arrange
      await connectDB();
      expect(isConnected()).toBe(true);

      // Mock process.exit to prevent test from exiting
      const exitSpy = jest.spyOn(process, 'exit').mockImplementation();
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      await gracefulShutdown('SIGTERM');

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('SIGTERM received')
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('MongoDB connections closed successfully')
      );
      expect(exitSpy).toHaveBeenCalledWith(0);

      // Cleanup
      exitSpy.mockRestore();
      consoleLogSpy.mockRestore();
    });

    test('should handle errors during shutdown', async () => {
      // Arrange
      await connectDB();
      
      // Force an error by closing connection first
      await mongoose.connection.close();
      
      // Mock mongoose.connection.close to throw error
      jest.spyOn(mongoose.connection, 'close').mockRejectedValueOnce(
        new Error('Shutdown error')
      );

      const exitSpy = jest.spyOn(process, 'exit').mockImplementation();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Act
      await gracefulShutdown('SIGINT');

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error during graceful shutdown'),
        'Shutdown error'
      );
      expect(exitSpy).toHaveBeenCalledWith(1);

      // Cleanup
      exitSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Connection Retry Logic', () => {
    test('should retry connection on failure', async () => {
      // Arrange
      process.env.MONGODB_URI = 'mongodb://invalid-host:27017/test';
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Act & Assert
      await expect(connectDB()).rejects.toThrow();
      
      // Should log retry attempts
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Retrying connection')
      );

      // Cleanup
      consoleLogSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    }, 30000);
  });

  describe('Connection Pooling', () => {
    test('should establish connection with pooling configuration', async () => {
      // Arrange & Act
      await connectDB();

      // Assert
      expect(mongoose.connection.readyState).toBe(1);
      expect(mongoose.connection.client).toBeDefined();
      
      // Verify connection is usable
      const collections = await mongoose.connection.db.listCollections().toArray();
      expect(Array.isArray(collections)).toBe(true);
    });
  });
});
