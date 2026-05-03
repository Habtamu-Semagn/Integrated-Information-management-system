/**
 * Example usage of Application Status Constants
 * 
 * This file demonstrates how to use the status constants in various scenarios.
 * 
 * @module constants/status.example
 */

const { APPLICATION_STATUS, VALID_STATUSES, DEFAULT_STATUS } = require('./status.constant');

// Example 1: Validating an application status
function isValidStatus(status) {
  return VALID_STATUSES.includes(status);
}

console.log('Example 1: Status Validation');
console.log('Is "pending" valid?', isValidStatus('pending')); // true
console.log('Is "in-progress" valid?', isValidStatus('in-progress')); // false
console.log('');

// Example 2: Creating a new application with default status
function createApplication(startupName, description) {
  return {
    startupName,
    description,
    status: DEFAULT_STATUS,
    reviewedBy: null,
    createdAt: new Date()
  };
}

console.log('Example 2: Application Creation with Default Status');
const newApp = createApplication('EcoTech Solutions', 'A sustainable marketplace');
console.log('New application:', newApp);
console.log('');

// Example 3: Updating application status
function updateApplicationStatus(application, newStatus, reviewerId) {
  if (!isValidStatus(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}`);
  }
  
  if (application.status === newStatus) {
    throw new Error('Application already has this status');
  }
  
  return {
    ...application,
    status: newStatus,
    reviewedBy: reviewerId,
    updatedAt: new Date()
  };
}

console.log('Example 3: Status Update');
const application = {
  id: '123',
  startupName: 'TechStart',
  status: APPLICATION_STATUS.PENDING
};

try {
  const approvedApp = updateApplicationStatus(
    application, 
    APPLICATION_STATUS.APPROVED, 
    'reviewer-456'
  );
  console.log('Approved application:', approvedApp);
} catch (error) {
  console.error('Error:', error.message);
}
console.log('');

// Example 4: Filtering applications by status
const applications = [
  { id: 1, name: 'App1', status: APPLICATION_STATUS.PENDING },
  { id: 2, name: 'App2', status: APPLICATION_STATUS.APPROVED },
  { id: 3, name: 'App3', status: APPLICATION_STATUS.PENDING },
  { id: 4, name: 'App4', status: APPLICATION_STATUS.REJECTED }
];

console.log('Example 4: Filtering Applications by Status');
const pendingApps = applications.filter(app => app.status === APPLICATION_STATUS.PENDING);
console.log('Pending applications:', pendingApps);

const reviewedApps = applications.filter(app => 
  app.status === APPLICATION_STATUS.APPROVED || app.status === APPLICATION_STATUS.REJECTED
);
console.log('Reviewed applications:', reviewedApps);
console.log('');

// Example 5: Status transition validation
function isValidStatusTransition(currentStatus, newStatus) {
  // Business rule: Can only transition from pending to approved/rejected
  if (currentStatus === APPLICATION_STATUS.PENDING) {
    return newStatus === APPLICATION_STATUS.APPROVED || 
           newStatus === APPLICATION_STATUS.REJECTED;
  }
  
  // Once approved or rejected, status cannot change
  return false;
}

console.log('Example 5: Status Transition Validation');
console.log('Can transition from pending to approved?', 
  isValidStatusTransition(APPLICATION_STATUS.PENDING, APPLICATION_STATUS.APPROVED)); // true
console.log('Can transition from approved to rejected?', 
  isValidStatusTransition(APPLICATION_STATUS.APPROVED, APPLICATION_STATUS.REJECTED)); // false
console.log('');

// Example 6: Status-based UI rendering
function getStatusBadgeColor(status) {
  switch (status) {
    case APPLICATION_STATUS.PENDING:
      return 'yellow';
    case APPLICATION_STATUS.APPROVED:
      return 'green';
    case APPLICATION_STATUS.REJECTED:
      return 'red';
    default:
      return 'gray';
  }
}

console.log('Example 6: Status Badge Colors');
VALID_STATUSES.forEach(status => {
  console.log(`${status}: ${getStatusBadgeColor(status)}`);
});
console.log('');

// Example 7: Status statistics
function getApplicationStatistics(applications) {
  return {
    total: applications.length,
    pending: applications.filter(app => app.status === APPLICATION_STATUS.PENDING).length,
    approved: applications.filter(app => app.status === APPLICATION_STATUS.APPROVED).length,
    rejected: applications.filter(app => app.status === APPLICATION_STATUS.REJECTED).length
  };
}

console.log('Example 7: Application Statistics');
const stats = getApplicationStatistics(applications);
console.log('Statistics:', stats);
console.log('');

// Example 8: Mongoose schema validation
const statusValidationExample = {
  status: {
    type: String,
    required: true,
    enum: VALID_STATUSES,
    default: DEFAULT_STATUS
  }
};

console.log('Example 8: Mongoose Schema Validation');
console.log('Schema definition:', statusValidationExample);
console.log('');

// Example 9: Status change notification
function shouldNotifyApplicant(oldStatus, newStatus) {
  // Notify when status changes from pending to approved/rejected
  return oldStatus === APPLICATION_STATUS.PENDING && 
         (newStatus === APPLICATION_STATUS.APPROVED || 
          newStatus === APPLICATION_STATUS.REJECTED);
}

console.log('Example 9: Notification Logic');
console.log('Notify on pending -> approved?', 
  shouldNotifyApplicant(APPLICATION_STATUS.PENDING, APPLICATION_STATUS.APPROVED)); // true
console.log('Notify on approved -> rejected?', 
  shouldNotifyApplicant(APPLICATION_STATUS.APPROVED, APPLICATION_STATUS.REJECTED)); // false
console.log('');

// Example 10: Getting all statuses for documentation or UI
console.log('Example 10: All Available Statuses');
console.log('All statuses:', VALID_STATUSES);
console.log('Status constants:', APPLICATION_STATUS);
console.log('Default status:', DEFAULT_STATUS);
