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

module.exports = {
  getProfile,
  updateProfile
};
