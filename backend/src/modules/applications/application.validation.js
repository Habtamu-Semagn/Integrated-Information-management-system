/**
 * Application Module Validation Schemas
 * 
 * Defines validation rules for application endpoints.
 * 
 * Requirements: 5.4, 5.5, 5.6, 5.7, 5.8, 7.4, 11.6
 */

const { APPLICATION_STATUS } = require('../../common/constants/status.constant');

/**
 * Create application validation schema
 * 
 * Validates application creation data with all required fields and length constraints.
 * 
 * Requirements: 5.4, 5.5, 5.6, 5.7, 5.8
 */
const createApplicationSchema = {
  body: {
    startupName: {
      type: 'string',
      required: true,
      minLength: 3,
      maxLength: 200
    },
    description: {
      type: 'string',
      required: true,
      minLength: 10,
      maxLength: 1000
    },
    problemStatement: {
      type: 'string',
      required: true,
      minLength: 10,
      maxLength: 1000
    },
    solution: {
      type: 'string',
      required: true,
      minLength: 10,
      maxLength: 1000
    },
    targetMarket: {
      type: 'string',
      required: true,
      minLength: 5,
      maxLength: 500
    }
  }
};

/**
 * Update status validation schema
 * 
 * Validates status update with enum constraint.
 * 
 * Requirements: 7.4
 */
const updateStatusSchema = {
  body: {
    status: {
      type: 'string',
      required: true,
      enum: Object.values(APPLICATION_STATUS)
    }
  }
};

/**
 * Application ID parameter validation schema
 * 
 * Validates MongoDB ObjectId format in URL parameters.
 * 
 * Requirements: 11.6
 */
const applicationIdSchema = {
  params: {
    id: {
      type: 'string',
      required: true,
      pattern: /^[0-9a-fA-F]{24}$/
    }
  }
};

module.exports = {
  createApplicationSchema,
  updateStatusSchema,
  applicationIdSchema
};
