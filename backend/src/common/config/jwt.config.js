/**
 * JWT Configuration Module
 * 
 * Provides JWT secret and expiration settings for token generation and verification.
 * Configuration is loaded from environment variables.
 * 
 * Requirements: 2.6, 10.1
 */

/**
 * JWT Configuration Object
 * 
 * @property {string} secret - Secret key for signing JWT tokens (from JWT_SECRET env var)
 * @property {string} expiresIn - Token expiration time (from JWT_EXPIRES_IN env var, default: '7d')
 * 
 * Preconditions:
 * - JWT_SECRET environment variable must be set
 * 
 * Postconditions:
 * - Returns configuration object with secret and expiresIn
 * - Throws error if JWT_SECRET is not configured
 */
const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN || '7d'
};

// Validate that JWT_SECRET is configured
if (!jwtConfig.secret) {
  throw new Error('JWT_SECRET environment variable is required but not set');
}

module.exports = jwtConfig;
