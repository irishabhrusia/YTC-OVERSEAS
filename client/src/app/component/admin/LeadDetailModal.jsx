'use client';

import React, { useState } from 'react';
import {
  X,
  Mail,
  Phone,
  Calendar,
  Globe,
  MapPin,
  Briefcase,
  GraduationCap,
  MessageSquare,
  Send,
  Building2,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import { updateAdminLead, addLeadNote } from '../../lib/adminApi';

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'converted', label: 'Converted' },
  { value: 'closed', label: 'Closed' },
];

export default function LeadDetailModal({ lead, isOpen, onClose, onUpdated }) {
  const [status, setStatus] = useState(lead?.status || 'new');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [notes, setNotes] = useState(lead?.notes || []);
  const [feedback, setFeedback] = useState(null);

  if (!isOpen || !lead) return null;

  const handleStatusChange = async (e) => {
    const nextStatus = e.target.value;
    setStatus(nextStatus);
    setUpdatingStatus(true);
    setFeedback(null);

    const res = await updateAdminLead(lead._id, { status: nextStatus });
    setUpdatingStatus(false);

    if (res.success) {
      setFeedback({ type: 'success', message: 'Status updated successfully!' });
      if (onUpdated) onUpdated({ ...lead, status: nextStatus });
      setTimeout(() => setFeedback(null), 3000);
    } else {
      setFeedback({ type: 'error', message: res.message || 'Failed to update status' });
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setAddingNote(true);
    setFeedback(null);

    const res = await addLeadNote(lead._id, newNote.trim());
    setAddingNote(false);

    if (res.success && res.data) {
      setNotes(res.data.notes || [...notes, { text: newNote.trim(), createdAt: new Date() }]);
      setNewNote('');
      setFeedback({ type: 'success', message: 'Note added!' });
      if (onUpdated) onUpdated(res.data);
      setTimeout(() => setFeedback(null), 3000);
    } else {
      setFeedback({ type: 'error', message: res.message || 'Failed to add note' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-900">{lead.name}</h2>
            <StatusBadge type={lead.type} size="sm" />
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status Bar */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Lead Status
              </span>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={status} size="lg" />
                {updatingStatus && (
                  <span className="text-xs text-slate-400 animate-pulse">Saving...</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="status-select" className="text-xs text-slate-500">
                Change:
              </label>
              <select
                id="status-select"
                value={status}
                onChange={handleStatusChange}
                disabled={updatingStatus}
                className="bg-white border border-slate-300 rounded-lg text-xs font-medium px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {feedback && (
            <div
              className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {feedback.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Contact Details Grid */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Contact Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="overflow-hidden">
                  <span className="text-[11px] text-slate-400 block">Email</span>
                  <a
                    href={`mailto:${lead.email}`}
                    className="font-medium text-blue-600 hover:underline truncate block"
                  >
                    {lead.email || 'N/A'}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="overflow-hidden">
                  <span className="text-[11px] text-slate-400 block">Phone</span>
                  <a
                    href={`tel:${lead.phone}`}
                    className="font-medium text-slate-800 hover:text-blue-600 truncate block"
                  >
                    {lead.phone || 'N/A'}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Lead Specific Details */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Application Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {lead.country && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-100">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-[11px] text-slate-400 block">Destination Country</span>
                    <span className="font-medium text-slate-800">{lead.country}</span>
                  </div>
                </div>
              )}

              {lead.course && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-100">
                  <GraduationCap className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-[11px] text-slate-400 block">Course / Program</span>
                    <span className="font-medium text-slate-800">{lead.course}</span>
                  </div>
                </div>
              )}

              {lead.degreeLevel && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-100">
                  <GraduationCap className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-[11px] text-slate-400 block">Degree Level</span>
                    <span className="font-medium text-slate-800">{lead.degreeLevel}</span>
                  </div>
                </div>
              )}

              {lead.jobCategory && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-100">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-[11px] text-slate-400 block">Job Category</span>
                    <span className="font-medium text-slate-800">{lead.jobCategory}</span>
                  </div>
                </div>
              )}

              {lead.preferredCountry && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-100">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-[11px] text-slate-400 block">Preferred Work Country</span>
                    <span className="font-medium text-slate-800">{lead.preferredCountry}</span>
                  </div>
                </div>
              )}

              {lead.experience && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-100">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-[11px] text-slate-400 block">Experience</span>
                    <span className="font-medium text-slate-800">{lead.experience}</span>
                  </div>
                </div>
              )}

              {lead.companyName && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-100">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-[11px] text-slate-400 block">Company Name</span>
                    <span className="font-medium text-slate-800">{lead.companyName}</span>
                  </div>
                </div>
              )}

              {lead.positionsNeeded && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-100">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-[11px] text-slate-400 block">Positions Needed</span>
                    <span className="font-medium text-slate-800">{lead.positionsNeeded}</span>
                  </div>
                </div>
              )}

              {lead.workersCount && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-100">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-[11px] text-slate-400 block">Workers Count</span>
                    <span className="font-medium text-slate-800">{lead.workersCount}</span>
                  </div>
                </div>
              )}

              {lead.currentCity && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-100">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-[11px] text-slate-400 block">Current City</span>
                    <span className="font-medium text-slate-800">{lead.currentCity}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Message */}
          {lead.message && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                User Message
              </h3>
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {lead.message}
              </div>
            </div>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Received: {new Date(lead.createdAt).toLocaleString()}</span>
            </span>
            {lead.sourcePage && (
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>Source: {lead.sourcePage}</span>
              </span>
            )}
          </div>

          {/* Counselor Internal Notes */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span>Counselor Internal Notes ({notes.length})</span>
              </h3>
            </div>

            {/* Existing notes list */}
            <div className="space-y-2.5 max-h-48 overflow-y-auto mb-4 pr-1">
              {notes.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No notes added yet for this lead.</p>
              ) : (
                notes.map((note, idx) => (
                  <div
                    key={note._id || idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700"
                  >
                    <p className="whitespace-pre-wrap">{note.text}</p>
                    <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{note.createdBy?.name ? `By ${note.createdBy.name}` : 'Counselor'}</span>
                      <span>{note.createdAt ? new Date(note.createdAt).toLocaleString() : ''}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add note input */}
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                placeholder="Add a progress note or follow-up note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                disabled={addingNote}
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={addingNote || !newNote.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{addingNote ? 'Saving...' : 'Add'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

