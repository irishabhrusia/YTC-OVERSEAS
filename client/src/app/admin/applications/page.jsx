'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Briefcase,
  Search,
  Download,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Clock,
  FileText,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import {
  getAdminApplications,
  updateApplicationStatus,
  downloadApplicantCv,
} from '../../lib/adminApi';
import StatusBadge from '../../component/admin/StatusBadge';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'received', label: 'Received' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'interview', label: 'Interview' },
  { value: 'placed', label: 'Placed' },
  { value: 'rejected', label: 'Rejected' },
];

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const fetchApps = useCallback(
    async (page = 1) => {
      setLoading(true);
      const res = await getAdminApplications({
        page,
        limit: 10,
        status: status || undefined,
      });

      if (res.success && res.data) {
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.applications)
          ? res.data.applications
          : [];
        setApplications(list);

        const pag = res.data.pagination || res.pagination;
        if (pag) {
          setPagination(pag);
        }
      }
      setLoading(false);
    },
    [status]
  );

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      const res = await getAdminApplications({
        page: 1,
        limit: 10,
        status: status || undefined,
      });
      if (!ignore) {
        if (res.success && res.data) {
          const list = Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data.applications)
            ? res.data.applications
            : [];
          setApplications(list);

          const pag = res.data.pagination || res.pagination;
          if (pag) setPagination(pag);
        }
        setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [status]);

  const handleStatusChange = async (appId, newStatus) => {
    const res = await updateApplicationStatus(appId, newStatus);
    if (res.success) {
      setApplications((prev) =>
        prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
      );
      setFeedback({ type: 'success', message: 'Applicant status updated!' });
      setTimeout(() => setFeedback(null), 3000);
    } else {
      setFeedback({ type: 'error', message: res.message || 'Status update failed' });
    }
  };

  const handleDownloadCv = async (app) => {
    if (!app.cvFile && !app.cvUrl && !app.cvFileName) {
      alert('No CV file attached to this application.');
      return;
    }

    setDownloadingId(app._id);
    const res = await downloadApplicantCv(app._id);
    setDownloadingId(null);

    if (res.success && res.blob) {
      const url = window.URL.createObjectURL(res.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = app.cvFile || app.cvFileName || `CV-${app.name.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      alert('Could not download CV file from server.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Job Applications</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Review candidates, download submitted CVs, and track hiring stages ({pagination.total || 0} applicants)
          </p>
        </div>

        <button
          onClick={() => fetchApps(pagination.page)}
          disabled={loading}
          className="p-2 self-start sm:self-auto bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {feedback.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Filter */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label htmlFor="filter-status" className="text-xs font-semibold text-slate-600">
            Filter Status:
          </label>
          <select
            id="filter-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-100 font-semibold">
              <tr>
                <th className="py-3.5 px-4">Applicant</th>
                <th className="py-3.5 px-4">Position / Job</th>
                <th className="py-3.5 px-4">Experience & Location</th>
                <th className="py-3.5 px-4">CV Resume</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Applied Date</th>
                <th className="py-3.5 px-4 text-right">Change Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-500 mb-2" />
                    <p className="text-xs">Loading candidates...</p>
                  </td>
                </tr>
              ) : (!Array.isArray(applications) || applications.length === 0) ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-medium text-slate-600">No applications received yet</p>
                    <p className="text-xs mt-1">New submissions via recruitment pages will appear here.</p>
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{app.name}</div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{app.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{app.phone}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">
                        {app.job?.title || app.jobCategory || 'General Application'}
                      </div>
                      {app.preferredCountry && (
                        <div className="text-[11px] text-slate-400">
                          Prefers: {app.preferredCountry}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{app.experience || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{app.currentCity || 'Unknown'}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {app.cvFile ? (
                        <button
                          onClick={() => handleDownloadCv(app)}
                          disabled={downloadingId === app._id}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition-colors border border-blue-200 cursor-pointer"
                          title="Download candidate CV"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{downloadingId === app._id ? 'Downloading...' : 'Download CV'}</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">No CV attached</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={app.status} size="xs" />
                    </td>

                    <td className="py-3.5 px-4 text-[11px] text-slate-400 whitespace-nowrap">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        className="bg-white border border-slate-300 rounded-lg text-xs font-medium px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {STATUS_OPTIONS.filter((o) => o.value).map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>
              Page <span className="font-bold">{pagination.page}</span> of{' '}
              <span className="font-bold">{pagination.totalPages}</span>
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => fetchApps(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => fetchApps(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
