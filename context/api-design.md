# API Design

## Auth

POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout

## Applications

POST /api/applications
GET /api/applications/my

## Staff

GET /api/applications
GET /api/applications/:id
PATCH /api/applications/:id/status

## Response Format

{
  "success": true,
  "data": {},
  "message": "string"
}

## Error Handling

- Centralized middleware
- Proper HTTP status codes