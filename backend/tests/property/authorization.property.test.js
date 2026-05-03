/**
 * Property-Based Test: Role-Based Access Control
 * 
 * **Validates: Requirements 4.1, 4.2**
 * 
 * This test uses property-based testing with fast-check to verify that the
 * authorization middleware correctly enforces role-based access control across
 * all possible combinations of user roles and allowed role lists.
 * 
 * Property 13: Role-Based Access Control
 * - For any user role and any list of allowed roles:
 *   - If the user's role is in the allowed list, authorization should succeed
 *   - If the user's role is NOT in the allowed list, authorization should fail with 403
 */

const fc = require('fast-check');
const { authorize } = require('../../src/common/middleware/auth.middleware');
const { ForbiddenError, UnauthorizedError } = require('../../src/common/utils/error.util');
const { USER_ROLES, VALID_ROLES } = require('../../src/common/constants/roles.constant');

describe('Property Test: Role-Based Access Control', () => {
  /**
   * Property 13: Role-Based Access Control
   * 
   * **Validates: Requirements 4.1, 4.2**
   * 
   * Universal property: For any user role and any non-empty list of allowed roles,
   * the authorization middleware should:
   * 1. Allow access if the user's role is in the allowed roles list
   * 2. Deny access with 403 error if the user's role is NOT in the allowed roles list
   */
  describe('Property 13: Role-Based Access Control', () => {
    it('should allow access when user role is in allowed roles list', () => {
      fc.assert(
        fc.property(
          // Generate arbitrary user role from valid roles
          fc.constantFrom(...VALID_ROLES),
          // Generate arbitrary non-empty list of allowed roles
          fc.array(fc.constantFrom(...VALID_ROLES), { minLength: 1, maxLength: 3 }),
          (userRole, allowedRoles) => {
            // Only test cases where user role is in allowed roles
            fc.pre(allowedRoles.includes(userRole));

            // Create mock request with authenticated user
            const req = {
              user: {
                userId: 'test-user-id',
                role: userRole
              }
            };

            const res = {};
            let nextCalled = false;
            let errorPassed = null;

            const next = (error) => {
              if (error) {
                errorPassed = error;
              } else {
                nextCalled = true;
              }
            };

            // Execute authorization middleware
            const authMiddleware = authorize(...allowedRoles);
            authMiddleware(req, res, next);

            // Verify: next() should be called without error
            return nextCalled === true && errorPassed === null;
          }
        ),
        {
          numRuns: 100,
          verbose: true
        }
      );
    });

    it('should deny access with 403 when user role is NOT in allowed roles list', () => {
      fc.assert(
        fc.property(
          // Generate arbitrary user role from valid roles
          fc.constantFrom(...VALID_ROLES),
          // Generate arbitrary non-empty list of allowed roles
          fc.array(fc.constantFrom(...VALID_ROLES), { minLength: 1, maxLength: 3 }),
          (userRole, allowedRoles) => {
            // Only test cases where user role is NOT in allowed roles
            fc.pre(!allowedRoles.includes(userRole));

            // Create mock request with authenticated user
            const req = {
              user: {
                userId: 'test-user-id',
                role: userRole
              }
            };

            const res = {};
            let nextCalled = false;
            let errorPassed = null;

            const next = (error) => {
              if (error) {
                errorPassed = error;
              } else {
                nextCalled = true;
              }
            };

            // Execute authorization middleware
            const authMiddleware = authorize(...allowedRoles);
            authMiddleware(req, res, next);

            // Verify: ForbiddenError should be passed to next()
            return (
              nextCalled === false &&
              errorPassed !== null &&
              errorPassed instanceof ForbiddenError &&
              errorPassed.message === 'Access denied. Insufficient permissions'
            );
          }
        ),
        {
          numRuns: 100,
          verbose: true
        }
      );
    });

    it('should reject requests without authenticated user', () => {
      fc.assert(
        fc.property(
          // Generate arbitrary non-empty list of allowed roles
          fc.array(fc.constantFrom(...VALID_ROLES), { minLength: 1, maxLength: 3 }),
          (allowedRoles) => {
            // Create mock request WITHOUT user (not authenticated)
            const req = {};

            const res = {};
            let nextCalled = false;
            let errorPassed = null;

            const next = (error) => {
              if (error) {
                errorPassed = error;
              } else {
                nextCalled = true;
              }
            };

            // Execute authorization middleware
            const authMiddleware = authorize(...allowedRoles);
            authMiddleware(req, res, next);

            // Verify: UnauthorizedError should be passed to next()
            return (
              nextCalled === false &&
              errorPassed !== null &&
              errorPassed instanceof UnauthorizedError &&
              errorPassed.message === 'Authentication required'
            );
          }
        ),
        {
          numRuns: 50,
          verbose: true
        }
      );
    });

    it('should reject requests with user but missing role', () => {
      fc.assert(
        fc.property(
          // Generate arbitrary non-empty list of allowed roles
          fc.array(fc.constantFrom(...VALID_ROLES), { minLength: 1, maxLength: 3 }),
          (allowedRoles) => {
            // Create mock request with user but no role
            const req = {
              user: {
                userId: 'test-user-id'
                // role is missing
              }
            };

            const res = {};
            let nextCalled = false;
            let errorPassed = null;

            const next = (error) => {
              if (error) {
                errorPassed = error;
              } else {
                nextCalled = true;
              }
            };

            // Execute authorization middleware
            const authMiddleware = authorize(...allowedRoles);
            authMiddleware(req, res, next);

            // Verify: UnauthorizedError should be passed to next()
            return (
              nextCalled === false &&
              errorPassed !== null &&
              errorPassed instanceof UnauthorizedError &&
              errorPassed.message === 'Authentication required'
            );
          }
        ),
        {
          numRuns: 50,
          verbose: true
        }
      );
    });

    it('should handle all role combinations correctly', () => {
      fc.assert(
        fc.property(
          // Generate arbitrary user role
          fc.constantFrom(...VALID_ROLES),
          // Generate arbitrary allowed roles list (can be empty for edge case)
          fc.array(fc.constantFrom(...VALID_ROLES), { minLength: 0, maxLength: 3 }),
          (userRole, allowedRoles) => {
            // Skip empty allowed roles list (invalid configuration)
            fc.pre(allowedRoles.length > 0);

            // Create mock request with authenticated user
            const req = {
              user: {
                userId: 'test-user-id',
                role: userRole
              }
            };

            const res = {};
            let nextCalled = false;
            let errorPassed = null;

            const next = (error) => {
              if (error) {
                errorPassed = error;
              } else {
                nextCalled = true;
              }
            };

            // Execute authorization middleware
            const authMiddleware = authorize(...allowedRoles);
            authMiddleware(req, res, next);

            // Verify behavior based on whether role is allowed
            const isAllowed = allowedRoles.includes(userRole);

            if (isAllowed) {
              // Should succeed
              return nextCalled === true && errorPassed === null;
            } else {
              // Should fail with ForbiddenError
              return (
                nextCalled === false &&
                errorPassed !== null &&
                errorPassed instanceof ForbiddenError
              );
            }
          }
        ),
        {
          numRuns: 200,
          verbose: true
        }
      );
    });

    it('should handle specific role scenarios from requirements', () => {
      // Test specific scenarios from Requirements 4.3-4.8
      const scenarios = [
        {
          description: 'Applicant can create application (Req 4.3)',
          userRole: USER_ROLES.APPLICANT,
          allowedRoles: [USER_ROLES.APPLICANT],
          shouldAllow: true
        },
        {
          description: 'Staff cannot create application (Req 4.4)',
          userRole: USER_ROLES.STAFF,
          allowedRoles: [USER_ROLES.APPLICANT],
          shouldAllow: false
        },
        {
          description: 'Admin cannot create application (Req 4.4)',
          userRole: USER_ROLES.ADMIN,
          allowedRoles: [USER_ROLES.APPLICANT],
          shouldAllow: false
        },
        {
          description: 'Staff can view all applications (Req 4.5)',
          userRole: USER_ROLES.STAFF,
          allowedRoles: [USER_ROLES.STAFF, USER_ROLES.ADMIN],
          shouldAllow: true
        },
        {
          description: 'Admin can view all applications (Req 4.5)',
          userRole: USER_ROLES.ADMIN,
          allowedRoles: [USER_ROLES.STAFF, USER_ROLES.ADMIN],
          shouldAllow: true
        },
        {
          description: 'Applicant cannot view all applications (Req 4.6)',
          userRole: USER_ROLES.APPLICANT,
          allowedRoles: [USER_ROLES.STAFF, USER_ROLES.ADMIN],
          shouldAllow: false
        },
        {
          description: 'Staff can update application status (Req 4.7)',
          userRole: USER_ROLES.STAFF,
          allowedRoles: [USER_ROLES.STAFF, USER_ROLES.ADMIN],
          shouldAllow: true
        },
        {
          description: 'Admin can update application status (Req 4.7)',
          userRole: USER_ROLES.ADMIN,
          allowedRoles: [USER_ROLES.STAFF, USER_ROLES.ADMIN],
          shouldAllow: true
        },
        {
          description: 'Applicant cannot update application status (Req 4.8)',
          userRole: USER_ROLES.APPLICANT,
          allowedRoles: [USER_ROLES.STAFF, USER_ROLES.ADMIN],
          shouldAllow: false
        }
      ];

      scenarios.forEach((scenario) => {
        const req = {
          user: {
            userId: 'test-user-id',
            role: scenario.userRole
          }
        };

        const res = {};
        let nextCalled = false;
        let errorPassed = null;

        const next = (error) => {
          if (error) {
            errorPassed = error;
          } else {
            nextCalled = true;
          }
        };

        const authMiddleware = authorize(...scenario.allowedRoles);
        authMiddleware(req, res, next);

        if (scenario.shouldAllow) {
          expect(nextCalled).toBe(true);
          expect(errorPassed).toBeNull();
        } else {
          expect(nextCalled).toBe(false);
          expect(errorPassed).toBeInstanceOf(ForbiddenError);
          expect(errorPassed.message).toBe('Access denied. Insufficient permissions');
        }
      });
    });
  });
});
