'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from '../context/AdminAuthContext';
import AdminSidebar from '../component/admin/AdminSidebar';
import AdminHeader from '../component/admin/AdminHeader';
import ChangePasswordModal from '../component/admin/ChangePasswordModal';
import { useMounted } from '../lib/useMounted';
import { Loader2 } from 'lucide-react';

function AdminLayoutInner({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [dismissedForced, setDismissedForced] = useState(false);
  const mounted = useMounted();

  useEffect(() => {
    if (mounted && !loading && !user && !pathname.startsWith('/admin/reset-password')) {
      router.push('/login');
    }
  }, [mounted, user, loading, router, pathname]);

  if (pathname.startsWith('/admin/reset-password')) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    );
  }

  const getPageTitle = () => {
    if (pathname === '/admin') return 'Overview Dashboard';
    if (pathname.startsWith('/admin/leads')) return 'Leads & Student Inquiries';
    if (pathname.startsWith('/admin/applications')) return 'Recruitment & Job Applications';
    if (pathname.startsWith('/admin/content')) return 'Content Management (CMS)';
    if (pathname.startsWith('/admin/staff')) return 'Staff & Counselor Accounts';
    return 'Admin Portal';
  };

  const isAuthorized = mounted && !loading && !!user;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenPasswordModal={() => setPasswordModalOpen(true)}
      />

      {/* Main wrapper */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <AdminHeader
          title={getPageTitle()}
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenPasswordModal={() => setPasswordModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Render children unconditionally so Next.js Turbopack Instant Navigation can validate all route segments */}
          <div className={isAuthorized ? 'block' : 'hidden'}>
            {children}
          </div>

          {!isAuthorized && (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
              <p className="text-xs font-medium" suppressHydrationWarning>
                Verifying admin authorization...
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Change Password Modal (First-time setup or voluntary change) */}
      {mounted && (
        <ChangePasswordModal
          isOpen={(!!user?.mustChangePassword && !dismissedForced) || passwordModalOpen}
          isForced={!!user?.mustChangePassword && !dismissedForced}
          onClose={() => {
            setPasswordModalOpen(false);
            setDismissedForced(true);
          }}
        />
      )}
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <AdminAuthProvider>
      <Suspense
        fallback={
          <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
            <p className="text-xs font-medium">Loading admin portal...</p>
          </div>
        }
      >
        <AdminLayoutInner>{children}</AdminLayoutInner>
      </Suspense>
    </AdminAuthProvider>
  );
}
