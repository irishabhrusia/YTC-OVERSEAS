const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const JobApplication = require('../models/JobApplication');
const Lead = require('../models/Lead');
const asyncHandler = require('../utils/asyncHandler');
const { uploadService } = require('../services/uploadService');

/**
 * Public: Submit job application with optional CV file upload
 */
const submitApplication = asyncHandler(async (req, res) => {
  const { website, ...data } = req.body;

  // Honeypot spam check
  if (website && typeof website === 'string' && website.trim().length > 0) {
    if (req.file) {
      uploadService.deleteFile(req.file.path);
    }
    return res.status(200).json({
      success: true,
      message: 'Thank you, your application has been received.',
    });
  }

  const cvFileName = req.file ? req.file.filename : null;
  const validJobId = (data.job && mongoose.Types.ObjectId.isValid(data.job)) ? data.job : null;

  const application = await JobApplication.create({
    job: validJobId,
    name: data.name,
    phone: data.phone,
    email: data.email || null,
    currentCity: data.currentCity || null,
    jobCategory: data.jobCategory || null,
    preferredCountry: data.preferredCountry || null,
    experience: data.experience || null,
    message: data.message || null,
    cvFile: cvFileName,
    status: 'received',
  });

  // Create corresponding Lead of type "job_application" so it reflects in the leads system
  await Lead.create({
    type: 'job_application',
    name: data.name,
    phone: data.phone,
    email: data.email || null,
    currentCity: data.currentCity || null,
    jobCategory: data.jobCategory || null,
    preferredCountry: data.preferredCountry || null,
    experience: data.experience || null,
    message: data.message || null,
    sourcePage: data.sourcePage || '/overseas-recruitment',
  });

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully',
    data: application,
  });
});

/**
 * Admin: Get all job applications with filters and pagination
 */
const getApplications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, category, country } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const filter = {};
  if (status) filter.status = status;
  if (category) filter.jobCategory = category;
  if (country) filter.preferredCountry = country;

  // Counsellors can only see assigned or unassigned
  if (req.admin && req.admin.role === 'counsellor') {
    filter.$or = [{ assignedTo: req.admin._id }, { assignedTo: null }];
  }

  const [applications, total] = await Promise.all([
    JobApplication.find(filter)
      .populate('job', 'title category country')
      .populate('assignedTo', 'name email')
      .populate('notes.createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    JobApplication.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: {
      applications,
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
 * Admin: Get single job application
 */
const getApplicationById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const application = await JobApplication.findById(id)
    .populate('job', 'title category country')
    .populate('assignedTo', 'name email')
    .populate('notes.createdBy', 'name');

  if (!application) {
    return res.status(404).json({
      success: false,
      message: 'Job application not found',
    });
  }

  res.status(200).json({
    success: true,
    data: application,
  });
});

/**
 * Admin: Update application status, assign to counsellor, and add notes
 */
const updateApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, note, assignedTo } = req.body;

  const application = await JobApplication.findById(id);
  if (!application) {
    return res.status(404).json({
      success: false,
      message: 'Job application not found',
    });
  }

  if (status) application.status = status;
  if (assignedTo !== undefined) application.assignedTo = assignedTo;

  if (note && note.trim().length > 0) {
    application.notes.push({
      text: note.trim(),
      createdBy: req.admin ? req.admin._id : null,
      createdAt: new Date(),
    });
  }

  await application.save();

  res.status(200).json({
    success: true,
    message: 'Application updated successfully',
    data: application,
  });
});

/**
 * Admin: Securely download applicant CV
 */
const downloadCv = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const application = await JobApplication.findById(id);

  if (!application || !application.cvFile) {
    return res.status(404).json({
      success: false,
      message: 'CV file not found for this applicant',
    });
  }

  const cvPath = path.join(uploadService.getCvDirectory(), application.cvFile);

  if (!fs.existsSync(cvPath)) {
    return res.status(404).json({
      success: false,
      message: 'CV file not found on disk',
    });
  }

  res.download(cvPath, `${application.name.replace(/\s+/g, '_')}_CV${path.extname(application.cvFile)}`);
});

module.exports = {
  submitApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  downloadCv,
};

