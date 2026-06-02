const mongoose = require('mongoose');

/**
 * Training Schema
 * 
 * Defines the structure for startup training resources and courses
 */
const trainingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters long'],
      maxlength: [200, 'Title must not exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters long'],
      maxlength: [2000, 'Description must not exceed 2000 characters']
    },
    category: {
      type: String,
      enum: {
        values: ['business-fundamentals', 'marketing', 'finance', 'technology', 'legal', 'sales', 'operations'],
        message: 'Category must be one of the predefined options'
      },
      required: [true, 'Category is required']
    },
    level: {
      type: String,
      enum: {
        values: ['beginner', 'intermediate', 'advanced'],
        message: 'Level must be beginner, intermediate, or advanced'
      },
      default: 'beginner'
    },
    instructor: {
      type: String,
      required: [true, 'Instructor name is required'],
      trim: true
    },
    duration: {
      type: Number,
      required: [true, 'Duration in minutes is required'],
      min: [1, 'Duration must be at least 1 minute']
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      minlength: [20, 'Content must be at least 20 characters long']
    },
    materials: [{
      title: {
        type: String,
        required: true
      },
      location: {
        type: String,
        required: true
      },
      type: {
        type: String,
        enum: ['online', 'in-person', 'hybrid'],
        default: 'online'
      }
    }],
    enrolledUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    completedUsers: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      completedAt: Date
    }],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Indexes
trainingSchema.index({ category: 1 });
trainingSchema.index({ isActive: 1 });
trainingSchema.index({ createdAt: -1 });

/**
 * Virtual Field: id
 */
trainingSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

trainingSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, options) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Training = mongoose.model('Training', trainingSchema);

module.exports = Training;
