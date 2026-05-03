# Requirements Document: Startup Backend System

## Introduction

The Startup Backend System is a Node.js/Express-based application management platform that enables startup applicants to submit applications and government staff to review them. The system implements secure authentication using JWT tokens with HTTP-only cookies, role-based access control across three user types (applicant, staff, admin), and RESTful APIs for all operations. Built on a modular monolith architecture with MongoDB for data persistence, the system ensures strict module isolation while maintaining scalability for future microservices extraction. All API endpoints are documented using Swagger/OpenAPI for developer accessibility.

## Glossary

- **System**: The Startup Backend System (Node.js/Express application)
- **Auth_Module**: Authentication module handling user registration, login, and session management
- **Users_Module**: User management module handling profile operations and user data
- **Applications_Module**: Application management module handling startup application submissions and reviews
- **Auth_Middleware**: Middleware component for JWT token verification and role-based authorization
- **User**: Any registered person in the system with a role (applicant, staff, or admin)
- **Applicant**: User with role 'applicant' who can submit startup applications
- **Staff**: User with role 'staff' who can review and update application statuses
- **Admin**: User with role 'admin' who has full system access
- **Application**: A startup application submission containing business details
- **JWT_Token**: JSON Web Token used for authentication, stored in HTTP-only cookies
- **HTTP_Only_Cookie**: Cookie that cannot be accessed via JavaScript, used for secure token storage
- **Service_Layer**: Business logic layer that handles data operations and cross-module communication
- **Controller_Layer**: Presentation layer that handles HTTP requests and responses
- **Model_Layer**: Data access layer using Mongoose schemas and models
- **Swagger_Documentation**: OpenAPI specification for interactive API exploration
- **Application_Status**: Enum value representing application state (pending, approved, rejected)
- **Bcrypt**: Password hashing algorithm with configurable salt rounds
- **MongoDB**: NoSQL database used for data persistence
- **Mongoose**: MongoDB ODM (Object Data Modeling) library for Node.js

## Requirements

### Requirement 1: User Registration

**User Story:** As a new user, I want to register an account with my name, email, and password, so that I can access the system.

#### Acceptance Criteria

1. WHEN a user submits registration data with valid name, email, and password, THEN THE Auth_Module SHALL create a new user account with role 'applicant' by default
2. WHEN a user submits a password, THEN THE Auth_Module SHALL hash the password using bcrypt with salt rounds of 10 or greater
3. WHEN a user attempts to register with an email that already exists, THEN THE System SHALL reject the registration and return a conflict error
4. WHEN a user submits a name shorter than 2 characters or longer than 100 characters, THEN THE System SHALL reject the registration with a validation error
5. WHEN a user submits a password shorter than 8 characters, THEN THE System SHALL reject the registration with a validation error
6. WHEN a user submits an invalid email format, THEN THE System SHALL reject the registration with a validation error
7. WHEN a user registration is successful, THEN THE System SHALL return the user data without the password field
8. WHEN a user is created, THEN THE System SHALL automatically set createdAt and updatedAt timestamps

### Requirement 2: User Authentication

**User Story:** As a registered user, I want to login with my email and password, so that I can access protected features.

#### Acceptance Criteria

1. WHEN a user submits valid login credentials, THEN THE Auth_Module SHALL generate a JWT token containing userId and role
2. WHEN a JWT token is generated, THEN THE Auth_Module SHALL set it in an HTTP-only cookie with secure and sameSite attributes
3. WHEN a user submits valid credentials, THEN THE System SHALL return the user data without the password field
4. WHEN a user submits an incorrect email, THEN THE System SHALL reject the login with an unauthorized error
5. WHEN a user submits an incorrect password, THEN THE System SHALL reject the login with an unauthorized error
6. WHEN a JWT token is created, THEN THE Auth_Module SHALL set the expiration to 7 days from creation
7. WHEN comparing passwords during login, THEN THE Auth_Module SHALL use bcrypt.compare() for secure verification
8. WHEN a user logs out, THEN THE System SHALL clear the authentication cookie

### Requirement 3: Authentication Middleware

**User Story:** As a system administrator, I want all protected endpoints to verify user authentication, so that unauthorized users cannot access restricted features.

#### Acceptance Criteria

1. WHEN a request is made to a protected endpoint, THEN THE Auth_Middleware SHALL extract the JWT token from the HTTP-only cookie
2. WHEN a JWT token is extracted, THEN THE Auth_Middleware SHALL verify it using the JWT_SECRET
3. WHEN a valid token is verified, THEN THE Auth_Middleware SHALL decode the payload and populate req.user with userId and role
4. WHEN no token is provided, THEN THE Auth_Middleware SHALL reject the request with a 401 unauthorized error
5. WHEN an invalid token is provided, THEN THE Auth_Middleware SHALL reject the request with a 401 unauthorized error
6. WHEN an expired token is provided, THEN THE Auth_Middleware SHALL reject the request with a 401 unauthorized error
7. WHEN token verification succeeds, THEN THE Auth_Middleware SHALL call next() to proceed to the next middleware

### Requirement 4: Role-Based Authorization

**User Story:** As a system administrator, I want to restrict endpoint access based on user roles, so that users can only perform actions appropriate to their role.

#### Acceptance Criteria

1. WHEN a user attempts to access an endpoint, THEN THE Auth_Middleware SHALL verify the user's role is in the allowed roles list
2. WHEN a user's role is not in the allowed roles list, THEN THE System SHALL reject the request with a 403 forbidden error
3. WHEN an Applicant attempts to create an application, THEN THE System SHALL allow the operation
4. WHEN a Staff or Admin attempts to create an application, THEN THE System SHALL reject the operation with a forbidden error
5. WHEN a Staff or Admin attempts to view all applications, THEN THE System SHALL allow the operation
6. WHEN an Applicant attempts to view all applications, THEN THE System SHALL reject the operation with a forbidden error
7. WHEN a Staff or Admin attempts to update application status, THEN THE System SHALL allow the operation
8. WHEN an Applicant attempts to update application status, THEN THE System SHALL reject the operation with a forbidden error

### Requirement 5: Application Submission

**User Story:** As an applicant, I want to submit a startup application with business details, so that it can be reviewed by government staff.

#### Acceptance Criteria

1. WHEN an Applicant submits application data, THEN THE Applications_Module SHALL create a new application with status 'pending'
2. WHEN an application is created, THEN THE System SHALL associate it with the authenticated user's userId
3. WHEN an application is created, THEN THE System SHALL set reviewedBy to null
4. WHEN a startupName is shorter than 3 characters or longer than 200 characters, THEN THE System SHALL reject the submission with a validation error
5. WHEN a description is shorter than 10 characters or longer than 1000 characters, THEN THE System SHALL reject the submission with a validation error
6. WHEN a problemStatement is shorter than 10 characters or longer than 1000 characters, THEN THE System SHALL reject the submission with a validation error
7. WHEN a solution is shorter than 10 characters or longer than 1000 characters, THEN THE System SHALL reject the submission with a validation error
8. WHEN a targetMarket is shorter than 5 characters or longer than 500 characters, THEN THE System SHALL reject the submission with a validation error
9. WHEN an application is successfully created, THEN THE System SHALL return the complete application data including timestamps
10. WHEN a non-Applicant user attempts to create an application, THEN THE System SHALL reject the operation with a forbidden error

### Requirement 6: Application Retrieval

**User Story:** As an applicant, I want to view my submitted applications, so that I can track their status.

#### Acceptance Criteria

1. WHEN an Applicant requests their applications, THEN THE Applications_Module SHALL return only applications where userId matches the authenticated user
2. WHEN a Staff or Admin requests all applications, THEN THE Applications_Module SHALL return all applications in the system
3. WHEN a Staff or Admin requests a specific application by ID, THEN THE Applications_Module SHALL return the application details
4. WHEN an Applicant attempts to view all applications, THEN THE System SHALL reject the request with a forbidden error
5. WHEN a user requests a non-existent application ID, THEN THE System SHALL return a 404 not found error
6. WHEN applications are retrieved, THEN THE System SHALL include all application fields including status and reviewedBy
7. WHEN applications are retrieved, THEN THE System SHALL sort them by createdAt timestamp in descending order

### Requirement 7: Application Status Management

**User Story:** As a staff member, I want to update application statuses to approved or rejected, so that applicants know the outcome of their submissions.

#### Acceptance Criteria

1. WHEN a Staff or Admin updates an application status, THEN THE Applications_Module SHALL change the status to the specified value
2. WHEN an application status is updated, THEN THE Applications_Module SHALL set reviewedBy to the authenticated user's userId
3. WHEN an application status is updated, THEN THE System SHALL automatically update the updatedAt timestamp
4. WHEN a status value is not one of 'pending', 'approved', or 'rejected', THEN THE System SHALL reject the update with a validation error
5. WHEN an Applicant attempts to update application status, THEN THE System SHALL reject the operation with a forbidden error
6. WHEN a Staff or Admin attempts to update a non-existent application, THEN THE System SHALL return a 404 not found error
7. WHEN an application status is updated to the same value it already has, THEN THE System SHALL reject the update with a validation error
8. WHEN an application status is successfully updated, THEN THE System SHALL return the updated application with populated reviewer data

### Requirement 8: User Profile Management

**User Story:** As a user, I want to view and update my profile information, so that I can keep my account details current.

#### Acceptance Criteria

1. WHEN a user requests their profile, THEN THE Users_Module SHALL return the user data without the password field
2. WHEN a user updates their profile, THEN THE Users_Module SHALL modify only the allowed fields (name, email)
3. WHEN a user updates their email to one that already exists, THEN THE System SHALL reject the update with a conflict error
4. WHEN a user profile is retrieved, THEN THE System SHALL include id, name, email, role, and createdAt fields
5. WHEN a user updates their profile, THEN THE System SHALL automatically update the updatedAt timestamp

### Requirement 9: Password Security

**User Story:** As a security administrator, I want all passwords to be securely hashed and never exposed, so that user credentials are protected.

#### Acceptance Criteria

1. THE System SHALL hash all passwords using bcrypt with a minimum of 10 salt rounds
2. THE System SHALL never store passwords in plain text in the database
3. THE System SHALL never include password fields in any API response
4. WHEN a user document is converted to JSON, THEN THE System SHALL automatically exclude the password field
5. WHEN comparing passwords, THEN THE System SHALL use bcrypt.compare() instead of direct comparison
6. THE System SHALL never log passwords in application logs

### Requirement 10: JWT Token Security

**User Story:** As a security administrator, I want JWT tokens to be securely managed, so that authentication is protected from common attacks.

#### Acceptance Criteria

1. WHEN a JWT token is created, THEN THE Auth_Module SHALL sign it with the JWT_SECRET from environment variables
2. WHEN a JWT token is stored, THEN THE System SHALL use HTTP-only cookies that cannot be accessed via JavaScript
3. WHERE the environment is production, THEN THE System SHALL set the secure flag to true on authentication cookies
4. THE System SHALL set the sameSite attribute to 'strict' on authentication cookies to prevent CSRF attacks
5. WHEN a JWT token is created, THEN THE Auth_Module SHALL include userId, role, iat, and exp in the payload
6. WHEN a JWT token expires, THEN THE Auth_Middleware SHALL reject it with an unauthorized error
7. THE System SHALL never log JWT tokens in application logs

### Requirement 11: Data Validation

**User Story:** As a developer, I want all input data to be validated before processing, so that invalid data does not corrupt the system.

#### Acceptance Criteria

1. WHEN a request is received, THEN THE System SHALL validate the request body against the defined schema before processing
2. WHEN validation fails, THEN THE System SHALL return a 400 bad request error with detailed error messages
3. WHEN a required field is missing, THEN THE System SHALL reject the request with a validation error
4. WHEN a field value does not match the expected type, THEN THE System SHALL reject the request with a validation error
5. WHEN a field value exceeds length constraints, THEN THE System SHALL reject the request with a validation error
6. WHEN an ObjectId field contains an invalid format, THEN THE System SHALL reject the request with a validation error
7. WHEN validation succeeds, THEN THE System SHALL proceed to the controller logic

### Requirement 12: Error Handling

**User Story:** As a developer, I want consistent error responses across all endpoints, so that clients can handle errors predictably.

#### Acceptance Criteria

1. WHEN an error occurs, THEN THE System SHALL return a JSON response with success: false and a message field
2. WHEN a validation error occurs, THEN THE System SHALL return HTTP status 400 with error details
3. WHEN an authentication error occurs, THEN THE System SHALL return HTTP status 401 with an appropriate message
4. WHEN an authorization error occurs, THEN THE System SHALL return HTTP status 403 with an appropriate message
5. WHEN a resource is not found, THEN THE System SHALL return HTTP status 404 with an appropriate message
6. WHEN a conflict occurs (e.g., duplicate email), THEN THE System SHALL return HTTP status 409 with an appropriate message
7. WHEN an unexpected server error occurs, THEN THE System SHALL return HTTP status 500 with a generic message
8. WHERE the environment is production, THEN THE System SHALL not expose stack traces in error responses
9. WHEN an error occurs, THEN THE System SHALL log the error details server-side with context information

### Requirement 13: API Response Format

**User Story:** As a frontend developer, I want consistent response formats from all endpoints, so that I can handle responses uniformly.

#### Acceptance Criteria

1. WHEN an operation succeeds, THEN THE System SHALL return a JSON response with success: true and a data field
2. WHEN an operation fails, THEN THE System SHALL return a JSON response with success: false and a message field
3. THE System SHALL set Content-Type header to 'application/json' for all responses
4. WHEN returning user data, THEN THE System SHALL exclude the password field
5. WHEN returning application data, THEN THE System SHALL include all fields except internal Mongoose fields (__v)
6. WHEN returning timestamps, THEN THE System SHALL use ISO 8601 format
7. WHEN returning ObjectIds, THEN THE System SHALL convert them to string format in the id field

### Requirement 14: Module Isolation

**User Story:** As a system architect, I want strict module boundaries, so that the system can scale to microservices in the future.

#### Acceptance Criteria

1. THE System SHALL organize code into separate modules (Auth, Users, Applications) with independent directories
2. WHEN a module needs data from another module, THEN THE System SHALL call the other module's service layer
3. THE System SHALL prevent controllers from directly accessing database models from other modules
4. THE System SHALL prevent models from being exported outside their module except through service interfaces
5. WHEN a controller receives a request, THEN THE System SHALL delegate business logic to the service layer
6. THE System SHALL prevent business logic from being implemented in controllers
7. WHEN a service needs to perform database operations, THEN THE System SHALL use the model layer within the same module

### Requirement 15: Database Schema Validation

**User Story:** As a database administrator, I want schema validation at the database level, so that data integrity is maintained.

#### Acceptance Criteria

1. WHEN a user document is created, THEN THE System SHALL enforce a unique index on the email field
2. WHEN an application document is created, THEN THE System SHALL validate that userId references a valid User document
3. WHEN an application status is updated, THEN THE System SHALL validate that reviewedBy references a valid User document
4. THE System SHALL automatically add createdAt and updatedAt timestamps to all documents
5. WHEN a document is updated, THEN THE System SHALL automatically update the updatedAt timestamp
6. THE System SHALL create a compound index on (userId, createdAt) for the Application collection
7. THE System SHALL create an index on the status field for the Application collection

### Requirement 16: Swagger API Documentation

**User Story:** As an API consumer, I want interactive API documentation, so that I can understand and test endpoints easily.

#### Acceptance Criteria

1. THE System SHALL generate OpenAPI specification from code annotations
2. THE System SHALL serve Swagger UI at the /api/docs endpoint
3. WHEN viewing Swagger documentation, THEN THE System SHALL display all available endpoints with descriptions
4. WHEN viewing an endpoint in Swagger, THEN THE System SHALL show request body schemas, parameters, and response formats
5. WHEN viewing a protected endpoint in Swagger, THEN THE System SHALL indicate that it requires JWT authentication
6. THE System SHALL organize endpoints by tags (Auth, Applications, Users)
7. WHEN Swagger UI is loaded, THEN THE System SHALL allow users to test endpoints interactively

### Requirement 17: CORS Configuration

**User Story:** As a frontend developer, I want the API to accept requests from the frontend application, so that I can build a web interface.

#### Acceptance Criteria

1. THE System SHALL configure CORS to allow requests from the frontend URL specified in environment variables
2. THE System SHALL allow credentials (cookies) to be sent in cross-origin requests
3. THE System SHALL restrict allowed origins to trusted domains only
4. THE System SHALL allow standard HTTP methods (GET, POST, PATCH, DELETE)
5. THE System SHALL allow Content-Type and Authorization headers in requests

### Requirement 18: Security Headers

**User Story:** As a security administrator, I want security headers on all responses, so that common web vulnerabilities are mitigated.

#### Acceptance Criteria

1. THE System SHALL use helmet middleware to set security headers
2. THE System SHALL set X-Content-Type-Options header to 'nosniff'
3. THE System SHALL set X-Frame-Options header to 'DENY'
4. THE System SHALL set X-XSS-Protection header to '1; mode=block'
5. WHERE the environment is production, THEN THE System SHALL enforce HTTPS for all requests

### Requirement 19: Database Connection Management

**User Story:** As a system administrator, I want reliable database connections, so that the application remains available.

#### Acceptance Criteria

1. WHEN the application starts, THEN THE System SHALL connect to MongoDB using the URI from environment variables
2. WHEN the database connection fails, THEN THE System SHALL log the error and retry the connection
3. WHEN the database connection is established, THEN THE System SHALL log a success message
4. THE System SHALL configure connection pooling for efficient database access
5. WHEN the application shuts down, THEN THE System SHALL gracefully close database connections

### Requirement 20: Environment Configuration

**User Story:** As a developer, I want configuration through environment variables, so that the application can run in different environments without code changes.

#### Acceptance Criteria

1. THE System SHALL load configuration from a .env file in development
2. THE System SHALL require the following environment variables: PORT, MONGODB_URI, JWT_SECRET
3. WHEN a required environment variable is missing, THEN THE System SHALL fail to start and log an error
4. THE System SHALL use default values for optional configuration (e.g., JWT_EXPIRES_IN defaults to '7d')
5. WHERE the environment is production, THEN THE System SHALL enforce stricter security settings (secure cookies, HTTPS)
6. THE System SHALL never commit the .env file to version control

### Requirement 21: Logging

**User Story:** As a system administrator, I want comprehensive logging, so that I can monitor system health and debug issues.

#### Acceptance Criteria

1. WHEN an error occurs, THEN THE System SHALL log the error with timestamp, user context, and stack trace
2. WHEN a user logs in, THEN THE System SHALL log the event with userId and timestamp
3. WHEN an application status is updated, THEN THE System SHALL log the change with applicationId, reviewerId, and new status
4. THE System SHALL use structured logging with consistent format (JSON recommended)
5. WHERE the environment is production, THEN THE System SHALL log at INFO level or higher
6. WHERE the environment is development, THEN THE System SHALL log at DEBUG level
7. THE System SHALL never log sensitive data (passwords, tokens) in any environment

### Requirement 22: Performance Optimization

**User Story:** As a user, I want fast response times, so that the application feels responsive.

#### Acceptance Criteria

1. WHEN a user authenticates, THEN THE System SHALL respond within 200 milliseconds under normal load
2. WHEN an application is created, THEN THE System SHALL respond within 300 milliseconds under normal load
3. WHEN applications are listed, THEN THE System SHALL respond within 500 milliseconds under normal load
4. WHEN querying applications by user, THEN THE System SHALL use the compound index on (userId, createdAt)
5. WHEN filtering applications by status, THEN THE System SHALL use the index on the status field
6. WHEN returning application lists, THEN THE System SHALL use field selection to return only necessary data
7. WHEN populating user references, THEN THE System SHALL limit populated fields to name and email only

### Requirement 23: Data Integrity

**User Story:** As a database administrator, I want referential integrity between collections, so that orphaned records do not exist.

#### Acceptance Criteria

1. WHEN an application is created, THEN THE System SHALL verify that the userId references an existing User document
2. WHEN an application status is updated, THEN THE System SHALL verify that the reviewedBy references an existing User document
3. WHEN an application status is not 'pending', THEN THE System SHALL ensure reviewedBy is not null
4. WHEN an application status is 'pending', THEN THE System SHALL ensure reviewedBy is null
5. THE System SHALL use Mongoose schema validation to enforce data types and constraints
6. THE System SHALL use Mongoose middleware to enforce business rules before saving documents

### Requirement 24: Testing Support

**User Story:** As a developer, I want the codebase to be testable, so that I can ensure code quality through automated tests.

#### Acceptance Criteria

1. THE System SHALL separate business logic into service layer functions that can be unit tested
2. THE System SHALL use dependency injection patterns to allow mocking in tests
3. THE System SHALL provide test configuration for in-memory MongoDB
4. THE System SHALL export service functions for testing purposes
5. THE System SHALL structure code to allow controller testing with mocked services
6. THE System SHALL structure code to allow middleware testing in isolation
