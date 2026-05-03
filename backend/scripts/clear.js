/**
 * Database Clear Script
 * 
 * Removes all data from the database.
 * Run with: node scripts/clear.js
 * 
 * WARNING: This will delete ALL data from the database!
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/modules/users/user.model');
const Application = require('../src/modules/applications/application.model');

/**
 * Connect to MongoDB
 */
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error.message);
    process.exit(1);
  }
}

/**
 * Clear all data
 */
async function clearDatabase() {
  try {
    console.log('🗑️  Starting database cleanup...\n');

    await connectDB();

    // Delete all applications
    const deletedApps = await Application.deleteMany({});
    console.log(`✓ Deleted ${deletedApps.deletedCount} applications`);

    // Delete all users
    const deletedUsers = await User.deleteMany({});
    console.log(`✓ Deleted ${deletedUsers.deletedCount} users`);

    console.log('\n✓ Database cleared successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Clear failed:', error.message);
    process.exit(1);
  }
}

// Run clear if called directly
if (require.main === module) {
  clearDatabase();
}

module.exports = { clearDatabase };
