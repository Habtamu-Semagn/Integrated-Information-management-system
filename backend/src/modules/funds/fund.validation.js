const { body, param, query } = require('express-validator');

const createFundValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 20, max: 3000 }).withMessage('Description must be between 20 and 3000 characters'),
  body('fundType')
    .notEmpty().withMessage('Fund type is required')
    .isIn(['seed-funding', 'series-a', 'series-b', 'grant', 'accelerator', 'venture-capital'])
    .withMessage('Invalid fund type'),
  body('minimumAmount')
    .isInt({ min: 0 }).withMessage('Minimum amount must be a positive number'),
  body('maximumAmount')
    .isInt({ min: 0 }).withMessage('Maximum amount must be a positive number'),
  body('deadline')
    .isISO8601().withMessage('Deadline must be a valid date'),
  body('fundingOrganization')
    .trim()
    .notEmpty().withMessage('Funding organization is required'),
  body('requirements')
    .optional()
    .isObject().withMessage('Requirements must be an object')
];

const updateFundValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 20, max: 3000 }).withMessage('Description must be between 20 and 3000 characters'),
  body('fundType')
    .optional()
    .isIn(['seed-funding', 'series-a', 'series-b', 'grant', 'accelerator', 'venture-capital'])
    .withMessage('Invalid fund type'),
  body('status')
    .optional()
    .isIn(['open', 'closed', 'paused']).withMessage('Invalid status')
];

const fundIdValidation = [
  param('id').isMongoId().withMessage('Invalid fund ID format')
];

const applicationIdValidation = [
  param('applicationId').isMongoId().withMessage('Invalid application ID format')
];

const createFundApplicationValidation = [
  body('teamSize')
    .isInt({ min: 1 }).withMessage('Team size must be at least 1'),
  body('fundingRequired')
    .isInt({ min: 0 }).withMessage('Funding required must be a positive number'),
  body('useOfFunds')
    .trim()
    .notEmpty().withMessage('Use of funds is required')
    .isLength({ min: 20 }).withMessage('Use of funds description must be at least 20 characters'),
  body('businessPlan')
    .optional()
    .trim(),
  body('financialProjections')
    .optional()
    .trim()
];

const updateApplicationStatusValidation = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['submitted', 'under-review', 'approved', 'rejected', 'withdrawn'])
    .withMessage('Invalid status'),
  body('comments')
    .optional()
    .trim()
];

const getAllFundsQueryValidation = [
  query('status')
    .optional()
    .isIn(['open', 'closed', 'paused']).withMessage('Invalid status'),
  query('fundType')
    .optional()
    .isIn(['seed-funding', 'series-a', 'series-b', 'grant', 'accelerator', 'venture-capital'])
    .withMessage('Invalid fund type')
];

module.exports = {
  createFundValidation,
  updateFundValidation,
  fundIdValidation,
  applicationIdValidation,
  createFundApplicationValidation,
  updateApplicationStatusValidation,
  getAllFundsQueryValidation
};
