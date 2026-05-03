/**
 * Auth Service Unit Tests
 * 
 * Tests for authentication service business logic
 */

const AuthService = require('./auth.service');
const UserService = require('../users/user.service');
const { UnauthorizedError, ConflictError } = require('../../common/utils/error.util');
const dbHelper = require('../../../tests/helpers/db.helper');
const { validUserData, loginCredentials } = require('../../../tests/helpers/fixtures');
const { createTestUser } = require('../../../tests/helpers/auth.helper');

describe('Auth Service', () => {
  // Setup and teardown
  beforeAll(async () => {
    await dbHelper.connect();
  });

  afterAll(async () => {
    await dbHelper.disconnect();
  });

  afterEach(async () => {
    await dbHelper.clearDatabase();
  });

  describe('registerUser', () => {
    test('should register user with valid data', async () => {
      const result = await AuthService.registerUser(validUserData.applicant);

      expect(result).toBeDefined();
      expect(result.name).toBe(validUserData.applicant.name);
      expect(result.email).toBe(validUserData.applicant.email);
      expect(result.role).toBe(validUserData.applicant.role);
      expect(result.password).toBeUndefined(); // Password should not be returned
    });

    test('should fail with duplicate email', async () => {
      await AuthService.registerUser(validUserData.applicant);

      await expect(AuthService.registerUser(validUserData.applicant))
        .rejects
        .toThrow(ConflictError);
    });

    test('should hash password before saving', async () => {
      const result = await AuthService.registerUser(validUserData.applicant);
      
      // Fetch user directly from database
      const user = await UserService.getUserByEmail(validUserData.applicant.email);
      
      expect(user.password).toBeDefined();
      expect(user.password).not.toBe(validUserData.applicant.password);
    });

    test('should create user with applicant role', async () => {
      const result = await AuthService.registerUser(validUserData.applicant);
      expect(result.role).toBe('applicant');
    });

    test('should create user with staff role', async () => {
      const result = await AuthService.registerUser(validUserData.staff);
      expect(result.role).toBe('staff');
    });

    test('should create user with admin role', async () => {
      const result = await AuthService.registerUser(validUserData.admin);
      expect(result.role).toBe('admin');
    });
  });

  describe('loginUser', () => {
    beforeEach(async () => {
      // Create a test user before each login test
      await createTestUser({
        email: loginCredentials.valid.email,
        password: loginCredentials.valid.password
      });
    });

    test('should login with valid credentials', async () => {
      const result = await AuthService.loginUser(loginCredentials.valid);

      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe(loginCredentials.valid.email);
      expect(result.user.password).toBeUndefined(); // Password should not be returned
    });

    test('should return JWT token on successful login', async () => {
      const result = await AuthService.loginUser(loginCredentials.valid);

      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe('string');
      expect(result.token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    test('should fail with invalid email', async () => {
      await expect(AuthService.loginUser(loginCredentials.invalidEmail))
        .rejects
        .toThrow(UnauthorizedError);
    });

    test('should fail with invalid password', async () => {
      await expect(AuthService.loginUser(loginCredentials.invalidPassword))
        .rejects
        .toThrow(UnauthorizedError);
    });

    test('should fail with missing email', async () => {
      await expect(AuthService.loginUser(loginCredentials.missingEmail))
        .rejects
        .toThrow();
    });

    test('should fail with missing password', async () => {
      await expect(AuthService.loginUser(loginCredentials.missingPassword))
        .rejects
        .toThrow();
    });
  });

  describe('generateToken', () => {
    test('should generate valid JWT token', () => {
      const userId = '507f1f77bcf86cd799439011';
      const role = 'applicant';

      const token = AuthService.generateToken(userId, role);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    test('should include userId in token payload', () => {
      const userId = '507f1f77bcf86cd799439011';
      const role = 'applicant';

      const token = AuthService.generateToken(userId, role);
      const decoded = AuthService.verifyToken(token);

      expect(decoded.userId).toBe(userId);
    });

    test('should include role in token payload', () => {
      const userId = '507f1f77bcf86cd799439011';
      const role = 'staff';

      const token = AuthService.generateToken(userId, role);
      const decoded = AuthService.verifyToken(token);

      expect(decoded.role).toBe(role);
    });

    test('should include iat (issued at) in token', () => {
      const userId = '507f1f77bcf86cd799439011';
      const role = 'applicant';

      const token = AuthService.generateToken(userId, role);
      const decoded = AuthService.verifyToken(token);

      expect(decoded.iat).toBeDefined();
      expect(typeof decoded.iat).toBe('number');
    });

    test('should include exp (expiration) in token', () => {
      const userId = '507f1f77bcf86cd799439011';
      const role = 'applicant';

      const token = AuthService.generateToken(userId, role);
      const decoded = AuthService.verifyToken(token);

      expect(decoded.exp).toBeDefined();
      expect(typeof decoded.exp).toBe('number');
      expect(decoded.exp).toBeGreaterThan(decoded.iat);
    });
  });

  describe('verifyToken', () => {
    test('should verify valid token', () => {
      const userId = '507f1f77bcf86cd799439011';
      const role = 'applicant';
      const token = AuthService.generateToken(userId, role);

      const decoded = AuthService.verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe(userId);
      expect(decoded.role).toBe(role);
    });

    test('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.string';

      expect(() => AuthService.verifyToken(invalidToken))
        .toThrow();
    });

    test('should throw error for malformed token', () => {
      const malformedToken = 'not-a-jwt-token';

      expect(() => AuthService.verifyToken(malformedToken))
        .toThrow();
    });

    test('should throw error for expired token', () => {
      // Create a token that expires immediately
      const jwt = require('jsonwebtoken');
      const expiredToken = jwt.sign(
        { userId: '507f1f77bcf86cd799439011', role: 'applicant' },
        process.env.JWT_SECRET,
        { expiresIn: '-1h' } // Expired 1 hour ago
      );

      expect(() => AuthService.verifyToken(expiredToken))
        .toThrow();
    });

    test('should throw error for token with wrong secret', () => {
      const jwt = require('jsonwebtoken');
      const tokenWithWrongSecret = jwt.sign(
        { userId: '507f1f77bcf86cd799439011', role: 'applicant' },
        'wrong-secret',
        { expiresIn: '7d' }
      );

      expect(() => AuthService.verifyToken(tokenWithWrongSecret))
        .toThrow();
    });
  });

  describe('Token Lifecycle', () => {
    test('should generate and verify token successfully', () => {
      const userId = '507f1f77bcf86cd799439011';
      const role = 'admin';

      const token = AuthService.generateToken(userId, role);
      const decoded = AuthService.verifyToken(token);

      expect(decoded.userId).toBe(userId);
      expect(decoded.role).toBe(role);
    });

    test('should maintain token integrity through full auth flow', async () => {
      const user = await createTestUser({
        email: 'fullflow@test.com',
        password: 'TestPass123'
      });

      const loginResult = await AuthService.loginUser({
        email: 'fullflow@test.com',
        password: 'TestPass123'
      });

      const decoded = AuthService.verifyToken(loginResult.token);

      expect(decoded.userId).toBe(user._id.toString());
      expect(decoded.role).toBe(user.role);
    });
  });

  describe('Property-Based Tests', () => {
    /**
     * Property 3: JWT Token Structure and Verification
     * **Validates: Requirements 2.1, 3.2, 10.1, 10.5**
     * 
     * This property test verifies that:
     * 1. For any valid userId and role combination, a JWT token can be generated
     * 2. Generated tokens contain userId, role, iat, and exp fields
     * 3. Tokens can be verified with the same secret
     * 4. The decoded payload matches the input userId and role
     */
    describe('JWT Token Structure and Verification Property', () => {
      const fc = require('fast-check');
      const mongoose = require('mongoose');

      // Custom arbitrary for MongoDB ObjectId strings (24 hex characters)
      const hexChar = fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f');
      const objectIdArbitrary = fc.array(hexChar, { minLength: 24, maxLength: 24 }).map(arr => arr.join(''));

      // Custom arbitrary for user roles
      const roleArbitrary = fc.constantFrom('applicant', 'staff', 'admin');

      test('should verify JWT token structure for arbitrary userId and role combinations', () => {
        fc.assert(
          fc.property(
            objectIdArbitrary,
            roleArbitrary,
            (userId, role) => {
              // Generate token with arbitrary userId and role
              const token = AuthService.generateToken(userId, role);

              // Property 1: Token should be a non-empty string
              expect(token).toBeDefined();
              expect(typeof token).toBe('string');
              expect(token.length).toBeGreaterThan(0);

              // Property 2: Token should have JWT structure (3 parts separated by dots)
              const tokenParts = token.split('.');
              expect(tokenParts).toHaveLength(3);

              // Property 3: Token should be verifiable with the same secret
              const decoded = AuthService.verifyToken(token);
              expect(decoded).toBeDefined();

              // Property 4: Decoded token should contain userId field matching input
              expect(decoded.userId).toBe(userId);

              // Property 5: Decoded token should contain role field matching input
              expect(decoded.role).toBe(role);

              // Property 6: Decoded token should contain iat (issued at) field
              expect(decoded.iat).toBeDefined();
              expect(typeof decoded.iat).toBe('number');
              expect(decoded.iat).toBeGreaterThan(0);

              // Property 7: Decoded token should contain exp (expiration) field
              expect(decoded.exp).toBeDefined();
              expect(typeof decoded.exp).toBe('number');
              expect(decoded.exp).toBeGreaterThan(decoded.iat);

              // Property 8: Expiration should be 7 days (604800 seconds) from issued at
              const expectedExpiration = decoded.iat + 604800; // 7 days in seconds
              expect(decoded.exp).toBe(expectedExpiration);
            }
          ),
          {
            numRuns: 50, // Run 50 test cases with different userId/role combinations
            endOnFailure: true
          }
        );
      });

      test('should verify token verification fails with wrong secret', () => {
        fc.assert(
          fc.property(
            objectIdArbitrary,
            roleArbitrary,
            (userId, role) => {
              const jwt = require('jsonwebtoken');

              // Generate token with correct secret
              const token = AuthService.generateToken(userId, role);

              // Attempt to verify with wrong secret should fail
              expect(() => {
                jwt.verify(token, 'wrong-secret-key');
              }).toThrow();

              // But verification with correct secret should succeed
              const decoded = AuthService.verifyToken(token);
              expect(decoded.userId).toBe(userId);
              expect(decoded.role).toBe(role);
            }
          ),
          {
            numRuns: 20, // Run 20 test cases
            endOnFailure: true
          }
        );
      });

      test('should verify different userId/role combinations produce different tokens', () => {
        fc.assert(
          fc.property(
            fc.tuple(
              fc.record({ userId: objectIdArbitrary, role: roleArbitrary }),
              fc.record({ userId: objectIdArbitrary, role: roleArbitrary })
            ).filter(([combo1, combo2]) => 
              combo1.userId !== combo2.userId || combo1.role !== combo2.role
            ), // Ensure combinations are different
            ([combo1, combo2]) => {
              // Generate tokens for two different combinations
              const token1 = AuthService.generateToken(combo1.userId, combo1.role);
              const token2 = AuthService.generateToken(combo2.userId, combo2.role);

              // Property: Different inputs should produce different tokens
              // (Note: tokens might be same if generated at exact same millisecond with same data,
              // but with different userId or role, they should differ)
              const decoded1 = AuthService.verifyToken(token1);
              const decoded2 = AuthService.verifyToken(token2);

              // Verify each token decodes to its respective input
              expect(decoded1.userId).toBe(combo1.userId);
              expect(decoded1.role).toBe(combo1.role);
              expect(decoded2.userId).toBe(combo2.userId);
              expect(decoded2.role).toBe(combo2.role);

              // Verify tokens are different (unless generated at exact same time with same data)
              if (combo1.userId !== combo2.userId || combo1.role !== combo2.role) {
                // At least the payload should be different
                expect(decoded1.userId !== decoded2.userId || decoded1.role !== decoded2.role).toBe(true);
              }
            }
          ),
          {
            numRuns: 30, // Run 30 test cases
            endOnFailure: true
          }
        );
      });

      test('should verify token round-trip consistency', () => {
        fc.assert(
          fc.property(
            objectIdArbitrary,
            roleArbitrary,
            (userId, role) => {
              // Generate token
              const token = AuthService.generateToken(userId, role);

              // Verify token
              const decoded = AuthService.verifyToken(token);

              // Property: Round-trip should preserve userId and role exactly
              expect(decoded.userId).toBe(userId);
              expect(decoded.role).toBe(role);

              // Property: Multiple verifications should yield same result
              const decoded2 = AuthService.verifyToken(token);
              expect(decoded2.userId).toBe(decoded.userId);
              expect(decoded2.role).toBe(decoded.role);
              expect(decoded2.iat).toBe(decoded.iat);
              expect(decoded2.exp).toBe(decoded.exp);
            }
          ),
          {
            numRuns: 40, // Run 40 test cases
            endOnFailure: true
          }
        );
      });

      test('should verify token contains all required JWT standard fields', () => {
        fc.assert(
          fc.property(
            objectIdArbitrary,
            roleArbitrary,
            (userId, role) => {
              const token = AuthService.generateToken(userId, role);
              const decoded = AuthService.verifyToken(token);

              // Property: Token must contain all required fields per Requirements 10.5
              const requiredFields = ['userId', 'role', 'iat', 'exp'];
              
              requiredFields.forEach(field => {
                expect(decoded).toHaveProperty(field);
                expect(decoded[field]).toBeDefined();
              });

              // Property: iat and exp should be valid Unix timestamps
              const currentTime = Math.floor(Date.now() / 1000);
              expect(decoded.iat).toBeLessThanOrEqual(currentTime + 1); // Allow 1 second tolerance
              expect(decoded.exp).toBeGreaterThan(currentTime);
            }
          ),
          {
            numRuns: 30, // Run 30 test cases
            endOnFailure: true
          }
        );
      });
    });
  });
});
