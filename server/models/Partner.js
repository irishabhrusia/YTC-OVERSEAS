const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Partner name is required'],
      trim: true,
    },
    logo: {
      type: String,
      required: [true, 'Partner logo is required'],
      trim: true,
    },
    website: {
      type: String,
      default: '',
      trim: true,
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

partnerSchema.index({ order: 1 });

const Partner = mongoose.model('Partner', partnerSchema);

module.exports = Partner;

