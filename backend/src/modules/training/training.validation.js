const { body, param, query, validationResult } = require('express-validator');

const createTrainingValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['business-fundamentals', 'marketing', 'finance', 'technology', 'legal', 'sales', 'operations'])
    .withMessage('Invalid category'),
  body('level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Level must be beginner, intermediate, or advanced'),
  body('instructor')
    .trim()
    .notEmpty().withMessage('Instructor is required'),
  body('duration')
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive number'),
  body('content')
    .trim()
    .notEmpty().withMessage('Content is required')
    .isLength({ min: 20 }).withMessage('Content must be at least 20 characters'),
  body('materials')
    .optional()
    .isArray().withMessage('Materials must be an array')
];

const updateTrainingValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters'),
  body('category')
    .optional()
    .isIn(['business-fundamentals', 'marketing', 'finance', 'technology', 'legal', 'sales', 'operations'])
    .withMessage('Invalid category'),
  body('level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Level must be beginner, intermediate, or advanced'),
  body('duration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive number'),
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean')
];

const getTrainingByIdValidation = [
  param('id')
    .isMongoId().withMessage('Invalid training ID format')
];

const trainingIdValidation = [
  param('id')
    .isMongoId().withMessage('Invalid training ID format')
];

const getTrainingsQueryValidation = [
  query('category')
    .optional()
    .isIn(['business-fundamentals', 'marketing', 'finance', 'technology', 'legal', 'sales', 'operations'])
    .withMessage('Invalid category'),
  query('level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Invalid level')
];

module.exports = {
  createTrainingValidation,
  updateTrainingValidation,
  getTrainingByIdValidation,
  trainingIdValidation,
  getTrainingsQueryValidation
};
