const Subscriber = require('../models/Subscriber');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Public POST /api/newsletter/subscribe
 * Adds a new email subscriber from website forms
 */
const subscribe = asyncHandler(async (req, res) => {
  const { email, interest } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.',
    });
  }

  const cleanEmail = email.trim().toLowerCase();
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(cleanEmail)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.',
    });
  }

  let subscriber = await Subscriber.findOne({ email: cleanEmail });

  if (subscriber) {
    if (interest && subscriber.interest !== interest) {
      subscriber.interest = interest;
      subscriber.isActive = true;
      await subscriber.save();
    }
    return res.status(200).json({
      success: true,
      message: 'You are already subscribed to YTC Global updates!',
      data: {
        id: subscriber._id,
        email: subscriber.email,
        interest: subscriber.interest,
      },
    });
  }

  subscriber = await Subscriber.create({
    email: cleanEmail,
    interest: interest || 'all',
    source: 'footer_newsletter',
  });

  res.status(201).json({
    success: true,
    message: 'Thank you for subscribing! Check your inbox for updates.',
    data: {
      id: subscriber._id,
      email: subscriber.email,
      interest: subscriber.interest,
    },
  });
});

/**
 * Admin GET /api/admin/newsletter/subscribers
 */
const getSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await Subscriber.find().sort({ createdAt: -1 }).limit(1000);
  res.status(200).json({
    success: true,
    count: subscribers.length,
    data: subscribers,
  });
});

module.exports = {
  subscribe,
  getSubscribers,
};

