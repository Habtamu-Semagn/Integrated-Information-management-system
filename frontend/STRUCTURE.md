# Frontend Structure

This document explains the frontend folder organization based on Next.js App Router and shadcn/ui best practices.

## Directory Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group (no layout)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (dashboard)/              # Dashboard route group (with sidebar layout)
│   │   ├── layout.tsx            # Sidebar + Header layout
│   │   ├── applications/
│   │   │   ├── page.tsx          # List applications
│   │   │   └── [id]/
│   │   │       └── page.tsx      # View single application
│   │   ├── funding/              # Future feature
│   │   └── mentorship/           # Future feature
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components (auto-generated)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── form.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── tabs.tsx
│   │   ├── badge.tsx
│   │   └── alert.tsx
│   ├── layout/                   # Layout components
│   │   ├── sidebar.tsx           # Main sidebar navigation
│   │   ├── header.tsx            # Dashboard header
│   │   └── footer.tsx            # Footer (optional)
│   └── shared/                   # Shared/reusable components
│       ├── loading-spinner.tsx
│       ├── error-boundary.tsx
│       └── page-header.tsx
│
├── modules/                      # Feature modules (business logic)
│   ├── applications/
│   │   ├── components/           # Application-specific components
│   │   │   ├── application-form.tsx
│   │   │   ├── application-card.tsx
│   │   │   ├── application-table.tsx
│   │   │   └── status-badge.tsx
│   │   ├── hooks/                # Custom hooks
│   │   │   ├── use-applications.ts
│   │   │   └── use-application.ts
│   │   ├── services/             # API calls
│   │   │   └── application-service.ts
│   │   └── types/                # TypeScript types
│   │       └── application.types.ts
│   │
│   └── auth/
│       ├── components/
│       │   ├── login-form.tsx
│       │   └── register-form.tsx
│       ├── hooks/
│       │   └── use-auth.ts
│       ├── services/
│       │   └── auth-service.ts
│       └── types/
│           └── auth.types.ts
│
├── lib/                          # Utility libraries
│   ├── utils.ts                  # Utility functions (cn, etc.)
│   ├── api-client.ts             # Axios/Fetch wrapper
│   └── constants.ts              # App constants
│
├── public/                       # Static assets
│   ├── images/
│   └── icons/
│
└── types/                        # Global TypeScript types
    └── index.ts
```

## Key Principles

### 1. Route Groups
- `(auth)` - Authentication pages without sidebar
- `(dashboard)` - Dashboard pages with sidebar layout

### 2. Component Organization
- **ui/** - Only shadcn components (auto-generated)
- **layout/** - Layout-specific components (sidebar, header)
- **shared/** - Reusable components across features
- **modules/[feature]/components/** - Feature-specific components

### 3. Business Logic in Modules
- Each feature has its own module folder
- Modules contain: components, hooks, services, types
- Keeps code organized and scalable

### 4. API Client
- Centralized in `lib/api-client.ts`
- All API calls go through this client
- Handles authentication, error handling, base URL

### 5. Server vs Client Components
- Default to Server Components
- Use `"use client"` only when needed:
  - Event handlers
  - React hooks
  - Browser APIs

## Future Scalability

When adding new features (funding, mentorship):

1. Create route: `app/(dashboard)/[feature]/page.tsx`
2. Create module: `modules/[feature]/`
3. Add components, hooks, services in the module
4. Update sidebar navigation

This structure supports:
- Easy feature addition
- Clear separation of concerns
- Modular architecture
- Future microservices extraction
