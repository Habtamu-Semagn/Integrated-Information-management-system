# Users Module

This module handles user data management, including the User model with secure password handling and validation.

## Files

### user.model.js

The Mongoose schema and model for user documents.

**Features:**
- Field validation (name, email, password, role)
- Automatic password hashing with bcrypt (10 salt rounds)
- Password exclusion from queries and responses
- Email uniqueness constraint
- Automatic timestamps (createdAt, updatedAt)
- Virtual `id` field mapping
- Data transformation (toJSON/toObject)

**Schema:**

```javascript
{
  name: String (required, 2-100 chars, trimmed)
  email: String (required, unique, valid format, lowercase, trimmed)
  password: String (required, min 8 chars, hashed, excluded by default)
  role: String (enum: ['applicant', 'staff', 'admin'], default: 'applicant')
  createdAt: Date (auto-generated)
  updatedAt: Date (auto-generated)
}
```

**Methods:**
- `comparePassword(candidatePassword)`: Compares plain text password with hashed password

**Usage:**

```javascript
const User = require('./user.model');

// Create a user
const user = await User.create({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'SecurePass123',
  role: 'applicant'
});

// Password is automatically hashed
// Response excludes password field
console.log(user.toJSON());
// {
//   id: '507f1f77bcf86cd799439011',
//   name: 'John Doe',
//   email: 'john@example.com',
//   role: 'applicant',
//   createdAt: '2024-01-15T10:30:00.000Z',
//   updatedAt: '2024-01-15T10:30:00.000Z'
// }

// Find user with password for authentication
const userWithPassword = await User.findOne({ email: 'john@example.com' })
  .select('+password');

// Verify password
const isMatch = await userWithPassword.comparePassword('SecurePass123');
console.log(isMatch); // true
```

### user.model.test.js

Comprehensive unit tests for the User model covering:
- Schema validation (39 test cases)
- Password hashing and comparison
- Data transformation
- Virtual fields
- Timestamps

**Running Tests:**

```bash
npm test -- user.model.test.js
```

**Note:** Tests require MongoDB Memory Server which needs network access to download MongoDB binaries on first run.

### user.model.example.js

Demonstration file showing all model features without requiring a database connection.

**Running Examples:**

```bash
node src/modules/users/user.model.example.js
```

## Requirements Validated

- ✅ 1.1: User registration with name, email, password
- ✅ 1.2: Password hashing with bcrypt (salt rounds: 10)
- ✅ 1.3: Email uniqueness constraint
- ✅ 1.4: Name validation (2-100 characters)
- ✅ 1.5: Password validation (minimum 8 characters)
- ✅ 1.6: Email format validation
- ✅ 1.7: Password excluded from responses
- ✅ 1.8: Automatic timestamps (createdAt, updatedAt)
- ✅ 9.1: Bcrypt password hashing with 10+ salt rounds
- ✅ 9.2: No plain text password storage
- ✅ 9.4: Password excluded from JSON output

## Security Features

1. **Password Security**
   - Automatic hashing before save using bcrypt with 10 salt rounds
   - Password excluded from queries by default (`select: false`)
   - Password never included in JSON/Object output
   - Secure password comparison method

2. **Data Validation**
   - Email format validation with regex
   - Email uniqueness enforced at database level
   - Name length constraints (2-100 characters)
   - Password minimum length (8 characters)
   - Role enum validation

3. **Data Transformation**
   - Sensitive fields (password) automatically excluded
   - Internal fields (__v, _id) excluded from responses
   - Virtual `id` field for consistent API responses
   - Email automatically converted to lowercase
   - Name and email automatically trimmed

## Next Steps

This model is ready to be used by:
- Auth module (for registration and login)
- Users module service layer (for profile management)
- Applications module (for user references)

## Notes

- The `unique: true` on email field creates a unique index automatically
- Password hashing only occurs when password is new or modified
- The `select: false` on password means it must be explicitly selected in queries
- All validation errors include descriptive messages
- The model follows Mongoose best practices and security guidelines
