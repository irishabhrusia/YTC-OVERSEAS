const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'University name is required'],
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
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
      required: [true, 'Country is required'],
      index: true,
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    logo: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    ranking: {
      type: String,
      default: '',
    },
    tuitionFrom: {
      type: Number,
      default: 0,
    },
    tuitionTo: {
      type: Number,
      default: 0,
    },
    intakes: [
      {
        type: String,
        trim: true,
      },
    ],
    website: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    popularCourses: [
      {
        type: String,
        trim: true,
      },
    ],
    isFeatured: {
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

universitySchema.index({ name: 'text', description: 'text' });
universitySchema.index({ tuitionFrom: 1, tuitionTo: 1 });
universitySchema.index({ order: 1 });

const University = mongoose.model('University', universitySchema);

module.exports = University;

