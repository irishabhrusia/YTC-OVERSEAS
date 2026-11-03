'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Globe,
  SlidersHorizontal,
} from 'lucide-react';
import { getAdminLeads, exportLeadsCsv } from '../../lib/adminApi';
import StatusBadge from '../../component/admin/StatusBadge';
import LeadDetailModal from '../../component/admin/LeadDetailModal';

const STATUS_FILTERS = [
  { value: '', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'converted', label: 'Converted' },
  { value: 'closed', label: 'Closed' },
];

const TYPE_FILTERS = [
  { value: '', label: 'All Types' },
  { value: 'consultation', label: 'Consultation' },
  { value: 'contact', label: 'Contact Us' },
  { value: 'eligibility', label: 'Eligibility Check' },
  { value: 'job_application', label: 'Job Application' },
  { value: 'employer_inquiry', label: 'Employer Inquiry' },
];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [exporting, setExporting] = useState(false);

  const fetchLeads = useCallback(
    async (page = 1) => {
      setLoading(true);
      const res = await getAdminLeads({
        page,
        limit: 10,
        search: search.trim() || undefined,
        status: status || undefined,
        type: type || undefined,
      });

      if (res.success && res.data) {
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.leads)
          ? res.data.leads
          : [];
        setLeads(list);

        const pag = res.data.pagination || res.pagination;
        if (pag) {
          setPagination(pag);
        }
      }
      setLoading(false);
    },
    [search, status, type]
  );

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      const res = await getAdminLeads({
        page: 1,
        limit: 10,
        search: search.trim() || undefined,
        status: status || undefined,
        type: type || undefined,
      });
      if (!ignore) {
        if (res.success && res.data) {
          const list = Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data.leads)
            ? res.data.leads
            : [];
          setLeads(list);

          const pag = res.data.pagination || res.pagination;
          if (pag) {
            setPagination(pag);
          }
        }
        setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [search, status, type]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLeads(1);
  };

  const handleExportCsv = async () => {
    setExporting(true);
    const res = await exportLeadsCsv({
      search: search.trim() || undefined,
      status: status || undefined,
      type: type || undefined,
    });
    setExporting(false);

    if (res.success && res.blob) {
      const url = window.URL.createObjectURL(res.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-${status || 'all'}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Leads & Inquiries</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage prospective students, consultation requests & recruitment inquiries ({pagination.total || 0} total)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            disabled={exporting}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{exporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>

          <button
            onClick={() => fetchLeads(pagination.page)}
            disabled={loading}
            className="p-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs transition-colors"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, course..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </form>

        {/* Status Dropdown */}
        <div className="w-full md:w-auto flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full md:w-auto bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {STATUS_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>

          {/* Type Dropdown */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full md:w-auto bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {TYPE_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-100 font-semibold">
              <tr>
                <th className="py-3.5 px-4">Applicant / Student</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Contact Details</th>
                <th className="py-3.5 px-4">Destination / Program</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Notes</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-500 mb-2" />
                    <p className="text-xs">Loading leads database...</p>
                  </td>
                </tr>
              ) : (!Array.isArray(leads) || leads.length === 0) ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-medium text-slate-600">No matching inquiries found</p>
                    <p className="text-xs mt-1">Try clearing your search query or status filter.</p>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Name */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{lead.name}</div>
                      {lead.currentCity && (
                        <div className="text-[11px] text-slate-400">{lead.currentCity}</div>
                      )}
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-4">
                      <StatusBadge type={lead.type} size="xs" />
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4 space-y-0.5">
                      {lead.email && (
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[140px]">{lead.email}</span>
                        </div>
                      )}
                      {lead.phone && (
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{lead.phone}</span>
                        </div>
                      )}
                    </td>

                    {/* Destination / Course */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">
                        {lead.country || lead.preferredCountry || lead.jobCategory || '—'}
                      </div>
                      {lead.course && (
                        <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                          {lead.course}
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={lead.status} size="xs" />
                    </td>

                    {/* Notes count */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                        <MessageSquare className="w-3 h-3 text-slate-400" />
                        <span>{lead.notes?.length || 0}</span>
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-[11px] text-slate-400 whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold text-xs transition-colors"
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

        {/* Pagination bar */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>
              Showing Page <span className="font-bold">{pagination.page}</span> of{' '}
              <span className="font-bold">{pagination.totalPages}</span> ({pagination.total} leads)
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => fetchLeads(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => fetchLeads(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lead Detail & Counselor Notes Modal */}
      <LeadDetailModal
        lead={selectedLead}
        isOpen={Boolean(selectedLead)}
        onClose={() => setSelectedLead(null)}
        onUpdated={() => fetchLeads(pagination.page)}
      />
    </div>
  );
}
