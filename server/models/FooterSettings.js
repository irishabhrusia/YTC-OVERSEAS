const mongoose = require('mongoose');

const footerSettingsSchema = new mongoose.Schema(
  {
    socialLinks: {
      facebook: { type: String, default: 'https://facebook.com', trim: true },
      instagram: { type: String, default: 'https://instagram.com', trim: true },
      linkedin: { type: String, default: 'https://linkedin.com', trim: true },
      youtube: { type: String, default: 'https://youtube.com', trim: true },
      twitter: { type: String, default: 'https://x.com', trim: true },
      whatsapp: { type: String, default: '', trim: true },
    },
    recognitions: [
      {
        name: { type: String, default: '', trim: true },
        badge: { type: String, default: 'Certified', trim: true },
        icon: { type: String, default: 'ShieldCheck', trim: true },
        url: { type: String, default: '', trim: true },
      },
    ],
    agencyBadge: {
      title: { type: String, default: 'AIRC & ICEF CERTIFIED', trim: true },
      subtitle: { type: String, default: 'Global Trusted Agency', trim: true },
      url: { type: String, default: '', trim: true },
    },
    copyrightText: {
      type: String,
      default: '© 2026 YTC Global Education. Developed with ❤️ by Goatlabs. All rights reserved.',
      trim: true,
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

module.exports = mongoose.model('FooterSettings', footerSettingsSchema);

