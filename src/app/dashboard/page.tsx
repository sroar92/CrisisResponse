'use client';

import React, {useState} from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navigation from '@/components/Navigation';
import AlertSystem from '@/components/AlertSystem';
import LiveClock from '@/components/LiveClock';
import PredictiveAnalytics from '@/components/PredictiveAnalytics';
import ResourceAllocation from '@/components/ResourceAllocation';
import Link from 'next/link';
import {
 Activity,
  Building2,
  AlertCircle,
  Heart,
  ArrowRight,
  Users,
  FileText,
  MapPin,
  Radio,
  TrendingUp,
  Bell,
  Clock,
} from 'lucide-react';

export default function DashboardPage() {

  const [predictions, setPredictions] = useState<any>({});

  // Your existing dashboard data
  const hospitals = [
    { id: 1, name: 'Central Hospital', beds: 45, icu: 8, ventilators: 12 },
    { id: 2, name: 'St. Mary Medical', beds: 32, icu: 5, ventilators: 8 },
    { id: 3, name: 'County General', beds: 28, icu: 6, ventilators: 10 },
  ];

  const resourceRequests = [
    { id: 1, hospital: 'Central Hospital', resource: 'Ventilators', status: 'critical' },
    { id: 2, hospital: 'St. Mary Medical', resource: 'ICU Beds', status: 'urgent' },
  ];

  const totalBeds = hospitals.reduce((sum, h) => sum + h.beds, 0);
  const totalICU = hospitals.reduce((sum, h) => sum + h.icu, 0);
  const totalVentilators = hospitals.reduce((sum, h) => sum + h.ventilators, 0);
  const criticalRequests = resourceRequests.filter(r => r.status === 'critical').length;

  // Quick Actions definition
  const quickActions = [
    {
      title: 'Hospital Resources',
      description: 'View and manage hospital capacity',
      icon: Building2,
      href: '/hospital-resources',
      color: 'blue',
    },
    {
      title: 'Emergency Alerts',
      description: 'Send multilingual emergency alerts',
      icon: Bell,
      href: '/alerts',
      color: 'red',
    },
    {
      title: 'Resource Requests',
      description: 'Review pending resource requests',
      icon: FileText,
      href: '/resource-requests',
      color: 'emerald',
    },
    {
      title: 'Live Map',
      description: 'Real-time responder locations',
      icon: MapPin,
      href: '/map',
      color: 'purple',
    },
  ];

  // Recent Activity
  const recentActivity = [
    {
      id: 1,
      action: 'Resource Request',
      details: 'Central Hospital requested 3 ventilators',
      time: '5 min ago',
      icon: AlertCircle,
      iconColor: 'text-red-400',
    },
    {
      id: 2,
      action: 'Hospital Update',
      details: 'St. Mary Medical updated bed capacity',
      time: '12 min ago',
      icon: Building2,
      iconColor: 'text-blue-400',
    },
    {
      id: 3,
      action: 'Alert Sent',
      details: 'Emergency flood warning issued',
      time: '18 min ago',
      icon: Bell,
      iconColor: 'text-amber-400',
    },
  ];

  return (
    <ProtectedRoute requiredPermissions={['canAccessDashboard']}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Crisis Management Dashboard</h1>
              <p className="text-slate-400">Real-time system overview and quick actions</p>
            </div>
            <LiveClock />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <Building2 className="w-8 h-8 text-white" />
                <Activity className="w-5 h-5 text-blue-200" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{hospitals.length}</div>
              <p className="text-blue-100 text-sm">Active Hospitals</p>
              <p className="text-blue-200 text-xs mt-2">All systems operational</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <Heart className="w-8 h-8 text-white" />
                <TrendingUp className="w-5 h-5 text-emerald-200" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{totalBeds}</div>
              <p className="text-emerald-100 text-sm">Available Hospital Beds</p>
              <p className="text-emerald-200 text-xs mt-2">{totalICU} ICU beds available</p>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <Activity className="w-8 h-8 text-white" />
                <TrendingUp className="w-5 h-5 text-purple-200" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{totalVentilators}</div>
              <p className="text-purple-100 text-sm">Ventilators Available</p>
              <p className="text-purple-200 text-xs mt-2">Across {hospitals.length} hospitals</p>
            </div>

            <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <AlertCircle className="w-8 h-8 text-white" />
                <Bell className="w-5 h-5 text-red-200 animate-pulse" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{criticalRequests}</div>
              <p className="text-red-100 text-sm">Critical Requests</p>
              <p className="text-red-200 text-xs mt-2">{resourceRequests.length} total pending</p>
            </div>
          </div>

          {/* Alert System Section */}
          <div className="mb-8">
            <AlertSystem />
          </div>

          {/* Two Column Layout: Quick Actions + Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Quick Actions */}
            <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  const colorMap = {
                    blue: { bg: 'bg-blue-600', border: 'border-blue-600/30' },
                    red: { bg: 'bg-red-600', border: 'border-red-600/30' },
                    emerald: { bg: 'bg-emerald-600', border: 'border-emerald-600/30' },
                    purple: { bg: 'bg-purple-600', border: 'border-purple-600/30' },
                  };
                  const colors = colorMap[action.color as keyof typeof colorMap];
                  
                  return (
                    <Link
                      key={action.title}
                      href={action.href}
                      className={`bg-slate-700/50 hover:bg-slate-700 border ${colors.border} rounded-lg p-4 transition-all group`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`${colors.bg} p-2 rounded-lg`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{action.title}</h3>
                            <p className="text-sm text-slate-400">{action.description}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                Recent Activity
              </h2>
              <div className="space-y-3">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className="bg-slate-700/50 rounded-lg p-3 flex items-start gap-3"
                    >
                      <div className="bg-slate-600 p-2 rounded-lg">
                        <Icon className={`w-5 h-5 ${activity.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-white text-sm">{activity.action}</p>
                            <p className="text-slate-400 text-xs mt-1">{activity.details}</p>
                          </div>
                          <span className="text-xs text-slate-500">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700">
                <Link
                  href="/system-health"
                  className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  View all activity
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* PREDICTIVE ANALYTICS + RESOURCE ALLOCATION */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
            <PredictiveAnalytics predictions={predictions} setPredictions={setPredictions} />
            <ResourceAllocation predictions={predictions} />
          </div>

          {/* System Status Footer */}
          <div className="bg-slate-800 rounded-xl p-4 shadow-xl border border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-300">All systems operational</span>
              </div>
              <span className="text-xs text-slate-500">Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
