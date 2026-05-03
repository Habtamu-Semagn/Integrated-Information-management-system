# Implementation Plan: Startup Backend System

## Overview

This implementation plan breaks down the Startup Backend System into discrete, incremental coding tasks. The system is a Node.js/Express modular monolith with JWT authentication, role-based access control, and MongoDB persistence. Each task builds on previous work, starting with foundational infrastructure and progressing through module implementation, testing, and documentation.

## Tasks

- [x] 1. Initialize project structure and dependencies
  - Create package.json with all required dependencies (express, mongoose, jsonwebtoken, bcryptjs, cookie-parser, dotenv, cors, helmet, swagger-jsdoc, swagger-ui-express)
  - Add dev dependencies (jest, supertest, mongodb-memory-server, nodemon, eslint, prettier)
  - Create directory structure: src/modules, src/common, src/config, src/docs
  - Create .env.example file with all required environment variables
  - Create .gitignore file
  - _Requirements: All requirements depend on proper project setup_

- [x] 2. Set up common utilities and configuration
  - [x] 2.1 Create database configuration and connection
    - Write src/common/config/database.config.js with MongoDB connection logic
    - Implement connection error handling and retry logic
    - Export connection function for use in server.js
    - _Requirements: 15.1, 15.2, 15.3_
  
  - [x] 2.2 Create custom error classes
    - Write src/common/utils/error.util.js with custom error classes (ValidationError, UnauthorizedError, ForbiddenError, NotFoundError, ConflictError)
    - Each error class should include statusCode and message properties
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_
  
  - [x] 2.3 Create response utility
    - Write src/common/utils/response.util.js with standard response formatters (successResponse, errorResponse)
    - Implement consistent JSON structure with success, data, and message fields
    - _Requirements: 13.1, 13.2, 13.3_
  
  - [x] 2.4 Create constants files
    - Write src/common/constants/roles.constant.js with user roles enum
    - Write src/common/constants/status.constant.js with application status enum
    - _Requirements: 1.1, 5.1, 7.4_

- [x] 3. Implement error handling middleware
  - Write src/common/middleware/error.middleware.js with notFound and errorHandler functions
  - Implement proper HTTP status code mapping for each error type
  - Ensure error responses follow standard format (success: false, message)
  - Add environment-based stack trace inclusion (development only)
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7_

- [x] 4. Implement User model with Mongoose
  - [x] 4.1 Create User schema and model
    - Write src/modules/users/user.model.js with Mongoose schema
    - Define fields: name, email, password, role with proper validation
    - Add unique index on email field
    - Enable timestamps (createdAt, updatedAt)
    - Implement pre-save hook for password hashing with bcrypt (salt rounds: 10)
    - Add instance method comparePassword() for password verification
    - Add toJSON transform to exclude password and __v fields
    - Add virtual field to map _id to id
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 9.1, 9.2, 9.4_
  
  - [x] 4.2 Write property test for password hashing
    - **Property 1: Password Hashing Round-Trip**
    - **Validates: Requirements 1.2, 9.1, 9.2**
    - Generate arbitrary valid passwords (8-100 characters)
    - Verify bcrypt.compare(password, hash) returns true
    - Verify hash never equals plain text password

- [x] 5. Implement User service layer
  - Write src/modules/users/user.service.js with business logic functions
  - Implement getUserById(userId) - returns user without password
  - Implement getUserByEmail(email) - returns user or null
  - Implement createUser(userData) - creates user with hashed password
  - Implement updateUser(userId, updates) - updates allowed fields only
  - Implement validateUserRole(userId, allowedRoles) - checks role authorization
  - Ensure all responses exclude password field
  - _Requirements: 1.1, 1.2, 1.3, 1.7, 8.1, 8.2, 8.4, 9.3_

- [x] 6. Implement authentication service and JWT utilities
  - [x] 6.1 Create JWT configuration
    - Write src/common/config/jwt.config.js with JWT_SECRET and expiration settings
    - Export configuration for use in auth service and middleware
    - _Requirements: 2.6, 10.1_
  
  - [x] 6.2 Implement Auth service
    - Write src/modules/auth/auth.service.js with authentication logic
    - Implement registerUser(userData) - validates, creates user, returns sanitized data
    - Implement loginUser(credentials) - validates credentials, generates token
    - Implement generateToken(userId, role) - creates JWT with 7-day expiration
    - Implement verifyToken(token) - verifies and decodes JWT
    - Use UserService for database operations
    - _Requirements: 1.1, 1.2, 1.3, 1.7, 2.1, 2.3, 2.4, 2.5, 2.6, 2.7, 10.1, 10.5_
  
  - [x] 6.3 Write property test for JWT token structure
    - **Property 3: JWT Token Structure and Verification**
    - **Validates: Requirements 2.1, 3.2, 10.1, 10.5**
    - Generate arbitrary userId and role combinations
    - Verify generated tokens contain userId, role, iat, exp
    - Verify tokens can be verified with same secret

- [x] 7. Implement authentication and authorization middleware
  - [x] 7.1 Create authentication middleware
    - Write src/common/middleware/auth.middleware.js with authenticate() function
    - Extract JWT token from HTTP-only cookie named 'token'
    - Verify token using JWT_SECRET
    - Populate req.user with decoded {userId, role}
    - Throw UnauthorizedError for missing, invalid, or expired tokens
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_
  
  - [x] 7.2 Create authorization middleware
    - Write authorize(...allowedRoles) function in auth.middleware.js
    - Return middleware function that checks req.user.role against allowedRoles
    - Throw ForbiddenError if role not in allowed list
    - Call next() if authorized
    - _Requirements: 4.1, 4.2_
  
  - [x] 7.3 Write property test for role-based access control
    - **Property 13: Role-Based Access Control**
    - **Validates: Requirements 4.1, 4.2**
    - Generate arbitrary role combinations and allowed role lists
    - Verify users with allowed roles pass authorization
    - Verify users without allowed roles receive 403 error

- [x] 8. Implement validation middleware
  - Write src/common/middleware/validation.middleware.js with validateRequest(schema) function
  - Implement request body validation against provided schema
  - Return 400 error with detailed validation messages on failure
  - Support validation for required fields, types, lengths, and formats
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_

- [x] 9. Implement Auth module controllers and routes
  - [x] 9.1 Create validation schemas for auth endpoints
    - Write src/modules/auth/auth.validation.js with registration and login schemas
    - Define validation rules for name (2-100 chars), email (valid format), password (min 8 chars)
    - _Requirements: 1.4, 1.5, 1.6_
  
  - [x] 9.2 Create Auth controller
    - Write src/modules/auth/auth.controller.js with HTTP request handlers
    - Implement register(req, res, next) - validates input, calls AuthService.registerUser()
    - Implement login(req, res, next) - validates credentials, calls AuthService.loginUser(), sets HTTP-only cookie
    - Implement logout(req, res, next) - clears authentication cookie
    - Set cookie options: httpOnly=true, secure=(NODE_ENV==='production'), sameSite='strict', maxAge=7 days
    - Return standardized success/error responses
    - _Requirements: 1.1, 1.7, 2.1, 2.2, 2.3, 2.8, 10.2, 10.3, 10.4_
  
  - [x] 9.3 Create Auth routes
    - Write src/modules/auth/auth.routes.js with route definitions
    - POST /api/auth/register - with validation middleware
    - POST /api/auth/login - with validation middleware
    - POST /api/auth/logout - no authentication required
    - _Requirements: 1.1, 2.1, 2.8_
  
  - [ ]* 9.4 Write property test for HTTP-only cookie security
    - **Property 4: HTTP-Only Cookie Security Attributes**
    - **Validates: Requirements 2.2, 10.2, 10.4**
    - Test login endpoint responses
    - Verify cookies have httpOnly=true, sameSite='strict'
    - Verify secure=true in production environment

- [x] 10. Checkpoint - Test authentication flow
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Implement Application model with Mongoose
  - [x] 11.1 Create Application schema and model
    - Write src/modules/applications/application.model.js with Mongoose schema
    - Define fields: userId, startupName, description, problemStatement, solution, targetMarket, status, reviewedBy
    - Add validation rules for all string length constraints
    - Set default status to 'pending'
    - Add compound index on (userId, createdAt) for efficient queries
    - Add index on status field for filtering
    - Enable timestamps (createdAt, updatedAt)
    - Add virtual field to map _id to id
    - Configure population for userId and reviewedBy fields
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 15.4_
  
  - [ ]* 11.2 Write property test for application creation invariants
    - **Property 14: Application Creation Invariants**
    - **Validates: Requirements 5.1, 5.2, 5.3**
    - Generate arbitrary valid application data
    - Verify created applications have status='pending'
    - Verify userId is set correctly
    - Verify reviewedBy is null

- [x] 12. Implement Application service layer
  - [x] 12.1 Create Application service
    - Write src/modules/applications/application.service.js with business logic
    - Implement createApplication(userId, appData) - validates user role, creates application
    - Implement getApplicationsByUser(userId) - returns user's applications sorted by createdAt desc
    - Implement getAllApplications(filters) - returns all applications with optional filtering
    - Implement getApplicationById(appId) - returns single application with populated user data
    - Implement updateStatus(appId, status, reviewerId) - validates reviewer role, updates status and reviewedBy
    - Implement validateApplicationOwnership(appId, userId) - checks if user owns application
    - Use UserService for cross-module user validation
    - _Requirements: 5.1, 5.2, 5.9, 5.10, 6.1, 6.2, 6.3, 6.6, 6.7, 7.1, 7.2, 7.3, 7.6, 7.7, 7.8_
  
  - [ ]* 12.2 Write property test for status update effects
    - **Property 22: Status Update Effects**
    - **Validates: Requirements 7.1, 7.2**
    - Generate arbitrary applications and status values
    - Verify status changes to specified value
    - Verify reviewedBy is set to reviewer's ID
    - Verify updatedAt is updated
  
  - [ ]* 12.3 Write property test for status and reviewedBy relationship
    - **Property 37: Status and ReviewedBy Relationship**
    - **Validates: Requirements 5.3, 23.3, 23.4**
    - Generate arbitrary applications with different statuses
    - Verify reviewedBy is null when status is 'pending'
    - Verify reviewedBy is set when status is 'approved' or 'rejected'

- [x] 13. Implement Application module controllers and routes
  - [x] 13.1 Create validation schemas for application endpoints
    - Write src/modules/applications/application.validation.js with schemas
    - Define validation for createApplication (all required fields with length constraints)
    - Define validation for updateStatus (status must be enum value)
    - Define validation for ObjectId parameters
    - _Requirements: 5.4, 5.5, 5.6, 5.7, 5.8, 7.4, 11.6_
  
  - [x] 13.2 Create Application controller
    - Write src/modules/applications/application.controller.js with HTTP handlers
    - Implement createApplication(req, res, next) - validates input, calls ApplicationService.createApplication()
    - Implement getMyApplications(req, res, next) - returns authenticated user's applications
    - Implement getAllApplications(req, res, next) - returns all applications (staff/admin only)
    - Implement getApplicationById(req, res, next) - returns single application details
    - Implement updateApplicationStatus(req, res, next) - updates status with reviewer tracking
    - Return standardized success/error responses with proper status codes
    - _Requirements: 5.1, 5.9, 6.1, 6.2, 6.3, 6.5, 6.6, 7.1, 7.6, 7.8_
  
  - [x] 13.3 Create Application routes
    - Write src/modules/applications/application.routes.js with route definitions
    - POST /api/applications - authenticate, authorize('applicant'), validate, createApplication
    - GET /api/applications/my - authenticate, authorize('applicant'), getMyApplications
    - GET /api/applications - authenticate, authorize('staff', 'admin'), getAllApplications
    - GET /api/applications/:id - authenticate, authorize('staff', 'admin'), getApplicationById
    - PATCH /api/applications/:id/status - authenticate, authorize('staff', 'admin'), validate, updateApplicationStatus
    - _Requirements: 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 5.1, 6.1, 6.2, 6.3, 7.1, 7.5_
  
  - [ ]* 13.4 Write property test for application ownership isolation
    - **Property 17: Application Ownership Isolation**
    - **Validates: Requirements 6.1**
    - Create multiple users and applications
    - Verify each applicant only sees their own applications
    - Verify no cross-user data leakage

- [x] 14. Implement User profile endpoints
  - [x] 14.1 Create User controller
    - Write src/modules/users/user.controller.js with HTTP handlers
    - Implement getProfile(req, res, next) - returns authenticated user's profile
    - Implement updateProfile(req, res, next) - updates name and email only
    - Ensure password field is never included in responses
    - _Requirements: 8.1, 8.2, 8.4, 8.5, 9.3_
  
  - [x] 14.2 Create validation schemas for user endpoints
    - Write src/modules/users/user.validation.js with update profile schema
    - Define validation for name and email fields
    - _Requirements: 1.4, 1.6, 8.2_
  
  - [x] 14.3 Create User routes
    - Write src/modules/users/user.routes.js with route definitions
    - GET /api/users/profile - authenticate, getProfile
    - PATCH /api/users/profile - authenticate, validate, updateProfile
    - _Requirements: 8.1, 8.2_
  
  - [ ]* 14.4 Write property test for password exclusion from responses
    - **Property 2: Password Exclusion from Responses**
    - **Validates: Requirements 1.7, 2.3, 8.1, 9.3, 9.4, 13.4**
    - Test all endpoints that return user data
    - Verify password field is never present in any response
    - Test registration, login, profile retrieval, and application responses

- [x] 15. Checkpoint - Test all modules independently
  - Ensure all tests pass, ask the user if questions arise.

- [x] 16. Create Express application configuration
  - [x] 16.1 Create app.js with Express setup
    - Write src/app.js with Express application configuration
    - Add middleware: helmet (security headers), cors (with credentials), express.json(), cookie-parser()
    - Configure CORS to allow frontend origin from environment variable
    - Mount module routes: /api/auth, /api/users, /api/applications
    - Add 404 not found middleware
    - Add error handler middleware
    - _Requirements: 10.3, 18.1, 18.2, 18.3, 18.4_
  
  - [x] 16.2 Create server.js with startup logic
    - Write src/server.js to start the Express server
    - Connect to MongoDB before starting server
    - Listen on PORT from environment variable
    - Add graceful shutdown handling
    - _Requirements: All requirements depend on server startup_
  
  - [ ]* 16.3 Write property test for security headers
    - **Property 38: Security Headers Presence**
    - **Validates: Requirements 18.1, 18.2, 18.3, 18.4**
    - Test any API endpoint response
    - Verify presence of X-Content-Type-Options, X-Frame-Options, X-XSS-Protection headers

- [x] 17. Implement Swagger/OpenAPI documentation
  - [x] 17.1 Create Swagger configuration
    - Write src/docs/swagger.js with OpenAPI specification setup
    - Configure swagger-jsdoc with API info, servers, and security schemes
    - Define Bearer JWT security scheme
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5, 20.1, 20.2_
  
  - [x] 17.2 Add Swagger documentation for Auth endpoints
    - Write src/modules/auth/auth.swagger.js with JSDoc comments
    - Document POST /api/auth/register with request/response schemas
    - Document POST /api/auth/login with request/response schemas
    - Document POST /api/auth/logout
    - Include example requests and responses
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5, 20.1, 20.2, 20.3, 20.4, 20.5, 20.6_
  
  - [x] 17.3 Add Swagger documentation for Application endpoints
    - Write src/modules/applications/application.swagger.js with JSDoc comments
    - Document all application endpoints with request/response schemas
    - Mark protected endpoints with security requirement (Bearer JWT)
    - Include role requirements in descriptions
    - Add example requests and responses
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5, 20.1, 20.2, 20.3, 20.4, 20.5, 20.6_
  
  - [x] 17.4 Add Swagger documentation for User endpoints
    - Write src/modules/users/user.swagger.js with JSDoc comments
    - Document profile endpoints with request/response schemas
    - Mark endpoints with security requirement (Bearer JWT)
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5, 20.1, 20.2, 20.3, 20.4, 20.5, 20.6_
  
  - [x] 17.5 Mount Swagger UI endpoint
    - Add Swagger UI route to app.js at /api/docs
    - Serve interactive API documentation
    - _Requirements: 21.1, 21.2, 21.3_

- [x] 18. Set up testing infrastructure
  - [x] 18.1 Create Jest configuration
    - Write jest.config.js with test environment settings
    - Configure mongodb-memory-server for isolated database testing
    - Set up test coverage thresholds (80% minimum)
    - _Requirements: Testing strategy from design document_
  
  - [x] 18.2 Create test utilities and helpers
    - Write tests/helpers/db.helper.js for database setup/teardown
    - Write tests/helpers/auth.helper.js for generating test tokens and users
    - Write tests/helpers/fixtures.js for test data generation
    - _Requirements: Testing strategy from design document_
  
  - [x]* 18.3 Write unit tests for User model
    - Test password hashing on save
    - Test comparePassword method
    - Test toJSON transformation excludes password
    - Test email uniqueness constraint
    - Test validation rules for all fields
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.6, 9.1, 9.2, 9.4_
  
  - [x]* 18.4 Write unit tests for Application model
    - Test default status is 'pending'
    - Test validation rules for all fields
    - Test timestamps are set correctly
    - Test population of userId and reviewedBy
    - _Requirements: 5.1, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_
  
  - [x]* 18.5 Write unit tests for Auth service
    - Test registerUser with valid data
    - Test registerUser with duplicate email
    - Test loginUser with valid credentials
    - Test loginUser with invalid credentials
    - Test token generation and verification
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.4, 2.5, 2.6_
  
  - [x]* 18.6 Write unit tests for Application service
    - Test createApplication by applicant
    - Test createApplication by non-applicant fails
    - Test getApplicationsByUser returns only user's apps
    - Test getAllApplications returns all apps
    - Test updateStatus sets reviewedBy correctly
    - _Requirements: 5.1, 5.10, 6.1, 6.2, 7.1, 7.2_
  
  - [x]* 18.7 Write unit tests for authentication middleware
    - Test authenticate extracts token from cookie
    - Test authenticate populates req.user
    - Test authenticate rejects missing token
    - Test authenticate rejects invalid token
    - Test authorize allows correct roles
    - Test authorize denies incorrect roles
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2_
  
  - [x]* 18.8 Write integration tests for authentication flow
    - Test complete registration → login → access protected endpoint flow
    - Verify token is set in cookie after login
    - Verify token is cleared after logout
    - Verify protected endpoints reject unauthenticated requests
    - _Requirements: 1.1, 2.1, 2.2, 2.8, 3.4_
  
  - [x]* 18.9 Write integration tests for application lifecycle
    - Test applicant creates application → staff updates status → applicant views updated status
    - Verify status changes persist
    - Verify reviewedBy is set correctly
    - Verify applicants cannot see other users' applications
    - _Requirements: 5.1, 6.1, 7.1, 7.2_
  
  - [x]* 18.10 Write integration tests for authorization
    - Test applicant cannot access staff endpoints
    - Test staff cannot create applications
    - Test role-based access control works correctly
    - _Requirements: 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_

- [ ] 19. Create property-based tests with fast-check
  - [ ]* 19.1 Write property test for email uniqueness
    - **Property 5: Email Uniqueness Constraint**
    - **Validates: Requirements 1.3, 8.3, 15.1**
    - Generate arbitrary valid emails
    - Verify first registration succeeds
    - Verify second registration with same email fails with conflict error
  
  - [ ]* 19.2 Write property test for validation errors
    - **Property 28: Input Validation Before Processing**
    - **Validates: Requirements 11.1, 11.2, 11.3, 11.4**
    - Generate arbitrary invalid inputs (missing fields, wrong types, invalid formats)
    - Verify all invalid inputs are rejected with 400 validation error
    - Verify business logic is never executed for invalid inputs
  
  - [ ]* 19.3 Write property test for error response format
    - **Property 30: Error Response Format**
    - **Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 13.2**
    - Trigger various error conditions
    - Verify all error responses have success=false and message field
    - Verify correct HTTP status codes (400, 401, 403, 404, 409, 500)
  
  - [ ]* 19.4 Write property test for success response format
    - **Property 31: Success Response Format**
    - **Validates: Requirements 13.1**
    - Test all successful operations
    - Verify responses have success=true and data field
    - Verify HTTP status is 200 or 201
  
  - [ ]* 19.5 Write property test for timestamp invariants
    - **Property 7: Document Timestamp Invariants**
    - **Validates: Requirements 1.8, 15.4**
    - Create arbitrary documents
    - Verify createdAt and updatedAt are valid dates
    - Verify updatedAt >= createdAt
  
  - [ ]* 19.6 Write property test for updatedAt modification
    - **Property 8: UpdatedAt Modification on Updates**
    - **Validates: Requirements 7.3, 8.5, 15.5**
    - Update arbitrary documents
    - Verify updatedAt changes to a value greater than previous updatedAt

- [x] 20. Final checkpoint and integration verification
  - Ensure all tests pass, ask the user if questions arise.

- [x] 21. Create npm scripts and documentation
  - [x] 21.1 Add npm scripts to package.json
    - Add "start": "node src/server.js"
    - Add "dev": "nodemon src/server.js"
    - Add "test": "jest --coverage"
    - Add "test:watch": "jest --watch"
    - Add "lint": "eslint src/"
    - Add "format": "prettier --write src/"
  
  - [x] 21.2 Create README.md with setup instructions
    - Document environment variables
    - Document API endpoints overview
    - Document how to run the application
    - Document how to run tests
    - Document how to access Swagger documentation
  
  - [x] 21.3 Verify all environment variables are documented
    - Ensure .env.example contains all required variables
    - Document each variable's purpose in README

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and provide opportunities for user feedback
- Property tests validate universal correctness properties from the design document
- Unit and integration tests validate specific examples and edge cases
- The implementation follows a bottom-up approach: models → services → controllers → routes → integration
- All code should use TypeScript interfaces from the design document as reference
- Module isolation must be maintained: cross-module communication only through service layers
