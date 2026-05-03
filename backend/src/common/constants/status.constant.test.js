/**
 * Unit tests for Application Status Constants
 * 
 * @module constants/status.test
 */

const { APPLICATION_STATUS, VALID_STATUSES, DEFAULT_STATUS } = require('./status.constant');

describe('Application Status Constants', () => {
  describe('APPLICATION_STATUS', () => {
    test('should define PENDING status', () => {
      expect(APPLICATION_STATUS.PENDING).toBe('pending');
    });

    test('should define APPROVED status', () => {
      expect(APPLICATION_STATUS.APPROVED).toBe('approved');
    });

    test('should define REJECTED status', () => {
      expect(APPLICATION_STATUS.REJECTED).toBe('rejected');
    });

    test('should have exactly 3 statuses', () => {
      expect(Object.keys(APPLICATION_STATUS)).toHaveLength(3);
    });

    test('should have all status values as lowercase strings', () => {
      Object.values(APPLICATION_STATUS).forEach(status => {
        expect(typeof status).toBe('string');
        expect(status).toBe(status.toLowerCase());
      });
    });
  });

  describe('VALID_STATUSES', () => {
    test('should be an array', () => {
      expect(Array.isArray(VALID_STATUSES)).toBe(true);
    });

    test('should contain all APPLICATION_STATUS values', () => {
      expect(VALID_STATUSES).toEqual(expect.arrayContaining(Object.values(APPLICATION_STATUS)));
      expect(VALID_STATUSES).toHaveLength(Object.values(APPLICATION_STATUS).length);
    });

    test('should include pending, approved, and rejected', () => {
      expect(VALID_STATUSES).toContain('pending');
      expect(VALID_STATUSES).toContain('approved');
      expect(VALID_STATUSES).toContain('rejected');
    });
  });

  describe('DEFAULT_STATUS', () => {
    test('should be PENDING', () => {
      expect(DEFAULT_STATUS).toBe(APPLICATION_STATUS.PENDING);
      expect(DEFAULT_STATUS).toBe('pending');
    });

    test('should be a valid status', () => {
      expect(VALID_STATUSES).toContain(DEFAULT_STATUS);
    });
  });

  describe('Status validation', () => {
    test('should allow checking if a status is valid', () => {
      expect(VALID_STATUSES.includes('pending')).toBe(true);
      expect(VALID_STATUSES.includes('approved')).toBe(true);
      expect(VALID_STATUSES.includes('rejected')).toBe(true);
      expect(VALID_STATUSES.includes('invalid')).toBe(false);
    });
  });

  describe('Status transitions', () => {
    test('should support checking valid status transitions', () => {
      // Pending can transition to approved or rejected
      const fromPending = ['approved', 'rejected'];
      fromPending.forEach(status => {
        expect(VALID_STATUSES).toContain(status);
      });
    });
  });
});
