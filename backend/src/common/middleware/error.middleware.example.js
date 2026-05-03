/**
 * Example Usage of Error Handling Middleware
 * 
 * This file demonstrates how to use the notFound and errorHandler middleware
 * in an Express application, along with examples of throwing custom errors.
 */

const express = require('express');
const { notFound, errorHandler } = require('./error.middleware');
const {
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError
} = require('../utils/error.util');

const app = express();

// ============================================================================
// EXAMPLE 1: Setting up error middleware in Express app
// ============================================================================

// Body parser middleware
app.use(express.json());

// Define your routes here
app.get('/api/users', (req, res) => {
  res.json({ success: true, data: [] });
});

// IMPORTANT: Place notFound middleware AFTER all route definitions
// This catches any requests that don't match defined routes
app.use(notFound);

// IMPORTANT: Place errorHandler middleware LAST
// This catches all errors thrown in routes and other middleware
app.use(errorHandler);

// ============================================================================
// EXAMPLE 2: Throwing custom errors in route handlers
// ============================================================================

// Example: Validation Error (400)
app.post('/api/users/register', (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.includes('@')) {
      throw new ValidationError('Email format is invalid');
    }

    if (!password || password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters');
    }

    // Registration logic here...
    res.json({ success: true, data: { id: '123', email } });
  } catch (error) {
    next(error); // Pass error to error handler middleware
  }
});

// Example: Unauthorized Error (401)
app.get('/api/users/profile', (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    // Token verification logic here...
    // If token is invalid:
    throw new UnauthorizedError('Invalid token');

    // If token is expired:
    throw new UnauthorizedError('Token expired');
  } catch (error) {
    next(error);
  }
});

// Example: Forbidden Error (403)
app.patch('/api/applications/:id/status', (req, res, next) => {
  try {
    const userRole = req.user?.role; // Assume req.user is set by auth middleware

    if (userRole !== 'staff' && userRole !== 'admin') {
      throw new ForbiddenError('Access denied. Insufficient permissions');
    }

    // Status update logic here...
    res.json({ success: true, data: { id: req.params.id, status: 'approved' } });
  } catch (error) {
    next(error);
  }
});

// Example: Not Found Error (404)
app.get('/api/users/:id', (req, res, next) => {
  try {
    const userId = req.params.id;
    // Database lookup logic here...
    const user = null; // Simulate user not found

    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

// Example: Conflict Error (409)
app.post('/api/users', (req, res, next) => {
  try {
    const { email } = req.body;
    // Check if email already exists...
    const existingUser = { email }; // Simulate existing user

    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // User creation logic here...
    res.json({ success: true, data: { id: '123', email } });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// EXAMPLE 3: Using async/await with error handling
// ============================================================================

app.get('/api/applications', async (req, res, next) => {
  try {
    // Simulate async database operation
    const applications = await fetchApplicationsFromDB();

    if (!applications || applications.length === 0) {
      throw new NotFoundError('No applications found');
    }

    res.json({ success: true, data: applications });
  } catch (error) {
    // Any error thrown in try block (including custom errors) will be caught
    // and passed to error handler middleware
    next(error);
  }
});

async function fetchApplicationsFromDB() {
  // Simulate database query
  return [];
}

// ============================================================================
// EXAMPLE 4: Handling Mongoose validation errors automatically
// ============================================================================

app.post('/api/applications', async (req, res, next) => {
  try {
    // Mongoose validation errors are automatically caught and formatted
    // by the error handler middleware
    const application = await Application.create(req.body);
    res.json({ success: true, data: application });
  } catch (error) {
    // If Mongoose throws ValidationError, error handler will:
    // - Return status 400
    // - Format error messages into errors array
    // - Return { success: false, message: 'Validation failed', errors: [...] }
    next(error);
  }
});

// ============================================================================
// EXAMPLE 5: Expected error responses
// ============================================================================

/*
// Validation Error (400)
{
  "success": false,
  "message": "Email format is invalid"
}

// Validation Error with multiple errors (400)
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Email is required",
    "Password must be at least 8 characters"
  ]
}

// Unauthorized Error (401)
{
  "success": false,
  "message": "Invalid token"
}

// Forbidden Error (403)
{
  "success": false,
  "message": "Access denied. Insufficient permissions"
}

// Not Found Error (404)
{
  "success": false,
  "message": "User not found"
}

// Conflict Error (409)
{
  "success": false,
  "message": "Email already registered"
}

// Internal Server Error (500)
{
  "success": false,
  "message": "Internal server error"
}

// Development environment includes stack trace
{
  "success": false,
  "message": "Internal server error",
  "stack": "Error: Something went wrong\n    at ..."
}
*/

// ============================================================================
// EXAMPLE 6: Route not found (404)
// ============================================================================

/*
// Request: GET /api/nonexistent
// Response:
{
  "success": false,
  "message": "Route not found: GET /api/nonexistent"
}
*/

module.exports = app;
