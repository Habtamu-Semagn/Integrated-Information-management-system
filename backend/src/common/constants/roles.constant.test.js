/**
 * Unit tests for User Roles Constants
 * 
 * @module constants/roles.test
 */

const { USER_ROLES, VALID_ROLES, DEFAULT_ROLE } = require('./roles.constant');

describe('User Roles Constants', () => {
  describe('USER_ROLES', () => {
    test('should define APPLICANT role', () => {
      expect(USER_ROLES.APPLICANT).toBe('applicant');
    });

    test('should define STAFF role', () => {
      expect(USER_ROLES.STAFF).toBe('staff');
    });

    test('should define ADMIN role', () => {
      expect(USER_ROLES.ADMIN).toBe('admin');
    });

    test('should have exactly 3 roles', () => {
      expect(Object.keys(USER_ROLES)).toHaveLength(3);
    });

    test('should have all role values as lowercase strings', () => {
      Object.values(USER_ROLES).forEach(role => {
        expect(typeof role).toBe('string');
        expect(role).toBe(role.toLowerCase());
      });
    });
  });

  describe('VALID_ROLES', () => {
    test('should be an array', () => {
      expect(Array.isArray(VALID_ROLES)).toBe(true);
    });

    test('should contain all USER_ROLES values', () => {
      expect(VALID_ROLES).toEqual(expect.arrayContaining(Object.values(USER_ROLES)));
      expect(VALID_ROLES).toHaveLength(Object.values(USER_ROLES).length);
    });

    test('should include applicant, staff, and admin', () => {
      expect(VALID_ROLES).toContain('applicant');
      expect(VALID_ROLES).toContain('staff');
      expect(VALID_ROLES).toContain('admin');
    });
  });

  describe('DEFAULT_ROLE', () => {
    test('should be APPLICANT', () => {
      expect(DEFAULT_ROLE).toBe(USER_ROLES.APPLICANT);
      expect(DEFAULT_ROLE).toBe('applicant');
    });

    test('should be a valid role', () => {
      expect(VALID_ROLES).toContain(DEFAULT_ROLE);
    });
  });

  describe('Role validation', () => {
    test('should allow checking if a role is valid', () => {
      expect(VALID_ROLES.includes('applicant')).toBe(true);
      expect(VALID_ROLES.includes('staff')).toBe(true);
      expect(VALID_ROLES.includes('admin')).toBe(true);
      expect(VALID_ROLES.includes('invalid')).toBe(false);
    });
  });
});
