const mongoose = require('mongoose');

/**
 * Fund Application Schema
 * 
 * Defines applications from startups to funding opportunities
 */
const fundApplicationSchema = new mongoose.Schema(
  {
    fundId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Fund',
      required: [true, 'Fund ID is required'],
      index: true
    },
    startupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Startup user ID is required'],
      index: true
    },
    applicationData: {
      teamSize: {
        type: Number,
        required: true,
        min: [1, 'Team size must be at least 1']
      },
      fundingRequired: {
        type: Number,
        required: true,
        min: [0, 'Funding required cannot be negative']
      },
      useOfFunds: {
        type: String,
        required: true,
        minlength: [20, 'Use of funds description must be at least 20 characters']
      },
      businessPlan: String,
      financialProjections: String,
      additionalDocuments: [String]
    },
    status: {
      type: String,
      enum: {
        values: ['submitted', 'under-review', 'approved', 'rejected', 'withdrawn'],
        message: 'Status must be one of the predefined values'
      },
      default: 'submitted'
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    reviewComments: {
      type: String,
      default: null
    },
    reviewDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Compound indexes
fundApplicationSchema.index({ fundId: 1, startupId: 1 }, { unique: true });
fundApplicationSchema.index({ startupId: 1, createdAt: -1 });
fundApplicationSchema.index({ status: 1 });

/**
 * Virtual Field: id
 */
fundApplicationSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

fundApplicationSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, options) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const FundApplication = mongoose.model('FundApplication', fundApplicationSchema);

module.exports = FundApplication;
