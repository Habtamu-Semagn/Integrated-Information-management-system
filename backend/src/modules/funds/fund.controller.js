const fundService = require('./fund.service');
const fundApplicationService = require('./fund-application.service');
const { successResponse } = require('../../common/utils/response.util');

/**
 * Create fund opportunity (Admin)
 */
async function createFund(req, res, next) {
  try {
    const fund = await fundService.createFund(req.body);
    return successResponse(res, fund, 'Fund opportunity created successfully', 201);
  } catch (error) {
    next(error);
  }
}

/**
 * Get all funds
 */
async function getAllFunds(req, res, next) {
  try {
    const filters = {
      status: req.query.status,
      fundType: req.query.fundType,
      onlyOpen: req.query.onlyOpen === 'true'
    };
    
    const funds = await fundService.getAllFunds(filters);
    return successResponse(res, funds, 'Fund opportunities retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Get fund by ID
 */
async function getFundById(req, res, next) {
  try {
    const fund = await fundService.getFundById(req.params.id);
    return successResponse(res, fund, 'Fund opportunity retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Update fund (Admin)
 */
async function updateFund(req, res, next) {
  try {
    const fund = await fundService.updateFund(req.params.id, req.body);
    return successResponse(res, fund, 'Fund opportunity updated successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Delete fund (Admin)
 */
async function deleteFund(req, res, next) {
  try {
    await fundService.deleteFund(req.params.id);
    return successResponse(res, null, 'Fund opportunity deleted successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Apply for fund
 */
async function applyForFund(req, res, next) {
  try {
    const application = await fundApplicationService.createFundApplication(
      req.params.fundId,
      req.user.userId,
      req.body
    );
    return successResponse(res, application, 'Fund application submitted successfully', 201);
  } catch (error) {
    next(error);
  }
}

/**
 * Get user's fund applications
 */
async function getUserApplications(req, res, next) {
  try {
    const applications = await fundApplicationService.getUserFundApplications(req.user.userId);
    return successResponse(res, applications, 'Fund applications retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Get fund application by ID
 */
async function getApplicationById(req, res, next) {
  try {
    const application = await fundApplicationService.getFundApplicationById(req.params.applicationId);
    return successResponse(res, application, 'Fund application retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Get applications for a fund (Admin/Staff)
 */
async function getFundApplications(req, res, next) {
  try {
    const filters = { status: req.query.status };
    const applications = await fundApplicationService.getFundApplications(req.params.fundId, filters);
    return successResponse(res, applications, 'Fund applications retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Update application status (Admin/Staff)
 */
async function updateApplicationStatus(req, res, next) {
  try {
    const application = await fundApplicationService.updateApplicationStatus(
      req.params.applicationId,
      req.body.status,
      req.user.userId,
      req.body.comments
    );
    return successResponse(res, application, 'Application status updated successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Withdraw fund application
 */
async function withdrawApplication(req, res, next) {
  try {
    const application = await fundApplicationService.withdrawApplication(
      req.params.applicationId,
      req.user.userId
    );
    return successResponse(res, application, 'Application withdrawn successfully');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createFund,
  getAllFunds,
  getFundById,
  updateFund,
  deleteFund,
  applyForFund,
  getUserApplications,
  getApplicationById,
  getFundApplications,
  updateApplicationStatus,
  withdrawApplication
};
