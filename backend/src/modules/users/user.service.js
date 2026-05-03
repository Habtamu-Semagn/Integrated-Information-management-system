/**
 * User Service Layer
 * 
 * Provides business logic functions for user operations.
 * Handles user data retrieval, creation, updates, and role validation.
 * All responses exclude password field for security.
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.7, 8.1, 8.2, 8.4, 9.3
 */

const User = require('./user.model');
const { NotFoundError, ConflictError, ValidationError } = require('../../common/utils/error.util');

/**
 * Get user by ID
 * 
 * Retrieves a user document by their unique ID.
 * Password field is automatically excluded from the response.
 * 
 * @param {string} userId - MongoDB ObjectId of the user
 * @returns {Promise<Object>} User object without password field
 * @throws {ValidationError} If userId is not a valid ObjectId
 * @throws {NotFoundError} If user does not exist
 * 
 * Requirements: 8.1, 8.4, 9.3
 * 
 * @example
 * const user = await getUserById('507f1f77bcf86cd799439011');
 * // Returns: { id: '...', name: 'John', email: 'john@example.com', role: 'applicant', createdAt: ... }
 */
async function getUserById(userId) {
  // Validate ObjectId format
  if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new ValidationError('Invalid user ID format');
  }

  // Find user by ID (password is excluded by default due to select: false in schema)
  const user = await User.findById(userId).select('+password').lean();

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Remove password field before returning
  delete user.password;
  
  // Convert _id to id for consistent API format
  if (user._id) {
    user.id = user._id.toString();
    delete user._id;
  }

  return user;
}

/**
 * Get user by email
 * 
 * Retrieves a user document by their email address.
 * Returns null if user does not exist (used for checking email availability).
 * Password field is automatically excluded from the response.
 * 
 * @param {string} email - User's email address
 * @returns {Promise<Object|null>} User object without password field, or null if not found
 * @throws {ValidationError} If email format is invalid
 * 
 * Requirements: 1.3, 8.1, 9.3
 * 
 * @example
 * const user = await getUserByEmail('john@example.com');
 * if (user) {
 *   console.log('User exists');
 * } else {
 *   console.log('Email available');
 * }
 */
async function getUserByEmail(email) {
  // Validate email format
  if (!email || typeof email !== 'string') {
    throw new ValidationError('Email is required');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format');
  }

  // Find user by email (password excluded by default)
  const user = await User.findOne({ email: email.toLowerCase() }).lean();

  if (!user) {
    return null;
  }

  // Convert _id to id for consistent API format
  if (user._id) {
    user.id = user._id.toString();
    delete user._id;
  }

  return user;
}

/**
 * Create new user
 * 
 * Creates a new user with hashed password.
 * Password is automatically hashed by the User model's pre-save hook.
 * Returns sanitized user data without password field.
 * 
 * @param {Object} userData - User data object
 * @param {string} userData.name - User's full name (2-100 characters)
 * @param {string} userData.email - User's email address (must be unique)
 * @param {string} userData.password - User's password (min 8 characters, will be hashed)
 * @param {string} [userData.role='applicant'] - User's role (applicant, staff, admin)
 * @returns {Promise<Object>} Created user object without password field
 * @throws {ValidationError} If validation fails
 * @throws {ConflictError} If email already exists
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.7, 9.3
 * 
 * @example
 * const newUser = await createUser({
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   password: 'SecurePass123',
 *   role: 'applicant'
 * });
 * // Returns: { id: '...', name: 'John Doe', email: 'john@example.com', role: 'applicant', ... }
 */
async function createUser(userData) {
  // Check if email already exists
  const existingUser = await User.findOne({ email: userData.email.toLowerCase() });
  
  if (existingUser) {
    throw new ConflictError('Email already registered');
  }

  try {
    // Create new user (password will be hashed by pre-save hook)
    const user = new User({
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: userData.password,
      role: userData.role || 'applicant'
    });

    await user.save();

    // Convert to JSON to apply toJSON transform (removes password)
    const userObject = user.toJSON();

    return userObject;
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      throw new ValidationError(messages.join(', '));
    }

    // Handle duplicate key error (email uniqueness)
    if (error.code === 11000) {
      throw new ConflictError('Email already registered');
    }

    // Re-throw other errors
    throw error;
  }
}

/**
 * Update user
 * 
 * Updates allowed user fields (name, email only).
 * Other fields like role and password are not modifiable through this function.
 * Password field is excluded from the response.
 * 
 * @param {string} userId - MongoDB ObjectId of the user to update
 * @param {Object} updates - Object containing fields to update
 * @param {string} [updates.name] - New name (2-100 characters)
 * @param {string} [updates.email] - New email (must be unique)
 * @returns {Promise<Object>} Updated user object without password field
 * @throws {ValidationError} If userId is invalid or validation fails
 * @throws {NotFoundError} If user does not exist
 * @throws {ConflictError} If new email already exists
 * 
 * Requirements: 8.2, 8.4, 8.5, 9.3
 * 
 * @example
 * const updatedUser = await updateUser('507f1f77bcf86cd799439011', {
 *   name: 'John Smith',
 *   email: 'john.smith@example.com'
 * });
 * // Returns: { id: '...', name: 'John Smith', email: 'john.smith@example.com', ... }
 */
async function updateUser(userId, updates) {
  // Validate ObjectId format
  if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new ValidationError('Invalid user ID format');
  }

  // Find user first to check existence
  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Only allow updating specific fields (name, email)
  const allowedUpdates = {};
  
  if (updates.name !== undefined) {
    allowedUpdates.name = updates.name;
  }
  
  if (updates.email !== undefined) {
    // Check if new email already exists (and it's not the current user's email)
    const emailLower = updates.email.toLowerCase();
    if (emailLower !== user.email.toLowerCase()) {
      const existingUser = await User.findOne({ email: emailLower });
      if (existingUser) {
        throw new ConflictError('Email already in use');
      }
    }
    allowedUpdates.email = emailLower;
  }

  // If no valid updates provided, return current user
  if (Object.keys(allowedUpdates).length === 0) {
    return user.toJSON();
  }

  try {
    // Update user with allowed fields
    Object.assign(user, allowedUpdates);
    await user.save();

    // Convert to JSON to apply toJSON transform (removes password)
    const userObject = user.toJSON();

    return userObject;
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      throw new ValidationError(messages.join(', '));
    }

    // Handle duplicate key error (email uniqueness)
    if (error.code === 11000) {
      throw new ConflictError('Email already in use');
    }

    // Re-throw other errors
    throw error;
  }
}

/**
 * Validate user role
 * 
 * Checks if a user has one of the allowed roles.
 * Used for authorization checks in middleware and controllers.
 * 
 * @param {string} userId - MongoDB ObjectId of the user
 * @param {string[]} allowedRoles - Array of allowed role strings
 * @returns {Promise<boolean>} True if user has an allowed role, false otherwise
 * @throws {ValidationError} If userId is invalid
 * @throws {NotFoundError} If user does not exist
 * 
 * Requirements: 4.1, 4.2
 * 
 * @example
 * const isAuthorized = await validateUserRole('507f1f77bcf86cd799439011', ['staff', 'admin']);
 * if (isAuthorized) {
 *   // Allow access
 * } else {
 *   // Deny access
 * }
 */
async function validateUserRole(userId, allowedRoles) {
  // Validate ObjectId format
  if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new ValidationError('Invalid user ID format');
  }

  // Validate allowedRoles parameter
  if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
    throw new ValidationError('Allowed roles must be a non-empty array');
  }

  // Find user by ID
  const user = await User.findById(userId).select('role').lean();

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Check if user's role is in the allowed roles list
  return allowedRoles.includes(user.role);
}

module.exports = {
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  validateUserRole
};
