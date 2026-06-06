/**
 * Database Check Script
 * 
 * Checks the users collection to see what roles are stored
 * Run with: node scripts/check-users.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/modules/users/user.model');

/**
 * Connect to MongoDB
 */
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error.message);
    process.exit(1);
  }
}

/**
 * Check users in database
 */
async function checkUsers() {
  try {
    console.log('📊 Fetching all users from database...\n');
    
    const users = await User.find().select('name email role createdAt');
    
    if (users.length === 0) {
      console.log('⚠ No users found in database');
      return;
    }

    console.log(`Found ${users.length} users:\n`);
    console.log('═'.repeat(80));
    console.log('Name                 Email                     Role            Created             ');
    console.log('═'.repeat(80));
    
    users.forEach(user => {
      const createdDate = user.createdAt ? user.createdAt.toISOString().split('T')[0] : 'N/A';
      const name = user.name.substring(0, 19).padEnd(20);
      const email = user.email.substring(0, 24).padEnd(25);
      const role = user.role.substring(0, 14).padEnd(15);
      console.log(`${name}${email}${role}${createdDate}`);
    });
    
    console.log('═'.repeat(80));
    console.log('\n📍 Specific lookup for "John Applicant":\n');
    
    const johnUser = await User.findOne({ email: 'john@example.com' });
    
    if (johnUser) {
      console.log(`Name:     ${johnUser.name}`);
      console.log(`Email:    ${johnUser.email}`);
      console.log(`Role:     ${johnUser.role}`);
      console.log(`Role Type: ${typeof johnUser.role}`);
      console.log(`Created:  ${johnUser.createdAt}`);
      console.log(`Updated:  ${johnUser.updatedAt}`);
    } else {
      console.log('⚠ User "john@example.com" not found');
    }
    
  } catch (error) {
    console.error('✗ Error checking users:', error.message);
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  try {
    await connectDB();
    await checkUsers();
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Check failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { checkUsers };
