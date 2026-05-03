const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 * 
 * Defines the structure and validation rules for user documents.
 * Implements password hashing, validation, and secure data transformation.
 * 
 * @requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 9.1, 9.2, 9.4
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name must not exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false // Exclude password by default in queries
    },
    role: {
      type: String,
      enum: {
        values: ['applicant', 'staff', 'admin'],
        message: 'Role must be one of: applicant, staff, admin'
      },
      default: 'applicant'
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    versionKey: false // Disable __v field
  }
);

/**
 * Virtual Field: id
 * 
 * Maps MongoDB's _id to id for consistent API responses
 * @requirement 13.7
 */
userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

/**
 * Pre-save Middleware: Password Hashing
 * 
 * Automatically hashes the password before saving to database
 * Only hashes if password is new or modified
 * 
 * @requirement 1.2, 9.1, 9.2
 */
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt with 10 rounds (as specified in requirements)
    const salt = await bcrypt.genSalt(10);
    
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Instance Method: comparePassword
 * 
 * Compares a plain text password with the hashed password
 * Used during authentication to verify user credentials
 * 
 * @param {string} candidatePassword - The plain text password to compare
 * @returns {Promise<boolean>} - True if passwords match, false otherwise
 * @requirement 2.7, 9.5
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

/**
 * toJSON Transform
 * 
 * Customizes JSON serialization to exclude sensitive fields
 * Automatically removes password and __v from API responses
 * Maps _id to id for consistent API format
 * 
 * @requirement 1.7, 9.3, 9.4, 13.4, 13.5, 13.7
 */
userSchema.set('toJSON', {
  virtuals: true, // Include virtual fields like 'id'
  transform: function (doc, ret, options) {
    // Remove sensitive and internal fields
    delete ret.password;
    delete ret.__v;
    delete ret._id;
    
    return ret;
  }
});

/**
 * toObject Transform
 * 
 * Customizes object conversion to exclude sensitive fields
 * Ensures password is never exposed even in object form
 */
userSchema.set('toObject', {
  virtuals: true,
  transform: function (doc, ret, options) {
    delete ret.password;
    delete ret.__v;
    delete ret._id;
    
    return ret;
  }
});

/**
 * User Model
 * 
 * Mongoose model for user documents
 * Provides interface for user CRUD operations with built-in validation
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
