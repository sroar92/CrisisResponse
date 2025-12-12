// lib/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: number;
  username: string;
  role: 'admin' | 'dispatcher' | 'hospital_worker' | 'first_responder' | 'user';
  name: string;
  email: string;
  organization?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Role permissions configuration
  const ROLE_PERMISSIONS = {
    admin: {
      canAccessDashboard: true,
      canManageHospitals: true,
      canManageResponders: true,
      canManageUsers: true,
      canViewMap: true,
      canViewReports: true,
      canSendAlerts: true,
      canReviewRequests: true,
    },
    dispatcher: {
      canAccessDashboard: true,
      canManageHospitals: false,
      canManageResponders: true,
      canManageUsers: false,
      canViewMap: true,
      canViewReports: true,
      canSendAlerts: true,
      canReviewRequests: true,
    },
    hospital_worker: {
      canAccessDashboard: true,
      canManageHospitals: true,
      canManageResponders: false,
      canManageUsers: false,
      canViewMap: false,
      canViewReports: false,
      canSendAlerts: false,
      canReviewRequests: false,
    },
    first_responder: {
      canAccessDashboard: true,
      canManageHospitals: false,
      canManageResponders: false,
      canManageUsers: false,
      canViewMap: true,
      canViewReports: false,
      canSendAlerts: false,
      canReviewRequests: false,
    },
    user: {
      canAccessDashboard: true,
      canManageHospitals: false,
      canManageResponders: false,
      canManageUsers: false,
      canViewMap: false,
      canViewReports: false,
      canSendAlerts: false,
      canReviewRequests: false,
    },
  };

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Session check error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      const data = await response.json();
      setUser(data.user);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) {
      return false;
    }
    
    const rolePermissions = ROLE_PERMISSIONS[user.role];
    return (rolePermissions as any)[permission] || false;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkSession, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}