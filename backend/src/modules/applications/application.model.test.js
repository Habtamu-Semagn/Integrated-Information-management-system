/**
 * Application Model Unit Tests
 * 
 * Tests for Application model validation, defaults, and relationships
 */

const mongoose = require('mongoose');
const Application = require('./application.model');
const User = require('../users/user.model');
const { APPLICATION_STATUS } = require('../../common/constants/status.constant');
const dbHelper = require('../../../tests/helpers/db.helper');
const { validApplicationData, invalidApplicationData } = require('../../../tests/helpers/fixtures');
const { createTestUser } = require('../../../tests/helpers/auth.helper');

describe('Application Model', () => {
  let testUser;

  // Setup and teardown
  beforeAll(async () => {
    await dbHelper.connect();
  });

  afterAll(async () => {
    await dbHelper.disconnect();
  });

  beforeEach(async () => {
    testUser = await createTestUser();
  });

  afterEach(async () => {
    await dbHelper.clearDatabase();
  });

  describe('Schema Validation', () => {
    test('should create a valid application', async () => {
      const applicationData = {
        ...validApplicationData.basic,
        userId: testUser._id
      };

      const application = await Application.create(applicationData);

      expect(application._id).toBeDefined();
      expect(application.userId.toString()).toBe(testUser._id.toString());
      expect(application.startupName).toBe(validApplicationData.basic.startupName);
      expect(application.description).toBe(validApplicationData.basic.description);
      expect(application.problemStatement).toBe(validApplicationData.basic.problemStatement);
      expect(application.solution).toBe(validApplicationData.basic.solution);
      expect(application.targetMarket).toBe(validApplicationData.basic.targetMarket);
      expect(application.createdAt).toBeDefined();
      expect(application.updatedAt).toBeDefined();
    });

    test('should fail without required userId', async () => {
      await expect(Application.create(validApplicationData.basic))
        .rejects
        .toThrow();
    });

    test('should fail without required startupName', async () => {
      const data = {
        ...invalidApplicationData.missingStartupName,
        userId: testUser._id
      };

      await expect(Application.create(data))
        .rejects
        .toThrow();
    });

    test('should fail with short description', async () => {
      const data = {
        ...invalidApplicationData.shortDescription,
        userId: testUser._id
      };

      await expect(Application.create(data))
        .rejects
        .toThrow();
    });

    test('should fail with short problemStatement', async () => {
      const data = {
        ...invalidApplicationData.shortProblemStatement,
        userId: testUser._id
      };

      await expect(Application.create(data))
        .rejects
        .toThrow();
    });

    test('should fail with short solution', async () => {
      const data = {
        ...invalidApplicationData.shortSolution,
        userId: testUser._id
      };

      await expect(Application.create(data))
        .rejects
        .toThrow();
    });

    test('should fail with short targetMarket', async () => {
      const data = {
        ...invalidApplicationData.shortTargetMarket,
        userId: testUser._id
      };

      await expect(Application.create(data))
        .rejects
        .toThrow();
    });
  });

  describe('Default Values', () => {
    test('should default status to pending', async () => {
      const applicationData = {
        ...validApplicationData.basic,
        userId: testUser._id
      };

      const application = await Application.create(applicationData);
      expect(application.status).toBe(APPLICATION_STATUS.PENDING);
    });

    test('should default reviewedBy to null', async () => {
      const applicationData = {
        ...validApplicationData.basic,
        userId: testUser._id
      };

      const application = await Application.create(applicationData);
      expect(application.reviewedBy).toBeNull();
    });
  });

  describe('Status Field', () => {
    test('should accept pending status', async () => {
      const applicationData = {
        ...validApplicationData.basic,
        userId: testUser._id,
        status: APPLICATION_STATUS.PENDING
      };

      const application = await Application.create(applicationData);
      expect(application.status).toBe(APPLICATION_STATUS.PENDING);
    });

    test('should accept approved status', async () => {
      const applicationData = {
        ...validApplicationData.basic,
        userId: testUser._id,
        status: APPLICATION_STATUS.APPROVED
      };

      const application = await Application.create(applicationData);
      expect(application.status).toBe(APPLICATION_STATUS.APPROVED);
    });

    test('should accept rejected status', async () => {
      const applicationData = {
        ...validApplicationData.basic,
        userId: testUser._id,
        status: APPLICATION_STATUS.REJECTED
      };

      const application = await Application.create(applicationData);
      expect(application.status).toBe(APPLICATION_STATUS.REJECTED);
    });

    test('should reject invalid status', async () => {
      const applicationData = {
        ...validApplicationData.basic,
        userId: testUser._id,
        status: 'invalid-status'
      };

      await expect(Application.create(applicationData))
        .rejects
        .toThrow();
    });
  });

  describe('Timestamps', () => {
    test('should set createdAt on creation', async () => {
      const applicationData = {
        ...validApplicationData.basic,
        userId: testUser._id
      };

      const application = await Application.create(applicationData);

      expect(application.createdAt).toBeDefined();
      expect(application.createdAt).toBeInstanceOf(Date);
    });

    test('should set updatedAt on creation', async () => {
      const applicationData = {
        ...validApplicationData.basic,
        userId: testUser._id
      };

      const application = await Application.create(applicationData);

      expect(application.updatedAt).toBeDefined();
      expect(application.updatedAt).toBeInstanceOf(Date);
    });

    test('should update updatedAt on modification', async () => {
      const applicationData = {
        ...validApplicationData.basic,
        userId: testUser._id
      };

      const application = await Application.create(applicationData);
      const originalUpdatedAt = application.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10));

      application.status = APPLICATION_STATUS.APPROVED;
      await application.save();

      expect(application.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('Population', () => {
    test('should populate userId field', async () => {
      const applicationData = {
        ...validApplicationData.basic,
        userId: testUser._id
      };

      const application = await Application.create(applicationData);
      const populatedApp = await Application.findById(application._id).populate('userId');

      expect(populatedApp.userId).toBeDefined();
      expect(populatedApp.userId.name).toBe(testUser.name);
      expect(populatedApp.userId.email).toBe(testUser.email);
    });

    test('should populate reviewedBy field when set', async () => {
      const reviewer = await createTestUser({ email: 'reviewer@test.com' });
      
      const applicationData = {
        ...validApplicationData.basic,
        userId: testUser._id,
        status: APPLICATION_STATUS.APPROVED,
        reviewedBy: reviewer._id
      };

      const application = await Application.create(applicationData);
      const populatedApp = await Application.findById(application._id).populate('reviewedBy');

      expect(populatedApp.reviewedBy).toBeDefined();
      expect(populatedApp.reviewedBy.name).toBe(reviewer.name);
      expect(populatedApp.reviewedBy.email).toBe(reviewer.email);
    });
  });

  describe('Virtual Fields', () => {
    test('should include id virtual field', async () => {
      const applicationData = {
        ...validApplicationData.basic,
        userId: testUser._id
      };

      const application = await Application.create(applicationData);
      const appJSON = application.toJSON();

      expect(appJSON.id).toBeDefined();
      expect(appJSON.id).toBe(application._id.toString());
    });
  });

  describe('Indexes', () => {
    test('should have compound index on userId and createdAt', async () => {
      const indexes = Application.schema.indexes();
      const hasCompoundIndex = indexes.some(index => {
        const fields = index[0];
        return fields.userId && fields.createdAt;
      });

      expect(hasCompoundIndex).toBe(true);
    });

    test('should have index on status field', async () => {
      const indexes = Application.schema.indexes();
      const hasStatusIndex = indexes.some(index => {
        const fields = index[0];
        return fields.status !== undefined;
      });

      expect(hasStatusIndex).toBe(true);
    });
  });
});
