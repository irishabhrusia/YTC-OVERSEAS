const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Course name is required'],
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
      trim: true,
      default: 'General',
      index: true,
    },
    level: {
      type: String,
      enum: ['Bachelor', 'Master', 'Diploma', 'PhD'],
      required: [true, 'Course level is required'],
      index: true,
    },
    duration: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    countries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
      },
    ],
    isPopular: {
      type: Boolean,
      default: false,
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

courseSchema.index({ order: 1 });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;

