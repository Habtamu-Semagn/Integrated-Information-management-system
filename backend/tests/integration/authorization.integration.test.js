/**
 * Authorization Integration Tests
 * 
 * Tests for role-based access control across all endpoints
 */

const request = require('supertest');
const app = require('../../src/app');
const dbHelper = require('../helpers/db.helper');
const { validUserData, validApplicationData } = require('../helpers/fixtures');

describe('Authorization Integration', () => {
  let applicantCookies, staffCookies, adminCookies;
  let applicationId;

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
    await request(app)
      .post('/api/auth/register')
      .send(validUserData.applicant);

    const applicantLoginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: validUserData.applicant.email,
        password: validUserData.applicant.password
      });
    applicantCookies = applicantLoginRes.headers['set-cookie'];

    // Register and login staff
    await request(app)
      .post('/api/auth/register')
      .send(validUserData.staff);

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

    // Create a test application
    const createRes = await request(app)
      .post('/api/applications')
      .set('Cookie', applicantCookies)
      .send(validApplicationData.basic);
    applicationId = createRes.body.data.id;
  });

  describe('Applicant Role Authorization', () => {
    test('should allow applicant to create applications', async () => {
      await request(app)
        .post('/api/applications')
        .set('Cookie', applicantCookies)
        .send(validApplicationData.ecommerce)
        .expect(201);
    });

    test('should allow applicant to view their own applications', async () => {
      await request(app)
        .get('/api/applications/my')
        .set('Cookie', applicantCookies)
        .expect(200);
    });

    test('should deny applicant access to all applications endpoint', async () => {
      await request(app)
        .get('/api/applications')
        .set('Cookie', applicantCookies)
        .expect(403);
    });

    test('should deny applicant access to view specific application', async () => {
      await request(app)
        .get(`/api/applications/${applicationId}`)
        .set('Cookie', applicantCookies)
        .expect(403);
    });

    test('should deny applicant access to update application status', async () => {
      await request(app)
        .patch(`/api/applications/${applicationId}/status`)
        .set('Cookie', applicantCookies)
        .send({ status: 'approved' })
        .expect(403);
    });

    test('should allow applicant to access profile', async () => {
      await request(app)
        .get('/api/users/profile')
        .set('Cookie', applicantCookies)
        .expect(200);
    });

    test('should allow applicant to update profile', async () => {
      await request(app)
        .patch('/api/users/profile')
        .set('Cookie', applicantCookies)
        .send({ name: 'Updated Name' })
        .expect(200);
    });
  });

  describe('Staff Role Authorization', () => {
    test('should deny staff from creating applications', async () => {
      await request(app)
        .post('/api/applications')
        .set('Cookie', staffCookies)
        .send(validApplicationData.ecommerce)
        .expect(403);
    });

    test('should deny staff from viewing "my applications" endpoint', async () => {
      await request(app)
        .get('/api/applications/my')
        .set('Cookie', staffCookies)
        .expect(403);
    });

    test('should allow staff to view all applications', async () => {
      await request(app)
        .get('/api/applications')
        .set('Cookie', staffCookies)
        .expect(200);
    });

    test('should allow staff to view specific application', async () => {
      await request(app)
        .get(`/api/applications/${applicationId}`)
        .set('Cookie', staffCookies)
        .expect(200);
    });

    test('should allow staff to update application status', async () => {
      await request(app)
        .patch(`/api/applications/${applicationId}/status`)
        .set('Cookie', staffCookies)
        .send({ status: 'approved' })
        .expect(200);
    });

    test('should allow staff to access profile', async () => {
      await request(app)
        .get('/api/users/profile')
        .set('Cookie', staffCookies)
        .expect(200);
    });

    test('should allow staff to update profile', async () => {
      await request(app)
        .patch('/api/users/profile')
        .set('Cookie', staffCookies)
        .send({ name: 'Updated Staff Name' })
        .expect(200);
    });
  });

  describe('Admin Role Authorization', () => {
    test('should deny admin from creating applications', async () => {
      await request(app)
        .post('/api/applications')
        .set('Cookie', adminCookies)
        .send(validApplicationData.ecommerce)
        .expect(403);
    });

    test('should deny admin from viewing "my applications" endpoint', async () => {
      await request(app)
        .get('/api/applications/my')
        .set('Cookie', adminCookies)
        .expect(403);
    });

    test('should allow admin to view all applications', async () => {
      await request(app)
        .get('/api/applications')
        .set('Cookie', adminCookies)
        .expect(200);
    });

    test('should allow admin to view specific application', async () => {
      await request(app)
        .get(`/api/applications/${applicationId}`)
        .set('Cookie', adminCookies)
        .expect(200);
    });

    test('should allow admin to update application status', async () => {
      await request(app)
        .patch(`/api/applications/${applicationId}/status`)
        .set('Cookie', adminCookies)
        .send({ status: 'rejected' })
        .expect(200);
    });

    test('should allow admin to access profile', async () => {
      await request(app)
        .get('/api/users/profile')
        .set('Cookie', adminCookies)
        .expect(200);
    });

    test('should allow admin to update profile', async () => {
      await request(app)
        .patch('/api/users/profile')
        .set('Cookie', adminCookies)
        .send({ name: 'Updated Admin Name' })
        .expect(200);
    });
  });

  describe('Unauthenticated Access', () => {
    test('should deny unauthenticated access to create application', async () => {
      await request(app)
        .post('/api/applications')
        .send(validApplicationData.basic)
        .expect(401);
    });

    test('should deny unauthenticated access to my applications', async () => {
      await request(app)
        .get('/api/applications/my')
        .expect(401);
    });

    test('should deny unauthenticated access to all applications', async () => {
      await request(app)
        .get('/api/applications')
        .expect(401);
    });

    test('should deny unauthenticated access to specific application', async () => {
      await request(app)
        .get(`/api/applications/${applicationId}`)
        .expect(401);
    });

    test('should deny unauthenticated access to update status', async () => {
      await request(app)
        .patch(`/api/applications/${applicationId}/status`)
        .send({ status: 'approved' })
        .expect(401);
    });

    test('should deny unauthenticated access to profile', async () => {
      await request(app)
        .get('/api/users/profile')
        .expect(401);
    });

    test('should deny unauthenticated access to update profile', async () => {
      await request(app)
        .patch('/api/users/profile')
        .send({ name: 'Updated Name' })
        .expect(401);
    });

    test('should allow unauthenticated access to register', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New User',
          email: 'newuser@test.com',
          password: 'TestPass123',
          role: 'applicant'
        })
        .expect(201);
    });

    test('should allow unauthenticated access to login', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({
          email: validUserData.applicant.email,
          password: validUserData.applicant.password
        })
        .expect(200);
    });

    test('should allow unauthenticated access to logout', async () => {
      await request(app)
        .post('/api/auth/logout')
        .expect(200);
    });
  });

  describe('Cross-Role Access Patterns', () => {
    test('should enforce role hierarchy for application management', async () => {
      // Applicant can create
      await request(app)
        .post('/api/applications')
        .set('Cookie', applicantCookies)
        .send(validApplicationData.ecommerce)
        .expect(201);

      // Staff cannot create
      await request(app)
        .post('/api/applications')
        .set('Cookie', staffCookies)
        .send(validApplicationData.healthtech)
        .expect(403);

      // Admin cannot create
      await request(app)
        .post('/api/applications')
        .set('Cookie', adminCookies)
        .send(validApplicationData.basic)
        .expect(403);
    });

    test('should enforce role hierarchy for application review', async () => {
      // Applicant cannot review
      await request(app)
        .patch(`/api/applications/${applicationId}/status`)
        .set('Cookie', applicantCookies)
        .send({ status: 'approved' })
        .expect(403);

      // Staff can review
      await request(app)
        .patch(`/api/applications/${applicationId}/status`)
        .set('Cookie', staffCookies)
        .send({ status: 'approved' })
        .expect(200);

      // Admin can review
      await request(app)
        .patch(`/api/applications/${applicationId}/status`)
        .set('Cookie', adminCookies)
        .send({ status: 'rejected' })
        .expect(200);
    });

    test('should allow all authenticated users to manage their profile', async () => {
      // Applicant
      await request(app)
        .patch('/api/users/profile')
        .set('Cookie', applicantCookies)
        .send({ name: 'Updated Applicant' })
        .expect(200);

      // Staff
      await request(app)
        .patch('/api/users/profile')
        .set('Cookie', staffCookies)
        .send({ name: 'Updated Staff' })
        .expect(200);

      // Admin
      await request(app)
        .patch('/api/users/profile')
        .set('Cookie', adminCookies)
        .send({ name: 'Updated Admin' })
        .expect(200);
    });
  });
});
