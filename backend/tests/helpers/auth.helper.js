/**
 * Authentication Test Helper
 * 
 * Provides utilities for generating test users and tokens
 */

const jwt = require('jsonwebtoken');
const User = require('../../src/modules/users/user.model');
const { USER_ROLES } = require('../../src/common/constants/roles.constant');

/**
 * Generate JWT token for testing
 */
const generateTestToken = (userId, role = USER_ROLES.APPLICANT) => {
  const payload = {
    userId,
    role
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

/**
 * Create a test user in the database
 */
const createTestUser = async (userData = {}) => {
  const defaultData = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'TestPass123',
    role: USER_ROLES.APPLICANT
  };

  const user = await User.create({
    ...defaultData,
    ...userData
  });

  return user;
};

/**
 * Create a test user and generate token
 */
const createTestUserWithToken = async (userData = {}) => {
  const user = await createTestUser(userData);
  const token = generateTestToken(user._id.toString(), user.role);

  return {
    user,
    token
  };
};

/**
 * Create multiple test users with different roles
 */
const createTestUsers = async () => {
  const applicant = await createTestUser({
    name: 'Test Applicant',
    email: 'applicant@test.com',
    role: USER_ROLES.APPLICANT
  });

  const staff = await createTestUser({
    name: 'Test Staff',
    email: 'staff@test.com',
    role: USER_ROLES.STAFF
  });

  const admin = await createTestUser({
    name: 'Test Admin',
    email: 'admin@test.com',
    role: USER_ROLES.ADMIN
  });

  return {
    applicant: {
      user: applicant,
      token: generateTestToken(applicant._id.toString(), applicant.role)
    },
    staff: {
      user: staff,
      token: generateTestToken(staff._id.toString(), staff.role)
    },
    admin: {
      user: admin,
      token: generateTestToken(admin._id.toString(), admin.role)
    }
  };
};

/**
 * Create an expired token for testing
 */
const generateExpiredToken = (userId, role = USER_ROLES.APPLICANT) => {
  const payload = {
    userId,
    role
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '-1h' // Expired 1 hour ago
  });
};

/**
 * Create an invalid token for testing
 */
const generateInvalidToken = () => {
  return 'invalid.token.string';
};

module.exports = {
  generateTestToken,
  createTestUser,
  createTestUserWithToken,
  createTestUsers,
  generateExpiredToken,
  generateInvalidToken
};
