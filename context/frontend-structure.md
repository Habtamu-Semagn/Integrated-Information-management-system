# Frontend Structure (Next.js + App Router + shadcn)

## Framework

- Next.js (App Router)
- TypeScript (recommended)
- Tailwind CSS
- shadcn/ui

---

## Folder Structure

app/
  (auth)/
    login/
      page.tsx
    register/
      page.tsx

  (dashboard)/
    layout.tsx        ← Sidebar layout (IMPORTANT)
    
    applications/
      page.tsx
      [id]/
        page.tsx

    funding/          (future)
    mentorship/       (future)

  api/                (optional - if using Next API routes)

components/
  ui/                 ← shadcn components
  shared/
  layout/
    sidebar.tsx
    header.tsx

modules/
  applications/
    components/
    hooks/
    services/

  auth/
    components/
    services/

lib/
  utils.ts
  api-client.ts

---

## Key Rules

- Use App Router (NOT pages router)
- Use route groups (e.g., (dashboard))
- Use layout.tsx for shared UI like sidebar
- Keep business logic in modules/