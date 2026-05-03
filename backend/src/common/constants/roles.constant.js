/**
 * User Roles Constants
 * 
 * Defines the available user roles in the system for role-based access control.
 * 
 * @module constants/roles
 * @see Requirements 1.1, 4.1, 5.1
 */

/**
 * User role enumeration
 * @enum {string}
 */
const USER_ROLES = {
  APPLICANT: 'applicant',
  STAFF: 'staff',
  ADMIN: 'admin'
};

/**
 * Array of all valid user roles
 * @type {string[]}
 */
const VALID_ROLES = Object.values(USER_ROLES);

/**
 * Default role assigned to new users during registration
 * @type {string}
 */
const DEFAULT_ROLE = USER_ROLES.APPLICANT;

module.exports = {
  USER_ROLES,
  VALID_ROLES,
  DEFAULT_ROLE
};
