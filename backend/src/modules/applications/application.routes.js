/**
 * Application Routes
 * 
 * Defines routes for application operations with authentication and authorization.
 * 
 * Requirements: 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 5.1, 6.1, 6.2, 6.3, 7.1, 7.5
 */

const express = require('express');
const router = express.Router();
const applicationController = require('./application.controller');
const { authenticate, authorize } = require('../../common/middleware/auth.middleware');
const { validateRequest } = require('../../common/middleware/validation.middleware');
const {
  createApplicationSchema,
  updateStatusSchema,
  applicationIdSchema
} = require('./application.validation');

/**
 * POST /api/applications
 * 
 * Create a new application (applicants only)
 * 
 * Authentication: Required
 * Authorization: applicant
 * 
 * Requirements: 4.3, 5.1
 */
router.post(
  '/',
  authenticate,
  authorize('applicant'),
  validateRequest(createApplicationSchema),
  applicationController.createApplication
);

/**
 * GET /api/applications/my
 * 
 * Get authenticated applicant's applications
 * 
 * Authentication: Required
 * Authorization: applicant
 * 
 * Requirements: 4.4, 6.1
 */
router.get(
  '/my',
  authenticate,
  authorize('applicant'),
  applicationController.getMyApplications
);

/**
 * GET /api/applications
 * 
 * Get all applications (staff and admin only)
 * Supports optional status query parameter for filtering
 * 
 * Authentication: Required
 * Authorization: staff, admin
 * 
 * Requirements: 4.5, 6.2, 6.3
 */
router.get(
  '/',
  authenticate,
  authorize('staff', 'admin'),
  applicationController.getAllApplications
);

/**
 * GET /api/applications/:id
 * 
 * Get application by ID (staff and admin only)
 * 
 * Authentication: Required
 * Authorization: staff, admin
 * 
 * Requirements: 4.6, 6.3
 */
router.get(
  '/:id',
  authenticate,
  authorize('staff', 'admin'),
  validateRequest(applicationIdSchema),
  applicationController.getApplicationById
);

/**
 * PATCH /api/applications/:id/status
 * 
 * Update application status (staff and admin only)
 * 
 * Authentication: Required
 * Authorization: staff, admin
 * 
 * Requirements: 4.7, 4.8, 7.1, 7.5
 */
router.patch(
  '/:id/status',
  authenticate,
  authorize('staff', 'admin'),
  validateRequest({
    ...applicationIdSchema,
    ...updateStatusSchema
  }),
  applicationController.updateApplicationStatus
);

module.exports = router;
