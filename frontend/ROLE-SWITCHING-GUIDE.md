# Role Switching Guide for Testing

Since authentication is not yet implemented, you can manually switch between user roles using localStorage.

## How to Switch Roles

### Method 1: Browser Console (Recommended)

1. Open your browser's Developer Tools:
   - **Chrome/Edge**: Press `F12` or `Ctrl+Shift+I` (Windows/Linux) / `Cmd+Option+I` (Mac)
   - **Firefox**: Press `F12` or `Ctrl+Shift+K` (Windows/Linux) / `Cmd+Option+K` (Mac)

2. Go to the **Console** tab

3. Run one of these commands:

```javascript
// Switch to Applicant
localStorage.setItem('userRole', 'applicant')
location.reload()

// Switch to Staff
localStorage.setItem('userRole', 'staff')
location.reload()

// Switch to Admin
localStorage.setItem('userRole', 'admin')
location.reload()
```

### Method 2: Create a Role Switcher Component (Optional)

You can add a temporary role switcher button in development. Add this to your header or anywhere convenient:

```typescript
// Temporary Role Switcher (Development Only)
const RoleSwitcher = () => {
  const switchRole = (role: string) => {
    localStorage.setItem('userRole', role);
    window.location.reload();
  };

  return (
    <div className="flex gap-2">
      <button onClick={() => switchRole('applicant')}>Applicant</button>
      <button onClick={() => switchRole('staff')}>Staff</button>
      <button onClick={() => switchRole('admin')}>Admin</button>
    </div>
  );
};
```

## What Each Role Shows

### Applicant Role
**Sidebar Navigation:**
- Dashboard → `/dashboard/applicant`
- My Applications → `/dashboard/applicant/applications`
- New Application → `/dashboard/applicant/applications/new`
- Profile → `/dashboard/applicant/profile`

**User Info:**
- Name: John Doe (mock data)
- Email: john.doe@example.com
- Role Badge: Applicant (blue)

### Staff Role
**Sidebar Navigation:**
- Dashboard → `/dashboard/staff`
- Applications → `/dashboard/staff/applications`

**User Info:**
- Name: Staff Member (mock data)
- Email: staff@startup.gov
- Role Badge: Staff (purple)

### Admin Role
**Sidebar Navigation:**
- Dashboard → `/dashboard/admin`
- Applications → `/dashboard/admin/applications`
- Users → `/dashboard/admin/users`

**User Info:**
- Name: Admin User (mock data)
- Email: admin@startup.gov
- Role Badge: Admin (red)

## Current Default

If no role is set in localStorage, the system defaults to **"admin"** role.

## Checking Current Role

To see what role is currently set:

```javascript
console.log(localStorage.getItem('userRole'))
```

## Clearing Role (Reset to Default)

```javascript
localStorage.removeItem('userRole')
location.reload()
```

This will reset to the default "admin" role.

## Testing Checklist

### Applicant Dashboard Testing
1. Set role to "applicant"
2. Navigate to `/dashboard` - should redirect to `/dashboard/applicant`
3. Check sidebar shows: Dashboard, My Applications, New Application, Profile
4. Test all navigation links
5. Verify responsive design on mobile/tablet

### Staff Dashboard Testing
1. Set role to "staff"
2. Navigate to `/dashboard` - should redirect to `/dashboard/staff`
3. Check sidebar shows: Dashboard, Applications
4. Test all navigation links

### Admin Dashboard Testing
1. Set role to "admin"
2. Navigate to `/dashboard` - should redirect to `/dashboard/admin`
3. Check sidebar shows: Dashboard, Applications, Users
4. Test all navigation links

## Notes

- Role switching requires a page refresh to take effect
- The role is stored in browser localStorage
- Each browser/device has its own localStorage
- Clearing browser data will reset the role
- This is temporary - will be replaced with proper authentication

## Troubleshooting

**Problem:** Sidebar still shows wrong role after switching
**Solution:** 
1. Clear browser cache
2. Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
3. Check console for the current role: `localStorage.getItem('userRole')`

**Problem:** Page doesn't redirect correctly
**Solution:**
1. Manually navigate to the correct dashboard URL
2. Check that the role is set correctly in localStorage
3. Refresh the page

**Problem:** Navigation links don't work
**Solution:**
1. Check browser console for errors
2. Verify you're on the correct dashboard for your role
3. Try switching roles and back again
