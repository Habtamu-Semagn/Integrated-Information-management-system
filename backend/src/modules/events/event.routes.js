const express = require('express');
const router = express.Router();
const eventController = require('./event.controller');
const { authenticate, authorize } = require('../../common/middleware/auth.middleware');
const { validateRequest } = require('../../common/middleware/validation.middleware');
const {
  createEventValidation,
  updateEventValidation,
  eventIdValidation,
  addMaterialsValidation,
  getAllEventsQueryValidation
} = require('./event.validation');

/**
 * POST /api/events
 * Create new event (Admin only)
 */
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validateRequest(createEventValidation),
  eventController.createEvent
);

/**
 * GET /api/events
 * Get all events
 */
router.get(
  '/',
  authenticate,
  validateRequest(getAllEventsQueryValidation),
  eventController.getAllEvents
);

/**
 * GET /api/events/me/registered
 * Get user's registered events
 * Must be before /:id routes
 */
router.get(
  '/me/registered',
  authenticate,
  eventController.getUserEvents
);

/**
 * GET /api/events/:id
 * Get specific event
 */
router.get(
  '/:id',
  authenticate,
  validateRequest(eventIdValidation),
  eventController.getEventById
);

/**
 * PATCH /api/events/:id
 * Update event (Admin only)
 */
router.patch(
  '/:id',
  authenticate,
  authorize('admin'),
  validateRequest(eventIdValidation),
  validateRequest(updateEventValidation),
  eventController.updateEvent
);

/**
 * DELETE /api/events/:id
 * Delete event (Admin only)
 */
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validateRequest(eventIdValidation),
  eventController.deleteEvent
);

/**
 * POST /api/events/:id/register
 * Register for event
 */
router.post(
  '/:id/register',
  authenticate,
  validateRequest(eventIdValidation),
  eventController.registerForEvent
);

/**
 * POST /api/events/:id/unregister
 * Unregister from event
 */
router.post(
  '/:id/unregister',
  authenticate,
  validateRequest(eventIdValidation),
  eventController.unregisterFromEvent
);

/**
 * POST /api/events/:id/materials
 * Add materials to event (Admin only)
 */
router.post(
  '/:id/materials',
  authenticate,
  authorize('admin'),
  validateRequest(eventIdValidation),
  validateRequest(addMaterialsValidation),
  eventController.addMaterials
);

module.exports = router;
