'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Compass, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const { user, loading, login } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/admin');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      router.push('/admin');
    } else {
      setErrorMessage(res.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 sm:p-10">
        {/* Brand Icon & Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-blue-600 text-white items-center justify-center shadow-lg shadow-blue-600/30 mb-4">
            <Compass className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Portal</h1>
          <p className="text-xs text-slate-500 mt-1">
            Sign in to manage student inquiries, job applications & website CMS
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ytc.com"
                disabled={submitting}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={submitting}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>

        {/* Security badge / note */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Protected with role-based access control & rate limiting.
          </p>
        </div>
      </div>
    </div>
  );
}

