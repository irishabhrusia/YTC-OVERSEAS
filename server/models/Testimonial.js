const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    photo: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      trim: true,
      default: '',
    },
    university: {
      type: String,
      trim: true,
      default: '',
    },
    course: {
      type: String,
      trim: true,
      default: '',
    },
    result: {
      type: String,
      trim: true,
      default: '',
    },
    text: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    type: {
      type: String,
      enum: ['testimonial', 'success_story'],
      default: 'testimonial',
      index: true,
    },
    videoUrl: {
      type: String,
      default: '',
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

testimonialSchema.index({ order: 1 });

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

module.exports = Testimonial;

