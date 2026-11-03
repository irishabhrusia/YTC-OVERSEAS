const mongoose = require('mongoose');
const Lead = require('../models/Lead');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Builds the MongoDB query from request params including counsellor scoping
 */
const buildLeadFilter = (req) => {
  const {
    type,
    status,
    country,
    assignedTo,
    startDate,
    endDate,
    search,
  } = req.query;

  const query = {};

  // Role scoping: Counsellors can only see leads assigned to them or unassigned
  if (req.admin && req.admin.role === 'counsellor') {
    query.$or = [{ assignedTo: req.admin._id }, { assignedTo: null }];
  } else if (assignedTo) {
    if (assignedTo === 'unassigned') {
      query.assignedTo = null;
    } else if (mongoose.Types.ObjectId.isValid(assignedTo)) {
      query.assignedTo = assignedTo;
    }
  }

  if (type) {
    query.type = type;
  }

  if (status) {
    query.status = status;
  }

  if (country) {
    const countryRegex = { $regex: country.trim(), $options: 'i' };
    const countryConditions = [
      { country: countryRegex },
      { preferredCountry: countryRegex },
    ];
    if (query.$or) {
      query.$and = [{ $or: query.$or }, { $or: countryConditions }];
      delete query.$or;
    } else {
      query.$or = countryConditions;
    }
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.createdAt.$lte = end;
    }
  }

  if (search && search.trim().length > 0) {
    const searchRegex = { $regex: search.trim(), $options: 'i' };
    const searchConditions = [
      { name: searchRegex },
      { phone: searchRegex },
      { email: searchRegex },
      { companyName: searchRegex },
    ];

    if (query.$and) {
      query.$and.push({ $or: searchConditions });
    } else if (query.$or) {
      query.$and = [{ $or: query.$or }, { $or: searchConditions }];
      delete query.$or;
    } else {
      query.$or = searchConditions;
    }
  }

  return query;
};

/**
 * GET /api/admin/leads: list leads with pagination, filters, search, and sorting
 */
const getAdminLeads = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sort = 'newest' } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const query = buildLeadFilter(req);

  let sortOption = { createdAt: -1 };
  if (sort === 'oldest') sortOption = { createdAt: 1 };
  if (sort === 'status') sortOption = { status: 1, createdAt: -1 };

  const [leads, total] = await Promise.all([
    Lead.find(query)
      .populate('assignedTo', 'name email role')
      .populate('notes.createdBy', 'name email')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum),
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
 * GET /api/admin/leads/:id: Get lead details
 */
const getAdminLeadById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid lead ID format',
    });
  }

  const lead = await Lead.findById(id)
    .populate('assignedTo', 'name email role')
    .populate('notes.createdBy', 'name email');

  if (!lead) {
    return res.status(404).json({
      success: false,
      message: 'Lead not found',
    });
  }

  // Counsellor access check
  if (
    req.admin &&
    req.admin.role === 'counsellor' &&
    lead.assignedTo &&
    lead.assignedTo._id.toString() !== req.admin._id.toString()
  ) {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: You are not assigned to this lead',
    });
  }

  res.status(200).json({
    success: true,
    data: lead,
  });
});

/**
 * PATCH /api/admin/leads/:id: Update status, assignTo, and add notes
 */
const updateAdminLead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, note, assignedTo } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid lead ID format',
    });
  }

  const lead = await Lead.findById(id);
  if (!lead) {
    return res.status(404).json({
      success: false,
      message: 'Lead not found',
    });
  }

  if (status) lead.status = status;
  if (assignedTo !== undefined) lead.assignedTo = assignedTo || null;

  if (note && typeof note === 'string' && note.trim().length > 0) {
    lead.notes.push({
      text: note.trim(),
      createdBy: req.admin ? req.admin._id : null,
      createdAt: new Date(),
    });
  }

  await lead.save();

  const populatedLead = await Lead.findById(id)
    .populate('assignedTo', 'name email role')
    .populate('notes.createdBy', 'name email');

  res.status(200).json({
    success: true,
    message: 'Lead updated successfully',
    data: populatedLead,
  });
});

/**
 * DELETE /api/admin/leads/:id: Delete lead (super_admin only)
 */
const deleteAdminLead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid lead ID format',
    });
  }

  const lead = await Lead.findByIdAndDelete(id);
  if (!lead) {
    return res.status(404).json({
      success: false,
      message: 'Lead not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Lead deleted successfully',
  });
});

/**
 * Helper to escape CSV fields and mitigate CSV Formula Injection (=, +, -, @)
 */
const sanitizeCsvCell = (val) => {
  if (val === null || val === undefined) return '""';
  let str = String(val).replace(/"/g, '""');

  // Prefix formula trigger characters with a single quote
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }

  return `"${str}"`;
};

/**
 * GET /api/admin/leads/export: CSV export with filters
 */
const exportLeadsCsv = asyncHandler(async (req, res) => {
  const query = buildLeadFilter(req);

  const leads = await Lead.find(query)
    .populate('assignedTo', 'name email')
    .sort({ createdAt: -1 })
    .limit(5000);

  const headers = [
    'ID',
    'Created At',
    'Type',
    'Status',
    'Name',
    'Phone',
    'Email',
    'Country',
    'Course/Degree',
    'Job Category',
    'Company Name',
    'Assigned To',
    'Source Page',
    'Message',
  ];

  const rows = leads.map((lead) => [
    lead._id,
    lead.createdAt ? lead.createdAt.toISOString() : '',
    lead.type,
    lead.status,
    lead.name,
    lead.phone,
    lead.email || '',
    lead.country || lead.preferredCountry || '',
    lead.course || lead.degreeLevel || '',
    lead.jobCategory || '',
    lead.companyName || '',
    lead.assignedTo ? lead.assignedTo.name : 'Unassigned',
    lead.sourcePage || '',
    lead.message || '',
  ]);

  const csvContent = [
    headers.map(sanitizeCsvCell).join(','),
    ...rows.map((row) => row.map(sanitizeCsvCell).join(',')),
  ].join('\r\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="leads-export-${new Date().toISOString().slice(0, 10)}.csv"`
  );

  res.status(200).send(csvContent);
});

module.exports = {
  getAdminLeads,
  getAdminLeadById,
  updateAdminLead,
  deleteAdminLead,
  exportLeadsCsv,
};

