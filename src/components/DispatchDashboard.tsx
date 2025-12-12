// components/DispatchDashboard.tsx
'use client';

import React, { useState } from 'react';
import { 
  Phone, 
  AlertCircle, 
  Clock, 
  MapPin, 
  TrendingUp, 
  Activity,
  Flame,
  Heart,
  Shield,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Call {
  id: string;
  time: string;
  type: 'medical' | 'fire' | 'police';
  location: string;
  status: 'active' | 'dispatched' | 'resolved';
  priority: 'critical' | 'high' | 'medium' | 'low';
  description: string;
}

export default function DispatchDashboard() {
  const [calls] = useState<Call[]>([
    {
      id: 'CALL-001',
      time: '2 min ago',
      type: 'medical',
      location: '123 Main St',
      status: 'active',
      priority: 'critical',
      description: 'Cardiac arrest, CPR in progress'
    },
    {
      id: 'CALL-002',
      time: '8 min ago',
      type: 'fire',
      location: '456 Oak Ave',
      status: 'dispatched',
      priority: 'high',
      description: 'Structure fire, multiple floors'
    },
    {
      id: 'CALL-003',
      time: '15 min ago',
      type: 'police',
      location: '789 Elm St',
      status: 'dispatched',
      priority: 'medium',
      description: 'Traffic accident with injuries'
    },
    {
      id: 'CALL-004',
      time: '23 min ago',
      type: 'medical',
      location: '321 Pine Rd',
      status: 'resolved',
      priority: 'high',
      description: 'Difficulty breathing'
    },
    {
      id: 'CALL-005',
      time: '35 min ago',
      type: 'fire',
      location: '654 Maple Dr',
      status: 'resolved',
      priority: 'low',
      description: 'False alarm - smoke detector'
    },
  ]);

  const activeCalls = calls.filter(c => c.status === 'active').length;
  const dispatchedCalls = calls.filter(c => c.status === 'dispatched').length;
  const resolvedCalls = calls.filter(c => c.status === 'resolved').length;
  const criticalCalls = calls.filter(c => c.priority === 'critical').length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medical': return <Heart className="w-5 h-5" />;
      case 'fire': return <Flame className="w-5 h-5" />;
      case 'police': return <Shield className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'medical': return 'bg-red-600';
      case 'fire': return 'bg-orange-600';
      case 'police': return 'bg-blue-600';
      default: return 'bg-slate-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-900/30 border-red-600 text-red-400';
      case 'high': return 'bg-orange-900/30 border-orange-600 text-orange-400';
      case 'medium': return 'bg-yellow-900/30 border-yellow-600 text-yellow-400';
      case 'low': return 'bg-blue-900/30 border-blue-600 text-blue-400';
      default: return 'bg-slate-700 border-slate-600 text-slate-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-900/30 border-red-600 text-red-400';
      case 'dispatched': return 'bg-yellow-900/30 border-yellow-600 text-yellow-400';
      case 'resolved': return 'bg-green-900/30 border-green-600 text-green-400';
      default: return 'bg-slate-700 border-slate-600 text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <AlertCircle className="w-4 h-4" />;
      case 'dispatched': return <Activity className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <Phone className="w-8 h-8 text-white" />
            <TrendingUp className="w-5 h-5 text-red-200" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{activeCalls}</div>
          <p className="text-red-100 text-sm">Active Calls</p>
          <p className="text-red-200 text-xs mt-1">Awaiting dispatch</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <Activity className="w-8 h-8 text-white" />
            <TrendingUp className="w-5 h-5 text-yellow-200" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{dispatchedCalls}</div>
          <p className="text-yellow-100 text-sm">Dispatched</p>
          <p className="text-yellow-200 text-xs mt-1">Units en route</p>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle className="w-8 h-8 text-white" />
            <TrendingUp className="w-5 h-5 text-green-200" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{resolvedCalls}</div>
          <p className="text-green-100 text-sm">Resolved</p>
          <p className="text-green-200 text-xs mt-1">Last hour</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <AlertCircle className="w-8 h-8 text-white animate-pulse" />
            <TrendingUp className="w-5 h-5 text-purple-200" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{criticalCalls}</div>
          <p className="text-purple-100 text-sm">Critical</p>
          <p className="text-purple-200 text-xs mt-1">Immediate attention</p>
        </div>
      </div>

      {/* Recent Calls */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          Recent 911 Calls
        </h2>

        <div className="space-y-3">
          {calls.map((call) => (
            <div
              key={call.id}
              className={`rounded-lg border-2 p-4 transition-all ${getPriorityColor(call.priority)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`${getTypeColor(call.type)} p-2 rounded-lg text-white`}>
                    {getTypeIcon(call.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white">{call.id}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${getPriorityColor(call.priority)}`}>
                        {call.priority}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 capitalize">{call.type} Emergency</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(call.status)}`}>
                    {getStatusIcon(call.status)}
                    <span className="uppercase">{call.status}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{call.time}</p>
                </div>
              </div>

              <div className="space-y-1 mb-3">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{call.location}</span>
                </div>
                <p className="text-sm text-slate-300 pl-6">{call.description}</p>
              </div>

              {call.status === 'active' && (
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm">
                  Dispatch Units
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-400" />
          System Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-semibold">Phone System</span>
            </div>
            <p className="text-sm text-slate-400">Online - All lines operational</p>
          </div>

          <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-semibold">CAD System</span>
            </div>
            <p className="text-sm text-slate-400">Online - Real-time sync active</p>
          </div>

          <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-semibold">Radio Network</span>
            </div>
            <p className="text-sm text-slate-400">Online - Strong signal</p>
          </div>
        </div>
      </div>
    </div>
  );
}