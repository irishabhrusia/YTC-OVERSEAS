const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Service description is required'],
      trim: true,
    },
    category: {
      type: String,
      default: 'Study Abroad Services',
    },
    categorySlug: {
      type: String,
      default: 'study-abroad',
    },
    tagline: {
      type: String,
      default: '',
    },
    badge: {
      type: String,
      default: '',
    },
    accentColor: {
      type: String,
      default: '#2563EB',
    },
    accentBg: {
      type: String,
      default: 'bg-blue-600',
    },
    iconName: {
      type: String,
      default: 'GraduationCap',
    },
    icon: {
      type: String,
      default: '',
    },
    group: {
      type: String,
      enum: {
        values: ['study', 'recruitment'],
        message: '{VALUE} must be either study or recruitment',
      },
      required: [true, 'Group is required'],
      index: true,
    },
    overview: {
      type: String,
      default: '',
    },
    stats: [
      {
        label: String,
        value: String,
      },
    ],
    deliverables: [
      {
        type: String,
      },
    ],
    process: [
      {
        step: String,
        title: String,
        desc: String,
      },
    ],
    faqs: [
      {
        q: String,
        a: String,
      },
    ],
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

serviceSchema.index({ order: 1 });

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;

