/**
 * User Model Usage Examples
 * 
 * This file demonstrates how to use the User model.
 * These examples show the model's features without requiring a database connection.
 */

const User = require('./user.model');

/**
 * Example 1: Creating a User Instance (without saving)
 * 
 * Demonstrates schema validation and field structure
 */
function exampleCreateUserInstance() {
  const user = new User({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'SecurePass123',
    role: 'applicant'
  });

  console.log('User instance created:');
  console.log('Name:', user.name);
  console.log('Email:', user.email);
  console.log('Role:', user.role);
  console.log('Password (before save):', user.password); // Still plain text
  
  return user;
}

/**
 * Example 2: JSON Transformation
 * 
 * Demonstrates how the model excludes sensitive fields
 */
function exampleJSONTransformation() {
  const user = new User({
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'AnotherSecurePass456',
    role: 'staff'
  });

  // Simulate having an _id (normally set by MongoDB)
  user._id = '507f1f77bcf86cd799439011';
  user.createdAt = new Date();
  user.updatedAt = new Date();

  const json = user.toJSON();
  
  console.log('\nJSON output:');
  console.log(JSON.stringify(json, null, 2));
  console.log('\nNote: password, _id, and __v are excluded');
  console.log('Note: id virtual field is included');
  
  return json;
}

/**
 * Example 3: Schema Validation
 * 
 * Demonstrates validation rules
 */
function exampleValidation() {
  console.log('\n=== Validation Examples ===\n');

  // Valid user
  try {
    const validUser = new User({
      name: 'Valid User',
      email: 'valid@example.com',
      password: 'ValidPass123'
    });
    console.log('✓ Valid user created successfully');
  } catch (error) {
    console.log('✗ Validation failed:', error.message);
  }

  // Invalid: name too short
  try {
    const invalidUser = new User({
      name: 'J',
      email: 'test@example.com',
      password: 'ValidPass123'
    });
    const validationError = invalidUser.validateSync();
    if (validationError) {
      console.log('✓ Short name rejected:', validationError.errors.name.message);
    } else {
      console.log('✗ Short name accepted (should not happen)');
    }
  } catch (error) {
    console.log('✓ Short name rejected:', error.message);
  }

  // Invalid: email format
  try {
    const invalidUser = new User({
      name: 'Test User',
      email: 'notanemail',
      password: 'ValidPass123'
    });
    const validationError = invalidUser.validateSync();
    if (validationError) {
      console.log('✓ Invalid email rejected:', validationError.errors.email.message);
    } else {
      console.log('✗ Invalid email accepted (should not happen)');
    }
  } catch (error) {
    console.log('✓ Invalid email rejected:', error.message);
  }

  // Invalid: password too short
  try {
    const invalidUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Short1'
    });
    const validationError = invalidUser.validateSync();
    if (validationError) {
      console.log('✓ Short password rejected:', validationError.errors.password.message);
    } else {
      console.log('✗ Short password accepted (should not happen)');
    }
  } catch (error) {
    console.log('✓ Short password rejected:', error.message);
  }

  // Invalid: invalid role
  try {
    const invalidUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'ValidPass123',
      role: 'invalid_role'
    });
    const validationError = invalidUser.validateSync();
    if (validationError) {
      console.log('✓ Invalid role rejected:', validationError.errors.role.message);
    } else {
      console.log('✗ Invalid role accepted (should not happen)');
    }
  } catch (error) {
    console.log('✓ Invalid role rejected:', error.message);
  }
}

/**
 * Example 4: Password Hashing Demonstration
 * 
 * Shows how password hashing works (requires async/await)
 */
async function examplePasswordHashing() {
  console.log('\n=== Password Hashing Example ===\n');
  
  const bcrypt = require('bcryptjs');
  const plainPassword = 'MySecurePassword123';
  
  // Simulate what the pre-save hook does
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(plainPassword, salt);
  
  console.log('Plain password:', plainPassword);
  console.log('Hashed password:', hashedPassword);
  console.log('Hash format:', hashedPassword.match(/^\$2[aby]\$10\$/) ? 'bcrypt with 10 rounds ✓' : 'invalid');
  
  // Demonstrate password comparison
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  console.log('\nPassword comparison:');
  console.log('Correct password:', isMatch ? '✓ Match' : '✗ No match');
  
  const wrongPassword = 'WrongPassword';
  const isWrongMatch = await bcrypt.compare(wrongPassword, hashedPassword);
  console.log('Wrong password:', isWrongMatch ? '✗ Match (should not happen)' : '✓ No match');
}

/**
 * Example 5: Field Defaults and Transformations
 */
function exampleDefaults() {
  console.log('\n=== Default Values and Transformations ===\n');
  
  // User without role (should default to 'applicant')
  const user1 = new User({
    name: 'Default User',
    email: 'default@example.com',
    password: 'Password123'
  });
  console.log('User without role specified:');
  console.log('Role:', user1.role, '(default: applicant) ✓');
  
  // Email transformation (should be lowercase)
  const user2 = new User({
    name: 'Uppercase Email',
    email: 'UPPERCASE@EXAMPLE.COM',
    password: 'Password123'
  });
  console.log('\nEmail transformation:');
  console.log('Input: UPPERCASE@EXAMPLE.COM');
  console.log('Stored:', user2.email, '(lowercase) ✓');
  
  // Name trimming
  const user3 = new User({
    name: '  Trimmed Name  ',
    email: 'trim@example.com',
    password: 'Password123'
  });
  console.log('\nName trimming:');
  console.log('Input: "  Trimmed Name  "');
  console.log('Stored: "' + user3.name + '" (trimmed) ✓');
}

/**
 * Example 6: Virtual Fields
 */
function exampleVirtualFields() {
  console.log('\n=== Virtual Fields ===\n');
  
  const user = new User({
    name: 'Virtual Test',
    email: 'virtual@example.com',
    password: 'Password123'
  });
  
  // Simulate MongoDB _id
  user._id = '507f1f77bcf86cd799439011';
  
  console.log('MongoDB _id:', user._id);
  console.log('Virtual id field:', user.id);
  console.log('Match:', user.id === user._id.toString() ? '✓' : '✗');
  
  const json = user.toJSON();
  console.log('\nIn JSON output:');
  console.log('_id present:', '_id' in json ? '✗' : '✓ (excluded)');
  console.log('id present:', 'id' in json ? '✓' : '✗');
}

/**
 * Run all examples
 */
async function runAllExamples() {
  console.log('='.repeat(60));
  console.log('USER MODEL EXAMPLES');
  console.log('='.repeat(60));
  
  console.log('\n=== Example 1: Creating User Instance ===\n');
  exampleCreateUserInstance();
  
  console.log('\n=== Example 2: JSON Transformation ===');
  exampleJSONTransformation();
  
  exampleValidation();
  
  await examplePasswordHashing();
  
  exampleDefaults();
  
  exampleVirtualFields();
  
  console.log('\n' + '='.repeat(60));
  console.log('All examples completed successfully!');
  console.log('='.repeat(60) + '\n');
}

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples().catch(console.error);
}

module.exports = {
  exampleCreateUserInstance,
  exampleJSONTransformation,
  exampleValidation,
  examplePasswordHashing,
  exampleDefaults,
  exampleVirtualFields,
  runAllExamples
};
