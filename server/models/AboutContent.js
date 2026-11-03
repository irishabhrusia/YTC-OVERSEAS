const mongoose = require('mongoose');

const aboutContentSchema = new mongoose.Schema(
  {
    header: {
      badge: { type: String, default: 'WHO WE ARE', trim: true },
      title: { type: String, default: 'Pioneering Your Global Education & Career Pathways', trim: true },
      description: {
        type: String,
        default:
          'For over a decade, YTC Global Education has stood as a trusted partner, empowering ambitious students and professionals to unlock opportunities worldwide.',
        trim: true,
      },
      image: { type: String, default: '/images/why-choose-student.jpg', trim: true },
      imageAlt: { type: String, default: 'YTC Global Education Team & Students', trim: true },
    },
    aboutStats: [
      {
        value: { type: String, default: '10+' },
        label: { type: String, default: 'Years of Experience' },
        detail: { type: String, default: 'Guiding global ambitions since 2015' },
      },
    ],
    briefHistory: {
      tag: { type: String, default: 'OUR HERITAGE & ORIGINS', trim: true },
      title: { type: String, default: 'A Decade of Uncompromising Ethics & Transformative Journeys', trim: true },
      p1: { type: String, default: '' },
      p2: { type: String, default: '' },
      p3: { type: String, default: '' },
      paragraphs: [
        {
          type: String,
        },
      ],
      quote: {
        text: {
          type: String,
          default:
            "Education abroad isn't merely about getting a visa stamp; it's about altering the trajectory of a family's future for generations. That responsibility demands our absolute best every single day.",
        },
        author: { type: String, default: 'Dr. Sarah Jenkins' },
        designation: { type: String, default: 'Founder & Managing Director, YTC Global Education' },
      },
      highlights: [
        {
          year: { type: String, default: '2015' },
          label: { type: String, default: 'Founded in humble counseling suite' },
        },
      ],
    },
    coreValues: [
      {
        icon: { type: String, default: 'ShieldCheck' },
        title: { type: String, default: 'Integrity & Transparency' },
        desc: {
          type: String,
          default: 'Zero hidden fees, honest admission guidance, and realistic university matching based purely on merit and budget.',
        },
        accent: { type: String, default: 'blue' },
      },
    ],
    leadershipTeam: [
      {
        name: { type: String, default: '' },
        role: { type: String, default: '' },
        experience: { type: String, default: '' },
        image: { type: String, default: '' },
        bio: { type: String, default: '' },
        specialty: { type: String, default: '' },
      },
    ],
    recognitions: [
      {
        year: { type: String, default: '2024' },
        title: { type: String, default: '' },
        issuedBy: { type: String, default: '' },
        description: { type: String, default: '' },
        badge: { type: String, default: '' },
      },
    ],
    partnerWithUs: {
      tag: { type: String, default: 'GLOBAL COLLABORATIONS', trim: true },
      title: { type: String, default: 'Partner With YTC Global Education', trim: true },
      subtitle: {
        type: String,
        default:
          'Whether you represent a prestigious university, a multinational employer, or an academic affiliate, we cultivate mutually prosperous global partnerships.',
      },
      categories: [
        {
          title: { type: String, default: '' },
          icon: { type: String, default: 'Building2' },
          description: { type: String, default: '' },
          perks: [{ type: String }],
          ctaText: { type: String, default: 'Learn More' },
        },
      ],
    },
    offices: [
      {
        type: { type: String, default: 'Global Headquarters' },
        city: { type: String, default: '' },
        country: { type: String, default: '' },
        address: { type: String, default: '' },
        phone: { type: String, default: '' },
        email: { type: String, default: '' },
        timing: { type: String, default: '' },
        mapQuery: { type: String, default: '' },
        badge: { type: String, default: '' },
        image: { type: String, default: '' },
      },
    ],
    accreditations: [
      {
        name: { type: String, default: '' },
        badge: { type: String, default: 'Certified' },
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

module.exports = mongoose.model('AboutContent', aboutContentSchema);

