'use client';

import React from 'react';
import { AdminAuthProvider } from '../context/AdminAuthContext';

export default function AuthLayout({ children }) {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </AdminAuthProvider>
  );
}

