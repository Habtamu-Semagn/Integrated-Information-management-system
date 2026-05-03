/**
 * Application Service Unit Tests
 * 
 * Tests for application service business logic
 */

const ApplicationService = require('./application.service');
const Application = require('./application.model');
const { APPLICATION_STATUS } = require('../../common/constants/status.constant');
const { USER_ROLES } = require('../../common/constants/roles.constant');
const { ForbiddenError, NotFoundError } = require('../../common/utils/error.util');
const dbHelper = require('../../../tests/helpers/db.helper');
const { validApplicationData } = require('../../../tests/helpers/fixtures');
const { createTestUser, createTestUsers } = require('../../../tests/helpers/auth.helper');

describe('Application Service', () => {
  let applicant, staff, admin;

  // Setup and teardown
  beforeAll(async () => {
    await dbHelper.connect();
  });

  afterAll(async () => {
    await dbHelper.disconnect();
  });

  beforeEach(async () => {
    const users = await createTestUsers();
    applicant = users.applicant.user;
    staff = users.staff.user;
    admin = users.admin.user;
  });

  afterEach(async () => {
    await dbHelper.clearDatabase();
  });

  describe('createApplication', () => {
    test('should create application by applicant', async () => {
      const result = await ApplicationService.createApplication(
        applicant._id.toString(),
        validApplicationData.basic
      );

      expect(result).toBeDefined();
      expect(result.userId.toString()).toBe(applicant._id.toString());
      expect(result.startupName).toBe(validApplicationData.basic.startupName);
      expect(result.status).toBe(APPLICATION_STATUS.PENDING);
      expect(result.reviewedBy).toBeNull();
    });

    test('should fail when non-applicant tries to create application', async () => {
      await expect(
        ApplicationService.createApplication(
          staff._id.toString(),
          validApplicationData.basic
        )
      ).rejects.toThrow(ForbiddenError);
    });

    test('should fail when admin tries to create application', async () => {
      await expect(
        ApplicationService.createApplication(
          admin._id.toString(),
          validApplicationData.basic
        )
      ).rejects.toThrow(ForbiddenError);
    });

    test('should set default status to pending', async () => {
      const result = await ApplicationService.createApplication(
        applicant._id.toString(),
        validApplicationData.basic
      );

      expect(result.status).toBe(APPLICATION_STATUS.PENDING);
    });

    test('should set reviewedBy to null initially', async () => {
      const result = await ApplicationService.createApplication(
        applicant._id.toString(),
        validApplicationData.basic
      );

      expect(result.reviewedBy).toBeNull();
    });
  });

  describe('getApplicationsByUser', () => {
    beforeEach(async () => {
      // Create multiple applications for the applicant
      await ApplicationService.createApplication(
        applicant._id.toString(),
        validApplicationData.basic
      );
      await ApplicationService.createApplication(
        applicant._id.toString(),
        validApplicationData.ecommerce
      );
      await ApplicationService.createApplication(
        applicant._id.toString(),
        validApplicationData.healthtech
      );
    });

    test('should return all applications for user', async () => {
      const result = await ApplicationService.getApplicationsByUser(
        applicant._id.toString()
      );

      expect(result).toHaveLength(3);
      result.forEach(app => {
        expect(app.userId.toString()).toBe(applicant._id.toString());
      });
    });

    test('should return applications sorted by createdAt desc', async () => {
      const result = await ApplicationService.getApplicationsByUser(
        applicant._id.toString()
      );

      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].createdAt.getTime()).toBeGreaterThanOrEqual(
          result[i + 1].createdAt.getTime()
        );
      }
    });

    test('should return empty array for user with no applications', async () => {
      const newUser = await createTestUser({ email: 'newuser@test.com' });
      const result = await ApplicationService.getApplicationsByUser(
        newUser._id.toString()
      );

      expect(result).toHaveLength(0);
    });

    test('should only return applications for specified user', async () => {
      const anotherApplicant = await createTestUser({
        email: 'another@test.com',
        role: USER_ROLES.APPLICANT
      });

      await ApplicationService.createApplication(
        anotherApplicant._id.toString(),
        validApplicationData.basic
      );

      const result = await ApplicationService.getApplicationsByUser(
        applicant._id.toString()
      );

      expect(result).toHaveLength(3); // Only original applicant's apps
    });
  });

  describe('getAllApplications', () => {
    beforeEach(async () => {
      // Create applications with different statuses
      const app1 = await ApplicationService.createApplication(
        applicant._id.toString(),
        validApplicationData.basic
      );

      const app2 = await ApplicationService.createApplication(
        applicant._id.toString(),
        validApplicationData.ecommerce
      );

      // Update statuses
      await ApplicationService.updateStatus(
        app1._id.toString(),
        APPLICATION_STATUS.APPROVED,
        staff._id.toString()
      );

      await ApplicationService.updateStatus(
        app2._id.toString(),
        APPLICATION_STATUS.REJECTED,
        staff._id.toString()
      );

      await ApplicationService.createApplication(
        applicant._id.toString(),
        validApplicationData.healthtech
      );
    });

    test('should return all applications without filter', async () => {
      const result = await ApplicationService.getAllApplications({});

      expect(result).toHaveLength(3);
    });

    test('should filter by pending status', async () => {
      const result = await ApplicationService.getAllApplications({
        status: APPLICATION_STATUS.PENDING
      });

      expect(result).toHaveLength(1);
      expect(result[0].status).toBe(APPLICATION_STATUS.PENDING);
    });

    test('should filter by approved status', async () => {
      const result = await ApplicationService.getAllApplications({
        status: APPLICATION_STATUS.APPROVED
      });

      expect(result).toHaveLength(1);
      expect(result[0].status).toBe(APPLICATION_STATUS.APPROVED);
    });

    test('should filter by rejected status', async () => {
      const result = await ApplicationService.getAllApplications({
        status: APPLICATION_STATUS.REJECTED
      });

      expect(result).toHaveLength(1);
      expect(result[0].status).toBe(APPLICATION_STATUS.REJECTED);
    });

    test('should populate userId field', async () => {
      const result = await ApplicationService.getAllApplications({});

      expect(result[0].userId).toBeDefined();
      expect(result[0].userId.name).toBeDefined();
      expect(result[0].userId.email).toBeDefined();
    });

    test('should populate reviewedBy field when set', async () => {
      const result = await ApplicationService.getAllApplications({
        status: APPLICATION_STATUS.APPROVED
      });

      expect(result[0].reviewedBy).toBeDefined();
      expect(result[0].reviewedBy.name).toBeDefined();
    });
  });

  describe('getApplicationById', () => {
    let application;

    beforeEach(async () => {
      application = await ApplicationService.createApplication(
        applicant._id.toString(),
        validApplicationData.basic
      );
    });

    test('should return application by id', async () => {
      const result = await ApplicationService.getApplicationById(
        application._id.toString()
      );

      expect(result).toBeDefined();
      expect(result._id.toString()).toBe(application._id.toString());
    });

    test('should populate userId field', async () => {
      const result = await ApplicationService.getApplicationById(
        application._id.toString()
      );

      expect(result.userId).toBeDefined();
      expect(result.userId.name).toBe(applicant.name);
      expect(result.userId.email).toBe(applicant.email);
    });

    test('should throw NotFoundError for non-existent id', async () => {
      await expect(
        ApplicationService.getApplicationById('507f1f77bcf86cd799439011')
      ).rejects.toThrow(NotFoundError);
    });

    test('should populate reviewedBy when application is reviewed', async () => {
      await ApplicationService.updateStatus(
        application._id.toString(),
        APPLICATION_STATUS.APPROVED,
        staff._id.toString()
      );

      const result = await ApplicationService.getApplicationById(
        application._id.toString()
      );

      expect(result.reviewedBy).toBeDefined();
      expect(result.reviewedBy.name).toBe(staff.name);
    });
  });

  describe('updateStatus', () => {
    let application;

    beforeEach(async () => {
      application = await ApplicationService.createApplication(
        applicant._id.toString(),
        validApplicationData.basic
      );
    });

    test('should update status to approved', async () => {
      const result = await ApplicationService.updateStatus(
        application._id.toString(),
        APPLICATION_STATUS.APPROVED,
        staff._id.toString()
      );

      expect(result.status).toBe(APPLICATION_STATUS.APPROVED);
    });

    test('should update status to rejected', async () => {
      const result = await ApplicationService.updateStatus(
        application._id.toString(),
        APPLICATION_STATUS.REJECTED,
        staff._id.toString()
      );

      expect(result.status).toBe(APPLICATION_STATUS.REJECTED);
    });

    test('should set reviewedBy field', async () => {
      const result = await ApplicationService.updateStatus(
        application._id.toString(),
        APPLICATION_STATUS.APPROVED,
        staff._id.toString()
      );

      expect(result.reviewedBy.toString()).toBe(staff._id.toString());
    });

    test('should update reviewedBy when status changes again', async () => {
      await ApplicationService.updateStatus(
        application._id.toString(),
        APPLICATION_STATUS.APPROVED,
        staff._id.toString()
      );

      const result = await ApplicationService.updateStatus(
        application._id.toString(),
        APPLICATION_STATUS.REJECTED,
        admin._id.toString()
      );

      expect(result.reviewedBy.toString()).toBe(admin._id.toString());
    });

    test('should update updatedAt timestamp', async () => {
      const originalUpdatedAt = application.updatedAt;

      await new Promise(resolve => setTimeout(resolve, 10));

      const result = await ApplicationService.updateStatus(
        application._id.toString(),
        APPLICATION_STATUS.APPROVED,
        staff._id.toString()
      );

      expect(result.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime()
      );
    });

    test('should throw NotFoundError for non-existent application', async () => {
      await expect(
        ApplicationService.updateStatus(
          '507f1f77bcf86cd799439011',
          APPLICATION_STATUS.APPROVED,
          staff._id.toString()
        )
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('validateApplicationOwnership', () => {
    let application;

    beforeEach(async () => {
      application = await ApplicationService.createApplication(
        applicant._id.toString(),
        validApplicationData.basic
      );
    });

    test('should return true for application owner', async () => {
      const result = await ApplicationService.validateApplicationOwnership(
        application._id.toString(),
        applicant._id.toString()
      );

      expect(result).toBe(true);
    });

    test('should return false for non-owner', async () => {
      const anotherUser = await createTestUser({ email: 'another@test.com' });

      const result = await ApplicationService.validateApplicationOwnership(
        application._id.toString(),
        anotherUser._id.toString()
      );

      expect(result).toBe(false);
    });

    test('should throw NotFoundError for non-existent application', async () => {
      await expect(
        ApplicationService.validateApplicationOwnership(
          '507f1f77bcf86cd799439011',
          applicant._id.toString()
        )
      ).rejects.toThrow(NotFoundError);
    });
  });
});
