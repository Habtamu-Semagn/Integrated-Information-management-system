/**
 * Application Service Layer
 * 
 * Provides business logic for application operations including creation,
 * retrieval, and status management.
 * 
 * Requirements: 5.1, 5.2, 5.9, 5.10, 6.1, 6.2, 6.3, 6.6, 6.7, 7.1, 7.2, 7.3, 7.6, 7.7, 7.8
 */

const Application = require('./application.model');
const userService = require('../users/user.service');
const { NotFoundError, ForbiddenError, ValidationError } = require('../../common/utils/error.util');
const { USER_ROLES } = require('../../common/constants/roles.constant');
const { APPLICATION_STATUS } = require('../../common/constants/status.constant');

/**
 * Create new application
 * 
 * Creates a startup application for an applicant user.
 * Only users with 'applicant' role can create applications.
 * 
 * @param {string} userId - User's MongoDB ObjectId
 * @param {Object} appData - Application data
 * @returns {Promise<Object>} Created application object
 * @throws {ForbiddenError} If user is not an applicant
 * @throws {ValidationError} If validation fails
 * 
 * Requirements: 5.1, 5.2, 5.10
 */
async function createApplication(userId, appData) {
  // Verify user exists and has applicant role
  const user = await userService.getUserById(userId);
  
  if (user.role !== USER_ROLES.APPLICANT) {
    throw new ForbiddenError('Only applicants can create applications');
  }

  try {
    // Create application
    const application = new Application({
      userId,
      startupName: appData.startupName,
      description: appData.description,
      problemStatement: appData.problemStatement,
      solution: appData.solution,
      targetMarket: appData.targetMarket
    });

    await application.save();

    return application.toJSON();
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      throw new ValidationError(messages.join(', '));
    }
    throw error;
  }
}

/**
 * Get applications by user
 * 
 * Retrieves all applications for a specific user, sorted by creation date (newest first).
 * 
 * @param {string} userId - User's MongoDB ObjectId
 * @returns {Promise<Array>} Array of application objects
 * 
 * Requirements: 5.9, 6.1
 */
async function getApplicationsByUser(userId) {
  const applications = await Application.find({ userId })
    .sort({ createdAt: -1 })
    .lean();

  return applications.map(app => ({
    ...app,
    id: app._id.toString(),
    _id: undefined,
    __v: undefined
  }));
}

/**
 * Get all applications
 * 
 * Retrieves all applications in the system with optional filtering, pagination, and search.
 * Populates user data for userId and reviewedBy fields.
 * 
 * @param {Object} filters - Optional filter criteria
 * @param {string} filters.status - Filter by status
 * @param {Object} options - Pagination and search options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Items per page (default: 10)
 * @param {string} options.search - Search term for startupName or description
 * @returns {Promise<Object>} Object with applications array and pagination metadata
 * 
 * Requirements: 6.2, 6.3
 */
async function getAllApplications(filters = {}, options = {}) {
  const { page = 1, limit = 10, search = '' } = options;
  
  const query = {};

  // Status filter
  if (filters.status) {
    query.status = filters.status;
  }

  // Search filter (case-insensitive search on startupName and description)
  if (search) {
    query.$or = [
      { startupName: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Get total count for pagination
  const total = await Application.countDocuments(query);

  // Get paginated applications
  const applications = await Application.find(query)
    .populate('userId', 'name email role')
    .populate('reviewedBy', 'name email role')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const formattedApplications = applications.map(app => ({
    ...app,
    id: app._id.toString(),
    userId: app.userId ? {
      id: app.userId._id.toString(),
      name: app.userId.name,
      email: app.userId.email,
      role: app.userId.role
    } : null,
    reviewedBy: app.reviewedBy ? {
      id: app.reviewedBy._id.toString(),
      name: app.reviewedBy.name,
      email: app.reviewedBy.email,
      role: app.reviewedBy.role
    } : null,
    _id: undefined,
    __v: undefined
  }));

  return {
    applications: formattedApplications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
}

/**
 * Get application by ID
 * 
 * Retrieves a single application with populated user data.
 * 
 * @param {string} appId - Application's MongoDB ObjectId
 * @returns {Promise<Object>} Application object with populated user data
 * @throws {NotFoundError} If application does not exist
 * 
 * Requirements: 6.3, 6.6
 */
async function getApplicationById(appId) {
  if (!appId || !appId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new ValidationError('Invalid application ID format');
  }

  const application = await Application.findById(appId)
    .populate('userId', 'name email role')
    .populate('reviewedBy', 'name email role')
    .lean();

  if (!application) {
    throw new NotFoundError('Application not found');
  }

  return {
    ...application,
    id: application._id.toString(),
    userId: application.userId ? {
      id: application.userId._id.toString(),
      name: application.userId.name,
      email: application.userId.email,
      role: application.userId.role
    } : null,
    reviewedBy: application.reviewedBy ? {
      id: application.reviewedBy._id.toString(),
      name: application.reviewedBy.name,
      email: application.reviewedBy.email,
      role: application.reviewedBy.role
    } : null,
    _id: undefined,
    __v: undefined
  };
}

/**
 * Update application status
 * 
 * Updates the status of an application and records the reviewer.
 * Only staff and admin users can update status.
 * 
 * @param {string} appId - Application's MongoDB ObjectId
 * @param {string} status - New status (pending, approved, rejected)
 * @param {string} reviewerId - Reviewer's MongoDB ObjectId
 * @returns {Promise<Object>} Updated application object
 * @throws {NotFoundError} If application does not exist
 * @throws {ForbiddenError} If reviewer is not staff or admin
 * @throws {ValidationError} If status is invalid or unchanged
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.6, 7.7, 7.8
 */
async function updateStatus(appId, status, reviewerId) {
  // Validate application ID
  if (!appId || !appId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new ValidationError('Invalid application ID format');
  }

  // Validate status
  if (!Object.values(APPLICATION_STATUS).includes(status)) {
    throw new ValidationError('Invalid status value');
  }

  // Verify reviewer exists and has correct role
  const reviewer = await userService.getUserById(reviewerId);
  
  if (![USER_ROLES.STAFF, USER_ROLES.ADMIN].includes(reviewer.role)) {
    throw new ForbiddenError('Only staff or admin can update application status');
  }

  // Find application
  const application = await Application.findById(appId);

  if (!application) {
    throw new NotFoundError('Application not found');
  }

  // Check if status is already set to the new value
  if (application.status === status) {
    throw new ValidationError('Application already has this status');
  }

  // Update status and reviewer
  application.status = status;
  application.reviewedBy = reviewerId;

  await application.save();

  // Return populated application
  return await getApplicationById(appId);
}

/**
 * Validate application ownership
 * 
 * Checks if a user owns a specific application.
 * 
 * @param {string} appId - Application's MongoDB ObjectId
 * @param {string} userId - User's MongoDB ObjectId
 * @returns {Promise<boolean>} True if user owns the application
 * @throws {NotFoundError} If application does not exist
 * 
 * Requirements: 6.7
 */
async function validateApplicationOwnership(appId, userId) {
  if (!appId || !appId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new ValidationError('Invalid application ID format');
  }

  const application = await Application.findById(appId).select('userId').lean();

  if (!application) {
    throw new NotFoundError('Application not found');
  }

  return application.userId.toString() === userId;
}

module.exports = {
  createApplication,
  getApplicationsByUser,
  getAllApplications,
  getApplicationById,
  updateStatus,
  validateApplicationOwnership
};
