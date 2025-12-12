// components/Navigation.tsx
'use client';

import { useAuth } from '../lib/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Map,
  Building2,
  Users,
  Bell,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  User,
  Phone,
  Activity,
  UserRound,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

export default function Navigation() {
  const { user, logout, hasPermission } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) {
    return null;
  }

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      show: hasPermission('canAccessDashboard'),
    },
    {
      name: 'Map View',
      href: '/map',
      icon: Map,
      show: hasPermission('canViewMap'),
    },
    {
      name: 'Hospital Resources',
      href: '/hospital-resources',
      icon: Building2,
      show: hasPermission('canManageHospitals'),
    },
    {
      name: 'Resource Requests',
      href: '/resource-requests',
      icon: FileText,
      show: hasPermission('canManageHospitals'),
    },
    {
      name: 'Review Requests',
      href: '/resource-review',
      icon: Shield,
      show: hasPermission('canReviewRequests'),
    },
    {
      name: 'Responders',
      href: '/responder-management',
      icon: Users,
      show: hasPermission('canManageResponders'),
    },
    {
      name: 'Alerts',
      href: '/alerts',
      icon: Bell,
      show: hasPermission('canSendAlerts'),
    },
  ].filter((item) => item.show);

  // Quick Actions
  const quickActions = [
    {
      name: '911 Dispatch',
      href: '/dispatch-911',
      icon: Phone,
      color: 'text-red-400 hover:text-red-300',
      show: user?.role === 'admin' || user?.role === 'dispatcher',
    },
    {
      name: 'System Health',
      href: '/system-health',
      icon: Activity,
      color: 'text-indigo-400 hover:text-indigo-300',
      show: user?.role === 'admin',
    },
    {
      name: 'Patient Transfers',
      href: '/patient-transfers',
      icon: UserRound,
      color: 'text-cyan-400 hover:text-cyan-300',
      show: user?.role === 'admin' || user?.role === 'hospital_worker',
    },
    {
      name: 'Send Alerts',
      href: '/alerts',
      icon: Bell,
      color: 'text-amber-400 hover:text-amber-300',
      show: user?.role === 'admin' || user?.role === 'dispatcher',
    },
  ].filter((item) => item.show);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-600';
      case 'dispatcher':
        return 'bg-yellow-600';
      case 'hospital_worker':
        return 'bg-emerald-600';
      case 'first_responder':
        return 'bg-purple-600';
      default:
        return 'bg-blue-600';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'dispatcher':
        return 'Dispatcher';
      case 'hospital_worker':
        return 'Hospital Worker';
      case 'first_responder':
        return 'First Responder';
      default:
        return 'User';
    }
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title - Click to go home */}
            <Link href="/dashboard" className="flex items-center hover:opacity-80 transition-opacity">
              <Shield className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-white">Crisis Management</h1>
                <p className="text-xs text-slate-400 hidden sm:block">Real-time Coordination</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              {/* User Info */}
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <div className="flex items-center justify-end gap-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full text-white ${getRoleBadgeColor(
                      user.role
                    )}`}
                  >
                    {getRoleLabel(user.role)}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-700"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        {quickActions.length > 0 && (
          <div className="border-t border-slate-700 bg-slate-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-1 py-2 overflow-x-auto">
                <Zap className="w-4 h-4 text-yellow-400 mr-2 flex-shrink-0" />
                <span className="text-xs text-slate-400 mr-3 flex-shrink-0">Quick Actions:</span>
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.name}
                      href={action.href}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${action.color} bg-slate-700/50 hover:bg-slate-700 flex-shrink-0`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium whitespace-nowrap">{action.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-700 bg-slate-800">
            <div className="px-4 py-3 space-y-2">
              {/* User Info on Mobile */}
              <div className="pb-3 mb-3 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-700 p-2 rounded-full">
                    <User className="w-5 h-5 text-slate-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full text-white ${getRoleBadgeColor(
                        user.role
                      )}`}
                    >
                      {getRoleLabel(user.role)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                );
              })}

              {/* Quick Actions on Mobile */}
              {quickActions.length > 0 && (
                <>
                  <div className="pt-3 mt-3 border-t border-slate-700">
                    <p className="text-xs text-slate-400 mb-2 px-3">Quick Actions</p>
                    {quickActions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <Link
                          key={action.name}
                          href={action.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${action.color} bg-slate-700/50 hover:bg-slate-700 mb-1`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-sm font-medium">{action.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}