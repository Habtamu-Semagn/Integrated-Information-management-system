/**
 * Health Check Routes
 * 
 * System health and status endpoints
 */

const express = require('express');
const router = express.Router();

/**
 * GET /api/health
 * 
 * Health check endpoint
 * Returns system status
 * 
 * Public endpoint - no authentication required
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
