/**
 * User Service Unit Tests
 * 
 * Tests for user service layer business logic functions.
 * Uses in-memory MongoDB for isolated testing.
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('./user.model');
const {
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  validateUserRole
} = require('./user.service');
const {
  NotFoundError,
  ConflictError,
  ValidationError
} = require('../../common/utils/error.util');

let mongoServer;

// Setup: Start in-memory MongoDB before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

// Teardown: Stop in-memory MongoDB after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear database between tests
afterEach(async () => {
  await User.deleteMany({});
});

describe('User Service - getUserById', () => {
  test('should return user without password field', async () => {
    // Create a test user
    const testUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'applicant'
    });

    const result = await getUserById(testUser._id.toString());

    expect(result).toBeDefined();
    expect(result.id).toBe(testUser._id.toString());
    expect(result.name).toBe('John Doe');
    expect(result.email).toBe('john@example.com');
    expect(result.role).toBe('applicant');
    expect(result.password).toBeUndefined();
    expect(result._id).toBeUndefined();
  });

  test('should throw NotFoundError for non-existent user', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();

    await expect(getUserById(fakeId)).rejects.toThrow(NotFoundError);
    await expect(getUserById(fakeId)).rejects.toThrow('User not found');
  });

  test('should throw ValidationError for invalid ObjectId', async () => {
    await expect(getUserById('invalid-id')).rejects.toThrow(ValidationError);
    await expect(getUserById('invalid-id')).rejects.toThrow('Invalid user ID format');
  });

  test('should throw ValidationError for empty userId', async () => {
    await expect(getUserById('')).rejects.toThrow(ValidationError);
    await expect(getUserById(null)).rejects.toThrow(ValidationError);
  });
});

describe('User Service - getUserByEmail', () => {
  test('should return user by email without password', async () => {
    await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
      role: 'staff'
    });

    const result = await getUserByEmail('jane@example.com');

    expect(result).toBeDefined();
    expect(result.name).toBe('Jane Smith');
    expect(result.email).toBe('jane@example.com');
    expect(result.role).toBe('staff');
    expect(result.password).toBeUndefined();
    expect(result._id).toBeUndefined();
    expect(result.id).toBeDefined();
  });

  test('should return null for non-existent email', async () => {
    const result = await getUserByEmail('nonexistent@example.com');

    expect(result).toBeNull();
  });

  test('should be case-insensitive for email lookup', async () => {
    await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });

    const result = await getUserByEmail('TEST@EXAMPLE.COM');

    expect(result).toBeDefined();
    expect(result.email).toBe('test@example.com');
  });

  test('should throw ValidationError for invalid email format', async () => {
    await expect(getUserByEmail('invalid-email')).rejects.toThrow(ValidationError);
    await expect(getUserByEmail('invalid-email')).rejects.toThrow('Invalid email format');
  });

  test('should throw ValidationError for empty email', async () => {
    await expect(getUserByEmail('')).rejects.toThrow(ValidationError);
    await expect(getUserByEmail(null)).rejects.toThrow(ValidationError);
  });
});

describe('User Service - createUser', () => {
  test('should create user with hashed password', async () => {
    const userData = {
      name: 'New User',
      email: 'newuser@example.com',
      password: 'password123',
      role: 'applicant'
    };

    const result = await createUser(userData);

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.name).toBe('New User');
    expect(result.email).toBe('newuser@example.com');
    expect(result.role).toBe('applicant');
    expect(result.password).toBeUndefined();
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();

    // Verify password is hashed in database
    const userInDb = await User.findById(result.id).select('+password');
    expect(userInDb.password).not.toBe('password123');
    expect(userInDb.password).toMatch(/^\$2[aby]\$/); // bcrypt hash pattern
  });

  test('should create user with default role if not specified', async () => {
    const userData = {
      name: 'Default Role User',
      email: 'default@example.com',
      password: 'password123'
    };

    const result = await createUser(userData);

    expect(result.role).toBe('applicant');
  });

  test('should throw ConflictError for duplicate email', async () => {
    const userData = {
      name: 'User One',
      email: 'duplicate@example.com',
      password: 'password123'
    };

    await createUser(userData);

    const duplicateData = {
      name: 'User Two',
      email: 'duplicate@example.com',
      password: 'password456'
    };

    await expect(createUser(duplicateData)).rejects.toThrow(ConflictError);
    await expect(createUser(duplicateData)).rejects.toThrow('Email already registered');
  });

  test('should throw ValidationError for invalid name length', async () => {
    const userData = {
      name: 'A', // Too short (min 2 chars)
      email: 'test@example.com',
      password: 'password123'
    };

    await expect(createUser(userData)).rejects.toThrow(ValidationError);
  });

  test('should throw ValidationError for invalid password length', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'short' // Too short (min 8 chars)
    };

    await expect(createUser(userData)).rejects.toThrow(ValidationError);
  });

  test('should convert email to lowercase', async () => {
    const userData = {
      name: 'Test User',
      email: 'TEST@EXAMPLE.COM',
      password: 'password123'
    };

    const result = await createUser(userData);

    expect(result.email).toBe('test@example.com');
  });
});

describe('User Service - updateUser', () => {
  test('should update user name', async () => {
    const user = await User.create({
      name: 'Original Name',
      email: 'original@example.com',
      password: 'password123'
    });

    const result = await updateUser(user._id.toString(), {
      name: 'Updated Name'
    });

    expect(result.name).toBe('Updated Name');
    expect(result.email).toBe('original@example.com');
    expect(result.password).toBeUndefined();
  });

  test('should update user email', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'old@example.com',
      password: 'password123'
    });

    const result = await updateUser(user._id.toString(), {
      email: 'new@example.com'
    });

    expect(result.email).toBe('new@example.com');
    expect(result.name).toBe('Test User');
  });

  test('should update both name and email', async () => {
    const user = await User.create({
      name: 'Old Name',
      email: 'old@example.com',
      password: 'password123'
    });

    const result = await updateUser(user._id.toString(), {
      name: 'New Name',
      email: 'new@example.com'
    });

    expect(result.name).toBe('New Name');
    expect(result.email).toBe('new@example.com');
  });

  test('should throw ConflictError when updating to existing email', async () => {
    await User.create({
      name: 'User One',
      email: 'user1@example.com',
      password: 'password123'
    });

    const user2 = await User.create({
      name: 'User Two',
      email: 'user2@example.com',
      password: 'password123'
    });

    await expect(
      updateUser(user2._id.toString(), { email: 'user1@example.com' })
    ).rejects.toThrow(ConflictError);
  });

  test('should allow updating to same email (case insensitive)', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });

    const result = await updateUser(user._id.toString(), {
      email: 'TEST@EXAMPLE.COM'
    });

    expect(result.email).toBe('test@example.com');
  });

  test('should throw NotFoundError for non-existent user', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();

    await expect(
      updateUser(fakeId, { name: 'New Name' })
    ).rejects.toThrow(NotFoundError);
  });

  test('should throw ValidationError for invalid ObjectId', async () => {
    await expect(
      updateUser('invalid-id', { name: 'New Name' })
    ).rejects.toThrow(ValidationError);
  });

  test('should ignore non-allowed fields', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'applicant'
    });

    const result = await updateUser(user._id.toString(), {
      name: 'Updated Name',
      role: 'admin', // Should be ignored
      password: 'newpassword' // Should be ignored
    });

    expect(result.name).toBe('Updated Name');
    expect(result.role).toBe('applicant'); // Unchanged

    // Verify password unchanged in database
    const userInDb = await User.findById(user._id).select('+password');
    const isPasswordSame = await userInDb.comparePassword('password123');
    expect(isPasswordSame).toBe(true);
  });

  test('should return current user if no valid updates provided', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });

    const result = await updateUser(user._id.toString(), {
      role: 'admin' // Not an allowed field
    });

    expect(result.name).toBe('Test User');
    expect(result.email).toBe('test@example.com');
  });

  test('should update updatedAt timestamp', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });

    const originalUpdatedAt = user.updatedAt;

    // Wait a bit to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 10));

    const result = await updateUser(user._id.toString(), {
      name: 'Updated Name'
    });

    expect(new Date(result.updatedAt).getTime()).toBeGreaterThan(
      new Date(originalUpdatedAt).getTime()
    );
  });
});

describe('User Service - validateUserRole', () => {
  test('should return true for user with allowed role', async () => {
    const user = await User.create({
      name: 'Staff User',
      email: 'staff@example.com',
      password: 'password123',
      role: 'staff'
    });

    const result = await validateUserRole(user._id.toString(), ['staff', 'admin']);

    expect(result).toBe(true);
  });

  test('should return false for user without allowed role', async () => {
    const user = await User.create({
      name: 'Applicant User',
      email: 'applicant@example.com',
      password: 'password123',
      role: 'applicant'
    });

    const result = await validateUserRole(user._id.toString(), ['staff', 'admin']);

    expect(result).toBe(false);
  });

  test('should return true for single allowed role', async () => {
    const user = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });

    const result = await validateUserRole(user._id.toString(), ['admin']);

    expect(result).toBe(true);
  });

  test('should throw NotFoundError for non-existent user', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();

    await expect(
      validateUserRole(fakeId, ['staff'])
    ).rejects.toThrow(NotFoundError);
  });

  test('should throw ValidationError for invalid ObjectId', async () => {
    await expect(
      validateUserRole('invalid-id', ['staff'])
    ).rejects.toThrow(ValidationError);
  });

  test('should throw ValidationError for empty allowedRoles array', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });

    await expect(
      validateUserRole(user._id.toString(), [])
    ).rejects.toThrow(ValidationError);
  });

  test('should throw ValidationError for non-array allowedRoles', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });

    await expect(
      validateUserRole(user._id.toString(), 'staff')
    ).rejects.toThrow(ValidationError);
  });
});
