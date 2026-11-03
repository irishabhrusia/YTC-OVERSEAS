const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Country name is required'],
      trim: true,
    },
    shortName: {
      type: String,
      trim: true,
    },
    code: {
      type: String,
      trim: true,
      uppercase: true,
    },
    flag: {
      type: String,
      default: '',
    },
    flagPath: {
      type: String,
      trim: true,
    },
    heroImage: {
      type: String,
      default: '',
    },
    heroAlt: {
      type: String,
      default: '',
    },
    accentColor: {
      type: String,
      default: '#2563EB',
    },
    badge: {
      type: String,
      default: '',
    },
    headline: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    quickFacts: {
      capital: { type: String, default: '' },
      currency: { type: String, default: '' },
      intakes: { type: String, default: '' },
      majorIntakes: { type: String, default: '' },
      avgTuition: { type: String, default: '' },
      averageTuition: { type: String, default: '' },
      livingExpenses: { type: String, default: '' },
      visaProcessing: { type: String, default: '' },
      visaType: { type: String, default: '' },
    },
    stats: [
      {
        value: { type: String, default: '' },
        label: { type: String, default: '' },
      },
    ],
    whyStudy: [
      {
        title: { type: String, default: '' },
        desc: { type: String, default: '' },
      },
    ],
    topUniversities: [
      {
        name: { type: String, default: '' },
        qsRank: { type: String, default: '' },
        city: { type: String, default: '' },
        popularFor: { type: String, default: '' },
        acceptanceRate: { type: String, default: '' },
        avgTuition: { type: String, default: '' },
      },
    ],
    popularPrograms: [{ type: String }],
    visaRequirements: [{ type: String }],
    scholarships: [
      {
        name: { type: String, default: '' },
        coverage: { type: String, default: '' },
        eligibility: { type: String, default: '' },
      },
    ],
    faqs: [
      {
        question: { type: String, default: '' },
        answer: { type: String, default: '' },
      },
    ],
    seoTitle: {
      type: String,
      default: '',
    },
    seoDescription: {
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

countrySchema.index({ order: 1 });

const Country = mongoose.model('Country', countrySchema);

module.exports = Country;
