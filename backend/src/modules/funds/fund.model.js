const mongoose = require('mongoose');

/**
 * Fund Schema
 * 
 * Defines the structure for startup funding opportunities
 */
const fundSchema = new mongoose.Schema(
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
    fundType: {
      type: String,
      enum: {
        values: ['seed-funding', 'series-a', 'series-b', 'grant', 'accelerator', 'venture-capital'],
        message: 'Fund type must be one of the predefined options'
      },
      required: [true, 'Fund type is required']
    },
    minimumAmount: {
      type: Number,
      required: [true, 'Minimum amount is required'],
      min: [0, 'Minimum amount cannot be negative']
    },
    maximumAmount: {
      type: Number,
      required: [true, 'Maximum amount is required'],
      min: [0, 'Maximum amount cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'INR', 'AUD']
    },
    deadline: {
      type: Date,
      required: [true, 'Application deadline is required']
    },
    fundingOrganization: {
      type: String,
      required: [true, 'Funding organization is required'],
      trim: true
    },
    requirements: {
      minTeamSize: Number,
      maxTeamSize: Number,
      targetIndustries: [String],
      eligibleCountries: [String]
    },
    status: {
      type: String,
      enum: {
        values: ['open', 'closed', 'paused'],
        message: 'Status must be open, closed, or paused'
      },
      default: 'open'
    },
    applications: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FundApplication'
    }],
    tags: [String]
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Indexes
fundSchema.index({ status: 1 });
fundSchema.index({ fundType: 1 });
fundSchema.index({ deadline: 1 });
fundSchema.index({ createdAt: -1 });

/**
 * Virtual Field: id
 */
fundSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

fundSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, options) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Fund = mongoose.model('Fund', fundSchema);

module.exports = Fund;
