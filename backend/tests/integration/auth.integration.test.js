/**
 * Authentication Flow Integration Tests
 * 
 * Tests for complete authentication flow including registration, login, and protected endpoints
 */

const request = require('supertest');
const app = require('../../src/app');
const dbHelper = require('../helpers/db.helper');
const { validUserData } = require('../helpers/fixtures');

describe('Authentication Flow Integration', () => {
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

  describe('Registration → Login → Access Protected Endpoint', () => {
    test('should complete full authentication flow', async () => {
      // Step 1: Register
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send(validUserData.applicant)
        .expect(201);

      expect(registerRes.body.success).toBe(true);
      expect(registerRes.body.data.email).toBe(validUserData.applicant.email);
      expect(registerRes.body.data.password).toBeUndefined();

      // Step 2: Login
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: validUserData.applicant.email,
          password: validUserData.applicant.password
        })
        .expect(200);

      expect(loginRes.body.success).toBe(true);
      expect(loginRes.body.data.token).toBeDefined();

      // Extract cookie
      const cookies = loginRes.headers['set-cookie'];
      expect(cookies).toBeDefined();

      // Step 3: Access protected endpoint
      const profileRes = await request(app)
        .get('/api/users/profile')
        .set('Cookie', cookies)
        .expect(200);

      expect(profileRes.body.success).toBe(true);
      expect(profileRes.body.data.email).toBe(validUserData.applicant.email);
    });

    test('should set token in HTTP-only cookie after login', async () => {
      // Register
      await request(app)
        .post('/api/auth/register')
        .send(validUserData.applicant);

      // Login
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: validUserData.applicant.email,
          password: validUserData.applicant.password
        });

      const cookies = loginRes.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toContain('token=');
      expect(cookies[0]).toContain('HttpOnly');
    });

    test('should clear token cookie after logout', async () => {
      // Register and login
      await request(app)
        .post('/api/auth/register')
        .send(validUserData.applicant);

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: validUserData.applicant.email,
          password: validUserData.applicant.password
        });

      const cookies = loginRes.headers['set-cookie'];

      // Logout
      const logoutRes = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', cookies)
        .expect(200);

      expect(logoutRes.body.success).toBe(true);

      const logoutCookies = logoutRes.headers['set-cookie'];
      expect(logoutCookies[0]).toContain('token=;');
      expect(logoutCookies[0]).toContain('Max-Age=0');
    });

    test('should reject access to protected endpoint without token', async () => {
      await request(app)
        .get('/api/users/profile')
        .expect(401);
    });

    test('should reject access with invalid token', async () => {
      await request(app)
        .get('/api/users/profile')
        .set('Cookie', ['token=invalid.token.here'])
        .expect(401);
    });
  });

  describe('Token Persistence', () => {
    test('should maintain authentication across multiple requests', async () => {
      // Register and login
      await request(app)
        .post('/api/auth/register')
        .send(validUserData.applicant);

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: validUserData.applicant.email,
          password: validUserData.applicant.password
        });

      const cookies = loginRes.headers['set-cookie'];

      // Make multiple authenticated requests
      await request(app)
        .get('/api/users/profile')
        .set('Cookie', cookies)
        .expect(200);

      await request(app)
        .get('/api/users/profile')
        .set('Cookie', cookies)
        .expect(200);

      await request(app)
        .get('/api/users/profile')
        .set('Cookie', cookies)
        .expect(200);
    });

    test('should reject requests after logout', async () => {
      // Register and login
      await request(app)
        .post('/api/auth/register')
        .send(validUserData.applicant);

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: validUserData.applicant.email,
          password: validUserData.applicant.password
        });

      const cookies = loginRes.headers['set-cookie'];

      // Logout
      await request(app)
        .post('/api/auth/logout')
        .set('Cookie', cookies);

      // Try to access protected endpoint
      await request(app)
        .get('/api/users/profile')
        .set('Cookie', cookies)
        .expect(401);
    });
  });

  describe('Cookie Security', () => {
    test('should set HttpOnly flag on cookie', async () => {
      await request(app)
        .post('/api/auth/register')
        .send(validUserData.applicant);

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: validUserData.applicant.email,
          password: validUserData.applicant.password
        });

      const cookies = loginRes.headers['set-cookie'];
      expect(cookies[0]).toContain('HttpOnly');
    });

    test('should set SameSite flag on cookie', async () => {
      await request(app)
        .post('/api/auth/register')
        .send(validUserData.applicant);

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: validUserData.applicant.email,
          password: validUserData.applicant.password
        });

      const cookies = loginRes.headers['set-cookie'];
      expect(cookies[0]).toContain('SameSite=Strict');
    });

    test('should set Max-Age on cookie', async () => {
      await request(app)
        .post('/api/auth/register')
        .send(validUserData.applicant);

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: validUserData.applicant.email,
          password: validUserData.applicant.password
        });

      const cookies = loginRes.headers['set-cookie'];
      expect(cookies[0]).toContain('Max-Age=');
    });
  });

  describe('Error Handling', () => {
    test('should return 401 for invalid credentials', async () => {
      await request(app)
        .post('/api/auth/register')
        .send(validUserData.applicant);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: validUserData.applicant.email,
          password: 'WrongPassword'
        })
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    test('should return 409 for duplicate email registration', async () => {
      await request(app)
        .post('/api/auth/register')
        .send(validUserData.applicant);

      const res = await request(app)
        .post('/api/auth/register')
        .send(validUserData.applicant)
        .expect(409);

      expect(res.body.success).toBe(false);
    });

    test('should return 400 for invalid registration data', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'A', // Too short
          email: 'invalid-email',
          password: 'short',
          role: 'applicant'
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });
});
