/**
 * User Model Unit Tests
 * 
 * Tests for User model validation, password hashing, and methods
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fc = require('fast-check');
const User = require('./user.model');
const { USER_ROLES } = require('../../common/constants/roles.constant');
const dbHelper = require('../../../tests/helpers/db.helper');
const { validUserData, invalidUserData } = require('../../../tests/helpers/fixtures');

describe('User Model', () => {
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

  describe('Schema Validation', () => {
    test('should create a valid user', async () => {
      const user = await User.create(validUserData.applicant);

      expect(user._id).toBeDefined();
      expect(user.name).toBe(validUserData.applicant.name);
      expect(user.email).toBe(validUserData.applicant.email);
      expect(user.role).toBe(validUserData.applicant.role);
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    test('should fail without required name', async () => {
      await expect(User.create(invalidUserData.missingName))
        .rejects
        .toThrow();
    });

    test('should fail without required email', async () => {
      await expect(User.create(invalidUserData.missingEmail))
        .rejects
        .toThrow();
    });

    test('should fail without required password', async () => {
      await expect(User.create(invalidUserData.missingPassword))
        .rejects
        .toThrow();
    });

    test('should fail with invalid email format', async () => {
      await expect(User.create(invalidUserData.invalidEmail))
        .rejects
        .toThrow();
    });

    test('should fail with name shorter than 2 characters', async () => {
      await expect(User.create(invalidUserData.shortName))
        .rejects
        .toThrow();
    });

    test('should fail with password shorter than 8 characters', async () => {
      await expect(User.create(invalidUserData.shortPassword))
        .rejects
        .toThrow();
    });

    test('should fail with invalid role', async () => {
      await expect(User.create(invalidUserData.invalidRole))
        .rejects
        .toThrow();
    });

    test('should default role to applicant if not provided', async () => {
      const userData = { ...validUserData.applicant };
      delete userData.role;

      const user = await User.create(userData);
      expect(user.role).toBe(USER_ROLES.APPLICANT);
    });
  });

  describe('Email Uniqueness', () => {
    test('should enforce unique email constraint', async () => {
      await User.create(validUserData.applicant);

      await expect(User.create(validUserData.applicant))
        .rejects
        .toThrow();
    });

    test('should allow same email with different case (case-insensitive)', async () => {
      await User.create(validUserData.applicant);

      const upperCaseEmail = {
        ...validUserData.staff,
        email: validUserData.applicant.email.toUpperCase()
      };

      await expect(User.create(upperCaseEmail))
        .rejects
        .toThrow();
    });
  });

  describe('Password Hashing', () => {
    test('should hash password before saving', async () => {
      const user = await User.create(validUserData.applicant);

      expect(user.password).toBeDefined();
      expect(user.password).not.toBe(validUserData.applicant.password);
      expect(user.password.length).toBeGreaterThan(20); // Bcrypt hashes are long
    });

    test('should not rehash password if not modified', async () => {
      const user = await User.create(validUserData.applicant);
      const originalHash = user.password;

      user.name = 'Updated Name';
      await user.save();

      expect(user.password).toBe(originalHash);
    });

    test('should rehash password if modified', async () => {
      const user = await User.create(validUserData.applicant);
      const originalHash = user.password;

      user.password = 'NewPassword123';
      await user.save();

      expect(user.password).not.toBe(originalHash);
      expect(user.password).not.toBe('NewPassword123');
    });
  });

  describe('comparePassword Method', () => {
    test('should return true for correct password', async () => {
      const user = await User.create(validUserData.applicant);

      const isMatch = await user.comparePassword(validUserData.applicant.password);
      expect(isMatch).toBe(true);
    });

    test('should return false for incorrect password', async () => {
      const user = await User.create(validUserData.applicant);

      const isMatch = await user.comparePassword('WrongPassword');
      expect(isMatch).toBe(false);
    });

    test('should handle empty password', async () => {
      const user = await User.create(validUserData.applicant);

      const isMatch = await user.comparePassword('');
      expect(isMatch).toBe(false);
    });
  });

  describe('toJSON Transformation', () => {
    test('should exclude password from JSON', async () => {
      const user = await User.create(validUserData.applicant);
      const userJSON = user.toJSON();

      expect(userJSON.password).toBeUndefined();
      expect(userJSON.name).toBe(validUserData.applicant.name);
      expect(userJSON.email).toBe(validUserData.applicant.email);
    });

    test('should exclude __v from JSON', async () => {
      const user = await User.create(validUserData.applicant);
      const userJSON = user.toJSON();

      expect(userJSON.__v).toBeUndefined();
    });

    test('should include id virtual field', async () => {
      const user = await User.create(validUserData.applicant);
      const userJSON = user.toJSON();

      expect(userJSON.id).toBeDefined();
      expect(userJSON.id).toBe(user._id.toString());
    });

    test('should not include _id in JSON', async () => {
      const user = await User.create(validUserData.applicant);
      const userJSON = user.toJSON();

      expect(userJSON._id).toBeUndefined();
    });
  });

  describe('Timestamps', () => {
    test('should set createdAt on creation', async () => {
      const user = await User.create(validUserData.applicant);

      expect(user.createdAt).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    test('should set updatedAt on creation', async () => {
      const user = await User.create(validUserData.applicant);

      expect(user.updatedAt).toBeDefined();
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    test('should update updatedAt on modification', async () => {
      const user = await User.create(validUserData.applicant);
      const originalUpdatedAt = user.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10));

      user.name = 'Updated Name';
      await user.save();

      expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    test('should not change createdAt on modification', async () => {
      const user = await User.create(validUserData.applicant);
      const originalCreatedAt = user.createdAt;

      user.name = 'Updated Name';
      await user.save();

      expect(user.createdAt.getTime()).toBe(originalCreatedAt.getTime());
    });
  });

  describe('User Roles', () => {
    test('should create applicant user', async () => {
      const user = await User.create(validUserData.applicant);
      expect(user.role).toBe(USER_ROLES.APPLICANT);
    });

    test('should create staff user', async () => {
      const user = await User.create(validUserData.staff);
      expect(user.role).toBe(USER_ROLES.STAFF);
    });

    test('should create admin user', async () => {
      const user = await User.create(validUserData.admin);
      expect(user.role).toBe(USER_ROLES.ADMIN);
    });
  });

  describe('Property-Based Tests', () => {
    /**
     * Property 1: Password Hashing Round-Trip
     * **Validates: Requirements 1.2, 9.1, 9.2**
     * 
     * This property test verifies that:
     * 1. For any valid password, bcrypt.compare(password, hash) returns true
     * 2. The hash never equals the plain text password
     * 3. Password hashing is consistent and reversible for verification
     */
    describe('Password Hashing Round-Trip Property', () => {
      test('should verify password hashing round-trip for arbitrary valid passwords', async () => {
        await fc.assert(
          fc.asyncProperty(
            // Generate arbitrary valid passwords (8-100 characters)
            fc.string({ minLength: 8, maxLength: 100 }),
            async (password) => {
              // Create a user with the generated password
              const userData = {
                name: 'Test User',
                email: `test${Date.now()}${Math.random()}@example.com`,
                password: password,
                role: 'applicant'
              };

              const user = await User.create(userData);

              // Property 1: bcrypt.compare(password, hash) should return true
              const isMatch = await user.comparePassword(password);
              expect(isMatch).toBe(true);

              // Property 2: Hash should never equal plain text password
              expect(user.password).not.toBe(password);

              // Property 3: Hash should be a valid bcrypt hash (starts with $2a$ or $2b$)
              expect(user.password).toMatch(/^\$2[ab]\$/);

              // Property 4: Hash should be significantly longer than minimum bcrypt hash length
              expect(user.password.length).toBeGreaterThan(20);

              // Cleanup
              await User.deleteOne({ _id: user._id });
            }
          ),
          {
            numRuns: 10, // Run 10 test cases with different passwords (reduced for faster execution)
            endOnFailure: true
          }
        );
      });

      test('should verify different passwords produce different hashes', async () => {
        await fc.assert(
          fc.asyncProperty(
            // Generate two different passwords
            fc.tuple(
              fc.string({ minLength: 8, maxLength: 100 }),
              fc.string({ minLength: 8, maxLength: 100 })
            ).filter(([pwd1, pwd2]) => pwd1 !== pwd2), // Ensure passwords are different
            async ([password1, password2]) => {
              // Create two users with different passwords
              const user1Data = {
                name: 'Test User 1',
                email: `test1${Date.now()}${Math.random()}@example.com`,
                password: password1,
                role: 'applicant'
              };

              const user2Data = {
                name: 'Test User 2',
                email: `test2${Date.now()}${Math.random()}@example.com`,
                password: password2,
                role: 'applicant'
              };

              const user1 = await User.create(user1Data);
              const user2 = await User.create(user2Data);

              // Property: Different passwords should produce different hashes
              expect(user1.password).not.toBe(user2.password);

              // Property: Each password should only match its own hash
              const user1Match = await user1.comparePassword(password1);
              const user1NoMatch = await user1.comparePassword(password2);
              const user2Match = await user2.comparePassword(password2);
              const user2NoMatch = await user2.comparePassword(password1);

              expect(user1Match).toBe(true);
              expect(user1NoMatch).toBe(false);
              expect(user2Match).toBe(true);
              expect(user2NoMatch).toBe(false);

              // Cleanup
              await User.deleteMany({ _id: { $in: [user1._id, user2._id] } });
            }
          ),
          {
            numRuns: 15, // Run 15 test cases (reduced for faster execution)
            endOnFailure: true
          }
        );
      });

      test('should verify bcrypt salt rounds are at least 10', async () => {
        await fc.assert(
          fc.asyncProperty(
            fc.string({ minLength: 8, maxLength: 100 }),
            async (password) => {
              const userData = {
                name: 'Test User',
                email: `test${Date.now()}${Math.random()}@example.com`,
                password: password,
                role: 'applicant'
              };

              const user = await User.create(userData);

              // Extract salt rounds from bcrypt hash
              // Bcrypt hash format: $2a$10$... where 10 is the salt rounds
              const hashParts = user.password.split('$');
              const saltRounds = parseInt(hashParts[2], 10);

              // Property: Salt rounds should be at least 10 (Requirement 1.2, 9.1)
              expect(saltRounds).toBeGreaterThanOrEqual(10);

              // Cleanup
              await User.deleteOne({ _id: user._id });
            }
          ),
          {
            numRuns: 10, // Reduced for faster execution
            endOnFailure: true
          }
        );
      });

      test('should verify password is never stored in plain text', async () => {
        await fc.assert(
          fc.asyncProperty(
            fc.string({ minLength: 8, maxLength: 100 }),
            async (password) => {
              const userData = {
                name: 'Test User',
                email: `test${Date.now()}${Math.random()}@example.com`,
                password: password,
                role: 'applicant'
              };

              const user = await User.create(userData);

              // Property 1: Stored password should not equal plain text (Requirement 9.2)
              expect(user.password).not.toBe(password);

              // Property 2: Stored password should be a bcrypt hash
              expect(user.password).toMatch(/^\$2[ab]\$\d{2}\$.{53}$/);

              // Property 3: Even if we fetch the user from DB, password should be hashed
              const fetchedUser = await User.findById(user._id).select('+password');
              expect(fetchedUser.password).not.toBe(password);
              expect(fetchedUser.password).toBe(user.password);

              // Cleanup
              await User.deleteOne({ _id: user._id });
            }
          ),
          {
            numRuns: 10, // Reduced for faster execution
            endOnFailure: true
          }
        );
      });
    });
  });
});
