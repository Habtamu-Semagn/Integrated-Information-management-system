# MongoDB User Roles Check Report

## Issue Found ⚠️

**John Applicant's role is stored as `staff` instead of `applicant`**

### Details:
- **Name:** John Applicant
- **Email:** john@example.com
- **Stored Role:** `staff` ❌
- **Expected Role:** `applicant` ✓
- **Role Type:** string
- **Created:** 2026-05-03 04:08:23
- **Updated:** 2026-05-03 09:38:33

---

## All Users in Database

| Name | Email | Role | Created |
|------|-------|------|---------|
| Admin User | admin@startup.gov | **admin** | 2026-05-03 |
| Staff Member | staff@startup.gov | **staff** | 2026-05-03 |
| **John Applicant** | john@example.com | **staff** ❌ | 2026-05-03 |
| Jane Entrepreneur | jane@example.com | applicant | 2026-05-03 |
| Habtamu Semagnn | habtamusemagn1@gmail.com | applicant | 2026-05-03 |
| semagn birhan | semagn1@gmail.com | applicant | 2026-05-06 |

---

## Root Cause Analysis

### Seed Script Definition
In `Internship/backend/scripts/seed.js`, John Applicant is correctly defined with the applicant role:

```javascript
{
  name: 'John Applicant',
  email: 'john@example.com',
  password: 'Applicant123!',
  role: USER_ROLES.APPLICANT  // This should be 'applicant'
}
```

### User Model Schema
The User model in `Internship/backend/src/modules/users/user.model.js` has:

```javascript
role: {
  type: String,
  enum: {
    values: ['applicant', 'staff', 'admin'],
    message: 'Role must be one of: applicant, staff, admin'
  },
  default: 'applicant'
}
```

### Roles Constant
`Internship/backend/src/common/constants/roles.constant.js` defines:

```javascript
const USER_ROLES = {
  APPLICANT: 'applicant',
  STAFF: 'staff',
  ADMIN: 'admin'
};
```

---

## Conclusion

**The database has been manually altered.** The seed script is correct, but the John Applicant user's role in MongoDB has been changed from `applicant` to `staff` after initial seeding. This could happen through:

1. Direct database manipulation
2. An update operation via API
3. Manual edit in MongoDB

The value stored in the database is `staff` (lowercase string), which is valid according to the schema enum, but it doesn't match the intended seeded data.

---

## How to Fix

### Option 1: Reset Database with Fresh Seed
```bash
cd Internship/backend
npm run seed:fresh
```

### Option 2: Manual Fix via MongoDB
Query to see the exact stored value:
```javascript
db.users.findOne({ email: 'john@example.com' })
```

Update the role back to applicant:
```javascript
db.users.updateOne(
  { email: 'john@example.com' },
  { $set: { role: 'applicant' } }
)
```
