'use client';

import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle2, RefreshCw, X, LogOut } from 'lucide-react';
import { changePassword } from '../../lib/adminApi';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function ChangePasswordModal({ isOpen, onClose, isForced = false }) {
  const { refreshUser, logout } = useAdminAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const hasMinLength = newPassword.length >= 10;
  const hasLetter = /[a-zA-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isFormValid = hasMinLength && hasLetter && hasNumber && passwordsMatch && currentPassword.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isFormValid) {
      setError('Please fulfill all password requirements.');
      return;
    }

    setLoading(true);
    const res = await changePassword(currentPassword, newPassword);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      if (refreshUser) {
        await refreshUser();
      }
      setTimeout(() => {
        setSuccess(false);
        if (onClose) onClose();
      }, 1500);
    } else {
      setError(res.message || 'Failed to change password. Please check your current password.');
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-5 text-slate-800 relative">
        {/* Close (Cross) Button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            {isForced ? 'Set Your New Password' : 'Change Admin Password'}
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            {isForced
              ? 'Welcome! For your security, you must set a permanent password before accessing the admin dashboard.'
              : 'Enter your current password and choose a secure new password.'}
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="font-semibold">Password updated successfully! Loading dashboard...</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Current Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Current / Temporary Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter at least 10 characters"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Security Checklist */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5 text-[11px]">
            <p className="font-semibold text-slate-700 mb-1">Password Requirements:</p>
            <div className="flex items-center gap-2">
              <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${hasMinLength ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>✓</span>
              <span className={hasMinLength ? 'text-slate-800 font-medium' : 'text-slate-500'}>Minimum 10 characters</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${hasLetter ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>✓</span>
              <span className={hasLetter ? 'text-slate-800 font-medium' : 'text-slate-500'}>Contains at least one letter</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${hasNumber ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>✓</span>
              <span className={hasNumber ? 'text-slate-800 font-medium' : 'text-slate-500'}>Contains at least one number</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${passwordsMatch ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>✓</span>
              <span className={passwordsMatch ? 'text-slate-800 font-medium' : 'text-slate-500'}>Passwords match</span>
            </div>
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="pt-2 flex items-center gap-2.5">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className={`${onClose ? 'w-2/3' : 'w-full'} py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50`}
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>{loading ? 'Updating...' : 'Save & Secure'}</span>
            </button>
          </div>

          {/* Sign Out link if forced */}
          {isForced && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={logout}
                className="text-slate-400 hover:text-rose-600 text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out Instead</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

