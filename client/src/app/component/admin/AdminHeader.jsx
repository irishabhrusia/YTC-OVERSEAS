'use client';

import React, { useState, useEffect } from 'react';
import { Menu, Bell, ShieldCheck, User, KeyRound } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import StatusBadge from './StatusBadge';

export default function AdminHeader({ onOpenSidebar, onOpenPasswordModal, title, subtitle }) {
  const { user } = useAdminAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Left title & mobile menu toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            {title || 'Dashboard'}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 hidden sm:block -mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right admin profile badge */}
      <div className="flex items-center gap-3">
        {mounted && user && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 rounded-full py-1 px-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-semibold text-slate-800 block leading-tight">
                  {user.name}
                </span>
              </div>
              <StatusBadge status={user.role} size="xs" />
            </div>

            {onOpenPasswordModal && (
              <button
                type="button"
                onClick={onOpenPasswordModal}
                title="Change Password"
                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200"
              >
                <KeyRound className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

