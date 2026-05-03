/**
 * Database Configuration Demo
 * 
 * This script demonstrates the database configuration module functionality.
 * 
 * Usage:
 * 1. Ensure MongoDB is running
 * 2. Set MONGODB_URI in .env file
 * 3. Run: node src/common/config/demo.js
 * 
 * @module database.config.demo
 */

require('dotenv').config();
const {
  connectDB,
  setupConnectionHandlers,
  getConnectionState,
  isConnected,
} = require('./database.config');

/**
 * Demo function to showcase database configuration features
 */
async function runDemo() {
  console.log('='.repeat(60));
  console.log('DATABASE CONFIGURATION DEMO');
  console.log('='.repeat(60));
  console.log();

  try {
    // Check environment variables
    console.log('📋 Step 1: Checking environment variables...');
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    console.log(`   ✅ MONGODB_URI: ${process.env.MONGODB_URI.replace(/\/\/.*@/, '//*****@')}`);
    console.log();

    // Check initial connection state
    console.log('📋 Step 2: Checking initial connection state...');
    console.log(`   Connection State: ${getConnectionState()}`);
    console.log(`   Is Connected: ${isConnected()}`);
    console.log();

    // Setup connection handlers
    console.log('📋 Step 3: Setting up connection event handlers...');
    setupConnectionHandlers();
    console.log('   ✅ Event handlers registered');
    console.log();

    // Connect to database
    console.log('📋 Step 4: Connecting to MongoDB...');
    await connectDB();
    console.log();

    // Verify connection
    console.log('📋 Step 5: Verifying connection...');
    console.log(`   Connection State: ${getConnectionState()}`);
    console.log(`   Is Connected: ${isConnected()}`);
    console.log();

    // Display connection info
    console.log('📋 Step 6: Connection Information:');
    const mongoose = require('mongoose');
    console.log(`   Host: ${mongoose.connection.host}`);
    console.log(`   Database: ${mongoose.connection.name}`);
    console.log(`   Port: ${mongoose.connection.port}`);
    console.log(`   Ready State: ${mongoose.connection.readyState}`);
    console.log();

    // Test connection by listing collections
    console.log('📋 Step 7: Testing connection (listing collections)...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`   Found ${collections.length} collection(s):`);
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    if (collections.length === 0) {
      console.log('   (No collections yet - database is empty)');
    }
    console.log();

    // Success message
    console.log('='.repeat(60));
    console.log('✅ DEMO COMPLETED SUCCESSFULLY');
    console.log('='.repeat(60));
    console.log();
    console.log('💡 Tips:');
    console.log('   - Press Ctrl+C to test graceful shutdown');
    console.log('   - Check the logs for connection events');
    console.log('   - The connection will remain open until you exit');
    console.log();

    // Keep the process running to demonstrate graceful shutdown
    console.log('⏳ Keeping connection open... (Press Ctrl+C to exit)');
    
    // Prevent process from exiting
    await new Promise(() => {});

  } catch (error) {
    console.error();
    console.error('='.repeat(60));
    console.error('❌ DEMO FAILED');
    console.error('='.repeat(60));
    console.error();
    console.error('Error:', error.message);
    console.error();
    
    if (error.message.includes('MONGODB_URI')) {
      console.error('💡 Solution:');
      console.error('   1. Create a .env file in the backend directory');
      console.error('   2. Add: MONGODB_URI=mongodb://localhost:27017/test-db');
      console.error('   3. Ensure MongoDB is running');
      console.error();
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error('💡 Solution:');
      console.error('   1. Start MongoDB: docker run -d -p 27017:27017 mongo:7.0');
      console.error('   2. Or install MongoDB locally');
      console.error();
    } else if (error.message.includes('authentication')) {
      console.error('💡 Solution:');
      console.error('   1. Check MongoDB credentials in MONGODB_URI');
      console.error('   2. Ensure the user has proper permissions');
      console.error();
    }

    process.exit(1);
  }
}

// Run the demo
runDemo();
