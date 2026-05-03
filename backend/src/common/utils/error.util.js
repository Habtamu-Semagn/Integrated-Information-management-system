/**
 * Custom Error Classes for Startup Backend System
 * 
 * These error classes provide consistent error handling across the application
 * with appropriate HTTP status codes and messages.
 * 
 * Requirements: 12.1, 12.2, 12.3, 12.4, 12.5
 */

/**
 * Base class for custom application errors
 * Extends the native Error class with statusCode property
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    
    // Maintains proper stack trace for where error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * ValidationError - 400 Bad Request
 * Used when request data fails validation (missing fields, invalid format, constraint violations)
 * 
 * Requirement 12.2: Validation errors return HTTP status 400
 * 
 * @example
 * throw new ValidationError('Email format is invalid');
 * throw new ValidationError('Password must be at least 8 characters');
 */
class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, 400);
  }
}

/**
 * UnauthorizedError - 401 Unauthorized
 * Used when authentication fails (missing token, invalid token, expired token, wrong credentials)
 * 
 * Requirement 12.3: Authentication errors return HTTP status 401
 * 
 * @example
 * throw new UnauthorizedError('No token provided');
 * throw new UnauthorizedError('Invalid credentials');
 * throw new UnauthorizedError('Token expired');
 */
class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401);
  }
}

/**
 * ForbiddenError - 403 Forbidden
 * Used when user is authenticated but lacks permission to access resource
 * 
 * Requirement 12.4: Authorization errors return HTTP status 403
 * 
 * @example
 * throw new ForbiddenError('Access denied. Insufficient permissions');
 * throw new ForbiddenError('Only applicants can create applications');
 */
class ForbiddenError extends AppError {
  constructor(message = 'Access denied. Insufficient permissions') {
    super(message, 403);
  }
}

/**
 * NotFoundError - 404 Not Found
 * Used when requested resource does not exist in the database
 * 
 * Requirement 12.5: Resource not found errors return HTTP status 404
 * 
 * @example
 * throw new NotFoundError('User not found');
 * throw new NotFoundError('Application not found');
 */
class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

/**
 * ConflictError - 409 Conflict
 * Used when operation conflicts with existing data (duplicate email, duplicate resource)
 * 
 * Requirement 12.6: Conflict errors return HTTP status 409
 * 
 * @example
 * throw new ConflictError('Email already registered');
 * throw new ConflictError('Application already has this status');
 */
class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409);
  }
}

module.exports = {
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError
};
