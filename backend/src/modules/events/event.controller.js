const eventService = require('./event.service');
const { successResponse } = require('../../common/utils/response.util');

/**
 * Create event (Admin only)
 */
async function createEvent(req, res, next) {
  try {
    const event = await eventService.createEvent(req.body);
    return successResponse(res, event, 'Event created successfully', 201);
  } catch (error) {
    next(error);
  }
}

/**
 * Get all events
 */
async function getAllEvents(req, res, next) {
  try {
    const filters = {
      status: req.query.status,
      eventType: req.query.eventType,
      category: req.query.category,
      upcomingOnly: req.query.upcomingOnly === 'true'
    };
    
    const events = await eventService.getAllEvents(filters);
    return successResponse(res, events, 'Events retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Get event by ID
 */
async function getEventById(req, res, next) {
  try {
    const event = await eventService.getEventById(req.params.id);
    return successResponse(res, event, 'Event retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Update event (Admin)
 */
async function updateEvent(req, res, next) {
  try {
    const event = await eventService.updateEvent(req.params.id, req.body);
    return successResponse(res, event, 'Event updated successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Delete event (Admin)
 */
async function deleteEvent(req, res, next) {
  try {
    await eventService.deleteEvent(req.params.id);
    return successResponse(res, null, 'Event deleted successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Register for event
 */
async function registerForEvent(req, res, next) {
  try {
    const event = await eventService.registerForEvent(req.params.id, req.user.userId);
    return successResponse(res, event, 'Registered for event successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Unregister from event
 */
async function unregisterFromEvent(req, res, next) {
  try {
    const event = await eventService.unregisterFromEvent(req.params.id, req.user.userId);
    return successResponse(res, event, 'Unregistered from event successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Get user's registered events
 */
async function getUserEvents(req, res, next) {
  try {
    const events = await eventService.getUserEvents(req.user.userId);
    return successResponse(res, events, 'User events retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Add materials to event (Admin)
 */
async function addMaterials(req, res, next) {
  try {
    const event = await eventService.addMaterials(req.params.id, req.body.materials);
    return successResponse(res, event, 'Materials added successfully');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  getUserEvents,
  addMaterials
};
