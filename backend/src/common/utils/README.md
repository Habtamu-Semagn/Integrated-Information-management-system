# Common Utilities

This directory contains utility functions and classes used throughout the Startup Backend System.

## Response Utility (`response.util.js`)

Standard response formatters for consistent API responses across all endpoints.

### Overview

The response utility provides two main functions for formatting API responses:
- `successResponse()` - Format successful operation responses
- `errorResponse()` - Format error responses

All responses follow a consistent JSON structure with appropriate HTTP status codes.

### Functions

#### 1. successResponse(res, data, message, statusCode)

Format a successful API response.

**Parameters:**
- `res` (Object) - Express response object
- `data` (*) - Response data payload (can be any type)
- `message` (string, optional) - Success message (default: '')
- `statusCode` (number, optional) - HTTP status code (default: 200)

**Returns:** Express response object (for chaining)

**Response Structure:**
```javascript
{
  success: true,
  data: <any>,
  message: <string> // Only included if message is provided
}
```

**Examples:**
```javascript
const { successResponse } = require('./response.util');

// Simple success response (200 OK)
successResponse(res, { id: '123', name: 'John' });
// Returns: { success: true, data: { id: '123', name: 'John' } }

// Success with message (201 Created)
successResponse(res, user, 'User created successfully', 201);
// Returns: { success: true, data: user, message: 'User created successfully' }

// Success with array data
successResponse(res, applications, 'Applications retrieved successfully');
// Returns: { success: true, data: [...], message: '...' }
```

**Requirements:** 13.1, 13.3

---

#### 2. errorResponse(res, message, statusCode, errors)

Format an error API response.

**Parameters:**
- `res` (Object) - Express response object
- `message` (string) - Error message describing what went wrong
- `statusCode` (number, optional) - HTTP status code (default: 500)
- `errors` (Array<string>, optional) - Array of detailed error messages (default: null)

**Returns:** Express response object (for chaining)

**Response Structure:**
```javascript
{
  success: false,
  message: <string>,
  errors: <Array<string>> // Only included if errors array is provided
}
```

**Examples:**
```javascript
const { errorResponse } = require('./response.util');

// Simple error response (404 Not Found)
errorResponse(res, 'User not found', 404);
// Returns: { success: false, message: 'User not found' }

// Validation error with details (400 Bad Request)
errorResponse(res, 'Validation failed', 400, [
  'Email format is invalid',
  'Password must be at least 8 characters'
]);
// Returns: { success: false, message: 'Validation failed', errors: [...] }

// Authentication error (401 Unauthorized)
errorResponse(res, 'Invalid credentials', 401);
// Returns: { success: false, message: 'Invalid credentials' }
```

**Requirements:** 13.2, 13.3

---

### Usage in Controllers

```javascript
const { successResponse, errorResponse } = require('../common/utils/response.util');
const { NotFoundError, ValidationError } = require('../common/utils/error.util');

async function getApplicationById(req, res, next) {
  try {
    const { id } = req.params;
    
    // Find application
    const application = await applicationService.getById(id);
    
    if (!application) {
      return errorResponse(res, 'Application not found', 404);
    }
    
    // Success response
    return successResponse(res, application);
  } catch (error) {
    next(error);
  }
}

async function createApplication(req, res, next) {
  try {
    // Validate input
    const validationErrors = validateApplicationData(req.body);
    if (validationErrors.length > 0) {
      return errorResponse(res, 'Validation failed', 400, validationErrors);
    }
    
    // Create application
    const application = await applicationService.create(req.user.id, req.body);
    
    // Success response with 201 Created
    return successResponse(res, application, 'Application created successfully', 201);
  } catch (error) {
    next(error);
  }
}
```

### Usage in Error Middleware

```javascript
const { errorResponse } = require('../common/utils/response.util');

function errorHandler(err, req, res, next) {
  // Get status code from custom error or default to 500
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  // Log error for debugging
  console.error(`[${err.name}] ${message}`, {
    statusCode,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  // Send error response using utility
  return errorResponse(res, message, statusCode);
}
```

### Response Format Consistency

All API responses follow these rules:

**Success Responses:**
- Always have `success: true`
- Always have `data` field containing the response payload
- Optionally have `message` field for operation feedback
- Use appropriate 2xx status codes (200, 201, 204)

**Error Responses:**
- Always have `success: false`
- Always have `message` field describing the error
- Optionally have `errors` array for validation details
- Use appropriate error status codes (400, 401, 403, 404, 409, 500)

### Common Status Codes

**Success Codes:**
- `200 OK` - Successful GET, PATCH, DELETE operations
- `201 Created` - Successful POST operations creating new resources
- `204 No Content` - Successful operations with no response body

**Error Codes:**
- `400 Bad Request` - Validation errors, invalid input
- `401 Unauthorized` - Authentication required or failed
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource does not exist
- `409 Conflict` - Duplicate resource, conflicting state
- `500 Internal Server Error` - Unexpected server errors

### Testing

Run tests for response utilities:

```bash
npm test -- response.util.test.js
```

### Best Practices

1. **Always Use Response Utilities**: Never manually construct response objects
2. **Consistent Status Codes**: Use appropriate HTTP status codes for each scenario
3. **Meaningful Messages**: Provide clear, user-friendly messages
4. **Validation Details**: Include detailed error messages in the errors array for validation failures
5. **No Sensitive Data**: Never include passwords, tokens, or internal system details in responses
6. **Return Immediately**: Always return the response to prevent further code execution

### Related Files

- `response.util.js` - Response formatter functions
- `response.util.test.js` - Unit tests
- `response.util.example.js` - Usage examples
- `error.util.js` - Custom error classes
- `../middleware/error.middleware.js` - Error handling middleware (to be implemented)

### Requirements Mapping

- **Requirement 13.1**: Success responses have success: true and data field
- **Requirement 13.2**: Error responses have success: false and message field
- **Requirement 13.3**: All responses use application/json Content-Type

---

## Error Utility (`error.util.js`)

Custom error classes for consistent error handling across the application.

### Overview

The error utility provides a set of custom error classes that extend the native JavaScript `Error` class. Each error class includes:
- A descriptive error message
- An appropriate HTTP status code
- Proper error name for identification
- Stack trace for debugging

### Available Error Classes

#### 1. ValidationError (400 Bad Request)

Used when request data fails validation.

**Status Code:** 400

**Use Cases:**
- Missing required fields
- Invalid data format (email, phone, etc.)
- Length constraint violations
- Type mismatches
- Invalid enum values

**Examples:**
```javascript
const { ValidationError } = require('./error.util');

// Missing field
throw new ValidationError('Email is required');

// Invalid format
throw new ValidationError('Email format is invalid');

// Length constraint
throw new ValidationError('Password must be at least 8 characters');

// Default message
throw new ValidationError(); // "Validation failed"
```

**Requirements:** 12.2

---

#### 2. UnauthorizedError (401 Unauthorized)

Used when authentication fails.

**Status Code:** 401

**Use Cases:**
- Missing authentication token
- Invalid authentication token
- Expired authentication token
- Incorrect login credentials
- Token signature verification failure

**Examples:**
```javascript
const { UnauthorizedError } = require('./error.util');

// Missing token
throw new UnauthorizedError('No token provided');

// Invalid credentials
throw new UnauthorizedError('Invalid credentials');

// Expired token
throw new UnauthorizedError('Token expired');

// Default message
throw new UnauthorizedError(); // "Authentication required"
```

**Requirements:** 12.3

---

#### 3. ForbiddenError (403 Forbidden)

Used when user is authenticated but lacks permission to access a resource.

**Status Code:** 403

**Use Cases:**
- Role-based access control violations
- Insufficient permissions
- Attempting to access another user's resources
- Attempting operations not allowed for user's role

**Examples:**
```javascript
const { ForbiddenError } = require('./error.util');

// Role restriction
throw new ForbiddenError('Only applicants can create applications');

// Permission denied
throw new ForbiddenError('Only staff or admin can update application status');

// Default message
throw new ForbiddenError(); // "Access denied. Insufficient permissions"
```

**Requirements:** 12.4

---

#### 4. NotFoundError (404 Not Found)

Used when a requested resource does not exist.

**Status Code:** 404

**Use Cases:**
- User ID not found in database
- Application ID not found in database
- Resource deleted or never existed
- Invalid resource identifier

**Examples:**
```javascript
const { NotFoundError } = require('./error.util');

// User not found
throw new NotFoundError('User not found');

// Application not found
throw new NotFoundError('Application not found');

// Default message
throw new NotFoundError(); // "Resource not found"
```

**Requirements:** 12.5

---

#### 5. ConflictError (409 Conflict)

Used when an operation conflicts with existing data.

**Status Code:** 409

**Use Cases:**
- Duplicate email registration
- Duplicate resource creation
- Conflicting state transitions
- Unique constraint violations

**Examples:**
```javascript
const { ConflictError } = require('./error.util');

// Duplicate email
throw new ConflictError('Email already registered');

// Duplicate status
throw new ConflictError('Application already has this status');

// Default message
throw new ConflictError(); // "Resource conflict"
```

**Requirements:** 12.6

---

### Usage in Controllers

```javascript
const { ValidationError, UnauthorizedError, NotFoundError } = require('../common/utils/error.util');

async function createApplication(req, res, next) {
  try {
    // Validate input
    if (!req.body.startupName) {
      throw new ValidationError('Startup name is required');
    }
    
    // Check authentication
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    
    // Create application
    const application = await applicationService.create(req.body);
    
    res.status(201).json({
      success: true,
      data: application
    });
  } catch (error) {
    // Pass error to error handling middleware
    next(error);
  }
}
```

### Usage in Services

```javascript
const { NotFoundError, ForbiddenError } = require('../common/utils/error.util');

async function updateApplicationStatus(appId, status, reviewerId) {
  // Check if application exists
  const application = await Application.findById(appId);
  if (!application) {
    throw new NotFoundError('Application not found');
  }
  
  // Check reviewer role
  const reviewer = await User.findById(reviewerId);
  if (!['staff', 'admin'].includes(reviewer.role)) {
    throw new ForbiddenError('Only staff or admin can update status');
  }
  
  // Update status
  application.status = status;
  application.reviewedBy = reviewerId;
  await application.save();
  
  return application;
}
```

### Usage in Middleware

```javascript
const { UnauthorizedError, ForbiddenError } = require('../common/utils/error.util');

function authenticate(req, res, next) {
  const token = req.cookies.token;
  
  if (!token) {
    throw new UnauthorizedError('No token provided');
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    throw new UnauthorizedError('Invalid token');
  }
}

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError('Access denied. Insufficient permissions');
    }
    next();
  };
}
```

### Error Handling Middleware

These custom errors should be caught by a centralized error handling middleware:

```javascript
function errorHandler(err, req, res, next) {
  // Custom errors have statusCode property
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  // Log error for debugging
  console.error(`[${err.name}] ${message}`, {
    statusCode,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  // Send error response
  res.status(statusCode).json({
    success: false,
    message: message
  });
}
```

### Error Class Hierarchy

```
Error (native)
  └── AppError (base class)
      ├── ValidationError (400)
      ├── UnauthorizedError (401)
      ├── ForbiddenError (403)
      ├── NotFoundError (404)
      └── ConflictError (409)
```

### Properties

All custom error classes have the following properties:

- **message** (string): Descriptive error message
- **statusCode** (number): HTTP status code
- **name** (string): Error class name
- **stack** (string): Stack trace for debugging

### Testing

Run tests for error utilities:

```bash
npm test -- error.util.test.js
```

### Best Practices

1. **Use Specific Error Types**: Choose the most appropriate error class for each scenario
2. **Provide Clear Messages**: Include helpful, user-friendly error messages
3. **Don't Expose Sensitive Data**: Never include passwords, tokens, or internal system details in error messages
4. **Use Default Messages**: Default messages are provided for convenience, but custom messages are recommended
5. **Catch and Re-throw**: Catch errors in services, add context, and re-throw if needed
6. **Centralized Handling**: Always use error handling middleware to catch and format errors consistently

### Related Files

- `error.util.js` - Error class definitions
- `error.util.test.js` - Unit tests
- `error.util.example.js` - Usage examples
- `../middleware/error.middleware.js` - Error handling middleware (to be implemented in task 3)

### Requirements Mapping

- **Requirement 12.1**: Error responses have success: false and message field
- **Requirement 12.2**: Validation errors return HTTP status 400
- **Requirement 12.3**: Authentication errors return HTTP status 401
- **Requirement 12.4**: Authorization errors return HTTP status 403
- **Requirement 12.5**: Not found errors return HTTP status 404
- **Requirement 12.6**: Conflict errors return HTTP status 409
