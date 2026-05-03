/**
 * Database Seed Script
 * 
 * Seeds the database with initial admin, staff, and sample data.
 * Run with: node scripts/seed.js
 * Run with fresh database: node scripts/seed.js --fresh
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/modules/users/user.model');
const Application = require('../src/modules/applications/application.model');
const { USER_ROLES } = require('../src/common/constants/roles.constant');

// Check for --fresh flag
const isFresh = process.argv.includes('--fresh');

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
 * Clear existing data
 */
async function clearDatabase() {
  try {
    console.log('🗑️  Clearing existing data...');
    
    const deletedApps = await Application.deleteMany({});
    console.log(`   Deleted ${deletedApps.deletedCount} applications`);
    
    const deletedUsers = await User.deleteMany({});
    console.log(`   Deleted ${deletedUsers.deletedCount} users`);
    
    console.log('✓ Database cleared\n');
  } catch (error) {
    console.error('✗ Error clearing database:', error.message);
    throw error;
  }
}

/**
 * Seed Users
 */
async function seedUsers() {
  try {
    // Check if users already exist (skip check if --fresh flag is used)
    if (!isFresh) {
      const existingUsers = await User.countDocuments();
      if (existingUsers > 0) {
        console.log('⚠ Users already exist. Skipping user seeding.');
        console.log('   Use --fresh flag to clear and reseed: npm run seed:fresh');
        return;
      }
    }

    const usersData = [
      {
        name: 'Admin User',
        email: 'admin@startup.gov',
        password: 'Admin123!',
        role: USER_ROLES.ADMIN
      },
      {
        name: 'Staff Member',
        email: 'staff@startup.gov',
        password: 'Staff123!',
        role: USER_ROLES.STAFF
      },
      {
        name: 'John Applicant',
        email: 'john@example.com',
        password: 'Applicant123!',
        role: USER_ROLES.APPLICANT
      },
      {
        name: 'Jane Entrepreneur',
        email: 'jane@example.com',
        password: 'Applicant123!',
        role: USER_ROLES.APPLICANT
      }
    ];

    // Use create() instead of insertMany() to trigger pre-save hooks for password hashing
    const createdUsers = await User.create(usersData);
    console.log(`✓ Created ${createdUsers.length} users`);
    
    return createdUsers;
  } catch (error) {
    console.error('✗ Error seeding users:', error.message);
    throw error;
  }
}

/**
 * Seed Applications
 */
async function seedApplications() {
  try {
    // Check if applications already exist (skip check if --fresh flag is used)
    if (!isFresh) {
      const existingApps = await Application.countDocuments();
      if (existingApps > 0) {
        console.log('⚠ Applications already exist. Skipping application seeding.');
        console.log('   Use --fresh flag to clear and reseed: npm run seed:fresh');
        return;
      }
    }

    // Get applicant users
    const applicants = await User.find({ role: USER_ROLES.APPLICANT });
    const staff = await User.findOne({ role: USER_ROLES.STAFF });

    if (applicants.length === 0) {
      console.log('⚠ No applicants found. Skipping application seeding.');
      return;
    }

    const applications = [
      {
        userId: applicants[0]._id,
        startupName: 'EcoTech Solutions',
        description: 'A platform connecting eco-conscious consumers with sustainable products and verified green businesses.',
        problemStatement: 'Consumers struggle to find verified sustainable products in one centralized marketplace, leading to greenwashing and lack of trust.',
        solution: 'Centralized marketplace with verified eco-certifications, carbon footprint tracking, and transparent supply chain information.',
        targetMarket: 'Environmentally conscious millennials and Gen Z consumers in urban areas with disposable income.',
        status: 'pending'
      },
      {
        userId: applicants[0]._id,
        startupName: 'HealthAI Diagnostics',
        description: 'AI-powered early disease detection system using medical imaging and machine learning algorithms.',
        problemStatement: 'Early disease detection is often delayed due to limited access to specialists and long wait times for diagnostic imaging analysis.',
        solution: 'Cloud-based AI platform that analyzes medical images in real-time, flagging potential issues for immediate specialist review.',
        targetMarket: 'Healthcare providers, diagnostic centers, and hospitals in underserved regions.',
        status: 'approved',
        reviewedBy: staff ? staff._id : null
      }
    ];

    if (applicants.length > 1) {
      applications.push({
        userId: applicants[1]._id,
        startupName: 'EduConnect Platform',
        description: 'Online learning platform connecting students in rural areas with qualified tutors through video conferencing.',
        problemStatement: 'Students in rural and remote areas lack access to quality education and specialized tutors.',
        solution: 'Affordable online tutoring platform with AI-powered matching, progress tracking, and flexible scheduling.',
        targetMarket: 'Students aged 10-18 in rural areas, homeschooling families, and underserved communities.',
        status: 'pending'
      });
    }

    const createdApps = await Application.insertMany(applications);
    console.log(`✓ Created ${createdApps.length} applications`);
  } catch (error) {
    console.error('✗ Error seeding applications:', error.message);
    throw error;
  }
}

/**
 * Main seed function
 */
async function seed() {
  try {
    console.log('🌱 Starting database seeding...\n');

    await connectDB();
    
    // Clear database if --fresh flag is provided
    if (isFresh) {
      await clearDatabase();
    }
    
    await seedUsers();
    await seedApplications();

    console.log('\n✓ Database seeding completed successfully!');
    console.log('\n📝 Seeded Credentials:');
    console.log('   Admin:     admin@startup.gov / Admin123!');
    console.log('   Staff:     staff@startup.gov / Staff123!');
    console.log('   Applicant: john@example.com / Applicant123!');
    console.log('   Applicant: jane@example.com / Applicant123!');
    
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Seeding failed:', error.message);
    process.exit(1);
  }
}

// Run seed if called directly
if (require.main === module) {
  seed();
}

module.exports = { seed, seedUsers, seedApplications, clearDatabase };
