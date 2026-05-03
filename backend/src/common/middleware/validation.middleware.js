/**
 * Request Validation Middleware
 * 
 * Provides middleware for validating request data against defined schemas.
 * Returns 400 error with detailed validation messages on failure.
 * 
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7
 */

const { ValidationError } = require('../utils/error.util');

/**
 * Validate Request Middleware Factory
 * 
 * Creates a middleware function that validates request body against a provided schema.
 * Supports validation for required fields, types, lengths, and formats.
 * 
 * @param {Object} schema - Validation schema object
 * @param {Object} schema.body - Schema for request body validation
 * @returns {Function} Express middleware function
 * @throws {ValidationError} If validation fails
 * 
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7
 * 
 * Preconditions:
 * - schema object must be provided
 * - express.json() middleware must be configured before this middleware
 * 
 * Postconditions:
 * - If validation passes: next() is called
 * - If validation fails: ValidationError is thrown with detailed messages
 * 
 * @example
 * const schema = {
 *   body: {
 *     name: { type: 'string', required: true, minLength: 2, maxLength: 100 },
 *     email: { type: 'string', required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
 *   }
 * };
 * router.post('/register', validateRequest(schema), register);
 */
function validateRequest(schema) {
  return (req, res, next) => {
    try {
      const errors = [];

      // Validate request body if schema.body is defined
      if (schema.body) {
        const bodyErrors = validateObject(req.body, schema.body, 'body');
        errors.push(...bodyErrors);
      }

      // Validate request params if schema.params is defined
      if (schema.params) {
        const paramsErrors = validateObject(req.params, schema.params, 'params');
        errors.push(...paramsErrors);
      }

      // Validate request query if schema.query is defined
      if (schema.query) {
        const queryErrors = validateObject(req.query, schema.query, 'query');
        errors.push(...queryErrors);
      }

      // If there are validation errors, throw ValidationError
      if (errors.length > 0) {
        throw new ValidationError(errors.join(', '));
      }

      // Validation passed, proceed to next middleware
      next();
    } catch (error) {
      // Pass error to error handling middleware
      next(error);
    }
  };
}

/**
 * Validate object against schema
 * 
 * @param {Object} data - Data object to validate
 * @param {Object} schema - Schema object with field definitions
 * @param {string} location - Location of data (body, params, query)
 * @returns {Array<string>} Array of error messages
 */
function validateObject(data, schema, location) {
  const errors = [];

  // Check each field in the schema
  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];

    // Check if field is required
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field} is required`);
      continue;
    }

    // Skip further validation if field is not required and not provided
    if (!rules.required && (value === undefined || value === null || value === '')) {
      continue;
    }

    // Validate type
    if (rules.type) {
      const actualType = Array.isArray(value) ? 'array' : typeof value;
      if (actualType !== rules.type) {
        errors.push(`${field} must be of type ${rules.type}`);
        continue;
      }
    }

    // Validate string length
    if (rules.type === 'string' && typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters long`);
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${field} must not exceed ${rules.maxLength} characters`);
      }
    }

    // Validate number range
    if (rules.type === 'number' && typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        errors.push(`${field} must be at least ${rules.min}`);
      }
      if (rules.max !== undefined && value > rules.max) {
        errors.push(`${field} must not exceed ${rules.max}`);
      }
    }

    // Validate pattern (regex)
    if (rules.pattern && typeof value === 'string') {
      if (!rules.pattern.test(value)) {
        errors.push(`${field} format is invalid`);
      }
    }

    // Validate enum values
    if (rules.enum && Array.isArray(rules.enum)) {
      if (!rules.enum.includes(value)) {
        errors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
      }
    }

    // Custom validation function
    if (rules.custom && typeof rules.custom === 'function') {
      const customError = rules.custom(value, data);
      if (customError) {
        errors.push(customError);
      }
    }
  }

  return errors;
}

module.exports = {
  validateRequest
};
