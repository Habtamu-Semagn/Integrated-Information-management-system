/**
 * Express Application Configuration
 * 
 * Configures Express app with middleware, routes, and error handling.
 * 
 * Requirements: 10.3, 18.1, 18.2, 18.3, 18.4
 */

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const { notFound, errorHandler } = require('./common/middleware/error.middleware');
const swaggerSpec = require('./docs/swagger');

// Import routes
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');
const applicationRoutes = require('./modules/applications/application.routes');
const trainingRoutes = require('./modules/training/training.routes');
const fundRoutes = require('./modules/funds/fund.routes');
const competitionRoutes = require('./modules/competitions/competition.routes');
const eventRoutes = require('./modules/events/event.routes');
const healthRoutes = require('./common/routes/health.routes');

// Create Express app
const app = express();

// Security middleware - helmet sets various HTTP headers for security
app.use(helmet());

// CORS configuration - allow frontend origin with credentials
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true, // Allow cookies to be sent
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parser middleware - parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware - parse cookies from requests
app.use(cookieParser());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// API Documentation - Swagger UI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Startup Backend System API Documentation'
}));

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/funds', fundRoutes);
app.use('/api/competitions', competitionRoutes);
app.use('/api/events', eventRoutes);

// 404 Not Found middleware - must be after all routes
app.use(notFound);

// Error handling middleware - must be last
app.use(errorHandler);

module.exports = app;
