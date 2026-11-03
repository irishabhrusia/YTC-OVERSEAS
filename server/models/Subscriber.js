const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
      index: true,
    },
    interest: {
      type: String,
      trim: true,
      default: 'all',
    },
    source: {
      type: String,
      trim: true,
      default: 'footer_newsletter',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Subscriber', subscriberSchema);

