/**
 * Authentication Service Layer
 * 
 * Provides business logic for user authentication operations including
 * registration, login, token generation, and token verification.
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.7, 2.1, 2.3, 2.4, 2.5, 2.6, 2.7, 10.1, 10.5
 */

const jwt = require('jsonwebtoken');
const jwtConfig = require('../../common/config/jwt.config');
const userService = require('../users/user.service');
const User = require('../users/user.model');
const { UnauthorizedError, ValidationError } = require('../../common/utils/error.util');

/**
 * Register a new user
 * 
 * Creates a new user account with the provided data.
 * Password is automatically hashed by the User model.
 * Returns sanitized user data without password field.
 * 
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User's full name (2-100 characters)
 * @param {string} userData.email - User's email address (must be unique)
 * @param {string} userData.password - User's password (min 8 characters)
 * @param {string} [userData.role='applicant'] - User's role
 * @returns {Promise<Object>} Created user object without password
 * @throws {ValidationError} If validation fails
 * @throws {ConflictError} If email already exists
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.7
 * 
 * @example
 * const user = await registerUser({
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   password: 'SecurePass123'
 * });
 */
async function registerUser(userData) {
  // Delegate to user service for user creation
  const user = await userService.createUser(userData);
  
  return user;
}

/**
 * Authenticate user and generate JWT token
 * 
 * Validates user credentials and generates a JWT token for authentication.
 * Returns user data and token on successful authentication.
 * 
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User's email address
 * @param {string} credentials.password - User's password
 * @returns {Promise<Object>} Object containing user data and JWT token
 * @returns {Object} return.user - User object without password
 * @returns {string} return.token - JWT authentication token
 * @throws {UnauthorizedError} If credentials are invalid
 * @throws {ValidationError} If email or password is missing
 * 
 * Requirements: 2.1, 2.3, 2.4, 2.5, 2.6, 2.7
 * 
 * @example
 * const { user, token } = await loginUser({
 *   email: 'john@example.com',
 *   password: 'SecurePass123'
 * });
 */
async function loginUser(credentials) {
  const { email, password } = credentials;

  // Validate input
  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  // Find user by email and include password field for comparison
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // Verify password using the model's comparePassword method
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // Generate JWT token
  const token = generateToken(user._id.toString(), user.role);

  // Return user data without password
  const userResponse = user.toJSON();

  return {
    user: userResponse,
    token
  };
}

/**
 * Generate JWT token
 * 
 * Creates a JWT token containing user ID and role with configured expiration.
 * Token is signed with JWT_SECRET from environment variables.
 * 
 * @param {string} userId - User's MongoDB ObjectId as string
 * @param {string} role - User's role (applicant, staff, admin)
 * @returns {string} Signed JWT token
 * 
 * Requirements: 2.1, 2.6, 10.1, 10.5
 * 
 * Preconditions:
 * - userId is a valid string
 * - role is a valid role string
 * - JWT_SECRET is configured
 * 
 * Postconditions:
 * - Returns JWT token string
 * - Token contains userId, role, iat, and exp claims
 * - Token expires in 7 days (or configured expiration)
 * 
 * @example
 * const token = generateToken('507f1f77bcf86cd799439011', 'applicant');
 * // Returns: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 */
function generateToken(userId, role) {
  const payload = {
    userId,
    role
  };

  const token = jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn
  });

  return token;
}

/**
 * Verify and decode JWT token
 * 
 * Verifies the JWT token signature and expiration, then returns the decoded payload.
 * 
 * @param {string} token - JWT token string to verify
 * @returns {Object} Decoded token payload
 * @returns {string} return.userId - User's MongoDB ObjectId
 * @returns {string} return.role - User's role
 * @returns {number} return.iat - Token issued at timestamp
 * @returns {number} return.exp - Token expiration timestamp
 * @throws {UnauthorizedError} If token is invalid or expired
 * 
 * Requirements: 2.6, 10.1, 10.5
 * 
 * Preconditions:
 * - token is a non-empty string
 * - JWT_SECRET is configured
 * 
 * Postconditions:
 * - Returns decoded payload if token is valid
 * - Throws UnauthorizedError if token is invalid or expired
 * 
 * @example
 * const payload = verifyToken(token);
 * // Returns: { userId: '507f...', role: 'applicant', iat: 1234567890, exp: 1234567890 }
 */
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Token expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new UnauthorizedError('Invalid token');
    }
    throw new UnauthorizedError('Token verification failed');
  }
}

/**
 * Get current authenticated user
 * 
 * Retrieves the authenticated user's profile data.
 * 
 * @param {string} userId - User's MongoDB ObjectId
 * @returns {Promise<Object>} User object without password
 * @throws {NotFoundError} If user not found
 * 
 * @example
 * const user = await getCurrentUser('507f1f77bcf86cd799439011');
 */
async function getCurrentUser(userId) {
  // Delegate to user service
  const user = await userService.getUserById(userId);
  
  return user;
}

module.exports = {
  registerUser,
  loginUser,
  generateToken,
  verifyToken,
  getCurrentUser
};
