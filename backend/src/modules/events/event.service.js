const Event = require('./event.model');
const { NotFoundError, ValidationError, ConflictError } = require('../../common/utils/error.util');

/**
 * Create a new event (Admin only)
 */
async function createEvent(eventData) {
  try {
    // Validate dates
    if (new Date(eventData.startDateTime) >= new Date(eventData.endDateTime)) {
      throw new ValidationError('Start date must be before end date');
    }
    
    const event = await Event.create(eventData);
    return event.toJSON();
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw new ValidationError(Object.values(error.errors)[0].message);
    }
    throw error;
  }
}

/**
 * Get all events
 */
async function getAllEvents(filters = {}) {
  try {
    const query = {};
    
    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.eventType) {
      query.eventType = filters.eventType;
    }
    if (filters.category) {
      query.category = filters.category;
    }
    if (filters.upcomingOnly) {
      query.status = { $in: ['upcoming', 'ongoing'] };
      query.startDateTime = { $gte: new Date() };
    }
    
    const events = await Event.find(query)
      .populate('registeredAttendees', 'name email')
      .sort({ startDateTime: 1 })
      .limit(100);
    
    return events.map(e => e.toJSON());
  } catch (error) {
    throw error;
  }
}

/**
 * Get event by ID
 */
async function getEventById(eventId) {
  try {
    const event = await Event.findById(eventId)
      .populate('registeredAttendees', 'name email');
    
    if (!event) {
      throw new NotFoundError('Event not found');
    }
    
    return event.toJSON();
  } catch (error) {
    if (error.message === 'Event not found') throw error;
    if (error.name === 'CastError') {
      throw new ValidationError('Invalid event ID format');
    }
    throw error;
  }
}

/**
 * Update event (Admin only)
 */
async function updateEvent(eventId, updates) {
  try {
    const event = await Event.findByIdAndUpdate(eventId, updates, {
      new: true,
      runValidators: true
    });
    
    if (!event) {
      throw new NotFoundError('Event not found');
    }
    
    return event.toJSON();
  } catch (error) {
    if (error.message === 'Event not found') throw error;
    if (error.name === 'ValidationError') {
      throw new ValidationError(Object.values(error.errors)[0].message);
    }
    throw error;
  }
}

/**
 * Register user for event
 */
async function registerForEvent(eventId, userId) {
  try {
    const event = await Event.findById(eventId);
    
    if (!event) {
      throw new NotFoundError('Event not found');
    }
    
    // Check if event is still accepting registrations
    if (event.status === 'cancelled') {
      throw new ValidationError('Event has been cancelled');
    }
    
    // Check if user already registered
    if (event.registeredAttendees.includes(userId)) {
      throw new ConflictError('User already registered for this event');
    }
    
    // Check capacity
    if (event.capacity && event.registeredAttendees.length >= event.capacity) {
      throw new ValidationError('Event is full, no more registrations allowed');
    }
    
    event.registeredAttendees.push(userId);
    await event.save();
    
    return event.toJSON();
  } catch (error) {
    if (error.message.includes('already registered') || error.message === 'Event not found') {
      throw error;
    }
    throw error;
  }
}

/**
 * Unregister user from event
 */
async function unregisterFromEvent(eventId, userId) {
  try {
    const event = await Event.findById(eventId);
    
    if (!event) {
      throw new NotFoundError('Event not found');
    }
    
    // Check if user is registered
    if (!event.registeredAttendees.includes(userId)) {
      throw new ValidationError('User is not registered for this event');
    }
    
    // Check if event has started
    if (new Date() > event.startDateTime) {
      throw new ValidationError('Cannot unregister after event has started');
    }
    
    event.registeredAttendees = event.registeredAttendees.filter(
      a => a.toString() !== userId.toString()
    );
    await event.save();
    
    return event.toJSON();
  } catch (error) {
    if (error.message.includes('not registered') || error.message === 'Event not found') {
      throw error;
    }
    throw error;
  }
}

/**
 * Get user's registered events
 */
async function getUserEvents(userId) {
  try {
    const events = await Event.find({
      registeredAttendees: userId,
      status: { $in: ['upcoming', 'ongoing', 'completed'] }
    }).sort({ startDateTime: -1 });
    
    return events.map(e => e.toJSON());
  } catch (error) {
    throw error;
  }
}

/**
 * Add materials to event
 */
async function addMaterials(eventId, materials) {
  try {
    const event = await Event.findById(eventId);
    
    if (!event) {
      throw new NotFoundError('Event not found');
    }
    
    event.materials = event.materials || [];
    event.materials.push(...materials);
    await event.save();
    
    return event.toJSON();
  } catch (error) {
    if (error.message === 'Event not found') throw error;
    throw error;
  }
}

/**
 * Delete event (Admin)
 */
async function deleteEvent(eventId) {
  try {
    const event = await Event.findByIdAndDelete(eventId);
    
    if (!event) {
      throw new NotFoundError('Event not found');
    }
    
    return true;
  } catch (error) {
    if (error.message === 'Event not found') throw error;
    throw error;
  }
}

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  registerForEvent,
  unregisterFromEvent,
  getUserEvents,
  addMaterials,
  deleteEvent
};
