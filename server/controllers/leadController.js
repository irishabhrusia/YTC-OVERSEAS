const mongoose = require('mongoose');
const Lead = require('../models/Lead');
const JobApplication = require('../models/JobApplication');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Create a new lead (public)
 * @route   POST /api/leads
 * @access  Public
 */
const createLead = asyncHandler(async (req, res) => {
  const { website, ...leadData } = req.body;

  // Honeypot spam check: If 'website' has any value, simulate success without saving
  if (website && typeof website === 'string' && website.trim().length > 0) {
    return res.status(200).json({
      success: true,
      message: 'Thank you, your submission has been received.',
      data: null,
    });
  }

  const lead = await Lead.create(leadData);

  // Safety net: ensure any job_application lead also creates a JobApplication record
  if (leadData.type === 'job_application') {
    try {
      const validJobId = (leadData.job && mongoose.Types.ObjectId.isValid(leadData.job)) ? leadData.job : null;
      await JobApplication.create({
        job: validJobId,
        name: leadData.name,
        phone: leadData.phone,
        email: leadData.email || null,
        currentCity: leadData.currentCity || null,
        jobCategory: leadData.jobCategory || null,
        preferredCountry: leadData.preferredCountry || null,
        experience: leadData.experience || null,
        message: leadData.message || null,
        cvFile: leadData.cvFile || null,
        status: 'received',
      });
    } catch (err) {
      console.error('[leadController] Failed to create JobApplication:', err.message);
    }
  }

  res.status(201).json({
    success: true,
    message: 'Lead created successfully',
    data: lead,
  });
});

/**
 * @desc    Get all leads with filters, search, and pagination
 * @route   GET /api/leads
 * @access  Private (Admin)
 */
const getLeads = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    type,
    status,
    country,
    search,
  } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  // Build filter query
  const query = {};

  if (type) {
    query.type = type;
  }

  if (status) {
    query.status = status;
  }

  if (country) {
    // Match either student country or employer country
    query.$or = [
      { country: { $regex: country, $options: 'i' } },
      { preferredCountry: { $regex: country, $options: 'i' } },
    ];
  }

  if (search && search.trim().length > 0) {
    const searchRegex = { $regex: search.trim(), $options: 'i' };
    const searchConditions = [
      { name: searchRegex },
      { phone: searchRegex },
      { email: searchRegex },
      { companyName: searchRegex },
    ];

    if (query.$or) {
      query.$and = [{ $or: query.$or }, { $or: searchConditions }];
      delete query.$or;
    } else {
      query.$or = searchConditions;
    }
  }

  // Fetch leads and total count in parallel (newest first)
  const [leads, total] = await Promise.all([
    Lead.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Lead.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: {
      leads,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
        hasNextPage: pageNum * limitNum < total,
        hasPrevPage: pageNum > 1,
      },
    },
  });
});

/**
 * @desc    Update lead status, add note, or update assignee
 * @route   PATCH /api/leads/:id
 * @access  Private (Admin)
 */
const updateLead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, note, assignedTo } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid lead id format',
    });
  }

  const lead = await Lead.findById(id);

  if (!lead) {
    return res.status(404).json({
      success: false,
      message: 'Lead not found',
    });
  }

  // Update status if provided
  if (status) {
    lead.status = status;
  }

  // Append note if provided
  if (note && typeof note === 'string' && note.trim().length > 0) {
    lead.notes.push({
      text: note.trim(),
      createdAt: new Date(),
    });
  }

  // Update assigned agent if provided
  if (assignedTo !== undefined) {
    lead.assignedTo = assignedTo;
  }

  await lead.save();

  res.status(200).json({
    success: true,
    message: 'Lead updated successfully',
    data: lead,
  });
});

module.exports = {
  createLead,
  getLeads,
  updateLead,
};
