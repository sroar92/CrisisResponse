// app/dispatch-911/page.tsx
'use client';

import React, { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { useRouter } from 'next/navigation';
import DispatchDashboard from '../../components/DispatchDashboard';
import CallIntakeForm from '../../components/CallIntakeForm';
import DispatchControlPanel from '../../components/DispatchControlPanel';
import { Phone, Radio, BarChart3, Settings, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Dispatch911Page() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'intake' | 'dispatch'>('dashboard');

  // Check if user has access
  React.useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Only admin and dispatcher can access
    if (user.role !== 'admin' && user.role !== 'dispatcher') {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Show loading or access denied
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (user.role !== 'admin' && user.role !== 'dispatcher') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-slate-400 mb-4">Only administrators and dispatchers can access this page</p>
          <Link href="/dashboard" className="text-blue-400 hover:text-blue-300">
            ← Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'intake', label: '911 Call Intake', icon: Phone },
    { id: 'dispatch', label: 'Dispatch Control', icon: Radio },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-white font-semibold text-lg hidden sm:inline">Crisis Management</span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-white">{user?.name || 'User'}</div>
                <div className="text-xs text-slate-400">{user?.role || 'User'}</div>
              </div>
              <Link 
                href="/login" 
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <div className="bg-red-600 p-3 rounded-lg">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                911 Dispatch System
              </h1>
              <p className="text-slate-400">
                Emergency call management and incident coordination
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400">Operator</div>
              <div className="text-white font-semibold">{user?.name || 'Unknown'}</div>
              <div className="text-xs text-slate-500">{user?.role || 'dispatcher'}</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-1 mb-6">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="transition-all">
          {activeTab === 'dashboard' && <DispatchDashboard />}
          {activeTab === 'intake' && <CallIntakeForm />}
          {activeTab === 'dispatch' && <DispatchControlPanel />}
        </div>

        {/* Information Footer */}
        <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Settings className="w-5 h-5 text-slate-400 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-1">
                System Information
              </h3>
              <p className="text-xs text-slate-400">
                This 911 dispatch system is a simulated educational platform. It demonstrates
                emergency call intake, incident creation, and unit dispatch workflows. In a
                production environment, this would integrate with actual 911 infrastructure,
                CAD systems, and location services.
              </p>
              <div className="mt-2 flex gap-4 text-xs text-slate-500">
                <span>• Real-time call tracking</span>
                <span>• Automated incident creation</span>
                <span>• Unit dispatch coordination</span>
                <span>• Data validation & sync</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}