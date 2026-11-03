const FooterSettings = require('../models/FooterSettings');
const asyncHandler = require('../utils/asyncHandler');

const defaultFooter = {
  socialLinks: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com',
    twitter: 'https://x.com',
    whatsapp: '',
  },
  recognitions: [
    { name: 'AIRC Accredited', badge: 'Accredited', icon: 'ShieldCheck', url: 'https://www.airc.education' },
    { name: 'ICEF Quality Agent', badge: 'Certified', icon: 'Award', url: 'https://www.icef.com' },
    { name: 'British Council Trained', badge: 'Trained', icon: 'CheckCircle2', url: 'https://www.britishcouncil.org' },
    { name: 'Education New Zealand Recognized', badge: 'Recognized', icon: 'Globe', url: 'https://www.enz.govt.nz' },
    { name: 'PIER QEAC Certified', badge: 'Certified', icon: 'GraduationCap', url: 'https://pieronline.org' },
  ],
  agencyBadge: {
    title: 'AIRC & ICEF CERTIFIED',
    subtitle: 'Global Trusted Agency',
    url: '',
  },
  copyrightText: '© 2026 YTC Global Education. Developed with ❤️ by Goatlabs. All rights reserved.',
  isActive: true,
};

/**
 * Public GET /api/settings/footer
 * Retrieves footer settings or initializes default document
 */
const getFooterSettings = asyncHandler(async (req, res) => {
  let footer = await FooterSettings.findOne();
  if (!footer) {
    footer = await FooterSettings.create(defaultFooter);
  }

  res.status(200).json({
    success: true,
    data: footer,
  });
});

/**
 * Admin PUT /api/admin/settings/footer
 * Updates footer settings
 */
const updateFooterSettings = asyncHandler(async (req, res) => {
  const body = req.body || {};

  let footer = await FooterSettings.findOne();
  if (!footer) {
    footer = await FooterSettings.create({ ...defaultFooter, ...body });
  } else {
    footer = await FooterSettings.findByIdAndUpdate(footer._id, body, {
      new: true,
      runValidators: false,
    });
  }

  res.status(200).json({
    success: true,
    message: 'Footer settings updated successfully',
    data: footer,
  });
});

module.exports = {
  getFooterSettings,
  updateFooterSettings,
};

