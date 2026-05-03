# API Documentation (Swagger / OpenAPI)

## Tools

- swagger-ui-express
- swagger-jsdoc

## Goal

Provide interactive API documentation for all endpoints.

Accessible at:
GET /api/docs

---

## Setup Strategy

- Use swagger-jsdoc to generate OpenAPI spec from JSDoc comments
- Use swagger-ui-express to serve documentation UI

---

## File Structure

src/
  docs/
    swagger.js
  modules/
    auth/
    applications/

---

## Swagger Config (swagger.js)

- Define:
  - OpenAPI version
  - API info (title, version, description)
  - Server URL
  - Components (schemas)

---

## Global API Info

- Title: Startup Support System API
- Version: 1.0.0
- Description: API for managing startup registration and services

---

## Authentication in Swagger

Use JWT Bearer Auth:

Authorization: Bearer <token>

---

## Rules for Documentation

Each route MUST include:

- Summary
- Description
- Tags (Auth, Applications, etc.)
- Request body schema
- Response schema
- Status codes

---

## Example Tags

- Auth
- Applications
- Users
- Funding (future)
- Mentorship (future)

---

## Schema Definition Example

User:
- id
- name
- email
- role

Application:
- id
- startupName
- description
- status

---

## AI Enforcement Rule

- Every endpoint MUST be documented
- Do NOT create routes without Swagger comments
- Keep documentation updated with code