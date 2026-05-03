/**
 * Usage Examples for Custom Error Classes
 * 
 * This file demonstrates how to use the custom error classes
 * in various scenarios throughout the application.
 */

const {
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError
} = require('./error.util');

// ============================================================================
// Example 1: ValidationError - Input Validation
// ============================================================================

function validateUserRegistration(userData) {
  // Check required fields
  if (!userData.email) {
    throw new ValidationError('Email is required');
  }
  
  // Check email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userData.email)) {
    throw new ValidationError('Email format is invalid');
  }
  
  // Check password length
  if (!userData.password || userData.password.length < 8) {
    throw new ValidationError('Password must be at least 8 characters');
  }
  
  // Check name length
  if (!userData.name || userData.name.length < 2 || userData.name.length > 100) {
    throw new ValidationError('Name must be between 2 and 100 characters');
  }
  
  return true;
}

// ============================================================================
// Example 2: UnauthorizedError - Authentication
// ============================================================================

function authenticateUser(token) {
  // No token provided
  if (!token) {
    throw new UnauthorizedError('No token provided');
  }
  
  // Invalid token format
  if (!token.startsWith('Bearer ')) {
    throw new UnauthorizedError('Invalid token format');
  }
  
  // Token expired (simulated)
  const isExpired = false; // This would be checked via JWT verification
  if (isExpired) {
    throw new UnauthorizedError('Token expired');
  }
  
  return { userId: '123', role: 'applicant' };
}

function loginUser(email, password, userDatabase) {
  // User not found
  const user = userDatabase.find(u => u.email === email);
  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }
  
  // Password incorrect
  if (user.password !== password) {
    throw new UnauthorizedError('Invalid credentials');
  }
  
  return user;
}

// ============================================================================
// Example 3: ForbiddenError - Authorization
// ============================================================================

function checkApplicationCreationPermission(userRole) {
  // Only applicants can create applications
  if (userRole !== 'applicant') {
    throw new ForbiddenError('Only applicants can create applications');
  }
  
  return true;
}

function checkStatusUpdatePermission(userRole) {
  // Only staff and admin can update status
  const allowedRoles = ['staff', 'admin'];
  if (!allowedRoles.includes(userRole)) {
    throw new ForbiddenError('Only staff or admin can update application status');
  }
  
  return true;
}

function checkResourceAccess(userId, resourceOwnerId, userRole) {
  // Users can only access their own resources unless they're staff/admin
  const isOwner = userId === resourceOwnerId;
  const isStaffOrAdmin = ['staff', 'admin'].includes(userRole);
  
  if (!isOwner && !isStaffOrAdmin) {
    throw new ForbiddenError('Access denied. Insufficient permissions');
  }
  
  return true;
}

// ============================================================================
// Example 4: NotFoundError - Resource Retrieval
// ============================================================================

function getUserById(userId, userDatabase) {
  const user = userDatabase.find(u => u.id === userId);
  
  if (!user) {
    throw new NotFoundError('User not found');
  }
  
  return user;
}

function getApplicationById(applicationId, applicationDatabase) {
  const application = applicationDatabase.find(a => a.id === applicationId);
  
  if (!application) {
    throw new NotFoundError('Application not found');
  }
  
  return application;
}

// ============================================================================
// Example 5: ConflictError - Duplicate Resources
// ============================================================================

function registerUser(email, userDatabase) {
  // Check if email already exists
  const existingUser = userDatabase.find(u => u.email === email);
  
  if (existingUser) {
    throw new ConflictError('Email already registered');
  }
  
  // Create new user
  const newUser = { id: Date.now().toString(), email };
  userDatabase.push(newUser);
  
  return newUser;
}

function updateApplicationStatus(applicationId, newStatus, applicationDatabase) {
  const application = applicationDatabase.find(a => a.id === applicationId);
  
  if (!application) {
    throw new NotFoundError('Application not found');
  }
  
  // Check if status is already set to the new value
  if (application.status === newStatus) {
    throw new ConflictError('Application already has this status');
  }
  
  application.status = newStatus;
  return application;
}

// ============================================================================
// Example 6: Error Handling in Express Middleware
// ============================================================================

function exampleExpressController(req, res, next) {
  try {
    // Validate input
    validateUserRegistration(req.body);
    
    // Check authentication
    const user = authenticateUser(req.headers.authorization);
    
    // Check authorization
    checkApplicationCreationPermission(user.role);
    
    // Process request
    res.json({ success: true, data: { message: 'Success' } });
  } catch (error) {
    // Pass error to error handling middleware
    next(error);
  }
}

function exampleErrorHandler(err, req, res, next) {
  // Custom errors have statusCode property
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  res.status(statusCode).json({
    success: false,
    message: message
  });
}

// ============================================================================
// Example 7: Async/Await Error Handling
// ============================================================================

async function exampleAsyncFunction(userId) {
  try {
    // Simulate database query
    const userDatabase = [
      { id: '1', email: 'user@example.com', role: 'applicant' }
    ];
    
    const user = getUserById(userId, userDatabase);
    return user;
  } catch (error) {
    // Error will be caught and can be handled or re-thrown
    console.error('Error in async function:', error.message);
    throw error; // Re-throw to be handled by caller
  }
}

// ============================================================================
// Example 8: Multiple Error Types in Service Layer
// ============================================================================

async function createApplicationService(userId, applicationData, userService, applicationRepository) {
  // 1. Validate input
  if (!applicationData.startupName || applicationData.startupName.length < 3) {
    throw new ValidationError('Startup name must be at least 3 characters');
  }
  
  // 2. Check if user exists
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  
  // 3. Check user role
  if (user.role !== 'applicant') {
    throw new ForbiddenError('Only applicants can create applications');
  }
  
  // 4. Create application
  const application = await applicationRepository.create({
    userId,
    ...applicationData,
    status: 'pending'
  });
  
  return application;
}

// ============================================================================
// Module Exports (for demonstration purposes)
// ============================================================================

module.exports = {
  validateUserRegistration,
  authenticateUser,
  loginUser,
  checkApplicationCreationPermission,
  checkStatusUpdatePermission,
  checkResourceAccess,
  getUserById,
  getApplicationById,
  registerUser,
  updateApplicationStatus,
  exampleExpressController,
  exampleErrorHandler,
  exampleAsyncFunction,
  createApplicationService
};
