'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminMe, adminLogin, adminLogout } from '../lib/adminApi';

const AdminAuthContext = createContext({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Exposed helper to re-check session
  const checkAuth = useCallback(async () => {
    try {
      const res = await getAdminMe();
      if (res.success && res.data) {
        setUser(res.data);
      } else {
        setUser(null);
      }
      setError(null);
    } catch (err) {
      console.error('[AdminAuth] Check auth failed:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Run once on mount to establish session
  useEffect(() => {
    let ignore = false;
    getAdminMe()
      .then((res) => {
        if (!ignore) {
          if (res && res.success && res.data) {
            setUser(res.data);
          } else {
            setUser(null);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error('[AdminAuth] Initial session check failed:', err);
          setUser(null);
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Login handler
  const login = async (email, password) => {
    setError(null);
    const res = await adminLogin(email, password);
    if (res.success && res.data) {
      setUser(res.data);
      return { success: true };
    }
    const message = res.message || 'Invalid email or password';
    setError(message);
    return { success: false, message };
  };

  // Logout handler
  const logout = async () => {
    try {
      await adminLogout();
    } catch (err) {
      console.error('[AdminAuth] Logout error:', err);
    } finally {
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        refreshUser: checkAuth,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
