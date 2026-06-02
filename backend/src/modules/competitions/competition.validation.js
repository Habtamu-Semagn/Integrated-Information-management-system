const { body, param, query } = require('express-validator');

const createCompetitionValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 20, max: 3000 }).withMessage('Description must be between 20 and 3000 characters'),
  body('competitionType')
    .notEmpty().withMessage('Competition type is required')
    .isIn(['pitch-competition', 'hackathon', 'idea-challenge', 'business-plan', 'innovation-award'])
    .withMessage('Invalid competition type'),
  body('registrationDeadline')
    .isISO8601().withMessage('Registration deadline must be a valid date'),
  body('competitionDate')
    .isISO8601().withMessage('Competition date must be a valid date'),
  body('prizes')
    .optional()
    .isObject().withMessage('Prizes must be an object'),
  body('maxParticipants')
    .optional()
    .isInt({ min: 1 }).withMessage('Max participants must be at least 1'),
  body('isVirtual')
    .optional()
    .isBoolean().withMessage('isVirtual must be a boolean')
];

const updateCompetitionValidation = [
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
  body('judges')
    .optional()
    .isArray().withMessage('Judges must be an array')
];

const competitionIdValidation = [
  param('id').isMongoId().withMessage('Invalid competition ID format')
];

const publishResultsValidation = [
  body('results')
    .notEmpty().withMessage('Results are required')
    .isObject().withMessage('Results must be an object'),
  body('results.firstPlaceWinner')
    .notEmpty().withMessage('First place winner is required'),
  body('results.results')
    .optional()
    .isArray().withMessage('Detailed results must be an array')
];

const getAllCompetitionsQueryValidation = [
  query('status')
    .optional()
    .isIn(['upcoming', 'ongoing', 'completed', 'cancelled'])
    .withMessage('Invalid status'),
  query('competitionType')
    .optional()
    .isIn(['pitch-competition', 'hackathon', 'idea-challenge', 'business-plan', 'innovation-award'])
    .withMessage('Invalid competition type')
];

module.exports = {
  createCompetitionValidation,
  updateCompetitionValidation,
  competitionIdValidation,
  publishResultsValidation,
  getAllCompetitionsQueryValidation
};
