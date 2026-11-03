'use client';

import React from 'react';

const STATUS_CONFIGS = {
  // Lead statuses
  new: { label: 'New', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  contacted: { label: 'Contacted', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  in_progress: { label: 'In Progress', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
  converted: { label: 'Converted', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  closed: { label: 'Closed', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-400' },

  // Job application statuses
  received: { label: 'Received', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  pending: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  reviewed: { label: 'Reviewed', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  shortlisted: { label: 'Shortlisted', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500' },
  interview: { label: 'Interview', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
  placed: { label: 'Placed', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  hired: { label: 'Hired', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  rejected: { label: 'Rejected', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },

  // Roles
  super_admin: { label: 'Super Admin', bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', dot: 'bg-violet-500' },
  counsellor: { label: 'Counsellor', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', dot: 'bg-teal-500' },
  editor: { label: 'Editor', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', dot: 'bg-sky-500' },

  // Lead types
  consultation: { label: 'Consultation', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  contact: { label: 'Contact', bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  eligibility: { label: 'Eligibility', bg: 'bg-fuchsia-50', text: 'text-fuchsia-700', border: 'border-fuchsia-200' },
  job_application: { label: 'Job Apply', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  employer_inquiry: { label: 'Employer', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
};

export default function StatusBadge({ status, type, size = 'sm' }) {
  const rawKey = status || type || 'new';
  const key = typeof rawKey === 'string' ? rawKey : (rawKey?.status || rawKey?.type || 'new');
  const config = STATUS_CONFIGS[key] || {
    label: typeof key === 'string' ? key.replace(/_/g, ' ') : String(key),
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-200',
    dot: 'bg-gray-400',
  };

  const sizeClasses = size === 'xs' 
    ? 'text-[11px] px-2 py-0.5' 
    : size === 'lg' 
    ? 'text-sm px-3 py-1 font-semibold' 
    : 'text-xs px-2.5 py-1 font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses} capitalize whitespace-nowrap`}
    >
      {config.dot && <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />}
      {config.label}
    </span>
  );
}

