const mongoose = require('mongoose');

const applicationNoteSchema = new mongoose.Schema(
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

const jobApplicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      default: null,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
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
    currentCity: {
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
    message: {
      type: String,
      trim: true,
      default: null,
    },
    cvFile: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['received', 'pending', 'reviewed', 'shortlisted', 'interview', 'rejected', 'placed', 'hired'],
      default: 'received',
      index: true,
    },
    notes: [applicationNoteSchema],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

jobApplicationSchema.index({ createdAt: -1 });

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

module.exports = JobApplication;

