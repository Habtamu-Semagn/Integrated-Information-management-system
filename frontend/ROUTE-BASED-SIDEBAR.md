# Route-Based Sidebar Navigation

## Overview
The sidebar now automatically detects the user role based on the current URL path, eliminating the need for localStorage or manual role switching.

## How It Works

### Automatic Role Detection
The sidebar analyzes the current pathname and determines the role:

```typescript
const getRoleFromPath = (pathname: string): string => {
  if (pathname.startsWith('/dashboard/admin')) {
    return 'admin';
  } else if (pathname.startsWith('/dashboard/staff')) {
    return 'staff';
  } else if (pathname.startsWith('/dashboard/applicant')) {
    return 'applicant';
  }
  return 'admin'; // Default fallback
};
```

### Dynamic Navigation
Based on the detected role, the appropriate navigation items are displayed:

**Admin** (`/dashboard/admin/*`)
- Dashboard
- Applications
- Users

**Staff** (`/dashboard/staff/*`)
- Dashboard
- Applications

**Applicant** (`/dashboard/applicant/*`)
- Dashboard
- My Applications
- New Application
- Profile

### Dynamic User Info
The user information in the sidebar footer also updates based on the route:

- **Admin routes**: Shows "Admin User" (admin@startup.gov)
- **Staff routes**: Shows "Staff Member" (staff@startup.gov)
- **Applicant routes**: Shows "John Doe" (john.doe@example.com)

## Testing Different Dashboards

Simply navigate to the different dashboard URLs:

### Admin Dashboard
```
http://localhost:3000/dashboard/admin
```
- Sidebar shows: Dashboard, Applications, Users
- User shows: Admin User

### Staff Dashboard
```
http://localhost:3000/dashboard/staff
```
- Sidebar shows: Dashboard, Applications
- User shows: Staff Member

### Applicant Dashboard
```
http://localhost:3000/dashboard/applicant
```
- Sidebar shows: Dashboard, My Applications, New Application, Profile
- User shows: John Doe

## Benefits

### 1. **No Manual Configuration**
- No need to set localStorage
- No need to switch roles manually
- Just navigate to the URL

### 2. **Consistent Experience**
- Sidebar always matches the current dashboard
- No confusion about which role you're viewing
- Clear visual feedback

### 3. **URL-Driven**
- Can bookmark specific dashboards
- Can share URLs with specific roles
- Browser back/forward works correctly

### 4. **Easier Testing**
- Open multiple tabs with different roles
- No need to clear localStorage between tests
- Instant role switching via URL

## Implementation Details

### Files Modified
1. **`frontend/components/layout/app-sidebar.tsx`**
   - Removed localStorage dependency
   - Added `getRoleFromPath()` function
   - Added `getMockUserByRole()` function
   - Sidebar now uses `usePathname()` to detect role

2. **`frontend/app/(dashboard)/dashboard/page.tsx`**
   - Simplified to always redirect to admin dashboard
   - Removed localStorage logic

### Key Functions

#### getRoleFromPath()
Extracts the role from the current URL path.

```typescript
const getRoleFromPath = (pathname: string): string => {
  if (pathname.startsWith('/dashboard/admin')) return 'admin';
  if (pathname.startsWith('/dashboard/staff')) return 'staff';
  if (pathname.startsWith('/dashboard/applicant')) return 'applicant';
  return 'admin';
};
```

#### getMockUserByRole()
Returns appropriate mock user data based on role.

```typescript
const getMockUserByRole = (role: string) => {
  if (role === "admin") {
    return { name: "Admin User", email: "admin@startup.gov", role: "admin" };
  }
  // ... other roles
};
```

## Navigation Flow

### 1. User Navigates to Dashboard
```
User visits: /dashboard
↓
Redirects to: /dashboard/admin (default)
↓
Sidebar detects: pathname starts with '/dashboard/admin'
↓
Shows: Admin navigation
```

### 2. User Clicks Applicant Link
```
User visits: /dashboard/applicant
↓
Sidebar detects: pathname starts with '/dashboard/applicant'
↓
Shows: Applicant navigation
```

### 3. User Navigates Within Dashboard
```
User on: /dashboard/applicant/applications
↓
Sidebar detects: pathname starts with '/dashboard/applicant'
↓
Shows: Applicant navigation (consistent)
```

## Edge Cases Handled

### 1. Root Dashboard URL
- `/dashboard` → Redirects to `/dashboard/admin`
- Ensures users always land on a specific dashboard

### 2. Deep Links
- `/dashboard/applicant/applications/new` → Shows applicant sidebar
- Works at any depth within the dashboard

### 3. Invalid Routes
- Unknown routes default to admin sidebar
- Prevents broken navigation

## Future Authentication Integration

When real authentication is added, the flow will be:

```typescript
// Future implementation
const getRoleFromAuth = () => {
  const { user } = useAuth(); // From auth context
  return user?.role || 'applicant';
};

// Then redirect based on authenticated role
useEffect(() => {
  const role = getRoleFromAuth();
  router.push(`/dashboard/${role}`);
}, []);
```

The sidebar will continue to work the same way, but the initial redirect will be based on the authenticated user's actual role.

## Advantages Over localStorage Approach

| Feature | Route-Based | localStorage-Based |
|---------|-------------|-------------------|
| Setup Required | None | Manual role setting |
| Multi-Tab Testing | ✅ Easy | ❌ Conflicts |
| URL Sharing | ✅ Works | ❌ Doesn't work |
| Browser History | ✅ Works | ⚠️ Inconsistent |
| Bookmarking | ✅ Works | ❌ Doesn't work |
| Debugging | ✅ Clear from URL | ❌ Hidden in storage |
| Production Ready | ✅ Yes | ❌ Needs replacement |

## Testing Checklist

- [x] Navigate to `/dashboard/admin` → Shows admin sidebar
- [x] Navigate to `/dashboard/staff` → Shows staff sidebar
- [x] Navigate to `/dashboard/applicant` → Shows applicant sidebar
- [x] Click navigation links → Sidebar stays consistent
- [x] Deep links work → Sidebar matches route
- [x] User info updates → Matches current role
- [x] Multiple tabs → Each shows correct sidebar
- [x] Browser back/forward → Sidebar updates correctly

## Summary

The sidebar now intelligently detects the user role from the URL path, providing a seamless experience without any manual configuration. Simply navigate to the desired dashboard URL, and the sidebar automatically displays the appropriate navigation for that role.

**No localStorage needed. No manual switching. Just navigate!** 🎉
