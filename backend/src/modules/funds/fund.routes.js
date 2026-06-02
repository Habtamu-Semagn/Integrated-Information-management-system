const express = require('express');
const router = express.Router();
const fundController = require('./fund.controller');
const { authenticate, authorize } = require('../../common/middleware/auth.middleware');
const { validateRequest } = require('../../common/middleware/validation.middleware');
const {
  createFundValidation,
  updateFundValidation,
  fundIdValidation,
  applicationIdValidation,
  createFundApplicationValidation,
  updateApplicationStatusValidation,
  getAllFundsQueryValidation
} = require('./fund.validation');

// Fund Management Routes (Admin)

/**
 * POST /api/funds
 * Create new fund opportunity (Admin only)
 */
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validateRequest(createFundValidation),
  fundController.createFund
);

/**
 * GET /api/funds
 * Get all fund opportunities
 */
router.get(
  '/',
  authenticate,
  validateRequest(getAllFundsQueryValidation),
  fundController.getAllFunds
);

/**
 * GET /api/funds/me/applications
 * Get user's fund applications
 * Must be before /:fundId routes
 */
router.get(
  '/me/applications',
  authenticate,
  fundController.getUserApplications
);

/**
 * GET /api/funds/applications/:applicationId
 * Get specific fund application
 */
router.get(
  '/applications/:applicationId',
  authenticate,
  validateRequest(applicationIdValidation),
  fundController.getApplicationById
);

/**
 * PATCH /api/funds/applications/:applicationId/status
 * Update application status (Admin/Staff)
 */
router.patch(
  '/applications/:applicationId/status',
  authenticate,
  authorize('admin', 'staff'),
  validateRequest(applicationIdValidation),
  validateRequest(updateApplicationStatusValidation),
  fundController.updateApplicationStatus
);

/**
 * POST /api/funds/applications/:applicationId/withdraw
 * Withdraw fund application
 */
router.post(
  '/applications/:applicationId/withdraw',
  authenticate,
  validateRequest(applicationIdValidation),
  fundController.withdrawApplication
);

/**
 * GET /api/funds/:id
 * Get specific fund opportunity
 */
router.get(
  '/:id',
  authenticate,
  validateRequest(fundIdValidation),
  fundController.getFundById
);

/**
 * PATCH /api/funds/:id
 * Update fund opportunity (Admin only)
 */
router.patch(
  '/:id',
  authenticate,
  authorize('admin'),
  validateRequest(fundIdValidation),
  validateRequest(updateFundValidation),
  fundController.updateFund
);

/**
 * DELETE /api/funds/:id
 * Delete fund opportunity (Admin only)
 */
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validateRequest(fundIdValidation),
  fundController.deleteFund
);

/**
 * POST /api/funds/:fundId/apply
 * Apply for a fund
 */
router.post(
  '/:fundId/apply',
  authenticate,
  authorize('applicant'),
  validateRequest(fundIdValidation),
  validateRequest(createFundApplicationValidation),
  fundController.applyForFund
);

/**
 * GET /api/funds/:fundId/applications
 * Get applications for a fund (Admin/Staff)
 */
router.get(
  '/:fundId/applications',
  authenticate,
  authorize('admin', 'staff'),
  validateRequest(fundIdValidation),
  fundController.getFundApplications
);

module.exports = router;
