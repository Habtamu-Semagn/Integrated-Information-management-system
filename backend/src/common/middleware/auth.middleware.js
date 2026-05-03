/**
 * Authentication and Authorization Middleware
 * 
 * Provides middleware functions for JWT token verification and role-based access control.
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 4.1, 4.2
 */

const authService = require('../../modules/auth/auth.service');
const { UnauthorizedError, ForbiddenError } = require('../utils/error.util');

/**
 * Authentication Middleware
 * 
 * Extracts and verifies JWT token from HTTP-only cookie.
 * Populates req.user with decoded token payload (userId, role).
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws {UnauthorizedError} If token is missing, invalid, or expired
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7
 * 
 * Preconditions:
 * - cookie-parser middleware must be configured before this middleware
 * - JWT_SECRET environment variable must be set
 * 
 * Postconditions:
 * - If token is valid: req.user is populated with {userId, role} and next() is called
 * - If token is missing/invalid/expired: UnauthorizedError is thrown
 * 
 * @example
 * // In routes:
 * router.get('/profile', authenticate, getProfile);
 */
async function authenticate(req, res, next) {
  try {
    // Extract token from HTTP-only cookie
    const token = req.cookies.token;

    // Check if token exists
    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    // Verify token and decode payload
    const decoded = authService.verifyToken(token);

    // Populate req.user with decoded payload
    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };

    // Proceed to next middleware
    next();
  } catch (error) {
    // Pass error to error handling middleware
    next(error);
  }
}

/**
 * Authorization Middleware Factory
 * 
 * Creates a middleware function that checks if the authenticated user's role
 * is in the list of allowed roles.
 * 
 * @param {...string} allowedRoles - Variable number of allowed role strings
 * @returns {Function} Express middleware function
 * @throws {ForbiddenError} If user's role is not in allowed roles
 * 
 * Requirements: 4.1, 4.2
 * 
 * Preconditions:
 * - authenticate middleware must be called before this middleware
 * - req.user must be populated with {userId, role}
 * - At least one allowed role must be provided
 * 
 * Postconditions:
 * - If user role is allowed: next() is called
 * - If user role is not allowed: ForbiddenError is thrown
 * 
 * @example
 * // Allow only staff and admin
 * router.get('/applications', authenticate, authorize('staff', 'admin'), getAllApplications);
 * 
 * @example
 * // Allow only applicants
 * router.post('/applications', authenticate, authorize('applicant'), createApplication);
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    try {
      // Check if user is authenticated (req.user should be set by authenticate middleware)
      if (!req.user || !req.user.role) {
        throw new UnauthorizedError('Authentication required');
      }

      // Check if user's role is in the allowed roles list
      if (!allowedRoles.includes(req.user.role)) {
        throw new ForbiddenError('Access denied. Insufficient permissions');
      }

      // User is authorized, proceed to next middleware
      next();
    } catch (error) {
      // Pass error to error handling middleware
      next(error);
    }
  };
}

module.exports = {
  authenticate,
  authorize
};
