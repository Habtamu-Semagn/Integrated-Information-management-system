const FundApplication = require('./fund-application.model');
const Fund = require('./fund.model');
const { NotFoundError, ValidationError, ConflictError } = require('../../common/utils/error.util');

/**
 * Create a fund application
 */
async function createFundApplication(fundId, userId, applicationData) {
  try {
    // Verify fund exists and is open
    const fund = await Fund.findById(fundId);
    if (!fund) {
      throw new NotFoundError('Fund opportunity not found');
    }
    
    if (fund.status !== 'open') {
      throw new ValidationError('This fund opportunity is not accepting applications');
    }
    
    if (new Date() > fund.deadline) {
      throw new ValidationError('Application deadline has passed');
    }
    
    // Check if user already applied for this fund
    const existingApp = await FundApplication.findOne({
      fundId,
      startupId: userId
    });
    
    if (existingApp) {
      throw new ConflictError('You have already applied for this fund opportunity');
    }
    
    // Validate application data
    if (applicationData.fundingRequired < fund.minimumAmount || 
        applicationData.fundingRequired > fund.maximumAmount) {
      throw new ValidationError(
        `Funding required must be between ${fund.minimumAmount} and ${fund.maximumAmount}`
      );
    }
    
    const application = await FundApplication.create({
      fundId,
      startupId: userId,
      applicationData
    });
    
    // Add to fund's applications list
    fund.applications.push(application._id);
    await fund.save();
    
    return application.toJSON();
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('not accepting')) {
      throw error;
    }
    if (error.name === 'ValidationError') {
      throw new ValidationError(Object.values(error.errors)[0].message);
    }
    throw error;
  }
}

/**
 * Get user's fund applications
 */
async function getUserFundApplications(userId) {
  try {
    const applications = await FundApplication.find({ startupId: userId })
      .populate('fundId')
      .sort({ createdAt: -1 });
    
    return applications.map(a => a.toJSON());
  } catch (error) {
    throw error;
  }
}

/**
 * Get specific fund application
 */
async function getFundApplicationById(applicationId) {
  try {
    const application = await FundApplication.findById(applicationId)
      .populate('fundId')
      .populate('startupId', 'name email')
      .populate('reviewedBy', 'name email');
    
    if (!application) {
      throw new NotFoundError('Fund application not found');
    }
    
    return application.toJSON();
  } catch (error) {
    if (error.message === 'Fund application not found') throw error;
    if (error.name === 'CastError') {
      throw new ValidationError('Invalid application ID format');
    }
    throw error;
  }
}

/**
 * Get applications for a fund (Admin/Reviewer)
 */
async function getFundApplications(fundId, filters = {}) {
  try {
    const query = { fundId };
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    const applications = await FundApplication.find(query)
      .populate('startupId', 'name email')
      .sort({ createdAt: -1 });
    
    return applications.map(a => a.toJSON());
  } catch (error) {
    throw error;
  }
}

/**
 * Update fund application status (Admin/Reviewer)
 */
async function updateApplicationStatus(applicationId, status, reviewerId, comments = null) {
  try {
    const application = await FundApplication.findById(applicationId);
    
    if (!application) {
      throw new NotFoundError('Fund application not found');
    }
    
    application.status = status;
    application.reviewedBy = reviewerId;
    application.reviewComments = comments;
    application.reviewDate = new Date();
    
    await application.save();
    
    return application.toJSON();
  } catch (error) {
    if (error.message === 'Fund application not found') throw error;
    throw error;
  }
}

/**
 * Withdraw fund application
 */
async function withdrawApplication(applicationId, userId) {
  try {
    const application = await FundApplication.findById(applicationId);
    
    if (!application) {
      throw new NotFoundError('Fund application not found');
    }
    
    if (application.startupId.toString() !== userId.toString()) {
      throw new ValidationError('You can only withdraw your own application');
    }
    
    if (application.status === 'withdrawn') {
      throw new ValidationError('Application is already withdrawn');
    }
    
    application.status = 'withdrawn';
    await application.save();
    
    return application.toJSON();
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('can only withdraw')) {
      throw error;
    }
    throw error;
  }
}

module.exports = {
  createFundApplication,
  getUserFundApplications,
  getFundApplicationById,
  getFundApplications,
  updateApplicationStatus,
  withdrawApplication
};
