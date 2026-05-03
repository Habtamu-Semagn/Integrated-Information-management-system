/**
 * Auth Routes
 * 
 * Defines routes for authentication operations.
 * 
 * Requirements: 1.1, 2.1, 2.8
 */

const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { authenticate } = require('../../common/middleware/auth.middleware');
const { validateRequest } = require('../../common/middleware/validation.middleware');
const { registerSchema, loginSchema } = require('./auth.validation');

/**
 * POST /api/auth/register
 * 
 * Register a new user account
 * 
 * Request body:
 * - name: string (2-100 characters, required)
 * - email: string (valid email format, required)
 * - password: string (min 8 characters, required)
 * - role: string (optional, defaults to 'applicant')
 * 
 * Response: 201 Created
 * - User object without password
 * 
 * Requirements: 1.1
 */
router.post(
  '/register',
  validateRequest(registerSchema),
  authController.register
);

/**
 * POST /api/auth/login
 * 
 * Authenticate user and receive JWT token in HTTP-only cookie
 * 
 * Request body:
 * - email: string (required)
 * - password: string (required)
 * 
 * Response: 200 OK
 * - User object without password
 * - Sets HTTP-only cookie with JWT token
 * 
 * Requirements: 2.1
 */
router.post(
  '/login',
  validateRequest(loginSchema),
  authController.login
);

/**
 * POST /api/auth/logout
 * 
 * Logout user by clearing authentication cookie
 * 
 * Response: 200 OK
 * - Clears authentication cookie
 * 
 * Requirements: 2.8
 */
router.post(
  '/logout',
  authController.logout
);

/**
 * GET /api/auth/me
 * 
 * Get currently authenticated user's profile
 * 
 * Authentication: Required
 * 
 * Response: 200 OK
 * - User object without password
 */
router.get(
  '/me',
  authenticate,
  authController.getCurrentUser
);

module.exports = router;
