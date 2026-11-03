const mongoose = require('mongoose');

const heroContentSchema = new mongoose.Schema(
  {
    tag: {
      type: String,
      default: 'Study Abroad Consultancy',
      trim: true,
    },
    badgeText: {
      type: String,
      default: 'Admissions Open 2026-2027',
      trim: true,
    },
    headline: {
      line1: {
        type: String,
        default: 'Your Dream to Study',
        trim: true,
      },
      line2: {
        type: String,
        default: 'Abroad, ',
        trim: true,
      },
      highlight: {
        type: String,
        default: 'Our Priority',
        trim: true,
      },
    },
    description: {
      type: String,
      default:
        'YTC Global Education helps you explore overseas education opportunities, find top-ranked universities, and build a brighter future with expert guidance at every step.',
      trim: true,
    },
    primaryBtnText: {
      type: String,
      default: 'Start Your Journey',
      trim: true,
    },
    primaryBtnAction: {
      type: String,
      default: 'consultation',
      trim: true,
    },
    secondaryBtnText: {
      type: String,
      default: 'Explore Universities',
      trim: true,
    },
    secondaryBtnLink: {
      type: String,
      default: '/destinations',
      trim: true,
    },
    stats: [
      {
        label: { type: String, default: 'Happy Students' },
        value: { type: String, default: '10K+' },
        iconType: { type: String, default: 'users' },
      },
    ],
    heroImage: {
      type: String,
      default: '/images/hero-student.jpg',
      trim: true,
    },
    reviewCardText: {
      type: String,
      default: 'Better Education Brighter Future ✨',
      trim: true,
    },
    reviewCardStars: {
      type: Number,
      default: 5,
    },
    achievementBadgeTitle: {
      type: String,
      default: '99% Visa Success',
      trim: true,
    },
    achievementBadgeSub: {
      type: String,
      default: 'Certified Counselors',
      trim: true,
    },
    brandBadgeText: {
      type: String,
      default: 'YTC GLOBAL',
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

const HeroContent = mongoose.model('HeroContent', heroContentSchema);

module.exports = HeroContent;

