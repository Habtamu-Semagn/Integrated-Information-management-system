const mongoose = require('mongoose');
const { APPLICATION_STATUS, DEFAULT_STATUS } = require('../../common/constants/status.constant');

/**
 * Application Schema
 * 
 * Defines the structure and validation rules for startup application documents.
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 15.4
 */
const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },
    startupName: {
      type: String,
      required: [true, 'Startup name is required'],
      trim: true,
      minlength: [3, 'Startup name must be at least 3 characters long'],
      maxlength: [200, 'Startup name must not exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters long'],
      maxlength: [1000, 'Description must not exceed 1000 characters']
    },
    problemStatement: {
      type: String,
      required: [true, 'Problem statement is required'],
      trim: true,
      minlength: [10, 'Problem statement must be at least 10 characters long'],
      maxlength: [1000, 'Problem statement must not exceed 1000 characters']
    },
    solution: {
      type: String,
      required: [true, 'Solution is required'],
      trim: true,
      minlength: [10, 'Solution must be at least 10 characters long'],
      maxlength: [1000, 'Solution must not exceed 1000 characters']
    },
    targetMarket: {
      type: String,
      required: [true, 'Target market is required'],
      trim: true,
      minlength: [5, 'Target market must be at least 5 characters long'],
      maxlength: [500, 'Target market must not exceed 500 characters']
    },
    status: {
      type: String,
      enum: {
        values: Object.values(APPLICATION_STATUS),
        message: 'Status must be one of: pending, approved, rejected'
      },
      default: DEFAULT_STATUS
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Compound index for efficient user application queries
applicationSchema.index({ userId: 1, createdAt: -1 });

// Index on status for filtering
applicationSchema.index({ status: 1 });

/**
 * Virtual Field: id
 * Maps MongoDB's _id to id for consistent API responses
 */
applicationSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

/**
 * toJSON Transform
 * Customizes JSON serialization to map _id to id
 */
applicationSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, options) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

/**
 * toObject Transform
 * Customizes object conversion
 */
applicationSchema.set('toObject', {
  virtuals: true,
  transform: function (doc, ret, options) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
