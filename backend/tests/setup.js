/**
 * Jest Setup File
 * 
 * Runs before all tests to set up the test environment
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.JWT_EXPIRES_IN = '7d';
process.env.MONGODB_URI = 'mongodb://localhost:27017/startup-backend-test';

// Increase timeout for database operations
jest.setTimeout(10000);
