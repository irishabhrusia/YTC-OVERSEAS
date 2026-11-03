'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Trash2,
  RefreshCw,
  Mail,
  Lock,
  User,
  Clock,
  X,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  getStaffMembers,
  createStaffMember,
  updateStaffMember,
  deleteStaffMember,
} from '../../lib/adminApi';
import StatusBadge from '../../component/admin/StatusBadge';

export default function AdminStaffPage() {
  const { user } = useAdminAuth();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'counsellor' });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    const res = await getStaffMembers();
    if (res.success && res.data) {
      setStaff(Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.staff) ? res.data.staff : []));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let ignore = false;
    if (user?.role === 'super_admin') {
      const load = async () => {
        const res = await getStaffMembers();
        if (!ignore) {
          if (res.success && res.data) {
            setStaff(Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.staff) ? res.data.staff : []));
          }
          setLoading(false);
        }
      };
      load();
    }
    return () => {
      ignore = true;
    };
  }, [user]);

  if (user?.role !== 'super_admin') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-md mx-auto my-12 shadow-xs">
        <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900">Access Restricted</h3>
        <p className="text-xs text-slate-500 mt-1">
          Only Super Administrators can create, review, or manage staff and counselor accounts.
        </p>
      </div>
    );
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const res = await createStaffMember(formData);
    setSaving(false);

    if (res.success) {
      setModalOpen(false);
      setFormData({ name: '', email: '', password: '', role: 'counsellor' });
      fetchStaff();
      setFeedback({ type: 'success', message: 'Staff member account created successfully!' });
      setTimeout(() => setFeedback(null), 3000);
    } else {
      setFeedback({ type: 'error', message: res.message || 'Failed to create staff account.' });
    }
  };

  const handleToggleActive = async (member) => {
    const nextState = !member.isActive;
    const res = await updateStaffMember(member._id, { isActive: nextState });
    if (res.success) {
      setStaff((prev) =>
        prev.map((m) => (m._id === member._id ? { ...m, isActive: nextState } : m))
      );
      setFeedback({
        type: 'success',
        message: `Account ${nextState ? 'activated' : 'deactivated'}.`,
      });
      setTimeout(() => setFeedback(null), 3000);
    } else {
      setFeedback({ type: 'error', message: res.message || 'Update failed.' });
    }
  };

  const handleDelete = async (member) => {
    if (member._id === user?._id || member.email === user?.email) {
      alert('You cannot delete your own active account.');
      return;
    }
    if (!window.confirm(`Are you sure you want to remove ${member.name} (${member.email})?`)) {
      return;
    }

    const res = await deleteStaffMember(member._id);
    if (res.success) {
      setStaff((prev) => prev.filter((m) => m._id !== member._id));
      setFeedback({ type: 'success', message: 'Staff member removed.' });
      setTimeout(() => setFeedback(null), 3000);
    } else {
      setFeedback({ type: 'error', message: res.message || 'Delete failed.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Staff & Team Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage counselor logins, content editors, and administrative permissions
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Team Member</span>
          </button>

          <button
            onClick={fetchStaff}
            className="p-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs transition-colors"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Staff Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-100 font-semibold">
              <tr>
                <th className="py-3.5 px-4">Member Name</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Last Login</th>
                <th className="py-3.5 px-4">Created Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-500 mb-2" />
                    <p className="text-xs">Loading staff accounts...</p>
                  </td>
                </tr>
              ) : staff.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-medium text-slate-600">No staff accounts found</p>
                  </td>
                </tr>
              ) : (
                staff.map((member) => (
                  <tr key={member._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{member.name}</span>
                        {member._id === user?._id && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-semibold">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" />
                        <span>{member.email}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={member.role} size="xs" />
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleActive(member)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors ${
                          member.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                        }`}
                        title="Click to toggle status"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            member.isActive ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                        <span>{member.isActive ? 'Active' : 'Disabled'}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500">
                      {member.lastLoginAt ? new Date(member.lastLoginAt).toLocaleString() : 'Never'}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {member._id !== user?._id && (
                        <button
                          onClick={() => handleDelete(member)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete staff account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">Add Team Member</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="counsellor@ytc.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Initial Password (min 8 chars) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="counsellor">Counsellor (View & manage leads, add notes)</option>
                  <option value="editor">Editor (Manage CMS countries, blogs & content)</option>
                  <option value="super_admin">Super Admin (Full administrative privileges)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  {saving ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
