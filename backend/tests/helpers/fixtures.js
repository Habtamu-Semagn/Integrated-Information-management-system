/**
 * Test Fixtures
 * 
 * Provides test data for various entities
 */

const { USER_ROLES } = require('../../src/common/constants/roles.constant');
const { APPLICATION_STATUS } = require('../../src/common/constants/status.constant');

/**
 * Valid user data fixtures
 */
const validUserData = {
  applicant: {
    name: 'John Applicant',
    email: 'john.applicant@example.com',
    password: 'SecurePass123',
    role: USER_ROLES.APPLICANT
  },
  staff: {
    name: 'Jane Staff',
    email: 'jane.staff@example.com',
    password: 'SecurePass456',
    role: USER_ROLES.STAFF
  },
  admin: {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'SecurePass789',
    role: USER_ROLES.ADMIN
  }
};

/**
 * Invalid user data fixtures
 */
const invalidUserData = {
  missingName: {
    email: 'test@example.com',
    password: 'SecurePass123',
    role: USER_ROLES.APPLICANT
  },
  missingEmail: {
    name: 'Test User',
    password: 'SecurePass123',
    role: USER_ROLES.APPLICANT
  },
  missingPassword: {
    name: 'Test User',
    email: 'test@example.com',
    role: USER_ROLES.APPLICANT
  },
  invalidEmail: {
    name: 'Test User',
    email: 'invalid-email',
    password: 'SecurePass123',
    role: USER_ROLES.APPLICANT
  },
  shortPassword: {
    name: 'Test User',
    email: 'test@example.com',
    password: 'short',
    role: USER_ROLES.APPLICANT
  },
  shortName: {
    name: 'A',
    email: 'test@example.com',
    password: 'SecurePass123',
    role: USER_ROLES.APPLICANT
  },
  invalidRole: {
    name: 'Test User',
    email: 'test@example.com',
    password: 'SecurePass123',
    role: 'invalid-role'
  }
};

/**
 * Valid application data fixtures
 */
const validApplicationData = {
  basic: {
    startupName: 'TechVenture Inc',
    description: 'A revolutionary platform connecting entrepreneurs with investors through AI-powered matching',
    problemStatement: 'Small businesses struggle to find affordable and suitable funding options in the current market',
    solution: 'AI-powered matching platform that connects businesses with suitable investors based on industry, stage, and funding needs',
    targetMarket: 'Small to medium businesses in North America seeking seed to Series A funding'
  },
  ecommerce: {
    startupName: 'EcoShop',
    description: 'Sustainable e-commerce platform for eco-friendly products',
    problemStatement: 'Consumers find it difficult to discover and purchase verified sustainable products',
    solution: 'Centralized marketplace with verified eco-certifications and carbon footprint tracking',
    targetMarket: 'Environmentally conscious millennials and Gen Z consumers'
  },
  healthtech: {
    startupName: 'HealthConnect',
    description: 'Telemedicine platform connecting patients with healthcare providers',
    problemStatement: 'Rural areas lack access to specialized healthcare services',
    solution: 'Video consultation platform with AI-powered symptom checker and prescription delivery',
    targetMarket: 'Rural communities and underserved populations'
  }
};

/**
 * Invalid application data fixtures
 */
const invalidApplicationData = {
  missingStartupName: {
    description: 'A revolutionary platform',
    problemStatement: 'Small businesses struggle to find funding',
    solution: 'AI-powered matching platform',
    targetMarket: 'Small to medium businesses'
  },
  shortDescription: {
    startupName: 'TechVenture',
    description: 'Short',
    problemStatement: 'Small businesses struggle to find funding',
    solution: 'AI-powered matching platform',
    targetMarket: 'Small to medium businesses'
  },
  shortProblemStatement: {
    startupName: 'TechVenture',
    description: 'A revolutionary platform connecting entrepreneurs',
    problemStatement: 'Short',
    solution: 'AI-powered matching platform',
    targetMarket: 'Small to medium businesses'
  },
  shortSolution: {
    startupName: 'TechVenture',
    description: 'A revolutionary platform connecting entrepreneurs',
    problemStatement: 'Small businesses struggle to find funding',
    solution: 'Short',
    targetMarket: 'Small to medium businesses'
  },
  shortTargetMarket: {
    startupName: 'TechVenture',
    description: 'A revolutionary platform connecting entrepreneurs',
    problemStatement: 'Small businesses struggle to find funding',
    solution: 'AI-powered matching platform',
    targetMarket: 'Short'
  }
};

/**
 * Application status fixtures
 */
const applicationStatuses = {
  pending: APPLICATION_STATUS.PENDING,
  approved: APPLICATION_STATUS.APPROVED,
  rejected: APPLICATION_STATUS.REJECTED
};

/**
 * Login credentials fixtures
 */
const loginCredentials = {
  valid: {
    email: 'test@example.com',
    password: 'SecurePass123'
  },
  invalidEmail: {
    email: 'wrong@example.com',
    password: 'SecurePass123'
  },
  invalidPassword: {
    email: 'test@example.com',
    password: 'WrongPassword'
  },
  missingEmail: {
    password: 'SecurePass123'
  },
  missingPassword: {
    email: 'test@example.com'
  }
};

/**
 * Profile update fixtures
 */
const profileUpdates = {
  validName: {
    name: 'Updated Name'
  },
  validEmail: {
    email: 'updated@example.com'
  },
  validBoth: {
    name: 'Updated Name',
    email: 'updated@example.com'
  },
  invalidEmail: {
    email: 'invalid-email'
  },
  shortName: {
    name: 'A'
  }
};

module.exports = {
  validUserData,
  invalidUserData,
  validApplicationData,
  invalidApplicationData,
  applicationStatuses,
  loginCredentials,
  profileUpdates
};
