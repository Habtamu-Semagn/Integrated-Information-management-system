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

module.exports = router;
