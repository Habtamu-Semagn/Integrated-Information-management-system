/**
 * Unit Tests for Custom Error Classes
 * 
 * Tests verify that each error class:
 * - Has the correct statusCode property
 * - Has the correct message property
 * - Extends Error properly
 * - Has the correct name property
 * - Maintains proper stack trace
 */

const {
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError
} = require('./error.util');

describe('Custom Error Classes', () => {
  describe('AppError', () => {
    it('should create an error with custom message and status code', () => {
      const error = new AppError('Custom error message', 500);
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Custom error message');
      expect(error.statusCode).toBe(500);
      expect(error.name).toBe('AppError');
    });

    it('should have a stack trace', () => {
      const error = new AppError('Test error', 500);
      
      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('AppError');
    });
  });

  describe('ValidationError', () => {
    it('should create a validation error with status code 400', () => {
      const error = new ValidationError('Invalid email format');
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.message).toBe('Invalid email format');
      expect(error.statusCode).toBe(400);
      expect(error.name).toBe('ValidationError');
    });

    it('should use default message when no message provided', () => {
      const error = new ValidationError();
      
      expect(error.message).toBe('Validation failed');
      expect(error.statusCode).toBe(400);
    });

    it('should have a stack trace', () => {
      const error = new ValidationError('Test validation error');
      
      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('ValidationError');
    });
  });

  describe('UnauthorizedError', () => {
    it('should create an unauthorized error with status code 401', () => {
      const error = new UnauthorizedError('Invalid credentials');
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(UnauthorizedError);
      expect(error.message).toBe('Invalid credentials');
      expect(error.statusCode).toBe(401);
      expect(error.name).toBe('UnauthorizedError');
    });

    it('should use default message when no message provided', () => {
      const error = new UnauthorizedError();
      
      expect(error.message).toBe('Authentication required');
      expect(error.statusCode).toBe(401);
    });

    it('should handle various authentication error messages', () => {
      const errors = [
        new UnauthorizedError('No token provided'),
        new UnauthorizedError('Invalid token'),
        new UnauthorizedError('Token expired')
      ];
      
      errors.forEach(error => {
        expect(error.statusCode).toBe(401);
        expect(error).toBeInstanceOf(UnauthorizedError);
      });
    });
  });

  describe('ForbiddenError', () => {
    it('should create a forbidden error with status code 403', () => {
      const error = new ForbiddenError('Only staff can update status');
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(ForbiddenError);
      expect(error.message).toBe('Only staff can update status');
      expect(error.statusCode).toBe(403);
      expect(error.name).toBe('ForbiddenError');
    });

    it('should use default message when no message provided', () => {
      const error = new ForbiddenError();
      
      expect(error.message).toBe('Access denied. Insufficient permissions');
      expect(error.statusCode).toBe(403);
    });

    it('should handle various authorization error messages', () => {
      const errors = [
        new ForbiddenError('Only applicants can create applications'),
        new ForbiddenError('Access denied. Insufficient permissions')
      ];
      
      errors.forEach(error => {
        expect(error.statusCode).toBe(403);
        expect(error).toBeInstanceOf(ForbiddenError);
      });
    });
  });

  describe('NotFoundError', () => {
    it('should create a not found error with status code 404', () => {
      const error = new NotFoundError('User not found');
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.message).toBe('User not found');
      expect(error.statusCode).toBe(404);
      expect(error.name).toBe('NotFoundError');
    });

    it('should use default message when no message provided', () => {
      const error = new NotFoundError();
      
      expect(error.message).toBe('Resource not found');
      expect(error.statusCode).toBe(404);
    });

    it('should handle various resource not found messages', () => {
      const errors = [
        new NotFoundError('Application not found'),
        new NotFoundError('User not found'),
        new NotFoundError('Resource not found')
      ];
      
      errors.forEach(error => {
        expect(error.statusCode).toBe(404);
        expect(error).toBeInstanceOf(NotFoundError);
      });
    });
  });

  describe('ConflictError', () => {
    it('should create a conflict error with status code 409', () => {
      const error = new ConflictError('Email already registered');
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(ConflictError);
      expect(error.message).toBe('Email already registered');
      expect(error.statusCode).toBe(409);
      expect(error.name).toBe('ConflictError');
    });

    it('should use default message when no message provided', () => {
      const error = new ConflictError();
      
      expect(error.message).toBe('Resource conflict');
      expect(error.statusCode).toBe(409);
    });

    it('should handle various conflict error messages', () => {
      const errors = [
        new ConflictError('Email already registered'),
        new ConflictError('Application already has this status')
      ];
      
      errors.forEach(error => {
        expect(error.statusCode).toBe(409);
        expect(error).toBeInstanceOf(ConflictError);
      });
    });
  });

  describe('Error Inheritance Chain', () => {
    it('should maintain proper inheritance chain for all error types', () => {
      const errors = [
        new ValidationError('test'),
        new UnauthorizedError('test'),
        new ForbiddenError('test'),
        new NotFoundError('test'),
        new ConflictError('test')
      ];
      
      errors.forEach(error => {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(AppError);
      });
    });

    it('should allow instanceof checks to distinguish error types', () => {
      const validationError = new ValidationError('test');
      const unauthorizedError = new UnauthorizedError('test');
      
      expect(validationError).toBeInstanceOf(ValidationError);
      expect(validationError).not.toBeInstanceOf(UnauthorizedError);
      
      expect(unauthorizedError).toBeInstanceOf(UnauthorizedError);
      expect(unauthorizedError).not.toBeInstanceOf(ValidationError);
    });
  });

  describe('Error Properties', () => {
    it('should have both message and statusCode properties', () => {
      const errors = [
        { error: new ValidationError('test'), expectedCode: 400 },
        { error: new UnauthorizedError('test'), expectedCode: 401 },
        { error: new ForbiddenError('test'), expectedCode: 403 },
        { error: new NotFoundError('test'), expectedCode: 404 },
        { error: new ConflictError('test'), expectedCode: 409 }
      ];
      
      errors.forEach(({ error, expectedCode }) => {
        expect(error.message).toBeDefined();
        expect(error.statusCode).toBe(expectedCode);
        expect(typeof error.message).toBe('string');
        expect(typeof error.statusCode).toBe('number');
      });
    });

    it('should preserve custom error messages', () => {
      const customMessage = 'This is a very specific error message';
      const error = new ValidationError(customMessage);
      
      expect(error.message).toBe(customMessage);
    });
  });

  describe('Error Throwing and Catching', () => {
    it('should be throwable and catchable', () => {
      expect(() => {
        throw new ValidationError('Test error');
      }).toThrow(ValidationError);
      
      expect(() => {
        throw new ValidationError('Test error');
      }).toThrow('Test error');
    });

    it('should be catchable as Error', () => {
      try {
        throw new UnauthorizedError('Test');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.statusCode).toBe(401);
      }
    });

    it('should be catchable as AppError', () => {
      try {
        throw new ForbiddenError('Test');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.statusCode).toBe(403);
      }
    });
  });

  describe('Status Code Mapping', () => {
    it('should map each error type to correct HTTP status code', () => {
      const statusCodeMap = [
        { ErrorClass: ValidationError, expectedCode: 400, name: 'ValidationError' },
        { ErrorClass: UnauthorizedError, expectedCode: 401, name: 'UnauthorizedError' },
        { ErrorClass: ForbiddenError, expectedCode: 403, name: 'ForbiddenError' },
        { ErrorClass: NotFoundError, expectedCode: 404, name: 'NotFoundError' },
        { ErrorClass: ConflictError, expectedCode: 409, name: 'ConflictError' }
      ];
      
      statusCodeMap.forEach(({ ErrorClass, expectedCode, name }) => {
        const error = new ErrorClass('test');
        expect(error.statusCode).toBe(expectedCode);
        expect(error.name).toBe(name);
      });
    });
  });
});
