const mongoose = require('mongoose');

/**
 * Event Schema
 * 
 * Defines startup events, webinars, and networking events
 */
const eventSchema = new mongoose.Schema(
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
      minlength: [20, 'Description must be at least 20 characters long'],
      maxlength: [3000, 'Description must not exceed 3000 characters']
    },
    eventType: {
      type: String,
      enum: {
        values: ['webinar', 'workshop', 'networking', 'conference', 'meetup', 'masterclass'],
        message: 'Event type must be one of the predefined options'
      },
      required: [true, 'Event type is required']
    },
    startDateTime: {
      type: Date,
      required: [true, 'Start date and time is required']
    },
    endDateTime: {
      type: Date,
      required: [true, 'End date and time is required']
    },
    location: {
      venue: String,
      city: String,
      country: String,
      onlineLink: String
    },
    isVirtual: {
      type: Boolean,
      default: false
    },
    isHybrid: {
      type: Boolean,
      default: false
    },
    speakers: [{
      name: String,
      title: String,
      bio: String,
      imageUrl: String
    }],
    capacity: {
      type: Number,
      min: [1, 'Capacity must be at least 1']
    },
    registeredAttendees: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    status: {
      type: String,
      enum: {
        values: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        message: 'Status must be upcoming, ongoing, completed, or cancelled'
      },
      default: 'upcoming'
    },
    agenda: [{
      time: String,
      activity: String,
      speaker: String,
      duration: Number
    }],
    materials: [{
      title: String,
      url: String,
      type: String
    }],
    tags: [String],
    category: {
      type: String,
      enum: ['technology', 'finance', 'marketing', 'operations', 'general'],
      default: 'general'
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Indexes
eventSchema.index({ status: 1 });
eventSchema.index({ eventType: 1 });
eventSchema.index({ startDateTime: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ createdAt: -1 });

/**
 * Virtual Field: id
 */
eventSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

eventSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, options) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
