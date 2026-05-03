# UI System (STRICT - Next.js + shadcn)

## Core Stack

- Next.js (App Router)
- shadcn/ui (PRIMARY UI SYSTEM)
- Tailwind (ONLY for layout)

---

## Absolute Rule

DO NOT build UI manually if shadcn provides it.

---

## Required Usage

### Layout

- Sidebar → built using shadcn patterns
- Dashboard → composed using Card, Table, etc.

Sidebar MUST be in:
components/layout/sidebar.tsx

Used in:
app/(dashboard)/layout.tsx

---

### Components (MANDATORY)

Use shadcn for:

- Button
- Input
- Form
- Card
- Table
- Dialog
- DropdownMenu
- Tabs
- Badge
- Alert

---

## Tailwind Usage

Allowed:
- flex, grid
- spacing
- responsive layout

NOT allowed:
- custom buttons
- custom forms
- recreating UI components

---

## Theming

- Use shadcn theme system
- Enable dark mode (optional)

---

## Composition Rule

Instead of building UI:
→ Compose from shadcn components

Example:
Dashboard = Card + Table + Badge

---

## AI Enforcement Rule

When generating UI:

1. Check shadcn first
2. Use existing component
3. Only fallback to Tailwind for layout