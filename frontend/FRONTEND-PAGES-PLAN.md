# Frontend Pages Plan - Complete System

## Overview
This document outlines all necessary frontend pages for a complete Startup Support System, organized by user role and functionality.

---

## Current Status

### ✅ Implemented Pages

#### Public Pages
- ✅ `/` - Landing page
- ✅ `/login` - Login page
- ✅ `/register` - Registration page

#### Admin Dashboard
- ✅ `/dashboard/admin` - Admin dashboard overview
- ✅ `/dashboard/admin/applications` - All applications list
- ✅ `/dashboard/admin/applications/[id]` - Application detail view
- ✅ `/dashboard/admin/users` - User management page

#### Staff Dashboard
- ✅ `/dashboard/staff` - Staff dashboard overview
- ✅ `/dashboard/staff/applications` - Applications list for review
- ✅ `/dashboard/staff/applications/[id]` - Application detail view

---

## 🔴 Missing Critical Pages

### Applicant Dashboard (HIGH PRIORITY)
**Status:** Missing entirely

Required pages:
1. `/dashboard/applicant` - Applicant dashboard overview
   - Show application statistics
   - Quick actions (submit new application)
   - Recent applications status

2. `/dashboard/applicant/applications` - My applications list
   - View all submitted applications
   - Filter by status (pending, approved, rejected)
   - Search functionality

3. `/dashboard/applicant/applications/new` - Submit new application
   - Form to create startup application
   - Fields: startupName, description, problemStatement, solution, targetMarket
   - Validation and error handling

4. `/dashboard/applicant/applications/[id]` - View application details
   - Read-only view of submitted application
   - Status tracking
   - Reviewer information (if reviewed)

5. `/dashboard/applicant/profile` - User profile
   - View/edit profile information
   - Change password (future)

---

## 📋 Complete Page Inventory by Role

### 1. Public Pages (Unauthenticated)

| Page | Path | Status | Priority | Description |
|------|------|--------|----------|-------------|
| Landing | `/` | ✅ Exists | - | Homepage with system overview |
| Login | `/login` | ✅ Exists | - | User authentication |
| Register | `/register` | ✅ Exists | - | New user registration |
| About | `/about` | ❌ Missing | LOW | System information |
| Contact | `/contact` | ❌ Missing | LOW | Contact form |
| FAQ | `/faq` | ❌ Missing | LOW | Frequently asked questions |
| Terms | `/terms` | ❌ Missing | MEDIUM | Terms of service |
| Privacy | `/privacy` | ❌ Missing | MEDIUM | Privacy policy |

---

### 2. Applicant Pages (Role: applicant)

| Page | Path | Status | Priority | Description |
|------|------|--------|----------|-------------|
| Dashboard | `/dashboard/applicant` | ❌ Missing | **HIGH** | Overview with stats |
| Applications List | `/dashboard/applicant/applications` | ❌ Missing | **HIGH** | View all my applications |
| New Application | `/dashboard/applicant/applications/new` | ❌ Missing | **HIGH** | Submit new application |
| Application Detail | `/dashboard/applicant/applications/[id]` | ❌ Missing | **HIGH** | View application details |
| Edit Application | `/dashboard/applicant/applications/[id]/edit` | ❌ Missing | MEDIUM | Edit pending application |
| Profile | `/dashboard/applicant/profile` | ❌ Missing | MEDIUM | View/edit profile |
| Settings | `/dashboard/applicant/settings` | ❌ Missing | LOW | Account settings |
| Notifications | `/dashboard/applicant/notifications` | ❌ Missing | LOW | Application status updates |

---

### 3. Staff Pages (Role: staff)

| Page | Path | Status | Priority | Description |
|------|------|--------|----------|-------------|
| Dashboard | `/dashboard/staff` | ✅ Exists | - | Overview with review stats |
| Applications List | `/dashboard/staff/applications` | ✅ Exists | - | All applications for review |
| Application Detail | `/dashboard/staff/applications/[id]` | ✅ Exists | - | Review application & update status |
| Profile | `/dashboard/staff/profile` | ❌ Missing | MEDIUM | View/edit profile |
| Settings | `/dashboard/staff/settings` | ❌ Missing | LOW | Account settings |
| Reports | `/dashboard/staff/reports` | ❌ Missing | LOW | Application statistics |

---

### 4. Admin Pages (Role: admin)

| Page | Path | Status | Priority | Description |
|------|------|--------|----------|-------------|
| Dashboard | `/dashboard/admin` | ✅ Exists | - | System overview with metrics |
| Applications List | `/dashboard/admin/applications` | ✅ Exists | - | All applications management |
| Application Detail | `/dashboard/admin/applications/[id]` | ✅ Exists | - | View/manage application |
| Users List | `/dashboard/admin/users` | ✅ Exists | - | User management |
| User Detail | `/dashboard/admin/users/[id]` | ❌ Missing | MEDIUM | View user details & activity |
| Create User | `/dashboard/admin/users/new` | ❌ Missing | LOW | Manually create user |
| System Settings | `/dashboard/admin/settings` | ❌ Missing | MEDIUM | System configuration |
| Audit Logs | `/dashboard/admin/logs` | ❌ Missing | LOW | System activity logs |
| Reports | `/dashboard/admin/reports` | ❌ Missing | MEDIUM | Analytics & reports |
| Profile | `/dashboard/admin/profile` | ❌ Missing | MEDIUM | View/edit profile |

---

## 🎯 Implementation Priority

### Phase 1: Critical (Must Have) - **IMMEDIATE**
These pages are essential for basic system functionality:

1. **Applicant Dashboard** (`/dashboard/applicant`)
2. **Applicant Applications List** (`/dashboard/applicant/applications`)
3. **New Application Form** (`/dashboard/applicant/applications/new`)
4. **Applicant Application Detail** (`/dashboard/applicant/applications/[id]`)

**Rationale:** Without these pages, applicants cannot use the system at all. This is the core user journey.

---

### Phase 2: Important (Should Have) - **NEXT SPRINT**
These pages improve usability and completeness:

5. **Applicant Profile** (`/dashboard/applicant/profile`)
6. **Staff Profile** (`/dashboard/staff/profile`)
7. **Admin Profile** (`/dashboard/admin/profile`)
8. **Edit Application** (`/dashboard/applicant/applications/[id]/edit`)
9. **Admin System Settings** (`/dashboard/admin/settings`)
10. **Terms of Service** (`/terms`)
11. **Privacy Policy** (`/privacy`)

---

### Phase 3: Nice to Have (Could Have) - **FUTURE**
These pages enhance the experience but aren't critical:

12. **User Detail Page** (`/dashboard/admin/users/[id]`)
13. **Reports & Analytics** (all roles)
14. **Notifications** (`/dashboard/applicant/notifications`)
15. **Settings Pages** (all roles)
16. **About/Contact/FAQ** pages
17. **Audit Logs** (`/dashboard/admin/logs`)
18. **Create User** (`/dashboard/admin/users/new`)

---

## 📐 Page Structure Recommendations

### Applicant Dashboard Layout
```
/dashboard/applicant/
├── page.tsx                    # Dashboard overview
├── applications/
│   ├── page.tsx               # Applications list
│   ├── new/
│   │   └── page.tsx          # New application form
│   └── [id]/
│       ├── page.tsx          # Application detail
│       └── edit/
│           └── page.tsx      # Edit application
├── profile/
│   └── page.tsx              # User profile
├── settings/
│   └── page.tsx              # Account settings
└── notifications/
    └── page.tsx              # Notifications
```

---

## 🔄 Routing & Navigation Updates Needed

### Sidebar Navigation (app-sidebar.tsx)
Currently missing applicant navigation. Need to add:

```typescript
// For applicant role
if (role === "applicant") {
  return [
    { 
      title: "Dashboard", 
      url: "/dashboard/applicant", 
      icon: LayoutDashboard, 
    },
    { 
      title: "My Applications", 
      url: "/dashboard/applicant/applications", 
      icon: FileText, 
    },
    { 
      title: "New Application", 
      url: "/dashboard/applicant/applications/new", 
      icon: PlusCircle, 
    },
    { 
      title: "Profile", 
      url: "/dashboard/applicant/profile", 
      icon: User, 
    },
  ];
}
```

### Dashboard Redirect Logic
Update `/dashboard/page.tsx` to handle applicant role:

```typescript
if (userRole === "applicant") {
  redirect("/dashboard/applicant");
}
```

---

## 🎨 Component Requirements

### Shared Components Needed
1. **ApplicationCard** - Display application summary
2. **ApplicationForm** - Reusable form for create/edit
3. **StatusBadge** - Display application status with colors
4. **ApplicationFilters** - Filter by status, date, etc.
5. **EmptyState** - Show when no applications exist
6. **LoadingState** - Loading skeleton for async data
7. **ErrorState** - Error handling UI
8. **ConfirmDialog** - Confirmation for destructive actions

### Page-Specific Components
1. **DashboardStats** - Statistics cards for dashboard
2. **ApplicationTimeline** - Show application status history
3. **ReviewerInfo** - Display reviewer details
4. **ApplicationFormFields** - Form fields with validation

---

## 🔐 Access Control Matrix

| Page | Applicant | Staff | Admin |
|------|-----------|-------|-------|
| Landing | ✅ | ✅ | ✅ |
| Login/Register | ✅ | ✅ | ✅ |
| `/dashboard/applicant/*` | ✅ | ❌ | ✅ |
| `/dashboard/staff/*` | ❌ | ✅ | ✅ |
| `/dashboard/admin/*` | ❌ | ❌ | ✅ |

**Note:** Admin has access to all dashboards for testing/support purposes.

---

## 📊 Data Requirements

### API Endpoints Needed (Already Implemented in Backend)
- ✅ `POST /api/auth/register` - User registration
- ✅ `POST /api/auth/login` - User login
- ✅ `POST /api/auth/logout` - User logout
- ✅ `GET /api/users/profile` - Get user profile
- ✅ `PATCH /api/users/profile` - Update profile
- ✅ `POST /api/applications` - Create application (applicant only)
- ✅ `GET /api/applications` - Get all applications (staff/admin)
- ✅ `GET /api/applications/my` - Get my applications (applicant)
- ✅ `GET /api/applications/:id` - Get application by ID
- ✅ `PATCH /api/applications/:id/status` - Update status (staff/admin)

---

## 🧪 Testing Checklist

### Per Page Testing
- [ ] Page renders without errors
- [ ] Authentication required (protected routes)
- [ ] Role-based access control works
- [ ] Data fetching and loading states
- [ ] Error handling and error states
- [ ] Form validation (if applicable)
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Accessibility (keyboard navigation, screen readers)

---

## 📝 Next Steps

### Immediate Actions (This Sprint)
1. Create applicant dashboard directory structure
2. Implement `/dashboard/applicant` overview page
3. Implement `/dashboard/applicant/applications` list page
4. Implement `/dashboard/applicant/applications/new` form page
5. Implement `/dashboard/applicant/applications/[id]` detail page
6. Update sidebar navigation to include applicant links
7. Update dashboard redirect logic for applicant role
8. Create shared components (ApplicationCard, ApplicationForm, etc.)
9. Add applicant role testing data
10. Test complete applicant user journey

### Future Enhancements
- Profile pages for all roles
- Settings pages
- Notifications system
- Reports and analytics
- Audit logs
- Legal pages (terms, privacy)

---

## 📚 Related Documentation
- Backend API: `backend/README.md`
- API Documentation: `http://localhost:5000/api/docs` (Swagger)
- Frontend Structure: `context/frontend-structure.md`
- Requirements: `.kiro/specs/startup-backend-system/requirements.md`
