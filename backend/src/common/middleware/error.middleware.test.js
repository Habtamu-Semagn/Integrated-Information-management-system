/**
 * Unit Tests for Error Handling Middleware
 * 
 * Tests the notFound and errorHandler middleware functions to ensure
 * proper error handling, status code mapping, and response formatting.
 */

const { notFound, errorHandler } = require('./error.middleware');
const {
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  AppError
} = require('../utils/error.util');

describe('Error Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    // Mock Express request object
    req = {
      method: 'GET',
      originalUrl: '/api/test',
      user: null
    };

    // Mock Express response object
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    // Mock Express next function
    next = jest.fn();

    // Suppress console.error during tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('notFound middleware', () => {
    it('should create NotFoundError and pass to next middleware', () => {
      notFound(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      const error = next.mock.calls[0][0];
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.message).toBe('Route not found: GET /api/test');
      expect(error.statusCode).toBe(404);
    });

    it('should include correct HTTP method and URL in error message', () => {
      req.method = 'POST';
      req.originalUrl = '/api/users/profile';

      notFound(req, res, next);

      const error = next.mock.calls[0][0];
      expect(error.message).toBe('Route not found: POST /api/users/profile');
    });
  });

  describe('errorHandler middleware - Custom Error Types', () => {
    it('should handle ValidationError with status 400', () => {
      const error = new ValidationError('Email format is invalid');

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Email format is invalid'
      });
    });

    it('should handle UnauthorizedError with status 401', () => {
      const error = new UnauthorizedError('Invalid token');

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid token'
      });
    });

    it('should handle ForbiddenError with status 403', () => {
      const error = new ForbiddenError('Access denied. Insufficient permissions');

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access denied. Insufficient permissions'
      });
    });

    it('should handle NotFoundError with status 404', () => {
      const error = new NotFoundError('User not found');

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found'
      });
    });

    it('should handle ConflictError with status 409', () => {
      const error = new ConflictError('Email already registered');

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Email already registered'
      });
    });

    it('should handle generic AppError with custom status code', () => {
      const error = new AppError('Custom error message', 418);

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(418);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Custom error message'
      });
    });
  });

  describe('errorHandler middleware - Mongoose Errors', () => {
    it('should handle Mongoose ValidationError with status 400', () => {
      const error = {
        name: 'ValidationError',
        errors: {
          email: { message: 'Email is required' },
          password: { message: 'Password must be at least 8 characters' }
        }
      };

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors: [
          'Email is required',
          'Password must be at least 8 characters'
        ]
      });
    });

    it('should handle Mongoose CastError with status 400', () => {
      const error = {
        name: 'CastError',
        path: 'userId',
        value: 'invalid-id'
      };

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid userId: invalid-id'
      });
    });

    it('should handle MongoDB duplicate key error with status 409', () => {
      const error = {
        code: 11000,
        keyPattern: { email: 1 }
      };

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Email already exists'
      });
    });
  });

  describe('errorHandler middleware - JWT Errors', () => {
    it('should handle JsonWebTokenError with status 401', () => {
      const error = {
        name: 'JsonWebTokenError',
        message: 'jwt malformed'
      };

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid token'
      });
    });

    it('should handle TokenExpiredError with status 401', () => {
      const error = {
        name: 'TokenExpiredError',
        message: 'jwt expired'
      };

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token expired'
      });
    });
  });

  describe('errorHandler middleware - Generic Errors', () => {
    it('should handle unexpected errors with status 500', () => {
      const error = new Error('Something went wrong');

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error'
      });
    });

    it('should handle errors without message with default message', () => {
      const error = new Error();

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error'
      });
    });
  });

  describe('errorHandler middleware - Environment-based Stack Traces', () => {
    it('should include stack trace in development environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const error = new Error('Test error');
      error.stack = 'Error: Test error\n    at test.js:1:1';

      errorHandler(error, req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error',
        stack: 'Error: Test error\n    at test.js:1:1'
      });

      process.env.NODE_ENV = originalEnv;
    });

    it('should NOT include stack trace in production environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const error = new Error('Test error');
      error.stack = 'Error: Test error\n    at test.js:1:1';

      errorHandler(error, req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error'
      });

      process.env.NODE_ENV = originalEnv;
    });

    it('should NOT include stack trace when NODE_ENV is not set', () => {
      const originalEnv = process.env.NODE_ENV;
      delete process.env.NODE_ENV;

      const error = new Error('Test error');
      error.stack = 'Error: Test error\n    at test.js:1:1';

      errorHandler(error, req, res, next);

      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall).not.toHaveProperty('stack');

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('errorHandler middleware - Error Logging', () => {
    it('should log error details with context information', () => {
      const error = new ValidationError('Test validation error');
      req.user = { userId: '123', role: 'applicant' };

      errorHandler(error, req, res, next);

      expect(console.error).toHaveBeenCalledWith(
        'Error occurred:',
        expect.objectContaining({
          timestamp: expect.any(String),
          method: 'GET',
          url: '/api/test',
          statusCode: 400,
          message: 'Test validation error',
          userId: '123',
          stack: expect.any(String)
        })
      );
    });

    it('should log "unauthenticated" when no user in request', () => {
      const error = new NotFoundError('Resource not found');

      errorHandler(error, req, res, next);

      expect(console.error).toHaveBeenCalledWith(
        'Error occurred:',
        expect.objectContaining({
          userId: 'unauthenticated'
        })
      );
    });

    it('should log error stack trace', () => {
      const error = new Error('Test error');
      error.stack = 'Error: Test error\n    at test.js:1:1';

      errorHandler(error, req, res, next);

      expect(console.error).toHaveBeenCalledWith(
        'Error occurred:',
        expect.objectContaining({
          stack: 'Error: Test error\n    at test.js:1:1'
        })
      );
    });
  });

  describe('errorHandler middleware - Response Format', () => {
    it('should always return success: false in error responses', () => {
      const errors = [
        new ValidationError('Validation error'),
        new UnauthorizedError('Auth error'),
        new ForbiddenError('Forbidden error'),
        new NotFoundError('Not found error'),
        new ConflictError('Conflict error'),
        new Error('Generic error')
      ];

      errors.forEach(error => {
        errorHandler(error, req, res, next);
        const jsonCall = res.json.mock.calls[res.json.mock.calls.length - 1][0];
        expect(jsonCall.success).toBe(false);
      });
    });

    it('should always include message field in error responses', () => {
      const errors = [
        new ValidationError('Validation error'),
        new UnauthorizedError('Auth error'),
        new ForbiddenError('Forbidden error'),
        new NotFoundError('Not found error'),
        new ConflictError('Conflict error'),
        new Error('Generic error')
      ];

      errors.forEach(error => {
        errorHandler(error, req, res, next);
        const jsonCall = res.json.mock.calls[res.json.mock.calls.length - 1][0];
        expect(jsonCall).toHaveProperty('message');
        expect(typeof jsonCall.message).toBe('string');
        expect(jsonCall.message.length).toBeGreaterThan(0);
      });
    });

    it('should include errors array only for validation errors', () => {
      const validationError = {
        name: 'ValidationError',
        errors: {
          field1: { message: 'Error 1' },
          field2: { message: 'Error 2' }
        }
      };

      errorHandler(validationError, req, res, next);

      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall).toHaveProperty('errors');
      expect(Array.isArray(jsonCall.errors)).toBe(true);
      expect(jsonCall.errors).toEqual(['Error 1', 'Error 2']);
    });

    it('should NOT include errors array for non-validation errors', () => {
      const error = new UnauthorizedError('Invalid token');

      errorHandler(error, req, res, next);

      const jsonCall = res.json.mock.calls[0][0];
      expect(jsonCall).not.toHaveProperty('errors');
    });
  });
});
