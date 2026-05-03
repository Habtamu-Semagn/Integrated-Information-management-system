/**
 * Application Status Constants
 * 
 * Defines the available status values for startup applications.
 * 
 * @module constants/status
 * @see Requirements 5.1, 7.4
 */

/**
 * Application status enumeration
 * @enum {string}
 */
const APPLICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

/**
 * Array of all valid application statuses
 * @type {string[]}
 */
const VALID_STATUSES = Object.values(APPLICATION_STATUS);

/**
 * Default status assigned to new applications
 * @type {string}
 */
const DEFAULT_STATUS = APPLICATION_STATUS.PENDING;

module.exports = {
  APPLICATION_STATUS,
  VALID_STATUSES,
  DEFAULT_STATUS
};
