'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Inbox,
  CheckCircle2,
  Briefcase,
  Users,
  Download,
  ArrowRight,
  RefreshCw,
  Globe,
  Compass,
  AlertCircle,
  Clock,
  Eye,
} from 'lucide-react';
import { getAdminStats, exportLeadsCsv } from '../lib/adminApi';
import { useAdminAuth } from '../context/AdminAuthContext';
import StatsCard from '../component/admin/StatsCard';
import StatusBadge from '../component/admin/StatusBadge';
import LeadDetailModal from '../component/admin/LeadDetailModal';

export default function AdminDashboardPage() {
  const { user } = useAdminAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [exporting, setExporting] = useState(false);

  const fetchStats = useCallback(async () => {
    const res = await getAdminStats();
    if (res.success && res.data) {
      setStats(res.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      const res = await getAdminStats();
      if (!ignore) {
        if (res.success && res.data) {
          setStats(res.data);
        }
        setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const handleExportCsv = async () => {
    setExporting(true);
    const res = await exportLeadsCsv();
    setExporting(false);
    if (res.success && res.blob) {
      const url = window.URL.createObjectURL(res.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mb-3" />
        <p className="text-sm font-medium">Gathering analytics & leads data...</p>
      </div>
    );
  }

  const totals = stats?.totals || {};
  const totalLeads = totals.leads ?? 0;
  const newLeadsToday = totals.newLeadsToday ?? 0;
  const newLeadsThisWeek = totals.newLeadsThisWeek ?? 0;
  const jobApplications = totals.jobApplications ?? 0;
  const openJobs = totals.openJobs ?? 0;
  const conversionRate =
    stats?.conversionRate !== undefined ? `${stats.conversionRate}%` : '0%';

  const statusList = Array.isArray(stats?.leadsByStatus) ? stats.leadsByStatus : [];
  const typeList = Array.isArray(stats?.leadsByType) ? stats.leadsByType : [];
  const countryList = Array.isArray(stats?.leadsByCountry) ? stats.leadsByCountry : [];
  const recentLeads = Array.isArray(stats?.recentLeads) ? stats.recentLeads : [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-blue-600/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-medium text-white mb-3 backdrop-blur-xs">
            <Compass className="w-3.5 h-3.5" /> Portal Overview
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Administrator'}
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-xl">
            Monitor real-time student inquiries, manage study abroad leads, review job applications, and update website content.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCsv}
            disabled={exporting}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-blue-700 hover:bg-blue-50 rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{exporting ? 'Preparing CSV...' : 'Export Leads CSV'}</span>
          </button>

          <button
            onClick={fetchStats}
            title="Refresh statistics"
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Inquiries"
          value={totalLeads}
          subtitle={`${newLeadsThisWeek} submitted this week`}
          icon={Inbox}
          color="blue"
          trend={{ label: 'New Today', value: `+${newLeadsToday}`, positive: true }}
        />

        <StatsCard
          title="Conversion Rate"
          value={conversionRate}
          subtitle="Inquiries converted to enrolled"
          icon={CheckCircle2}
          color="emerald"
        />

        <StatsCard
          title="Job Applications"
          value={jobApplications}
          subtitle="Candidate submissions"
          icon={Briefcase}
          color="amber"
        />

        <StatsCard
          title="Active Job Openings"
          value={openJobs}
          subtitle="Live recruitment vacancies"
          icon={Users}
          color="purple"
        />
      </div>

      {/* Status & Type Distribution Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads by Status */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Lead Pipeline Status</h3>
            <Link href="/admin/leads" className="text-xs text-blue-600 hover:underline font-medium">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {statusList.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">No leads recorded yet.</p>
            ) : (
              statusList.map((item, idx) => {
                const statusKey = item.status || 'new';
                const count = item.count || 0;
                const total = totalLeads || 1;
                const percentage = Math.round((count / total) * 100);
                return (
                  <div key={statusKey || idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <StatusBadge status={statusKey} size="xs" />
                      <span className="font-semibold text-slate-700">
                        {count} <span className="text-slate-400 font-normal">({percentage}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          statusKey === 'new'
                            ? 'bg-blue-500'
                            : statusKey === 'converted'
                            ? 'bg-emerald-500'
                            : statusKey === 'contacted'
                            ? 'bg-amber-500'
                            : statusKey === 'in_progress'
                            ? 'bg-purple-500'
                            : 'bg-slate-400'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Leads by Type */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Inquiry Types</h3>
            <span className="text-xs text-slate-400">Total: {totalLeads}</span>
          </div>

          <div className="space-y-2.5">
            {typeList.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">No inquiries recorded yet.</p>
            ) : (
              typeList.map((item, idx) => {
                const typeKey = item.type || 'consultation';
                const count = item.count || 0;
                return (
                  <div
                    key={typeKey || idx}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 text-xs"
                  >
                    <StatusBadge type={typeKey} size="xs" />
                    <span className="font-bold text-slate-800">{count}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top Destination Countries */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Top Destinations</h3>
            <Globe className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-2">
            {countryList.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">
                Country inquiries will appear here.
              </p>
            ) : (
              countryList.map((item, idx) => (
                <div
                  key={item.country || idx}
                  className="flex items-center justify-between py-2 border-b border-slate-100 last:border-none text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-slate-800">{item.country || 'Unspecified'}</span>
                  </div>
                  <span className="font-semibold text-blue-600">{item.count} leads</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Leads Preview */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Student Leads</h3>
            <p className="text-xs text-slate-500">The latest submissions across website forms</p>
          </div>

          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            <span>View All Leads</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-100 font-semibold">
              <tr>
                <th className="py-3 px-4">Name & Contact</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Received</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                    No leads submitted yet.
                  </td>
                </tr>
              ) : (
                recentLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{lead.name}</div>
                      <div className="text-[11px] text-slate-400">{lead.email || lead.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge type={lead.type} size="xs" />
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {lead.country || lead.preferredCountry || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={lead.status} size="xs" />
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium text-xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail Modal */}
      <LeadDetailModal
        lead={selectedLead}
        isOpen={Boolean(selectedLead)}
        onClose={() => setSelectedLead(null)}
        onUpdated={() => fetchStats()}
      />
    </div>
  );
}
