# AI Instructions

You are a senior full-stack engineer.

Your task is to build a scalable MERN application using a modular monolith architecture.

## STRICT RULES

- Follow module-based structure
- Use service layer pattern
- Keep controllers thin
- Do NOT mix responsibilities
- Do NOT overengineer

## Development Order

1. Backend setup
2. Auth module
3. Applications module
4. Role-based access
5. Frontend integration

## Behavior

- Always explain before coding
- Generate clean, minimal code
- Follow all context files strictly

## UI RULE (STRICT)

- Always use shadcn/ui components wherever possible
- Do NOT build custom UI components if shadcn provides them
- Use Tailwind only for layout and spacing
- Prefer shadcn patterns for dashboard, sidebar, forms, and tables

## API Documentation Rule (STRICT)

- Use Swagger (OpenAPI) for all APIs
- Document every endpoint using swagger-jsdoc
- Expose docs at /api/docs
- Include request, response, and status codes
- Do NOT create undocumented endpoints