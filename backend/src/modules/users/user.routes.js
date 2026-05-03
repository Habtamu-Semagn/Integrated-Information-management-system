/**
 * User Routes
 * 
 * Defines routes for user profile operations.
 * 
 * Requirements: 8.1, 8.2
 */

const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { authenticate } = require('../../common/middleware/auth.middleware');
const { validateRequest } = require('../../common/middleware/validation.middleware');
const { updateProfileSchema } = require('./user.validation');

/**
 * GET /api/users/profile
 * 
 * Get authenticated user's profile
 * 
 * Authentication: Required
 * 
 * Requirements: 8.1
 */
router.get(
  '/profile',
  authenticate,
  userController.getProfile
);

/**
 * PATCH /api/users/profile
 * 
 * Update authenticated user's profile
 * 
 * Authentication: Required
 * 
 * Requirements: 8.2
 */
router.patch(
  '/profile',
  authenticate,
  validateRequest(updateProfileSchema),
  userController.updateProfile
);

const { authorize } = require('../../common/middleware/auth.middleware');

/**
 * GET /api/users
 * 
 * Get all users with filtering and pagination
 * 
 * Authentication: Required
 * Authorization: Admin only
 */
router.get(
  '/',
  authenticate,
  authorize('admin'),
  userController.getAllUsers
);

/**
 * PATCH /api/users/:id/role
 * 
 * Update user role
 * 
 * Authentication: Required
 * Authorization: Admin only
 */
router.patch(
  '/:id/role',
  authenticate,
  authorize('admin'),
  userController.updateUserRole
);

module.exports = router;
