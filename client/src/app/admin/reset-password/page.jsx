'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Compass, Lock, Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { resetPasswordWithToken } from '../../lib/adminApi';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';
  const isInvite = searchParams.get('invite') === '1';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const hasMinLength = newPassword.length >= 10;
  const hasLetter = /[a-zA-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isFormValid = hasMinLength && hasLetter && hasNumber && passwordsMatch && Boolean(token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('Missing or invalid reset token. Please request a new link.');
      return;
    }

    if (!isFormValid) {
      setError('Please fulfill all password requirements.');
      return;
    }

    setLoading(true);
    const res = await resetPasswordWithToken(token, newPassword);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2500);
    } else {
      setError(res.message || 'Invalid or expired token. Please request a new link.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 sm:p-10 text-slate-800">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-blue-600 text-white items-center justify-center shadow-lg shadow-blue-600/30 mb-4">
            <Compass className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {isInvite ? 'Activate Your Account' : 'Reset Your Password'}
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
            {isInvite
              ? 'Welcome to the YTC Global Admin Portal. Choose a secure password to activate your staff profile.'
              : 'Enter a strong new password to restore access to your admin account.'}
          </p>
        </div>

        {/* Missing token alert */}
        {!token && (
          <div className="mb-6 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>No reset token provided. Please check the link from your email.</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">Password set successfully!</p>
              <p className="text-slate-600 mt-0.5">Redirecting you to the sign-in page...</p>
            </div>
          </div>
        )}

        {/* Form */}
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 10 characters"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
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

            {/* Requirements Checklist */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5 text-[11px]">
              <p className="font-semibold text-slate-700 mb-1">Password Requirements:</p>
              <div className="flex items-center gap-2">
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${hasMinLength ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>✓</span>
                <span className={hasMinLength ? 'text-slate-800 font-medium' : 'text-slate-500'}>Minimum 10 characters</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${hasLetter ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>✓</span>
                <span className={hasLetter ? 'text-slate-800 font-medium' : 'text-slate-500'}>At least one letter</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${hasNumber ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>✓</span>
                <span className={hasNumber ? 'text-slate-800 font-medium' : 'text-slate-500'}>At least one number</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${passwordsMatch ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>✓</span>
                <span className={passwordsMatch ? 'text-slate-800 font-medium' : 'text-slate-500'}>Passwords match</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                <span>{loading ? 'Saving...' : 'Set Password & Continue'}</span>
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link href="/login" className="text-xs font-semibold text-blue-600 hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

