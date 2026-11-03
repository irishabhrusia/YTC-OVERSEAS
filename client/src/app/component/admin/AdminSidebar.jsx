'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Inbox,
  Briefcase,
  Layers,
  Users,
  ExternalLink,
  LogOut,
  X,
  Compass,
  KeyRound,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useMounted } from '../../lib/useMounted';
import StatusBadge from './StatusBadge';

export default function AdminSidebar({ isOpen, onClose, onOpenPasswordModal }) {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();
  const mounted = useMounted();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      roles: ['super_admin', 'counsellor', 'editor'],
    },
    {
      label: 'Leads & Inquiries',
      href: '/admin/leads',
      icon: Inbox,
      roles: ['super_admin', 'counsellor'],
    },
    {
      label: 'Job Applications',
      href: '/admin/applications',
      icon: Briefcase,
      roles: ['super_admin', 'counsellor'],
    },
    {
      label: 'Content CMS',
      href: '/admin/content',
      icon: Layers,
      roles: ['super_admin', 'editor'],
    },
    {
      label: 'Staff & Team',
      href: '/admin/staff',
      icon: Users,
      roles: ['super_admin'],
    },
  ];

  const filteredNav = mounted && user
    ? navItems.filter((item) => item.roles.includes(user.role))
    : navItems;

  const isActive = (href) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-600/30">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white block">
                YTC Admin
              </span>
              <span className="text-[10px] text-slate-400 block -mt-1 font-medium tracking-wide">
                OVERSEAS PORTAL
              </span>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Navigation
          </div>

          {filteredNav.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  active
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-6 px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Quick Links
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-normal text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-slate-400" />
              <span>Public Website</span>
            </span>
            <span className="text-[11px] text-slate-400">Live</span>
          </Link>
        </div>

        {/* User profile & logout */}
        {mounted && user && (
          <div className="p-4 border-t border-slate-800 bg-slate-900/60">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                  {user.name ? user.name.slice(0, 2) : 'AD'}
                </div>
                <div className="truncate">
                  <p className="text-xs font-medium text-white truncate">{user.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-1 pt-1">
              <StatusBadge status={user.role} size="xs" />

              <div className="flex items-center gap-1">
                {onOpenPasswordModal && (
                  <button
                    type="button"
                    onClick={onOpenPasswordModal}
                    title="Change Password"
                    className="p-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={logout}
                  title="Log out"
                  className="flex items-center gap-1 px-2 py-1 text-xs text-rose-300 hover:text-rose-100 hover:bg-rose-950/60 rounded-md transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

