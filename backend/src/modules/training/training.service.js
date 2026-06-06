const Training = require('./training.model');
const { NotFoundError, ValidationError, ForbiddenError } = require('../../common/utils/error.util');

/**
 * Create a new training course
 * Only admin can create
 */
async function createTraining(trainingData) {
  try {
    const training = await Training.create(trainingData);
    return training.toJSON();
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw new ValidationError(Object.values(error.errors)[0].message);
    }
    throw error;
  }
}

/**
 * Get all active training courses
 */
async function getAllTrainings(filters = {}) {
  try {
    const query = { isActive: true };
    
    if (filters.category) {
      query.category = filters.category;
    }
    if (filters.level) {
      query.level = filters.level;
    }
    
    const trainings = await Training.find(query)
      .populate('enrolledUsers', 'name email')
      .populate('completedUsers.userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);
    
    return trainings.map(t => t.toJSON());
  } catch (error) {
    throw error;
  }
}

/**
 * Get training by ID
 */
async function getTrainingById(trainingId) {
  try {
    const training = await Training.findById(trainingId)
      .populate('enrolledUsers', 'name email')
      .populate('completedUsers.userId', 'name email');
    
    if (!training) {
      throw new NotFoundError('Training course not found');
    }
    
    return training.toJSON();
  } catch (error) {
    if (error.message === 'Training course not found') throw error;
    if (error.name === 'CastError') {
      throw new ValidationError('Invalid training ID format');
    }
    throw error;
  }
}

/**
 * Update training course
 */
async function updateTraining(trainingId, updates) {
  try {
    const training = await Training.findByIdAndUpdate(
      trainingId,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!training) {
      throw new NotFoundError('Training course not found');
    }
    
    return training.toJSON();
  } catch (error) {
    if (error.message === 'Training course not found') throw error;
    if (error.name === 'ValidationError') {
      throw new ValidationError(Object.values(error.errors)[0].message);
    }
    throw error;
  }
}

/**
 * Enroll user in training
 */
async function enrollUser(trainingId, userId) {
  try {
    const training = await Training.findById(trainingId);
    
    if (!training) {
      throw new NotFoundError('Training course not found');
    }
    
    // Check if already enrolled
    if (training.enrolledUsers.includes(userId)) {
      throw new ValidationError('User already enrolled in this training');
    }
    
    training.enrolledUsers.push(userId);
    await training.save();
    
    return training.toJSON();
  } catch (error) {
    if (error.message.includes('already enrolled') || error.message === 'Training course not found') {
      throw error;
    }
    throw error;
  }
}

/**
 * Mark training as completed by user
 */
async function completeTraining(trainingId, userId) {
  try {
    const training = await Training.findById(trainingId);
    
    if (!training) {
      throw new NotFoundError('Training course not found');
    }
    
    // Check if user is enrolled
    if (!training.enrolledUsers.includes(userId)) {
      throw new ForbiddenError('User is not enrolled in this training');
    }
    
    // Check if already completed
    const alreadyCompleted = training.completedUsers.some(
      c => c.userId.toString() === userId.toString()
    );
    
    if (alreadyCompleted) {
      throw new ValidationError('User already completed this training');
    }
    
    training.completedUsers.push({
      userId: userId,
      completedAt: new Date()
    });
    
    await training.save();
    return training.toJSON();
  } catch (error) {
    if (error.message.includes('not enrolled') || error.message.includes('already completed')) {
      throw error;
    }
    throw error;
  }
}

/**
 * Get user's enrolled trainings
 */
async function getUserTrainings(userId) {
  try {
    const trainings = await Training.find({
      enrolledUsers: userId,
      isActive: true
    }).sort({ createdAt: -1 });
    
    return trainings.map(t => t.toJSON());
  } catch (error) {
    throw error;
  }
}

/**
 * Delete training course
 */
async function deleteTraining(trainingId) {
  try {
    const training = await Training.findByIdAndDelete(trainingId);
    
    if (!training) {
      throw new NotFoundError('Training course not found');
    }
    
    return true;
  } catch (error) {
    if (error.message === 'Training course not found') throw error;
    throw error;
  }
}

module.exports = {
  createTraining,
  getAllTrainings,
  getTrainingById,
  updateTraining,
  enrollUser,
  completeTraining,
  getUserTrainings,
  deleteTraining
};
