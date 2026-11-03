const Lead = require('../models/Lead');
const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');
const asyncHandler = require('../utils/asyncHandler');

/**
 * GET /api/admin/stats: Comprehensive analytics dashboard
 */
const getAdminStats = asyncHandler(async (req, res) => {
  const now = new Date();

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Run totals and metrics in parallel
  const [
    totalLeads,
    newLeadsToday,
    newLeadsThisWeek,
    newLeadsThisMonth,
    jobApplications,
    openJobs,
    convertedCount,
    leadsByTypeAgg,
    leadsByStatusAgg,
    leadsByCountryAgg,
    leadsPerDayAgg,
    recentLeads,
  ] = await Promise.all([
    Lead.countDocuments(),
    Lead.countDocuments({ createdAt: { $gte: startOfToday } }),
    Lead.countDocuments({ createdAt: { $gte: startOfWeek } }),
    Lead.countDocuments({ createdAt: { $gte: startOfMonth } }),
    JobApplication.countDocuments(),
    Job.countDocuments({ isOpen: true, isActive: true }),
    Lead.countDocuments({ status: 'converted' }),

    // Group leads by type
    Lead.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $project: { type: '$_id', count: 1, _id: 0 } },
    ]),

    // Group leads by status
    Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { status: '$_id', count: 1, _id: 0 } },
    ]),

    // Group leads by top countries (top 8)
    Lead.aggregate([
      {
        $project: {
          effectiveCountry: { $ifNull: ['$country', '$preferredCountry'] },
        },
      },
      { $match: { effectiveCountry: { $ne: null, $nin: ['', null] } } },
      { $group: { _id: '$effectiveCountry', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
      { $project: { country: '$_id', count: 1, _id: 0 } },
    ]),

    // Leads per day for the last 30 days
    Lead.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', count: 1, _id: 0 } },
    ]),

    // 5 most recent leads
    Lead.find()
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  const conversionRate =
    totalLeads > 0 ? Number(((convertedCount / totalLeads) * 100).toFixed(1)) : 0;

  res.status(200).json({
    success: true,
    data: {
      totals: {
        leads: totalLeads,
        newLeadsToday,
        newLeadsThisWeek,
        newLeadsThisMonth,
        jobApplications,
        openJobs,
      },
      conversionRate,
      leadsByType: leadsByTypeAgg,
      leadsByStatus: leadsByStatusAgg,
      leadsByCountry: leadsByCountryAgg,
      leadsPerDay: leadsPerDayAgg,
      recentLeads,
    },
  });
});

module.exports = {
  getAdminStats,
};

