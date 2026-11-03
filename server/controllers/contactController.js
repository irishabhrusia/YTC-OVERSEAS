const ContactSettings = require('../models/ContactSettings');
const AboutContent = require('../models/AboutContent');
const asyncHandler = require('../utils/asyncHandler');

const defaultContact = {
  headquarters: {
    title: 'Corporate Headquarters',
    subtitle: 'Downtown Dubai, UAE',
    address: 'Level 14, Boulevard Plaza Tower 1, Downtown Dubai, United Arab Emirates',
    phone: '+971 4 800 9821',
    email: 'info@ytcglobal.com',
    hours: 'Sun - Thu: 9:00 AM - 6:00 PM (GMT +4)',
    photo: '',
  },
  regionalLoungesTitle: 'Regional Liaison Lounges',
  regionalLounges: [
    {
      city: 'New Delhi',
      country: 'India',
      badge: 'Admissions Hub',
      address: 'Suite 402, Connaught Place, Inner Circle, New Delhi',
      phone: '+91 11 4987 6500',
      email: 'delhi@ytcglobal.com',
      hours: 'Mon - Sat: 9:30 AM - 6:30 PM',
      photo: '',
    },
    {
      city: 'London',
      country: 'United Kingdom',
      badge: 'Student Support',
      address: '88 Kingsway, Holborn, London WC2B 6AA',
      phone: '+44 20 7946 0912',
      email: 'london@ytcglobal.com',
      hours: 'Mon - Fri: 9:00 AM - 5:30 PM',
      photo: '',
    },
    {
      city: 'Toronto',
      country: 'Canada',
      badge: 'Post Arrival Hub',
      address: '250 University Avenue, Suite 200, Toronto, ON M5H 3E5',
      phone: '+1 416 555 0194',
      email: 'toronto@ytcglobal.com',
      hours: 'Mon - Fri: 9:00 AM - 5:00 PM',
      photo: '',
    },
  ],
  isActive: true,
};

/**
 * Public GET /api/settings/contact
 * Retrieves contact & liaison lounge settings
 */
const getContactSettings = asyncHandler(async (req, res) => {
  let contact = await ContactSettings.findOne();

  if (!contact) {
    // If ContactSettings doesn't exist yet, seed it from defaults
    contact = await ContactSettings.create(defaultContact);
  }

  res.status(200).json({
    success: true,
    data: contact,
  });
});

/**
 * Admin PUT /api/admin/settings/contact
 * Updates corporate headquarters and regional liaison lounges
 */
const updateContactSettings = asyncHandler(async (req, res) => {
  const body = req.body || {};

  let contact = await ContactSettings.findOne();
  if (!contact) {
    contact = await ContactSettings.create({ ...defaultContact, ...body });
  } else {
    contact = await ContactSettings.findByIdAndUpdate(contact._id, body, {
      new: true,
      runValidators: false,
    });
  }

  // Also sync with AboutContent.offices so /about stays up-to-date
  try {
    const hq = contact.headquarters || {};
    const lounges = Array.isArray(contact.regionalLounges) ? contact.regionalLounges : [];

    const compiledOffices = [
      {
        type: 'Global Headquarters',
        city: 'Dubai',
        country: 'United Arab Emirates',
        address: hq.address || 'Level 14, Boulevard Plaza Tower 1, Downtown Dubai',
        phone: hq.phone || '+971 4 800 9821',
        email: hq.email || 'info@ytcglobal.com',
        timing: hq.hours || 'Sun - Thu: 9:00 AM - 6:00 PM',
        hours: hq.hours || 'Sun - Thu: 9:00 AM - 6:00 PM',
        badge: 'Corporate Headquarters',
        image: hq.photo || '',
      },
      ...lounges.map((l) => ({
        type: 'Regional Liaison Lounge',
        city: l.city || '',
        country: l.country || '',
        address: l.address || '',
        phone: l.phone || '',
        email: l.email || '',
        timing: l.hours || '',
        hours: l.hours || '',
        badge: l.badge || 'Admissions Hub',
        image: l.photo || '',
      })),
    ];

    await AboutContent.findOneAndUpdate(
      {},
      { $set: { offices: compiledOffices } },
      { new: true }
    );
  } catch (syncErr) {
    console.warn('[updateContactSettings] Sync to AboutContent warning:', syncErr.message);
  }

  res.status(200).json({
    success: true,
    message: 'Corporate headquarters and liaison lounges updated successfully',
    data: contact,
  });
});

module.exports = {
  getContactSettings,
  updateContactSettings,
};

