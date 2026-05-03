/**
 * Application Lifecycle Integration Tests
 * 
 * Tests for complete application lifecycle: create → review → status update
 */

const request = require('supertest');
const app = require('../../src/app');
const dbHelper = require('../helpers/db.helper');
const { validUserData, validApplicationData } = require('../helpers/fixtures');
const { APPLICATION_STATUS } = require('../../src/common/constants/status.constant');

describe('Application Lifecycle Integration', () => {
  let applicantCookies, staffCookies, adminCookies;
  let applicantId, staffId;

  // Setup and teardown
  beforeAll(async () => {
    await dbHelper.connect();
  });

  afterAll(async () => {
    await dbHelper.disconnect();
  });

  beforeEach(async () => {
    await dbHelper.clearDatabase();

    // Register and login applicant
    const applicantRegRes = await request(app)
      .post('/api/auth/register')
      .send(validUserData.applicant);
    applicantId = applicantRegRes.body.data.id;

    const applicantLoginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: validUserData.applicant.email,
        password: validUserData.applicant.password
      });
    applicantCookies = applicantLoginRes.headers['set-cookie'];

    // Register and login staff
    const staffRegRes = await request(app)
      .post('/api/auth/register')
      .send(validUserData.staff);
    staffId = staffRegRes.body.data.id;

    const staffLoginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: validUserData.staff.email,
        password: validUserData.staff.password
      });
    staffCookies = staffLoginRes.headers['set-cookie'];

    // Register and login admin
    await request(app)
      .post('/api/auth/register')
      .send(validUserData.admin);

    const adminLoginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: validUserData.admin.email,
        password: validUserData.admin.password
      });
    adminCookies = adminLoginRes.headers['set-cookie'];
  });

  describe('Complete Application Lifecycle', () => {
    test('should complete full lifecycle: create → staff reviews → applicant views updated status', async () => {
      // Step 1: Applicant creates application
      const createRes = await request(app)
        .post('/api/applications')
        .set('Cookie', applicantCookies)
        .send(validApplicationData.basic)
        .expect(201);

      expect(createRes.body.success).toBe(true);
      expect(createRes.body.data.status).toBe(APPLICATION_STATUS.PENDING);
      expect(createRes.body.data.reviewedBy).toBeNull();

      const applicationId = createRes.body.data.id;

      // Step 2: Staff updates status to approved
      const updateRes = await request(app)
        .patch(`/api/applications/${applicationId}/status`)
        .set('Cookie', staffCookies)
        .send({ status: APPLICATION_STATUS.APPROVED })
        .expect(200);

      expect(updateRes.body.success).toBe(true);
      expect(updateRes.body.data.status).toBe(APPLICATION_STATUS.APPROVED);
      expect(updateRes.body.data.reviewedBy).toBe(staffId);

      // Step 3: Applicant views updated application
      const viewRes = await request(app)
        .get('/api/applications/my')
        .set('Cookie', applicantCookies)
        .expect(200);

      expect(viewRes.body.success).toBe(true);
      expect(viewRes.body.data).toHaveLength(1);
      expect(viewRes.body.data[0].status).toBe(APPLICATION_STATUS.APPROVED);
      expect(viewRes.body.data[0].reviewedBy).toBe(staffId);
    });

    test('should persist status changes', async () => {
      // Create application
      const createRes = await request(app)
        .post('/api/applications')
        .set('Cookie', applicantCookies)
        .send(validApplicationData.basic);

      const applicationId = createRes.body.data.id;

      // Update to approved
      await request(app)
        .patch(`/api/applications/${applicationId}/status`)
        .set('Cookie', staffCookies)
        .send({ status: APPLICATION_STATUS.APPROVED });

      // Verify status persisted
      const viewRes = await request(app)
        .get(`/api/applications/${applicationId}`)
        .set('Cookie', staffCookies)
        .expect(200);

      expect(viewRes.body.data.status).toBe(APPLICATION_STATUS.APPROVED);
    });

    test('should set reviewedBy correctly', async () => {
      // Create application
      const createRes = await request(app)
        .post('/api/applications')
        .set('Cookie', applicantCookies)
        .send(validApplicationData.basic);

      const applicationId = createRes.body.data.id;

      // Staff reviews
      await request(app)
        .patch(`/api/applications/${applicationId}/status`)
        .set('Cookie', staffCookies)
        .send({ status: APPLICATION_STATUS.APPROVED });

      // Verify reviewedBy is set to staff
      const viewRes = await request(app)
        .get(`/api/applications/${applicationId}`)
        .set('Cookie', staffCookies)
        .expect(200);

      expect(viewRes.body.data.reviewedBy).toBeDefined();
      expect(viewRes.body.data.reviewedBy.id).toBe(staffId);
    });

    test('should update reviewedBy when different reviewer changes status', async () => {
      // Create application
      const createRes = await request(app)
        .post('/api/applications')
        .set('Cookie', applicantCookies)
        .send(validApplicationData.basic);

      const applicationId = createRes.body.data.id;

      // Staff approves
      await request(app)
        .patch(`/api/applications/${applicationId}/status`)
        .set('Cookie', staffCookies)
        .send({ status: APPLICATION_STATUS.APPROVED });

      // Admin rejects
      await request(app)
        .patch(`/api/applications/${applicationId}/status`)
        .set('Cookie', adminCookies)
        .send({ status: APPLICATION_STATUS.REJECTED });

      // Verify reviewedBy is now admin
      const viewRes = await request(app)
        .get(`/api/applications/${applicationId}`)
        .set('Cookie', staffCookies)
        .expect(200);

      expect(viewRes.body.data.status).toBe(APPLICATION_STATUS.REJECTED);
      expect(viewRes.body.data.reviewedBy.email).toBe(validUserData.admin.email);
    });
  });

  describe('Application Ownership Isolation', () => {
    test('should only show applicant their own applications', async () => {
      // Applicant 1 creates applications
      await request(app)
        .post('/api/applications')
        .set('Cookie', applicantCookies)
        .send(validApplicationData.basic);

      await request(app)
        .post('/api/applications')
        .set('Cookie', applicantCookies)
        .send(validApplicationData.ecommerce);

      // Create another applicant
      await request(app)
        .post('/api/auth/register')
        .send({
          ...validUserData.applicant,
          email: 'applicant2@test.com'
        });

      const applicant2LoginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'applicant2@test.com',
          password: validUserData.applicant.password
        });

      const applicant2Cookies = applicant2LoginRes.headers['set-cookie'];

      // Applicant 2 creates application
      await request(app)
        .post('/api/applications')
        .set('Cookie', applicant2Cookies)
        .send(validApplicationData.healthtech);

      // Applicant 1 should only see their 2 applications
      const applicant1Res = await request(app)
        .get('/api/applications/my')
        .set('Cookie', applicantCookies)
        .expect(200);

      expect(applicant1Res.body.data).toHaveLength(2);

      // Applicant 2 should only see their 1 application
      const applicant2Res = await request(app)
        .get('/api/applications/my')
        .set('Cookie', applicant2Cookies)
        .expect(200);

      expect(applicant2Res.body.data).toHaveLength(1);
    });

    test('should prevent cross-user data leakage', async () => {
      // Applicant 1 creates application
      const createRes = await request(app)
        .post('/api/applications')
        .set('Cookie', applicantCookies)
        .send(validApplicationData.basic);

      const applicationId = createRes.body.data.id;

      // Create another applicant
      await request(app)
        .post('/api/auth/register')
        .send({
          ...validUserData.applicant,
          email: 'applicant2@test.com'
        });

      const applicant2LoginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'applicant2@test.com',
          password: validUserData.applicant.password
        });

      const applicant2Cookies = applicant2LoginRes.headers['set-cookie'];

      // Applicant 2 should not see applicant 1's applications
      const viewRes = await request(app)
        .get('/api/applications/my')
        .set('Cookie', applicant2Cookies)
        .expect(200);

      expect(viewRes.body.data).toHaveLength(0);
      expect(viewRes.body.data.find(app => app.id === applicationId)).toBeUndefined();
    });
  });

  describe('Staff and Admin Access', () => {
    test('should allow staff to view all applications', async () => {
      // Create multiple applications from different applicants
      await request(app)
        .post('/api/applications')
        .set('Cookie', applicantCookies)
        .send(validApplicationData.basic);

      await request(app)
        .post('/api/applications')
        .set('Cookie', applicantCookies)
        .send(validApplicationData.ecommerce);

      // Staff should see all applications
      const staffRes = await request(app)
        .get('/api/applications')
        .set('Cookie', staffCookies)
        .expect(200);

      expect(staffRes.body.data).toHaveLength(2);
    });

    test('should allow admin to view all applications', async () => {
      // Create applications
      await request(app)
        .post('/api/applications')
        .set('Cookie', applicantCookies)
        .send(validApplicationData.basic);

      // Admin should see all applications
      const adminRes = await request(app)
        .get('/api/applications')
        .set('Cookie', adminCookies)
        .expect(200);

      expect(adminRes.body.data).toHaveLength(1);
    });

    test('should allow staff to update application status', async () => {
      const createRes = await request(app)
        .post('/api/applications')
        .set('Cookie', applicantCookies)
        .send(validApplicationData.basic);

      const applicationId = createRes.body.data.id;

      await request(app)
        .patch(`/api/applications/${applicationId}/status`)
        .set('Cookie', staffCookies)
        .send({ status: APPLICATION_STATUS.APPROVED })
        .expect(200);
    });

    test('should allow admin to update application status', async () => {
      const createRes = await request(app)
        .post('/api/applications')
        .set('Cookie', applicantCookies)
        .send(validApplicationData.basic);

      const applicationId = createRes.body.data.id;

      await request(app)
        .patch(`/api/applications/${applicationId}/status`)
        .set('Cookie', adminCookies)
        .send({ status: APPLICATION_STATUS.REJECTED })
        .expect(200);
    });
  });

  describe('Error Cases', () => {
    test('should return 404 for non-existent application', async () => {
      await request(app)
        .get('/api/applications/507f1f77bcf86cd799439011')
        .set('Cookie', staffCookies)
        .expect(404);
    });

    test('should return 400 for invalid application data', async () => {
      await request(app)
        .post('/api/applications')
        .set('Cookie', applicantCookies)
        .send({
          startupName: 'A', // Too short
          description: 'Short'
        })
        .expect(400);
    });

    test('should return 400 for invalid status value', async () => {
      const createRes = await request(app)
        .post('/api/applications')
        .set('Cookie', applicantCookies)
        .send(validApplicationData.basic);

      const applicationId = createRes.body.data.id;

      await request(app)
        .patch(`/api/applications/${applicationId}/status`)
        .set('Cookie', staffCookies)
        .send({ status: 'invalid-status' })
        .expect(400);
    });
  });
});
