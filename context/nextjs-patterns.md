# Next.js Patterns (App Router)

## Routing

- Use App Router (app/ directory)
- Use route groups: (dashboard), (auth)

---

## Layouts

Use layout.tsx for shared UI:

Example:
app/(dashboard)/layout.tsx

Contains:
- Sidebar
- Header
- Main content wrapper

---

## Server vs Client Components

Default: Server Components

Use "use client" ONLY when needed:
- hooks
- interactivity
- event handlers

---

## Data Fetching

- Use server components for fetching when possible
- Use client-side fetching for dynamic UI

---

## API Calls

- Use centralized API client (axios/fetch wrapper)
- Store in /lib/api-client.ts

---

## Forms

- Use shadcn Form + React Hook Form

---

## State

- Minimal global state
- Use local state or React Query (optional)

---

## Rule

Keep components small and modular.