const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const leadSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Lead type is required'],
      enum: {
        values: [
          'consultation',
          'contact',
          'eligibility',
          'job_application',
          'employer_inquiry',
        ],
        message: '{VALUE} is not a valid lead type',
      },
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },
    country: {
      type: String,
      trim: true,
      default: null,
    },
    course: {
      type: String,
      trim: true,
      default: null,
    },
    degreeLevel: {
      type: String,
      trim: true,
      default: null,
    },
    preferredCallTime: {
      type: String,
      trim: true,
      default: null,
    },
    jobCategory: {
      type: String,
      trim: true,
      default: null,
    },
    preferredCountry: {
      type: String,
      trim: true,
      default: null,
    },
    experience: {
      type: String,
      trim: true,
      default: null,
    },
    currentCity: {
      type: String,
      trim: true,
      default: null,
    },
    companyName: {
      type: String,
      trim: true,
      default: null,
    },
    positionsNeeded: {
      type: String,
      trim: true,
      default: null,
    },
    workersCount: {
      type: String,
      trim: true,
      default: null,
    },
    message: {
      type: String,
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
      default: null,
    },
    cvFile: {
      type: String,
      trim: true,
      default: null,
    },
    sourcePage: {
      type: String,
      trim: true,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ['new', 'contacted', 'in_progress', 'converted', 'closed'],
        message: '{VALUE} is not a valid lead status',
      },
      default: 'new',
      trim: true,
    },
    notes: [noteSchema],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast searching, filtering, and sorting
leadSchema.index({ type: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ country: 1 });
leadSchema.index({ assignedTo: 1 });

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;
