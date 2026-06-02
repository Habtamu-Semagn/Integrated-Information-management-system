const trainingService = require('./training.service');
const { successResponse } = require('../../common/utils/response.util');

/**
 * Create training course (Admin only)
 */
async function createTraining(req, res, next) {
  try {
    const training = await trainingService.createTraining(req.body);
    return successResponse(res, training, 'Training course created successfully', 201);
  } catch (error) {
    next(error);
  }
}

/**
 * Get all active training courses
 */
async function getAllTrainings(req, res, next) {
  try {
    const filters = {
      category: req.query.category,
      level: req.query.level
    };
    
    const trainings = await trainingService.getAllTrainings(filters);
    return successResponse(res, trainings, 'Training courses retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Get specific training by ID
 */
async function getTrainingById(req, res, next) {
  try {
    const training = await trainingService.getTrainingById(req.params.id);
    return successResponse(res, training, 'Training course retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Update training course (Admin only)
 */
async function updateTraining(req, res, next) {
  try {
    const training = await trainingService.updateTraining(req.params.id, req.body);
    return successResponse(res, training, 'Training course updated successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Enroll user in training
 */
async function enrollInTraining(req, res, next) {
  try {
    const training = await trainingService.enrollUser(req.params.id, req.user.userId);
    return successResponse(res, training, 'Enrolled in training successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Mark training as completed
 */
async function completeTraining(req, res, next) {
  try {
    const training = await trainingService.completeTraining(req.params.id, req.user.userId);
    return successResponse(res, training, 'Training marked as completed');
  } catch (error) {
    next(error);
  }
}

/**
 * Get user's enrolled trainings
 */
async function getUserTrainings(req, res, next) {
  try {
    const trainings = await trainingService.getUserTrainings(req.user.userId);
    return successResponse(res, trainings, 'User trainings retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Delete training course (Admin only)
 */
async function deleteTraining(req, res, next) {
  try {
    await trainingService.deleteTraining(req.params.id);
    return successResponse(res, null, 'Training course deleted successfully');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createTraining,
  getAllTrainings,
  getTrainingById,
  updateTraining,
  enrollInTraining,
  completeTraining,
  getUserTrainings,
  deleteTraining
};
