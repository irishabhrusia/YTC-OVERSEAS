const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      default: 'Other',
      index: true,
    },
    type: {
      type: String,
      default: 'full_time',
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      index: true,
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    salaryRange: {
      type: String,
      trim: true,
      default: '',
    },
    experienceRequired: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    requirements: [
      {
        type: String,
        trim: true,
      },
    ],
    benefits: [
      {
        type: String,
        trim: true,
      },
    ],
    openings: {
      type: Number,
      default: 1,
    },
    deadline: {
      type: Date,
      default: null,
    },
    isOpen: {
      type: Boolean,
      default: true,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.index({ title: 'text', description: 'text' });
jobSchema.index({ order: 1 });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;

