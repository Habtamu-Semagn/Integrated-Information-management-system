# Constants Module

This module contains constant definitions used throughout the application for type safety and consistency.

## Files

### `roles.constant.js`

Defines user role constants for role-based access control (RBAC).

**Exports:**
- `USER_ROLES` - Object containing all role constants
  - `APPLICANT`: 'applicant' - Default role for new users who can submit applications
  - `STAFF`: 'staff' - Role for government staff who can review applications
  - `ADMIN`: 'admin' - Role for administrators with full system access
- `VALID_ROLES` - Array of all valid role strings
- `DEFAULT_ROLE` - Default role assigned during user registration ('applicant')

**Usage:**
```javascript
const { USER_ROLES, VALID_ROLES, DEFAULT_ROLE } = require('./constants/roles.constant');

// Check if a role is valid
if (VALID_ROLES.includes(userRole)) {
  // Role is valid
}

// Use role constants
if (user.role === USER_ROLES.APPLICANT) {
  // User is an applicant
}

// Set default role during registration
const newUser = {
  name: 'John Doe',
  email: 'john@example.com',
  role: DEFAULT_ROLE
};
```

**Requirements:** 1.1, 4.1, 5.1

---

### `status.constant.js`

Defines application status constants for tracking application lifecycle.

**Exports:**
- `APPLICATION_STATUS` - Object containing all status constants
  - `PENDING`: 'pending' - Initial status for new applications
  - `APPROVED`: 'approved' - Status when application is approved by staff
  - `REJECTED`: 'rejected' - Status when application is rejected by staff
- `VALID_STATUSES` - Array of all valid status strings
- `DEFAULT_STATUS` - Default status for new applications ('pending')

**Usage:**
```javascript
const { APPLICATION_STATUS, VALID_STATUSES, DEFAULT_STATUS } = require('./constants/status.constant');

// Check if a status is valid
if (VALID_STATUSES.includes(newStatus)) {
  // Status is valid
}

// Use status constants
if (application.status === APPLICATION_STATUS.PENDING) {
  // Application is pending review
}

// Set default status during application creation
const newApplication = {
  startupName: 'My Startup',
  status: DEFAULT_STATUS,
  // ... other fields
};
```

**Requirements:** 5.1, 7.4

---

## Design Principles

1. **Type Safety**: Using constants prevents typos and provides autocomplete support
2. **Single Source of Truth**: All role and status values are defined in one place
3. **Validation Support**: `VALID_ROLES` and `VALID_STATUSES` arrays enable easy validation
4. **Consistency**: Ensures the same values are used across models, services, and controllers
5. **Maintainability**: Changes to roles or statuses only need to be made in one location

## Testing

Both constants modules have comprehensive unit tests:
- `roles.constant.test.js` - Tests for user role constants
- `status.constant.test.js` - Tests for application status constants

Run tests:
```bash
npm test -- src/common/constants/
```

## Integration with Other Modules

These constants are used by:
- **User Model**: Validates role field against `VALID_ROLES`
- **Application Model**: Validates status field against `VALID_STATUSES`
- **Auth Service**: Sets `DEFAULT_ROLE` during user registration
- **Application Service**: Sets `DEFAULT_STATUS` during application creation
- **Authorization Middleware**: Checks user roles against `USER_ROLES`
- **Validation Schemas**: Uses constants for enum validation
