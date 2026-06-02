const competitionService = require('./competition.service');
const { successResponse } = require('../../common/utils/response.util');

/**
 * Create competition (Admin only)
 */
async function createCompetition(req, res, next) {
  try {
    const competition = await competitionService.createCompetition(req.body);
    return successResponse(res, competition, 'Competition created successfully', 201);
  } catch (error) {
    next(error);
  }
}

/**
 * Get all competitions
 */
async function getAllCompetitions(req, res, next) {
  try {
    const filters = {
      status: req.query.status,
      competitionType: req.query.competitionType,
      upcomingOnly: req.query.upcomingOnly === 'true'
    };
    
    const competitions = await competitionService.getAllCompetitions(filters);
    return successResponse(res, competitions, 'Competitions retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Get competition by ID
 */
async function getCompetitionById(req, res, next) {
  try {
    const competition = await competitionService.getCompetitionById(req.params.id);
    return successResponse(res, competition, 'Competition retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Update competition (Admin)
 */
async function updateCompetition(req, res, next) {
  try {
    const competition = await competitionService.updateCompetition(req.params.id, req.body);
    return successResponse(res, competition, 'Competition updated successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Delete competition (Admin)
 */
async function deleteCompetition(req, res, next) {
  try {
    await competitionService.deleteCompetition(req.params.id);
    return successResponse(res, null, 'Competition deleted successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Register for competition
 */
async function registerForCompetition(req, res, next) {
  try {
    const competition = await competitionService.registerForCompetition(
      req.params.id,
      req.user.userId
    );
    return successResponse(res, competition, 'Registered for competition successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Unregister from competition
 */
async function unregisterFromCompetition(req, res, next) {
  try {
    const competition = await competitionService.unregisterFromCompetition(
      req.params.id,
      req.user.userId
    );
    return successResponse(res, competition, 'Unregistered from competition successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Publish competition results (Admin)
 */
async function publishResults(req, res, next) {
  try {
    const competition = await competitionService.publishResults(req.params.id, req.body.results);
    return successResponse(res, competition, 'Competition results published successfully');
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createCompetition,
  getAllCompetitions,
  getCompetitionById,
  updateCompetition,
  deleteCompetition,
  registerForCompetition,
  unregisterFromCompetition,
  publishResults
};
