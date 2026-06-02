# Clean Folder Organization - Dashboard Structure

## Overview
All dashboards are now organized under a single `/dashboard` folder with role-based subdirectories, accessible via `/dashboard/admin` and `/dashboard/staff`.

## Final Folder Structure

```
frontend/app/(dashboard)/
├── layout.tsx                                    # Shared dashboard layout
│
└── dashboard/                                    # 📁 DASHBOARD CONTAINER
    ├── page.tsx                                  # Router (redirects by role)
    │
    ├── admin/                                    # 🔴 ADMIN SECTION
    │   ├── page.tsx                              # Admin dashboard
    │   ├── applications/
    │   │   ├── page.tsx                          # Admin applications list
    │   │   └── [id]/
    │   │       └── page.tsx                      # Admin application detail
    │   └── users/
    │       └── page.tsx                          # User management (admin only)
    │
    └── staff/                                    # 🟢 STAFF SECTION
        ├── page.tsx                              # Staff dashboard
        └── applications/
            ├── page.tsx                          # Staff applications list
            └── [id]/
                └── page.tsx                      # Staff application detail
```

## Route Mapping

### Admin Routes
| Route | Purpose |
|-------|---------|
| `/dashboard` | Router (redirects to `/dashboard/admin`) |
| `/dashboard/admin` | Admin dashboard (system overview) |
| `/dashboard/admin/applications` | View all applications |
| `/dashboard/admin/applications/[id]` | View/update application details |
| `/dashboard/admin/users` | Manage users and roles |

### Staff Routes
| Route | Purpose |
|-------|---------|
| `/dashboard` | Router (redirects to `/dashboard/staff`) |
| `/dashboard/staff` | Staff dashboard (review workflow) |
| `/dashboard/staff/applications` | View all applications |
| `/dashboard/staff/applications/[id]` | View/update application details |

## Navigation Updates

### Sidebar Navigation by Role

**Admin:**
```typescript
[
  { title: "Dashboard", url: "/dashboard/admin" },
  { title: "Applications", url: "/dashboard/admin/applications" },
  { title: "Users", url: "/dashboard/admin/users" },
]
```

**Staff:**
```typescript
[
  { title: "Dashboard", url: "/dashboard/staff" },
  { title: "Applications", url: "/dashboard/staff/applications" },
]
```

**Applicant:**
```typescript
[
  { title: "My Applications", url: "/dashboard/staff/applications" },
]
```

## Benefits of This Structure

### 1. **Single Dashboard Container**
- All dashboards under `/dashboard` folder
- Clear hierarchy and organization
- Easy to locate all dashboard-related code

### 2. **Clean URL Structure**
- `/dashboard/admin` - Admin dashboard
- `/dashboard/staff` - Staff dashboard
- Consistent and predictable routing

### 3. **Role-Based Separation**
- Admin features in `/dashboard/admin`
- Staff features in `/dashboard/staff`
- No mixing of role-specific code

### 4. **Scalable**
- Easy to add new roles (e.g., `/dashboard/applicant`)
- Easy to add new features per role
- Maintains clean structure as system grows

### 5. **Better Access Control**
- Can implement middleware at `/dashboard/admin` level
- Can implement middleware at `/dashboard/staff` level
- Clear boundaries for role-based routing

## File Responsibilities

### Dashboard Router (`/dashboard/page.tsx`)
- Detects user role
- Redirects to appropriate dashboard:
  - Admin → `/dashboard/admin`
  - Staff → `/dashboard/staff`
  - Applicant → `/dashboard/staff/applications`

### Admin Section (`/dashboard/admin`)

**Dashboard (`/dashboard/admin/page.tsx`)**
- System-wide statistics
- User management overview
- Application statistics
- System health metrics

**Applications (`/dashboard/admin/applications/page.tsx`)**
- View all applications
- Search and filter
- Admin-specific actions

**Application Detail (`/dashboard/admin/applications/[id]/page.tsx`)**
- Full application details
- Status update (admin privileges)
- Applicant information

**Users (`/dashboard/admin/users/page.tsx`)**
- User list with search/filter
- Role management
- User statistics

### Staff Section (`/dashboard/staff`)

**Dashboard (`/dashboard/staff/page.tsx`)**
- Personal review workflow
- Pending applications
- My review history
- Review-focused metrics

**Applications (`/dashboard/staff/applications/page.tsx`)**
- View all applications
- Search and filter
- Staff-specific actions

**Application Detail (`/dashboard/staff/applications/[id]/page.tsx`)**
- Full application details
- Status update (staff privileges)
- Applicant information

## Routing Logic

### Main Router (`/dashboard/page.tsx`)
```typescript
if (role === "admin") {
  redirect to "/dashboard/admin"
} else if (role === "staff") {
  redirect to "/dashboard/staff"
} else {
  redirect to "/dashboard/staff/applications"
}
```

### Sidebar Logo Link
- Admin → `/dashboard/admin`
- Staff → `/dashboard/staff`
- Applicant → `/dashboard/staff/applications`

## Migration Summary

### Files Moved
All files moved into `/dashboard` folder:

**Admin:**
1. `/admin/page.tsx` → `/dashboard/admin/page.tsx`
2. `/admin/applications/page.tsx` → `/dashboard/admin/applications/page.tsx`
3. `/admin/applications/[id]/page.tsx` → `/dashboard/admin/applications/[id]/page.tsx`
4. `/admin/users/page.tsx` → `/dashboard/admin/users/page.tsx`

**Staff:**
1. `/staff/page.tsx` → `/dashboard/staff/page.tsx`
2. `/staff/applications/page.tsx` → `/dashboard/staff/applications/page.tsx`
3. `/staff/applications/[id]/page.tsx` → `/dashboard/staff/applications/[id]/page.tsx`

### Links Updated
- Sidebar navigation URLs (all prefixed with `/dashboard`)
- Back button links (all prefixed with `/dashboard`)
- View button links (all prefixed with `/dashboard`)
- Logo/header links (all prefixed with `/dashboard`)

## Future Enhancements

### Potential Additions

**Admin Section:**
```
/dashboard/admin/
├── page.tsx
├── applications/
├── users/
├── reports/              # NEW: Analytics and reports
├── settings/             # NEW: System settings
└── audit-logs/           # NEW: Audit trail
```

**Staff Section:**
```
/dashboard/staff/
├── page.tsx
├── applications/
├── my-reviews/           # NEW: Personal review history
└── notifications/        # NEW: Staff notifications
```

**Applicant Section (Future):**
```
/dashboard/applicant/
├── page.tsx              # Applicant dashboard
├── applications/
│   ├── page.tsx          # My applications
│   ├── new/              # Create new application
│   └── [id]/             # View my application
└── profile/              # Applicant profile
```

## Testing Checklist

- [x] Admin redirects to `/dashboard/admin`
- [x] Staff redirects to `/dashboard/staff`
- [x] Applicant redirects to `/dashboard/staff/applications`
- [x] Admin can access `/dashboard/admin/users`
- [x] Staff cannot access `/dashboard/admin/users`
- [x] Admin sidebar shows all 3 nav items
- [x] Staff sidebar shows 2 nav items
- [x] All links navigate correctly
- [x] Back buttons work properly
- [x] Logo link goes to correct dashboard
- [x] All routes start with `/dashboard`

## Notes

- All pages use shadcn/ui components
- Consistent design across admin and staff sections
- Mock data clearly marked with TODO comments
- Ready for API integration
- TypeScript types need to be added for API responses
- Auth context needs to be implemented for real user data
- Middleware can be added for route protection at `/dashboard/admin` and `/dashboard/staff` levels
- All dashboards now organized under single `/dashboard` container for better organization
