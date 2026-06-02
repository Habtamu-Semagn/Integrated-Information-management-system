# Modules

This directory contains feature modules organized by domain.

## Structure

Each module follows this structure:

```
modules/
  [feature-name]/
    components/       # Feature-specific React components
    hooks/            # Custom React hooks for this feature
    services/         # API service functions
    types/            # TypeScript type definitions
```

## Current Modules

### auth
Authentication and user management
- Login/Register forms
- Auth service (login, register, logout)
- User types

### applications
Startup application management
- Application forms and lists
- Application service (CRUD operations)
- Application types

## Adding a New Module

When adding a new feature (e.g., funding, mentorship):

1. Create module directory: `modules/[feature-name]/`
2. Add subdirectories: `components/`, `hooks/`, `services/`, `types/`
3. Create service file: `services/[feature]-service.ts`
4. Define types: `types/[feature].types.ts`
5. Build components: `components/[Feature]Form.tsx`, etc.
6. Create custom hooks if needed: `hooks/use-[feature].ts`

## Best Practices

- Keep business logic in services
- Use TypeScript for type safety
- Create reusable hooks for common patterns
- Keep components focused and small
- Export types for use in other modules
