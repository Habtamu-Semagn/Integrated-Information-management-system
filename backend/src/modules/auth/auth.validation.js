/**
 * Auth Module Validation Schemas
 * 
 * Defines validation rules for authentication endpoints.
 * 
 * Requirements: 1.4, 1.5, 1.6
 */

/**
 * Registration validation schema
 * 
 * Validates user registration data:
 * - name: 2-100 characters
 * - email: valid email format
 * - password: minimum 8 characters
 * 
 * Requirements: 1.4, 1.5, 1.6
 */
const registerSchema = {
  body: {
    name: {
      type: 'string',
      required: true,
      minLength: 2,
      maxLength: 100
    },
    email: {
      type: 'string',
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
      type: 'string',
      required: true,
      minLength: 8
    },
    role: {
      type: 'string',
      required: false,
      enum: ['applicant', 'staff', 'admin']
    }
  }
};

/**
 * Login validation schema
 * 
 * Validates user login credentials:
 * - email: required, valid email format
 * - password: required
 * 
 * Requirements: 1.6
 */
const loginSchema = {
  body: {
    email: {
      type: 'string',
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
      type: 'string',
      required: true
    }
  }
};

module.exports = {
  registerSchema,
  loginSchema
};
