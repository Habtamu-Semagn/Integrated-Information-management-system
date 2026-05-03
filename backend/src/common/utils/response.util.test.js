/**
 * Unit Tests for Response Utility Functions
 * 
 * Tests verify that response formatters:
 * - Return correct JSON structure (success, data, message fields)
 * - Set appropriate HTTP status codes
 * - Handle various data types correctly
 * - Maintain consistent response format across all scenarios
 * 
 * Requirements: 13.1, 13.2, 13.3
 */

const { successResponse, errorResponse } = require('./response.util');

describe('Response Utility Functions', () => {
  let mockRes;

  beforeEach(() => {
    // Create a mock Express response object
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  describe('successResponse', () => {
    describe('Basic Functionality', () => {
      it('should return success response with data and default status 200', () => {
        const data = { id: '123', name: 'John Doe' };
        
        successResponse(mockRes, data);
        
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
          success: true,
          data: data
        });
      });

      it('should return success response with custom status code', () => {
        const data = { id: '123', name: 'John Doe' };
        
        successResponse(mockRes, data, '', 201);
        
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({
          success: true,
          data: data
        });
      });

      it('should include message when provided', () => {
        const data = { id: '123' };
        const message = 'User created successfully';
        
        successResponse(mockRes, data, message);
        
        expect(mockRes.json).toHaveBeenCalledWith({
          success: true,
          data: data,
          message: message
        });
      });

      it('should not include message field when message is empty string', () => {
        const data = { id: '123' };
        
        successResponse(mockRes, data, '');
        
        expect(mockRes.json).toHaveBeenCalledWith({
          success: true,
          data: data
        });
      });

      it('should not include message field when message is not provided', () => {
        const data = { id: '123' };
        
        successResponse(mockRes, data);
        
        const callArgs = mockRes.json.mock.calls[0][0];
        expect(callArgs).toHaveProperty('success', true);
        expect(callArgs).toHaveProperty('data');
        expect(callArgs).not.toHaveProperty('message');
      });
    });

    describe('Data Type Handling', () => {
      it('should handle object data', () => {
        const data = { id: '123', name: 'John', email: 'john@example.com' };
        
        successResponse(mockRes, data);
        
        expect(mockRes.json).toHaveBeenCalledWith({
          success: true,
          data: data
        });
      });

      it('should handle array data', () => {
        const data = [
          { id: '1', name: 'User 1' },
          { id: '2', name: 'User 2' }
        ];
        
        successResponse(mockRes, data);
        
        expect(mockRes.json).toHaveBeenCalledWith({
          success: true,
          data: data
        });
      });

      it('should handle string data', () => {
        const data = 'Operation completed';
        
        successResponse(mockRes, data);
        
        expect(mockRes.json).toHaveBeenCalledWith({
          success: true,
          data: data
        });
      });

      it('should handle number data', () => {
        const data = 42;
        
        successResponse(mockRes, data);
        
        expect(mockRes.json).toHaveBeenCalledWith({
          success: true,
          data: data
        });
      });

      it('should handle boolean data', () => {
        const data = true;
        
        successResponse(mockRes, data);
        
        expect(mockRes.json).toHaveBeenCalledWith({
          success: true,
          data: data
        });
      });

      it('should handle null data', () => {
        const data = null;
        
        successResponse(mockRes, data);
        
        expect(mockRes.json).toHaveBeenCalledWith({
          success: true,
          data: null
        });
      });

      it('should handle empty object data', () => {
        const data = {};
        
        successResponse(mockRes, data);
        
        expect(mockRes.json).toHaveBeenCalledWith({
          success: true,
          data: data
        });
      });

      it('should handle empty array data', () => {
        const data = [];
        
        successResponse(mockRes, data);
        
        expect(mockRes.json).toHaveBeenCalledWith({
          success: true,
          data: data
        });
      });
    });

    describe('Status Code Handling', () => {
      it('should handle 200 OK status', () => {
        successResponse(mockRes, { id: '123' }, '', 200);
        expect(mockRes.status).toHaveBeenCalledWith(200);
      });

      it('should handle 201 Created status', () => {
        successResponse(mockRes, { id: '123' }, 'Resource created', 201);
        expect(mockRes.status).toHaveBeenCalledWith(201);
      });

      it('should handle 204 No Content status', () => {
        successResponse(mockRes, null, '', 204);
        expect(mockRes.status).toHaveBeenCalledWith(204);
      });
    });

    describe('Response Structure Validation', () => {
      it('should always have success field set to true', () => {
        successResponse(mockRes, { id: '123' });
        
        const callArgs = mockRes.json.mock.calls[0][0];
        expect(callArgs.success).toBe(true);
      });

      it('should always have data field', () => {
        successResponse(mockRes, { id: '123' });
        
        const callArgs = mockRes.json.mock.calls[0][0];
        expect(callArgs).toHaveProperty('data');
      });

      it('should return the response object for chaining', () => {
        const result = successResponse(mockRes, { id: '123' });
        expect(result).toBe(mockRes);
      });
    });

    describe('Real-World Scenarios', () => {
      it('should format user registration response', () => {
        const userData = {
          id: '507f1f77bcf86cd799439011',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'applicant',
          createdAt: '2024-01-15T10:30:00.000Z'
        };
        
        successResponse(mockRes, userData, 'User registered successfully', 201);
        
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({
          success: true,
          data: userData,
          message: 'User registered successfully'
        });
      });

      it('should format application list response', () => {
        const applications = [
          { id: '1', startupName: 'Startup A', status: 'pending' },
          { id: '2', startupName: 'Startup B', status: 'approved' }
        ];
        
        successResponse(mockRes, applications, 'Applications retrieved successfully');
        
        expect(mockRes.json).toHaveBeenCalledWith({
          success: true,
          data: applications,
          message: 'Applications retrieved successfully'
        });
      });

      it('should format login response', () => {
        const userData = {
          id: '507f1f77bcf86cd799439011',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'applicant'
        };
        
        successResponse(mockRes, userData, 'Login successful');
        
        expect(mockRes.json).toHaveBeenCalledWith({
          success: true,
          data: userData,
          message: 'Login successful'
        });
      });
    });
  });

  describe('errorResponse', () => {
    describe('Basic Functionality', () => {
      it('should return error response with message and default status 500', () => {
        const message = 'Internal server error';
        
        errorResponse(mockRes, message);
        
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
          success: false,
          message: message
        });
      });

      it('should return error response with custom status code', () => {
        const message = 'User not found';
        
        errorResponse(mockRes, message, 404);
        
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({
          success: false,
          message: message
        });
      });

      it('should include errors array when provided', () => {
        const message = 'Validation failed';
        const errors = [
          'Email format is invalid',
          'Password must be at least 8 characters'
        ];
        
        errorResponse(mockRes, message, 400, errors);
        
        expect(mockRes.json).toHaveBeenCalledWith({
          success: false,
          message: message,
          errors: errors
        });
      });

      it('should not include errors field when errors is null', () => {
        const message = 'User not found';
        
        errorResponse(mockRes, message, 404, null);
        
        const callArgs = mockRes.json.mock.calls[0][0];
        expect(callArgs).toHaveProperty('success', false);
        expect(callArgs).toHaveProperty('message');
        expect(callArgs).not.toHaveProperty('errors');
      });

      it('should not include errors field when errors is empty array', () => {
        const message = 'User not found';
        
        errorResponse(mockRes, message, 404, []);
        
        const callArgs = mockRes.json.mock.calls[0][0];
        expect(callArgs).not.toHaveProperty('errors');
      });

      it('should not include errors field when errors is not an array', () => {
        const message = 'User not found';
        
        errorResponse(mockRes, message, 404, 'not an array');
        
        const callArgs = mockRes.json.mock.calls[0][0];
        expect(callArgs).not.toHaveProperty('errors');
      });
    });

    describe('Status Code Handling', () => {
      it('should handle 400 Bad Request status', () => {
        errorResponse(mockRes, 'Validation failed', 400);
        expect(mockRes.status).toHaveBeenCalledWith(400);
      });

      it('should handle 401 Unauthorized status', () => {
        errorResponse(mockRes, 'Invalid credentials', 401);
        expect(mockRes.status).toHaveBeenCalledWith(401);
      });

      it('should handle 403 Forbidden status', () => {
        errorResponse(mockRes, 'Access denied', 403);
        expect(mockRes.status).toHaveBeenCalledWith(403);
      });

      it('should handle 404 Not Found status', () => {
        errorResponse(mockRes, 'Resource not found', 404);
        expect(mockRes.status).toHaveBeenCalledWith(404);
      });

      it('should handle 409 Conflict status', () => {
        errorResponse(mockRes, 'Email already registered', 409);
        expect(mockRes.status).toHaveBeenCalledWith(409);
      });

      it('should handle 500 Internal Server Error status', () => {
        errorResponse(mockRes, 'Database connection error', 500);
        expect(mockRes.status).toHaveBeenCalledWith(500);
      });
    });

    describe('Response Structure Validation', () => {
      it('should always have success field set to false', () => {
        errorResponse(mockRes, 'Error message', 400);
        
        const callArgs = mockRes.json.mock.calls[0][0];
        expect(callArgs.success).toBe(false);
      });

      it('should always have message field', () => {
        errorResponse(mockRes, 'Error message', 400);
        
        const callArgs = mockRes.json.mock.calls[0][0];
        expect(callArgs).toHaveProperty('message');
        expect(typeof callArgs.message).toBe('string');
      });

      it('should return the response object for chaining', () => {
        const result = errorResponse(mockRes, 'Error message', 400);
        expect(result).toBe(mockRes);
      });
    });

    describe('Real-World Error Scenarios', () => {
      it('should format validation error response', () => {
        const message = 'Validation failed';
        const errors = [
          'startupName must be at least 3 characters',
          'description must be at least 10 characters'
        ];
        
        errorResponse(mockRes, message, 400, errors);
        
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
          success: false,
          message: message,
          errors: errors
        });
      });

      it('should format authentication error response', () => {
        const message = 'Invalid credentials';
        
        errorResponse(mockRes, message, 401);
        
        expect(mockRes.json).toHaveBeenCalledWith({
          success: false,
          message: message
        });
      });

      it('should format authorization error response', () => {
        const message = 'Access denied. Insufficient permissions';
        
        errorResponse(mockRes, message, 403);
        
        expect(mockRes.json).toHaveBeenCalledWith({
          success: false,
          message: message
        });
      });

      it('should format not found error response', () => {
        const message = 'Application not found';
        
        errorResponse(mockRes, message, 404);
        
        expect(mockRes.json).toHaveBeenCalledWith({
          success: false,
          message: message
        });
      });

      it('should format conflict error response', () => {
        const message = 'Email already registered';
        
        errorResponse(mockRes, message, 409);
        
        expect(mockRes.json).toHaveBeenCalledWith({
          success: false,
          message: message
        });
      });

      it('should format server error response', () => {
        const message = 'Database connection error';
        
        errorResponse(mockRes, message, 500);
        
        expect(mockRes.json).toHaveBeenCalledWith({
          success: false,
          message: message
        });
      });
    });

    describe('Errors Array Handling', () => {
      it('should handle single error in array', () => {
        const errors = ['Email format is invalid'];
        
        errorResponse(mockRes, 'Validation failed', 400, errors);
        
        const callArgs = mockRes.json.mock.calls[0][0];
        expect(callArgs.errors).toEqual(errors);
      });

      it('should handle multiple errors in array', () => {
        const errors = [
          'Email format is invalid',
          'Password must be at least 8 characters',
          'Name is required'
        ];
        
        errorResponse(mockRes, 'Validation failed', 400, errors);
        
        const callArgs = mockRes.json.mock.calls[0][0];
        expect(callArgs.errors).toEqual(errors);
      });

      it('should preserve error message order', () => {
        const errors = ['Error 1', 'Error 2', 'Error 3'];
        
        errorResponse(mockRes, 'Multiple errors', 400, errors);
        
        const callArgs = mockRes.json.mock.calls[0][0];
        expect(callArgs.errors).toEqual(errors);
        expect(callArgs.errors[0]).toBe('Error 1');
        expect(callArgs.errors[2]).toBe('Error 3');
      });
    });
  });

  describe('Response Format Consistency', () => {
    it('should ensure success and error responses have different success flags', () => {
      successResponse(mockRes, { id: '123' });
      const successCall = mockRes.json.mock.calls[0][0];
      
      mockRes.json.mockClear();
      
      errorResponse(mockRes, 'Error', 400);
      const errorCall = mockRes.json.mock.calls[0][0];
      
      expect(successCall.success).toBe(true);
      expect(errorCall.success).toBe(false);
    });

    it('should ensure success responses have data field', () => {
      successResponse(mockRes, { id: '123' });
      const callArgs = mockRes.json.mock.calls[0][0];
      
      expect(callArgs).toHaveProperty('data');
    });

    it('should ensure error responses have message field', () => {
      errorResponse(mockRes, 'Error message', 400);
      const callArgs = mockRes.json.mock.calls[0][0];
      
      expect(callArgs).toHaveProperty('message');
    });

    it('should ensure both response types return JSON', () => {
      successResponse(mockRes, { id: '123' });
      expect(mockRes.json).toHaveBeenCalled();
      
      mockRes.json.mockClear();
      
      errorResponse(mockRes, 'Error', 400);
      expect(mockRes.json).toHaveBeenCalled();
    });
  });

  describe('Method Chaining', () => {
    it('should allow chaining for success response', () => {
      const result = successResponse(mockRes, { id: '123' });
      
      expect(result).toBe(mockRes);
      expect(mockRes.status).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalled();
    });

    it('should allow chaining for error response', () => {
      const result = errorResponse(mockRes, 'Error', 400);
      
      expect(result).toBe(mockRes);
      expect(mockRes.status).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalled();
    });
  });
});
