/**
 * Application Controller
 * 
 * Handles HTTP requests for application operations including creation,
 * retrieval, and status updates.
 * 
 * Requirements: 5.1, 5.9, 6.1, 6.2, 6.3, 6.5, 6.6, 7.1, 7.6, 7.8
 */

const applicationService = require('./application.service');
const { successResponse } = require('../../common/utils/response.util');

/**
 * Create application
 * 
 * Handles application creation requests from applicants.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user from auth middleware
 * @param {Object} req.body - Application data
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * Requirements: 5.1, 5.9
 */
async function createApplication(req, res, next) {
  try {
    const userId = req.user.userId;
    const appData = req.body;

    const application = await applicationService.createApplication(userId, appData);

    return successResponse(
      res,
      application,
      'Application created successfully',
      201
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Get my applications
 * 
 * Retrieves all applications for the authenticated applicant.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user from auth middleware
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * Requirements: 6.1
 */
async function getMyApplications(req, res, next) {
  try {
    const userId = req.user.userId;

    const applications = await applicationService.getApplicationsByUser(userId);

    return successResponse(
      res,
      applications,
      'Applications retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Get all applications
 * 
 * Retrieves all applications in the system (staff/admin only).
 * Supports optional status filtering, pagination, and search via query parameters.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} req.query.status - Optional status filter
 * @param {number} req.query.page - Page number (default: 1)
 * @param {number} req.query.limit - Items per page (default: 10)
 * @param {string} req.query.search - Search term for startupName or description
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * Requirements: 6.2, 6.3
 */
async function getAllApplications(req, res, next) {
  try {
    const filters = {};
    
    if (req.query.status) {
      filters.status = req.query.status;
    }

    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const result = await applicationService.getAllApplications(filters, { page, limit, search });

    return successResponse(
      res,
      result,
      'Applications retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Get application by ID
 * 
 * Retrieves a single application with full details (staff/admin only).
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - Application ID
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * Requirements: 6.3, 6.5, 6.6
 */
async function getApplicationById(req, res, next) {
  try {
    const appId = req.params.id;

    const application = await applicationService.getApplicationById(appId);

    return successResponse(
      res,
      application,
      'Application retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Update application status
 * 
 * Updates the status of an application (staff/admin only).
 * Records the reviewer who made the change.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - Application ID
 * @param {Object} req.body - Request body
 * @param {string} req.body.status - New status
 * @param {Object} req.user - Authenticated user from auth middleware
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * 
 * Requirements: 7.1, 7.6, 7.8
 */
async function updateApplicationStatus(req, res, next) {
  try {
    const appId = req.params.id;
    const { status } = req.body;
    const reviewerId = req.user.userId;

    const application = await applicationService.updateStatus(appId, status, reviewerId);

    return successResponse(
      res,
      application,
      'Application status updated successfully'
    );
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createApplication,
  getMyApplications,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus
};
