const mongoose = require('mongoose');

/**
 * Competition Schema
 * 
 * Defines startup competitions and contests
 */
const competitionSchema = new mongoose.Schema(
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
    competitionType: {
      type: String,
      enum: {
        values: ['pitch-competition', 'hackathon', 'idea-challenge', 'business-plan', 'innovation-award'],
        message: 'Competition type must be one of the predefined options'
      },
      required: [true, 'Competition type is required']
    },
    prizes: {
      firstPlace: Number,
      secondPlace: Number,
      thirdPlace: Number,
      currency: {
        type: String,
        default: 'USD'
      }
    },
    registrationDeadline: {
      type: Date,
      required: [true, 'Registration deadline is required']
    },
    competitionDate: {
      type: Date,
      required: [true, 'Competition date is required']
    },
    location: String,
    isVirtual: {
      type: Boolean,
      default: false
    },
    maxParticipants: {
      type: Number,
      min: [1, 'Must allow at least 1 participant']
    },
    judges: [{
      name: String,
      expertise: String,
      imageUrl: String
    }],
    status: {
      type: String,
      enum: {
        values: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        message: 'Status must be upcoming, ongoing, completed, or cancelled'
      },
      default: 'upcoming'
    },
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    results: {
      firstPlaceWinner: mongoose.Schema.Types.ObjectId,
      secondPlaceWinner: mongoose.Schema.Types.ObjectId,
      thirdPlaceWinner: mongoose.Schema.Types.ObjectId,
      results: [
        {
          participantId: mongoose.Schema.Types.ObjectId,
          rank: Number,
          score: Number,
          feedback: String
        }
      ]
    },
    tags: [String]
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Indexes
competitionSchema.index({ status: 1 });
competitionSchema.index({ competitionType: 1 });
competitionSchema.index({ competitionDate: 1 });
competitionSchema.index({ registrationDeadline: 1 });
competitionSchema.index({ createdAt: -1 });

/**
 * Virtual Field: id
 */
competitionSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

competitionSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, options) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Competition = mongoose.model('Competition', competitionSchema);

module.exports = Competition;
