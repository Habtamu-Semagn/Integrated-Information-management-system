/**
 * User Controller
 * 
 * Handles HTTP requests for user profile operations.
 * 
 * Requirements: 8.1, 8.2, 8.4, 8.5, 9.3
 */

const userService = require('./user.service');
const { successResponse } = require('../../common/utils/response.util');

/**
 * Get user profile
 * 
 * Retrieves the authenticated user's profile information.
 * Password field is automatically excluded.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user from auth middleware
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * Requirements: 8.1, 8.4, 9.3
 */
async function getProfile(req, res, next) {
  try {
    const userId = req.user.userId;

    const user = await userService.getUserById(userId);

    return successResponse(
      res,
      user,
      'Profile retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Update user profile
 * 
 * Updates the authenticated user's profile information.
 * Only name and email fields can be updated.
 * Password field is never included in the response.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user from auth middleware
 * @param {Object} req.body - Update data
 * @param {string} req.body.name - New name (optional)
 * @param {string} req.body.email - New email (optional)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * Requirements: 8.2, 8.4, 8.5, 9.3
 */
async function updateProfile(req, res, next) {
  try {
    const userId = req.user.userId;
    const updates = req.body;

    const user = await userService.updateUser(userId, updates);

    return successResponse(
      res,
      user,
      'Profile updated successfully'
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Get all users (Admin only)
 * 
 * Retrieves all registered users with filtering and pagination.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters (role, search, page, limit)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getAllUsers(req, res, next) {
  try {
    const query = req.query;
    const data = await userService.getAllUsers(query);

    return successResponse(
      res,
      data,
      'Users retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Update user role (Admin only)
 * 
 * Updates a user's role in the system.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - User ID to update
 * @param {Object} req.body - Request body
 * @param {string} req.body.role - New role
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function updateUserRole(req, res, next) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await userService.updateUserRole(id, role);

    return successResponse(
      res,
      user,
      'User role updated successfully'
    );
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProfile,
  updateProfile,
  getAllUsers,
  updateUserRole
};
