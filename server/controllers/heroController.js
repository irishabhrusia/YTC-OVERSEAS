const HeroContent = require('../models/HeroContent');
const asyncHandler = require('../utils/asyncHandler');

// Default initial state matching the live site
const defaultHero = {
  tag: 'Study Abroad Consultancy',
  badgeText: 'Admissions Open 2026-2027',
  headline: {
    line1: 'Your Dream to Study',
    line2: 'Abroad, ',
    highlight: 'Our Priority',
  },
  description:
    'YTC Global Education helps you explore overseas education opportunities, find top-ranked universities, and build a brighter future with expert guidance at every step.',
  primaryBtnText: 'Start Your Journey',
  primaryBtnAction: 'consultation',
  secondaryBtnText: 'Explore Universities',
  secondaryBtnLink: '/destinations',
  stats: [
    { label: 'Happy Students', value: '10K+', iconType: 'users' },
    { label: 'Partner Universities', value: '50+', iconType: 'building' },
    { label: 'Countries', value: '15+', iconType: 'globe' },
  ],
  heroImage: '/images/hero-student.jpg',
  reviewCardText: 'Better Education Brighter Future ✨',
  reviewCardStars: 5,
  achievementBadgeTitle: '99% Visa Success',
  achievementBadgeSub: 'Certified Counselors',
  brandBadgeText: 'YTC GLOBAL',
  isActive: true,
};

/**
 * Public GET /api/hero
 * Retrieves hero content or creates initial default
 */
const getHeroContent = asyncHandler(async (req, res) => {
  let hero = await HeroContent.findOne();
  if (!hero) {
    hero = await HeroContent.create(defaultHero);
  }

  res.status(200).json({
    success: true,
    data: hero,
  });
});

/**
 * Admin PUT /api/admin/hero or POST /api/admin/hero
 * Updates or creates the hero content
 */
const updateHeroContent = asyncHandler(async (req, res) => {
  let hero = await HeroContent.findOne();
  if (!hero) {
    hero = await HeroContent.create({ ...defaultHero, ...req.body });
  } else {
    hero = await HeroContent.findByIdAndUpdate(hero._id, req.body, {
      new: true,
      runValidators: true,
    });
  }

  res.status(200).json({
    success: true,
    message: 'Hero section updated successfully',
    data: hero,
  });
});

module.exports = {
  getHeroContent,
  updateHeroContent,
};

