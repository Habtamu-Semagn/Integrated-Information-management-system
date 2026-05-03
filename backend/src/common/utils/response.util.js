/**
 * Response Utility Functions for Startup Backend System
 * 
 * These utility functions provide consistent response formatting across all API endpoints
 * with standardized JSON structure for success and error responses.
 * 
 * Requirements: 13.1, 13.2, 13.3
 */

/**
 * Format a successful API response
 * 
 * Creates a standardized success response with success flag, data payload, and optional message.
 * All successful operations should use this formatter to ensure consistent response structure.
 * 
 * Requirement 13.1: Success responses have success: true and data field
 * Requirement 13.3: All responses use application/json Content-Type
 * 
 * @param {Object} res - Express response object
 * @param {*} data - Response data payload (can be object, array, string, etc.)
 * @param {string} [message=''] - Optional success message
 * @param {number} [statusCode=200] - HTTP status code (default: 200 OK)
 * @returns {Object} Express response object
 * 
 * @example
 * // Simple success response
 * successResponse(res, { id: '123', name: 'John' });
 * // Returns: { success: true, data: { id: '123', name: 'John' } }
 * 
 * @example
 * // Success response with message
 * successResponse(res, user, 'User created successfully', 201);
 * // Returns: { success: true, data: user, message: 'User created successfully' }
 * 
 * @example
 * // Success response with array data
 * successResponse(res, applications, 'Applications retrieved successfully');
 * // Returns: { success: true, data: [...applications], message: '...' }
 */
function successResponse(res, data, message = '', statusCode = 200) {
  const response = {
    success: true,
    data
  };

  // Only include message field if a message is provided
  if (message) {
    response.message = message;
  }

  return res.status(statusCode).json(response);
}

/**
 * Format an error API response
 * 
 * Creates a standardized error response with success flag and error message.
 * All error conditions should use this formatter to ensure consistent error structure.
 * 
 * Requirement 13.2: Error responses have success: false and message field
 * Requirement 13.3: All responses use application/json Content-Type
 * 
 * @param {Object} res - Express response object
 * @param {string} message - Error message describing what went wrong
 * @param {number} [statusCode=500] - HTTP status code (default: 500 Internal Server Error)
 * @param {Array<string>} [errors=null] - Optional array of detailed error messages (for validation errors)
 * @returns {Object} Express response object
 * 
 * @example
 * // Simple error response
 * errorResponse(res, 'User not found', 404);
 * // Returns: { success: false, message: 'User not found' }
 * 
 * @example
 * // Error response with validation details
 * errorResponse(res, 'Validation failed', 400, [
 *   'Email format is invalid',
 *   'Password must be at least 8 characters'
 * ]);
 * // Returns: { success: false, message: 'Validation failed', errors: [...] }
 * 
 * @example
 * // Unauthorized error
 * errorResponse(res, 'Invalid credentials', 401);
 * // Returns: { success: false, message: 'Invalid credentials' }
 */
function errorResponse(res, message, statusCode = 500, errors = null) {
  const response = {
    success: false,
    message
  };

  // Only include errors array if provided (typically for validation errors)
  if (errors && Array.isArray(errors) && errors.length > 0) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
}

module.exports = {
  successResponse,
  errorResponse
};
