const express = require('express');
const router = express.Router();
const trainingController = require('./training.controller');
const { authenticate, authorize } = require('../../common/middleware/auth.middleware');
const { validateRequest } = require('../../common/middleware/validation.middleware');
const {
  createTrainingValidation,
  updateTrainingValidation,
  trainingIdValidation,
  getTrainingsQueryValidation
} = require('./training.validation');

/**
 * POST /api/training
 * Create new training course (Admin only)
 */
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validateRequest(createTrainingValidation),
  trainingController.createTraining
);

/**
 * GET /api/training/me/enrolled
 * Get user's enrolled trainings
 * Must be before /:id route
 */
router.get(
  '/me/enrolled',
  authenticate,
  trainingController.getUserTrainings
);

/**
 * GET /api/training
 * Get all active training courses
 */
router.get(
  '/',
  authenticate,
  validateRequest(getTrainingsQueryValidation),
  trainingController.getAllTrainings
);

/**
 * GET /api/training/:id
 * Get specific training by ID
 */
router.get(
  '/:id',
  authenticate,
  validateRequest(trainingIdValidation),
  trainingController.getTrainingById
);

/**
 * PATCH /api/training/:id
 * Update training course (Admin only)
 */
router.patch(
  '/:id',
  authenticate,
  authorize('admin'),
  validateRequest(trainingIdValidation),
  validateRequest(updateTrainingValidation),
  trainingController.updateTraining
);

/**
 * DELETE /api/training/:id
 * Delete training course (Admin only)
 */
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validateRequest(trainingIdValidation),
  trainingController.deleteTraining
);

/**
 * POST /api/training/:id/enroll
 * Enroll user in training
 */
router.post(
  '/:id/enroll',
  authenticate,
  validateRequest(trainingIdValidation),
  trainingController.enrollInTraining
);

/**
 * POST /api/training/:id/complete
 * Mark training as completed
 */
router.post(
  '/:id/complete',
  authenticate,
  validateRequest(trainingIdValidation),
  trainingController.completeTraining
);

module.exports = router;
