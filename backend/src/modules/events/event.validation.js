const { body, param, query } = require('express-validator');

const createEventValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 20, max: 3000 }).withMessage('Description must be between 20 and 3000 characters'),
  body('eventType')
    .notEmpty().withMessage('Event type is required')
    .isIn(['webinar', 'workshop', 'networking', 'conference', 'meetup', 'masterclass'])
    .withMessage('Invalid event type'),
  body('startDateTime')
    .isISO8601().withMessage('Start date time must be a valid date'),
  body('endDateTime')
    .isISO8601().withMessage('End date time must be a valid date'),
  body('isVirtual')
    .optional()
    .isBoolean().withMessage('isVirtual must be a boolean'),
  body('isHybrid')
    .optional()
    .isBoolean().withMessage('isHybrid must be a boolean'),
  body('capacity')
    .optional()
    .isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('category')
    .optional()
    .isIn(['technology', 'finance', 'marketing', 'operations', 'general'])
    .withMessage('Invalid category')
];

const updateEventValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 20, max: 3000 }).withMessage('Description must be between 20 and 3000 characters'),
  body('status')
    .optional()
    .isIn(['upcoming', 'ongoing', 'completed', 'cancelled'])
    .withMessage('Invalid status'),
  body('eventType')
    .optional()
    .isIn(['webinar', 'workshop', 'networking', 'conference', 'meetup', 'masterclass'])
    .withMessage('Invalid event type')
];

const eventIdValidation = [
  param('id').isMongoId().withMessage('Invalid event ID format')
];

const addMaterialsValidation = [
  body('materials')
    .isArray().withMessage('Materials must be an array'),
  body('materials.*.title')
    .notEmpty().withMessage('Material title is required'),
  body('materials.*.url')
    .notEmpty().withMessage('Material URL is required')
    .isURL().withMessage('Invalid URL format')
];

const getAllEventsQueryValidation = [
  query('status')
    .optional()
    .isIn(['upcoming', 'ongoing', 'completed', 'cancelled'])
    .withMessage('Invalid status'),
  query('eventType')
    .optional()
    .isIn(['webinar', 'workshop', 'networking', 'conference', 'meetup', 'masterclass'])
    .withMessage('Invalid event type'),
  query('category')
    .optional()
    .isIn(['technology', 'finance', 'marketing', 'operations', 'general'])
    .withMessage('Invalid category')
];

module.exports = {
  createEventValidation,
  updateEventValidation,
  eventIdValidation,
  addMaterialsValidation,
  getAllEventsQueryValidation
};
