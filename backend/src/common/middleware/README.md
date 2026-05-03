# Middleware Documentation

This directory contains shared middleware functions used across the Startup Backend System.

## Error Handling Middleware

### Overview

The error handling middleware provides centralized error handling for the entire Express application. It catches all errors thrown in routes and controllers, maps them to appropriate HTTP status codes, and formats them into consistent JSON responses.

### Files

- **error.middleware.js** - Main error handling middleware implementation
- **error.middleware.test.js** - Comprehensive unit tests
- **error.middleware.example.js** - Usage examples and patterns

### Middleware Functions

#### `notFound(req, res, next)`

Catches all requests that don't match any defined routes and returns a 404 error.

**Usage:**
```javascript
const { notFound } = require('./common/middleware/error.middleware');

// Place AFTER all route definitions
app.use(notFound);
```

**Response:**
```json
{
  "success": false,
  "message": "Route not found: GET /api/nonexistent"
}
```

#### `errorHandler(err, req, res, next)`

Global error handler that catches all errors and formats them into consistent JSON responses.

**Usage:**
```javascript
const { errorHandler } = require('./common/middleware/error.middleware');

// Place LAST in middleware chain
app.use(errorHandler);
```

### Error Type Mapping

The error handler automatically maps error types to HTTP status codes:

| Error Type | Status Code | Description |
|------------|-------------|-------------|
| `ValidationError` | 400 | Request validation failed |
| `UnauthorizedError` | 401 | Authentication required or failed |
| `ForbiddenError` | 403 | User lacks permission |
| `NotFoundError` | 404 | Resource not found |
| `ConflictError` | 409 | Resource conflict (e.g., duplicate email) |
| Mongoose `ValidationError` | 400 | Database validation failed |
| Mongoose `CastError` | 400 | Invalid ObjectId format |
| MongoDB duplicate key (code 11000) | 409 | Unique constraint violation |
| `JsonWebTokenError` | 401 | Invalid JWT token |
| `TokenExpiredError` | 401 | JWT token expired |
| Generic `Error` | 500 | Internal server error |

### Response Format

All error responses follow this structure:

```json
{
  "success": false,
  "message": "Error description"
}
```

For validation errors with multiple issues:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Email is required",
    "Password must be at least 8 characters"
  ]
}
```

In development environment, stack traces are included:

```json
{
  "success": false,
  "message": "Internal server error",
  "stack": "Error: Something went wrong\n    at ..."
}
```

### Environment-Based Behavior

#### Development Environment (`NODE_ENV=development`)
- Stack traces included in error responses
- Detailed error logging to console
- Helpful for debugging

#### Production Environment (`NODE_ENV=production`)
- Stack traces excluded from responses (security)
- Generic error messages for unexpected errors
- Detailed logging server-side only

### Error Logging

All errors are logged server-side with context information:

```javascript
{
  timestamp: "2024-01-15T10:30:00.000Z",
  method: "POST",
  url: "/api/users/register",
  statusCode: 400,
  message: "Email format is invalid",
  userId: "123" or "unauthenticated",
  stack: "Error stack trace..."
}
```

### Usage Examples

#### Basic Setup

```javascript
const express = require('express');
const { notFound, errorHandler } = require('./common/middleware/error.middleware');

const app = express();

// Your routes here
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);

// Error handling middleware (MUST be last)
app.use(notFound);
app.use(errorHandler);
```

#### Throwing Custom Errors

```javascript
const { ValidationError, UnauthorizedError, NotFoundError } = require('./common/utils/error.util');

// In a route handler
app.post('/api/users', async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new ValidationError('Email is required');
    }

    const user = await User.findOne({ email });
    if (user) {
      throw new ConflictError('Email already registered');
    }

    // Create user...
    res.json({ success: true, data: newUser });
  } catch (error) {
    next(error); // Pass to error handler
  }
});
```

#### Async/Await Pattern

```javascript
app.get('/api/users/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});
```

### Requirements Validation

This middleware validates the following requirements:

- **12.1**: Errors return JSON with `success: false` and `message` field
- **12.2**: Validation errors return HTTP status 400
- **12.3**: Authentication errors return HTTP status 401
- **12.4**: Authorization errors return HTTP status 403
- **12.5**: Not found errors return HTTP status 404
- **12.6**: Conflict errors return HTTP status 409
- **12.7**: Unexpected errors return HTTP status 500
- **12.8**: Stack traces only included in development environment
- **12.9**: Errors logged server-side with context information

### Testing

Run the test suite:

```bash
npm test -- error.middleware.test.js
```

The test suite covers:
- All custom error types (ValidationError, UnauthorizedError, etc.)
- Mongoose errors (ValidationError, CastError, duplicate key)
- JWT errors (JsonWebTokenError, TokenExpiredError)
- Generic errors
- Environment-based stack trace inclusion
- Error logging with context
- Response format consistency

### Best Practices

1. **Always use try-catch with async/await**
   ```javascript
   app.get('/api/resource', async (req, res, next) => {
     try {
       // async operations
     } catch (error) {
       next(error);
     }
   });
   ```

2. **Throw specific error types**
   ```javascript
   // Good
   throw new ValidationError('Email format is invalid');
   
   // Avoid
   throw new Error('Email format is invalid'); // Will be 500 instead of 400
   ```

3. **Let Mongoose errors bubble up**
   ```javascript
   // Mongoose validation errors are automatically handled
   const user = await User.create(userData); // No need to catch validation errors
   ```

4. **Place error middleware last**
   ```javascript
   // Routes first
   app.use('/api/auth', authRoutes);
   
   // Error handling last
   app.use(notFound);
   app.use(errorHandler);
   ```

5. **Never expose sensitive information in error messages**
   ```javascript
   // Good
   throw new UnauthorizedError('Invalid credentials');
   
   // Bad
   throw new UnauthorizedError('Password does not match for user@example.com');
   ```

### Future Enhancements

- Integration with logging libraries (Winston, Pino)
- Error tracking services (Sentry, Rollbar)
- Custom error codes for client-side error handling
- Rate limiting for error responses
- Error metrics and monitoring
