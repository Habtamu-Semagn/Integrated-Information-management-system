/**
 * Example usage of User Roles Constants
 * 
 * This file demonstrates how to use the roles constants in various scenarios.
 * 
 * @module constants/roles.example
 */

const { USER_ROLES, VALID_ROLES, DEFAULT_ROLE } = require('./roles.constant');

// Example 1: Validating a user role
function isValidRole(role) {
  return VALID_ROLES.includes(role);
}

console.log('Example 1: Role Validation');
console.log('Is "applicant" valid?', isValidRole('applicant')); // true
console.log('Is "superuser" valid?', isValidRole('superuser')); // false
console.log('');

// Example 2: Using role constants in authorization checks
function canCreateApplication(userRole) {
  return userRole === USER_ROLES.APPLICANT;
}

function canReviewApplications(userRole) {
  return userRole === USER_ROLES.STAFF || userRole === USER_ROLES.ADMIN;
}

console.log('Example 2: Authorization Checks');
console.log('Can applicant create application?', canCreateApplication(USER_ROLES.APPLICANT)); // true
console.log('Can staff create application?', canCreateApplication(USER_ROLES.STAFF)); // false
console.log('Can staff review applications?', canReviewApplications(USER_ROLES.STAFF)); // true
console.log('Can applicant review applications?', canReviewApplications(USER_ROLES.APPLICANT)); // false
console.log('');

// Example 3: Setting default role during user registration
function createUser(name, email, password, role = DEFAULT_ROLE) {
  return {
    name,
    email,
    password,
    role
  };
}

console.log('Example 3: User Registration with Default Role');
const newUser1 = createUser('John Doe', 'john@example.com', 'password123');
console.log('User without specified role:', newUser1);
// { name: 'John Doe', email: 'john@example.com', password: 'password123', role: 'applicant' }

const newUser2 = createUser('Jane Smith', 'jane@example.com', 'password456', USER_ROLES.STAFF);
console.log('User with staff role:', newUser2);
// { name: 'Jane Smith', email: 'jane@example.com', password: 'password456', role: 'staff' }
console.log('');

// Example 4: Role-based middleware authorization
function authorize(...allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user?.role;
    
    if (!userRole) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    
    next();
  };
}

console.log('Example 4: Middleware Authorization');
console.log('Middleware for applicants only:', authorize(USER_ROLES.APPLICANT));
console.log('Middleware for staff and admin:', authorize(USER_ROLES.STAFF, USER_ROLES.ADMIN));
console.log('');

// Example 5: Filtering users by role
const users = [
  { id: 1, name: 'Alice', role: USER_ROLES.APPLICANT },
  { id: 2, name: 'Bob', role: USER_ROLES.STAFF },
  { id: 3, name: 'Charlie', role: USER_ROLES.ADMIN },
  { id: 4, name: 'David', role: USER_ROLES.APPLICANT }
];

console.log('Example 5: Filtering Users by Role');
const applicants = users.filter(user => user.role === USER_ROLES.APPLICANT);
console.log('Applicants:', applicants);

const reviewers = users.filter(user => 
  user.role === USER_ROLES.STAFF || user.role === USER_ROLES.ADMIN
);
console.log('Reviewers (Staff + Admin):', reviewers);
console.log('');

// Example 6: Role validation in Mongoose schema
const roleValidationExample = {
  role: {
    type: String,
    required: true,
    enum: VALID_ROLES,
    default: DEFAULT_ROLE
  }
};

console.log('Example 6: Mongoose Schema Validation');
console.log('Schema definition:', roleValidationExample);
console.log('');

// Example 7: Checking role hierarchy
function hasHigherPrivilege(userRole, targetRole) {
  const roleHierarchy = {
    [USER_ROLES.APPLICANT]: 1,
    [USER_ROLES.STAFF]: 2,
    [USER_ROLES.ADMIN]: 3
  };
  
  return roleHierarchy[userRole] > roleHierarchy[targetRole];
}

console.log('Example 7: Role Hierarchy');
console.log('Does admin have higher privilege than staff?', 
  hasHigherPrivilege(USER_ROLES.ADMIN, USER_ROLES.STAFF)); // true
console.log('Does staff have higher privilege than admin?', 
  hasHigherPrivilege(USER_ROLES.STAFF, USER_ROLES.ADMIN)); // false
console.log('');

// Example 8: Getting all roles for documentation or UI
console.log('Example 8: All Available Roles');
console.log('All roles:', VALID_ROLES);
console.log('Role constants:', USER_ROLES);
