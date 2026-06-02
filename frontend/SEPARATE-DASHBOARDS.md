# Separate Staff and Admin Dashboards

## Overview
Created separate, role-specific dashboards for staff and admin users with distinct features and metrics.

## Implementation

### 1. **Main Dashboard Page** (`/dashboard`)
- **Purpose**: Router/redirector based on user role
- **Behavior**:
  - Admin → redirects to `/dashboard/admin`
  - Staff → redirects to `/dashboard/staff`
  - Applicant → redirects to `/applications`
- **Implementation**: Client-side redirect using `useRouter`

### 2. **Staff Dashboard** (`/dashboard/staff`)
**Focus**: Application review workflow

**Features**:
- **Stats Cards**:
  - Pending Review (applications awaiting review)
  - My Reviews (total reviewed by this staff member)
  - Approved (total approved applications)
  - Rejected (total rejected applications)

- **Pending Applications Section**:
  - List of applications awaiting review
  - Shows startup name, description, submitter
  - Time since submission
  - Quick status badges

- **My Recent Reviews Section**:
  - Applications recently reviewed by this staff member
  - Shows approval/rejection status
  - Review timestamp

**Use Case**: Staff members focus on reviewing applications efficiently

### 3. **Admin Dashboard** (`/dashboard/admin`)
**Focus**: System-wide overview and management

**Features**:
- **Application Statistics**:
  - Total Applications
  - Pending Review
  - Approved
  - Rejected

- **User Statistics**:
  - Total Users
  - Applicants (startup owners)
  - Staff (review staff)
  - Admins (system administrators)

- **Recent Applications Section**:
  - Latest application submissions across all staff
  - Status overview

- **Recent User Activity Section**:
  - New user registrations
  - Role updates
  - User activity timeline

- **System Health Section**:
  - API Status
  - Response Time
  - Active Users
  - Performance metrics

**Use Case**: Admins monitor overall system health and manage users

### 4. **Updated Sidebar Navigation**
- **Users** navigation item now visible in sidebar for admin role
- Role-based filtering ensures proper access control

## File Structure

```
frontend/
└── app/
    └── (dashboard)/
        ├── dashboard/
        │   ├── page.tsx              # Router (redirects by role)
        │   ├── staff/
        │   │   └── page.tsx          # Staff-specific dashboard
        │   └── admin/
        │       └── page.tsx          # Admin-specific dashboard
        ├── applications/
        │   └── page.tsx              # Shared applications view
        └── users/
            └── page.tsx              # Admin-only user management
```

## Key Differences

### Staff Dashboard
- ✅ Focus on **personal workflow**
- ✅ Shows **pending applications** needing review
- ✅ Tracks **personal review history**
- ✅ Action-oriented (review applications)
- ❌ No user management
- ❌ No system-wide metrics

### Admin Dashboard
- ✅ Focus on **system overview**
- ✅ Shows **all applications** across staff
- ✅ Displays **user statistics** and management
- ✅ Shows **system health** metrics
- ✅ Monitors **user activity**
- ✅ Strategic oversight

## Navigation Flow

```
User logs in
    ↓
Role check
    ↓
    ├─→ Admin → /dashboard → /dashboard/admin
    ├─→ Staff → /dashboard → /dashboard/staff
    └─→ Applicant → /dashboard → /applications
```

## Sidebar Navigation by Role

### Applicant
- Applications (own applications only)

### Staff
- Dashboard → `/dashboard/staff`
- Applications (all applications)

### Admin
- Dashboard → `/dashboard/admin`
- Applications (all applications)
- Users (user management)

## Components Used

All dashboards use shadcn/ui components:
- `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardDescription`
- `Badge` (with variants for status)
- Lucide icons: `FileText`, `Clock`, `CheckCircle`, `XCircle`, `Users`, `TrendingUp`, `Activity`

## TODO: API Integration

### Staff Dashboard
```typescript
// Fetch staff-specific data
GET /api/applications?status=pending
GET /api/applications?reviewedBy={staffId}
GET /api/applications/stats/staff/{staffId}
```

### Admin Dashboard
```typescript
// Fetch system-wide data
GET /api/applications/stats
GET /api/users/stats
GET /api/system/health
GET /api/activity/recent
```

## Benefits

1. **Role-Specific UX**: Each role sees relevant information
2. **Reduced Clutter**: Staff don't see admin features
3. **Better Performance**: Load only necessary data per role
4. **Scalability**: Easy to add role-specific features
5. **Security**: Clear separation of concerns

## Testing Checklist

- [ ] Admin redirects to `/dashboard/admin`
- [ ] Staff redirects to `/dashboard/staff`
- [ ] Applicant redirects to `/applications`
- [ ] Staff dashboard shows pending applications
- [ ] Admin dashboard shows user statistics
- [ ] Users navigation only visible to admin
- [ ] All stats cards display correctly
- [ ] Recent activity sections populate
- [ ] System health metrics display (admin only)

## Notes

- Redirect logic uses client-side routing for instant navigation
- Mock data clearly marked with TODO comments
- Ready for API integration
- Each dashboard optimized for its role's workflow
- Consistent shadcn/ui design across all dashboards
