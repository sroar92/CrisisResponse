// app/hospitals/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, Activity } from 'lucide-react';
import HospitalResourcePanel from '../../components/HospitalResourcePanel';
import HospitalResourceForm from '../../components/HospitalResourceForm';

export default function HospitalsPage() {
  const [activeTab, setActiveTab] = useState<'view' | 'manage'>('view');

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-600 p-3 rounded-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Hospital Resource Management</h1>
              <p className="text-slate-400">Track and manage hospital bed availability and resources</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 bg-slate-800 rounded-lg border border-slate-700 p-1 inline-flex">
          <button
            onClick={() => setActiveTab('view')}
            className={`px-6 py-2 rounded-md transition-all ${
              activeTab === 'view'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              View Resources
            </div>
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-6 py-2 rounded-md transition-all ${
              activeTab === 'manage'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Manage Hospitals
            </div>
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'view' ? (
          <div>
            <div className="mb-4 bg-blue-900/30 border border-blue-600 rounded-lg p-4">
              <h3 className="text-blue-300 font-semibold mb-1">Real-Time Resource Tracking</h3>
              <p className="text-blue-200 text-sm">
                Monitor hospital capacity in real-time. Data updates automatically as resources are allocated or released.
              </p>
            </div>
            <HospitalResourcePanel />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <HospitalResourceForm />
            </div>
            <div>
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Instructions</h2>
                <div className="space-y-4 text-slate-300">
                  <div>
                    <h3 className="font-semibold text-white mb-2">Adding a New Hospital</h3>
                    <p className="text-sm">
                      Fill out all required fields and click "Save Hospital Data". The hospital will be added to the system immediately.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-white mb-2">Updating Existing Hospital</h3>
                    <p className="text-sm">
                      Enter the exact name of an existing hospital to update its data. All fields will be updated with the new values.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-white mb-2">Resource Types</h3>
                    <ul className="text-sm space-y-2 ml-4">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span><strong>Total Beds:</strong> Maximum capacity of general hospital beds</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span><strong>Available Beds:</strong> Currently unoccupied general beds</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span><strong>ICU Beds:</strong> Intensive care unit beds available</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span><strong>Ventilators:</strong> Available ventilation equipment</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6 bg-yellow-900/30 border border-yellow-600 rounded-lg p-4">
                    <h3 className="text-yellow-300 font-semibold mb-2">⚠️ Important</h3>
                    <p className="text-yellow-200 text-sm">
                      Data is stored in your browser's local storage. Updates are reflected immediately across all components and tabs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}