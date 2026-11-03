const mongoose = require('mongoose');

const contactSettingsSchema = new mongoose.Schema(
  {
    headquarters: {
      title: { type: String, default: 'Corporate Headquarters', trim: true },
      subtitle: { type: String, default: 'Downtown Dubai, UAE', trim: true },
      address: {
        type: String,
        default: 'Level 14, Boulevard Plaza Tower 1, Downtown Dubai, United Arab Emirates',
        trim: true,
      },
      phone: { type: String, default: '+971 4 800 9821', trim: true },
      email: { type: String, default: 'info@ytcglobal.com', trim: true },
      hours: { type: String, default: 'Sun - Thu: 9:00 AM - 6:00 PM (GMT +4)', trim: true },
      photo: { type: String, default: '', trim: true },
    },
    regionalLoungesTitle: {
      type: String,
      default: 'Regional Liaison Lounges',
      trim: true,
    },
    regionalLounges: [
      {
        city: { type: String, default: '', trim: true },
        country: { type: String, default: '', trim: true },
        badge: { type: String, default: 'Admissions Hub', trim: true },
        address: { type: String, default: '', trim: true },
        phone: { type: String, default: '', trim: true },
        email: { type: String, default: '', trim: true },
        hours: { type: String, default: '', trim: true },
        photo: { type: String, default: '', trim: true },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

module.exports = mongoose.model('ContactSettings', contactSettingsSchema);

