const Competition = require('./competition.model');
const { NotFoundError, ValidationError, ConflictError } = require('../../common/utils/error.util');

/**
 * Create a new competition (Admin only)
 */
async function createCompetition(competitionData) {
  try {
    // Validate dates
    if (new Date(competitionData.registrationDeadline) >= new Date(competitionData.competitionDate)) {
      throw new ValidationError('Registration deadline must be before competition date');
    }
    
    const competition = await Competition.create(competitionData);
    return competition.toJSON();
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw new ValidationError(Object.values(error.errors)[0].message);
    }
    throw error;
  }
}

/**
 * Get all competitions
 */
async function getAllCompetitions(filters = {}) {
  try {
    const query = {};
    
    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.competitionType) {
      query.competitionType = filters.competitionType;
    }
    if (filters.upcomingOnly) {
      query.status = { $in: ['upcoming', 'ongoing'] };
    }
    
    const competitions = await Competition.find(query)
      .populate('participants', 'name email _id')
      .sort({ competitionDate: 1 })
      .limit(100);
    
    return competitions.map(c => c.toJSON());
  } catch (error) {
    throw error;
  }
}

/**
 * Get competition by ID
 */
async function getCompetitionById(competitionId) {
  try {
    const competition = await Competition.findById(competitionId)
      .populate('participants', 'name email _id')
      .populate('results.firstPlaceWinner', 'name')
      .populate('results.secondPlaceWinner', 'name')
      .populate('results.thirdPlaceWinner', 'name');
    
    if (!competition) {
      throw new NotFoundError('Competition not found');
    }
    
    return competition.toJSON();
  } catch (error) {
    if (error.message === 'Competition not found') throw error;
    if (error.name === 'CastError') {
      throw new ValidationError('Invalid competition ID format');
    }
    throw error;
  }
}

/**
 * Update competition (Admin only)
 */
async function updateCompetition(competitionId, updates) {
  try {
    const competition = await Competition.findByIdAndUpdate(
      competitionId,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!competition) {
      throw new NotFoundError('Competition not found');
    }
    
    return competition.toJSON();
  } catch (error) {
    if (error.message === 'Competition not found') throw error;
    if (error.name === 'ValidationError') {
      throw new ValidationError(Object.values(error.errors)[0].message);
    }
    throw error;
  }
}

/**
 * Register user for competition
 */
async function registerForCompetition(competitionId, userId) {
  try {
    const competition = await Competition.findById(competitionId);
    
    if (!competition) {
      throw new NotFoundError('Competition not found');
    }
    
    // Check if registration deadline passed
    if (new Date() > competition.registrationDeadline) {
      throw new ValidationError('Registration deadline has passed');
    }
    
    // Check if user already registered
    if (competition.participants.includes(userId)) {
      throw new ConflictError('User already registered for this competition');
    }
    
    // Check max participants
    if (competition.maxParticipants && competition.participants.length >= competition.maxParticipants) {
      throw new ValidationError('Competition is full, no more registrations allowed');
    }
    
    competition.participants.push(userId);
    await competition.save();
    
    // Fetch the updated competition with populated participants to return consistent data
    const updatedCompetition = await Competition.findById(competitionId)
      .populate('participants', 'name email _id');
    
    return updatedCompetition.toJSON();
  } catch (error) {
    if (error.message.includes('already registered') || error.message.includes('not found')) {
      throw error;
    }
    throw error;
  }
}

/**
 * Unregister user from competition
 */
async function unregisterFromCompetition(competitionId, userId) {
  try {
    const competition = await Competition.findById(competitionId);
    
    if (!competition) {
      throw new NotFoundError('Competition not found');
    }
    
    // Check if user is registered
    if (!competition.participants.includes(userId)) {
      throw new ValidationError('User is not registered for this competition');
    }
    
    // Check if competition already started
    if (new Date() > competition.competitionDate) {
      throw new ValidationError('Cannot unregister after competition has started');
    }
    
    competition.participants = competition.participants.filter(
      p => p.toString() !== userId.toString()
    );
    await competition.save();
    
    // Fetch the updated competition with populated participants to return consistent data
    const updatedCompetition = await Competition.findById(competitionId)
      .populate('participants', 'name email _id');
    
    return updatedCompetition.toJSON();
  } catch (error) {
    if (error.message.includes('not registered') || error.message.includes('not found')) {
      throw error;
    }
    throw error;
  }
}

/**
 * Publish competition results (Admin)
 */
async function publishResults(competitionId, results) {
  try {
    const competition = await Competition.findById(competitionId);
    
    if (!competition) {
      throw new NotFoundError('Competition not found');
    }
    
    competition.results = results;
    competition.status = 'completed';
    await competition.save();
    
    return competition.toJSON();
  } catch (error) {
    if (error.message === 'Competition not found') throw error;
    throw error;
  }
}

/**
 * Delete competition (Admin)
 */
async function deleteCompetition(competitionId) {
  try {
    const competition = await Competition.findByIdAndDelete(competitionId);
    
    if (!competition) {
      throw new NotFoundError('Competition not found');
    }
    
    return true;
  } catch (error) {
    if (error.message === 'Competition not found') throw error;
    throw error;
  }
}

module.exports = {
  createCompetition,
  getAllCompetitions,
  getCompetitionById,
  updateCompetition,
  registerForCompetition,
  unregisterFromCompetition,
  publishResults,
  deleteCompetition
};
