/**
 * Authentication Middleware Unit Tests
 * 
 * Tests for authentication and authorization middleware
 */

const { authenticate, authorize } = require('./auth.middleware');
const { UnauthorizedError, ForbiddenError } = require('../utils/error.util');
const { USER_ROLES } = require('../constants/roles.constant');
const { generateTestToken, generateExpiredToken, generateInvalidToken } = require('../../../tests/helpers/auth.helper');

describe('Authentication Middleware', () => {
  describe('authenticate', () => {
    let req, res, next;

    beforeEach(() => {
      req = {
        cookies: {}
      };
      res = {};
      next = jest.fn();
    });

    test('should extract token from cookie and populate req.user', () => {
      const userId = '507f1f77bcf86cd799439011';
      const role = USER_ROLES.APPLICANT;
      const token = generateTestToken(userId, role);

      req.cookies.token = token;

      authenticate(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user.userId).toBe(userId);
      expect(req.user.role).toBe(role);
      expect(next).toHaveBeenCalledWith();
    });

    test('should throw UnauthorizedError when token is missing', () => {
      expect(() => authenticate(req, res, next)).toThrow(UnauthorizedError);
      expect(next).not.toHaveBeenCalled();
    });

    test('should throw UnauthorizedError for invalid token', () => {
      req.cookies.token = generateInvalidToken();

      expect(() => authenticate(req, res, next)).toThrow(UnauthorizedError);
      expect(next).not.toHaveBeenCalled();
    });

    test('should throw UnauthorizedError for expired token', () => {
      const userId = '507f1f77bcf86cd799439011';
      const role = USER_ROLES.APPLICANT;
      const expiredToken = generateExpiredToken(userId, role);

      req.cookies.token = expiredToken;

      expect(() => authenticate(req, res, next)).toThrow(UnauthorizedError);
      expect(next).not.toHaveBeenCalled();
    });

    test('should throw UnauthorizedError for malformed token', () => {
      req.cookies.token = 'not-a-valid-jwt';

      expect(() => authenticate(req, res, next)).toThrow(UnauthorizedError);
      expect(next).not.toHaveBeenCalled();
    });

    test('should extract userId from token payload', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateTestToken(userId, USER_ROLES.APPLICANT);

      req.cookies.token = token;

      authenticate(req, res, next);

      expect(req.user.userId).toBe(userId);
    });

    test('should extract role from token payload', () => {
      const userId = '507f1f77bcf86cd799439011';
      const role = USER_ROLES.STAFF;
      const token = generateTestToken(userId, role);

      req.cookies.token = token;

      authenticate(req, res, next);

      expect(req.user.role).toBe(role);
    });

    test('should handle token from cookie named "token"', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateTestToken(userId, USER_ROLES.APPLICANT);

      req.cookies.token = token;

      authenticate(req, res, next);

      expect(req.user).toBeDefined();
      expect(next).toHaveBeenCalled();
    });

    test('should call next() on successful authentication', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateTestToken(userId, USER_ROLES.APPLICANT);

      req.cookies.token = token;

      authenticate(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('authorize', () => {
    let req, res, next;

    beforeEach(() => {
      req = {
        user: {}
      };
      res = {};
      next = jest.fn();
    });

    test('should allow user with correct role', () => {
      req.user.role = USER_ROLES.APPLICANT;

      const middleware = authorize(USER_ROLES.APPLICANT);
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    test('should allow user with one of multiple allowed roles', () => {
      req.user.role = USER_ROLES.STAFF;

      const middleware = authorize(USER_ROLES.STAFF, USER_ROLES.ADMIN);
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    test('should throw ForbiddenError for unauthorized role', () => {
      req.user.role = USER_ROLES.APPLICANT;

      const middleware = authorize(USER_ROLES.STAFF, USER_ROLES.ADMIN);

      expect(() => middleware(req, res, next)).toThrow(ForbiddenError);
      expect(next).not.toHaveBeenCalled();
    });

    test('should allow applicant role', () => {
      req.user.role = USER_ROLES.APPLICANT;

      const middleware = authorize(USER_ROLES.APPLICANT);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    test('should allow staff role', () => {
      req.user.role = USER_ROLES.STAFF;

      const middleware = authorize(USER_ROLES.STAFF);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    test('should allow admin role', () => {
      req.user.role = USER_ROLES.ADMIN;

      const middleware = authorize(USER_ROLES.ADMIN);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    test('should deny applicant access to staff-only endpoint', () => {
      req.user.role = USER_ROLES.APPLICANT;

      const middleware = authorize(USER_ROLES.STAFF);

      expect(() => middleware(req, res, next)).toThrow(ForbiddenError);
    });

    test('should deny staff access to admin-only endpoint', () => {
      req.user.role = USER_ROLES.STAFF;

      const middleware = authorize(USER_ROLES.ADMIN);

      expect(() => middleware(req, res, next)).toThrow(ForbiddenError);
    });

    test('should allow admin access to staff endpoint', () => {
      req.user.role = USER_ROLES.ADMIN;

      const middleware = authorize(USER_ROLES.STAFF, USER_ROLES.ADMIN);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    test('should handle single role parameter', () => {
      req.user.role = USER_ROLES.APPLICANT;

      const middleware = authorize(USER_ROLES.APPLICANT);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    test('should handle multiple role parameters', () => {
      req.user.role = USER_ROLES.STAFF;

      const middleware = authorize(
        USER_ROLES.APPLICANT,
        USER_ROLES.STAFF,
        USER_ROLES.ADMIN
      );
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    test('should return middleware function', () => {
      const middleware = authorize(USER_ROLES.APPLICANT);

      expect(typeof middleware).toBe('function');
    });

    test('should call next() only once on success', () => {
      req.user.role = USER_ROLES.APPLICANT;

      const middleware = authorize(USER_ROLES.APPLICANT);
      middleware(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe('authenticate and authorize integration', () => {
    let req, res, next;

    beforeEach(() => {
      req = {
        cookies: {}
      };
      res = {};
      next = jest.fn();
    });

    test('should authenticate and authorize applicant', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateTestToken(userId, USER_ROLES.APPLICANT);

      req.cookies.token = token;

      // First authenticate
      authenticate(req, res, next);

      // Then authorize
      const authorizeMw = authorize(USER_ROLES.APPLICANT);
      authorizeMw(req, res, next);

      expect(req.user.userId).toBe(userId);
      expect(req.user.role).toBe(USER_ROLES.APPLICANT);
      expect(next).toHaveBeenCalledTimes(2);
    });

    test('should authenticate but deny authorization for wrong role', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateTestToken(userId, USER_ROLES.APPLICANT);

      req.cookies.token = token;

      // First authenticate
      authenticate(req, res, next);

      // Then try to authorize for staff role
      const authorizeMw = authorize(USER_ROLES.STAFF);

      expect(() => authorizeMw(req, res, next)).toThrow(ForbiddenError);
    });

    test('should handle full middleware chain for staff', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateTestToken(userId, USER_ROLES.STAFF);

      req.cookies.token = token;

      authenticate(req, res, next);

      const authorizeMw = authorize(USER_ROLES.STAFF, USER_ROLES.ADMIN);
      authorizeMw(req, res, next);

      expect(req.user.role).toBe(USER_ROLES.STAFF);
      expect(next).toHaveBeenCalledTimes(2);
    });
  });
});
