/**
 * Error Handling Middleware for Startup Backend System
 * 
 * This middleware provides centralized error handling for the entire application.
 * It catches all errors thrown in routes/controllers and formats them consistently
 * using the error utility and response utility.
 * 
 * Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7
 */

const { errorResponse } = require('../utils/response.util');
const {
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError
} = require('../utils/error.util');

/**
 * 404 Not Found Middleware
 * 
 * Catches all requests that don't match any defined routes and returns a 404 error.
 * This middleware should be placed after all route definitions in the Express app.
 * 
 * Requirement 12.5: Resource not found returns HTTP status 404
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @example
 * // In app.js, after all routes:
 * app.use(notFound);
 */
function notFound(req, res, next) {
  const error = new NotFoundError(`Route not found: ${req.method} ${req.originalUrl}`);
  next(error);
}

/**
 * Global Error Handler Middleware
 * 
 * Catches all errors thrown in the application and formats them into consistent
 * JSON responses. Maps custom error types to appropriate HTTP status codes.
 * 
 * Requirements:
 * - 12.1: Errors return JSON with success: false and message field
 * - 12.2: Validation errors return HTTP status 400
 * - 12.3: Authentication errors return HTTP status 401
 * - 12.4: Authorization errors return HTTP status 403
 * - 12.5: Not found errors return HTTP status 404
 * - 12.6: Conflict errors return HTTP status 409
 * - 12.7: Unexpected errors return HTTP status 500
 * - 12.8: Stack traces only included in development environment
 * - 12.9: Errors logged server-side with context information
 * 
 * @param {Error} err - Error object thrown in the application
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * @example
 * // In app.js, after all routes and notFound middleware:
 * app.use(errorHandler);
 * 
 * @example
 * // Handling ValidationError
 * throw new ValidationError('Email format is invalid');
 * // Response: { success: false, message: 'Email format is invalid' } with status 400
 * 
 * @example
 * // Handling UnauthorizedError
 * throw new UnauthorizedError('Invalid token');
 * // Response: { success: false, message: 'Invalid token' } with status 401
 */
function errorHandler(err, req, res, next) {
  // Default status code and message for unexpected errors
  let statusCode = 500;
  let message = 'Internal server error';
  let errors = null;

  // Map custom error types to appropriate status codes and messages
  if (err instanceof ValidationError) {
    // Requirement 12.2: Validation errors return HTTP status 400
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof UnauthorizedError) {
    // Requirement 12.3: Authentication errors return HTTP status 401
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof ForbiddenError) {
    // Requirement 12.4: Authorization errors return HTTP status 403
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof NotFoundError) {
    // Requirement 12.5: Not found errors return HTTP status 404
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof ConflictError) {
    // Requirement 12.6: Conflict errors return HTTP status 409
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof AppError) {
    // Generic AppError with custom status code
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'ValidationError' && err.errors) {
    // Mongoose validation error
    // Requirement 12.2: Validation errors return HTTP status 400
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map(e => e.message);
  } else if (err.name === 'CastError') {
    // Mongoose invalid ObjectId error
    // Requirement 12.2: Validation errors return HTTP status 400
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.code === 11000) {
    // MongoDB duplicate key error
    // Requirement 12.6: Conflict errors return HTTP status 409
    statusCode = 409;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else if (err.name === 'JsonWebTokenError') {
    // JWT invalid token error
    // Requirement 12.3: Authentication errors return HTTP status 401
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    // JWT expired token error
    // Requirement 12.3: Authentication errors return HTTP status 401
    statusCode = 401;
    message = 'Token expired';
  }

  // Requirement 12.9: Log error details server-side with context information
  // In production, use a proper logging library (winston, pino, etc.)
  console.error('Error occurred:', {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    statusCode,
    message: err.message,
    userId: req.user?.userId || 'unauthenticated',
    stack: err.stack
  });

  // Requirement 12.8: Stack traces only included in development environment
  // In production, never expose stack traces to clients for security reasons
  const response = {
    success: false,
    message
  };

  // Include validation errors array if present
  if (errors) {
    response.errors = errors;
  }

  // Include stack trace only in development environment
  if (process.env.NODE_ENV === 'development' && err.stack) {
    response.stack = err.stack;
  }

  // Requirement 12.1: Return JSON response with success: false and message
  return res.status(statusCode).json(response);
}

module.exports = {
  notFound,
  errorHandler
};
