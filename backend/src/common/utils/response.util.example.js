/**
 * Example Usage of Response Utility Functions
 * 
 * This file demonstrates how to use successResponse and errorResponse
 * in controllers to maintain consistent API response formatting.
 * 
 * Requirements: 13.1, 13.2, 13.3
 */

const { successResponse, errorResponse } = require('./response.util');

/**
 * Example 1: Simple Success Response
 * Use case: Return data without a message
 */
function exampleSimpleSuccess(req, res) {
  const user = {
    id: '507f1f77bcf86cd799439011',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'applicant'
  };

  // Returns: { success: true, data: { id: '...', name: '...', ... } }
  return successResponse(res, user);
}

/**
 * Example 2: Success Response with Message
 * Use case: Provide feedback about the operation
 */
function exampleSuccessWithMessage(req, res) {
  const application = {
    id: '507f1f77bcf86cd799439012',
    startupName: 'EcoTech Solutions',
    status: 'pending'
  };

  // Returns: { success: true, data: {...}, message: 'Application created successfully' }
  return successResponse(res, application, 'Application created successfully', 201);
}

/**
 * Example 3: Success Response with Array Data
 * Use case: Return list of resources
 */
function exampleSuccessWithArray(req, res) {
  const applications = [
    { id: '1', startupName: 'Startup A', status: 'pending' },
    { id: '2', startupName: 'Startup B', status: 'approved' }
  ];

  // Returns: { success: true, data: [...], message: 'Applications retrieved successfully' }
  return successResponse(res, applications, 'Applications retrieved successfully');
}

/**
 * Example 4: Simple Error Response
 * Use case: Return error without detailed validation messages
 */
function exampleSimpleError(req, res) {
  // Returns: { success: false, message: 'User not found' }
  return errorResponse(res, 'User not found', 404);
}

/**
 * Example 5: Error Response with Validation Details
 * Use case: Return multiple validation error messages
 */
function exampleValidationError(req, res) {
  const validationErrors = [
    'Email format is invalid',
    'Password must be at least 8 characters',
    'Name is required'
  ];

  // Returns: { success: false, message: 'Validation failed', errors: [...] }
  return errorResponse(res, 'Validation failed', 400, validationErrors);
}

/**
 * Example 6: Authentication Error
 * Use case: User credentials are invalid
 */
function exampleAuthError(req, res) {
  // Returns: { success: false, message: 'Invalid credentials' }
  return errorResponse(res, 'Invalid credentials', 401);
}

/**
 * Example 7: Authorization Error
 * Use case: User lacks permission to access resource
 */
function exampleAuthorizationError(req, res) {
  // Returns: { success: false, message: 'Access denied. Insufficient permissions' }
  return errorResponse(res, 'Access denied. Insufficient permissions', 403);
}

/**
 * Example 8: Conflict Error
 * Use case: Resource already exists (e.g., duplicate email)
 */
function exampleConflictError(req, res) {
  // Returns: { success: false, message: 'Email already registered' }
  return errorResponse(res, 'Email already registered', 409);
}

/**
 * Example 9: Server Error
 * Use case: Unexpected server-side error
 */
function exampleServerError(req, res) {
  // Returns: { success: false, message: 'Database connection error' }
  return errorResponse(res, 'Database connection error', 500);
}

/**
 * Example 10: Complete Controller with Try-Catch
 * Use case: Real-world controller implementation
 */
async function exampleCompleteController(req, res, next) {
  try {
    // Simulate business logic
    const data = await someServiceMethod(req.body);
    
    // Success response
    return successResponse(res, data, 'Operation completed successfully', 201);
  } catch (error) {
    // Pass error to error handling middleware
    next(error);
  }
}

/**
 * Example 11: Controller with Conditional Responses
 * Use case: Different responses based on conditions
 */
async function exampleConditionalController(req, res) {
  const userId = req.params.id;
  
  // Check if resource exists
  const user = await findUserById(userId);
  
  if (!user) {
    // Resource not found
    return errorResponse(res, 'User not found', 404);
  }
  
  // Check authorization
  if (req.user.id !== userId && req.user.role !== 'admin') {
    // Insufficient permissions
    return errorResponse(res, 'Access denied. Insufficient permissions', 403);
  }
  
  // Success
  return successResponse(res, user);
}

/**
 * Example 12: Login Controller
 * Use case: Authentication endpoint
 */
async function exampleLoginController(req, res) {
  const { email, password } = req.body;
  
  // Find user
  const user = await findUserByEmail(email);
  
  if (!user) {
    return errorResponse(res, 'Invalid credentials', 401);
  }
  
  // Verify password
  const isPasswordValid = await comparePassword(password, user.password);
  
  if (!isPasswordValid) {
    return errorResponse(res, 'Invalid credentials', 401);
  }
  
  // Generate token and set cookie (implementation not shown)
  const token = generateToken(user);
  res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
  
  // Return user data (without password)
  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  
  return successResponse(res, userData, 'Login successful');
}

/**
 * Example 13: Create Application Controller
 * Use case: Resource creation with validation
 */
async function exampleCreateApplicationController(req, res) {
  // Validate request body
  const validationErrors = validateApplicationData(req.body);
  
  if (validationErrors.length > 0) {
    return errorResponse(res, 'Validation failed', 400, validationErrors);
  }
  
  // Check user role
  if (req.user.role !== 'applicant') {
    return errorResponse(res, 'Only applicants can create applications', 403);
  }
  
  // Create application
  const application = await createApplication(req.user.id, req.body);
  
  return successResponse(res, application, 'Application created successfully', 201);
}

/**
 * Example 14: Update Status Controller
 * Use case: Update resource with authorization check
 */
async function exampleUpdateStatusController(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  
  // Check authorization
  if (!['staff', 'admin'].includes(req.user.role)) {
    return errorResponse(res, 'Only staff or admin can update application status', 403);
  }
  
  // Find application
  const application = await findApplicationById(id);
  
  if (!application) {
    return errorResponse(res, 'Application not found', 404);
  }
  
  // Check if status is already set
  if (application.status === status) {
    return errorResponse(res, 'Application already has this status', 400);
  }
  
  // Update status
  const updatedApplication = await updateApplicationStatus(id, status, req.user.id);
  
  return successResponse(res, updatedApplication, 'Application status updated successfully');
}

/**
 * Example 15: List Resources with Empty Result
 * Use case: Return empty array when no resources found
 */
async function exampleListWithEmptyResult(req, res) {
  const applications = await getApplicationsByUser(req.user.id);
  
  // Even if empty, return success with empty array
  // Returns: { success: true, data: [] }
  return successResponse(res, applications);
}

// Mock functions for examples (not actual implementations)
async function someServiceMethod(data) { return data; }
async function findUserById(id) { return null; }
async function findUserByEmail(email) { return null; }
async function comparePassword(plain, hashed) { return false; }
function generateToken(user) { return 'token'; }
function validateApplicationData(data) { return []; }
async function createApplication(userId, data) { return data; }
async function findApplicationById(id) { return null; }
async function updateApplicationStatus(id, status, reviewerId) { return {}; }
async function getApplicationsByUser(userId) { return []; }

module.exports = {
  exampleSimpleSuccess,
  exampleSuccessWithMessage,
  exampleSuccessWithArray,
  exampleSimpleError,
  exampleValidationError,
  exampleAuthError,
  exampleAuthorizationError,
  exampleConflictError,
  exampleServerError,
  exampleCompleteController,
  exampleConditionalController,
  exampleLoginController,
  exampleCreateApplicationController,
  exampleUpdateStatusController,
  exampleListWithEmptyResult
};
