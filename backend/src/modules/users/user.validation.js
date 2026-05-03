/**
 * User Module Validation Schemas
 * 
 * Defines validation rules for user profile endpoints.
 * 
 * Requirements: 1.4, 1.6, 8.2
 */

/**
 * Update profile validation schema
 * 
 * Validates profile update data.
 * Both fields are optional, but at least one should be provided.
 * 
 * Requirements: 1.4, 1.6, 8.2
 */
const updateProfileSchema = {
  body: {
    name: {
      type: 'string',
      required: false,
      minLength: 2,
      maxLength: 100
    },
    email: {
      type: 'string',
      required: false,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }
  }
};

module.exports = {
  updateProfileSchema
};
