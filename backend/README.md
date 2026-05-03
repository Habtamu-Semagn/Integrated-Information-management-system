# Startup Backend System

A Node.js/Express modular monolith backend system for managing startup applications with JWT authentication, role-based access control, and MongoDB persistence.

## Features

- ✅ **User Authentication**: JWT-based authentication with HTTP-only cookies
- ✅ **Role-Based Access Control**: Three user roles (applicant, staff, admin)
- ✅ **Application Management**: CRUD operations for startup applications
- ✅ **Secure Password Handling**: Bcrypt hashing with 10 salt rounds
- ✅ **Input Validation**: Comprehensive request validation
- ✅ **Error Handling**: Centralized error handling with proper HTTP status codes
- ✅ **Modular Architecture**: Clean separation of concerns (models, services, controllers, routes)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Security**: Helmet, CORS, bcryptjs
- **Validation**: Custom validation middleware

## Project Structure

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/              # Authentication module
│   │   │   ├── auth.service.js
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.routes.js
│   │   │   └── auth.validation.js
│   │   ├── users/             # User management module
│   │   │   ├── user.model.js
│   │   │   ├── user.service.js
│   │   │   ├── user.controller.js
│   │   │   ├── user.routes.js
│   │   │   └── user.validation.js
│   │   └── applications/      # Application management module
│   │       ├── application.model.js
│   │       ├── application.service.js
│   │       ├── application.controller.js
│   │       ├── application.routes.js
│   │       └── application.validation.js
│   ├── common/
│   │   ├── config/            # Configuration files
│   │   │   ├── database.config.js
│   │   │   └── jwt.config.js
│   │   ├── middleware/        # Shared middleware
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── validation.middleware.js
│   │   ├── utils/             # Utility functions
│   │   │   ├── error.util.js
│   │   │   └── response.util.js
│   │   └── constants/         # Constants
│   │       ├── roles.constant.js
│   │       └── status.constant.js
│   ├── app.js                 # Express app configuration
│   └── server.js              # Server entry point
├── package.json
├── .env.example
└── .gitignore
```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
API_URL=http://localhost:5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/startup-support-system

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Cookie Configuration
COOKIE_SECURE=false
COOKIE_SAME_SITE=strict

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

## Installation

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start MongoDB**:
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:7.0
   
   # Or use your local MongoDB installation
   ```

4. **Start the server**:
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## API Documentation

Interactive API documentation is available via Swagger UI at:
```
http://localhost:5000/api/docs
```

The Swagger documentation provides:
- Complete API endpoint reference
- Request/response schemas
- Example requests and responses
- Authentication requirements
- Role-based access information
- Try-it-out functionality for testing endpoints

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| POST | `/api/auth/register` | Register new user | No | - |
| POST | `/api/auth/login` | Login user | No | - |
| POST | `/api/auth/logout` | Logout user | No | - |

### User Profile

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/api/users/profile` | Get user profile | Yes | All |
| PATCH | `/api/users/profile` | Update profile | Yes | All |

### Applications

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| POST | `/api/applications` | Create application | Yes | applicant |
| GET | `/api/applications/my` | Get my applications | Yes | applicant |
| GET | `/api/applications` | Get all applications | Yes | staff, admin |
| GET | `/api/applications/:id` | Get application by ID | Yes | staff, admin |
| PATCH | `/api/applications/:id/status` | Update status | Yes | staff, admin |

### Health Check

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Server health check | No |

### API Documentation

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/docs` | Interactive Swagger API documentation | No |

## API Usage Examples

### Register a New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Create Application (Applicant)

```bash
curl -X POST http://localhost:5000/api/applications \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "startupName": "EcoTech Solutions",
    "description": "A platform connecting eco-conscious consumers with sustainable products",
    "problemStatement": "Consumers struggle to find verified sustainable products",
    "solution": "Centralized marketplace with verified eco-certifications",
    "targetMarket": "Environmentally conscious millennials and Gen Z"
  }'
```

### Get All Applications (Staff/Admin)

```bash
curl -X GET http://localhost:5000/api/applications \
  -b cookies.txt
```

### Update Application Status (Staff/Admin)

```bash
curl -X PATCH http://localhost:5000/api/applications/:id/status \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "status": "approved"
  }'
```

## User Roles

### Applicant (Default)
- Register and login
- Create applications
- View own applications
- Update own profile

### Staff
- All applicant permissions
- View all applications
- Update application status
- View application details

### Admin
- All staff permissions
- Full system access

## Security Features

1. **Password Security**
   - Passwords hashed with bcrypt (10 salt rounds)
   - Passwords never included in API responses
   - Passwords excluded from queries by default

2. **JWT Authentication**
   - Tokens stored in HTTP-only cookies
   - Secure flag enabled in production
   - SameSite=strict for CSRF protection
   - 7-day token expiration

3. **HTTP Security Headers**
   - Helmet middleware for security headers
   - CORS configured with credentials support
   - Content-Type validation

4. **Input Validation**
   - Request body validation
   - Field length constraints
   - Format validation (email, ObjectId)
   - Enum validation for status and roles

5. **Error Handling**
   - Stack traces hidden in production
   - Consistent error response format
   - Proper HTTP status codes
   - Server-side error logging

## Development

### Available Scripts

```bash
# Start server in development mode with auto-reload
npm run dev

# Start server in production mode
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linter
npm run lint

# Format code
npm run format
```

### Adding a New Module

1. Create module directory in `src/modules/`
2. Create model, service, controller, routes, and validation files
3. Import and mount routes in `src/app.js`
4. Follow the existing module structure for consistency

## Testing

The system includes comprehensive testing infrastructure:

- Unit tests for models, services, and middleware
- Integration tests for API endpoints
- Property-based tests for correctness properties

Run tests:
```bash
npm test
```

## Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET` (minimum 32 characters)
- [ ] Enable HTTPS and set `COOKIE_SECURE=true`
- [ ] Configure production MongoDB URI
- [ ] Set up MongoDB authentication
- [ ] Configure proper CORS origins
- [ ] Set up logging service
- [ ] Configure monitoring and alerts
- [ ] Set up backup strategy
- [ ] Review and update rate limiting
- [ ] Enable compression middleware

### Environment-Specific Configuration

**Development**:
- Detailed error messages with stack traces
- Debug logging enabled
- HTTP cookies (secure=false)

**Production**:
- Generic error messages
- Info/error logging only
- HTTPS cookies (secure=true)
- MongoDB authentication required

## Troubleshooting

### Common Issues

**MongoDB Connection Error**:
```
Error: MONGODB_URI environment variable is required
```
Solution: Ensure `.env` file exists with valid `MONGODB_URI`

**JWT Secret Missing**:
```
Error: JWT_SECRET environment variable is required
```
Solution: Add `JWT_SECRET` to `.env` file

**Port Already in Use**:
```
Error: listen EADDRINUSE: address already in use :::5000
```
Solution: Change `PORT` in `.env` or stop the process using port 5000

## License

ISC

## Support

For issues and questions, please refer to the project documentation or contact the development team.
