/**
 * Database Seed Script
 * Creates test users for development and testing
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/modules/users/user.model');
const { connectDB } = require('../src/common/config/database.config');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');
    
    // Connect to MongoDB
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Test users
    const testUsers = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'Admin123456',
        role: 'admin'
      },
      {
        name: 'Staff User',
        email: 'staff@example.com',
        password: 'Staff123456',
        role: 'staff'
      },
      {
        name: 'Applicant User',
        email: 'applicant@example.com',
        password: 'Applicant123456',
        role: 'applicant'
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'John123456',
        role: 'applicant'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'Jane123456',
        role: 'applicant'
      }
    ];

    // Create users
    const createdUsers = await User.create(testUsers);
    console.log(`✅ Created ${createdUsers.length} test users`);

    // Display created users
    console.log('\n📋 Created Users:');
    createdUsers.forEach((user) => {
      console.log(`  • ${user.email} (${user.role})`);
    });

    console.log('\n✨ Database seed completed successfully!');
    console.log('\nTest Credentials:');
    console.log('  Admin: admin@example.com / Admin123456');
    console.log('  Staff: staff@example.com / Staff123456');
    console.log('  Applicant: applicant@example.com / Applicant123456');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
}

seedDatabase();
