/**
 * Auth Controller
 * 
 * Handles HTTP requests for authentication operations including
 * user registration, login, and logout.
 * 
 * Requirements: 1.1, 1.7, 2.1, 2.2, 2.3, 2.8, 10.2, 10.3, 10.4
 */

const authService = require('./auth.service');
const { successResponse } = require('../../common/utils/response.util');

/**
 * Register new user
 * 
 * Handles user registration requests.
 * Creates new user account and returns sanitized user data.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing user data
 * @param {string} req.body.name - User's full name
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password
 * @param {string} [req.body.role] - User's role (optional, defaults to 'applicant')
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * Requirements: 1.1, 1.7
 * 
 * @example
 * POST /api/auth/register
 * Body: { name: 'John Doe', email: 'john@example.com', password: 'SecurePass123' }
 * Response: { success: true, data: { id: '...', name: 'John Doe', ... }, message: 'User registered successfully' }
 */
async function register(req, res, next) {
  try {
    const userData = req.body;

    // Register user through auth service
    const user = await authService.registerUser(userData);

    // Return success response with user data (password excluded by service)
    return successResponse(
      res,
      user,
      'User registered successfully',
      201
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Login user
 * 
 * Handles user login requests.
 * Validates credentials, generates JWT token, and sets HTTP-only cookie.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing credentials
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.8, 10.2, 10.3, 10.4
 * 
 * @example
 * POST /api/auth/login
 * Body: { email: 'john@example.com', password: 'SecurePass123' }
 * Response: { success: true, data: { id: '...', name: 'John Doe', ... }, message: 'Login successful' }
 * Sets HTTP-only cookie: token=<jwt_token>
 */
async function login(req, res, next) {
  try {
    const credentials = req.body;

    // Authenticate user and get token
    const { user, token } = await authService.loginUser(credentials);

    // Set JWT token in HTTP-only cookie
    const cookieOptions = {
      httpOnly: true, // Cannot be accessed via JavaScript
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict', // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    };

    res.cookie('token', token, cookieOptions);

    // Return success response with user data and token (password excluded by service)
    return successResponse(
      res,
      { user, token },
      'Login successful'
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Logout user
 * 
 * Handles user logout requests.
 * Clears the authentication cookie.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * Requirements: 2.8
 * 
 * @example
 * POST /api/auth/logout
 * Response: { success: true, data: null, message: 'Logout successful' }
 * Clears cookie: token
 */
async function logout(req, res, next) {
  try {
    // Clear the authentication cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    // Return success response
    return successResponse(
      res,
      null,
      'Logout successful'
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Get current authenticated user
 * 
 * Returns the currently authenticated user's profile data.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user from middleware
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @example
 * GET /api/auth/me
 * Response: { success: true, data: { id: '...', name: 'John Doe', ... }, message: 'User retrieved successfully' }
 */
async function getCurrentUser(req, res, next) {
  try {
    // Get user ID from authenticated request
    const userId = req.user.userId;

    // Get user data from service
    const user = await authService.getCurrentUser(userId);

    // Return success response
    return successResponse(
      res,
      user,
      'User retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  logout,
  getCurrentUser
};
