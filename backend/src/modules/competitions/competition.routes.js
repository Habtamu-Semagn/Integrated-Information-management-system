const express = require('express');
const router = express.Router();
const competitionController = require('./competition.controller');
const { authenticate, authorize } = require('../../common/middleware/auth.middleware');
const { validateRequest } = require('../../common/middleware/validation.middleware');
const {
  createCompetitionValidation,
  updateCompetitionValidation,
  competitionIdValidation,
  publishResultsValidation,
  getAllCompetitionsQueryValidation
} = require('./competition.validation');

/**
 * POST /api/competitions
 * Create new competition (Admin only)
 */
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validateRequest(createCompetitionValidation),
  competitionController.createCompetition
);

/**
 * GET /api/competitions
 * Get all competitions
 */
router.get(
  '/',
  authenticate,
  validateRequest(getAllCompetitionsQueryValidation),
  competitionController.getAllCompetitions
);

/**
 * GET /api/competitions/:id
 * Get specific competition
 */
router.get(
  '/:id',
  authenticate,
  validateRequest(competitionIdValidation),
  competitionController.getCompetitionById
);

/**
 * PATCH /api/competitions/:id
 * Update competition (Admin only)
 */
router.patch(
  '/:id',
  authenticate,
  authorize('admin'),
  validateRequest(competitionIdValidation),
  validateRequest(updateCompetitionValidation),
  competitionController.updateCompetition
);

/**
 * DELETE /api/competitions/:id
 * Delete competition (Admin only)
 */
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validateRequest(competitionIdValidation),
  competitionController.deleteCompetition
);

/**
 * POST /api/competitions/:id/register
 * Register for competition
 */
router.post(
  '/:id/register',
  authenticate,
  authorize('applicant'),
  validateRequest(competitionIdValidation),
  competitionController.registerForCompetition
);

/**
 * POST /api/competitions/:id/unregister
 * Unregister from competition
 */
router.post(
  '/:id/unregister',
  authenticate,
  validateRequest(competitionIdValidation),
  competitionController.unregisterFromCompetition
);

/**
 * POST /api/competitions/:id/results
 * Publish competition results (Admin only)
 */
router.post(
  '/:id/results',
  authenticate,
  authorize('admin'),
  validateRequest(competitionIdValidation),
  validateRequest(publishResultsValidation),
  competitionController.publishResults
);

module.exports = router;
