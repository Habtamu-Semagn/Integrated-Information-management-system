const Fund = require('./fund.model');
const FundApplication = require('./fund-application.model');
const { NotFoundError, ValidationError, ConflictError } = require('../../common/utils/error.util');

/**
 * Create a new fund opportunity (Admin only)
 */
async function createFund(fundData) {
  try {
    // Validate that minimumAmount <= maximumAmount
    if (fundData.minimumAmount > fundData.maximumAmount) {
      throw new ValidationError('Minimum amount cannot be greater than maximum amount');
    }
    
    // Validate deadline is in the future
    if (new Date(fundData.deadline) < new Date()) {
      throw new ValidationError('Deadline must be in the future');
    }
    
    const fund = await Fund.create(fundData);
    return fund.toJSON();
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw new ValidationError(Object.values(error.errors)[0].message);
    }
    throw error;
  }
}

/**
 * Get all funds with optional filters
 */
async function getAllFunds(filters = {}) {
  try {
    const query = {};
    
    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.fundType) {
      query.fundType = filters.fundType;
    }
    if (filters.onlyOpen) {
      query.status = 'open';
      query.deadline = { $gte: new Date() };
    }
    
    const funds = await Fund.find(query)
      .sort({ deadline: 1 })
      .limit(100);
    
    return funds.map(f => f.toJSON());
  } catch (error) {
    throw error;
  }
}

/**
 * Get fund by ID
 */
async function getFundById(fundId) {
  try {
    const fund = await Fund.findById(fundId)
      .populate('applications');
    
    if (!fund) {
      throw new NotFoundError('Fund opportunity not found');
    }
    
    return fund.toJSON();
  } catch (error) {
    if (error.message === 'Fund opportunity not found') throw error;
    if (error.name === 'CastError') {
      throw new ValidationError('Invalid fund ID format');
    }
    throw error;
  }
}

/**
 * Update fund opportunity
 */
async function updateFund(fundId, updates) {
  try {
    if (updates.minimumAmount && updates.maximumAmount) {
      if (updates.minimumAmount > updates.maximumAmount) {
        throw new ValidationError('Minimum amount cannot be greater than maximum amount');
      }
    }
    
    const fund = await Fund.findByIdAndUpdate(fundId, updates, {
      new: true,
      runValidators: true
    });
    
    if (!fund) {
      throw new NotFoundError('Fund opportunity not found');
    }
    
    return fund.toJSON();
  } catch (error) {
    if (error.message === 'Fund opportunity not found') throw error;
    if (error.name === 'ValidationError') {
      throw new ValidationError(Object.values(error.errors)[0].message);
    }
    throw error;
  }
}

/**
 * Delete fund opportunity
 */
async function deleteFund(fundId) {
  try {
    const fund = await Fund.findByIdAndDelete(fundId);
    
    if (!fund) {
      throw new NotFoundError('Fund opportunity not found');
    }
    
    // Delete associated applications
    await FundApplication.deleteMany({ fundId });
    
    return true;
  } catch (error) {
    if (error.message === 'Fund opportunity not found') throw error;
    throw error;
  }
}

module.exports = {
  createFund,
  getAllFunds,
  getFundById,
  updateFund,
  deleteFund
};
