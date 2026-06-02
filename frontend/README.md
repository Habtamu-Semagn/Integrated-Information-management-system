# Startup Support System - Frontend

Next.js frontend application for the Startup Support System.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **HTTP Client**: Axios
- **State Management**: React hooks + Context (minimal global state)

## Project Structure

See [STRUCTURE.md](./STRUCTURE.md) for detailed folder organization.

```
frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (login, register)
│   └── (dashboard)/       # Dashboard pages with sidebar
├── components/            # React components
│   ├── ui/               # shadcn components
│   ├── layout/           # Layout components (sidebar, header)
│   └── shared/           # Shared components
├── modules/              # Feature modules
│   ├── auth/            # Authentication module
│   └── applications/    # Applications module
└── lib/                 # Utilities and API client
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on http://localhost:5000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your API URL:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Features

### Current Features (Phase 1)

- ✅ User authentication (login/register)
- ✅ Application submission
- ✅ Application listing and filtering
- ✅ Application status management
- ✅ Role-based access control

### Future Features (Phase 2+)

- 🔄 Funding service
- 🔄 Mentorship program
- 🔄 Training programs
- 🔄 Notifications
- 🔄 Analytics dashboard

## Architecture Principles

### 1. Route Groups
- `(auth)` - Authentication pages without sidebar
- `(dashboard)` - Dashboard pages with sidebar layout

### 2. Component Organization
- **ui/** - shadcn components only
- **layout/** - Layout components (sidebar, header)
- **shared/** - Reusable components
- **modules/[feature]/components/** - Feature-specific components

### 3. Business Logic in Modules
- Each feature has its own module
- Modules contain: components, hooks, services, types
- Keeps code organized and scalable

### 4. API Client
- Centralized in `lib/api-client.ts`
- Handles authentication, errors, base URL
- Uses Axios with interceptors

### 5. Server vs Client Components
- Default to Server Components
- Use `"use client"` only when needed

## Adding New Features

To add a new feature (e.g., funding):

1. **Create route**:
   ```
   app/(dashboard)/funding/page.tsx
   ```

2. **Create module**:
   ```
   modules/funding/
     ├── components/
     ├── hooks/
     ├── services/
     └── types/
   ```

3. **Add to sidebar**:
   Update `components/layout/sidebar.tsx`

4. **Create service**:
   ```typescript
   // modules/funding/services/funding-service.ts
   export const fundingService = {
     async getAll() { ... },
     async create() { ... },
   };
   ```

## UI Components (shadcn)

### Installed Components

- Button
- (Add more as needed)

### Adding New Components

```bash
npx shadcn@latest add [component-name]
```

Example:
```bash
npx shadcn@latest add card
npx shadcn@latest add table
npx shadcn@latest add form
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:5000/api` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `Startup Support System` |

## API Integration

All API calls go through `lib/api-client.ts`:

```typescript
import { apiClient } from "@/lib/api-client";

// GET request
const response = await apiClient.get("/applications");

// POST request
const response = await apiClient.post("/applications", data);
```

The client automatically:
- Adds base URL
- Sends cookies (for JWT auth)
- Handles 401 errors (redirects to login)
- Sets Content-Type headers

## Code Style

- Use TypeScript for type safety
- Follow Next.js App Router conventions
- Use shadcn components (don't build custom UI)
- Keep components small and focused
- Use Tailwind for layout only
- Server components by default

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
